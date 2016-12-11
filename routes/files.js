var File = require('../models/file').File;

var express = require('express');
var router = express.Router();


router.get('/', function (req, res, next) {
    File.allUsersFiles(res.locals.user.username, function (records) {
        if (records == "No Link") {
            res.status(404).send("Ooops... :(");
        }
        else {
            res.send({files: records});
        }
    });
});

module.exports = router;