(function (angular) {
    'use strict';

    var thisModule = angular.module('appControls',
        [
            'ngMaterial',
            'ui.router', 'ui.utils', 'ngResource', 'ngAria', 'ngCookies', 'ngSanitize', 'ngMessages',
            'ngMaterial', 'wu.masonry', 'LocalStorageModule', 'angularFileUpload', 'ngAnimate',

            'pipServices',
            'pipTheme.Default', 'pipTheme.Bootbarn', 'pipTheme', 

            'pipControls', 'appControls.Toasts', 'appControls.ColorPicker',
            'appControls.Markdown', 'appControls.RefExpander',
            'appControls.Popover', 'appControls.ImageSlider', 'appControls.Progress',
            'appControls.Empty', 'appControls.UnsavedChanges'

        ]
    );

    var content = [
        {
            title: 'Progress', state: 'progress', url: '/progress', auth: false,
            controller: 'ProgressController', templateUrl: 'progress_sample/progress.html'
        },
        {
            title: 'Popover', state: 'popover', url: '/popover', auth: false,
            controller: 'PopoverController', templateUrl: 'popover_sample/popover.html'
        },
        {
            title: 'Image slider', state: 'image_slider', url: '/image_slider', auth: false,
            controller: 'ImageSliderController', templateUrl: 'image_slider_sample/image_slider.html'
        },
        {
            title: 'Color Picker', state: 'color_picker', url: '/color_picker', auth: false,
            controller: 'ColorPickerController', templateUrl: 'color_picker_sample/color_picker.html'
        },
        {
            title: 'Markdown', state: 'markdown', url: '/markdown', auth: false,
            controller: 'MarkdownController', templateUrl: 'markdown_sample/markdown.html'
        },
        {
            title: 'Toasts', state: 'toasts', url: '/toasts', auth: false,
            controller: 'ToastsController', templateUrl: 'toasts_sample/toasts.html'
        },
        {
            title: 'Reference Expander', state: 'ref', url: '/ref', auth: false,
            controller: 'RefExpanderController', templateUrl: 'ref_expander/ref_expander.html'
        },
        {
            title: 'Empty', state: 'empty', url: '/empty', auth: false,
            controller: 'EmptyController', templateUrl: 'empty/empty.html'
        },
        {
            title: 'Unsaved Changes', state: 'unsaved_changes', url: '/unsaved_changes', auth: false,
            controller: 'UnsavedChangesController', templateUrl: 'unsaved_changes/unsaved_changes.html'
        }
    ];

    // Configure application services before start
    thisModule.config(
        function ($stateProvider, $urlRouterProvider, $mdIconProvider,
                  $compileProvider, $httpProvider) { // pipTranslateProvider, pipSideNavProvider, pipAppBarProvider,

            $compileProvider.debugInfoEnabled(false);
            $httpProvider.useApplyAsync(true);

            var contentItem, i;

            $mdIconProvider.iconSet('icons', 'images/icons.svg', 512);

            for (i = 0; i < content.length; i++) {
                contentItem = content[i];
                $stateProvider.state(contentItem.state, contentItem);
            }

            $urlRouterProvider.otherwise('/progress');
        }
    );

    thisModule.controller('pipSampleController',

        function ($scope, $rootScope, $injector, $state, $mdSidenav, $timeout, $mdTheming, $mdMedia, localStorageService) {

            var pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null,
                // appThemesDefault = $injector.has('appThemesDefault') ? $injector.get('appThemesDefault') : null,
                pipTheme = $injector.has('pipTheme') ? $injector.get('pipTranslate') : null;

            $scope.isTranslated = !!pipTranslate;
            $scope.isTheme = !!pipTheme;
            $scope.$mdMedia = $mdMedia;

            $rootScope.$theme = localStorageService.get('theme');
            if ($scope.isTheme) {
                $scope.themes = _.keys(_.omit($mdTheming.THEMES, 'default'));
            } else {
                $scope.themes = [];
            }
            

            $scope.languages = ['en', 'ru'];
            if (!$rootScope.$language) {
                $rootScope.$language = 'en';
            }

            $scope.content = content;
            $scope.menuOpened = false;

            // Update page after language changed
            $rootScope.$on('languageChanged', function(event) {
                $state.reload();
            });

            // Update page after theme changed
            $rootScope.$on('themeChanged', function(event) {
                $state.reload();
            });

            $scope.onSwitchPage = function (state) {
                $mdSidenav('left').close();
                $state.go(state);
            };

            $scope.onThemeClick = function(theme) {
                if ($scope.isTheme) {
                    $rootScope.$theme = theme;
                    pipTheme.use(theme, false, false);
                }
            };

            $scope.onToggleMenu = function () {
                $mdSidenav('left').toggle();
            };

            $scope.onLanguageClick = function(language) {
                if (pipTranslate) {
                    pipTranslate.use(language);
                } 
            };

            $scope.isActiveState = function (state) {
                return $state.current.name == state;
            };
        }
    );

})(window.angular);
