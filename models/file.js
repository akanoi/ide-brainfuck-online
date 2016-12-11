var async = require('async');
var util = require('util');

var mongoose = require('../libs/mongoose'),
    Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

var schema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    fileText: {
        type: String
    }
});

schema.statics.allUsersFiles = function (username, callback) {
    var File = this;
    async.waterfall([
        function (callback) {
            File.find({username: username}, callback);
        },
        function (recordsByUser, callback) {
            if (recordsByUser) {
                callback(recordsByUser);
            } else {
                callback("No Text");
            }
        }
    ], callback);
};

schema.statics.addFile = function (username, fileName, fileText, callback) {
    var File = this;
    async.waterfall([
        function (callback) {
            File.findOne({id: username + fileName}, callback);
        },
        function (file, callback) {
            if (file) {
                File.remove(file, callback);
            }
            var newFile = new File({
                id: username + fileName,
                username: username,
                fileName: fileName,
                fileText: fileText
            });
            newFile.save(callback);
        }
    ], callback);
};

schema.statics.deleteFile = function (username, fileName, callback) {
    var File = this;
    async.waterfall([
        function (callback) {
            File.findOne({id: username + fileName}, callback);
        },
        function (file, callback) {
            if (file)
                File.remove(file, callback);
        }
    ], callback);
};

schema.statics.renameFile = function (username, newFileName, oldFileName, callback) {
    var File = this;
    async.waterfall([
        function (callback) {
            File.findOne({id: username + newFileName}, callback);
        },
        function (file, callback) {
            if (file) {
                callback("error");
                return;
            }
            File.findOne({id: username + oldFileName}, callback);
        },
        function (file, callback) {
            var newFile = new File({
                id: username + newFileName,
                username: username,
                fileName: newFileName,
                fileText: file.fileText
            });
            File.remove(file, callback);
            newFile.save(callback);
        }
    ], callback);
};

exports.File = mongoose.model('File', schema);