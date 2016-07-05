(function (angular) {
    'use strict';

    var thisModule = angular.module('appBasicControls.Information', []);

    thisModule.config(function (pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            OPEN_INFORM: 'Open inform dialog'
        });
        pipTranslateProvider.translations('ru', {
            OPEN_INFORM: 'Открыть информационный диалог'
        });
    });

    thisModule.controller('InformationController',
        function ($scope, pipInformationDialog) {
            $scope.onInfoDialogOpen = function (event) {
                pipInformationDialog.show(
                    {
                        event: event,
                        title: 'Good!',
                        message: 'Stuff %s was really good',
                        item: 'Loooooong naaaaaaaaaaaaaame',
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
