const db = require('../db');

function recognize(input) {

    const sanitizedInput = sanitize(input);

    return mapOrDefault(sanitizedInput, sanitizedInput);
}

function mapOrDefault(input, defaultValue) {

    const channels = db.get('channels').value();

    const matchingChannel = channels.find(channel => {

        if (input === channel.channelId) return true;

        return channel.alias
            .map(alias => alias.name.toLowerCase())
            .indexOf(input) >= 0;
    });

    return matchingChannel
        ? matchingChannel.channelId
        : defaultValue;
}

function sanitize(channelName) {
    channelName = channelName.trim();
    channelName = channelName.toLowerCase();
    return channelName;
}

module.exports = {
    recognize
};
