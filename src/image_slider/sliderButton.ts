import { IImageSliderService } from './IImageSliderService';

{
    class SliderButtonController implements ng.IController {
        public direction: Function;
        public sliderId: Function;

        constructor(
            $element: JQuery,
            pipImageSlider: IImageSliderService
        ) {
            $element.on('click', () => {
                if (!this.sliderId() || !this.direction()) {
                    return;
                }

                pipImageSlider.getSliderScope(this.sliderId()).vm[this.direction() + 'Block']();
            });
        }
    }

    const SliderButton = function (): ng.IDirective {
        return {
            scope: {
                direction: '&pipButtonType',
                sliderId: '&pipSliderId'
            },
            controllerAs: '$ctlr',
            bindToController: true,
            controller: SliderButtonController
        };
    }

    angular
        .module('pipSliderButton', [])
        .directive('pipSliderButton', SliderButton);

}