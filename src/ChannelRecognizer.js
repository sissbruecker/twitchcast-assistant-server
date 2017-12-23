function ChannelRecognizer(mappings) {

    function recognize(input) {

        const sanitizedInput = sanitize(input);

        return applyMapping(sanitizedInput);
    }

    function applyMapping(input) {

        const match = Object.keys(mappings).find(knownChannel => {

            if (input === knownChannel) return true;

            const alias = mappings[knownChannel];

            return alias.indexOf(input) >= 0;
        });

        return match
            ? match
            : input;
    }

    return {
        recognize
    };
}

function sanitize(channelName) {
    channelName = channelName.trim();
    channelName = channelName.toLowerCase();
    return channelName;
}

module.exports = ChannelRecognizer;
