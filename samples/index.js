(function (angular) {
    'use strict';

    var thisModule = angular.module('appBasicControls',
        [
            'pipSampleConfig',

            'pipDropdown', 'pipLayout',
            // 3rd Party Modules
            'ui.router', 'ui.utils', 'ngResource', 'ngAria', 'ngCookies', 'ngSanitize', 'ngMessages',
            'ngMaterial', 'LocalStorageModule', 'angularFileUpload', 'ngAnimate',
            'pipCore', 'pipBasicControls', 'appCoreServices.Toasts',
            'appBasicControls.Date', 'appBasicControls.ColorPicker',
            'appBasicControls.Markdown', 'appBasicControls.Refresh', 'appBasicControls.ToggleButtons',
            'appBasicControls.Information', 'appBasicControls.Confirmation', 'appBasicControls.Options',
            'appBasicControls.Popover', 'appBasicControls.ImageSlider', 'appBasicControls.Progress',
            'appBasicControls.Conversion', 'appBasicControls.Tags'
        ]
    );

    thisModule.controller('pipSampleController',
        function ($scope, $rootScope, $state, $mdSidenav, $timeout, pipTranslate, $mdTheming, pipTheme,
                  $mdMedia) {

            $scope.pages = [
                { title: 'Progress', state: 'progress', url: '/progress',
                    controller: 'ProgressController', templateUrl: '../samples/progress/progress.html' },
                { title: 'Popover', state: 'popover', url: '/popover',
                    controller: 'PopoverController', templateUrl: '../samples/popover/popover.html' },
                { title: 'Image slider', state: 'image_slider', url: '/image_slider',
                    controller: 'ImageSliderController', templateUrl: '../samples/image_slider/image_slider.html' },
                { title: 'Date', state: 'date', url: '/date',
                    controller: 'DateController', templateUrl: '../samples/date/date.html' },
                { title: 'Color Picker', state: 'color_picker', url: '/color_picker',
                    controller: 'ColorPickerController', templateUrl: '../samples/color_picker/color_picker.html' },
                { title: 'Markdown', state: 'markdown', url: '/markdown',
                    controller: 'MarkdownController', templateUrl: '../samples/markdown/markdown.html' },
                { title: 'Refresh', state: 'refresh', url: '/refresh',
                    controller: 'RefreshController', templateUrl: '../samples/refresh/refresh.html' },
                { title: 'Toggle Buttons', state: 'toggle_buttons', url: '/toggle_buttons',
                    controller: 'ToggleButtonsController', 
                    templateUrl: '../samples/toggle_buttons/toggle_buttons.html' },
                { title: 'Information dialog', state: 'information', url: '/information',
                    controller: 'InformationController', 
                    templateUrl: '../samples/information_dialog/information_dialog.html' },
                { title: 'Confirmation dialog', state: 'confirmation', url: '/confirmation',
                    controller: 'ConfirmationController', 
                    templateUrl: '../samples/confirmation_dialog/confirmation_dialog.html' },
                { title: 'Options dialogs', state: 'options', url: '/options',
                    controller: 'OptionsController', templateUrl: '../samples/options_dialog/options_dialog.html' },
                { title: 'Conversion dialogs', state: 'conversion', url: '/conversion',
                    controller: 'ConversionController', 
                    templateUrl: '../samples/conversion_dialog/conversion_dialog.html' },
                { title: 'Toasts', state: 'toasts', url: '/toasts',
                    controller: 'ToastsController', templateUrl: '../samples/toasts/toasts.html' },
                { title: 'Tags', state: 'tags', url: '/tags',
                    controller: 'TagsController', templateUrl: '../samples/tags/tags.html' }
            ];
            $scope.selected = {};
            $timeout(function () {
                $scope.selected.pageIndex = _.findIndex($scope.pages, {state: $state.current.name});
            });

            $scope.onNavigationSelect = function (stateName) {
                if ($state.current.name !== stateName) {
                    $state.go(stateName);
                }
            };

            $scope.onDropdownSelect = function (obj) {
                if ($state.current.name !== obj.state) {
                    $state.go(obj.state);
                }
            };

            $scope.isEntryPage = function () {
                return $state.current.name === 'signin' || $state.current.name === 'signup' ||
                    $state.current.name === 'recover_password' || $state.current.name === 'post_signup';
            };

            $scope.isPadding = function () {
                return $rootScope.$state
                    ? !($rootScope.$state.name === 'tabs' ||
                    $rootScope.$state.name === 'dropdown' && $mdMedia('xs')) : true;
            };
        }
    );

})(window.angular);
