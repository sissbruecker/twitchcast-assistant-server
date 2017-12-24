const twitchcastServerUrl = process.env.TWITCHCAST_SERVER_URL || 'http://localhost:3000';

module.exports = {
    twitchcastServer: {
        url: twitchcastServerUrl
    }
};
