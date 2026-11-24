/* Portfolio de Jordy — mini-map explorable.
   Canvas 2D sans dépendance. Contenu : js/data.js */
(function () {
'use strict';

const Z = window.ZONES, icon = window.icon;
const $ = s => document.querySelector(s);
const W = 2600, H = 1700;
const PLAZA = { x: 1300, y: 860, r: 150 };
const EMAIL = 'briangboko33@gmail.com';
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const TAU = Math.PI * 2;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/* ───────── DOM ───────── */
const cv = $('#map');
let ctx = cv.getContext('2d');
const mini = $('#mini'), mctx = mini.getContext('2d');
const el = {
  panel: $('#panel'), body: $('#panelBody'), ico: $('#panelIco'), eyebrow: $('#panelEyebrow'), title: $('#panelTitle'),
  next: $('#panelNext'), prompt: $('#prompt'), act: $('#btnAct'), menu: $('#menu'), menuList: $('#menuList'),
  classic: $('#classic'), intro: $('#intro'), toast: $('#toast'), fade: $('#fade'),
  progBar: $('#progBar'), progTxt: $('#progTxt')
};
$('#btnMenu').innerHTML = icon('map', 18) + '<span class="lbl">Carte</span>';
$('#btnClassic').innerHTML = icon('file', 18) + '<span class="lbl">Version CV</span>';
$('#classicClose').innerHTML = icon('map', 18) + '<span class="lbl">Retour à la carte</span>';
$('#panelClose').innerHTML = icon('x', 18);
$('#menuClose').innerHTML = icon('x', 18);

const isTouch = matchMedia('(pointer: coarse)').matches;
if (isTouch) document.body.classList.add('touch');

/* ───────── État ───────── */
const S = {
  px: 1300, py: 950, fa: Math.PI / 2, vx: 0, vy: 0, walk: 0, t: 0, shift: 0,
  cam: { x: 0, y: 0 }, near: null, guide: null, idle: 0,
  introOpen: true, panelOpen: null, classicOpen: false, finale: false,
  visited: new Set(), dust: [], spd: 0
};
try { JSON.parse(localStorage.getItem('jb-visited') || '[]').forEach(id => S.visited.add(id)); } catch (e) {}
const byId = Object.fromEntries(Z.map(z => [z.id, z]));
const paused = () => S.introOpen || S.panelOpen || S.classicOpen;

let vw = 0, vh = 0, dpr = 1, zoom = 1;
function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  vw = innerWidth; vh = innerHeight;
  cv.width = vw * dpr; cv.height = vh * dpr;
  zoom = clamp(vw / 1300, 0.78, 1.2);
}
addEventListener('resize', resize); resize();

/* ───────── Outils ───────── */
function rnd(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function hex(c) { c = c.replace('#', ''); return [parseInt(c.substr(0, 2), 16), parseInt(c.substr(2, 2), 16), parseInt(c.substr(4, 2), 16)]; }
function mix(c, t, a) { const [r, g, b] = hex(c), [R, G, B] = hex(t); return `rgb(${r + (R - r) * a | 0},${g + (G - g) * a | 0},${b + (B - b) * a | 0})`; }
const dark = (c, a = .3) => mix(c, '#000000', a);
const light = (c, a = .3) => mix(c, '#ffffff', a);
function rr(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
function ell(x, y, rx, ry) { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, TAU); }
function segDist(px, py, a, b) {
  const dx = b[0] - a[0], dy = b[1] - a[1], l = dx * dx + dy * dy || 1;
  const t = clamp(((px - a[0]) * dx + (py - a[1]) * dy) / l, 0, 1);
  return Math.hypot(px - (a[0] + dx * t), py - (a[1] + dy * t));
}

/* ───────── Monde statique ───────── */
const PATHS = [
  [[1300, 860], [450, 860]],
  [[1300, 692], [1300, 860]],
  [[1300, 860], [1700, 860], [1700, 700], [1970, 700], [1970, 632]],
  [[1700, 860], [1700, 1380], [1900, 1380]],
  [[1700, 990], [2030, 990], [2030, 932]],
  [[570, 632], [570, 860]],
  [[450, 860], [450, 1216], [670, 1216], [670, 1182]],
  [[1300, 860], [1300, 1100], [1150, 1100], [1150, 1422], [1380, 1422], [1380, 1362]],
  [[905, 832], [905, 860]]
];
const NAME_RECT = { x: 1330, y: 905, w: 360, h: 195 };
const BOARD = { x: 2418, y: 1290, w: 150, h: 200 };
const PONDS = [{ x: 950, y: 300, rx: 170, ry: 80 }, { x: 2340, y: 1010, rx: 85, ry: 55 }];
const solids = [];

function nearPath(x, y, d) {
  for (const p of PATHS) for (let i = 0; i < p.length - 1; i++) if (segDist(x, y, p[i], p[i + 1]) < d) return true;
  return false;
}
function inZones(x, y, pad) {
  for (const z of Z) if (x > z.x - pad && x < z.x + z.w + pad && y > z.y - z.top - pad && y < z.y + z.h + pad + 50) return true;
  return false;
}
function inPond(x, y, pad) { return PONDS.some(p => ((x - p.x) / (p.rx + pad)) ** 2 + ((y - p.y) / (p.ry + pad)) ** 2 < 1); }
function inRects(x, y, pad) {
  return [NAME_RECT, BOARD].some(r => x > r.x - pad && x < r.x + r.w + pad && y > r.y - pad && y < r.y + r.h + pad);
}
function freeSpot(x, y, pad, pathD) {
  return !inRects(x, y, pad) && !inZones(x, y, pad) && !nearPath(x, y, pathD) && !inPond(x, y, pad) && Math.hypot(x - PLAZA.x, y - PLAZA.y) > PLAZA.r + 50 && Math.hypot(x - 1300, y - 950) > 90;
}

Z.forEach(z => {
  if (z.type === 'court') {
    const cy = z.y + z.h / 2;
    solids.push({ k: 'c', x: z.x + 38, y: cy, r: 8 }, { k: 'c', x: z.x + z.w - 38, y: cy, r: 8 });
  } else solids.push({ k: 'r', x: z.x, y: z.y - z.top, w: z.w, h: z.h + z.top });
});
PONDS.forEach(p => solids.push({ k: 'e', x: p.x, y: p.y, rx: p.rx - 10, ry: p.ry - 8 }));
solids.push({ k: 'c', x: PLAZA.x, y: PLAZA.y, r: 48 });

const ents = [];           // entités triées en profondeur
const lamps = [];
const flora = [];          // décor sans collision
{
  const r = rnd(2026);
  const trees = [];
  const addTree = (x, y) => {
    const o = { type: r() < .3 ? 'palm' : 'round', x, y, s: .85 + r() * .5, ph: r() * 6, lean: (r() - .5) * 26 };
    trees.push(o); solids.push({ k: 'c', x, y, r: 10 });
    ents.push({ y, x0: x - 70, x1: x + 70, y0: y - 150, y1: y + 20, draw: () => drawTree(o) });
  };
  let tries = 0;
  while (trees.length < 150 && tries++ < 4000) {
    const x = 60 + r() * (W - 120), y = 60 + r() * (H - 120);
    if (!freeSpot(x, y, 46, 62)) continue;
    if (trees.some(t => Math.hypot(t.x - x, t.y - y) < 78)) continue;
    addTree(x, y);
  }
  for (let x = 20; x < W; x += 58) { addTree(x + r() * 20, 22 + r() * 18); addTree(x + r() * 20, H - 24 - r() * 18); }
  for (let y = 80; y < H - 40; y += 58) { addTree(22 + r() * 18, y + r() * 20); addTree(W - 24 - r() * 18, y + r() * 20); }
  tries = 0;
  while (flora.length < 190 && tries++ < 4000) {
    const x = 50 + r() * (W - 100), y = 50 + r() * (H - 100);
    if (!freeSpot(x, y, 30, 38)) continue;
    flora.push({ x, y, k: r() < .45 ? 'bush' : 'flower', c: ['#ff6f91', '#ffd166', '#fff', '#c9a0ff'][r() * 4 | 0], s: .7 + r() * .7 });
  }
  flora.forEach(f => ents.push({ y: f.y, x0: f.x - 30, x1: f.x + 30, y0: f.y - 30, y1: f.y + 10, draw: () => drawFlora(f) }));

  // lampadaires le long des routes principales
  [PATHS[0], PATHS[2], PATHS[7]].forEach(p => {
    for (let i = 0; i < p.length - 1; i++) {
      const a = p[i], b = p[i + 1], len = Math.hypot(b[0] - a[0], b[1] - a[1]);
      const nx = -(b[1] - a[1]) / len, ny = (b[0] - a[0]) / len;
      for (let d = 160, s = 1; d < len - 60; d += 230, s = -s) {
        const x = a[0] + (b[0] - a[0]) * d / len + nx * 42 * s, y = a[1] + (b[1] - a[1]) * d / len + ny * 42 * s;
        if (Math.hypot(x - PLAZA.x, y - PLAZA.y) < PLAZA.r + 30 || inZones(x, y, 20)) continue;
        solids.push({ k: 'c', x, y, r: 6 }); lamps.push({ x, y });
        ents.push({ y, x0: x - 50, x1: x + 50, y0: y - 100, y1: y + 10, draw: () => drawLamp(x, y) });
      }
    }
  });
}
Z.forEach(z => {
  const draw = () => drawBuilding(z);
  ents.push({ y: z.type === 'court' ? -1e9 : z.y + z.h, x0: z.x - 80, x1: z.x + z.w + 80, y0: z.y - z.top - 100, y1: z.y + z.h + 40, draw, ground: z.type === 'court' });
});
ents.push({ y: PLAZA.y + 44, x0: PLAZA.x - 90, x1: PLAZA.x + 90, y0: PLAZA.y - 110, y1: PLAZA.y + 70, draw: drawFountain });
const courtZ = byId.interests;
const ball = { x: courtZ.x + courtZ.w / 2, y: courtZ.y + courtZ.h / 2 - 50, vx: 0, vy: 0 };
solids.push({ k: 'r', x: BOARD.x, y: BOARD.y, w: BOARD.w, h: BOARD.h });
ents.push({ y: BOARD.y + BOARD.h, x0: BOARD.x - 30, x1: BOARD.x + BOARD.w + 30, y0: BOARD.y - 20, y1: BOARD.y + BOARD.h + 30, draw: () => drawBoard() });

/* ───────── Dessin : décor ───────── */
let grass = null;
function makeGrass() {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const g = c.getContext('2d'), r = rnd(7);
  g.fillStyle = '#50a964'; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 240; i++) { g.fillStyle = `rgba(${r() < .5 ? '255,255,255' : '0,60,20'},${.04 + r() * .06})`; g.beginPath(); g.arc(r() * 256, r() * 256, 6 + r() * 22, 0, TAU); g.fill(); }
  for (let i = 0; i < 480; i++) { g.strokeStyle = r() < .5 ? '#3f9657' : '#6bc47f'; g.lineWidth = 1.2; const x = r() * 256, y = r() * 256; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (r() - .5) * 4, y - 3 - r() * 5); g.stroke(); }
  return ctx.createPattern(c, 'repeat');
}

