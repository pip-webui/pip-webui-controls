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
            toasts = _.reject(toasts, function (toast) {
                return toast.type === 'error';
            });
            if (currentToast && currentToast.type === 'error') {
                $mdToast.cancel();
                showNextToast();
            }
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
                message: message,
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
    '<md-toast class="md-action pip-toast" ng-class="{\'pip-error\': toast.type==\'error\', \'pip-column-toast\': toast.type == \'error\' || toast.actions.length > 1 || actionLenght > 4, \'pip-no-action-toast\': actionLenght == 0}" style="height:initial; max-height: initial;"><span class="flex-var pip-text" ng-bind-html="message"></span><div class="layout-row layout-align-end-start" ng-if="actions.length > 0 || (toast.type==\'error\' && toast.error)"><md-button class="flex-fixed pip-toast-button" ng-if="toast.type==\'error\' && toast.error && showDetails" ng-click="onDetails()">Details</md-button><md-button class="flex-fixed pip-toast-button" ng-click="onAction(action)" ng-repeat="action in actions" aria-label="{{::action| translate}}">{{::action| translate}}</md-button></div></md-toast>');
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



},{}]},{},[1,2,3,5,4,6,7,8,10,9,11,12,13])(13)
});


//# sourceMappingURL=pip-webui-controls.js.map
