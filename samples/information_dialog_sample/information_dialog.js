(function (angular) {
    'use strict';

    var thisModule = angular.module('appBasicControls.Information', []);

    thisModule.config(function (pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            OPEN_INFORM: 'Open information dialog',
            INFORM_DIALOG: 'Information dialog'
        });
        pipTranslateProvider.translations('ru', {
            OPEN_INFORM: 'Открыть информационный диалог',
            INFORM_DIALOG: 'Информационный диалог'
        });
    });

    thisModule.controller('InformationController',
        function ($scope, pipInformationDialog, pipAppBar, $timeout) {

            $timeout(function() {
                $('pre code').each(function(i, block) {
                    Prism.highlightElement(block);
                });
            });

            pipAppBar.showMenuNavIcon();
            pipAppBar.showLanguage();
            pipAppBar.showTitleText('CONTROLS');
            
            $scope.onInfoDialogOpen = function (event) {
                pipInformationDialog.show(
                    {
                        event: event,
                        title: 'Good!',
                        message: 'Stuff %s is really good',
                        item: 'Play CDG T-shirt',
                        ok: 'Take It'
                    },
                    function () {
                        console.log('Taken');   // eslint-disable-line
                    }
                );
            };
        }
    );

})(window.angular);
