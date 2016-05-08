/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('appBasicControls.Progress', []);

    thisModule.config(function(pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            THEME: 'Theme',
            orange: 'Orange theme',
            red: 'Red theme'
        });
        pipTranslateProvider.translations('ru', {
            THEME: 'Тема',
            orange: 'Оранжевая тема',
            red: 'Красная тема'
        });
    });

    thisModule.controller('ProgressController',
        function ($scope) {

            $scope.progressOpen = progressOpen;

            return;

            function progressOpen(){
                $scope.$reset = true;
            }
        })


})();
