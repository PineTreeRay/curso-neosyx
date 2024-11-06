const { env } = require("process");

module.exports = {
  apps: [{
    name: 'neosyx-frontend',
    script: 'frontend/.next/standalone/server.js',
    watch: '.',
  },
  {
    name: 'neosyx-backend',
    script: 'backend/dist/server.js',
    watch: ['backend/dist/server.js'],
    env: {
      "APP_PORT": 8888,
      "DB_HOST": 'localhost',
      "DB_NAME": 'neosyx',
      "DB_USER": 'sa',
      "DB_PASSWORD": "yourStrong($)Password",
      "JWT_SECRET": 'quebonitasuaroupa',
    }
  }],
};
