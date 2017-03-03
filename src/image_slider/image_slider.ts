/// <reference path="../../typings/tsd.d.ts" />

class pipImageSliderController{

    private _$attrs;
    private _$interval: angular.IIntervalService;
    private _$scope: angular.IScope;

    private _blocks: any[];
    private _index: number = 0;
    private _newIndex: number;
    private _direction: string;
    private _type: any;
    private DEFAULT_INTERVAL = 4500;
    private _interval;
    private _timePromises;
    private _throttled: Function;

    public swipeStart: number = 0;
    public sliderIndex: number;
    public slideTo: Function;

    constructor(
        $scope: ng.IScope, 
        $element, 
        $attrs, 
        $parse: ng.IParseService, 
        $timeout: angular.ITimeoutService,
        $interval: angular.IIntervalService, 
        pipImageSlider) {

        this.sliderIndex = $scope['vm']['sliderIndex'];
        this._type = $scope['vm']['type']();
        this._interval = $scope['vm']['interval']();
        this._$attrs = $attrs;
        this._$interval = $interval;
        this._$scope = $scope;
        $scope['slideTo'] = this.slideToPrivate;

        $element.addClass('pip-image-slider');
        $element.addClass('pip-animation-' + this._type);
        
        this.setIndex();

        $timeout(() => {
            this._blocks = $element.find('.pip-animation-block');
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
        
        if ($attrs.id) { pipImageSlider.registerSlider($attrs.id, $scope) }

        $element.on('$destroy', () => {
            this.stopInterval();
            pipImageSlider.removeSlider($attrs.id);
        });

    }

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
        if (this._$attrs.pipImageIndex) this.sliderIndex = this._index;
    }

    private startInterval() {
        this._timePromises = this._$interval(() => {
            this._newIndex = this._index + 1 === this._blocks.length ? 0 : this._index + 1;
            this._direction = 'next';
            this._throttled();
        }, this._interval || this.DEFAULT_INTERVAL);
    }

    private stopInterval() {
        this._$interval.cancel(this._timePromises);
    }

    private restartInterval() {
        this.stopInterval();
        this.startInterval();
    }
}

(() => {

    function pipImageSlider() {
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


    angular
        .module('pipImageSlider', ['pipSliderButton', 'pipSliderIndicator', 'pipImageSlider.Service'])
        .directive('pipImageSlider', pipImageSlider);
})();
