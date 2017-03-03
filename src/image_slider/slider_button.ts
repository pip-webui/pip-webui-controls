/// <reference path="../../typings/tsd.d.ts" />

(() => {
    'use strict';

    var thisModule = angular.module('pipSliderButton', []);

    thisModule.directive('pipSliderButton',
        function () {
            return {
                scope: {},
                controller: function ($scope, $element, $parse, $attrs, pipImageSlider) {
                    var type = $parse($attrs.pipButtonType)($scope),
                        sliderId = $parse($attrs.pipSliderId)($scope);

                    $element.on('click', () => {
                        if (!sliderId || !type) {
                            return;
                        }

                        pipImageSlider.getSliderScope(sliderId).vm[type + 'Block']();
                    });
                }
            };
        }
    );

})();
