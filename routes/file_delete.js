var File = require('../models/file').File;

var express = require('express');
var router = express.Router();

router.post('/', function (req, res, next) {
    console.log('DELETE-POST REQ', res.locals.user.username, req.body.fileName, req.body.fileText);
    File.deleteFile(res.locals.user.username, req.body.fileName, function (records) {
        if (records == "No Link") {
            res.status(404).send("Ooops... :(");
        } else {
            res.status(200).send("OK");
        }
    });
});

module.exports = router;