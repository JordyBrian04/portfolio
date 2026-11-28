#!/usr/bin/env bash
# Déploiement du portfolio sur le VPS, à lancer depuis le Mac, à la racine du projet.
#
#   bash ops/deploy.sh setup   première installation : Nginx, HTTPS, API (une seule fois)
#   bash ops/deploy.sh         mise à jour du site et de l'API (à chaque modification)
#   bash ops/deploy.sh check   vérifie le DNS, le HTTPS et l'API
set -euo pipefail
cd "$(dirname "$0")/.."

say()  { printf '\n\033[1;34m▶ %s\033[0m\n' "$*"; }
ok()   { printf '  \033[32m✓\033[0m %s\n' "$*"; }
warn() { printf '  \033[33m!\033[0m %s\n' "$*"; }
die()  { printf '\n\033[1;31m✗ %s\033[0m\n' "$*" >&2; exit 1; }

[ -f ops/config.sh ] || die "ops/config.sh manquant. Lance : cp ops/config.example.sh ops/config.sh, puis remplis-le."
# shellcheck source=/dev/null
source ops/config.sh
if grep -Eq 'mon-domaine\.com|203\.0\.113\.10|exemple\.com' ops/config.sh; then die "ops/config.sh contient encore des valeurs d'exemple : remplace-les."; fi
command -v rsync >/dev/null || die "rsync manquant sur le Mac."

TARGET="$VPS_USER@$VPS_HOST"
SSH_OPTS=(-p "$SSH_PORT" -o ConnectTimeout=15)
RSYNC_SSH="ssh -p $SSH_PORT -o ConnectTimeout=15"
CMD="${1:-deploy}"

remote() { ssh "${SSH_OPTS[@]}" "$TARGET" "$@"; }

push() {
  say "Envoi des fichiers vers $TARGET:$REMOTE_DIR"
  remote "mkdir -p '$REMOTE_DIR/site' '$REMOTE_DIR/api' '$REMOTE_DIR/ops/nginx'"
  rsync -az --delete -e "$RSYNC_SSH" --exclude '.DS_Store' --exclude 'CONTRAT.md' \
    index.html site.html css js assets "$TARGET:$REMOTE_DIR/site/"
  rsync -az -e "$RSYNC_SSH" server/server.mjs "$TARGET:$REMOTE_DIR/api/"
  rsync -az -e "$RSYNC_SSH" ops/ecosystem.config.cjs ops/remote-setup.sh "$TARGET:$REMOTE_DIR/ops/"
  rsync -az -e "$RSYNC_SSH" ops/nginx/portfolio.conf.template "$TARGET:$REMOTE_DIR/ops/nginx/"
  remote "chmod -R o+rX '$REMOTE_DIR/site'"
  ok "fichiers à jour"
}

check() {
  say "Vérifications pour $DOMAIN"
  if command -v dig >/dev/null; then
    for host in "$DOMAIN" $([ "$WITH_WWW" = "1" ] && echo "www.$DOMAIN"); do
      ip="$(dig +short "$host" A | tail -n1)"
      if [ "$ip" = "$VPS_HOST" ]; then ok "DNS : $host → $ip"; else warn "DNS : $host → « ${ip:-rien} » (attendu : $VPS_HOST). Vérifie l'enregistrement chez ton registrar ou attends la propagation."; fi
    done
  fi
  code="$(curl -s -o /dev/null -w '%{http_code}' --max-time 15 "https://$DOMAIN/" || true)"
  if [ "$code" = "200" ]; then ok "HTTPS : https://$DOMAIN répond (200)"; else warn "HTTPS : https://$DOMAIN répond « ${code:-rien} »"; fi
  if curl -fsS --max-time 15 "https://$DOMAIN/api/health" >/dev/null 2>&1; then ok "API : /api/health répond"; else warn "API : /api/health ne répond pas (sur le VPS : pm2 logs portfolio-api)"; fi
  visits="$(curl -fsS --max-time 15 "https://$DOMAIN/api/visits" 2>/dev/null || true)"
  [ -n "$visits" ] && ok "Compteur : $visits"
}

case "$CMD" in
  setup)
    say "Préparation du VPS (le mot de passe sudo peut être demandé)"
    ssh -t "${SSH_OPTS[@]}" "$TARGET" "command -v rsync >/dev/null || sudo apt-get install -y rsync; sudo mkdir -p '$REMOTE_DIR' && sudo chown '$VPS_USER':'$VPS_USER' '$REMOTE_DIR'"
    push
    ssh -t "${SSH_OPTS[@]}" "$TARGET" "sudo DOMAIN='$DOMAIN' EMAIL='$EMAIL' REMOTE_DIR='$REMOTE_DIR' API_PORT='$API_PORT' WITH_WWW='$WITH_WWW' bash '$REMOTE_DIR/ops/remote-setup.sh'"
    check
    ;;
  deploy)
    push
    say "Redémarrage de l'API"
    remote "bash -lc \"cd '$REMOTE_DIR' && API_PORT='$API_PORT' pm2 startOrReload ops/ecosystem.config.cjs --update-env && pm2 save\"" >/dev/null
    ok "API relancée"
    check
    ;;
  check) check ;;
  *) die "Commande inconnue : $CMD (setup, check, ou rien pour mettre à jour)" ;;
esac
