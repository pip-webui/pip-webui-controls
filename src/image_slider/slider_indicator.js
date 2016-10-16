/**
 * @file Slider indicator
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular, _, $) {
    'use strict';

    var thisModule = angular.module('pipSliderIndicator', []);

    thisModule.directive('pipSliderIndicator',
        function () {
            return {
                scope: false,
                controller: function ($scope, $element, $parse, $attrs) {
                    var sliderId = $parse($attrs.pipSliderId)($scope),
                        slideTo = $parse($attrs.pipSlideTo)($scope);

                    $element.css('cursor', 'pointer');
                    $element.on('click', function () {
                        if (!sliderId || slideTo && slideTo < 0) {
                            return;
                        }

                        angular.element(document.getElementById(sliderId)).scope().slideTo(slideTo);
                    });
                }
            };
        }
    );

})(window.angular, window._, window.jQuery);
