# Mettre le portfolio en ligne sur ton VPS, avec ton nom de domaine

Ce guide installe le portfolio sur ton VPS, avec ton nom de domaine, en HTTPS. Il active aussi le compteur de visites et le Top 10 du lancer de paniers.
Tout passe par une seule commande depuis ton Mac : `bash ops/deploy.sh`.

```
Navigateur ──https──▶ Nginx (VPS) ──▶ fichiers du site         /var/www/portfolio/site
                                  └─▶ /api/ ──▶ API Node (PM2)  /var/www/portfolio/api  → données /var/www/portfolio/data
```

Le script ajoute **un seul fichier Nginx**, réservé au portfolio. Les autres sites du VPS (par exemple l'API de Sika) ne sont pas touchés. Nginx vérifie toujours la configuration avant de la recharger.

---

## Avant de commencer

- Un VPS **Ubuntu ou Debian** auquel tu te connectes en SSH, avec un utilisateur qui peut utiliser `sudo`.
- **Node.js 18 ou plus** sur le VPS (`node -v`). Si l'API de Sika tourne déjà sur ce VPS avec PM2, c'est bon.
- Les **ports 80 et 443 ouverts** chez ton hébergeur. Chez Contabo, ils le sont par défaut. Le script ouvre aussi le pare-feu `ufw` s'il est actif.
- L'**adresse IP publique** du VPS.

---

## Étape 1 · Acheter le nom de domaine

1. Choisis ton nom, par exemple `jordybrian.com` ou `jordybrian.dev`. Vérifie qu'il est libre chez un registrar (Namecheap, OVH, Hostinger, Cloudflare…). Pour un `.ci`, passe par un registrar agréé par NIC.CI.
2. Achète-le, **sans** hébergement ni e-mail en option : ton VPS suffit.

## Étape 2 · Faire pointer le domaine vers le VPS (DNS)

Dans l'espace « DNS » ou « Zone DNS » du registrar :

| Type | Nom (hôte) | Valeur | TTL |
|---|---|---|---|
| A | `@` | IP de ton VPS | 300 (ou le minimum proposé) |
| CNAME | `www` | `ton-domaine.com.` | 300 |

- **Supprime** les enregistrements `A` ou `AAAA` déjà présents sur `@` et `www` : ce sont souvent des pages de parking du registrar.
- N'ajoute un `AAAA` (IPv6) que si ton VPS a une IPv6 configurée. Sinon, Let's Encrypt peut échouer.
- Vérifie depuis ton Mac. Ça prend de quelques minutes à quelques heures :

```bash
dig +short ton-domaine.com
```

Résultat attendu : **l'IP de ton VPS**. Tant que ce n'est pas le cas, n'enchaîne pas sur l'étape 5.

## Étape 3 · Vérifier l'accès SSH depuis le Mac

```bash
ssh ubuntu@IP_DU_VPS
```

Remplace `ubuntu` par ton utilisateur. Si tu tapes un mot de passe à chaque fois, installe une clé une fois pour toutes :

```bash
ssh-copy-id ubuntu@IP_DU_VPS
```

## Étape 4 · Remplir la configuration

```bash
cp ops/config.example.sh ops/config.sh
```

Ouvre `ops/config.sh` et remplis :

- `DOMAIN` : ton domaine, sans `www`.
- `EMAIL` : l'adresse qui recevra les alertes Let's Encrypt.
- `VPS_HOST` : l'IP du VPS.
- `VPS_USER` : ton utilisateur SSH.
- `SSH_PORT` : à changer seulement si tu n'utilises pas 22.

Ce fichier ne part jamais sur GitHub : il est dans `.gitignore`.

## Étape 5 · Première installation (une seule fois)

Depuis le dossier du portfolio, sur le Mac :

```bash
bash ops/deploy.sh setup
```

Le mot de passe `sudo` du VPS peut t'être demandé. Le script affiche chaque étape avec ✓ :

1. Il installe Nginx et Certbot s'ils manquent.
2. Il vérifie Node et installe PM2 s'il manque.
3. Il crée `/var/www/portfolio` (site, api, data).
4. Il vérifie que le port interne de l'API est libre.
5. Il écrit `/etc/nginx/sites-available/portfolio-TON-DOMAINE.conf`, teste Nginx, puis le recharge.
6. Il démarre l'API avec PM2 et la relance automatiquement au redémarrage du VPS.
7. Il installe le certificat HTTPS Let's Encrypt, avec un renouvellement automatique.

À la fin, il lance les vérifications : DNS, HTTPS et API.

## Étape 6 · Contrôler

Ouvre `https://ton-domaine.com` :

- La carte s'affiche, et le compteur 👁 apparaît en haut à droite.
- Le Musée s'ouvre et les démos fonctionnent.
- `https://ton-domaine.com/site.html` affiche la partie site, avec les visites en bas de page.
- Au Terrain, une partie du lancer de paniers s'enregistre dans le Top 10 « mondial ».

Vérification rapide depuis le Mac :

```bash
bash ops/deploy.sh check
```

## Étape 7 · Mettre à jour le site plus tard

Après chaque modification :

```bash
bash ops/deploy.sh
```

Le script envoie les fichiers, relance l'API et vérifie. Le compteur et le Top 10 sont gardés : ils sont dans `/var/www/portfolio/data`, que la mise à jour ne touche jamais.

---

## Après la mise en ligne

- **Liens à mettre à jour** : `brag-output/share-copy.txt` et la fin des vidéos affichent encore `jordybrian.netlify.app`. Je peux les refaire avec ton domaine.
- **Netlify** : garde-le comme copie de secours, ou supprime-le pour éviter deux adresses. Sur Netlify, le compteur reste masqué : il n'y a pas d'API.
- **Voir les statistiques** :

```bash
curl https://ton-domaine.com/api/visits
```

  Tu obtiens `total` (les visites), `visitors` (les visiteurs uniques), `today` (les visites du jour) et `visitorsToday` (les visiteurs uniques du jour).
- **Sauvegarder les données** :

```bash
scp ubuntu@IP_DU_VPS:/var/www/portfolio/data/*.json ~/Sauvegardes/portfolio/
```

- **Vie privée** : aucune adresse IP n'est stockée. Chaque visiteur est représenté par une empreinte chiffrée, avec un sel secret propre au serveur. Les robots, et `curl`, ne sont pas comptés. Un même appareil n'est compté qu'une fois toutes les 30 minutes.

## Dépannage

| Symptôme | Cause probable | Solution |
|---|---|---|
| `dig` ne renvoie pas l'IP du VPS | DNS pas encore propagé, ou ancien enregistrement A resté chez le registrar | Corrige la zone DNS, attends, revérifie |
| Certbot échoue à l'étape 7 | DNS pas prêt, ou port 80 fermé chez l'hébergeur | Attends le bon DNS, ouvre le port 80, relance `bash ops/deploy.sh setup` |
| « Le port 3007 est déjà pris » | Une autre app utilise ce port | Mets `API_PORT=3017` dans `ops/config.sh`, relance `setup` |
| « Node.js est absent » | Node pas installé pour cet utilisateur | Installe Node 20 LTS, relance `setup` |
| La page s'affiche, mais pas le compteur ni le Top 10 | L'API est arrêtée | Sur le VPS : `pm2 logs portfolio-api`, puis `pm2 restart portfolio-api` |
| Erreur 502 sur `/api/…` | Même cause | Même solution |
| « Nginx refuse la configuration » | Conflit avec un autre fichier Nginx | Rien n'est cassé : la config est mise de côté en `.invalide`. Envoie-moi le message affiché |
| `Permission denied (publickey)` | Clé SSH absente | Étape 3 : `ssh-copy-id` |

## Fichiers de déploiement

| Fichier | Rôle |
|---|---|
| `ops/config.example.sh` | Modèle de configuration (à copier en `ops/config.sh`) |
| `ops/deploy.sh` | Commande unique depuis le Mac : `setup`, mise à jour, `check` |
| `ops/remote-setup.sh` | Installation sur le VPS (lancée par `deploy.sh setup`) |
| `ops/nginx/portfolio.conf.template` | Configuration Nginx du site et du proxy `/api/` |
| `ops/ecosystem.config.cjs` | Configuration PM2 de l'API |
| `server/server.mjs` | API Node sans dépendance : `/api/visits`, `/api/scores`, `/api/health` |
| `js/visits.js` | Compteur affiché sur la carte et la partie site |

### Tester en local avant d'envoyer

```bash
PORT=3017 STATIC_DIR=. node server/server.mjs
```

Puis ouvre http://localhost:3017. Le compteur et le Top 10 fonctionnent comme en ligne.
