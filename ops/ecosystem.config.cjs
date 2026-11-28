// Configuration PM2 de l'API du portfolio (compteur de visites + Top 10 du lancer de paniers).
// Sur le VPS, ce fichier est dans <REMOTE_DIR>/ops/ ; le code est dans <REMOTE_DIR>/api/ et les données dans <REMOTE_DIR>/data/.
const path = require('path');
const root = path.resolve(__dirname, '..');

module.exports = {
  apps: [{
    name: 'portfolio-api',
    script: path.join(root, 'api', 'server.mjs'),
    cwd: root,
    instances: 1,
    exec_mode: 'fork',
    max_memory_restart: '150M',
    env: {
      NODE_ENV: 'production',
      PORT: process.env.API_PORT || '3007',
      DATA_DIR: path.join(root, 'data')
    }
  }]
};
