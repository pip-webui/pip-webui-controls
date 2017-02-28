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


class pipImageSliderController {
    private _$attrs;
    private _$interval;
    private _blocks;
    private _index;
    private _newIndex;
    private _direction;
    private _type;
    private DEFAULT_INTERVAL;
    private _interval;
    private _timePromises;
    private _throttled;
    swipeStart: number;
    sliderIndex: number;
    slideTo: Function;
    constructor($scope: ng.IScope, $element: any, $attrs: any, $parse: ng.IParseService, $timeout: angular.ITimeoutService, $interval: angular.IIntervalService, $pipImageSlider: any);
    nextBlock(): void;
    prevBlock(): void;
    slideToPrivate(nextIndex: number): void;
    private setIndex();
    private startInterval();
    private stopInterval();
    private restartInterval();
}

interface IImageSliderService {
    registerSlider(sliderId: string, sliderScope: any): void;
    removeSlider(sliderId: string): void;
    getSliderScope(sliderId: string): any;
    nextCarousel(nextBlock: any, prevBlock: any): void;
    prevCarousel(nextBlock: any, prevBlock: any): void;
    toBlock(type: string, blocks: any[], oldIndex: number, nextIndex: number, direction: string): void;
}
class ImageSliderService {
    private _$timeout;
    private ANIMATION_DURATION;
    private _sliders;
    constructor($timeout: angular.ITimeoutService);
    registerSlider(sliderId: string, sliderScope: any): void;
    removeSlider(sliderId: string): void;
    getSliderScope(sliderId: string): any;
    nextCarousel(nextBlock: any, prevBlock: any): void;
    prevCarousel(nextBlock: any, prevBlock: any): void;
    toBlock(type: string, blocks: any[], oldIndex: number, nextIndex: number, direction: string): void;
}



class RoutingController {
    private _image;
    logoUrl: string;
    showProgress: Function;
    constructor($scope: ng.IScope, $element: any);
    loadProgressImage(): void;
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

interface IPipToast {
    type: string;
    id: string;
    error: any;
    message: string;
    actions: string[];
    duration: number;
    successCallback: Function;
    cancelCallback: Function;
}
class ToastController {
    private _$mdToast;
    private _pipErrorDetailsDialog;
    message: string;
    actions: string[];
    toast: IPipToast;
    actionLenght: number;
    showDetails: boolean;
    constructor($mdToast: angular.material.IToastService, toast: IPipToast, $injector: any);
    onDetails(): void;
    onAction(action: any): void;
}
interface IToastService {
    showNextToast(): void;
    showToast(toast: IPipToast): void;
    addToast(toast: any): void;
    removeToasts(type: string): void;
    getToastById(id: string): IPipToast;
    removeToastsById(id: string): void;
    onClearToasts(): void;
    showNotification(message: string, actions: string[], successCallback: any, cancelCallback: any, id: string): any;
    showMessage(message: string, successCallback: any, cancelCallback: any, id?: string): any;
    showError(message: string, successCallback: any, cancelCallback: any, id: string, error: any): any;
    hideAllToasts(): void;
    clearToasts(type?: string): any;
}
class ToastService implements IToastService {
    private SHOW_TIMEOUT;
    private SHOW_TIMEOUT_NOTIFICATIONS;
    private toasts;
    private currentToast;
    private sounds;
    private _$mdToast;
    constructor($rootScope: ng.IRootScopeService, $mdToast: angular.material.IToastService);
    showNextToast(): void;
    showToast(toast: IPipToast): void;
    private showToastCancelResult(action);
    private showToastOkResult(action);
    addToast(toast: any): void;
    removeToasts(type: string): void;
    removeToastsById(id: string): void;
    getToastById(id: string): IPipToast;
    onStateChangeSuccess(): void;
    onClearToasts(): void;
    showNotification(message: string, actions: string[], successCallback: any, cancelCallback: any, id: string): void;
    showMessage(message: string, successCallback: any, cancelCallback: any, id?: string): void;
    showError(message: string, successCallback: any, cancelCallback: any, id: string, error: any): void;
    hideAllToasts(): void;
    clearToasts(type?: string): void;
}

}
