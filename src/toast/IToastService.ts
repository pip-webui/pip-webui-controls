import { Toast } from './Toast';

export interface IToastService {
    showNextToast(): void;
    showToast(toast: Toast): void;
    addToast(toast): void;
    removeToasts(type: string): void;
    getToastById(id: string): Toast;
    removeToastsById(id: string): void;
    onClearToasts(): void;
    showNotification(message: string, actions: string[], successCallback, cancelCallback, id: string);
    showMessage(message: string, successCallback, cancelCallback, id ? : string);
    showError(message: string, successCallback, cancelCallback, id: string, error: any);
    hideAllToasts(): void;
    clearToasts(type ? : string);
}