function drawGround(t) {
  if (!grass) grass = makeGrass();
  ctx.fillStyle = grass; ctx.fillRect(0, 0, W, H);
  // étangs
  PONDS.forEach(p => {
    ell(p.x, p.y + 6, p.rx + 16, p.ry + 14); ctx.fillStyle = '#d8c48d'; ctx.fill();
    ell(p.x, p.y, p.rx, p.ry); ctx.fillStyle = '#35a2d9'; ctx.fill();
    ell(p.x - 12, p.y - 8, p.rx * .78, p.ry * .62); ctx.fillStyle = '#58bdea'; ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) { const k = (t * .25 + i / 3) % 1; ctx.globalAlpha = 1 - k; ell(p.x + (i - 1) * p.rx * .3, p.y + (i % 2 ? 10 : -8), 8 + k * 36, 3 + k * 12); ctx.stroke(); }
    ctx.globalAlpha = 1;
  });
  // routes
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  [['#c4b184', 58], ['#e8dab6', 48]].forEach(([c, w]) => { ctx.strokeStyle = c; ctx.lineWidth = w; PATHS.forEach(p => { ctx.beginPath(); ctx.moveTo(...p[0]); p.slice(1).forEach(q => ctx.lineTo(...q)); ctx.stroke(); }); });
  ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 3; ctx.setLineDash([2, 16]);
  PATHS.forEach(p => { ctx.beginPath(); ctx.moveTo(...p[0]); p.slice(1).forEach(q => ctx.lineTo(...q)); ctx.stroke(); });
  ctx.setLineDash([]);
  // place centrale
  ctx.beginPath(); ctx.arc(PLAZA.x, PLAZA.y, PLAZA.r + 8, 0, TAU); ctx.fillStyle = '#c4b184'; ctx.fill();
  ctx.beginPath(); ctx.arc(PLAZA.x, PLAZA.y, PLAZA.r, 0, TAU); ctx.fillStyle = '#eadfc2'; ctx.fill();
  ctx.strokeStyle = 'rgba(160,140,95,.5)'; ctx.lineWidth = 2;
  for (let i = 0; i < 12; i++) { const a = i * TAU / 12; ctx.beginPath(); ctx.moveTo(PLAZA.x + Math.cos(a) * 62, PLAZA.y + Math.sin(a) * 62); ctx.lineTo(PLAZA.x + Math.cos(a) * PLAZA.r, PLAZA.y + Math.sin(a) * PLAZA.r); ctx.stroke(); }
  [70, 112].forEach(r => { ctx.beginPath(); ctx.arc(PLAZA.x, PLAZA.y, r, 0, TAU); ctx.stroke(); });
  ctx.font = '800 15px Sora, system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(120,98,60,.75)';
  ctx.fillText('BIENVENUE', PLAZA.x, PLAZA.y + 126);
  drawNameSign();
  // lueur des portes
  Z.forEach(z => {
    if (z.type === 'court') return;
    const near = S.near === z, pulse = .5 + .5 * Math.sin(t * 3 + z.x);
    const a = near ? .75 : S.visited.has(z.id) ? .25 : .35 + pulse * .25;
    ctx.save(); ctx.globalAlpha = a; ell(z.door[0], z.door[1] - 8, 54 + (near ? 10 : pulse * 6), 22); ctx.fillStyle = z.color; ctx.fill();
    ctx.globalAlpha = 1; ctx.lineWidth = 3; ctx.strokeStyle = '#fff'; ell(z.door[0], z.door[1] - 8, 40, 15); ctx.stroke(); ctx.restore();
  });
}

function drawTree(o) {
  const t = S.t, sw = reduce ? 0 : Math.sin(t * 1.3 + o.ph) * 2.2, x = o.x, y = o.y, s = o.s;
  ctx.fillStyle = 'rgba(0,0,0,.2)'; ell(x + 10, y + 3, 30 * s, 10 * s); ctx.fill();
  if (o.type === 'palm') {
    const tx = x + o.lean, ty = y - 92 * s;
    ctx.strokeStyle = '#8a5a34'; ctx.lineWidth = 9 * s; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + o.lean * .2, y - 50 * s, tx + sw, ty); ctx.stroke();
    ctx.strokeStyle = '#a77747'; ctx.lineWidth = 2;
    for (let i = 1; i < 6; i++) { const k = i / 6; ctx.beginPath(); ctx.moveTo(x + o.lean * .12 * k - 5, y - 92 * s * k); ctx.lineTo(x + o.lean * .12 * k + 5, y - 92 * s * k); ctx.stroke(); }
    for (let i = 0; i < 8; i++) {
      const a = i * TAU / 8 + .2, len = 52 * s, ex = tx + sw + Math.cos(a) * len, ey = ty + Math.sin(a) * len * .5 + 14 * s * Math.abs(Math.sin(a));
      ctx.fillStyle = i % 2 ? '#2f9a55' : '#3fb468';
      ctx.beginPath(); ctx.moveTo(tx + sw, ty); ctx.quadraticCurveTo((tx + ex) / 2 + sw, ty - 22 * s + (ey - ty) * .2, ex, ey); ctx.quadraticCurveTo((tx + ex) / 2 + sw, ty - 4 * s + (ey - ty) * .5, tx + sw, ty); ctx.fill();
    }
    ctx.fillStyle = '#7a4a22'; [[-5, 4], [5, 5]].forEach(([dx, dy]) => { ctx.beginPath(); ctx.arc(tx + sw + dx, ty + dy, 4.5 * s, 0, TAU); ctx.fill(); });
  } else {
    ctx.fillStyle = '#7a5230'; ctx.fillRect(x - 5 * s, y - 34 * s, 10 * s, 36 * s);
    const cy = y - 62 * s;
    [['#2f8d4e', -22, 8, 30], ['#2f8d4e', 22, 8, 30], ['#38a05a', 0, -2, 38], ['#4cba6c', -6, -12, 24]].forEach(([c, dx, dy, r]) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x + dx * s + sw, cy + dy * s, r * s, 0, TAU); ctx.fill(); });
    ctx.fillStyle = 'rgba(255,255,255,.14)'; ctx.beginPath(); ctx.arc(x - 10 * s + sw, cy - 16 * s, 12 * s, 0, TAU); ctx.fill();
  }
}
function drawFlora(f) {
  if (f.k === 'bush') {
    ctx.fillStyle = 'rgba(0,0,0,.15)'; ell(f.x + 4, f.y + 3, 18 * f.s, 6 * f.s); ctx.fill();
    ['#2f8d4e', '#3fa75f', '#4cba6c'].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(f.x + (i - 1) * 10 * f.s, f.y - 6 * f.s - (i === 1 ? 5 : 0), 11 * f.s, 0, TAU); ctx.fill(); });
    ctx.fillStyle = f.c; [[-8, -10], [4, -16], [10, -6]].forEach(([dx, dy]) => { ctx.beginPath(); ctx.arc(f.x + dx * f.s, f.y + dy * f.s, 2.6, 0, TAU); ctx.fill(); });
  } else {
    ctx.strokeStyle = '#2f8d4e'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(f.x, f.y); ctx.lineTo(f.x, f.y - 9 * f.s); ctx.stroke();
    ctx.fillStyle = f.c; ctx.beginPath(); ctx.arc(f.x, f.y - 11 * f.s, 4.5 * f.s, 0, TAU); ctx.fill();
    ctx.fillStyle = '#ffd166'; ctx.beginPath(); ctx.arc(f.x, f.y - 11 * f.s, 1.8, 0, TAU); ctx.fill();
  }
}
function drawLamp(x, y) {
  ctx.fillStyle = 'rgba(0,0,0,.2)'; ell(x + 5, y + 2, 10, 4); ctx.fill();
  ctx.fillStyle = '#34415a'; ctx.fillRect(x - 2.5, y - 62, 5, 64);
  ctx.beginPath(); ctx.arc(x, y - 64, 8, 0, TAU); ctx.fillStyle = '#ffe9a8'; ctx.fill();
  const g = ctx.createRadialGradient(x, y - 64, 2, x, y - 64, 60); g.addColorStop(0, 'rgba(255,225,140,.35)'); g.addColorStop(1, 'rgba(255,225,140,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y - 64, 60, 0, TAU); ctx.fill();
}
function drawFountain() {
  const x = PLAZA.x, y = PLAZA.y, t = S.t;
  ctx.fillStyle = 'rgba(0,0,0,.18)'; ell(x + 8, y + 8, 64, 30); ctx.fill();
  ell(x, y + 6, 58, 30); ctx.fillStyle = '#b9b3a3'; ctx.fill();
  ell(x, y, 58, 30); ctx.fillStyle = '#d6d0c0'; ctx.fill();
  ell(x, y, 46, 22); ctx.fillStyle = '#38a9e0'; ctx.fill();
  ell(x - 6, y - 3, 30, 13); ctx.fillStyle = '#62c4f0'; ctx.fill();
  ctx.fillStyle = '#cfc9b8'; ctx.fillRect(x - 6, y - 52, 12, 52);
  ell(x, y - 52, 14, 6); ctx.fillStyle = '#e1dccd'; ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.85)';
  for (let i = 0; i < 8; i++) for (let k = 0; k < 5; k++) {
    const p = ((reduce ? 0 : t * .9) + k / 5 + i * .11) % 1, a = i * TAU / 8;
    ctx.globalAlpha = 1 - p;
    ctx.beginPath(); ctx.arc(x + Math.cos(a) * p * 30, y - 54 + (-4 * p * (1 - p)) * 50 + p * p * 56, 2.6 * (1 - p * .5), 0, TAU); ctx.fill();
  }
  ctx.globalAlpha = 1;
}

