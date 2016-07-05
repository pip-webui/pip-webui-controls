(function (angular) {
    'use strict';

    var thisModule = angular.module('appBasicControls.ToggleButtons', []);

    thisModule.config(function (pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            INITIALIZED: 'Initialized',
            NOT: 'Not'
        });
        pipTranslateProvider.translations('ru', {
            INITIALIZED: 'Инициализированный',
            NOT: 'Не'
        });
    });

    thisModule.controller('ToggleButtonsController',
        function ($scope) {
            $scope.buttonsCollection = [
                {id: 'type LOW', name: 'LOW', disabled: false, filled: true},
                {id: 'type NORMAL', name: 'NORMAL', disabled: false},
                {id: 'type HIGH', name: 'HIGH', disabled: false}
            ];
            $scope.buttonsCollection2 = [
                {id: 'type 1', name: 'LOW', disabled: false},
                {id: 'type 2', name: 'NORMAL', disabled: false, filled: true},
                {id: 'type 3', name: 'HIGH', disabled: false}
            ];

            $scope.buttonsCollection3 = [
                {id: 'type 1', name: 'LOW', disabled: false},
                {id: 'type 2', name: 'NORMAL', disabled: false},
                {id: 'type 3', name: 'HIGH', disabled: false}
            ];

            $scope.buttonsColoredCollection = [
                {id: 'type 1', name: 'LOW', disabled: false, backgroundColor: '#F06292'},
                {id: 'type 2', name: 'NORMAL', disabled: false, backgroundColor: '#BA68C8'},
                {id: 'type 3', name: 'HIGH', disabled: false, backgroundColor: '#009688'}
            ];

            $scope.type = 'type LOW';

            $scope.initType = 'type 2';
        }
    );

})(window.angular);
