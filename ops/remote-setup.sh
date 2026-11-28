#!/usr/bin/env bash
# Installation du portfolio sur le VPS (Ubuntu ou Debian).
# Ne se lance pas à la main : « bash ops/deploy.sh setup » l'envoie et l'exécute avec sudo.
# Ce script n'ajoute qu'un fichier Nginx dédié au portfolio : les autres sites du VPS ne sont pas touchés.
set -euo pipefail
: "${DOMAIN:?DOMAIN manquant}" "${EMAIL:?EMAIL manquant}" "${REMOTE_DIR:?REMOTE_DIR manquant}" "${API_PORT:?API_PORT manquant}"
WITH_WWW="${WITH_WWW:-1}"
RUN_USER="${SUDO_USER:-root}"
RUN_HOME="$(getent passwd "$RUN_USER" | cut -d: -f6)"

say()  { printf '\n\033[1;34m▶ %s\033[0m\n' "$*"; }
ok()   { printf '  \033[32m✓\033[0m %s\n' "$*"; }
die()  { printf '\n\033[1;31m✗ %s\033[0m\n' "$*" >&2; exit 1; }
as_user() { sudo -u "$RUN_USER" -H bash -lc "$*"; }

[ "$(id -u)" -eq 0 ] || die "Ce script doit être lancé avec sudo."
command -v apt-get >/dev/null || die "Ce script attend Ubuntu ou Debian (apt-get introuvable)."

say "1/7 Nginx et Certbot"
NEED=()
command -v nginx >/dev/null || NEED+=(nginx)
command -v certbot >/dev/null || NEED+=(certbot)
dpkg -s python3-certbot-nginx >/dev/null 2>&1 || NEED+=(python3-certbot-nginx)
if [ "${#NEED[@]}" -gt 0 ]; then
  apt-get update -y
  DEBIAN_FRONTEND=noninteractive apt-get install -y "${NEED[@]}"
fi
systemctl enable --now nginx >/dev/null 2>&1 || true
ok "Nginx et Certbot présents"

say "2/7 Node.js et PM2 (utilisateur $RUN_USER)"
as_user 'command -v node' >/dev/null || die "Node.js est absent pour $RUN_USER. Installe Node 20 LTS (https://nodejs.org/fr/download, onglet « Package manager »), puis relance « bash ops/deploy.sh setup »."
NODE_MAJOR="$(as_user 'node -p "process.versions.node.split(\".\")[0]"')"
[ "$NODE_MAJOR" -ge 18 ] || die "Node $NODE_MAJOR est trop ancien : il faut Node 18 ou plus."
if ! as_user 'command -v pm2' >/dev/null; then
  if as_user 'npm config get prefix' | grep -q "^$RUN_HOME"; then as_user 'npm install -g pm2'; else npm install -g pm2; fi
fi
ok "Node $(as_user 'node -v'), PM2 $(as_user 'pm2 -v')"

say "3/7 Dossiers et droits"
mkdir -p "$REMOTE_DIR/site" "$REMOTE_DIR/api" "$REMOTE_DIR/data" "$REMOTE_DIR/ops/nginx"
chown -R "$RUN_USER":"$RUN_USER" "$REMOTE_DIR"
chmod 755 "$REMOTE_DIR"
chmod -R o+rX "$REMOTE_DIR/site"
chmod 700 "$REMOTE_DIR/data"
ok "$REMOTE_DIR prêt (site lisible par Nginx, données privées)"

say "4/7 Port interne de l'API ($API_PORT)"
if ss -ltn 2>/dev/null | grep -q ":$API_PORT\b"; then
  if as_user 'pm2 jlist 2>/dev/null' | grep -q '"name":"portfolio-api"'; then ok "déjà utilisé par portfolio-api (mise à jour)";
  else die "Le port $API_PORT est déjà pris par une autre application. Mets un autre API_PORT dans ops/config.sh (par ex. 3017), puis relance."; fi
else ok "port libre"; fi

say "5/7 Configuration Nginx"
SERVER_NAMES="$DOMAIN"; [ "$WITH_WWW" = "1" ] && SERVER_NAMES="$DOMAIN www.$DOMAIN"
if [ -d /etc/nginx/sites-available ]; then
  CONF="/etc/nginx/sites-available/portfolio-$DOMAIN.conf"; LINK="/etc/nginx/sites-enabled/portfolio-$DOMAIN.conf"
else
  CONF="/etc/nginx/conf.d/portfolio-$DOMAIN.conf"; LINK=""
fi
if [ -f "$CONF" ] && grep -q "managed by Certbot" "$CONF" && [ "${FORCE_NGINX:-0}" != "1" ]; then
  ok "configuration existante avec HTTPS conservée ($CONF)"
else
  [ -f "$CONF" ] && cp "$CONF" "$CONF.bak.$(date +%Y%m%d%H%M%S)"
  sed -e "s#__SERVER_NAMES__#$SERVER_NAMES#" -e "s#__REMOTE_DIR__#$REMOTE_DIR#" -e "s#__API_PORT__#$API_PORT#" \
    "$REMOTE_DIR/ops/nginx/portfolio.conf.template" > "$CONF"
  [ -n "$LINK" ] && ln -sf "$CONF" "$LINK"
  ok "écrit : $CONF"
fi
if ! nginx -t; then
  mv "$CONF" "$CONF.invalide"
  [ -n "$LINK" ] && [ -L "$LINK" ] && unlink "$LINK"
  die "Nginx refuse la configuration : elle a été mise de côté ($CONF.invalide). Les autres sites continuent de tourner. Envoie-moi le message ci-dessus."
fi
systemctl reload nginx
ok "Nginx rechargé"
if command -v ufw >/dev/null && ufw status | grep -q "Status: active"; then
  ufw allow 'Nginx Full' >/dev/null && ok "pare-feu : ports 80 et 443 ouverts"
fi

say "6/7 API du portfolio (PM2)"
as_user "cd '$REMOTE_DIR' && API_PORT='$API_PORT' pm2 startOrReload ops/ecosystem.config.cjs --update-env && pm2 save"
if [ "$RUN_USER" = "root" ]; then
  pm2 startup systemd >/dev/null 2>&1 || true
else
  STARTUP="$(as_user "pm2 startup systemd -u $RUN_USER --hp $RUN_HOME" 2>/dev/null | grep -E '^sudo ' | sed 's/^sudo //' || true)"
  [ -n "$STARTUP" ] && eval "$STARTUP" >/dev/null
fi
sleep 1
curl -fsS "http://127.0.0.1:$API_PORT/api/health" >/dev/null || die "L'API ne répond pas. Regarde les journaux : pm2 logs portfolio-api"
ok "API en ligne, relancée automatiquement au redémarrage du VPS"

say "7/7 Certificat HTTPS (Let's Encrypt)"
CERT_ARGS=(-d "$DOMAIN"); [ "$WITH_WWW" = "1" ] && CERT_ARGS+=(-d "www.$DOMAIN")
if certbot --nginx "${CERT_ARGS[@]}" --redirect --agree-tos -m "$EMAIL" -n --keep-until-expiring; then
  ok "HTTPS actif, renouvellement automatique par Certbot"
else
  die "Certbot a échoué. Le plus souvent, le nom de domaine ne pointe pas encore vers ce VPS, ou le port 80 est fermé chez l'hébergeur. Lance « bash ops/deploy.sh check » depuis ton Mac, attends que le DNS soit bon, puis relance « bash ops/deploy.sh setup »."
fi

printf '\n\033[1;32m✓ Portfolio installé : https://%s\033[0m\n' "$DOMAIN"
