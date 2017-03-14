import { IImageSliderService } from './IImageSliderService';

{
    class ImageSliderService implements IImageSliderService {
        private ANIMATION_DURATION: number = 550;
        private _sliders: Object = {};

        constructor(
            private $timeout: angular.ITimeoutService
        ) {}

        public registerSlider(sliderId: string, sliderScope: ng.IScope): void {
            this._sliders[sliderId] = sliderScope;
        }

        public removeSlider(sliderId: string): void {
            delete this._sliders[sliderId];
        }

        public getSliderScope(sliderId: string) {
            return this._sliders[sliderId];
        }

        public nextCarousel(nextBlock: JQuery, prevBlock: JQuery): void {
            nextBlock.addClass('pip-next');

            this.$timeout(() => {
                nextBlock.addClass('animated').addClass('pip-show').removeClass('pip-next');
                prevBlock.addClass('animated').removeClass('pip-show');
            }, 100);
        }

        public prevCarousel(nextBlock: JQuery, prevBlock: JQuery): void {
            this.$timeout(() => {
                nextBlock.addClass('animated').addClass('pip-show');
                prevBlock.addClass('animated').addClass('pip-next').removeClass('pip-show');
            }, 100);
        }

        public toBlock(type: string, blocks: any[], oldIndex: number, nextIndex: number, direction: string): void {
            const prevBlock = $(blocks[oldIndex]),
                blockIndex = nextIndex,
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

    angular
        .module('pipImageSlider.Service', [])
        .service('pipImageSlider', ImageSliderService);
}