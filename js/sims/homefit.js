/* Simulation « HomeFit » pour le musée des projets — voir js/sims/CONTRAT.md */
(function () {
  'use strict';

  var ID = 'homefit';
  var C = '#2f95dc';
  var REST = 10;          /* démo : 10 s au lieu de 30 s */
  var SETS = 4;
  var RING = 2 * Math.PI * 70;

  var CSS = [
    '.sim-homefit{font-family:system-ui,-apple-system,"Segoe UI",Roboto,Inter,sans-serif;color:#15202b;background:#fff;-webkit-tap-highlight-color:transparent;}',
    '.sim-homefit *,.sim-homefit *::before,.sim-homefit *::after{box-sizing:border-box;}',
    '.sim-homefit button{font:inherit;color:inherit;border:0;background:none;padding:0;margin:0;cursor:pointer;touch-action:manipulation;}',
    '.sim-homefit [hidden]{display:none !important;}',
    '.sim-homefit button:focus-visible{outline:2px solid ' + C + ';outline-offset:2px;}',
    '.sim-homefit .hf-app{position:absolute;inset:0;background:#fff;display:flex;flex-direction:column;overflow:hidden;}',
    '.sim-homefit .hf-status{flex:0 0 26px;display:flex;align-items:center;justify-content:space-between;padding:0 18px;font-size:12px;font-weight:600;}',
    '.sim-homefit .hf-screens{position:relative;flex:1 1 auto;min-height:0;}',
    '.sim-homefit .hf-screen{position:absolute;inset:0;padding:6px 16px 14px;display:none;flex-direction:column;gap:12px;overflow-x:hidden;overflow-y:auto;scrollbar-width:none;}',
    '.sim-homefit .hf-screen::-webkit-scrollbar{display:none;}',
    '.sim-homefit .hf-screen.is-on{display:flex;}',
    '.sim-homefit.hf-anim .hf-screen.is-on{animation:hf-in .28s ease-out;}',
    '@keyframes hf-in{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:none;}}',
    '.sim-homefit .hf-head{display:flex;align-items:center;gap:10px;}',
    '.sim-homefit .hf-head img{width:34px;height:34px;border-radius:9px;object-fit:cover;background:linear-gradient(135deg,#4a8cff,#2140a8);}',
    '.sim-homefit .hf-head b{font-size:18px;font-weight:800;letter-spacing:-.2px;}',
    '.sim-homefit .hf-head span{display:block;font-size:11.5px;color:#6b7785;}',
    '.sim-homefit .hf-card{background:#eef3f8;border-radius:16px;padding:14px;}',
    '.sim-homefit .hf-card.is-soft{background:#f5f7f9;}',
    '.sim-homefit .hf-over{font-size:11px;font-weight:700;letter-spacing:.8px;color:' + C + ';}',
    '.sim-homefit .hf-h1{font-size:22px;font-weight:800;margin:6px 0 2px;line-height:1.2;}',
    '.sim-homefit .hf-muscles{font-size:13px;color:#4d5a68;}',
    '.sim-homefit .hf-meta{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px;}',
    '.sim-homefit .hf-pill{font-size:11.5px;font-weight:600;background:#fff;border-radius:20px;padding:4px 10px;color:#3b4652;}',
    '.sim-homefit .hf-cta{width:100%;min-height:48px;border-radius:14px;background:' + C + ';color:#fff;font-weight:700;font-size:15px;display:flex;align-items:center;justify-content:center;gap:8px;padding:0 14px;text-align:center;}',
    '.sim-homefit .hf-cta.is-ghost{background:#eef3f8;color:' + C + ';}',
    '.sim-homefit .hf-cta.is-link{background:none;color:' + C + ';min-height:40px;font-size:14px;}',
    '.sim-homefit .hf-sec{font-size:14px;font-weight:700;margin:2px 0 -4px;}',
    '.sim-homefit .hf-week{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;}',
    '.sim-homefit .hf-day{display:flex;flex-direction:column;align-items:center;gap:4px;padding:6px 0;border-radius:10px;background:#f5f7f9;font-size:10.5px;color:#6b7785;}',
    '.sim-homefit .hf-day i{font-style:normal;font-size:15px;line-height:1;}',
    '.sim-homefit .hf-day.is-today{background:' + C + ';color:#fff;}',
    '.sim-homefit .hf-ex{display:flex;flex-direction:column;gap:6px;margin:0;padding:0;list-style:none;}',
    '.sim-homefit .hf-ex li{display:flex;align-items:center;gap:10px;font-size:13px;background:#f5f7f9;border-radius:12px;padding:8px 10px;}',
    '.sim-homefit .hf-ex li span{margin-left:auto;font-size:11.5px;color:#6b7785;white-space:nowrap;}',
    '.sim-homefit .hf-dot{flex:0 0 10px;height:10px;border-radius:50%;}',
    '.sim-homefit .hf-reminder{font-size:12px;color:#6b7785;text-align:center;}',
    /* onglets */
    '.sim-homefit .hf-tabs{flex:0 0 58px;display:flex;border-top:1px solid #e6ebf0;background:#fff;padding-bottom:4px;}',
    '.sim-homefit .hf-tabs.is-hidden{display:none;}',
    '.sim-homefit .hf-tab{flex:1 1 0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;font-size:10.5px;font-weight:600;color:#9aa5b1;border-radius:10px;}',
    '.sim-homefit .hf-tab i{font-style:normal;font-size:18px;line-height:1;filter:grayscale(1);opacity:.6;}',
    '.sim-homefit .hf-tab.is-on{color:' + C + ';}',
    '.sim-homefit .hf-tab.is-on i{filter:none;opacity:1;}',
    /* séance */
    '.sim-homefit .hf-top{display:flex;align-items:center;gap:10px;}',
    '.sim-homefit .hf-x{width:34px;height:34px;border-radius:50%;background:#f5f7f9;display:grid;place-items:center;font-size:14px;flex:0 0 34px;}',
    '.sim-homefit .hf-count{font-size:13px;font-weight:700;color:#4d5a68;white-space:nowrap;}',
    '.sim-homefit .hf-prog{flex:1 1 auto;height:6px;border-radius:4px;background:#e6ebf0;overflow:hidden;}',
    '.sim-homefit .hf-prog i{display:block;height:100%;width:100%;background:' + C + ';transform-origin:left;transform:scaleX(.1667);}',
    '.sim-homefit .hf-zone{align-self:flex-start;font-size:11.5px;font-weight:700;color:#fff;background:#2f7de1;border-radius:20px;padding:4px 10px;}',
    '.sim-homefit .hf-exname{font-size:20px;font-weight:800;margin:0;line-height:1.2;}',
    '.sim-homefit .hf-set{font-size:14px;font-weight:600;color:#4d5a68;}',
    '.sim-homefit .hf-set b{color:' + C + ';}',
    '.sim-homefit .hf-sets{display:flex;gap:6px;}',
    '.sim-homefit .hf-sets span{flex:1 1 0;height:6px;border-radius:4px;background:#e6ebf0;}',
    '.sim-homefit .hf-sets span.is-done{background:#3aa65b;}',
    '.sim-homefit .hf-sets span.is-now{background:' + C + ';}',
    '.sim-homefit .hf-tip{font-size:12.5px;color:#4d5a68;line-height:1.4;}',
    /* bonhomme qui fait des pompes */
    '.sim-homefit .hf-stage{position:relative;height:150px;border-radius:16px;background:linear-gradient(#eef3f8,#f5f7f9);overflow:hidden;flex:0 0 150px;}',
    '.sim-homefit .hf-mat{position:absolute;left:24px;right:24px;bottom:28px;height:8px;border-radius:4px;background:#2f7de1;opacity:.85;}',
    '.sim-homefit .hf-body{position:absolute;right:58px;bottom:36px;width:176px;height:10px;transform-origin:100% 50%;transform:rotate(14deg);}',
    '.sim-homefit .hf-torso{position:absolute;left:18px;right:0;top:0;height:10px;border-radius:5px;background:#15202b;}',
    '.sim-homefit .hf-headc{position:absolute;left:-2px;top:-8px;width:24px;height:24px;border-radius:50%;background:#15202b;}',
    '.sim-homefit .hf-arm{position:absolute;bottom:36px;right:194px;width:9px;height:41px;border-radius:5px;background:#15202b;transform-origin:50% 100%;}',
    '.sim-homefit.hf-anim .hf-stage.is-moving .hf-body{animation:hf-body 1.6s ease-in-out infinite;}',
    '.sim-homefit.hf-anim .hf-stage.is-moving .hf-arm{animation:hf-arm 1.6s ease-in-out infinite;}',
    '@keyframes hf-body{0%,100%{transform:rotate(14deg);}50%{transform:rotate(4deg);}}',
    '@keyframes hf-arm{0%,100%{transform:scaleY(1);}50%{transform:scaleY(.32);}}',
    '.sim-homefit .hf-reps{position:absolute;top:10px;left:12px;font-size:11px;font-weight:700;color:#2f7de1;background:#fff;border-radius:12px;padding:3px 8px;}',
    /* repos */
    '.sim-homefit .hf-rest{align-items:center;text-align:center;justify-content:center;background:#eef3f8;}',
    '.sim-homefit .hf-rest h2{margin:0;font-size:22px;font-weight:800;}',
    '.sim-homefit .hf-ringbox{position:relative;width:176px;height:176px;}',
    '.sim-homefit .hf-ringbox svg{width:176px;height:176px;transform:rotate(-90deg);}',
    '.sim-homefit .hf-ringbox circle{fill:none;stroke-width:12;}',
    '.sim-homefit .hf-ringbox .hf-track{stroke:#d7e3ef;}',
    '.sim-homefit .hf-ringbox .hf-arc{stroke:' + C + ';stroke-linecap:round;}',
    '.sim-homefit.hf-anim .hf-ringbox .hf-arc{transition:stroke-dashoffset 1s linear;}',
    '.sim-homefit .hf-num{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;}',
    '.sim-homefit .hf-num b{font-size:62px;font-weight:800;line-height:1;font-variant-numeric:tabular-nums;color:#15202b;}',
    '.sim-homefit .hf-num span{font-size:12px;color:#6b7785;font-weight:600;}',
    '.sim-homefit .hf-next{font-size:13px;color:#4d5a68;}',
    '.sim-homefit .hf-demo{font-size:11px;color:#8a6a1f;background:#fff4e0;border-radius:10px;padding:4px 10px;}',
    '.sim-homefit .hf-rest .hf-cta{max-width:260px;}',
    /* fin */
    '.sim-homefit .hf-done{align-items:center;text-align:center;justify-content:center;}',
    '.sim-homefit .hf-trophy{font-size:64px;line-height:1;}',
    '.sim-homefit.hf-anim .hf-trophy{animation:hf-pop .6s cubic-bezier(.2,.9,.3,1.4);}',
    '@keyframes hf-pop{from{opacity:0;transform:scale(.5);}to{opacity:1;transform:none;}}',
    '.sim-homefit .hf-done h2{margin:0;font-size:22px;font-weight:800;line-height:1.25;}',
    '.sim-homefit .hf-done p{margin:0;font-size:13px;color:#4d5a68;line-height:1.4;}',
    '.sim-homefit .hf-sum{display:flex;gap:8px;width:100%;}',
    '.sim-homefit .hf-sum div{flex:1 1 0;background:#eef3f8;border-radius:14px;padding:10px 4px;}',
    '.sim-homefit .hf-sum b{display:block;font-size:18px;font-weight:800;color:' + C + ';}',
    '.sim-homefit .hf-sum span{font-size:11px;color:#4d5a68;}',
    /* progrès */
    '.sim-homefit .hf-h2{font-size:22px;font-weight:800;margin:2px 0 0;}',
    '.sim-homefit .hf-stats{display:grid;grid-template-columns:1fr 1fr;gap:8px;}',
    '.sim-homefit .hf-stat{background:#eef3f8;border-radius:16px;padding:12px;}',
    '.sim-homefit .hf-stat.is-wide{grid-column:1 / -1;display:flex;align-items:center;gap:12px;background:#fff4e0;}',
    '.sim-homefit .hf-stat b{display:block;font-size:28px;font-weight:800;line-height:1.05;color:#15202b;font-variant-numeric:tabular-nums;}',
    '.sim-homefit .hf-stat span{font-size:12px;color:#4d5a68;}',
    '.sim-homefit .hf-flame{font-size:30px;line-height:1;}',
    '.sim-homefit.hf-anim .hf-stat.is-up b{animation:hf-pop .5s ease-out;}',
    '.sim-homefit .hf-bars{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;align-items:end;height:86px;}',
    '.sim-homefit .hf-bars div{display:flex;flex-direction:column;align-items:center;gap:4px;font-size:10px;color:#6b7785;height:100%;justify-content:flex-end;}',
    '.sim-homefit .hf-bars i{display:block;width:100%;border-radius:6px;background:#d7e3ef;}',
    '.sim-homefit .hf-bars i.is-on{background:' + C + ';}'
  ].join('\n');

  var WEEK = [
    { d: 'Lun', i: '💪' }, { d: 'Mar', i: '🦾' }, { d: 'Mer', i: '🦵' }, { d: 'Jeu', i: '🔥' },
    { d: 'Ven', i: '🏋️' }, { d: 'Sam', i: '⚡' }, { d: 'Dim', i: '😴' }
  ];

  function injectCss() {
    if (document.getElementById('sim-' + ID + '-css')) return;
    var st = document.createElement('style');
    st.id = 'sim-' + ID + '-css';
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  var TEMPLATE = [
    '<div class="hf-app">',
    '  <div class="hf-status" aria-hidden="true"><span>9:41</span><span>●●● 4G ▮</span></div>',
    '  <div class="hf-screens">',
    /* Accueil */
    '    <section class="hf-screen" data-screen="home" aria-label="Accueil">',
    '      <div class="hf-head"><img src="assets/musee/homefit.png" alt="" data-ref="logo"><div><b>HomeFit</b><span>Ton coach à la maison</span></div></div>',
    '      <div class="hf-card">',
    '        <div class="hf-over">AUJOURD’HUI — LUNDI</div>',
    '        <div class="hf-h1">💪 Haut du corps</div>',
    '        <div class="hf-muscles">Pectoraux · Épaules · Triceps</div>',
    '        <div class="hf-meta"><span class="hf-pill">6 exercices</span><span class="hf-pill">≈ 35 min</span><span class="hf-pill">Planche + haltères</span></div>',
    '      </div>',
    '      <button type="button" class="hf-cta" data-act="start" data-ref="start">Démarrer la séance ▶</button>',
    '      <div class="hf-sec">Au programme</div>',
    '      <ul class="hf-ex">',
    '        <li><i class="hf-dot" style="background:#2f7de1"></i>Pompes larges (zone bleue)<span>4 × 8-12</span></li>',
    '        <li><i class="hf-dot" style="background:#e0433d"></i>Développé au sol (haltères)<span>4 × 10</span></li>',
    '        <li><i class="hf-dot" style="background:#e0b400"></i>Pompes serrées (zone jaune)<span>3 × 8</span></li>',
    '      </ul>',
    '      <div class="hf-sec">Ma semaine</div>',
    '      <div class="hf-week" data-ref="week"></div>',
    '      <div class="hf-reminder">⏰ Rappel tous les jours à 18:00</div>',
    '    </section>',
    /* Séance */
    '    <section class="hf-screen" data-screen="workout" aria-label="Séance">',
    '      <div class="hf-top"><button type="button" class="hf-x" data-act="quit" aria-label="Quitter la séance">✕</button>',
    '        <div class="hf-prog"><i></i></div><span class="hf-count">1 / 6</span></div>',
    '      <span class="hf-zone">Zone bleue de la planche</span>',
    '      <h2 class="hf-exname">Pompes larges (zone bleue)</h2>',
    '      <div class="hf-stage" data-ref="stage" aria-hidden="true">',
    '        <span class="hf-reps">8-12 rép.</span>',
    '        <div class="hf-mat"></div>',
    '        <div class="hf-arm"></div>',
    '        <div class="hf-body"><div class="hf-torso"></div><div class="hf-headc"></div></div>',
    '      </div>',
    '      <div class="hf-set" data-ref="setTxt"></div>',
    '      <div class="hf-sets" data-ref="setBars"></div>',
    '      <div class="hf-tip">Mains sur la zone bleue, plus larges que les épaules. Gaine le ventre, descends lentement.</div>',
    '      <button type="button" class="hf-cta" data-act="setDone" data-ref="setDone">Série terminée ✓</button>',
    '      <button type="button" class="hf-cta is-link" data-act="finish" data-ref="finishW" hidden>Finir la démo</button>',
    '    </section>',
    /* Repos */
    '    <section class="hf-screen hf-rest" data-screen="rest" aria-label="Repos">',
    '      <h2>Repos</h2>',
    '      <div class="hf-ringbox"><svg viewBox="0 0 176 176" aria-hidden="true"><circle class="hf-track" cx="88" cy="88" r="70"/><circle class="hf-arc" cx="88" cy="88" r="70" data-ref="arc"/></svg>',
    '        <div class="hf-num" role="timer" aria-live="off"><b data-ref="count">10</b><span>secondes</span></div></div>',
    '      <div class="hf-next" data-ref="nextTxt"></div>',
    '      <div class="hf-demo">Démo : 10 s au lieu de 30 s</div>',
    '      <button type="button" class="hf-cta" data-act="skip" data-ref="skip">Passer le repos ⏭</button>',
    '      <button type="button" class="hf-cta is-ghost" data-act="finish" data-ref="finishR" hidden>Finir la démo</button>',
    '    </section>',
    /* Bravo */
    '    <section class="hf-screen hf-done" data-screen="done" aria-label="Séance terminée">',
    '      <div class="hf-trophy" aria-hidden="true">🏆</div>',
    '      <h2>Bravo, séance terminée !</h2>',
    '      <p>Haut du corps validé pour ce lundi. Ta série continue.</p>',
    '      <div class="hf-sum"><div><b data-ref="sumSets">2</b><span>séries</span></div><div><b>1 / 6</b><span>exercices</span></div><div><b>🔥 5</b><span>jours de suite</span></div></div>',
    '      <button type="button" class="hf-cta" data-act="progress" data-ref="seeProgress">Voir mes progrès</button>',
    '    </section>',
    /* Progrès */
    '    <section class="hf-screen" data-screen="progress" aria-label="Progrès">',
    '      <h2 class="hf-h2">Progrès</h2>',
    '      <div class="hf-stats">',
    '        <div class="hf-stat" data-ref="stTotal"><b data-ref="total"></b><span>séances au total</span></div>',
    '        <div class="hf-stat" data-ref="stWeek"><b data-ref="week2"></b><span>cette semaine</span></div>',
    '        <div class="hf-stat is-wide" data-ref="stStreak"><div class="hf-flame" aria-hidden="true">🔥</div><div><b data-ref="streak"></b><span>jours de suite</span></div></div>',
    '      </div>',
    '      <div class="hf-card is-soft"><div class="hf-sec" style="margin:0 0 8px">Minutes d’entraînement</div><div class="hf-bars" data-ref="bars"></div></div>',
    '      <button type="button" class="hf-cta" data-act="restart" data-ref="restart" hidden>↺ Recommencer</button>',
    '    </section>',
    '  </div>',
    '  <nav class="hf-tabs" aria-label="Onglets" data-ref="tabs">',
    '    <button type="button" class="hf-tab" data-act="tab" data-tab="home"><i aria-hidden="true">🏠</i>Accueil</button>',
    '    <button type="button" class="hf-tab" data-act="tab" data-tab="program"><i aria-hidden="true">📋</i>Programme</button>',
    '    <button type="button" class="hf-tab" data-act="tab" data-tab="progress"><i aria-hidden="true">📈</i>Progrès</button>',
    '  </nav>',
    '</div>'
  ].join('\n');

  window.MuseumSims = window.MuseumSims || {};
  window.MuseumSims[ID] = {
    frame: 'phone',
    steps: [
      'Démarrer la séance du jour',
      'Suivre l’exercice guidé',
      'Souffler pendant le repos chronométré',
      'Terminer la séance',
      'Voir ses progrès'
    ],
    mount: function (root, ctx) {
      ctx = ctx || {};
      var reduced = !!ctx.reduced;
      var setStep = typeof ctx.setStep === 'function' ? ctx.setStep : function () {};
      var toast = typeof ctx.toast === 'function' ? ctx.toast : function () {};
      injectCss();

      root.classList.add('sim-' + ID);
      if (!reduced) root.classList.add('hf-anim');

      var refs = {};
      var timer = 0;
      var S;

      function stopTimer() {
        if (timer) clearInterval(timer);
        timer = 0;
      }

      function initialState() {
        return { screen: 'home', set: 1, done: 0, left: REST, finished: false, restToasted: false };
      }

      function setHint(el) {
        var old = root.querySelectorAll('.sim-hint');
        for (var i = 0; i < old.length; i++) old[i].classList.remove('sim-hint');
        if (el) el.classList.add('sim-hint');
      }

      function show(name) {
        S.screen = name;
        var secs = root.querySelectorAll('.hf-screen');
        for (var i = 0; i < secs.length; i++) {
          var on = secs[i].getAttribute('data-screen') === name;
          secs[i].classList.toggle('is-on', on);
          if (on) secs[i].scrollTop = 0;
        }
        refs.tabs.classList.toggle('is-hidden', name === 'workout' || name === 'rest' || name === 'done');
        var tabs = root.querySelectorAll('.hf-tab');
        for (var j = 0; j < tabs.length; j++) {
          var t = tabs[j].getAttribute('data-tab');
          var cur = (t === 'home' && name === 'home') || (t === 'progress' && name === 'progress');
          tabs[j].classList.toggle('is-on', cur);
          if (cur) tabs[j].setAttribute('aria-current', 'page'); else tabs[j].removeAttribute('aria-current');
        }
        refs.stage.classList.toggle('is-moving', name === 'workout');
      }

      function renderWeek() {
        refs.week.innerHTML = WEEK.map(function (w, i) {
          return '<div class="hf-day' + (i === 0 ? ' is-today' : '') + '"><i aria-hidden="true">' + w.i + '</i>' + w.d + '</div>';
        }).join('');
      }

      function renderWorkout() {
        refs.setTxt.innerHTML = 'Série <b>' + S.set + ' / ' + SETS + '</b> · 8-12';
        var h = '';
        for (var i = 1; i <= SETS; i++) {
          h += '<span class="' + (i <= S.done ? 'is-done' : (i === S.set ? 'is-now' : '')) + '"></span>';
        }
        refs.setBars.innerHTML = h;
        refs.finishW.hidden = S.done < 2;
      }

      function renderRest() {
        refs.count.textContent = String(S.left);
        refs.arc.style.strokeDasharray = RING.toFixed(1);
        refs.arc.style.strokeDashoffset = (RING * (1 - S.left / REST)).toFixed(1);
        refs.nextTxt.textContent = 'Prochaine : Série ' + S.set + ' / ' + SETS + ' · Pompes larges';
        refs.finishR.hidden = S.done < 2;
      }

      function renderProgress() {
        var f = S.finished;
        refs.total.textContent = f ? '24' : '23';
        refs.week2.textContent = f ? '4' : '3';
        refs.streak.textContent = f ? '5' : '4';
        ['stTotal', 'stWeek', 'stStreak'].forEach(function (k) { refs[k].classList.toggle('is-up', f); });
        /* lundi = aujourd’hui ; les autres barres = semaine passée (données fictives) */
        var data = [f ? 35 : 0, 28, 32, 0, 30, 20, 0];
        refs.bars.innerHTML = data.map(function (m, i) {
          var hgt = Math.max(6, Math.round(m / 35 * 62));
          return '<div><i class="' + (i === 0 && f ? 'is-on' : '') + '" style="height:' + hgt + 'px"></i>' + WEEK[i].d + '</div>';
        }).join('');
        refs.restart.hidden = !f;
      }

      function guide() {
        switch (S.screen) {
          case 'home': setHint(S.finished ? null : refs.start); break;
          case 'workout': setHint(S.done >= 2 ? refs.finishW : refs.setDone); break;
          case 'rest': setHint(S.done >= 2 ? refs.finishR : refs.skip); break;
          case 'done': setHint(refs.seeProgress); break;
          case 'progress': setHint(S.finished ? refs.restart : null); break;
          default: setHint(null);
        }
      }

      /* ---------- actions ---------- */
      function startWorkout() {
        stopTimer();
        S.set = 1; S.done = 0;
        renderWorkout();
        show('workout');
        setStep(1);
        guide();
      }

      function setDone() {
        S.done = S.set;
        if (S.done >= SETS) { finish(); return; }
        S.set = S.done + 1;
        startRest();
      }

      function startRest() {
        stopTimer();
        S.left = REST;
        /* remplir l’anneau sans transition, puis lancer le décompte */
        root.classList.remove('hf-anim');
        renderRest();
        void refs.arc.getBoundingClientRect();
        if (!reduced) root.classList.add('hf-anim');
        show('rest');
        setStep(2);
        if (!S.restToasted) {
          S.restToasted = true;
          toast('Le coach chronomètre le repos et enchaîne tout seul.');
        }
        guide();
        timer = setInterval(function () {
          S.left -= 1;
          if (S.left <= 0) { endRest(); return; }
          renderRest();
        }, 1000);
      }

      function endRest() {
        stopTimer();
        S.left = 0;
        renderWorkout();
        show('workout');
        guide();
      }

      function finish() {
        stopTimer();
        S.finished = true;
        refs.sumSets.textContent = String(Math.max(S.done, 1));
        renderProgress();
        show('done');
        setStep(3);
        guide();
      }

      function openProgress() {
        stopTimer();
        renderProgress();
        show('progress');
        if (S.finished) {
          setStep(4);
          toast('Séance enregistrée : 5 jours de suite 🔥');
        }
        guide();
      }

      function onClick(ev) {
        var btn = ev.target.closest('[data-act]');
        if (!btn || !root.contains(btn) || btn.disabled || btn.hidden) return;
        switch (btn.getAttribute('data-act')) {
          case 'start': startWorkout(); break;
          case 'setDone': setDone(); break;
          case 'skip': endRest(); break;
          case 'finish': finish(); break;
          case 'progress': openProgress(); break;
          case 'quit':
            stopTimer();
            show('home');
            setStep(0);
            guide();
            break;
          case 'restart': reset(); break;
          case 'tab':
            var t = btn.getAttribute('data-tab');
            if (t === 'home') { show('home'); guide(); }
            else if (t === 'progress') { openProgress(); }
            else toast('Démo : le programme complet compte 6 exercices par jour.');
            break;
        }
      }

      function onLogoError() { if (refs.logo) refs.logo.style.visibility = 'hidden'; }

      function build() {
        root.innerHTML = TEMPLATE;
        refs = {};
        var nodes = root.querySelectorAll('[data-ref]');
        for (var i = 0; i < nodes.length; i++) refs[nodes[i].getAttribute('data-ref')] = nodes[i];
        refs.logo.addEventListener('error', onLogoError);
      }

      function reset() {
        stopTimer();
        if (refs.logo) refs.logo.removeEventListener('error', onLogoError);
        S = initialState();
        build();
        renderWeek();
        renderWorkout();
        renderRest();
        renderProgress();
        show('home');
        setStep(0);
        guide();
      }

      root.addEventListener('click', onClick);
      reset();

      return {
        destroy: function () {
          stopTimer();
          root.removeEventListener('click', onClick);
          if (refs.logo) refs.logo.removeEventListener('error', onLogoError);
          root.innerHTML = '';
          root.classList.remove('sim-' + ID, 'hf-anim');
          refs = {};
        },
        reset: reset
      };
    }
  };
})();
