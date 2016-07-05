/**
 * @file Confirmation dialog
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular) {
    'use strict';

    var thisModule = angular.module('pipConfirmationDialog',
        ['ngMaterial', 'pipUtils', 'pipTranslate', 'pipBasicControls.Templates']);

    /* eslint-disable quote-props */
    thisModule.config(function (pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            'CONFIRM_TITLE': 'Confirm'
        });
        pipTranslateProvider.translations('ru', {
            'CONFIRM_TITLE': 'Подтвердите'
        });
    });
    /* eslint-enable quote-props */

    thisModule.factory('pipConfirmationDialog',
        function ($mdDialog) {
            return {
                show: function (params, successCallback, cancelCallback) {
                    $mdDialog.show({
                        targetEvent: params.event,
                        templateUrl: 'confirmation_dialog/confirmation_dialog.html',
                        controller: 'pipConfirmationDialogController',
                        locals: { params: params },
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

    thisModule.controller('pipConfirmationDialogController',
        function ($scope, $rootScope, $mdDialog, pipTranslate, params) {
            $scope.theme = $rootScope.$theme;
            $scope.title = params.title || 'CONFIRM_TITLE';

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
