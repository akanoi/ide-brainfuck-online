var app = angular.module('ideApp');

app.directive("sourceFilesDirective", ['$http', 'SourceService', function ($http, SourceService) {
    return {
        restrict: "AE",
        template: '<li>' + '<style> .selected, .selected:focus { color: blue; } </style>' +
        '<button ng-class="{selected : isSelected($index)}"  ng-dblclick="rename(file)" ng-click="selectFile($index);select(file);" ng-disabled="is_debug" class="btn btn-default btn-xs" style="margin: 10px 5px 0px 10px; width: 85px; height: 20px;">{{file.stats.name}}</button><br>' +
        '</li>',

        link: function (scope, elem) {
            scope.select = function (file) {
                SourceService.file = file;
                $('#edit_source').val(SourceService.file.text);
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


    // $scope.new = function () {
    //     var date = new Date();
    //     var newFile = {
    //         stats: {
    //             name: date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
    //         },
    //         text: ''
    //     };
    //     SourceService.sourceFiles.push(newFile);
    //     SourceService.file = newFile;
    //     $http.post('/files', {fileName: SourceService.file.stats.name, fileText: SourceService.file.text});
    // };
    //
    //
    // $scope.save = function () {
    //     SourceService.file.text = $('#edit-source').val();
    //     $http.post('/files', {fileName: SourceService.file.stats.name, fileText: SourceService.file.text});
    // };
    //
    //
    // $scope.delete = function (file) {
    //     $http.post('/delete', {fileName: file.stats.name, fileText: file.text});
    // };


    $http.get('/files').then(function (response) {
        SourceService.sourceFiles = response.data.files.map(function (file) {
            return {stats: {name: file.fileName}, text: file.fileText}
        });
        $scope.sourceFiles = SourceService.sourceFiles;
    }, function () {
    });
});