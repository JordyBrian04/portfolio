/* Contenu du portfolio — source : CV de Jordy Brian GBOKO.
   Chaque zone = un bâtiment de la carte + un panneau d'information. */

const _I = {
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
  code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
  activity: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
  mail: '<path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><polyline points="22,6 12,13 2,6"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  pin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  map: '<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  arrow: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
  chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'
};
function icon(name, size = 20) {
  return `<svg class="ico" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${_I[name] || ''}</svg>`;
}

const CV_FILE = 'assets/CV_Jordy_Brian_GBOKO.pdf';
const PHONE = '+225 07 17 20 72 66';
const PHONE_RAW = '2250717207266';
const EMAIL = 'briangboko33@gmail.com';

const ZONES = [
  /* ───────────── MAISON · À PROPOS ───────────── */
  {
    id: 'about', name: 'Chez Jordy', label: 'À propos', color: '#ffb454', icon: 'user', type: 'house',
    x: 1170, y: 520, w: 260, h: 170, top: 82, door: [1300, 726],
    eyebrow: 'À propos', title: 'Salut, moi c’est Jordy.',
    html: `
      <div class="hero-card">
        <img src="assets/jordy.png" alt="Portrait de Jordy Brian GBOKO" width="84" height="84">
        <div><h3>Jordy Brian GBOKO</h3><p>Développeur Full Stack — Web &amp; Mobile<br>Administrateur de bases de données</p>
        <span class="loc">${icon('pin', 14)} Abidjan, Côte d’Ivoire</span></div>
      </div>
      <p class="lead">Je conçois des solutions numériques <b>fiables</b>, de l’idée jusqu’à la mise en production — et je les maintiens quand elles servent <b>tous les jours</b>.</p>
      <p>Cinq ans à livrer des applications web (Laravel, Node.js/Express, React) et mobiles (React Native) adossées à MySQL et PostgreSQL : portail fournisseurs en production, API sécurisées, application mobile déployée sur VPS Linux.</p>
      <div class="stats">
        <div class="stat"><b data-count="5">5</b><span>ans d’expérience en développement</span></div>
        <div class="stat"><b data-count="140" data-prefix="+">140</b><span>milliards FCFA de flux de paie analysés</span></div>
        <div class="stat"><b data-count="4">4</b><span>bases sauvegardées automatiquement chaque jour</span></div>
        <div class="stat"><b data-count="3">3</b><span>écosystèmes maîtrisés : Laravel, Node, React Native</span></div>
      </div>
      <h4>Ma façon de travailler</h4>
      <ul class="ticks">
        <li>Du cadrage du besoin à la mise en ligne, <b>sans perdre le fil</b>.</li>
        <li>La sécurité dès le départ : JWT, protection contre l’injection SQL.</li>
        <li>Je forme les utilisateurs : un outil n’a de valeur que s’il est adopté.</li>
      </ul>
      <div class="hint">Continue la balade : chaque bâtiment raconte une partie de mon parcours.</div>`
  },

  /* ───────────── TOUR · EXPÉRIENCE ───────────── */
  {
    id: 'exp', name: 'Tour Southland', label: 'Expérience', color: '#5b9dff', icon: 'briefcase', type: 'tower',
    x: 1850, y: 300, w: 240, h: 330, top: 62, door: [1970, 666],
    eyebrow: 'Expérience professionnelle', title: 'Du terrain, du concret, de la production.',
    html: `
      <div class="tl">
        <div class="tl-item now">
          <div class="when">Mars 2024 — Aujourd’hui</div>
          <div class="role">IT Developer &amp; Database Administrator</div>
          <div class="org">Southland Ressource Côte d’Ivoire (SRWCI / SKCI), Abidjan</div>
          <ul>
            <li>Portail web fournisseurs (<b>Laravel / MySQL</b>) en production, utilisé chaque jour pour le suivi des comptes, des livraisons et des règlements.</li>
            <li>API REST <b>Node.js / Express</b> intégrant un <b>assistant IA</b> (API Anthropic Claude) : authentification JWT, middleware de sécurité SQL, simulateur de paie en langage naturel.</li>
            <li>Audit et régularisation du système de paie fournisseurs de deux entités : <b>+140 milliards FCFA</b> de flux analysés, module correctif opérationnel depuis mai 2026.</li>
            <li>Administration des bases MySQL du groupe : sauvegardes quotidiennes automatisées de <b>4 bases</b>, rétention 30 jours, supervision par rapport automatisé, optimisation des requêtes.</li>
          </ul>
        </div>
        <div class="tl-item">
          <div class="when">Mars 2022 — Févr. 2024</div>
          <div class="role">Développeur Full Stack</div>
          <div class="org">CIAN, Abidjan</div>
          <ul>
            <li>Applications web et mobiles, du cadrage du besoin jusqu’à la mise en production.</li>
            <li>Modélisation et administration des bases métier (MySQL, Access), mise en place de l’archivage numérique des documents.</li>
            <li>Formation et accompagnement des utilisateurs pour garantir l’adoption des outils livrés.</li>
          </ul>
        </div>
        <div class="tl-item">
          <div class="when">Août 2020 — Févr. 2021</div>
          <div class="role">Développeur Full Stack</div>
          <div class="org">Prestel Technologie, Abidjan</div>
          <ul>
            <li>Sites web statiques et dynamiques, logiciels de gestion sur mesure (PHP, JavaScript, HTML/CSS).</li>
            <li>Conception des modèles de données et optimisation des requêtes SQL.</li>
          </ul>
        </div>
      </div>`
  },

  /* ───────────── STUDIO · FREELANCE ───────────── */
  {
    id: 'freelance', name: 'Studio Freelance', label: 'Freelance', color: '#b190ff', icon: 'layers', type: 'studio',
    x: 1900, y: 760, w: 260, h: 170, top: 44, door: [2030, 966],
    eyebrow: 'Freelance & consultance', title: 'Aussi à l’aise en mission qu’en équipe.',
    html: `
      <div class="cards one">
        <div class="card"><div class="card-h"><b>Consultant technique · eBonus</b><span class="tag live">En cours</span></div>
          <p>J’accompagne l’équipe sur les choix techniques et la mise en œuvre de sa solution numérique.</p></div>
        <div class="card"><div class="card-h"><b>Développeur Web E-commerce · Vodoprone</b><span class="tag">Mission</span></div>
          <p>Conception et mise en ligne d’un site e-commerce <b>WordPress</b>, avec intégration complète des moyens de paiement en ligne.</p></div>
        <div class="card"><div class="card-h"><b>Développeur PHP · OPISMS, Abidjan</b><span class="tag">Janv. 2023 — Févr. 2025</span></div>
          <p>Nouvelles fonctionnalités, refonte et maintenance corrective de sites web PHP.</p></div>
      </div>
      <div class="hint">Un besoin ponctuel, un avis technique, un site à livrer ? Passe par la Poste, je réponds vite.</div>`
  },

  /* ───────────── LABO · COMPÉTENCES ───────────── */
  {
    id: 'skills', name: 'Le Labo', label: 'Compétences', color: '#2fd3b5', icon: 'code', type: 'lab',
    x: 420, y: 420, w: 300, h: 210, top: 74, door: [570, 666],
    eyebrow: 'Compétences & stack', title: 'La boîte à outils.',
    html: `
      <div class="pipeline"><span>Cadrage</span><i></i><span>Conception</span><i></i><span>Développement</span><i></i><span>Déploiement</span><i></i><span>Maintenance</span></div>
      <h4>Back-end &amp; API</h4>
      <div class="chips"><span class="chip hot">Node.js / Express</span><span class="chip hot">PHP / Laravel</span><span class="chip">API REST</span><span class="chip">JWT</span><span class="chip">Sécurité anti-injection SQL</span></div>
      <h4>Web &amp; Mobile</h4>
      <div class="chips"><span class="chip hot">React</span><span class="chip hot">React Native (Expo)</span><span class="chip">TypeScript</span><span class="chip">JavaScript</span><span class="chip">HTML / CSS</span><span class="chip">WordPress</span><span class="chip">Paiement en ligne</span></div>
      <h4>Données</h4>
      <div class="chips"><span class="chip hot">MySQL</span><span class="chip hot">PostgreSQL / Supabase</span><span class="chip">Conception &amp; optimisation</span><span class="chip">Sauvegarde &amp; administration</span><span class="chip">Access</span></div>
      <h4>Déploiement &amp; outils</h4>
      <div class="chips"><span class="chip">VPS Linux</span><span class="chip">Nginx</span><span class="chip">PM2</span><span class="chip">SSL / HTTPS</span><span class="chip">Git / GitHub</span><span class="chip">WinDev / WebDev</span></div>
      <h4>Langages</h4>
      <div class="chips"><span class="chip">JavaScript</span><span class="chip">TypeScript</span><span class="chip">PHP</span><span class="chip">SQL</span><span class="chip">WLangage</span><span class="chip">C++</span><span class="chip">VB</span></div>
      <div class="hint">En surbrillance : ce que j’utilise au quotidien.</div>`
  },

  /* ───────────── GALERIE · PROJETS ───────────── */
  {
    id: 'projects', name: 'La Galerie', label: 'Réalisations', color: '#ff6f91', icon: 'image', type: 'gallery',
    x: 1200, y: 1150, w: 360, h: 210, top: 26, door: [1380, 1396],
    eyebrow: 'Projets & réalisations', title: 'Ce que j’ai livré, et ce que je construis.',
    html: `
      <div class="cards">
        <div class="card feat"><div class="card-h"><b>Sika App</b><span class="tag live">Mobile</span></div>
          <p>Application mobile de gestion budgétaire, déployée en production sur <b>VPS Linux</b> (Nginx, PM2, HTTPS).</p>
          <ul><li>Mode hors-ligne avec synchronisation</li><li>Authentification JWT</li><li>Abonnements</li></ul>
          <div class="tags"><span class="tag">React Native / Expo</span><span class="tag">Node.js</span><span class="tag">PostgreSQL / Supabase</span></div></div>
        <div class="card"><div class="card-h"><b>Portail web fournisseurs</b><span class="tag">Web</span></div>
          <p>Suivi des comptes, livraisons et règlements, utilisé quotidiennement en production.</p>
          <div class="tags"><span class="tag">Laravel</span><span class="tag">MySQL</span></div></div>
        <div class="card"><div class="card-h"><b>API REST + assistant IA</b><span class="tag">API</span></div>
          <p>Simulateur de paie en langage naturel propulsé par l’API Anthropic Claude, sécurisé par JWT et middleware SQL.</p>
          <div class="tags"><span class="tag">Node.js / Express</span><span class="tag">JWT</span><span class="tag">Claude API</span></div></div>
        <div class="card"><div class="card-h"><b>Audit du système de paie</b><span class="tag">Impact</span></div>
          <p>Deux entités auditées, <b>+140 milliards FCFA</b> de flux analysés, module correctif en service depuis mai 2026.</p></div>
        <div class="card"><div class="card-h"><b>Conseil du Coton et de l’Anacarde</b><span class="tag">Web</span></div>
          <p>Application web conçue pour l’institution.</p></div>
        <div class="card"><div class="card-h"><b>Site e-commerce WordPress</b><span class="tag">Web</span></div>
          <p>Intégration complète des moyens de paiement en ligne.</p></div>
        <div class="card"><div class="card-h"><b>Et aussi…</b></div>
          <p>Applications mobiles de livraison, de gestion de stock et de tâches, jeux mobiles, portefeuille électronique, site de préinscription scolaire, logiciel de gestion de stock.</p></div>
      </div>
      <h4>En construction en ce moment</h4>
      <div class="cards">
        <div class="card feat"><div class="card-h"><b>IRIS</b><span class="tag live">Utilisée au quotidien</span></div>
          <p>Mon assistante IA personnelle sur Mac. Je lui parle : elle comprend, agit à l’écran, gère tâches, mails et agenda, lance mon mode travail de développeur, et retient ce qu’elle apprend dans mon coffre Obsidian.</p>
          <div class="tags"><span class="tag">Mon produit</span><span class="tag">Swift / AppKit</span><span class="tag">React Native</span><span class="tag">Node.js (MCP)</span><span class="tag">Gemini</span><span class="tag">Claude</span><span class="tag">Whisper</span></div></div>
        <div class="card"><div class="card-h"><b>SwipJob</b><span class="tag">En construction</span></div>
          <p>Application mobile de matching d’offres d’emploi pour l’Afrique de l’Ouest, avec un lancement prévu en Côte d’Ivoire.</p>
          <div class="tags"><span class="tag">Mon produit</span><span class="tag">React Native / Expo</span></div></div>
        <div class="card"><div class="card-h"><b>IvoireCar</b><span class="tag">En construction</span></div>
          <p>Application de location de voitures en Côte d’Ivoire : réservation, paiement, notifications SMS / WhatsApp, avec des espaces client, propriétaire et chauffeur.</p>
          <div class="tags"><span class="tag">Pour un client</span><span class="tag">React Native / Expo</span><span class="tag">Laravel</span><span class="tag">PostgreSQL</span></div></div>
        <div class="card"><div class="card-h"><b>Tonty</b><span class="tag">En construction</span></div>
          <p>Tontine digitale : épargne rotative en groupe, cotisations et encaissements par Mobile Money. Interface pensée pour ceux qui lisent peu ou pas : PIN, boutons visuels, langage simple.</p>
          <div class="tags"><span class="tag">Mon produit</span><span class="tag">Mobile Money</span></div></div>
        <div class="card"><div class="card-h"><b>AgriKonnect</b><span class="tag">En construction</span></div>
          <p>Met en relation agriculteurs et acheteurs en Côte d’Ivoire : les producteurs publient produits, photos, prix et stock ; les clients commandent et notent les vendeurs.</p>
          <div class="tags"><span class="tag">Mon produit</span><span class="tag">React Native / Expo</span><span class="tag">Laravel</span></div></div>
        <div class="card"><div class="card-h"><b>e-elips</b><span class="tag">En construction</span></div>
          <p>Services à domicile à Abidjan (plomberie, électricité, ménage, coiffure…) : prestataires classés par distance, demandes à accepter ou refuser, notifications, connexion par téléphone et PIN vérifié par SMS.</p>
          <div class="tags"><span class="tag">Pour un client</span><span class="tag">React Native / Expo</span><span class="tag">Laravel</span></div></div>
        <div class="card"><div class="card-h"><b>HomeFit</b><span class="tag">En construction</span></div>
          <p>Application de sport à domicile : semaine type de 7 jours, 49 exercices avec photos et vidéos, rappels, utilisable hors-ligne.</p>
          <div class="tags"><span class="tag">Mon produit</span><span class="tag">React Native / Expo</span><span class="tag">TypeScript</span></div></div>
      </div>`
  },

  /* ───────────── ACADÉMIE · FORMATION ───────────── */
  {
    id: 'edu', name: 'L’Académie', label: 'Formation', color: '#9be15d', icon: 'book', type: 'school',
    x: 520, y: 980, w: 300, h: 200, top: 70, door: [670, 1216],
    eyebrow: 'Parcours scolaire', title: 'Apprendre, puis construire.',
    html: `
      <div class="tl">
        <div class="tl-item">
          <div class="when">2023 — 2024</div>
          <div class="role">Licence professionnelle en Informatique</div>
          <div class="org">Gecos Formation, Abidjan</div>
        </div>
        <div class="tl-item">
          <div class="when">2020 — 2021</div>
          <div class="role">BTS Informatique — Développement d’Applications <span class="tag">admissible</span></div>
          <div class="org">Gecos Formation, Abidjan</div>
        </div>
        <div class="tl-item">
          <div class="when">2018 — 2019</div>
          <div class="role">Baccalauréat série D</div>
          <div class="org">Lycée Moderne d’Akoupé</div>
        </div>
      </div>
      <h4>Langues</h4>
      <div class="langs">
        <div><b>Français</b><span class="dots d5"><i></i><i></i><i></i><i></i><i></i></span><em>langue maternelle</em></div>
        <div><b>Anglais</b><span class="dots d3"><i></i><i></i><i></i><i></i><i></i></span><em>lu, écrit</em></div>
        <div><b>Espagnol</b><span class="dots d1"><i></i><i></i><i></i><i></i><i></i></span><em>notions</em></div>
        <div><b>Japonais</b><span class="dots d1"><i></i><i></i><i></i><i></i><i></i></span><em>notions</em></div>
      </div>`
  },

  /* ───────────── TERRAIN · CENTRES D'INTÉRÊT ───────────── */
  {
    id: 'interests', name: 'Le Terrain', label: 'Hors écran', color: '#ff9a4d', icon: 'activity', type: 'court',
    x: 1900, y: 1230, w: 480, h: 300, top: 0, door: [2140, 1380], radius: 120,
    eyebrow: 'Centres d’intérêt', title: 'Quand l’écran s’éteint.',
    html: `
      <div class="cards two">
        <div class="card"><div class="card-h"><b>Basket-ball</b></div><p>Le jeu collectif, la lecture du terrain.</p></div>
        <div class="card"><div class="card-h"><b>Football</b></div><p>Le sport d’équipe par excellence.</p></div>
        <div class="card"><div class="card-h"><b>Volley-ball</b></div><p>Coordination et esprit d’équipe.</p></div>
        <div class="card"><div class="card-h"><b>Musique</b></div><p>Le bon rythme pour coder.</p></div>
      </div>
      <div class="hint">Astuce : pousse le ballon sur le terrain en marchant dessus.</div>`
  },

  /* ───────────── POSTE · CONTACT ───────────── */
  {
    id: 'contact', name: 'La Poste', label: 'Contact', color: '#4fd8ff', icon: 'mail', type: 'post',
    x: 820, y: 700, w: 170, h: 130, top: 30, door: [905, 866],
    eyebrow: 'Contact', title: 'Parlons de votre projet.',
    html: `
      <p class="lead">Une mission, un poste, une idée à concrétiser ? Écrivez-moi : je réponds directement.</p>
      <div class="btns">
        <a class="btn primary" href="mailto:${EMAIL}">${icon('mail', 18)} Écrire un e-mail</a>
        <a class="btn wa" href="https://wa.me/${PHONE_RAW}" target="_blank" rel="noopener">${icon('chat', 18)} WhatsApp</a>
        <a class="btn" href="tel:+${PHONE_RAW}">${icon('phone', 18)} Appeler</a>
        <a class="btn" href="${CV_FILE}" download>${icon('download', 18)} Télécharger mon CV</a>
      </div>
      <ul class="contact-list">
        <li>${icon('mail', 18)} <a href="mailto:${EMAIL}">${EMAIL}</a></li>
        <li>${icon('phone', 18)} <a href="tel:+${PHONE_RAW}">${PHONE}</a></li>
        <li>${icon('pin', 18)} Yopougon, Abidjan — Côte d’Ivoire</li>
      </ul>`
  }
];

window.ZONES = ZONES;
window.icon = icon;
window.CV_FILE = CV_FILE;
