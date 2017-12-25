const express = require('express');
const router = express.Router();
const _ = require('lodash');
const { check, validationResult } = require('express-validator/check');

const repo = require('../db/channelRepository');
const twitchcastApi = require('../api/twitchcast');

function listView(res, extras) {

    function listItem(channel) {
        return {
            channelId: channel.channelId,
            displayName: channel.displayName || channel.channelId,
            stream: channel.stream
        };
    }

    const channelListItems = _.chain(repo.list())
        .sortBy('channelId')
        .map(listItem)
        .value();

    extras = extras || {};

    res.render('channels/list', Object.assign({ channels: channelListItems }, extras));
}

function editView(res, channelId, extras) {

    extras = extras || {};

    const channel = repo.find(channelId);
    const alias = _.sortBy(channel.alias, alias => alias.name.toLowerCase());
    const viewData = {
        channelId,
        displayName: channel.displayName || channel.channelId,
        alias
    };

    res.render('channels/edit', Object.assign(viewData, extras));
}

router.get('/', (req, res) => {
    listView(res);
});

const checkEmptyChannel = check('channelId')
    .not()
    .isEmpty()
    .withMessage('Channel ID must not be empty');

const checkUniqueChannel = check('channelId')
    .not()
    .custom(repo.find)
    .withMessage('Channel already exists');

router.post('/', [checkEmptyChannel, checkUniqueChannel], (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return listView(res, {
            errors: errors.array()
        });
    }

    const { channelId } = req.body;

    repo.save(channelId);

    res.redirect(`/channels/${channelId}`);
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

    const { channelId } = req.params;

    repo.remove(channelId);

    res.redirect('/channels');
});

const checkEmptyAlias = check('aliasName')
    .not()
    .isEmpty()
    .withMessage('Alias must not be empty');

const checkUniqueAlias = check('aliasName')
    .not()
    .custom((aliasName, { req }) => {
        const { channelId } = req.params;
        return repo.findAlias(channelId, aliasName);
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

    repo.addAlias(channelId, aliasName);

    editView(res, channelId);
});

router.delete('/:channelId/alias/:aliasName', (req, res) => {

    const { channelId, aliasName } = req.params;

    repo.removeAlias(channelId, aliasName);

    res.redirect(`/channels/${channelId}`);
});

module.exports = router;
