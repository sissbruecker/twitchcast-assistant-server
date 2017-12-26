const express = require('express');
const router = express.Router();
const recognizer = require('../../recognizers/fuzzyRecognizer');
const twitchcastApi = require('../../api/twitchcast');
const channelRepo = require('../../db/channelRepository');

router.post('/play', (req, res) => {

    const { input } = req.query;

    const channel = recognizer.recognize(input);

    twitchcastApi.play(channel);

    res.status(200);
    res.json({
        message: `Sent command to play channel: ${channel}`,
        channel: channel
    });
});

router.post('/stop', (req, res) => {

    twitchcastApi.stop();

    res.status(200);
    res.json({
        message: 'Sent request to stop casting'
    });
});

router.post('/browse', (req, res) => {

    const recentChannels = channelRepo.channels()
        .filter(channel => channel.stream != null && channel.stream.timestamp != null)
        .orderBy([channel => channel.stream.timestamp], ['desc'])
        .take(10)
        .value();

    const browserData = {
        channels: recentChannels
    };

    twitchcastApi.browse(browserData);

    res.status(200);
    res.json({
        message: 'Sent request to start browser'
    });
});

module.exports = router;
