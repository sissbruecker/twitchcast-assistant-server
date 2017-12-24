const request = require('request');
const _ = require('lodash');

function play(channelId) {

    const playUrl = serverUrl() + `/stream/play/${channelId}`;

    request.post(playUrl, _.noop);
}

function stop() {

    const stopUrl = serverUrl() + '/stream/stop';

    request.post(stopUrl, _.noop);
}

function serverUrl() {
    return process.env.TWITCHCAST_SERVER_URL;
}

module.exports = {
    play,
    stop
};
