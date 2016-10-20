/* eslint-disable max-len */
/* eslint-disable no-console */

(function (angular, $) {
    'use strict';

    var thisModule = angular.module('appControls.Popover', []);

    thisModule.controller('PopoverController',
        function ($scope, $rootScope, $injector, pipPopoverService,  $timeout) { // pipTranslate, pipAppBar,

            var pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;

            if (pipTranslate) {
                pipTranslate.translations('en', {
                    SHOW_POPOVER: 'Function to show popover ',
                    TITLE_POPOVER: 'Credibly create magnetic experiences through sustainable schemas',
                    TEXT_POPOVER: 'Credibly create magnetic experiences through sustainable schemas' + 
                    'Synergistically enable B2B methods of empowerment vis-a-vis just in time meta-services. it cutting-edge.',
                    CLICK_HELP: 'Click help button',
                    SAMPLE: 'Sample',                    
                    CODE: 'Code'
                });
                pipTranslate.translations('ru', {
                    SHOW_POPOVER: 'Функция для отображения popover',
                    TITLE_POPOVER: 'Заголовок для popovera с двумя строками возможно',
                    TEXT_POPOVER: 'Правдоподобно итерацию бесшовных электронных услуг без масштаба предприятия ниши markets.' +
                    'Synergistically позволяют методы B2B расширения возможностей визави как раз вовремя, мета-услуг. это ультрасовременные.',
                    CLICK_HELP: 'Нажмите кнопку помощи',
                    SAMPLE: 'Sample',  
                    CODE: 'Code'                                      
                });
                $scope.title = pipTranslate.translate('TITLE_POPOVER');
                $scope.content = pipTranslate.translate('TEXT_POPOVER');
                $scope.clickHelp = pipTranslate.translate('CLICK_HELP');
                $scope.showPopover = pipTranslate.translate('SHOW_POPOVER');
                $scope.sample = pipTranslate.translate('SAMPLE');
                $scope.code = pipTranslate.translate('CODE');                
            } else {
                $scope.title = 'Title popover';
                $scope.showPopover = 'Show popover';
                $scope.content = 'Text popover';
                $scope.clickHelp = 'Click help';
                $scope.sample = 'Sample';
                $scope.code = 'Code';                
            }

            $timeout(function() {
                $('pre code').each(function(i, block) {
                    Prism.highlightElement(block);
                });
            });

            $scope.showTip = function () {
                pipPopoverService.show({
                    class: 'pip-tip',
                    locals: {
                        title: $scope.title,
                        content: $scope.content
                    },
                    cancelCallback: function () {
                        console.log('backdrop clicked');
                    },
                    controller: function ($scope, $timeout) {
                        $scope.title = $scope.locals.title;
                        $scope.content = $scope.locals.content;
                        $scope.image = 'https://static.pexels.com/photos/136211/pexels-photo-136211-large.jpeg';

                        $scope.onNextClick = function () {
                            console.log('on next click');
                            pipPopoverService.hide();
                        };

                        $timeout(function () {
                            $('.pip-popover').find('.pip-pic').css('background-image', 'url(' + $scope.image + ')');
                        }, 200);
                    },
                    template: '<div class="pip-title m24 bm16 text-subhead2">{{ title }}</div>' +
                        '<div class="pip-content pip-popover-content p24 tp0 bp0 bm64">' +
                        '<div class="pip-pic bm16"></div>{{ content }}</div>' +
                        '<div class="pip-footer p24 tp8 bp8 rp16 position-bottom" layout="row" layout-align="start center">' +
                        '<div class="flex"></div><md-button ng-click="onNextClick()">NEXT</md-button></div>'
                });
            };

            $scope.showQuote = function () {
                pipPopoverService.show({
                    class: 'pip-quote',
                    locals: {
                        content: $scope.content
                    },
                    cancelCallback: function () {
                        console.log('backdrop clicked');
                    },
                    controller: function ($scope) {
                        $scope.content = $scope.locals.content;
                        $scope.author = 'Text generator';

                        $scope.onNextClick = function () {
                            console.log('on next click');
                            pipPopoverService.resize();
                            // pipPopoverService.hide();
                        };
                    },
                    template: '<div class="pip-content pip-popover-content text-subhead2 p24 bp0 bm64">' +
                        '{{ content }}</div>' +
                        '<div class="pip-footer p24 tp8 bp8 rp16 position-bottom" layout="row" layout-align="start center">' +
                        '<div class="text-body1">{{ author }}</div><div class="flex"></div><md-button ng-click="onNextClick()">NEXT</md-button></div>'
                });
            };

            $scope.showHelp = function ($event, content) {
                pipPopoverService.show({
                    responsive: false,
                    element: $event.currentTarget,
                    class: 'pip-help',
                    locals: {
                        content: content || $scope.content
                    },
                    cancelCallback: function () {
                        console.log('backdrop clicked');
                    },
                    controller: function ($scope) {
                        $scope.content = $scope.locals.content;

                        $scope.onNextClick = function () {
                            console.log('on next click');
                            pipPopoverService.hide();
                        };
                    },
                    template: '<div class="pip-title h24"></div><div class="pip-content pip-popover-content lp24 rp24">' +
                        '{{ content }}</div><div class="h24 pip-footer"></div>'
                });
            };
        }
    );

})(window.angular, window.jQuery);
