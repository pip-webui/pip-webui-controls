/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('appBasicControls.Conversion', []);

    thisModule.config(function(pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            'OPEN_CONVERT_PARENT_DIALOG': 'Open convert parent dialog',
            'CONVERT_DELETE_ORIGINAL_RECORD': 'Delete record after conversion'
        });
        pipTranslateProvider.translations('ru', {
            'OPEN_CONVERT_PARENT_DIALOG': 'Открыть диалог выбора типа родителя',
            'CONVERT_DELETE_ORIGINAL_RECORD': 'Удалить запись после конвертации'
        });
    });

    thisModule.controller('ConversionController',
        function($scope, pipConversionDialog) {

            $scope.onConvertParentDialog = function(event) {
                pipConversionDialog.show(
                    {
                        event: event,
                        options: [
                            {
                                name: 'GOAL',
                                title: 'GOAL',
                                subtitle: 'CONVERT_TO_GOAL_SUBTITLE'
                            },
                            {
                                name: 'AREA',
                                title: 'AREA',
                                subtitle: 'CONVERT_TO_AREA_SUBTITLE'
                            },
                            {
                                name: 'VISION',
                                title: 'VISION',
                                subtitle: 'CONVERT_TO_VISION_SUBTITLE'
                            },
                            {
                                name: 'TASK',
                                title: 'TASK',
                                subtitle: 'CONVERT_TO_TASK_SUBTITLE'
                            }
                        ],
                        recordName: 'New goal'
                    },
                    function(option) {
                        var optionName = option ? option.option.name : null;
                        console.log('Selected option: ' + optionName);
                    }
                );
            };

            $scope.onConvertToDialog = function(event) {
                pipConversionDialog.show(
                    {
                        event: event,
                        options: [
                            {
                                name: 'GOAL',
                                title: 'GOAL',
                                subtitle: 'CONVERT_RECORD_TO_GOAL'
                            },
                            {
                                name: 'TASK',
                                title: 'TASK',
                                subtitle: 'CONVERT_RECORD_TO_TASK'
                            },
                            {
                                name: 'EVENT',
                                title: 'EVENT',
                                subtitle: 'CONVERT_RECORD_TO_EVENT'
                            },
                            {
                                name: 'POST',
                                title: 'POST',
                                subtitle: 'CONVERT_RECORD_TO_POST'
                            }
                        ],
                        deleted: true,
                        deleteTitle: 'Заметка будет удалена после конвертации. Если она вам нужна, то сделайте копию прежде чем продолжить.'
                    },
                    function(result) {
                        var optionName = result ? result.option.name : null;
                        var deleted = result ? result.deleted : false;
                        console.log('Selected option: ' + optionName);
                        console.log('Selected deleted?: ' + deleted);
                    }
                );
            };

        }
    );

})();
