const { validationResult } = require('express-validator/check');

module.exports = function validationErrorHandler(req, res, next) {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400);
        return res.json({
            errors: errors.array()
        });
    }

    next();
};
