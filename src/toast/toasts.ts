/// <reference path="../../typings/tsd.d.ts" />
class ToastController {
    private _$mdToast;
    private _pipErrorDetailsDialog ;

    public message: string;
    public actions: any[];
    public toast: any;
    public actionLenght: number;
    public showDetails: boolean;

    constructor( 
        $mdToast, 
        toast, 
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
            } else if (toast.actions.length === 1) {
                this.actionLenght = toast.actions[0].toString().length;
            } else {
                this.actionLenght = null;
            }

            this.showDetails = this._pipErrorDetailsDialog != null;

    }

     public onDetails() {
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

    public onAction(action) {
        this._$mdToast.hide(
        {
            action: action,
            id: this.toast.id,
            message: this.message
        });

    }
}

class ToastService {
    private SHOW_TIMEOUT: number = 20000;
    private SHOW_TIMEOUT_NOTIFICATIONS: number = 20000;
    private toasts: any[] = [];
    private currentToast: any;
    private sounds: any = {};

    private _$mdToast;
    private _pipErrorDetailsDialog;

    constructor($rootScope, $mdToast) {
        this._$mdToast = $mdToast;

        $rootScope.$on('$stateChangeSuccess', this.onStateChangeSuccess);
        $rootScope.$on('pipSessionClosed', this.onClearToasts);
        $rootScope.$on('pipIdentityChanged', this.onClearToasts);
    }

    public showNextToast() {
        let toast;

        if (this.toasts.length > 0) {
            toast = this.toasts[0];
            this.toasts.splice(0, 1);
            this.showToast(toast);
        }
    }

