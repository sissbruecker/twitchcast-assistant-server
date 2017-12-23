const express = require('express');
const http = require('http');
const request = require('request');
const ChannelRecognizer = require('./ChannelRecognizer');
const config = require('../config');

const app = express();
const recognizer = ChannelRecognizer(config.mappings);

let server;

app.post('/stream/play/:input', (req, res) => {

    const input = req.params.input;

    const channel = recognizer.recognize(input);

    const playUrl = config.twitchcastServer.url + `/stream/play/${channel}`;

    request.post(playUrl);

    res.status(200);
    res.json({
        message: `Sent request to start channel: ${channel}`,
        channel: channel
    });
});

function start(port) {
    server = http.createServer(app);
    server.listen(port);
}

module.exports = {
    start
};
