/**
 * @file Image slider control
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global _, angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipImageSlider", []);

    thisModule.directive('pipImageSlider',
        function () {
            return {
                scope: false,
                controller: function ($scope, $element, $attrs, $parse, $timeout, $interval, $pipImageSlider/*, $swipe*/) {
                    var blocks,
                        indexSetter = $parse($attrs.pipImageSliderIndex).assign,
                        index = 0, newIndex,
                        direction,
                        type = $parse($attrs.pipAnimationType)($scope),
                        DEFAULT_INTERVAL = 4500,
                        interval = $parse($attrs.pipAnimationInterval)($scope),
                        timePromises;

                    $element.addClass('pip-image-slider');
                    $element.addClass('pip-animation-' + type);

                    $scope.swipeStart = 0;
/*
                    if ($swipe)
                        $swipe.bind($element, {
                            'start': function(coords) {
                                if (coords) $scope.swipeStart = coords.x;
                                else $scope.swipeStart = 0;
                                console.log('function1', coords);
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
                        if (blocks.length > 0) $(blocks[0]).addClass('pip-show');
                    });

                    startInterval();

                    var throttled = _.throttle(function () {
                        $pipImageSlider.toBlock(type, blocks, index, newIndex, direction);
                        index = newIndex;
                        setIndex();
                    }, 600);

                    $scope.nextBlock = function() {
                        restartInterval();
                        newIndex = index + 1 == blocks.length ? 0 : index + 1;
                        direction = 'next';
                        throttled();
                    };

                    $scope.prevBlock = function() {
                        restartInterval();
                        newIndex = index - 1 < 0 ? blocks.length - 1 : index - 1;
                        direction = 'prev';
                        throttled();
                    };

                    $scope.slideTo = function (nextIndex) {
                        if (nextIndex == index || nextIndex > blocks.length - 1) return;

                        restartInterval();
                        newIndex = nextIndex;
                        direction = nextIndex > index ? 'next' : 'prev';
                        throttled();
                    };

                    function setIndex() {
                        if (indexSetter) indexSetter($scope, index);
                    }

                    function startInterval() {
                        timePromises = $interval(function () {
                            newIndex = index + 1 == blocks.length ? 0 : index + 1;
                            direction = 'next';
                            throttled();
                        }, interval || DEFAULT_INTERVAL);
                    }

                    function stopInterval() {
                        $interval.cancel(timePromises);
                    }

                    $element.on('$destroy', function() {
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

    thisModule.directive('pipSliderButton',
        function () {
            return {
                scope: {},
                controller: function ($scope, $element, $parse, $attrs) {
                    var type = $parse($attrs.pipButtonType)($scope),
                        sliderId = $parse($attrs.pipSliderId)($scope);

                    $element.on('click', function () {
                        if (!sliderId || !type) return;

                        angular.element(document.getElementById(sliderId)).scope()[type + 'Block']();
                    });
                }
            }
        }
    );

    thisModule.directive('pipSliderIndicator',
        function () {
            return {
                scope: false,
                controller: function ($scope, $element, $parse, $attrs) {
                    var sliderId = $parse($attrs.pipSliderId)($scope),
                        slideTo = $parse($attrs.pipSlideTo)($scope);

                    $element.css('cursor', 'pointer');
                    $element.on('click', function () {
                        if (!sliderId || (slideTo && slideTo < 0)) return;

                        angular.element(document.getElementById(sliderId)).scope().slideTo(slideTo);
                    });
                }
            }
        }
    );

    thisModule.service('$pipImageSlider',
        function ($timeout) {

            var ANIMATION_DURATION = 550;

            return {
                nextCarousel: nextCarousel,
                prevCarousel: prevCarousel,
                toBlock: toBlock
            };

            function nextCarousel(nextBlock, prevBlock) {
                nextBlock.removeClass('animated').addClass('pip-next');

                $timeout(function () {
                    nextBlock.addClass('animated').addClass('pip-show').removeClass('pip-next');
                    prevBlock.addClass('animated').removeClass('pip-show');
                }, 100);
            }

            function prevCarousel (nextBlock, prevBlock) {
                nextBlock.removeClass('animated');

                $timeout(function () {
                    nextBlock.addClass('animated').addClass('pip-show');
                    prevBlock.addClass('animated').addClass('pip-next').removeClass('pip-show');

                    $timeout(function () {
                        prevBlock.removeClass('pip-next').removeClass('animated');
                    }, ANIMATION_DURATION - 100);
                }, 100);
            }

            function toBlock(type, blocks, oldIndex, nextIndex, direction) {
                var prevBlock = $(blocks[oldIndex]),
                    blockIndex = nextIndex;
                var nextBlock = $(blocks[blockIndex]);

                if (type == 'carousel') {
                    $(blocks).removeClass('pip-next').removeClass('pip-prev');

                    if (direction && direction == 'prev')
                        prevCarousel(nextBlock, prevBlock);
                    else {
                        if (direction && direction == 'next') {
                            nextCarousel(nextBlock, prevBlock);
                        } else {
                            if (nextIndex && nextIndex < oldIndex)
                                prevCarousel(nextBlock, prevBlock);
                            else
                                nextCarousel(nextBlock, prevBlock);
                        }
                    }
                } else {
                    prevBlock.addClass('animated').removeClass('pip-show');
                    nextBlock.addClass('animated').addClass('pip-show');
                }
            }
        }
    );

})();
