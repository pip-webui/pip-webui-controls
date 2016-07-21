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
        function ($scope, pipAppBar, $timeout) {

            $timeout(function() {
                $('pre code').each(function(i, block) {
                    Prism.highlightElement(block);
                });
            });

            pipAppBar.hideShadow();
            pipAppBar.showMenuNavIcon();
            pipAppBar.showLanguage();
            pipAppBar.showTitleText('CONTROLS');
            
            $scope.progressOpen = progressOpen;

            function progressOpen() {
                $scope.$reset = true;
            }
        });

})(window.angular);
