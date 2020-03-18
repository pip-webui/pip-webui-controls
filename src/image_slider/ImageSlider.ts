import { IImageSliderService } from './IImageSliderService';

{
    class pipImageSliderController implements ng.IController {
        private _blocks: any[];
        private _index: number = 0;
        private _newIndex: number;
        private _direction: string;
        private _type: string;
        private DEFAULT_INTERVAL: number = 4500;
        private _interval: number | string;
        private _timePromises;
        private _throttled: Function;

        public swipeStart: number = 0;
        public sliderIndex: number;
        public slideTo: Function;
        public type: Function;
        public interval: Function;

        constructor(
            private $scope: ng.IScope,
            private $element: JQuery,
            private $attrs,
            private $parse: ng.IParseService,
            private $timeout: angular.ITimeoutService,
            private $interval: angular.IIntervalService,
            private pipImageSlider: IImageSliderService
        ) {
            "ngInject";

            //this.sliderIndex = $scope['vm']['sliderIndex'];
            this._type = this.type();
            this._interval = this.interval();
            this.slideTo = this.slideToPrivate;

            $element.addClass('pip-image-slider');
            $element.addClass('pip-animation-' + this._type);

            this.setIndex();

            $timeout(() => {
                this._blocks = <any>$element.find('.pip-animation-block');
                if (this._blocks.length > 0) {
                    $(this._blocks[0]).addClass('pip-show');
                }
            });

            this.startInterval();

            this._throttled = _.throttle(() => {
                pipImageSlider.toBlock(this._type, this._blocks, this._index, this._newIndex, this._direction);
                this._index = this._newIndex;
                this.setIndex();
            }, 700);

            if ($attrs.id) {
                pipImageSlider.registerSlider($attrs.id, $scope)
            }

            $scope.$on('$destroy', () => {
                this.stopInterval();
                pipImageSlider.removeSlider($attrs.id);
            });

        }

        $onInit() { }

        public nextBlock() {
            this.restartInterval();
            this._newIndex = this._index + 1 === this._blocks.length ? 0 : this._index + 1;
            this._direction = 'next';
            this._throttled();
        }

        public prevBlock() {
            this.restartInterval();
            this._newIndex = this._index - 1 < 0 ? this._blocks.length - 1 : this._index - 1;
            this._direction = 'prev';
            this._throttled();
        }

        private slideToPrivate(nextIndex: number) {
            if (nextIndex === this._index || nextIndex > this._blocks.length - 1) {
                return;
            }

            this.restartInterval();
            this._newIndex = nextIndex;
            this._direction = nextIndex > this._index ? 'next' : 'prev';
            this._throttled();
        }

        private setIndex() {
            if (this.$attrs.pipImageIndex) this.sliderIndex = this._index;
        }

        private startInterval() {
            this._timePromises = this.$interval(() => {
                this._newIndex = this._index + 1 === this._blocks.length ? 0 : this._index + 1;
                this._direction = 'next';
                this._throttled();
            }, Number(this._interval || this.DEFAULT_INTERVAL));
        }

        private stopInterval() {
            this.$interval.cancel(this._timePromises);
        }

        private restartInterval() {
            this.stopInterval();
            this.startInterval();
        }
    }

    const ImageSlider = function (): ng.IDirective {
        return {
            scope: {
                sliderIndex: '=pipImageIndex',
                type: '&pipAnimationType',
                interval: '&pipAnimationInterval'
            },
            bindToController: true,
            controller: pipImageSliderController,
            controllerAs: 'vm'
        };
    }

    angular.module('pipImageSlider')
        .directive('pipImageSlider', ImageSlider);
}