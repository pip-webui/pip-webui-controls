/// <reference path="../../typings/tsd.d.ts" />

interface IPipToast {
    type: string;
    id: string;
    error: any;
    message: string;
    actions: string[];
    duration: number;
    successCallback: Function;
    cancelCallback: Function
}

class ToastController {
    private _$mdToast: angular.material.IToastService;
    private _pipErrorDetailsDialog;

    public message: string;
    public actions: string[];
    public toast: IPipToast;
    public actionLenght: number;
    public showDetails: boolean;

    constructor( 
        $mdToast: angular.material.IToastService, 
        toast: IPipToast, 
        $injector
       ) {
            this._pipErrorDetailsDialog = $injector.has('pipErrorDetailsDialog') 
                ? $injector.get('pipErrorDetailsDialog') : null;
            this._$mdToast = $mdToast;
            this.message = toast.message;
            this.actions = toast.actions;
            this.toast = toast;
            
            if (toast.actions.length === 0) {
                this.actionLenght = 0;
            } else {
                this.actionLenght = toast.actions.length === 1 ? toast.actions[0].toString().length : null;
            }

            this.showDetails = this._pipErrorDetailsDialog != null;

    }

     public onDetails(): void {
        this._$mdToast.hide();
        if (this._pipErrorDetailsDialog) {
            this._pipErrorDetailsDialog.show(
            {
                error: this.toast.error,
                ok: 'Ok'
            },
            angular.noop,
            angular.noop
            );
        }
    }

    public onAction(action): void {
        this._$mdToast.hide(
        {
            action: action,
            id: this.toast.id,
            message: this.message
        });

    }
}

interface IToastService {
    showNextToast(): void;
    showToast(toast: IPipToast): void;
    addToast(toast): void;
    removeToasts(type: string): void;
    getToastById(id: string): IPipToast;
    removeToastsById(id: string): void;
    onClearToasts(): void;
    showNotification(message: string, actions: string[], successCallback, cancelCallback, id: string);
    showMessage(message: string, successCallback, cancelCallback, id?: string);
    showError(message: string, successCallback, cancelCallback, id: string, error: any);
    hideAllToasts(): void;
    clearToasts(type?: string);
}

class ToastService implements IToastService {
    private SHOW_TIMEOUT: number = 20000;
    private SHOW_TIMEOUT_NOTIFICATIONS: number = 20000;
    private toasts: IPipToast[] = [];
    private currentToast: any;
    private sounds: any = {};

    private _$mdToast: angular.material.IToastService;

    constructor(
        $rootScope: ng.IRootScopeService, 
        $mdToast: angular.material.IToastService) {

        this._$mdToast = $mdToast;

        $rootScope.$on('$stateChangeSuccess', () => {this.onStateChangeSuccess()});
        $rootScope.$on('pipSessionClosed', () => {this.onClearToasts()});
        $rootScope.$on('pipIdentityChanged', () => {this.onClearToasts()});
    }

    public showNextToast(): void {
        let toast: IPipToast;

        if (this.toasts.length > 0) {
            toast = this.toasts[0];
            this.toasts.splice(0, 1);
            this.showToast(toast);
        }
    }

     // Show toast
     public showToast(toast: IPipToast): void {
        this.currentToast = toast;

        this._$mdToast.show({
            templateUrl: 'toast/toast.html',
            hideDelay: toast.duration || this.SHOW_TIMEOUT,
            position: 'bottom left',
            controller: ToastController,
            controllerAs: 'vm',
            locals: {
                toast: this.currentToast,
                sounds: this.sounds
            }
        })
        .then( 
            (action: string) => {
                this.showToastOkResult(action);
            },
            (action: string) => {
                this.showToastCancelResult(action);
            }
        );
    }

    private showToastCancelResult(action: string):void {
        if (this.currentToast.cancelCallback) {
            this.currentToast.cancelCallback(action);
        }
        this.currentToast = null;
        this.showNextToast();
    }

    private showToastOkResult(action: string): void {
        if (this.currentToast.successCallback) {
            this.currentToast.successCallback(action);
        }
        this.currentToast = null;
        this.showNextToast();
    }

    public addToast(toast): void {
        if (this.currentToast && toast.type !== 'error') {
            this.toasts.push(toast);
        } else {
            this.showToast(toast);
        }
    }

    public removeToasts(type: string): void {
        let result: any[] = [];
        _.each(this.toasts, (toast) => {
            if (!toast.type || toast.type !== type) {
                result.push(toast);
            }
        });
        this.toasts = _.cloneDeep(result);
    }

    public removeToastsById(id: string): void {
        _.remove(this.toasts, {id: id});
    }

    public getToastById(id: string): IPipToast {
        return _.find(this.toasts, {id: id});
    }

    public onStateChangeSuccess() {}

    public onClearToasts(): void {
        this.clearToasts(null);
    }

    public showNotification(message: string, actions: string[], successCallback, cancelCallback, id: string) {
        this.addToast({
            id: id || null,
            type: 'notification',
            message: message,
            actions: actions || ['ok'],
            successCallback: successCallback,
            cancelCallback: cancelCallback,
            duration: this.SHOW_TIMEOUT_NOTIFICATIONS
        });
    }

    public showMessage(message: string, successCallback, cancelCallback, id?: string) {
        this.addToast({
            id: id || null,
            type: 'message',
            message: message,
            actions: ['ok'],
            successCallback: successCallback,
            cancelCallback: cancelCallback
        });
    }

     public showError(message: string, successCallback, cancelCallback, id: string, error: any) {
        this.addToast({
            id: id || null,
            error: error,
            type: 'error',
            message: message || 'Unknown error.',
            actions: ['ok'],
            successCallback: successCallback,
            cancelCallback: cancelCallback
        });
    }

    public hideAllToasts(): void {
        this._$mdToast.cancel();
        this.toasts = [];
    }

    public clearToasts(type?: string) {
        if (type) {
            // pipAssert.isString(type, 'pipToasts.clearToasts: type should be a string');
            this.removeToasts(type);
        } else {
            this._$mdToast.cancel();
            this.toasts = [];
        }
    }

}


(() => {
    angular
        .module('pipToasts', ['ngMaterial', 'pipControls.Translate'])
        .service('pipToasts', ToastService);
})();
