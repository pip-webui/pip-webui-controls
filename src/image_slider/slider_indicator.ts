/// <reference path="../../typings/tsd.d.ts" />

(function () {
    'use strict';

    var thisModule = angular.module('pipSliderIndicator', []);

    thisModule.directive('pipSliderIndicator',
        function () {
            return {
                scope: false,
                controller: ($scope, $element, $parse, $attrs, pipImageSlider) => {
                    var sliderId = $parse($attrs.pipSliderId)($scope),
                        slideTo = $parse($attrs.pipSlideTo)($scope);

                    $element.css('cursor', 'pointer');
                    $element.on('click',  () => {
                        if (!sliderId || slideTo && slideTo < 0) {
                            return;
                        }
                        pipImageSlider.getSliderScope(sliderId).vm.slideToPrivate(slideTo);
                    });
                }
            };
        }
    );

})();
