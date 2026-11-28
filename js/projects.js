/* Projets présentés dans le musée et sur la partie site. Données publiques uniquement. */
window.PROJECTS = [
  {
    id: 'sika', name: 'Sika App', status: 'done', owner: 'Mon produit', kind: 'Finance personnelle · mobile',
    color: '#265ed7', logo: 'assets/musee/sika.png', frame: 'phone',
    pitch: 'Le budget en FCFA, même sans connexion, transformé en jeu.',
    forWho: 'Pour celles et ceux qui veulent enfin tenir leur budget, en Côte d’Ivoire et en Afrique de l’Ouest.',
    unique: ['Fonctionne sans connexion, montants en FCFA, paiement de l’offre Pro par Wave.', 'Le budget devient un jeu : niveaux, badges, séries et missions de la semaine.', 'La clôture du mois compare l’argent réellement en poche au solde calculé.'],
    stack: ['React Native (Expo)', 'TypeScript', 'SQLite', 'Node.js / Express', 'Supabase', 'VPS Linux · Nginx · PM2'],
    link: 'https://api.sika-app.org/', linkLabel: 'Découvrir Sika App'
  },
  {
    id: 'iris', name: 'IRIS', status: 'daily', owner: 'Mon produit', kind: 'Assistante IA · Mac',
    color: '#40E0FF', logoText: 'IRIS', frame: 'mac',
    pitch: 'Mon assistante IA personnelle : elle a un visage, elle écoute et elle agit sur mon Mac.',
    forWho: 'Pour moi, au quotidien : elle pilote mes journées de développeur à la voix.',
    unique: ['Un visage plutôt qu’une fenêtre de chat : ses yeux suivent la souris, clignent, s’endorment.', 'Elle agit pour de vrai : tâches, rappels, Pomodoro, agenda, lancement de mes projets, toujours avec confirmation.', 'Sa mémoire reste chez moi, et une app téléphone la pilote à distance.'],
    stack: ['Swift · AppKit', 'Gemini', 'Claude + serveur MCP Node.js', 'Whisper en local', 'React Native (Expo)']
  },
  {
    id: 'swipjob', name: 'SwipJob', status: 'wip', owner: 'Mon produit', kind: 'Emploi · mobile',
    color: '#004ac6', logo: 'assets/musee/swipjob.png', frame: 'phone',
    pitch: 'Chercher un emploi comme on swipe : à droite, SwipJob postule pour toi.',
    forWho: 'Pour les candidats d’Afrique de l’Ouest, en commençant par la Côte d’Ivoire.',
    unique: ['Un swipe à droite suffit pour postuler.', 'L’IA lit le CV, calcule un score de compatibilité et aide à rédiger la lettre.', 'Pensée pour la région : villes ivoiriennes, salaires en FCFA, Mobile Money.'],
    stack: ['React Native (Expo)', 'Laravel', 'Python · FastAPI (IA)', 'Mobile Money']
  },
  {
    id: 'ivoirecar', name: 'IvoireCar', status: 'wip', owner: 'Pour un client', kind: 'Transport · mobile',
    color: '#0F6B4C', logoText: 'IvoireCar', frame: 'phone',
    pitch: 'Réserver un car avec chauffeur entre deux villes, au juste prix, affiché tout de suite.',
    forWho: 'Pour les groupes qui voyagent en Côte d’Ivoire : mariages, funérailles, séminaires, sorties scolaires.',
    unique: ['Le prix du trajet s’affiche tout de suite, TVA comprise.', 'On ne paie par Mobile Money qu’après l’accord d’un propriétaire de car.', 'Cars et chauffeurs vérifiés, espaces client, propriétaire et chauffeur.'],
    stack: ['React Native (Expo)', 'TypeScript', 'Laravel', 'PostgreSQL (Supabase)', 'Paiement mobile']
  },
  {
    id: 'eelips', name: 'e-elips', status: 'wip', owner: 'Pour un client', kind: 'Services à domicile · mobile',
    color: '#F97316', logoText: 'ELIPS', frame: 'phone',
    pitch: 'Trouver le plombier, l’électricien ou la coiffeuse le plus proche, à Abidjan.',
    forWho: 'Pour les habitants d’Abidjan et pour les artisans qui cherchent des clients.',
    unique: ['Les prestataires les plus proches apparaissent en premier, avec la distance.', 'Une demande en deux taps ; le prestataire accepte ou refuse.', 'Connexion par téléphone et code PIN, note après la prestation.'],
    stack: ['React Native (Expo)', 'TypeScript', 'React Query', 'Laravel · Sanctum']
  },
  {
    id: 'ebonus', name: 'eBonus', status: 'wip', owner: 'Conseil technique (client)', kind: 'Fidélité · mobile',
    color: '#009689', logo: 'assets/musee/ebonus.png', frame: 'phone',
    pitch: 'Chaque achat chez un partenaire rapporte des eBonus, transformables en bons de réduction.',
    forWho: 'Pour les clients des stations-service, supermarchés et restaurants partenaires.',
    unique: ['Des eBonus gagnés à chaque achat, visibles tout de suite.', 'Les points deviennent des bons de réduction.', 'Chaque transaction est validée sur place par QR code ou code PIN.'],
    stack: ['React Native (Expo)', 'Laravel', 'Temps réel (WebSocket)', 'QR code']
  },
  {
    id: 'homefit', name: 'HomeFit', status: 'wip', owner: 'Mon produit', kind: 'Sport · mobile',
    color: '#2f95dc', logo: 'assets/musee/homefit.png', frame: 'phone',
    pitch: 'Un coach de sport à la maison, avec seulement trois accessoires.',
    forWho: 'Pour s’entraîner chez soi sans salle de sport.',
    unique: ['Un programme complet avec haltères, planche à pompes et ressort.', 'Il s’adapte au niveau et propose une remise à niveau après une pause.', 'Séance guidée : vidéos, séries et minuteurs de repos automatiques.'],
    stack: ['React Native (Expo)', 'TypeScript', 'Stockage local', 'Notifications']
  },
  {
    id: 'tonty', name: 'Tonty', status: 'wip', owner: 'Mon produit', kind: 'Épargne collective · mobile',
    color: '#ff6200', logo: 'assets/musee/tonty.png', frame: 'phone',
    pitch: 'La tontine de quartier dans le téléphone : chacun donne sa part par Mobile Money, et à son tour chacun reçoit tout le pot.',
    forWho: 'Pour les Ivoiriens qui épargnent en groupe (commerçants, artisans, collègues), y compris ceux qui lisent peu.',
    unique: ['Un langage très simple et visuel (« Donner ma part », « Recevoir mon pot »), un code PIN ou l’empreinte, et des salutations en plusieurs langues de Côte d’Ivoire.', 'L’ordre et les dates de passage de chaque membre sont calculés dès la création : chaque jour, chaque semaine ou chaque mois.', 'De l’argent réel par Mobile Money (Orange Money, Wave, MTN, Moov), frais affichés avant de payer et de recevoir.'],
    stack: ['React Native (Expo)', 'TypeScript', 'Node.js · Express', 'PostgreSQL · Drizzle', 'JWT', 'Mobile Money']
  },
  {
    id: 'agrikonnect', name: 'AgriKonnect', status: 'wip', owner: 'Mon produit', kind: 'Agriculture · mobile',
    color: '#2D6A4F', logo: 'assets/musee/agrikonnect.png', frame: 'phone',
    pitch: 'Le marché frais dans la poche : les planteurs ivoiriens vendent leurs récoltes directement aux acheteurs, sans intermédiaire.',
    forWho: 'Pour les agriculteurs de Côte d’Ivoire qui veulent vendre au juste prix, et pour les ménages et commerçants qui achètent à la source.',
    unique: ['Deux applications en une : l’agriculteur gère ses produits et ses commandes, l’acheteur parcourt les catégories et ses favoris.', 'Elle parle quatre langues : français, baoulé, dioula et koulango, avec une narration vocale.', 'Une commande suivie de bout en bout : notification au producteur, « En attente », « En cours », puis « Livrée ».'],
    stack: ['React Native (Expo)', 'TypeScript', 'Laravel 12', 'Temps réel (Reverb)', 'Connexion OTP · PIN']
  }
];
window.PROJECT_STATUS = { done: 'Terminé · en ligne', daily: 'Utilisée au quotidien', wip: 'En construction' };
