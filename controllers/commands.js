const express = require('express');
const router = express.Router();
const recognizer = require('../recognizers/fuzzyRecognizer');
const twitchcastApi = require('../api/twitchcast');

router.post('/play', (req, res) => {

    const { input } = req.query;

    const channel = recognizer.recognize(input);

    twitchcastApi.play(channel);

    res.status(200);
    res.json({
        message: `Sent request to play channel: ${channel}`,
        channel: channel
    });
});

router.post('/stop', (req, res) => {

    twitchcastApi.stop();

    res.status(200);
    res.json({
        message: 'Sent request to stop playback'
    });
});

module.exports = router;
