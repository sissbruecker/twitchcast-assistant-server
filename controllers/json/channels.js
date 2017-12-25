const express = require('express');
const router = express.Router();
const { check } = require('express-validator/check');

const channelRepo = require('../../db/channelRepository');
const validationErrorHandler = require('./validationErrorHandler');

const checkEmptyChannel = check('channelId')
    .not()
    .isEmpty()
    .withMessage('Channel ID must not be empty');

router.post('/', [checkEmptyChannel, validationErrorHandler], (req, res) => {

    const { channelId, logoUrl } = req.body;

    const channel = channelRepo.save(channelId, { logoUrl });

    res.status(200);
    res.json({
        message: `Updated channel: ${channelId}`,
        channel
    });
});

router.post('/:channelId/stream', (req, res) => {

    const { channelId } = req.params;
    const { game, viewerCount, createdAt, previewUrl } = req.body;

    const timestamp = new Date().getTime();

    const stream = {
        game,
        viewerCount,
        createdAt,
        timestamp,
        previewUrl
    };

    channelRepo.save(channelId, { stream });

    res.status(200);
    res.json({
        message: `Updated stream for channel: ${channelId}`,
        stream
    });
});

module.exports = router;
