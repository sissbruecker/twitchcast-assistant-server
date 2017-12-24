const Fuse = require('fuse.js');
const db = require('../db');
const sanitize = require('./sanitize');

const options = {
    shouldSort: true,
    keys: [
        {
            name: 'channelId',
            weight: 0.7
        },
        {
            name: 'alias.name',
            weight: 0.3
        }
    ]
};

function recognize(input) {

    const sanitizedInput = sanitize(input);

    const channels = db.get('channels').value();

    const fuse = new Fuse(channels, options);

    const matches = fuse.search(sanitizedInput);

    return matches.length > 0
        ? matches[0].channelId
        : input;
}

module.exports = {
    recognize
};
