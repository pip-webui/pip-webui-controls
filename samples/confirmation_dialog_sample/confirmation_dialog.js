(function (angular) {
    'use strict';

    var thisModule = angular.module('appBasicControls.Confirmation', []);

    thisModule.config(function (pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            OPEN_CONFIRM: 'Open confirmation dialog',
            CONFIRM_DIALOG: 'Confirmation dialog'
        });
        pipTranslateProvider.translations('ru', {
            OPEN_CONFIRM: 'Открыть диалог родтверждения',
            CONFIRM_DIALOG: 'Диалог подтверждения'
        });
    });

    thisModule.controller('ConfirmationController',
        function ($scope, pipConfirmationDialog, pipAppBar, $timeout) {

            $timeout(function() {
                $('pre code').each(function(i, block) {
                    Prism.highlightElement(block);
                });
            });

            pipAppBar.showMenuNavIcon();
            pipAppBar.showLanguage();
            pipAppBar.showTitleText('CONTROLS');
            
            $scope.onConfirmDialogOpen = function (event) {
                pipConfirmationDialog.show(
                    {
                        event: event,
                        title: 'Agree?',
                        ok: 'Agree',
                        cancel: 'Disagree'
                    },
                    function () {
                        console.log('You agreed');  // eslint-disable-line
                    },
                    function () {
                        console.log('You disagreed');   // eslint-disable-line
                    }
                );
            };
        }
    );

})(window.angular);