/* ───────── Dessin : bâtiments ───────── */
function shadow(z) { ctx.fillStyle = 'rgba(0,0,0,.22)'; ell(z.x + z.w / 2 + 14, z.y + z.h + 2, z.w / 2 + 26, 17); ctx.fill(); }
function win(x, y, w, h, lit) {
  ctx.fillStyle = '#2b3a55'; rr(x - 3, y - 3, w + 6, h + 6, 4); ctx.fill();
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  if (lit) { g.addColorStop(0, '#ffe9a3'); g.addColorStop(1, '#ffc766'); } else { g.addColorStop(0, '#a9dcf5'); g.addColorStop(1, '#6fb6dd'); }
  ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.beginPath(); ctx.moveTo(x, y + h); ctx.lineTo(x + w * .45, y); ctx.lineTo(x + w * .7, y); ctx.lineTo(x + w * .25, y + h); ctx.fill();
}
function door(cx, by, w, h, c, arch) {
  ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(cx - w / 2, by); ctx.lineTo(cx - w / 2, by - h + (arch ? w / 2 : 0));
  if (arch) ctx.arc(cx, by - h + w / 2, w / 2, Math.PI, 0); else ctx.lineTo(cx + w / 2, by - h);
  ctx.lineTo(cx + w / 2, by); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.beginPath(); ctx.arc(cx + w / 2 - 7, by - h / 2, 2.4, 0, TAU); ctx.fill();
}
function sign(text, cx, cy, w, bg, fg, size = 12) {
  ctx.fillStyle = bg; rr(cx - w / 2, cy - 13, w, 26, 7); ctx.fill();
  ctx.font = `800 ${size}px Sora, system-ui, sans-serif`; ctx.textAlign = 'center'; ctx.fillStyle = fg; ctx.fillText(text, cx, cy + size * .35);
}

function drawBuilding(z) {
  ({ house, tower, lab, gallery, school, post, studio, court })[z.type](z);
}

function house(z) {
  const { x, y, w, h } = z, t = S.t; shadow(z);
  ctx.fillStyle = '#9c8466'; ctx.fillRect(x + w * .7, y - 70, 24, 56);
  ctx.fillStyle = '#f4e7cf'; rr(x, y, w, h, 6); ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,.07)'; ctx.fillRect(x, y + h - 26, w, 26);
  ctx.fillStyle = '#c4572f'; ctx.beginPath(); ctx.moveTo(x - 20, y + 6); ctx.lineTo(x + w / 2, y - 80); ctx.lineTo(x + w + 20, y + 6); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#a9461f'; ctx.beginPath(); ctx.moveTo(x + w / 2, y - 80); ctx.lineTo(x + w + 20, y + 6); ctx.lineTo(x + w / 2, y + 6); ctx.fill();
  ctx.fillStyle = '#8c3a19'; ctx.fillRect(x - 20, y + 2, w + 40, 8);
  ctx.fillStyle = '#9c8466'; ctx.fillRect(x + w * .7 - 3, y - 74, 30, 8);
  ctx.fillStyle = 'rgba(255,255,255,.85)';
  if (!reduce) for (let i = 0; i < 4; i++) { const k = (t * .35 + i / 4) % 1; ctx.globalAlpha = .6 * (1 - k); ctx.beginPath(); ctx.arc(x + w * .7 + 12 + Math.sin(k * 6 + i) * 6, y - 78 - k * 50, 6 + k * 10, 0, TAU); ctx.fill(); }
  ctx.globalAlpha = 1;
  win(x + 30, y + 40, 52, 56, true); win(x + w - 82, y + 40, 52, 56, true);
  door(x + w / 2, y + h, 44, 74, '#7a4a22', true);
  ctx.fillStyle = '#c4572f'; ctx.fillRect(x + 28, y + 100, 56, 10); ctx.fillRect(x + w - 84, y + 100, 56, 10);
  ['#ff6f91', '#ffd166', '#ff9a4d'].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x + 38 + i * 18, y + 98, 5, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(x + w - 76 + i * 18, y + 98, 5, 0, TAU); ctx.fill(); });
  ctx.fillStyle = '#fff'; rr(x + w / 2 - 22, y - 34, 44, 28, 5); ctx.fill();
  ctx.fillStyle = z.color; ctx.font = '800 15px Sora, sans-serif'; ctx.textAlign = 'center'; ctx.fillText('JB', x + w / 2, y - 14);
}

function tower(z) {
  const { x, y, w, h } = z, t = S.t; shadow(z);
  ctx.fillStyle = '#3a5683'; rr(x, y, w, h, 8); ctx.fill();
  ctx.fillStyle = '#2b4268'; ctx.fillRect(x + w - 26, y + 6, 26, h - 6);
  ctx.fillStyle = '#243b5e'; rr(x - 8, y - 16, w + 16, 22, 6); ctx.fill();
  ctx.fillStyle = '#1b2d4a'; ctx.fillRect(x + w / 2 - 3, y - 62, 6, 48);
  ctx.fillStyle = Math.sin(t * 4) > 0 ? '#ff4d5e' : '#7a2630'; ctx.beginPath(); ctx.arc(x + w / 2, y - 64, 5, 0, TAU); ctx.fill();
  const cols = 4, rows = Math.floor((h - 130) / 48), gx = (w - 26 - cols * 34) / (cols + 1);
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const hsh = Math.sin(r * 12.9 + c * 78.2) * 43758.5, lit = (hsh - Math.floor(hsh)) > .42 || (r * cols + c === 3 && Math.sin(t * 2) > 0);
    win(x + gx + c * (34 + gx), y + 24 + r * 48, 34, 26, lit);
  }
  sign('SOUTHLAND', x + w / 2, y + h - 96, w - 30, '#0f1c33', '#7fb8ff', 13);
  ctx.fillStyle = '#9cd7f0'; rr(x + w / 2 - 28, y + h - 64, 56, 64, [8, 8, 0, 0]); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(x + w / 2 - 1, y + h - 64, 2, 64);
  ctx.fillStyle = '#243b5e'; ctx.fillRect(x + w / 2 - 40, y + h - 4, 80, 6);
}

