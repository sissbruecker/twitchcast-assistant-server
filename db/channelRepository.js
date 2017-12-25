const db = require('./index');

function list() {
    return channels().value();
}

function find(channelId) {
    return channels()
        .find({ channelId: safeId(channelId) })
        .value()
}

function create(channelId) {

    const channel = {
        channelId: safeId(channelId),
        displayName: channelId,
        alias: []
    };

    channels()
        .push(channel)
        .write();
}

function save(channelId, channelInfo) {

    channelInfo = channelInfo || {};

    if (!find(channelId)) {
        create(channelId);
    }

    const channel = channels()
        .find({ channelId: safeId(channelId) })
        .assign(channelInfo)
        .value();

    db.write();

    return channel;
}

function remove(channelId) {
    channels()
        .remove({ channelId: safeId(channelId) })
        .write();
}

function findAlias(channelId, aliasName) {
    return channels()
        .find({ channelId: safeId(channelId) })
        .get('alias')
        .find({ name: aliasName })
        .value();
}

function addAlias(channelId, aliasName) {

    const alias = {
        name: aliasName
    };

    channels()
        .find({ channelId: safeId(channelId) })
        .get('alias')
        .push(alias)
        .write();
}

function removeAlias(channelId, aliasName) {

    channels()
        .find({ channelId: safeId(channelId) })
        .get('alias')
        .remove({ name: aliasName })
        .write();
}

function channels() {
    return db.get('channels');
}

function safeId(channelId) {
    return channelId.toLowerCase();
}

module.exports = {
    list,
    find,
    save,
    remove,
    findAlias,
    addAlias,
    removeAlias,
};
