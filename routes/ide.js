var express = require('express');
var router = express.Router();

//  GET IDE page
router.get('/', function (req, res, next) {
    res.send('ide page');
});

module.exports = router;
