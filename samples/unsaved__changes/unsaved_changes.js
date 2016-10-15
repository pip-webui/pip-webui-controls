/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('appBasicBehaviors.UnsavedChanges', []);

    thisModule.config(function(pipTranslateProvider) {

        pipTranslateProvider.translations('en', {
            MESSAGE: 'All changes will be lost!',
            TRY: 'Try to leave page',
            TEXT: 'Message content',
            AVAILABLE: 'Available',
            LEAVE: 'Leave page!',
            LINK: 'External link'
        });
        pipTranslateProvider.translations('ru', {
            MESSAGE: 'Все изменения будут утеряны!',
            TRY: 'Попробуйте покинуть страницу',
            TEXT: 'Содержание сообщения',
            AVAILABLE: 'Включен',
            LEAVE: 'Покинуть страницу!',
            LINK: 'Внешняя ссылка'
        });
    });

    thisModule.controller('UnsavedChangesController',
        function($scope, pipTranslate) {
            $scope.onLeavePage = function () {
                window.history.back();
            };

            $scope.available = true;
            $scope.message = pipTranslate.translate('MESSAGE');

            $scope.isAvailable = function () {
                return $scope.available;
            }
        }
    );

})();
