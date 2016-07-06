(function (angular) {
    'use strict';

    var thisModule = angular.module('appBasicControls.Progress', []);

    thisModule.config(function (pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            SHOW_PROGRESS: 'Show progress ring'
        });
        pipTranslateProvider.translations('ru', {
            SHOW_PROGRESS: 'Показать progress ring'
        });
    });

    thisModule.controller('ProgressController',
        function ($scope) {

            $scope.progressOpen = progressOpen;

            function progressOpen() {
                $scope.$reset = true;
            }
        });

})(window.angular);
