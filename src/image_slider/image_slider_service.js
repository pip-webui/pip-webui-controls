/**
 * @file Image slider service
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular, _, $) {
    'use strict';

    var thisModule = angular.module('pipImageSlider.Service', []);

    thisModule.service('$pipImageSlider',
        function ($timeout) {

            var ANIMATION_DURATION = 550,
                sliders = {};

            return {
                nextCarousel: nextCarousel,
                prevCarousel: prevCarousel,
                toBlock: toBlock,
                registerSlider: register,
                removeSlider: remove,
                getSliderScope: getSlider
            };

            function register(sliderId, sliderScope) {
                sliders[sliderId] = sliderScope;
            }
            
            function remove(sliderId) {
                delete sliders[sliderId];
            }

            function getSlider(sliderId) {
                return sliders[sliderId];
            }

            function nextCarousel(nextBlock, prevBlock) {
                nextBlock.addClass('pip-next');
                
                $timeout(function () {
                    nextBlock.addClass('animated').addClass('pip-show').removeClass('pip-next');
                    prevBlock.addClass('animated').removeClass('pip-show');
                }, 100);
            }

            function prevCarousel(nextBlock, prevBlock) {
                $timeout(function () {
                    nextBlock.addClass('animated').addClass('pip-show');
                    prevBlock.addClass('animated').addClass('pip-next').removeClass('pip-show');
                }, 100);
            }

            function toBlock(type, blocks, oldIndex, nextIndex, direction) {
                var prevBlock = $(blocks[oldIndex]),
                    blockIndex = nextIndex,
                    nextBlock = $(blocks[blockIndex]);

                if (type === 'carousel') {
                    $(blocks).removeClass('pip-next').removeClass('pip-prev').removeClass('animated');

                    if (direction && (direction === 'prev' || direction === 'next')) {
                        if (direction === 'prev') {
                            prevCarousel(nextBlock, prevBlock);
                        } else {
                            nextCarousel(nextBlock, prevBlock);
                        }
                    } else {
                        if (nextIndex && nextIndex < oldIndex) {
                            prevCarousel(nextBlock, prevBlock);
                        } else {
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

})(window.angular, window._, window.jQuery);
