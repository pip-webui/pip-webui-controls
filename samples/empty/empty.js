/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('appControls.Empty', []);

    thisModule.controller('EmptyController',
        function($scope, $mdMedia) {
            //....
            $scope.$mdMedia =  $mdMedia;
        }
    );

})();
