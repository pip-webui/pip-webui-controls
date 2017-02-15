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

export class PopoverController {
    private _$timeout;
    private _$scope;
    timeout: any;
    backdropElement: any;
    content: any;
    element: any;
    calcH: boolean;
    templateUrl: any;
    template: any;
    cancelCallback: Function;
    constructor($scope: ng.IScope, $rootScope: any, $element: any, $timeout: any, $compile: any);
    backdropClick(): void;
    closePopover(): void;
    onPopoverClick($e: any): void;
    private init();
    private position();
    private onResize();
    private calcHeight();
}

export class PopoverService {
    private _$timeout;
    private _$scope;
    private _$compile;
    private _$rootScope;
    popoverTemplate: string;
    constructor($compile: any, $rootScope: any, $timeout: any);
    show(p: any): void;
    hide(): void;
    resize(): void;
}


class ToastController {
    private _$mdToast;
    private _pipErrorDetailsDialog;
    message: string;
    actions: any[];
    toast: any;
    actionLenght: number;
    showDetails: boolean;
    constructor($mdToast: any, toast: any, $injector: any);
    onDetails(): void;
    onAction(action: any): void;
}
class ToastService {
    private SHOW_TIMEOUT;
    private SHOW_TIMEOUT_NOTIFICATIONS;
    private toasts;
    private currentToast;
    private sounds;
    private _$mdToast;
    private _pipErrorDetailsDialog;
    constructor($rootScope: any, $mdToast: any);
    showNextToast(): void;
    showToast(toast: any): void;
    private showToastCancelResult(action);
    private showToastOkResult(action);
    addToast(toast: any): void;
    removeToasts(type: any): void;
    removeToastsById(id: any): void;
    getToastById(id: any): any;
    onStateChangeSuccess(): void;
    onClearToasts(): void;
    showNotification(message: any, actions: any, successCallback: any, cancelCallback: any, id: any): void;
    showMessage(message: any, successCallback: any, cancelCallback: any, id: any): void;
    showError(message: any, successCallback: any, cancelCallback: any, id: any, error: any): void;
    hideAllToasts(): void;
    clearToasts(type?: any): void;
}

}
