/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('appBasicControls',
        [
            'pipSampleConfig',

            'pipSideNav', 'pipAppBar', 'pipDropdown', 'pipEntry',
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
                  $mdMedia, localStorageService, pipAppBar) {
            $scope.pages = [
                { title: 'Progress', state: 'progress', url: '/progress',
                    controller: 'ProgressController', templateUrl: 'progress.html' },
                { title: 'Popover', state: 'popover', url: '/popover',
                    controller: 'PopoverController', templateUrl: 'popover.html' },
                { title: 'Image slider', state: 'image_slider', url: '/image_slider',
                    controller: 'ImageSliderController', templateUrl: 'image_slider.html' },
                { title: 'Date', state: 'date', url: '/date',
                    controller: 'DateController', templateUrl: 'date.html' },
                { title: 'Color Picker', state: 'color_picker', url: '/color_picker',
                    controller: 'ColorPickerController', templateUrl: 'color_picker.html' },
                { title: 'Markdown', state: 'markdown', url: '/markdown',
                    controller: 'MarkdownController', templateUrl: 'markdown.html' },
                { title: 'Refresh', state: 'refresh', url: '/refresh',
                    controller: 'RefreshController', templateUrl: 'refresh.html' },
                { title: 'Toggle Buttons', state: 'toggle_buttons', url: '/toggle_buttons',
                    controller: 'ToggleButtonsController', templateUrl: 'toggle_buttons.html' },
                { title: 'Information dialog', state: 'information', url: '/information',
                    controller: 'InformationController', templateUrl: 'information_dialog.html' },
                { title: 'Confirmation dialog', state: 'confirmation', url: '/confirmation',
                    controller: 'ConfirmationController', templateUrl: 'confirmation_dialog.html' },
                { title: 'Options dialogs', state: 'options', url: '/options',
                    controller: 'OptionsController', templateUrl: 'options_dialog.html' },
                { title: 'Conversion dialogs', state: 'conversion', url: '/conversion',
                    controller: 'ConversionController', templateUrl: 'conversion_dialog.html' },
                { title: 'Toasts', state: 'toasts', url: '/toasts',
                    controller: 'ToastsController', templateUrl: 'toasts.html' },
                { title: 'Tags', state: 'tags', url: '/tags',
                    controller: 'TagsController', templateUrl: 'tags.html' }
            ];

            $scope.selected = {};
            $timeout(function () {
                $scope.selected.pageIndex = _.findIndex($scope.pages, {state: $state.current.name});
            });

            pipAppBar.showMenuNavIcon();
            pipAppBar.showLanguage();
            pipAppBar.showTitleText('CONTROLS');

            $scope.onThemeClick = function (theme) {
                $rootScope.$theme = theme;
                pipTheme.setCurrentTheme(theme);
            };

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

            $scope.isPadding = function () {
                return $rootScope.$state
                    ? !($rootScope.$state.name === 'tabs' ||
                    $rootScope.$state.name === 'dropdown' && $mdMedia('xs')) : true;
            };
        }
    );

})();
