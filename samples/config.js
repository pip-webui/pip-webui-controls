/**
 * @file Global configuration for sample application
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular) {
    'use strict';

    var thisModule = angular.module('pipSampleConfig', ['pipRest.State', 'pipRest', 'pipEntry', 'pipSideNav',
        'pipAppBar']);

    // Configure application services before start
    thisModule.config(
        function ($mdThemingProvider, $stateProvider, $urlRouterProvider, pipAuthStateProvider, pipTranslateProvider,
                  pipRestProvider, pipSideNavProvider, pipAppBarProvider, pipEntryProvider, $mdIconProvider) {

            var content = [
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
                    controller: 'ToggleButtonsController', templateUrl: '../samples/toggle_buttons/toggle_buttons.html' },
                { title: 'Information', state: 'information', url: '/information',
                    controller: 'InformationController', templateUrl: '../samples/information_dialog/information_dialog.html' },
                { title: 'Confirmation', state: 'confirmation', url: '/confirmation',
                    controller: 'ConfirmationController', templateUrl: '../samples/confirmation_dialog/confirmation_dialog.html' },
                { title: 'Options', state: 'options', url: '/options',
                    controller: 'OptionsController', templateUrl: '../samples/options_dialog/options_dialog.html' },
                { title: 'Conversion', state: 'conversion', url: '/conversion',
                    controller: 'ConversionController', templateUrl: '../samples/conversion_dialog/conversion_dialog.html' },
                { title: 'Toasts', state: 'toasts', url: '/toasts',
                    controller: 'ToastsController', templateUrl: '../samples/toasts/toasts.html' },
                { title: 'Tags', state: 'tags', url: '/tags',
                    controller: 'TagsController', templateUrl: '../samples/tags/tags.html' }
                ],
                contentItem, i;

            $mdIconProvider.iconSet('icons', 'images/icons.svg', 512);

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
            });

            for (i = 0; i < content.length; i++) {
                contentItem = content[i];
                $stateProvider.state(contentItem.state, contentItem);
            }

            pipAuthStateProvider.unauthorizedState('signin');
            pipAuthStateProvider.authorizedState('progress');

            $urlRouterProvider.otherwise(function ($injector, $location) {
                if ($location.$$path === '') {
                    return '/signin';
                }

                return '/progress';
            });

            // Configure REST API
            pipRestProvider.serverUrl('http://alpha.pipservices.net');

            // Configure navigation menu
            pipSideNavProvider.sections([
                {
                    links: [{title: 'CONTROLS', url: '/progress'}]
                },
                {
                    links: [{title: 'SIGNOUT', url: '/signout'}]
                }
            ]);
        }
    );

})(window.angular);

