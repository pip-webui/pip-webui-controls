/**
 * @file Convert parent dialog
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular, $, _) {
    'use strict';
    var thisModule = angular.module('pipConversionDialog',
        ['ngMaterial', 'pipUtils', 'pipTranslate', 'pipBasicControls.Templates']);

    /* eslint-disable quote-props */
    thisModule.config(function (pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            'CONVERT_PARENT_TITLE': 'Choose type of the parent record',
            'CONVERT_PARENT_SUBTITLE': 'The <b>%s</b> is missing and will be created from scratch.' +
            ' Find and clarify it later',

            'CONVERT_TO_GOAL_SUBTITLE': 'Result that requires significant efforts',
            'CONVERT_TO_TASK_SUBTITLE': 'Simple work that doesn\'t need a plan',
            'CONVERT_TO_AREA_SUBTITLE': 'Area of interests or actions of any kind',
            'CONVERT_TO_VISION_SUBTITLE': 'Situation in specific time period',
            'CONVERT_TO_CANCEL': 'Do not create a parent record',
            'CONVERT_TO_CANCEL_SUBTITLE': 'The <b>%s</b> is deleted',

            'CONVERT_RECORD_TO_GOAL': 'Result that requires significant efforts',
            'CONVERT_RECORD_TO_TASK': 'Simple work that doesn\'t need a plan',
            'CONVERT_RECORD_TO_EVENT': 'Reminder or scheduled block of time',
            'CONVERT_RECORD_TO_POST': 'Any useful information'
        });
        pipTranslateProvider.translations('ru', {
            'CONVERT_PARENT_TITLE': 'Определите тип родительской записи',
            'CONVERT_PARENT_SUBTITLE': 'Запись <b>%s</b> отсутствует и будет создана с нуля. ' +
            'Найдите и скорректируйте ее позже',

            'CONVERT_TO_GOAL_SUBTITLE': 'Результат требующий значительных усилий',
            'CONVERT_TO_TASK_SUBTITLE': 'Простая работа, для которой не нужен план',
            'CONVERT_TO_AREA_SUBTITLE': 'Область интересов или какой-либо активности',
            'CONVERT_TO_VISION_SUBTITLE': 'Ситуация в определенный промежуток времени',
            'CONVERT_TO_CANCEL': 'Не создавать родительскую запись',
            'CONVERT_TO_CANCEL_SUBTITLE': '<b>%s</b> будет удалена',

            'CONVERT_RECORD_TO_GOAL': 'Результат требующий значительных усилий',
            'CONVERT_RECORD_TO_TASK': 'Простая работа, для которой не нужен план',
            'CONVERT_RECORD_TO_EVENT': 'Напоминание или блок времени в расписании',
            'CONVERT_RECORD_TO_POST': 'Любая полезная информация'
        });
    });
    /* eslint-enable quote-props */

    thisModule.factory('pipConversionDialog',
        function ($mdDialog) {
            return {
                show: function (params, successCallback, cancelCallback) {
                    if (params.event) {
                        params.event.stopPropagation();
                        params.event.preventDefault();
                    }
                    if (!params.options || params.options.length === 0) {
                        return;
                    }

                    function focusToggleControl() {
                        if (params.event && params.event.currentTarget) {
                            params.event.currentTarget.focus();
                        }
                    }

                    $mdDialog.show({
                        targetEvent: params.event,
                        templateUrl: 'conversion_dialog/conversion_dialog.html',
                        controller: 'pipConversionDialogController',
                        locals: {params: params},
                        clickOutsideToClose: true
                    })
                        .then(function (option) {
                            focusToggleControl();

                            if (successCallback) {
                                successCallback(option);
                            }
                        }, function () {
                            focusToggleControl();
                            if (cancelCallback) {
                                cancelCallback();
                            }
                        });
                }
            };
        }
    );

    thisModule.controller('pipConversionDialogController',
        function ($scope, $rootScope, $mdDialog, params, pipUtils, pipTranslate) {

            $scope.theme = $rootScope.$theme;
            $scope.title = params.title || 'CONVERT_PARENT_TITLE';
            $scope.recordName = params.recordName || '';
            $scope.subtitle = params.subtitle || pipUtils.sprintf(pipTranslate.translate('CONVERT_PARENT_SUBTITLE'),
                    $scope.recordName);
            $scope.withoutTitle = params.deleteTitle ? params.deleteTitle : false;
            $scope.deleted = !!params.deleted;
            $scope.options = _.cloneDeep(params.options);
            $scope.selectedIndex = -1;
            $scope.cancelConverting = $scope.recordName || false;
            $scope.selectedOptionName = '';

            if ($scope.cancelConverting) {
                $scope.options.push({
                    name: 'cancel',
                    title: 'CONVERT_TO_CANCEL',
                    subtitle: pipUtils.sprintf(pipTranslate.translate('CONVERT_TO_CANCEL_SUBTITLE'), $scope.recordName)
                });
            }

            $scope.onOptionSelect = function (event, option) {
                event.stopPropagation();
                $scope.selectedOptionName = option.name;

                $scope.onSelect();
            };

            $scope.onKeyPress = function (event) {
                if (event.keyCode === 32 || event.keyCode === 13) {
                    event.stopPropagation();
                    event.preventDefault();
                    $scope.selectedOptionName = $scope.selectedIndex === -1 ? $scope.options[0].name
                        : $scope.options[$scope.selectedIndex].name;
                    $scope.onSelect();
                }
            };

            $scope.onKeyDown = function (event) {
                if (event.keyCode === 40) {
                    event.stopPropagation();
                    event.preventDefault();
                    $scope.selectedIndex += 1;
                    $scope.selectedIndex = $scope.selectedIndex % $scope.options.length;
                    $scope.selectedOptionName = $scope.options[$scope.selectedIndex].name;
                }
                if (event.keyCode === 38) {
                    event.stopPropagation();
                    event.preventDefault();
                    $scope.selectedIndex = $scope.selectedIndex <= 0 ? $scope.selectedIndex = $scope.options.length - 1
                        : $scope.selectedIndex - 1;
                    $scope.selectedOptionName = $scope.options[$scope.selectedIndex].name;
                }
            };

            $scope.onCancel = function () {
                $mdDialog.cancel();
            };

            $scope.onSelect = function () {
                var option = _.find($scope.options, {name: $scope.selectedOptionName});

                if (option && option.name !== 'cancel') {
                    $mdDialog.hide({option: option, deleted: $scope.deleted});
                } else {
                    $mdDialog.hide(null);
                }
            };

            // Setting focus to input control
            function focusInput() {
                var list;

                list = $('.pip-conversion-dialog .pip-list');
                list.focus();
            }

            setTimeout(focusInput, 500);

        }
    );

})(window.angular, window.jQuery, window._);
