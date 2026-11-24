/* Lancer de paniers + Top 10.
   Classement mondial via /api/scores (fonction Netlify). Sans serveur : classement local sur l'appareil. */
(function () {
'use strict';
const API = '/api/scores', LS = 'jb-hoops-scores', LSN = 'jb-hoops-name';
const board = { list: [], source: 'local', mine: null };
window.hoopsBoard = board;
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function lsGet(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

function rowsHTML() {
  if (!board.list.length) return '<li class="empty">Aucun score pour l’instant. Sois le premier !</li>';
  return board.list.map((r, i) => `<li class="${board.mine && board.mine.name === r.name && board.mine.score === r.score ? 'me' : ''}"><span class="rk">${i + 1}</span><span class="nm">${esc(r.name)}</span><b>${r.score}</b></li>`).join('');
}
function render() {
  document.querySelectorAll('[data-top10]').forEach(ol => { ol.innerHTML = rowsHTML(); });
  const src = $('#hSrc'); if (src) src.textContent = board.source === 'global' ? 'Classement mondial' : 'Classement local (sur cet appareil)';
}
async function refresh() {
  try {
    const r = await fetch(API, { cache: 'no-store' });
    if (!r.ok) throw new Error('indisponible');
    const l = await r.json(); if (!Array.isArray(l)) throw new Error('format');
    board.list = l.slice(0, 10); board.source = 'global';
  } catch (e) { board.list = lsGet(LS, []).slice(0, 10); board.source = 'local'; }
  render();
}
async function submit(name, score) {
  if (board.source === 'global') {
    try {
      const r = await fetch(API, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name, score }) });
      if (r.ok) { board.list = (await r.json()).slice(0, 10); board.mine = { name, score }; render(); return; }
    } catch (e) {}
  }
  const l = lsGet(LS, []); l.push({ name, score, date: new Date().toISOString().slice(0, 10) });
  l.sort((a, b) => b.score - a.score); const t = l.slice(0, 10); lsSet(LS, t);
  board.list = t; board.source = 'local'; board.mine = { name, score }; render();
}
document.addEventListener('panel-open', e => { if (e.detail.id === 'interests') render(); });
document.addEventListener('click', e => { if (e.target.closest('[data-hoops-open]')) open(); });

/* ───────── Jeu ───────── */
const SC = { W: 560, H: 340, floor: 300, rimX: 470, rimY: 150, RW: 28, boardX: 504, boardTop: 92, boardBot: 168, BR: 10, g: 900, th: 58 * Math.PI / 180, vmin: 480, vmax: 760, y0: 232 };
const SPOTS = [{ x: 270, pts: 2 }, { x: 170, pts: 2 }, { x: 70, pts: 3 }];
let ov, cvs, g2, G, raf = 0, last = 0, isOpen = false;

