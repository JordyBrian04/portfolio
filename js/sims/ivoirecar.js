/* Simulation du musée : IvoireCar (réservation de cars avec chauffeur, ville à ville). */
(function () {
  'use strict';

  var ID = 'ivoirecar';

  var CSS = [
    '.sim-ivoirecar{--g:#0F6B4C;--gl:#ECFDF5;--t:#111827;--s:#6B7280;--b1:#F3F4F6;--b2:#E5E7EB;--star:#F59E0B;--ok:#16A34A;',
    'font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:var(--t);background:#fff;-webkit-tap-highlight-color:transparent}',
    '.sim-ivoirecar *{box-sizing:border-box;margin:0;padding:0}',
    '.sim-ivoirecar button{font:inherit;color:inherit;background:none;border:0;cursor:pointer;touch-action:manipulation}',
    '.sim-ivoirecar .ic-app{position:absolute;inset:0;display:flex;flex-direction:column;background:#fff}',
    '.sim-ivoirecar .ic-sb{height:24px;flex:none;display:flex;justify-content:space-between;align-items:center;padding:0 16px;font-size:11px;font-weight:600;color:var(--t)}',
    '.sim-ivoirecar .ic-stage{position:relative;flex:1;overflow:hidden}',
    '.sim-ivoirecar .ic-view{position:absolute;inset:0;display:flex;flex-direction:column;background:#fff}',
    '.sim-ivoirecar .ic-enter{animation:ic-in .24s ease-out both}',
    '@keyframes ic-in{from{opacity:0;transform:translateX(18px)}to{opacity:1;transform:none}}',
    '@keyframes ic-pop{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:none}}',
    '@keyframes ic-spin{to{transform:rotate(360deg)}}',
    '.sim-ivoirecar .ic-head{height:52px;flex:none;display:flex;align-items:center;gap:8px;padding:0 12px;border-bottom:1px solid var(--b1)}',
    '.sim-ivoirecar .ic-head h2{font-size:16px;font-weight:700}',
    '.sim-ivoirecar .ic-back{width:36px;height:36px;border-radius:10px;font-size:22px;line-height:1;display:flex;align-items:center;justify-content:center}',
    '.sim-ivoirecar .ic-back:active{background:var(--b1)}',
    '.sim-ivoirecar .ic-body{flex:1;overflow-y:auto;overflow-x:hidden;padding:14px 16px;scrollbar-width:none}',
    '.sim-ivoirecar .ic-body::-webkit-scrollbar{display:none}',
    '.sim-ivoirecar .ic-foot{flex:none;padding:10px 16px 14px;border-top:1px solid var(--b1);background:#fff}',
    '.sim-ivoirecar .ic-logo{display:flex;align-items:center;gap:7px;font-weight:800;font-size:18px;letter-spacing:-.3px;color:var(--t)}',
    '.sim-ivoirecar .ic-logo i{width:26px;height:26px;border-radius:8px;background:var(--g);display:flex;align-items:center;justify-content:center;font-style:normal;font-size:14px}',
    '.sim-ivoirecar .ic-logo b{color:var(--g);font-weight:800}',
    '.sim-ivoirecar .ic-avatar{margin-left:auto;width:32px;height:32px;border-radius:50%;background:var(--gl);color:var(--g);font-weight:700;font-size:13px;display:flex;align-items:center;justify-content:center}',
    '.sim-ivoirecar h1{font-size:22px;font-weight:800;letter-spacing:-.3px}',
    '.sim-ivoirecar .ic-sub{font-size:13px;color:var(--s);margin-top:2px}',
    '.sim-ivoirecar .ic-card{border:1px solid var(--b2);border-radius:14px;background:#fff;padding:12px}',
    '.sim-ivoirecar .ic-field{display:flex;align-items:center;gap:10px;height:42px;padding:0 12px;border:1px solid var(--b2);border-radius:12px;font-size:14px;margin-bottom:8px}',
    '.sim-ivoirecar .ic-field small{display:block;font-size:10px;color:var(--s);line-height:1.1}',
    '.sim-ivoirecar .ic-field .ph{color:#9CA3AF}',
    '.sim-ivoirecar .ic-dot{width:10px;height:10px;border-radius:50%;border:2px solid var(--g);flex:none}',
    '.sim-ivoirecar .ic-dot.f{background:var(--g)}',
    '.sim-ivoirecar .ic-btn{display:flex;width:100%;height:52px;border-radius:12px;background:var(--g);color:#fff;font-size:16px;font-weight:600;align-items:center;justify-content:center;gap:8px;transition:opacity .2s,transform .1s}',
    '.sim-ivoirecar .ic-btn:active{transform:scale(.98)}',
    '.sim-ivoirecar .ic-btn[disabled]{opacity:.45;cursor:default}',
    '.sim-ivoirecar .ic-btn.ghost{background:#fff;color:var(--g);border:1px solid var(--b2)}',
    '.sim-ivoirecar .ic-h3{font-size:14px;font-weight:700;margin:14px 0 7px}',
    '.sim-ivoirecar .ic-chips{display:flex;flex-wrap:wrap;gap:6px}',
    '.sim-ivoirecar .ic-chip{height:32px;padding:0 12px;border-radius:999px;border:1px solid var(--b2);background:#fff;font-size:12.5px;font-weight:600;color:var(--t);transition:background .15s,border-color .15s}',
    '.sim-ivoirecar .ic-chip.on{background:var(--gl);border-color:var(--g);color:var(--g)}',
    '.sim-ivoirecar .ic-cats{display:grid;grid-template-columns:1fr 1fr;gap:6px}',
    '.sim-ivoirecar .ic-cat{border:1px solid var(--b1);border-radius:12px;padding:6px 9px;font-size:12px;font-weight:600;display:flex;gap:7px;align-items:center}',
    '.sim-ivoirecar .ic-cat span{display:block;font-size:10.5px;font-weight:500;color:var(--s)}',
    '.sim-ivoirecar .ic-tabs{height:54px;flex:none;display:flex;border-top:1px solid var(--b1)}',
    '.sim-ivoirecar .ic-tabs div{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;font-size:10.5px;color:var(--s)}',
    '.sim-ivoirecar .ic-tabs div.on{color:var(--g);font-weight:700}',
    '.sim-ivoirecar .ic-tabs em{font-style:normal;font-size:16px}',
    '.sim-ivoirecar .ic-veh{display:flex;width:100%;text-align:left;gap:10px;align-items:center;border:1px solid var(--b2);border-radius:14px;padding:10px;margin-bottom:10px;background:#fff;transition:transform .1s,border-color .15s}',
    '.sim-ivoirecar .ic-veh:active{transform:scale(.98);border-color:var(--g)}',
    '.sim-ivoirecar .ic-pic{width:62px;height:62px;flex:none;border-radius:12px;background:linear-gradient(145deg,var(--gl),#D1FAE5);display:flex;align-items:center;justify-content:center;font-size:30px}',
    '.sim-ivoirecar .ic-pic.vip{background:linear-gradient(145deg,#FFFBEB,#FDE68A)}',
    '.sim-ivoirecar .ic-veh h4{font-size:14px;font-weight:700}',
    '.sim-ivoirecar .ic-meta{font-size:11.5px;color:var(--s);margin:2px 0 4px}',
    '.sim-ivoirecar .ic-tag{display:inline-block;font-size:10.5px;font-weight:600;padding:2px 7px;border-radius:999px;background:var(--b1);color:var(--t);margin-right:4px}',
    '.sim-ivoirecar .ic-tag.st{background:#FFFBEB;color:#92400E}',
    '.sim-ivoirecar .ic-price{font-size:15px;font-weight:800;color:var(--g);margin-top:5px}',
    '.sim-ivoirecar .ic-price small{display:block;font-size:10.5px;color:var(--s);font-weight:500}',
    '.sim-ivoirecar .ic-hero{height:118px;border-radius:16px;background:linear-gradient(145deg,var(--g),#14895F);display:flex;align-items:center;justify-content:center;font-size:60px}',
    '.sim-ivoirecar .ic-hero.vip{background:linear-gradient(145deg,#92400E,#D97706)}',
    '.sim-ivoirecar .ic-badges{display:flex;gap:6px;margin:12px 0 4px}',
    '.sim-ivoirecar .ic-badge{font-size:11px;font-weight:700;padding:4px 9px;border-radius:999px;background:var(--gl);color:var(--g)}',
    '.sim-ivoirecar .ic-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px}',
    '.sim-ivoirecar .ic-kv{background:#F9FAFB;border-radius:10px;padding:7px 9px;font-size:13px;font-weight:700}',
    '.sim-ivoirecar .ic-kv span{display:block;font-size:10.5px;color:var(--s);font-weight:500}',
    '.sim-ivoirecar .ic-eq{font-size:12px;padding:5px 9px;border-radius:999px;border:1px solid var(--b2)}',
    '.sim-ivoirecar .ic-alert{margin-top:12px;background:#FFFBEB;border:1px solid #FDE68A;color:#92400E;border-radius:12px;padding:9px 11px;font-size:12px;line-height:1.35}',
    '.sim-ivoirecar .ic-row2{display:grid;grid-template-columns:1.4fr 1fr;gap:8px}',
    '.sim-ivoirecar .ic-lbl{font-size:12px;font-weight:600;color:var(--s);margin:12px 0 5px}',
    '.sim-ivoirecar .ic-lbl:first-child{margin-top:0}',
    '.sim-ivoirecar .ic-in{height:44px;border:1px solid var(--b2);border-radius:12px;padding:0 12px;display:flex;align-items:center;font-size:14px;font-weight:600}',
    '.sim-ivoirecar .ic-step{display:flex;align-items:center;justify-content:space-between;height:44px;border:1px solid var(--b2);border-radius:12px;padding:0 5px}',
    '.sim-ivoirecar .ic-step button{width:34px;height:34px;border-radius:9px;background:var(--gl);color:var(--g);font-size:20px;font-weight:700}',
    '.sim-ivoirecar .ic-step b{font-size:15px}',
    '.sim-ivoirecar .ic-note{font-size:11.5px;color:var(--s);text-align:center;margin-top:8px;line-height:1.35}',
    '.sim-ivoirecar .ic-sum{font-size:12.5px;line-height:1.5;color:var(--s)}',
    '.sim-ivoirecar .ic-sum b{color:var(--t)}',
    '.sim-ivoirecar .ic-tl{margin-top:14px;position:relative}',
    '.sim-ivoirecar .ic-tli{display:flex;gap:12px;padding-bottom:16px;position:relative;opacity:.4;transition:opacity .3s}',
    '.sim-ivoirecar .ic-tli:not(:last-child):after{content:"";position:absolute;left:11px;top:26px;bottom:2px;width:2px;background:var(--b2)}',
    '.sim-ivoirecar .ic-tli.done,.sim-ivoirecar .ic-tli.cur{opacity:1}',
    '.sim-ivoirecar .ic-tli.done:after{background:var(--g)}',
    '.sim-ivoirecar .ic-tld{width:24px;height:24px;flex:none;border-radius:50%;border:2px solid var(--b2);background:#fff;color:#fff;font-size:12px;font-weight:800;display:flex;align-items:center;justify-content:center;transition:background .3s,border-color .3s}',
    '.sim-ivoirecar .ic-tli.done .ic-tld{background:var(--g);border-color:var(--g)}',
    '.sim-ivoirecar .ic-tli.cur .ic-tld{border-color:var(--g);box-shadow:0 0 0 4px var(--gl)}',
    '.sim-ivoirecar .ic-tli h5{font-size:13.5px;font-weight:700}',
    '.sim-ivoirecar .ic-tli p{font-size:11.5px;color:var(--s);margin-top:1px}',
    '.sim-ivoirecar .ic-amount{text-align:center;padding:16px 12px;background:var(--gl);border-radius:14px}',
    '.sim-ivoirecar .ic-amount span{font-size:12px;color:var(--s)}',
    '.sim-ivoirecar .ic-amount strong{display:block;font-size:28px;font-weight:800;color:var(--g);margin:2px 0}',
    '.sim-ivoirecar .ic-pm{display:flex;width:100%;text-align:left;align-items:center;gap:10px;border:1px solid var(--b2);border-radius:12px;padding:10px 12px;margin-bottom:8px;background:#fff}',
    '.sim-ivoirecar .ic-pm.on{border-color:var(--g);background:var(--gl)}',
    '.sim-ivoirecar .ic-pm em{font-style:normal;width:34px;height:34px;border-radius:10px;background:#fff;border:1px solid var(--b2);display:flex;align-items:center;justify-content:center;font-size:17px}',
    '.sim-ivoirecar .ic-pm b{display:block;font-size:13.5px}',
    '.sim-ivoirecar .ic-pm small{font-size:11px;color:var(--s)}',
    '.sim-ivoirecar .ic-radio{margin-left:auto;width:18px;height:18px;border-radius:50%;border:2px solid var(--b2)}',
    '.sim-ivoirecar .ic-pm.on .ic-radio{border:5px solid var(--g)}',
    '.sim-ivoirecar .ic-spin{width:18px;height:18px;border-radius:50%;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;animation:ic-spin .8s linear infinite}',
    '.sim-ivoirecar .ic-done{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:24px}',
    '.sim-ivoirecar .ic-check{width:84px;height:84px;border-radius:50%;background:var(--ok);color:#fff;font-size:44px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:ic-pop .35s ease-out both;box-shadow:0 0 0 10px #DCFCE7}',
    '.sim-ivoirecar .ic-done h1{margin-top:22px}',
    '.sim-ivoirecar .ic-done p{font-size:13px;color:var(--s);margin-top:8px;line-height:1.45}',
    '.sim-ivoirecar .ic-done .ic-card{width:100%;margin:18px 0;text-align:left}',
    '.sim-ivoirecar.is-reduced *,.sim-ivoirecar.is-reduced *:before,.sim-ivoirecar.is-reduced *:after{animation:none!important;transition:none!important}'
  ].join('\n');

  /* Ordre choisi pour que les pastilles tiennent sur 3 lignes. */
  var ROUTES = {
    bke: { from: 'Abidjan', to: 'Bouaké', ppp: 6000 },
    kgo: { from: 'Bouaké', to: 'Korhogo', ppp: 8000 },
    yak: { from: 'Abidjan', to: 'Yamoussoukro', ppp: 4000 },
    sp: { from: 'Abidjan', to: 'San-Pédro', ppp: 6500 }
  };

  var VEHICLES = [
    { id: 'coaster', name: 'Toyota Coaster', cat: 'Minibus', places: 18, rating: '4,6', vip: false,
      eq: ['Climatisation', 'Sièges inclinables', 'Soute à bagages'] },
    { id: 'kinglong', name: 'King Long XMQ', cat: 'Car standard', places: 35, rating: '4,7', vip: false,
      eq: ['Climatisation', 'Sièges inclinables', 'Soute à bagages', 'Prises USB'] },
    { id: 'yutong', name: 'Yutong ZK6122 VIP', cat: 'Car VIP', places: 44, rating: '4,8', vip: true,
      eq: ['Climatisation', 'Wifi', 'TV', 'Toilettes'] }
  ];

  var MOTIFS = ['Mariage', 'Funérailles', 'Séminaire', 'Pèlerinage', 'Sortie scolaire', 'Autre'];

  var STATUSES = [
    { t: 'En attente', p: 'IvoireCar a bien reçu votre demande.' },
    { t: 'Proposée à un propriétaire', p: 'Un propriétaire de car est sollicité.' },
    { t: 'Acceptée', p: 'Le propriétaire a accepté votre trajet.' },
    { t: 'En attente de paiement', p: 'Payez pour confirmer la réservation.' }
  ];

  function fmt(n) {
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA';
  }

  function injectCss() {
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
      'Choisir un trajet fréquent',
      'Comparer les cars et leurs prix',
      'Envoyer la demande, sans payer',
      'Suivre l’accord du propriétaire',
      'Payer par Mobile Money'
    ],
    mount: function (root, ctx) {
      injectCss();
      root.classList.add('sim-' + ID);
      if (ctx.reduced) root.classList.add('is-reduced');

      var timers = [];
      var st;
      var stage;

      function later(fn, ms) {
        var id = setTimeout(function () {
          timers.splice(timers.indexOf(id), 1);
          fn();
        }, ctx.reduced ? Math.min(ms, 150) : ms);
        timers.push(id);
      }
      function clearTimers() {
        while (timers.length) clearTimeout(timers.pop());
      }

      function freshState() {
        return { route: 'bke', veh: 'kinglong', motif: null, pax: 30, pay: 'mm', paying: false };
      }
      function route() { return ROUTES[st.route]; }
      function veh() {
        for (var i = 0; i < VEHICLES.length; i++) if (VEHICLES[i].id === st.veh) return VEHICLES[i];
        return VEHICLES[1];
      }
      function price(v) { return route().ppp * v.places; }

      function hint(el) {
        var old = root.querySelectorAll('.sim-hint');
        for (var i = 0; i < old.length; i++) old[i].classList.remove('sim-hint');
        if (el) el.classList.add('sim-hint');
      }

      function show(html, name) {
        var v = document.createElement('div');
        v.className = 'ic-view' + (ctx.reduced ? '' : ' ic-enter');
        v.setAttribute('data-screen', name);
        v.innerHTML = html;
        stage.innerHTML = '';
        stage.appendChild(v);
        return v;
      }

      function head(title, back) {
        return '<div class="ic-head">' +
          (back ? '<button type="button" class="ic-back" data-a="' + back + '" aria-label="Retour">‹</button>' : '') +
          '<h2>' + title + '</h2></div>';
      }

      /* ---------- écrans ---------- */

      function home() {
        ctx.setStep(0);
        var chips = '';
        Object.keys(ROUTES).forEach(function (k) {
          chips += '<button type="button" class="ic-chip" data-a="route" data-r="' + k + '">' +
            ROUTES[k].from + ' → ' + ROUTES[k].to + '</button>';
        });
        var v = show(
          '<div class="ic-head"><div class="ic-logo"><i aria-hidden="true">🚌</i><span>Ivoire<b>Car</b></span></div>' +
          '<div class="ic-avatar" aria-hidden="true">A</div></div>' +
          '<div class="ic-body">' +
          '<h1>Bonjour Awa</h1><p class="ic-sub">Où voulez-vous emmener votre groupe ?</p>' +
          '<div class="ic-card" style="margin-top:10px">' +
          '<div class="ic-field"><span class="ic-dot"></span><div><small>Ville de départ</small>Abidjan</div></div>' +
          '<div class="ic-field"><span class="ic-dot f"></span><div><small>Ville d’arrivée</small><span class="ph">Choisir une ville</span></div></div>' +
          '<button type="button" class="ic-btn" data-a="search">Rechercher</button></div>' +
          '<div class="ic-h3">Trajets fréquents</div><div class="ic-chips">' + chips + '</div>' +
          '<div class="ic-h3">Catégories de véhicules</div><div class="ic-cats">' +
          '<div class="ic-cat">🚐<div>Minibus<span>15–20 places</span></div></div>' +
          '<div class="ic-cat">🚌<div>Car standard<span>30–40 places</span></div></div>' +
          '<div class="ic-cat">🚍<div>Grand car<span>50–60 places</span></div></div>' +
          '<div class="ic-cat">⭐<div>Car VIP<span>40–50 places</span></div></div></div>' +
          '</div>' +
          '<div class="ic-tabs" aria-hidden="true"><div class="on"><em>🏠</em>Accueil</div><div><em>🗓️</em>Réservations</div><div><em>⚙️</em>Paramètres</div></div>',
          'home');
        hint(v.querySelector('[data-r="bke"]'));
      }

      function results() {
        ctx.setStep(1);
        var r = route();
        var list = '';
        VEHICLES.forEach(function (x) {
          list += '<button type="button" class="ic-veh" data-a="veh" data-v="' + x.id + '">' +
            '<div class="ic-pic' + (x.vip ? ' vip' : '') + '" aria-hidden="true">🚌</div>' +
            '<div style="flex:1;min-width:0"><h4>' + x.name + '</h4>' +
            '<div class="ic-meta">' + x.cat + ' · ' + x.places + ' places</div>' +
            '<span class="ic-tag">Climatisé</span><span class="ic-tag st">★ ' + x.rating + '</span>' +
            '<div class="ic-price">' + fmt(price(x)) + '<small>soit ' + fmt(r.ppp) + ' par place</small></div></div></button>';
        });
        var v = show(
          head(r.from + ' → ' + r.to, 'home') +
          '<div class="ic-body"><p class="ic-sub" style="margin:0 0 12px">Prix du trajet, TVA comprise, pour chaque véhicule.<br>Chauffeur inclus.</p>' +
          list + '</div>',
          'results');
        hint(v.querySelector('[data-v="kinglong"]'));
      }

      function detail() {
        ctx.setStep(1);
        var x = veh();
        var r = route();
        var eq = x.eq.map(function (e) { return '<span class="ic-eq">' + e + '</span>'; }).join('');
        var v = show(
          head(x.name, 'results') +
          '<div class="ic-body">' +
          '<div class="ic-hero' + (x.vip ? ' vip' : '') + '" aria-hidden="true">🚌</div>' +
          '<div class="ic-badges"><span class="ic-badge">✓ Vérifié</span><span class="ic-badge">✓ Chauffeur vérifié</span></div>' +
          '<div class="ic-h3" style="margin-top:8px">Informations clés</div><div class="ic-grid">' +
          '<div class="ic-kv"><span>Places</span>' + x.places + '</div>' +
          '<div class="ic-kv"><span>Note</span>★ ' + x.rating + '</div>' +
          '<div class="ic-kv"><span>Trajet</span>' + r.from + ' → ' + r.to + '</div>' +
          '<div class="ic-kv"><span>Prix du trajet</span>' + fmt(price(x)) + '</div></div>' +
          '<div class="ic-h3">Équipements</div><div class="ic-chips">' + eq + '</div>' +
          '<div class="ic-alert">⏱ Le propriétaire dispose de 12 h pour répondre à votre demande.</div>' +
          '</div><div class="ic-foot"><button type="button" class="ic-btn" data-a="book">Réserver ce véhicule</button></div>',
          'detail');
        hint(v.querySelector('[data-a="book"]'));
      }

      function form() {
        ctx.setStep(2);
        var x = veh();
        st.pax = Math.min(30, x.places);
        var chips = MOTIFS.map(function (m) {
          return '<button type="button" class="ic-chip' + (st.motif === m ? ' on' : '') + '" data-a="motif" data-m="' + m + '">' + m + '</button>';
        }).join('');
        var v = show(
          head('Réserver', 'detail') +
          '<div class="ic-body">' +
          '<div class="ic-lbl">Motif du déplacement</div><div class="ic-chips">' + chips + '</div>' +
          '<div class="ic-lbl">Nombre de passagers</div>' +
          '<div class="ic-step"><button type="button" data-a="pax" data-d="-1" aria-label="Un passager de moins">−</button>' +
          '<b data-pax>' + st.pax + ' passagers</b>' +
          '<button type="button" data-a="pax" data-d="1" aria-label="Un passager de plus">+</button></div>' +
          '<div class="ic-row2"><div><div class="ic-lbl">Date</div><div class="ic-in">Sam. 12 déc.</div></div>' +
          '<div><div class="ic-lbl">Heure</div><div class="ic-in">07:00</div></div></div>' +
          '<div class="ic-lbl">Lieu de prise en charge</div><div class="ic-in">📍 Gare routière d’Adjamé</div>' +
          '</div><div class="ic-foot">' +
          '<button type="button" class="ic-btn" data-a="send"' + (st.motif ? '' : ' disabled') + '>Envoyer la demande de réservation</button>' +
          '<p class="ic-note">Aucun paiement maintenant : notre équipe cherche un propriétaire, puis vous serez prévenu.</p></div>',
          'form');
        hint(st.motif ? v.querySelector('[data-a="send"]') : v.querySelector('[data-m="Mariage"]'));
      }

      function status() {
        ctx.setStep(3);
        var x = veh();
        var r = route();
        var items = STATUSES.map(function (s, i) {
          return '<div class="ic-tli" data-i="' + i + '"><div class="ic-tld">✓</div><div><h5>' + s.t + '</h5><p>' + s.p + '</p></div></div>';
        }).join('');
        var v = show(
          head('Ma réservation') +
          '<div class="ic-body">' +
          '<div class="ic-card ic-sum"><b>' + r.from + ' → ' + r.to + '</b><br>' + x.name + ' · ' + st.pax + ' passagers<br>' +
          (st.motif || 'Déplacement') + ' · Sam. 12 déc. à 07:00<br>Prix : <b>' + fmt(price(x)) + '</b></div>' +
          '<div class="ic-tl">' + items + '</div>' +
          '</div><div class="ic-foot"><button type="button" class="ic-btn" data-a="topay" disabled>Payer maintenant</button></div>',
          'status');
        hint(null);
        var lis = v.querySelectorAll('.ic-tli');
        function setAt(n) {
          for (var i = 0; i < lis.length; i++) {
            lis[i].classList.toggle('done', i < n);
            lis[i].classList.toggle('cur', i === n);
          }
        }
        setAt(0);
        var n = 0;
        function tick() {
          n++;
          setAt(n);
          if (n < STATUSES.length - 1) later(tick, 1100);
          else {
            var b = v.querySelector('[data-a="topay"]');
            b.disabled = false;
            hint(b);
          }
        }
        later(tick, 1300);
      }

      function pay() {
        ctx.setStep(4);
        var x = veh();
        var r = route();
        var v = show(
          head('Paiement') +
          '<div class="ic-body">' +
          '<div class="ic-amount"><span>Montant à payer</span><strong>' + fmt(price(x)) + '</strong>' +
          '<span>' + r.from + ' → ' + r.to + ' · ' + x.name + '</span></div>' +
          '<div class="ic-h3">Moyen de paiement</div>' +
          '<button type="button" class="ic-pm' + (st.pay === 'mm' ? ' on' : '') + '" data-a="pm" data-p="mm"><em>📱</em><div><b>Mobile Money</b><small>Payez depuis votre téléphone</small></div><span class="ic-radio"></span></button>' +
          '<button type="button" class="ic-pm' + (st.pay === 'card' ? ' on' : '') + '" data-a="pm" data-p="card"><em>💳</em><div><b>Carte bancaire</b><small>Visa ou Mastercard</small></div><span class="ic-radio"></span></button>' +
          '<div class="ic-lbl">Numéro Mobile Money</div><div class="ic-in">07 07 07 07 07</div>' +
          '</div><div class="ic-foot"><button type="button" class="ic-btn" data-a="pay">Payer ' + fmt(price(x)) + '</button></div>',
          'pay');
        hint(v.querySelector('[data-a="pay"]'));
      }

      function done() {
        var x = veh();
        var r = route();
        ctx.toast('Paiement reçu : le car est réservé.');
        var v = show(
          '<div class="ic-done"><div class="ic-check" aria-hidden="true">✓</div>' +
          '<h1>Paiement reçu</h1><p>Votre car avec chauffeur est réservé.<br>Rendez-vous à la Gare routière d’Adjamé.</p>' +
          '<div class="ic-card ic-sum"><b>' + r.from + ' → ' + r.to + '</b><br>' + x.name + ' · ' + st.pax + ' passagers<br>Statut : <b style="color:#16A34A">Payée</b></div>' +
          '<button type="button" class="ic-btn" data-a="restart">Recommencer</button></div>',
          'done');
        hint(v.querySelector('[data-a="restart"]'));
      }

      /* ---------- interactions ---------- */

      function onClick(e) {
        var b = e.target.closest ? e.target.closest('[data-a]') : null;
        if (!b || !root.contains(b) || b.disabled) return;
        var a = b.getAttribute('data-a');
        if (a === 'home') home();
        else if (a === 'route') { st.route = b.getAttribute('data-r'); results(); }
        else if (a === 'search') { st.route = 'bke'; results(); }
        else if (a === 'results') results();
        else if (a === 'veh') { st.veh = b.getAttribute('data-v'); detail(); }
        else if (a === 'detail') detail();
        else if (a === 'book') { st.motif = null; form(); }
        else if (a === 'motif') {
          st.motif = b.getAttribute('data-m');
          var cs = root.querySelectorAll('[data-a="motif"]');
          for (var i = 0; i < cs.length; i++) cs[i].classList.toggle('on', cs[i] === b);
          var send = root.querySelector('[data-a="send"]');
          send.disabled = false;
          hint(send);
        } else if (a === 'pax') {
          var max = veh().places;
          st.pax = Math.max(1, Math.min(max, st.pax + Number(b.getAttribute('data-d'))));
          root.querySelector('[data-pax]').textContent = st.pax + (st.pax > 1 ? ' passagers' : ' passager');
        } else if (a === 'send') {
          ctx.toast('Demande envoyée : aucun paiement pour l’instant.');
          status();
        } else if (a === 'topay') pay();
        else if (a === 'pm') {
          st.pay = b.getAttribute('data-p');
          var ps = root.querySelectorAll('[data-a="pm"]');
          for (var j = 0; j < ps.length; j++) ps[j].classList.toggle('on', ps[j] === b);
        } else if (a === 'pay') {
          if (st.paying) return;
          st.paying = true;
          b.disabled = true;
          b.innerHTML = '<span class="ic-spin" aria-hidden="true"></span>Paiement en cours…';
          hint(null);
          later(function () { st.paying = false; done(); }, 1400);
        } else if (a === 'restart') reset();
      }

      function build() {
        root.innerHTML =
          '<div class="ic-app"><div class="ic-sb" aria-hidden="true"><span>9:41</span><span>▂▄▆ 100 %</span></div>' +
          '<div class="ic-stage"></div></div>';
        stage = root.querySelector('.ic-stage');
      }

      function reset() {
        clearTimers();
        st = freshState();
        home();
      }

      build();
      root.addEventListener('click', onClick);
      reset();

      return {
        destroy: function () {
          clearTimers();
          root.removeEventListener('click', onClick);
          root.innerHTML = '';
          root.classList.remove('sim-' + ID, 'is-reduced');
        },
        reset: reset
      };
    }
  };
})();
