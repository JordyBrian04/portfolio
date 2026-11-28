/* Simulation du musée : e-elips (trouver un artisan proche et lui envoyer une demande). */
(function () {
  'use strict';

  var ID = 'eelips';

  var CSS = [
    '.sim-eelips{--o:#F97316;--od:#C2410C;--ol:#FFEDD5;--bg:#F8FAFC;--bd:#E2E8F0;--t:#0F172A;--s:#64748B;',
    'font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:var(--t);background:var(--bg);-webkit-tap-highlight-color:transparent}',
    '.sim-eelips *{box-sizing:border-box;margin:0;padding:0}',
    '.sim-eelips button{font:inherit;color:inherit;background:none;border:0;cursor:pointer;touch-action:manipulation}',
    '.sim-eelips .el-app{position:absolute;inset:0;display:flex;flex-direction:column;background:var(--bg)}',
    '.sim-eelips .el-sb{height:24px;flex:none;display:flex;justify-content:space-between;align-items:center;padding:0 16px;font-size:11px;font-weight:600;color:#fff;background:var(--o)}',
    '.sim-eelips .el-app.pro .el-sb{background:var(--t)}',
    '.sim-eelips .el-stage{position:relative;flex:1;overflow:hidden}',
    '.sim-eelips .el-view{position:absolute;inset:0;display:flex;flex-direction:column;background:var(--bg)}',
    '.sim-eelips .el-enter{animation:el-in .24s ease-out both}',
    '@keyframes el-in{from{opacity:0;transform:translateX(18px)}to{opacity:1;transform:none}}',
    '@keyframes el-up{from{transform:translateY(100%)}to{transform:none}}',
    '@keyframes el-fade{from{opacity:0}to{opacity:1}}',
    '@keyframes el-pop{0%{transform:scale(.6);opacity:0}70%{transform:scale(1.12);opacity:1}100%{transform:none}}',
    '.sim-eelips .el-top{flex:none;background:var(--o);color:#fff;padding:6px 14px 12px}',
    '.sim-eelips .el-app.pro .el-top{background:var(--t)}',
    '.sim-eelips .el-bar{display:flex;align-items:center;justify-content:space-between;height:36px}',
    '.sim-eelips .el-ico{width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:17px}',
    '.sim-eelips .el-logo{background:#fff;color:var(--o);font-weight:900;font-size:14px;letter-spacing:1.5px;padding:5px 14px;border-radius:999px}',
    '.sim-eelips .el-hello{font-size:17px;font-weight:800;margin-top:4px}',
    '.sim-eelips .el-hello small{display:block;font-size:12px;font-weight:500;opacity:.9}',
    '.sim-eelips .el-body{flex:1;overflow-y:auto;overflow-x:hidden;padding:10px 14px 8px;scrollbar-width:none}',
    '.sim-eelips .el-body::-webkit-scrollbar{display:none}',
    '.sim-eelips .el-card{background:#fff;border:1px solid var(--bd);border-radius:14px;padding:12px}',
    '.sim-eelips .el-q{font-size:14px;font-weight:700;margin-bottom:8px}',
    '.sim-eelips .el-chips{display:flex;flex-wrap:wrap;gap:5px}',
    '.sim-eelips .el-chip{height:32px;padding:0 9px;border-radius:999px;border:1.5px solid var(--bd);background:#fff;font-size:12px;font-weight:600;display:inline-flex;align-items:center;gap:4px;transition:background .15s,border-color .15s,color .15s}',
    '.sim-eelips .el-chip.on{border-color:currentColor}',
    '.sim-eelips .el-h3{display:flex;justify-content:space-between;align-items:baseline;font-size:14px;font-weight:700;margin:10px 2px 6px;white-space:nowrap}',
    '.sim-eelips .el-h3 small{font-size:11px;font-weight:500;color:var(--s)}',
    '.sim-eelips .el-pro{display:flex;gap:9px;align-items:center;background:#fff;border:1px solid var(--bd);border-radius:14px;padding:7px 9px;margin-bottom:6px;cursor:pointer;transition:transform .1s,border-color .15s}',
    '.sim-eelips .el-pro:active{transform:scale(.985);border-color:var(--o)}',
    '.sim-eelips .el-av{width:44px;height:44px;flex:none;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px}',
    '.sim-eelips .el-pro h4{font-size:14px;font-weight:700;line-height:1.25}',
    '.sim-eelips .el-pro h4 span{color:#D97706;font-size:12px;font-weight:700;margin-left:4px}',
    '.sim-eelips .el-tag{display:inline-block;font-size:10.5px;font-weight:700;padding:1px 7px;border-radius:999px;margin:1px 0}',
    '.sim-eelips .el-dist{font-size:11px;color:var(--s);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.sim-eelips .el-acts{display:flex;flex-direction:column;align-items:flex-end;gap:5px;flex:none}',
    '.sim-eelips .el-call{height:30px;padding:0 9px;border-radius:999px;background:var(--o);color:#fff;font-size:12px;font-weight:700;white-space:nowrap}',
    '.sim-eelips .el-msg{width:30px;height:26px;border-radius:999px;border:1px solid var(--bd);font-size:12px}',
    '.sim-eelips .el-tabs{height:54px;flex:none;display:flex;background:#fff;border-top:1px solid var(--bd)}',
    '.sim-eelips .el-tabs button{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;font-size:10.5px;color:var(--s)}',
    '.sim-eelips .el-tabs button.on{color:var(--o);font-weight:700}',
    '.sim-eelips .el-tabs em{font-style:normal;font-size:16px}',
    '.sim-eelips .el-btn{display:flex;width:100%;height:50px;border-radius:12px;background:var(--o);color:#fff;font-size:15px;font-weight:700;align-items:center;justify-content:center;transition:opacity .2s,transform .1s}',
    '.sim-eelips .el-btn:active{transform:scale(.98)}',
    '.sim-eelips .el-btn[disabled]{opacity:.45;cursor:default}',
    '.sim-eelips .el-btn.ghost{background:#fff;color:var(--t);border:1.5px solid var(--bd)}',
    '.sim-eelips .el-btn.dark{background:var(--t)}',
    '.sim-eelips .el-dim{position:absolute;inset:0;background:rgba(15,23,42,.45);animation:el-fade .2s both;z-index:5}',
    '.sim-eelips .el-sheet{position:absolute;left:0;right:0;bottom:0;background:#fff;border-radius:20px 20px 0 0;padding:8px 16px 16px;z-index:6;animation:el-up .28s ease-out both}',
    '.sim-eelips .el-grab{width:40px;height:4px;border-radius:2px;background:var(--bd);margin:0 auto 10px}',
    '.sim-eelips .el-sheet h2{font-size:16px;font-weight:800;padding-right:30px;white-space:nowrap}',
    '.sim-eelips .el-x{position:absolute;right:10px;top:12px;width:28px;height:28px;border-radius:50%;background:var(--bg);font-size:15px}',
    '.sim-eelips .el-lbl{font-size:12.5px;font-weight:700;color:var(--s);margin:12px 0 6px}',
    '.sim-eelips .el-seg{display:flex;gap:6px}',
    '.sim-eelips .el-seg button{flex:1;min-height:40px;border-radius:10px;border:1.5px solid var(--bd);font-size:12.5px;font-weight:600;line-height:1.15;padding:3px 2px}',
    '.sim-eelips .el-seg button small{display:block;font-size:10px;font-weight:500;color:var(--s)}',
    '.sim-eelips .el-seg button.on{border-color:var(--o);background:var(--ol);color:var(--od)}',
    '.sim-eelips .el-recap{margin:14px 0 12px;background:var(--bg);border-radius:12px;padding:9px 11px;font-size:12px;color:var(--s);line-height:1.45}',
    '.sim-eelips .el-recap b{color:var(--t)}',
    '.sim-eelips .el-mini{display:flex;align-items:center;gap:9px;margin-top:10px;font-size:12px;color:var(--s)}',
    '.sim-eelips .el-mini b{display:block;color:var(--t);font-size:13.5px}',
    '.sim-eelips .el-mini .el-av{width:36px;height:36px;font-size:12px}',
    '.sim-eelips .el-head{flex:none;height:52px;display:flex;align-items:center;gap:6px;padding:0 10px;background:#fff;border-bottom:1px solid var(--bd)}',
    '.sim-eelips .el-head h2{font-size:16px;font-weight:800}',
    '.sim-eelips .el-back{width:34px;height:34px;border-radius:10px;font-size:22px;display:flex;align-items:center;justify-content:center}',
    '.sim-eelips .el-ftabs{display:flex;gap:4px;background:#fff;border:1px solid var(--bd);border-radius:12px;padding:3px;margin-bottom:12px}',
    '.sim-eelips .el-ftabs button{flex:1;height:30px;border-radius:9px;font-size:12px;font-weight:600;color:var(--s)}',
    '.sim-eelips .el-ftabs button.on{background:var(--ol);color:var(--od)}',
    '.sim-eelips .el-req{background:#fff;border:1px solid var(--bd);border-radius:14px;padding:12px}',
    '.sim-eelips .el-req-top{display:flex;gap:10px;align-items:center}',
    '.sim-eelips .el-req-top h4{font-size:14px;font-weight:700}',
    '.sim-eelips .el-req-top p{font-size:11.5px;color:var(--s)}',
    '.sim-eelips .el-badge{margin-left:auto;font-size:11px;font-weight:700;padding:4px 9px;border-radius:999px;white-space:nowrap}',
    '.sim-eelips .el-badge.wait{background:#FEF3C7;color:#B45309}',
    '.sim-eelips .el-badge.ok{background:#DCFCE7;color:#15803D}',
    '.sim-eelips .el-badge.no{background:#FEE2E2;color:#B91C1C}',
    '.sim-eelips .el-badge.end{background:#E2E8F0;color:#334155}',
    '.sim-eelips .el-badge.pop{animation:el-pop .45s ease-out both}',
    '.sim-eelips .el-info{font-size:12px;color:var(--s);margin-top:10px;line-height:1.4}',
    '.sim-eelips .el-demo{margin-top:14px;border:1.5px dashed #FDBA74;background:#FFF7ED;border-radius:14px;padding:12px}',
    '.sim-eelips .el-demo p{font-size:12.5px;color:var(--od);margin-bottom:10px;line-height:1.4}',
    '.sim-eelips .el-empty{text-align:center;color:var(--s);font-size:13px;padding:40px 10px}',
    '.sim-eelips .el-switch{display:flex;align-items:center;gap:8px;font-size:12.5px;font-weight:700}',
    '.sim-eelips .el-sw{width:46px;height:26px;border-radius:13px;background:#475569;position:relative;transition:background .2s}',
    '.sim-eelips .el-sw:after{content:"";position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#fff;transition:transform .2s}',
    '.sim-eelips .el-sw.on{background:#16A34A}',
    '.sim-eelips .el-sw.on:after{transform:translateX(20px)}',
    '.sim-eelips .el-stats{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px}',
    '.sim-eelips .el-stat{background:#fff;border:1px solid var(--bd);border-radius:12px;padding:8px 10px;font-size:18px;font-weight:800}',
    '.sim-eelips .el-stat span{display:block;font-size:11px;color:var(--s);font-weight:500}',
    '.sim-eelips .el-new{font-size:11px;font-weight:800;color:var(--od);text-transform:uppercase;letter-spacing:.6px;margin-bottom:6px}',
    '.sim-eelips .el-two{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}',
    '.sim-eelips .el-two .el-btn{height:46px}',
    '.sim-eelips .el-rate{flex:1;display:flex;flex-direction:column;align-items:center;text-align:center;padding:26px 18px 16px}',
    '.sim-eelips .el-rate .el-av{width:72px;height:72px;font-size:22px}',
    '.sim-eelips .el-rate h1{font-size:21px;font-weight:800;margin-top:14px}',
    '.sim-eelips .el-rate p{font-size:13px;color:var(--s);margin-top:6px;line-height:1.45}',
    '.sim-eelips .el-stars{display:flex;gap:4px;margin:20px 0 6px}',
    '.sim-eelips .el-stars button{width:44px;height:44px;font-size:32px;color:#CBD5E1;line-height:1;transition:transform .15s,color .15s}',
    '.sim-eelips .el-stars button.on{color:#F59E0B}',
    '.sim-eelips .el-stars button:active{transform:scale(1.2)}',
    '.sim-eelips .el-slab{font-size:13px;font-weight:700;color:var(--od);min-height:18px}',
    '.sim-eelips .el-spacer{flex:1}',
    '.sim-eelips .el-thanks{width:76px;height:76px;border-radius:50%;background:#16A34A;color:#fff;font-size:40px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:el-pop .45s ease-out both;box-shadow:0 0 0 10px #DCFCE7}',
    '.sim-eelips.is-reduced *,.sim-eelips.is-reduced *:before,.sim-eelips.is-reduced *:after{animation:none!important;transition:none!important}'
  ].join('\n');

  var SERVICES = {
    plomberie: { label: 'Plomberie', icon: '💧', c: '#2563EB', l: '#DBEAFE' },
    electricite: { label: 'Électricité', icon: '⚡', c: '#D97706', l: '#FEF3C7' },
    menage: { label: 'Ménage', icon: '🧹', c: '#16A34A', l: '#DCFCE7' },
    coiffure: { label: 'Coiffure', icon: '✂️', c: '#DB2777', l: '#FCE7F3' }
  };

  /* Prestataires fictifs, déjà triés du plus proche au plus loin. */
  var PROS = [
    { id: 'koffi', name: 'Koffi B.', ini: 'KB', svc: 'plomberie', rating: '4.8', zone: 'Cocody', dist: '850 m (2 min)' },
    { id: 'awa', name: 'Awa T.', ini: 'AT', svc: 'coiffure', rating: '4.9', zone: 'Marcory', dist: '2.4 km (6 min)' },
    { id: 'yao', name: 'Yao K.', ini: 'YK', svc: 'electricite', rating: '4.5', zone: 'Plateau', dist: '3.1 km (7 min)' },
    { id: 'mariam', name: 'Mariam D.', ini: 'MD', svc: 'menage', rating: '4.7', zone: 'Yopougon', dist: '5.6 km (13 min)' }
  ];

  var DAYS = [['today', 'Aujourd’hui', ''], ['tomorrow', 'Demain', ''], ['other', 'Choisir un jour', 'Sam. 28 nov.']];
  var MOMENTS = [['matin', 'Matin', '8 h – 12 h'], ['aprem', 'Après-midi', '12 h – 17 h'], ['soir', 'Soir', '17 h – 20 h']];
  var STAR_LABELS = ['', 'Décevant', 'Moyen', 'Bien', 'Très bien', 'Excellent !'];

  function injectCss() {
    if (document.getElementById('sim-' + ID + '-css')) return;
    var s = document.createElement('style');
    s.id = 'sim-' + ID + '-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function label(list, key) {
    for (var i = 0; i < list.length; i++) if (list[i][0] === key) return list[i][2] && key === 'other' ? list[i][2] : list[i][1];
    return '';
  }

  window.MuseumSims = window.MuseumSims || {};
  window.MuseumSims[ID] = {
    frame: 'phone',
    steps: [
      'Choisir le service recherché',
      'Toucher le prestataire le plus proche',
      'Choisir le jour et le moment',
      'Le prestataire accepte la demande',
      'Noter la prestation'
    ],
    mount: function (root, ctx) {
      injectCss();
      root.classList.add('sim-' + ID);
      if (ctx.reduced) root.classList.add('is-reduced');

      var timers = [];
      var st;
      var app;
      var stage;

      function later(fn, ms) {
        var id = setTimeout(function () {
          timers.splice(timers.indexOf(id), 1);
          fn();
        }, ms);
        timers.push(id);
      }
      function clearTimers() {
        while (timers.length) clearTimeout(timers.pop());
      }

      function freshState() {
        return { filter: null, pro: null, day: 'today', moment: null, req: null, online: true, stars: 0, tab: 'all' };
      }
      function pro() {
        for (var i = 0; i < PROS.length; i++) if (PROS[i].id === st.pro) return PROS[i];
        return PROS[0];
      }

      function hint(el) {
        var old = root.querySelectorAll('.sim-hint');
        for (var i = 0; i < old.length; i++) old[i].classList.remove('sim-hint');
        if (el) el.classList.add('sim-hint');
      }

      function show(html, name, proMode) {
        app.classList.toggle('pro', !!proMode);
        var v = document.createElement('div');
        v.className = 'el-view' + (ctx.reduced ? '' : ' el-enter');
        v.setAttribute('data-screen', name);
        v.innerHTML = html;
        stage.innerHTML = '';
        stage.appendChild(v);
        return v;
      }

      function avatar(p) {
        var s = SERVICES[p.svc];
        return '<div class="el-av" style="background:' + s.l + ';color:' + s.c + '" aria-hidden="true">' + p.ini + '</div>';
      }
      function tag(p) {
        var s = SERVICES[p.svc];
        return '<span class="el-tag" style="background:' + s.l + ';color:' + s.c + '">' + s.icon + ' ' + s.label + '</span>';
      }
      function tabs(active) {
        return '<div class="el-tabs">' +
          '<button type="button" data-a="home"' + (active === 'home' ? ' class="on"' : '') + '><em>🏠</em>Accueil</button>' +
          '<button type="button" data-a="requests"' + (active === 'req' ? ' class="on"' : '') + '><em>📋</em>Mes demandes</button></div>';
      }

      /* ---------- côté client ---------- */

      function listHtml() {
        var list = PROS.filter(function (p) { return !st.filter || p.svc === st.filter; });
        return list.map(function (p) {
          return '<div class="el-pro" data-a="pro" data-p="' + p.id + '" role="button" tabindex="0" aria-label="Demander ' + p.name + '">' +
            avatar(p) +
            '<div style="flex:1;min-width:0"><h4>' + p.name + '<span>★ ' + p.rating + '</span></h4>' + tag(p) +
            '<div class="el-dist">' + p.zone + ' · ' + p.dist + '</div></div>' +
            '<div class="el-acts"><button type="button" class="el-call" data-a="call">Appeler</button>' +
            '<button type="button" class="el-msg" data-a="call" aria-label="Envoyer un message">💬</button></div></div>';
        }).join('');
      }

      function home() {
        var chips = '<button type="button" class="el-chip' + (st.filter ? '' : ' on') + '" data-a="filter" data-f=""' +
          (st.filter ? '' : ' style="color:var(--od);background:var(--ol)"') + '>Tout</button>';
        Object.keys(SERVICES).forEach(function (k) {
          var s = SERVICES[k];
          var on = st.filter === k;
          chips += '<button type="button" class="el-chip' + (on ? ' on' : '') + '" data-a="filter" data-f="' + k + '" style="color:' + s.c +
            (on ? ';background:' + s.l : '') + '">' + s.icon + ' ' + s.label + '</button>';
        });
        var v = show(
          '<div class="el-top"><div class="el-bar"><span class="el-ico" aria-hidden="true">☰</span>' +
          '<span class="el-logo">ELIPS</span><span class="el-ico" aria-hidden="true">🔔</span></div>' +
          '<div class="el-hello">Un artisan près de chez vous</div></div>' +
          '<div class="el-body"><div class="el-card"><div class="el-q">Quel service cherchez-vous ?</div>' +
          '<div class="el-chips">' + chips + '</div></div>' +
          '<div class="el-h3">Prestataires proches<small>triés par distance</small></div>' +
          '<div data-list>' + listHtml() + '</div></div>' + tabs('home'),
          'home');
        if (!st.filter) {
          ctx.setStep(0);
          hint(v.querySelector('[data-f="plomberie"]'));
        } else {
          ctx.setStep(1);
          hint(v.querySelector('.el-pro'));
        }
      }

      function openSheet() {
        ctx.setStep(2);
        st.day = 'today';
        st.moment = null;
        var p = pro();
        var view = stage.querySelector('.el-view');
        var wrap = document.createElement('div');
        wrap.setAttribute('data-sheet', '');
        wrap.innerHTML =
          '<div class="el-dim" data-a="close"></div>' +
          '<div class="el-sheet" role="dialog" aria-label="Quand voulez-vous ce service ?"><div class="el-grab"></div>' +
          '<button type="button" class="el-x" data-a="close" aria-label="Fermer">✕</button>' +
          '<h2>Quand voulez-vous ce service ?</h2>' +
          '<div class="el-mini">' + avatar(p) + '<div><b>' + p.name + ' · ★ ' + p.rating + '</b>' + SERVICES[p.svc].label + ' · ' + p.zone + ' · ' + p.dist + '</div></div>' +
          '<div class="el-lbl">Quel jour ?</div><div class="el-seg">' +
          DAYS.map(function (d) {
            return '<button type="button" data-a="day" data-k="' + d[0] + '"' + (st.day === d[0] ? ' class="on"' : '') + '>' + d[1] + '</button>';
          }).join('') + '</div>' +
          '<div class="el-lbl">À quel moment ?</div><div class="el-seg">' +
          MOMENTS.map(function (m) {
            return '<button type="button" data-a="moment" data-k="' + m[0] + '">' + m[1] + '<small>' + m[2] + '</small></button>';
          }).join('') + '</div>' +
          '<div class="el-recap" data-recap></div>' +
          '<button type="button" class="el-btn" data-a="send" disabled>Envoyer la demande à ' + p.name + '</button></div>';
        view.appendChild(wrap);
        updateRecap();
        hint(wrap.querySelector('[data-k="matin"]'));
      }

      function updateRecap() {
        var p = pro();
        var r = root.querySelector('[data-recap]');
        if (!r) return;
        r.innerHTML = 'Récapitulatif : <b>' + SERVICES[p.svc].label + '</b> · <b>' + label(DAYS, st.day) + '</b> · ' +
          (st.moment ? '<b>' + label(MOMENTS, st.moment) + '</b>' : '<i>moment à choisir</i>') + '<br>Chez vous, à ' + p.zone + '.';
      }

      function closeSheet() {
        var s = root.querySelector('[data-sheet]');
        if (s) s.parentNode.removeChild(s);
        ctx.setStep(1);
        hint(root.querySelector('.el-pro'));
      }

      function badge(status, pop) {
        var map = { wait: 'En attente', ok: 'Acceptée', no: 'Refusée', end: 'Terminée' };
        return '<span class="el-badge ' + status + (pop && !ctx.reduced ? ' pop' : '') + '">' + map[status] + '</span>';
      }

      function requests(pop) {
        var body;
        var r = st.req;
        var tabsF = [['all', 'Tout'], ['cur', 'En cours'], ['cancel', 'Annulé'], ['end', 'Terminé']];
        var bucket = !r ? null : (r.status === 'wait' || r.status === 'ok') ? 'cur' : r.status === 'no' ? 'cancel' : 'end';
        var visible = r && (st.tab === 'all' || st.tab === bucket);
        body = '<div class="el-ftabs">' + tabsF.map(function (t) {
          return '<button type="button" data-a="tab" data-t="' + t[0] + '"' + (st.tab === t[0] ? ' class="on"' : '') + '>' + t[1] + '</button>';
        }).join('') + '</div>';
        if (!visible) {
          body += '<div class="el-empty">Aucune demande ici pour l’instant.</div>';
        } else {
          var p = pro();
          var info = {
            wait: p.name + ' a reçu votre demande. Vous serez prévenu dès sa réponse.',
            ok: p.name + ' a accepté : il arrive ' + label(DAYS, r.day).toLowerCase() + ', ' + label(MOMENTS, r.moment).toLowerCase() + '.',
            no: p.name + ' n’est pas disponible. Vous pouvez choisir un autre prestataire.',
            end: 'Merci ! Vous avez donné ' + st.stars + ' étoile' + (st.stars > 1 ? 's' : '') + ' à ' + p.name
          }[r.status];
          body += '<div class="el-req"><div class="el-req-top">' + avatar(p) +
            '<div><h4>' + p.name + '</h4><p>' + SERVICES[p.svc].label + ' · ' + label(DAYS, r.day) + ' · ' + label(MOMENTS, r.moment) + '</p></div>' +
            badge(r.status, pop) + '</div><p class="el-info">' + info + '</p></div>';
          if (r.status === 'wait') {
            body += '<div class="el-demo"><p>Dans l’application, le prestataire reçoit la demande sur son téléphone.</p>' +
              '<button type="button" class="el-btn dark" data-a="toPro">Voir côté prestataire</button></div>';
          } else if (r.status === 'ok') {
            body += '<div style="margin-top:14px"><button type="button" class="el-btn" data-a="finish">Prestation terminée</button></div>';
          } else {
            body += '<div style="margin-top:14px"><button type="button" class="el-btn" data-a="restart">Recommencer</button></div>';
          }
        }
        var v = show(
          '<div class="el-head"><button type="button" class="el-back" data-a="home" aria-label="Retour">‹</button><h2>Mes demandes</h2></div>' +
          '<div class="el-body">' + body + '</div>' + tabs('req'),
          'requests');
        if (r) ctx.setStep(r.status === 'end' ? 4 : 3);
        var target = v.querySelector('[data-a="toPro"],[data-a="finish"],[data-a="restart"]');
        if (!visible && r) target = v.querySelector('[data-t="all"]');
        if (!r) target = v.querySelector('[data-a="home"].el-back');
        hint(target);
      }

      /* ---------- côté prestataire ---------- */

      function proView() {
        ctx.setStep(3);
        var p = pro();
        var r = st.req;
        var reqHtml = st.online
          ? '<div class="el-req"><div class="el-new">● Nouvelle demande</div><div class="el-req-top">' +
            '<div class="el-av" style="background:#E2E8F0;color:#334155" aria-hidden="true">👤</div>' +
            '<div><h4>Un client à ' + p.zone + '</h4><p>' + SERVICES[p.svc].label + ' · ' + label(DAYS, r.day) + ' · ' + label(MOMENTS, r.moment) + '</p></div></div>' +
            '<p class="el-info">📍 À ' + p.dist + ' de vous.</p>' +
            '<div class="el-two"><button type="button" class="el-btn ghost" data-a="refuse">Refuser</button>' +
            '<button type="button" class="el-btn" data-a="accept">Accepter</button></div></div>'
          : '<div class="el-empty">Vous êtes hors ligne : aucune demande ne vous arrive.<br>Activez « En ligne » pour en recevoir.</div>';
        var v = show(
          '<div class="el-top"><div class="el-bar"><span class="el-logo">ELIPS</span>' +
          '<button type="button" class="el-switch" data-a="online" aria-pressed="' + st.online + '">' +
          '<span>' + (st.online ? 'En ligne' : 'Hors ligne') + '</span><span class="el-sw' + (st.online ? ' on' : '') + '"></span></button></div>' +
          '<div class="el-hello"><small>Espace prestataire</small>' + p.name + ' · ' + SERVICES[p.svc].label + '</div></div>' +
          '<div class="el-body"><div class="el-stats"><div class="el-stat"><span>Note moyenne</span>★ ' + p.rating + '</div>' +
          '<div class="el-stat"><span>Demandes du jour</span>' + (st.online ? 1 : 0) + '</div></div>' + reqHtml + '</div>',
          'pro', true);
        hint(st.online ? v.querySelector('[data-a="accept"]') : v.querySelector('[data-a="online"]'));
      }

      /* ---------- notation ---------- */

      function rate() {
        ctx.setStep(4);
        var p = pro();
        var stars = '';
        for (var i = 1; i <= 5; i++) {
          stars += '<button type="button" data-a="star" data-n="' + i + '" aria-label="' + i + ' étoile' + (i > 1 ? 's' : '') + '">★</button>';
        }
        var v = show(
          '<div class="el-head"><button type="button" class="el-back" data-a="requests" aria-label="Retour">‹</button><h2>Noter la prestation</h2></div>' +
          '<div class="el-rate">' + avatar(p) + '<h1>' + p.name + '</h1>' +
          '<p>Comment s’est passée l’intervention ?<br>Votre note aide vos voisins à bien choisir.</p>' +
          '<div class="el-stars">' + stars + '</div><div class="el-slab" data-slab></div><div class="el-spacer"></div>' +
          '<button type="button" class="el-btn" data-a="sendRate" disabled>Envoyer la note</button></div>',
          'rate');
        hint(v.querySelector('[data-n="5"]'));
      }

      function thanks() {
        var p = pro();
        var v = show(
          '<div class="el-rate" style="justify-content:center"><div class="el-thanks" aria-hidden="true">✓</div>' +
          '<h1>Merci pour votre note !</h1><p>Vous avez donné ' + st.stars + ' étoile' + (st.stars > 1 ? 's' : '') + ' à ' + p.name + '<br>La demande passe en « Terminée ».</p>' +
          '<div style="margin:14px 0 22px">' + badge('end', true) + '</div>' +
          '<button type="button" class="el-btn" data-a="restart">Recommencer</button></div>',
          'thanks');
        hint(v.querySelector('[data-a="restart"]'));
      }

      /* ---------- interactions ---------- */

      function onClick(e) {
        var b = e.target.closest ? e.target.closest('[data-a]') : null;
        if (!b || !root.contains(b) || b.disabled) return;
        var a = b.getAttribute('data-a');
        var i;
        if (a === 'filter') {
          st.filter = b.getAttribute('data-f') || null;
          home();
          if (!st.filter) { ctx.setStep(1); hint(root.querySelector('.el-pro')); }
        } else if (a === 'call') {
          e.stopPropagation();
          var old = b.textContent;
          if (b.getAttribute('data-busy')) return;
          b.setAttribute('data-busy', '1');
          b.textContent = old === 'Appeler' ? 'Appel…' : '✓';
          later(function () { b.textContent = old; b.removeAttribute('data-busy'); }, 1400);
        } else if (a === 'pro') {
          st.pro = b.getAttribute('data-p');
          openSheet();
        } else if (a === 'close') closeSheet();
        else if (a === 'day' || a === 'moment') {
          st[a] = b.getAttribute('data-k');
          var sib = b.parentNode.querySelectorAll('button');
          for (i = 0; i < sib.length; i++) sib[i].classList.toggle('on', sib[i] === b);
          updateRecap();
          if (st.moment) {
            var send = root.querySelector('[data-a="send"]');
            send.disabled = false;
            hint(send);
          }
        } else if (a === 'send') {
          st.req = { day: st.day, moment: st.moment, status: 'wait' };
          st.tab = 'all';
          ctx.toast('Demande envoyée à ' + pro().name + ' en 2 touches.');
          requests(true);
        } else if (a === 'home') home();
        else if (a === 'requests') requests(false);
        else if (a === 'tab') { st.tab = b.getAttribute('data-t'); requests(false); }
        else if (a === 'toPro') { st.online = true; proView(); }
        else if (a === 'online') { st.online = !st.online; proView(); }
        else if (a === 'accept') {
          st.req.status = 'ok';
          st.tab = 'all';
          ctx.toast(pro().name + ' a accepté votre demande.');
          requests(true);
        } else if (a === 'refuse') {
          st.req.status = 'no';
          st.tab = 'all';
          requests(true);
        } else if (a === 'finish') rate();
        else if (a === 'star') {
          st.stars = Number(b.getAttribute('data-n'));
          var ss = root.querySelectorAll('[data-a="star"]');
          for (i = 0; i < ss.length; i++) ss[i].classList.toggle('on', i < st.stars);
          root.querySelector('[data-slab]').textContent = STAR_LABELS[st.stars];
          var sr = root.querySelector('[data-a="sendRate"]');
          sr.disabled = false;
          hint(sr);
        } else if (a === 'sendRate') {
          st.req.status = 'end';
          thanks();
        } else if (a === 'restart') reset();
      }

      function onKey(e) {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        var t = e.target;
        if (t && t.classList && t.classList.contains('el-pro')) {
          e.preventDefault();
          t.click();
        }
      }

      function build() {
        root.innerHTML =
          '<div class="el-app"><div class="el-sb" aria-hidden="true"><span>9:41</span><span>▂▄▆ 100 %</span></div>' +
          '<div class="el-stage"></div></div>';
        app = root.querySelector('.el-app');
        stage = root.querySelector('.el-stage');
      }

      function reset() {
        clearTimers();
        st = freshState();
        home();
      }

      build();
      root.addEventListener('click', onClick);
      root.addEventListener('keydown', onKey);
      reset();

      return {
        destroy: function () {
          clearTimers();
          root.removeEventListener('click', onClick);
          root.removeEventListener('keydown', onKey);
          root.innerHTML = '';
          root.classList.remove('sim-' + ID, 'is-reduced');
        },
        reset: reset
      };
    }
  };
})();
