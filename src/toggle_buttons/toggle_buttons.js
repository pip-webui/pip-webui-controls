/**
 * @file Toggle buttons control
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular, _) {
    'use strict';

    var thisModule = angular.module('pipToggleButtons', ['pipControls.Templates']);

    thisModule.directive('pipToggleButtons',
        function () {
            return {
                restrict: 'EA',
                scope: {
                    ngDisabled: '&',
                    buttons: '=pipButtons',
                    currentButtonValue: '=ngModel',
                    currentButton: '=?pipButtonObject',
                    change: '&ngChange'
                },
                templateUrl: 'toggle_buttons/toggle_buttons.html',
                controller: function ($scope, $element, $attrs, $mdMedia, $timeout) {
                    var index;

                    $scope.$mdMedia = $mdMedia;
                    $scope.class = $attrs.class || '';

                    if (!$scope.buttons || _.isArray($scope.buttons) && $scope.buttons.length === 0) {
                        $scope.buttons = [];
                    }

                    index = _.indexOf($scope.buttons, _.find($scope.buttons, {id: $scope.currentButtonValue}));
                    $scope.currentButtonIndex = index < 0 ? 0 : index;
                    $scope.currentButton = $scope.buttons.length > 0 ? $scope.buttons[$scope.currentButtonIndex]
                        : $scope.currentButton;

                    $scope.buttonSelected = function (index) {
                        if ($scope.disabled()) {
                            return;
                        }

                        $scope.currentButtonIndex = index;
                        $scope.currentButton = $scope.buttons[$scope.currentButtonIndex];
                        $scope.currentButtonValue = $scope.currentButton.id || index;

                        $timeout(function () {
                            if ($scope.change) {
                                $scope.change();
                            }
                        });
                    };

                    $scope.enterSpacePress = function (event) {
                        $scope.buttonSelected(event.index);
                    };

                    $scope.disabled = function () {
                        if ($scope.ngDisabled) {
                            return $scope.ngDisabled();
                        }
                    };
                },
                link: function (scope, elem) {
                    elem
                        .on('focusin', function () {
                            elem.addClass('focused-container');
                        })
                        .on('focusout', function () {
                            elem.removeClass('focused-container');
                        });
                }
            };
        }
    );

})(window.angular, window._);
