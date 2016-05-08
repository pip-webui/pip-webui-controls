/**
 * @file Information dialog
 * @copyright Digital Living Software Corp. 2014-2016
 * @todo
 * - Improve sample in sampler app
 */
 
/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipInformationDialog', 
        ['ngMaterial', 'pipUtils', 'pipTranslate', 'pipBasicControls.Templates']);

    thisModule.config(function(pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            'INFORMATION_TITLE': 'Information'
        });
        pipTranslateProvider.translations('ru', {
            'INFORMATION_TITLE': 'Информация'
        });
    });
        
    thisModule.factory('pipInformationDialog', 
        function ($mdDialog, $timeout) {
            return {
                show: function (params, callback) {
                    $mdDialog.show({
                        targetEvent: params.event,
                        templateUrl: 'information_dialog/information_dialog.html',
                        controller: 'pipInformationDialogController',
                        locals: { params: params },
                        clickOutsideToClose: true
                    })
                    .then(function () {
                        if (callback) callback();
                    });
                }
            };
        }
    );

    thisModule.controller('pipInformationDialogController',
        function ($scope, $rootScope, $mdDialog, pipTranslate, params, pipUtils) {
            $scope.theme = $rootScope.$theme;
            $scope.title = params.title || 'INFORMATION_TITLE';

            var content = pipTranslate.translate(params.message);
            if (params.item) {
                var item = _.trunc(params.item, 25);
                content = pipUtils.sprintf(content, item);
            }
            $scope.content = content;
            $scope.ok = params.ok || 'OK';

            $scope.onOk = function () {
                $mdDialog.hide();
            };
        }        
    );

})();
