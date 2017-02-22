(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.pip || (g.pip = {})).controls = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var ColorPickerController = (function () {
    ColorPickerController.$inject = ['$scope', '$element', '$attrs', '$timeout'];
    function ColorPickerController($scope, $element, $attrs, $timeout) {
        var DEFAULT_COLORS = ['purple', 'lightgreen', 'green', 'darkred', 'pink', 'yellow', 'cyan'];
        this._$timeout = $timeout;
        this._$scope = $scope;
        this.class = $attrs.class || '';
        this.colors = !$scope['colors'] || _.isArray($scope['colors']) && $scope['colors'].length === 0 ? DEFAULT_COLORS : $scope['colors'];
        this.colorChange = $scope['colorChange'] || null;
        this.currentColor = $scope['currentColor'] || this.colors[0];
        this.currentColorIndex = this.colors.indexOf(this.currentColor);
        this.ngDisabled = $scope['ngDisabled'];
    }
    ColorPickerController.prototype.disabled = function () {
        if (this.ngDisabled) {
            return this.ngDisabled();
        }
        return true;
    };
    ;
    ColorPickerController.prototype.selectColor = function (index) {
        var _this = this;
        if (this.disabled()) {
            return;
        }
        this.currentColorIndex = index;
        this.currentColor = this.colors[this.currentColorIndex];
        this._$timeout(function () {
            _this._$scope.$apply();
        });
        if (this.colorChange) {
            this.colorChange();
        }
    };
    ;
    ColorPickerController.prototype.enterSpacePress = function (event) {
        this.selectColor(event.index);
    };
    ;
    return ColorPickerController;
}());
exports.ColorPickerController = ColorPickerController;
(function () {
    pipColorPicker.$inject = ['$parse'];
    function pipColorPicker($parse) {
        "ngInject";
        return {
            restrict: 'EA',
            scope: {
                ngDisabled: '&',
                colors: '=pipColors',
                currentColor: '=ngModel',
                colorChange: '&ngChange'
            },
            templateUrl: 'color_picker/color_picker.html',
            controller: ColorPickerController,
            controllerAs: 'vm'
        };
    }
    angular
        .module('pipColorPicker', ['pipControls.Templates'])
        .directive('pipColorPicker', pipColorPicker);
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
var pipImageSliderController = (function () {
    pipImageSliderController.$inject = ['$scope', '$element', '$attrs', '$parse', '$timeout', '$interval', '$pipImageSlider'];
    function pipImageSliderController($scope, $element, $attrs, $parse, $timeout, $interval, $pipImageSlider) {
        var _this = this;
        this._index = 0;
        this.DEFAULT_INTERVAL = 4500;
        this.swipeStart = 0;
        this.sliderIndex = $scope['sliderIndex'];
        this._type = $scope['type']();
        this._interval = $scope['interval']();
        console.log('$scope.interval()', $scope['interval']());
        this._$attrs = $attrs;
        this._$interval = $interval;
        $scope['slideTo'] = this.slideToPrivate;
        $element.addClass('pip-image-slider');
        $element.addClass('pip-animation-' + this._type);
        this.setIndex();
        $timeout(function () {
            _this._blocks = $element.find('.pip-animation-block');
            if (_this._blocks.length > 0) {
                $(_this._blocks[0]).addClass('pip-show');
            }
        });
        this.startInterval();
        this._throttled = _.throttle(function () {
            $pipImageSlider.toBlock(_this._type, _this._blocks, _this._index, _this._newIndex, _this._direction);
            _this._index = _this._newIndex;
            ;
            $scope['selectIndex'] = _this._index;
            _this.setIndex();
        }, 700);
        if ($attrs.id) {
            $pipImageSlider.registerSlider($attrs.id, $scope);
        }
        $element.on('$destroy', function () {
            _this.stopInterval();
            $pipImageSlider.removeSlider($attrs.id);
        });
    }
    pipImageSliderController.prototype.nextBlock = function () {
        this.restartInterval();
        this._newIndex = this._index + 1 === this._blocks.length ? 0 : this._index + 1;
        this._direction = 'next';
        this._throttled();
    };
    pipImageSliderController.prototype.prevBlock = function () {
        this.restartInterval();
        this._newIndex = this._index - 1 < 0 ? this._blocks.length - 1 : this._index - 1;
        this._direction = 'prev';
        this._throttled();
    };
    pipImageSliderController.prototype.slideToPrivate = function (nextIndex) {
        console.log(this);
        if (nextIndex === this._index || nextIndex > this._blocks.length - 1) {
            return;
        }
        this.restartInterval();
        this._newIndex = nextIndex;
        this._direction = nextIndex > this._index ? 'next' : 'prev';
        this._throttled();
    };
    pipImageSliderController.prototype.setIndex = function () {
        if (this._$attrs.pipImageIndex)
            this.sliderIndex = this._index;
    };
    pipImageSliderController.prototype.startInterval = function () {
        var _this = this;
        this._timePromises = this._$interval(function () {
            _this._newIndex = _this._index + 1 === _this._blocks.length ? 0 : _this._index + 1;
            _this._direction = 'next';
            _this._throttled();
        }, this._interval || this.DEFAULT_INTERVAL);
    };
    pipImageSliderController.prototype.stopInterval = function () {
        this._$interval.cancel(this._timePromises);
    };
    pipImageSliderController.prototype.restartInterval = function () {
        this.stopInterval();
        this.startInterval();
    };
    return pipImageSliderController;
}());
(function () {
    function pipImageSlider() {
        return {
            scope: {
                sliderIndex: '=pipImageIndex',
                type: '&pipAnimationType',
                interval: '&pipAnimationInterval'
            },
            controller: pipImageSliderController,
            controllerAs: 'vm'
        };
    }
    angular
        .module('pipImageSlider', ['pipSliderButton', 'pipSliderIndicator', 'pipImageSlider.Service'])
        .directive('pipImageSlider', pipImageSlider);
})();
},{}],5:[function(require,module,exports){
var ImageSliderService = (function () {
    ImageSliderService.$inject = ['$timeout'];
    function ImageSliderService($timeout) {
        this.ANIMATION_DURATION = 550;
        this._sliders = {};
        this._$timeout = $timeout;
    }
    ImageSliderService.prototype.registerSlider = function (sliderId, sliderScope) {
        console.log('reg', sliderScope);
        this._sliders[sliderId] = sliderScope;
    };
    ImageSliderService.prototype.removeSlider = function (sliderId) {
        delete this._sliders[sliderId];
    };
    ImageSliderService.prototype.getSliderScope = function (sliderId) {
        console.log('ggg', this._sliders, 'jjj');
        return this._sliders[sliderId];
    };
    ImageSliderService.prototype.nextCarousel = function (nextBlock, prevBlock) {
        nextBlock.addClass('pip-next');
        this._$timeout(function () {
            nextBlock.addClass('animated').addClass('pip-show').removeClass('pip-next');
            prevBlock.addClass('animated').removeClass('pip-show');
        }, 100);
    };
    ImageSliderService.prototype.prevCarousel = function (nextBlock, prevBlock) {
        this._$timeout(function () {
            nextBlock.addClass('animated').addClass('pip-show');
            prevBlock.addClass('animated').addClass('pip-next').removeClass('pip-show');
        }, 100);
    };
    ImageSliderService.prototype.toBlock = function (type, blocks, oldIndex, nextIndex, direction) {
        var prevBlock = $(blocks[oldIndex]), blockIndex = nextIndex, nextBlock = $(blocks[blockIndex]);
        if (type === 'carousel') {
            $(blocks).removeClass('pip-next').removeClass('pip-prev').removeClass('animated');
            if (direction && (direction === 'prev' || direction === 'next')) {
                if (direction === 'prev') {
                    this.prevCarousel(nextBlock, prevBlock);
                }
                else {
                    this.nextCarousel(nextBlock, prevBlock);
                }
            }
            else {
                if (nextIndex && nextIndex < oldIndex) {
                    this.prevCarousel(nextBlock, prevBlock);
                }
                else {
                    this.nextCarousel(nextBlock, prevBlock);
                }
            }
        }
        else {
            prevBlock.addClass('animated').removeClass('pip-show');
            nextBlock.addClass('animated').addClass('pip-show');
        }
    };
    return ImageSliderService;
}());
(function () {
    'use strict';
    angular
        .module('pipImageSlider.Service', [])
        .service('$pipImageSlider', ImageSliderService);
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
                    $pipImageSlider.getSliderScope(sliderId).vm[type + 'Block']();
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
                    $pipImageSlider.getSliderScope(sliderId).vm.slideToPrivate(slideTo);
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
"use strict";
var PopoverController = (function () {
    PopoverController.$inject = ['$scope', '$rootScope', '$element', '$timeout', '$compile'];
    function PopoverController($scope, $rootScope, $element, $timeout, $compile) {
        var _this = this;
        this._$timeout = $timeout;
        this.templateUrl = $scope['params'].templateUrl;
        this.template = $scope['params'].template;
        this.timeout = $scope['params'].timeout;
        this.element = $scope['params'].element;
        this.calcH = $scope['params'].calcHeight;
        this.cancelCallback = $scope['params'].cancelCallback;
        this.backdropElement = $('.pip-popover-backdrop');
        this.backdropElement.on('click keydown scroll', function () { _this.backdropClick(); });
        this.backdropElement.addClass($scope['params'].responsive !== false ? 'pip-responsive' : '');
        $timeout(function () {
            _this.position();
            if ($scope['params'].template) {
                _this.content = $compile($scope['params'].template)($scope);
                $element.find('.pip-popover').append(_this.content);
            }
            _this.init();
        });
        $timeout(function () { _this.calcHeight(); }, 200);
        $rootScope.$on('pipPopoverResize', function () { _this.onResize(); });
        $(window).resize(function () { _this.onResize(); });
    }
    PopoverController.prototype.backdropClick = function () {
        if (this.cancelCallback) {
            this.cancelCallback();
        }
        this.closePopover();
    };
    PopoverController.prototype.closePopover = function () {
        var _this = this;
        this.backdropElement.removeClass('opened');
        this._$timeout(function () {
            _this.backdropElement.remove();
        }, 100);
    };
    PopoverController.prototype.onPopoverClick = function ($e) {
        $e.stopPropagation();
    };
    PopoverController.prototype.init = function () {
        this.backdropElement.addClass('opened');
        $('.pip-popover-backdrop').focus();
        if (this.timeout) {
            this._$timeout(function () {
                this.closePopover();
            }, this.timeout);
        }
    };
    PopoverController.prototype.position = function () {
        if (this.element) {
            var element = $(this.element), pos = element.offset(), width = element.width(), height = element.height(), docWidth = $(document).width(), docHeight = $(document).height(), popover = this.backdropElement.find('.pip-popover');
            if (pos) {
                popover
                    .css('max-width', docWidth - (docWidth - pos.left))
                    .css('max-height', docHeight - (pos.top + height) - 32, 0)
                    .css('left', pos.left - popover.width() + width / 2)
                    .css('top', pos.top + height + 16);
            }
        }
    };
    PopoverController.prototype.onResize = function () {
        this.backdropElement.find('.pip-popover').find('.pip-content').css('max-height', '100%');
        this.position();
        this.calcHeight();
    };
    PopoverController.prototype.calcHeight = function () {
        if (this.calcH === false) {
            return;
        }
        var popover = this.backdropElement.find('.pip-popover'), title = popover.find('.pip-title'), footer = popover.find('.pip-footer'), content = popover.find('.pip-content'), contentHeight = popover.height() - title.outerHeight(true) - footer.outerHeight(true);
        content.css('max-height', Math.max(contentHeight, 0) + 'px').css('box-sizing', 'border-box');
    };
    return PopoverController;
}());
exports.PopoverController = PopoverController;
(function () {
    pipPopover.$inject = ['$parse'];
    function pipPopover($parse) {
        "ngInject";
        return {
            restrict: 'EA',
            scope: true,
            templateUrl: 'popover/popover.html',
            controller: PopoverController,
            controllerAs: 'vm'
        };
    }
    angular
        .module('pipPopover', ['pipPopover.Service'])
        .directive('pipPopover', pipPopover);
})();
},{}],10:[function(require,module,exports){
"use strict";
var PopoverService = (function () {
    PopoverService.$inject = ['$compile', '$rootScope', '$timeout'];
    function PopoverService($compile, $rootScope, $timeout) {
        this._$compile = $compile;
        this._$rootScope = $rootScope;
        this._$timeout = $timeout;
        this.popoverTemplate = "<div class='pip-popover-backdrop {{ params.class }}' ng-controller='params.controller'" +
            " tabindex='1'> <pip-popover pip-params='params'> </pip-popover> </div>";
    }
    PopoverService.prototype.show = function (p) {
        var element, scope, params, content;
        element = $('body');
        if (element.find('md-backdrop').length > 0) {
            return;
        }
        this.hide();
        scope = this._$rootScope.$new();
        params = p && _.isObject(p) ? p : {};
        scope['params'] = params;
        scope['locals'] = params.locals;
        content = this._$compile(this.popoverTemplate)(scope);
        element.append(content);
    };
    PopoverService.prototype.hide = function () {
        var backdropElement = $('.pip-popover-backdrop');
        backdropElement.removeClass('opened');
        this._$timeout(function () {
            backdropElement.remove();
        }, 100);
    };
    PopoverService.prototype.resize = function () {
        this._$rootScope.$broadcast('pipPopoverResize');
    };
    return PopoverService;
}());
exports.PopoverService = PopoverService;
(function () {
    angular
        .module('pipPopover.Service', [])
        .service('pipPopoverService', PopoverService);
})();
},{}],11:[function(require,module,exports){
var RoutingController = (function () {
    RoutingController.$inject = ['$scope', '$element'];
    function RoutingController($scope, $element) {
        this._image = $element.children('img');
        this.showProgress = $scope['showProgress'];
        this.logoUrl = $scope['logoUrl'];
        this.loadProgressImage();
    }
    RoutingController.prototype.loadProgressImage = function () {
        if (this.logoUrl) {
            this._image.attr('src', this.logoUrl);
        }
    };
    return RoutingController;
}());
(function () {
    function RoutingProgress() {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                showProgress: '&',
                logoUrl: '@'
            },
            templateUrl: 'progress/routing_progress.html',
            controller: RoutingController,
            controllerAs: 'vm'
        };
    }
    angular
        .module('pipRoutingProgress', ['ngMaterial'])
        .directive('pipRoutingProgress', RoutingProgress);
})();
},{}],12:[function(require,module,exports){
var ToastController = (function () {
    function ToastController($mdToast, toast, $injector) {
        this._pipErrorDetailsDialog = $injector.has('pipErrorDetailsDialog')
            ? $injector.get('pipErrorDetailsDialog') : null;
        this._$mdToast = $mdToast;
        this.message = toast.message;
        this.actions = toast.actions;
        this.toast = toast;
        if (toast.actions.length === 0) {
            this.actionLenght = 0;
        }
        else {
            this.actionLenght = toast.actions.length === 1 ? toast.actions[0].toString().length : null;
        }
        this.showDetails = this._pipErrorDetailsDialog != null;
    }
    ToastController.prototype.onDetails = function () {
        this._$mdToast.hide();
        if (this._pipErrorDetailsDialog) {
            this._pipErrorDetailsDialog.show({
                error: this.toast.error,
                ok: 'Ok'
            }, angular.noop, angular.noop);
        }
    };
    ToastController.prototype.onAction = function (action) {
        this._$mdToast.hide({
            action: action,
            id: this.toast.id,
            message: this.message
        });
    };
    return ToastController;
}());
var ToastService = (function () {
    ToastService.$inject = ['$rootScope', '$mdToast'];
    function ToastService($rootScope, $mdToast) {
        var _this = this;
        this.SHOW_TIMEOUT = 20000;
        this.SHOW_TIMEOUT_NOTIFICATIONS = 20000;
        this.toasts = [];
        this.sounds = {};
        this._$mdToast = $mdToast;
        $rootScope.$on('$stateChangeSuccess', function () { _this.onStateChangeSuccess(); });
        $rootScope.$on('pipSessionClosed', function () { _this.onClearToasts(); });
        $rootScope.$on('pipIdentityChanged', function () { _this.onClearToasts(); });
    }
    ToastService.prototype.showNextToast = function () {
        var toast;
        if (this.toasts.length > 0) {
            toast = this.toasts[0];
            this.toasts.splice(0, 1);
            this.showToast(toast);
        }
    };
    ToastService.prototype.showToast = function (toast) {
        var _this = this;
        this.currentToast = toast;
        this._$mdToast.show({
            templateUrl: 'toast/toast.html',
            hideDelay: toast.duration || this.SHOW_TIMEOUT,
            position: 'bottom left',
            controller: ToastController,
            controllerAs: 'vm',
            locals: {
                toast: this.currentToast,
                sounds: this.sounds
            }
        })
            .then(function (action) {
            _this.showToastOkResult(action);
        }, function (action) {
            _this.showToastCancelResult(action);
        });
    };
    ToastService.prototype.showToastCancelResult = function (action) {
        if (this.currentToast.cancelCallback) {
            this.currentToast.cancelCallback(action);
        }
        this.currentToast = null;
        this.showNextToast();
    };
    ToastService.prototype.showToastOkResult = function (action) {
        if (this.currentToast.successCallback) {
            this.currentToast.successCallback(action);
        }
        this.currentToast = null;
        this.showNextToast();
    };
    ToastService.prototype.addToast = function (toast) {
        if (this.currentToast && toast.type !== 'error') {
            this.toasts.push(toast);
        }
        else {
            this.showToast(toast);
        }
    };
    ToastService.prototype.removeToasts = function (type) {
        var result = [];
        _.each(this.toasts, function (toast) {
            if (!toast.type || toast.type !== type) {
                result.push(toast);
            }
        });
        this.toasts = _.cloneDeep(result);
    };
    ToastService.prototype.removeToastsById = function (id) {
        _.remove(this.toasts, { id: id });
    };
    ToastService.prototype.getToastById = function (id) {
        return _.find(this.toasts, { id: id });
    };
    ToastService.prototype.onStateChangeSuccess = function () { };
    ToastService.prototype.onClearToasts = function () {
        this.clearToasts(null);
    };
    ToastService.prototype.showNotification = function (message, actions, successCallback, cancelCallback, id) {
        this.addToast({
            id: id || null,
            type: 'notification',
            message: message,
            actions: actions || ['ok'],
            successCallback: successCallback,
            cancelCallback: cancelCallback,
            duration: this.SHOW_TIMEOUT_NOTIFICATIONS
        });
    };
    ToastService.prototype.showMessage = function (message, successCallback, cancelCallback, id) {
        this.addToast({
            id: id || null,
            type: 'message',
            message: message,
            actions: ['ok'],
            successCallback: successCallback,
            cancelCallback: cancelCallback
        });
    };
    ToastService.prototype.showError = function (message, successCallback, cancelCallback, id, error) {
        this.addToast({
            id: id || null,
            error: error,
            type: 'error',
            message: message || 'Unknown error.',
            actions: ['ok'],
            successCallback: successCallback,
            cancelCallback: cancelCallback
        });
    };
    ToastService.prototype.hideAllToasts = function () {
        this._$mdToast.cancel();
        this.toasts = [];
    };
    ToastService.prototype.clearToasts = function (type) {
        if (type) {
            this.removeToasts(type);
        }
        else {
            this._$mdToast.cancel();
            this.toasts = [];
        }
    };
    return ToastService;
}());
(function () {
    angular
        .module('pipToasts', ['ngMaterial', 'pipControls.Translate'])
        .service('pipToasts', ToastService);
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
    '<ul class="pip-color-picker {{vm.class}}" pip-selected="vm.currentColorIndex" pip-enter-space-press="vm.enterSpacePress($event)"><li tabindex="-1" ng-repeat="color in vm.colors track by color"><md-button tabindex="-1" class="md-icon-button pip-selectable" ng-click="vm.selectColor($index)" aria-label="color" ng-disabled="vm.disabled()"><md-icon ng-style="{\'color\': color}" md-svg-icon="icons:{{ color == vm.currentColor ? \'circle\' : \'radio-off\' }}"></md-icon></md-button></li></ul>');
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
    '<div ng-if="vm.templateUrl" class="pip-popover flex layout-column" ng-click="vm.onPopoverClick($event)" ng-include="vm.templateUrl"></div><div ng-if="vm.template" class="pip-popover" ng-click="vm.onPopoverClick($event)"></div>');
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
    '<div class="pip-routing-progress layout-column layout-align-center-center" ng-show="vm.showProgress()"><div class="loader"><svg class="circular" viewbox="25 25 50 50"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"></circle></svg></div><img src="" height="40" width="40" class="pip-img"><md-progress-circular md-diameter="96" class="fix-ie"></md-progress-circular></div>');
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
    '<md-toast class="md-action pip-toast" ng-class="{\'pip-error\': vm.toast.type==\'error\', \'pip-column-toast\': vm.toast.actions.length > 1 || vm.actionLenght > 4, \'pip-no-action-toast\': vm.actionLenght == 0}" style="height:initial; max-height: initial;"><span class="flex-var pip-text" ng-bind-html="vm.message"></span><div class="layout-row layout-align-end-start pip-actions" ng-if="vm.actions.length > 0 || (vm.toast.type==\'error\' && vm.toast.error)"><div class="flex" ng-if="vm.toast.actions.length > 1"></div><md-button class="flex-fixed pip-toast-button" ng-if="vm.toast.type==\'error\' && vm.toast.error && vm.showDetails" ng-click="vm.onDetails()">Details</md-button><md-button class="flex-fixed pip-toast-button" ng-click="vm.onAction(action)" ng-repeat="action in vm.actions" aria-label="{{::action| translate}}">{{::action| translate}}</md-button></div></md-toast>');
}]);
})();



},{}]},{},[13,1,2,3,5,4,6,7,8,10,9,11,12])(13)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29sb3JfcGlja2VyL2NvbG9yX3BpY2tlci50cyIsInNyYy9jb250cm9scy50cyIsInNyYy9kZXBlbmRlbmNpZXMvdHJhbnNsYXRlLnRzIiwic3JjL2ltYWdlX3NsaWRlci9pbWFnZV9zbGlkZXIudHMiLCJzcmMvaW1hZ2Vfc2xpZGVyL2ltYWdlX3NsaWRlcl9zZXJ2aWNlLnRzIiwic3JjL2ltYWdlX3NsaWRlci9zbGlkZXJfYnV0dG9uLnRzIiwic3JjL2ltYWdlX3NsaWRlci9zbGlkZXJfaW5kaWNhdG9yLnRzIiwic3JjL21hcmtkb3duL21hcmtkb3duLnRzIiwic3JjL3BvcG92ZXIvcG9wb3Zlci50cyIsInNyYy9wb3BvdmVyL3BvcG92ZXJfc2VydmljZS50cyIsInNyYy9wcm9ncmVzcy9yb3V0aW5nX3Byb2dyZXNzLnRzIiwic3JjL3RvYXN0L3RvYXN0cy50cyIsInRlbXAvcGlwLXdlYnVpLWNvbnRyb2xzLWh0bWwubWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ2FBO0lBWUksK0JBQ0ksTUFBaUIsRUFDakIsUUFBUSxFQUNSLE1BQU0sRUFDTixRQUFRO1FBQ0osSUFBSSxjQUFjLEdBQUcsQ0FBQyxRQUFRLEVBQUUsWUFBWSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUM1RixJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztRQUMxQixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUV0QixJQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsSUFB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QUNGLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxZQUFZLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztTQUM1RCxPQUFPLENBQUMsV0FBVyxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQzVDLENBQUMsQ0FBQyxFQUFFLENBQUM7O0FDclBMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZXhwb3J0IGludGVyZmFjZSBJQ29sb3JQaWNrZXIge1xyXG4gICAgY2xhc3M6IHN0cmluZztcclxuICAgIGNvbG9yczogc3RyaW5nW107XHJcbiAgICBjdXJyZW50Q29sb3I6IHN0cmluZztcclxuICAgIGN1cnJlbnRDb2xvckluZGV4OiBudW1iZXI7XHJcbiAgICBuZ0Rpc2FibGVkOiBGdW5jdGlvbjtcclxuICAgIGNvbG9yQ2hhbmdlOiBGdW5jdGlvbjtcclxuXHJcbiAgICBlbnRlclNwYWNlUHJlc3MoZXZlbnQpOiB2b2lkO1xyXG4gICAgZGlzYWJsZWQoKTogYm9vbGVhbjtcclxuICAgIHNlbGVjdENvbG9yKGluZGV4OiBudW1iZXIpO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ29sb3JQaWNrZXJDb250cm9sbGVyIGltcGxlbWVudHMgSUNvbG9yUGlja2VyIHtcclxuICBcclxuICAgIHByaXZhdGUgXyR0aW1lb3V0O1xyXG4gICAgcHJpdmF0ZSBfJHNjb3BlOiBuZy5JU2NvcGU7XHJcblxyXG4gICAgcHVibGljIGNsYXNzOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgY29sb3JzOiBzdHJpbmdbXTtcclxuICAgIHB1YmxpYyBjdXJyZW50Q29sb3I6IHN0cmluZztcclxuICAgIHB1YmxpYyBjdXJyZW50Q29sb3JJbmRleDogbnVtYmVyO1xyXG4gICAgcHVibGljIG5nRGlzYWJsZWQ6IEZ1bmN0aW9uO1xyXG4gICAgcHVibGljIGNvbG9yQ2hhbmdlOiBGdW5jdGlvbjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciggXHJcbiAgICAgICAgJHNjb3BlOiBuZy5JU2NvcGUsIFxyXG4gICAgICAgICRlbGVtZW50LFxyXG4gICAgICAgICRhdHRycywgXHJcbiAgICAgICAgJHRpbWVvdXQgKSB7XHJcbiAgICAgICAgICAgIGxldCBERUZBVUxUX0NPTE9SUyA9IFsncHVycGxlJywgJ2xpZ2h0Z3JlZW4nLCAnZ3JlZW4nLCAnZGFya3JlZCcsICdwaW5rJywgJ3llbGxvdycsICdjeWFuJ107XHJcbiAgICAgICAgICAgIHRoaXMuXyR0aW1lb3V0ID0gJHRpbWVvdXQ7XHJcbiAgICAgICAgICAgIHRoaXMuXyRzY29wZSA9ICRzY29wZTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY2xhc3MgPSAkYXR0cnMuY2xhc3MgfHwgJyc7XHJcbiAgICAgICAgICAgIHRoaXMuY29sb3JzID0gISRzY29wZVsnY29sb3JzJ10gfHwgXy5pc0FycmF5KCRzY29wZVsnY29sb3JzJ10pICYmICRzY29wZVsnY29sb3JzJ10ubGVuZ3RoID09PSAwID8gREVGQVVMVF9DT0xPUlMgOiAkc2NvcGVbJ2NvbG9ycyddO1xyXG4gICAgICAgICAgICB0aGlzLmNvbG9yQ2hhbmdlID0gJHNjb3BlWydjb2xvckNoYW5nZSddIHx8IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudENvbG9yID0gJHNjb3BlWydjdXJyZW50Q29sb3InXSB8fCB0aGlzLmNvbG9yc1swXTtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50Q29sb3JJbmRleCA9IHRoaXMuY29sb3JzLmluZGV4T2YodGhpcy5jdXJyZW50Q29sb3IpO1xyXG4gICAgICAgICAgICB0aGlzLm5nRGlzYWJsZWQgPSAkc2NvcGVbJ25nRGlzYWJsZWQnXTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRpc2FibGVkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLm5nRGlzYWJsZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubmdEaXNhYmxlZCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9O1xyXG5cclxuICAgICBwdWJsaWMgc2VsZWN0Q29sb3IoaW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkKCkpIHsgcmV0dXJuOyB9XHJcbiAgICAgICAgdGhpcy5jdXJyZW50Q29sb3JJbmRleCA9IGluZGV4O1xyXG4gICAgICAgIHRoaXMuY3VycmVudENvbG9yID0gdGhpcy5jb2xvcnNbdGhpcy5jdXJyZW50Q29sb3JJbmRleF07XHJcbiAgICAgICAgdGhpcy5fJHRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl8kc2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNvbG9yQ2hhbmdlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29sb3JDaGFuZ2UoKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHB1YmxpYyBlbnRlclNwYWNlUHJlc3MoZXZlbnQpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnNlbGVjdENvbG9yKGV2ZW50LmluZGV4KTtcclxuICAgIH07XHJcblxyXG59XHJcblxyXG4oKCkgPT4ge1xyXG4gICAgZnVuY3Rpb24gcGlwQ29sb3JQaWNrZXIoJHBhcnNlOiBhbnkpIHtcclxuICAgICAgICBcIm5nSW5qZWN0XCI7XHJcblxyXG4gICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgICAgICAgICAgc2NvcGU6IHtcclxuICAgICAgICAgICAgICAgICAgICBuZ0Rpc2FibGVkOiAnJicsXHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3JzOiAnPXBpcENvbG9ycycsXHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudENvbG9yOiAnPW5nTW9kZWwnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yQ2hhbmdlOiAnJm5nQ2hhbmdlJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29sb3JfcGlja2VyL2NvbG9yX3BpY2tlci5odG1sJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IENvbG9yUGlja2VyQ29udHJvbGxlcixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJ1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncGlwQ29sb3JQaWNrZXInLCBbJ3BpcENvbnRyb2xzLlRlbXBsYXRlcyddKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ3BpcENvbG9yUGlja2VyJywgcGlwQ29sb3JQaWNrZXIpO1xyXG5cclxuXHJcbn0pKCk7XHJcblxyXG5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxyXG4vKlxyXG4oZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciB0aGlzTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcENvbG9yUGlja2VyJywgWyAncGlwQ29udHJvbHMuVGVtcGxhdGVzJ10pOyAvLyAncGlwRm9jdXNlZCcsXHJcblxyXG4gICAgdGhpc01vZHVsZS5kaXJlY3RpdmUoJ3BpcENvbG9yUGlja2VyJyxcclxuICAgICAgICBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICAgICAgICAgIHNjb3BlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmdEaXNhYmxlZDogJyYnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yczogJz1waXBDb2xvcnMnLFxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRDb2xvcjogJz1uZ01vZGVsJyxcclxuICAgICAgICAgICAgICAgICAgICBjb2xvckNoYW5nZTogJyZuZ0NoYW5nZSdcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbG9yX3BpY2tlci9jb2xvcl9waWNrZXIuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAncGlwQ29sb3JQaWNrZXJDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICk7XHJcbiAgICB0aGlzTW9kdWxlLmNvbnRyb2xsZXIoJ3BpcENvbG9yUGlja2VyQ29udHJvbGxlcicsXHJcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycywgJHRpbWVvdXQpIHtcclxuICAgICAgICAgICAgdmFyXHJcbiAgICAgICAgICAgICAgICBERUZBVUxUX0NPTE9SUyA9IFsncHVycGxlJywgJ2xpZ2h0Z3JlZW4nLCAnZ3JlZW4nLCAnZGFya3JlZCcsICdwaW5rJywgJ3llbGxvdycsICdjeWFuJ107XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuY2xhc3MgPSAkYXR0cnMuY2xhc3MgfHwgJyc7XHJcblxyXG4gICAgICAgICAgICBpZiAoISRzY29wZS5jb2xvcnMgfHwgXy5pc0FycmF5KCRzY29wZS5jb2xvcnMpICYmICRzY29wZS5jb2xvcnMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuY29sb3JzID0gREVGQVVMVF9DT0xPUlM7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRzY29wZS5jdXJyZW50Q29sb3IgPSAkc2NvcGUuY3VycmVudENvbG9yIHx8ICRzY29wZS5jb2xvcnNbMF07XHJcbiAgICAgICAgICAgICRzY29wZS5jdXJyZW50Q29sb3JJbmRleCA9ICRzY29wZS5jb2xvcnMuaW5kZXhPZigkc2NvcGUuY3VycmVudENvbG9yKTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5kaXNhYmxlZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlmICgkc2NvcGUubmdEaXNhYmxlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkc2NvcGUubmdEaXNhYmxlZCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnNlbGVjdENvbG9yID0gZnVuY3Rpb24gKGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoJHNjb3BlLmRpc2FibGVkKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuY3VycmVudENvbG9ySW5kZXggPSBpbmRleDtcclxuXHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuY3VycmVudENvbG9yID0gJHNjb3BlLmNvbG9yc1skc2NvcGUuY3VycmVudENvbG9ySW5kZXhdO1xyXG5cclxuICAgICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoJHNjb3BlLmNvbG9yQ2hhbmdlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNvbG9yQ2hhbmdlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuZW50ZXJTcGFjZVByZXNzID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuc2VsZWN0Q29sb3IoZXZlbnQuaW5kZXgpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICk7XHJcblxyXG59KSgpO1xyXG4qL1xyXG5cclxuXHJcbi8vaW1wb3J0IHtGaWxlVXBsb2FkQ29udHJvbGxlcn0gZnJvbSAnLi91cGxvYWQvRmlsZVVwbG9hZENvbnRyb2xsZXInO1xyXG4vL2ltcG9ydCB7RmlsZVByb2dyZXNzQ29udHJvbGxlcn0gZnJvbSAnLi9wcm9ncmVzcy9GaWxlUHJvZ3Jlc3NDb250cm9sbGVyJztcclxuLy9pbXBvcnQge0ZpbGVVcGxvYWRTZXJ2aWNlfSBmcm9tICcuL3NlcnZpY2UvRmlsZVVwbG9hZFNlcnZpY2UnOyIsIu+7vy8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi90eXBpbmdzL3RzZC5kLnRzXCIgLz5cclxuXHJcbigoKSA9PiB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ3BpcENvbnRyb2xzJywgW1xyXG4gICAgICAgICdwaXBNYXJrZG93bicsXHJcbiAgICAgICAgJ3BpcENvbG9yUGlja2VyJyxcclxuICAgICAgICAncGlwUm91dGluZ1Byb2dyZXNzJyxcclxuICAgICAgICAncGlwUG9wb3ZlcicsXHJcbiAgICAgICAgJ3BpcEltYWdlU2xpZGVyJyxcclxuICAgICAgICAncGlwVG9hc3RzJyxcclxuICAgICAgICAncGlwQ29udHJvbHMuVHJhbnNsYXRlJ1xyXG4gICAgXSk7XHJcblxyXG59KSgpO1xyXG5cclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgdGhpc01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBDb250cm9scy5UcmFuc2xhdGUnLCBbXSk7XHJcblxyXG4gICAgdGhpc01vZHVsZS5maWx0ZXIoJ3RyYW5zbGF0ZScsIGZ1bmN0aW9uICgkaW5qZWN0b3IpIHtcclxuICAgICAgICB2YXIgcGlwVHJhbnNsYXRlID0gJGluamVjdG9yLmhhcygncGlwVHJhbnNsYXRlJykgXHJcbiAgICAgICAgICAgID8gJGluamVjdG9yLmdldCgncGlwVHJhbnNsYXRlJykgOiBudWxsO1xyXG5cclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgICAgICByZXR1cm4gcGlwVHJhbnNsYXRlICA/IHBpcFRyYW5zbGF0ZS50cmFuc2xhdGUoa2V5KSB8fCBrZXkgOiBrZXk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG59KSgpO1xyXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vdHlwaW5ncy90c2QuZC50c1wiIC8+XHJcbi8qXHJcbigoKSA9PiB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIHRoaXNNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgncGlwSW1hZ2VTbGlkZXInLCBbJ3BpcFNsaWRlckJ1dHRvbicsICdwaXBTbGlkZXJJbmRpY2F0b3InLCAncGlwSW1hZ2VTbGlkZXIuU2VydmljZSddKTtcclxuXHJcbiAgICB0aGlzTW9kdWxlLmRpcmVjdGl2ZSgncGlwSW1hZ2VTbGlkZXInLFxyXG4gICAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHNjb3BlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVySW5kZXg6ICc9cGlwSW1hZ2VJbmRleCdcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbiAoJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzLCAkcGFyc2UsICR0aW1lb3V0LCAkaW50ZXJ2YWwsICRwaXBJbWFnZVNsaWRlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBibG9ja3MsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gMCwgbmV3SW5kZXgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpcmVjdGlvbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZSA9ICRwYXJzZSgkYXR0cnMucGlwQW5pbWF0aW9uVHlwZSkoJHNjb3BlKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgREVGQVVMVF9JTlRFUlZBTCA9IDQ1MDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGludGVydmFsID0gJHBhcnNlKCRhdHRycy5waXBBbmltYXRpb25JbnRlcnZhbCkoJHNjb3BlKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGltZVByb21pc2VzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdHRsZWQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRlbGVtZW50LmFkZENsYXNzKCdwaXAtaW1hZ2Utc2xpZGVyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJGVsZW1lbnQuYWRkQ2xhc3MoJ3BpcC1hbmltYXRpb24tJyArIHR5cGUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc3dpcGVTdGFydCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgIC8vaWYgKCRzd2lwZSlcclxuICAgICAgICAgICAgICAgICAgICAgLy8kc3dpcGUuYmluZCgkZWxlbWVudCwge1xyXG4gICAgICAgICAgICAgICAgICAgICAvLydzdGFydCc6IGZ1bmN0aW9uKGNvb3Jkcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAvL2lmIChjb29yZHMpICRzY29wZS5zd2lwZVN0YXJ0ID0gY29vcmRzLng7XHJcbiAgICAgICAgICAgICAgICAgICAgIC8vZWxzZSAkc2NvcGUuc3dpcGVTdGFydCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgIC8vfSxcclxuICAgICAgICAgICAgICAgICAgICAgLy8nZW5kJzogZnVuY3Rpb24oY29vcmRzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgIC8vdmFyIGRlbHRhO1xyXG4gICAgICAgICAgICAgICAgICAgICAvL2lmIChjb29yZHMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgLy9kZWx0YSA9ICRzY29wZS5zd2lwZVN0YXJ0IC0gY29vcmRzLng7XHJcbiAgICAgICAgICAgICAgICAgICAgIC8vaWYgKGRlbHRhID4gMTUwKSAgJHNjb3BlLm5leHRCbG9jaygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAvL2lmIChkZWx0YSA8IC0xNTApICAkc2NvcGUucHJldkJsb2NrKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgIC8vJHNjb3BlLnN3aXBlU3RhcnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAvL30gZWxzZSAkc2NvcGUuc3dpcGVTdGFydCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgIC8vfVxyXG4gICAgICAgICAgICAgICAgICAgICAvL30pO1xyXG4gICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBzZXRJbmRleCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrcyA9ICRlbGVtZW50LmZpbmQoJy5waXAtYW5pbWF0aW9uLWJsb2NrJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChibG9ja3MubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChibG9ja3NbMF0pLmFkZENsYXNzKCdwaXAtc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0SW50ZXJ2YWwoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdHRsZWQgPSBfLnRocm90dGxlKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHBpcEltYWdlU2xpZGVyLnRvQmxvY2sodHlwZSwgYmxvY2tzLCBpbmRleCwgbmV3SW5kZXgsIGRpcmVjdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gbmV3SW5kZXg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldEluZGV4KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgNzAwKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm5leHRCbG9jayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdGFydEludGVydmFsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0luZGV4ID0gaW5kZXggKyAxID09PSBibG9ja3MubGVuZ3RoID8gMCA6IGluZGV4ICsgMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uID0gJ25leHQnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdHRsZWQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUucHJldkJsb2NrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN0YXJ0SW50ZXJ2YWwoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3SW5kZXggPSBpbmRleCAtIDEgPCAwID8gYmxvY2tzLmxlbmd0aCAtIDEgOiBpbmRleCAtIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpcmVjdGlvbiA9ICdwcmV2JztcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3R0bGVkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnNsaWRlVG8gPSBmdW5jdGlvbiAobmV4dEluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuZXh0SW5kZXggPT09IGluZGV4IHx8IG5leHRJbmRleCA+IGJsb2Nrcy5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3RhcnRJbnRlcnZhbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdJbmRleCA9IG5leHRJbmRleDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uID0gbmV4dEluZGV4ID4gaW5kZXggPyAnbmV4dCcgOiAncHJldic7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm90dGxlZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCRhdHRycy5pZCkgJHBpcEltYWdlU2xpZGVyLnJlZ2lzdGVyU2xpZGVyKCRhdHRycy5pZCwgJHNjb3BlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gc2V0SW5kZXgoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkYXR0cnMucGlwSW1hZ2VJbmRleCkgJHNjb3BlLnNsaWRlckluZGV4ID0gaW5kZXg7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBzdGFydEludGVydmFsKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aW1lUHJvbWlzZXMgPSAkaW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3SW5kZXggPSBpbmRleCArIDEgPT09IGJsb2Nrcy5sZW5ndGggPyAwIDogaW5kZXggKyAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uID0gJ25leHQnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3R0bGVkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIGludGVydmFsIHx8IERFRkFVTFRfSU5URVJWQUwpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gc3RvcEludGVydmFsKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkaW50ZXJ2YWwuY2FuY2VsKHRpbWVQcm9taXNlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAkZWxlbWVudC5vbignJGRlc3Ryb3knLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0b3BJbnRlcnZhbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkcGlwSW1hZ2VTbGlkZXIucmVtb3ZlU2xpZGVyKCRhdHRycy5pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHJlc3RhcnRJbnRlcnZhbCgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RvcEludGVydmFsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0SW50ZXJ2YWwoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgKTtcclxuXHJcbn0pKCk7XHJcbiovXHJcblxyXG5jbGFzcyBwaXBJbWFnZVNsaWRlckNvbnRyb2xsZXJ7XHJcblxyXG4gICAgcHJpdmF0ZSBfJGF0dHJzO1xyXG4gICAgcHJpdmF0ZSBfJGludGVydmFsOiBhbmd1bGFyLklJbnRlcnZhbFNlcnZpY2U7XHJcblxyXG4gICAgcHJpdmF0ZSBfYmxvY2tzOiBhbnlbXTtcclxuICAgIHByaXZhdGUgX2luZGV4OiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBfbmV3SW5kZXg6IG51bWJlcjtcclxuICAgIHByaXZhdGUgX2RpcmVjdGlvbjogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBfdHlwZTogYW55O1xyXG4gICAgcHJpdmF0ZSBERUZBVUxUX0lOVEVSVkFMID0gNDUwMDtcclxuICAgIHByaXZhdGUgX2ludGVydmFsO1xyXG4gICAgcHJpdmF0ZSBfdGltZVByb21pc2VzO1xyXG4gICAgcHJpdmF0ZSBfdGhyb3R0bGVkOiBGdW5jdGlvbjtcclxuXHJcbiAgICBwdWJsaWMgc3dpcGVTdGFydDogbnVtYmVyID0gMDtcclxuICAgIHB1YmxpYyBzbGlkZXJJbmRleDogbnVtYmVyO1xyXG4gICAgcHVibGljIHNsaWRlVG86IEZ1bmN0aW9uO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgICRzY29wZTogbmcuSVNjb3BlLCBcclxuICAgICAgICAkZWxlbWVudCwgXHJcbiAgICAgICAgJGF0dHJzLCBcclxuICAgICAgICAkcGFyc2U6IG5nLklQYXJzZVNlcnZpY2UsIFxyXG4gICAgICAgICR0aW1lb3V0OiBhbmd1bGFyLklUaW1lb3V0U2VydmljZSxcclxuICAgICAgICAkaW50ZXJ2YWw6IGFuZ3VsYXIuSUludGVydmFsU2VydmljZSwgXHJcbiAgICAgICAgJHBpcEltYWdlU2xpZGVyKSB7XHJcblxyXG4gICAgICAgIHRoaXMuc2xpZGVySW5kZXggPSAkc2NvcGVbJ3NsaWRlckluZGV4J107XHJcbiAgICAgICAgdGhpcy5fdHlwZSA9ICRzY29wZVsndHlwZSddKCk7XHJcbiAgICAgICAgdGhpcy5faW50ZXJ2YWwgPSAkc2NvcGVbJ2ludGVydmFsJ10oKTtcclxuICAgICAgICBjb25zb2xlLmxvZygnJHNjb3BlLmludGVydmFsKCknLCAkc2NvcGVbJ2ludGVydmFsJ10oKSk7XHJcbiAgICAgICAgdGhpcy5fJGF0dHJzID0gJGF0dHJzO1xyXG4gICAgICAgIHRoaXMuXyRpbnRlcnZhbCA9ICRpbnRlcnZhbDtcclxuICAgICAgICAkc2NvcGVbJ3NsaWRlVG8nXSA9IHRoaXMuc2xpZGVUb1ByaXZhdGU7XHJcblxyXG4gICAgICAgICRlbGVtZW50LmFkZENsYXNzKCdwaXAtaW1hZ2Utc2xpZGVyJyk7XHJcbiAgICAgICAgJGVsZW1lbnQuYWRkQ2xhc3MoJ3BpcC1hbmltYXRpb24tJyArIHRoaXMuX3R5cGUpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuc2V0SW5kZXgoKTtcclxuXHJcbiAgICAgICAgJHRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9ibG9ja3MgPSAkZWxlbWVudC5maW5kKCcucGlwLWFuaW1hdGlvbi1ibG9jaycpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fYmxvY2tzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICQodGhpcy5fYmxvY2tzWzBdKS5hZGRDbGFzcygncGlwLXNob3cnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXJ0SW50ZXJ2YWwoKTtcclxuICAgICAgICB0aGlzLl90aHJvdHRsZWQgPSBfLnRocm90dGxlKCgpID0+IHtcclxuICAgICAgICAgICAgJHBpcEltYWdlU2xpZGVyLnRvQmxvY2sodGhpcy5fdHlwZSwgdGhpcy5fYmxvY2tzLCB0aGlzLl9pbmRleCwgdGhpcy5fbmV3SW5kZXgsIHRoaXMuX2RpcmVjdGlvbik7XHJcbiAgICAgICAgICAgIHRoaXMuX2luZGV4ID0gdGhpcy5fbmV3SW5kZXg7O1xyXG4gICAgICAgICAgICAkc2NvcGVbJ3NlbGVjdEluZGV4J10gPSB0aGlzLl9pbmRleDtcclxuICAgICAgICAgICAgdGhpcy5zZXRJbmRleCgpO1xyXG4gICAgICAgIH0sIDcwMCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKCRhdHRycy5pZCkgeyAkcGlwSW1hZ2VTbGlkZXIucmVnaXN0ZXJTbGlkZXIoJGF0dHJzLmlkLCAkc2NvcGUpIH1cclxuXHJcbiAgICAgICAgJGVsZW1lbnQub24oJyRkZXN0cm95JywgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnN0b3BJbnRlcnZhbCgpO1xyXG4gICAgICAgICAgICAkcGlwSW1hZ2VTbGlkZXIucmVtb3ZlU2xpZGVyKCRhdHRycy5pZCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBuZXh0QmxvY2soKSB7XHJcbiAgICAgICAgdGhpcy5yZXN0YXJ0SW50ZXJ2YWwoKTtcclxuICAgICAgICB0aGlzLl9uZXdJbmRleCA9IHRoaXMuX2luZGV4ICsgMSA9PT0gdGhpcy5fYmxvY2tzLmxlbmd0aCA/IDAgOiB0aGlzLl9pbmRleCArIDE7XHJcbiAgICAgICAgdGhpcy5fZGlyZWN0aW9uID0gJ25leHQnO1xyXG4gICAgICAgIHRoaXMuX3Rocm90dGxlZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBwcmV2QmxvY2soKSB7XHJcbiAgICAgICAgdGhpcy5yZXN0YXJ0SW50ZXJ2YWwoKTtcclxuICAgICAgICB0aGlzLl9uZXdJbmRleCA9IHRoaXMuX2luZGV4IC0gMSA8IDAgPyB0aGlzLl9ibG9ja3MubGVuZ3RoIC0gMSA6IHRoaXMuX2luZGV4IC0gMTtcclxuICAgICAgICB0aGlzLl9kaXJlY3Rpb24gPSAncHJldic7XHJcbiAgICAgICAgdGhpcy5fdGhyb3R0bGVkKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNsaWRlVG9Qcml2YXRlKG5leHRJbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcyk7XHJcbiAgICAgICAgaWYgKG5leHRJbmRleCA9PT0gdGhpcy5faW5kZXggfHwgbmV4dEluZGV4ID4gdGhpcy5fYmxvY2tzLmxlbmd0aCAtIDEpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5yZXN0YXJ0SW50ZXJ2YWwoKTtcclxuICAgICAgICB0aGlzLl9uZXdJbmRleCA9IG5leHRJbmRleDtcclxuICAgICAgICB0aGlzLl9kaXJlY3Rpb24gPSBuZXh0SW5kZXggPiB0aGlzLl9pbmRleCA/ICduZXh0JyA6ICdwcmV2JztcclxuICAgICAgICB0aGlzLl90aHJvdHRsZWQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldEluZGV4KCkge1xyXG4gICAgICAgIGlmICh0aGlzLl8kYXR0cnMucGlwSW1hZ2VJbmRleCkgdGhpcy5zbGlkZXJJbmRleCA9IHRoaXMuX2luZGV4O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhcnRJbnRlcnZhbCgpIHtcclxuICAgICAgICB0aGlzLl90aW1lUHJvbWlzZXMgPSB0aGlzLl8kaW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9uZXdJbmRleCA9IHRoaXMuX2luZGV4ICsgMSA9PT0gdGhpcy5fYmxvY2tzLmxlbmd0aCA/IDAgOiB0aGlzLl9pbmRleCArIDE7XHJcbiAgICAgICAgICAgIHRoaXMuX2RpcmVjdGlvbiA9ICduZXh0JztcclxuICAgICAgICAgICAgdGhpcy5fdGhyb3R0bGVkKCk7XHJcbiAgICAgICAgfSwgdGhpcy5faW50ZXJ2YWwgfHwgdGhpcy5ERUZBVUxUX0lOVEVSVkFMKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0b3BJbnRlcnZhbCgpIHtcclxuICAgICAgICB0aGlzLl8kaW50ZXJ2YWwuY2FuY2VsKHRoaXMuX3RpbWVQcm9taXNlcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZXN0YXJ0SW50ZXJ2YWwoKSB7XHJcbiAgICAgICAgdGhpcy5zdG9wSW50ZXJ2YWwoKTtcclxuICAgICAgICB0aGlzLnN0YXJ0SW50ZXJ2YWwoKTtcclxuICAgIH1cclxufVxyXG5cclxuKCgpID0+IHtcclxuXHJcbiAgICBmdW5jdGlvbiBwaXBJbWFnZVNsaWRlcigpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBzY29wZToge1xyXG4gICAgICAgICAgICAgICAgc2xpZGVySW5kZXg6ICc9cGlwSW1hZ2VJbmRleCcsXHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnJnBpcEFuaW1hdGlvblR5cGUnLFxyXG4gICAgICAgICAgICAgICAgaW50ZXJ2YWw6ICcmcGlwQW5pbWF0aW9uSW50ZXJ2YWwnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IHBpcEltYWdlU2xpZGVyQ29udHJvbGxlcixcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3BpcEltYWdlU2xpZGVyJywgWydwaXBTbGlkZXJCdXR0b24nLCAncGlwU2xpZGVySW5kaWNhdG9yJywgJ3BpcEltYWdlU2xpZGVyLlNlcnZpY2UnXSlcclxuICAgICAgICAuZGlyZWN0aXZlKCdwaXBJbWFnZVNsaWRlcicsIHBpcEltYWdlU2xpZGVyKTtcclxuXHJcbn0pKCk7XHJcbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi90eXBpbmdzL3RzZC5kLnRzXCIgLz5cclxuXHJcbmludGVyZmFjZSBJSW1hZ2VTbGlkZXJTZXJ2aWNlIHtcclxuICAgIHJlZ2lzdGVyU2xpZGVyKHNsaWRlcklkOiBzdHJpbmcsIHNsaWRlclNjb3BlKTogdm9pZDtcclxuICAgIHJlbW92ZVNsaWRlcihzbGlkZXJJZDogc3RyaW5nKTogdm9pZDtcclxuICAgIGdldFNsaWRlclNjb3BlKHNsaWRlcklkOiBzdHJpbmcpO1xyXG4gICAgbmV4dENhcm91c2VsKG5leHRCbG9jaywgcHJldkJsb2NrKTogdm9pZDtcclxuICAgIHByZXZDYXJvdXNlbChuZXh0QmxvY2ssIHByZXZCbG9jayk6IHZvaWQ7XHJcbiAgICB0b0Jsb2NrKHR5cGU6IHN0cmluZywgYmxvY2tzOiBhbnlbXSwgb2xkSW5kZXg6IG51bWJlciwgbmV4dEluZGV4OiBudW1iZXIsIGRpcmVjdGlvbjogc3RyaW5nKTogdm9pZDtcclxufVxyXG5cclxuY2xhc3MgSW1hZ2VTbGlkZXJTZXJ2aWNlIHtcclxuICAgIHByaXZhdGUgXyR0aW1lb3V0OiBhbmd1bGFyLklUaW1lb3V0U2VydmljZTtcclxuICAgIHByaXZhdGUgQU5JTUFUSU9OX0RVUkFUSU9OOiBudW1iZXIgPSA1NTA7XHJcbiAgICBwcml2YXRlIF9zbGlkZXJzID0ge307XHJcblxyXG4gICAgY29uc3RydWN0b3IoJHRpbWVvdXQ6IGFuZ3VsYXIuSVRpbWVvdXRTZXJ2aWNlKSB7XHJcbiAgICAgICAgdGhpcy5fJHRpbWVvdXQgPSAkdGltZW91dDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVnaXN0ZXJTbGlkZXIoc2xpZGVySWQ6IHN0cmluZywgc2xpZGVyU2NvcGUpOiB2b2lkIHtcclxuICAgICAgICBjb25zb2xlLmxvZygncmVnJywgc2xpZGVyU2NvcGUpO1xyXG4gICAgICAgIHRoaXMuX3NsaWRlcnNbc2xpZGVySWRdID0gc2xpZGVyU2NvcGU7XHJcbiAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgcHVibGljIHJlbW92ZVNsaWRlcihzbGlkZXJJZDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX3NsaWRlcnNbc2xpZGVySWRdO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRTbGlkZXJTY29wZShzbGlkZXJJZDogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2dnZycsIHRoaXMuX3NsaWRlcnMsICdqamonKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2xpZGVyc1tzbGlkZXJJZF07XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG5leHRDYXJvdXNlbChuZXh0QmxvY2ssIHByZXZCbG9jayk6IHZvaWQge1xyXG4gICAgICAgIG5leHRCbG9jay5hZGRDbGFzcygncGlwLW5leHQnKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIHRoaXMuXyR0aW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgbmV4dEJsb2NrLmFkZENsYXNzKCdhbmltYXRlZCcpLmFkZENsYXNzKCdwaXAtc2hvdycpLnJlbW92ZUNsYXNzKCdwaXAtbmV4dCcpO1xyXG4gICAgICAgICAgICBwcmV2QmxvY2suYWRkQ2xhc3MoJ2FuaW1hdGVkJykucmVtb3ZlQ2xhc3MoJ3BpcC1zaG93Jyk7XHJcbiAgICAgICAgfSwgMTAwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcHJldkNhcm91c2VsKG5leHRCbG9jaywgcHJldkJsb2NrKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fJHRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICBuZXh0QmxvY2suYWRkQ2xhc3MoJ2FuaW1hdGVkJykuYWRkQ2xhc3MoJ3BpcC1zaG93Jyk7XHJcbiAgICAgICAgICAgIHByZXZCbG9jay5hZGRDbGFzcygnYW5pbWF0ZWQnKS5hZGRDbGFzcygncGlwLW5leHQnKS5yZW1vdmVDbGFzcygncGlwLXNob3cnKTtcclxuICAgICAgICB9LCAxMDApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB0b0Jsb2NrKHR5cGU6IHN0cmluZywgYmxvY2tzOiBhbnlbXSwgb2xkSW5kZXg6IG51bWJlciwgbmV4dEluZGV4OiBudW1iZXIsIGRpcmVjdGlvbjogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IHByZXZCbG9jayA9ICQoYmxvY2tzW29sZEluZGV4XSksXHJcbiAgICAgICAgICAgIGJsb2NrSW5kZXg6IG51bWJlciA9IG5leHRJbmRleCxcclxuICAgICAgICAgICAgbmV4dEJsb2NrID0gJChibG9ja3NbYmxvY2tJbmRleF0pO1xyXG5cclxuICAgICAgICBpZiAodHlwZSA9PT0gJ2Nhcm91c2VsJykge1xyXG4gICAgICAgICAgICAkKGJsb2NrcykucmVtb3ZlQ2xhc3MoJ3BpcC1uZXh0JykucmVtb3ZlQ2xhc3MoJ3BpcC1wcmV2JykucmVtb3ZlQ2xhc3MoJ2FuaW1hdGVkJyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoZGlyZWN0aW9uICYmIChkaXJlY3Rpb24gPT09ICdwcmV2JyB8fCBkaXJlY3Rpb24gPT09ICduZXh0JykpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkaXJlY3Rpb24gPT09ICdwcmV2Jykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJldkNhcm91c2VsKG5leHRCbG9jaywgcHJldkJsb2NrKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0Q2Fyb3VzZWwobmV4dEJsb2NrLCBwcmV2QmxvY2spO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKG5leHRJbmRleCAmJiBuZXh0SW5kZXggPCBvbGRJbmRleCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJldkNhcm91c2VsKG5leHRCbG9jaywgcHJldkJsb2NrKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0Q2Fyb3VzZWwobmV4dEJsb2NrLCBwcmV2QmxvY2spO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcHJldkJsb2NrLmFkZENsYXNzKCdhbmltYXRlZCcpLnJlbW92ZUNsYXNzKCdwaXAtc2hvdycpO1xyXG4gICAgICAgICAgICBuZXh0QmxvY2suYWRkQ2xhc3MoJ2FuaW1hdGVkJykuYWRkQ2xhc3MoJ3BpcC1zaG93Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufVxyXG5cclxuXHJcbigoKSA9PiB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncGlwSW1hZ2VTbGlkZXIuU2VydmljZScsIFtdKVxyXG4gICAgICAgIC5zZXJ2aWNlKCckcGlwSW1hZ2VTbGlkZXInLCBJbWFnZVNsaWRlclNlcnZpY2UpO1xyXG5cclxufSkoKTtcclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxyXG5cclxuKCgpID0+IHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgdGhpc01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBTbGlkZXJCdXR0b24nLCBbXSk7XHJcblxyXG4gICAgdGhpc01vZHVsZS5kaXJlY3RpdmUoJ3BpcFNsaWRlckJ1dHRvbicsXHJcbiAgICAgICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgc2NvcGU6IHt9LFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24gKCRzY29wZSwgJGVsZW1lbnQsICRwYXJzZSwgJGF0dHJzLCAkcGlwSW1hZ2VTbGlkZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdHlwZSA9ICRwYXJzZSgkYXR0cnMucGlwQnV0dG9uVHlwZSkoJHNjb3BlKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGVySWQgPSAkcGFyc2UoJGF0dHJzLnBpcFNsaWRlcklkKSgkc2NvcGUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkZWxlbWVudC5vbignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghc2xpZGVySWQgfHwgIXR5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgJHBpcEltYWdlU2xpZGVyLmdldFNsaWRlclNjb3BlKHNsaWRlcklkKS52bVt0eXBlICsgJ0Jsb2NrJ10oKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICApO1xyXG5cclxufSkoKTtcclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgdGhpc01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBTbGlkZXJJbmRpY2F0b3InLCBbXSk7XHJcblxyXG4gICAgdGhpc01vZHVsZS5kaXJlY3RpdmUoJ3BpcFNsaWRlckluZGljYXRvcicsXHJcbiAgICAgICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgc2NvcGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogKCRzY29wZSwgJGVsZW1lbnQsICRwYXJzZSwgJGF0dHJzLCAkcGlwSW1hZ2VTbGlkZXIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc2xpZGVySWQgPSAkcGFyc2UoJGF0dHJzLnBpcFNsaWRlcklkKSgkc2NvcGUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzbGlkZVRvID0gJHBhcnNlKCRhdHRycy5waXBTbGlkZVRvKSgkc2NvcGUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkZWxlbWVudC5jc3MoJ2N1cnNvcicsICdwb2ludGVyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJGVsZW1lbnQub24oJ2NsaWNrJywgICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFzbGlkZXJJZCB8fCBzbGlkZVRvICYmIHNsaWRlVG8gPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgJHBpcEltYWdlU2xpZGVyLmdldFNsaWRlclNjb3BlKHNsaWRlcklkKS52bS5zbGlkZVRvUHJpdmF0ZShzbGlkZVRvKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICApO1xyXG5cclxufSkoKTtcclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxyXG5cclxuZGVjbGFyZSB2YXIgbWFya2VkOiBhbnk7XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciB0aGlzTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcE1hcmtkb3duJywgWyduZ1Nhbml0aXplJ10pO1xyXG5cclxuICAgIHRoaXNNb2R1bGUucnVuKGZ1bmN0aW9uICgkaW5qZWN0b3IpIHtcclxuICAgICAgICB2YXIgcGlwVHJhbnNsYXRlID0gJGluamVjdG9yLmhhcygncGlwVHJhbnNsYXRlJykgPyAkaW5qZWN0b3IuZ2V0KCdwaXBUcmFuc2xhdGUnKSA6IG51bGw7XHJcblxyXG4gICAgICAgIGlmIChwaXBUcmFuc2xhdGUpIHtcclxuICAgICAgICAgICAgcGlwVHJhbnNsYXRlLnNldFRyYW5zbGF0aW9ucygnZW4nLCB7XHJcbiAgICAgICAgICAgICAgICAnTUFSS0RPV05fQVRUQUNITUVOVFMnOiAnQXR0YWNobWVudHM6JyxcclxuICAgICAgICAgICAgICAgICdjaGVja2xpc3QnOiAnQ2hlY2tsaXN0JyxcclxuICAgICAgICAgICAgICAgICdkb2N1bWVudHMnOiAnRG9jdW1lbnRzJyxcclxuICAgICAgICAgICAgICAgICdwaWN0dXJlcyc6ICdQaWN0dXJlcycsXHJcbiAgICAgICAgICAgICAgICAnbG9jYXRpb24nOiAnTG9jYXRpb24nLFxyXG4gICAgICAgICAgICAgICAgJ3RpbWUnOiAnVGltZSdcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHBpcFRyYW5zbGF0ZS5zZXRUcmFuc2xhdGlvbnMoJ3J1Jywge1xyXG4gICAgICAgICAgICAgICAgJ01BUktET1dOX0FUVEFDSE1FTlRTJzogJ9CS0LvQvtC20LXQvdC40Y86JyxcclxuICAgICAgICAgICAgICAgICdjaGVja2xpc3QnOiAn0KHQv9C40YHQvtC6JyxcclxuICAgICAgICAgICAgICAgICdkb2N1bWVudHMnOiAn0JTQvtC60YPQvNC10L3RgtGLJyxcclxuICAgICAgICAgICAgICAgICdwaWN0dXJlcyc6ICfQmNC30L7QsdGA0LDQttC10L3QuNGPJyxcclxuICAgICAgICAgICAgICAgICdsb2NhdGlvbic6ICfQnNC10YHRgtC+0L3QsNGF0L7QttC00LXQvdC40LUnLFxyXG4gICAgICAgICAgICAgICAgJ3RpbWUnOiAn0JLRgNC10LzRjydcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpc01vZHVsZS5kaXJlY3RpdmUoJ3BpcE1hcmtkb3duJyxcclxuICAgICAgICBmdW5jdGlvbiAoJHBhcnNlLCAkaW5qZWN0b3IpIHtcclxuICAgICAgICAgICAgdmFyIHBpcFRyYW5zbGF0ZSA9ICRpbmplY3Rvci5oYXMoJ3BpcFRyYW5zbGF0ZScpID8gJGluamVjdG9yLmdldCgncGlwVHJhbnNsYXRlJykgOiBudWxsO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgICAgICAgICAgc2NvcGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgbGluazogZnVuY3Rpb24gKCRzY29wZTogYW55LCAkZWxlbWVudCwgJGF0dHJzOiBhbnkpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEdldHRlciA9ICRwYXJzZSgkYXR0cnMucGlwVGV4dCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpc3RHZXR0ZXIgPSAkcGFyc2UoJGF0dHJzLnBpcExpc3QpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFtcEdldHRlciA9ICRwYXJzZSgkYXR0cnMucGlwTGluZUNvdW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gZGVzY3JpYmVBdHRhY2htZW50cyhhcnJheSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0YWNoU3RyaW5nID0gJycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRhY2hUeXBlcyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgXy5lYWNoKGFycmF5LCBmdW5jdGlvbiAoYXR0YWNoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXR0YWNoLnR5cGUgJiYgYXR0YWNoLnR5cGUgIT09ICd0ZXh0Jykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhdHRhY2hTdHJpbmcubGVuZ3RoID09PSAwICYmIHBpcFRyYW5zbGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRhY2hTdHJpbmcgPSBwaXBUcmFuc2xhdGUudHJhbnNsYXRlKCdNQVJLRE9XTl9BVFRBQ0hNRU5UUycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGF0dGFjaFR5cGVzLmluZGV4T2YoYXR0YWNoLnR5cGUpIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRhY2hUeXBlcy5wdXNoKGF0dGFjaC50eXBlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0YWNoU3RyaW5nICs9IGF0dGFjaFR5cGVzLmxlbmd0aCA+IDEgPyAnLCAnIDogJyAnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGlwVHJhbnNsYXRlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0YWNoU3RyaW5nICs9IHBpcFRyYW5zbGF0ZS50cmFuc2xhdGUoYXR0YWNoLnR5cGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXR0YWNoU3RyaW5nO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gdG9Cb29sZWFuKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBudWxsKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdmFsdWUpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSA9PSAnMScgfHwgdmFsdWUgPT0gJ3RydWUnO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gYmluZFRleHQodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRleHRTdHJpbmcsIGlzQ2xhbXBlZCwgaGVpZ2h0LCBvcHRpb25zLCBvYmo7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoXy5pc0FycmF5KHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqID0gXy5maW5kKHZhbHVlLCBmdW5jdGlvbiAoaXRlbTogYW55KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0udHlwZSA9PT0gJ3RleHQnICYmIGl0ZW0udGV4dDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRTdHJpbmcgPSBvYmogPyBvYmoudGV4dCA6IGRlc2NyaWJlQXR0YWNobWVudHModmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dFN0cmluZyA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0NsYW1wZWQgPSAkYXR0cnMucGlwTGluZUNvdW50ICYmIF8uaXNOdW1iZXIoY2xhbXBHZXR0ZXIoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzQ2xhbXBlZCA9IGlzQ2xhbXBlZCAmJiB0ZXh0U3RyaW5nICYmIHRleHRTdHJpbmcubGVuZ3RoID4gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdmbTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhYmxlczogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrczogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNhbml0aXplOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGVkYW50aWM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzbWFydExpc3RzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc21hcnR5cGVudHM6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHRTdHJpbmcgPSBtYXJrZWQodGV4dFN0cmluZyB8fCAnJywgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0NsYW1wZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodCA9IDEuNSAqIGNsYW1wR2V0dGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQXNzaWduIHZhbHVlIGFzIEhUTUxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGVsZW1lbnQuaHRtbCgnPGRpdicgKyAoaXNDbGFtcGVkID8gbGlzdEdldHRlcigpID8gJ2NsYXNzPVwicGlwLW1hcmtkb3duLWNvbnRlbnQgJyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAncGlwLW1hcmtkb3duLWxpc3RcIiBzdHlsZT1cIm1heC1oZWlnaHQ6ICcgKyBoZWlnaHQgKyAnZW1cIj4nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnIGNsYXNzPVwicGlwLW1hcmtkb3duLWNvbnRlbnRcIiBzdHlsZT1cIm1heC1oZWlnaHQ6ICcgKyBoZWlnaHQgKyAnZW1cIj4nIDogbGlzdEdldHRlcigpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnIGNsYXNzPVwicGlwLW1hcmtkb3duLWxpc3RcIj4nIDogJz4nKSArIHRleHRTdHJpbmcgKyAnPC9kaXY+Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRlbGVtZW50LmZpbmQoJ2EnKS5hdHRyKCd0YXJnZXQnLCAnYmxhbmsnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFsaXN0R2V0dGVyKCkgJiYgaXNDbGFtcGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZWxlbWVudC5hcHBlbmQoJzxkaXYgY2xhc3M9XCJwaXAtZ3JhZGllbnQtYmxvY2tcIj48L2Rpdj4nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRmlsbCB0aGUgdGV4dFxyXG4gICAgICAgICAgICAgICAgICAgIGJpbmRUZXh0KHRleHRHZXR0ZXIoJHNjb3BlKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEFsc28gb3B0aW1pemF0aW9uIHRvIGF2b2lkIHdhdGNoIGlmIGl0IGlzIHVubmVjZXNzYXJ5XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRvQm9vbGVhbigkYXR0cnMucGlwUmViaW5kKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuJHdhdGNoKHRleHRHZXR0ZXIsIGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmluZFRleHQobmV3VmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS4kb24oJ3BpcFdpbmRvd1Jlc2l6ZWQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJpbmRUZXh0KHRleHRHZXR0ZXIoJHNjb3BlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEFkZCBjbGFzc1xyXG4gICAgICAgICAgICAgICAgICAgICRlbGVtZW50LmFkZENsYXNzKCdwaXAtbWFya2Rvd24nKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICApO1xyXG5cclxufSkoKTtcclxuXHJcbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi90eXBpbmdzL3RzZC5kLnRzXCIgLz5cclxuXHJcblxyXG5leHBvcnQgY2xhc3MgUG9wb3ZlckNvbnRyb2xsZXIge1xyXG4gIFxyXG4gICAgcHJpdmF0ZSBfJHRpbWVvdXQ7XHJcbiAgICBwcml2YXRlIF8kc2NvcGU6IG5nLklTY29wZTtcclxuXHJcbiAgICBwdWJsaWMgdGltZW91dDtcclxuICAgIHB1YmxpYyBiYWNrZHJvcEVsZW1lbnQ7XHJcbiAgICBwdWJsaWMgY29udGVudDtcclxuICAgIHB1YmxpYyBlbGVtZW50O1xyXG4gICAgcHVibGljIGNhbGNIOiBib29sZWFuO1xyXG5cclxuICAgIHB1YmxpYyB0ZW1wbGF0ZVVybDtcclxuICAgIHB1YmxpYyB0ZW1wbGF0ZVxyXG5cclxuICAgIHB1YmxpYyBjYW5jZWxDYWxsYmFjazogRnVuY3Rpb247XHJcblxyXG4gICAgY29uc3RydWN0b3IoIFxyXG4gICAgICAgICRzY29wZTogbmcuSVNjb3BlLFxyXG4gICAgICAgICRyb290U2NvcGUsXHJcbiAgICAgICAgJGVsZW1lbnQsXHJcbiAgICAgICAgJHRpbWVvdXQsIFxyXG4gICAgICAgICRjb21waWxlXHJcbiAgICAgICApIHtcclxuICAgICAgICAgICAvLyRzY29wZSA9IF8uZGVmYXVsdHMoJHNjb3BlLCAkc2NvcGUuJHBhcmVudCk7ICAgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgXHJcbiAgICAgICAgICAgdGhpcy5fJHRpbWVvdXQgPSAkdGltZW91dDtcclxuICAgICAgICAgICB0aGlzLnRlbXBsYXRlVXJsID0gJHNjb3BlWydwYXJhbXMnXS50ZW1wbGF0ZVVybDtcclxuICAgICAgICAgICB0aGlzLnRlbXBsYXRlID0gJHNjb3BlWydwYXJhbXMnXS50ZW1wbGF0ZTtcclxuICAgICAgICAgICB0aGlzLnRpbWVvdXQgPSAkc2NvcGVbJ3BhcmFtcyddLnRpbWVvdXQ7XHJcbiAgICAgICAgICAgdGhpcy5lbGVtZW50ID0gJHNjb3BlWydwYXJhbXMnXS5lbGVtZW50O1xyXG4gICAgICAgICAgIHRoaXMuY2FsY0ggPSAkc2NvcGVbJ3BhcmFtcyddLmNhbGNIZWlnaHQ7XHJcbiAgICAgICAgICAgdGhpcy5jYW5jZWxDYWxsYmFjayA9ICRzY29wZVsncGFyYW1zJ10uY2FuY2VsQ2FsbGJhY2s7XHJcbiAgICAgICAgICAgdGhpcy5iYWNrZHJvcEVsZW1lbnQgPSAkKCcucGlwLXBvcG92ZXItYmFja2Ryb3AnKTtcclxuICAgICAgICAgICB0aGlzLmJhY2tkcm9wRWxlbWVudC5vbignY2xpY2sga2V5ZG93biBzY3JvbGwnLCgpID0+eyB0aGlzLmJhY2tkcm9wQ2xpY2soKX0pO1xyXG4gICAgICAgICAgIHRoaXMuYmFja2Ryb3BFbGVtZW50LmFkZENsYXNzKCRzY29wZVsncGFyYW1zJ10ucmVzcG9uc2l2ZSAhPT0gZmFsc2UgPyAncGlwLXJlc3BvbnNpdmUnIDogJycpO1xyXG5cclxuICAgICAgICAgICAkdGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvc2l0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoJHNjb3BlWydwYXJhbXMnXS50ZW1wbGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudCA9ICRjb21waWxlKCRzY29wZVsncGFyYW1zJ10udGVtcGxhdGUpKCRzY29wZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgJGVsZW1lbnQuZmluZCgnLnBpcC1wb3BvdmVyJykuYXBwZW5kKHRoaXMuY29udGVudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5pbml0KCk7XHJcbiAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICR0aW1lb3V0KCgpID0+IHsgdGhpcy5jYWxjSGVpZ2h0KCk7IH0sIDIwMCk7XHJcbiAgICAgICAgICAgJHJvb3RTY29wZS4kb24oJ3BpcFBvcG92ZXJSZXNpemUnLCAoKSA9PiB7IHRoaXMub25SZXNpemUoKX0pO1xyXG4gICAgICAgICAgICQod2luZG93KS5yZXNpemUoKCkgPT4geyB0aGlzLm9uUmVzaXplKCkgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBiYWNrZHJvcENsaWNrKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmNhbmNlbENhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2FuY2VsQ2FsbGJhY2soKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jbG9zZVBvcG92ZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2xvc2VQb3BvdmVyKCkge1xyXG4gICAgICAgIHRoaXMuYmFja2Ryb3BFbGVtZW50LnJlbW92ZUNsYXNzKCdvcGVuZWQnKTtcclxuICAgICAgICB0aGlzLl8kdGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuYmFja2Ryb3BFbGVtZW50LnJlbW92ZSgpO1xyXG4gICAgICAgIH0sIDEwMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uUG9wb3ZlckNsaWNrKCRlKSB7XHJcbiAgICAgICAgJGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHByaXZhdGUgaW5pdCgpIHtcclxuICAgICAgICB0aGlzLmJhY2tkcm9wRWxlbWVudC5hZGRDbGFzcygnb3BlbmVkJyk7XHJcbiAgICAgICAgJCgnLnBpcC1wb3BvdmVyLWJhY2tkcm9wJykuZm9jdXMoKTtcclxuICAgICAgICBpZiAodGhpcy50aW1lb3V0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuXyR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xvc2VQb3BvdmVyKCk7XHJcbiAgICAgICAgICAgIH0sIHRoaXMudGltZW91dCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcG9zaXRpb24oKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudCkge1xyXG4gICAgICAgICAgICBsZXQgZWxlbWVudCA9ICQodGhpcy5lbGVtZW50KSxcclxuICAgICAgICAgICAgICAgIHBvcyA9IGVsZW1lbnQub2Zmc2V0KCksXHJcbiAgICAgICAgICAgICAgICB3aWR0aCA9IGVsZW1lbnQud2lkdGgoKSxcclxuICAgICAgICAgICAgICAgIGhlaWdodCA9IGVsZW1lbnQuaGVpZ2h0KCksXHJcbiAgICAgICAgICAgICAgICBkb2NXaWR0aCA9ICQoZG9jdW1lbnQpLndpZHRoKCksXHJcbiAgICAgICAgICAgICAgICBkb2NIZWlnaHQgPSAkKGRvY3VtZW50KS5oZWlnaHQoKSxcclxuICAgICAgICAgICAgICAgIHBvcG92ZXIgPSB0aGlzLmJhY2tkcm9wRWxlbWVudC5maW5kKCcucGlwLXBvcG92ZXInKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChwb3MpIHtcclxuICAgICAgICAgICAgICAgIHBvcG92ZXJcclxuICAgICAgICAgICAgICAgICAgICAuY3NzKCdtYXgtd2lkdGgnLCBkb2NXaWR0aCAtIChkb2NXaWR0aCAtIHBvcy5sZWZ0KSlcclxuICAgICAgICAgICAgICAgICAgICAuY3NzKCdtYXgtaGVpZ2h0JywgZG9jSGVpZ2h0IC0gKHBvcy50b3AgKyBoZWlnaHQpIC0gMzIsIDApXHJcbiAgICAgICAgICAgICAgICAgICAgLmNzcygnbGVmdCcsIHBvcy5sZWZ0IC0gcG9wb3Zlci53aWR0aCgpICsgd2lkdGggLyAyKVxyXG4gICAgICAgICAgICAgICAgICAgIC5jc3MoJ3RvcCcsIHBvcy50b3AgKyBoZWlnaHQgKyAxNik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvblJlc2l6ZSgpIHtcclxuICAgICAgICB0aGlzLmJhY2tkcm9wRWxlbWVudC5maW5kKCcucGlwLXBvcG92ZXInKS5maW5kKCcucGlwLWNvbnRlbnQnKS5jc3MoJ21heC1oZWlnaHQnLCAnMTAwJScpO1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24oKTtcclxuICAgICAgICB0aGlzLmNhbGNIZWlnaHQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNhbGNIZWlnaHQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY2FsY0ggPT09IGZhbHNlKSB7IHJldHVybjsgfVxyXG4gICAgICAgIGxldCBwb3BvdmVyID0gdGhpcy5iYWNrZHJvcEVsZW1lbnQuZmluZCgnLnBpcC1wb3BvdmVyJyksXHJcbiAgICAgICAgdGl0bGUgPSBwb3BvdmVyLmZpbmQoJy5waXAtdGl0bGUnKSxcclxuICAgICAgICBmb290ZXIgPSBwb3BvdmVyLmZpbmQoJy5waXAtZm9vdGVyJyksXHJcbiAgICAgICAgY29udGVudCA9IHBvcG92ZXIuZmluZCgnLnBpcC1jb250ZW50JyksXHJcbiAgICAgICAgY29udGVudEhlaWdodCA9IHBvcG92ZXIuaGVpZ2h0KCkgLSB0aXRsZS5vdXRlckhlaWdodCh0cnVlKSAtIGZvb3Rlci5vdXRlckhlaWdodCh0cnVlKTtcclxuICAgICAgICBjb250ZW50LmNzcygnbWF4LWhlaWdodCcsIE1hdGgubWF4KGNvbnRlbnRIZWlnaHQsIDApICsgJ3B4JykuY3NzKCdib3gtc2l6aW5nJywgJ2JvcmRlci1ib3gnKTtcclxuICAgIH1cclxufVxyXG5cclxuKCgpID0+IHtcclxuICAgIGZ1bmN0aW9uIHBpcFBvcG92ZXIoJHBhcnNlOiBhbnkpIHtcclxuICAgICAgICBcIm5nSW5qZWN0XCI7XHJcblxyXG4gICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgICAgICAgICAgc2NvcGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3BvcG92ZXIvcG9wb3Zlci5odG1sJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFBvcG92ZXJDb250cm9sbGVyLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nXHJcbiAgICAgICAgICAgIH07XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdwaXBQb3BvdmVyJywgWydwaXBQb3BvdmVyLlNlcnZpY2UnXSlcclxuICAgICAgICAuZGlyZWN0aXZlKCdwaXBQb3BvdmVyJywgcGlwUG9wb3Zlcik7XHJcblxyXG5cclxufSkoKTtcclxuXHJcblxyXG5cclxuLypcclxuKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgdGhpc01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBQb3BvdmVyJywgWydwaXBQb3BvdmVyLlNlcnZpY2UnXSk7XHJcblxyXG4gICAgdGhpc01vZHVsZS5kaXJlY3RpdmUoJ3BpcFBvcG92ZXInLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgICAgIHNjb3BlOiB0cnVlLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3BvcG92ZXIvcG9wb3Zlci5odG1sJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24gKCRzY29wZSwgJHJvb3RTY29wZSwgJGVsZW1lbnQsICR0aW1lb3V0LCAkY29tcGlsZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGJhY2tkcm9wRWxlbWVudCwgY29udGVudDtcclxuXHJcbiAgICAgICAgICAgICAgICBiYWNrZHJvcEVsZW1lbnQgPSAkKCcucGlwLXBvcG92ZXItYmFja2Ryb3AnKTtcclxuICAgICAgICAgICAgICAgIGJhY2tkcm9wRWxlbWVudC5vbignY2xpY2sga2V5ZG93biBzY3JvbGwnLCBiYWNrZHJvcENsaWNrKTtcclxuICAgICAgICAgICAgICAgIGJhY2tkcm9wRWxlbWVudC5hZGRDbGFzcygkc2NvcGUucGFyYW1zLnJlc3BvbnNpdmUgIT09IGZhbHNlID8gJ3BpcC1yZXNwb25zaXZlJyA6ICcnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb24oKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoJHNjb3BlLnBhcmFtcy50ZW1wbGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50ID0gJGNvbXBpbGUoJHNjb3BlLnBhcmFtcy50ZW1wbGF0ZSkoJHNjb3BlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGVsZW1lbnQuZmluZCgnLnBpcC1wb3BvdmVyJykuYXBwZW5kKGNvbnRlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaW5pdCgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGNIZWlnaHQoKTtcclxuICAgICAgICAgICAgICAgIH0sIDIwMCk7XHJcblxyXG4gICAgICAgICAgICAgICAgJHNjb3BlLm9uUG9wb3ZlckNsaWNrID0gb25Qb3BvdmVyQ2xpY2s7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUgPSBfLmRlZmF1bHRzKCRzY29wZSwgJHNjb3BlLiRwYXJlbnQpOyAgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIFxyXG5cclxuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJG9uKCdwaXBQb3BvdmVyUmVzaXplJywgb25SZXNpemUpO1xyXG4gICAgICAgICAgICAgICAgJCh3aW5kb3cpLnJlc2l6ZShvblJlc2l6ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgICAgICAgICAgICAgICAgICBiYWNrZHJvcEVsZW1lbnQuYWRkQ2xhc3MoJ29wZW5lZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5waXAtcG9wb3Zlci1iYWNrZHJvcCcpLmZvY3VzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCRzY29wZS5wYXJhbXMudGltZW91dCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbG9zZVBvcG92ZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgJHNjb3BlLnBhcmFtcy50aW1lb3V0KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gYmFja2Ryb3BDbGljaygpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoJHNjb3BlLnBhcmFtcy5jYW5jZWxDYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUucGFyYW1zLmNhbmNlbENhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBjbG9zZVBvcG92ZXIoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBjbG9zZVBvcG92ZXIoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmFja2Ryb3BFbGVtZW50LnJlbW92ZUNsYXNzKCdvcGVuZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tkcm9wRWxlbWVudC5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9LCAxMDApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIG9uUG9wb3ZlckNsaWNrKCRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gcG9zaXRpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCRzY29wZS5wYXJhbXMuZWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZWxlbWVudCA9ICQoJHNjb3BlLnBhcmFtcy5lbGVtZW50KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvcyA9IGVsZW1lbnQub2Zmc2V0KCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aCA9IGVsZW1lbnQud2lkdGgoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodCA9IGVsZW1lbnQuaGVpZ2h0KCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2NXaWR0aCA9ICQoZG9jdW1lbnQpLndpZHRoKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2NIZWlnaHQgPSAkKGRvY3VtZW50KS5oZWlnaHQoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvcG92ZXIgPSBiYWNrZHJvcEVsZW1lbnQuZmluZCgnLnBpcC1wb3BvdmVyJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocG9zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3BvdmVyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNzcygnbWF4LXdpZHRoJywgZG9jV2lkdGggLSAoZG9jV2lkdGggLSBwb3MubGVmdCkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNzcygnbWF4LWhlaWdodCcsIGRvY0hlaWdodCAtIChwb3MudG9wICsgaGVpZ2h0KSAtIDMyLCAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jc3MoJ2xlZnQnLCBwb3MubGVmdCAtIHBvcG92ZXIud2lkdGgoKSArIHdpZHRoIC8gMilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY3NzKCd0b3AnLCBwb3MudG9wICsgaGVpZ2h0ICsgMTYpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGNhbGNIZWlnaHQoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCRzY29wZS5wYXJhbXMuY2FsY0hlaWdodCA9PT0gZmFsc2UpIHsgcmV0dXJuOyB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBwb3BvdmVyID0gYmFja2Ryb3BFbGVtZW50LmZpbmQoJy5waXAtcG9wb3ZlcicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZSA9IHBvcG92ZXIuZmluZCgnLnBpcC10aXRsZScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb290ZXIgPSBwb3BvdmVyLmZpbmQoJy5waXAtZm9vdGVyJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQgPSBwb3BvdmVyLmZpbmQoJy5waXAtY29udGVudCcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50SGVpZ2h0ID0gcG9wb3Zlci5oZWlnaHQoKSAtIHRpdGxlLm91dGVySGVpZ2h0KHRydWUpIC0gZm9vdGVyLm91dGVySGVpZ2h0KHRydWUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50LmNzcygnbWF4LWhlaWdodCcsIE1hdGgubWF4KGNvbnRlbnRIZWlnaHQsIDApICsgJ3B4JykuY3NzKCdib3gtc2l6aW5nJywgJ2JvcmRlci1ib3gnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBvblJlc2l6ZSgpIHtcclxuICAgICAgICAgICAgICAgICAgICBiYWNrZHJvcEVsZW1lbnQuZmluZCgnLnBpcC1wb3BvdmVyJykuZmluZCgnLnBpcC1jb250ZW50JykuY3NzKCdtYXgtaGVpZ2h0JywgJzEwMCUnKTtcclxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGNIZWlnaHQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9KTtcclxuXHJcbn0pKCk7Ki9cclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxyXG5cclxuZXhwb3J0IGNsYXNzIFBvcG92ZXJTZXJ2aWNlIHtcclxuICBcclxuICAgIHByaXZhdGUgXyR0aW1lb3V0O1xyXG4gICAgcHJpdmF0ZSBfJHNjb3BlOiBuZy5JU2NvcGU7XHJcbiAgICBwcml2YXRlIF8kY29tcGlsZTtcclxuICAgIHByaXZhdGUgXyRyb290U2NvcGU6IG5nLklSb290U2NvcGVTZXJ2aWNlO1xyXG5cclxuICAgIHB1YmxpYyBwb3BvdmVyVGVtcGxhdGU6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3RvciggXHJcbiAgICAgICAgJGNvbXBpbGUsXHJcbiAgICAgICAgJHJvb3RTY29wZSwgXHJcbiAgICAgICAgJHRpbWVvdXRcclxuICAgICAgICkge1xyXG4gICAgICAgICAgIHRoaXMuXyRjb21waWxlID0gJGNvbXBpbGU7XHJcbiAgICAgICAgICAgdGhpcy5fJHJvb3RTY29wZSA9ICRyb290U2NvcGU7XHJcbiAgICAgICAgICAgdGhpcy5fJHRpbWVvdXQgPSAkdGltZW91dDtcclxuICAgICAgICAgICB0aGlzLnBvcG92ZXJUZW1wbGF0ZSA9IFwiPGRpdiBjbGFzcz0ncGlwLXBvcG92ZXItYmFja2Ryb3Age3sgcGFyYW1zLmNsYXNzIH19JyBuZy1jb250cm9sbGVyPSdwYXJhbXMuY29udHJvbGxlcidcIiArXHJcbiAgICAgICAgICAgICAgICBcIiB0YWJpbmRleD0nMSc+IDxwaXAtcG9wb3ZlciBwaXAtcGFyYW1zPSdwYXJhbXMnPiA8L3BpcC1wb3BvdmVyPiA8L2Rpdj5cIjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2hvdyhwKSB7XHJcbiAgICAgICAgbGV0IGVsZW1lbnQsIHNjb3BlOiBuZy5JU2NvcGUsIHBhcmFtcywgY29udGVudDtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgZWxlbWVudCA9ICQoJ2JvZHknKTtcclxuICAgICAgICBpZiAoZWxlbWVudC5maW5kKCdtZC1iYWNrZHJvcCcpLmxlbmd0aCA+IDApIHsgcmV0dXJuOyB9XHJcbiAgICAgICAgdGhpcy5oaWRlKCk7XHJcbiAgICAgICAgc2NvcGUgPSB0aGlzLl8kcm9vdFNjb3BlLiRuZXcoKTtcclxuICAgICAgICBwYXJhbXMgPSBwICYmIF8uaXNPYmplY3QocCkgPyBwIDoge307XHJcbiAgICAgICAgc2NvcGVbJ3BhcmFtcyddID0gcGFyYW1zO1xyXG4gICAgICAgIHNjb3BlWydsb2NhbHMnXSA9IHBhcmFtcy5sb2NhbHM7XHJcbiAgICAgICAgY29udGVudCA9IHRoaXMuXyRjb21waWxlKHRoaXMucG9wb3ZlclRlbXBsYXRlKShzY29wZSk7XHJcbiAgICAgICAgZWxlbWVudC5hcHBlbmQoY29udGVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGhpZGUoKSB7XHJcbiAgICAgICAgbGV0IGJhY2tkcm9wRWxlbWVudCA9ICQoJy5waXAtcG9wb3Zlci1iYWNrZHJvcCcpO1xyXG4gICAgICAgIGJhY2tkcm9wRWxlbWVudC5yZW1vdmVDbGFzcygnb3BlbmVkJyk7XHJcbiAgICAgICAgdGhpcy5fJHRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICBiYWNrZHJvcEVsZW1lbnQucmVtb3ZlKCk7XHJcbiAgICAgICAgfSwgMTAwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVzaXplKCkge1xyXG4gICAgICAgIHRoaXMuXyRyb290U2NvcGUuJGJyb2FkY2FzdCgncGlwUG9wb3ZlclJlc2l6ZScpO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuKCgpID0+IHtcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdwaXBQb3BvdmVyLlNlcnZpY2UnLCBbXSlcclxuICAgICAgICAuc2VydmljZSgncGlwUG9wb3ZlclNlcnZpY2UnLCBQb3BvdmVyU2VydmljZSk7XHJcbn0pKCk7IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxyXG5cclxuY2xhc3MgUm91dGluZ0NvbnRyb2xsZXIge1xyXG4gICAgcHJpdmF0ZSBfaW1hZ2U6IGFueTtcclxuXHJcbiAgICBwdWJsaWMgbG9nb1VybDogc3RyaW5nO1xyXG4gICAgcHVibGljIHNob3dQcm9ncmVzczogRnVuY3Rpb247XHJcblxyXG4gICAgY29uc3RydWN0b3IoIFxyXG4gICAgICAgICRzY29wZTogbmcuSVNjb3BlLFxyXG4gICAgICAgICRlbGVtZW50KVxyXG4gICAge1xyXG5cclxuICAgICAgICB0aGlzLl9pbWFnZSA9ICRlbGVtZW50LmNoaWxkcmVuKCdpbWcnKTsgXHJcbiAgICAgICAgdGhpcy5zaG93UHJvZ3Jlc3MgPSAkc2NvcGVbJ3Nob3dQcm9ncmVzcyddXHJcbiAgICAgICAgdGhpcy5sb2dvVXJsID0gJHNjb3BlWydsb2dvVXJsJ107ICAgICAgICBcclxuICAgICAgICB0aGlzLmxvYWRQcm9ncmVzc0ltYWdlKCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBsb2FkUHJvZ3Jlc3NJbWFnZSgpIHtcclxuICAgICAgICBpZiAodGhpcy5sb2dvVXJsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ltYWdlLmF0dHIoJ3NyYycsIHRoaXMubG9nb1VybCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufVxyXG5cclxuXHJcbigoKSA9PiB7XHJcblxyXG4gICAgZnVuY3Rpb24gUm91dGluZ1Byb2dyZXNzKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxyXG4gICAgICAgICAgICBzY29wZToge1xyXG4gICAgICAgICAgICAgICAgICAgIHNob3dQcm9ncmVzczogJyYnLFxyXG4gICAgICAgICAgICAgICAgICAgIGxvZ29Vcmw6ICdAJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwcm9ncmVzcy9yb3V0aW5nX3Byb2dyZXNzLmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBSb3V0aW5nQ29udHJvbGxlcixcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3BpcFJvdXRpbmdQcm9ncmVzcycsIFsnbmdNYXRlcmlhbCddKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ3BpcFJvdXRpbmdQcm9ncmVzcycsIFJvdXRpbmdQcm9ncmVzcyk7XHJcblxyXG59KSgpO1xyXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vdHlwaW5ncy90c2QuZC50c1wiIC8+XHJcblxyXG5pbnRlcmZhY2UgSVBpcFRvYXN0IHtcclxuICAgIHR5cGU6IHN0cmluZztcclxuICAgIGlkOiBzdHJpbmc7XHJcbiAgICBlcnJvcjogYW55O1xyXG4gICAgbWVzc2FnZTogc3RyaW5nO1xyXG4gICAgYWN0aW9uczogc3RyaW5nW107XHJcbiAgICBkdXJhdGlvbjogbnVtYmVyO1xyXG4gICAgc3VjY2Vzc0NhbGxiYWNrOiBGdW5jdGlvbjtcclxuICAgIGNhbmNlbENhbGxiYWNrOiBGdW5jdGlvblxyXG59XHJcblxyXG5jbGFzcyBUb2FzdENvbnRyb2xsZXIge1xyXG4gICAgcHJpdmF0ZSBfJG1kVG9hc3Q6IGFuZ3VsYXIubWF0ZXJpYWwuSVRvYXN0U2VydmljZTtcclxuICAgIHByaXZhdGUgX3BpcEVycm9yRGV0YWlsc0RpYWxvZztcclxuXHJcbiAgICBwdWJsaWMgbWVzc2FnZTogc3RyaW5nO1xyXG4gICAgcHVibGljIGFjdGlvbnM6IHN0cmluZ1tdO1xyXG4gICAgcHVibGljIHRvYXN0OiBJUGlwVG9hc3Q7XHJcbiAgICBwdWJsaWMgYWN0aW9uTGVuZ2h0OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgc2hvd0RldGFpbHM6IGJvb2xlYW47XHJcblxyXG4gICAgY29uc3RydWN0b3IoIFxyXG4gICAgICAgICRtZFRvYXN0OiBhbmd1bGFyLm1hdGVyaWFsLklUb2FzdFNlcnZpY2UsIFxyXG4gICAgICAgIHRvYXN0OiBJUGlwVG9hc3QsIFxyXG4gICAgICAgICRpbmplY3RvclxyXG4gICAgICAgKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3BpcEVycm9yRGV0YWlsc0RpYWxvZyA9ICRpbmplY3Rvci5oYXMoJ3BpcEVycm9yRGV0YWlsc0RpYWxvZycpIFxyXG4gICAgICAgICAgICAgICAgPyAkaW5qZWN0b3IuZ2V0KCdwaXBFcnJvckRldGFpbHNEaWFsb2cnKSA6IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuXyRtZFRvYXN0ID0gJG1kVG9hc3Q7XHJcbiAgICAgICAgICAgIHRoaXMubWVzc2FnZSA9IHRvYXN0Lm1lc3NhZ2U7XHJcbiAgICAgICAgICAgIHRoaXMuYWN0aW9ucyA9IHRvYXN0LmFjdGlvbnM7XHJcbiAgICAgICAgICAgIHRoaXMudG9hc3QgPSB0b2FzdDtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmICh0b2FzdC5hY3Rpb25zLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hY3Rpb25MZW5naHQgPSAwO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hY3Rpb25MZW5naHQgPSB0b2FzdC5hY3Rpb25zLmxlbmd0aCA9PT0gMSA/IHRvYXN0LmFjdGlvbnNbMF0udG9TdHJpbmcoKS5sZW5ndGggOiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLnNob3dEZXRhaWxzID0gdGhpcy5fcGlwRXJyb3JEZXRhaWxzRGlhbG9nICE9IG51bGw7XHJcblxyXG4gICAgfVxyXG5cclxuICAgICBwdWJsaWMgb25EZXRhaWxzKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuXyRtZFRvYXN0LmhpZGUoKTtcclxuICAgICAgICBpZiAodGhpcy5fcGlwRXJyb3JEZXRhaWxzRGlhbG9nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3BpcEVycm9yRGV0YWlsc0RpYWxvZy5zaG93KFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBlcnJvcjogdGhpcy50b2FzdC5lcnJvcixcclxuICAgICAgICAgICAgICAgIG9rOiAnT2snXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGFuZ3VsYXIubm9vcCxcclxuICAgICAgICAgICAgYW5ndWxhci5ub29wXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkFjdGlvbihhY3Rpb24pOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl8kbWRUb2FzdC5oaWRlKFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgYWN0aW9uOiBhY3Rpb24sXHJcbiAgICAgICAgICAgIGlkOiB0aGlzLnRvYXN0LmlkLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiB0aGlzLm1lc3NhZ2VcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbmludGVyZmFjZSBJVG9hc3RTZXJ2aWNlIHtcclxuICAgIHNob3dOZXh0VG9hc3QoKTogdm9pZDtcclxuICAgIHNob3dUb2FzdCh0b2FzdDogSVBpcFRvYXN0KTogdm9pZDtcclxuICAgIGFkZFRvYXN0KHRvYXN0KTogdm9pZDtcclxuICAgIHJlbW92ZVRvYXN0cyh0eXBlOiBzdHJpbmcpOiB2b2lkO1xyXG4gICAgZ2V0VG9hc3RCeUlkKGlkOiBzdHJpbmcpOiBJUGlwVG9hc3Q7XHJcbiAgICByZW1vdmVUb2FzdHNCeUlkKGlkOiBzdHJpbmcpOiB2b2lkO1xyXG4gICAgb25DbGVhclRvYXN0cygpOiB2b2lkO1xyXG4gICAgc2hvd05vdGlmaWNhdGlvbihtZXNzYWdlOiBzdHJpbmcsIGFjdGlvbnM6IHN0cmluZ1tdLCBzdWNjZXNzQ2FsbGJhY2ssIGNhbmNlbENhbGxiYWNrLCBpZDogc3RyaW5nKTtcclxuICAgIHNob3dNZXNzYWdlKG1lc3NhZ2U6IHN0cmluZywgc3VjY2Vzc0NhbGxiYWNrLCBjYW5jZWxDYWxsYmFjaywgaWQ/OiBzdHJpbmcpO1xyXG4gICAgc2hvd0Vycm9yKG1lc3NhZ2U6IHN0cmluZywgc3VjY2Vzc0NhbGxiYWNrLCBjYW5jZWxDYWxsYmFjaywgaWQ6IHN0cmluZywgZXJyb3I6IGFueSk7XHJcbiAgICBoaWRlQWxsVG9hc3RzKCk6IHZvaWQ7XHJcbiAgICBjbGVhclRvYXN0cyh0eXBlPzogc3RyaW5nKTtcclxufVxyXG5cclxuY2xhc3MgVG9hc3RTZXJ2aWNlIGltcGxlbWVudHMgSVRvYXN0U2VydmljZSB7XHJcbiAgICBwcml2YXRlIFNIT1dfVElNRU9VVDogbnVtYmVyID0gMjAwMDA7XHJcbiAgICBwcml2YXRlIFNIT1dfVElNRU9VVF9OT1RJRklDQVRJT05TOiBudW1iZXIgPSAyMDAwMDtcclxuICAgIHByaXZhdGUgdG9hc3RzOiBJUGlwVG9hc3RbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBjdXJyZW50VG9hc3Q6IGFueTtcclxuICAgIHByaXZhdGUgc291bmRzOiBhbnkgPSB7fTtcclxuXHJcbiAgICBwcml2YXRlIF8kbWRUb2FzdDogYW5ndWxhci5tYXRlcmlhbC5JVG9hc3RTZXJ2aWNlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgICRyb290U2NvcGU6IG5nLklSb290U2NvcGVTZXJ2aWNlLCBcclxuICAgICAgICAkbWRUb2FzdDogYW5ndWxhci5tYXRlcmlhbC5JVG9hc3RTZXJ2aWNlKSB7XHJcblxyXG4gICAgICAgIHRoaXMuXyRtZFRvYXN0ID0gJG1kVG9hc3Q7XHJcblxyXG4gICAgICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdWNjZXNzJywgKCkgPT4ge3RoaXMub25TdGF0ZUNoYW5nZVN1Y2Nlc3MoKX0pO1xyXG4gICAgICAgICRyb290U2NvcGUuJG9uKCdwaXBTZXNzaW9uQ2xvc2VkJywgKCkgPT4ge3RoaXMub25DbGVhclRvYXN0cygpfSk7XHJcbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ3BpcElkZW50aXR5Q2hhbmdlZCcsICgpID0+IHt0aGlzLm9uQ2xlYXJUb2FzdHMoKX0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzaG93TmV4dFRvYXN0KCk6IHZvaWQge1xyXG4gICAgICAgIGxldCB0b2FzdDogSVBpcFRvYXN0O1xyXG5cclxuICAgICAgICBpZiAodGhpcy50b2FzdHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICB0b2FzdCA9IHRoaXMudG9hc3RzWzBdO1xyXG4gICAgICAgICAgICB0aGlzLnRvYXN0cy5zcGxpY2UoMCwgMSk7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvd1RvYXN0KHRvYXN0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgIC8vIFNob3cgdG9hc3RcclxuICAgICBwdWJsaWMgc2hvd1RvYXN0KHRvYXN0OiBJUGlwVG9hc3QpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRUb2FzdCA9IHRvYXN0O1xyXG5cclxuICAgICAgICB0aGlzLl8kbWRUb2FzdC5zaG93KHtcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0b2FzdC90b2FzdC5odG1sJyxcclxuICAgICAgICAgICAgaGlkZURlbGF5OiB0b2FzdC5kdXJhdGlvbiB8fCB0aGlzLlNIT1dfVElNRU9VVCxcclxuICAgICAgICAgICAgcG9zaXRpb246ICdib3R0b20gbGVmdCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFRvYXN0Q29udHJvbGxlcixcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gICAgICAgICAgICBsb2NhbHM6IHtcclxuICAgICAgICAgICAgICAgIHRvYXN0OiB0aGlzLmN1cnJlbnRUb2FzdCxcclxuICAgICAgICAgICAgICAgIHNvdW5kczogdGhpcy5zb3VuZHNcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnRoZW4oIFxyXG4gICAgICAgICAgICAoYWN0aW9uOiBzdHJpbmcpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hvd1RvYXN0T2tSZXN1bHQoYWN0aW9uKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgKGFjdGlvbjogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dUb2FzdENhbmNlbFJlc3VsdChhY3Rpb24pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNob3dUb2FzdENhbmNlbFJlc3VsdChhY3Rpb246IHN0cmluZyk6dm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFRvYXN0LmNhbmNlbENhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFRvYXN0LmNhbmNlbENhbGxiYWNrKGFjdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY3VycmVudFRvYXN0ID0gbnVsbDtcclxuICAgICAgICB0aGlzLnNob3dOZXh0VG9hc3QoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNob3dUb2FzdE9rUmVzdWx0KGFjdGlvbjogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFRvYXN0LnN1Y2Nlc3NDYWxsYmFjaykge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRUb2FzdC5zdWNjZXNzQ2FsbGJhY2soYWN0aW9uKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jdXJyZW50VG9hc3QgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuc2hvd05leHRUb2FzdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRUb2FzdCh0b2FzdCk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRUb2FzdCAmJiB0b2FzdC50eXBlICE9PSAnZXJyb3InKSB7XHJcbiAgICAgICAgICAgIHRoaXMudG9hc3RzLnB1c2godG9hc3QpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvd1RvYXN0KHRvYXN0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbW92ZVRvYXN0cyh0eXBlOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICBsZXQgcmVzdWx0OiBhbnlbXSA9IFtdO1xyXG4gICAgICAgIF8uZWFjaCh0aGlzLnRvYXN0cywgKHRvYXN0KSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghdG9hc3QudHlwZSB8fCB0b2FzdC50eXBlICE9PSB0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh0b2FzdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnRvYXN0cyA9IF8uY2xvbmVEZWVwKHJlc3VsdCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbW92ZVRvYXN0c0J5SWQoaWQ6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIF8ucmVtb3ZlKHRoaXMudG9hc3RzLCB7aWQ6IGlkfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFRvYXN0QnlJZChpZDogc3RyaW5nKTogSVBpcFRvYXN0IHtcclxuICAgICAgICByZXR1cm4gXy5maW5kKHRoaXMudG9hc3RzLCB7aWQ6IGlkfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uU3RhdGVDaGFuZ2VTdWNjZXNzKCkge31cclxuXHJcbiAgICBwdWJsaWMgb25DbGVhclRvYXN0cygpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmNsZWFyVG9hc3RzKG51bGwpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzaG93Tm90aWZpY2F0aW9uKG1lc3NhZ2U6IHN0cmluZywgYWN0aW9uczogc3RyaW5nW10sIHN1Y2Nlc3NDYWxsYmFjaywgY2FuY2VsQ2FsbGJhY2ssIGlkOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLmFkZFRvYXN0KHtcclxuICAgICAgICAgICAgaWQ6IGlkIHx8IG51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6ICdub3RpZmljYXRpb24nLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBtZXNzYWdlLFxyXG4gICAgICAgICAgICBhY3Rpb25zOiBhY3Rpb25zIHx8IFsnb2snXSxcclxuICAgICAgICAgICAgc3VjY2Vzc0NhbGxiYWNrOiBzdWNjZXNzQ2FsbGJhY2ssXHJcbiAgICAgICAgICAgIGNhbmNlbENhbGxiYWNrOiBjYW5jZWxDYWxsYmFjayxcclxuICAgICAgICAgICAgZHVyYXRpb246IHRoaXMuU0hPV19USU1FT1VUX05PVElGSUNBVElPTlNcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2hvd01lc3NhZ2UobWVzc2FnZTogc3RyaW5nLCBzdWNjZXNzQ2FsbGJhY2ssIGNhbmNlbENhbGxiYWNrLCBpZD86IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuYWRkVG9hc3Qoe1xyXG4gICAgICAgICAgICBpZDogaWQgfHwgbnVsbCxcclxuICAgICAgICAgICAgdHlwZTogJ21lc3NhZ2UnLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBtZXNzYWdlLFxyXG4gICAgICAgICAgICBhY3Rpb25zOiBbJ29rJ10sXHJcbiAgICAgICAgICAgIHN1Y2Nlc3NDYWxsYmFjazogc3VjY2Vzc0NhbGxiYWNrLFxyXG4gICAgICAgICAgICBjYW5jZWxDYWxsYmFjazogY2FuY2VsQ2FsbGJhY2tcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAgcHVibGljIHNob3dFcnJvcihtZXNzYWdlOiBzdHJpbmcsIHN1Y2Nlc3NDYWxsYmFjaywgY2FuY2VsQ2FsbGJhY2ssIGlkOiBzdHJpbmcsIGVycm9yOiBhbnkpIHtcclxuICAgICAgICB0aGlzLmFkZFRvYXN0KHtcclxuICAgICAgICAgICAgaWQ6IGlkIHx8IG51bGwsXHJcbiAgICAgICAgICAgIGVycm9yOiBlcnJvcixcclxuICAgICAgICAgICAgdHlwZTogJ2Vycm9yJyxcclxuICAgICAgICAgICAgbWVzc2FnZTogbWVzc2FnZSB8fCAnVW5rbm93biBlcnJvci4nLFxyXG4gICAgICAgICAgICBhY3Rpb25zOiBbJ29rJ10sXHJcbiAgICAgICAgICAgIHN1Y2Nlc3NDYWxsYmFjazogc3VjY2Vzc0NhbGxiYWNrLFxyXG4gICAgICAgICAgICBjYW5jZWxDYWxsYmFjazogY2FuY2VsQ2FsbGJhY2tcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaGlkZUFsbFRvYXN0cygpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl8kbWRUb2FzdC5jYW5jZWwoKTtcclxuICAgICAgICB0aGlzLnRvYXN0cyA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjbGVhclRvYXN0cyh0eXBlPzogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKHR5cGUpIHtcclxuICAgICAgICAgICAgLy8gcGlwQXNzZXJ0LmlzU3RyaW5nKHR5cGUsICdwaXBUb2FzdHMuY2xlYXJUb2FzdHM6IHR5cGUgc2hvdWxkIGJlIGEgc3RyaW5nJyk7XHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlVG9hc3RzKHR5cGUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuXyRtZFRvYXN0LmNhbmNlbCgpO1xyXG4gICAgICAgICAgICB0aGlzLnRvYXN0cyA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn1cclxuXHJcblxyXG4oKCkgPT4ge1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3BpcFRvYXN0cycsIFsnbmdNYXRlcmlhbCcsICdwaXBDb250cm9scy5UcmFuc2xhdGUnXSlcclxuICAgICAgICAuc2VydmljZSgncGlwVG9hc3RzJywgVG9hc3RTZXJ2aWNlKTtcclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKG1vZHVsZSkge1xudHJ5IHtcbiAgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcENvbnRyb2xzLlRlbXBsYXRlcycpO1xufSBjYXRjaCAoZSkge1xuICBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgncGlwQ29udHJvbHMuVGVtcGxhdGVzJywgW10pO1xufVxubW9kdWxlLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCdjb2xvcl9waWNrZXIvY29sb3JfcGlja2VyLmh0bWwnLFxuICAgICc8dWwgY2xhc3M9XCJwaXAtY29sb3ItcGlja2VyIHt7dm0uY2xhc3N9fVwiIHBpcC1zZWxlY3RlZD1cInZtLmN1cnJlbnRDb2xvckluZGV4XCIgcGlwLWVudGVyLXNwYWNlLXByZXNzPVwidm0uZW50ZXJTcGFjZVByZXNzKCRldmVudClcIj48bGkgdGFiaW5kZXg9XCItMVwiIG5nLXJlcGVhdD1cImNvbG9yIGluIHZtLmNvbG9ycyB0cmFjayBieSBjb2xvclwiPjxtZC1idXR0b24gdGFiaW5kZXg9XCItMVwiIGNsYXNzPVwibWQtaWNvbi1idXR0b24gcGlwLXNlbGVjdGFibGVcIiBuZy1jbGljaz1cInZtLnNlbGVjdENvbG9yKCRpbmRleClcIiBhcmlhLWxhYmVsPVwiY29sb3JcIiBuZy1kaXNhYmxlZD1cInZtLmRpc2FibGVkKClcIj48bWQtaWNvbiBuZy1zdHlsZT1cIntcXCdjb2xvclxcJzogY29sb3J9XCIgbWQtc3ZnLWljb249XCJpY29uczp7eyBjb2xvciA9PSB2bS5jdXJyZW50Q29sb3IgPyBcXCdjaXJjbGVcXCcgOiBcXCdyYWRpby1vZmZcXCcgfX1cIj48L21kLWljb24+PC9tZC1idXR0b24+PC9saT48L3VsPicpO1xufV0pO1xufSkoKTtcblxuKGZ1bmN0aW9uKG1vZHVsZSkge1xudHJ5IHtcbiAgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcENvbnRyb2xzLlRlbXBsYXRlcycpO1xufSBjYXRjaCAoZSkge1xuICBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgncGlwQ29udHJvbHMuVGVtcGxhdGVzJywgW10pO1xufVxubW9kdWxlLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCdwb3BvdmVyL3BvcG92ZXIuaHRtbCcsXG4gICAgJzxkaXYgbmctaWY9XCJ2bS50ZW1wbGF0ZVVybFwiIGNsYXNzPVwicGlwLXBvcG92ZXIgZmxleCBsYXlvdXQtY29sdW1uXCIgbmctY2xpY2s9XCJ2bS5vblBvcG92ZXJDbGljaygkZXZlbnQpXCIgbmctaW5jbHVkZT1cInZtLnRlbXBsYXRlVXJsXCI+PC9kaXY+PGRpdiBuZy1pZj1cInZtLnRlbXBsYXRlXCIgY2xhc3M9XCJwaXAtcG9wb3ZlclwiIG5nLWNsaWNrPVwidm0ub25Qb3BvdmVyQ2xpY2soJGV2ZW50KVwiPjwvZGl2PicpO1xufV0pO1xufSkoKTtcblxuKGZ1bmN0aW9uKG1vZHVsZSkge1xudHJ5IHtcbiAgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcENvbnRyb2xzLlRlbXBsYXRlcycpO1xufSBjYXRjaCAoZSkge1xuICBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgncGlwQ29udHJvbHMuVGVtcGxhdGVzJywgW10pO1xufVxubW9kdWxlLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCdwcm9ncmVzcy9yb3V0aW5nX3Byb2dyZXNzLmh0bWwnLFxuICAgICc8ZGl2IGNsYXNzPVwicGlwLXJvdXRpbmctcHJvZ3Jlc3MgbGF5b3V0LWNvbHVtbiBsYXlvdXQtYWxpZ24tY2VudGVyLWNlbnRlclwiIG5nLXNob3c9XCJ2bS5zaG93UHJvZ3Jlc3MoKVwiPjxkaXYgY2xhc3M9XCJsb2FkZXJcIj48c3ZnIGNsYXNzPVwiY2lyY3VsYXJcIiB2aWV3Ym94PVwiMjUgMjUgNTAgNTBcIj48Y2lyY2xlIGNsYXNzPVwicGF0aFwiIGN4PVwiNTBcIiBjeT1cIjUwXCIgcj1cIjIwXCIgZmlsbD1cIm5vbmVcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLW1pdGVybGltaXQ9XCIxMFwiPjwvY2lyY2xlPjwvc3ZnPjwvZGl2PjxpbWcgc3JjPVwiXCIgaGVpZ2h0PVwiNDBcIiB3aWR0aD1cIjQwXCIgY2xhc3M9XCJwaXAtaW1nXCI+PG1kLXByb2dyZXNzLWNpcmN1bGFyIG1kLWRpYW1ldGVyPVwiOTZcIiBjbGFzcz1cImZpeC1pZVwiPjwvbWQtcHJvZ3Jlc3MtY2lyY3VsYXI+PC9kaXY+Jyk7XG59XSk7XG59KSgpO1xuXG4oZnVuY3Rpb24obW9kdWxlKSB7XG50cnkge1xuICBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgncGlwQ29udHJvbHMuVGVtcGxhdGVzJyk7XG59IGNhdGNoIChlKSB7XG4gIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBDb250cm9scy5UZW1wbGF0ZXMnLCBbXSk7XG59XG5tb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoJ3RvYXN0L3RvYXN0Lmh0bWwnLFxuICAgICc8bWQtdG9hc3QgY2xhc3M9XCJtZC1hY3Rpb24gcGlwLXRvYXN0XCIgbmctY2xhc3M9XCJ7XFwncGlwLWVycm9yXFwnOiB2bS50b2FzdC50eXBlPT1cXCdlcnJvclxcJywgXFwncGlwLWNvbHVtbi10b2FzdFxcJzogdm0udG9hc3QuYWN0aW9ucy5sZW5ndGggPiAxIHx8IHZtLmFjdGlvbkxlbmdodCA+IDQsIFxcJ3BpcC1uby1hY3Rpb24tdG9hc3RcXCc6IHZtLmFjdGlvbkxlbmdodCA9PSAwfVwiIHN0eWxlPVwiaGVpZ2h0OmluaXRpYWw7IG1heC1oZWlnaHQ6IGluaXRpYWw7XCI+PHNwYW4gY2xhc3M9XCJmbGV4LXZhciBwaXAtdGV4dFwiIG5nLWJpbmQtaHRtbD1cInZtLm1lc3NhZ2VcIj48L3NwYW4+PGRpdiBjbGFzcz1cImxheW91dC1yb3cgbGF5b3V0LWFsaWduLWVuZC1zdGFydCBwaXAtYWN0aW9uc1wiIG5nLWlmPVwidm0uYWN0aW9ucy5sZW5ndGggPiAwIHx8ICh2bS50b2FzdC50eXBlPT1cXCdlcnJvclxcJyAmJiB2bS50b2FzdC5lcnJvcilcIj48ZGl2IGNsYXNzPVwiZmxleFwiIG5nLWlmPVwidm0udG9hc3QuYWN0aW9ucy5sZW5ndGggPiAxXCI+PC9kaXY+PG1kLWJ1dHRvbiBjbGFzcz1cImZsZXgtZml4ZWQgcGlwLXRvYXN0LWJ1dHRvblwiIG5nLWlmPVwidm0udG9hc3QudHlwZT09XFwnZXJyb3JcXCcgJiYgdm0udG9hc3QuZXJyb3IgJiYgdm0uc2hvd0RldGFpbHNcIiBuZy1jbGljaz1cInZtLm9uRGV0YWlscygpXCI+RGV0YWlsczwvbWQtYnV0dG9uPjxtZC1idXR0b24gY2xhc3M9XCJmbGV4LWZpeGVkIHBpcC10b2FzdC1idXR0b25cIiBuZy1jbGljaz1cInZtLm9uQWN0aW9uKGFjdGlvbilcIiBuZy1yZXBlYXQ9XCJhY3Rpb24gaW4gdm0uYWN0aW9uc1wiIGFyaWEtbGFiZWw9XCJ7ezo6YWN0aW9ufCB0cmFuc2xhdGV9fVwiPnt7OjphY3Rpb258IHRyYW5zbGF0ZX19PC9tZC1idXR0b24+PC9kaXY+PC9tZC10b2FzdD4nKTtcbn1dKTtcbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBpcC13ZWJ1aS1jb250cm9scy1odG1sLm1pbi5qcy5tYXBcbiJdfQ==