     // Show toast
     public showToast(toast) {
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
            (action) => {
                this.showToastOkResult(action);
            },
            (action) => {
                this.showToastCancelResult(action);
            }
        );
    }

    private showToastCancelResult(action) {
        if (this.currentToast.cancelCallback) {
            this.currentToast.cancelCallback(action);
        }
        this.currentToast = null;
        this.showNextToast();
    }

    private showToastOkResult(action) {
        if (this.currentToast.successCallback) {
            this.currentToast.successCallback(action);
        }
        this.currentToast = null;
        this.showNextToast();
    }

    public addToast(toast) {
        if (this.currentToast && toast.type !== 'error') {
            this.toasts.push(toast);
        } else {
            this.showToast(toast);
        }
    }

    public removeToasts(type) {
        let result = [];
        _.each(this.toasts, (toast) => {
            if (!toast.type || toast.type !== type) {
                result.push(toast);
            }
        });
        this.toasts = _.cloneDeep(result);
    }

    public removeToastsById(id) {
        _.remove(this.toasts, {id: id});
    }

    public getToastById(id) {
        return _.find(this.toasts, {id: id});
    }

    public onStateChangeSuccess() {}

    public onClearToasts() {
        this.clearToasts();
    }

    public showNotification(message, actions, successCallback, cancelCallback, id) {
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

    public showMessage(message, successCallback, cancelCallback, id) {
        this.addToast({
            id: id || null,
            type: 'message',
            message: message,
            actions: ['ok'],
            successCallback: successCallback,
            cancelCallback: cancelCallback
        });
    }

     public showError(message, successCallback, cancelCallback, id, error) {
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

    public hideAllToasts() {
        this._$mdToast.cancel();
        this.toasts = [];
    }

    public clearToasts(type?: any) {
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

/*

(() => {
    angular.module('pipToasts', ['ngMaterial', 'pipControls.Translate'])
           .service('pipToasts',
        function ($rootScope, $mdToast) {
            var
                SHOW_TIMEOUT = 20000,
                SHOW_TIMEOUT_NOTIFICATIONS = 20000,
                toasts = [],
                currentToast,
                sounds = {};

            /** pre-load sounds for notifications
                // sounds['toast_error'] = ngAudio.load('sounds/fatal.mp3');
                // sounds['toast_notification'] = ngAudio.load('sounds/error.mp3');
                // sounds['toast_message'] = ngAudio.load('sounds/warning.mp3');

                // Remove error toasts when page is changed
            $rootScope.$on('$stateChangeSuccess', onStateChangeSuccess);
            $rootScope.$on('pipSessionClosed', onClearToasts);
            $rootScope.$on('pipIdentityChanged', onClearToasts);

            return {
                showNotification: showNotification,
                showMessage: showMessage,
                showError: showError,
                hideAllToasts: hideAllToasts,
                clearToasts: clearToasts,
                removeToastsById: removeToastsById,
                getToastById: getToastById
            };

            // Take the next from queue and show it
            function showNextToast() {
                var toast;

                if (toasts.length > 0) {
                    toast = toasts[0];
                    toasts.splice(0, 1);
                    showToast(toast);
                }
            }

            // Show toast
            function showToast(toast) {
                currentToast = toast;

                $mdToast.show({
                    templateUrl: 'toast/toast.html',
                    hideDelay: toast.duration || SHOW_TIMEOUT,
                    position: 'bottom left',
                    controller: ToastController,
                    controllerAs: 'vm',
                    locals: {
                        toast: currentToast,
                        sounds: sounds
                    }
                })
                    .then(
                    function showToastOkResult(action) {
                        if (currentToast.successCallback) {
                            currentToast.successCallback(action);
                        }
                        currentToast = null;
                        showNextToast();
                    },
                    function showToastCancelResult(action) {
                        if (currentToast.cancelCallback) {
                            currentToast.cancelCallback(action);
                        }
                        currentToast = null;
                        showNextToast();
                    }
                );
            }

            function addToast(toast) {
                if (currentToast && toast.type !== 'error') {
                    toasts.push(toast);
                } else {
                    showToast(toast);
                }
            }

            function removeToasts(type) {
                var result = [];

                _.each(toasts, function (toast) {
                    if (!toast.type || toast.type !== type) {
                        result.push(toast);
                    }
                });
                toasts = _.cloneDeep(result);
            }

            function removeToastsById(id) {
                _.remove(toasts, {id: id});
            }

            function getToastById(id) {
                return _.find(toasts, {id: id});
            }

            function onStateChangeSuccess() {
                // toasts = _.reject(toasts, function (toast) {
                //     return toast.type === 'error';
                // });

                // if (currentToast && currentToast.type === 'error') {
                //     $mdToast.cancel();
                //     showNextToast();
                // }
            }

            function onClearToasts() {
                clearToasts();
            }

            // Show new notification toast at the top right
            function showNotification(message, actions, successCallback, cancelCallback, id) {

                addToast({
                    id: id || null,
                    type: 'notification',
                    message: message,
                    actions: actions || ['ok'],
                    successCallback: successCallback,
                    cancelCallback: cancelCallback,
                    duration: SHOW_TIMEOUT_NOTIFICATIONS
                });
            }

            // Show new message toast at the top right
            function showMessage(message, successCallback, cancelCallback, id) {

                addToast({
                    id: id || null,
                    type: 'message',
                    message: message,
                    actions: ['ok'],
                    successCallback: successCallback,
                    cancelCallback: cancelCallback
                });
            }

            // Show error toast at the bottom right after error occured
            function showError(message, successCallback, cancelCallback, id, error) {

                addToast({
                    id: id || null,
                    error: error,
                    type: 'error',
                    message: message || 'Unknown error.',
                    actions: ['ok'],
                    successCallback: successCallback,
                    cancelCallback: cancelCallback
                });
            }

            // Hide and clear all toast when user signs out
            function hideAllToasts() {
                $mdToast.cancel();
                toasts = [];
            }

            // Clear toasts by type
            function clearToasts(type?: any) {
                if (type) {
                    // pipAssert.isString(type, 'pipToasts.clearToasts: type should be a string');
                    removeToasts(type);
                } else {
                    $mdToast.cancel();
                    toasts = [];
                }
            }
        }
    );

})();*/
