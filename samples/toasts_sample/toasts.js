/* eslint-disable max-len */
/* eslint-disable no-console */

(function (angular) {
    'use strict';

    var thisModule = angular.module('appControls.Toasts', []);

/*

    thisModule.config(function (pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            SHOW_NOTIFICATION: 'Show notification',
            SHOW_ERROR: 'Show error',
            ERROR: 'New error ',
            NOTIFICATION: 'New notification ',
            SIMPLE: 'Simple',
            SMALL: 'Small',
            NOTIFICATIONS_ERROR: 'Error',
            WITHOUT_ACTIONS: 'Without actions',
            SHOW_SMALL_NOTIFICATION: 'Show small notification',
            SHOW_NOTIFICATION_WITHOUT_ACTIONS: 'Show notification without actions'
        });
        pipTranslateProvider.translations('ru', {
            SHOW_NOTIFICATION: 'Показать оповещение',
            SHOW_ERROR: 'Показать ошибку',
            ERROR: 'Новая ошибка ',
            NOTIFICATION: 'Новое оповещение',
            SIMPLE: 'Простая',
            SMALL: 'Маленькая',
            NOTIFICATIONS_ERROR: 'Ошибка',
            WITHOUT_ACTIONS: 'Без действий',
            SHOW_SMALL_NOTIFICATION: 'Показать маленькую нотифкацию',
            SHOW_NOTIFICATION_WITHOUT_ACTIONS: 'Показать нотификацию без действий'
        });
    });*/

    thisModule.controller('ToastsController',
        function ($scope, pipToasts,  $timeout, $injector) { //pipTranslate,  pipAppBar,

            var pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;

            if (pipTranslate) {
                pipTranslate.translations('en', {
                    SHOW_NOTIFICATION: 'Show notification',
                    SHOW_ERROR: 'Show error',
                    ERROR: 'New error ',
                    NOTIFICATION: 'New notification ',
                    SIMPLE: 'Simple',
                    SMALL: 'Small',
                    NOTIFICATIONS_ERROR: 'Error',
                    WITHOUT_ACTIONS: 'Without actions',
                    SHOW_SMALL_NOTIFICATION: 'Show small notification',
                    SHOW_NOTIFICATION_WITHOUT_ACTIONS: 'Show notification without actions',
                    SAMPLE: 'Sample',
                    CODE: 'Code'                    
                });
                pipTranslate.translations('ru', {
                    SHOW_NOTIFICATION: 'Показать оповещение',
                    SHOW_ERROR: 'Показать ошибку',
                    ERROR: 'Новая ошибка ',
                    NOTIFICATION: 'Новое оповещение',
                    SIMPLE: 'Простая',
                    SMALL: 'Маленькая',
                    NOTIFICATIONS_ERROR: 'Ошибка',
                    WITHOUT_ACTIONS: 'Без действий',
                    SHOW_SMALL_NOTIFICATION: 'Показать маленькую нотифкацию',
                    SHOW_NOTIFICATION_WITHOUT_ACTIONS: 'Показать нотификацию без действий',
                    SAMPLE: 'Пример',  
                    CODE: 'Пример кода'  
                    
                });
                $scope.showNotification = pipTranslate.translate('SHOW_NOTIFICATION');
                $scope.showError = pipTranslate.translate('SHOW_ERROR');
                $scope.errorText = pipTranslate.translate('ERROR');
                $scope.notificationText  = pipTranslate.translate('NOTIFICATION');
                $scope.simple = pipTranslate.translate('SIMPLE');
                $scope.textSmall = pipTranslate.translate('SMALL');
                $scope.notificationError = pipTranslate.translate('NOTIFICATIONS_ERROR');
                $scope.withoutActions = pipTranslate.translate('WITHOUT_ACTIONS');
                $scope.smallNotification = pipTranslate.translate('SHOW_SMALL_NOTIFICATION');
                $scope.showNotificationWithoutAction = pipTranslate.translate('SHOW_NOTIFICATION_WITHOUT_ACTIONS');
                $scope.sample = pipTranslate.translate('SAMPLE');
                $scope.code = pipTranslate.translate('CODE');
            } else {
                $scope.showNotification = 'Show notification';
                $scope.showError = 'Show error';
                $scope.errorText = 'New error ';
                $scope.notificationText  = 'New notification ';
                $scope.simple = 'Simple';
                $scope.textSmall = 'Small';
                $scope.notificationError = 'Error';
                $scope.withoutActions = 'Without actions';
                $scope.smallNotification = 'Show small notification';
                $scope.showNotificationWithoutAction = 'Show notification without actions';
                $scope.sample = 'Sample';
                $scope.code = 'Code';                 
            }


            $timeout(function() {
                $('pre code').each(function(i, block) {
                    Prism.highlightElement(block);
                });
            });
            
            var
                messageCount = 0,
                errorCount = 0;
            
            $scope.onNotificationShow = function () {
                messageCount++;
                
                pipToasts.showNotification("Notification" + messageCount, ['accept', 'reject']);
            };

            $scope.onNotificationHideActions = function () {
                messageCount++;
                // pipToasts.showNotification('Compellingly implement cross functional materials without transparent catalysts for change. Intrinsicly myocardinate client-based imperatives without premium.', []);

                pipToasts.showNotification("Notification"  + messageCount, []);
            };

            $scope.onNotificationSmallShow = function () {
                messageCount++;
                pipToasts.showNotification("Notification"  + 'Small' + messageCount);
            };

            $scope.onErrorShow = function () {
                errorCount++;

                var error = {
                    path: '/api/1.0/parties/:id/followers',
                    method: 'POST',
                    code: 400,
                    name: 'Bad Request',
                    error: 1402,
                    message: 'Missing party information'
                };

                pipToasts.showError("Error" + errorCount, null, null, null, error);
            };
        }
    );

})(window.angular);
