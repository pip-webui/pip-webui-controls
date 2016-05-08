/**
 * @file Popover control
 * @copyright Digital Living Software Corp. 2014-2016
 *
 */

/* global _, angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipPopover", ['pipAssert']);

    thisModule.directive('pipPopover', function () {
        return {
            restrict: 'EA',
            scope: true,
            templateUrl: 'popover/popover.template.html',
            controller:
                function ($scope, $rootScope, $element, $timeout, $compile) {
                    var backdropElement = $('.pip-popover-backdrop');
                    backdropElement.on('click keydown scroll', backdropClick);
                    backdropElement.addClass($scope.params.responsive !== false ? 'pip-responsive' : '');

                    $timeout(function () {
                        position();
                        if ($scope.params.template) {
                            var content = $compile($scope.params.template)($scope);
                            $element.find('.pip-popover').append(content);
                        }

                        init();
                    });

                    $timeout(function() {
                        calcHeight();
                    }, 200);

                    $scope.onPopoverClick = onPopoverClick;
                    $scope = _.defaults($scope, $scope.$parent);
                    $rootScope.$on('pipWindowResized', onResize);
                    $rootScope.$on('pipPopoverResize', onResize);

                    function init() {
                        backdropElement.addClass('opened');
                        $('.pip-popover-backdrop').focus();
                        if ($scope.params.timeout) {
                            $timeout(function () {
                                closePopover();
                            }, $scope.params.timeout);
                        }
                    }

                    function backdropClick() {
                        if ($scope.params.cancelCallback)
                            $scope.params.cancelCallback();

                        closePopover();
                    }

                    function closePopover () {
                        backdropElement.removeClass('opened');
                        $timeout(function () {
                            backdropElement.remove();
                        }, 100);
                    }

                    function onPopoverClick ($e) {
                        $e.stopPropagation();
                    }

                    function position() {
                        if ($scope.params.element) {
                            var element = $($scope.params.element),
                                pos = element.offset(),
                                width = element.width(),
                                height = element.height(),
                                docWidth = $(document).width(),
                                docHeight = $(document).height(),
                                popover = backdropElement.find('.pip-popover');

                            if (pos)
                                popover
                                    .css('max-width', docWidth - (docWidth - pos.left))
                                    .css('max-height', docHeight - (pos.top + height) - 32)
                                    .css('left', pos.left - popover.width() + (width / 2))
                                    .css('top', pos.top + height + 16);
                        }
                    }

                    function calcHeight () {
                        if ($scope.params.calcHeight === false) return;

                        var popover = backdropElement.find('.pip-popover'),
                            title = popover.find('.pip-title'),
                            footer = popover.find('.pip-footer'),
                            content = popover.find('.pip-content'),
                            contentHeight = popover.height() - title.outerHeight(true) - footer.outerHeight(true);

                        content.css('max-height', contentHeight + 'px').css('box-sizing', 'border-box');
                    }

                    function onResize () {
                        backdropElement.find('.pip-popover').find('.pip-content').css('max-height', '100%');
                        position();
                        calcHeight();
                    }
                }
        };
    });

    thisModule.service('$pipPopover',
        function ($compile, $rootScope, $timeout) {
            var popoverTemplate = "<div class='pip-popover-backdrop {{ params.class }}' ng-controller='params.controller' tabindex='1'>" +
                                    "<pip-popover pip-params='params'>" +
                                    "</pip-popover>" +
                                  "</div>";

            return {
                show: onShow,
                hide: onHide,
                resize: onResize
            };

            function onShow(params) {
                var element = $('body');

                if (element.find('md-backdrop').length > 0) return;
                onHide();

                var scope = $rootScope.$new(),
                    params = params && _.isObject(params) ? params : {},
                    content;

                scope.params = params;
                scope.locals = params.locals;
                content = $compile(popoverTemplate)(scope);
                element.append(content);
            }

            function onHide () {
                var backdropElement = $('.pip-popover-backdrop');

                backdropElement.removeClass('opened');
                $timeout(function () {
                    backdropElement.remove();
                }, 100);
            }

            function onResize () {
                $rootScope.$broadcast('pipPopoverResize');
            }

        }
    );

})();
