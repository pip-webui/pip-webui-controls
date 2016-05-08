/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('appBasicControls.Confirmation', []);

    thisModule.config(function(pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            OPEN_CONFIRM: 'Open confirm dialog'
        });
        pipTranslateProvider.translations('ru', {
            OPEN_CONFIRM: 'Открыть диалог родтверждения'
        });
    });

    thisModule.controller('ConfirmationController',
        function($scope, pipConfirmationDialog) {
            $scope.onConfirmDialogOpen = function(event) {
                pipConfirmationDialog.show(
                    {
                        event: event,
                        title: 'Agree?',
                        message: 'Stuff %s is really good',
                        item: 'Loooooong naaaaaaaaaaaaaame',
                        ok: 'Agree',
                        cancel: 'Disagree'
                    },
                    function () {
                        console.log('You agreed');
                    },
                    function () {
                        console.log('You disagreed');
                    }
                );  
            };
        }
    );

})();
