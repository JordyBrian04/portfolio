/* Simulation du musée : Tonty (tontine digitale, cotisations et réceptions par Mobile Money). */
(function () {
  'use strict';

  var ID = 'tonty';
  var LOGO = 'assets/musee/tonty.png';

  var CSS = [
    '.sim-tonty{--o:#ff6200;--ol:#FFF3E0;--os:#FFF8F4;--v:#28a745;--vd:#1E7E34;--n:#333333;--g:#999999;--bg:#f2f2f2;--b:#E0E0E0;--brun:#541b00;',
    'font-family:Inter,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:var(--n);background:var(--bg);-webkit-tap-highlight-color:transparent}',
    '.sim-tonty *{box-sizing:border-box;margin:0;padding:0}',
    '.sim-tonty button{font:inherit;color:inherit;background:none;border:0;cursor:pointer;touch-action:manipulation}',
    '.sim-tonty .tn-app{position:absolute;inset:0;display:flex;flex-direction:column;background:var(--bg)}',
    '.sim-tonty .tn-sb{height:24px;flex:none;display:flex;justify-content:space-between;align-items:center;padding:0 16px;font-size:11px;font-weight:600}',
    '.sim-tonty .tn-stage{position:relative;flex:1;overflow:hidden}',
    '.sim-tonty .tn-view{position:absolute;inset:0;display:flex;flex-direction:column}',
    '.sim-tonty .tn-enter{animation:tn-in .24s ease-out both}',
    '@keyframes tn-in{from{opacity:0;transform:translateX(18px)}to{opacity:1;transform:none}}',
    '@keyframes tn-up{from{transform:translateY(100%)}to{transform:none}}',
    '@keyframes tn-fade{from{opacity:0}to{opacity:1}}',
    '@keyframes tn-pop{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:none}}',
    '@keyframes tn-shake{0%,100%{transform:none}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}',
    '@keyframes tn-spin{to{transform:rotate(360deg)}}',
    '.sim-tonty .tn-body{flex:1;overflow-y:auto;overflow-x:hidden;padding:10px 14px 14px;scrollbar-width:none}',
    '.sim-tonty .tn-body::-webkit-scrollbar{display:none}',
    /* Verrouillage */
    '.sim-tonty .tn-lock{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#F8F9FF;padding:0 20px 10px}',
    '.sim-tonty .tn-lc{width:60px;height:60px;border-radius:50%;background:var(--o);display:flex;align-items:center;justify-content:center;font-size:26px;box-shadow:0 8px 16px rgba(255,98,0,.3)}',
    '.sim-tonty .tn-lt{font-weight:800;font-style:italic;font-size:18px;color:var(--o);margin-top:6px}',
    '.sim-tonty .tn-lock h1{font-size:20px;font-weight:800;margin-top:14px}',
    '.sim-tonty .tn-lock p{font-size:13px;color:var(--g);margin-top:4px}',
    '.sim-tonty .tn-dots{display:flex;gap:18px;margin:22px 0 8px}',
    '.sim-tonty .tn-dots.shake{animation:tn-shake .3s}',
    '.sim-tonty .tn-dot{width:16px;height:16px;border-radius:50%;border:2px solid #ccc;transition:background .15s,border-color .15s}',
    '.sim-tonty .tn-dot.on{background:var(--o);border-color:var(--o)}',
    '.sim-tonty .tn-err{font-size:12px;color:var(--g);height:18px;margin-bottom:10px;text-align:center}',
    '.sim-tonty .tn-pad{display:grid;grid-template-columns:repeat(3,62px);gap:10px 26px}',
    '.sim-tonty .tn-key{width:62px;height:62px;border-radius:50%;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,.08);display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:21px;font-weight:700;line-height:1;transition:transform .1s,background .1s}',
    '.sim-tonty .tn-key:active{transform:scale(.92);background:var(--ol)}',
    '.sim-tonty .tn-key small{font-size:8.5px;font-weight:500;color:var(--g);letter-spacing:1.3px;margin-top:3px}',
    '.sim-tonty .tn-key.ghost{background:transparent;box-shadow:none;font-size:20px}',
    '.sim-tonty .tn-key.empty{visibility:hidden}',
    /* Accueil */
    '.sim-tonty .tn-top{display:flex;align-items:center;gap:9px;padding:6px 14px 4px;flex:none}',
    '.sim-tonty .tn-top img{width:38px;height:38px;border-radius:10px}',
    '.sim-tonty .tn-top b{display:block;font-size:19px;font-weight:800}',
    '.sim-tonty .tn-top span{display:block;font-size:12px;color:var(--o);font-weight:600;min-height:15px}',
    '.sim-tonty .tn-bell{margin-left:auto;width:36px;height:36px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;font-size:16px}',
    '.sim-tonty .tn-solde{background:#fff;border-radius:16px;padding:12px 14px;margin-top:4px}',
    '.sim-tonty .tn-solde small{font-size:12px}',
    '.sim-tonty .tn-solde strong{display:block;font-size:23px;font-weight:800;margin:2px 0 10px}',
    '.sim-tonty .tn-two{display:grid;grid-template-columns:1fr 1fr;gap:8px}',
    '.sim-tonty .tn-mini{height:36px;border-radius:10px;background:var(--o);color:#fff;font-size:13px;font-weight:600;display:flex;align-items:center;justify-content:center}',
    '.sim-tonty .tn-sec{display:flex;justify-content:space-between;align-items:center;margin:14px 0 8px}',
    '.sim-tonty .tn-sec h3{font-size:17px;font-weight:800}',
    '.sim-tonty .tn-sec span{font-size:12.5px;color:var(--o);font-weight:600}',
    '.sim-tonty .tn-tcard{background:#fff;border-radius:16px;padding:12px 14px;border:1px solid #FFE0CC}',
    '.sim-tonty .tn-trow{display:flex;justify-content:space-between;align-items:flex-start;gap:8px}',
    '.sim-tonty .tn-tname{font-size:14.5px;font-weight:700}',
    '.sim-tonty .tn-mem{font-size:12px;color:#a53d00;font-weight:600;margin-top:1px}',
    '.sim-tonty .tn-stat{font-size:11.5px;padding:3px 8px;border-radius:8px;background:#d4f8dc;color:var(--vd);font-weight:600;flex:none}',
    '.sim-tonty .tn-kv2{display:grid;grid-template-columns:1fr 1fr;gap:6px 8px;margin:10px 0 8px;padding:9px 10px;border-radius:12px;background:var(--os)}',
    '.sim-tonty .tn-kv2 div{font-size:11px;color:var(--brun);font-weight:600}',
    '.sim-tonty .tn-kv2 b{display:block;font-size:13.5px;color:var(--o);font-weight:800;margin-top:1px}',
    '.sim-tonty .tn-kv2 b.k{color:var(--n)}',
    '.sim-tonty .tn-kv2 div:nth-child(even){text-align:right}',
    '.sim-tonty .tn-more{font-size:13px;font-weight:700;color:var(--o);padding:6px 8px;margin-left:-8px;border-radius:8px}',
    '.sim-tonty .tn-tx{background:#fff;border-radius:16px;padding:2px 14px}',
    '.sim-tonty .tn-tx div{display:flex;justify-content:space-between;align-items:center;padding:8px 0;font-size:13.5px;font-weight:600}',
    '.sim-tonty .tn-tx div+div{border-top:1px solid #F5F5F5}',
    '.sim-tonty .tn-tx small{display:block;font-size:11px;color:var(--g);font-weight:400;margin-top:1px}',
    '.sim-tonty .tn-tx b{font-size:13px;color:var(--v)}',
    '.sim-tonty .tn-tabs{height:56px;flex:none;display:flex;background:#fff;border-top:1px solid #eee}',
    '.sim-tonty .tn-tabs div{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;font-size:10px;color:var(--g)}',
    '.sim-tonty .tn-tabs div.on{color:var(--o);font-weight:700}',
    '.sim-tonty .tn-tabs em{font-style:normal;font-size:17px}',
    /* Détail */
    '.sim-tonty .tn-head{height:48px;flex:none;display:flex;align-items:center;gap:8px;padding:0 10px}',
    '.sim-tonty .tn-head h2{font-size:16px;font-weight:800;flex:1;text-align:center;margin-right:36px}',
    '.sim-tonty .tn-back{width:36px;height:36px;border-radius:10px;font-size:22px;color:var(--o);font-weight:700;display:flex;align-items:center;justify-content:center}',
    '.sim-tonty .tn-back:active{background:#fff}',
    '.sim-tonty .tn-card{background:#fff;border-radius:16px;padding:12px 14px}',
    '.sim-tonty .tn-card h4{font-size:16px;font-weight:800}',
    '.sim-tonty .tn-code{font-size:11.5px;color:var(--g);margin-top:1px}',
    '.sim-tonty .tn-pot{text-align:center;margin-top:8px}',
    '.sim-tonty .tn-pot small{font-size:10.5px;color:var(--g);letter-spacing:.4px}',
    '.sim-tonty .tn-pot strong{display:block;font-size:28px;font-weight:800;color:var(--o);line-height:1.15}',
    '.sim-tonty .tn-pot strong i{font-style:normal;font-size:14px;color:var(--g)}',
    '.sim-tonty .tn-split{display:flex;border-top:1px solid #F0F0F0;margin-top:8px;padding-top:8px}',
    '.sim-tonty .tn-split div{flex:1;text-align:center;font-size:10.5px;color:var(--g)}',
    '.sim-tonty .tn-split div+div{border-left:1px solid #F0F0F0}',
    '.sim-tonty .tn-split b{display:block;font-size:14px;font-weight:800;color:var(--v)}',
    '.sim-tonty .tn-split div+div b{color:#AAAAAA}',
    '.sim-tonty .tn-info{display:flex;gap:6px;align-items:center;font-size:12px;color:var(--g);padding:5px 0}',
    '.sim-tonty .tn-info b{color:var(--n);font-weight:700}',
    '.sim-tonty .tn-info.me{background:var(--ol);color:var(--o);font-weight:700;border-radius:8px;padding:5px 8px;margin:2px 0}',
    '.sim-tonty .tn-acts{display:grid;grid-template-columns:1.35fr 1fr;gap:8px;margin-top:10px}',
    '.sim-tonty .tn-btn{display:flex;width:100%;height:48px;border-radius:12px;background:var(--o);color:#fff;font-size:15px;font-weight:700;align-items:center;justify-content:center;gap:7px;transition:transform .1s,opacity .2s}',
    '.sim-tonty .tn-btn:active{transform:scale(.98)}',
    '.sim-tonty .tn-btn[disabled]{opacity:.55;cursor:default}',
    '.sim-tonty .tn-btn.light{background:#fff;color:var(--n)}',
    '.sim-tonty .tn-btn.okd{background:#d4f8dc;color:var(--vd)}',
    '.sim-tonty .tn-btn.white{background:#fff;color:var(--v)}',
    '.sim-tonty .tn-mems{display:flex;gap:8px;background:#fff;border-radius:16px;padding:10px 8px}',
    '.sim-tonty .tn-m{flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;gap:3px;font-size:10.5px;font-weight:600}',
    '.sim-tonty .tn-av{position:relative;width:38px;height:38px;border-radius:50%;background:#FFE0CC;color:#a53d00;font-weight:800;font-size:14px;display:flex;align-items:center;justify-content:center}',
    '.sim-tonty .tn-av.me{background:var(--o);color:#fff}',
    '.sim-tonty .tn-av.next{box-shadow:0 0 0 2px #fff,0 0 0 4px var(--v)}',
    '.sim-tonty .tn-av em{position:absolute;right:-4px;bottom:-3px;min-width:17px;height:17px;border-radius:9px;background:#fff;border:1px solid var(--b);color:var(--n);font-style:normal;font-size:9.5px;font-weight:800;display:flex;align-items:center;justify-content:center;padding:0 3px}',
    '.sim-tonty .tn-av em.ok{background:var(--v);border-color:var(--v);color:#fff}',
    '.sim-tonty .tn-legend{font-size:10.5px;color:var(--g);margin-top:6px;line-height:1.35}',
    '.sim-tonty .tn-skip{display:flex;width:100%;margin-top:10px;padding:10px 12px;border:1.5px dashed var(--o);border-radius:12px;background:var(--os);color:var(--o);font-size:13px;font-weight:700;align-items:center;justify-content:center;gap:6px}',
    /* Tour gagnant */
    '.sim-tonty .tn-win{margin-top:10px;border-radius:18px;background:linear-gradient(160deg,#28A745,#1E7E34);color:#fff;padding:14px;animation:tn-pop .3s ease-out both}',
    '.sim-tonty .tn-win small{font-size:10.5px;letter-spacing:1px;opacity:.85}',
    '.sim-tonty .tn-win strong{display:block;font-size:28px;font-weight:800;line-height:1.15}',
    '.sim-tonty .tn-win strong i{font-style:normal;font-size:14px}',
    '.sim-tonty .tn-fees{background:rgba(0,0,0,.15);border-radius:10px;padding:8px 10px;margin:9px 0;font-size:11.5px}',
    '.sim-tonty .tn-fees div{display:flex;justify-content:space-between;opacity:.9}',
    '.sim-tonty .tn-wmsg{background:rgba(255,255,255,.15);border-radius:10px;padding:8px 10px;font-size:12px;line-height:1.35;margin-bottom:10px}',
    '.sim-tonty .tn-wmsg b{display:block;font-size:14px}',
    /* Feuilles du bas */
    '.sim-tonty .tn-ov{position:absolute;inset:0;background:rgba(0,0,0,.45);display:flex;align-items:flex-end;z-index:5;animation:tn-fade .2s both}',
    '.sim-tonty .tn-sheet{width:100%;background:#fff;border-radius:20px 20px 0 0;padding:8px 16px 16px;animation:tn-up .25s ease-out both}',
    '.sim-tonty .tn-handle{width:40px;height:4px;border-radius:2px;background:#ddd;margin:0 auto 10px}',
    '.sim-tonty .tn-sheet h3{font-size:17px;font-weight:800}',
    '.sim-tonty .tn-sheet .tn-sub{font-size:12.5px;color:var(--g);margin:3px 0 10px}',
    '.sim-tonty .tn-pm{display:flex;width:100%;text-align:left;align-items:center;gap:10px;border:1.5px solid var(--b);border-radius:14px;padding:10px 12px;margin-bottom:8px;background:#fff}',
    '.sim-tonty .tn-pm.on{border-color:var(--o);background:var(--os)}',
    '.sim-tonty .tn-pm i{width:32px;height:32px;border-radius:9px;flex:none;display:flex;align-items:center;justify-content:center;font-style:normal;font-size:11px;font-weight:800;color:#fff}',
    '.sim-tonty .tn-pm b{display:block;font-size:13.5px}',
    '.sim-tonty .tn-pm small{font-size:11.5px;color:var(--g)}',
    '.sim-tonty .tn-ck{margin-left:auto;width:20px;height:20px;border-radius:50%;border:2px solid var(--b);flex:none;display:flex;align-items:center;justify-content:center;font-size:11px;color:#fff;font-weight:800}',
    '.sim-tonty .tn-pm.on .tn-ck{background:var(--o);border-color:var(--o)}',
    '.sim-tonty .tn-line{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #F5F5F5;font-size:13.5px;color:var(--g)}',
    '.sim-tonty .tn-line b{color:var(--n)}',
    '.sim-tonty .tn-line b.fee{color:#E65100}',
    '.sim-tonty .tn-total{display:flex;justify-content:space-between;align-items:center;padding:10px 0 12px;font-weight:800;font-size:15px}',
    '.sim-tonty .tn-total b{color:var(--o);font-size:17px}',
    '.sim-tonty .tn-cancel{display:block;width:100%;text-align:center;font-size:13.5px;color:var(--g);font-weight:600;padding:10px 0 0}',
    '.sim-tonty .tn-spin{width:18px;height:18px;border-radius:50%;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;animation:tn-spin .8s linear infinite}',
    /* Fin */
    '.sim-tonty .tn-done{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:20px;background:#fff}',
    '.sim-tonty .tn-check{width:82px;height:82px;border-radius:50%;background:var(--v);font-size:40px;display:flex;align-items:center;justify-content:center;animation:tn-pop .35s ease-out both;box-shadow:0 0 0 10px #DCFCE7}',
    '.sim-tonty .tn-done h1{font-size:21px;font-weight:800;margin-top:22px}',
    '.sim-tonty .tn-done p{font-size:13px;color:var(--g);margin-top:8px;line-height:1.45}',
    '.sim-tonty .tn-done strong{color:var(--v)}',
    '.sim-tonty .tn-recap{width:100%;margin:16px 0;background:var(--bg);border-radius:14px;padding:10px 12px;text-align:left;font-size:12.5px;line-height:1.6;color:var(--g)}',
    '.sim-tonty .tn-recap b{color:var(--n)}',
    '.sim-tonty.is-reduced *,.sim-tonty.is-reduced *:before,.sim-tonty.is-reduced *:after{animation:none!important;transition:none!important}'
  ].join('\n');

  /* Salutations reprises de l'app (plusieurs langues de Côte d'Ivoire). */
  var SALUTS = ['Bonjour', 'Anisôgôman', 'Ahin', 'Ni sou wè', 'Goua'];

  var PART = 10000;
  /* Ordre d'encaissement (rotation tour par tour). Toi = Aya, 4e tour. */
  var MEMBRES = [
    { n: 'Koffi', tour: 1 },
    { n: 'Mariam', tour: 2 },
    { n: 'Yao', tour: 3 },
    { n: 'Aya', tour: 4, me: true },
    { n: 'Adjoua', tour: 5 },
    { n: 'Konan', tour: 6 }
  ];
  var NB = 8;                      // 8 membres au total (6 affichés + 2)
  var POT = PART * NB;             // pot théorique : 80 000 FCFA

  /* Frais calculés comme dans le code : cotisation = 1 % + 100 + ~150 ; réception = 1,5 % + (1 % + 250). */
  var FRAIS_COT = Math.ceil(PART * 0.01) + 100 + 150;
  var FRAIS_APP = Math.ceil(POT * 0.015);
  var FRAIS_SERV = Math.ceil(POT * 0.01) + 250;
  var NET = POT - FRAIS_APP - FRAIS_SERV;

  var COMPTES = [
    { id: 'om', nom: 'Orange Money', num: '+225 07 •• •• 12', c: '#FF6200', i: 'OM', def: true },
    { id: 'wave', nom: 'Wave', num: '+225 05 •• •• 48', c: '#1565C0', i: 'W' }
  ];

  function fmt(n) {
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
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
      'Déverrouiller avec son code PIN',
      'Voir ses tontines en un coup d’œil',
      'Suivre les membres et les tours',
      'Donner sa part par Mobile Money',
      'Recevoir le pot à son tour'
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
          var k = timers.indexOf(id);
          if (k > -1) timers.splice(k, 1);
          fn();
        }, ctx.reduced ? Math.min(ms, 150) : ms);
        timers.push(id);
      }
      function clearTimers() {
        while (timers.length) clearTimeout(timers.pop());
      }

      function freshState() {
        return { pin: '', paid: false, turn: false, compte: 'om', busy: false, salut: 0 };
      }

      function hint(el) {
        var old = root.querySelectorAll('.sim-hint');
        for (var i = 0; i < old.length; i++) old[i].classList.remove('sim-hint');
        if (el) el.classList.add('sim-hint');
      }

      function show(html, name) {
        clearTimers();
        var v = document.createElement('div');
        v.className = 'tn-view' + (ctx.reduced ? '' : ' tn-enter');
        v.setAttribute('data-screen', name);
        v.innerHTML = html;
        stage.innerHTML = '';
        stage.appendChild(v);
        return v;
      }

      function closeSheet() {
        var o = stage.querySelector('.tn-ov');
        if (o) o.parentNode.removeChild(o);
      }
      function sheet(html) {
        closeSheet();
        var o = document.createElement('div');
        o.className = 'tn-ov';
        o.innerHTML = '<div class="tn-sheet" role="dialog" aria-modal="true"><div class="tn-handle"></div>' + html + '</div>';
        stage.appendChild(o);
        return o;
      }

      /* ---------- écran 1 : code PIN ---------- */

      function lock() {
        ctx.setStep(0);
        st.pin = '';
        var keys = [['1', ''], ['2', 'ABC'], ['3', 'DEF'], ['4', 'GHI'], ['5', 'JKL'], ['6', 'MNO'],
          ['7', 'PQRS'], ['8', 'TUV'], ['9', 'WXYZ']];
        var pad = keys.map(function (k) {
          return '<button type="button" class="tn-key" data-a="digit" data-d="' + k[0] + '" aria-label="' + k[0] + '">' +
            k[0] + (k[1] ? '<small>' + k[1] + '</small>' : '') + '</button>';
        }).join('') +
          '<span class="tn-key empty" aria-hidden="true"></span>' +
          '<button type="button" class="tn-key" data-a="digit" data-d="0" aria-label="0">0</button>' +
          '<button type="button" class="tn-key ghost" data-a="del" aria-label="Effacer">⌫</button>';
        show(
          '<div class="tn-lock">' +
          '<div class="tn-lc" aria-hidden="true">🔒</div><div class="tn-lt">Tonty</div>' +
          '<h1>Entrez votre code PIN</h1><p>Bienvenue sur Tonty</p>' +
          '<div class="tn-dots" aria-hidden="true"><span class="tn-dot"></span><span class="tn-dot"></span><span class="tn-dot"></span><span class="tn-dot"></span></div>' +
          '<div class="tn-err" data-ref="err">Démo : touchez 4 chiffres</div>' +
          '<div class="tn-pad">' + pad + '</div></div>',
          'lock');
        pinHint();
      }

      function pinHint() {
        var seq = '2025';
        var d = seq.charAt(st.pin.length);
        hint(d ? root.querySelector('[data-a="digit"][data-d="' + d + '"]') : null);
      }

      function paintDots() {
        var ds = root.querySelectorAll('.tn-dot');
        for (var i = 0; i < ds.length; i++) ds[i].classList.toggle('on', i < st.pin.length);
      }

      /* ---------- écran 2 : accueil ---------- */

      function home() {
        ctx.setStep(1);
        var v = show(
          '<div class="tn-top"><img src="' + LOGO + '" alt=""><div><span data-ref="salut">' + SALUTS[0] + '</span><b>Aya</b></div>' +
          '<div class="tn-bell" aria-hidden="true">🔔</div></div>' +
          '<div class="tn-body">' +
          '<div class="tn-solde"><small>Votre solde</small><strong>12 500 CFA</strong>' +
          '<div class="tn-two"><span class="tn-mini">Déposer</span><span class="tn-mini">Retirer</span></div></div>' +
          '<div class="tn-sec"><h3>Vos tontines</h3><span>Voir plus</span></div>' +
          '<div class="tn-tcard">' +
          '<div class="tn-trow"><div><div class="tn-tname">Tontine Marché Adjamé</div><div class="tn-mem">' + NB + ' membre(s)</div></div>' +
          '<span class="tn-stat">Active</span></div>' +
          '<div class="tn-kv2">' +
          '<div>Tu reçois bientôt<b>Koffi</b></div><div>Date prévue<b class="k">1 Déc 2026</b></div>' +
          '<div>Ce que tu donnes<b>' + fmt(PART) + ' CFA</b></div><div>Prochaine fois où tu donnes<b class="k">1 Déc 2026</b></div>' +
          '</div>' +
          '<button type="button" class="tn-more" data-a="detail">Voir les détails →</button></div>' +
          '<div class="tn-sec"><h3>Transactions</h3><span style="color:#999999;font-weight:500">Voir tout</span></div>' +
          '<div class="tn-tx">' +
          '<div><span>Tu as donné<small>3 Nov 2026 à 15:30</small></span><b>' + fmt(PART) + ' FCFA</b></div>' +
          '<div><span>Ajout de fonds<small>28 Oct 2026 à 09:10</small></span><b>' + fmt(2500) + ' FCFA</b></div>' +
          '</div>' +
          '</div>' +
          '<div class="tn-tabs" aria-hidden="true"><div class="on"><em>🏠</em>Accueil</div><div><em>👥</em>Tontines</div><div><em>➕</em>Rejoindre</div><div><em>⚙️</em>Paramètres</div></div>',
          'home');
        hint(v.querySelector('[data-a="detail"]'));
        if (!ctx.reduced) rotateSalut();
      }

      function rotateSalut() {
        later(function () {
          var el = root.querySelector('[data-ref="salut"]');
          if (!el) return;
          st.salut = (st.salut + 1) % SALUTS.length;
          el.textContent = SALUTS[st.salut];
          rotateSalut();
        }, 1600);
      }

      /* ---------- écran 3 : détail de la tontine ---------- */

      function detail() {
        ctx.setStep(st.turn ? 4 : (st.paid ? 3 : 2));
        var given = st.turn ? POT : (st.paid ? POT : POT - PART);
        var mems = MEMBRES.map(function (m) {
          var done = st.turn ? m.tour < 4 : m.tour < 1;
          var isNext = st.turn ? m.me : m.tour === 1;
          return '<div class="tn-m"><div class="tn-av' + (m.me ? ' me' : '') + (isNext ? ' next' : '') + '">' + m.n.charAt(0) +
            '<em class="' + (done ? 'ok' : '') + '">' + (done ? '✓' : m.tour) + '</em></div>' + (m.me ? 'Toi' : m.n) + '</div>';
        }).join('');

        var win = st.turn ?
          '<div class="tn-win"><small>VOUS RECEVEZ</small><strong>' + fmt(NET) + ' <i>FCFA</i></strong>' +
          '<div style="font-size:11px;opacity:.7">Pot brut ' + fmt(POT) + ' − frais ' + fmt(FRAIS_APP + FRAIS_SERV) + ' FCFA</div>' +
          '<div class="tn-fees"><div><span>Frais application (1,5%)</span><span>−' + fmt(FRAIS_APP) + ' FCFA</span></div>' +
          '<div><span>Frais de service</span><span>−' + fmt(FRAIS_SERV) + ' FCFA</span></div></div>' +
          '<div class="tn-wmsg"><b>C’est ton tour ! 🎊</b>Appuie ici pour recevoir ton argent directement sur ton portefeuille.</div>' +
          '<button type="button" class="tn-btn white" data-a="recevoir">Recevoir mon pot</button></div>' : '';

        var acts = st.turn ? '' :
          '<div class="tn-acts">' +
          (st.paid ?
            '<button type="button" class="tn-btn okd" data-a="already">✓ Part donnée</button>' :
            '<button type="button" class="tn-btn" data-a="donner">Donner ma part</button>') +
          '<button type="button" class="tn-btn light" data-a="histo">Historique</button></div>';

        var skip = (st.paid && !st.turn) ?
          '<button type="button" class="tn-skip" data-a="skip">⏩ Avancer au jour de ton tour</button>' : '';

        var v = show(
          '<div class="tn-head"><button type="button" class="tn-back" data-a="home" aria-label="Retour">←</button><h2>Détails de la Tontine</h2></div>' +
          '<div class="tn-body" style="padding-top:2px">' +
          '<div class="tn-card"><h4>Tontine Marché Adjamé</h4><div class="tn-code">Code : TNT-4821 · Mensuel · ' + fmt(PART) + ' FCFA</div>' +
          (st.turn ? '' :
            '<div class="tn-pot"><small>PROCHAINE RÉCEPTION</small><strong>' + fmt(given) + ' <i>FCFA</i></strong></div>' +
            '<div class="tn-split"><div>Déjà donné<b>' + fmt(given) + ' FCFA</b></div><div>Pot théorique<b>' + fmt(POT) + ' FCFA</b></div></div>') +
          '<div class="tn-info" style="margin-top:6px">📅 Prochain bénéficiaire : <b>' + (st.turn ? 'Toi (Aya)' : 'Koffi') + '</b></div>' +
          (st.turn ? '' : '<div class="tn-info me">⏱ Ton tour : 1 mars 2027</div>') +
          '</div>' + win + acts + skip +
          '<div class="tn-sec" style="margin-top:12px"><h3 style="font-size:15px">Membres</h3><span>Voir plus</span></div>' +
          '<div class="tn-mems">' + mems + '</div>' +
          '<p class="tn-legend">Le chiffre = l’ordre de passage. À chaque tour, tout le monde donne sa part et un seul membre reçoit tout le pot.</p>' +
          (st.turn ? '' :
            '<div class="tn-sec" style="margin-top:12px"><h3 style="font-size:15px">Activité Récente</h3><span>Voir tout</span></div>' +
            '<div class="tn-tx">' +
            (st.paid ? '<div><span>Aya (toi)<small>1 déc.</small></span><b>+' + fmt(PART) + ' F</b></div>' :
              '<div><span>Mariam<small>1 déc.</small></span><b>+' + fmt(PART) + ' F</b></div>' +
              '<div><span>Yao<small>30 nov.</small></span><b>+' + fmt(PART) + ' F</b></div>') +
            '</div>') +
          '</div>',
          'detail');
        if (st.turn) hint(v.querySelector('[data-a="recevoir"]'));
        else if (st.paid) hint(v.querySelector('[data-a="skip"]'));
        else hint(v.querySelector('[data-a="donner"]'));
      }

      /* ---------- feuilles : compte Mobile Money, résumé, paiement ---------- */

      function compteSheet(action) {
        var cot = action === 'cotiser';
        var list = COMPTES.map(function (c) {
          return '<button type="button" class="tn-pm' + (st.compte === c.id ? ' on' : '') + '" data-a="compte" data-c="' + c.id + '">' +
            '<i style="background:' + c.c + '">' + c.i + '</i><div><b>' + c.nom + '</b><small>' + c.num + '</small></div>' +
            '<span class="tn-ck">✓</span></button>';
        }).join('');
        var o = sheet(
          '<h3>' + (cot ? '💳 Compte de débit' : '💰 Compte de réception') + '</h3>' +
          '<p class="tn-sub">' + (cot ? 'Les fonds seront débités depuis ce compte.' : 'Les fonds seront crédités sur ce compte.') + '</p>' +
          list +
          '<button type="button" class="tn-btn" data-a="' + (cot ? 'resume' : 'encaisser') + '" style="margin-top:4px">Confirmer avec ce compte</button>' +
          '<button type="button" class="tn-cancel" data-a="close">Annuler</button>');
        hint(o.querySelector('.tn-btn'));
      }

      function resumeSheet() {
        var o = sheet(
          '<h3>Ce que tu vas donner</h3><div style="height:6px"></div>' +
          '<div class="tn-line"><span>Ta part</span><b>' + fmt(PART) + ' FCFA</b></div>' +
          '<div class="tn-line"><span>Supplément retard</span><span>0 FCFA</span></div>' +
          '<div class="tn-line"><span>Dette à solder</span><span>0 FCFA</span></div>' +
          '<div class="tn-line"><span>Frais de service</span><b class="fee">+' + fmt(FRAIS_COT) + ' FCFA</b></div>' +
          '<div class="tn-total"><span>Total à payer</span><b>' + fmt(PART + FRAIS_COT) + ' FCFA</b></div>' +
          '<button type="button" class="tn-btn" data-a="payer">Payer</button>' +
          '<button type="button" class="tn-cancel" data-a="close">Annuler</button>');
        hint(o.querySelector('[data-a="payer"]'));
      }

      function compteNom() {
        for (var i = 0; i < COMPTES.length; i++) if (COMPTES[i].id === st.compte) return COMPTES[i].nom;
        return 'Mobile Money';
      }

      /* ---------- fin ---------- */

      function done() {
        ctx.setStep(4);
        ctx.toast('Tu vas recevoir ton argent !');
        var v = show(
          '<div class="tn-done"><div class="tn-check" aria-hidden="true">🎉</div>' +
          '<h1>Tu vas recevoir ton argent !</h1>' +
          '<p><strong>' + fmt(NET) + ' FCFA</strong> seront crédités via ' + compteNom() + ' sous peu.</p>' +
          '<div class="tn-recap"><b>Tontine Marché Adjamé</b><br>Tour 4 sur ' + NB + ' · Bénéficiaire : <b>Aya</b><br>' +
          'Prochain tour : <b>Adjoua</b>, le mois prochain</div>' +
          '<button type="button" class="tn-btn" data-a="restart">Recommencer</button></div>',
          'done');
        hint(v.querySelector('[data-a="restart"]'));
      }

      /* ---------- interactions ---------- */

      function onClick(e) {
        var b = e.target.closest ? e.target.closest('[data-a]') : null;
        if (!b || !root.contains(b) || b.disabled) return;
        var a = b.getAttribute('data-a');
        if (a === 'digit') {
          if (st.pin.length >= 4) return;
          st.pin += b.getAttribute('data-d');
          paintDots();
          if (st.pin.length === 4) {
            hint(null);
            var err = root.querySelector('[data-ref="err"]');
            if (err) { err.textContent = 'Code correct'; err.style.color = '#28a745'; }
            later(home, 450);
          } else pinHint();
        } else if (a === 'del') {
          st.pin = st.pin.slice(0, -1);
          paintDots();
          pinHint();
        } else if (a === 'home') home();
        else if (a === 'detail') detail();
        else if (a === 'donner') compteSheet('cotiser');
        else if (a === 'compte') {
          st.compte = b.getAttribute('data-c');
          var ps = root.querySelectorAll('[data-a="compte"]');
          for (var i = 0; i < ps.length; i++) ps[i].classList.toggle('on', ps[i] === b);
        } else if (a === 'close') {
          closeSheet();
          detail();
        } else if (a === 'resume') {
          ctx.setStep(3);
          resumeSheet();
        } else if (a === 'payer') {
          if (st.busy) return;
          st.busy = true;
          b.disabled = true;
          b.innerHTML = '<span class="tn-spin" aria-hidden="true"></span>Paiement en cours…';
          hint(null);
          later(function () {
            st.busy = false;
            st.paid = true;
            ctx.toast('C’est enregistré ! Ton paiement a bien été reçu.');
            detail();
          }, 1400);
        } else if (a === 'already') {
          ctx.toast('Tu as déjà donné ta part pour cette période.');
        } else if (a === 'histo') {
          ctx.toast('Historique : toutes les parts données, visibles par tous.');
        } else if (a === 'skip') {
          st.turn = true;
          ctx.toast('Quelques mois plus tard… c’est ton tour !');
          detail();
        } else if (a === 'recevoir') compteSheet('encaisser');
        else if (a === 'encaisser') {
          if (st.busy) return;
          st.busy = true;
          b.disabled = true;
          b.innerHTML = '<span class="tn-spin" aria-hidden="true"></span>Envoi en cours…';
          hint(null);
          later(function () { st.busy = false; done(); }, 1200);
        } else if (a === 'restart') reset();
      }

      function build() {
        root.innerHTML =
          '<div class="tn-app"><div class="tn-sb" aria-hidden="true"><span>9:41</span><span>▂▄▆ 100 %</span></div>' +
          '<div class="tn-stage"></div></div>';
        stage = root.querySelector('.tn-stage');
      }

      function reset() {
        clearTimers();
        st = freshState();
        lock();
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
