{
    interface IColorPickerBindings {
        [key: string]: any;

        ngDisabled: any;
        colors: any;
        currentColor: any;
        colorChange: any;
    }

    interface IColorPickerAttributes extends ng.IAttributes {
        class: string;
    }

    const ColorPickerBindings: IColorPickerBindings = {
        ngDisabled: '<?ngDisabled',
        colors: '<pipColors',
        currentColor: '=ngModel',
        colorChange: '&?ngChange'
    }

    class ColorPickerChanges implements ng.IOnChangesObject, IColorPickerBindings {
        [key: string]: ng.IChangesObject < any > ;

        colorChange: ng.IChangesObject < () => ng.IPromise < any >> ;
        currentColor: any;

        ngDisabled: ng.IChangesObject < boolean > ;
        colors: ng.IChangesObject < string[] > ;
    }

    const DEFAULT_COLORS = ['purple', 'lightgreen', 'green', 'darkred', 'pink', 'yellow', 'cyan'];

    class ColorPickerController implements IColorPickerBindings {
        public class: string;
        public colors: string[];
        public currentColor: string;
        public currentColorIndex: number;
        public ngDisabled: boolean;
        public colorChange: Function;

        constructor(
            private $scope: ng.IScope,
            private $element: JQuery,
            $attrs: IColorPickerAttributes,
            private $timeout: ng.ITimeoutService
        ) { 
            this.class = $attrs.class || ''; 
        }

        public $onChanges(changes: ColorPickerChanges) {
            this.colors = changes.colors && _.isArray(changes.colors.currentValue) && changes.colors.currentValue.length !== 0 ?
                changes.colors.currentValue : DEFAULT_COLORS;
            this.currentColor = this.currentColor || this.colors[0];
            this.currentColorIndex = this.colors.indexOf(this.currentColor);

            this.ngDisabled = changes.ngDisabled.currentValue;
        }

        public selectColor(index: number) {
            if (this.ngDisabled) {
                return;
            }
            this.currentColorIndex = index;
            this.currentColor = this.colors[this.currentColorIndex];
            this.$timeout(() => {
                this.$scope.$apply();
            });

            if (this.colorChange) {
                this.colorChange();
            }
        };

        public enterSpacePress(event): void {
            this.selectColor(event.index);
        };

    }

    const pipColorPicker: ng.IComponentOptions = {
        bindings: ColorPickerBindings,
        templateUrl: 'color_picker/ColorPicker.html',
        controller: ColorPickerController
    }

    angular
        .module('pipColorPicker', ['pipControls.Templates'])
        .component('pipColorPicker', pipColorPicker);

}