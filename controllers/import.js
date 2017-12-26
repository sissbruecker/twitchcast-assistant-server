const express = require('express');
const router = express.Router();
const _ = require('lodash');
const { check, validationResult } = require('express-validator/check');
const twitchImporter = require('../import/twitchImporter');

function view(res, extras) {

    extras = extras || {};

    res.render('import', Object.assign({}, extras));
}

router.get('/', (req, res) => {
    view(res);
});

const checkEmptyLogin = check('login')
    .not()
    .isEmpty();

router.post('/', [checkEmptyLogin], async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return view(res, {
            errors: errors.array()
        });
    }

    const { login } = req.body;
    let result;

    try {
        result = await twitchImporter.importChannels(login);
    } catch (e) {
        console.error(e);
        return view(res, {
            errors: [{ msg: e.message }]
        });
    }

    view(res, { result });
});

module.exports = router;