function lab(z) {
  const { x, y, w, h } = z, t = S.t; shadow(z);
  ctx.fillStyle = '#12423f'; rr(x, y, w, h, 10); ctx.fill();
  ctx.fillStyle = '#0d312f'; ctx.fillRect(x, y + h - 22, w, 22);
  const g = ctx.createLinearGradient(0, y - 74, 0, y); g.addColorStop(0, '#29a898'); g.addColorStop(1, '#1d6b64');
  ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x + w / 2, y + 4, w * .42, 74, 0, Math.PI, 0); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.22)'; ctx.beginPath(); ctx.ellipse(x + w / 2 - 30, y - 30, 28, 14, -.5, 0, TAU); ctx.fill();
  ctx.fillStyle = '#0d312f'; ctx.fillRect(x + w / 2 - 3, y - 98, 6, 28); ctx.fillStyle = '#2fd3b5'; ctx.beginPath(); ctx.arc(x + w / 2, y - 100, 5, 0, TAU); ctx.fill();
  for (let i = 0; i < 3; i++) {
    const mx = x + 22 + i * ((w - 44 - 70) / 2), my = y + 28;
    ctx.fillStyle = '#243238'; rr(mx - 4, my - 4, 78, 62, 6); ctx.fill();
    ctx.fillStyle = '#06191c'; ctx.fillRect(mx, my, 70, 48);
    ['#2fd3b5', '#ffb454', '#ff6f91', '#5b9dff'].forEach((c, k) => { ctx.fillStyle = c; const lw = 14 + (Math.sin(t * 1.5 + i * 2 + k * 1.7) * .5 + .5) * 34; ctx.fillRect(mx + 6 + (k % 2) * 8, my + 7 + k * 10, lw, 4); });
  }
  ctx.save(); ctx.shadowColor = '#2fd3b5'; ctx.shadowBlur = 14; sign('</> LABO', x + w / 2, y + h - 62, 108, '#0a2a28', '#5af0d3', 14); ctx.restore();
  door(x + w / 2, y + h, 40, 50, '#0a2a28', false);
  ctx.fillStyle = '#5af0d3'; ctx.fillRect(x + w / 2 - 17, y + h - 47, 34, 3);
}

function gallery(z) {
  const { x, y, w, h } = z; shadow(z);
  ctx.fillStyle = '#fbeaf0'; rr(x, y, w, h, 8); ctx.fill();
  ctx.fillStyle = '#3d3550'; rr(x - 14, y - 22, w + 28, 30, 6); ctx.fill();
  ctx.fillStyle = z.color; ctx.fillRect(x - 14, y + 4, w + 28, 4);
  const frames = [['#ff6f91', '#ffb454'], ['#5b9dff', '#2fd3b5'], ['#b190ff', '#ff6f91'], ['#ffd166', '#ff9a4d']];
  frames.forEach((c, i) => {
    const fx = x + 22 + i * ((w - 44 - 64) / 3) + (i > 1 ? 0 : 0), fy = y + 30;
    if (i === 1 || i === 2) return;
    ctx.fillStyle = '#3d3550'; rr(fx - 5, fy - 5, 74, 84, 4); ctx.fill();
    const g = ctx.createLinearGradient(fx, fy, fx + 64, fy + 74); g.addColorStop(0, c[0]); g.addColorStop(1, c[1]);
    ctx.fillStyle = g; ctx.fillRect(fx, fy, 64, 74);
    ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.beginPath(); ctx.arc(fx + 22, fy + 24, 9, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.moveTo(fx, fy + 74); ctx.lineTo(fx + 26, fy + 44); ctx.lineTo(fx + 44, fy + 62); ctx.lineTo(fx + 54, fy + 52); ctx.lineTo(fx + 64, fy + 74); ctx.fill();
  });
  ctx.fillStyle = '#9cd7f0'; rr(x + w / 2 - 44, y + h - 100, 88, 100, [44, 44, 0, 0]); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.fillRect(x + w / 2 - 1, y + h - 100, 2, 100); ctx.fillRect(x + w / 2 - 44, y + h - 52, 88, 2);
  sign('GALERIE', x + w / 2, y + h - 116, 96, '#3d3550', '#ffb3c6', 13);
  ctx.fillStyle = '#3d3550'; ctx.fillRect(x + w / 2 - 54, y + h - 4, 108, 6);
}

function school(z) {
  const { x, y, w, h } = z, t = S.t; shadow(z);
  ctx.fillStyle = '#f6edd0'; rr(x, y, w, h, 6); ctx.fill();
  ctx.fillStyle = '#e4d3a1'; ctx.beginPath(); ctx.moveTo(x - 14, y + 4); ctx.lineTo(x + w / 2, y - 66); ctx.lineTo(x + w + 14, y + 4); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#cdb87d'; ctx.fillRect(x - 14, y, w + 28, 10);
  ctx.fillStyle = z.color; ctx.beginPath(); ctx.arc(x + w / 2, y - 24, 14, 0, TAU); ctx.fill();
  ctx.fillStyle = '#1b3a1a'; ctx.font = '800 14px Sora, sans-serif'; ctx.textAlign = 'center'; ctx.fillText('A', x + w / 2, y - 19);
  for (let i = 0; i < 5; i++) { const cx = x + 22 + i * ((w - 44 - 14) / 4); ctx.fillStyle = '#fff'; ctx.fillRect(cx, y + 16, 14, h - 36); ctx.fillStyle = 'rgba(0,0,0,.08)'; ctx.fillRect(cx + 9, y + 16, 5, h - 36); ctx.fillStyle = '#ece4cc'; ctx.fillRect(cx - 3, y + 12, 20, 6); ctx.fillRect(cx - 3, y + h - 24, 20, 6); }
  ctx.fillStyle = '#e8dfc2'; ctx.fillRect(x - 6, y + h - 18, w + 12, 9); ctx.fillStyle = '#d9cfae'; ctx.fillRect(x - 14, y + h - 9, w + 28, 9);
  door(x + w / 2, y + h - 18, 40, 66, '#5a3a1c', true);
  const px = x + w + 26;
  ctx.fillStyle = '#9aa3b5'; ctx.fillRect(px - 2, y - 70, 4, h + 70);
  const wv = reduce ? 0 : 1, fw = 54, fh = 38, fy0 = y - 70;
  [['#f77f00', 0], ['#ffffff', 1], ['#009e60', 2]].forEach(([c, k]) => {
    const a = k * fw / 3, b = (k + 1) * fw / 3, n = 6;
    ctx.fillStyle = c; ctx.beginPath();
    for (let i = 0; i <= n; i++) { const X = a + (b - a) * i / n; ctx.lineTo(px + 2 + X, fy0 + Math.sin(t * 4 + X * .15) * 3 * wv); }
    for (let i = n; i >= 0; i--) { const X = a + (b - a) * i / n; ctx.lineTo(px + 2 + X, fy0 + fh + Math.sin(t * 4 + X * .15) * 3 * wv); }
    ctx.closePath(); ctx.fill();
  });
  ctx.fillStyle = '#d4a017'; ctx.beginPath(); ctx.arc(px, y - 72, 4, 0, TAU); ctx.fill();
}

function post(z) {
  const { x, y, w, h } = z; shadow(z);
  ctx.fillStyle = '#e9f4fb'; rr(x, y, w, h, 6); ctx.fill();
  ctx.fillStyle = '#2f7fb8'; ctx.beginPath(); ctx.moveTo(x - 14, y + 4); ctx.lineTo(x + 10, y - 30); ctx.lineTo(x + w - 10, y - 30); ctx.lineTo(x + w + 14, y + 4); ctx.fill();
  ctx.fillStyle = '#256694'; ctx.fillRect(x - 14, y, w + 28, 8);
  ctx.fillStyle = '#fff'; rr(x + w / 2 - 20, y - 22, 40, 24, 4); ctx.fill();
  ctx.strokeStyle = '#2f7fb8'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + w / 2 - 17, y - 19); ctx.lineTo(x + w / 2, y - 8); ctx.lineTo(x + w / 2 + 17, y - 19); ctx.stroke();
  win(x + 16, y + 28, 44, 42, true); door(x + w - 46, y + h, 36, 62, '#1d4f78', false);
  ctx.fillStyle = '#7b8396'; ctx.fillRect(x + w + 14, y + h - 44, 5, 44);
  ctx.fillStyle = '#e8454f'; rr(x + w + 2, y + h - 66, 30, 26, [12, 12, 3, 3]); ctx.fill();
  ctx.fillStyle = '#1b1b1b'; ctx.fillRect(x + w + 8, y + h - 56, 18, 3);
  sign('POSTE', x + 52, y + h + 14, 64, '#2f7fb8', '#fff', 11);
}

