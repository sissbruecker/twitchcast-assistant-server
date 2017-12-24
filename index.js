const server = require('./server');

// Init and log config
const config = require('dotenv').config().parsed;

console.log('Twitchcast Gateway configuration:');
Object.keys(config).forEach(key => {
    console.log(`\t${key}: ${config[key]}`);
});

// Start server
server.start(process.env.TWITCHCAST_GATEWAY_PORT);

console.log('TwitchCast Gateway started');
