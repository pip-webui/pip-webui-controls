/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('appComponentsStyles.RefExpander', []);

    thisModule.controller('RefExpanderController',
        function($scope, $mdDialog) {

            $scope.item = {
                name: 'Name parent goal or vision',
                status1: 'Status1',
                status2: 'Status2'
            };

            $scope.item1 = {
                name: 'Intrinsicly transform virtual methodologies after granular niche markets. Assertively customize team building total linkage after inexpensive core competencies. Holisticly redefine 2.0 supply chains whereas best-of-breed "outside the box" thinking.',
                status1: 'Authoritatively expedite real-time methodologies after alternative synergy. Appropriately predominate backend Authoritatively expedite real-time methodologies after alternative synergy. Appropriately predominate backend ',
                status2: 'Status2'
            };

            $scope.showAlert = function (ev) {
                // Appending dialog to document.body to cover sidenav in docs app
                // Modal dialogs should fully cover application
                // to prevent interaction outside of dialog
                $mdDialog.show(
                    $mdDialog.alert()
                        .parent(angular.element(document.querySelector('#popupContainer')))
                        .clickOutsideToClose(true)
                        .title('Open avatar link')
                        .textContent('you are wonderful')
                        .ariaLabel('Alert Dialog Demo')
                        .ok('Got it!')
                        .targetEvent(ev)
                );
            }
        })

})();
