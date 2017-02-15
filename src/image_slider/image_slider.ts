/// <reference path="../../typings/tsd.d.ts" />

(() => {
    'use strict';

    var thisModule = angular.module('pipImageSlider', ['pipSliderButton', 'pipSliderIndicator', 'pipImageSlider.Service']);

    thisModule.directive('pipImageSlider',
        function () {
            return {
                scope: {
                    sliderIndex: '=pipImageIndex'
                },
                controller: function ($scope, $element, $attrs, $parse, $timeout, $interval, $pipImageSlider) {
                    var blocks,
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
                     });*/
                     
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
                    }, 700);

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
                    
                    if ($attrs.id) $pipImageSlider.registerSlider($attrs.id, $scope);

                    function setIndex() {
                        if ($attrs.pipImageIndex) $scope.sliderIndex = index;
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
                        $pipImageSlider.removeSlider($attrs.id);
                    });

                    function restartInterval() {
                        stopInterval();
                        startInterval();
                    }
                }
            };
        }
    );

})();


/*
class pipImageSlider{

    private _$attrs;
    private _$interval: angular.IIntervalService;

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

    constructor(
        $scope: ng.IScope, 
        $element, 
        $attrs, 
        $parse, 
        $timeout: angular.ITimeoutService,
        $interval: angular.IIntervalService, 
        $pipImageSlider) {

        this.sliderIndex = $scope['sliderIndex'];
        this._type = $parse($attrs.pipAnimationType)($scope),
        this._interval = $parse($attrs.pipAnimationInterval)($scope);
        this._$attrs = $attrs;
        this._$interval = $interval;

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
            $pipImageSlider.toBlock(this._type, this._blocks, this._index, this._newIndex, this._direction);
            this._index = this._newIndex;
            this.setIndex();
        }, 700);
        
        if ($attrs.id) { $pipImageSlider.registerSlider($attrs.id, $scope) }

        $element.on('$destroy', () => {
            this.stopInterval();
            $pipImageSlider.removeSlider($attrs.id);
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

    public slideTo(nextIndex: number) {
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
            restrict: 'EA',
            replace: true,
            scope: {
                sliderIndex: '=pipImageIndex'
            },
            controller: pipImageSlider,
            controllerAs: 'vm'
        };
    }


    angular
        .module('pipImageSlider', ['pipSliderButton', 'pipSliderIndicator', 'pipImageSlider.Service'])
        .directive('pipImageSlider', pipImageSlider);

})();*/
