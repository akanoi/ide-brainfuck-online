var app = angular.module('ideApp');

app.directive("dropDirective", ['$http', 'SourceService', function ($http, SourceService) {
    return {
        restrict: "AE",
        link: function (scope, elem) {
            elem.bind('dragenter', function (event) {
                elem.textContent = '';
                event.stopPropagation();
                event.preventDefault();
            });
            elem.bind('dragover', function (event) {
                event.stopPropagation();
                event.preventDefault();
            });
            elem.bind('drop', function (event) {
                event.stopPropagation();
                event.preventDefault();
                var dt = event.dataTransfer || (event.originalEvent && event.originalEvent.dataTransfer);
                var files = event.target.files || (dt && dt.files);
                for (var i = 0; i < files.length; i++) {
                    var reader = new FileReader();
                    reader.onload = (function (theFile) {
                        return function (e) {
                            var newFile = {
                                name: theFile.name,
                                type: theFile.type,
                                size: theFile.size,
                                lastModifiedDate: theFile.lastModifiedDate
                            };
                            SourceService.sourceFiles.push({
                                stats: newFile,
                                text: e.target.result
                            });
                            scope.$apply();
                            $http.post('/files', {fileName: newFile.name, fileText: e.target.result});
                        };
                    })(files[i]);
                    reader.readAsText(files[i]);
                }
                SourceService.file = files[files.length - 1];
            });
        }
    }
}]);