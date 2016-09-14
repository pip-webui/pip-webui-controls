/**
 * @file Global configuration for sample application
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular) {
    'use strict';

    var thisModule = angular.module('pipSampleConfig', ['pipRest.State', 'pipRest', 'pipSideNav', 'pipDataConfig',
        'pipAppBar']);

    // Configure application services before start
    thisModule.config(
        function ($mdThemingProvider, $stateProvider, $urlRouterProvider, pipAuthStateProvider, pipTranslateProvider,
                  pipDataConfigProvider, pipSideNavProvider, pipAppBarProvider, $mdIconProvider,
                  $compileProvider, $httpProvider) {

            $compileProvider.debugInfoEnabled(false);
            $httpProvider.useApplyAsync(true);
            
            var content = [
                { title: 'Progress', state: 'progress', url: '/progress', auth: false,
                    controller: 'ProgressController', templateUrl: 'progress_sample/progress.html' },
                { title: 'Popover', state: 'popover', url: '/popover', auth: false,
                    controller: 'PopoverController', templateUrl: 'popover_sample/popover.html' },
                { title: 'Image slider', state: 'image_slider', url: '/image_slider', auth: false,
                    controller: 'ImageSliderController', templateUrl: 'image_slider_sample/image_slider.html' },
                { title: 'Date', state: 'date', url: '/date', auth: false,
                    controller: 'DateController', templateUrl: 'date_sample/date.html' },
                { title: 'Color Picker', state: 'color_picker', url: '/color_picker', auth: false,
                    controller: 'ColorPickerController', templateUrl: 'color_picker_sample/color_picker.html' },
                { title: 'Markdown', state: 'markdown', url: '/markdown', auth: false,
                    controller: 'MarkdownController', templateUrl: 'markdown_sample/markdown.html' },
                { title: 'Refresh', state: 'refresh', url: '/refresh', auth: false,
                    controller: 'RefreshController', templateUrl: 'refresh_sample/refresh.html' },
                { title: 'Toggle Buttons', state: 'toggle_buttons', url: '/toggle_buttons', auth: false,
                    controller: 'ToggleButtonsController', templateUrl: 'toggle_buttons_sample/toggle_buttons.html' },
                { title: 'Information', state: 'information', url: '/information', auth: false,
                    controller: 'InformationController', templateUrl: 'information_dialog_sample/information_dialog.html' },
                { title: 'Confirmation', state: 'confirmation', url: '/confirmation', auth: false,
                    controller: 'ConfirmationController', templateUrl: 'confirmation_dialog_sample/confirmation_dialog.html' },
                { title: 'Options', state: 'options', url: '/options', auth: false,
                    controller: 'OptionsController', templateUrl: 'options_dialog_sample/options_dialog.html' },
               { title: 'Toasts', state: 'toasts', url: '/toasts', auth: false,
                    controller: 'ToastsController', templateUrl: 'toasts_sample/toasts.html' },
                { title: 'Tags', state: 'tags', url: '/tags', auth: false,
                    controller: 'TagsController', templateUrl: 'tags_sample/tags.html' }
                ],
                links = [
                    { title: 'Composite controls', href: '/pip-webui-composite/index.html'},
                    { title: 'Core', href: '/pip-webui-core/index.html'},
                    { title: 'CSS components', href: '/pip-webui-css/index.html'},
                    { title: 'Document controls', href: '/pip-webui-documents/index.html'},
                    { title: 'Entry pages', href: '/pip-webui-entry/index.html'},
                    { title: 'Error handling', href: '/pip-webui-errors/index.html'},
                    { title: 'Guidance components', href: '/pip-webui-guidance/index.html'},
                    { title: 'Help components', href: '/pip-webui-help/index.html'},
                    { title: 'Layouts', href: '/pip-webui-layouts/index.html'},
                    { title: 'Location Controls', href: '/pip-webui-locations/index.html'},
                    { title: 'Navigation controls', href: '/pip-webui-nav/index.html'},
                    { title: 'Picture controls', href: '/pip-webui-pictures/index.html'},
                    { title: 'REST API', href: '/pip-webui-rest/index.html'},
                    { title: 'Settings components', href: '/pip-webui-settings/index.html'},
                    { title: 'Support components', href: '/pip-webui-support/index.html'},
                    { title: 'Test Framework', href: '/pip-webui-test/index.html'}
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

            $urlRouterProvider.otherwise('/progress');

            // Configure REST API
            pipDataConfigProvider.serverUrl('http://alpha.pipservices.net');

            // Configure navigation menu
            pipSideNavProvider.sections([
                {
                    links: [{title: 'CONTROLS', url: '/progress'}]
                }/*, Links only for publishing samples
                {
                    links: links
                }

                /*,
                {
                    links: [{title: 'SIGNOUT', url: '/signout'}]
                }*/
            ]);
        }
    );

})(window.angular);

