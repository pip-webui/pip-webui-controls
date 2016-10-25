(function (angular) {
    'use strict';

    var thisModule = angular.module('appControls.Progress', []);

    thisModule.controller('ProgressController',
        function ($scope,  $timeout, $injector) {// pipAppBar,

            $timeout(function() {
                $('pre code').each(function(i, block) {
                    Prism.highlightElement(block);
                });
            });
            var pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;

            if (pipTranslate) {
                pipTranslate.setTranslations('en', {
                    SHOW_PROGRESS: 'Show progress ring',
                    HIDE_PROGRESS: 'Hide progress ring',
                    SAMPLE: 'Sample',
                    CODE: 'Code'
                });
                pipTranslate.setTranslations('ru', {
                    SHOW_PROGRESS: 'Показать progress ring',
                    HIDE_PROGRESS: 'Спрятать progress ring',
                    SAMPLE: 'Пример',
                    CODE: 'Пример кода'                    
                });
                $scope.showProgress = pipTranslate.translate('SHOW_PROGRESS');
                $scope.hideProgress = pipTranslate.translate('HIDE_PROGRESS');
                $scope.sample = pipTranslate.translate('SAMPLE');
                $scope.code = pipTranslate.translate('CODE');
            } else {
                $scope.showProgress = 'Show progress ring';
                $scope.hideProgress = 'Hide progress ring';                
                $scope.sample = 'Sample';
                $scope.code = 'Code';

            }

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
