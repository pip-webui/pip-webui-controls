(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.pip || (g.pip = {})).controls = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function () {
    'use strict';
    var thisModule = angular.module('pipColorPicker', ['pipControls.Templates']);
    thisModule.directive('pipColorPicker', function () {
        return {
            restrict: 'EA',
            scope: {
                ngDisabled: '&',
                colors: '=pipColors',
                currentColor: '=ngModel',
                colorChange: '&ngChange'
            },
            templateUrl: 'color_picker/color_picker.html',
            controller: 'pipColorPickerController'
        };
    });
    thisModule.controller('pipColorPickerController', ['$scope', '$element', '$attrs', '$timeout', function ($scope, $element, $attrs, $timeout) {
        var DEFAULT_COLORS = ['purple', 'lightgreen', 'green', 'darkred', 'pink', 'yellow', 'cyan'];
        $scope.class = $attrs.class || '';
        if (!$scope.colors || _.isArray($scope.colors) && $scope.colors.length === 0) {
            $scope.colors = DEFAULT_COLORS;
        }
        $scope.currentColor = $scope.currentColor || $scope.colors[0];
        $scope.currentColorIndex = $scope.colors.indexOf($scope.currentColor);
        $scope.disabled = function () {
            if ($scope.ngDisabled) {
                return $scope.ngDisabled();
            }
            return true;
        };
        $scope.selectColor = function (index) {
            if ($scope.disabled()) {
                return;
            }
            $scope.currentColorIndex = index;
            $scope.currentColor = $scope.colors[$scope.currentColorIndex];
            $timeout(function () {
                $scope.$apply();
            });
            if ($scope.colorChange) {
                $scope.colorChange();
            }
        };
        $scope.enterSpacePress = function (event) {
            $scope.selectColor(event.index);
        };
    }]);
})();
},{}],2:[function(require,module,exports){
(function () {
    'use strict';
    angular.module('pipControls', [
        'pipMarkdown',
        'pipColorPicker',
        'pipRoutingProgress',
        'pipPopover',
        'pipImageSlider',
        'pipToasts',
        'pipControls.Translate'
    ]);
})();
},{}],3:[function(require,module,exports){
(function () {
    'use strict';
    var thisModule = angular.module('pipControls.Translate', []);
    thisModule.filter('translate', ['$injector', function ($injector) {
        var pipTranslate = $injector.has('pipTranslate')
            ? $injector.get('pipTranslate') : null;
        return function (key) {
            return pipTranslate ? pipTranslate.translate(key) || key : key;
        };
    }]);
})();
},{}],4:[function(require,module,exports){
(function () {
    'use strict';
    var thisModule = angular.module('pipImageSlider', ['pipSliderButton', 'pipSliderIndicator', 'pipImageSlider.Service']);
    thisModule.directive('pipImageSlider', function () {
        return {
            scope: {
                sliderIndex: '=pipImageIndex'
            },
            controller: ['$scope', '$element', '$attrs', '$parse', '$timeout', '$interval', '$pipImageSlider', function ($scope, $element, $attrs, $parse, $timeout, $interval, $pipImageSlider) {
                var blocks, index = 0, newIndex, direction, type = $parse($attrs.pipAnimationType)($scope), DEFAULT_INTERVAL = 4500, interval = $parse($attrs.pipAnimationInterval)($scope), timePromises, throttled;
                $element.addClass('pip-image-slider');
                $element.addClass('pip-animation-' + type);
                $scope.swipeStart = 0;
                setIndex();
                $timeout(function () {
                    blocks = $element.find('.pip-animation-block');
                    if (blocks.length > 0) {
                        $(blocks[0]).addClass('pip-show');
                    }
                });
                startInterval();
                throttled = _.throttle(function () {
                    $pipImageSlider.toBlock(type, blocks, index, newIndex, direction);
                    index = newIndex;
                    setIndex();
                }, 700);
                $scope.nextBlock = function () {
                    restartInterval();
                    newIndex = index + 1 === blocks.length ? 0 : index + 1;
                    direction = 'next';
                    throttled();
                };
                $scope.prevBlock = function () {
                    restartInterval();
                    newIndex = index - 1 < 0 ? blocks.length - 1 : index - 1;
                    direction = 'prev';
                    throttled();
                };
                $scope.slideTo = function (nextIndex) {
                    if (nextIndex === index || nextIndex > blocks.length - 1) {
                        return;
                    }
                    restartInterval();
                    newIndex = nextIndex;
                    direction = nextIndex > index ? 'next' : 'prev';
                    throttled();
                };
                if ($attrs.id)
                    $pipImageSlider.registerSlider($attrs.id, $scope);
                function setIndex() {
                    if ($attrs.pipImageIndex)
                        $scope.sliderIndex = index;
                }
                function startInterval() {
                    timePromises = $interval(function () {
                        newIndex = index + 1 === blocks.length ? 0 : index + 1;
                        direction = 'next';
                        throttled();
                    }, interval || DEFAULT_INTERVAL);
                }
                function stopInterval() {
                    $interval.cancel(timePromises);
                }
                $element.on('$destroy', function () {
                    stopInterval();
                    $pipImageSlider.removeSlider($attrs.id);
                });
                function restartInterval() {
                    stopInterval();
                    startInterval();
                }
            }]
        };
    });
})();
},{}],5:[function(require,module,exports){
(function () {
    'use strict';
    var thisModule = angular.module('pipImageSlider.Service', []);
    thisModule.service('$pipImageSlider', ['$timeout', function ($timeout) {
        var ANIMATION_DURATION = 550, sliders = {};
        return {
            nextCarousel: nextCarousel,
            prevCarousel: prevCarousel,
            toBlock: toBlock,
            registerSlider: register,
            removeSlider: remove,
            getSliderScope: getSlider
        };
        function register(sliderId, sliderScope) {
            sliders[sliderId] = sliderScope;
        }
        function remove(sliderId) {
            delete sliders[sliderId];
        }
        function getSlider(sliderId) {
            return sliders[sliderId];
        }
        function nextCarousel(nextBlock, prevBlock) {
            nextBlock.addClass('pip-next');
            $timeout(function () {
                nextBlock.addClass('animated').addClass('pip-show').removeClass('pip-next');
                prevBlock.addClass('animated').removeClass('pip-show');
            }, 100);
        }
        function prevCarousel(nextBlock, prevBlock) {
            $timeout(function () {
                nextBlock.addClass('animated').addClass('pip-show');
                prevBlock.addClass('animated').addClass('pip-next').removeClass('pip-show');
            }, 100);
        }
        function toBlock(type, blocks, oldIndex, nextIndex, direction) {
            var prevBlock = $(blocks[oldIndex]), blockIndex = nextIndex, nextBlock = $(blocks[blockIndex]);
            if (type === 'carousel') {
                $(blocks).removeClass('pip-next').removeClass('pip-prev').removeClass('animated');
                if (direction && (direction === 'prev' || direction === 'next')) {
                    if (direction === 'prev') {
                        prevCarousel(nextBlock, prevBlock);
                    }
                    else {
                        nextCarousel(nextBlock, prevBlock);
                    }
                }
                else {
                    if (nextIndex && nextIndex < oldIndex) {
                        prevCarousel(nextBlock, prevBlock);
                    }
                    else {
                        nextCarousel(nextBlock, prevBlock);
                    }
                }
            }
            else {
                prevBlock.addClass('animated').removeClass('pip-show');
                nextBlock.addClass('animated').addClass('pip-show');
            }
        }
    }]);
})();
},{}],6:[function(require,module,exports){
(function () {
    'use strict';
    var thisModule = angular.module('pipSliderButton', []);
    thisModule.directive('pipSliderButton', function () {
        return {
            scope: {},
            controller: ['$scope', '$element', '$parse', '$attrs', '$pipImageSlider', function ($scope, $element, $parse, $attrs, $pipImageSlider) {
                var type = $parse($attrs.pipButtonType)($scope), sliderId = $parse($attrs.pipSliderId)($scope);
                $element.on('click', function () {
                    if (!sliderId || !type) {
                        return;
                    }
                    $pipImageSlider.getSliderScope(sliderId)[type + 'Block']();
                });
            }]
        };
    });
})();
},{}],7:[function(require,module,exports){
(function () {
    'use strict';
    var thisModule = angular.module('pipSliderIndicator', []);
    thisModule.directive('pipSliderIndicator', function () {
        return {
            scope: false,
            controller: ['$scope', '$element', '$parse', '$attrs', '$pipImageSlider', function ($scope, $element, $parse, $attrs, $pipImageSlider) {
                var sliderId = $parse($attrs.pipSliderId)($scope), slideTo = $parse($attrs.pipSlideTo)($scope);
                $element.css('cursor', 'pointer');
                $element.on('click', function () {
                    if (!sliderId || slideTo && slideTo < 0) {
                        return;
                    }
                    $pipImageSlider.getSliderScope(sliderId).slideTo(slideTo);
                });
            }]
        };
    });
})();
},{}],8:[function(require,module,exports){
(function () {
    'use strict';
    var thisModule = angular.module('pipMarkdown', ['ngSanitize']);
    thisModule.run(['$injector', function ($injector) {
        var pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;
        if (pipTranslate) {
            pipTranslate.setTranslations('en', {
                'MARKDOWN_ATTACHMENTS': 'Attachments:',
                'checklist': 'Checklist',
                'documents': 'Documents',
                'pictures': 'Pictures',
                'location': 'Location',
                'time': 'Time'
            });
            pipTranslate.setTranslations('ru', {
                'MARKDOWN_ATTACHMENTS': 'Вложения:',
                'checklist': 'Список',
                'documents': 'Документы',
                'pictures': 'Изображения',
                'location': 'Местонахождение',
                'time': 'Время'
            });
        }
    }]);
    thisModule.directive('pipMarkdown', ['$parse', '$injector', function ($parse, $injector) {
        var pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;
        return {
            restrict: 'EA',
            scope: false,
            link: function ($scope, $element, $attrs) {
                var textGetter = $parse($attrs.pipText), listGetter = $parse($attrs.pipList), clampGetter = $parse($attrs.pipLineCount);
                function describeAttachments(array) {
                    var attachString = '', attachTypes = [];
                    _.each(array, function (attach) {
                        if (attach.type && attach.type !== 'text') {
                            if (attachString.length === 0 && pipTranslate) {
                                attachString = pipTranslate.translate('MARKDOWN_ATTACHMENTS');
                            }
                            if (attachTypes.indexOf(attach.type) < 0) {
                                attachTypes.push(attach.type);
                                attachString += attachTypes.length > 1 ? ', ' : ' ';
                                if (pipTranslate)
                                    attachString += pipTranslate.translate(attach.type);
                            }
                        }
                    });
                    return attachString;
                }
                function toBoolean(value) {
                    if (value == null)
                        return false;
                    if (!value)
                        return false;
                    value = value.toString().toLowerCase();
                    return value == '1' || value == 'true';
                }
                function bindText(value) {
                    var textString, isClamped, height, options, obj;
                    if (_.isArray(value)) {
                        obj = _.find(value, function (item) {
                            return item.type === 'text' && item.text;
                        });
                        textString = obj ? obj.text : describeAttachments(value);
                    }
                    else {
                        textString = value;
                    }
                    isClamped = $attrs.pipLineCount && _.isNumber(clampGetter());
                    isClamped = isClamped && textString && textString.length > 0;
                    options = {
                        gfm: true,
                        tables: true,
                        breaks: true,
                        sanitize: true,
                        pedantic: true,
                        smartLists: true,
                        smartypents: false
                    };
                    textString = marked(textString || '', options);
                    if (isClamped) {
                        height = 1.5 * clampGetter();
                    }
                    $element.html('<div' + (isClamped ? listGetter() ? 'class="pip-markdown-content ' +
                        'pip-markdown-list" style="max-height: ' + height + 'em">'
                        : ' class="pip-markdown-content" style="max-height: ' + height + 'em">' : listGetter()
                        ? ' class="pip-markdown-list">' : '>') + textString + '</div>');
                    $element.find('a').attr('target', 'blank');
                    if (!listGetter() && isClamped) {
                        $element.append('<div class="pip-gradient-block"></div>');
                    }
                }
                bindText(textGetter($scope));
                if (toBoolean($attrs.pipRebind)) {
                    $scope.$watch(textGetter, function (newValue) {
                        bindText(newValue);
                    });
                }
                $scope.$on('pipWindowResized', function () {
                    bindText(textGetter($scope));
                });
                $element.addClass('pip-markdown');
            }
        };
    }]);
})();
},{}],9:[function(require,module,exports){
(function () {
    'use strict';
    var thisModule = angular.module('pipPopover', ['pipPopover.Service']);
    thisModule.directive('pipPopover', function () {
        return {
            restrict: 'EA',
            scope: true,
            templateUrl: 'popover/popover.html',
            controller: ['$scope', '$rootScope', '$element', '$timeout', '$compile', function ($scope, $rootScope, $element, $timeout, $compile) {
                var backdropElement, content;
                backdropElement = $('.pip-popover-backdrop');
                backdropElement.on('click keydown scroll', backdropClick);
                backdropElement.addClass($scope.params.responsive !== false ? 'pip-responsive' : '');
                $timeout(function () {
                    position();
                    if ($scope.params.template) {
                        content = $compile($scope.params.template)($scope);
                        $element.find('.pip-popover').append(content);
                    }
                    init();
                });
                $timeout(function () {
                    calcHeight();
                }, 200);
                $scope.onPopoverClick = onPopoverClick;
                $scope = _.defaults($scope, $scope.$parent);
                $rootScope.$on('pipPopoverResize', onResize);
                $(window).resize(onResize);
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
                    if ($scope.params.cancelCallback) {
                        $scope.params.cancelCallback();
                    }
                    closePopover();
                }
                function closePopover() {
                    backdropElement.removeClass('opened');
                    $timeout(function () {
                        backdropElement.remove();
                    }, 100);
                }
                function onPopoverClick($e) {
                    $e.stopPropagation();
                }
                function position() {
                    if ($scope.params.element) {
                        var element = $($scope.params.element), pos = element.offset(), width = element.width(), height = element.height(), docWidth = $(document).width(), docHeight = $(document).height(), popover = backdropElement.find('.pip-popover');
                        if (pos) {
                            popover
                                .css('max-width', docWidth - (docWidth - pos.left))
                                .css('max-height', docHeight - (pos.top + height) - 32, 0)
                                .css('left', pos.left - popover.width() + width / 2)
                                .css('top', pos.top + height + 16);
                        }
                    }
                }
                function calcHeight() {
                    if ($scope.params.calcHeight === false) {
                        return;
                    }
                    var popover = backdropElement.find('.pip-popover'), title = popover.find('.pip-title'), footer = popover.find('.pip-footer'), content = popover.find('.pip-content'), contentHeight = popover.height() - title.outerHeight(true) - footer.outerHeight(true);
                    content.css('max-height', Math.max(contentHeight, 0) + 'px').css('box-sizing', 'border-box');
                }
                function onResize() {
                    backdropElement.find('.pip-popover').find('.pip-content').css('max-height', '100%');
                    position();
                    calcHeight();
                }
            }]
        };
    });
})();
},{}],10:[function(require,module,exports){
(function () {
    'use strict';
    var thisModule = angular.module('pipPopover.Service', []);
    thisModule.service('pipPopoverService', ['$compile', '$rootScope', '$timeout', function ($compile, $rootScope, $timeout) {
        var popoverTemplate;
        popoverTemplate = "<div class='pip-popover-backdrop {{ params.class }}' ng-controller='params.controller'" +
            " tabindex='1'> <pip-popover pip-params='params'> </pip-popover> </div>";
        return {
            show: onShow,
            hide: onHide,
            resize: onResize
        };
        function onShow(p) {
            var element, scope, params, content;
            element = $('body');
            if (element.find('md-backdrop').length > 0) {
                return;
            }
            onHide();
            scope = $rootScope.$new();
            params = p && _.isObject(p) ? p : {};
            scope.params = params;
            scope.locals = params.locals;
            content = $compile(popoverTemplate)(scope);
            element.append(content);
        }
        function onHide() {
            var backdropElement = $('.pip-popover-backdrop');
            backdropElement.removeClass('opened');
            $timeout(function () {
                backdropElement.remove();
            }, 100);
        }
        function onResize() {
            $rootScope.$broadcast('pipPopoverResize');
        }
    }]);
})();
},{}],11:[function(require,module,exports){
(function () {
    'use strict';
    var thisModule = angular.module('pipRoutingProgress', ['ngMaterial']);
    thisModule.directive('pipRoutingProgress', function () {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                showProgress: '&',
                logoUrl: '@'
            },
            templateUrl: 'progress/routing_progress.html',
            controller: 'pipRoutingProgressController'
        };
    });
    thisModule.controller('pipRoutingProgressController', ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
        var image = $element.children('img');
        loadProgressImage();
        return;
        function loadProgressImage() {
            if ($scope.logoUrl) {
                image.attr('src', $scope.logoUrl);
            }
        }
    }]);
})();
},{}],12:[function(require,module,exports){
(function () {
    'use strict';
    var thisModule = angular.module('pipToasts', ['ngMaterial', 'pipControls.Translate']);
    thisModule.controller('pipToastController', ['$scope', '$mdToast', 'toast', '$injector', function ($scope, $mdToast, toast, $injector) {
        var pipErrorDetailsDialog = $injector.has('pipErrorDetailsDialog')
            ? $injector.get('pipErrorDetailsDialog') : null;
        $scope.message = toast.message;
        $scope.actions = toast.actions;
        $scope.toast = toast;
        if (toast.actions.length === 0) {
            $scope.actionLenght = 0;
        }
        else if (toast.actions.length === 1) {
            $scope.actionLenght = toast.actions[0].toString().length;
        }
        else {
            $scope.actionLenght = null;
        }
        $scope.showDetails = pipErrorDetailsDialog != null;
        $scope.onDetails = function () {
            $mdToast.hide();
            if (pipErrorDetailsDialog) {
                pipErrorDetailsDialog.show({
                    error: $scope.toast.error,
                    ok: 'Ok'
                }, angular.noop, angular.noop);
            }
        };
        $scope.onAction = function (action) {
            $mdToast.hide({
                action: action,
                id: toast.id,
                message: toast.message
            });
        };
    }]);
    thisModule.service('pipToasts', ['$rootScope', '$mdToast', function ($rootScope, $mdToast) {
        var SHOW_TIMEOUT = 20000, SHOW_TIMEOUT_NOTIFICATIONS = 20000, toasts = [], currentToast, sounds = {};
        $rootScope.$on('$stateChangeSuccess', onStateChangeSuccess);
        $rootScope.$on('pipSessionClosed', onClearToasts);
        $rootScope.$on('pipIdentityChanged', onClearToasts);
        return {
            showNotification: showNotification,
            showMessage: showMessage,
            showError: showError,
            hideAllToasts: hideAllToasts,
            clearToasts: clearToasts,
            removeToastsById: removeToastsById,
            getToastById: getToastById
        };
        function showNextToast() {
            var toast;
            if (toasts.length > 0) {
                toast = toasts[0];
                toasts.splice(0, 1);
                showToast(toast);
            }
        }
        function showToast(toast) {
            currentToast = toast;
            $mdToast.show({
                templateUrl: 'toast/toast.html',
                hideDelay: toast.duration || SHOW_TIMEOUT,
                position: 'bottom left',
                controller: 'pipToastController',
                locals: {
                    toast: currentToast,
                    sounds: sounds
                }
            })
                .then(function showToastOkResult(action) {
                if (currentToast.successCallback) {
                    currentToast.successCallback(action);
                }
                currentToast = null;
                showNextToast();
            }, function showToastCancelResult(action) {
                if (currentToast.cancelCallback) {
                    currentToast.cancelCallback(action);
                }
                currentToast = null;
                showNextToast();
            });
        }
        function addToast(toast) {
            if (currentToast && toast.type !== 'error') {
                toasts.push(toast);
            }
            else {
                showToast(toast);
            }
        }
        function removeToasts(type) {
            var result = [];
            _.each(toasts, function (toast) {
                if (!toast.type || toast.type !== type) {
                    result.push(toast);
                }
            });
            toasts = _.cloneDeep(result);
        }
        function removeToastsById(id) {
            _.remove(toasts, { id: id });
        }
        function getToastById(id) {
            return _.find(toasts, { id: id });
        }
        function onStateChangeSuccess() {
        }
        function onClearToasts() {
            clearToasts();
        }
        function showNotification(message, actions, successCallback, cancelCallback, id) {
            addToast({
                id: id || null,
                type: 'notification',
                message: message,
                actions: actions || ['ok'],
                successCallback: successCallback,
                cancelCallback: cancelCallback,
                duration: SHOW_TIMEOUT_NOTIFICATIONS
            });
        }
        function showMessage(message, successCallback, cancelCallback, id) {
            addToast({
                id: id || null,
                type: 'message',
                message: message,
                actions: ['ok'],
                successCallback: successCallback,
                cancelCallback: cancelCallback
            });
        }
        function showError(message, successCallback, cancelCallback, id, error) {
            addToast({
                id: id || null,
                error: error,
                type: 'error',
                message: message || 'Unknown error.',
                actions: ['ok'],
                successCallback: successCallback,
                cancelCallback: cancelCallback
            });
        }
        function hideAllToasts() {
            $mdToast.cancel();
            toasts = [];
        }
        function clearToasts(type) {
            if (type) {
                removeToasts(type);
            }
            else {
                $mdToast.cancel();
                toasts = [];
            }
        }
    }]);
})();
},{}],13:[function(require,module,exports){
(function(module) {
try {
  module = angular.module('pipControls.Templates');
} catch (e) {
  module = angular.module('pipControls.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('color_picker/color_picker.html',
    '<ul class="pip-color-picker {{class}}" pip-selected="currentColorIndex" pip-enter-space-press="enterSpacePress($event)"><li tabindex="-1" ng-repeat="color in colors track by color"><md-button tabindex="-1" class="md-icon-button pip-selectable" ng-click="selectColor($index)" aria-label="color" ng-disabled="disabled()"><md-icon ng-style="{\'color\': color}" md-svg-icon="icons:{{ color == currentColor ? \'circle\' : \'radio-off\' }}"></md-icon></md-button></li></ul>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipControls.Templates');
} catch (e) {
  module = angular.module('pipControls.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('popover/popover.html',
    '<div ng-if="params.templateUrl" class="pip-popover flex layout-column" ng-click="onPopoverClick($event)" ng-include="params.templateUrl"></div><div ng-if="params.template" class="pip-popover" ng-click="onPopoverClick($event)"></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipControls.Templates');
} catch (e) {
  module = angular.module('pipControls.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('progress/routing_progress.html',
    '<div class="pip-routing-progress layout-column layout-align-center-center" ng-show="showProgress()"><div class="loader"><svg class="circular" viewbox="25 25 50 50"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"></circle></svg></div><img src="" height="40" width="40" class="pip-img"><md-progress-circular md-diameter="96" class="fix-ie"></md-progress-circular></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipControls.Templates');
} catch (e) {
  module = angular.module('pipControls.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('toast/toast.html',
    '<md-toast class="md-action pip-toast" ng-class="{\'pip-error\': toast.type==\'error\', \'pip-column-toast\': toast.actions.length > 1 || actionLenght > 4, \'pip-no-action-toast\': actionLenght == 0}" style="height:initial; max-height: initial;"><span class="flex-var pip-text" ng-bind-html="message"></span><div class="layout-row layout-align-end-start pip-actions" ng-if="actions.length > 0 || (toast.type==\'error\' && toast.error)"><div class="flex" ng-if="toast.actions.length > 1"></div><md-button class="flex-fixed pip-toast-button" ng-if="toast.type==\'error\' && toast.error && showDetails" ng-click="onDetails()">Details</md-button><md-button class="flex-fixed pip-toast-button" ng-click="onAction(action)" ng-repeat="action in actions" aria-label="{{::action| translate}}">{{::action| translate}}</md-button></div></md-toast>');
}]);
})();



},{}]},{},[13,1,2,3,5,4,6,7,8,10,9,11,12])(13)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29sb3JfcGlja2VyL2NvbG9yX3BpY2tlci50cyIsInNyYy9jb250cm9scy50cyIsInNyYy9kZXBlbmRlbmNpZXMvdHJhbnNsYXRlLnRzIiwic3JjL2ltYWdlX3NsaWRlci9pbWFnZV9zbGlkZXIudHMiLCJzcmMvaW1hZ2Vfc2xpZGVyL2ltYWdlX3NsaWRlcl9zZXJ2aWNlLnRzIiwic3JjL2ltYWdlX3NsaWRlci9zbGlkZXJfYnV0dG9uLnRzIiwic3JjL2ltYWdlX3NsaWRlci9zbGlkZXJfaW5kaWNhdG9yLnRzIiwic3JjL21hcmtkb3duL21hcmtkb3duLnRzIiwic3JjL3BvcG92ZXIvcG9wb3Zlci50cyIsInNyYy9wb3BvdmVyL3BvcG92ZXJfc2VydmljZS50cyIsInNyYy9wcm9ncmVzcy9yb3V0aW5nX3Byb2dyZXNzLnRzIiwic3JjL3RvYXN0L3RvYXN0cy50cyIsInRlbXAvcGlwLXdlYnVpLWNvbnRyb2xzLWh0bWwubWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDRUEsQ0FBQztJQUNHLFlBQVksQ0FBQztJQUViLElBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsQ0FBRSx1QkFBdUIsQ0FBQyxDQUFDLENBQUM7SUFFOUUsVUFBVSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsRUFDakM7UUFDSSxNQUFNLENBQUM7WUFDSCxRQUFRLEVBQUUsSUFBSTtZQUNkLEtBQUssRUFBRTtnQkFDSCxVQUFVLEVBQUUsR0FBRztnQkFDZixNQUFNLEVBQUUsWUFBWTtnQkFDcEIsWUFBWSxFQUFFLFVBQVU7Z0JBQ3hCLFdBQVcsRUFBRSxXQUFXO2FBQzNCO1lBQ0QsV0FBVyxFQUFFLGdDQUFnQztZQUM3QyxVQUFVLEVBQUUsMEJBQTBCO1NBQ3pDLENBQUM7SUFDTixDQUFDLENBQ0osQ0FBQztJQUNGLFVBQVUsQ0FBQyxVQUFVLENBQUMs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Qzs7QUM3UEw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vdHlwaW5ncy90c2QuZC50c1wiIC8+XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciB0aGlzTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcENvbG9yUGlja2VyJywgWyAncGlwQ29udHJvbHMuVGVtcGxhdGVzJ10pOyAvLyAncGlwRm9jdXNlZCcsXHJcblxyXG4gICAgdGhpc01vZHVsZS5kaXJlY3RpdmUoJ3BpcENvbG9yUGlja2VyJyxcclxuICAgICAgICBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICAgICAgICAgIHNjb3BlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmdEaXNhYmxlZDogJyYnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yczogJz1waXBDb2xvcnMnLFxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRDb2xvcjogJz1uZ01vZGVsJyxcclxuICAgICAgICAgICAgICAgICAgICBjb2xvckNoYW5nZTogJyZuZ0NoYW5nZSdcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbG9yX3BpY2tlci9jb2xvcl9waWNrZXIuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAncGlwQ29sb3JQaWNrZXJDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICk7XHJcbiAgICB0aGlzTW9kdWxlLmNvbnRyb2xsZXIoJ3BpcENvbG9yUGlja2VyQ29udHJvbGxlcicsXHJcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycywgJHRpbWVvdXQpIHtcclxuICAgICAgICAgICAgdmFyXHJcbiAgICAgICAgICAgICAgICBERUZBVUxUX0NPTE9SUyA9IFsncHVycGxlJywgJ2xpZ2h0Z3JlZW4nLCAnZ3JlZW4nLCAnZGFya3JlZCcsICdwaW5rJywgJ3llbGxvdycsICdjeWFuJ107XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuY2xhc3MgPSAkYXR0cnMuY2xhc3MgfHwgJyc7XHJcblxyXG4gICAgICAgICAgICBpZiAoISRzY29wZS5jb2xvcnMgfHwgXy5pc0FycmF5KCRzY29wZS5jb2xvcnMpICYmICRzY29wZS5jb2xvcnMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuY29sb3JzID0gREVGQVVMVF9DT0xPUlM7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRzY29wZS5jdXJyZW50Q29sb3IgPSAkc2NvcGUuY3VycmVudENvbG9yIHx8ICRzY29wZS5jb2xvcnNbMF07XHJcbiAgICAgICAgICAgICRzY29wZS5jdXJyZW50Q29sb3JJbmRleCA9ICRzY29wZS5jb2xvcnMuaW5kZXhPZigkc2NvcGUuY3VycmVudENvbG9yKTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5kaXNhYmxlZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlmICgkc2NvcGUubmdEaXNhYmxlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkc2NvcGUubmdEaXNhYmxlZCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnNlbGVjdENvbG9yID0gZnVuY3Rpb24gKGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoJHNjb3BlLmRpc2FibGVkKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuY3VycmVudENvbG9ySW5kZXggPSBpbmRleDtcclxuXHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuY3VycmVudENvbG9yID0gJHNjb3BlLmNvbG9yc1skc2NvcGUuY3VycmVudENvbG9ySW5kZXhdO1xyXG5cclxuICAgICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoJHNjb3BlLmNvbG9yQ2hhbmdlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNvbG9yQ2hhbmdlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuZW50ZXJTcGFjZVByZXNzID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuc2VsZWN0Q29sb3IoZXZlbnQuaW5kZXgpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICk7XHJcblxyXG59KSgpO1xyXG4iLCLvu78vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vdHlwaW5ncy90c2QuZC50c1wiIC8+XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdwaXBDb250cm9scycsIFtcclxuICAgICAgICAncGlwTWFya2Rvd24nLFxyXG4gICAgICAgICdwaXBDb2xvclBpY2tlcicsXHJcbiAgICAgICAgJ3BpcFJvdXRpbmdQcm9ncmVzcycsXHJcbiAgICAgICAgJ3BpcFBvcG92ZXInLFxyXG4gICAgICAgICdwaXBJbWFnZVNsaWRlcicsXHJcbiAgICAgICAgJ3BpcFRvYXN0cycsXHJcbiAgICAgICAgJ3BpcENvbnRyb2xzLlRyYW5zbGF0ZSdcclxuICAgIF0pO1xyXG5cclxufSkoKTtcclxuXHJcbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi90eXBpbmdzL3RzZC5kLnRzXCIgLz5cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIHRoaXNNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgncGlwQ29udHJvbHMuVHJhbnNsYXRlJywgW10pO1xyXG5cclxuICAgIHRoaXNNb2R1bGUuZmlsdGVyKCd0cmFuc2xhdGUnLCBmdW5jdGlvbiAoJGluamVjdG9yKSB7XHJcbiAgICAgICAgdmFyIHBpcFRyYW5zbGF0ZSA9ICRpbmplY3Rvci5oYXMoJ3BpcFRyYW5zbGF0ZScpIFxyXG4gICAgICAgICAgICA/ICRpbmplY3Rvci5nZXQoJ3BpcFRyYW5zbGF0ZScpIDogbnVsbDtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHBpcFRyYW5zbGF0ZSAgPyBwaXBUcmFuc2xhdGUudHJhbnNsYXRlKGtleSkgfHwga2V5IDoga2V5O1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxufSkoKTtcclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgdGhpc01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBJbWFnZVNsaWRlcicsIFsncGlwU2xpZGVyQnV0dG9uJywgJ3BpcFNsaWRlckluZGljYXRvcicsICdwaXBJbWFnZVNsaWRlci5TZXJ2aWNlJ10pO1xyXG5cclxuICAgIHRoaXNNb2R1bGUuZGlyZWN0aXZlKCdwaXBJbWFnZVNsaWRlcicsXHJcbiAgICAgICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgc2NvcGU6IHtcclxuICAgICAgICAgICAgICAgICAgICBzbGlkZXJJbmRleDogJz1waXBJbWFnZUluZGV4J1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uICgkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMsICRwYXJzZSwgJHRpbWVvdXQsICRpbnRlcnZhbCwgJHBpcEltYWdlU2xpZGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGJsb2NrcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSAwLCBuZXdJbmRleCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlID0gJHBhcnNlKCRhdHRycy5waXBBbmltYXRpb25UeXBlKSgkc2NvcGUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBERUZBVUxUX0lOVEVSVkFMID0gNDUwMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJ2YWwgPSAkcGFyc2UoJGF0dHJzLnBpcEFuaW1hdGlvbkludGVydmFsKSgkc2NvcGUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aW1lUHJvbWlzZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm90dGxlZDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJGVsZW1lbnQuYWRkQ2xhc3MoJ3BpcC1pbWFnZS1zbGlkZXInKTtcclxuICAgICAgICAgICAgICAgICAgICAkZWxlbWVudC5hZGRDbGFzcygncGlwLWFuaW1hdGlvbi0nICsgdHlwZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5zd2lwZVN0YXJ0ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICAgICBpZiAoJHN3aXBlKVxyXG4gICAgICAgICAgICAgICAgICAgICAkc3dpcGUuYmluZCgkZWxlbWVudCwge1xyXG4gICAgICAgICAgICAgICAgICAgICAnc3RhcnQnOiBmdW5jdGlvbihjb29yZHMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgaWYgKGNvb3JkcykgJHNjb3BlLnN3aXBlU3RhcnQgPSBjb29yZHMueDtcclxuICAgICAgICAgICAgICAgICAgICAgZWxzZSAkc2NvcGUuc3dpcGVTdGFydCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICdlbmQnOiBmdW5jdGlvbihjb29yZHMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgdmFyIGRlbHRhO1xyXG4gICAgICAgICAgICAgICAgICAgICBpZiAoY29vcmRzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgIGRlbHRhID0gJHNjb3BlLnN3aXBlU3RhcnQgLSBjb29yZHMueDtcclxuICAgICAgICAgICAgICAgICAgICAgaWYgKGRlbHRhID4gMTUwKSAgJHNjb3BlLm5leHRCbG9jaygpO1xyXG4gICAgICAgICAgICAgICAgICAgICBpZiAoZGVsdGEgPCAtMTUwKSAgJHNjb3BlLnByZXZCbG9jaygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc3dpcGVTdGFydCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSAkc2NvcGUuc3dpcGVTdGFydCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0SW5kZXgoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBibG9ja3MgPSAkZWxlbWVudC5maW5kKCcucGlwLWFuaW1hdGlvbi1ibG9jaycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYmxvY2tzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoYmxvY2tzWzBdKS5hZGRDbGFzcygncGlwLXNob3cnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzdGFydEludGVydmFsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3R0bGVkID0gXy50aHJvdHRsZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRwaXBJbWFnZVNsaWRlci50b0Jsb2NrKHR5cGUsIGJsb2NrcywgaW5kZXgsIG5ld0luZGV4LCBkaXJlY3Rpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9IG5ld0luZGV4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRJbmRleCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIDcwMCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5uZXh0QmxvY2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3RhcnRJbnRlcnZhbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdJbmRleCA9IGluZGV4ICsgMSA9PT0gYmxvY2tzLmxlbmd0aCA/IDAgOiBpbmRleCArIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpcmVjdGlvbiA9ICduZXh0JztcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3R0bGVkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnByZXZCbG9jayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdGFydEludGVydmFsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0luZGV4ID0gaW5kZXggLSAxIDwgMCA/IGJsb2Nrcy5sZW5ndGggLSAxIDogaW5kZXggLSAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb24gPSAncHJldic7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm90dGxlZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5zbGlkZVRvID0gZnVuY3Rpb24gKG5leHRJbmRleCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV4dEluZGV4ID09PSBpbmRleCB8fCBuZXh0SW5kZXggPiBibG9ja3MubGVuZ3RoIC0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN0YXJ0SW50ZXJ2YWwoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3SW5kZXggPSBuZXh0SW5kZXg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpcmVjdGlvbiA9IG5leHRJbmRleCA+IGluZGV4ID8gJ25leHQnIDogJ3ByZXYnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdHRsZWQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkYXR0cnMuaWQpICRwaXBJbWFnZVNsaWRlci5yZWdpc3RlclNsaWRlcigkYXR0cnMuaWQsICRzY29wZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHNldEluZGV4KCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoJGF0dHJzLnBpcEltYWdlSW5kZXgpICRzY29wZS5zbGlkZXJJbmRleCA9IGluZGV4O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gc3RhcnRJbnRlcnZhbCgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGltZVByb21pc2VzID0gJGludGVydmFsKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0luZGV4ID0gaW5kZXggKyAxID09PSBibG9ja3MubGVuZ3RoID8gMCA6IGluZGV4ICsgMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpcmVjdGlvbiA9ICduZXh0JztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm90dGxlZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBpbnRlcnZhbCB8fCBERUZBVUxUX0lOVEVSVkFMKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHN0b3BJbnRlcnZhbCgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGludGVydmFsLmNhbmNlbCh0aW1lUHJvbWlzZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJGVsZW1lbnQub24oJyRkZXN0cm95JywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9wSW50ZXJ2YWwoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHBpcEltYWdlU2xpZGVyLnJlbW92ZVNsaWRlcigkYXR0cnMuaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiByZXN0YXJ0SW50ZXJ2YWwoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0b3BJbnRlcnZhbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydEludGVydmFsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICk7XHJcblxyXG59KSgpO1xyXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vdHlwaW5ncy90c2QuZC50c1wiIC8+XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciB0aGlzTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcEltYWdlU2xpZGVyLlNlcnZpY2UnLCBbXSk7XHJcblxyXG4gICAgdGhpc01vZHVsZS5zZXJ2aWNlKCckcGlwSW1hZ2VTbGlkZXInLFxyXG4gICAgICAgIGZ1bmN0aW9uICgkdGltZW91dCkge1xyXG5cclxuICAgICAgICAgICAgdmFyIEFOSU1BVElPTl9EVVJBVElPTiA9IDU1MCxcclxuICAgICAgICAgICAgICAgIHNsaWRlcnMgPSB7fTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBuZXh0Q2Fyb3VzZWw6IG5leHRDYXJvdXNlbCxcclxuICAgICAgICAgICAgICAgIHByZXZDYXJvdXNlbDogcHJldkNhcm91c2VsLFxyXG4gICAgICAgICAgICAgICAgdG9CbG9jazogdG9CbG9jayxcclxuICAgICAgICAgICAgICAgIHJlZ2lzdGVyU2xpZGVyOiByZWdpc3RlcixcclxuICAgICAgICAgICAgICAgIHJlbW92ZVNsaWRlcjogcmVtb3ZlLFxyXG4gICAgICAgICAgICAgICAgZ2V0U2xpZGVyU2NvcGU6IGdldFNsaWRlclxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gcmVnaXN0ZXIoc2xpZGVySWQsIHNsaWRlclNjb3BlKSB7XHJcbiAgICAgICAgICAgICAgICBzbGlkZXJzW3NsaWRlcklkXSA9IHNsaWRlclNjb3BlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBmdW5jdGlvbiByZW1vdmUoc2xpZGVySWQpIHtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSBzbGlkZXJzW3NsaWRlcklkXTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0U2xpZGVyKHNsaWRlcklkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc2xpZGVyc1tzbGlkZXJJZF07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIG5leHRDYXJvdXNlbChuZXh0QmxvY2ssIHByZXZCbG9jaykge1xyXG4gICAgICAgICAgICAgICAgbmV4dEJsb2NrLmFkZENsYXNzKCdwaXAtbmV4dCcpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV4dEJsb2NrLmFkZENsYXNzKCdhbmltYXRlZCcpLmFkZENsYXNzKCdwaXAtc2hvdycpLnJlbW92ZUNsYXNzKCdwaXAtbmV4dCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHByZXZCbG9jay5hZGRDbGFzcygnYW5pbWF0ZWQnKS5yZW1vdmVDbGFzcygncGlwLXNob3cnKTtcclxuICAgICAgICAgICAgICAgIH0sIDEwMCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHByZXZDYXJvdXNlbChuZXh0QmxvY2ssIHByZXZCbG9jaykge1xyXG4gICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5leHRCbG9jay5hZGRDbGFzcygnYW5pbWF0ZWQnKS5hZGRDbGFzcygncGlwLXNob3cnKTtcclxuICAgICAgICAgICAgICAgICAgICBwcmV2QmxvY2suYWRkQ2xhc3MoJ2FuaW1hdGVkJykuYWRkQ2xhc3MoJ3BpcC1uZXh0JykucmVtb3ZlQ2xhc3MoJ3BpcC1zaG93Jyk7XHJcbiAgICAgICAgICAgICAgICB9LCAxMDApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiB0b0Jsb2NrKHR5cGUsIGJsb2Nrcywgb2xkSW5kZXgsIG5leHRJbmRleCwgZGlyZWN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJldkJsb2NrID0gJChibG9ja3Nbb2xkSW5kZXhdKSxcclxuICAgICAgICAgICAgICAgICAgICBibG9ja0luZGV4ID0gbmV4dEluZGV4LFxyXG4gICAgICAgICAgICAgICAgICAgIG5leHRCbG9jayA9ICQoYmxvY2tzW2Jsb2NrSW5kZXhdKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZSA9PT0gJ2Nhcm91c2VsJykge1xyXG4gICAgICAgICAgICAgICAgICAgICQoYmxvY2tzKS5yZW1vdmVDbGFzcygncGlwLW5leHQnKS5yZW1vdmVDbGFzcygncGlwLXByZXYnKS5yZW1vdmVDbGFzcygnYW5pbWF0ZWQnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRpcmVjdGlvbiAmJiAoZGlyZWN0aW9uID09PSAncHJldicgfHwgZGlyZWN0aW9uID09PSAnbmV4dCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkaXJlY3Rpb24gPT09ICdwcmV2Jykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJldkNhcm91c2VsKG5leHRCbG9jaywgcHJldkJsb2NrKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRDYXJvdXNlbChuZXh0QmxvY2ssIHByZXZCbG9jayk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV4dEluZGV4ICYmIG5leHRJbmRleCA8IG9sZEluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2Q2Fyb3VzZWwobmV4dEJsb2NrLCBwcmV2QmxvY2spO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dENhcm91c2VsKG5leHRCbG9jaywgcHJldkJsb2NrKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJldkJsb2NrLmFkZENsYXNzKCdhbmltYXRlZCcpLnJlbW92ZUNsYXNzKCdwaXAtc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgICAgIG5leHRCbG9jay5hZGRDbGFzcygnYW5pbWF0ZWQnKS5hZGRDbGFzcygncGlwLXNob3cnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICk7XHJcblxyXG59KSgpO1xyXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vdHlwaW5ncy90c2QuZC50c1wiIC8+XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciB0aGlzTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcFNsaWRlckJ1dHRvbicsIFtdKTtcclxuXHJcbiAgICB0aGlzTW9kdWxlLmRpcmVjdGl2ZSgncGlwU2xpZGVyQnV0dG9uJyxcclxuICAgICAgICBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBzY29wZToge30sXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbiAoJHNjb3BlLCAkZWxlbWVudCwgJHBhcnNlLCAkYXR0cnMsICRwaXBJbWFnZVNsaWRlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0eXBlID0gJHBhcnNlKCRhdHRycy5waXBCdXR0b25UeXBlKSgkc2NvcGUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzbGlkZXJJZCA9ICRwYXJzZSgkYXR0cnMucGlwU2xpZGVySWQpKCRzY29wZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRlbGVtZW50Lm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFzbGlkZXJJZCB8fCAhdHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkcGlwSW1hZ2VTbGlkZXIuZ2V0U2xpZGVyU2NvcGUoc2xpZGVySWQpW3R5cGUgKyAnQmxvY2snXSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICk7XHJcblxyXG59KSgpO1xyXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vdHlwaW5ncy90c2QuZC50c1wiIC8+XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciB0aGlzTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcFNsaWRlckluZGljYXRvcicsIFtdKTtcclxuXHJcbiAgICB0aGlzTW9kdWxlLmRpcmVjdGl2ZSgncGlwU2xpZGVySW5kaWNhdG9yJyxcclxuICAgICAgICBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBzY29wZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbiAoJHNjb3BlLCAkZWxlbWVudCwgJHBhcnNlLCAkYXR0cnMsICRwaXBJbWFnZVNsaWRlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzbGlkZXJJZCA9ICRwYXJzZSgkYXR0cnMucGlwU2xpZGVySWQpKCRzY29wZSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlVG8gPSAkcGFyc2UoJGF0dHJzLnBpcFNsaWRlVG8pKCRzY29wZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRlbGVtZW50LmNzcygnY3Vyc29yJywgJ3BvaW50ZXInKTtcclxuICAgICAgICAgICAgICAgICAgICAkZWxlbWVudC5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghc2xpZGVySWQgfHwgc2xpZGVUbyAmJiBzbGlkZVRvIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkcGlwSW1hZ2VTbGlkZXIuZ2V0U2xpZGVyU2NvcGUoc2xpZGVySWQpLnNsaWRlVG8oc2xpZGVUbyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgKTtcclxuXHJcbn0pKCk7XHJcbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi90eXBpbmdzL3RzZC5kLnRzXCIgLz5cclxuXHJcbmRlY2xhcmUgdmFyIG1hcmtlZDogYW55O1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgdGhpc01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBNYXJrZG93bicsIFsnbmdTYW5pdGl6ZSddKTtcclxuXHJcbiAgICB0aGlzTW9kdWxlLnJ1bihmdW5jdGlvbiAoJGluamVjdG9yKSB7XHJcbiAgICAgICAgdmFyIHBpcFRyYW5zbGF0ZSA9ICRpbmplY3Rvci5oYXMoJ3BpcFRyYW5zbGF0ZScpID8gJGluamVjdG9yLmdldCgncGlwVHJhbnNsYXRlJykgOiBudWxsO1xyXG5cclxuICAgICAgICBpZiAocGlwVHJhbnNsYXRlKSB7XHJcbiAgICAgICAgICAgIHBpcFRyYW5zbGF0ZS5zZXRUcmFuc2xhdGlvbnMoJ2VuJywge1xyXG4gICAgICAgICAgICAgICAgJ01BUktET1dOX0FUVEFDSE1FTlRTJzogJ0F0dGFjaG1lbnRzOicsXHJcbiAgICAgICAgICAgICAgICAnY2hlY2tsaXN0JzogJ0NoZWNrbGlzdCcsXHJcbiAgICAgICAgICAgICAgICAnZG9jdW1lbnRzJzogJ0RvY3VtZW50cycsXHJcbiAgICAgICAgICAgICAgICAncGljdHVyZXMnOiAnUGljdHVyZXMnLFxyXG4gICAgICAgICAgICAgICAgJ2xvY2F0aW9uJzogJ0xvY2F0aW9uJyxcclxuICAgICAgICAgICAgICAgICd0aW1lJzogJ1RpbWUnXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBwaXBUcmFuc2xhdGUuc2V0VHJhbnNsYXRpb25zKCdydScsIHtcclxuICAgICAgICAgICAgICAgICdNQVJLRE9XTl9BVFRBQ0hNRU5UUyc6ICfQktC70L7QttC10L3QuNGPOicsXHJcbiAgICAgICAgICAgICAgICAnY2hlY2tsaXN0JzogJ9Ch0L/QuNGB0L7QuicsXHJcbiAgICAgICAgICAgICAgICAnZG9jdW1lbnRzJzogJ9CU0L7QutGD0LzQtdC90YLRiycsXHJcbiAgICAgICAgICAgICAgICAncGljdHVyZXMnOiAn0JjQt9C+0LHRgNCw0LbQtdC90LjRjycsXHJcbiAgICAgICAgICAgICAgICAnbG9jYXRpb24nOiAn0JzQtdGB0YLQvtC90LDRhdC+0LbQtNC10L3QuNC1JyxcclxuICAgICAgICAgICAgICAgICd0aW1lJzogJ9CS0YDQtdC80Y8nXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXNNb2R1bGUuZGlyZWN0aXZlKCdwaXBNYXJrZG93bicsXHJcbiAgICAgICAgZnVuY3Rpb24gKCRwYXJzZSwgJGluamVjdG9yKSB7XHJcbiAgICAgICAgICAgIHZhciBwaXBUcmFuc2xhdGUgPSAkaW5qZWN0b3IuaGFzKCdwaXBUcmFuc2xhdGUnKSA/ICRpbmplY3Rvci5nZXQoJ3BpcFRyYW5zbGF0ZScpIDogbnVsbDtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICAgICAgICAgIHNjb3BlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uICgkc2NvcGU6IGFueSwgJGVsZW1lbnQsICRhdHRyczogYW55KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHRHZXR0ZXIgPSAkcGFyc2UoJGF0dHJzLnBpcFRleHQpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0R2V0dGVyID0gJHBhcnNlKCRhdHRycy5waXBMaXN0KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhbXBHZXR0ZXIgPSAkcGFyc2UoJGF0dHJzLnBpcExpbmVDb3VudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGRlc2NyaWJlQXR0YWNobWVudHMoYXJyYXkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dGFjaFN0cmluZyA9ICcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0YWNoVHlwZXMgPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8uZWFjaChhcnJheSwgZnVuY3Rpb24gKGF0dGFjaCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGF0dGFjaC50eXBlICYmIGF0dGFjaC50eXBlICE9PSAndGV4dCcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXR0YWNoU3RyaW5nLmxlbmd0aCA9PT0gMCAmJiBwaXBUcmFuc2xhdGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0YWNoU3RyaW5nID0gcGlwVHJhbnNsYXRlLnRyYW5zbGF0ZSgnTUFSS0RPV05fQVRUQUNITUVOVFMnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhdHRhY2hUeXBlcy5pbmRleE9mKGF0dGFjaC50eXBlKSA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0YWNoVHlwZXMucHVzaChhdHRhY2gudHlwZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dGFjaFN0cmluZyArPSBhdHRhY2hUeXBlcy5sZW5ndGggPiAxID8gJywgJyA6ICcgJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBpcFRyYW5zbGF0ZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dGFjaFN0cmluZyArPSBwaXBUcmFuc2xhdGUudHJhbnNsYXRlKGF0dGFjaC50eXBlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGF0dGFjaFN0cmluZztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHRvQm9vbGVhbih2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXZhbHVlKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgPT0gJzEnIHx8IHZhbHVlID09ICd0cnVlJztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGJpbmRUZXh0KHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZXh0U3RyaW5nLCBpc0NsYW1wZWQsIGhlaWdodCwgb3B0aW9ucywgb2JqO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF8uaXNBcnJheSh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iaiA9IF8uZmluZCh2YWx1ZSwgZnVuY3Rpb24gKGl0ZW06IGFueSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLnR5cGUgPT09ICd0ZXh0JyAmJiBpdGVtLnRleHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0U3RyaW5nID0gb2JqID8gb2JqLnRleHQgOiBkZXNjcmliZUF0dGFjaG1lbnRzKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRTdHJpbmcgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNDbGFtcGVkID0gJGF0dHJzLnBpcExpbmVDb3VudCAmJiBfLmlzTnVtYmVyKGNsYW1wR2V0dGVyKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0NsYW1wZWQgPSBpc0NsYW1wZWQgJiYgdGV4dFN0cmluZyAmJiB0ZXh0U3RyaW5nLmxlbmd0aCA+IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZm06IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWJsZXM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVha3M6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzYW5pdGl6ZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBlZGFudGljOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc21hcnRMaXN0czogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNtYXJ0eXBlbnRzOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0U3RyaW5nID0gbWFya2VkKHRleHRTdHJpbmcgfHwgJycsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNDbGFtcGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQgPSAxLjUgKiBjbGFtcEdldHRlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFzc2lnbiB2YWx1ZSBhcyBIVE1MXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRlbGVtZW50Lmh0bWwoJzxkaXYnICsgKGlzQ2xhbXBlZCA/IGxpc3RHZXR0ZXIoKSA/ICdjbGFzcz1cInBpcC1tYXJrZG93bi1jb250ZW50ICcgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3BpcC1tYXJrZG93bi1saXN0XCIgc3R5bGU9XCJtYXgtaGVpZ2h0OiAnICsgaGVpZ2h0ICsgJ2VtXCI+J1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJyBjbGFzcz1cInBpcC1tYXJrZG93bi1jb250ZW50XCIgc3R5bGU9XCJtYXgtaGVpZ2h0OiAnICsgaGVpZ2h0ICsgJ2VtXCI+JyA6IGxpc3RHZXR0ZXIoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJyBjbGFzcz1cInBpcC1tYXJrZG93bi1saXN0XCI+JyA6ICc+JykgKyB0ZXh0U3RyaW5nICsgJzwvZGl2PicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkZWxlbWVudC5maW5kKCdhJykuYXR0cigndGFyZ2V0JywgJ2JsYW5rJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghbGlzdEdldHRlcigpICYmIGlzQ2xhbXBlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGVsZW1lbnQuYXBwZW5kKCc8ZGl2IGNsYXNzPVwicGlwLWdyYWRpZW50LWJsb2NrXCI+PC9kaXY+Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEZpbGwgdGhlIHRleHRcclxuICAgICAgICAgICAgICAgICAgICBiaW5kVGV4dCh0ZXh0R2V0dGVyKCRzY29wZSkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBBbHNvIG9wdGltaXphdGlvbiB0byBhdm9pZCB3YXRjaCBpZiBpdCBpcyB1bm5lY2Vzc2FyeVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0b0Jvb2xlYW4oJGF0dHJzLnBpcFJlYmluZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiR3YXRjaCh0ZXh0R2V0dGVyLCBmdW5jdGlvbiAobmV3VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJpbmRUZXh0KG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuJG9uKCdwaXBXaW5kb3dSZXNpemVkJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBiaW5kVGV4dCh0ZXh0R2V0dGVyKCRzY29wZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBBZGQgY2xhc3NcclxuICAgICAgICAgICAgICAgICAgICAkZWxlbWVudC5hZGRDbGFzcygncGlwLW1hcmtkb3duJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgKTtcclxuXHJcbn0pKCk7XHJcblxyXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vdHlwaW5ncy90c2QuZC50c1wiIC8+XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciB0aGlzTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcFBvcG92ZXInLCBbJ3BpcFBvcG92ZXIuU2VydmljZSddKTtcclxuXHJcbiAgICB0aGlzTW9kdWxlLmRpcmVjdGl2ZSgncGlwUG9wb3ZlcicsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICAgICAgc2NvcGU6IHRydWUsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAncG9wb3Zlci9wb3BvdmVyLmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbiAoJHNjb3BlLCAkcm9vdFNjb3BlLCAkZWxlbWVudCwgJHRpbWVvdXQsICRjb21waWxlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYmFja2Ryb3BFbGVtZW50LCBjb250ZW50O1xyXG5cclxuICAgICAgICAgICAgICAgIGJhY2tkcm9wRWxlbWVudCA9ICQoJy5waXAtcG9wb3Zlci1iYWNrZHJvcCcpO1xyXG4gICAgICAgICAgICAgICAgYmFja2Ryb3BFbGVtZW50Lm9uKCdjbGljayBrZXlkb3duIHNjcm9sbCcsIGJhY2tkcm9wQ2xpY2spO1xyXG4gICAgICAgICAgICAgICAgYmFja2Ryb3BFbGVtZW50LmFkZENsYXNzKCRzY29wZS5wYXJhbXMucmVzcG9uc2l2ZSAhPT0gZmFsc2UgPyAncGlwLXJlc3BvbnNpdmUnIDogJycpO1xyXG5cclxuICAgICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkc2NvcGUucGFyYW1zLnRlbXBsYXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQgPSAkY29tcGlsZSgkc2NvcGUucGFyYW1zLnRlbXBsYXRlKSgkc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkZWxlbWVudC5maW5kKCcucGlwLXBvcG92ZXInKS5hcHBlbmQoY29udGVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpbml0KCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsY0hlaWdodCgpO1xyXG4gICAgICAgICAgICAgICAgfSwgMjAwKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkc2NvcGUub25Qb3BvdmVyQ2xpY2sgPSBvblBvcG92ZXJDbGljaztcclxuICAgICAgICAgICAgICAgICRzY29wZSA9IF8uZGVmYXVsdHMoJHNjb3BlLCAkc2NvcGUuJHBhcmVudCk7ICAgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgXHJcblxyXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kb24oJ3BpcFBvcG92ZXJSZXNpemUnLCBvblJlc2l6ZSk7XHJcbiAgICAgICAgICAgICAgICAkKHdpbmRvdykucmVzaXplKG9uUmVzaXplKTtcclxuXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJhY2tkcm9wRWxlbWVudC5hZGRDbGFzcygnb3BlbmVkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLnBpcC1wb3BvdmVyLWJhY2tkcm9wJykuZm9jdXMoKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoJHNjb3BlLnBhcmFtcy50aW1lb3V0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsb3NlUG9wb3ZlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAkc2NvcGUucGFyYW1zLnRpbWVvdXQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBiYWNrZHJvcENsaWNrKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkc2NvcGUucGFyYW1zLmNhbmNlbENhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5wYXJhbXMuY2FuY2VsQ2FsbGJhY2soKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNsb3NlUG9wb3ZlcigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGNsb3NlUG9wb3ZlcigpIHtcclxuICAgICAgICAgICAgICAgICAgICBiYWNrZHJvcEVsZW1lbnQucmVtb3ZlQ2xhc3MoJ29wZW5lZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmFja2Ryb3BFbGVtZW50LnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIDEwMCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gb25Qb3BvdmVyQ2xpY2soJGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAkZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBwb3NpdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoJHNjb3BlLnBhcmFtcy5lbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlbGVtZW50ID0gJCgkc2NvcGUucGFyYW1zLmVsZW1lbnQpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zID0gZWxlbWVudC5vZmZzZXQoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoID0gZWxlbWVudC53aWR0aCgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0ID0gZWxlbWVudC5oZWlnaHQoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY1dpZHRoID0gJChkb2N1bWVudCkud2lkdGgoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY0hlaWdodCA9ICQoZG9jdW1lbnQpLmhlaWdodCgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9wb3ZlciA9IGJhY2tkcm9wRWxlbWVudC5maW5kKCcucGlwLXBvcG92ZXInKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwb3MpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvcG92ZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY3NzKCdtYXgtd2lkdGgnLCBkb2NXaWR0aCAtIChkb2NXaWR0aCAtIHBvcy5sZWZ0KSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY3NzKCdtYXgtaGVpZ2h0JywgZG9jSGVpZ2h0IC0gKHBvcy50b3AgKyBoZWlnaHQpIC0gMzIsIDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNzcygnbGVmdCcsIHBvcy5sZWZ0IC0gcG9wb3Zlci53aWR0aCgpICsgd2lkdGggLyAyKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jc3MoJ3RvcCcsIHBvcy50b3AgKyBoZWlnaHQgKyAxNik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gY2FsY0hlaWdodCgpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoJHNjb3BlLnBhcmFtcy5jYWxjSGVpZ2h0ID09PSBmYWxzZSkgeyByZXR1cm47IH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBvcG92ZXIgPSBiYWNrZHJvcEVsZW1lbnQuZmluZCgnLnBpcC1wb3BvdmVyJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlID0gcG9wb3Zlci5maW5kKCcucGlwLXRpdGxlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvb3RlciA9IHBvcG92ZXIuZmluZCgnLnBpcC1mb290ZXInKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudCA9IHBvcG92ZXIuZmluZCgnLnBpcC1jb250ZW50JyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnRIZWlnaHQgPSBwb3BvdmVyLmhlaWdodCgpIC0gdGl0bGUub3V0ZXJIZWlnaHQodHJ1ZSkgLSBmb290ZXIub3V0ZXJIZWlnaHQodHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQuY3NzKCdtYXgtaGVpZ2h0JywgTWF0aC5tYXgoY29udGVudEhlaWdodCwgMCkgKyAncHgnKS5jc3MoJ2JveC1zaXppbmcnLCAnYm9yZGVyLWJveCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIG9uUmVzaXplKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJhY2tkcm9wRWxlbWVudC5maW5kKCcucGlwLXBvcG92ZXInKS5maW5kKCcucGlwLWNvbnRlbnQnKS5jc3MoJ21heC1oZWlnaHQnLCAnMTAwJScpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsY0hlaWdodCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH0pO1xyXG5cclxufSkoKTtcclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgdGhpc01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBQb3BvdmVyLlNlcnZpY2UnLCBbXSk7XHJcblxyXG4gICAgdGhpc01vZHVsZS5zZXJ2aWNlKCdwaXBQb3BvdmVyU2VydmljZScsXHJcbiAgICAgICAgZnVuY3Rpb24gKCRjb21waWxlLCAkcm9vdFNjb3BlLCAkdGltZW91dCkge1xyXG4gICAgICAgICAgICB2YXIgcG9wb3ZlclRlbXBsYXRlO1xyXG5cclxuICAgICAgICAgICAgcG9wb3ZlclRlbXBsYXRlID0gXCI8ZGl2IGNsYXNzPSdwaXAtcG9wb3Zlci1iYWNrZHJvcCB7eyBwYXJhbXMuY2xhc3MgfX0nIG5nLWNvbnRyb2xsZXI9J3BhcmFtcy5jb250cm9sbGVyJ1wiICtcclxuICAgICAgICAgICAgICAgIFwiIHRhYmluZGV4PScxJz4gPHBpcC1wb3BvdmVyIHBpcC1wYXJhbXM9J3BhcmFtcyc+IDwvcGlwLXBvcG92ZXI+IDwvZGl2PlwiO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHNob3c6IG9uU2hvdyxcclxuICAgICAgICAgICAgICAgIGhpZGU6IG9uSGlkZSxcclxuICAgICAgICAgICAgICAgIHJlc2l6ZTogb25SZXNpemVcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIG9uU2hvdyhwKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZWxlbWVudCwgc2NvcGUsIHBhcmFtcywgY29udGVudDtcclxuXHJcbiAgICAgICAgICAgICAgICBlbGVtZW50ID0gJCgnYm9keScpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQuZmluZCgnbWQtYmFja2Ryb3AnKS5sZW5ndGggPiAwKSB7IHJldHVybjsgfVxyXG4gICAgICAgICAgICAgICAgb25IaWRlKCk7XHJcbiAgICAgICAgICAgICAgICBzY29wZSA9ICRyb290U2NvcGUuJG5ldygpO1xyXG4gICAgICAgICAgICAgICAgcGFyYW1zID0gcCAmJiBfLmlzT2JqZWN0KHApID8gcCA6IHt9O1xyXG4gICAgICAgICAgICAgICAgc2NvcGUucGFyYW1zID0gcGFyYW1zO1xyXG4gICAgICAgICAgICAgICAgc2NvcGUubG9jYWxzID0gcGFyYW1zLmxvY2FscztcclxuICAgICAgICAgICAgICAgIGNvbnRlbnQgPSAkY29tcGlsZShwb3BvdmVyVGVtcGxhdGUpKHNjb3BlKTtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuYXBwZW5kKGNvbnRlbnQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBvbkhpZGUoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYmFja2Ryb3BFbGVtZW50ID0gJCgnLnBpcC1wb3BvdmVyLWJhY2tkcm9wJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgYmFja2Ryb3BFbGVtZW50LnJlbW92ZUNsYXNzKCdvcGVuZWQnKTtcclxuICAgICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBiYWNrZHJvcEVsZW1lbnQucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICB9LCAxMDApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBvblJlc2l6ZSgpIHtcclxuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgncGlwUG9wb3ZlclJlc2l6ZScpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuICAgICk7XHJcblxyXG59KSgpO1xyXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vdHlwaW5ncy90c2QuZC50c1wiIC8+XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciB0aGlzTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcFJvdXRpbmdQcm9ncmVzcycsIFsnbmdNYXRlcmlhbCddKTtcclxuXHJcbiAgICB0aGlzTW9kdWxlLmRpcmVjdGl2ZSgncGlwUm91dGluZ1Byb2dyZXNzJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxyXG4gICAgICAgICAgICBzY29wZToge1xyXG4gICAgICAgICAgICAgICAgICAgIHNob3dQcm9ncmVzczogJyYnLFxyXG4gICAgICAgICAgICAgICAgICAgIGxvZ29Vcmw6ICdAJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwcm9ncmVzcy9yb3V0aW5nX3Byb2dyZXNzLmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAncGlwUm91dGluZ1Byb2dyZXNzQ29udHJvbGxlcidcclxuICAgICAgICB9O1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpc01vZHVsZS5jb250cm9sbGVyKCdwaXBSb3V0aW5nUHJvZ3Jlc3NDb250cm9sbGVyJyxcclxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzKSB7XHJcbiAgICAgICAgICAgIHZhciAgaW1hZ2UgPSAkZWxlbWVudC5jaGlsZHJlbignaW1nJyk7ICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgbG9hZFByb2dyZXNzSW1hZ2UoKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGxvYWRQcm9ncmVzc0ltYWdlKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCRzY29wZS5sb2dvVXJsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2UuYXR0cignc3JjJywgJHNjb3BlLmxvZ29VcmwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuICAgICk7XHJcblxyXG59KSgpO1xyXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vdHlwaW5ncy90c2QuZC50c1wiIC8+XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgdmFyIHRoaXNNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgncGlwVG9hc3RzJywgWyduZ01hdGVyaWFsJywgJ3BpcENvbnRyb2xzLlRyYW5zbGF0ZSddKTtcclxuXHJcbiAgICB0aGlzTW9kdWxlLmNvbnRyb2xsZXIoJ3BpcFRvYXN0Q29udHJvbGxlcicsXHJcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgJG1kVG9hc3QsIHRvYXN0LCAkaW5qZWN0b3IpIHtcclxuICAgICAgICAgICAgdmFyIHBpcEVycm9yRGV0YWlsc0RpYWxvZyA9ICRpbmplY3Rvci5oYXMoJ3BpcEVycm9yRGV0YWlsc0RpYWxvZycpIFxyXG4gICAgICAgICAgICAgICAgPyAkaW5qZWN0b3IuZ2V0KCdwaXBFcnJvckRldGFpbHNEaWFsb2cnKSA6IG51bGw7XHJcblxyXG4gICAgICAgICAgICAvLyBpZiAodG9hc3QudHlwZSAmJiBzb3VuZHNbJ3RvYXN0XycgKyB0b2FzdC50eXBlXSkge1xyXG4gICAgICAgICAgICAvLyAgICAgc291bmRzWyd0b2FzdF8nICsgdG9hc3QudHlwZV0ucGxheSgpO1xyXG4gICAgICAgICAgICAvLyB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUubWVzc2FnZSA9IHRvYXN0Lm1lc3NhZ2U7XHJcbiAgICAgICAgICAgICRzY29wZS5hY3Rpb25zID0gdG9hc3QuYWN0aW9ucztcclxuICAgICAgICAgICAgJHNjb3BlLnRvYXN0ID0gdG9hc3Q7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAodG9hc3QuYWN0aW9ucy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5hY3Rpb25MZW5naHQgPSAwO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRvYXN0LmFjdGlvbnMubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuYWN0aW9uTGVuZ2h0ID0gdG9hc3QuYWN0aW9uc1swXS50b1N0cmluZygpLmxlbmd0aDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5hY3Rpb25MZW5naHQgPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuc2hvd0RldGFpbHMgPSBwaXBFcnJvckRldGFpbHNEaWFsb2cgIT0gbnVsbDtcclxuICAgICAgICAgICAgJHNjb3BlLm9uRGV0YWlscyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICRtZFRvYXN0LmhpZGUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocGlwRXJyb3JEZXRhaWxzRGlhbG9nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGlwRXJyb3JEZXRhaWxzRGlhbG9nLnNob3coXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiAkc2NvcGUudG9hc3QuZXJyb3IsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvazogJ09rJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLm5vb3AsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIubm9vcFxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUub25BY3Rpb24gPSBmdW5jdGlvbiAoYWN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAkbWRUb2FzdC5oaWRlKFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiBhY3Rpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiB0b2FzdC5pZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogdG9hc3QubWVzc2FnZVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICk7XHJcblxyXG4gICAgdGhpc01vZHVsZS5zZXJ2aWNlKCdwaXBUb2FzdHMnLFxyXG4gICAgICAgIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkbWRUb2FzdCkge1xyXG4gICAgICAgICAgICB2YXJcclxuICAgICAgICAgICAgICAgIFNIT1dfVElNRU9VVCA9IDIwMDAwLFxyXG4gICAgICAgICAgICAgICAgU0hPV19USU1FT1VUX05PVElGSUNBVElPTlMgPSAyMDAwMCxcclxuICAgICAgICAgICAgICAgIHRvYXN0cyA9IFtdLFxyXG4gICAgICAgICAgICAgICAgY3VycmVudFRvYXN0LFxyXG4gICAgICAgICAgICAgICAgc291bmRzID0ge307XHJcblxyXG4gICAgICAgICAgICAvKiogcHJlLWxvYWQgc291bmRzIGZvciBub3RpZmljYXRpb25zICovXHJcbiAgICAgICAgICAgICAgICAvLyBzb3VuZHNbJ3RvYXN0X2Vycm9yJ10gPSBuZ0F1ZGlvLmxvYWQoJ3NvdW5kcy9mYXRhbC5tcDMnKTtcclxuICAgICAgICAgICAgICAgIC8vIHNvdW5kc1sndG9hc3Rfbm90aWZpY2F0aW9uJ10gPSBuZ0F1ZGlvLmxvYWQoJ3NvdW5kcy9lcnJvci5tcDMnKTtcclxuICAgICAgICAgICAgICAgIC8vIHNvdW5kc1sndG9hc3RfbWVzc2FnZSddID0gbmdBdWRpby5sb2FkKCdzb3VuZHMvd2FybmluZy5tcDMnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBSZW1vdmUgZXJyb3IgdG9hc3RzIHdoZW4gcGFnZSBpcyBjaGFuZ2VkXHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdWNjZXNzJywgb25TdGF0ZUNoYW5nZVN1Y2Nlc3MpO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRvbigncGlwU2Vzc2lvbkNsb3NlZCcsIG9uQ2xlYXJUb2FzdHMpO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRvbigncGlwSWRlbnRpdHlDaGFuZ2VkJywgb25DbGVhclRvYXN0cyk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgc2hvd05vdGlmaWNhdGlvbjogc2hvd05vdGlmaWNhdGlvbixcclxuICAgICAgICAgICAgICAgIHNob3dNZXNzYWdlOiBzaG93TWVzc2FnZSxcclxuICAgICAgICAgICAgICAgIHNob3dFcnJvcjogc2hvd0Vycm9yLFxyXG4gICAgICAgICAgICAgICAgaGlkZUFsbFRvYXN0czogaGlkZUFsbFRvYXN0cyxcclxuICAgICAgICAgICAgICAgIGNsZWFyVG9hc3RzOiBjbGVhclRvYXN0cyxcclxuICAgICAgICAgICAgICAgIHJlbW92ZVRvYXN0c0J5SWQ6IHJlbW92ZVRvYXN0c0J5SWQsXHJcbiAgICAgICAgICAgICAgICBnZXRUb2FzdEJ5SWQ6IGdldFRvYXN0QnlJZFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgLy8gVGFrZSB0aGUgbmV4dCBmcm9tIHF1ZXVlIGFuZCBzaG93IGl0XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHNob3dOZXh0VG9hc3QoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdG9hc3Q7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRvYXN0cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdG9hc3QgPSB0b2FzdHNbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgdG9hc3RzLnNwbGljZSgwLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICBzaG93VG9hc3QodG9hc3QpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBTaG93IHRvYXN0XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHNob3dUb2FzdCh0b2FzdCkge1xyXG4gICAgICAgICAgICAgICAgY3VycmVudFRvYXN0ID0gdG9hc3Q7XHJcblxyXG4gICAgICAgICAgICAgICAgJG1kVG9hc3Quc2hvdyh7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0b2FzdC90b2FzdC5odG1sJyxcclxuICAgICAgICAgICAgICAgICAgICBoaWRlRGVsYXk6IHRvYXN0LmR1cmF0aW9uIHx8IFNIT1dfVElNRU9VVCxcclxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2JvdHRvbSBsZWZ0JyxcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAncGlwVG9hc3RDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICBsb2NhbHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9hc3Q6IGN1cnJlbnRUb2FzdCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc291bmRzOiBzb3VuZHNcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKFxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHNob3dUb2FzdE9rUmVzdWx0KGFjdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudFRvYXN0LnN1Y2Nlc3NDYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFRvYXN0LnN1Y2Nlc3NDYWxsYmFjayhhY3Rpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRUb2FzdCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3dOZXh0VG9hc3QoKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHNob3dUb2FzdENhbmNlbFJlc3VsdChhY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRUb2FzdC5jYW5jZWxDYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFRvYXN0LmNhbmNlbENhbGxiYWNrKGFjdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFRvYXN0ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2hvd05leHRUb2FzdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGFkZFRvYXN0KHRvYXN0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudFRvYXN0ICYmIHRvYXN0LnR5cGUgIT09ICdlcnJvcicpIHtcclxuICAgICAgICAgICAgICAgICAgICB0b2FzdHMucHVzaCh0b2FzdCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHNob3dUb2FzdCh0b2FzdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHJlbW92ZVRvYXN0cyh0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XHJcblxyXG4gICAgICAgICAgICAgICAgXy5lYWNoKHRvYXN0cywgZnVuY3Rpb24gKHRvYXN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0b2FzdC50eXBlIHx8IHRvYXN0LnR5cGUgIT09IHR5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2godG9hc3QpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgdG9hc3RzID0gXy5jbG9uZURlZXAocmVzdWx0KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gcmVtb3ZlVG9hc3RzQnlJZChpZCkge1xyXG4gICAgICAgICAgICAgICAgXy5yZW1vdmUodG9hc3RzLCB7aWQ6IGlkfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGdldFRvYXN0QnlJZChpZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIF8uZmluZCh0b2FzdHMsIHtpZDogaWR9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gb25TdGF0ZUNoYW5nZVN1Y2Nlc3MoKSB7XHJcbiAgICAgICAgICAgICAgICAvLyB0b2FzdHMgPSBfLnJlamVjdCh0b2FzdHMsIGZ1bmN0aW9uICh0b2FzdCkge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIHJldHVybiB0b2FzdC50eXBlID09PSAnZXJyb3InO1xyXG4gICAgICAgICAgICAgICAgLy8gfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gaWYgKGN1cnJlbnRUb2FzdCAmJiBjdXJyZW50VG9hc3QudHlwZSA9PT0gJ2Vycm9yJykge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICRtZFRvYXN0LmNhbmNlbCgpO1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIHNob3dOZXh0VG9hc3QoKTtcclxuICAgICAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gb25DbGVhclRvYXN0cygpIHtcclxuICAgICAgICAgICAgICAgIGNsZWFyVG9hc3RzKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIFNob3cgbmV3IG5vdGlmaWNhdGlvbiB0b2FzdCBhdCB0aGUgdG9wIHJpZ2h0XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHNob3dOb3RpZmljYXRpb24obWVzc2FnZSwgYWN0aW9ucywgc3VjY2Vzc0NhbGxiYWNrLCBjYW5jZWxDYWxsYmFjaywgaWQpIHtcclxuICAgICAgICAgICAgICAgIC8vIHBpcEFzc2VydC5pc0RlZihtZXNzYWdlLCAncGlwVG9hc3RzLnNob3dOb3RpZmljYXRpb246IG1lc3NhZ2Ugc2hvdWxkIGJlIGRlZmluZWQnKTtcclxuICAgICAgICAgICAgICAgIC8vIHBpcEFzc2VydC5pc1N0cmluZyhtZXNzYWdlLCAncGlwVG9hc3RzLnNob3dOb3RpZmljYXRpb246IG1lc3NhZ2Ugc2hvdWxkIGJlIGEgc3RyaW5nJyk7XHJcbiAgICAgICAgICAgICAgICAvLyBwaXBBc3NlcnQuaXNBcnJheShhY3Rpb25zIHx8IFtdLCAncGlwVG9hc3RzLnNob3dOb3RpZmljYXRpb246IGFjdGlvbnMgc2hvdWxkIGJlIGFuIGFycmF5Jyk7XHJcbiAgICAgICAgICAgICAgICAvLyBpZiAoc3VjY2Vzc0NhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgcGlwQXNzZXJ0LmlzRnVuY3Rpb24oc3VjY2Vzc0NhbGxiYWNrLCAnc2hvd05vdGlmaWNhdGlvbjogc3VjY2Vzc0NhbGxiYWNrIHNob3VsZCBiZSBhIGZ1bmN0aW9uJyk7XHJcbiAgICAgICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgICAgICAvLyBpZiAoY2FuY2VsQ2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgIC8vICAgICBwaXBBc3NlcnQuaXNGdW5jdGlvbihjYW5jZWxDYWxsYmFjaywgJ3Nob3dOb3RpZmljYXRpb246IGNhbmNlbENhbGxiYWNrIHNob3VsZCBiZSBhIGZ1bmN0aW9uJyk7XHJcbiAgICAgICAgICAgICAgICAvLyB9XHJcblxyXG4gICAgICAgICAgICAgICAgYWRkVG9hc3Qoe1xyXG4gICAgICAgICAgICAgICAgICAgIGlkOiBpZCB8fCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdub3RpZmljYXRpb24nLFxyXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uczogYWN0aW9ucyB8fCBbJ29rJ10sXHJcbiAgICAgICAgICAgICAgICAgICAgc3VjY2Vzc0NhbGxiYWNrOiBzdWNjZXNzQ2FsbGJhY2ssXHJcbiAgICAgICAgICAgICAgICAgICAgY2FuY2VsQ2FsbGJhY2s6IGNhbmNlbENhbGxiYWNrLFxyXG4gICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBTSE9XX1RJTUVPVVRfTk9USUZJQ0FUSU9OU1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIFNob3cgbmV3IG1lc3NhZ2UgdG9hc3QgYXQgdGhlIHRvcCByaWdodFxyXG4gICAgICAgICAgICBmdW5jdGlvbiBzaG93TWVzc2FnZShtZXNzYWdlLCBzdWNjZXNzQ2FsbGJhY2ssIGNhbmNlbENhbGxiYWNrLCBpZCkge1xyXG4gICAgICAgICAgICAgICAgLy8gcGlwQXNzZXJ0LmlzRGVmKG1lc3NhZ2UsICdwaXBUb2FzdHMuc2hvd01lc3NhZ2U6IG1lc3NhZ2Ugc2hvdWxkIGJlIGRlZmluZWQnKTtcclxuICAgICAgICAgICAgICAgIC8vIHBpcEFzc2VydC5pc1N0cmluZyhtZXNzYWdlLCAncGlwVG9hc3RzLnNob3dNZXNzYWdlOiBtZXNzYWdlIHNob3VsZCBiZSBhIHN0cmluZycpO1xyXG4gICAgICAgICAgICAgICAgLy8gaWYgKHN1Y2Nlc3NDYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIHBpcEFzc2VydC5pc0Z1bmN0aW9uKHN1Y2Nlc3NDYWxsYmFjaywgJ3BpcFRvYXN0cy5zaG93TWVzc2FnZTpzdWNjZXNzQ2FsbGJhY2sgc2hvdWxkIGJlIGEgZnVuY3Rpb24nKTtcclxuICAgICAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgICAgIC8vIGlmIChjYW5jZWxDYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIHBpcEFzc2VydC5pc0Z1bmN0aW9uKGNhbmNlbENhbGxiYWNrLCAncGlwVG9hc3RzLnNob3dNZXNzYWdlOiBjYW5jZWxDYWxsYmFjayBzaG91bGQgYmUgYSBmdW5jdGlvbicpO1xyXG4gICAgICAgICAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICAgICAgICAgIGFkZFRvYXN0KHtcclxuICAgICAgICAgICAgICAgICAgICBpZDogaWQgfHwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnbWVzc2FnZScsXHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogbWVzc2FnZSxcclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb25zOiBbJ29rJ10sXHJcbiAgICAgICAgICAgICAgICAgICAgc3VjY2Vzc0NhbGxiYWNrOiBzdWNjZXNzQ2FsbGJhY2ssXHJcbiAgICAgICAgICAgICAgICAgICAgY2FuY2VsQ2FsbGJhY2s6IGNhbmNlbENhbGxiYWNrXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gU2hvdyBlcnJvciB0b2FzdCBhdCB0aGUgYm90dG9tIHJpZ2h0IGFmdGVyIGVycm9yIG9jY3VyZWRcclxuICAgICAgICAgICAgZnVuY3Rpb24gc2hvd0Vycm9yKG1lc3NhZ2UsIHN1Y2Nlc3NDYWxsYmFjaywgY2FuY2VsQ2FsbGJhY2ssIGlkLCBlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgLy8gcGlwQXNzZXJ0LmlzRGVmKG1lc3NhZ2UsICdwaXBUb2FzdHMuc2hvd0Vycm9yOiBtZXNzYWdlIHNob3VsZCBiZSBkZWZpbmVkJyk7XHJcbiAgICAgICAgICAgICAgICAvLyBwaXBBc3NlcnQuaXNTdHJpbmcobWVzc2FnZSwgJ3BpcFRvYXN0cy5zaG93RXJyb3I6IG1lc3NhZ2Ugc2hvdWxkIGJlIGEgc3RyaW5nJyk7XHJcbiAgICAgICAgICAgICAgICAvLyBpZiAoc3VjY2Vzc0NhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgcGlwQXNzZXJ0LmlzRnVuY3Rpb24oc3VjY2Vzc0NhbGxiYWNrLCAncGlwVG9hc3RzLnNob3dFcnJvcjogc3VjY2Vzc0NhbGxiYWNrIHNob3VsZCBiZSBhIGZ1bmN0aW9uJyk7XHJcbiAgICAgICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgICAgICAvLyBpZiAoY2FuY2VsQ2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgIC8vICAgICBwaXBBc3NlcnQuaXNGdW5jdGlvbihjYW5jZWxDYWxsYmFjaywgJ3BpcFRvYXN0cy5zaG93RXJyb3I6IGNhbmNlbENhbGxiYWNrIHNob3VsZCBiZSBhIGZ1bmN0aW9uJyk7XHJcbiAgICAgICAgICAgICAgICAvLyB9XHJcblxyXG4gICAgICAgICAgICAgICAgYWRkVG9hc3Qoe1xyXG4gICAgICAgICAgICAgICAgICAgIGlkOiBpZCB8fCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvcixcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZXJyb3InLFxyXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UgfHwgJ1Vua25vd24gZXJyb3IuJyxcclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb25zOiBbJ29rJ10sXHJcbiAgICAgICAgICAgICAgICAgICAgc3VjY2Vzc0NhbGxiYWNrOiBzdWNjZXNzQ2FsbGJhY2ssXHJcbiAgICAgICAgICAgICAgICAgICAgY2FuY2VsQ2FsbGJhY2s6IGNhbmNlbENhbGxiYWNrXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gSGlkZSBhbmQgY2xlYXIgYWxsIHRvYXN0IHdoZW4gdXNlciBzaWducyBvdXRcclxuICAgICAgICAgICAgZnVuY3Rpb24gaGlkZUFsbFRvYXN0cygpIHtcclxuICAgICAgICAgICAgICAgICRtZFRvYXN0LmNhbmNlbCgpO1xyXG4gICAgICAgICAgICAgICAgdG9hc3RzID0gW107XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIENsZWFyIHRvYXN0cyBieSB0eXBlXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNsZWFyVG9hc3RzKHR5cGU/OiBhbnkpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gcGlwQXNzZXJ0LmlzU3RyaW5nKHR5cGUsICdwaXBUb2FzdHMuY2xlYXJUb2FzdHM6IHR5cGUgc2hvdWxkIGJlIGEgc3RyaW5nJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVtb3ZlVG9hc3RzKHR5cGUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAkbWRUb2FzdC5jYW5jZWwoKTtcclxuICAgICAgICAgICAgICAgICAgICB0b2FzdHMgPSBbXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24obW9kdWxlKSB7XG50cnkge1xuICBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgncGlwQ29udHJvbHMuVGVtcGxhdGVzJyk7XG59IGNhdGNoIChlKSB7XG4gIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBDb250cm9scy5UZW1wbGF0ZXMnLCBbXSk7XG59XG5tb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoJ2NvbG9yX3BpY2tlci9jb2xvcl9waWNrZXIuaHRtbCcsXG4gICAgJzx1bCBjbGFzcz1cInBpcC1jb2xvci1waWNrZXIge3tjbGFzc319XCIgcGlwLXNlbGVjdGVkPVwiY3VycmVudENvbG9ySW5kZXhcIiBwaXAtZW50ZXItc3BhY2UtcHJlc3M9XCJlbnRlclNwYWNlUHJlc3MoJGV2ZW50KVwiPjxsaSB0YWJpbmRleD1cIi0xXCIgbmctcmVwZWF0PVwiY29sb3IgaW4gY29sb3JzIHRyYWNrIGJ5IGNvbG9yXCI+PG1kLWJ1dHRvbiB0YWJpbmRleD1cIi0xXCIgY2xhc3M9XCJtZC1pY29uLWJ1dHRvbiBwaXAtc2VsZWN0YWJsZVwiIG5nLWNsaWNrPVwic2VsZWN0Q29sb3IoJGluZGV4KVwiIGFyaWEtbGFiZWw9XCJjb2xvclwiIG5nLWRpc2FibGVkPVwiZGlzYWJsZWQoKVwiPjxtZC1pY29uIG5nLXN0eWxlPVwie1xcJ2NvbG9yXFwnOiBjb2xvcn1cIiBtZC1zdmctaWNvbj1cImljb25zOnt7IGNvbG9yID09IGN1cnJlbnRDb2xvciA/IFxcJ2NpcmNsZVxcJyA6IFxcJ3JhZGlvLW9mZlxcJyB9fVwiPjwvbWQtaWNvbj48L21kLWJ1dHRvbj48L2xpPjwvdWw+Jyk7XG59XSk7XG59KSgpO1xuXG4oZnVuY3Rpb24obW9kdWxlKSB7XG50cnkge1xuICBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgncGlwQ29udHJvbHMuVGVtcGxhdGVzJyk7XG59IGNhdGNoIChlKSB7XG4gIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBDb250cm9scy5UZW1wbGF0ZXMnLCBbXSk7XG59XG5tb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoJ3BvcG92ZXIvcG9wb3Zlci5odG1sJyxcbiAgICAnPGRpdiBuZy1pZj1cInBhcmFtcy50ZW1wbGF0ZVVybFwiIGNsYXNzPVwicGlwLXBvcG92ZXIgZmxleCBsYXlvdXQtY29sdW1uXCIgbmctY2xpY2s9XCJvblBvcG92ZXJDbGljaygkZXZlbnQpXCIgbmctaW5jbHVkZT1cInBhcmFtcy50ZW1wbGF0ZVVybFwiPjwvZGl2PjxkaXYgbmctaWY9XCJwYXJhbXMudGVtcGxhdGVcIiBjbGFzcz1cInBpcC1wb3BvdmVyXCIgbmctY2xpY2s9XCJvblBvcG92ZXJDbGljaygkZXZlbnQpXCI+PC9kaXY+Jyk7XG59XSk7XG59KSgpO1xuXG4oZnVuY3Rpb24obW9kdWxlKSB7XG50cnkge1xuICBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgncGlwQ29udHJvbHMuVGVtcGxhdGVzJyk7XG59IGNhdGNoIChlKSB7XG4gIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBDb250cm9scy5UZW1wbGF0ZXMnLCBbXSk7XG59XG5tb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoJ3Byb2dyZXNzL3JvdXRpbmdfcHJvZ3Jlc3MuaHRtbCcsXG4gICAgJzxkaXYgY2xhc3M9XCJwaXAtcm91dGluZy1wcm9ncmVzcyBsYXlvdXQtY29sdW1uIGxheW91dC1hbGlnbi1jZW50ZXItY2VudGVyXCIgbmctc2hvdz1cInNob3dQcm9ncmVzcygpXCI+PGRpdiBjbGFzcz1cImxvYWRlclwiPjxzdmcgY2xhc3M9XCJjaXJjdWxhclwiIHZpZXdib3g9XCIyNSAyNSA1MCA1MFwiPjxjaXJjbGUgY2xhc3M9XCJwYXRoXCIgY3g9XCI1MFwiIGN5PVwiNTBcIiByPVwiMjBcIiBmaWxsPVwibm9uZVwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbWl0ZXJsaW1pdD1cIjEwXCI+PC9jaXJjbGU+PC9zdmc+PC9kaXY+PGltZyBzcmM9XCJcIiBoZWlnaHQ9XCI0MFwiIHdpZHRoPVwiNDBcIiBjbGFzcz1cInBpcC1pbWdcIj48bWQtcHJvZ3Jlc3MtY2lyY3VsYXIgbWQtZGlhbWV0ZXI9XCI5NlwiIGNsYXNzPVwiZml4LWllXCI+PC9tZC1wcm9ncmVzcy1jaXJjdWxhcj48L2Rpdj4nKTtcbn1dKTtcbn0pKCk7XG5cbihmdW5jdGlvbihtb2R1bGUpIHtcbnRyeSB7XG4gIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBDb250cm9scy5UZW1wbGF0ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcENvbnRyb2xzLlRlbXBsYXRlcycsIFtdKTtcbn1cbm1vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgndG9hc3QvdG9hc3QuaHRtbCcsXG4gICAgJzxtZC10b2FzdCBjbGFzcz1cIm1kLWFjdGlvbiBwaXAtdG9hc3RcIiBuZy1jbGFzcz1cIntcXCdwaXAtZXJyb3JcXCc6IHRvYXN0LnR5cGU9PVxcJ2Vycm9yXFwnLCBcXCdwaXAtY29sdW1uLXRvYXN0XFwnOiB0b2FzdC5hY3Rpb25zLmxlbmd0aCA+IDEgfHwgYWN0aW9uTGVuZ2h0ID4gNCwgXFwncGlwLW5vLWFjdGlvbi10b2FzdFxcJzogYWN0aW9uTGVuZ2h0ID09IDB9XCIgc3R5bGU9XCJoZWlnaHQ6aW5pdGlhbDsgbWF4LWhlaWdodDogaW5pdGlhbDtcIj48c3BhbiBjbGFzcz1cImZsZXgtdmFyIHBpcC10ZXh0XCIgbmctYmluZC1odG1sPVwibWVzc2FnZVwiPjwvc3Bhbj48ZGl2IGNsYXNzPVwibGF5b3V0LXJvdyBsYXlvdXQtYWxpZ24tZW5kLXN0YXJ0IHBpcC1hY3Rpb25zXCIgbmctaWY9XCJhY3Rpb25zLmxlbmd0aCA+IDAgfHwgKHRvYXN0LnR5cGU9PVxcJ2Vycm9yXFwnICYmIHRvYXN0LmVycm9yKVwiPjxkaXYgY2xhc3M9XCJmbGV4XCIgbmctaWY9XCJ0b2FzdC5hY3Rpb25zLmxlbmd0aCA+IDFcIj48L2Rpdj48bWQtYnV0dG9uIGNsYXNzPVwiZmxleC1maXhlZCBwaXAtdG9hc3QtYnV0dG9uXCIgbmctaWY9XCJ0b2FzdC50eXBlPT1cXCdlcnJvclxcJyAmJiB0b2FzdC5lcnJvciAmJiBzaG93RGV0YWlsc1wiIG5nLWNsaWNrPVwib25EZXRhaWxzKClcIj5EZXRhaWxzPC9tZC1idXR0b24+PG1kLWJ1dHRvbiBjbGFzcz1cImZsZXgtZml4ZWQgcGlwLXRvYXN0LWJ1dHRvblwiIG5nLWNsaWNrPVwib25BY3Rpb24oYWN0aW9uKVwiIG5nLXJlcGVhdD1cImFjdGlvbiBpbiBhY3Rpb25zXCIgYXJpYS1sYWJlbD1cInt7OjphY3Rpb258IHRyYW5zbGF0ZX19XCI+e3s6OmFjdGlvbnwgdHJhbnNsYXRlfX08L21kLWJ1dHRvbj48L2Rpdj48L21kLXRvYXN0PicpO1xufV0pO1xufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGlwLXdlYnVpLWNvbnRyb2xzLWh0bWwubWluLmpzLm1hcFxuIl19