/// <reference path="../../typings/tsd.d.ts" />

class ImageSliderService {
    private _$timeout: angular.ITimeoutService;
    private ANIMATION_DURATION: number = 550;
    private _sliders = {};

    constructor($timeout: angular.ITimeoutService) {
        this._$timeout = $timeout;
    }

    public registerSlider(sliderId: string, sliderScope) {
        this._sliders[sliderId] = sliderScope;
    }
            
    public removeSlider(sliderId: string) {
        delete this._sliders[sliderId];
    }

    public getSliderScope(sliderId: string) {
        return this._sliders[sliderId];
    }

    public nextCarousel(nextBlock, prevBlock) {
        nextBlock.addClass('pip-next');
                
        this._$timeout(() => {
            nextBlock.addClass('animated').addClass('pip-show').removeClass('pip-next');
            prevBlock.addClass('animated').removeClass('pip-show');
        }, 100);
    }

    public prevCarousel(nextBlock, prevBlock) {
        this._$timeout(() => {
            nextBlock.addClass('animated').addClass('pip-show');
            prevBlock.addClass('animated').addClass('pip-next').removeClass('pip-show');
        }, 100);
    }

    public toBlock(type: string, blocks: any[], oldIndex: number, nextIndex: number, direction: string) {
        let prevBlock = $(blocks[oldIndex]),
            blockIndex: number = nextIndex,
            nextBlock = $(blocks[blockIndex]);

        if (type === 'carousel') {
            $(blocks).removeClass('pip-next').removeClass('pip-prev').removeClass('animated');

            if (direction && (direction === 'prev' || direction === 'next')) {
                if (direction === 'prev') {
                    this.prevCarousel(nextBlock, prevBlock);
                } else {
                    this.nextCarousel(nextBlock, prevBlock);
                }
            } else {
                if (nextIndex && nextIndex < oldIndex) {
                    this.prevCarousel(nextBlock, prevBlock);
                } else {
                    this.nextCarousel(nextBlock, prevBlock);
                }
            }
        } else {
            prevBlock.addClass('animated').removeClass('pip-show');
            nextBlock.addClass('animated').addClass('pip-show');
        }
    }

}


(() => {
    'use strict';
    angular
        .module('pipImageSlider.Service', [])
        .service('$pipImageSlider', ImageSliderService);

})();
