/**
 * @file Toasts management service
 * @copyright Digital Living Software Corp. 2014-2016
 * @todo Replace ngAudio with alternative service
 */

(function (angular, _) {
    'use strict';
    var thisModule = angular.module('pipToasts', ['pipTranslate', 'ngMaterial', 'pipAssert']);

    thisModule.controller('pipToastController',
        function ($scope, $mdToast, toast, pipErrorDetailsDialog, sounds) {
            // if (toast.type && sounds['toast_' + toast.type]) {
            //     sounds['toast_' + toast.type].play();
            // }

            $scope.message = toast.message;
            $scope.actions = toast.actions;
            $scope.toast = toast;
            if (toast.actions.length === 0) {
                $scope.actionLenght = 0;
            }
            if (toast.actions.length === 1) {
                $scope.actionLenght = toast.actions[0].toString().length;
            } else {
                $scope.actionLenght = null;
            }

            $scope.onDetails = function (event) {
                $mdToast.hide();
                pipErrorDetailsDialog.show(
                    {
                        error: $scope.toast.error,
                        ok: 'Ok'
                    },
                    function () {
                        angular.noop();
                    },
                    function () {
                        angular.noop();
                    }
                );
            };

            $scope.onAction = function (action) {
                $mdToast.hide({action: action});
            };
        }
    );

    thisModule.service('pipToasts',
        function ($rootScope, $mdToast, pipAssert) {
            var
                SHOW_TIMEOUT = 20000,
                SHOW_TIMEOUT_NOTIFICATIONS = 20000,
                toasts = [],
                currentToast,
                sounds = {};

            /** pre-load sounds for notifications */
                // sounds['toast_error'] = ngAudio.load('sounds/fatal.mp3');
                // sounds['toast_notification'] = ngAudio.load('sounds/error.mp3');
                // sounds['toast_message'] = ngAudio.load('sounds/warning.mp3');

                // Remove error toasts when page is changed
            $rootScope.$on('$stateChangeSuccess', onStateChangeSuccess);
            $rootScope.$on('pipSessionClosed', onClearToasts);

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
                    controller: 'pipToastController',
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

            function onStateChangeSuccess(event, toState, toParams, fromState, fromParams) {
                toasts = _.reject(toasts, function (toast) {
                    return toast.type === 'error';
                });

                if (currentToast && currentToast.type === 'error') {
                    $mdToast.cancel();
                    showNextToast();
                }
            }

            function onClearToasts(event) {
                clearToasts();
            }

            // Show new notification toast at the top right
            function showNotification(message, actions, successCallback, cancelCallback, id) {
                pipAssert.isDef(message, 'pipToasts.showNotification: message should be defined');
                pipAssert.isString(message, 'pipToasts.showNotification: message should be a string');
                pipAssert.isArray(actions || [], 'pipToasts.showNotification: actions should be an array');
                if (successCallback) {
                    pipAssert.isFunction(successCallback, 'showNotification: successCallback should be a function');
                }
                if (cancelCallback) {
                    pipAssert.isFunction(cancelCallback, 'showNotification: cancelCallback should be a function');
                }

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
                pipAssert.isDef(message, 'pipToasts.showMessage: message should be defined');
                pipAssert.isString(message, 'pipToasts.showMessage: message should be a string');
                if (successCallback) {
                    pipAssert.isFunction(successCallback, 'pipToasts.showMessage:successCallback should be a function');
                }
                if (cancelCallback) {
                    pipAssert.isFunction(cancelCallback, 'pipToasts.showMessage: cancelCallback should be a function');
                }

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
                pipAssert.isDef(message, 'pipToasts.showError: message should be defined');
                pipAssert.isString(message, 'pipToasts.showError: message should be a string');
                if (successCallback) {
                    pipAssert.isFunction(successCallback, 'pipToasts.showError: successCallback should be a function');
                }
                if (cancelCallback) {
                    pipAssert.isFunction(cancelCallback, 'pipToasts.showError: cancelCallback should be a function');
                }

                addToast({
                    id: id || null,
                    error: error,
                    type: 'error',
                    message: message,
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
            function clearToasts(type) {
                if (type) {
                    pipAssert.isString(type, 'pipToasts.clearToasts: type should be a string');

                    removeToasts(type);
                } else {
                    $mdToast.cancel();
                    toasts = [];
                }
            }
        }
    );

})(window.angular, window._);
