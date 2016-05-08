/**
 * @file Options dialog
 * @copyright Digital Living Software Corp. 2014-2016
 * @todo
 * - Improve sample in sampler app
 * - Remove deleted hack in the controller
 */
 
/* global $, angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipOptionsDialog', 
        ['ngMaterial', 'pipUtils', 'pipTranslate', 'pipBasicControls.Templates']);

    thisModule.config(function(pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            'OPTIONS_TITLE': 'Choose Option'
        });
        pipTranslateProvider.translations('ru', {
            'OPTIONS_TITLE': 'Выберите опцию'
        });
    });

    thisModule.factory('pipOptionsDialog', 
        function ($mdDialog) {
            return {
                show: function (params, successCallback, cancelCallback) {
                    if (params.event) {
                        params.event.stopPropagation();
                        params.event.preventDefault();
                    }

                    function focusToggleControl() {
                        if (params.event && params.event.currentTarget)
                            params.event.currentTarget.focus();
                    }

                    $mdDialog.show({
                        targetEvent: params.event,
                        templateUrl: 'options_dialog/options_dialog.html',
                        controller: 'pipOptionsDialogController',
                        locals: { params: params },
                        clickOutsideToClose: true
                    })
                    .then(function (option) {
                        focusToggleControl();

                        if (successCallback) successCallback(option);
                    }, function () {
                        focusToggleControl();
                        if (cancelCallback) cancelCallback();
                    });
                }
            };
        }
    );

    thisModule.controller('pipOptionsDialogController',
        function ($scope, $rootScope, $mdDialog, params) {
            $scope.theme = $rootScope.$theme;
            $scope.title = params.title || 'OPTIONS_TITLE';
            $scope.options = params.options;
            $scope.selectedOption = _.find(params.options, 'active', true) || {};
            $scope.selectedOptionName = $scope.selectedOption.name;
            $scope.applyButtonTitle = params.appleButtonTitle || 'SELECT';
            
            $scope.deleted = params.deleted;
            $scope.deletedTitle = params.deletedTitle;
    
            $scope.onOptionSelect = function (event, option) {
                event.stopPropagation();
                $scope.selectedOptionName = option.name;
            };
    
            $scope.onKeyPress = function(event) {
                if (event.keyCode == 32 || event.keyCode == 13) {
                    event.stopPropagation();
                    event.preventDefault();
                    $scope.onSelect();
                }
            };
    
            $scope.onCancel = function () {
                $mdDialog.cancel();
            };
            
            $scope.onSelect = function () {
                var option = _.find(params.options, 'name', $scope.selectedOptionName);
                $mdDialog.hide({ option: option, deleted: $scope.deleted });
            };
    
            // Setting focus to input control
            function focusInput() {
                var list = $('.pip-options-dialog .pip-list');
                list.focus();
            };
            setTimeout(focusInput, 500);
    
        }
    );

})();