function studio(z) {
  const { x, y, w, h } = z; shadow(z);
  ctx.fillStyle = '#5b4a9a'; rr(x, y, w, h, 8); ctx.fill();
  ctx.fillStyle = '#493a82'; ctx.fillRect(x, y + h - 20, w, 20);
  ctx.fillStyle = '#3a2d6b'; rr(x - 10, y - 14, w + 20, 24, 6); ctx.fill();
  sign('STUDIO FREELANCE', x + w / 2, y - 30, w - 40, '#2a2050', '#d8c6ff', 12);
  const n = 8, sw = (w + 20) / n;
  for (let i = 0; i < n; i++) { ctx.fillStyle = i % 2 ? '#fff' : '#b190ff'; ctx.beginPath(); ctx.moveTo(x - 10 + i * sw, y + 10); ctx.lineTo(x - 10 + (i + 1) * sw, y + 10); ctx.lineTo(x - 10 + (i + 1) * sw + 2, y + 44); ctx.lineTo(x - 10 + i * sw - 2, y + 44); ctx.fill(); }
  ctx.fillStyle = 'rgba(0,0,0,.15)'; ctx.fillRect(x - 10, y + 44, w + 20, 5);
  ctx.fillStyle = '#c9e9fb'; ctx.fillRect(x + 18, y + 62, 96, 72); ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.beginPath(); ctx.moveTo(x + 18, y + 134); ctx.lineTo(x + 62, y + 62); ctx.lineTo(x + 84, y + 62); ctx.lineTo(x + 40, y + 134); ctx.fill();
  ['#ff6f91', '#ffb454', '#2fd3b5'].forEach((c, i) => { ctx.fillStyle = c; rr(x + 28 + i * 28, y + 108, 20, 22, 4); ctx.fill(); });
  door(x + w - 56, y + h, 42, 80, '#2a2050', false);
  ctx.fillStyle = '#9cd7f0'; ctx.fillRect(x + w - 71, y + h - 74, 30, 40);
}

function court(z) {
  const { x, y, w, h } = z, t = S.t, cy = y + h / 2;
  ctx.fillStyle = 'rgba(0,0,0,.18)'; rr(x + 8, y + 8, w, h, 20); ctx.fill();
  ctx.fillStyle = '#b9764a'; rr(x - 10, y - 10, w + 20, h + 20, 24); ctx.fill();
  ctx.fillStyle = '#e09a58'; rr(x, y, w, h, 16); ctx.fill();
  ctx.strokeStyle = 'rgba(160,90,40,.28)'; ctx.lineWidth = 2;
  for (let i = 1; i < 12; i++) { ctx.beginPath(); ctx.moveTo(x + i * w / 12, y); ctx.lineTo(x + i * w / 12, y + h); ctx.stroke(); }
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; rr(x + 14, y + 14, w - 28, h - 28, 8); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + w / 2, y + 14); ctx.lineTo(x + w / 2, y + h - 14); ctx.stroke();
  ctx.beginPath(); ctx.arc(x + w / 2, cy, 44, 0, TAU); ctx.stroke();
  [[x + 14, 1], [x + w - 14, -1]].forEach(([bx, d]) => { ctx.strokeRect(bx - (d < 0 ? 78 : 0), cy - 46, 78, 92); ctx.beginPath(); ctx.arc(bx + d * 78, cy, 46, d > 0 ? -Math.PI / 2 : Math.PI / 2, d > 0 ? Math.PI / 2 : Math.PI * 1.5); ctx.stroke(); });
  ctx.save(); ctx.globalAlpha = .7 + .3 * Math.sin(t * 3); ctx.fillStyle = z.color; ctx.font = '800 22px Sora, sans-serif'; ctx.textAlign = 'center'; ctx.restore();
  [[x + 38, 1], [x + w - 38, -1]].forEach(([hx, d]) => {
    ctx.fillStyle = 'rgba(0,0,0,.2)'; ell(hx + 6, cy + 28, 16, 6); ctx.fill();
    ctx.fillStyle = '#3d4658'; ctx.fillRect(hx - 3, cy - 56, 6, 76);
    ctx.fillStyle = '#fff'; rr(hx - 4 - (d > 0 ? 0 : 0) + d * 10, cy - 66, 8, 40, 2); ctx.fill();
    ctx.strokeStyle = '#ff5a36'; ctx.lineWidth = 4; ell(hx + d * 22, cy - 34, 12, 5); ctx.stroke();
  });
}

