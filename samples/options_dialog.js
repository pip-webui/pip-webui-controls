/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('appBasicControls.Options', []);

    thisModule.config(function(pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            OPEN_OPTIONS: 'Open options dialog',
            OPEN_OPTIONS_LEFT: 'Open options dialog'
        });
        pipTranslateProvider.translations('ru', {
            OPEN_OPTIONS: 'Открыть диалог выбора',
            OPEN_OPTIONS_LEFT: 'Открыть диалог выбора'
        });
    });

    thisModule.controller('OptionsController',
        function($scope, pipOptionsDialog, pipOptionsBigDialog) {

            $scope.onOptionsDialogOpen = function(event) {
                pipOptionsDialog.show(
                    {  
                        event: event,
                        title: 'Choose Option',
                        options: [
                            { icon: 'star', name: 'option_1', title: 'Option 1', active: true },
                            { icon: 'star', name: 'option_2', title: 'Option 2' },
                            { icon: 'star', name: 'option_3', title: 'Option 3' },
                            { name: 'option_4', title: 'Option 4' },
                            { name: 'option_5', title: 'Option 5' }
                        ]
                    },
                    function(option) {
                        var optionName = option ? option.name : null;
                        console.log('Selected option: ' + optionName);
                    }
                );
            };

            $scope.onOptionsBigDialogOpen = function(event) {
                pipOptionsBigDialog.show(
                    {
                        event: event,
                        noActions: true,
                        options: [
                            { name: 'option_1', title: 'Option 1', subtitle:'Assertively engineer stand-alone information vis-a-vis ethical partnerships. Dynamically extend accurate data after strategic infrastructures. Globally matrix intuitive potentialities without', active: true },
                            { name: 'option_2', title: 'Option 2', subtitle:'A goal, that is not important by itself and only needed as a step toward a bigger goal' },
                            { name: 'option_3', title: 'Option 3', subtitle:'Small subtitle' },
                            { name: 'option_4', title: 'Big title: Energistically transition multimedia based ideas without mission-critical schemas. 4', subtitle:'Small subtitle' }

                        ]
                    },
                    function(option) {
                        var optionName = option ? option.option.name : null;
                        console.log('Selected option: ' + optionName);
                    }
                );
            };

            $scope.onRoleDialog = function(event) {
                pipOptionsBigDialog.show(
                    {
                        event: event,
                        noActions: true,
                        noTitle: true,
                        hint: 'Роли позволяют отделить свою работу от работы других партнеров.',
                        options: [
                            { name: 'option_1', title: 'Option 1', subtitle:'Assertively engineer stand-alone information vis-a-vis ethical partnerships. Dynamically extend accurate data after strategic infrastructures. Globally matrix intuitive potentialities without', active: true },
                            { name: 'option_2', title: 'Option 2', subtitle:'A goal, that is not important by itself and only needed as a step toward a bigger goal' },
                            { name: 'option_3', title: 'Option 3', subtitle:'Small subtitle' },
                            { name: 'option_4', title: 'Big title: Energistically transition multimedia based ideas without mission-critical schemas. 4', subtitle:'Small subtitle' }

                        ]
                    },
                    function(option) {
                        var optionName = option ? option.option.name : null;
                        console.log('Selected option: ' + optionName);
                    }
                );
            };

            $scope.onOptionsBigDialogOpenForContribs = function(event) {
                pipOptionsBigDialog.show(
                    {
                        event: event,
                        options: [
                            { name: 'option_1', text:'<b>Спланируй</b> задачи и действуй чтобы их осуществить.', active: true },
                            { name: 'option_2', text:'Assertively engineer stand-alone information vis-a-vis ethical partnerships. Dynamically extend accurate data after strategic infrastructures. Globally matrix intuitive potentialities without', active: true },

                        ]
                    },
                    function(option) {
                        var optionName = option ? option.name : null;
                        console.log('Selected option: ' + optionName);
                    }
                );
            };

        }
    );

})();
