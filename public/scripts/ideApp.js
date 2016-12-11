(function () {

    'use strict';

    angular
        .module('ideApp', [])
        .controller('IdeAppController', function ($http, $interval, $scope, SourceService) {
            $scope.isAtInstruction = function (i) {
                return i == index_pointer;
            };

            $scope.is_debug = false;

            $scope.setInterval = function (interval) {
                timeout = interval;
            };


            $scope.getInterval = function () {
                return timeout;
            };


            $scope.getInstruction = function () {
                return index_pointer
            };


            $scope.getMemory = function () {
                return memory_pointer
            };


            $scope.$watch(function () {
                return index_pointer
            }, function (n) {
                if ($scope.is_debug) {
                    var edit_source = $('#edit-source');
                    edit_source[0].selectionStart = n - 1;
                    edit_source[0].selectionEnd = n;
                }
            });


            $scope.new = function () {
                var date = new Date();
                var newFile = {
                    stats: {
                        name: date.getDate()+ "." + date.getMonth() + "/" + date.getHours() + ':' + date.getMinutes()
                    },
                    text: ''
                };
                $('#edit-source').val(' ');
                SourceService.sourceFiles.push(newFile);
                SourceService.file = newFile;
                $http.post('/save', {fileName: SourceService.file.stats.name, fileText: SourceService.file.text});
            };

            // TODO add function for download file
            $scope.save = function () {
                SourceService.file.text = $('#edit-source').val();
                $http.post('/save', {fileName: SourceService.file.stats.name, fileText: SourceService.file.text});
            };


            $scope.delete = function (file) {
                $http.post('/delete', {fileName: file.stats.name, fileText: file.text});
            };


            $scope.positive = function () {
                var memory = $('#memory');

                memory.val(Math.abs(memory.val()));
                if (memory.val().charAt(0) == '-') memory.val(0);
            };


            $scope.loadMore = load;
            $scope.lines = lines;
            $scope.memory = memory_array;
            $interval(function () {}, 100);

            $scope.tochar = function (int) {
                if (int < 32 || int > 127)
                    return '.';
                return String.fromCharCode(int).toUpperCase();
            };

        });
})();
