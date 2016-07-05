/* eslint-disable no-console */

(function (angular, _) {
    'use strict';

    var thisModule = angular.module('appBasicControls.Refresh', []);

    thisModule.config(function (pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            SHOW_REFRESH: 'Show refresh'
        });
        pipTranslateProvider.translations('ru', {
            SHOW_REFRESH: 'Показать refresh'
        });
    });

    thisModule.controller('RefreshController',
        function ($scope) {
            $scope.showRefresh = true;
            $scope.refreshText = '123 New Posts';

            $scope.onRefresh = function () {
                $scope.showRefresh = false;
                console.log('Refresh clicked!!!');
            };

            $scope.onRefreshShow = function () {
                $scope.refreshText = '' + _.random(0, 100) + ' New Posts';
                $scope.showRefresh = true;
            };
        }
    );

})(window.angular, window._);
