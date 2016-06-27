/**
 * @file Confirmation dialog
 * @copyright Digital Living Software Corp. 2014-2016
 * @todo
 * - Improve sample in sampler app
 */

(function (angular) {
    'use strict';

    var thisModule = angular.module('pipErrorDetailsDialog',
        ['ngMaterial', 'pipUtils', 'pipTranslate', 'pipBasicControls.Templates']);

    thisModule.config(function (pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            'ERROR_DETAILS': 'Error details',
            'CODE': 'Code',
            'PATH': 'Path',
            'ERROR': 'Error code',
            'METHOD': 'Method',
            'MESSAGE': 'Message'

        });
        pipTranslateProvider.translations('ru', {
            'ERROR_DETAILS': 'Детали ошибки',
            'CODE': 'Код',
            'PATH': 'Путь',
            'ERROR': 'Код ошибки',
            'METHOD': 'Метод',
            'MESSAGE': 'Сообщение'
        });
    });

    thisModule.factory('pipErrorDetailsDialog',
        function ($mdDialog) {
            return {
                show: function (params, successCallback, cancelCallback) {
                    $mdDialog.show({
                        targetEvent: params.event,
                        templateUrl: 'error_details_dialog/error_details_dialog.html',
                        controller: 'pipErrorDetailsDialogController',
                        locals: {params: params},
                        clickOutsideToClose: true
                    })
                        .then(function () {
                            if (successCallback) {
                                successCallback();
                            }
                        }, function () {
                            if (cancelCallback) {
                                cancelCallback();
                            }
                        });
                }
            };
        }
    );

    thisModule.controller('pipErrorDetailsDialogController',
        function ($scope, $rootScope, $mdDialog, pipTranslate, params) {
            $scope.error = params.error;
            $scope.ok = params.ok || 'OK';
            $scope.cancel = params.cancel || 'CANCEL';

            $scope.onCancel = function () {
                $mdDialog.cancel();
            };

            $scope.onOk = function () {
                $mdDialog.hide();
            };
        }
    );

})(window.angular);
