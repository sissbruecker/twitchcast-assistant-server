const express = require('express');
const router = express.Router();

const twitchApi = require('../../api/twitch');
const channelRepo = require('../../db/channelRepository');

router.post('/follow/:channelId', async (req, res) => {

    const { channelId } = req.params;

    let channel = await twitchApi.getUser(channelId);

    channel = channelRepo.save(channelId, channel);

    res.status(200);
    res.json({
        message: `Updated channel: ${channelId}`,
        channel
    });
});

router.post('/stream/:channelId', (req, res) => {

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
