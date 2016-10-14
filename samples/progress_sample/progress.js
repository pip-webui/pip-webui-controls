(function (angular) {
    'use strict';

    var thisModule = angular.module('appBasicControls.Progress', []);

    thisModule.config(function (pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            SHOW_PROGRESS: 'Show progress ring',
            HIDE_PROGRESS: 'Hide progress ring'
        });
        pipTranslateProvider.translations('ru', {
            SHOW_PROGRESS: 'Показать progress ring',
            HIDE_PROGRESS: 'Спрятать progress ring'
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
            $scope.progressClose = progressClose;
            $scope.isShowProgress = isShowProgress;

            return;

            function isShowProgress() {
                return $scope.$reset;
            }

            function progressOpen() {
                $scope.$reset = true;
            }

            function progressClose() {
                $scope.$reset = false;
            }

        });

})(window.angular);
