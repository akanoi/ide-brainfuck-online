var File = require('../models/file').File;

var express = require('express');
var router = express.Router();

router.post('/', function (req, res, next) {
    console.log('SAVE-POST REQ', res.locals.user.username, req.body.fileName);
    File.addFile(res.locals.user.username, req.body.fileName, req.body.fileText, function () {
        res.send("OK");
    });
});

module.exports = router;