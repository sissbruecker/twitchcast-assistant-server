const express = require('express');
const router = express.Router();
const _ = require('lodash');
const { check, validationResult } = require('express-validator/check');

const db = require('../db');
const twitchcastApi = require('../api/twitchcast');

function listView(res, extras) {

    const channels = db.get('channels')
        .sortBy('channelId')
        .value();

    extras = extras || {};

    res.render('channels/list', Object.assign({ channels }, extras));
}

function editView(res, channelId, extras) {

    const channel = db.get('channels')
        .find({ channelId })
        .value();

    const alias = _.sortBy(channel.alias, alias => alias.name.toLowerCase());

    extras = extras || {};

    res.render('channels/edit', Object.assign({ channel, alias }, extras));
}

router.get('/', (req, res) => {
    listView(res);
});

const checkEmptyChannel = check('channelId')
    .not()
    .isEmpty()
    .withMessage('Channel ID must not be empty');

const checkUniqueChannel = check('channelId')
    .custom((channelId) => {
        return db.get('channels')
            .find({ channelId })
            .value() == null;
    })
    .withMessage('Channel already exists');

router.post('/', [checkEmptyChannel, checkUniqueChannel], (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return listView(res, {
            errors: errors.array()
        });
    }

    const { channelId } = req.body;
    const channel = {
        channelId,
        alias: []
    };

    db.get('channels')
        .push(channel)
        .write();

    editView(res, channelId);
});

router.get('/:channelId', (req, res) => {

    editView(res, req.params.channelId);
});

router.post('/:channelId/play', (req, res) => {

    const { channelId } = req.params;

    twitchcastApi.play(channelId);

    res.redirect('/channels');
});

router.delete('/:channelId', (req, res) => {

    const channelId = req.params.channelId;

    db.get('channels')
        .remove({ channelId })
        .write();

    res.redirect('/channels');
});

const checkEmptyAlias = check('aliasName')
    .not()
    .isEmpty()
    .withMessage('Alias must not be empty');

const checkUniqueAlias = check('aliasName')
    .custom((aliasName, { req }) => {

        const { channelId } = req.params;

        return db.get('channels')
            .find({ channelId })
            .get('alias')
            .find({ name: aliasName })
            .value() == null;
    })
    .withMessage('Alias already exists');

router.post('/:channelId', [checkEmptyAlias, checkUniqueAlias], (req, res) => {

    const { channelId } = req.params;
    const { aliasName } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return editView(res, channelId, {
            errors: errors.array()
        });
    }

    const alias = {
        name: aliasName
    };

    db.get('channels')
        .find({ channelId })
        .get('alias')
        .push(alias)
        .write();

    editView(res, channelId);
});

router.post('/:channelId/stream', (req, res) => {

    const { channelId } = req.params;
    const { game, viewerCount, createdAt, previewUrl } = req.body;

    const stream = {
        game,
        viewerCount,
        createdAt,
        previewUrl
    };

    db.get('channels')
        .find({ channelId })
        .assign({ stream })
        .write();

    res.status(200);
    res.json({
        message: `Updated stream for channel: ${channelId}`,
        stream
    });
});

router.delete('/:channelId/alias/:aliasName', (req, res) => {

    const { channelId, aliasName } = req.params;

    db.get('channels')
        .find({ channelId })
        .get('alias')
        .remove({ name: aliasName })
        .write();

    res.redirect(`/channels/${channelId}`);
});

module.exports = router;
