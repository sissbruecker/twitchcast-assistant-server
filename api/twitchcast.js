const request = require('request');
const _ = require('lodash');

function play(channelId) {

    const playUrl = serverUrl() + `/stream/channel/${channelId}`;

    request.post(playUrl, _.noop);
}

function playLatestVideo(channelId) {

    const playUrl = serverUrl() + `/stream/channel/${channelId}/latestVideo`;

    request.post(playUrl, _.noop);
}

function seekTo(minutes) {

    const playUrl = serverUrl() + `/stream/seek/${minutes}`;

    request.post(playUrl, _.noop);
}

function stop() {

    const stopUrl = serverUrl() + '/stream/stop';

    request.post(stopUrl, _.noop);
}

function browse(browserData) {

    const options = {
        url: serverUrl() + '/browse',
        method: 'POST',
        json: browserData
    };

    request.post(options, _.noop);
}

function serverUrl() {
    return process.env.TWITCHCAST_SERVER_URL;
}

module.exports = {
    play,
    playLatestVideo,
    seekTo,
    stop,
    browse
};
