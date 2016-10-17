(function (angular) {
    'use strict';

    var thisModule = angular.module('appControls.ColorPicker', []);
/*
    thisModule.config(function (pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            SAMPLE: 'sample',
            CURRENT_COLOR: 'Current color',
            CODE: 'Code example'
        });
        pipTranslateProvider.translations('ru', {
            SAMPLE: 'пример',
            CURRENT_COLOR: 'Текущий цвет',
            CODE: 'Пример кода'
        });
    });*/

    thisModule.controller('ColorPickerController',
        function ($scope, $timeout) {

            $timeout(function() {
                $('pre code').each(function(i, block) {
                    Prism.highlightElement(block);
                });
            });
            
            /*
            pipAppBar.showMenuNavIcon();
            pipAppBar.showLanguage();
            pipAppBar.showTitleText('CONTROLS');*/
            
            $scope.disabled = false;
            $scope.colors = ['purple', 'lightgreen', 'green', 'darkred', 'pink', 'yellow', 'cyan'];
            $scope.code = '<pip-color-picker ng-model="color" ng-disabled="disabled"' +
                'pip-colors="colors"></pip-color-picker>';
        }
    );

})(window.angular);
