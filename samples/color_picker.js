/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('appBasicControls.ColorPicker', []);

    thisModule.config(function(pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            SAMPLE: 'sample',
            CURRENT_COLOR: 'Current color'
        });
        pipTranslateProvider.translations('ru', {
            SAMPLE: 'пример',
            CURRENT_COLOR: 'Текущий цвет'
        });
    });

    thisModule.controller('ColorPickerController',
        function($scope) {
            $scope.disabled = false;
            $scope.colors=['purple', 'lightgreen', 'green', 'darkred', 'pink', 'yellow', 'cyan']
        }
    );

})();
