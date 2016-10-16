/**
 * @file Image slider control
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular, _, $) {
    'use strict';

    var thisModule = angular.module('pipImageSlider', ['pipSliderButton', 'pipSliderIndicator', 'pipImageSlider.Service']);

    thisModule.directive('pipImageSlider',
        function () {
            return {
                scope: false,
                controller: function ($scope, $element, $attrs, $parse, $timeout, $interval, $pipImageSlider) {
                    var blocks,
                        indexSetter = $parse($attrs.pipImageSliderIndex).assign,
                        index = 0, newIndex,
                        direction,
                        type = $parse($attrs.pipAnimationType)($scope),
                        DEFAULT_INTERVAL = 4500,
                        interval = $parse($attrs.pipAnimationInterval)($scope),
                        timePromises,
                        throttled;

                    $element.addClass('pip-image-slider');
                    $element.addClass('pip-animation-' + type);

                    $scope.swipeStart = 0;
                    /*
                     if ($swipe)
                     $swipe.bind($element, {
                     'start': function(coords) {
                     if (coords) $scope.swipeStart = coords.x;
                     else $scope.swipeStart = 0;
                     },
                     'end': function(coords) {
                     var delta;
                     if (coords) {
                     delta = $scope.swipeStart - coords.x;
                     if (delta > 150)  $scope.nextBlock();
                     if (delta < -150)  $scope.prevBlock();
                     $scope.swipeStart = 0;
                     } else $scope.swipeStart = 0;
                     }
                     });
                     */
                    setIndex();

                    $timeout(function () {
                        blocks = $element.find('.pip-animation-block');
                        if (blocks.length > 0) {
                            $(blocks[0]).addClass('pip-show');
                        }
                    });

                    startInterval();
                    throttled = _.throttle(function () {
                        $pipImageSlider.toBlock(type, blocks, index, newIndex, direction);
                        index = newIndex;
                        setIndex();
                    }, 600);

                    $scope.nextBlock = function () {
                        restartInterval();
                        newIndex = index + 1 === blocks.length ? 0 : index + 1;
                        direction = 'next';
                        throttled();
                    };

                    $scope.prevBlock = function () {
                        restartInterval();
                        newIndex = index - 1 < 0 ? blocks.length - 1 : index - 1;
                        direction = 'prev';
                        throttled();
                    };

                    $scope.slideTo = function (nextIndex) {
                        if (nextIndex === index || nextIndex > blocks.length - 1) {
                            return;
                        }

                        restartInterval();
                        newIndex = nextIndex;
                        direction = nextIndex > index ? 'next' : 'prev';
                        throttled();
                    };

                    function setIndex() {
                        if (indexSetter) {
                            indexSetter($scope, index);
                        }
                    }

                    function startInterval() {
                        timePromises = $interval(function () {
                            newIndex = index + 1 === blocks.length ? 0 : index + 1;
                            direction = 'next';
                            throttled();
                        }, interval || DEFAULT_INTERVAL);
                    }

                    function stopInterval() {
                        $interval.cancel(timePromises);
                    }

                    $element.on('$destroy', function () {
                        stopInterval();
                    });

                    function restartInterval() {
                        stopInterval();
                        startInterval();
                    }
                }
            };
        }
    );

})(window.angular, window._, window.jQuery);
