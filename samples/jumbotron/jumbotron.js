/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('appControls.Jumbotron', []);

    thisModule.controller('JumbotronController',
        function($scope, $mdMedia) {
            //....
            $scope.$mdMedia =  $mdMedia;
            $scope.items=[
                {
                    text1:'7a26e1804422',
                    text2:'804422',
                    text3:'3',
                    text4:'12 min 34 sec ago'
                }, {
                    text1:'7878a26e1804422',
                    text2:'POReceipt#: 804422',
                    text3:'4',
                    text4:'12 min 34 sec ago'
                }
            ];
        }
    );

})();
