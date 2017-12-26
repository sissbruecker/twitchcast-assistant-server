const twitchApi = require('../api/twitch');
const channelRepo = require('../db/channelRepository');

async function importChannels(login) {

    const user = await twitchApi.getUser(login);

    if (!user) throw new Error(`Login does not exist: ${login}`);

    const follows = await twitchApi.getFollowing(user.twitchId);

    const channelIds = follows.map(follow => follow.toId);

    const channels = await twitchApi.getUsers(channelIds);

    channels.forEach((channel) => {
        channelRepo.save(channel.channelId, channel);
    });

    return {
        channels
    };
}

module.exports = {
    importChannels
};
