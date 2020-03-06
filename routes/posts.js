const router = require('express').Router();

const verify = require('../verifyToken');

router.get('/', verify, (req, res) => {
    res.json({
        title: 'Secure your website',
        description: 'Make sure your website is secured. Call us.',
    });
})

module.exports = router;