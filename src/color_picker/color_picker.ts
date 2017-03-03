export interface IColorPicker {
    class: string;
    colors: string[];
    currentColor: string;
    currentColorIndex: number;
    ngDisabled: Function;
    colorChange: Function;

    enterSpacePress(event): void;
    disabled(): boolean;
    selectColor(index: number);
}

const DEFAULT_COLORS = ['purple', 'lightgreen', 'green', 'darkred', 'pink', 'yellow', 'cyan'];

export class ColorPickerController implements IColorPicker {

    private _$timeout;
    private _$scope: ng.IScope;

    public class: string;
    public colors: string[];
    public currentColor: string;
    public currentColorIndex: number;
    public ngDisabled: Function;
    public colorChange: Function;

    constructor(
        $scope: ng.IScope,
        $element,
        $attrs,
        $timeout) {
        this._$timeout = $timeout;
        this._$scope = $scope;

        this.class = $attrs.class || '';
        this.colors = !$scope['vm']['colors'] || 
                _.isArray($scope['vm']['colors']) && $scope['vm']['colors'].length === 0 ? DEFAULT_COLORS : $scope['vm']['colors'];
        this.colorChange = $scope['vm']['colorChange'] || null;
        this.currentColor = $scope['vm']['currentColor'] || this.colors[0];
        this.currentColorIndex = this.colors.indexOf(this.currentColor);
        this.ngDisabled = $scope['vm']['ngDisabled'] || false;
    }

    public $onChanges(changes: any) {
        this.colors = _.isArray(changes['colors'].currentValue) && changes['colors'].currentValue.length !== 0 ? 
            changes['colors'].currentValue : DEFAULT_COLORS;
        this.currentColor = changes['currentColor'].currentValue || this.colors[0];
    }

    public disabled(): boolean {
        if (this.ngDisabled) {
            return true;
        }

        return false;
    };

    public selectColor(index: number) {
        if (this.disabled()) {
            return;
        }
        this.currentColorIndex = index;
        this.currentColor = this.colors[this.currentColorIndex];
        this._$timeout(() => {
            this._$scope.$apply();
        });

        if (this.colorChange) {
            this.colorChange();
        }
    };

    public enterSpacePress(event): void {
        this.selectColor(event.index);
    };

}

const pipColorPicker = {
    bindings: {
        ngDisabled: '<?ngDisabled',
        colors: '<pipColors',
        currentColor: '=ngModel',
        colorChange: '<?ngChange'
    },
    templateUrl: 'color_picker/color_picker.html',
    controller: ColorPickerController,
    controllerAs: 'vm'
}

angular
    .module('pipColorPicker', ['pipControls.Templates'])
    .component('pipColorPicker', pipColorPicker);