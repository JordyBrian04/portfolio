/* Partie site : démo en direct, projets, compteurs, contact. */
(function () {
'use strict';
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const P = window.PROJECTS || [], ST = window.PROJECT_STATUS || {};
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const logo = (p, cls = '') => p.logo ? `<img class="${cls}" src="${p.logo}" alt="" width="46" height="46">` : `<span class="lt ${cls}" style="background:${p.color}">${esc((p.logoText || p.name).slice(0, 5))}</span>`;

// Navigation : bordure au défilement
const nav = $('#nav');
const onScroll = () => nav.classList.toggle('scrolled', scrollY > 8);
addEventListener('scroll', onScroll, { passive: true }); onScroll();

// Démo en direct dans le téléphone du hero
let demo = null;
const silent = { setStep() {}, toast() {}, reduced };
function fitHero() {
  const dev = $('#heroDev'), box = $('.demo-stage'); if (!dev || !box) return;
  const s = Math.min(1, (box.clientWidth - 8) / 344, (innerWidth < 980 ? 560 : Math.max(480, innerHeight - 200)) / 684);
  dev.style.transform = `scale(${s})`; dev.style.marginBottom = `${-684 * (1 - s)}px`;
  dev.style.marginLeft = dev.style.marginRight = `${-344 * (1 - s) / 2}px`;
}
function showDemo(id) {
  const sim = (window.MuseumSims || {})[id], p = P.find(x => x.id === id), scr = $('#heroScreen');
  if (demo && demo.destroy) { try { demo.destroy(); } catch (e) {} }
  demo = null;
  scr.className = 'mu-screen'; scr.innerHTML = ''; scr.setAttribute('style', '');
  $('.hero-demo').style.setProperty('--c', p ? p.color : '#2563eb');
  $('#heroMore').setAttribute('data-museum-open', id);
  $$('.demo-tabs button').forEach(b => b.setAttribute('aria-selected', String(b.dataset.demo === id)));
  if (!sim) { scr.innerHTML = `<div class="mu-ph" style="--c:${p ? p.color : '#2563eb'}"><div class="mu-ph-logo">${esc(p ? p.name : id)}</div><p>${esc(p ? p.pitch : '')}</p></div>`; return; }
  try { demo = sim.mount(scr, silent); } catch (e) { console.error(e); }
}
$$('.demo-tabs button').forEach(b => b.addEventListener('click', () => showDemo(b.dataset.demo)));
addEventListener('resize', fitHero); fitHero(); showDemo('sika');

// En ce moment : puces des projets
$('#nowChips').innerHTML = P.filter(p => p.status !== 'done').map(p => `<button type="button" data-museum-open="${p.id}">${logo(p)}${esc(p.name)}</button>`).join('');

// Projet terminé à la une : Sika App
const sika = P.find(p => p.status === 'done');
if (sika) $('#featured').innerHTML = `
  <div style="position:relative;z-index:1">
    <span class="tag">${ST.done}</span>
    <h3>${logo(sika)} ${esc(sika.name)}</h3>
    <p>${esc(sika.pitch)} ${esc(sika.forWho)}</p>
    <ul>${sika.unique.map(u => `<li>${esc(u)}</li>`).join('')}</ul>
    <div class="chips">${sika.stack.map(s => `<span>${esc(s)}</span>`).join('')}</div>
    <div class="acts"><a class="btn dark" href="${sika.link}" target="_blank" rel="noopener">${esc(sika.linkLabel)} ↗</a><button type="button" class="btn line" style="border-color:#fff;color:#fff;background:none;cursor:pointer" data-museum-open="sika">Essayer la démo</button></div>
  </div>
  <div class="shot" aria-label="Prix de Sika Pro"><div><b>1 500</b>FCFA / mois</div><div><b>15 000</b>FCFA / an</div><div><b>80 000</b>FCFA à vie</div>
    <div style="grid-column:1/-1"><b>Sika Pro</b>Sync cloud, rapports PDF, budgets illimités. Paiement par Wave.</div></div>`;

// Projets en construction
$('#pgrid').innerHTML = P.filter(p => p.status !== 'done').map(p => `
  <article class="pcard" style="--c:${p.color}">
    <div class="pcard-top">${logo(p)}<div><h4>${esc(p.name)}</h4><small>${esc(p.kind)}</small></div></div>
    <p>${esc(p.pitch)}</p>
    <div class="meta"><span class="st ${p.status}">${ST[p.status]}</span><span>${esc(p.owner)}</span></div>
    ${p.placeholder ? `<button type="button" class="off" data-museum-open="${p.id}">Captures à venir</button>` : `<button type="button" data-museum-open="${p.id}">Essayer la démo →</button>`}
  </article>`).join('');

// Bandeau des technologies
const tech = ['Laravel', 'Node.js', 'Express', 'React', 'React Native', 'Expo', 'TypeScript', 'PHP', 'MySQL', 'PostgreSQL', 'Supabase', 'Swift', 'Nginx', 'PM2', 'Linux', 'Git', 'WordPress', 'WinDev'];
$('#mq').innerHTML = tech.concat(tech).map(t => `<span>${t}</span>`).join('');

// Compteurs
function countUp(el) {
  const to = +el.dataset.count, pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
  if (reduced) { el.textContent = pre + to + suf; return; }
  const st = performance.now();
  (function f(n) { const k = Math.min(1, (n - st) / 1100), e = 1 - Math.pow(1 - k, 3); el.textContent = pre + Math.round(to * e) + suf; if (k < 1) requestAnimationFrame(f); })(st);
}

// Compteurs lancés quand la section des réalisations devient visible (le contenu reste toujours visible)
const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.querySelectorAll('[data-count]').forEach(countUp); io.unobserve(e.target);
}), { threshold: .05 }) : null;
if (io) io.observe($('#realisations')); else $$('[data-count]').forEach(countUp);

// Contact : le type de projet pré-remplit le message
const base = 'Bonjour Jordy, j’ai un projet : ';
let kind = '';
function upd() {
  const msg = base + (kind || 'je voudrais en parler avec vous') + '.';
  $('#waLink').href = 'https://wa.me/2250717207266?text=' + encodeURIComponent(msg);
  $('#mailLink').href = 'mailto:briangboko33@gmail.com?subject=' + encodeURIComponent('Projet' + (kind ? ' : ' + kind : '')) + '&body=' + encodeURIComponent(msg);
}
$$('.pick button').forEach(b => b.addEventListener('click', () => {
  const on = b.getAttribute('aria-pressed') !== 'true';
  $$('.pick button').forEach(x => x.setAttribute('aria-pressed', 'false'));
  b.setAttribute('aria-pressed', String(on)); kind = on ? b.dataset.k : ''; upd();
}));
upd();
})();