/* ───────── Dessin : joueur, ballon, bannières ───────── */
const avatar = new Image(); avatar.src = 'assets/jordy.png';
function drawPlayer() {
  const x = S.px, y = S.py, t = S.t, sw = S.walk ? Math.sin(t * 13) : 0;
  const bob = S.walk ? Math.abs(Math.cos(t * 13)) * -3 : Math.sin(t * 2) * -1;
  const fx = Math.cos(S.fa), fy = Math.sin(S.fa), back = fy < -.5;
  const skin = '#8b5a3a', jacket = '#22385f', pants = '#1a2540';
  ctx.fillStyle = 'rgba(0,0,0,.28)'; ell(x, y + 2, 15, 6); ctx.fill();
  const lL = Math.max(0, sw) * 4, lR = Math.max(0, -sw) * 4;
  ctx.fillStyle = pants; rr(x - 9, y - 19 - lL, 8, 17, 3); ctx.fill(); rr(x + 1, y - 19 - lR, 8, 17, 3); ctx.fill();
  ctx.fillStyle = '#111'; rr(x - 10, y - 5 - lL, 10, 6, 3); ctx.fill(); rr(x, y - 5 - lR, 10, 6, 3); ctx.fill();
  ctx.fillStyle = jacket; rr(x - 17, y - 38 + bob + sw * 2, 6, 17, 3); ctx.fill(); rr(x + 11, y - 38 + bob - sw * 2, 6, 17, 3); ctx.fill();
  ctx.fillStyle = skin; ctx.beginPath(); ctx.arc(x - 14, y - 20 + bob + sw * 2, 3.2, 0, TAU); ctx.arc(x + 14, y - 20 + bob - sw * 2, 3.2, 0, TAU); ctx.fill();
  ctx.fillStyle = jacket; rr(x - 12, y - 42 + bob, 24, 26, 8); ctx.fill();
  if (!back) {
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(x - 5, y - 42 + bob); ctx.lineTo(x + 5, y - 42 + bob); ctx.lineTo(x, y - 29 + bob); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#4da3ff'; ctx.fillRect(x - 1.5, y - 38 + bob, 3, 9);
  }
  const hx = x + fx * 1.5, hy = y - 54 + bob;
  ctx.fillStyle = skin; ctx.beginPath(); ctx.arc(hx, hy, 13, 0, TAU); ctx.fill();
  ctx.fillStyle = '#15110f'; ctx.beginPath();
  if (back) ctx.arc(hx, hy, 13.5, 0, TAU); else ctx.arc(hx, hy - 1, 13.5, Math.PI * 1.02, Math.PI * 1.98);
  ctx.fill();
  if (!back) {
    ctx.fillStyle = '#15110f'; ctx.beginPath(); ctx.arc(hx - 4.5 + fx * 2, hy + 1 + fy * 1, 1.8, 0, TAU); ctx.arc(hx + 4.5 + fx * 2, hy + 1 + fy * 1, 1.8, 0, TAU); ctx.fill();
    ctx.strokeStyle = '#4a2a18'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(hx + fx * 2, hy + 5 + fy, 3.6, .2, Math.PI - .2); ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(8,16,32,.5)'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(hx, hy, 13, 0, TAU); ctx.stroke(); rr(x - 12, y - 42 + bob, 24, 26, 8); ctx.stroke();
}
function drawBall() {
  ctx.fillStyle = 'rgba(0,0,0,.25)'; ell(ball.x + 3, ball.y + 4, 9, 4); ctx.fill();
  ctx.fillStyle = '#f08a3c'; ctx.beginPath(); ctx.arc(ball.x, ball.y - 4, 9, 0, TAU); ctx.fill();
  ctx.strokeStyle = '#7a3a12'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(ball.x, ball.y - 4, 9, 0, TAU); ctx.moveTo(ball.x - 9, ball.y - 4); ctx.lineTo(ball.x + 9, ball.y - 4); ctx.moveTo(ball.x, ball.y - 13); ctx.lineTo(ball.x, ball.y + 5); ctx.stroke();
}
function drawBanner(z) {
  const near = S.near === z, seen = S.visited.has(z.id), t = S.t;
  const cx = z.x + z.w / 2, top = z.type === 'court' ? z.y - 6 : z.y - z.top - 30;
  const by = top + (reduce ? 0 : Math.sin(t * 2 + z.x) * 3) - (near ? 6 : 0);
  ctx.font = '700 15px Sora, system-ui, sans-serif'; ctx.textAlign = 'left';
  const tw = ctx.measureText(z.name).width, bw = tw + 58 + (seen ? 20 : 0), bh = 34;
  ctx.save(); ctx.translate(cx, by); if (near) ctx.scale(1.1, 1.1);
  ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 12; ctx.shadowOffsetY = 4;
  ctx.fillStyle = 'rgba(11,27,51,.92)'; rr(-bw / 2, -bh / 2, bw, bh, 17); ctx.fill(); ctx.shadowColor = 'transparent';
  ctx.lineWidth = 2; ctx.strokeStyle = z.color; ctx.stroke();
  ctx.fillStyle = z.color; ctx.beginPath(); ctx.arc(-bw / 2 + 18, 0, 9, 0, TAU); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.fillText(z.name, -bw / 2 + 34, 5);
  if (seen) { ctx.strokeStyle = z.color; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(bw / 2 - 24, 0); ctx.lineTo(bw / 2 - 19, 5); ctx.lineTo(bw / 2 - 10, -5); ctx.stroke(); }
  ctx.fillStyle = 'rgba(11,27,51,.92)'; ctx.beginPath(); ctx.moveTo(-7, bh / 2 - 1); ctx.lineTo(0, bh / 2 + 8); ctx.lineTo(7, bh / 2 - 1); ctx.fill();
  ctx.restore();
}
function drawGuide() {
  const z = S.guide && byId[S.guide]; if (!z || S.near === z) return;
  const dx = z.door[0] - S.px, dy = z.door[1] - S.py, d = Math.hypot(dx, dy), a = Math.atan2(dy, dx), pulse = reduce ? 0 : Math.sin(S.t * 6) * 5;
  ctx.save(); ctx.translate(S.px + Math.cos(a) * (62 + pulse), S.py - 20 + Math.sin(a) * (62 + pulse)); ctx.rotate(a);
  ctx.fillStyle = z.color; ctx.strokeStyle = '#0b1b33'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(16, 0); ctx.lineTo(-8, -13); ctx.lineTo(-3, 0); ctx.lineTo(-8, 13); ctx.closePath(); ctx.stroke(); ctx.fill(); ctx.restore();
  ctx.font = '700 12px Inter, sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#fff'; ctx.strokeStyle = 'rgba(11,27,51,.85)'; ctx.lineWidth = 4;
  const lx = S.px + Math.cos(a) * 92, ly = S.py - 16 + Math.sin(a) * 92; const txt = Math.round(d / 12) + ' m';
  ctx.strokeText(txt, lx, ly); ctx.fillText(txt, lx, ly);
}

/* ───────── Nom au sol, tableau des scores, crépuscule, bannières ───────── */
function drawNameSign() {
  const cx = NAME_RECT.x + NAME_RECT.w / 2;
  ctx.save(); ctx.textAlign = 'center'; ctx.font = '800 80px Sora, system-ui, sans-serif';
  ['JORDY', 'BRIAN', 'GBOKO'].forEach((tx, i) => {
    ctx.save(); ctx.translate(cx, NAME_RECT.y + 56 + i * 56); ctx.scale(1, .62);
    ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillText(tx, 16, 30);
    for (let k = 16; k > 0; k--) { ctx.fillStyle = k > 8 ? '#16306a' : '#1f3f8c'; ctx.fillText(tx, 0, k * 1.1); }
    const g = ctx.createLinearGradient(0, -62, 0, 6); g.addColorStop(0, '#a9d2ff'); g.addColorStop(1, '#4da3ff');
    ctx.fillStyle = g; ctx.fillText(tx, 0, 0); ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(255,255,255,.75)'; ctx.strokeText(tx, 0, 0);
    ctx.restore();
  });
  ctx.restore();
}
function drawBoard() {
  const b = BOARD, list = (window.hoopsBoard && window.hoopsBoard.list) || [];
  ctx.fillStyle = 'rgba(0,0,0,.22)'; ell(b.x + b.w / 2 + 10, b.y + b.h + 2, b.w / 2 + 12, 10); ctx.fill();
  ctx.fillStyle = '#5a4630'; ctx.fillRect(b.x + 20, b.y + b.h - 34, 10, 36); ctx.fillRect(b.x + b.w - 30, b.y + b.h - 34, 10, 36);
  ctx.fillStyle = '#0f1c33'; rr(b.x, b.y, b.w, b.h - 28, 12); ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = '#ff9a4d'; ctx.stroke();
  ctx.textAlign = 'center'; ctx.fillStyle = '#ff9a4d'; ctx.font = '800 17px Sora, sans-serif'; ctx.fillText('TOP 10', b.x + b.w / 2, b.y + 27);
  ctx.font = '600 11px Inter, sans-serif';
  for (let i = 0; i < 10; i++) {
    const y = b.y + 47 + i * 12, r = list[i];
    ctx.textAlign = 'left'; ctx.fillStyle = i < 3 ? '#ffd166' : '#9fb0d0'; ctx.fillText(String(i + 1), b.x + 12, y);
    ctx.fillStyle = r ? '#fff' : 'rgba(255,255,255,.25)'; ctx.fillText(r ? r.name.slice(0, 11) : '- - -', b.x + 30, y);
    ctx.textAlign = 'right'; ctx.fillText(r ? String(r.score) : '', b.x + b.w - 12, y);
  }
}
function drawDusk() {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'multiply';
  const g = ctx.createLinearGradient(0, 0, 0, cv.height); g.addColorStop(0, 'rgb(255,224,198)'); g.addColorStop(1, 'rgb(216,188,224)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, cv.width, cv.height);
  const mn = Math.min(cv.width, cv.height), mx = Math.max(cv.width, cv.height);
  const v = ctx.createRadialGradient(cv.width / 2, cv.height / 2, mn * .35, cv.width / 2, cv.height / 2, mx * .75);
  v.addColorStop(0, 'rgb(255,255,255)'); v.addColorStop(1, 'rgb(118,100,162)');
  ctx.fillStyle = v; ctx.fillRect(0, 0, cv.width, cv.height); ctx.restore();
  ctx.save(); ctx.globalCompositeOperation = 'screen';
  const glow = (x, y, r, c, a) => { const q = ctx.createRadialGradient(x, y, 2, x, y, r); q.addColorStop(0, `rgba(${c},${a})`); q.addColorStop(1, `rgba(${c},0)`); ctx.fillStyle = q; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); };
  const vwW = vw / zoom, vhW = vh / zoom, x0 = S.cam.x - 160, x1 = S.cam.x + vwW + 160, y0 = S.cam.y - 160, y1 = S.cam.y + vhW + 160;
  for (const l of lamps) if (l.x > x0 && l.x < x1 && l.y > y0 && l.y < y1) glow(l.x, l.y - 62, 130, '255,196,110', .55);
  Z.forEach(z => { if (z.door[0] > x0 && z.door[0] < x1 && z.door[1] > y0 && z.door[1] < y1) { const [r, g2, b] = hex(z.color); glow(z.door[0], z.door[1] - 20, 100, `${r},${g2},${b}`, .3); } });
  ctx.restore();
}
const bannerCache = {};
function zoneBanner(z) {
  if (bannerCache[z.id]) return bannerCache[z.id];
  const bw = z.type === 'court' ? z.w + 100 : z.w + 170, bh = z.type === 'court' ? z.h + 80 : z.h + z.top + 140;
  const c = document.createElement('canvas'); c.width = 680; c.height = 240; const g = c.getContext('2d');
  const sc = Math.min(c.width / bw, c.height / bh), cx = z.x + z.w / 2, cy = z.type === 'court' ? z.y + z.h / 2 : z.y + (z.h - z.top) / 2 + 24;
  const prev = ctx; ctx = g;
  try {
    ctx.save(); ctx.setTransform(sc, 0, 0, sc, c.width / 2 - cx * sc, c.height / 2 - cy * sc);
    if (!grass) grass = makeGrass();
    ctx.fillStyle = grass; ctx.fillRect(cx - 900, cy - 500, 1800, 1000);
    ctx.fillStyle = '#c4b184'; ctx.fillRect(z.door[0] - 29, z.y + z.h - 2, 58, 170); ctx.fillStyle = '#e8dab6'; ctx.fillRect(z.door[0] - 24, z.y + z.h - 2, 48, 170);
    if (z.type !== 'court') { ctx.globalAlpha = .6; ctx.fillStyle = z.color; ell(z.door[0], z.door[1] - 8, 54, 22); ctx.fill(); ctx.globalAlpha = 1; }
    drawBuilding(z);
    ctx.restore();
  } finally { ctx = prev; }
  g.fillStyle = 'rgba(255,160,80,.16)'; g.fillRect(0, 0, c.width, c.height);
  const vg = g.createLinearGradient(0, 120, 0, 240); vg.addColorStop(0, 'rgba(11,27,51,0)'); vg.addColorStop(1, 'rgba(11,27,51,.55)'); g.fillStyle = vg; g.fillRect(0, 0, c.width, c.height);
  return bannerCache[z.id] = c.toDataURL('image/jpeg', .86);
}

/* ───────── Ambiance ───────── */
const clouds = Array.from({ length: 7 }, (_, i) => ({ x: i * 420, y: 120 + (i * 263) % 1500, rx: 160 + (i * 37) % 90, ry: 60 + (i * 23) % 30, v: 10 + (i * 7) % 14 }));
function drawClouds(dt) {
  ctx.fillStyle = 'rgba(8,30,60,.1)';
  clouds.forEach(c => { if (!reduce) c.x = (c.x + c.v * dt) % (W + 600); ell(c.x - 300, c.y, c.rx, c.ry); ctx.fill(); ell(c.x - 240, c.y + 14, c.rx * .6, c.ry * .7); ctx.fill(); });
}

/* ───────── Rendu ───────── */
function render(dt) {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = '#2f6b45'; ctx.fillRect(0, 0, vw, vh);
  const vwW = vw / zoom, vhW = vh / zoom;
  ctx.setTransform(dpr * zoom, 0, 0, dpr * zoom, -S.cam.x * dpr * zoom, -S.cam.y * dpr * zoom);
  drawGround(S.t);
  const x0 = S.cam.x - 40, x1 = S.cam.x + vwW + 40, y0 = S.cam.y - 40, y1 = S.cam.y + vhW + 40;
  const list = [];
  for (const e of ents) if (e.x1 > x0 && e.x0 < x1 && e.y1 > y0 && e.y0 < y1) list.push(e);
  list.push({ y: S.py + 6, draw: drawPlayer }, { y: ball.y, draw: drawBall });
  list.sort((a, b) => a.y - b.y);
  for (const e of list) e.draw();
  drawClouds(dt);
  drawDusk();
  drawGuide();
  Z.forEach(drawBanner);
  drawMini();
}

let miniBase = null;
function buildMini() {
  const c = document.createElement('canvas'); c.width = mini.width; c.height = mini.height; const g = c.getContext('2d'), k = mini.width / W;
  g.fillStyle = '#2f7a4d'; g.fillRect(0, 0, c.width, c.height);
  PONDS.forEach(p => { g.fillStyle = '#35a2d9'; g.beginPath(); g.ellipse(p.x * k, p.y * k, p.rx * k, p.ry * k, 0, 0, TAU); g.fill(); });
  g.strokeStyle = '#e8dab6'; g.lineWidth = 48 * k * 1.3; g.lineJoin = 'round'; g.lineCap = 'round';
  PATHS.forEach(p => { g.beginPath(); g.moveTo(p[0][0] * k, p[0][1] * k); p.slice(1).forEach(q => g.lineTo(q[0] * k, q[1] * k)); g.stroke(); });
  g.fillStyle = '#eadfc2'; g.beginPath(); g.arc(PLAZA.x * k, PLAZA.y * k, PLAZA.r * k, 0, TAU); g.fill();
  Z.forEach(z => { g.fillStyle = z.type === 'court' ? '#e09a58' : dark(z.color, .35); g.fillRect(z.x * k, (z.y - (z.type === 'court' ? 0 : 20)) * k, z.w * k, (z.h + (z.type === 'court' ? 0 : 20)) * k); });
  miniBase = c;
}
function drawMini() {
  if (!miniBase) buildMini();
  const k = mini.width / W, g = mctx;
  g.drawImage(miniBase, 0, 0);
  Z.forEach(z => {
    const x = (z.x + z.w / 2) * k, y = (z.y + z.h / 2) * k, seen = S.visited.has(z.id), p = .5 + .5 * Math.sin(S.t * 4 + z.x);
    g.beginPath(); g.arc(x, y, seen ? 5 : 6 + p * 2, 0, TAU); g.fillStyle = seen ? z.color : '#fff'; g.fill(); g.lineWidth = 2.5; g.strokeStyle = z.color; g.stroke();
  });
  g.strokeStyle = 'rgba(255,255,255,.85)'; g.lineWidth = 1.5; g.strokeRect(S.cam.x * k, S.cam.y * k, vw / zoom * k, vh / zoom * k);
  g.beginPath(); g.arc(S.px * k, S.py * k, 5.5, 0, TAU); g.fillStyle = '#ff3d5a'; g.fill(); g.lineWidth = 2; g.strokeStyle = '#fff'; g.stroke();
}

/* ───────── Contrôles ───────── */
const keys = new Set(); let joy = { x: 0, y: 0 };
addEventListener('keydown', e => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const k = e.key.toLowerCase();
  if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(k) && !(e.target.closest && e.target.closest('button, a'))) e.preventDefault();
  if (k === 'escape') { if (S.classicOpen) closeClassic(); else if (el.menu.classList.contains('open')) closeMenu(); else if (S.panelOpen) closePanel(); return; }
  if (S.introOpen) { if (k === 'enter') startGame(); return; }
  if (k === 'e' || k === 'enter' || (k === ' ' && !(e.target.closest && e.target.closest('button, a')))) { if (S.near && !paused()) openZone(S.near); return; }
  keys.add(k); S.idle = 0;
});
addEventListener('keyup', e => keys.delete(e.key.toLowerCase()));
addEventListener('blur', () => keys.clear());

