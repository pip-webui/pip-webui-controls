/// <reference path="../../typings/tsd.d.ts" />

import {
    IImageSliderService
} from './image_slider_service';

{
    class SliderIndicatorController implements ng.IController {
        public direction: Function;
        public sliderId: Function;

        constructor(
            $element: JQuery,
            pipImageSlider: IImageSliderService
        ) {
            $element.css('cursor', 'pointer');
            $element.on('click', () => {
                if (!this.sliderId() || !this.direction()) {
                    return;
                }

                pipImageSlider.getSliderScope(this.sliderId()).vm[this.direction() + 'Block']();
            });
        }
    }

    const SliderIndicator = function (): ng.IDirective {
        return {
            scope: {
                direction: '&pipButtonType',
                sliderId: '&pipSliderId'
            },
            controller: SliderIndicatorController
        }
    }

    angular.module('pipSliderIndicator', [])
        .directive('pipSliderIndicator', SliderIndicator);
}