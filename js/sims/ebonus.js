/* Simulation eBonus : fidélité chez les partenaires, points convertis en bons. Données fictives. */
(function () {
  'use strict';

  var ID = 'ebonus';
  var LOGO = 'assets/musee/ebonus.png';

  var PARTNERS = [
    { id: 'station', name: 'Station Lagune Énergie', type: 'Station-service', ico: '⛽', where: 'Cocody · 1,2 km', rate: '3 %', bg: '#e0f5f3' },
    { id: 'marche', name: 'Marché Akwaba', type: 'Supermarché', ico: '🛒', where: 'Marcory · 2,8 km', rate: '5 %', bg: '#ede4fd' },
    { id: 'maquis', name: 'Le Maquis du Plateau', type: 'Restaurant', ico: '🍽️', where: 'Plateau · 4,1 km', rate: null, bg: '#fff1e0' },
    { id: 'hotel', name: 'Hôtel Les Palmiers', type: 'Hôtel', ico: '🏨', where: 'Grand-Bassam · 38 km', rate: null, bg: '#e6f0ff' }
  ];

  var ICON = {
    home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 11l8-7 8 7v9H4z"/><path d="M10 20v-5h4v5"/></svg>',
    map: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6-6-6-11a6 6 0 0112 0c0 5-6 11-6 11z"/><circle cx="12" cy="10" r="2.2"/></svg>',
    bon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8a2 2 0 002-2h14a2 2 0 002 2v2a2 2 0 000 4v2a2 2 0 00-2 2H5a2 2 0 00-2-2v-2a2 2 0 000-4z"/><path d="M10 9l4 6"/></svg>',
    user: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/></svg>'
  };

  var CSS = [
    '.sim-ebonus{--eb-p:#009689;--eb-t:#0d9488;--eb-v:#7c3aed;--eb-g:#c1c1c1;--eb-g2:#f0f0f0;--eb-r:#e53935;--eb-tx:#1d2a2a;--eb-tx2:#6b7676;',
    'font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;background:#fff;color:var(--eb-tx);-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent}',
    '.sim-ebonus *{box-sizing:border-box}',
    '.sim-ebonus button{font:inherit;cursor:pointer;border:0;background:none;color:inherit;padding:0;text-align:inherit}',
    '.sim-ebonus .eb-scr{position:absolute;inset:0;display:flex;flex-direction:column;background:#fff;animation:eb-in .22s ease}',
    '@keyframes eb-in{from{opacity:0;transform:translateX(18px)}}',
    '.sim-ebonus .eb-body{flex:1;min-height:0;overflow-y:auto;padding:0 18px 14px}',
    '.sim-ebonus .eb-cta{width:100%;background:var(--eb-p);color:#fff;font-weight:700;font-size:15px;padding:14px;border-radius:14px;text-align:center;box-shadow:0 6px 16px rgba(0,150,137,.3)}',
    '.sim-ebonus .eb-cta.eb-vi{background:var(--eb-v);box-shadow:0 6px 16px rgba(124,58,237,.3)}',
    '.sim-ebonus .eb-foot{padding:10px 18px 18px;flex:none}',
    /* verrouillage */
    '.sim-ebonus .eb-lock{align-items:center;padding:52px 26px 24px;background:linear-gradient(180deg,#e6f6f4 0,#fff 46%)}',
    '.sim-ebonus .eb-lock img{width:74px;height:74px;border-radius:20px;box-shadow:0 8px 22px rgba(0,150,137,.3)}',
    '.sim-ebonus .eb-lock h2{font-size:21px;margin:18px 0 6px;text-align:center}',
    '.sim-ebonus .eb-lock p{margin:0;color:var(--eb-tx2);font-size:13.5px}',
    '.sim-ebonus .eb-dots{display:flex;gap:16px;margin:24px 0 30px}',
    '.sim-ebonus .eb-dots i{width:15px;height:15px;border-radius:50%;border:2px solid var(--eb-p);transition:background .15s,transform .15s}',
    '.sim-ebonus .eb-dots i.on{background:var(--eb-p);transform:scale(1.1)}',
    '.sim-ebonus .eb-pad{display:grid;grid-template-columns:repeat(3,68px);gap:12px 22px;border-radius:20px;padding:6px}',
    '.sim-ebonus .eb-key{width:68px;height:58px;border-radius:18px;background:var(--eb-g2);font-size:23px;font-weight:600;text-align:center;transition:background .1s,transform .1s}',
    '.sim-ebonus .eb-key:active{background:#d9eeec;transform:scale(.94)}',
    '.sim-ebonus .eb-key.eb-ghost{background:none;font-size:20px;color:var(--eb-tx2)}',
    '.sim-ebonus .eb-anyc{margin-top:16px!important;font-size:12px!important}',
    /* accueil */
    '.sim-ebonus .eb-hero{background:var(--eb-p);color:#fff;padding:22px 18px 62px;border-radius:0 0 26px 26px;flex:none;position:relative;overflow:hidden}',
    '.sim-ebonus .eb-hero:after{content:"";position:absolute;right:-40px;top:-50px;width:160px;height:160px;border-radius:50%;background:rgba(255,255,255,.09)}',
    '.sim-ebonus .eb-brand{font-weight:800;font-size:15px;opacity:.9;display:flex;align-items:center;gap:7px}',
    '.sim-ebonus .eb-brand img{width:24px;height:24px;border-radius:7px}',
    '.sim-ebonus .eb-hello{font-size:23px;font-weight:800;margin-top:14px}',
    '.sim-ebonus .eb-hello small{display:block;font-size:13px;font-weight:500;opacity:.85;margin-top:2px}',
    '.sim-ebonus .eb-bal{margin:-46px 18px 0;background:#fff;border-radius:20px;padding:16px 18px;box-shadow:0 10px 26px rgba(0,60,55,.14);position:relative;z-index:1;flex:none}',
    '.sim-ebonus .eb-bal span{font-size:12px;color:var(--eb-tx2);font-weight:600}',
    '.sim-ebonus .eb-bal b{display:block;font-size:30px;color:var(--eb-p);margin-top:2px;letter-spacing:-.5px}',
    '.sim-ebonus .eb-bal b em{font-style:normal;font-size:14px;font-weight:700;margin-left:4px}',
    '.sim-ebonus .eb-bal.eb-pulse{animation:eb-pulse .6s ease}',
    '@keyframes eb-pulse{40%{transform:scale(1.04)}}',
    '.sim-ebonus .eb-quick{display:flex;gap:10px;margin:14px 0 4px}',
    '.sim-ebonus .eb-q{flex:1;border-radius:16px;padding:12px 12px;font-size:12.5px;font-weight:700;display:flex;flex-direction:column;gap:6px}',
    '.sim-ebonus .eb-q i{font-style:normal;font-size:19px}',
    '.sim-ebonus .eb-q.a{background:#e0f5f3;color:#00756b}',
    '.sim-ebonus .eb-q.b{background:#ede4fd;color:var(--eb-v)}',
    '.sim-ebonus .eb-h3{font-size:14px;font-weight:800;margin:16px 0 8px}',
    '.sim-ebonus .eb-tx{display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--eb-g2)}',
    '.sim-ebonus .eb-tx:last-child{border-bottom:0}',
    '.sim-ebonus .eb-tx .eb-ic{width:34px;height:34px;border-radius:11px;background:var(--eb-g2);display:grid;place-items:center;font-size:16px;flex:none}',
    '.sim-ebonus .eb-tx div{flex:1;min-width:0;font-size:12.5px;font-weight:600;line-height:1.3}',
    '.sim-ebonus .eb-tx div small{display:block;font-weight:400;color:var(--eb-tx2);font-size:11px}',
    '.sim-ebonus .eb-tx b{font-size:13px;white-space:nowrap}',
    '.sim-ebonus .eb-plus{color:var(--eb-p)}',
    '.sim-ebonus .eb-minus{color:var(--eb-r)}',
    '.sim-ebonus .eb-tx.eb-new{animation:eb-new 1s ease}',
    '@keyframes eb-new{from{background:#d9f3f0}}',
    /* barre d’onglets */
    '.sim-ebonus .eb-nav{height:62px;flex:none;display:flex;border-top:1px solid var(--eb-g2);background:#fff;padding:6px 6px 8px}',
    '.sim-ebonus .eb-nb{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;font-size:10px;font-weight:600;color:#9aa3a3;border-radius:12px;text-align:center}',
    '.sim-ebonus .eb-nb svg{width:21px;height:21px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}',
    '.sim-ebonus .eb-nb.on{color:var(--eb-p)}',
    '.sim-ebonus .eb-nb.off{opacity:.55;cursor:default}',
    /* en-tête secondaire */
    '.sim-ebonus .eb-top{display:flex;align-items:center;gap:8px;padding:18px 14px 10px;flex:none}',
    '.sim-ebonus .eb-back{width:36px;height:36px;border-radius:12px;background:var(--eb-g2);font-size:20px;text-align:center!important;line-height:36px}',
    '.sim-ebonus .eb-top h2{font-size:18px;margin:0}',
    '.sim-ebonus .eb-lead{font-size:13px;color:var(--eb-tx2);margin:0 0 12px}',
    '.sim-ebonus .eb-search{display:flex;align-items:center;gap:8px;background:var(--eb-g2);border-radius:14px;padding:11px 12px;font-size:13px;color:#8b9595;margin-bottom:10px}',
    '.sim-ebonus .eb-chips{display:flex;gap:6px;overflow:hidden;margin-bottom:12px}',
    '.sim-ebonus .eb-chips span{flex:none;font-size:11.5px;font-weight:600;padding:6px 10px;border-radius:999px;background:var(--eb-g2);color:var(--eb-tx2)}',
    '.sim-ebonus .eb-chips span.on{background:var(--eb-p);color:#fff}',
    '.sim-ebonus .eb-pt{display:flex;align-items:center;gap:11px;width:100%;padding:11px;border-radius:16px;border:1px solid var(--eb-g2);margin-bottom:9px;background:#fff}',
    '.sim-ebonus button.eb-pt{box-shadow:0 6px 16px rgba(0,60,55,.1);border-color:#bfe6e1}',
    '.sim-ebonus .eb-pt .eb-ic{width:44px;height:44px;border-radius:14px;display:grid;place-items:center;font-size:21px;flex:none}',
    '.sim-ebonus .eb-pt div{flex:1;min-width:0}',
    '.sim-ebonus .eb-pt strong{display:block;font-size:13.5px}',
    '.sim-ebonus .eb-pt small{display:block;font-size:11px;color:var(--eb-tx2);margin-top:2px}',
    '.sim-ebonus .eb-rate{font-size:11.5px;font-weight:800;color:var(--eb-p);background:#e0f5f3;padding:5px 8px;border-radius:999px;white-space:nowrap}',
    /* détail */
    '.sim-ebonus .eb-dhero{height:128px;flex:none;background:linear-gradient(135deg,var(--eb-p),var(--eb-t));position:relative;display:flex;align-items:flex-end;padding:0 18px 14px}',
    '.sim-ebonus .eb-dhero .eb-back{position:absolute;left:14px;top:16px;background:rgba(255,255,255,.25);color:#fff}',
    '.sim-ebonus .eb-dlogo{width:62px;height:62px;border-radius:18px;background:#fff;display:grid;place-items:center;font-size:30px;box-shadow:0 6px 16px rgba(0,0,0,.15);margin-bottom:-36px}',
    '.sim-ebonus .eb-dname{font-size:19px;font-weight:800;margin:44px 0 2px}',
    '.sim-ebonus .eb-badges{display:flex;flex-wrap:wrap;gap:6px;margin:12px 0}',
    '.sim-ebonus .eb-badges span{font-size:11.5px;font-weight:700;padding:6px 10px;border-radius:999px;background:#ede4fd;color:var(--eb-v)}',
    '.sim-ebonus .eb-badges span.t{background:#e0f5f3;color:#00756b}',
    '.sim-ebonus .eb-info{background:#f7f9f9;border-radius:16px;padding:4px 14px}',
    '.sim-ebonus .eb-row{display:flex;justify-content:space-between;gap:10px;font-size:12.5px;padding:10px 0;border-bottom:1px solid var(--eb-g2)}',
    '.sim-ebonus .eb-row:last-child{border-bottom:0}',
    '.sim-ebonus .eb-row span{color:var(--eb-tx2)}',
    '.sim-ebonus .eb-row b{text-align:right}',
    /* assistant */
    '.sim-ebonus .eb-stepper{display:flex;align-items:center;gap:6px;padding:0 18px 14px;flex:none}',
    '.sim-ebonus .eb-stepper i{width:26px;height:26px;border-radius:50%;display:grid;place-items:center;font-size:12px;font-weight:800;font-style:normal;background:var(--eb-g2);color:#9aa3a3;flex:none}',
    '.sim-ebonus .eb-stepper i.on{background:var(--eb-p);color:#fff}',
    '.sim-ebonus .eb-stepper u{flex:1;height:3px;border-radius:2px;background:var(--eb-g2)}',
    '.sim-ebonus .eb-stepper u.on{background:var(--eb-p)}',
    '.sim-ebonus .eb-kicker{font-size:11.5px;font-weight:800;color:var(--eb-p);letter-spacing:.05em;margin:0 0 4px}',
    '.sim-ebonus .eb-h2{font-size:19px;font-weight:800;margin:0 0 14px;line-height:1.25}',
    '.sim-ebonus .eb-opt{display:flex;gap:11px;align-items:center;width:100%;border:2px solid var(--eb-g2);border-radius:16px;padding:12px;margin-bottom:9px;font-size:13px}',
    '.sim-ebonus .eb-opt.on{border-color:var(--eb-p);background:#f0faf9}',
    '.sim-ebonus .eb-opt.dis{opacity:.5}',
    '.sim-ebonus .eb-opt strong{display:block;font-size:13.5px}',
    '.sim-ebonus .eb-opt small{color:var(--eb-tx2);font-size:11.5px}',
    '.sim-ebonus .eb-radio{width:20px;height:20px;border-radius:50%;border:2px solid var(--eb-g);flex:none}',
    '.sim-ebonus .eb-opt.on .eb-radio{border:6px solid var(--eb-p)}',
    '.sim-ebonus .eb-amount{border:2px solid var(--eb-p);border-radius:18px;padding:18px;text-align:center;margin-bottom:12px}',
    '.sim-ebonus .eb-amount span{font-size:12px;color:var(--eb-tx2)}',
    '.sim-ebonus .eb-amount b{display:block;font-size:34px;margin-top:4px}',
    '.sim-ebonus .eb-gain{display:flex;align-items:center;gap:10px;background:#e0f5f3;color:#00756b;border-radius:14px;padding:12px;font-size:13px;font-weight:600}',
    '.sim-ebonus .eb-gain b{font-size:16px}',
    '.sim-ebonus .eb-qrwrap{display:flex;flex-direction:column;align-items:center}',
    '.sim-ebonus .eb-qr{position:relative;width:196px;height:196px;padding:14px;border-radius:22px;background:#fff;box-shadow:0 8px 24px rgba(0,60,55,.16);overflow:hidden}',
    '.sim-ebonus .eb-qr svg{width:100%;height:100%;display:block}',
    '.sim-ebonus .eb-qr .eb-corner{position:absolute;width:26px;height:26px;border:4px solid var(--eb-p)}',
    '.sim-ebonus .eb-qr .c1{left:6px;top:6px;border-right:0;border-bottom:0;border-radius:10px 0 0 0}',
    '.sim-ebonus .eb-qr .c2{right:6px;top:6px;border-left:0;border-bottom:0;border-radius:0 10px 0 0}',
    '.sim-ebonus .eb-qr .c3{left:6px;bottom:6px;border-right:0;border-top:0;border-radius:0 0 0 10px}',
    '.sim-ebonus .eb-qr .c4{right:6px;bottom:6px;border-left:0;border-top:0;border-radius:0 0 10px 0}',
    '.sim-ebonus .eb-line{position:absolute;left:10px;right:10px;top:12px;height:3px;border-radius:2px;background:var(--eb-p);box-shadow:0 0 12px 3px rgba(0,150,137,.55);animation:eb-scan 1.8s ease-in-out infinite alternate}',
    '@keyframes eb-scan{to{transform:translateY(168px)}}',
    '.sim-ebonus .eb-qr.eb-ok:after{content:"✓";position:absolute;inset:0;display:grid;place-items:center;font-size:64px;font-weight:900;color:#fff;background:rgba(0,150,137,.9);animation:eb-fadein .2s ease}',
    '@keyframes eb-fadein{from{opacity:0}}',
    '.sim-ebonus .eb-qrnote{font-size:12px;color:var(--eb-tx2);text-align:center;margin:14px 0 0;line-height:1.45}',
    /* récap / bons / succès */
    '.sim-ebonus .eb-okc{width:64px;height:64px;border-radius:50%;background:var(--eb-p);color:#fff;font-size:32px;font-weight:900;display:grid;place-items:center;margin:4px auto 10px;animation:eb-pop .35s ease}',
    '@keyframes eb-pop{from{transform:scale(.5);opacity:0}}',
    '.sim-ebonus .eb-center{text-align:center}',
    '.sim-ebonus .eb-credit{background:linear-gradient(135deg,var(--eb-p),var(--eb-t));color:#fff;border-radius:18px;padding:14px 16px;margin:12px 0;display:flex;justify-content:space-between;align-items:center}',
    '.sim-ebonus .eb-credit span{font-size:12.5px;opacity:.9}',
    '.sim-ebonus .eb-credit b{font-size:26px}',
    '.sim-ebonus .eb-seg{display:flex;background:var(--eb-g2);border-radius:14px;padding:4px;margin-bottom:14px}',
    '.sim-ebonus .eb-seg button{flex:1;text-align:center;font-size:12.5px;font-weight:700;padding:8px 4px;border-radius:11px;color:var(--eb-tx2)}',
    '.sim-ebonus .eb-seg button.on{background:#fff;color:var(--eb-tx);box-shadow:0 2px 6px rgba(0,0,0,.08)}',
    '.sim-ebonus .eb-coupon{border-radius:20px;overflow:hidden;box-shadow:0 10px 26px rgba(124,58,237,.2);margin-bottom:12px}',
    '.sim-ebonus .eb-ctop{background:linear-gradient(135deg,var(--eb-v),#9b5cf6);color:#fff;padding:16px 16px 18px;position:relative}',
    '.sim-ebonus .eb-ctop b{font-size:34px;display:block;line-height:1}',
    '.sim-ebonus .eb-ctop span{font-size:14px;font-weight:600}',
    '.sim-ebonus .eb-ctop em{position:absolute;right:14px;top:14px;font-style:normal;font-size:11px;font-weight:800;background:#fff;color:var(--eb-v);padding:4px 9px;border-radius:999px}',
    '.sim-ebonus .eb-ctop em.used{color:var(--eb-tx2)}',
    '.sim-ebonus .eb-cbot{background:#fff;padding:12px 16px 14px;border:1px solid #eadffd;border-top:2px dashed #d9c7fb;border-radius:0 0 20px 20px}',
    '.sim-ebonus .eb-cbot p{margin:0 0 10px;font-size:12px;color:var(--eb-tx2)}',
    '.sim-ebonus .eb-sum{background:#f7f9f9;border-radius:16px;padding:4px 14px;margin-bottom:12px}',
    '.sim-ebonus .eb-pay{background:#ede4fd;border-radius:18px;padding:16px;text-align:center}',
    '.sim-ebonus .eb-pay span{font-size:12.5px;color:var(--eb-v);font-weight:700}',
    '.sim-ebonus .eb-pay b{display:block;font-size:30px;color:var(--eb-v);margin-top:2px}',
    '.sim-ebonus .eb-empty{text-align:center;color:var(--eb-tx2);font-size:13px;padding:30px 10px}',
    '.sim-ebonus .eb-confetti{font-size:54px;text-align:center;margin:10px 0 4px;animation:eb-pop .4s ease}',
    '.sim-ebonus.eb-reduced *,.sim-ebonus.eb-reduced *:before,.sim-ebonus.eb-reduced *:after{animation:none!important;transition:none!important}'
  ].join('\n');

  function injectCSS() {
    if (document.getElementById('sim-' + ID + '-css')) return;
    var s = document.createElement('style');
    s.id = 'sim-' + ID + '-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }

  /* faux QR code déterministe : 25 x 25 modules + 3 repères */
  var QR_SVG = (function () {
    var N = 25, seed = 7, out = '';
    function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    function inFinder(x, y) {
      return (x < 8 && y < 8) || (x > N - 9 && y < 8) || (x < 8 && y > N - 9);
    }
    for (var y = 0; y < N; y++) {
      for (var x = 0; x < N; x++) {
        if (inFinder(x, y)) continue;
        if (rnd() > 0.52) out += '<rect x="' + x + '" y="' + y + '" width="1" height="1"/>';
      }
    }
    function finder(fx, fy) {
      return '<rect x="' + fx + '.5" y="' + fy + '.5" width="6" height="6" fill="none" stroke="#123" stroke-width="1"/>' +
        '<rect x="' + (fx + 2) + '" y="' + (fy + 2) + '" width="3" height="3"/>';
    }
    return '<svg viewBox="0 0 25 25" shape-rendering="crispEdges" aria-hidden="true"><g fill="#123">' + out +
      finder(0, 0) + finder(N - 7, 0) + finder(0, N - 7) + '</g></svg>';
  })();

  window.MuseumSims = window.MuseumSims || {};
  window.MuseumSims[ID] = {
    frame: 'phone',
    steps: [
      'Déverrouillez avec votre code PIN',
      'Trouvez un partenaire près de vous',
      'Enregistrez votre achat',
      'Scannez le QR code de l’agent',
      'Gagnez des eBonus',
      'Utilisez votre bon de réduction'
    ],
    mount: function (root, ctx) {
      injectCSS();
      ctx = ctx || {};
      var reduced = !!ctx.reduced;
      var setStep = function (i) { if (ctx.setStep) ctx.setStep(i); };
      var toast = function (t) { if (ctx.toast) ctx.toast(t); };

      root.classList.add('sim-' + ID);
      if (reduced) root.classList.add('eb-reduced');

      var ac = new AbortController();
      var timers = new Set();
      function later(fn, ms) {
        var id = setTimeout(function () { timers.delete(id); fn(); }, ms);
        timers.add(id);
        return id;
      }
      function clearTimers() { timers.forEach(clearTimeout); timers.clear(); }

      var S;
      function freshState() {
        return {
          screen: 'lock', pin: '', balance: 12500, earned: false, bonUsed: false, seg: 'actifs', scanning: false,
          history: [
            { ico: '🛒', label: 'Conversion en bon chez Marché Akwaba', date: 'Hier', amt: -2000 },
            { ico: '🍽️', label: 'Achat au Maquis du Plateau', date: '12 nov.', amt: 300 },
            { ico: '🎁', label: 'Solde de bienvenue 🎉', date: '2 nov.', amt: 1000 }
          ]
        };
      }

      function hint(sel) {
        var old = root.querySelectorAll('.sim-hint');
        for (var i = 0; i < old.length; i++) old[i].classList.remove('sim-hint');
        if (!sel) return;
        var el = root.querySelector(sel);
        if (el) el.classList.add('sim-hint');
      }

      function nav(active) {
        function b(id, label, ic) {
          return '<button type="button" class="eb-nb' + (active === id ? ' on' : '') + '" data-act="' + id + '" aria-label="' + label + '">' + ic + '<span>' + label + '</span></button>';
        }
        return '<nav class="eb-nav" aria-label="Navigation">' + b('home', 'Accueil', ICON.home) + b('partners', 'Partenaires', ICON.map) +
          b('bons', 'Mes bons', ICON.bon) + '<div class="eb-nb off" aria-hidden="true">' + ICON.user + '<span>Profil</span></div></nav>';
      }
      function top(title, back) {
        return '<div class="eb-top"><button type="button" class="eb-back" data-act="' + back + '" aria-label="Retour">‹</button><h2>' + title + '</h2></div>';
      }
      function stepper(n) {
        var h = '<div class="eb-stepper" aria-label="Étape ' + n + ' sur 3">';
        for (var i = 1; i <= 3; i++) {
          h += '<i class="' + (i <= n ? 'on' : '') + '">' + i + '</i>';
          if (i < 3) h += '<u class="' + (i < n ? 'on' : '') + '"></u>';
        }
        return h + '</div>';
      }
      function txRow(t, isNew) {
        return '<div class="eb-tx' + (isNew ? ' eb-new' : '') + '"><span class="eb-ic">' + t.ico + '</span><div>' + t.label + '<small>' + t.date + '</small></div>' +
          '<b class="' + (t.amt > 0 ? 'eb-plus' : 'eb-minus') + '">' + (t.amt > 0 ? '+' : '-') + fmt(Math.abs(t.amt)) + ' F</b></div>';
      }

      /* ---------- écrans ---------- */
      var SCREENS = {
        lock: function () {
          var dots = '';
          for (var i = 0; i < 4; i++) dots += '<i class="' + (i < S.pin.length ? 'on' : '') + '"></i>';
          var keys = '';
          [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(function (k) {
            keys += '<button type="button" class="eb-key" data-act="key" data-k="' + k + '" aria-label="' + k + '">' + k + '</button>';
          });
          keys += '<span></span><button type="button" class="eb-key" data-act="key" data-k="0" aria-label="0">0</button>' +
            '<button type="button" class="eb-key eb-ghost" data-act="del" aria-label="Effacer">⌫</button>';
          return {
            html: '<div class="eb-scr eb-lock"><img src="' + LOGO + '" alt="eBonus"><h2>Déverrouillez eBonus</h2>' +
              '<p>Saisissez votre code PIN</p><div class="eb-dots" aria-label="' + S.pin.length + ' chiffres saisis sur 4">' + dots + '</div>' +
              '<div class="eb-pad">' + keys + '</div><p class="eb-anyc">Démo : n’importe quel code à 4 chiffres</p></div>',
            hint: '.eb-pad', step: 0
          };
        },
        home: function () {
          var h = S.history.map(function (t, i) { return txRow(t, S.earned && i === 0 && !S.seenHome); }).join('');
          S.seenHome = true;
          return {
            html: '<div class="eb-scr"><div class="eb-hero"><div class="eb-brand"><img src="' + LOGO + '" alt="">eBonus</div>' +
              '<div class="eb-hello">Bonjour Awa 👋<small>Chaque achat chez nos partenaires vous rapporte.</small></div></div>' +
              '<div class="eb-bal' + (S.earned ? ' eb-pulse' : '') + '"><span>Mon solde</span><b>' + fmt(S.balance) + '<em>eBonus</em></b></div>' +
              '<div class="eb-body"><div class="eb-quick">' +
              '<button type="button" class="eb-q a" data-act="partners"><i>🔍</i>Rechercher un partenaire</button>' +
              '<button type="button" class="eb-q b" data-act="bons"><i>🎟️</i>Mes bons</button></div>' +
              '<div class="eb-h3">Historique des transactions</div>' + h + '</div>' + nav('home') + '</div>',
            hint: S.earned ? (S.bonUsed ? null : '.eb-q.b') : '.eb-q.a', step: S.earned ? 4 : 1
          };
        },
        partners: function () {
          var list = PARTNERS.map(function (p) {
            var inner = '<span class="eb-ic" style="background:' + p.bg + '">' + p.ico + '</span><div><strong>' + p.name + '</strong><small>' +
              p.type + ' · ' + p.where + '</small></div>' + (p.rate ? '<span class="eb-rate">' + p.rate + '</span>' : '');
            return p.id === 'station'
              ? '<button type="button" class="eb-pt" data-act="detail" aria-label="Voir ' + p.name + '">' + inner + '</button>'
              : '<div class="eb-pt">' + inner + '</div>';
          }).join('');
          return {
            html: '<div class="eb-scr">' + top('Partenaires', 'home') + '<div class="eb-body">' +
              '<p class="eb-lead">Où gagner et dépenser vos eBonus ?</p>' +
              '<div class="eb-search">🔍 Rechercher un partenaire</div>' +
              '<div class="eb-chips"><span class="on">Tous</span><span>Station-service</span><span>Supermarché</span><span>Restaurant</span><span>Hôtel</span></div>' +
              list + '</div>' + nav('partners') + '</div>',
            hint: '[data-act="detail"]', step: 1
          };
        },
        detail: function () {
          return {
            html: '<div class="eb-scr"><div class="eb-dhero"><button type="button" class="eb-back" data-act="partners" aria-label="Retour">‹</button>' +
              '<div class="eb-dlogo">⛽</div></div><div class="eb-body">' +
              '<div class="eb-dname">Station Lagune Énergie</div><p class="eb-lead" style="margin:0">Station-service · Cocody, Abidjan</p>' +
              '<div class="eb-badges"><span class="t">3 % en eBonus</span><span>Remise premier achat</span><span>Bon de réduction automatique</span></div>' +
              '<div class="eb-info"><div class="eb-row"><span>Horaires</span><b>6 h – 22 h, 7 j/7</b></div>' +
              '<div class="eb-row"><span>Gain</span><b>3 F d’eBonus pour 100 F</b></div>' +
              '<div class="eb-row"><span>Validation</span><b>QR code de l’agent</b></div></div></div>' +
              '<div class="eb-foot"><button type="button" class="eb-cta" data-act="wiz1">Enregistrer un achat</button></div></div>',
            hint: '[data-act="wiz1"]', step: 1
          };
        },
        wiz1: function () {
          return {
            html: '<div class="eb-scr">' + top('Valider un achat', 'detail') + stepper(1) + '<div class="eb-body">' +
              '<p class="eb-kicker">ÉTAPE 1</p><div class="eb-h2">Sélectionner un bon</div>' +
              '<div class="eb-opt on"><span class="eb-radio"></span><div><strong>Aucun bon : cumuler des eBonus</strong><small>3 % du montant crédité sur votre solde</small></div></div>' +
              '<div class="eb-opt dis"><span class="eb-radio"></span><div><strong>-10 % chez Marché Akwaba</strong><small>Non valable dans cette station</small></div></div>' +
              '</div><div class="eb-foot"><button type="button" class="eb-cta" data-act="wiz2">Continuer</button></div></div>',
            hint: '[data-act="wiz2"]', step: 2
          };
        },
        wiz2: function () {
          return {
            html: '<div class="eb-scr">' + top('Valider un achat', 'wiz1') + stepper(2) + '<div class="eb-body">' +
              '<p class="eb-kicker">ÉTAPE 2</p><div class="eb-h2">Montant de l’achat</div>' +
              '<div class="eb-amount"><span>Plein d’essence · Station Lagune Énergie</span><b>15 000 F</b></div>' +
              '<div class="eb-gain">✨<div>Vous allez gagner <b>+450 eBonus</b><br><small>3 % de 15 000 F</small></div></div>' +
              '</div><div class="eb-foot"><button type="button" class="eb-cta" data-act="wiz3">Continuer</button></div></div>',
            hint: '[data-act="wiz3"]', step: 2
          };
        },
        wiz3: function () {
          return {
            html: '<div class="eb-scr">' + top('Valider un achat', 'wiz2') + stepper(3) + '<div class="eb-body">' +
              '<p class="eb-kicker">ÉTAPE 3</p><div class="eb-h2">Scannez le QR code de l’agent pour valider</div>' +
              '<div class="eb-qrwrap"><button type="button" class="eb-qr" data-act="scan" aria-label="Scanner le QR code de l’agent">' + QR_SVG +
              '<span class="eb-corner c1"></span><span class="eb-corner c2"></span><span class="eb-corner c3"></span><span class="eb-corner c4"></span>' +
              '<span class="eb-line"></span></button>' +
              '<p class="eb-qrnote">L’agent de la station affiche ce code.<br><b>Touchez le QR code pour le scanner.</b></p></div></div></div>',
            hint: '[data-act="scan"]', step: 3
          };
        },
        recap: function () {
          return {
            html: '<div class="eb-scr">' + top('Récapitulatif', 'home') + '<div class="eb-body eb-center">' +
              '<div class="eb-okc">✓</div><div class="eb-h2" style="margin-bottom:4px">Achat validé</div>' +
              '<p class="eb-lead">Station Lagune Énergie · Cocody</p>' +
              '<div class="eb-credit"><span>Crédit eBonus</span><b>+450</b></div>' +
              '<div class="eb-info" style="text-align:left"><div class="eb-row"><span>Montant de l’achat</span><b>15 000 F</b></div>' +
              '<div class="eb-row"><span>Taux partenaire</span><b>3 %</b></div>' +
              '<div class="eb-row"><span>Nouveau solde</span><b class="eb-plus eb-count">' + fmt(12500) + ' eBonus</b></div></div></div>' +
              '<div class="eb-foot"><button type="button" class="eb-cta eb-vi" data-act="bons">Voir mes bons</button></div></div>',
            hint: '[data-act="bons"]', step: 4, after: countUp
          };
        },
        bons: function () {
          var body;
          if (S.seg === 'actifs') {
            body = S.bonUsed ? '<div class="eb-empty">Aucun bon actif.<br>Continuez à cumuler des eBonus !</div>' : coupon(false);
          } else if (S.seg === 'encours') {
            body = '<div class="eb-empty">Aucun bon en cours de création.</div>';
          } else {
            body = (S.bonUsed ? coupon(true) : '') + '<div class="eb-pt"><span class="eb-ic" style="background:#fff1e0">🍽️</span><div><strong>-5 % au Maquis du Plateau</strong><small>Utilisé le 28 oct.</small></div></div>';
          }
          function seg(id, l) { return '<button type="button" class="' + (S.seg === id ? 'on' : '') + '" data-act="seg" data-seg="' + id + '">' + l + '</button>'; }
          return {
            html: '<div class="eb-scr">' + top('Mes bons', 'home') + '<div class="eb-body">' +
              '<p class="eb-lead">Vos eBonus convertis en réductions.</p>' +
              '<div class="eb-seg">' + seg('actifs', 'Actifs') + seg('encours', 'En cours') + seg('hist', 'Historique') + '</div>' +
              body + '</div>' + nav('bons') + '</div>',
            hint: S.bonUsed ? null : (S.seg === 'actifs' ? '[data-act="use"]' : '[data-seg="actifs"]'), step: S.bonUsed ? null : 5
          };
        },
        use: function () {
          return {
            html: '<div class="eb-scr">' + top('Utiliser mon bon', 'bons') + '<div class="eb-body">' +
              '<div class="eb-coupon"><div class="eb-ctop"><b>-10 %</b><span>chez Marché Akwaba</span><em>Actif</em></div></div>' +
              '<div class="eb-sum"><div class="eb-row"><span>Montant de l’achat</span><b>15 000 F</b></div>' +
              '<div class="eb-row"><span>Réduction (-10 %)</span><b class="eb-minus">-1 500 F</b></div></div>' +
              '<div class="eb-pay"><span>Vous payez</span><b>13 500 F</b></div></div>' +
              '<div class="eb-foot"><button type="button" class="eb-cta eb-vi" data-act="confirm">Valider avec l’agent</button></div></div>',
            hint: '[data-act="confirm"]', step: 5
          };
        },
        success: function () {
          return {
            html: '<div class="eb-scr"><div class="eb-body eb-center" style="padding-top:60px">' +
              '<div class="eb-confetti">🎉</div><div class="eb-h2">Bon utilisé avec succès ! 🎉</div>' +
              '<p class="eb-lead">Marché Akwaba · Marcory</p>' +
              '<div class="eb-pay" style="margin:16px 0"><span>Vous avez économisé</span><b>1 500 F</b></div>' +
              '<div class="eb-info" style="text-align:left"><div class="eb-row"><span>Achat</span><b>15 000 F</b></div>' +
              '<div class="eb-row"><span>Payé</span><b>13 500 F</b></div>' +
              '<div class="eb-row"><span>Solde eBonus</span><b class="eb-plus">' + fmt(S.balance) + ' eBonus</b></div></div></div>' +
              '<div class="eb-foot"><button type="button" class="eb-cta" data-act="restart">Recommencer</button></div></div>',
            hint: '[data-act="restart"]', step: 5
          };
        }
      };

      function coupon(used) {
        return '<div class="eb-coupon"><div class="eb-ctop"><b>-10 %</b><span>chez Marché Akwaba</span><em class="' + (used ? 'used' : '') + '">' +
          (used ? 'Utilisé' : 'Actif') + '</em></div><div class="eb-cbot"><p>Jusqu’à 3 000 F de réduction · valable 30 jours</p>' +
          (used ? '' : '<button type="button" class="eb-cta eb-vi" data-act="use">Utiliser mon bon</button>') + '</div></div>';
      }

      function countUp() {
        var el = root.querySelector('.eb-count');
        if (!el) return;
        var from = 12500, to = S.balance, n = reduced ? 1 : 12;
        for (var i = 1; i <= n; i++) {
          (function (k) {
            later(function () {
              var v = Math.round(from + (to - from) * (k / n));
              if (el.isConnected) el.textContent = fmt(v) + ' eBonus';
            }, reduced ? 0 : 250 + k * 45);
          })(i);
        }
      }

      function go(name) {
        S.screen = name;
        var r = SCREENS[name]();
        root.innerHTML = r.html;
        if (r.step !== null && r.step !== undefined) setStep(r.step);
        hint(r.hint);
        if (r.after) r.after();
      }

      function press(k) {
        if (S.pin.length >= 4) return;
        S.pin += k;
        var dots = root.querySelectorAll('.eb-dots i');
        for (var i = 0; i < dots.length; i++) dots[i].classList.toggle('on', i < S.pin.length);
        if (S.pin.length === 4) later(function () { go('home'); }, reduced ? 0 : 280);
      }

      function scan() {
        if (S.scanning) return;
        S.scanning = true;
        var qr = root.querySelector('.eb-qr');
        if (qr) qr.classList.add('eb-ok');
        later(function () {
          S.scanning = false;
          if (!S.earned) {
            S.earned = true;
            S.seenHome = false;
            S.balance += 450;
            S.history.unshift({ ico: '⛽', label: 'Achat à Station Lagune Énergie - Cocody', date: 'À l’instant', amt: 450 });
            toast('+450 eBonus crédités sur votre solde');
          }
          go('recap');
        }, reduced ? 150 : 700);
      }

      root.addEventListener('click', function (e) {
        var b = e.target.closest('[data-act]');
        if (!b || !root.contains(b)) return;
        var act = b.getAttribute('data-act');
        switch (act) {
          case 'key': press(b.getAttribute('data-k')); break;
          case 'del':
            S.pin = S.pin.slice(0, -1);
            var dots = root.querySelectorAll('.eb-dots i');
            for (var i = 0; i < dots.length; i++) dots[i].classList.toggle('on', i < S.pin.length);
            break;
          case 'scan': scan(); break;
          case 'seg': S.seg = b.getAttribute('data-seg'); go('bons'); break;
          case 'confirm':
            S.bonUsed = true; S.seg = 'actifs';
            toast('Vous avez économisé 1 500 F');
            go('success');
            break;
          case 'restart': start(); break;
          case 'bons': S.seg = 'actifs'; go('bons'); break;
          default: if (SCREENS[act]) go(act);
        }
      }, { signal: ac.signal });

      function start() {
        clearTimers();
        S = freshState();
        go('lock');
      }

      start();

      return {
        destroy: function () {
          ac.abort();
          clearTimers();
          root.innerHTML = '';
          root.classList.remove('sim-' + ID, 'eb-reduced');
        },
        reset: start
      };
    }
  };
})();
