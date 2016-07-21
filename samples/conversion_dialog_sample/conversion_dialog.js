(function (angular) {
    'use strict';

    var thisModule = angular.module('appBasicControls.Conversion', []);

    thisModule.config(function (pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            'OPEN_CONVERT_PARENT_DIALOG': 'Open choose parent dialog',
            'CONVERT_PARENT_DIALOG': 'Choose parent dialog',
            'CONVERT_TO_DIALOG': 'Convert to dialog',
            'OPEN_CONVERT_TO_DIALOG': 'Open convert to dialog',
            'CONVERT_DELETE_ORIGINAL_RECORD': 'Delete record after conversion',
            'CONVERSION_DIALOG': 'Conversion dialog',
            'CONVERT_TO_CONTENT': 'Note will be removed after conversion. ' +
            'Copy it before continue'
        });
        pipTranslateProvider.translations('ru', {
            'OPEN_CONVERT_PARENT_DIALOG': 'Открыть диалог выбора типа родителя',
            'CONVERT_PARENT_DIALOG': 'Диалог выбора типа родителя',
            'CONVERT_TO_DIALOG': 'Диалог выбора типа для конвертации',
            'OPEN_CONVERT_TO_DIALOG': 'Открыть диалог выбора типа для конвертации',
            'CONVERT_DELETE_ORIGINAL_RECORD': 'Удалить запись после конвертации',
            'CONVERSION_DIALOG': 'Диалог конвертации',
            'CONVERT_TO_CONTENT': 'Заметка будет удалена после конвертации. ' +
            'Если она вам нужна, то сделайте копию прежде чем продолжить.'
        });
    });

    thisModule.controller('ConversionController',
        function ($scope, pipConversionDialog, pipAppBar, $timeout) {

            $timeout(function() {
                $('pre code').each(function(i, block) {
                    Prism.highlightElement(block);
                });
            });
            
            pipAppBar.showMenuNavIcon();
            pipAppBar.showLanguage();
            pipAppBar.showTitleText('CONTROLS');
            
            $scope.onConvertParentDialog = function (event) {
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
                    function (option) {
                        var optionName = option ? option.option.name : null;

                        console.log('Selected option: ' + optionName);  // eslint-disable-line
                    }
                );
            };

            $scope.onConvertToDialog = function (event) {
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
                        deleteTitle: 'CONVERT_TO_CONTENT'
                    },
                    function (result) {
                        var optionName = result ? result.option.name : null,
                            deleted = result ? result.deleted : false;

                        console.log('Selected option: ' + optionName);  // eslint-disable-line
                        console.log('Selected deleted?: ' + deleted);   // eslint-disable-line
                    }
                );
            };
        }
    );

})(window.angular);
