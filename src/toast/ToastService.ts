import { Toast } from './Toast';
import { IToastService } from './IToastService';

{
    class ToastController {
        private _pipErrorDetailsDialog;

        public message: string;
        public actions: string[];
        public actionLenght: number;
        public showDetails: boolean;

        constructor(
            private $mdToast: angular.material.IToastService,
            public toast: Toast,
            $injector: ng.auto.IInjectorService
        ) {
            "ngInject";

            this._pipErrorDetailsDialog = $injector.has('pipErrorDetailsDialog') ?
                $injector.get('pipErrorDetailsDialog') : null;
            this.message = toast.message;
            this.actions = toast.actions;

            if (toast.actions.length === 0) {
                this.actionLenght = 0;
            } else {
                this.actionLenght = toast.actions.length === 1 ? toast.actions[0].toString().length : null;
            }

            this.showDetails = this._pipErrorDetailsDialog != null;
        }

        public onDetails(): void {
            this.$mdToast.hide();
            if (this._pipErrorDetailsDialog) {
                this._pipErrorDetailsDialog.show({
                        error: this.toast.error,
                        ok: 'Ok'
                    },
                    angular.noop,
                    angular.noop
                );
            }
        }

        public onAction(action): void {
            this.$mdToast.hide({
                action: action,
                id: this.toast.id,
                message: this.message
            });
        }
    }

    class ToastService implements IToastService {
        private SHOW_TIMEOUT: number = 20000;
        private SHOW_TIMEOUT_NOTIFICATIONS: number = 20000;
        private toasts: Toast[] = [];
        private currentToast: any;
        private sounds: any = {};

        constructor(
            $rootScope: ng.IRootScopeService,
            private $mdToast: angular.material.IToastService
        ) {
            "ngInject";
            $rootScope.$on('$stateChangeSuccess', () => { this.onStateChangeSuccess() });
            $rootScope.$on('pipSessionClosed', () => { this.onClearToasts() });
            $rootScope.$on('pipIdentityChanged', () => { this.onClearToasts() });
        }

        public showNextToast(): void {
            let toast: Toast;

            if (this.toasts.length > 0) {
                toast = this.toasts[0];
                this.toasts.splice(0, 1);
                this.showToast(toast);
            }
        }

        // Show toast
        public showToast(toast: Toast): void {
            this.currentToast = toast;

            this.$mdToast.show({
                    templateUrl: 'toast/Toast.html',
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

        private showToastCancelResult(action: string): void {
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
            const result: any[] = [];
            _.each(this.toasts, (toast) => {
                if (!toast.type || toast.type !== type) {
                    result.push(toast);
                }
            });
            this.toasts = _.cloneDeep(result);
        }

        public removeToastsById(id: string): void {
            _.remove(this.toasts, {
                id: id
            });
        }

        public getToastById(id: string): Toast {
            return _.find(this.toasts, {
                id: id
            });
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

        public showMessage(message: string, successCallback, cancelCallback, id ? : string) {
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
            this.$mdToast.cancel();
            this.toasts = [];
        }

        public clearToasts(type ? : string) {
            if (type) {
                // pipAssert.isString(type, 'pipToasts.clearToasts: type should be a string');
                this.removeToasts(type);
            } else {
                this.$mdToast.cancel();
                this.toasts = [];
            }
        }

    }

    angular
        .module('pipToasts')
        .service('pipToasts', ToastService);
}