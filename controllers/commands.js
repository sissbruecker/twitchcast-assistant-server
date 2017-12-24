const express = require('express');
const router = express.Router();
const recognizer = require('../recognizers/channelRecognizer');
const config = require('../config');
const request = require('request');

router.post('/play', (req, res) => {

    const { input } = req.query;

    const channel = recognizer.recognize(input);

    const playUrl = config.twitchcastServer.url + `/stream/play/${channel}`;

    request.post(playUrl);

    res.status(200);
    res.json({
        message: `Sent request to play channel: ${channel}`,
        channel: channel
    });
});

router.post('/stop', (req, res) => {

    const stopUrl = config.twitchcastServer.url + '/stream/stop';

    request.post(stopUrl);

    res.status(200);
    res.json({
        message: 'Sent request to stop playback'
    });
});

module.exports = router;
