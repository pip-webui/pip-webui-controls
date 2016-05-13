/**
 * @file Toggle buttons control
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global _, angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipToggleButtons", ['pipBasicControls.Templates']);

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
                controller: 
                    function ($scope, $element, $attrs, $mdMedia, $timeout) {
                        $scope.$mdMedia = $mdMedia;
                        $scope.class = $attrs.class || '';

                        if (!$scope.buttons || (_.isArray($scope.buttons) && $scope.buttons.length === 0)) {
                            $scope.buttons = [];
                            console.error('PipToggleButtons: attribute pipButtons should take array of buttons');
                        }

                        var index = _.indexOf($scope.buttons, _.find($scope.buttons, {id: $scope.currentButtonValue}));
                        $scope.currentButtonIndex = index < 0 ? 0 : index;
                        $scope.currentButton = $scope.buttons.length > 0 ? $scope.buttons[$scope.currentButtonIndex] : $scope.currentButton;

                        $scope.buttonSelected = function (index, $event) {
                            if ($scope.disabled()) return;

                            $scope.currentButtonIndex = index;
                            $scope.currentButton = $scope.buttons[$scope.currentButtonIndex];
                            $scope.currentButtonValue = $scope.currentButton.id || index;

                            $timeout(function() {
                                $scope.$apply();

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
                link:
                    function (scope, elem, attr) {
                        elem
                            .on('focusin', function () {
                                elem.addClass('focused-container');
                            })
                            .on('focusout', function () {
                                elem.removeClass('focused-container')
                            })
                }
            };
        }
    );

})();