const express = require('express');
const router = express.Router();
const recognizer = require('../recognizers/fuzzyRecognizer');

router.get('/', (req, res) => {

    const { input } = req.query;

    const channel = recognizer.recognize(input);

    res.status(200);
    res.json({
        input: input,
        result: channel
    });
});

module.exports = router;
