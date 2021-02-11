module.exports = {
    apps : [{
    name: 'server',
    script: 'index.js',
    instances: 1,
    autorestart: true,
    watch: true,
    max_memory_restart: '1G',
    env: {
    "PORT": 3000,
    "NODE_ENV": 'development'
    },
    env_production: {
    "PORT": 2000,
    "NODE_ENV": 'production'
    },
    log_date_format: 'YYYY-MM-DD HH:mm:ss.SSS',
    error_file: '/var/log/server.log',
    out_file: '/var/log/server.log'
    }]
   };