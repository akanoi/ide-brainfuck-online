var app = angular.module('ideApp');

app.service('SourceService', function () {
    this.sourceFiles = [];
    this.file = {};
    this.image = {};
});


app.directive("sourceFilesDirective", ['$http', 'SourceService', function ($http, SourceService) {
    return {
        restrict: "AE",
        template: '<li class="li-file" type="none" style="padding-top: 10px">' + '<style> .selected { background-color: #00B7FF; color: white } }</style>' +
        '<img src="/images/file.png"/>' +
        '<span ng-class="{selected : isSelected($index)}"  ng-dblclick="rename(file)" ng-click="selectFile($index);select(file);" class="file-a" style="margin: 10px 5px 0px 10px">{{file.stats.name}}</span><br>' +
        '</li>',

        link: function (scope, elem) {
            scope.select = function (file) {
                SourceService.file = file;
                $('#edit-source').val(SourceService.file.text);
            };

        }
    }
}]);


app.controller("SourceFileListController", function ($http, $scope, SourceService) {
    $scope.selected = Number.MAX_VALUE;
    $scope.selectFile = function (selected) {
        $scope.selected = selected;
    };
    $scope.isSelected = function (selected) {
        return $scope.selected == selected;
    };

    $scope.remove = function () {
        if ($scope.selected == Number.MAX_VALUE)
            return;
        var file = SourceService.file;
        $scope.sourceFiles.splice($scope.sourceFiles.indexOf(file), 1);
        if ($scope.sourceFiles.length == 0) {
            console.log('LIST IS EMPTY');
        }
        $scope.delete(file);
        $scope.selected = Number.MAX_VALUE;
    };


    $scope.rename = function () {
        var file = SourceService.file;
        var newName = window.prompt("Enter new filename", file.stats.name);
        if (newName) {
            $http.post('/rename', {new: newName, old: file.stats.name}).then(function () {
                file.stats.name = newName;
            }, function () {
                alert("File already exists!");
            });
        }
    };

    $http.get('/files').then(function (response) {
        SourceService.sourceFiles = response.data.files.map(function (file) {
            return {stats: {name: file.fileName}, text: file.fileText}
        });
        $scope.sourceFiles = SourceService.sourceFiles;
    }, function () {
    });
});