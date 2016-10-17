(function (angular) {
    'use strict';

    var thisModule = angular.module('appControls',
        [
            'ngMaterial',
             'pipControls', 'appCoreServices.Toasts',
            'pipTheme.Default', 'pipTheme.Bootbarn', 'pipTheme',

            'appControls.ColorPicker',
            'appControls.Markdown', 'appControls.RefExpander',
            'appControls.Popover', 'appControls.ImageSlider', 'appControls.Progress'
            //  'appControls.Refresh', 'pipServices', 'pipNav',  'pipDateTimes',  'pipLayout',
        ]
    );

    // Configure application services before start
    thisModule.config(
        function ($stateProvider, $urlRouterProvider,  $mdIconProvider,
                  $compileProvider, $httpProvider) { // pipTranslateProvider, pipSideNavProvider, pipAppBarProvider,

            $compileProvider.debugInfoEnabled(false);
            $httpProvider.useApplyAsync(true);
            
            var content = [
                { title: 'Progress', state: 'progress', url: '/progress', auth: false,
                    controller: 'ProgressController', templateUrl: 'progress_sample/progress.html' },
                { title: 'Popover', state: 'popover', url: '/popover', auth: false,
                    controller: 'PopoverController', templateUrl: 'popover_sample/popover.html' },
                { title: 'Image slider', state: 'image_slider', url: '/image_slider', auth: false,
                    controller: 'ImageSliderController', templateUrl: 'image_slider_sample/image_slider.html' },
                { title: 'Color Picker', state: 'color_picker', url: '/color_picker', auth: false,
                    controller: 'ColorPickerController', templateUrl: 'color_picker_sample/color_picker.html' },
                { title: 'Markdown', state: 'markdown', url: '/markdown', auth: false,
                    controller: 'MarkdownController', templateUrl: 'markdown_sample/markdown.html' },
                { title: 'Toasts', state: 'toasts', url: '/toasts', auth: false,
                    controller: 'ToastsController', templateUrl: 'toasts_sample/toasts.html' },
                { title: 'Reference Expander', state: 'ref', url: '/ref', auth: false,
                    controller: 'RefExpanderController', templateUrl: 'ref_expander/ref_expander.html' }
                ],
                contentItem, i;

            $mdIconProvider.iconSet('icons', 'images/icons.svg', 512);



            /*
             pipAppBarProvider.globalSecondaryActions([
             {name: 'global.signout', title: 'SIGNOUT', state: 'signout'}
             ]);
            // String translations
            pipTranslateProvider.translations('en', {
                CONTROLS: 'Controls',
                SIGNOUT: 'Sign out'
            });

            pipTranslateProvider.translations('ru', {
                CONTROLS: 'Контролы',
                SIGNOUT: 'Выйти'
            });*/

            for (i = 0; i < content.length; i++) {
                contentItem = content[i];
                $stateProvider.state(contentItem.state, contentItem);
            }

            $urlRouterProvider.otherwise('/progress');
        }
    );

    thisModule.controller('pipSampleController',
        function ($scope, $rootScope, $state, $mdSidenav, $timeout, $mdTheming, pipTheme,
                  $mdMedia) {

            pipTheme.setCurrentTheme('bootbarn-warm');
            
            $scope.pages = [
                { title: 'Progress', state: 'progress', url: '/progress',
                    controller: 'ProgressController', templateUrl: '../samples/progress/progress.html' },
                { title: 'Popover', state: 'popover', url: '/popover',
                    controller: 'PopoverController', templateUrl: '../samples/popover/popover.html' },
                { title: 'Image slider', state: 'image_slider', url: '/image_slider',
                    controller: 'ImageSliderController', templateUrl: '../samples/image_slider/image_slider.html' },
                { title: 'Color Picker', state: 'color_picker', url: '/color_picker',
                    controller: 'ColorPickerController', templateUrl: '../samples/color_picker/color_picker.html' },
                { title: 'Markdown', state: 'markdown', url: '/markdown',
                    controller: 'MarkdownController', templateUrl: '../samples/markdown/markdown.html' },
                { title: 'Refresh', state: 'refresh', url: '/refresh',
                    controller: 'RefreshController', templateUrl: '../samples/refresh/refresh.html' },
                { title: 'Toggle Buttons', state: 'toggle_buttons', url: '/toggle_buttons',
                    controller: 'ToggleButtonsController', 
                    templateUrl: '../samples/toggle_buttons/toggle_buttons.html' },
                { title: 'Toasts', state: 'toasts', url: '/toasts',
                    controller: 'ToastsController', templateUrl: '../samples/toasts/toasts.html' },
                { title: 'Tags', state: 'tags', url: '/tags',
                    controller: 'TagsController', templateUrl: '../samples/tags/tags.html' }
            ];

            var allThemes = _.keys(_.omit($mdTheming.THEMES, 'default'));
            $scope.themes = [];
            _.each(allThemes, function (theme) {
                if (theme.indexOf('bootbarn') == -1) {
                    $scope.themes.push(theme);
                }
            })

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

            $scope.isPadding = function () {
                return $rootScope.$state
                    ? !($rootScope.$state.name === 'tabs' ||
                    $rootScope.$state.name === 'dropdown' && $mdMedia('xs')) : true;
            };
        }
    );

})(window.angular);
