var User = require('../models/user').User;
var HttpError = require('../error').HttpError;
var AuthError = require('../models/user').AuthError;
var async = require('async');
var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.render('registration');
});

router.post('/', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    User.registration(username, password, function (err, user) {
        if (err) {
            if (err instanceof AuthError) {
                return next(new HttpError(403, err.message));
            } else {
                return next(err);
            }
        }
        req.session.user = user._id;
        res.send({});

    });
});

module.exports = router;