/* Musée des projets : salle par projet, simulation interactive dans un appareil, guide pas à pas. */
(function () {
'use strict';
const P = window.PROJECTS || [], ST = window.PROJECT_STATUS || {}, SIMS = () => window.MuseumSims || {};
const ic = (n, s) => (window.icon ? window.icon(n, s) : '');
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
let el, cur = -1, inst = null, toastT = 0, lastFocus = null;

function logo(p, cls) {
  return p.logo ? `<img class="${cls}" src="${p.logo}" alt="" width="40" height="40">`
    : `<span class="${cls} txt" style="--c:${p.color}">${esc((p.logoText || p.name).slice(0, p.logoText && p.logoText.length <= 5 ? 5 : 2))}</span>`;
}
function build() {
  el = document.createElement('div'); el.id = 'museum'; el.className = 'mu'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'Musée des projets'); el.setAttribute('aria-hidden', 'true');
  el.innerHTML = `
  <header class="mu-top">
    <div class="mu-brand"><span class="mu-dot"></span><div><b>Musée des projets</b><span id="muCount"></span></div></div>
    <nav class="mu-rooms" aria-label="Salles du musée">${P.map((p, i) => `<button type="button" class="mu-room" data-i="${i}" style="--c:${p.color}">${logo(p, 'mu-rl')}<span><b>${esc(p.name)}</b><small>${ST[p.status] || ''}</small></span></button>`).join('')}</nav>
    <button type="button" class="mu-x" id="muClose" aria-label="Quitter le musée">${ic('x', 20)}</button>
  </header>
  <main class="mu-stage">
    <section class="mu-dev-wrap" aria-label="Démonstration interactive">
      <div class="mu-toast" id="muToast" role="status"></div>
      <div class="mu-dev" id="muDev"><div class="mu-screen" id="muScreen"></div></div>
      <div class="mu-dev-actions"><button type="button" id="muReset" class="mu-ghost">↺ Recommencer la démo</button></div>
    </section>
    <aside class="mu-info" id="muInfo"></aside>
  </main>
  <footer class="mu-foot"><button type="button" id="muPrev" class="mu-nav">← Salle précédente</button><button type="button" id="muNext" class="mu-nav mu-next">Salle suivante →</button></footer>`;
  document.body.appendChild(el);
  el.querySelectorAll('.mu-room').forEach(b => b.addEventListener('click', () => show(+b.dataset.i)));
  el.querySelector('#muClose').onclick = close;
  el.querySelector('#muPrev').onclick = () => show((cur - 1 + P.length) % P.length);
  el.querySelector('#muNext').onclick = () => show((cur + 1) % P.length);
  el.querySelector('#muReset').onclick = () => inst && inst.reset && inst.reset();
  window.addEventListener('resize', fit);
}
function toast(t) { const n = el.querySelector('#muToast'); n.textContent = t; n.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => n.classList.remove('on'), 2600); }
function setStep(i) { el.querySelectorAll('.mu-steps li').forEach((li, k) => { li.classList.toggle('done', k < i); li.classList.toggle('now', k === i); }); }
function fit() {
  if (!el || cur < 0) return;
  const dev = el.querySelector('#muDev'), wrap = el.querySelector('.mu-dev-wrap');
  const mac = dev.classList.contains('mac'), w = mac ? 600 : 344, h = mac ? 375 : 684;
  const aw = wrap.clientWidth - 8, ah = Math.max(260, wrap.clientHeight - 56);
  const s = Math.min(1, aw / w, ah / h);
  dev.style.transform = `scale(${s})`; dev.style.marginBottom = `${-(h * (1 - s))}px`; dev.style.marginLeft = dev.style.marginRight = `${-(w * (1 - s)) / 2}px`;
}
function placeholderSim(p) {
  return { frame: 'phone', steps: ['Captures en préparation'], mount(root) {
    root.innerHTML = `<div class="mu-ph" style="--c:${p.color}"><div class="mu-ph-logo">${esc(p.logoText || p.name)}</div><p>${esc(p.pitch)}</p>
      <div class="mu-ph-shots"><span>Capture à venir</span><span>Capture à venir</span></div><ul>${p.unique.map(u => `<li>${esc(u)}</li>`).join('')}</ul></div>`;
    return { destroy() {}, reset() {} };
  } };
}
function show(i) {
  if (inst && inst.destroy) { try { inst.destroy(); } catch (e) {} }
  inst = null; cur = i; const p = P[i];
  const sim = p.placeholder ? placeholderSim(p) : (SIMS()[p.id] || placeholderSim(p));
  el.querySelectorAll('.mu-room').forEach((b, k) => { b.classList.toggle('on', k === i); b.setAttribute('aria-current', k === i ? 'true' : 'false'); });
  const room = el.querySelector(`.mu-room[data-i="${i}"]`); room && room.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  el.style.setProperty('--c', p.color);
  el.querySelector('#muCount').textContent = `Salle ${i + 1} sur ${P.length}`;
  const dev = el.querySelector('#muDev'); dev.className = 'mu-dev ' + (sim.frame === 'mac' ? 'mac' : 'phone');
  dev.innerHTML = sim.frame === 'mac' ? `<div class="mu-mac-bar"><i></i><i></i><i></i><span>IRIS</span></div><div class="mu-screen mac" id="muScreen"></div>` : `<div class="mu-notch"></div><div class="mu-screen" id="muScreen"></div>`;
  el.querySelector('#muInfo').innerHTML = `
    <div class="mu-badges"><span class="mu-st ${p.status}">${ST[p.status] || ''}</span><span class="mu-own">${esc(p.owner)}</span></div>
    <div class="mu-title">${logo(p, 'mu-logo')}<div><h2>${esc(p.name)}</h2><p class="mu-kind">${esc(p.kind)}</p></div></div>
    <p class="mu-pitch">${esc(p.pitch)}</p>
    <p class="mu-for"><b>Pour qui ?</b> ${esc(p.forWho)}</p>
    ${p.placeholder ? '' : `<h3>Essaie la démo</h3><ol class="mu-steps">${sim.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol>`}
    <h3>Ce qui la rend unique</h3><ul class="mu-unique">${p.unique.map(u => `<li>${esc(u)}</li>`).join('')}</ul>
    <h3>Technologies</h3><div class="mu-stack">${p.stack.map(s => `<span>${esc(s)}</span>`).join('')}</div>
    ${p.link ? `<a class="mu-link" href="${p.link}" target="_blank" rel="noopener">${esc(p.linkLabel || 'Voir le projet')} ↗</a>` : ''}
    <p class="mu-note">${p.placeholder ? 'Les captures d’écran arrivent bientôt.' : 'Démo simulée avec des données fictives, fidèle aux écrans de l’application.'}</p>`;
  el.querySelector('#muReset').style.visibility = p.placeholder ? 'hidden' : 'visible';
  const screen = el.querySelector('#muScreen');
  try { inst = sim.mount(screen, { setStep, toast, reduced: matchMedia('(prefers-reduced-motion: reduce)').matches }) || null; }
  catch (e) { screen.innerHTML = '<p class="mu-err">La démo n’a pas pu démarrer.</p>'; console.error(e); }
  if (!p.placeholder) setStep(0);
  el.querySelector('#muInfo').scrollTop = 0;
  requestAnimationFrame(fit);
}
function open(id) {
  if (!el) build();
  lastFocus = document.activeElement;
  el.classList.add('open'); el.setAttribute('aria-hidden', 'false'); document.body.classList.add('mu-open');
  const i = Math.max(0, P.findIndex(p => p.id === id));
  show(id ? i : (cur >= 0 ? cur : 0));
  el.querySelector('#muClose').focus({ preventScroll: true });
}
function close() {
  if (!el) return;
  if (inst && inst.destroy) { try { inst.destroy(); } catch (e) {} } inst = null;
  el.classList.remove('open'); el.setAttribute('aria-hidden', 'true'); document.body.classList.remove('mu-open');
  if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
}
document.addEventListener('keydown', e => {
  if (!el || !el.classList.contains('open')) return;
  if (e.key === 'Escape') { e.stopImmediatePropagation(); close(); }
  else if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && !(e.target.closest && e.target.closest('.mu-screen, input'))) {
    e.preventDefault(); e.stopImmediatePropagation(); show((cur + (e.key === 'ArrowRight' ? 1 : -1) + P.length) % P.length);
  } else if (e.key !== 'Tab') e.stopImmediatePropagation();
}, true);
document.addEventListener('click', e => { const b = e.target.closest && e.target.closest('[data-museum-open]'); if (b) { e.preventDefault(); open(b.getAttribute('data-museum-open') || undefined); } });
window.Museum = { open, close };
})();
