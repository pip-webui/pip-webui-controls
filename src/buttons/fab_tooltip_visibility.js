/**
 * @file Directive to show confirmation dialog when user tries to leave page with unsaved changes.
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function(){
    'use strict';

    var thisModule = angular.module("pipFabTooltipVisibility", []);

    thisModule.directive("pipFabTooltipVisibility", function ($parse, $timeout) {
        return {
            restrict: 'A',
            scope: false,
            controller: function($scope, $attrs) {
                var trigGetter = $parse($attrs.pipFabTooltipVisibility),
                    showGetter = $parse($attrs.pipFabShowTooltip),
                    showSetter = showGetter.assign;

                $scope.$watch(trigGetter, function(isOpen) {
                    if (isOpen) {
                        $timeout(function() {
                            showSetter($scope, isOpen);
                        }, 600);
                    } else {
                        showSetter($scope, isOpen);
                    }
                });
            }
        };
    });

})();
