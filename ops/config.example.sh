# Configuration du déploiement du portfolio.
# 1. Copie ce fichier :  cp ops/config.example.sh ops/config.sh
# 2. Remplace les valeurs d'exemple ci-dessous par les tiennes.
# ops/config.sh est ignoré par git : il ne part jamais sur GitHub.

DOMAIN="mon-domaine.com"          # ton nom de domaine, sans « www » ni « https:// »
WITH_WWW=1                        # 1 = www.mon-domaine.com fonctionne aussi (redirige vers la version sans www) ; 0 = non
EMAIL="ton-email@exemple.com"     # e-mail pour Let's Encrypt (alertes avant expiration du certificat)

VPS_HOST="203.0.113.10"           # adresse IP publique du VPS
VPS_USER="ubuntu"                 # utilisateur SSH du VPS (doit pouvoir utiliser sudo)
SSH_PORT=22                       # port SSH (22 par défaut)

REMOTE_DIR="/var/www/portfolio"   # dossier du portfolio sur le VPS
API_PORT=3007                     # port interne de l'API (doit être libre sur le VPS)