function build() {
  ov = document.createElement('div'); ov.id = 'hoops'; ov.setAttribute('aria-hidden', 'true');
  ov.innerHTML = `<div class="hoops-card"><div class="hoops-head"><b>Lancer de paniers</b><button class="x" id="hClose" type="button" aria-label="Fermer">${window.icon('x', 18)}</button></div>
  <div class="hoops-body"><div class="hoops-game">
    <div class="hoops-hud"><span>Temps<b id="hTime">30</b></span><span>Score<b id="hScore">0</b></span><span id="hStreak"></span></div>
    <canvas id="hCanvas" width="560" height="340" aria-label="Terrain de basket"></canvas>
    <div class="meter" aria-hidden="true"><i class="band" id="hBand"></i><i class="cursor" id="hCursor"></i></div>
    <button id="hShoot" class="btn primary" type="button">Commencer (Espace)</button>
    <p class="hoops-help">Appuie quand la barre blanche est dans la zone verte. Plus c’est loin, plus ça rapporte : 2, 2 puis 3 points. Un bonus tous les 3 paniers de suite.</p>
  </div><div class="hoops-board"><h4>Top 10</h4><ol class="top10" data-top10></ol><p id="hSrc" class="src"></p></div></div>
  <div class="hoops-over" id="hOver"><div><h3 id="hOverTitle">Temps écoulé !</h3><p class="big"><span id="hOverScore">0</span> points</p>
    <input id="hName" maxlength="12" placeholder="Ton prénom" autocomplete="nickname"><div class="btns"><button id="hSave" class="btn primary" type="button">Enregistrer mon score</button><button id="hAgain" class="btn" type="button">Rejouer</button></div><p id="hMsg" class="src"></p></div></div></div>`;
  document.body.appendChild(ov);
  cvs = $('#hCanvas'); g2 = cvs.getContext('2d');
  $('#hClose').onclick = close; $('#hShoot').onclick = act; cvs.addEventListener('pointerdown', e => { e.preventDefault(); act(); });
  $('#hAgain').onclick = () => { reset(); $('#hOver').classList.remove('show'); };
  $('#hSave').onclick = async () => {
    const name = ($('#hName').value || '').replace(/[^\p{L}\p{N} _.-]/gu, '').trim().slice(0, 12) || 'Anonyme';
    lsSet(LSN, name); $('#hSave').disabled = true; await submit(name, G.score);
    $('#hMsg').textContent = board.source === 'global' ? 'Score enregistré dans le classement mondial.' : 'Score enregistré sur cet appareil.';
  };
  ov.addEventListener('pointerdown', e => { if (e.target === ov) close(); });
}
function reset() {
  G = { state: 'ready', left: 30, score: 0, streak: 0, spot: 0, phase: 0, ball: null, msg: '', msgT: 0, net: 0, arm: 0, idealP: 0 };
  setIdeal(); hud(); $('#hShoot').textContent = 'Commencer (Espace)'; $('#hShoot').disabled = false;
}
function setIdeal() {
  const sp = SPOTS[G.spot], dx = SC.rimX - (sp.x + 22), up = SC.y0 - SC.rimY, c = Math.cos(SC.th), t = Math.tan(SC.th);
  const v = Math.sqrt(SC.g * dx * dx / (2 * c * c * (dx * t - up)));
  G.idealP = Math.max(.05, Math.min(.95, (v - SC.vmin) / (SC.vmax - SC.vmin)));
  $('#hBand').style.left = ((G.idealP - .05) * 100) + '%'; $('#hBand').style.width = '10%';
}
function hud() {
  $('#hTime').textContent = Math.ceil(Math.max(0, G.left)); $('#hScore').textContent = G.score;
  $('#hStreak').textContent = G.streak >= 2 ? 'Série ×' + G.streak : '';
}
function meterP() { return 1 - Math.abs((G.phase % 2) - 1); }
function act() {
  if (!isOpen) return;
  if (G.state === 'ready') { G.state = 'play'; $('#hShoot').textContent = 'Tirer (Espace)'; return; }
  if (G.state !== 'play' || G.ball) return;
  const sp = SPOTS[G.spot], p = meterP(), v = SC.vmin + p * (SC.vmax - SC.vmin);
  G.ball = { x: sp.x + 22, y: SC.y0, vx: v * Math.cos(SC.th), vy: -v * Math.sin(SC.th), t: 0, scored: false, rim: false, board: false, pts: sp.pts };
  G.arm = .3;
}
function endShot() {
  const b = G.ball;
  if (!b.scored) { G.streak = 0; G.msg = 'Raté'; G.msgT = .9; }
  G.ball = null;
  let n; do { n = Math.floor(Math.random() * 3); } while (n === G.spot); G.spot = n; setIdeal(); hud();
  if (G.left <= 0) gameOver();
}
function gameOver() {
  G.state = 'over'; $('#hOverScore').textContent = G.score; $('#hOverTitle').textContent = G.score >= 20 ? 'Quel tireur !' : 'Temps écoulé !';
  $('#hName').value = lsGet(LSN, ''); $('#hMsg').textContent = ''; $('#hSave').disabled = G.score <= 0; $('#hOver').classList.add('show'); $('#hShoot').disabled = true;
}
function physics(dt) {
  const b = G.ball, n = Math.ceil(dt * 180), h = dt / n;
  for (let i = 0; i < n && G.ball; i++) {
    b.vy += SC.g * h; const py = b.y; b.x += b.vx * h; b.y += b.vy * h; b.t += h;
    if (!b.scored) {
      for (const rx of [SC.rimX - SC.RW, SC.rimX + SC.RW]) {
        const dx = b.x - rx, dy = b.y - SC.rimY, d = Math.hypot(dx, dy), md = SC.BR + 3;
        if (d < md && d > 0) { const nx = dx / d, ny = dy / d, vn = b.vx * nx + b.vy * ny; if (vn < 0) { b.vx -= 1.55 * vn * nx; b.vy -= 1.55 * vn * ny; } b.x = rx + nx * md; b.y = SC.rimY + ny * md; b.rim = true; }
      }
      if (b.vx > 0 && b.x + SC.BR > SC.boardX && b.y > SC.boardTop - SC.BR && b.y < SC.boardBot + SC.BR) { b.x = SC.boardX - SC.BR; b.vx *= -.45; b.board = true; }
      if (b.vy > 0 && py < SC.rimY && b.y >= SC.rimY && Math.abs(b.x - SC.rimX) < SC.RW - 3) {
        b.scored = true; b.swish = !b.rim && !b.board && Math.abs(b.x - SC.rimX) < 9; b.vx *= .3; G.net = 1;
        G.streak++; const bonus = G.streak % 3 === 0 ? 1 : 0; G.score += b.pts + bonus;
        G.msg = (b.swish ? 'Swish ! ' : '') + '+' + (b.pts + bonus) + (bonus ? ' (série)' : ''); G.msgT = 1.1; hud();
      }
    } else b.vx *= .985;
    if (b.y + SC.BR >= SC.floor) { b.y = SC.floor - SC.BR; b.vy *= -.45; b.vx *= .7; b.fl = (b.fl || 0) + 1; }
    if (b.t > 2.8 || b.x > SC.W + 40 || (b.fl > 2 && Math.abs(b.vy) < 70)) { endShot(); return; }
  }
}
function draw() {
  const c = g2, W = SC.W, H = SC.H;
  const sky = c.createLinearGradient(0, 0, 0, SC.floor); sky.addColorStop(0, '#5b4a9a'); sky.addColorStop(.6, '#f08a6a'); sky.addColorStop(1, '#ffc87a');
  c.fillStyle = sky; c.fillRect(0, 0, W, H);
  c.fillStyle = 'rgba(40,30,70,.55)'; for (let i = 0; i < 9; i++) { c.beginPath(); c.arc(30 + i * 70, SC.floor - 6, 40 + (i * 13) % 24, Math.PI, 0); c.fill(); }
  c.fillStyle = '#c47f45'; c.fillRect(0, SC.floor, W, H - SC.floor); c.fillStyle = '#e09a58'; c.fillRect(0, SC.floor, W, 8);
  c.strokeStyle = 'rgba(255,255,255,.7)'; c.lineWidth = 3; c.beginPath(); c.moveTo(0, SC.floor + 22); c.lineTo(W, SC.floor + 22); c.stroke();
  // poteau, panneau
  c.fillStyle = '#39445a'; c.fillRect(SC.boardX + 14, SC.boardTop + 20, 9, SC.floor - SC.boardTop - 20);
  c.fillStyle = '#fff'; c.fillRect(SC.boardX, SC.boardTop, 8, SC.boardBot - SC.boardTop); c.fillStyle = '#ff5a36'; c.fillRect(SC.boardX - 2, SC.rimY - 22, 12, 22);
  // filet (balancement)
  const sway = G.net > 0 ? Math.sin(G.net * 22) * 5 * G.net : 0;
  c.strokeStyle = 'rgba(255,255,255,.85)'; c.lineWidth = 1.5;
  for (let i = 0; i <= 6; i++) { const x1 = SC.rimX - SC.RW + i * (SC.RW * 2 / 6), x2 = SC.rimX - 14 + i * (28 / 6) + sway; c.beginPath(); c.moveTo(x1, SC.rimY); c.lineTo(x2, SC.rimY + 40); c.stroke(); }
  for (let k = 1; k <= 3; k++) { const y = SC.rimY + k * 10, w = SC.RW - k * 4; c.beginPath(); c.moveTo(SC.rimX - w + sway * k / 4, y); c.lineTo(SC.rimX + w + sway * k / 4, y); c.stroke(); }
  c.strokeStyle = '#ff5a36'; c.lineWidth = 4; c.beginPath(); c.moveTo(SC.rimX - SC.RW, SC.rimY); c.lineTo(SC.rimX + SC.RW, SC.rimY); c.stroke();
  // tireur
  const sp = SPOTS[G.spot], x = sp.x, up = G.arm > 0 ? 1 : 0;
  c.fillStyle = 'rgba(0,0,0,.25)'; c.beginPath(); c.ellipse(x + 4, SC.floor + 6, 24, 6, 0, 0, 6.3); c.fill();
  c.fillStyle = '#1a2540'; c.fillRect(x - 11, SC.floor - 44, 9, 44); c.fillRect(x + 2, SC.floor - 44, 9, 44);
  c.fillStyle = '#111'; c.fillRect(x - 13, SC.floor - 6, 12, 6); c.fillRect(x + 1, SC.floor - 6, 12, 6);
  c.fillStyle = '#22385f'; c.beginPath(); c.roundRect(x - 15, SC.floor - 92, 30, 52, 9); c.fill();
  c.fillStyle = '#fff'; c.beginPath(); c.moveTo(x - 5, SC.floor - 92); c.lineTo(x + 5, SC.floor - 92); c.lineTo(x, SC.floor - 76); c.fill();
  c.strokeStyle = '#22385f'; c.lineWidth = 8; c.lineCap = 'round'; c.beginPath(); c.moveTo(x + 8, SC.floor - 86); c.lineTo(x + 20 + up * 2, SC.floor - (up ? 120 : 70)); c.stroke();
  c.fillStyle = '#8b5a3a'; c.beginPath(); c.arc(x, SC.floor - 108, 15, 0, 6.3); c.fill(); c.fillStyle = '#15110f'; c.beginPath(); c.arc(x - 1, SC.floor - 110, 15.5, Math.PI * 1.02, Math.PI * 1.98); c.fill();
  c.fillStyle = '#15110f'; c.beginPath(); c.arc(x + 4, SC.floor - 106, 1.8, 0, 6.3); c.arc(x + 11, SC.floor - 106, 1.8, 0, 6.3); c.fill();
  // ballon
  const b = G.ball, bx = b ? b.x : x + 24, by = b ? b.y : SC.floor - 84;
  c.fillStyle = '#f08a3c'; c.beginPath(); c.arc(bx, by, SC.BR, 0, 6.3); c.fill(); c.strokeStyle = '#7a3a12'; c.lineWidth = 1.4;
  c.beginPath(); c.arc(bx, by, SC.BR, 0, 6.3); c.moveTo(bx - SC.BR, by); c.lineTo(bx + SC.BR, by); c.moveTo(bx, by - SC.BR); c.lineTo(bx, by + SC.BR); c.stroke();
  // avant du cercle
  c.strokeStyle = '#ff5a36'; c.lineWidth = 4; c.beginPath(); c.ellipse(SC.rimX, SC.rimY, SC.RW, 6, 0, 0, Math.PI); c.stroke();
  // message
  if (G.msgT > 0) { c.textAlign = 'center'; c.font = '800 30px Sora, sans-serif'; c.lineWidth = 6; c.strokeStyle = 'rgba(11,27,51,.8)'; c.fillStyle = G.msg === 'Raté' ? '#ff9aa8' : '#8bf0b0'; c.globalAlpha = Math.min(1, G.msgT * 2); c.strokeText(G.msg, 280, 70 - (1 - G.msgT) * 10); c.fillText(G.msg, 280, 70 - (1 - G.msgT) * 10); c.globalAlpha = 1; }
  if (G.state === 'ready') { c.fillStyle = 'rgba(11,27,51,.6)'; c.fillRect(0, 0, W, H); c.textAlign = 'center'; c.fillStyle = '#fff'; c.font = '800 26px Sora, sans-serif'; c.fillText('Prêt à tirer ?', 280, 140); c.font = '500 16px Inter, sans-serif'; c.fillStyle = '#cfe0ff'; c.fillText('30 secondes · Espace, clic ou toucher', 280, 172); }
}
function loop(now) {
  if (!isOpen) return;
  const dt = Math.min(.05, (now - last) / 1000); last = now;
  if (G.state === 'play') { G.phase += dt / .9; if (!G.ball) G.left -= dt; }
  if (G.ball) physics(dt);
  if (G.state === 'play' && !G.ball && G.left <= 0) gameOver();
  G.arm = Math.max(0, G.arm - dt); G.msgT = Math.max(0, G.msgT - dt); G.net = Math.max(0, G.net - dt * 1.6);
  $('#hCursor').style.left = (meterP() * 100) + '%'; if (G.state === 'play') hud();
  draw(); raf = requestAnimationFrame(loop);
}
function open() {
  if (!ov) build();
  isOpen = true; ov.classList.add('open'); ov.setAttribute('aria-hidden', 'false'); reset(); $('#hOver').classList.remove('show'); board.mine = null; render();
  last = performance.now(); cancelAnimationFrame(raf); raf = requestAnimationFrame(loop);
}
function close() { isOpen = false; if (ov) { ov.classList.remove('open'); ov.setAttribute('aria-hidden', 'true'); } cancelAnimationFrame(raf); }
document.addEventListener('keydown', e => {
  if (!isOpen) return;
  if (e.key === 'Escape') { e.stopImmediatePropagation(); close(); return; }
  if ((e.key === ' ' || e.key === 'Enter') && !(e.target.closest && e.target.closest('input, button'))) { e.preventDefault(); e.stopImmediatePropagation(); act(); }
}, true);
refresh();
window.Hoops = { open, close, refresh };
})();