const joyEl = $('#joy'), stick = $('#stick');
function joyMove(e) {
  const r = joyEl.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  let dx = e.clientX - cx, dy = e.clientY - cy; const d = Math.hypot(dx, dy), m = 42;
  if (d > m) { dx *= m / d; dy *= m / d; }
  joy.x = dx / m; joy.y = dy / m; stick.style.transform = `translate(${dx}px,${dy}px)`; S.idle = 0;
}
joyEl.addEventListener('pointerdown', e => { joyEl.setPointerCapture(e.pointerId); joyMove(e); });
joyEl.addEventListener('pointermove', e => { if (e.buttons || e.pointerType === 'touch') joyMove(e); });
const joyEnd = () => { joy = { x: 0, y: 0 }; stick.style.transform = ''; };
joyEl.addEventListener('pointerup', joyEnd); joyEl.addEventListener('pointercancel', joyEnd);

/* ───────── Mouvement ───────── */
function onRoad(x, y) {
  if (Math.hypot(x - PLAZA.x, y - PLAZA.y) < PLAZA.r + 4) return true;
  if (x > courtZ.x + 6 && x < courtZ.x + courtZ.w - 6 && y > courtZ.y + 6 && y < courtZ.y + courtZ.h - 6) return true;
  return nearPath(x, y, 27);
}
function blocked(x, y) {
  if (!onRoad(x, y)) return true;
  if (x < 24 || y < 24 || x > W - 24 || y > H - 24) return true;
  const r = 12;
  for (const s of solids) {
    if (s.k === 'r') { const cx = clamp(x, s.x, s.x + s.w), cy = clamp(y, s.y, s.y + s.h), dx = x - cx, dy = y - cy; if (dx * dx + dy * dy < r * r) return true; }
    else if (s.k === 'c') { const dx = x - s.x, dy = y - s.y, rr2 = r + s.r; if (dx * dx + dy * dy < rr2 * rr2) return true; }
    else { const dx = (x - s.x) / (s.rx + r), dy = (y - s.y) / (s.ry + r); if (dx * dx + dy * dy < 1) return true; }
  }
  return false;
}
function update(dt) {
  S.t += dt;
  let ix = (keys.has('arrowright') || keys.has('d') ? 1 : 0) - (keys.has('arrowleft') || keys.has('q') || keys.has('a') ? 1 : 0);
  let iy = (keys.has('arrowdown') || keys.has('s') ? 1 : 0) - (keys.has('arrowup') || keys.has('z') || keys.has('w') ? 1 : 0);
  ix += joy.x; iy += joy.y;
  const m = Math.hypot(ix, iy);
  if (paused() || m < .08) { S.walk = 0; ix = iy = 0; }
  else {
    const sp = (keys.has('shift') ? 400 : 270) * Math.min(1, m);
    ix = ix / m * sp * dt; iy = iy / m * sp * dt; S.walk = 1; S.fa = Math.atan2(iy, ix);
    if (!blocked(S.px + ix, S.py)) S.px += ix;
    if (!blocked(S.px, S.py + iy)) S.py += iy;
    // ballon
    const dx = ball.x - S.px, dy = ball.y - S.py, d = Math.hypot(dx, dy);
    if (d < 24) { const n = d || 1; ball.vx += dx / n * 330; ball.vy += dy / n * 330; }
  }
  // ballon : physique
  ball.x += ball.vx * dt; ball.y += ball.vy * dt; const f = Math.pow(.06, dt); ball.vx *= f; ball.vy *= f;
  const cz = courtZ;
  if (ball.x < cz.x + 24) { ball.x = cz.x + 24; ball.vx *= -.7; } if (ball.x > cz.x + cz.w - 24) { ball.x = cz.x + cz.w - 24; ball.vx *= -.7; }
  if (ball.y < cz.y + 24) { ball.y = cz.y + 24; ball.vy *= -.7; } if (ball.y > cz.y + cz.h - 12) { ball.y = cz.y + cz.h - 12; ball.vy *= -.7; }
  const vmax = 520, sp2 = Math.hypot(ball.vx, ball.vy); if (sp2 > vmax) { ball.vx *= vmax / sp2; ball.vy *= vmax / sp2; }

  // proximité des portes
  let best = null, bd = 1e9;
  Z.forEach(z => { const d = Math.hypot(z.door[0] - S.px, z.door[1] - S.py); if (d < (z.radius || 66) && d < bd) { best = z; bd = d; } });
  if (best !== S.near) { S.near = best; updatePrompt(); if (best && S.guide === best.id) S.guide = null; }

  // coup de pouce si inactif
  if (!paused()) { S.idle += dt; if (S.idle > 14 && !S.guide) { const nx = Z.find(z => !S.visited.has(z.id)); if (nx) S.guide = nx.id; } }

  // caméra
  const targetShift = (S.panelOpen && vw > 760) ? 250 / zoom : 0;
  S.shift += (targetShift - S.shift) * (1 - Math.exp(-dt * 6));
  const vwW = vw / zoom, vhW = vh / zoom;
  // mobile : le panneau est un volet en bas, on remonte le bonhomme dans la partie visible
  const targetY = (S.panelOpen && vw <= 760) ? 20 + 0.2 * vh / zoom : 0;
  S.shiftY = (S.shiftY || 0) + (targetY - (S.shiftY || 0)) * (1 - Math.exp(-dt * 6));
  let tx = S.px - vwW / 2 + S.shift, ty = S.py - 20 - vhW / 2 + S.shiftY;
  tx = W > vwW ? clamp(tx, 0, W - vwW + S.shift) : (W - vwW) / 2; ty = H > vhW ? clamp(ty, 0, H - vhW + S.shiftY * 2.5) : (H - vhW) / 2;
  const k = 1 - Math.exp(-dt * 7); S.cam.x += (tx - S.cam.x) * k; S.cam.y += (ty - S.cam.y) * k;
}

