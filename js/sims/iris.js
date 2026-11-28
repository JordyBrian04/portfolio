/* Simulation d'IRIS : yeux lumineux, humeurs et commandes vocales simulées. */
(function () {
'use strict';
window.MuseumSims = window.MuseumSims || {};
const CSS = `
.sim-iris{background:#000;color:#D8F6FF;font-family:Inter,system-ui,sans-serif;display:flex;flex-direction:column}
.sim-iris canvas{display:block;width:100%;height:238px;cursor:pointer;touch-action:none}
.sim-iris .cap{position:absolute;left:50%;top:198px;transform:translateX(-50%);max-width:86%;padding:4px 12px;border-radius:6px;background:rgba(0,0,0,.75);color:#40E0FF;font:600 13px/1.35 Inter,system-ui,sans-serif;text-align:center;opacity:0;transition:opacity .25s;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sim-iris .cap.on{opacity:1}
.sim-iris .card{position:absolute;left:12px;top:12px;width:180px;padding:10px 12px;border-radius:12px;background:#0A1418;border:1px solid #1E3A44;font-size:12px;line-height:1.45;opacity:0;transform:translateY(-6px);transition:.3s}
.sim-iris .card.on{opacity:1;transform:none}
.sim-iris .card b{display:block;color:#40E0FF;font-size:11px;letter-spacing:.08em;text-transform:uppercase;margin-bottom:4px}
.sim-iris .card .seg{font:700 30px/1 ui-monospace,Menlo,monospace;color:#40E0FF;letter-spacing:2px}
.sim-iris .card .ok{color:#80FF99}
.sim-iris .bar{flex:1;display:flex;gap:6px;align-items:center;padding:8px 10px;overflow-x:auto;border-top:1px solid #1E3A44;background:#05090b}
.sim-iris .bar button{flex:none;border:1px solid #1E3A44;background:#0A1418;color:#D8F6FF;border-radius:999px;padding:7px 11px;font:600 12px Inter,system-ui,sans-serif;cursor:pointer}
.sim-iris .bar button:hover{border-color:#40E0FF}
.sim-iris .bar button:disabled{opacity:.45;cursor:default}
.sim-iris .bar .mic{background:#40E0FF;color:#001A33;border:0}
`;
const CMDS = [
  { k: 'todo', say: 'Ajoute « appeler le fournisseur »', reply: 'C’est noté. Une de plus sur la liste !' },
  { k: 'timer', say: 'Lance un Pomodoro de 25 minutes', reply: 'Pomodoro lancé. Concentre-toi, je surveille.' },
  { k: 'brief', say: 'Fais-moi le point', reply: 'Bonjour ! Voici ta journée en un coup d’œil.' },
  { k: 'weather', say: 'Quel temps fait-il ?', reply: 'Il fait chaud et ensoleillé aujourd’hui.' },
  { k: 'work', say: 'On passe en mode travail', reply: 'Projet ouvert, serveur lancé. Au boulot !' }
];
function mount(root, ctx) {
  if (!document.getElementById('sim-iris-css')) { const s = document.createElement('style'); s.id = 'sim-iris-css'; s.textContent = CSS; document.head.appendChild(s); }
  root.classList.add('sim-iris');
  root.innerHTML = `<canvas aria-label="Les yeux d'IRIS. Clique dessus."></canvas><div class="cap"></div><div class="card"></div>
    <div class="bar"><button type="button" class="mic" data-i="0">🎙 « ${CMDS[0].say} »</button>${CMDS.slice(1).map((c, i) => `<button type="button" data-i="${i + 1}">« ${c.say} »</button>`).join('')}</div>`;
  const cv = root.querySelector('canvas'), g = cv.getContext('2d'), cap = root.querySelector('.cap'), card = root.querySelector('.card');
  const btns = [...root.querySelectorAll('.bar button')];
  const dpr = Math.min(2, window.devicePixelRatio || 1); cv.width = 560 * dpr; cv.height = 238 * dpr;
  const W = 560, H = 238;
  const P = { open: 1, scale: 1, lookX: 0, lookY: 0, y: 0, brow: 0, mouth: 0, wink: 0 };
  let mood = 'normal', moodUntil = 0, busy = false, last = performance.now(), raf = 0, blinkAt = performance.now() + 2500, blinkT = -1, idle = performance.now();
  let target = { x: 0, y: 0 }, timers = [], timerEnd = 0, step = 0, used = 0;
  const later = (ms, f) => timers.push(setTimeout(f, ms));
  function setMood(m, ms) { mood = m; moodUntil = ms ? performance.now() + ms : 0; }
  function caption(t) { cap.textContent = t; cap.classList.toggle('on', !!t); }
  function showCard(html) { card.innerHTML = html; card.classList.add('on'); }
  function hint(el) { root.querySelectorAll('.sim-hint').forEach(e => e.classList.remove('sim-hint')); if (el) el.classList.add('sim-hint'); }
  function onMove(e) {
    const r = cv.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width * W, y = (e.clientY - r.top) / r.height * H;
    target.x = Math.max(-1, Math.min(1, (x - W / 2) / 350 * 2)); target.y = Math.max(-1, Math.min(1, (y - H / 2) / 350 * 2));
    idle = performance.now(); if (mood === 'sleeping') setMood('startled', 900);
  }
  function onClick() {
    idle = performance.now();
    if (busy) return;
    setMood('laughing', 1300); caption('Hi hi, ça chatouille !'); later(1400, () => caption(''));
    if (step >= 3) { ctx.setStep(4); }
  }
  function run(i) {
    if (busy) return; busy = true; used++; btns.forEach(b => b.disabled = true); idle = performance.now();
    const c = CMDS[i]; card.classList.remove('on');
    ctx.setStep(Math.max(step, 2)); step = Math.max(step, 2);
    setMood('listening'); caption('J’écoute…');
    later(1100, () => { setMood('focused'); caption('« ' + c.say + ' »'); });
    later(2000, () => { setMood('thumbs', 1100); });
    later(3100, () => {
      setMood('talking', 2200); caption(c.reply); ctx.setStep(3); step = 3;
      if (c.k === 'todo') showCard('<b>Tâches</b>☐ Appeler le fournisseur<br>☐ Relire la maquette<br><span class="ok">☑ Corriger le bug du PIN</span>');
      if (c.k === 'timer') { timerEnd = performance.now() + 25 * 60 * 1000; showCard('<b>Pomodoro</b><div class="seg">25:00</div>'); }
      if (c.k === 'brief') showCard('<b>Le point du matin</b>☀️ Ensoleillé, 31 °C<br>📅 10:00 Réunion d’équipe<br>✅ 3 tâches restantes');
      if (c.k === 'weather') showCard('<b>Météo</b>☀️ 31 °C · ressenti 35 °C<br>Pluie peu probable');
      if (c.k === 'work') showCard('<b>Mode travail</b><span class="ok">✓</span> Projet ouvert<br><span class="ok">✓</span> Serveur lancé<br><span class="ok">✓</span> Mode discret<br><span class="ok">✓</span> Pomodoro 25 min');
    });
    later(5400, () => { setMood('normal'); caption(''); busy = false; btns.forEach(b => b.disabled = false);
      if (used === 1) { ctx.toast('Clique sur ses yeux !'); hint(null); cv.classList.add('sim-hint'); }
      else hint(null);
    });
  }
  btns.forEach(b => b.addEventListener('click', () => { cv.classList.remove('sim-hint'); run(+b.dataset.i); }));
  cv.addEventListener('pointermove', onMove); cv.addEventListener('pointerdown', onClick);
  root.addEventListener('pointermove', e => { if (e.target !== cv) onMove(e); });

  function tgt() {
    const t = { open: 1, scale: 1, y: 0, brow: 0, mouth: 0, wink: 0, follow: 1, color: 'cyan' };
    if (mood === 'listening') Object.assign(t, { scale: .82, y: -14, follow: .2 });
    if (mood === 'focused') Object.assign(t, { open: .72, brow: 1, follow: .3 });
    if (mood === 'thumbs') Object.assign(t, { wink: 1, mouth: .3 });
    if (mood === 'talking') Object.assign(t, { y: -8, mouth: 1 });
    if (mood === 'laughing') Object.assign(t, { open: 0, mouth: 1 });
    if (mood === 'startled') Object.assign(t, { scale: 1.18 });
    if (mood === 'sleeping') Object.assign(t, { open: 0, follow: 0 });
    return t;
  }
  function rr(x, y, w, h, r) { g.beginPath(); g.roundRect(x, y, w, h, r); }
  function draw(now) {
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    if (moodUntil && now > moodUntil) { mood = 'normal'; moodUntil = 0; }
    if (!busy && mood === 'normal' && now - idle > 20000) setMood('sleeping');
    const t = tgt(), k = 1 - Math.exp(-dt * (mood === 'startled' || mood === 'thumbs' ? 20 : mood === 'sleeping' ? 4 : 10));
    for (const key of ['open', 'scale', 'y', 'brow', 'mouth', 'wink']) P[key] += (t[key] - P[key]) * k;
    P.lookX += (target.x * t.follow - P.lookX) * k; P.lookY += (target.y * t.follow - P.lookY) * k;
    if (blinkT < 0 && now > blinkAt && mood !== 'sleeping' && mood !== 'laughing') { blinkT = 0; blinkAt = now + 2200 + Math.random() * 3800; }
    let blink = 1; if (blinkT >= 0) { blinkT += dt; const p = blinkT / .17; blink = p < .5 ? 1 - p * 2 : (p - .5) * 2; if (p >= 1) { blinkT = -1; blink = 1; } }
    g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H); g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
    const ew = W * .14 * P.scale, eh = H * .5 * P.scale, cy = H * .46 + P.y + P.lookY * 6, red = false;
    [-1, 1].forEach(side => {
      const cx = W / 2 + side * W * .12 + P.lookX * W * .03;
      let open = Math.max(0, Math.min(1, P.open)) * blink; if (side === -1) open *= 1 - P.wink * .92;
      const h = Math.max(6, eh * open), top = cy - h * .8 + (eh - h) * .3;
      g.save(); g.shadowColor = 'rgba(115,247,255,.7)'; g.shadowBlur = ew * .28;
      if (open < .12) {
        g.strokeStyle = '#40E0FF'; g.lineWidth = 6; g.lineCap = 'round'; g.beginPath();
        if (mood === 'laughing') { g.moveTo(cx - ew * .4, cy + 6); g.lineTo(cx, cy - 12); g.lineTo(cx + ew * .4, cy + 6); }
        else g.arc(cx, cy - 6, ew * .42, Math.PI * .15, Math.PI * .85);
        g.stroke();
      } else {
        const gr = g.createLinearGradient(0, top, 0, top + h); gr.addColorStop(0, red ? '#8C000F' : '#0099D9'); gr.addColorStop(1, red ? '#FF4033' : '#73F7FF');
        g.fillStyle = gr; rr(cx - ew / 2, top, ew, h, [ew * .48]); g.fill(); g.shadowBlur = 0;
        const px = cx + P.lookX * ew * .14, py = top + h * .5 + P.lookY * h * .1, pw = ew * .46, ph = Math.min(h * .5, eh * .5);
        g.fillStyle = '#001A33'; g.beginPath(); g.ellipse(px, py, pw / 2, ph / 2, 0, 0, 6.3); g.fill();
        g.fillStyle = 'rgba(255,255,255,.95)'; g.beginPath(); g.arc(px - pw * .22, py - ph * .22, ew * .1, 0, 6.3); g.fill(); g.beginPath(); g.arc(px + pw * .2, py + ph * .2, ew * .04, 0, 6.3); g.fill();
      }
      if (P.brow > .05) { g.strokeStyle = '#40E0FF'; g.lineWidth = 5; g.lineCap = 'round'; g.globalAlpha = P.brow; g.beginPath(); g.moveTo(cx - ew * .5, top - 12 - side * 6); g.lineTo(cx + ew * .5, top - 12 + side * 6); g.stroke(); g.globalAlpha = 1; }
      g.restore();
    });
    if (mood === 'thumbs' || P.wink > .5) { g.font = '34px system-ui'; g.textAlign = 'center'; g.fillText('👍', W / 2 + W * .28, cy + 10); }
    if (P.mouth > .05) {
      const o = mood === 'talking' ? Math.abs(Math.sin(now / 1000 * 12)) * P.mouth : P.mouth * .6, mw = W * .07, my = H * .8 + P.y * .4;
      g.save(); g.shadowColor = 'rgba(115,247,255,.6)'; g.shadowBlur = 10; g.fillStyle = '#00293D'; g.strokeStyle = '#40E0FF'; g.lineWidth = 3;
      g.beginPath(); g.moveTo(W / 2 - mw, my); g.quadraticCurveTo(W / 2, my + 4 + o * 30, W / 2 + mw, my); g.closePath(); g.fill(); g.stroke();
      if (o > .3) { g.fillStyle = '#FF7399'; g.beginPath(); g.ellipse(W / 2, my + o * 14, mw * .45, o * 6, 0, 0, 6.3); g.fill(); }
      g.restore();
    }
    if (mood === 'sleeping') { g.fillStyle = '#40E0FF'; g.font = '700 18px Inter,system-ui'; for (let i = 0; i < 3; i++) { const p = ((now / 1000 * .5) + i / 3) % 1; g.globalAlpha = 1 - p; g.fillText('z', W / 2 + 70 + p * 50, H * .35 - p * 50); } g.globalAlpha = 1; }
    if (mood === 'listening') { g.fillStyle = '#D8F6FF'; g.save(); g.translate(W / 2, H * .83); g.rotate(-.05); g.fillRect(-34, -22, 68, 34); g.strokeStyle = '#1A7A90'; g.lineWidth = 1; for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(-26, -12 + i * 9); g.lineTo(-26 + ((now / 25 + i * 40) % 52), -12 + i * 9); g.stroke(); } g.restore(); }
    if (timerEnd && card.classList.contains('on')) { const s = Math.max(0, Math.round((timerEnd - now) / 1000)); const el = card.querySelector('.seg'); if (el) el.textContent = String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); }
    raf = requestAnimationFrame(draw);
  }
  function start() { ctx.setStep(0); step = 0; used = 0; later(2600, () => { if (step < 1) { ctx.setStep(1); step = 1; hint(btns[0]); } }); }
  raf = requestAnimationFrame(draw); start();
  return {
    destroy() { cancelAnimationFrame(raf); timers.forEach(clearTimeout); timers = []; },
    reset() { timers.forEach(clearTimeout); timers = []; busy = false; btns.forEach(b => b.disabled = false); setMood('normal'); caption(''); card.classList.remove('on'); timerEnd = 0; cv.classList.remove('sim-hint'); hint(null); start(); }
  };
}
window.MuseumSims.iris = {
  frame: 'mac',
  steps: ['Bouge la souris : elle te regarde', 'Choisis une commande vocale', 'Elle écoute, réfléchit, comprend', 'Elle agit et te répond', 'Clique sur ses yeux'],
  mount
};
})();
