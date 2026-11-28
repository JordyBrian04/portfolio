/* Simulation SwipJob : le « Tinder de l'emploi ». Données fictives. */
(function () {
  'use strict';

  var ID = 'swipjob';
  var LOGO = 'assets/musee/swipjob.png';

  var OFFERS = [
    { co: 'Kora Digital', loc: 'Abidjan (Cocody)', title: 'Développeur React Native', contract: 'CDI',
      salary: '450 000 – 600 000 FCFA', mode: 'Hybride', match: 92,
      skills: ['React Native', 'TypeScript', 'API REST'],
      desc: 'Rejoignez l’équipe mobile et construisez des apps utilisées par des milliers de clients.' },
    { co: 'Lagune Média', loc: 'Plateau', title: 'Chargée de communication', contract: 'CDD 12 mois',
      salary: '300 000 – 400 000 FCFA', mode: 'Sur site', match: 87,
      skills: ['Rédaction', 'Réseaux sociaux', 'Relations presse'],
      desc: 'Pilotez les campagnes et la présence en ligne d’un groupe média en pleine croissance.' },
    { co: 'Savane Finance', loc: 'Bouaké', title: 'Analyste financier junior', contract: 'CDI',
      salary: '400 000 – 500 000 FCFA', mode: 'Sur site', match: 78,
      skills: ['Modélisation', 'Reporting', 'Comptabilité'],
      desc: 'Analysez les résultats et préparez les tableaux de bord de la direction.' },
    { co: 'Baobab Analytics', loc: 'Remote', title: 'Data Analyst', contract: 'Freelance',
      salary: '500 000 FCFA / mois', mode: 'Télétravail', match: 84,
      skills: ['SQL', 'Python', 'Visualisation'],
      desc: 'Transformez les données clients en décisions claires pour des PME de la région.' }
  ];

  var STATUSES = [
    { label: 'Envoyée', cls: 'sent' },
    { label: 'En cours d’examen', cls: 'review' },
    { label: 'Entretien planifié', cls: 'itw' }
  ];

  var ICONS = {
    offres: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="3" width="14" height="18" rx="3"/><path d="M9 8h6M9 12h6"/></svg>',
    recherche: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6"/><path d="M16 16l4 4"/></svg>',
    cand: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16v12H4z"/><path d="M9 7V5h6v2"/></svg>',
    notif: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 16V11a6 6 0 0112 0v5l2 2H4z"/><path d="M10 20h4"/></svg>',
    profil: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/></svg>'
  };

  var CSS = [
    '.sim-swipjob{--sj-p:#004ac6;--sj-p2:#2563eb;--sj-light:#d9e2ff;--sj-dark:#001a72;--sj-or:#ff8c42;--sj-bg:#faf8ff;--sj-sec:#f2f3ff;--sj-tx:#131b2e;--sj-tx2:#44476a;--sj-ok:#1dab65;--sj-no:#ef4444;',
    'font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;background:var(--sj-bg);color:var(--sj-tx);display:flex;flex-direction:column;-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent}',
    '.sim-swipjob *{box-sizing:border-box}',
    '.sim-swipjob button{font:inherit;cursor:pointer;border:0;background:none;color:inherit;padding:0}',
    '.sim-swipjob .sj-head{height:58px;flex:none;display:flex;align-items:center;justify-content:space-between;padding:14px 16px 0}',
    '.sim-swipjob .sj-logo{width:96px;height:30px;background:url(' + LOGO + ') center/118px 118px no-repeat;font-size:0}',
    '.sim-swipjob .sj-pill{display:flex;align-items:center;gap:5px;background:var(--sj-light);color:var(--sj-p);font-weight:800;font-size:11px;letter-spacing:.06em;padding:6px 11px;border-radius:999px}',
    '.sim-swipjob .sj-pill b{color:var(--sj-or);font-size:12px}',
    '.sim-swipjob .sj-pill.sj-bump{animation:sj-bump .4s ease}',
    '@keyframes sj-bump{40%{transform:scale(1.15)}}',
    '.sim-swipjob .sj-main{flex:1;position:relative;min-height:0}',
    '.sim-swipjob .sj-view{position:absolute;inset:0;display:flex;flex-direction:column}',
    '.sim-swipjob .sj-tip{text-align:center;font-size:11.5px;color:var(--sj-tx2);height:22px;line-height:22px}',
    '.sim-swipjob .sj-deck{position:relative;flex:1;margin:0 16px}',
    '.sim-swipjob .sj-card{position:absolute;inset:0 0 6px;background:#fff;border-radius:22px;box-shadow:0 10px 28px rgba(0,26,114,.14);overflow:hidden;touch-action:none;transition:transform .25s ease,opacity .25s ease;will-change:transform}',
    '.sim-swipjob .sj-card.sj-drag{transition:none;cursor:grabbing}',
    '.sim-swipjob .sj-card.sj-top{cursor:grab}',
    '.sim-swipjob .sj-card.sj-nudge{animation:sj-nudge 1.4s ease .5s 1}',
    '@keyframes sj-nudge{20%{transform:translateX(34px) rotate(3deg)}45%{transform:translateX(0) rotate(0)}65%{transform:translateX(-22px) rotate(-2deg)}85%{transform:none}}',
    '.sim-swipjob .sj-band{height:86px;background:linear-gradient(135deg,var(--sj-p),var(--sj-p2));position:relative;padding:16px}',
    '.sim-swipjob .sj-band:after{content:"";position:absolute;right:-30px;top:-40px;width:130px;height:130px;border-radius:50%;background:rgba(255,255,255,.1)}',
    '.sim-swipjob .sj-co{display:flex;align-items:center;gap:10px;color:#fff;position:relative;z-index:1}',
    '.sim-swipjob .sj-ini{width:44px;height:44px;border-radius:14px;background:#fff;color:var(--sj-p);display:grid;place-items:center;font-weight:800;font-size:20px;flex:none}',
    '.sim-swipjob .sj-coname{font-weight:700;font-size:14px}',
    '.sim-swipjob .sj-loc{font-size:11.5px;opacity:.85;margin-top:2px}',
    '.sim-swipjob .sj-body{padding:14px 16px}',
    '.sim-swipjob .sj-match{display:inline-block;background:#d5f0e8;color:#1a8a6a;font-weight:800;font-size:12px;padding:5px 10px;border-radius:999px}',
    '.sim-swipjob .sj-title{font-size:19px;line-height:1.2;font-weight:800;margin:10px 0 10px;color:var(--sj-tx)}',
    '.sim-swipjob .sj-pills{display:flex;flex-wrap:wrap;gap:6px}',
    '.sim-swipjob .sj-pills span{background:var(--sj-sec);color:var(--sj-p);font-size:11.5px;font-weight:600;padding:5px 9px;border-radius:999px}',
    '.sim-swipjob .sj-desc{font-size:12.5px;line-height:1.45;color:var(--sj-tx2);margin:12px 0 0}',
    '.sim-swipjob .sj-label{font-size:10.5px;font-weight:800;letter-spacing:.08em;color:var(--sj-tx2);margin:14px 0 7px}',
    '.sim-swipjob .sj-chips{display:flex;flex-wrap:wrap;gap:6px}',
    '.sim-swipjob .sj-chips span{border:1.5px solid var(--sj-light);color:var(--sj-dark);font-size:11.5px;padding:4px 9px;border-radius:8px}',
    '.sim-swipjob .sj-stamp{position:absolute;top:22px;z-index:3;font-weight:900;font-size:19px;padding:6px 12px;border:3px solid;border-radius:10px;background:rgba(255,255,255,.92);opacity:0;pointer-events:none}',
    '.sim-swipjob .sj-like{left:16px;color:var(--sj-ok);transform:rotate(-12deg)}',
    '.sim-swipjob .sj-nope{right:16px;color:var(--sj-no);transform:rotate(12deg)}',
    '.sim-swipjob .sj-actions{height:96px;flex:none;display:flex;align-items:center;justify-content:center;gap:28px;padding-bottom:16px}',
    '.sim-swipjob .sj-btn{width:58px;height:58px;border-radius:50%;background:#fff;box-shadow:0 6px 18px rgba(0,26,114,.15);display:grid;place-items:center;font-size:24px;font-weight:900;transition:transform .15s}',
    '.sim-swipjob .sj-btn:active{transform:scale(.92)}',
    '.sim-swipjob .sj-btn.sj-x{color:var(--sj-no)}',
    '.sim-swipjob .sj-btn.sj-h{width:66px;height:66px;color:#fff;background:linear-gradient(135deg,var(--sj-p),var(--sj-p2));font-size:27px}',
    '.sim-swipjob .sj-btn[disabled]{opacity:.35;cursor:default}',
    '.sim-swipjob .sj-cost{position:absolute;left:0;right:0;bottom:4px;text-align:center;font-size:10.5px;color:var(--sj-tx2)}',
    '.sim-swipjob .sj-end{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:24px;background:#fff;border-radius:22px;box-shadow:0 10px 28px rgba(0,26,114,.1)}',
    '.sim-swipjob .sj-end .sj-big{font-size:46px}',
    '.sim-swipjob .sj-end h3{font-size:20px;margin:10px 0 6px}',
    '.sim-swipjob .sj-end p{font-size:13px;color:var(--sj-tx2);margin:0 0 18px;line-height:1.45}',
    '.sim-swipjob .sj-primary{background:linear-gradient(135deg,var(--sj-p),var(--sj-p2));color:#fff!important;font-weight:700;font-size:14px;padding:13px 22px;border-radius:14px;width:100%}',
    '.sim-swipjob .sj-second{color:var(--sj-p)!important;font-weight:700;font-size:13.5px;padding:11px 16px;margin-top:6px}',
    '.sim-swipjob .sj-tabs{height:62px;flex:none;display:flex;background:#fff;border-top:1px solid #e6e8f5;padding:6px 4px 8px}',
    '.sim-swipjob .sj-tab{flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;font-size:8.5px;letter-spacing:-.1px;font-weight:600;color:#8a8fb0;position:relative;border-radius:12px}',
    '.sim-swipjob .sj-tab svg{width:21px;height:21px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}',
    '.sim-swipjob .sj-tab.sj-on{color:var(--sj-p)}',
    '.sim-swipjob .sj-tab span{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.sim-swipjob .sj-badge[hidden]{display:none}',
    '.sim-swipjob .sj-tab.sj-off{opacity:.55;cursor:default}',
    '.sim-swipjob .sj-badge{position:absolute;top:0;left:50%;margin-left:6px;min-width:17px;height:17px;border-radius:9px;background:var(--sj-or);color:#fff;font-size:10px;font-weight:800;display:grid;place-items:center;padding:0 4px}',
    '.sim-swipjob .sj-banner{position:absolute;left:16px;right:16px;top:62px;z-index:6;background:var(--sj-dark);color:#fff;font-size:12.5px;font-weight:600;padding:10px 12px;border-radius:12px;box-shadow:0 8px 20px rgba(0,26,114,.3);transition:opacity .25s,transform .25s}',
    '.sim-swipjob .sj-banner.sj-hide{opacity:0;transform:translateY(-8px);pointer-events:none}',
    '.sim-swipjob .sj-ov{position:absolute;inset:0;z-index:10;background:rgba(0,26,114,.55);display:flex;align-items:center;justify-content:center;padding:22px;animation:sj-fade .2s ease}',
    '.sim-swipjob .sj-sheet{background:#fff;border-radius:24px;padding:24px 20px 16px;text-align:center;width:100%;animation:sj-pop .3s ease}',
    '@keyframes sj-fade{from{opacity:0}}',
    '@keyframes sj-pop{from{opacity:0;transform:scale(.9)}}',
    '.sim-swipjob .sj-heart{width:70px;height:70px;margin:0 auto 12px;border-radius:50%;background:linear-gradient(135deg,var(--sj-p),var(--sj-p2));color:#fff;font-size:32px;display:grid;place-items:center;box-shadow:0 10px 24px rgba(37,99,235,.4)}',
    '.sim-swipjob .sj-sheet h3{margin:0 0 4px;font-size:20px}',
    '.sim-swipjob .sj-sheet .sj-sub{color:var(--sj-p);font-weight:700;font-size:14px;margin:0 0 14px}',
    '.sim-swipjob .sj-done{display:flex;align-items:center;gap:10px;text-align:left;background:var(--sj-sec);border-radius:14px;padding:10px 12px;font-size:12px;color:var(--sj-tx2);margin-bottom:16px}',
    '.sim-swipjob .sj-done b{color:var(--sj-tx);display:block;font-size:13px}',
    '.sim-swipjob .sj-check{width:26px;height:26px;border-radius:50%;background:var(--sj-ok);color:#fff;display:grid;place-items:center;font-weight:900;flex:none;font-size:13px}',
    '.sim-swipjob .sj-ctitle{font-size:21px;font-weight:800;margin:2px 16px 2px}',
    '.sim-swipjob .sj-csub{font-size:12px;color:var(--sj-tx2);margin:0 16px 12px}',
    '.sim-swipjob .sj-counts{display:flex;gap:8px;margin:0 16px 14px}',
    '.sim-swipjob .sj-count{flex:1;background:var(--sj-sec);border-radius:14px;padding:10px 6px;text-align:center}',
    '.sim-swipjob .sj-count b{display:block;font-size:22px;color:var(--sj-p)}',
    '.sim-swipjob .sj-count span{font-size:8.5px;font-weight:800;letter-spacing:.06em;color:var(--sj-tx2)}',
    '.sim-swipjob .sj-list{flex:1;overflow-y:auto;padding:0 16px 10px;display:flex;flex-direction:column;gap:10px}',
    '.sim-swipjob .sj-app{background:#fff;border-radius:16px;padding:12px;box-shadow:0 4px 14px rgba(0,26,114,.08)}',
    '.sim-swipjob .sj-app-top{display:flex;gap:10px;align-items:center}',
    '.sim-swipjob .sj-app .sj-ini{width:38px;height:38px;font-size:16px;border-radius:12px;background:var(--sj-light)}',
    '.sim-swipjob .sj-app-t{font-weight:700;font-size:13.5px}',
    '.sim-swipjob .sj-app-c{font-size:11.5px;color:var(--sj-tx2)}',
    '.sim-swipjob .sj-st{display:inline-block;margin-top:10px;font-size:11.5px;font-weight:700;padding:4px 10px;border-radius:999px;transition:background .3s,color .3s}',
    '.sim-swipjob .sj-st.sent{background:#eef0fa;color:var(--sj-tx2)}',
    '.sim-swipjob .sj-st.review{background:#fff1e6;color:#c2560e}',
    '.sim-swipjob .sj-st.itw{background:#d5f0e8;color:#1a8a6a}',
    '.sim-swipjob .sj-st.sj-flash{animation:sj-bump .45s ease}',
    '.sim-swipjob .sj-prog{display:flex;gap:4px;margin-top:10px}',
    '.sim-swipjob .sj-prog i{flex:1;height:5px;border-radius:3px;background:#e6e8f5;transition:background .4s}',
    '.sim-swipjob .sj-prog i.on{background:var(--sj-p2)}',
    '.sim-swipjob .sj-prog-l{display:flex;justify-content:space-between;font-size:9.5px;color:var(--sj-tx2);margin-top:4px}',
    '.sim-swipjob .sj-empty{text-align:center;color:var(--sj-tx2);font-size:13px;padding:30px 10px;line-height:1.5}',
    '.sim-swipjob.sj-reduced *,.sim-swipjob.sj-reduced *:before,.sim-swipjob.sj-reduced *:after{animation:none!important;transition:none!important}'
  ].join('\n');

  function injectCSS() {
    if (document.getElementById('sim-' + ID + '-css')) return;
    var s = document.createElement('style');
    s.id = 'sim-' + ID + '-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  window.MuseumSims = window.MuseumSims || {};
  window.MuseumSims[ID] = {
    frame: 'phone',
    steps: [
      'Glissez l’offre vers la droite',
      'SwipJob postule à votre place',
      'Suivez la candidature en direct',
      'Matchez ou passez les autres offres',
      'Pile terminée : recommencez'
    ],
    mount: function (root, ctx) {
      injectCSS();
      ctx = ctx || {};
      var reduced = !!ctx.reduced;
      var setStep = function (i) { if (ctx.setStep) ctx.setStep(i); };
      var toast = function (t) { if (ctx.toast) ctx.toast(t); };

      root.classList.add('sim-' + ID);
      if (reduced) root.classList.add('sj-reduced');

      var ac = new AbortController();
      var timers = new Set();
      function later(fn, ms) {
        var id = setTimeout(function () { timers.delete(id); fn(); }, ms);
        timers.add(id);
        return id;
      }
      function clearTimers() { timers.forEach(clearTimeout); timers.clear(); }

      var S;
      var hintSel = null;

      function freshState() {
        return { idx: 0, swipes: 40, apps: [], tab: 'offres', firstLike: false, visitedCand: false,
          toasted: false, busy: false, nudged: false };
      }

      function applyHint() {
        var old = root.querySelectorAll('.sim-hint');
        for (var i = 0; i < old.length; i++) old[i].classList.remove('sim-hint');
        if (!hintSel) return;
        var el = root.querySelector(hintSel);
        if (el) el.classList.add('sim-hint');
      }
      function hint(sel) { hintSel = sel; applyHint(); }

      /* ---------- squelette ---------- */
      function build() {
        root.innerHTML =
          '<div class="sj-head"><div class="sj-logo" role="img" aria-label="SwipJob">SwipJob</div>' +
          '<div class="sj-pill" aria-label="Swipes restants"><b>⚡</b><span class="sj-swn">40</span>&nbsp;SWIPES</div></div>' +
          '<div class="sj-main"></div>' +
          '<nav class="sj-tabs" aria-label="Navigation">' +
          tabBtn('offres', 'Offres', ICONS.offres, true) +
          tabBtn('recherche', 'Recherche', ICONS.recherche, false) +
          tabBtn('cand', 'Candidatures', ICONS.cand, true) +
          tabBtn('notif', 'Notifications', ICONS.notif, false) +
          tabBtn('profil', 'Profil', ICONS.profil, false) +
          '</nav>';
      }
      function tabBtn(id, label, icon, live) {
        if (!live) return '<div class="sj-tab sj-off" aria-hidden="true">' + icon + '<span>' + label + '</span></div>';
        return '<button type="button" class="sj-tab" data-act="tab" data-tab="' + id + '" aria-label="' + label + '">' +
          icon + '<span>' + label + '</span>' + (id === 'cand' ? '<em class="sj-badge" hidden>0</em>' : '') + '</button>';
      }

      function updateChrome() {
        root.querySelector('.sj-swn').textContent = S.swipes;
        var tabs = root.querySelectorAll('.sj-tab[data-tab]');
        for (var i = 0; i < tabs.length; i++) tabs[i].classList.toggle('sj-on', tabs[i].getAttribute('data-tab') === S.tab);
        var b = root.querySelector('.sj-badge');
        b.textContent = S.apps.length;
        b.hidden = S.apps.length === 0;
      }

      function main() { return root.querySelector('.sj-main'); }

      /* ---------- onglet Offres ---------- */
      function cardHTML(o, pos) {
        var t = pos === 0 ? '' : 'transform:translateY(' + (pos * 10) + 'px) scale(' + (1 - pos * 0.045) + ');';
        return '<div class="sj-card' + (pos === 0 ? ' sj-top' : '') + '" style="z-index:' + (5 - pos) + ';' + t + '" aria-hidden="' + (pos ? 'true' : 'false') + '">' +
          '<div class="sj-stamp sj-like">❤ Matcher</div><div class="sj-stamp sj-nope">✕ Passer</div>' +
          '<div class="sj-band"><div class="sj-co"><div class="sj-ini">' + o.co.charAt(0) + '</div>' +
          '<div><div class="sj-coname">' + o.co + '</div><div class="sj-loc">📍 ' + o.loc + '</div></div></div></div>' +
          '<div class="sj-body"><span class="sj-match">⚡ ' + o.match + '% Match</span>' +
          '<h3 class="sj-title">' + o.title + '</h3>' +
          '<div class="sj-pills"><span>' + o.contract + '</span><span>' + o.salary + '</span><span>' + o.mode + '</span></div>' +
          '<p class="sj-desc">' + o.desc + '</p>' +
          '<div class="sj-label">COMPÉTENCES</div><div class="sj-chips">' +
          o.skills.map(function (s) { return '<span>' + s + '</span>'; }).join('') + '</div></div></div>';
      }

      function renderOffres() {
        var done = S.idx >= OFFERS.length;
        var html = '<div class="sj-view"><div class="sj-tip">' +
          (done ? '' : '← Passer &nbsp;·&nbsp; glissez la carte &nbsp;·&nbsp; Matcher →') + '</div><div class="sj-deck">';
        if (done) {
          html += '<div class="sj-end"><div class="sj-big">🎉</div><h3>Vous avez tout vu !</h3>' +
            '<p>' + S.apps.length + ' candidature' + (S.apps.length > 1 ? 's' : '') + ' envoyée' + (S.apps.length > 1 ? 's' : '') +
            ' par SwipJob.<br>Revenez demain pour de nouvelles offres.</p>' +
            '<button type="button" class="sj-primary" data-act="restart">Recommencer</button>' +
            (S.apps.length ? '<button type="button" class="sj-second" data-act="tab" data-tab="cand">Voir mes candidatures</button>' : '') +
            '</div>';
        } else {
          for (var p = Math.min(2, OFFERS.length - 1 - S.idx); p >= 0; p--) html += cardHTML(OFFERS[S.idx + p], p);
        }
        html += '</div><div class="sj-actions" style="position:relative">' +
          '<button type="button" class="sj-btn sj-x" data-act="nope" aria-label="Passer cette offre"' + (done ? ' disabled' : '') + '>✕</button>' +
          '<button type="button" class="sj-btn sj-h" data-act="like" aria-label="Matcher : postuler à cette offre"' + (done ? ' disabled' : '') + '>❤</button>' +
          '<div class="sj-cost">❤ = 1 swipe · SwipJob postule pour vous</div></div></div>';
        main().innerHTML = html;
        var top = root.querySelector('.sj-card.sj-top');
        if (top) {
          bindDrag(top);
          if (!S.nudged && !reduced) { S.nudged = true; top.classList.add('sj-nudge'); }
        }
      }

      /* ---------- glisser ---------- */
      function setStamps(card, dx, thr) {
        var r = Math.min(1, Math.abs(dx) / thr);
        card.querySelector('.sj-like').style.opacity = dx > 0 ? r : 0;
        card.querySelector('.sj-nope').style.opacity = dx < 0 ? r : 0;
      }

      function bindDrag(card) {
        var sx = 0, sy = 0, dx = 0, dragging = false, pid = null;
        var thr = function () { return (root.clientWidth || 320) * 0.32; };
        card.addEventListener('pointerdown', function (e) {
          if (S.busy || (e.button !== undefined && e.button > 0)) return;
          dragging = true; pid = e.pointerId; sx = e.clientX; sy = e.clientY; dx = 0;
          card.classList.remove('sj-nudge');
          card.classList.add('sj-drag');
          try { card.setPointerCapture(pid); } catch (err) { /* ignore */ }
        }, { signal: ac.signal });
        card.addEventListener('pointermove', function (e) {
          if (!dragging || e.pointerId !== pid) return;
          dx = e.clientX - sx;
          var dy = (e.clientY - sy) * 0.25;
          card.style.transform = 'translate(' + dx + 'px,' + dy + 'px) rotate(' + (dx / 18) + 'deg)';
          setStamps(card, dx, thr());
        }, { signal: ac.signal });
        function end(e) {
          if (!dragging || (e && e.pointerId !== pid)) return;
          dragging = false;
          card.classList.remove('sj-drag');
          if (Math.abs(dx) > thr()) {
            fly(card, dx > 0 ? 1 : -1);
          } else {
            card.style.transform = '';
            setStamps(card, 0, 1);
          }
        }
        card.addEventListener('pointerup', end, { signal: ac.signal });
        card.addEventListener('pointercancel', end, { signal: ac.signal });
      }

      function fly(card, dir) {
        if (S.busy) return;
        S.busy = true;
        card.classList.remove('sj-nudge', 'sj-drag');
        setStamps(card, dir, 1);
        card.style.transform = 'translate(' + (dir * 440) + 'px,30px) rotate(' + (dir * 24) + 'deg)';
        card.style.opacity = '0';
        var offer = OFFERS[S.idx];
        later(function () {
          S.busy = false;
          S.idx++;
          if (dir > 0) liked(offer);
          renderOffres();
          applyHint();
          if (S.idx >= OFFERS.length) atEnd();
        }, reduced ? 0 : 280);
      }

      function swipeBtn(dir) {
        var top = root.querySelector('.sj-card.sj-top');
        if (!top || S.busy) return;
        if (reduced) { fly(top, dir); return; }
        // montre d'abord le tampon, puis la carte part
        top.classList.remove('sj-nudge');
        top.style.transform = 'translateX(' + (dir * 40) + 'px) rotate(' + (dir * 3) + 'deg)';
        setStamps(top, dir, 1);
        S.busy = true;
        later(function () { S.busy = false; fly(top, dir); }, 180);
      }

      function liked(offer) {
        S.swipes--;
        S.apps.unshift({ offer: offer, status: 0, started: false });
        updateChrome();
        var pill = root.querySelector('.sj-pill');
        if (!reduced) { pill.classList.remove('sj-bump'); void pill.offsetWidth; pill.classList.add('sj-bump'); }
        if (!S.firstLike) {
          S.firstLike = true;
          setStep(1);
          showOverlay(offer);
        } else {
          banner('✓ SwipJob a postulé chez ' + offer.co);
        }
        if (S.tab === 'cand') startTimelines();
      }

      function atEnd() {
        setStep(4);
        hint('[data-act="restart"]');
      }

      /* ---------- surcouche « swipé à droite » ---------- */
      function showOverlay(offer) {
        var ov = document.createElement('div');
        ov.className = 'sj-ov';
        ov.innerHTML = '<div class="sj-sheet" role="dialog" aria-label="Candidature envoyée">' +
          '<div class="sj-heart">❤</div><h3>Vous avez swipé à droite</h3>' +
          '<p class="sj-sub">SwipJob a postulé pour vous</p>' +
          '<div class="sj-done"><span class="sj-check">✓</span><div><b>Candidature soumise</b>' +
          offer.title + ' · ' + offer.co + '<br>CV et lettre adaptés par l’IA</div></div>' +
          '<button type="button" class="sj-primary" data-act="go-cand">Voir mes candidatures</button>' +
          '<button type="button" class="sj-second" data-act="close-ov">Continuer à swiper</button></div>';
        root.appendChild(ov);
        hint('[data-act="go-cand"]');
      }
      function closeOverlay() {
        var ov = root.querySelector('.sj-ov');
        if (ov) ov.remove();
      }

      var bannerTimer = null;
      function banner(txt) {
        var b = root.querySelector('.sj-banner');
        if (!b) {
          b = document.createElement('div');
          b.className = 'sj-banner sj-hide';
          b.setAttribute('role', 'status');
          root.appendChild(b);
        }
        b.textContent = txt;
        b.classList.remove('sj-hide');
        if (bannerTimer) { clearTimeout(bannerTimer); timers.delete(bannerTimer); }
        bannerTimer = later(function () { b.classList.add('sj-hide'); }, 1800);
      }

      /* ---------- onglet Candidatures ---------- */
      function renderCand() {
        var n = S.apps.length;
        var itw = S.apps.filter(function (a) { return a.status === 2; }).length;
        var html = '<div class="sj-view"><div class="sj-ctitle">Candidatures</div>' +
          '<div class="sj-csub">Suivi en temps réel par SwipJob</div>' +
          '<div class="sj-counts"><div class="sj-count"><b>' + n + '</b><span>CANDIDATURES</span></div>' +
          '<div class="sj-count"><b>' + (n - itw) + '</b><span>EN ATTENTE</span></div>' +
          '<div class="sj-count"><b>' + itw + '</b><span>ENTRETIENS</span></div></div><div class="sj-list">';
        if (!n) {
          html += '<div class="sj-empty">Aucune candidature pour l’instant.<br>Glissez une offre vers la droite :<br>SwipJob postule pour vous.</div>' +
            '<button type="button" class="sj-primary" data-act="tab" data-tab="offres">Voir les offres</button>';
        }
        S.apps.forEach(function (a, i) {
          var st = STATUSES[a.status];
          html += '<div class="sj-app"><div class="sj-app-top"><div class="sj-ini">' + a.offer.co.charAt(0) + '</div>' +
            '<div><div class="sj-app-t">' + a.offer.title + '</div><div class="sj-app-c">' + a.offer.co + ' · ' + a.offer.contract + '</div></div></div>' +
            '<span class="sj-st ' + st.cls + '" data-i="' + i + '">' + st.label + '</span>' +
            '<div class="sj-prog"><i class="on"></i><i class="' + (a.status >= 1 ? 'on' : '') + '"></i><i class="' + (a.status >= 2 ? 'on' : '') + '"></i></div>' +
            '<div class="sj-prog-l"><span>Envoyée</span><span>En examen</span><span>Entretien</span></div></div>';
        });
        html += '</div></div>';
        main().innerHTML = html;
      }

      function startTimelines() {
        S.apps.forEach(function (a) {
          if (a.started) return;
          a.started = true;
          later(function () { advance(a, 1); }, 1500);
          later(function () { advance(a, 2); }, 3300);
        });
      }

      function advance(a, st) {
        a.status = st;
        if (S.tab === 'cand') {
          renderCand();
          var i = S.apps.indexOf(a);
          var el = root.querySelector('.sj-st[data-i="' + i + '"]');
          if (el && !reduced) el.classList.add('sj-flash');
          applyHint();
        }
        if (st === 2 && !S.toasted) {
          S.toasted = true;
          toast('📅 Entretien planifié chez ' + a.offer.co + ' !');
          if (S.tab === 'cand') hint('[data-act="tab"][data-tab="offres"]');
        }
      }

      /* ---------- navigation ---------- */
      function showTab(t) {
        S.tab = t;
        closeOverlay();
        updateChrome();
        if (t === 'cand') {
          renderCand();
          if (S.apps.length) {
            setStep(2);
            S.visitedCand = true;
            startTimelines();
            hint(S.toasted ? '[data-act="tab"][data-tab="offres"]' : null);
          } else {
            hint('[data-act="tab"][data-tab="offres"]');
          }
        } else {
          renderOffres();
          if (S.idx >= OFFERS.length) { atEnd(); return; }
          if (S.visitedCand) setStep(3);
          hint('[data-act="like"]');
        }
      }

      root.addEventListener('click', function (e) {
        var b = e.target.closest('[data-act]');
        if (!b || !root.contains(b) || b.disabled) return;
        var act = b.getAttribute('data-act');
        if (act === 'like') swipeBtn(1);
        else if (act === 'nope') swipeBtn(-1);
        else if (act === 'tab') showTab(b.getAttribute('data-tab'));
        else if (act === 'go-cand') showTab('cand');
        else if (act === 'close-ov') {
          closeOverlay();
          if (S.idx >= OFFERS.length) atEnd(); else hint('[data-act="like"]');
        } else if (act === 'restart') reset();
      }, { signal: ac.signal });

      function start() {
        clearTimers();
        bannerTimer = null;
        S = freshState();
        build();
        updateChrome();
        S.tab = 'offres';
        renderOffres();
        updateChrome();
        setStep(0);
        hint('[data-act="like"]');
      }

      function reset() { start(); }

      start();

      return {
        destroy: function () {
          ac.abort();
          clearTimers();
          root.innerHTML = '';
          root.classList.remove('sim-' + ID, 'sj-reduced');
        },
        reset: reset
      };
    }
  };
})();
