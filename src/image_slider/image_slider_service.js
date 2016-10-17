/**
 * @file Image slider service
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular, _, $) {
    'use strict';

    var thisModule = angular.module('pipImageSlider.Service', []);

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

            function prevCarousel(nextBlock, prevBlock) {
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
                    blockIndex = nextIndex,
                    nextBlock = $(blocks[blockIndex]);

                if (type === 'carousel') {
                    $(blocks).removeClass('pip-next').removeClass('pip-prev');

                    if (direction && direction === 'prev') {
                        prevCarousel(nextBlock, prevBlock);
                    }
                    if (direction && direction === 'next') {
                        nextCarousel(nextBlock, prevBlock);
                    }
                    if ((!direction || direction !== 'next' && direction !== 'prev') &&
                        nextIndex && nextIndex < oldIndex) {
                        prevCarousel(nextBlock, prevBlock);
                    } else {
                        nextCarousel(nextBlock, prevBlock);
                    }
                } else {
                    prevBlock.addClass('animated').removeClass('pip-show');
                    nextBlock.addClass('animated').addClass('pip-show');
                }
            }
        }
    );

})(window.angular, window._, window.jQuery);