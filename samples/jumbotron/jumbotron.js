/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('appControls.Jumbotron', []);

    thisModule.controller('JumbotronController',
        function($scope, $mdMedia) {
            //....
            $scope.$mdMedia =  $mdMedia;
        }
    );

})();
