var app = angular.module('ideApp');

app.service('SourceService', function () {
    this.sourceFiles = [];
    this.file = {};
    this.image = {};
});