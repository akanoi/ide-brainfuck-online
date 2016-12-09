var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.redirect('/');
    req.session.destroy();
});

module.exports = router;