/* ───────── Interface ───────── */
function updatePrompt() {
  const z = S.near;
  if (!z || paused()) { el.prompt.hidden = true; el.act.hidden = true; return; }
  el.prompt.style.setProperty('--z', z.color); el.act.style.setProperty('--z', z.color);
  el.prompt.innerHTML = `<span class="panel-ico" style="width:34px;height:34px;border-radius:10px;--z:${z.color}">${icon(z.icon, 18)}</span><span>${z.name}</span><kbd>E</kbd>`;
  el.prompt.hidden = false; el.act.hidden = !isTouch;
}
el.prompt.addEventListener('click', () => { if (S.near && !paused()) openZone(S.near); });
el.act.addEventListener('click', () => { if (S.near && !paused()) openZone(S.near); });

function renderProgress() {
  const n = S.visited.size, tot = Z.length;
  el.progBar.style.width = (n / tot * 100) + '%'; el.progTxt.textContent = `${n}/${tot} lieux`;
  el.menuList.querySelectorAll('.m-item').forEach(b => b.classList.toggle('seen', S.visited.has(b.dataset.id)));
}
function countUp(root) {
  root.querySelectorAll('[data-count]').forEach(n => {
    const to = +n.dataset.count, pre = n.dataset.prefix || '', st = performance.now();
    if (reduce) { n.textContent = pre + to; return; }
    (function step(now) { const p = clamp((now - st) / 1000, 0, 1), e = 1 - Math.pow(1 - p, 3); n.textContent = pre + Math.round(to * e); if (p < 1) requestAnimationFrame(step); })(st);
  });
}
function nextZone(z) { return Z.find(q => !S.visited.has(q.id) && q !== z) || Z[(Z.indexOf(z) + 1) % Z.length]; }

function openZone(z) {
  closeMenu();
  S.panelOpen = z.id; S.guide = null;
  el.panel.style.setProperty('--z', z.color);
  el.ico.innerHTML = icon(z.icon, 24); el.eyebrow.textContent = z.eyebrow; el.title.textContent = z.title;
  el.body.innerHTML = '<img class="banner" alt="" src="' + zoneBanner(z) + '">' + z.html; el.body.scrollTop = 0;
  const nx = nextZone(z);
  el.next.innerHTML = `<span>${S.visited.size >= Z.length - 1 && !S.visited.has(z.id) ? 'Dernier lieu découvert' : 'Prochain lieu : ' + nx.name}</span>${icon('arrow', 18)}`;
  el.next.onclick = () => { closePanel(); S.guide = nx.id; };
  el.panel.classList.add('open'); el.panel.setAttribute('aria-hidden', 'false');
  S.visited.add(z.id); try { localStorage.setItem('jb-visited', JSON.stringify([...S.visited])); } catch (e) {}
  renderProgress(); updatePrompt(); countUp(el.body);
  document.dispatchEvent(new CustomEvent('panel-open', { detail: { id: z.id, root: el.body } }));
}
function closePanel() {
  el.panel.classList.remove('open'); el.panel.setAttribute('aria-hidden', 'true'); S.panelOpen = null; updatePrompt();
  if (S.visited.size >= Z.length && !S.finale) { S.finale = true; toast('Tu as tout exploré. Il ne reste qu’à passer à la Poste pour m’écrire !', 6000); S.guide = 'contact'; }
}
$('#panelClose').onclick = closePanel;

function toast(msg, ms = 4000) { el.toast.textContent = msg; el.toast.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => el.toast.classList.remove('show'), ms); }

function buildMenu() {
  el.menuList.innerHTML = Z.map(z => `<button class="m-item" data-id="${z.id}" style="--c:${z.color}" type="button"><span class="mi">${icon(z.icon, 18)}</span><span><b>${z.name}</b><span>${z.label}</span></span><span class="ok">${icon('check', 18)}</span></button>`).join('');
  el.menuList.querySelectorAll('.m-item').forEach(b => b.onclick = () => travel(byId[b.dataset.id]));
}
function openMenu() { el.menu.classList.add('open'); el.menu.setAttribute('aria-hidden', 'false'); }
function closeMenu() { el.menu.classList.remove('open'); el.menu.setAttribute('aria-hidden', 'true'); }
$('#btnMenu').onclick = () => el.menu.classList.contains('open') ? closeMenu() : openMenu();
$('#menuClose').onclick = closeMenu;

function travel(z) {
  closeMenu(); if (S.panelOpen) closePanel();
  el.fade.classList.add('on');
  setTimeout(() => {
    const c = z.type === 'court' ? [z.door[0] - 130, z.door[1]] : [z.door[0], z.door[1] + 12];
    S.px = c[0]; S.py = c[1]; S.cam.x = S.px - vw / zoom / 2; S.cam.y = S.py - vh / zoom / 2; S.guide = null;
    setTimeout(() => el.fade.classList.remove('on'), 120);
  }, 230);
}

function buildClassic() {
  $('#classicBtns').innerHTML = `<a class="btn primary" href="mailto:${EMAIL}">${icon('mail', 18)} Me contacter</a><a class="btn" href="${window.CV_FILE}" download>${icon('download', 18)} Télécharger mon CV</a>`;
  $('#classicBody').innerHTML = Z.map(z => `<section class="c-sec" style="--z:${z.color}"><header><div class="panel-ico">${icon(z.icon, 22)}</div><div><span>${z.eyebrow}</span><h2>${z.title}</h2></div></header><div class="body">${z.html}</div></section>`).join('');
}
function openClassic() { S.classicOpen = true; el.classic.classList.add('open'); el.classic.setAttribute('aria-hidden', 'false'); el.classic.scrollTop = 0; closeMenu(); updatePrompt(); countUp(el.classic); }
function closeClassic() { S.classicOpen = false; el.classic.classList.remove('open'); el.classic.setAttribute('aria-hidden', 'true'); updatePrompt(); }
$('#btnClassic').onclick = openClassic; $('#classicClose').onclick = closeClassic;
$('#btnIntroClassic').onclick = () => { el.intro.classList.add('gone'); S.introOpen = false; openClassic(); };

function startGame() {
  el.intro.classList.add('gone'); S.introOpen = false; S.idle = 0;
  if (!S.visited.size) { S.guide = 'about'; toast('Suis les routes jusqu’à un bâtiment, puis appuie sur E pour entrer.', 5000); }
  else toast(`Content de te revoir ! ${S.visited.size}/${Z.length} lieux déjà explorés.`, 4000);
  S.cam.x = S.px - vw / zoom / 2; S.cam.y = S.py - vh / zoom / 2;
}
$('#btnStart').onclick = startGame;

/* ───────── Boucle ───────── */
buildMenu(); buildClassic(); renderProgress();
S.cam.x = clamp(S.px - vw / zoom / 2, 0, Math.max(0, W - vw / zoom)); S.cam.y = clamp(S.py - vh / zoom / 2, 0, Math.max(0, H - vh / zoom));
let last = performance.now();
function frame(now) {
  const dt = Math.min(.05, (now - last) / 1000); last = now;
  update(dt); render(dt);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
window.__portfolio = S;
})();
