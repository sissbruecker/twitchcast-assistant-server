const request = require('request-promise');
const _ = require('lodash');

const TWITCH_BASE_URL = 'https://api.twitch.tv/helix';
const GET_USER_PAGE_SIZE = 50;

function User(userData) {
    return {
        twitchId: userData.id,
        channelId: userData.login.toLowerCase(),
        displayName: userData.display_name,
        description: userData.description,
        logoUrl: userData.profile_image_url,
        viewCount: userData.view_count
    };
}

function Follow(followData) {
    return {
        fromId: followData.from_id,
        toId: followData.to_id,
        followedAt: followData.followed_at,
    };
}

async function getUser(login) {

    const clientId = process.env.TWITCH_CLIENT_ID;
    const url = TWITCH_BASE_URL + `/users?login=${login}`;
    const options = {
        url,
        headers: {
            'Client-ID': clientId
        },
        json: true
    };

    const response = await request(options);

    return response.data.length > 0
        ? User(_.first(response.data))
        : null;
}

async function getUsers(ids) {

    if (ids.length === 0) return [];

    const clientId = process.env.TWITCH_CLIENT_ID;
    let users = [];

    const idChunks = _.chunk(ids, GET_USER_PAGE_SIZE);
    const promises = idChunks.map(async chunk => {

        const queryString = chunk
            .map(id => `id=${id}`)
            .join('&');

        const url = TWITCH_BASE_URL + '/users?' + queryString;
        const options = {
            url,
            headers: {
                'Client-ID': clientId
            },
            json: true
        };

        const response = await request(options);

        users = response.data
            .map(User)
            .concat(users);
    });

    await Promise.all(promises);

    return users;
}

async function getFollowing(userId) {

    const clientId = process.env.TWITCH_CLIENT_ID;

    let hasNextPage = true;
    let response = null;
    let follows = [];

    while (hasNextPage) {

        const url = TWITCH_BASE_URL + '/users/follows'
            + `?from_id=${userId}`
            + '&first=100'
            + (response
                ? `&after=${response.pagination.cursor}`
                : '');

        const options = {
            url,
            headers: {
                'Client-ID': clientId
            },
            json: true
        };

        response = await request(options);

        follows = response.data
            .map(Follow)
            .concat(follows);

        hasNextPage = response.data && response.data.length > 0;
    }

    return follows;
}

module.exports = {
    getUser,
    getUsers,
    getFollowing
};
