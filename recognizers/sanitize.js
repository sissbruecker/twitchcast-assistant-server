module.exports = function sanitize(input) {
    input = input.trim();
    input = input.toLowerCase();
    return input;
};
