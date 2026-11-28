// API du portfolio : compteur de visites + classement du lancer de paniers.
// Node 18+, aucune dépendance. En production, Nginx sert les fichiers statiques
// et transmet /api/ à ce serveur (voir ops/nginx/portfolio.conf.template).
//
// Variables d'environnement :
//   PORT        port d'écoute (défaut 3007), toujours sur 127.0.0.1
//   DATA_DIR    dossier des fichiers JSON (défaut ./data à côté de ce fichier)
//   STATIC_DIR  (local uniquement) dossier du site à servir pour tester sans Nginx
import http from 'node:http';
import { promises as fs, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { createHash, randomBytes } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 3007);
const DATA_DIR = path.resolve(process.env.DATA_DIR || path.join(HERE, 'data'));
const STATIC_DIR = process.env.STATIC_DIR ? path.resolve(process.env.STATIC_DIR) : null;
if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });

const VISITS_FILE = path.join(DATA_DIR, 'visits.json');
const SCORES_FILE = path.join(DATA_DIR, 'scores.json');
const SALT_FILE = path.join(DATA_DIR, '.salt');

function readJson(file, fallback) {
  try { return JSON.parse(readFileSync(file, 'utf8')); } catch { return fallback; }
}
// Sel secret propre au serveur : les identifiants de visiteurs ne sont jamais stockés en clair.
let SALT = '';
try { SALT = readFileSync(SALT_FILE, 'utf8').trim(); } catch {}
if (!SALT) { SALT = randomBytes(24).toString('hex'); await fs.writeFile(SALT_FILE, SALT, { mode: 0o600 }); }

let visits = readJson(VISITS_FILE, { total: 0, visitors: 0, seen: {}, days: {} });
let scores = readJson(SCORES_FILE, []);

// Écriture atomique (fichier temporaire puis renommage), regroupée pour limiter les accès disque.
const pending = new Map();
function save(file, data) {
  clearTimeout(pending.get(file));
  pending.set(file, setTimeout(async () => {
    const tmp = file + '.tmp';
    try { await fs.writeFile(tmp, JSON.stringify(data)); await fs.rename(tmp, file); }
    catch (e) { console.error('Écriture impossible', file, e.message); }
  }, 300));
}

const today = () => new Date().toISOString().slice(0, 10);
const hash = s => createHash('sha256').update(SALT + s).digest('hex').slice(0, 20);
const isBot = ua => !ua || /bot|crawl|spider|slurp|preview|monitor|curl|wget|headless|lighthouse/i.test(ua);

function pruneDays() {
  const keys = Object.keys(visits.days).sort();
  while (keys.length > 120) delete visits.days[keys.shift()];
}
function stats() {
  const d = visits.days[today()] || { views: 0, ids: [] };
  return { total: visits.total, visitors: visits.visitors, today: d.views, visitorsToday: d.ids.length };
}

// Limite simple : une visite comptée par appareil toutes les 30 minutes, 30 requêtes par minute et par IP.
const lastCount = new Map(), hits = new Map();
setInterval(() => { lastCount.clear(); hits.clear(); }, 60 * 60 * 1000).unref();
function tooMany(ip) {
  const now = Date.now(), h = hits.get(ip) || { n: 0, t: now };
  if (now - h.t > 60000) { h.n = 0; h.t = now; }
  h.n++; hits.set(ip, h); return h.n > 30;
}

function send(res, status, body, extra = {}) {
  const data = JSON.stringify(body);
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff', ...extra });
  res.end(data);
}
function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0, buf = '';
    req.on('data', c => { size += c.length; if (size > 2048) { reject(new Error('trop gros')); req.destroy(); } else buf += c; });
    req.on('end', () => { try { resolve(buf ? JSON.parse(buf) : {}); } catch { reject(new Error('JSON invalide')); } });
    req.on('error', reject);
  });
}
const clientIp = req => String(req.headers['x-real-ip'] || req.socket.remoteAddress || '');

async function handleVisits(req, res) {
  if (req.method === 'GET') return send(res, 200, stats());
  if (req.method !== 'POST') return send(res, 405, { error: 'Méthode non autorisée' });
  const ua = String(req.headers['user-agent'] || ''), ip = clientIp(req);
  if (tooMany(ip)) return send(res, 429, { error: 'Trop de requêtes' });
  let body = {};
  try { body = await readBody(req); } catch (e) { return send(res, 400, { error: e.message }); }
  if (isBot(ua)) return send(res, 200, stats());
  const vid = /^[a-z0-9-]{8,64}$/i.test(String(body.vid || '')) ? String(body.vid) : ip + ua;
  const id = hash(vid), now = Date.now();
  if (now - (lastCount.get(id) || 0) > 30 * 60 * 1000) {
    lastCount.set(id, now);
    const d = visits.days[today()] || (visits.days[today()] = { views: 0, ids: [] });
    visits.total++; d.views++;
    if (!d.ids.includes(id)) d.ids.push(id);
    if (!visits.seen[id]) { visits.seen[id] = 1; visits.visitors++; }
    pruneDays(); save(VISITS_FILE, visits);
  }
  return send(res, 200, stats());
}

async function handleScores(req, res) {
  if (req.method === 'GET') return send(res, 200, scores);
  if (req.method !== 'POST') return send(res, 405, { error: 'Méthode non autorisée' });
  if (tooMany(clientIp(req))) return send(res, 429, { error: 'Trop de requêtes' });
  let body;
  try { body = await readBody(req); } catch (e) { return send(res, 400, { error: e.message }); }
  const name = String(body.name ?? '').replace(/[^\p{L}\p{N} _.-]/gu, '').trim().slice(0, 12) || 'Anonyme';
  const score = Math.floor(Number(body.score));
  if (!Number.isFinite(score) || score < 1 || score > 99) return send(res, 400, { error: 'Score invalide' });
  scores.push({ name, score, date: today() });
  scores.sort((a, b) => b.score - a.score || a.date.localeCompare(b.date));
  scores = scores.slice(0, 10);
  save(SCORES_FILE, scores);
  return send(res, 200, scores);
}

// Fichiers statiques : uniquement pour les tests en local (en production, c'est Nginx).
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.pdf': 'application/pdf', '.json': 'application/json', '.woff2': 'font/woff2', '.ico': 'image/x-icon' };
async function serveStatic(req, res) {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const file = path.join(STATIC_DIR, p);
  if (!file.startsWith(STATIC_DIR + path.sep)) { res.writeHead(403); return res.end(); }
  try { const data = await fs.readFile(file); res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' }); res.end(data); }
  catch { res.writeHead(404); res.end('Introuvable'); }
}

const server = http.createServer(async (req, res) => {
  try {
    const p = new URL(req.url, 'http://x').pathname;
    if (p === '/api/health') return send(res, 200, { ok: true });
    if (p === '/api/visits') return await handleVisits(req, res);
    if (p === '/api/scores') return await handleScores(req, res);
    if (p.startsWith('/api/')) return send(res, 404, { error: 'Route inconnue' });
    if (STATIC_DIR) return await serveStatic(req, res);
    send(res, 404, { error: 'Introuvable' });
  } catch (e) { console.error(e); send(res, 500, { error: 'Erreur serveur' }); }
});
server.listen(PORT, '127.0.0.1', () => console.log(`API du portfolio sur http://127.0.0.1:${PORT} (données : ${DATA_DIR})`));
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => { server.close(); setTimeout(() => process.exit(0), 400); });
