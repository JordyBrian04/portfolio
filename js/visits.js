/* Compteur de visites : compte une visite par session et affiche le total.
   Sans API (Netlify, test local sans serveur), rien ne s'affiche. */
(function () {
'use strict';
const API = '/api/visits';
function visitorId() {
  try {
    let v = localStorage.getItem('jb-vid');
    if (!v) { v = (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2)); localStorage.setItem('jb-vid', v); }
    return v;
  } catch (e) { return ''; }
}
function alreadySent() { try { return sessionStorage.getItem('jb-visit-sent') === '1'; } catch (e) { return false; } }
function markSent() { try { sessionStorage.setItem('jb-visit-sent', '1'); } catch (e) {} }
const fmt = n => new Intl.NumberFormat('fr-FR').format(n);
function show(s) {
  if (!s || typeof s.total !== 'number' || s.total < 1) return;
  document.querySelectorAll('[data-visits]').forEach(el => {
    el.querySelectorAll('[data-visits-total]').forEach(n => { n.textContent = fmt(s.total); });
    el.querySelectorAll('[data-visits-today]').forEach(n => { n.textContent = fmt(s.today); });
    el.setAttribute('title', `${fmt(s.total)} visites au total, ${fmt(s.visitors)} visiteurs, ${fmt(s.today)} aujourd'hui`);
    el.hidden = false;
  });
}
async function run() {
  try {
    const page = /site\.html$/.test(location.pathname) ? 'site' : 'carte';
    const r = alreadySent()
      ? await fetch(API, { cache: 'no-store' })
      : await fetch(API, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ vid: visitorId(), page }) });
    if (!r.ok) return;
    markSent();
    show(await r.json());
  } catch (e) { /* pas d'API : le compteur reste masqué */ }
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
