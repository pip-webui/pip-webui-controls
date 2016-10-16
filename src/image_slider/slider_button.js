/**
 * @file Image slider button
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular, _, $) {
    'use strict';

    var thisModule = angular.module('pipSliderButton', []);

    thisModule.directive('pipSliderButton',
        function () {
            return {
                scope: {},
                controller: function ($scope, $element, $parse, $attrs) {
                    var type = $parse($attrs.pipButtonType)($scope),
                        sliderId = $parse($attrs.pipSliderId)($scope);

                    $element.on('click', function () {
                        if (!sliderId || !type) {
                            return;
                        }

                        angular.element(document.getElementById(sliderId)).scope()[type + 'Block']();
                    });
                }
            };
        }
    );

})(window.angular, window._, window.jQuery);
