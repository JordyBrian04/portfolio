/* Simulation « Sika » pour le musée des projets — voir js/sims/CONTRAT.md */
(function () {
  'use strict';

  var ID = 'sika';
  var BLUE = '#265ed7';

  var CSS = [
    '.sim-sika{font-family:Poppins,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#1E1E1E;background:#f5f5f5;-webkit-tap-highlight-color:transparent;}',
    '.sim-sika *,.sim-sika *::before,.sim-sika *::after{box-sizing:border-box;}',
    '.sim-sika button{font:inherit;color:inherit;border:0;background:none;padding:0;margin:0;cursor:pointer;touch-action:manipulation;}',
    '.sim-sika button:disabled{cursor:default;}',
    '.sim-sika button:focus-visible{outline:2px solid ' + BLUE + ';outline-offset:2px;}',
    '.sim-sika .sk-app{position:absolute;inset:0;background:#f5f5f5;display:flex;flex-direction:column;overflow:hidden;}',
    '.sim-sika .sk-status{flex:0 0 26px;display:flex;align-items:center;justify-content:space-between;padding:0 18px;font-size:12px;font-weight:600;}',
    '.sim-sika .sk-screens{position:relative;flex:1 1 auto;min-height:0;}',
    '.sim-sika .sk-screen{position:absolute;inset:0;padding:4px 16px 12px;overflow-x:hidden;overflow-y:auto;display:none;flex-direction:column;gap:10px;scrollbar-width:none;}',
    '.sim-sika .sk-screen::-webkit-scrollbar{display:none;}',
    '.sim-sika .sk-screen.is-on{display:flex;}',
    '.sim-sika.sk-anim .sk-screen.is-on{animation:sk-in .28s ease-out;}',
    '@keyframes sk-in{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:none;}}',
    /* en-tête */
    '.sim-sika .sk-head{display:flex;align-items:center;justify-content:space-between;}',
    '.sim-sika .sk-logo{display:flex;align-items:center;gap:8px;font-weight:700;font-size:20px;letter-spacing:-.2px;}',
    '.sim-sika .sk-logo img{width:30px;height:30px;border-radius:8px;object-fit:cover;}',
    '.sim-sika .sk-logo b{color:' + BLUE + ';}',
    '.sim-sika .sk-avatar{width:32px;height:32px;border-radius:50%;background:#e3ebfb;color:' + BLUE + ';display:grid;place-items:center;font-weight:700;font-size:14px;}',
    '.sim-sika .sk-hello{font-size:17px;font-weight:600;line-height:1.25;margin:0;}',
    '.sim-sika .sk-sub{font-size:12px;color:#808080;margin:2px 0 0;}',
    /* cartes */
    '.sim-sika .sk-card{background:#fff;border-radius:10px;padding:12px 14px;box-shadow:0 1px 3px rgba(0,0,0,.05);}',
    '.sim-sika .sk-balance{background:' + BLUE + ';color:#fff;border-radius:10px;padding:14px;}',
    '.sim-sika .sk-row{display:flex;align-items:center;justify-content:space-between;gap:8px;}',
    '.sim-sika .sk-label{font-size:12px;font-weight:500;}',
    '.sim-sika .sk-balance .sk-label{opacity:.85;}',
    '.sim-sika .sk-eye{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:rgba(255,255,255,.16);}',
    '.sim-sika .sk-eye svg{width:18px;height:18px;}',
    '.sim-sika .sk-amount{font-size:26px;font-weight:700;margin-top:2px;white-space:nowrap;letter-spacing:-.3px;}',
    '.sim-sika .sk-amount small{font-size:14px;font-weight:600;margin-left:4px;}',
    '.sim-sika .sk-mini{font-size:11px;opacity:.85;margin-top:2px;}',
    '.sim-sika .sk-bar{height:9px;border-radius:6px;background:#ececec;overflow:hidden;margin:8px 0 6px;}',
    '.sim-sika .sk-bar i{display:block;height:100%;width:100%;border-radius:6px;background:' + BLUE + ';transform-origin:left center;transform:scaleX(0);}',
    '.sim-sika.sk-anim .sk-bar i{transition:transform .7s cubic-bezier(.2,.8,.2,1),background-color .4s ease;}',
    '.sim-sika .sk-bar i.is-orange{background:#FF9500;}',
    '.sim-sika .sk-bar i.is-red{background:#FF3B30;}',
    '.sim-sika .sk-bar i.is-green{background:#34C759;}',
    '.sim-sika .sk-pct{font-size:13px;font-weight:700;}',
    '.sim-sika .sk-pct.is-orange{color:#FF9500;}',
    '.sim-sika .sk-pct.is-red{color:#FF3B30;}',
    '.sim-sika .sk-small{font-size:11.5px;color:#808080;line-height:1.35;}',
    '.sim-sika .sk-cta{width:100%;min-height:44px;border-radius:10px;background:' + BLUE + ';color:#fff;font-weight:600;font-size:14px;display:flex;align-items:center;justify-content:center;gap:6px;padding:0 12px;}',
    '.sim-sika .sk-cta:disabled{background:#b9c8ec;}',
    '.sim-sika .sk-cta.is-pro{background:#FEF08A;color:#1E1E1E;}',
    '.sim-sika .sk-cta.is-ghost{background:#fff;color:' + BLUE + ';border:1.5px solid ' + BLUE + ';}',
    '.sim-sika .sk-section{display:flex;align-items:baseline;justify-content:space-between;font-size:14px;font-weight:600;margin-top:2px;}',
    '.sim-sika .sk-section span{font-size:11px;font-weight:500;color:#808080;}',
    /* transactions */
    '.sim-sika .sk-list{display:flex;flex-direction:column;gap:6px;margin:0;padding:0;list-style:none;}',
    '.sim-sika .sk-tx{display:flex;align-items:center;gap:10px;background:#fff;border-radius:10px;padding:8px 10px;}',
    '.sim-sika.sk-anim .sk-tx.is-new{animation:sk-pop .45s cubic-bezier(.2,.9,.3,1.2);}',
    '@keyframes sk-pop{from{opacity:0;transform:translateY(-10px) scale(.96);}to{opacity:1;transform:none;}}',
    '.sim-sika .sk-ico{flex:0 0 32px;height:32px;border-radius:9px;background:#f0f3fa;display:grid;place-items:center;font-size:16px;}',
    '.sim-sika .sk-txt{flex:1 1 auto;min-width:0;}',
    '.sim-sika .sk-txt b{display:block;font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',
    '.sim-sika .sk-txt span{font-size:11px;color:#808080;}',
    '.sim-sika .sk-val{font-size:13px;font-weight:600;white-space:nowrap;}',
    '.sim-sika .sk-val.is-in{color:#34C759;}',
    '.sim-sika .sk-val.is-out{color:#FF3B30;}',
    /* barre d’onglets */
    '.sim-sika .sk-tabs{flex:0 0 58px;background:#1a1a1a;display:flex;align-items:stretch;padding:0 4px 4px;}',
    '.sim-sika .sk-tab{flex:1 1 0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;color:#8d8d8d;font-size:9.5px;font-weight:500;min-width:0;border-radius:10px;}',
    '.sim-sika .sk-tab .sk-ti{font-size:17px;line-height:1;filter:grayscale(1);opacity:.75;}',
    '.sim-sika .sk-tab.is-on{color:#fff;}',
    '.sim-sika .sk-tab.is-on .sk-ti{filter:none;opacity:1;}',
    /* feuille du bas */
    '.sim-sika .sk-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.4);opacity:0;pointer-events:none;z-index:5;}',
    '.sim-sika .sk-backdrop.is-on{opacity:1;pointer-events:auto;}',
    '.sim-sika.sk-anim .sk-backdrop{transition:opacity .25s ease;}',
    '.sim-sika .sk-sheet{position:absolute;left:0;right:0;bottom:0;z-index:6;background:#fff;border-radius:18px 18px 0 0;padding:8px 16px 16px;transform:translateY(105%);visibility:hidden;display:flex;flex-direction:column;gap:12px;}',
    '.sim-sika .sk-sheet.is-on{transform:none;visibility:visible;}',
    '.sim-sika.sk-anim .sk-sheet{transition:transform .32s cubic-bezier(.2,.8,.2,1),visibility .32s;}',
    '.sim-sika .sk-grab{width:40px;height:4px;border-radius:2px;background:#ddd;margin:0 auto 2px;}',
    '.sim-sika .sk-sheet h3{margin:0;font-size:16px;font-weight:600;}',
    '.sim-sika .sk-close{width:32px;height:32px;border-radius:50%;background:#f2f2f2;display:grid;place-items:center;font-size:14px;}',
    '.sim-sika .sk-seg{display:flex;background:#f2f2f2;border-radius:10px;padding:3px;gap:3px;}',
    '.sim-sika .sk-seg button{flex:1 1 0;min-height:36px;border-radius:8px;font-size:13px;font-weight:600;color:#808080;}',
    '.sim-sika .sk-seg button.is-on[data-type="in"]{background:#34C759;color:#fff;}',
    '.sim-sika .sk-seg button.is-on[data-type="out"]{background:#FF3B30;color:#fff;}',
    '.sim-sika .sk-big{font-size:28px;font-weight:700;text-align:center;letter-spacing:-.3px;white-space:nowrap;}',
    '.sim-sika .sk-big.is-empty{color:#c4c4c4;}',
    '.sim-sika .sk-field{font-size:12px;font-weight:500;color:#808080;margin-bottom:6px;}',
    '.sim-sika .sk-chips{display:flex;flex-wrap:wrap;gap:8px;}',
    '.sim-sika .sk-chip{min-height:38px;padding:0 12px;border-radius:20px;background:#f2f2f2;font-size:13px;font-weight:600;display:inline-flex;align-items:center;gap:6px;}',
    '.sim-sika .sk-chip.is-on{background:' + BLUE + ';color:#fff;}',
    '.sim-sika .sk-chips.is-amounts .sk-chip{flex:1 1 0;justify-content:center;padding:0 6px;}',
    /* épargne */
    '.sim-sika .sk-title{font-size:19px;font-weight:700;margin:2px 0 0;}',
    '.sim-sika .sk-saved{font-size:24px;font-weight:700;color:' + BLUE + ';white-space:nowrap;}',
    '.sim-sika .sk-mission{display:flex;align-items:center;gap:10px;}',
    '.sim-sika .sk-xp{font-size:11px;font-weight:700;color:#FF9500;background:#fff4e0;border-radius:12px;padding:3px 8px;white-space:nowrap;}',
    '.sim-sika .sk-badges{display:flex;flex-wrap:wrap;gap:6px;}',
    '.sim-sika .sk-bdg{font-size:11px;font-weight:600;border-radius:14px;padding:5px 9px;background:#ececec;color:#9a9a9a;}',
    '.sim-sika .sk-bdg.is-on{background:#e3ebfb;color:' + BLUE + ';}',
    '.sim-sika.sk-anim .sk-bdg.is-new{animation:sk-pop .5s ease-out;}',
    /* badge débloqué */
    '.sim-sika .sk-toastcard{position:absolute;left:24px;right:24px;top:38%;z-index:8;background:#fff;border-radius:16px;padding:18px 16px;text-align:center;box-shadow:0 12px 40px rgba(0,0,0,.22);opacity:0;transform:scale(.9);pointer-events:none;}',
    '.sim-sika .sk-toastcard.is-on{opacity:1;transform:none;}',
    '.sim-sika.sk-anim .sk-toastcard{transition:opacity .25s ease,transform .3s cubic-bezier(.2,.9,.3,1.3);}',
    '.sim-sika .sk-toastcard .sk-medal{font-size:38px;line-height:1;}',
    '.sim-sika .sk-toastcard b{display:block;font-size:15px;margin-top:6px;}',
    '.sim-sika .sk-toastcard span{font-size:12px;color:#808080;}',
    /* paywall */
    '.sim-sika .sk-pro{position:absolute;inset:0;z-index:7;background:#fff;display:flex;flex-direction:column;padding:34px 16px 16px;gap:10px;opacity:0;visibility:hidden;transform:translateY(16px);}',
    '.sim-sika .sk-pro.is-on{opacity:1;visibility:visible;transform:none;}',
    '.sim-sika.sk-anim .sk-pro{transition:opacity .3s ease,transform .3s ease,visibility .3s;}',
    '.sim-sika .sk-prohead{background:#FEF08A;border-radius:14px;padding:14px;text-align:center;}',
    '.sim-sika .sk-prohead .sk-star{font-size:28px;line-height:1;}',
    '.sim-sika .sk-prohead h3{margin:4px 0 2px;font-size:20px;font-weight:700;}',
    '.sim-sika .sk-prohead h3 b{color:' + BLUE + ';}',
    '.sim-sika .sk-prohead p{margin:0;font-size:12px;color:#5c5c5c;line-height:1.35;}',
    '.sim-sika .sk-plans{display:flex;flex-direction:column;gap:8px;}',
    '.sim-sika .sk-plan{display:flex;align-items:center;gap:10px;width:100%;text-align:left;border:1.5px solid #e2e2e2;border-radius:12px;padding:10px 12px;background:#fff;}',
    '.sim-sika .sk-plan.is-on{border-color:' + BLUE + ';background:#f3f7ff;}',
    '.sim-sika .sk-radio{flex:0 0 18px;height:18px;border-radius:50%;border:2px solid #c4c4c4;}',
    '.sim-sika .sk-plan.is-on .sk-radio{border:5px solid ' + BLUE + ';}',
    '.sim-sika .sk-plan .sk-txt b{white-space:normal;}',
    '.sim-sika .sk-price{font-size:13.5px;font-weight:700;white-space:nowrap;text-align:right;}',
    '.sim-sika .sk-save{display:inline-block;font-size:10px;font-weight:700;color:#fff;background:#34C759;border-radius:8px;padding:1px 6px;margin-left:4px;vertical-align:1px;}',
    '.sim-sika .sk-note{font-size:11px;color:#808080;text-align:center;margin:0;}',
    '.sim-sika .sk-spacer{flex:1 1 auto;}',
    '.sim-sika.sk-anim .sk-bump{animation:sk-bump .5s ease;}',
    '@keyframes sk-bump{0%{transform:scale(1);}40%{transform:scale(1.06);}100%{transform:scale(1);}}'
  ].join('\n');

  var EYE_OPEN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';
  var EYE_OFF = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3l18 18"/><path d="M10.6 5.1A10.6 10.6 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4.1M6.6 6.6C3.8 8.4 2 12 2 12s3.6 7 10 7a9.9 9.9 0 0 0 5.4-1.6"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>';

  var CATS = {
    out: [
      { key: 'Alimentation', icon: '🍽️', label: 'Marché' },
      { key: 'Transport', icon: '🚌', label: 'Taxi-moto' },
      { key: 'Loisirs', icon: '🎮', label: 'Sortie ciné' }
    ],
    in: [
      { key: 'Salaire', icon: '💼', label: 'Prime' }
    ]
  };
  var AMOUNTS = [5000, 10000, 30000];
  var BUDGET = 100000;
  var GOAL = 200000;
  var SAVE_STEP = 20000;

  function fcfa(n) {
    var s = String(Math.round(Math.abs(n))).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return (n < 0 ? '−' : '') + s;
  }
  function pctClass(p) { return p > 70 ? 'is-red' : (p > 50 ? 'is-orange' : ''); }

  function injectCss() {
    if (document.getElementById('sim-' + ID + '-css')) return;
    var st = document.createElement('style');
    st.id = 'sim-' + ID + '-css';
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  var TEMPLATE = [
    '<div class="sk-app">',
    '  <div class="sk-status" aria-hidden="true"><span>9:41</span><span>●●● 4G ▮</span></div>',
    '  <div class="sk-screens">',
    /* Accueil */
    '    <section class="sk-screen sk-home" aria-label="Accueil">',
    '      <div class="sk-head">',
    '        <div class="sk-logo"><img src="assets/musee/sika.png" alt="" data-ref="logoImg"><span><b>S</b>ika</span></div>',
    '        <div class="sk-avatar" aria-hidden="true">A</div>',
    '      </div>',
    '      <div><p class="sk-hello">Bienvenue, Awa 👋</p><p class="sk-sub">Vos finances de novembre</p></div>',
    '      <div class="sk-balance">',
    '        <div class="sk-row"><span class="sk-label">Solde Total</span>',
    '          <button type="button" class="sk-eye" data-act="eye" aria-label="Masquer le solde" data-ref="eye"></button></div>',
    '        <div class="sk-amount" data-ref="balance"></div>',
    '        <div class="sk-mini">Wave · Espèces · Banque</div>',
    '      </div>',
    '      <div class="sk-card">',
    '        <div class="sk-row"><span class="sk-label">Budget mensuel</span><span class="sk-pct" data-ref="budgetPct"></span></div>',
    '        <div class="sk-bar"><i data-ref="budgetBar"></i></div>',
    '        <div class="sk-small" data-ref="budgetTxt"></div>',
    '      </div>',
    '      <button type="button" class="sk-cta" data-act="open" data-ref="openBtn"><span aria-hidden="true">＋</span> Nouvelle transaction</button>',
    '      <div class="sk-section">Récentes transactions <span>Aujourd’hui</span></div>',
    '      <ul class="sk-list" data-ref="list"></ul>',
    '    </section>',
    /* Épargne */
    '    <section class="sk-screen sk-savings" aria-label="Épargne">',
    '      <h2 class="sk-title">Épargne</h2>',
    '      <div class="sk-card"><div class="sk-label" style="color:#808080">Déjà épargné</div><div class="sk-saved" data-ref="saved"></div></div>',
    '      <div class="sk-card">',
    '        <div class="sk-row"><span class="sk-label">✈️ Épargne voyage</span><span class="sk-pct" data-ref="goalPct"></span></div>',
    '        <div class="sk-bar"><i class="is-green" data-ref="goalBar"></i></div>',
    '        <div class="sk-small" data-ref="goalTxt"></div>',
    '        <div style="height:10px"></div>',
    '        <button type="button" class="sk-cta" data-act="save" data-ref="saveBtn"></button>',
    '      </div>',
    '      <div class="sk-section">Missions de la semaine</div>',
    '      <div class="sk-card sk-mission"><div class="sk-ico" aria-hidden="true">⚡</div>',
    '        <div class="sk-txt"><b style="white-space:normal">Boost: 1 journée sans dépense</b><span>0 / 1 jour</span></div><span class="sk-xp">+50 XP</span></div>',
    '      <div class="sk-section">Badges</div>',
    '      <div class="sk-badges" data-ref="badges"></div>',
    '      <button type="button" class="sk-cta is-pro" data-act="pro" data-ref="proBtn">⭐ Découvrir Sika Pro</button>',
    '    </section>',
    '  </div>',
    '  <nav class="sk-tabs" aria-label="Onglets">',
    '    <button type="button" class="sk-tab" data-act="tab" data-tab="home"><span class="sk-ti" aria-hidden="true">🏠</span>Accueil</button>',
    '    <button type="button" class="sk-tab" data-act="tab" data-tab="budgets"><span class="sk-ti" aria-hidden="true">💰</span>Budgets</button>',
    '    <button type="button" class="sk-tab" data-act="tab" data-tab="stats"><span class="sk-ti" aria-hidden="true">📊</span>Statistiques</button>',
    '    <button type="button" class="sk-tab" data-act="tab" data-tab="savings" data-ref="savingsTab"><span class="sk-ti" aria-hidden="true">🐷</span>Épargne</button>',
    '    <button type="button" class="sk-tab" data-act="tab" data-tab="settings"><span class="sk-ti" aria-hidden="true">⚙️</span>Paramètres</button>',
    '  </nav>',
    /* Feuille « Nouvelle transaction » */
    '  <div class="sk-backdrop" data-act="close" data-ref="backdrop"></div>',
    '  <div class="sk-sheet" role="dialog" aria-label="Nouvelle transaction" data-ref="sheet">',
    '    <div class="sk-grab" aria-hidden="true"></div>',
    '    <div class="sk-row"><h3>Nouvelle transaction</h3><button type="button" class="sk-close" data-act="close" aria-label="Fermer">✕</button></div>',
    '    <div class="sk-seg" role="group" aria-label="Type">',
    '      <button type="button" data-act="type" data-type="in">Entrée</button>',
    '      <button type="button" data-act="type" data-type="out">Dépense</button>',
    '    </div>',
    '    <div class="sk-big" data-ref="sheetAmount"></div>',
    '    <div><div class="sk-field">Montant</div><div class="sk-chips is-amounts" data-ref="amounts"></div></div>',
    '    <div><div class="sk-field">Choisir une catégorie</div><div class="sk-chips" data-ref="cats"></div></div>',
    '    <button type="button" class="sk-cta" data-act="submit" data-ref="submit">Enregistrer la transaction</button>',
    '  </div>',
    /* Badge débloqué */
    '  <div class="sk-toastcard" role="status" data-ref="badgePop"><div class="sk-medal" aria-hidden="true">🏅</div><b>Badge débloqué : Épargnant</b><span>Premier versement vers un objectif</span></div>',
    /* Sika Pro */
    '  <div class="sk-pro" role="dialog" aria-label="Sika Pro" data-ref="pro">',
    '    <div class="sk-prohead"><div class="sk-star" aria-hidden="true">⭐</div><h3><b>S</b>ika Pro</h3><p>Débloquez toute la puissance de Sika pour piloter votre argent.</p></div>',
    '    <div class="sk-plans" data-ref="plans"></div>',
    '    <p class="sk-note">Démo : aucun paiement n’est effectué.</p>',
    '    <div class="sk-spacer"></div>',
    '    <button type="button" class="sk-cta" data-act="restart" data-ref="restart">↺ Recommencer</button>',
    '  </div>',
    '</div>'
  ].join('\n');

  var PLANS = [
    { id: 'month', name: 'Mensuel', price: '1 500 FCFA', per: '/ mois' },
    { id: 'year', name: 'Annuel', price: '15 000 FCFA', per: '/ an', save: '−17 %' },
    { id: 'life', name: 'À vie', price: '80 000 FCFA', per: 'une seule fois' }
  ];

  window.MuseumSims = window.MuseumSims || {};
  window.MuseumSims[ID] = {
    frame: 'phone',
    steps: [
      'Toucher « Nouvelle transaction »',
      'Choisir un montant et une catégorie',
      'Voir le budget changer de couleur',
      'Épargner pour son voyage',
      'Découvrir les offres Sika Pro'
    ],
    mount: function (root, ctx) {
      ctx = ctx || {};
      var reduced = !!ctx.reduced;
      var setStep = typeof ctx.setStep === 'function' ? ctx.setStep : function () {};
      var toast = typeof ctx.toast === 'function' ? ctx.toast : function () {};
      injectCss();

      root.classList.add('sim-' + ID);
      if (!reduced) root.classList.add('sk-anim');

      var timers = [];
      var rafId = 0;
      var refs = {};
      var S;

      function later(fn, ms) {
        var t = setTimeout(function () {
          timers.splice(timers.indexOf(t), 1);
          fn();
        }, ms);
        timers.push(t);
        return t;
      }
      function clearTimers() {
        timers.forEach(clearTimeout);
        timers = [];
        if (rafId) cancelAnimationFrame(rafId);
        rafId = 0;
      }

      function initialState() {
        return {
          screen: 'home',
          balance: 245000,
          shownBalance: 245000,
          masked: false,
          spent: 45000,
          tx: [
            { name: 'Salaire', cat: 'Salaire', icon: '💼', amount: 150000 },
            { name: 'Taxi', cat: 'Transport', icon: '🚕', amount: -2500 }
          ],
          sheet: false,
          type: 'out',
          amount: 0,
          cat: '',
          added: 0,
          saved: 120000,
          savedOnce: false,
          plan: 'year',
          pro: false
        };
      }

      function setHint(el) {
        var old = root.querySelectorAll('.sim-hint');
        for (var i = 0; i < old.length; i++) old[i].classList.remove('sim-hint');
        if (el) el.classList.add('sim-hint');
      }

      function bump(el) {
        if (reduced || !el) return;
        el.classList.remove('sk-bump');
        void el.offsetWidth;
        el.classList.add('sk-bump');
      }

      /* ---------- rendu ---------- */
      function renderBalance() {
        refs.balance.innerHTML = S.masked
          ? '•••••• <small>FCFA</small>'
          : fcfa(S.shownBalance) + '<small>FCFA</small>';
        refs.eye.innerHTML = S.masked ? EYE_OFF : EYE_OPEN;
        refs.eye.setAttribute('aria-label', S.masked ? 'Afficher le solde' : 'Masquer le solde');
      }

      function renderBudget() {
        var p = Math.round(S.spent / BUDGET * 100);
        var cls = pctClass(p);
        refs.budgetBar.style.transform = 'scaleX(' + Math.min(p, 100) / 100 + ')';
        refs.budgetBar.className = cls;
        refs.budgetPct.textContent = p + ' %';
        refs.budgetPct.className = 'sk-pct ' + cls;
        refs.budgetTxt.textContent = 'Dépensé : ' + fcfa(S.spent) + ' / ' + fcfa(BUDGET) + ' FCFA';
      }

      function txHtml(t, isNew) {
        var inn = t.amount > 0;
        return '<li class="sk-tx' + (isNew ? ' is-new' : '') + '"><div class="sk-ico" aria-hidden="true">' + t.icon + '</div>' +
          '<div class="sk-txt"><b>' + t.name + '</b><span>' + t.cat + '</span></div>' +
          '<div class="sk-val ' + (inn ? 'is-in' : 'is-out') + '">' + (inn ? '+' : '') + fcfa(t.amount) + ' FCFA</div></li>';
      }

      function renderList(newFirst) {
        refs.list.innerHTML = S.tx.slice(0, 3).map(function (t, i) { return txHtml(t, newFirst && i === 0); }).join('');
      }

      function renderSheet() {
        var segs = refs.sheet.querySelectorAll('[data-act="type"]');
        for (var i = 0; i < segs.length; i++) {
          var on = segs[i].getAttribute('data-type') === S.type;
          segs[i].classList.toggle('is-on', on);
          segs[i].setAttribute('aria-pressed', on ? 'true' : 'false');
        }
        refs.sheetAmount.textContent = S.amount ? fcfa(S.amount) + ' FCFA' : '0 FCFA';
        refs.sheetAmount.classList.toggle('is-empty', !S.amount);
        refs.amounts.innerHTML = AMOUNTS.map(function (a) {
          var on = a === S.amount;
          return '<button type="button" class="sk-chip' + (on ? ' is-on' : '') + '" data-act="amount" data-amount="' + a + '" aria-pressed="' + on + '">' + fcfa(a) + '</button>';
        }).join('');
        refs.cats.innerHTML = CATS[S.type].map(function (c) {
          var on = c.key === S.cat;
          return '<button type="button" class="sk-chip' + (on ? ' is-on' : '') + '" data-act="cat" data-cat="' + c.key + '" aria-pressed="' + on + '"><span aria-hidden="true">' + c.icon + '</span>' + c.key + '</button>';
        }).join('');
        refs.submit.disabled = !(S.amount && S.cat);
        refs.sheet.classList.toggle('is-on', S.sheet);
        refs.backdrop.classList.toggle('is-on', S.sheet);
      }

      function renderSavings() {
        var p = Math.round(S.saved / GOAL * 100);
        refs.saved.textContent = fcfa(S.saved) + ' FCFA';
        refs.goalBar.style.transform = 'scaleX(' + Math.min(p, 100) / 100 + ')';
        refs.goalPct.textContent = p + ' %';
        refs.goalTxt.textContent = fcfa(S.saved) + ' / ' + fcfa(GOAL) + ' FCFA' +
          (S.saved < GOAL ? ' · encore ' + fcfa(GOAL - S.saved) + ' FCFA' : ' · objectif atteint 🎯');
        if (S.saved >= GOAL) {
          refs.saveBtn.textContent = 'Objectif atteint 🎯';
          refs.saveBtn.disabled = true;
        } else {
          refs.saveBtn.textContent = 'Épargner ' + fcfa(SAVE_STEP) + ' FCFA';
          refs.saveBtn.disabled = false;
        }
        var badges = [
          { name: 'Premier mouvement', on: S.added > 0 },
          { name: 'Épargnant', on: S.savedOnce },
          { name: 'Objectif atteint', on: S.saved >= GOAL }
        ];
        refs.badges.innerHTML = badges.map(function (b) {
          return '<span class="sk-bdg' + (b.on ? ' is-on' : '') + '">' + (b.on ? '🏅 ' : '🔒 ') + b.name + '</span>';
        }).join('');
      }

      function renderPlans() {
        refs.plans.innerHTML = PLANS.map(function (p) {
          var on = p.id === S.plan;
          return '<button type="button" class="sk-plan' + (on ? ' is-on' : '') + '" data-act="plan" data-plan="' + p.id + '" aria-pressed="' + on + '">' +
            '<span class="sk-radio" aria-hidden="true"></span>' +
            '<span class="sk-txt"><b>' + p.name + (p.save ? '<span class="sk-save">' + p.save + '</span>' : '') + '</b><span>' + p.per + '</span></span>' +
            '<span class="sk-price">' + p.price + '</span></button>';
        }).join('');
      }

      function showScreen(name) {
        S.screen = name;
        var map = { home: refs.home, savings: refs.savings };
        Object.keys(map).forEach(function (k) { map[k].classList.toggle('is-on', k === name); });
        var tabs = root.querySelectorAll('.sk-tab');
        for (var i = 0; i < tabs.length; i++) {
          var on = tabs[i].getAttribute('data-tab') === name;
          tabs[i].classList.toggle('is-on', on);
          if (on) tabs[i].setAttribute('aria-current', 'page'); else tabs[i].removeAttribute('aria-current');
        }
        map[name].scrollTop = 0;
      }

      /* ---------- guidage ---------- */
      function guide() {
        if (S.pro) { setHint(refs.restart); return; }
        if (S.sheet) {
          if (!S.amount) setHint(refs.amounts.querySelector('[data-amount="10000"]'));
          else if (!S.cat) setHint(refs.cats.querySelector('.sk-chip'));
          else setHint(refs.submit);
          return;
        }
        if (S.screen === 'home') {
          setHint(S.added ? refs.savingsTab : refs.openBtn);
          return;
        }
        if (S.screen === 'savings') {
          setHint(S.savedOnce ? refs.proBtn : refs.saveBtn);
        }
      }

      function animateBalance(from, to) {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = 0;
        if (reduced) { S.shownBalance = to; renderBalance(); return; }
        var t0 = 0, dur = 750;
        function tick(ts) {
          if (!t0) t0 = ts;
          var k = Math.min(1, (ts - t0) / dur);
          var e = 1 - Math.pow(1 - k, 3);
          S.shownBalance = Math.round(from + (to - from) * e);
          renderBalance();
          if (k < 1) rafId = requestAnimationFrame(tick); else rafId = 0;
        }
        rafId = requestAnimationFrame(tick);
      }

      /* ---------- actions ---------- */
      function openSheet() {
        S.sheet = true;
        S.type = 'out';
        S.amount = 0;
        S.cat = '';
        renderSheet();
        setStep(1);
        guide();
      }
      function closeSheet() {
        S.sheet = false;
        renderSheet();
        guide();
      }

      function submit() {
        if (!(S.amount && S.cat)) return;
        var cat = CATS[S.type].filter(function (c) { return c.key === S.cat; })[0];
        var signed = S.type === 'in' ? S.amount : -S.amount;
        var before = S.balance;
        var pBefore = Math.round(S.spent / BUDGET * 100);
        S.balance += signed;
        if (S.type === 'out') S.spent += S.amount;
        S.tx.unshift({ name: cat.label, cat: cat.key, icon: cat.icon, amount: signed });
        S.added++;
        S.sheet = false;
        renderSheet();
        renderList(true);
        animateBalance(before, S.balance);
        later(function () {
          renderBudget();
          bump(refs.budgetPct);
        }, reduced ? 0 : 250);
        setStep(2);
        var p = Math.round(S.spent / BUDGET * 100);
        if (S.type === 'in') {
          toast('Entrée enregistrée : le solde monte.');
        } else if (pctClass(p) !== pctClass(pBefore)) {
          toast(p > 70 ? 'Budget à ' + p + ' % : la barre passe au rouge.' : 'Budget à ' + p + ' % : la barre passe à l’orange.');
        } else {
          toast('Dépense enregistrée : budget à ' + p + ' %.');
        }
        guide();
      }

      function save() {
        if (S.saved >= GOAL) return;
        S.saved = Math.min(GOAL, S.saved + SAVE_STEP);
        var first = !S.savedOnce;
        S.savedOnce = true;
        renderSavings();
        bump(refs.saved);
        if (first) {
          var b = refs.badges.querySelectorAll('.sk-bdg')[1];
          if (b) b.classList.add('is-new');
          refs.badgePop.classList.add('is-on');
          later(function () { refs.badgePop.classList.remove('is-on'); }, 2000);
          setStep(3);
        } else if (S.saved >= GOAL) {
          toast('Objectif « Épargne voyage » atteint 🎯');
        }
        guide();
      }

      function openPro() {
        S.pro = true;
        refs.badgePop.classList.remove('is-on');
        renderPlans();
        refs.pro.classList.add('is-on');
        setStep(4);
        guide();
      }

      function onClick(ev) {
        var btn = ev.target.closest('[data-act]');
        if (!btn || !root.contains(btn) || btn.disabled) return;
        var act = btn.getAttribute('data-act');
        switch (act) {
          case 'eye':
            S.masked = !S.masked;
            renderBalance();
            break;
          case 'open':
            openSheet();
            break;
          case 'close':
            closeSheet();
            break;
          case 'type':
            S.type = btn.getAttribute('data-type');
            S.cat = '';
            renderSheet();
            guide();
            break;
          case 'amount':
            S.amount = +btn.getAttribute('data-amount');
            renderSheet();
            guide();
            break;
          case 'cat':
            S.cat = btn.getAttribute('data-cat');
            renderSheet();
            guide();
            break;
          case 'submit':
            submit();
            break;
          case 'tab':
            var tab = btn.getAttribute('data-tab');
            if (tab === 'home' || tab === 'savings') {
              showScreen(tab);
              guide();
            } else {
              toast('Démo : seuls Accueil et Épargne sont ouverts.');
            }
            break;
          case 'save':
            save();
            break;
          case 'pro':
            openPro();
            break;
          case 'plan':
            S.plan = btn.getAttribute('data-plan');
            renderPlans();
            guide();
            break;
          case 'restart':
            reset();
            break;
        }
      }

      function build() {
        root.innerHTML = TEMPLATE;
        refs = {};
        var nodes = root.querySelectorAll('[data-ref]');
        for (var i = 0; i < nodes.length; i++) refs[nodes[i].getAttribute('data-ref')] = nodes[i];
        refs.home = root.querySelector('.sk-home');
        refs.savings = root.querySelector('.sk-savings');
        refs.logoImg.addEventListener('error', onLogoError);
      }
      function onLogoError() {
        if (refs.logoImg) refs.logoImg.style.display = 'none';
      }

      function reset() {
        clearTimers();
        if (refs.logoImg) refs.logoImg.removeEventListener('error', onLogoError);
        S = initialState();
        build();
        renderBalance();
        renderBudget();
        renderList(false);
        renderSheet();
        renderSavings();
        renderPlans();
        showScreen('home');
        setStep(0);
        guide();
      }

      root.addEventListener('click', onClick);
      reset();

      return {
        destroy: function () {
          clearTimers();
          root.removeEventListener('click', onClick);
          if (refs.logoImg) refs.logoImg.removeEventListener('error', onLogoError);
          root.innerHTML = '';
          root.classList.remove('sim-' + ID, 'sk-anim');
          refs = {};
        },
        reset: reset
      };
    }
  };
})();
