declare module pip.controls {

export interface IColorPicker {
    class: string;
    colors: string[];
    currentColor: string;
    currentColorIndex: number;
    ngDisabled: Function;
    colorChange: Function;
    enterSpacePress(event: any): void;
    disabled(): boolean;
    selectColor(index: number): any;
}
export class ColorPickerController implements IColorPicker {
    private _$timeout;
    private _$scope;
    class: string;
    colors: string[];
    currentColor: string;
    currentColorIndex: number;
    ngDisabled: Function;
    colorChange: Function;
    constructor($scope: ng.IScope, $element: any, $attrs: any, $timeout: any);
    disabled(): boolean;
    selectColor(index: number): void;
    enterSpacePress(event: any): void;
}






var marked: any;





}
