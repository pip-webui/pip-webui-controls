declare module pip.controls {



export interface IImageSliderService {
    registerSlider(sliderId: string, sliderScope: any): void;
    removeSlider(sliderId: string): void;
    getSliderScope(sliderId: string): any;
    nextCarousel(nextBlock: any, prevBlock: any): void;
    prevCarousel(nextBlock: any, prevBlock: any): void;
    toBlock(type: string, blocks: any[], oldIndex: number, nextIndex: number, direction: string): void;
}






var marked: any;

export interface IPopoverService {
    show(p: Object): void;
    hide(): void;
    resize(): void;
}





export interface IToastService {
    showNextToast(): void;
    showToast(toast: Toast): void;
    addToast(toast: any): void;
    removeToasts(type: string): void;
    getToastById(id: string): Toast;
    removeToastsById(id: string): void;
    onClearToasts(): void;
    showNotification(message: string, actions: string[], successCallback: any, cancelCallback: any, id: string): any;
    showMessage(message: string, successCallback: any, cancelCallback: any, id?: string): any;
    showError(message: string, successCallback: any, cancelCallback: any, id: string, error: any): any;
    hideAllToasts(): void;
    clearToasts(type?: string): any;
}

export class Toast {
    type: string;
    id: string;
    error: any;
    message: string;
    actions: string[];
    duration: number;
    successCallback: Function;
    cancelCallback: Function;
}



}
