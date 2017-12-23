const server = require('./src/server');

const port = process.env.TWITCHCAST_ASSISTANT_SERVER_PORT || 3010;

server.start(port);

console.log(`Twitchcast assistant server running on port: ${port}`);

