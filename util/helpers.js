const format = require('date-fns/format');

const DATE_FORMAT = 'ddd, D. MMM YYYY [at] HH:mm';

function formatTimestamp(timestamp) {
    return timestamp != null
        ? format(new Date(timestamp), DATE_FORMAT)
        : '';
}

module.exports = {
    formatTimestamp
};
