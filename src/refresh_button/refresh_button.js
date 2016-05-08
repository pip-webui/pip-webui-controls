/**
 * @file Refresh button control
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipRefreshButton", ['ngMaterial']);

    thisModule.directive('pipRefreshButton',  
        function($parse) {
            return {
                restrict: 'EA',
                scope: false,
                template: String()
                    + '<md-button class="pip-refresh-button" tabindex="-1" ng-click="onClick($event)" aria-label="REFRESH">'
                    + '<md-icon md-svg-icon="icons:refresh"></md-icon>'
                    + ' <span class="pip-refresh-text"></span>'
                    + '</md-button>',
                replace: false,
                link: function ($scope, $element, $attrs) {
                    var
                        textGetter = $parse($attrs.pipText),
                        visibleGetter = $parse($attrs.pipVisible),
                        refreshGetter = $parse($attrs.pipRefresh),
                        $button = $element.children('.md-button'),
                        $text = $button.children('.pip-refresh-text');

                    var show = function() {
                        // Set a new text
                        var text = textGetter($scope);
                        $text.text(text);

                        // Show button
                        $button.show();
                        
                        // Adjust position
                        var width = $button.width();
                        $button.css('margin-left', '-' + (width / 2) + 'px');
                    };

                    function hide() {
                        $button.hide();  
                    };

                    $scope.onClick = function(event) {
                        refreshGetter($scope);  
                    };

                    $scope.$watch(visibleGetter, function(newValue) {
                        if (newValue == true) show();
                        else hide();
                    });

                    $scope.$watch(textGetter, function(newValue) {
                        $text.text(newValue);
                    });
                }
            }
        }
    );

})();

