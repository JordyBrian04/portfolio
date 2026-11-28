/* Simulation du musée : AgriKonnect (acheter en direct aux producteurs ivoiriens, suivre la commande, noter le vendeur). */
(function () {
  'use strict';

  var ID = 'agrikonnect';
  var LOGO = 'assets/musee/agrikonnect.png';

  var CSS = [
    '.sim-agrikonnect{--g:#2D6A4F;--gd:#1B4332;--gl:#D8F3DC;--o:#F9A620;--ol:#FEF3DC;--b:#133350;--bg:#F8F9FA;--in:#E3E3E3;--bd:#E5E7EB;--t:#333333;--s:#999999;--s2:#6B7280;',
    'font-family:Poppins,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:var(--t);background:var(--bg);-webkit-tap-highlight-color:transparent}',
    '.sim-agrikonnect *{box-sizing:border-box;margin:0;padding:0}',
    '.sim-agrikonnect button{font:inherit;color:inherit;background:none;border:0;cursor:pointer;touch-action:manipulation}',
    '.sim-agrikonnect .ak-app{position:absolute;inset:0;display:flex;flex-direction:column;background:var(--bg)}',
    '.sim-agrikonnect .ak-sb{height:24px;flex:none;display:flex;justify-content:space-between;align-items:center;padding:0 16px;font-size:11px;font-weight:600;color:#fff;background:var(--g)}',
    '.sim-agrikonnect .ak-app.pro .ak-sb{background:var(--b)}',
    '.sim-agrikonnect .ak-stage{position:relative;flex:1;overflow:hidden}',
    '.sim-agrikonnect .ak-view{position:absolute;inset:0;display:flex;flex-direction:column;background:var(--bg)}',
    '.sim-agrikonnect .ak-enter{animation:ak-in .24s ease-out both}',
    '@keyframes ak-in{from{opacity:0;transform:translateX(18px)}to{opacity:1;transform:none}}',
    '@keyframes ak-up{from{transform:translateY(100%)}to{transform:none}}',
    '@keyframes ak-down{from{transform:translateY(-120%)}to{transform:none}}',
    '@keyframes ak-fade{from{opacity:0}to{opacity:1}}',
    '@keyframes ak-pop{0%{transform:scale(.6);opacity:0}70%{transform:scale(1.12);opacity:1}100%{transform:none}}',
    '.sim-agrikonnect .ak-top{flex:none;display:flex;align-items:center;justify-content:space-between;height:50px;padding:0 12px;background:#fff;border-bottom:1px solid var(--bd)}',
    '.sim-agrikonnect .ak-brand{display:flex;align-items:center;gap:6px;font-weight:800;font-size:16px;letter-spacing:-.2px}',
    '.sim-agrikonnect .ak-brand img{width:34px;height:34px;object-fit:contain}',
    '.sim-agrikonnect .ak-brand .a{color:var(--g)}.sim-agrikonnect .ak-brand .k{color:#E07B24}',
    '.sim-agrikonnect .ak-cart{position:relative;width:38px;height:38px;border-radius:12px;font-size:20px;display:flex;align-items:center;justify-content:center}',
    '.sim-agrikonnect .ak-cart i{position:absolute;top:1px;right:0;min-width:18px;height:18px;border-radius:9px;background:red;color:#fff;font-size:11px;font-weight:700;font-style:normal;display:flex;align-items:center;justify-content:center;padding:0 4px}',
    '.sim-agrikonnect .ak-cart i.pop{animation:ak-pop .4s ease-out both}',
    '.sim-agrikonnect .ak-body{flex:1;overflow-y:auto;overflow-x:hidden;padding:10px 12px 12px;scrollbar-width:none}',
    '.sim-agrikonnect .ak-body::-webkit-scrollbar,.sim-agrikonnect .ak-hs::-webkit-scrollbar{display:none}',
    '.sim-agrikonnect .ak-search{display:flex;align-items:center;gap:6px;height:40px;border:1px solid var(--s);border-radius:12px;padding:0 10px;font-size:12.5px;color:var(--s);background:#fff}',
    '.sim-agrikonnect .ak-h{font-size:16px;font-weight:700;margin:12px 0 8px}',
    '.sim-agrikonnect .ak-hs{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;padding:3px 3px 6px;margin:0 -3px}',
    '.sim-agrikonnect .ak-cat{flex:none;height:42px;display:flex;align-items:center;gap:5px;padding:0 12px;border-radius:15px;background:var(--in);font-size:12px;white-space:nowrap;transition:background .15s,color .15s}',
    '.sim-agrikonnect .ak-cat em{font-style:normal;font-size:19px}',
    '.sim-agrikonnect .ak-cat.on{background:var(--g);color:var(--bg)}',
    '.sim-agrikonnect .ak-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:9px;margin-top:6px}',
    '.sim-agrikonnect .ak-card{position:relative;background:#fff;border-radius:12px;padding:8px;cursor:pointer;transition:transform .1s;text-align:left}',
    '.sim-agrikonnect .ak-card:active{transform:scale(.97)}',
    '.sim-agrikonnect .ak-pic{height:76px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:40px}',
    '.sim-agrikonnect .ak-fav{position:absolute;top:12px;right:12px;width:26px;height:26px;border-radius:13px;background:var(--bg);font-size:13px;display:flex;align-items:center;justify-content:center}',
    '.sim-agrikonnect .ak-cname{font-size:10.5px;font-style:italic;color:var(--s);margin-top:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.sim-agrikonnect .ak-pname{font-size:13px;font-weight:600;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.sim-agrikonnect .ak-prow{display:flex;justify-content:space-between;align-items:center;margin-top:5px}',
    '.sim-agrikonnect .ak-price{font-size:12px;font-weight:700;color:var(--g)}',
    '.sim-agrikonnect .ak-price small{font-weight:400;font-size:10px}',
    '.sim-agrikonnect .ak-add{width:30px;height:30px;border-radius:8px;background:var(--o);color:#fff;font-size:15px;display:flex;align-items:center;justify-content:center}',
    '.sim-agrikonnect .ak-empty{text-align:center;color:var(--s2);font-size:13px;padding:30px 10px;grid-column:1/-1}',
    '.sim-agrikonnect .ak-tabs{height:56px;flex:none;display:flex;background:#fff;border-top:1px solid var(--bd)}',
    '.sim-agrikonnect .ak-tabs button{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;font-size:10.5px;color:var(--s)}',
    '.sim-agrikonnect .ak-tabs button.on{color:var(--g);font-weight:700}',
    '.sim-agrikonnect .ak-app.pro .ak-tabs button.on{color:var(--b)}',
    '.sim-agrikonnect .ak-tabs em{font-style:normal;font-size:17px}',
    '.sim-agrikonnect .ak-head{flex:none;height:50px;display:flex;align-items:center;gap:6px;padding:0 8px;background:#fff;border-bottom:1px solid var(--bd)}',
    '.sim-agrikonnect .ak-head h2{font-size:17px;font-weight:700;white-space:nowrap}',
    '.sim-agrikonnect .ak-head small{margin-left:auto;font-size:12px;color:var(--s2);padding-right:6px}',
    '.sim-agrikonnect .ak-back{width:34px;height:34px;border-radius:10px;font-size:22px;display:flex;align-items:center;justify-content:center}',
    '.sim-agrikonnect .ak-hero{position:relative;height:150px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:78px}',
    '.sim-agrikonnect .ak-dname{font-size:20px;font-weight:700;margin-top:10px;line-height:1.2}',
    '.sim-agrikonnect .ak-dprice{font-size:14px;margin-top:2px}',
    '.sim-agrikonnect .ak-dprice b{color:var(--g)}',
    '.sim-agrikonnect .ak-seller{display:flex;align-items:center;gap:9px;background:#fff;border:1px solid var(--bd);border-radius:12px;padding:8px 10px;margin-top:10px}',
    '.sim-agrikonnect .ak-av{width:36px;height:36px;flex:none;border-radius:50%;background:var(--gl);color:var(--g);font-weight:800;font-size:13px;display:flex;align-items:center;justify-content:center}',
    '.sim-agrikonnect .ak-seller b{display:block;font-size:13px}',
    '.sim-agrikonnect .ak-seller span{font-size:11.5px;color:var(--s2)}',
    '.sim-agrikonnect .ak-star{margin-left:auto;text-align:right;font-size:13px;font-weight:700;color:#D97706;white-space:nowrap}',
    '.sim-agrikonnect .ak-star small{display:block;font-size:10.5px;font-weight:500;color:var(--s2)}',
    '.sim-agrikonnect .ak-stock{display:flex;gap:6px;margin-top:8px;flex-wrap:wrap}',
    '.sim-agrikonnect .ak-pill{font-size:11px;font-weight:600;padding:3px 9px;border-radius:999px;background:var(--gl);color:var(--gd)}',
    '.sim-agrikonnect .ak-pill.o{background:var(--ol);color:#9A5B00}',
    '.sim-agrikonnect .ak-desc{font-size:12px;color:var(--s2);margin-top:8px;line-height:1.45}',
    '.sim-agrikonnect .ak-nut{display:flex;gap:7px;margin-top:10px}',
    '.sim-agrikonnect .ak-nut div{flex:1;border-radius:10px;padding:6px 4px;text-align:center;font-size:10.5px;font-weight:600}',
    '.sim-agrikonnect .ak-nut b{display:block;font-size:13px}',
    '.sim-agrikonnect .ak-foot{flex:none;display:flex;gap:8px;align-items:center;padding:10px 12px;background:#fff;border-top:1px solid var(--bd)}',
    '.sim-agrikonnect .ak-qty{display:flex;align-items:center;justify-content:space-between;width:112px;height:46px;background:var(--bg);border-radius:8px;padding:0 4px;flex:none}',
    '.sim-agrikonnect .ak-qty button{width:32px;height:36px;font-size:22px;font-weight:600;border-radius:6px}',
    '.sim-agrikonnect .ak-qty button[disabled]{opacity:.4;cursor:default}',
    '.sim-agrikonnect .ak-qty span{font-size:18px;font-weight:600}',
    '.sim-agrikonnect .ak-btn{display:flex;width:100%;min-height:46px;border-radius:10px;background:var(--g);color:#fff;font-size:14px;font-weight:600;align-items:center;justify-content:center;gap:8px;padding:0 10px;transition:transform .1s,opacity .2s}',
    '.sim-agrikonnect .ak-btn:active{transform:scale(.98)}',
    '.sim-agrikonnect .ak-btn[disabled]{opacity:.45;cursor:default}',
    '.sim-agrikonnect .ak-btn.blue{background:var(--b)}',
    '.sim-agrikonnect .ak-btn.red{background:#E11D24}',
    '.sim-agrikonnect .ak-btn.org{background:var(--o)}',
    '.sim-agrikonnect .ak-btn.ghost{background:#fff;color:var(--t);border:1.5px solid var(--bd)}',
    '.sim-agrikonnect .ak-snack{position:absolute;left:10px;right:10px;bottom:76px;display:flex;align-items:center;justify-content:space-between;gap:8px;background:var(--gd);color:#fff;border-radius:12px;padding:8px 8px 8px 12px;font-size:12.5px;z-index:4;animation:ak-up .25s ease-out both}',
    '.sim-agrikonnect .ak-snack button{height:32px;padding:0 10px;border-radius:8px;background:var(--o);color:#fff;font-weight:700;font-size:12px;white-space:nowrap}',
    '.sim-agrikonnect .ak-line{display:flex;gap:10px;align-items:center;background:#fff;border-radius:12px;padding:8px}',
    '.sim-agrikonnect .ak-line .ak-pic{width:60px;height:60px;flex:none;font-size:30px}',
    '.sim-agrikonnect .ak-line b{display:block;font-size:13.5px}',
    '.sim-agrikonnect .ak-line span{font-size:12px;color:var(--s2)}',
    '.sim-agrikonnect .ak-line .ak-price{font-size:13px}',
    '.sim-agrikonnect .ak-total{display:flex;justify-content:space-between;font-size:16px;font-weight:700;margin:14px 2px 10px}',
    '.sim-agrikonnect .ak-total b{color:var(--g)}',
    '.sim-agrikonnect .ak-note{font-size:11.5px;color:var(--s2);line-height:1.45;margin-top:10px}',
    '.sim-agrikonnect .ak-filt{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;margin-bottom:10px}',
    '.sim-agrikonnect .ak-filt span{flex:none;font-size:11.5px;padding:6px 10px;border-radius:999px;background:var(--in)}',
    '.sim-agrikonnect .ak-filt span.on{background:var(--g);color:#fff}',
    '.sim-agrikonnect .ak-order{background:#fff;border-radius:14px;padding:10px 11px;border:1px solid var(--bd)}',
    '.sim-agrikonnect .ak-ohead{display:flex;justify-content:space-between;align-items:center;gap:6px}',
    '.sim-agrikonnect .ak-ohead b{font-size:13px;color:var(--s2);font-weight:600}',
    '.sim-agrikonnect .ak-st{font-size:12px;color:#fff;padding:4px 9px;border-radius:12px;white-space:nowrap}',
    '.sim-agrikonnect .ak-st.pop{animation:ak-pop .45s ease-out both}',
    '.sim-agrikonnect .ak-kv{display:flex;justify-content:space-between;font-size:12px;margin-top:6px}',
    '.sim-agrikonnect .ak-kv span:first-child{font-weight:600}',
    '.sim-agrikonnect .ak-tbl{margin-top:8px;border-top:1px solid var(--bd);padding-top:6px;font-size:11px}',
    '.sim-agrikonnect .ak-tbl div{display:grid;grid-template-columns:1.4fr .9fr .8fr 1fr;gap:4px;padding:2px 0}',
    '.sim-agrikonnect .ak-tbl div:first-child{font-weight:600}',
    '.sim-agrikonnect .ak-tbl div span:last-child{text-align:right}',
    '.sim-agrikonnect .ak-row2{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:7px;margin-top:9px}',
    '.sim-agrikonnect .ak-row2 .ak-btn{min-height:40px;font-size:12.5px}',
    '.sim-agrikonnect .ak-demo{margin-top:12px;border:1.5px dashed #95D5B2;background:#F0FAF3;border-radius:14px;padding:11px}',
    '.sim-agrikonnect .ak-demo p{font-size:12px;color:var(--gd);margin-bottom:9px;line-height:1.4}',
    '.sim-agrikonnect .ak-proband{flex:none;background:var(--b);color:#fff;padding:8px 14px 10px}',
    '.sim-agrikonnect .ak-proband small{display:block;font-size:11px;opacity:.8}',
    '.sim-agrikonnect .ak-proband b{font-size:15px}',
    '.sim-agrikonnect .ak-notif{position:absolute;left:8px;right:8px;top:8px;display:flex;gap:9px;align-items:center;background:rgba(255,255,255,.97);border-radius:14px;padding:9px 10px;box-shadow:0 8px 24px rgba(0,0,0,.18);z-index:7;animation:ak-down .3s ease-out both}',
    '.sim-agrikonnect .ak-notif img{width:30px;height:30px;border-radius:8px;flex:none}',
    '.sim-agrikonnect .ak-notif b{display:block;font-size:12.5px}',
    '.sim-agrikonnect .ak-notif span{font-size:11.5px;color:var(--s2)}',
    '.sim-agrikonnect .ak-notif small{margin-left:auto;align-self:flex-start;font-size:10px;color:var(--s)}',
    '.sim-agrikonnect .ak-mine{display:flex;align-items:center;gap:9px;background:#fff;border-radius:12px;padding:8px;margin-bottom:7px}',
    '.sim-agrikonnect .ak-mine .ak-pic{width:46px;height:46px;flex:none;font-size:24px}',
    '.sim-agrikonnect .ak-mine b{display:block;font-size:13px}',
    '.sim-agrikonnect .ak-mine span{font-size:11.5px;color:var(--s2)}',
    '.sim-agrikonnect .ak-mine.new{animation:ak-pop .45s ease-out both;outline:2px solid var(--o)}',
    '.sim-agrikonnect .ak-dim{position:absolute;inset:0;background:rgba(0,0,0,.45);animation:ak-fade .2s both;z-index:5}',
    '.sim-agrikonnect .ak-sheet{position:absolute;left:0;right:0;bottom:0;max-height:94%;overflow-y:auto;scrollbar-width:none;background:#fff;border-radius:20px 20px 0 0;padding:8px 14px 14px;z-index:6;animation:ak-up .28s ease-out both}',
    '.sim-agrikonnect .ak-grab{width:40px;height:4px;border-radius:2px;background:var(--bd);margin:0 auto 8px}',
    '.sim-agrikonnect .ak-sheet h3{font-size:15px;font-weight:700;padding-right:30px}',
    '.sim-agrikonnect .ak-x{position:absolute;right:10px;top:10px;width:28px;height:28px;border-radius:50%;background:var(--bg);font-size:14px}',
    '.sim-agrikonnect .ak-lbl{font-size:12px;font-weight:600;margin:9px 0 4px}',
    '.sim-agrikonnect .ak-fld{display:flex;align-items:center;height:36px;border-radius:9px;background:var(--in);padding:0 10px;font-size:12.5px}',
    '.sim-agrikonnect .ak-photo{display:flex;align-items:center;gap:10px;margin-top:6px;font-size:12px;font-weight:600;color:var(--b)}',
    '.sim-agrikonnect .ak-photo .ak-pic{width:52px;height:52px;font-size:28px}',
    '.sim-agrikonnect .ak-two{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:8px}',
    '.sim-agrikonnect .ak-sheet .ak-btn{margin-top:12px}',
    '.sim-agrikonnect .ak-rate{flex:1;display:flex;flex-direction:column;align-items:center;text-align:center;padding:22px 18px 16px}',
    '.sim-agrikonnect .ak-rate .ak-av{width:70px;height:70px;font-size:22px}',
    '.sim-agrikonnect .ak-rate h1{font-size:20px;font-weight:700;margin-top:12px}',
    '.sim-agrikonnect .ak-rate p{font-size:12.5px;color:var(--s2);margin-top:6px;line-height:1.45}',
    '.sim-agrikonnect .ak-stars{display:flex;gap:4px;margin:18px 0 6px}',
    '.sim-agrikonnect .ak-stars button{width:44px;height:44px;font-size:32px;color:#CBD5E1;line-height:1;transition:transform .15s,color .15s}',
    '.sim-agrikonnect .ak-stars button.on{color:#F59E0B}',
    '.sim-agrikonnect .ak-stars button:active{transform:scale(1.2)}',
    '.sim-agrikonnect .ak-slab{font-size:13px;font-weight:700;color:var(--g);min-height:18px}',
    '.sim-agrikonnect .ak-spacer{flex:1}',
    '.sim-agrikonnect .ak-ok{width:76px;height:76px;border-radius:50%;background:var(--g);color:#fff;font-size:40px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:ak-pop .45s ease-out both;box-shadow:0 0 0 10px var(--gl)}',
    '.sim-agrikonnect.is-reduced *,.sim-agrikonnect.is-reduced *:before,.sim-agrikonnect.is-reduced *:after{animation:none!important;transition:none!important}'
  ].join('\n');

  /* Les 8 catégories de l'application (src/utils/data.tsx), avec un emoji à la place des icônes. */
  var CATS = [
    { k: 'tub', label: 'Tubercules & Racines', icon: '🍠', bg: '#FDEBD3' },
    { k: 'cer', label: 'Céréales', icon: '🌾', bg: '#FBF3D5' },
    { k: 'leg', label: 'Légumineuses', icon: '🥜', bg: '#F3E8D8' },
    { k: 'lgm', label: 'Légumes', icon: '🍅', bg: '#FDE2E0' },
    { k: 'fru', label: 'Fruits vivriers', icon: '🍌', bg: '#FFF4C8' },
    { k: 'feu', label: 'Feuilles & Légumes-feuilles', icon: '🥬', bg: '#DFF3E2' },
    { k: 'con', label: 'Condiments & Épices', icon: '🌶️', bg: '#FDE0D9' },
    { k: 'tra', label: 'Produits transformés', icon: '🥣', bg: '#F1EBE3' }
  ];

  /* Producteurs et produits fictifs. Type de prix : « kilo » ou « unitaire », comme dans l'app. */
  var SELLERS = {
    koffi: { name: 'Koffi K.', ini: 'KK', ville: 'Bouaflé', note: 4.7, avis: 12 },
    adjoua: { name: 'Adjoua N.', ini: 'AN', ville: 'Dabou', note: 4.9, avis: 21 },
    seydou: { name: 'Seydou T.', ini: 'ST', ville: 'Korhogo', note: 4.6, avis: 9 },
    affoue: { name: 'Affoué Y.', ini: 'AY', ville: 'Divo', note: 4.8, avis: 15 }
  };
  var PRODUCTS = [
    { id: 'igname', cat: 'tub', icon: '🍠', name: 'Igname kponan', prix: 600, type: 'kilo', stock: 250, seller: 'koffi',
      desc: 'Igname kponan récoltée cette semaine, idéale pour le foutou.', nut: [['🔥', 'Calories', '118 kcal'], ['💪', 'Protéines', '1,5 g'], ['🍚', 'Glucides', '28 g']] },
    { id: 'manioc', cat: 'tub', icon: '🥔', name: 'Manioc doux', prix: 250, type: 'kilo', stock: 400, seller: 'adjoua',
      desc: 'Manioc doux fraîchement arraché, pour l’attiéké ou le placali.', nut: [['🔥', 'Calories', '160 kcal'], ['💪', 'Protéines', '1,4 g'], ['🍚', 'Glucides', '38 g']] },
    { id: 'riz', cat: 'cer', icon: '🌾', name: 'Riz local paddy', prix: 550, type: 'kilo', stock: 600, seller: 'seydou',
      desc: 'Riz local décortiqué, sac à la demande.', nut: [['🔥', 'Calories', '360 kcal'], ['💪', 'Protéines', '7 g'], ['🍚', 'Glucides', '80 g']] },
    { id: 'arachide', cat: 'leg', icon: '🥜', name: 'Arachide décortiquée', prix: 900, type: 'kilo', stock: 120, seller: 'seydou',
      desc: 'Arachide séchée au soleil, pour la sauce graine ou la pâte.', nut: [['🔥', 'Calories', '567 kcal'], ['💪', 'Protéines', '26 g'], ['🍚', 'Glucides', '16 g']] },
    { id: 'tomate', cat: 'lgm', icon: '🍅', name: 'Tomate fraîche', prix: 800, type: 'kilo', stock: 90, seller: 'affoue',
      desc: 'Tomates mûres cueillies le matin même.', nut: [['🔥', 'Calories', '18 kcal'], ['💧', 'Eau', '95 g'], ['🍊', 'Vitamine C', '14 mg']] },
    { id: 'gombo', cat: 'lgm', icon: '🫛', name: 'Gombo frais', prix: 1000, type: 'kilo', stock: 60, seller: 'affoue',
      desc: 'Gombo tendre pour la sauce gombo.', nut: [['🔥', 'Calories', '33 kcal'], ['🌾', 'Fibres', '3,2 g'], ['🍊', 'Vitamine C', '23 mg']] },
    { id: 'plantain', cat: 'fru', icon: '🍌', name: 'Banane plantain (régime)', prix: 2500, type: 'unitaire', stock: 40, seller: 'koffi',
      desc: 'Régime de plantain bien plein, pour l’alloco ou le foutou.', nut: [['🔥', 'Calories', '122 kcal'], ['🍚', 'Glucides', '32 g'], ['🍌', 'Potassium', '487 mg']] },
    { id: 'ananas', cat: 'fru', icon: '🍍', name: 'Ananas pain de sucre', prix: 500, type: 'unitaire', stock: 150, seller: 'adjoua',
      desc: 'Ananas sucré de la région de Bonoua.', nut: [['🔥', 'Calories', '50 kcal'], ['🍬', 'Sucres', '10 g'], ['🍊', 'Vitamine C', '48 mg']] },
    { id: 'patate', cat: 'feu', icon: '🥬', name: 'Feuilles de patate', prix: 200, type: 'unitaire', stock: 80, seller: 'affoue',
      desc: 'Botte de feuilles de patate fraîches.', nut: [['🔥', 'Calories', '42 kcal'], ['🦴', 'Calcium', '78 mg'], ['🩸', 'Fer', '1 mg']] },
    { id: 'piment', cat: 'con', icon: '🌶️', name: 'Piment frais', prix: 1500, type: 'kilo', stock: 25, seller: 'seydou',
      desc: 'Piment rouge bien fort.', nut: [['🔥', 'Calories', '40 kcal'], ['🍊', 'Vitamine C', '144 mg'], ['🥕', 'Vitamine A', '48 µg']] },
    { id: 'attieke', cat: 'tra', icon: '🍚', name: 'Attiéké de Dabou', prix: 700, type: 'kilo', stock: 70, seller: 'adjoua',
      desc: 'Attiéké roulé à la main, emballé du jour.', nut: [['🔥', 'Calories', '150 kcal'], ['💪', 'Protéines', '1 g'], ['🍚', 'Glucides', '36 g']] }
  ];

  var START_CAT = 'tub';
  var START_PRODUCT = 'igname';
  var STAR_LABELS = ['', 'Décevant', 'Moyen', 'Bien', 'Très bien', 'Excellent !'];
  var STATUS = {
    wait: { label: 'En attente', c: '#F5A623' },
    run: { label: 'En cours', c: '#999999' },
    done: { label: 'Livrée', c: '#2D6A4F' }
  };

  function injectCss() {
    if (document.getElementById('sim-' + ID + '-css')) return;
    var s = document.createElement('style');
    s.id = 'sim-' + ID + '-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function fcfa(n) {
    return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }
  function unit(p) {
    return p.type === 'kilo' ? 'kilo' : 'unité';
  }
  function qtyUnit(p, q) {
    return p.type === 'kilo' ? q + ' kg' : q + (q > 1 ? ' unités' : ' unité');
  }
  function cat(k) {
    for (var i = 0; i < CATS.length; i++) if (CATS[i].k === k) return CATS[i];
    return CATS[0];
  }
  function product(id) {
    for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].id === id) return PRODUCTS[i];
    return PRODUCTS[0];
  }

  window.MuseumSims = window.MuseumSims || {};
  window.MuseumSims[ID] = {
    frame: 'phone',
    steps: [
      'Choisir une catégorie de produits',
      'Ouvrir la fiche d’un produit',
      'Ajouter au panier, valider la commande',
      'Le producteur démarre la livraison',
      'Confirmer la réception',
      'Noter le producteur'
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
          var i = timers.indexOf(id);
          if (i > -1) timers.splice(i, 1);
          fn();
        }, ms);
        timers.push(id);
      }
      function clearTimers() {
        while (timers.length) clearTimeout(timers.pop());
      }

      function freshState() {
        return { cat: null, pid: null, qty: 1, cart: null, order: null, stars: 0, proTab: 'cmd', published: false };
      }

      function hint(el) {
        var old = root.querySelectorAll('.sim-hint');
        for (var i = 0; i < old.length; i++) old[i].classList.remove('sim-hint');
        if (el) el.classList.add('sim-hint');
      }

      function show(html, name, proMode) {
        clearTimers();
        app.classList.toggle('pro', !!proMode);
        var v = document.createElement('div');
        v.className = 'ak-view' + (ctx.reduced ? '' : ' ak-enter');
        v.setAttribute('data-screen', name);
        v.innerHTML = html;
        stage.innerHTML = '';
        stage.appendChild(v);
        return v;
      }

      function pic(p, cls) {
        return '<div class="ak-pic' + (cls ? ' ' + cls : '') + '" style="background:' + cat(p.cat).bg + '" aria-hidden="true">' + p.icon + '</div>';
      }
      function cartCount() {
        return st.cart ? 1 : 0;
      }
      function cartBtn(pop) {
        var n = cartCount();
        return '<button type="button" class="ak-cart" data-a="cart" aria-label="Mon panier (' + n + ')">🧺<i' + (pop && !ctx.reduced ? ' class="pop"' : '') + '>' + n + '</i></button>';
      }
      function buyerTabs(active) {
        return '<div class="ak-tabs">' +
          '<button type="button" data-a="home"' + (active === 'home' ? ' class="on"' : '') + '><em>🏠</em>Catégorie</button>' +
          '<button type="button" data-a="favs"><em>♡</em>Favoris</button>' +
          '<button type="button" data-a="orders"' + (active === 'orders' ? ' class="on"' : '') + '><em>📦</em>Mes commandes</button></div>';
      }
      function statusBadge(key, pop) {
        var s = STATUS[key];
        return '<span class="ak-st' + (pop && !ctx.reduced ? ' pop' : '') + '" style="background:' + s.c + '">' + s.label + '</span>';
      }

      /* ---------- acheteur : catalogue ---------- */

      function gridHtml() {
        var list = PRODUCTS.filter(function (p) { return !st.cat || p.cat === st.cat; });
        if (!list.length) return '<div class="ak-empty">Aucun produit trouvé</div>';
        return list.map(function (p) {
          return '<div class="ak-card" data-a="product" data-p="' + p.id + '" role="button" tabindex="0" aria-label="Voir ' + p.name + '">' +
            pic(p) + '<span class="ak-fav" aria-hidden="true">♡</span>' +
            '<div class="ak-cname">' + cat(p.cat).label + '</div><div class="ak-pname">' + p.name + '</div>' +
            '<div class="ak-prow"><span class="ak-price">' + fcfa(p.prix) + ' CFA<small>/' + unit(p) + '</small></span>' +
            '<span class="ak-add" aria-hidden="true">🧺</span></div></div>';
        }).join('');
      }

      function home() {
        var chips = '<button type="button" class="ak-cat' + (st.cat ? '' : ' on') + '" data-a="cat" data-c=""><em>🧺</em>Toutes</button>';
        CATS.forEach(function (c) {
          chips += '<button type="button" class="ak-cat' + (st.cat === c.k ? ' on' : '') + '" data-a="cat" data-c="' + c.k + '"><em>' + c.icon + '</em>' + c.label + '</button>';
        });
        var v = show(
          '<div class="ak-top"><div class="ak-brand"><img src="' + LOGO + '" alt=""><span><span class="a">Agri</span><span class="k">Konnect</span></span></div>' + cartBtn(false) + '</div>' +
          '<div class="ak-body"><div class="ak-search" aria-hidden="true">🔍 Rechercher des produits...</div>' +
          '<div class="ak-h">Catégorie</div><div class="ak-hs" data-cats>' + chips + '</div>' +
          '<div class="ak-grid">' + gridHtml() + '</div></div>' + buyerTabs('home'),
          'home');
        if (st.cat) {
          var on = v.querySelector('.ak-cat.on');
          var row = v.querySelector('[data-cats]');
          if (on && row) row.scrollLeft = Math.max(0, on.offsetLeft - 40);
        }
        if (!st.cat) {
          ctx.setStep(0);
          hint(v.querySelector('[data-c="' + START_CAT + '"]'));
        } else {
          ctx.setStep(1);
          hint(v.querySelector('[data-p="' + START_PRODUCT + '"]') || v.querySelector('.ak-card') || v.querySelector('[data-c=""]'));
        }
      }

      /* ---------- acheteur : fiche produit ---------- */

      function detail() {
        ctx.setStep(2);
        var p = product(st.pid);
        var s = SELLERS[p.seller];
        var colors = ['#FFE7CC', '#DDF2E3', '#DCEBFB'];
        var nut = p.nut.map(function (n, i) {
          return '<div style="background:' + colors[i] + '">' + n[0] + ' ' + n[1] + '<b>' + n[2] + '</b></div>';
        }).join('');
        var v = show(
          '<div class="ak-head"><button type="button" class="ak-back" data-a="home" aria-label="Retour">←</button><h2>Détails du produit</h2>' +
          '<span style="margin-left:auto">' + cartBtn(false) + '</span></div>' +
          '<div class="ak-body"><div class="ak-hero" style="background:' + cat(p.cat).bg + '" aria-hidden="true">' + p.icon +
          '<span class="ak-fav" style="top:10px;right:10px;width:32px;height:32px;font-size:16px">♡</span></div>' +
          '<div class="ak-dname">' + p.name + '</div>' +
          '<div class="ak-dprice">Prix : <b>' + fcfa(p.prix) + ' FCFA</b> / ' + unit(p) + '</div>' +
          '<div class="ak-stock"><span class="ak-pill">● Disponible</span><span class="ak-pill o">Stock : ' + qtyUnit(p, p.stock) + '</span></div>' +
          '<div class="ak-seller"><div class="ak-av" aria-hidden="true">' + s.ini + '</div><div><b>' + s.name + '</b><span>Producteur · ' + s.ville + '</span></div>' +
          '<div class="ak-star">★ ' + s.note.toFixed(1).replace('.', ',') + '<small>' + s.avis + ' avis</small></div></div>' +
          '<p class="ak-desc">' + p.desc + '</p>' +
          '<div class="ak-nut" aria-label="Valeurs nutritionnelles pour 100 g">' + nut + '</div></div>' +
          '<div class="ak-foot"><div class="ak-qty"><button type="button" data-a="minus" aria-label="Retirer"' + (st.qty === 1 ? ' disabled' : '') + '>−</button>' +
          '<span data-qty>' + st.qty + '</span><button type="button" data-a="plus" aria-label="Ajouter">+</button></div>' +
          '<button type="button" class="ak-btn" data-a="addCart"><span data-sum>' + fcfa(p.prix * st.qty) + ' CFA</span> 🧺</button></div>',
          'detail');
        hint(v.querySelector('[data-a="addCart"]'));
      }

      function updateQty() {
        var p = product(st.pid);
        var q = root.querySelector('[data-qty]');
        var sum = root.querySelector('[data-sum]');
        var m = root.querySelector('[data-a="minus"]');
        if (q) q.textContent = st.qty;
        if (sum) sum.textContent = fcfa(p.prix * st.qty) + ' CFA';
        if (m) m.disabled = st.qty === 1;
      }

      function addedToCart() {
        var p = product(st.pid);
        st.cart = { pid: p.id, qty: st.qty };
        var c = root.querySelector('.ak-cart');
        if (c) c.outerHTML = cartBtn(true);
        var old = root.querySelector('.ak-snack');
        if (old) old.parentNode.removeChild(old);
        var view = stage.querySelector('.ak-view');
        var sn = document.createElement('div');
        sn.className = 'ak-snack';
        sn.innerHTML = '<span>Produit ajouté au panier</span><button type="button" data-a="cart">Voir le panier</button>';
        view.appendChild(sn);
        ctx.toast('Ajouté au panier : ' + p.name + ', ' + qtyUnit(p, st.qty) + '.');
        hint(sn.querySelector('button'));
      }

      /* ---------- acheteur : panier ---------- */

      function cart() {
        ctx.setStep(2);
        var body;
        var foot = '';
        if (!st.cart) {
          body = '<div class="ak-empty">🧺<br>Panier vide</div>';
        } else {
          var p = product(st.cart.pid);
          var s = SELLERS[p.seller];
          var total = p.prix * st.cart.qty;
          body = '<div class="ak-line">' + pic(p) + '<div style="flex:1;min-width:0"><b>' + p.name + '</b>' +
            '<span class="ak-price">' + fcfa(p.prix) + ' FCFA<small>/' + unit(p) + '</small></span><br>' +
            '<span>Quantité : ' + qtyUnit(p, st.cart.qty) + ' · ' + s.name + '</span></div></div>' +
            '<p class="ak-note">Le producteur est prévenu dès que vous validez. Vous payez à la livraison et gardez son numéro pour l’appeler.</p>';
          foot = '<div class="ak-foot" style="flex-direction:column;align-items:stretch;gap:0">' +
            '<div class="ak-total" style="margin:0 2px 8px"><span>Total</span><b>' + fcfa(total) + ' FCFA</b></div>' +
            '<button type="button" class="ak-btn" data-a="checkout">Valider la commande</button></div>';
        }
        var v = show(
          '<div class="ak-head"><button type="button" class="ak-back" data-a="back" aria-label="Retour">←</button><h2>Mon panier</h2>' +
          '<small>' + cartCount() + ' article(s)</small></div>' +
          '<div class="ak-body">' + body + '</div>' + foot,
          'cart');
        hint(v.querySelector('[data-a="checkout"]') || v.querySelector('[data-a="back"]'));
      }

      /* ---------- commandes (acheteur et producteur) ---------- */

      function orderCard(role, pop) {
        var o = st.order;
        var p = product(o.pid);
        var s = SELLERS[p.seller];
        var total = p.prix * o.qty;
        var who = role === 'pro'
          ? '<div class="ak-kv"><span>Acheteur :</span><span>Aya D. · Cocody</span></div>'
          : '<div class="ak-kv"><span>Producteur :</span><span>' + s.name + ' · ' + s.ville + '</span></div>';
        var acts = '';
        if (role === 'pro' && o.status === 'wait') {
          acts = '<button type="button" class="ak-btn blue" data-a="ship" style="margin-top:9px">🚚 Démarrer la livraison</button>' +
            '<div class="ak-row2"><button type="button" class="ak-btn org" data-a="noop">Appeler</button>' +
            '<button type="button" class="ak-btn org" data-a="noop">Envoyer un SMS</button></div>';
        } else if (role === 'buyer' && o.status === 'wait') {
          acts = '<div class="ak-row2"><button type="button" class="ak-btn red" data-a="noop">Annuler la commande</button>' +
            '<button type="button" class="ak-btn org" data-a="noop">Appeler</button></div>';
        } else if (role === 'buyer' && o.status === 'run') {
          acts = '<button type="button" class="ak-btn" data-a="received" style="margin-top:9px">Confirmer la réception</button>' +
            '<div class="ak-row2"><button type="button" class="ak-btn org" data-a="noop">Appeler</button>' +
            '<button type="button" class="ak-btn org" data-a="noop">Envoyer un SMS</button></div>';
        } else if (role === 'pro' && o.status === 'run') {
          acts = '<p class="ak-note">Livraison en route. L’acheteur confirmera la réception.</p>';
        }
        return '<div class="ak-order"><div class="ak-ohead"><b>#' + o.num + '</b>' + statusBadge(o.status, pop) + '</div>' +
          '<div class="ak-kv"><span>Date de commande :</span><span>Aujourd’hui, 09:41</span></div>' + who +
          '<div class="ak-tbl"><div><span>Produits</span><span>Prix (CFA)</span><span>Quantité</span><span>Total (CFA)</span></div>' +
          '<div><span>' + p.name.split(' (')[0] + '</span><span>' + fcfa(p.prix) + '</span><span>' + qtyUnit(p, o.qty) + '</span><span>' + fcfa(total) + '</span></div></div>' +
          '<div class="ak-kv" style="margin-top:6px"><span>Total (CFA) :</span><span style="font-weight:700">' + fcfa(total) + '</span></div>' +
          acts + '</div>';
      }

      function filters(statusKey) {
        var active = { wait: 'En attente', run: 'En cours', done: 'Livrées' }[statusKey];
        return '<div class="ak-filt" aria-hidden="true">' + ['Toutes', 'En attente', 'En cours', 'Livrées', 'Annulées'].map(function (f) {
          return '<span' + (f === 'Toutes' ? ' class="on"' : '') + (f === active ? ' style="font-weight:700"' : '') + '>' + f + '</span>';
        }).join('') + '</div>';
      }

      function buyerOrders(pop) {
        var o = st.order;
        var body;
        if (!o) {
          body = '<div class="ak-empty">Aucune commande pour l’instant.</div>';
        } else {
          body = filters(o.status) + orderCard('buyer', pop);
          if (o.status === 'wait') {
            body += '<div class="ak-demo"><p>Dans l’app, le producteur reçoit tout de suite la notification « Nouvelle commande! ».</p>' +
              '<button type="button" class="ak-btn blue" data-a="toPro">Voir côté producteur</button></div>';
          } else if (o.status === 'done') {
            body += '<div class="ak-demo"><p>Commande livrée : vous pouvez maintenant noter le producteur.</p>' +
              '<button type="button" class="ak-btn" data-a="rate">Noter le producteur</button></div>';
          }
        }
        var v = show(
          '<div class="ak-head"><h2 style="padding-left:6px">Mes commandes</h2>' + '<span style="margin-left:auto">' + cartBtn(false) + '</span></div>' +
          '<div class="ak-body">' + body + '</div>' + buyerTabs('orders'),
          'orders');
        if (!o) { hint(v.querySelector('.ak-tabs [data-a="home"]')); return; }
        ctx.setStep(o.status === 'wait' ? 3 : o.status === 'run' ? 4 : 5);
        hint(v.querySelector('[data-a="toPro"],[data-a="received"],[data-a="rate"]'));
      }

      /* ---------- côté producteur ---------- */

      function proTabs() {
        return '<div class="ak-tabs">' +
          '<button type="button" data-a="proCmd"' + (st.proTab === 'cmd' ? ' class="on"' : '') + '><em>📦</em>Mes commandes</button>' +
          '<button type="button" data-a="proProd"' + (st.proTab === 'prod' ? ' class="on"' : '') + '><em>🌱</em>Mes produits</button></div>';
      }

      function proHead() {
        var s = SELLERS[product(st.order.pid).seller];
        return '<div class="ak-proband"><small>Espace agriculteur</small><b>' + s.name + ' · ' + s.ville + '</b></div>';
      }

      function proOrders(withNotif) {
        ctx.setStep(3);
        st.proTab = 'cmd';
        var o = st.order;
        var body = filters(o.status) + orderCard('pro', o.status === 'run');
        if (o.status === 'run') {
          body += '<div class="ak-demo"><p>L’acheteur voit maintenant sa commande « En cours ».</p>' +
            '<button type="button" class="ak-btn" data-a="toBuyer">Revenir côté acheteur</button></div>';
        }
        var v = show(proHead() + '<div class="ak-body">' + body + '</div>' + proTabs(), 'pro', true);
        if (withNotif) {
          var n = document.createElement('div');
          n.className = 'ak-notif';
          n.setAttribute('role', 'status');
          n.innerHTML = '<img src="' + LOGO + '" alt=""><div><b>Nouvelle commande!</b><span>Vous avez une nouvelle commande.</span></div><small>maintenant</small>';
          v.appendChild(n);
          later(function () { if (n.parentNode) n.parentNode.removeChild(n); }, 3200);
        }
        hint(v.querySelector('[data-a="ship"],[data-a="toBuyer"]'));
      }

      function proProducts(fresh) {
        st.proTab = 'prod';
        var s = product(st.order.pid).seller;
        var mine = PRODUCTS.filter(function (p) { return p.seller === s; });
        var list = '';
        if (st.published) {
          list += '<div class="ak-mine' + (fresh && !ctx.reduced ? ' new' : '') + '">' + pic({ cat: 'lgm', icon: '🍆' }) +
            '<div><b>Aubergine locale</b><span>400 FCFA / kilo · Stock : 80 kg</span></div></div>';
        }
        list += mine.map(function (p) {
          return '<div class="ak-mine">' + pic(p) + '<div><b>' + p.name + '</b><span>' + fcfa(p.prix) + ' FCFA / ' + unit(p) +
            ' · Stock : ' + qtyUnit(p, p.id === st.order.pid && st.order.status !== 'wait' ? p.stock - st.order.qty : p.stock) + '</span></div></div>';
        }).join('');
        var v = show(proHead() +
          '<div class="ak-body"><div class="ak-h" style="margin-top:2px">Mes produits</div>' + list +
          (st.published ? '' : '<button type="button" class="ak-btn" data-a="newProd" style="margin-top:6px">＋ Ajouter un produit</button>') +
          '</div>' + proTabs(), 'proProd', true);
        hint(st.published ? v.querySelector('[data-a="proCmd"]') : v.querySelector('[data-a="newProd"]'));
      }

      function openForm() {
        var view = stage.querySelector('.ak-view');
        var wrap = document.createElement('div');
        wrap.setAttribute('data-sheet', '');
        wrap.innerHTML = '<div class="ak-dim" data-a="closeForm"></div>' +
          '<div class="ak-sheet" role="dialog" aria-label="Ajouter un produit"><div class="ak-grab"></div>' +
          '<button type="button" class="ak-x" data-a="closeForm" aria-label="Fermer">✕</button>' +
          '<h3>Ajouter/Modifier un produit</h3>' +
          '<div class="ak-photo">' + pic({ cat: 'lgm', icon: '🍆' }) + '<span>📷 Ajouter une photo</span></div>' +
          '<div class="ak-lbl">Catégorie du produit</div><div class="ak-hs" style="padding:0;margin:0">' +
          '<span class="ak-cat on" style="height:32px"><em>🍅</em>Légumes</span><span class="ak-cat" style="height:32px"><em>🍠</em>Tubercules & Racines</span></div>' +
          '<div class="ak-lbl">Nom du produit</div><div class="ak-fld">Aubergine locale</div>' +
          '<div class="ak-two"><div><div class="ak-lbl">Prix (en FCFA)</div><div class="ak-fld">400</div></div>' +
          '<div><div class="ak-lbl">Type de prix</div><div class="ak-fld">Prix par Kilo</div></div></div>' +
          '<div class="ak-two"><div><div class="ak-lbl">Quantité (en kg)</div><div class="ak-fld">80</div></div>' +
          '<div><div class="ak-lbl">Disponibilité</div><div class="ak-fld" style="background:var(--gl);color:var(--gd);font-weight:600">Disponible</div></div></div>' +
          '<button type="button" class="ak-btn" data-a="saveProd">Enregistrer</button></div>';
        view.appendChild(wrap);
        hint(wrap.querySelector('[data-a="saveProd"]'));
      }

      /* ---------- notation ---------- */

      function rate() {
        ctx.setStep(5);
        var s = SELLERS[product(st.order.pid).seller];
        var stars = '';
        for (var i = 1; i <= 5; i++) {
          stars += '<button type="button" data-a="star" data-n="' + i + '" aria-label="' + i + ' étoile' + (i > 1 ? 's' : '') + '">★</button>';
        }
        var v = show(
          '<div class="ak-head"><button type="button" class="ak-back" data-a="orders" aria-label="Retour">←</button><h2>Noter le producteur</h2></div>' +
          '<div class="ak-rate"><div class="ak-av" aria-hidden="true">' + s.ini + '</div><h1>' + s.name + '</h1>' +
          '<p>Commande #' + st.order.num + ' livrée.<br>Votre note aide les autres acheteurs à choisir.</p>' +
          '<div class="ak-stars">' + stars + '</div><div class="ak-slab" data-slab></div><div class="ak-spacer"></div>' +
          '<button type="button" class="ak-btn" data-a="sendRate" disabled>Envoyer la note</button></div>',
          'rate');
        hint(v.querySelector('[data-n="5"]'));
      }

      function thanks() {
        var s = SELLERS[product(st.order.pid).seller];
        var newNote = (s.note * s.avis + st.stars) / (s.avis + 1);
        var v = show(
          '<div class="ak-rate" style="justify-content:center"><div class="ak-ok" aria-hidden="true">✓</div>' +
          '<h1>Merci pour votre avis !</h1><p>Vous avez donné ' + st.stars + ' étoile' + (st.stars > 1 ? 's' : '') + ' à ' + s.name + '<br>' +
          'Sa note passe à <b style="color:#D97706">★ ' + newNote.toFixed(1).replace('.', ',') + '</b> (' + (s.avis + 1) + ' avis), visible sur ses produits.</p>' +
          '<div class="ak-spacer" style="max-height:40px"></div>' +
          '<button type="button" class="ak-btn" data-a="restart" style="max-width:260px">Recommencer</button></div>',
          'thanks');
        hint(v.querySelector('[data-a="restart"]'));
      }

      /* ---------- interactions ---------- */

      function onClick(e) {
        var b = e.target.closest ? e.target.closest('[data-a]') : null;
        if (!b || !root.contains(b) || b.disabled) return;
        var a = b.getAttribute('data-a');
        var i;
        if (a === 'cat') {
          st.cat = b.getAttribute('data-c') || null;
          home();
          if (!st.cat) { ctx.setStep(1); hint(root.querySelector('[data-p="' + START_PRODUCT + '"]')); }
        } else if (a === 'product') {
          st.pid = b.getAttribute('data-p');
          st.qty = st.cart && st.cart.pid === st.pid ? st.cart.qty : 1;
          detail();
        } else if (a === 'plus') {
          if (st.qty < 20) st.qty++;
          updateQty();
        } else if (a === 'minus') {
          if (st.qty > 1) st.qty--;
          updateQty();
        } else if (a === 'addCart') addedToCart();
        else if (a === 'cart') cart();
        else if (a === 'back') { if (st.pid) detail(); else home(); }
        else if (a === 'home') home();
        else if (a === 'favs') ctx.toast('Les favoris gardent vos produits préférés.');
        else if (a === 'checkout') {
          st.order = { pid: st.cart.pid, qty: st.cart.qty, status: 'wait', num: 'AGK-2026-341209' };
          st.cart = null;
          ctx.toast('Commande passée avec succès !');
          buyerOrders(true);
        } else if (a === 'orders') buyerOrders(false);
        else if (a === 'toPro') proOrders(true);
        else if (a === 'proCmd') proOrders(false);
        else if (a === 'proProd') proProducts(false);
        else if (a === 'newProd') openForm();
        else if (a === 'closeForm') {
          var sh = root.querySelector('[data-sheet]');
          if (sh) sh.parentNode.removeChild(sh);
          hint(root.querySelector('[data-a="newProd"]'));
        } else if (a === 'saveProd') {
          st.published = true;
          ctx.toast('Produit publié : les acheteurs le voient déjà.');
          proProducts(true);
        } else if (a === 'ship') {
          st.order.status = 'run';
          ctx.toast('Commande mise en cours de livraison avec succès');
          proOrders(false);
        } else if (a === 'toBuyer') buyerOrders(true);
        else if (a === 'received') {
          st.order.status = 'done';
          ctx.toast('Commande livrée');
          buyerOrders(true);
        } else if (a === 'rate') rate();
        else if (a === 'star') {
          st.stars = Number(b.getAttribute('data-n'));
          var ss = root.querySelectorAll('[data-a="star"]');
          for (i = 0; i < ss.length; i++) ss[i].classList.toggle('on', i < st.stars);
          root.querySelector('[data-slab]').textContent = STAR_LABELS[st.stars];
          var sr = root.querySelector('[data-a="sendRate"]');
          sr.disabled = false;
          hint(sr);
        } else if (a === 'sendRate') thanks();
        else if (a === 'noop') ctx.toast('Simulation : ce bouton n’est pas actif ici.');
        else if (a === 'restart') reset();
      }

      function onKey(e) {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        var t = e.target;
        if (t && t.classList && t.classList.contains('ak-card')) {
          e.preventDefault();
          t.click();
        }
      }

      function build() {
        root.innerHTML =
          '<div class="ak-app"><div class="ak-sb" aria-hidden="true"><span>9:41</span><span>▂▄▆ 100 %</span></div>' +
          '<div class="ak-stage"></div></div>';
        app = root.querySelector('.ak-app');
        stage = root.querySelector('.ak-stage');
      }

      function reset() {
        clearTimers();
        st = freshState();
        home();
        var body = root.querySelector('.ak-body');
        if (body) body.scrollTop = 0;
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
