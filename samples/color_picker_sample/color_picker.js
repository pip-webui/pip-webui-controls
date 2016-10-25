(function (angular) {
    'use strict';

    var thisModule = angular.module('appControls.ColorPicker', []);

    thisModule.controller('ColorPickerController',
        function ($scope, $timeout, $injector) {

            var pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;

            if (pipTranslate) {
                pipTranslate.setTranslations('en', {
                    SAMPLE: 'sample',
                    CURRENT_COLOR: 'Current color',
                    DISABLED: 'Disabled',
                    CODE: 'Code example'
                });
                pipTranslate.setTranslations('ru', {
                    SAMPLE: 'пример',
                    CURRENT_COLOR: 'Текущий цвет',
                    DISABLED: 'Не активно',
                    CODE: 'Пример кода'
                });
                $scope.currentColor = pipTranslate.translate('CURRENT_COLOR');
                $scope.code = pipTranslate.translate('CODE');
                $scope.sample = pipTranslate.translate('SAMPLE');
                $scope.disabled = pipTranslate.translate('DISABLED');
            } else {
                $scope.code = 'Code example';
                $scope.currentColor = 'Current color';
                $scope.sample = 'Sample';
                $scope.disabled = 'Disabled';
            }

            $timeout(function() {
                $('pre code').each(function(i, block) {
                    Prism.highlightElement(block);
                });
            });

            
            $scope.disabled = false;
            $scope.colors = ['purple', 'lightgreen', 'green', 'darkred', 'pink', 'yellow', 'cyan'];
            $scope.code = '<pip-color-picker ng-model="color" ng-disabled="disabled"' +
                'pip-colors="colors"></pip-color-picker>';
        }
    );

})(window.angular);
