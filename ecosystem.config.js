module.exports = {
  apps: [{
    name: 'zectracker',
    script: 'src/app.js',
    cwd: './',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    }
  }]
};

