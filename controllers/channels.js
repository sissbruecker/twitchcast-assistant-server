const express = require('express');
const router = express.Router();
const _ = require('lodash');
const { check, validationResult } = require('express-validator/check');

const repo = require('../db/channelRepository');
const twitchcastApi = require('../api/twitchcast');
const twitchApi = require('../api/twitch');
const TableModel = require('../util/TableModel');

const tableModel = TableModel({
    route: '/channels',
    columns: [
        {
            key: 'channelId',
            label: 'Channel'
        },
        {
            key: 'timestamp',
            label: 'Last stream',
            getter: channel => channel.stream
                ? channel.stream.timestamp
                : 0
        },
        {
            key: 'game',
            label: 'Game',
            getter: channel => channel.stream
                ? channel.stream.game
                : ''
        }
    ]
});

function listView(req, res, extras) {

    const sort = tableModel.getSort(req);

    const channels = repo.channels()
        .orderBy([sort.getter], [sort.sortDir])
        .value();

    const table = tableModel.getState(req);

    extras = extras || {};

    res.render('channels/list', Object.assign({ channels, table }, extras));
}

function editView(res, channelId, extras) {

    extras = extras || {};

    const channel = repo.find(channelId);
    const alias = _.sortBy(channel.alias, alias => alias.name.toLowerCase());
    const viewData = {
        channelId,
        displayName: channel.displayName,
        alias
    };

    res.render('channels/edit', Object.assign(viewData, extras));
}

router.get('/', (req, res) => {
    listView(req, res);
});

const checkEmptyChannel = check('channelId')
    .not()
    .isEmpty()
    .withMessage('Channel ID must not be empty');

router.post('/', [checkEmptyChannel], async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return listView(req, res, {
            errors: errors.array()
        });
    }

    const { channelId } = req.body;

    const channel = await twitchApi.getUser(channelId);

    if (!channel) {
        return listView(req, res, {
            errors: [{ msg: `Channel does not exist: ${channelId}` }]
        });
    }

    repo.save(channelId, channel);

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
