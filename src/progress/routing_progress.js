/**
 * @file Routing progress control
 * @description
 * This progress control is enabled by ui router
 * while switching between pages
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular) {
    'use strict';

    var thisModule = angular.module('pipRoutingProgress', ['ngMaterial']);

    thisModule.directive('pipRoutingProgress', function () {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                    showProgress: '&',
                    logoUrl: '@'
                },
            templateUrl: 'progress/routing_progress.html',
            controller: 'pipRoutingProgressController'
        };
    });

    thisModule.controller('pipRoutingProgressController',
        function ($scope, $element, $attrs) {
            var  image = $element.children('img');          

            loadProgressImage();

            return;

            function loadProgressImage() {
                if ($scope.logoUrl) {
                    image.attr('src', $scope.logoUrl);
                }
            }

        }
    );

})(window.angular);
