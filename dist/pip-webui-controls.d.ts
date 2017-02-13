declare module pip.controls {

export class ColorPickerController {
    private _$timeout;
    private _$scope;
    class: string;
    colors: string[];
    currentColor: string;
    currentColorIndex: number;
    ngDisabled: Function;
    colorChange: Function;
    constructor($scope: any, $element: any, $attrs: any, $timeout: any);
    disabled(): any;
    selectColor(index: any): void;
    enterSpacePress(event: any): void;
}






var marked: any;





}
