/* global angular */

(function () {
    'use strict';

    var content = [
        { title: 'Progress', state: 'progress', url: '/progress', controller: 'ProgressController', templateUrl: 'progress.html' },
        { title: 'Popover', state: 'popover', url: '/popover', controller: 'PopoverController', templateUrl: 'popover.html' },
        { title: 'Image slider', state: 'image_slider', url: '/image_slider', controller: 'ImageSliderController', templateUrl: 'image_slider.html' },
        { title: 'Date', state: 'date', url: '/date', controller: 'DateController', templateUrl: 'date.html' },
        { title: 'Color Picker', state: 'color_picker', url: '/color_picker', controller: 'ColorPickerController', templateUrl: 'color_picker.html' },
        { title: 'Markdown', state: 'markdown', url: '/markdown', controller: 'MarkdownController', templateUrl: 'markdown.html' },
        { title: 'Refresh', state: 'refresh', url: '/refresh', controller: 'RefreshController', templateUrl: 'refresh.html' },
        { title: 'Toggle Buttons', state: 'toggle_buttons', url: '/toggle_buttons', controller: 'ToggleButtonsController', templateUrl: 'toggle_buttons.html' },
        { title: 'Information', state: 'information', url: '/information', controller: 'InformationController', templateUrl: 'information_dialog.html' },
        { title: 'Confirmation', state: 'confirmation', url: '/confirmation', controller: 'ConfirmationController', templateUrl: 'confirmation_dialog.html' },
        { title: 'Options', state: 'options', url: '/options', controller: 'OptionsController', templateUrl: 'options_dialog.html' },
        { title: 'Conversion', state: 'conversion', url: '/conversion', controller: 'ConversionController', templateUrl: 'conversion_dialog.html' },
        { title: 'Toasts', state: 'toasts', url: '/toasts', controller: 'ToastsController', templateUrl: 'toasts.html' },
        { title: 'Tags', state: 'tags', url: '/tags', controller: 'TagsController', templateUrl: 'tags.html' },
    ];

    var thisModule = angular.module('appBasicControls', 
        [
            // 3rd Party Modules
            'ui.router', 'ui.utils', 'ngResource', 'ngAria', 'ngCookies', 'ngSanitize', 'ngMessages',
            'ngMaterial', 'LocalStorageModule', 'angularFileUpload', 'ngAnimate', 
			'pipCore', 'pipBasicControls', 'appCoreServices.Toasts',
            'appBasicControls.Date', 'appBasicControls.ColorPicker',
            'appBasicControls.Markdown', 'appBasicControls.Refresh', 'appBasicControls.ToggleButtons',
            'appBasicControls.Information', 'appBasicControls.Confirmation',  'appBasicControls.Options',
            'appBasicControls.Popover', 'appBasicControls.ImageSlider', 'appBasicControls.Progress',
            'appBasicControls.Conversion', 'appBasicControls.Tags'
        ]
    );

    thisModule.config(function (pipTranslateProvider, $stateProvider, $urlRouterProvider, $mdIconProvider) {
            $mdIconProvider.iconSet('icons', 'images/icons.svg', 512);


            // String translations
            pipTranslateProvider.translations('en', {
                'APPLICATION_TITLE': 'WebUI Sampler',

                'blue': 'Blue Theme',
                'green': 'Green Theme',
                'pink': 'Pink Theme',
                'grey': 'Grey Theme'
            });

            pipTranslateProvider.translations('ru', {
                'APPLICATION_TITLE': 'WebUI Демонстратор',

                'blue': 'Голубая тема',
                'green': 'Зеленая тема',
                'pink': 'Розовая тема',
                'grey': 'Серая тема'
            });

            for (var i = 0; i < content.length; i++) {
                var contentItem = content[i];
                $stateProvider.state(contentItem.state, contentItem);
            }
                
            $urlRouterProvider.otherwise('/date');
        } 
    );

    thisModule.controller('AppController', 
        function ($scope, $rootScope, $state, $mdSidenav, pipTranslate, $mdTheming, pipTheme, $mdMedia, localStorageService) {
            $scope.languages = ['en', 'ru'];
            $scope.themes = _.keys(_.omit($mdTheming.THEMES, 'default'));
            $rootScope.$theme = localStorageService.get('theme');

            $scope.content = content;
            $scope.menuOpened = false;

            $scope.onLanguageClick = function(language) {
                pipTranslate.use(language);
            };

            $scope.onThemeClick = function(theme) {
                $rootScope.$theme = theme;
                pipTheme.setCurrentTheme(theme);
            };
                        
            $scope.onSwitchPage = function(state) {
                $mdSidenav('left').close();
                $state.go(state);
            };
            
            $scope.onToggleMenu = function() {
                $mdSidenav('left').toggle();
            };
                        
            $scope.isActiveState = function(state) {
                return $state.current.name == state;  
            };

            $scope.isPadding = function () {
                if (!$rootScope.$state) return true;

                return !($rootScope.$state.name == 'tabs' || ($rootScope.$state.name == 'dropdown' && $mdMedia('xs')))
            }
        }
    );

})();
