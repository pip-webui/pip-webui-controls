/// <reference path="../../typings/tsd.d.ts" />

interface IImageSliderService {
    registerSlider(sliderId: string, sliderScope): void;
    removeSlider(sliderId: string): void;
    getSliderScope(sliderId: string);
    nextCarousel(nextBlock, prevBlock): void;
    prevCarousel(nextBlock, prevBlock): void;
    toBlock(type: string, blocks: any[], oldIndex: number, nextIndex: number, direction: string): void;
}

class ImageSliderService {
    private _$timeout: angular.ITimeoutService;
    private ANIMATION_DURATION: number = 550;
    private _sliders = {};

    constructor($timeout: angular.ITimeoutService) {
        this._$timeout = $timeout;
    }

    public registerSlider(sliderId: string, sliderScope): void {
        this._sliders[sliderId] = sliderScope;
    }
            
    public removeSlider(sliderId: string): void {
        delete this._sliders[sliderId];
    }

    public getSliderScope(sliderId: string) {
        return this._sliders[sliderId];
    }

    public nextCarousel(nextBlock, prevBlock): void {
        nextBlock.addClass('pip-next');
                
        this._$timeout(() => {
            nextBlock.addClass('animated').addClass('pip-show').removeClass('pip-next');
            prevBlock.addClass('animated').removeClass('pip-show');
        }, 100);
    }

    public prevCarousel(nextBlock, prevBlock): void {
        this._$timeout(() => {
            nextBlock.addClass('animated').addClass('pip-show');
            prevBlock.addClass('animated').addClass('pip-next').removeClass('pip-show');
        }, 100);
    }

    public toBlock(type: string, blocks: any[], oldIndex: number, nextIndex: number, direction: string): void {
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
