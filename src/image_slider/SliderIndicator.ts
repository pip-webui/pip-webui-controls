import { IImageSliderService } from './IImageSliderService';

{
    class SliderIndicatorController implements ng.IController {
        public slideTo: Function;
        public sliderId: Function;

        constructor(
            $element: JQuery,
            pipImageSlider: IImageSliderService
        ) {
            "ngInject";
            $element.css('cursor', 'pointer');
            $element.on('click', () => {
                if (!this.sliderId() || this.slideTo() === undefined) {
                    return;
                }

                pipImageSlider.getSliderScope(this.sliderId()).vm.slideTo(this.slideTo());
            });
        }

        $onInit() { }
    }

    const SliderIndicator = function (): ng.IDirective {
        return {
            scope: {
                slideTo: '&pipSlideTo',
                sliderId: '&pipSliderId'
            },
            controllerAs: '$ctlr',
            bindToController: true,
            controller: SliderIndicatorController
        }
    }

    angular
        .module('pipSliderIndicator', ['pipImageSlider.Service'])
        .directive('pipSliderIndicator', SliderIndicator);
}