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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29sb3JfcGlja2VyL2NvbG9yX3BpY2tlci50cyIsInNyYy9jb250cm9scy50cyIsInNyYy9kZXBlbmRlbmNpZXMvdHJhbnNsYXRlLnRzIiwic3JjL2ltYWdlX3NsaWRlci9pbWFnZV9zbGlkZXIudHMiLCJzcmMvaW1hZ2Vfc2xpZGVyL2ltYWdlX3NsaWRlcl9zZXJ2aWNlLnRzIiwic3JjL2ltYWdlX3NsaWRlci9zbGlkZXJfYnV0dG9uLnRzIiwic3JjL2ltYWdlX3NsaWRlci9zbGlkZXJfaW5kaWNhdG9yLnRzIiwic3JjL21hcmtkb3duL21hcmtkb3duLnRzIiwic3JjL3BvcG92ZXIvcG9wb3Zlci50cyIsInNyYy9wb3BvdmVyL3BvcG92ZXJfc2VydmljZS50cyIsInNyYy9wcm9ncmVzcy9yb3V0aW5nX3Byb2dyZXNzLnRzIiwic3JjL3RvYXN0L3RvYXN0cy50cyIsInRlbXAvcGlwLXdlYnVpLWNvbnRyb2xzLWh0bWwubWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ2FBO0lBWUksK0JBQ0ksTUFBaUIsRUFDakIsUUFBUSxFQUNSLE1BQU0sRUFDTixRQUFRO1FBQ0osSUFBSSxjQUFjLEdBQUcsQ0FBQyxRQUFRLEVBQUUsWUFBWSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUM1RixJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztRQUMxQixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUV0QixJQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsSUFB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QUFXLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFDNUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQzs7QUNyUEw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJleHBvcnQgaW50ZXJmYWNlIElDb2xvclBpY2tlciB7XHJcbiAgICBjbGFzczogc3RyaW5nO1xyXG4gICAgY29sb3JzOiBzdHJpbmdbXTtcclxuICAgIGN1cnJlbnRDb2xvcjogc3RyaW5nO1xyXG4gICAgY3VycmVudENvbG9ySW5kZXg6IG51bWJlcjtcclxuICAgIG5nRGlzYWJsZWQ6IEZ1bmN0aW9uO1xyXG4gICAgY29sb3JDaGFuZ2U6IEZ1bmN0aW9uO1xyXG5cclxuICAgIGVudGVyU3BhY2VQcmVzcyhldmVudCk6IHZvaWQ7XHJcbiAgICBkaXNhYmxlZCgpOiBib29sZWFuO1xyXG4gICAgc2VsZWN0Q29sb3IoaW5kZXg6IG51bWJlcik7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDb2xvclBpY2tlckNvbnRyb2xsZXIgaW1wbGVtZW50cyBJQ29sb3JQaWNrZXIge1xyXG4gIFxyXG4gICAgcHJpdmF0ZSBfJHRpbWVvdXQ7XHJcbiAgICBwcml2YXRlIF8kc2NvcGU6IG5nLklTY29wZTtcclxuXHJcbiAgICBwdWJsaWMgY2xhc3M6IHN0cmluZztcclxuICAgIHB1YmxpYyBjb2xvcnM6IHN0cmluZ1tdO1xyXG4gICAgcHVibGljIGN1cnJlbnRDb2xvcjogc3RyaW5nO1xyXG4gICAgcHVibGljIGN1cnJlbnRDb2xvckluZGV4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgbmdEaXNhYmxlZDogRnVuY3Rpb247XHJcbiAgICBwdWJsaWMgY29sb3JDaGFuZ2U6IEZ1bmN0aW9uO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCBcclxuICAgICAgICAkc2NvcGU6IG5nLklTY29wZSwgXHJcbiAgICAgICAgJGVsZW1lbnQsXHJcbiAgICAgICAgJGF0dHJzLCBcclxuICAgICAgICAkdGltZW91dCApIHtcclxuICAgICAgICAgICAgbGV0IERFRkFVTFRfQ09MT1JTID0gWydwdXJwbGUnLCAnbGlnaHRncmVlbicsICdncmVlbicsICdkYXJrcmVkJywgJ3BpbmsnLCAneWVsbG93JywgJ2N5YW4nXTtcclxuICAgICAgICAgICAgdGhpcy5fJHRpbWVvdXQgPSAkdGltZW91dDtcclxuICAgICAgICAgICAgdGhpcy5fJHNjb3BlID0gJHNjb3BlO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jbGFzcyA9ICRhdHRycy5jbGFzcyB8fCAnJztcclxuICAgICAgICAgICAgdGhpcy5jb2xvcnMgPSAhJHNjb3BlWydjb2xvcnMnXSB8fCBfLmlzQXJyYXkoJHNjb3BlWydjb2xvcnMnXSkgJiYgJHNjb3BlWydjb2xvcnMnXS5sZW5ndGggPT09IDAgPyBERUZBVUxUX0NPTE9SUyA6ICRzY29wZVsnY29sb3JzJ107XHJcbiAgICAgICAgICAgIHRoaXMuY29sb3JDaGFuZ2UgPSAkc2NvcGVbJ2NvbG9yQ2hhbmdlJ10gfHwgbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50Q29sb3IgPSAkc2NvcGVbJ2N1cnJlbnRDb2xvciddIHx8IHRoaXMuY29sb3JzWzBdO1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRDb2xvckluZGV4ID0gdGhpcy5jb2xvcnMuaW5kZXhPZih0aGlzLmN1cnJlbnRDb2xvcik7XHJcbiAgICAgICAgICAgIHRoaXMubmdEaXNhYmxlZCA9ICRzY29wZVsnbmdEaXNhYmxlZCddO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGlzYWJsZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHRoaXMubmdEaXNhYmxlZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5uZ0Rpc2FibGVkKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH07XHJcblxyXG4gICAgIHB1YmxpYyBzZWxlY3RDb2xvcihpbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQoKSkgeyByZXR1cm47IH1cclxuICAgICAgICB0aGlzLmN1cnJlbnRDb2xvckluZGV4ID0gaW5kZXg7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50Q29sb3IgPSB0aGlzLmNvbG9yc1t0aGlzLmN1cnJlbnRDb2xvckluZGV4XTtcclxuICAgICAgICB0aGlzLl8kdGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuXyRzY29wZS4kYXBwbHkoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY29sb3JDaGFuZ2UpIHtcclxuICAgICAgICAgICAgdGhpcy5jb2xvckNoYW5nZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHVibGljIGVudGVyU3BhY2VQcmVzcyhldmVudCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuc2VsZWN0Q29sb3IoZXZlbnQuaW5kZXgpO1xyXG4gICAgfTtcclxuXHJcbn1cclxuXHJcbigoKSA9PiB7XHJcbiAgICBmdW5jdGlvbiBwaXBDb2xvclBpY2tlcigkcGFyc2U6IGFueSkge1xyXG4gICAgICAgIFwibmdJbmplY3RcIjtcclxuXHJcbiAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgICAgICAgICBzY29wZToge1xyXG4gICAgICAgICAgICAgICAgICAgIG5nRGlzYWJsZWQ6ICcmJyxcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcnM6ICc9cGlwQ29sb3JzJyxcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50Q29sb3I6ICc9bmdNb2RlbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3JDaGFuZ2U6ICcmbmdDaGFuZ2UnXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb2xvcl9waWNrZXIvY29sb3JfcGlja2VyLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogQ29sb3JQaWNrZXJDb250cm9sbGVyLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nXHJcbiAgICAgICAgICAgIH07XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdwaXBDb2xvclBpY2tlcicsIFsncGlwQ29udHJvbHMuVGVtcGxhdGVzJ10pXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgncGlwQ29sb3JQaWNrZXInLCBwaXBDb2xvclBpY2tlcik7XHJcblxyXG5cclxufSkoKTtcclxuXHJcblxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vdHlwaW5ncy90c2QuZC50c1wiIC8+XHJcbi8qXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIHRoaXNNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgncGlwQ29sb3JQaWNrZXInLCBbICdwaXBDb250cm9scy5UZW1wbGF0ZXMnXSk7IC8vICdwaXBGb2N1c2VkJyxcclxuXHJcbiAgICB0aGlzTW9kdWxlLmRpcmVjdGl2ZSgncGlwQ29sb3JQaWNrZXInLFxyXG4gICAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgICAgICAgICAgc2NvcGU6IHtcclxuICAgICAgICAgICAgICAgICAgICBuZ0Rpc2FibGVkOiAnJicsXHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3JzOiAnPXBpcENvbG9ycycsXHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudENvbG9yOiAnPW5nTW9kZWwnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yQ2hhbmdlOiAnJm5nQ2hhbmdlJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29sb3JfcGlja2VyL2NvbG9yX3BpY2tlci5odG1sJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdwaXBDb2xvclBpY2tlckNvbnRyb2xsZXInXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgKTtcclxuICAgIHRoaXNNb2R1bGUuY29udHJvbGxlcigncGlwQ29sb3JQaWNrZXJDb250cm9sbGVyJyxcclxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzLCAkdGltZW91dCkge1xyXG4gICAgICAgICAgICB2YXJcclxuICAgICAgICAgICAgICAgIERFRkFVTFRfQ09MT1JTID0gWydwdXJwbGUnLCAnbGlnaHRncmVlbicsICdncmVlbicsICdkYXJrcmVkJywgJ3BpbmsnLCAneWVsbG93JywgJ2N5YW4nXTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5jbGFzcyA9ICRhdHRycy5jbGFzcyB8fCAnJztcclxuXHJcbiAgICAgICAgICAgIGlmICghJHNjb3BlLmNvbG9ycyB8fCBfLmlzQXJyYXkoJHNjb3BlLmNvbG9ycykgJiYgJHNjb3BlLmNvbG9ycy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5jb2xvcnMgPSBERUZBVUxUX0NPTE9SUztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmN1cnJlbnRDb2xvciA9ICRzY29wZS5jdXJyZW50Q29sb3IgfHwgJHNjb3BlLmNvbG9yc1swXTtcclxuICAgICAgICAgICAgJHNjb3BlLmN1cnJlbnRDb2xvckluZGV4ID0gJHNjb3BlLmNvbG9ycy5pbmRleE9mKCRzY29wZS5jdXJyZW50Q29sb3IpO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmRpc2FibGVkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCRzY29wZS5uZ0Rpc2FibGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRzY29wZS5uZ0Rpc2FibGVkKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuc2VsZWN0Q29sb3IgPSBmdW5jdGlvbiAoaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgIGlmICgkc2NvcGUuZGlzYWJsZWQoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICRzY29wZS5jdXJyZW50Q29sb3JJbmRleCA9IGluZGV4O1xyXG5cclxuICAgICAgICAgICAgICAgICRzY29wZS5jdXJyZW50Q29sb3IgPSAkc2NvcGUuY29sb3JzWyRzY29wZS5jdXJyZW50Q29sb3JJbmRleF07XHJcblxyXG4gICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICgkc2NvcGUuY29sb3JDaGFuZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY29sb3JDaGFuZ2UoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5lbnRlclNwYWNlUHJlc3MgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5zZWxlY3RDb2xvcihldmVudC5pbmRleCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgKTtcclxuXHJcbn0pKCk7XHJcbiovXHJcblxyXG5cclxuLy9pbXBvcnQge0ZpbGVVcGxvYWRDb250cm9sbGVyfSBmcm9tICcuL3VwbG9hZC9GaWxlVXBsb2FkQ29udHJvbGxlcic7XHJcbi8vaW1wb3J0IHtGaWxlUHJvZ3Jlc3NDb250cm9sbGVyfSBmcm9tICcuL3Byb2dyZXNzL0ZpbGVQcm9ncmVzc0NvbnRyb2xsZXInO1xyXG4vL2ltcG9ydCB7RmlsZVVwbG9hZFNlcnZpY2V9IGZyb20gJy4vc2VydmljZS9GaWxlVXBsb2FkU2VydmljZSc7Iiwi77u/Ly8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxyXG5cclxuKCgpID0+IHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgncGlwQ29udHJvbHMnLCBbXHJcbiAgICAgICAgJ3BpcE1hcmtkb3duJyxcclxuICAgICAgICAncGlwQ29sb3JQaWNrZXInLFxyXG4gICAgICAgICdwaXBSb3V0aW5nUHJvZ3Jlc3MnLFxyXG4gICAgICAgICdwaXBQb3BvdmVyJyxcclxuICAgICAgICAncGlwSW1hZ2VTbGlkZXInLFxyXG4gICAgICAgICdwaXBUb2FzdHMnLFxyXG4gICAgICAgICdwaXBDb250cm9scy5UcmFuc2xhdGUnXHJcbiAgICBdKTtcclxuXHJcbn0pKCk7XHJcblxyXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vdHlwaW5ncy90c2QuZC50c1wiIC8+XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciB0aGlzTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcENvbnRyb2xzLlRyYW5zbGF0ZScsIFtdKTtcclxuXHJcbiAgICB0aGlzTW9kdWxlLmZpbHRlcigndHJhbnNsYXRlJywgZnVuY3Rpb24gKCRpbmplY3Rvcikge1xyXG4gICAgICAgIHZhciBwaXBUcmFuc2xhdGUgPSAkaW5qZWN0b3IuaGFzKCdwaXBUcmFuc2xhdGUnKSBcclxuICAgICAgICAgICAgPyAkaW5qZWN0b3IuZ2V0KCdwaXBUcmFuc2xhdGUnKSA6IG51bGw7XHJcblxyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwaXBUcmFuc2xhdGUgID8gcGlwVHJhbnNsYXRlLnRyYW5zbGF0ZShrZXkpIHx8IGtleSA6IGtleTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbn0pKCk7XHJcbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi90eXBpbmdzL3RzZC5kLnRzXCIgLz5cclxuLypcclxuKCgpID0+IHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgdGhpc01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBJbWFnZVNsaWRlcicsIFsncGlwU2xpZGVyQnV0dG9uJywgJ3BpcFNsaWRlckluZGljYXRvcicsICdwaXBJbWFnZVNsaWRlci5TZXJ2aWNlJ10pO1xyXG5cclxuICAgIHRoaXNNb2R1bGUuZGlyZWN0aXZlKCdwaXBJbWFnZVNsaWRlcicsXHJcbiAgICAgICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgc2NvcGU6IHtcclxuICAgICAgICAgICAgICAgICAgICBzbGlkZXJJbmRleDogJz1waXBJbWFnZUluZGV4J1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uICgkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMsICRwYXJzZSwgJHRpbWVvdXQsICRpbnRlcnZhbCwgJHBpcEltYWdlU2xpZGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGJsb2NrcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSAwLCBuZXdJbmRleCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlID0gJHBhcnNlKCRhdHRycy5waXBBbmltYXRpb25UeXBlKSgkc2NvcGUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBERUZBVUxUX0lOVEVSVkFMID0gNDUwMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJ2YWwgPSAkcGFyc2UoJGF0dHJzLnBpcEFuaW1hdGlvbkludGVydmFsKSgkc2NvcGUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aW1lUHJvbWlzZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm90dGxlZDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJGVsZW1lbnQuYWRkQ2xhc3MoJ3BpcC1pbWFnZS1zbGlkZXInKTtcclxuICAgICAgICAgICAgICAgICAgICAkZWxlbWVudC5hZGRDbGFzcygncGlwLWFuaW1hdGlvbi0nICsgdHlwZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5zd2lwZVN0YXJ0ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgLy9pZiAoJHN3aXBlKVxyXG4gICAgICAgICAgICAgICAgICAgICAvLyRzd2lwZS5iaW5kKCRlbGVtZW50LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgIC8vJ3N0YXJ0JzogZnVuY3Rpb24oY29vcmRzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgIC8vaWYgKGNvb3JkcykgJHNjb3BlLnN3aXBlU3RhcnQgPSBjb29yZHMueDtcclxuICAgICAgICAgICAgICAgICAgICAgLy9lbHNlICRzY29wZS5zd2lwZVN0YXJ0ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgLy99LFxyXG4gICAgICAgICAgICAgICAgICAgICAvLydlbmQnOiBmdW5jdGlvbihjb29yZHMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgLy92YXIgZGVsdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgIC8vaWYgKGNvb3Jkcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAvL2RlbHRhID0gJHNjb3BlLnN3aXBlU3RhcnQgLSBjb29yZHMueDtcclxuICAgICAgICAgICAgICAgICAgICAgLy9pZiAoZGVsdGEgPiAxNTApICAkc2NvcGUubmV4dEJsb2NrKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgIC8vaWYgKGRlbHRhIDwgLTE1MCkgICRzY29wZS5wcmV2QmxvY2soKTtcclxuICAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUuc3dpcGVTdGFydCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgIC8vfSBlbHNlICRzY29wZS5zd2lwZVN0YXJ0ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgLy99XHJcbiAgICAgICAgICAgICAgICAgICAgIC8vfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHNldEluZGV4KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2tzID0gJGVsZW1lbnQuZmluZCgnLnBpcC1hbmltYXRpb24tYmxvY2snKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJsb2Nrcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKGJsb2Nrc1swXSkuYWRkQ2xhc3MoJ3BpcC1zaG93Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRJbnRlcnZhbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm90dGxlZCA9IF8udGhyb3R0bGUoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkcGlwSW1hZ2VTbGlkZXIudG9CbG9jayh0eXBlLCBibG9ja3MsIGluZGV4LCBuZXdJbmRleCwgZGlyZWN0aW9uKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBuZXdJbmRleDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0SW5kZXgoKTtcclxuICAgICAgICAgICAgICAgICAgICB9LCA3MDApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubmV4dEJsb2NrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN0YXJ0SW50ZXJ2YWwoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3SW5kZXggPSBpbmRleCArIDEgPT09IGJsb2Nrcy5sZW5ndGggPyAwIDogaW5kZXggKyAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb24gPSAnbmV4dCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm90dGxlZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5wcmV2QmxvY2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3RhcnRJbnRlcnZhbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdJbmRleCA9IGluZGV4IC0gMSA8IDAgPyBibG9ja3MubGVuZ3RoIC0gMSA6IGluZGV4IC0gMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uID0gJ3ByZXYnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdHRsZWQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc2xpZGVUbyA9IGZ1bmN0aW9uIChuZXh0SW5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5leHRJbmRleCA9PT0gaW5kZXggfHwgbmV4dEluZGV4ID4gYmxvY2tzLmxlbmd0aCAtIDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdGFydEludGVydmFsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0luZGV4ID0gbmV4dEluZGV4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb24gPSBuZXh0SW5kZXggPiBpbmRleCA/ICduZXh0JyA6ICdwcmV2JztcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3R0bGVkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBpZiAoJGF0dHJzLmlkKSAkcGlwSW1hZ2VTbGlkZXIucmVnaXN0ZXJTbGlkZXIoJGF0dHJzLmlkLCAkc2NvcGUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBzZXRJbmRleCgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCRhdHRycy5waXBJbWFnZUluZGV4KSAkc2NvcGUuc2xpZGVySW5kZXggPSBpbmRleDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHN0YXJ0SW50ZXJ2YWwoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVQcm9taXNlcyA9ICRpbnRlcnZhbChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdJbmRleCA9IGluZGV4ICsgMSA9PT0gYmxvY2tzLmxlbmd0aCA/IDAgOiBpbmRleCArIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb24gPSAnbmV4dCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdHRsZWQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgaW50ZXJ2YWwgfHwgREVGQVVMVF9JTlRFUlZBTCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBzdG9wSW50ZXJ2YWwoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRpbnRlcnZhbC5jYW5jZWwodGltZVByb21pc2VzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRlbGVtZW50Lm9uKCckZGVzdHJveScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RvcEludGVydmFsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRwaXBJbWFnZVNsaWRlci5yZW1vdmVTbGlkZXIoJGF0dHJzLmlkKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gcmVzdGFydEludGVydmFsKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9wSW50ZXJ2YWwoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRJbnRlcnZhbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICApO1xyXG5cclxufSkoKTtcclxuKi9cclxuXHJcbmNsYXNzIHBpcEltYWdlU2xpZGVyQ29udHJvbGxlcntcclxuXHJcbiAgICBwcml2YXRlIF8kYXR0cnM7XHJcbiAgICBwcml2YXRlIF8kaW50ZXJ2YWw6IGFuZ3VsYXIuSUludGVydmFsU2VydmljZTtcclxuXHJcbiAgICBwcml2YXRlIF9ibG9ja3M6IGFueVtdO1xyXG4gICAgcHJpdmF0ZSBfaW5kZXg6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIF9uZXdJbmRleDogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfZGlyZWN0aW9uOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIF90eXBlOiBhbnk7XHJcbiAgICBwcml2YXRlIERFRkFVTFRfSU5URVJWQUwgPSA0NTAwO1xyXG4gICAgcHJpdmF0ZSBfaW50ZXJ2YWw7XHJcbiAgICBwcml2YXRlIF90aW1lUHJvbWlzZXM7XHJcbiAgICBwcml2YXRlIF90aHJvdHRsZWQ6IEZ1bmN0aW9uO1xyXG5cclxuICAgIHB1YmxpYyBzd2lwZVN0YXJ0OiBudW1iZXIgPSAwO1xyXG4gICAgcHVibGljIHNsaWRlckluZGV4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgc2xpZGVUbzogRnVuY3Rpb247XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgJHNjb3BlOiBuZy5JU2NvcGUsIFxyXG4gICAgICAgICRlbGVtZW50LCBcclxuICAgICAgICAkYXR0cnMsIFxyXG4gICAgICAgICRwYXJzZTogbmcuSVBhcnNlU2VydmljZSwgXHJcbiAgICAgICAgJHRpbWVvdXQ6IGFuZ3VsYXIuSVRpbWVvdXRTZXJ2aWNlLFxyXG4gICAgICAgICRpbnRlcnZhbDogYW5ndWxhci5JSW50ZXJ2YWxTZXJ2aWNlLCBcclxuICAgICAgICAkcGlwSW1hZ2VTbGlkZXIpIHtcclxuXHJcbiAgICAgICAgdGhpcy5zbGlkZXJJbmRleCA9ICRzY29wZVsnc2xpZGVySW5kZXgnXTtcclxuICAgICAgICB0aGlzLl90eXBlID0gJHNjb3BlWyd0eXBlJ10oKTtcclxuICAgICAgICB0aGlzLl9pbnRlcnZhbCA9ICRzY29wZVsnaW50ZXJ2YWwnXSgpO1xyXG4gICAgICAgIHRoaXMuXyRhdHRycyA9ICRhdHRycztcclxuICAgICAgICB0aGlzLl8kaW50ZXJ2YWwgPSAkaW50ZXJ2YWw7XHJcbiAgICAgICAgJHNjb3BlWydzbGlkZVRvJ10gPSB0aGlzLnNsaWRlVG9Qcml2YXRlO1xyXG5cclxuICAgICAgICAkZWxlbWVudC5hZGRDbGFzcygncGlwLWltYWdlLXNsaWRlcicpO1xyXG4gICAgICAgICRlbGVtZW50LmFkZENsYXNzKCdwaXAtYW5pbWF0aW9uLScgKyB0aGlzLl90eXBlKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnNldEluZGV4KCk7XHJcblxyXG4gICAgICAgICR0aW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fYmxvY2tzID0gJGVsZW1lbnQuZmluZCgnLnBpcC1hbmltYXRpb24tYmxvY2snKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2Jsb2Nrcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMuX2Jsb2Nrc1swXSkuYWRkQ2xhc3MoJ3BpcC1zaG93Jyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5zdGFydEludGVydmFsKCk7XHJcbiAgICAgICAgdGhpcy5fdGhyb3R0bGVkID0gXy50aHJvdHRsZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICRwaXBJbWFnZVNsaWRlci50b0Jsb2NrKHRoaXMuX3R5cGUsIHRoaXMuX2Jsb2NrcywgdGhpcy5faW5kZXgsIHRoaXMuX25ld0luZGV4LCB0aGlzLl9kaXJlY3Rpb24pO1xyXG4gICAgICAgICAgICB0aGlzLl9pbmRleCA9IHRoaXMuX25ld0luZGV4OztcclxuICAgICAgICAgICAgJHNjb3BlWydzZWxlY3RJbmRleCddID0gdGhpcy5faW5kZXg7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0SW5kZXgoKTtcclxuICAgICAgICB9LCA3MDApO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICgkYXR0cnMuaWQpIHsgJHBpcEltYWdlU2xpZGVyLnJlZ2lzdGVyU2xpZGVyKCRhdHRycy5pZCwgJHNjb3BlKSB9XHJcblxyXG4gICAgICAgICRlbGVtZW50Lm9uKCckZGVzdHJveScsICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5zdG9wSW50ZXJ2YWwoKTtcclxuICAgICAgICAgICAgJHBpcEltYWdlU2xpZGVyLnJlbW92ZVNsaWRlcigkYXR0cnMuaWQpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbmV4dEJsb2NrKCkge1xyXG4gICAgICAgIHRoaXMucmVzdGFydEludGVydmFsKCk7XHJcbiAgICAgICAgdGhpcy5fbmV3SW5kZXggPSB0aGlzLl9pbmRleCArIDEgPT09IHRoaXMuX2Jsb2Nrcy5sZW5ndGggPyAwIDogdGhpcy5faW5kZXggKyAxO1xyXG4gICAgICAgIHRoaXMuX2RpcmVjdGlvbiA9ICduZXh0JztcclxuICAgICAgICB0aGlzLl90aHJvdHRsZWQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcHJldkJsb2NrKCkge1xyXG4gICAgICAgIHRoaXMucmVzdGFydEludGVydmFsKCk7XHJcbiAgICAgICAgdGhpcy5fbmV3SW5kZXggPSB0aGlzLl9pbmRleCAtIDEgPCAwID8gdGhpcy5fYmxvY2tzLmxlbmd0aCAtIDEgOiB0aGlzLl9pbmRleCAtIDE7XHJcbiAgICAgICAgdGhpcy5fZGlyZWN0aW9uID0gJ3ByZXYnO1xyXG4gICAgICAgIHRoaXMuX3Rocm90dGxlZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzbGlkZVRvUHJpdmF0ZShuZXh0SW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMpO1xyXG4gICAgICAgIGlmIChuZXh0SW5kZXggPT09IHRoaXMuX2luZGV4IHx8IG5leHRJbmRleCA+IHRoaXMuX2Jsb2Nrcy5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucmVzdGFydEludGVydmFsKCk7XHJcbiAgICAgICAgdGhpcy5fbmV3SW5kZXggPSBuZXh0SW5kZXg7XHJcbiAgICAgICAgdGhpcy5fZGlyZWN0aW9uID0gbmV4dEluZGV4ID4gdGhpcy5faW5kZXggPyAnbmV4dCcgOiAncHJldic7XHJcbiAgICAgICAgdGhpcy5fdGhyb3R0bGVkKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXRJbmRleCgpIHtcclxuICAgICAgICBpZiAodGhpcy5fJGF0dHJzLnBpcEltYWdlSW5kZXgpIHRoaXMuc2xpZGVySW5kZXggPSB0aGlzLl9pbmRleDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXJ0SW50ZXJ2YWwoKSB7XHJcbiAgICAgICAgdGhpcy5fdGltZVByb21pc2VzID0gdGhpcy5fJGludGVydmFsKCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fbmV3SW5kZXggPSB0aGlzLl9pbmRleCArIDEgPT09IHRoaXMuX2Jsb2Nrcy5sZW5ndGggPyAwIDogdGhpcy5faW5kZXggKyAxO1xyXG4gICAgICAgICAgICB0aGlzLl9kaXJlY3Rpb24gPSAnbmV4dCc7XHJcbiAgICAgICAgICAgIHRoaXMuX3Rocm90dGxlZCgpO1xyXG4gICAgICAgIH0sIHRoaXMuX2ludGVydmFsIHx8IHRoaXMuREVGQVVMVF9JTlRFUlZBTCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdG9wSW50ZXJ2YWwoKSB7XHJcbiAgICAgICAgdGhpcy5fJGludGVydmFsLmNhbmNlbCh0aGlzLl90aW1lUHJvbWlzZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVzdGFydEludGVydmFsKCkge1xyXG4gICAgICAgIHRoaXMuc3RvcEludGVydmFsKCk7XHJcbiAgICAgICAgdGhpcy5zdGFydEludGVydmFsKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbigoKSA9PiB7XHJcblxyXG4gICAgZnVuY3Rpb24gcGlwSW1hZ2VTbGlkZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgc2NvcGU6IHtcclxuICAgICAgICAgICAgICAgIHNsaWRlckluZGV4OiAnPXBpcEltYWdlSW5kZXgnLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogJyZwaXBBbmltYXRpb25UeXBlJyxcclxuICAgICAgICAgICAgICAgIGludGVydmFsOiAnJnBpcEFuaW1hdGlvbkludGVydmFsJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBwaXBJbWFnZVNsaWRlckNvbnRyb2xsZXIsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJ1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdwaXBJbWFnZVNsaWRlcicsIFsncGlwU2xpZGVyQnV0dG9uJywgJ3BpcFNsaWRlckluZGljYXRvcicsICdwaXBJbWFnZVNsaWRlci5TZXJ2aWNlJ10pXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgncGlwSW1hZ2VTbGlkZXInLCBwaXBJbWFnZVNsaWRlcik7XHJcblxyXG59KSgpO1xyXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vdHlwaW5ncy90c2QuZC50c1wiIC8+XHJcblxyXG5pbnRlcmZhY2UgSUltYWdlU2xpZGVyU2VydmljZSB7XHJcbiAgICByZWdpc3RlclNsaWRlcihzbGlkZXJJZDogc3RyaW5nLCBzbGlkZXJTY29wZSk6IHZvaWQ7XHJcbiAgICByZW1vdmVTbGlkZXIoc2xpZGVySWQ6IHN0cmluZyk6IHZvaWQ7XHJcbiAgICBnZXRTbGlkZXJTY29wZShzbGlkZXJJZDogc3RyaW5nKTtcclxuICAgIG5leHRDYXJvdXNlbChuZXh0QmxvY2ssIHByZXZCbG9jayk6IHZvaWQ7XHJcbiAgICBwcmV2Q2Fyb3VzZWwobmV4dEJsb2NrLCBwcmV2QmxvY2spOiB2b2lkO1xyXG4gICAgdG9CbG9jayh0eXBlOiBzdHJpbmcsIGJsb2NrczogYW55W10sIG9sZEluZGV4OiBudW1iZXIsIG5leHRJbmRleDogbnVtYmVyLCBkaXJlY3Rpb246IHN0cmluZyk6IHZvaWQ7XHJcbn1cclxuXHJcbmNsYXNzIEltYWdlU2xpZGVyU2VydmljZSB7XHJcbiAgICBwcml2YXRlIF8kdGltZW91dDogYW5ndWxhci5JVGltZW91dFNlcnZpY2U7XHJcbiAgICBwcml2YXRlIEFOSU1BVElPTl9EVVJBVElPTjogbnVtYmVyID0gNTUwO1xyXG4gICAgcHJpdmF0ZSBfc2xpZGVycyA9IHt9O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCR0aW1lb3V0OiBhbmd1bGFyLklUaW1lb3V0U2VydmljZSkge1xyXG4gICAgICAgIHRoaXMuXyR0aW1lb3V0ID0gJHRpbWVvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlZ2lzdGVyU2xpZGVyKHNsaWRlcklkOiBzdHJpbmcsIHNsaWRlclNjb3BlKTogdm9pZCB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ3JlZycsIHNsaWRlclNjb3BlKTtcclxuICAgICAgICB0aGlzLl9zbGlkZXJzW3NsaWRlcklkXSA9IHNsaWRlclNjb3BlO1xyXG4gICAgfVxyXG4gICAgICAgICAgICBcclxuICAgIHB1YmxpYyByZW1vdmVTbGlkZXIoc2xpZGVySWQ6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9zbGlkZXJzW3NsaWRlcklkXTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0U2xpZGVyU2NvcGUoc2xpZGVySWQ6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdnZ2cnLCB0aGlzLl9zbGlkZXJzLCAnampqJyk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NsaWRlcnNbc2xpZGVySWRdO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBuZXh0Q2Fyb3VzZWwobmV4dEJsb2NrLCBwcmV2QmxvY2spOiB2b2lkIHtcclxuICAgICAgICBuZXh0QmxvY2suYWRkQ2xhc3MoJ3BpcC1uZXh0Jyk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICB0aGlzLl8kdGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIG5leHRCbG9jay5hZGRDbGFzcygnYW5pbWF0ZWQnKS5hZGRDbGFzcygncGlwLXNob3cnKS5yZW1vdmVDbGFzcygncGlwLW5leHQnKTtcclxuICAgICAgICAgICAgcHJldkJsb2NrLmFkZENsYXNzKCdhbmltYXRlZCcpLnJlbW92ZUNsYXNzKCdwaXAtc2hvdycpO1xyXG4gICAgICAgIH0sIDEwMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHByZXZDYXJvdXNlbChuZXh0QmxvY2ssIHByZXZCbG9jayk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuXyR0aW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgbmV4dEJsb2NrLmFkZENsYXNzKCdhbmltYXRlZCcpLmFkZENsYXNzKCdwaXAtc2hvdycpO1xyXG4gICAgICAgICAgICBwcmV2QmxvY2suYWRkQ2xhc3MoJ2FuaW1hdGVkJykuYWRkQ2xhc3MoJ3BpcC1uZXh0JykucmVtb3ZlQ2xhc3MoJ3BpcC1zaG93Jyk7XHJcbiAgICAgICAgfSwgMTAwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdG9CbG9jayh0eXBlOiBzdHJpbmcsIGJsb2NrczogYW55W10sIG9sZEluZGV4OiBudW1iZXIsIG5leHRJbmRleDogbnVtYmVyLCBkaXJlY3Rpb246IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIGxldCBwcmV2QmxvY2sgPSAkKGJsb2Nrc1tvbGRJbmRleF0pLFxyXG4gICAgICAgICAgICBibG9ja0luZGV4OiBudW1iZXIgPSBuZXh0SW5kZXgsXHJcbiAgICAgICAgICAgIG5leHRCbG9jayA9ICQoYmxvY2tzW2Jsb2NrSW5kZXhdKTtcclxuXHJcbiAgICAgICAgaWYgKHR5cGUgPT09ICdjYXJvdXNlbCcpIHtcclxuICAgICAgICAgICAgJChibG9ja3MpLnJlbW92ZUNsYXNzKCdwaXAtbmV4dCcpLnJlbW92ZUNsYXNzKCdwaXAtcHJldicpLnJlbW92ZUNsYXNzKCdhbmltYXRlZCcpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGRpcmVjdGlvbiAmJiAoZGlyZWN0aW9uID09PSAncHJldicgfHwgZGlyZWN0aW9uID09PSAnbmV4dCcpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGlyZWN0aW9uID09PSAncHJldicpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByZXZDYXJvdXNlbChuZXh0QmxvY2ssIHByZXZCbG9jayk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dENhcm91c2VsKG5leHRCbG9jaywgcHJldkJsb2NrKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChuZXh0SW5kZXggJiYgbmV4dEluZGV4IDwgb2xkSW5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByZXZDYXJvdXNlbChuZXh0QmxvY2ssIHByZXZCbG9jayk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dENhcm91c2VsKG5leHRCbG9jaywgcHJldkJsb2NrKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHByZXZCbG9jay5hZGRDbGFzcygnYW5pbWF0ZWQnKS5yZW1vdmVDbGFzcygncGlwLXNob3cnKTtcclxuICAgICAgICAgICAgbmV4dEJsb2NrLmFkZENsYXNzKCdhbmltYXRlZCcpLmFkZENsYXNzKCdwaXAtc2hvdycpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn1cclxuXHJcblxyXG4oKCkgPT4ge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3BpcEltYWdlU2xpZGVyLlNlcnZpY2UnLCBbXSlcclxuICAgICAgICAuc2VydmljZSgnJHBpcEltYWdlU2xpZGVyJywgSW1hZ2VTbGlkZXJTZXJ2aWNlKTtcclxuXHJcbn0pKCk7XHJcbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi90eXBpbmdzL3RzZC5kLnRzXCIgLz5cclxuXHJcbigoKSA9PiB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIHRoaXNNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgncGlwU2xpZGVyQnV0dG9uJywgW10pO1xyXG5cclxuICAgIHRoaXNNb2R1bGUuZGlyZWN0aXZlKCdwaXBTbGlkZXJCdXR0b24nLFxyXG4gICAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHNjb3BlOiB7fSxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uICgkc2NvcGUsICRlbGVtZW50LCAkcGFyc2UsICRhdHRycywgJHBpcEltYWdlU2xpZGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHR5cGUgPSAkcGFyc2UoJGF0dHJzLnBpcEJ1dHRvblR5cGUpKCRzY29wZSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlcklkID0gJHBhcnNlKCRhdHRycy5waXBTbGlkZXJJZCkoJHNjb3BlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJGVsZW1lbnQub24oJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXNsaWRlcklkIHx8ICF0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRwaXBJbWFnZVNsaWRlci5nZXRTbGlkZXJTY29wZShzbGlkZXJJZCkudm1bdHlwZSArICdCbG9jayddKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgKTtcclxuXHJcbn0pKCk7XHJcbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi90eXBpbmdzL3RzZC5kLnRzXCIgLz5cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIHRoaXNNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgncGlwU2xpZGVySW5kaWNhdG9yJywgW10pO1xyXG5cclxuICAgIHRoaXNNb2R1bGUuZGlyZWN0aXZlKCdwaXBTbGlkZXJJbmRpY2F0b3InLFxyXG4gICAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHNjb3BlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICgkc2NvcGUsICRlbGVtZW50LCAkcGFyc2UsICRhdHRycywgJHBpcEltYWdlU2xpZGVyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNsaWRlcklkID0gJHBhcnNlKCRhdHRycy5waXBTbGlkZXJJZCkoJHNjb3BlKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGVUbyA9ICRwYXJzZSgkYXR0cnMucGlwU2xpZGVUbykoJHNjb3BlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJGVsZW1lbnQuY3NzKCdjdXJzb3InLCAncG9pbnRlcicpO1xyXG4gICAgICAgICAgICAgICAgICAgICRlbGVtZW50Lm9uKCdjbGljaycsICAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghc2xpZGVySWQgfHwgc2xpZGVUbyAmJiBzbGlkZVRvIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRwaXBJbWFnZVNsaWRlci5nZXRTbGlkZXJTY29wZShzbGlkZXJJZCkudm0uc2xpZGVUb1ByaXZhdGUoc2xpZGVUbyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgKTtcclxuXHJcbn0pKCk7XHJcbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi90eXBpbmdzL3RzZC5kLnRzXCIgLz5cclxuXHJcbmRlY2xhcmUgdmFyIG1hcmtlZDogYW55O1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgdGhpc01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBNYXJrZG93bicsIFsnbmdTYW5pdGl6ZSddKTtcclxuXHJcbiAgICB0aGlzTW9kdWxlLnJ1bihmdW5jdGlvbiAoJGluamVjdG9yKSB7XHJcbiAgICAgICAgdmFyIHBpcFRyYW5zbGF0ZSA9ICRpbmplY3Rvci5oYXMoJ3BpcFRyYW5zbGF0ZScpID8gJGluamVjdG9yLmdldCgncGlwVHJhbnNsYXRlJykgOiBudWxsO1xyXG5cclxuICAgICAgICBpZiAocGlwVHJhbnNsYXRlKSB7XHJcbiAgICAgICAgICAgIHBpcFRyYW5zbGF0ZS5zZXRUcmFuc2xhdGlvbnMoJ2VuJywge1xyXG4gICAgICAgICAgICAgICAgJ01BUktET1dOX0FUVEFDSE1FTlRTJzogJ0F0dGFjaG1lbnRzOicsXHJcbiAgICAgICAgICAgICAgICAnY2hlY2tsaXN0JzogJ0NoZWNrbGlzdCcsXHJcbiAgICAgICAgICAgICAgICAnZG9jdW1lbnRzJzogJ0RvY3VtZW50cycsXHJcbiAgICAgICAgICAgICAgICAncGljdHVyZXMnOiAnUGljdHVyZXMnLFxyXG4gICAgICAgICAgICAgICAgJ2xvY2F0aW9uJzogJ0xvY2F0aW9uJyxcclxuICAgICAgICAgICAgICAgICd0aW1lJzogJ1RpbWUnXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBwaXBUcmFuc2xhdGUuc2V0VHJhbnNsYXRpb25zKCdydScsIHtcclxuICAgICAgICAgICAgICAgICdNQVJLRE9XTl9BVFRBQ0hNRU5UUyc6ICfQktC70L7QttC10L3QuNGPOicsXHJcbiAgICAgICAgICAgICAgICAnY2hlY2tsaXN0JzogJ9Ch0L/QuNGB0L7QuicsXHJcbiAgICAgICAgICAgICAgICAnZG9jdW1lbnRzJzogJ9CU0L7QutGD0LzQtdC90YLRiycsXHJcbiAgICAgICAgICAgICAgICAncGljdHVyZXMnOiAn0JjQt9C+0LHRgNCw0LbQtdC90LjRjycsXHJcbiAgICAgICAgICAgICAgICAnbG9jYXRpb24nOiAn0JzQtdGB0YLQvtC90LDRhdC+0LbQtNC10L3QuNC1JyxcclxuICAgICAgICAgICAgICAgICd0aW1lJzogJ9CS0YDQtdC80Y8nXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXNNb2R1bGUuZGlyZWN0aXZlKCdwaXBNYXJrZG93bicsXHJcbiAgICAgICAgZnVuY3Rpb24gKCRwYXJzZSwgJGluamVjdG9yKSB7XHJcbiAgICAgICAgICAgIHZhciBwaXBUcmFuc2xhdGUgPSAkaW5qZWN0b3IuaGFzKCdwaXBUcmFuc2xhdGUnKSA/ICRpbmplY3Rvci5nZXQoJ3BpcFRyYW5zbGF0ZScpIDogbnVsbDtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICAgICAgICAgIHNjb3BlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uICgkc2NvcGU6IGFueSwgJGVsZW1lbnQsICRhdHRyczogYW55KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHRHZXR0ZXIgPSAkcGFyc2UoJGF0dHJzLnBpcFRleHQpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0R2V0dGVyID0gJHBhcnNlKCRhdHRycy5waXBMaXN0KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhbXBHZXR0ZXIgPSAkcGFyc2UoJGF0dHJzLnBpcExpbmVDb3VudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGRlc2NyaWJlQXR0YWNobWVudHMoYXJyYXkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dGFjaFN0cmluZyA9ICcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0YWNoVHlwZXMgPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8uZWFjaChhcnJheSwgZnVuY3Rpb24gKGF0dGFjaCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGF0dGFjaC50eXBlICYmIGF0dGFjaC50eXBlICE9PSAndGV4dCcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXR0YWNoU3RyaW5nLmxlbmd0aCA9PT0gMCAmJiBwaXBUcmFuc2xhdGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0YWNoU3RyaW5nID0gcGlwVHJhbnNsYXRlLnRyYW5zbGF0ZSgnTUFSS0RPV05fQVRUQUNITUVOVFMnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhdHRhY2hUeXBlcy5pbmRleE9mKGF0dGFjaC50eXBlKSA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0YWNoVHlwZXMucHVzaChhdHRhY2gudHlwZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dGFjaFN0cmluZyArPSBhdHRhY2hUeXBlcy5sZW5ndGggPiAxID8gJywgJyA6ICcgJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBpcFRyYW5zbGF0ZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dGFjaFN0cmluZyArPSBwaXBUcmFuc2xhdGUudHJhbnNsYXRlKGF0dGFjaC50eXBlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGF0dGFjaFN0cmluZztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHRvQm9vbGVhbih2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXZhbHVlKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgPT0gJzEnIHx8IHZhbHVlID09ICd0cnVlJztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGJpbmRUZXh0KHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZXh0U3RyaW5nLCBpc0NsYW1wZWQsIGhlaWdodCwgb3B0aW9ucywgb2JqO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF8uaXNBcnJheSh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iaiA9IF8uZmluZCh2YWx1ZSwgZnVuY3Rpb24gKGl0ZW06IGFueSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLnR5cGUgPT09ICd0ZXh0JyAmJiBpdGVtLnRleHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0U3RyaW5nID0gb2JqID8gb2JqLnRleHQgOiBkZXNjcmliZUF0dGFjaG1lbnRzKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRTdHJpbmcgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNDbGFtcGVkID0gJGF0dHJzLnBpcExpbmVDb3VudCAmJiBfLmlzTnVtYmVyKGNsYW1wR2V0dGVyKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0NsYW1wZWQgPSBpc0NsYW1wZWQgJiYgdGV4dFN0cmluZyAmJiB0ZXh0U3RyaW5nLmxlbmd0aCA+IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZm06IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWJsZXM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVha3M6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzYW5pdGl6ZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBlZGFudGljOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc21hcnRMaXN0czogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNtYXJ0eXBlbnRzOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0U3RyaW5nID0gbWFya2VkKHRleHRTdHJpbmcgfHwgJycsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNDbGFtcGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQgPSAxLjUgKiBjbGFtcEdldHRlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFzc2lnbiB2YWx1ZSBhcyBIVE1MXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRlbGVtZW50Lmh0bWwoJzxkaXYnICsgKGlzQ2xhbXBlZCA/IGxpc3RHZXR0ZXIoKSA/ICdjbGFzcz1cInBpcC1tYXJrZG93bi1jb250ZW50ICcgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3BpcC1tYXJrZG93bi1saXN0XCIgc3R5bGU9XCJtYXgtaGVpZ2h0OiAnICsgaGVpZ2h0ICsgJ2VtXCI+J1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJyBjbGFzcz1cInBpcC1tYXJrZG93bi1jb250ZW50XCIgc3R5bGU9XCJtYXgtaGVpZ2h0OiAnICsgaGVpZ2h0ICsgJ2VtXCI+JyA6IGxpc3RHZXR0ZXIoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJyBjbGFzcz1cInBpcC1tYXJrZG93bi1saXN0XCI+JyA6ICc+JykgKyB0ZXh0U3RyaW5nICsgJzwvZGl2PicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkZWxlbWVudC5maW5kKCdhJykuYXR0cigndGFyZ2V0JywgJ2JsYW5rJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghbGlzdEdldHRlcigpICYmIGlzQ2xhbXBlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGVsZW1lbnQuYXBwZW5kKCc8ZGl2IGNsYXNzPVwicGlwLWdyYWRpZW50LWJsb2NrXCI+PC9kaXY+Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEZpbGwgdGhlIHRleHRcclxuICAgICAgICAgICAgICAgICAgICBiaW5kVGV4dCh0ZXh0R2V0dGVyKCRzY29wZSkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBBbHNvIG9wdGltaXphdGlvbiB0byBhdm9pZCB3YXRjaCBpZiBpdCBpcyB1bm5lY2Vzc2FyeVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0b0Jvb2xlYW4oJGF0dHJzLnBpcFJlYmluZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiR3YXRjaCh0ZXh0R2V0dGVyLCBmdW5jdGlvbiAobmV3VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJpbmRUZXh0KG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuJG9uKCdwaXBXaW5kb3dSZXNpemVkJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBiaW5kVGV4dCh0ZXh0R2V0dGVyKCRzY29wZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBBZGQgY2xhc3NcclxuICAgICAgICAgICAgICAgICAgICAkZWxlbWVudC5hZGRDbGFzcygncGlwLW1hcmtkb3duJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgKTtcclxuXHJcbn0pKCk7XHJcblxyXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vdHlwaW5ncy90c2QuZC50c1wiIC8+XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFBvcG92ZXJDb250cm9sbGVyIHtcclxuICBcclxuICAgIHByaXZhdGUgXyR0aW1lb3V0O1xyXG4gICAgcHJpdmF0ZSBfJHNjb3BlOiBuZy5JU2NvcGU7XHJcblxyXG4gICAgcHVibGljIHRpbWVvdXQ7XHJcbiAgICBwdWJsaWMgYmFja2Ryb3BFbGVtZW50O1xyXG4gICAgcHVibGljIGNvbnRlbnQ7XHJcbiAgICBwdWJsaWMgZWxlbWVudDtcclxuICAgIHB1YmxpYyBjYWxjSDogYm9vbGVhbjtcclxuXHJcbiAgICBwdWJsaWMgdGVtcGxhdGVVcmw7XHJcbiAgICBwdWJsaWMgdGVtcGxhdGVcclxuXHJcbiAgICBwdWJsaWMgY2FuY2VsQ2FsbGJhY2s6IEZ1bmN0aW9uO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCBcclxuICAgICAgICAkc2NvcGU6IG5nLklTY29wZSxcclxuICAgICAgICAkcm9vdFNjb3BlLFxyXG4gICAgICAgICRlbGVtZW50LFxyXG4gICAgICAgICR0aW1lb3V0LCBcclxuICAgICAgICAkY29tcGlsZVxyXG4gICAgICAgKSB7XHJcbiAgICAgICAgICAgLy8kc2NvcGUgPSBfLmRlZmF1bHRzKCRzY29wZSwgJHNjb3BlLiRwYXJlbnQpOyAgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIFxyXG4gICAgICAgICAgIHRoaXMuXyR0aW1lb3V0ID0gJHRpbWVvdXQ7XHJcbiAgICAgICAgICAgdGhpcy50ZW1wbGF0ZVVybCA9ICRzY29wZVsncGFyYW1zJ10udGVtcGxhdGVVcmw7XHJcbiAgICAgICAgICAgdGhpcy50ZW1wbGF0ZSA9ICRzY29wZVsncGFyYW1zJ10udGVtcGxhdGU7XHJcbiAgICAgICAgICAgdGhpcy50aW1lb3V0ID0gJHNjb3BlWydwYXJhbXMnXS50aW1lb3V0O1xyXG4gICAgICAgICAgIHRoaXMuZWxlbWVudCA9ICRzY29wZVsncGFyYW1zJ10uZWxlbWVudDtcclxuICAgICAgICAgICB0aGlzLmNhbGNIID0gJHNjb3BlWydwYXJhbXMnXS5jYWxjSGVpZ2h0O1xyXG4gICAgICAgICAgIHRoaXMuY2FuY2VsQ2FsbGJhY2sgPSAkc2NvcGVbJ3BhcmFtcyddLmNhbmNlbENhbGxiYWNrO1xyXG4gICAgICAgICAgIHRoaXMuYmFja2Ryb3BFbGVtZW50ID0gJCgnLnBpcC1wb3BvdmVyLWJhY2tkcm9wJyk7XHJcbiAgICAgICAgICAgdGhpcy5iYWNrZHJvcEVsZW1lbnQub24oJ2NsaWNrIGtleWRvd24gc2Nyb2xsJywoKSA9PnsgdGhpcy5iYWNrZHJvcENsaWNrKCl9KTtcclxuICAgICAgICAgICB0aGlzLmJhY2tkcm9wRWxlbWVudC5hZGRDbGFzcygkc2NvcGVbJ3BhcmFtcyddLnJlc3BvbnNpdmUgIT09IGZhbHNlID8gJ3BpcC1yZXNwb25zaXZlJyA6ICcnKTtcclxuXHJcbiAgICAgICAgICAgJHRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wb3NpdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCRzY29wZVsncGFyYW1zJ10udGVtcGxhdGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnQgPSAkY29tcGlsZSgkc2NvcGVbJ3BhcmFtcyddLnRlbXBsYXRlKSgkc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICRlbGVtZW50LmZpbmQoJy5waXAtcG9wb3ZlcicpLmFwcGVuZCh0aGlzLmNvbnRlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAkdGltZW91dCgoKSA9PiB7IHRoaXMuY2FsY0hlaWdodCgpOyB9LCAyMDApO1xyXG4gICAgICAgICAgICRyb290U2NvcGUuJG9uKCdwaXBQb3BvdmVyUmVzaXplJywgKCkgPT4geyB0aGlzLm9uUmVzaXplKCl9KTtcclxuICAgICAgICAgICAkKHdpbmRvdykucmVzaXplKCgpID0+IHsgdGhpcy5vblJlc2l6ZSgpIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYmFja2Ryb3BDbGljaygpIHtcclxuICAgICAgICBpZiAodGhpcy5jYW5jZWxDYWxsYmFjaykge1xyXG4gICAgICAgICAgICB0aGlzLmNhbmNlbENhbGxiYWNrKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY2xvc2VQb3BvdmVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNsb3NlUG9wb3ZlcigpIHtcclxuICAgICAgICB0aGlzLmJhY2tkcm9wRWxlbWVudC5yZW1vdmVDbGFzcygnb3BlbmVkJyk7XHJcbiAgICAgICAgdGhpcy5fJHRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmJhY2tkcm9wRWxlbWVudC5yZW1vdmUoKTtcclxuICAgICAgICB9LCAxMDApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvblBvcG92ZXJDbGljaygkZSkge1xyXG4gICAgICAgICRlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBwcml2YXRlIGluaXQoKSB7XHJcbiAgICAgICAgdGhpcy5iYWNrZHJvcEVsZW1lbnQuYWRkQ2xhc3MoJ29wZW5lZCcpO1xyXG4gICAgICAgICQoJy5waXAtcG9wb3Zlci1iYWNrZHJvcCcpLmZvY3VzKCk7XHJcbiAgICAgICAgaWYgKHRoaXMudGltZW91dCkge1xyXG4gICAgICAgICAgICB0aGlzLl8kdGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsb3NlUG9wb3ZlcigpO1xyXG4gICAgICAgICAgICB9LCB0aGlzLnRpbWVvdXQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHBvc2l0aW9uKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQpIHtcclxuICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSAkKHRoaXMuZWxlbWVudCksXHJcbiAgICAgICAgICAgICAgICBwb3MgPSBlbGVtZW50Lm9mZnNldCgpLFxyXG4gICAgICAgICAgICAgICAgd2lkdGggPSBlbGVtZW50LndpZHRoKCksXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQgPSBlbGVtZW50LmhlaWdodCgpLFxyXG4gICAgICAgICAgICAgICAgZG9jV2lkdGggPSAkKGRvY3VtZW50KS53aWR0aCgpLFxyXG4gICAgICAgICAgICAgICAgZG9jSGVpZ2h0ID0gJChkb2N1bWVudCkuaGVpZ2h0KCksXHJcbiAgICAgICAgICAgICAgICBwb3BvdmVyID0gdGhpcy5iYWNrZHJvcEVsZW1lbnQuZmluZCgnLnBpcC1wb3BvdmVyJyk7XHJcblxyXG4gICAgICAgICAgICBpZiAocG9zKSB7XHJcbiAgICAgICAgICAgICAgICBwb3BvdmVyXHJcbiAgICAgICAgICAgICAgICAgICAgLmNzcygnbWF4LXdpZHRoJywgZG9jV2lkdGggLSAoZG9jV2lkdGggLSBwb3MubGVmdCkpXHJcbiAgICAgICAgICAgICAgICAgICAgLmNzcygnbWF4LWhlaWdodCcsIGRvY0hlaWdodCAtIChwb3MudG9wICsgaGVpZ2h0KSAtIDMyLCAwKVxyXG4gICAgICAgICAgICAgICAgICAgIC5jc3MoJ2xlZnQnLCBwb3MubGVmdCAtIHBvcG92ZXIud2lkdGgoKSArIHdpZHRoIC8gMilcclxuICAgICAgICAgICAgICAgICAgICAuY3NzKCd0b3AnLCBwb3MudG9wICsgaGVpZ2h0ICsgMTYpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25SZXNpemUoKSB7XHJcbiAgICAgICAgdGhpcy5iYWNrZHJvcEVsZW1lbnQuZmluZCgnLnBpcC1wb3BvdmVyJykuZmluZCgnLnBpcC1jb250ZW50JykuY3NzKCdtYXgtaGVpZ2h0JywgJzEwMCUnKTtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5jYWxjSGVpZ2h0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjYWxjSGVpZ2h0KCkge1xyXG4gICAgICAgIGlmICh0aGlzLmNhbGNIID09PSBmYWxzZSkgeyByZXR1cm47IH1cclxuICAgICAgICBsZXQgcG9wb3ZlciA9IHRoaXMuYmFja2Ryb3BFbGVtZW50LmZpbmQoJy5waXAtcG9wb3ZlcicpLFxyXG4gICAgICAgIHRpdGxlID0gcG9wb3Zlci5maW5kKCcucGlwLXRpdGxlJyksXHJcbiAgICAgICAgZm9vdGVyID0gcG9wb3Zlci5maW5kKCcucGlwLWZvb3RlcicpLFxyXG4gICAgICAgIGNvbnRlbnQgPSBwb3BvdmVyLmZpbmQoJy5waXAtY29udGVudCcpLFxyXG4gICAgICAgIGNvbnRlbnRIZWlnaHQgPSBwb3BvdmVyLmhlaWdodCgpIC0gdGl0bGUub3V0ZXJIZWlnaHQodHJ1ZSkgLSBmb290ZXIub3V0ZXJIZWlnaHQodHJ1ZSk7XHJcbiAgICAgICAgY29udGVudC5jc3MoJ21heC1oZWlnaHQnLCBNYXRoLm1heChjb250ZW50SGVpZ2h0LCAwKSArICdweCcpLmNzcygnYm94LXNpemluZycsICdib3JkZXItYm94Jyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbigoKSA9PiB7XHJcbiAgICBmdW5jdGlvbiBwaXBQb3BvdmVyKCRwYXJzZTogYW55KSB7XHJcbiAgICAgICAgXCJuZ0luamVjdFwiO1xyXG5cclxuICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICAgICAgICAgIHNjb3BlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwb3BvdmVyL3BvcG92ZXIuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBQb3BvdmVyQ29udHJvbGxlcixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJ1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncGlwUG9wb3ZlcicsIFsncGlwUG9wb3Zlci5TZXJ2aWNlJ10pXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgncGlwUG9wb3ZlcicsIHBpcFBvcG92ZXIpO1xyXG5cclxuXHJcbn0pKCk7XHJcblxyXG5cclxuXHJcbi8qXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIHRoaXNNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgncGlwUG9wb3ZlcicsIFsncGlwUG9wb3Zlci5TZXJ2aWNlJ10pO1xyXG5cclxuICAgIHRoaXNNb2R1bGUuZGlyZWN0aXZlKCdwaXBQb3BvdmVyJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgICAgICBzY29wZTogdHJ1ZSxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwb3BvdmVyL3BvcG92ZXIuaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uICgkc2NvcGUsICRyb290U2NvcGUsICRlbGVtZW50LCAkdGltZW91dCwgJGNvbXBpbGUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBiYWNrZHJvcEVsZW1lbnQsIGNvbnRlbnQ7XHJcblxyXG4gICAgICAgICAgICAgICAgYmFja2Ryb3BFbGVtZW50ID0gJCgnLnBpcC1wb3BvdmVyLWJhY2tkcm9wJyk7XHJcbiAgICAgICAgICAgICAgICBiYWNrZHJvcEVsZW1lbnQub24oJ2NsaWNrIGtleWRvd24gc2Nyb2xsJywgYmFja2Ryb3BDbGljayk7XHJcbiAgICAgICAgICAgICAgICBiYWNrZHJvcEVsZW1lbnQuYWRkQ2xhc3MoJHNjb3BlLnBhcmFtcy5yZXNwb25zaXZlICE9PSBmYWxzZSA/ICdwaXAtcmVzcG9uc2l2ZScgOiAnJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCRzY29wZS5wYXJhbXMudGVtcGxhdGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudCA9ICRjb21waWxlKCRzY29wZS5wYXJhbXMudGVtcGxhdGUpKCRzY29wZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRlbGVtZW50LmZpbmQoJy5waXAtcG9wb3ZlcicpLmFwcGVuZChjb250ZW50KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGluaXQoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYWxjSGVpZ2h0KCk7XHJcbiAgICAgICAgICAgICAgICB9LCAyMDApO1xyXG5cclxuICAgICAgICAgICAgICAgICRzY29wZS5vblBvcG92ZXJDbGljayA9IG9uUG9wb3ZlckNsaWNrO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlID0gXy5kZWZhdWx0cygkc2NvcGUsICRzY29wZS4kcGFyZW50KTsgICAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBcclxuXHJcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRvbigncGlwUG9wb3ZlclJlc2l6ZScsIG9uUmVzaXplKTtcclxuICAgICAgICAgICAgICAgICQod2luZG93KS5yZXNpemUob25SZXNpemUpO1xyXG5cclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmFja2Ryb3BFbGVtZW50LmFkZENsYXNzKCdvcGVuZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICAkKCcucGlwLXBvcG92ZXItYmFja2Ryb3AnKS5mb2N1cygpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkc2NvcGUucGFyYW1zLnRpbWVvdXQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xvc2VQb3BvdmVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sICRzY29wZS5wYXJhbXMudGltZW91dCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGJhY2tkcm9wQ2xpY2soKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCRzY29wZS5wYXJhbXMuY2FuY2VsQ2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnBhcmFtcy5jYW5jZWxDYWxsYmFjaygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2xvc2VQb3BvdmVyKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gY2xvc2VQb3BvdmVyKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJhY2tkcm9wRWxlbWVudC5yZW1vdmVDbGFzcygnb3BlbmVkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBiYWNrZHJvcEVsZW1lbnQucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgMTAwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBvblBvcG92ZXJDbGljaygkZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICRlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHBvc2l0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkc2NvcGUucGFyYW1zLmVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSAkKCRzY29wZS5wYXJhbXMuZWxlbWVudCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3MgPSBlbGVtZW50Lm9mZnNldCgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGggPSBlbGVtZW50LndpZHRoKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQgPSBlbGVtZW50LmhlaWdodCgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9jV2lkdGggPSAkKGRvY3VtZW50KS53aWR0aCgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9jSGVpZ2h0ID0gJChkb2N1bWVudCkuaGVpZ2h0KCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3BvdmVyID0gYmFja2Ryb3BFbGVtZW50LmZpbmQoJy5waXAtcG9wb3ZlcicpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBvcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9wb3ZlclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jc3MoJ21heC13aWR0aCcsIGRvY1dpZHRoIC0gKGRvY1dpZHRoIC0gcG9zLmxlZnQpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jc3MoJ21heC1oZWlnaHQnLCBkb2NIZWlnaHQgLSAocG9zLnRvcCArIGhlaWdodCkgLSAzMiwgMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY3NzKCdsZWZ0JywgcG9zLmxlZnQgLSBwb3BvdmVyLndpZHRoKCkgKyB3aWR0aCAvIDIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNzcygndG9wJywgcG9zLnRvcCArIGhlaWdodCArIDE2KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBjYWxjSGVpZ2h0KCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkc2NvcGUucGFyYW1zLmNhbGNIZWlnaHQgPT09IGZhbHNlKSB7IHJldHVybjsgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgcG9wb3ZlciA9IGJhY2tkcm9wRWxlbWVudC5maW5kKCcucGlwLXBvcG92ZXInKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGUgPSBwb3BvdmVyLmZpbmQoJy5waXAtdGl0bGUnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9vdGVyID0gcG9wb3Zlci5maW5kKCcucGlwLWZvb3RlcicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50ID0gcG9wb3Zlci5maW5kKCcucGlwLWNvbnRlbnQnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudEhlaWdodCA9IHBvcG92ZXIuaGVpZ2h0KCkgLSB0aXRsZS5vdXRlckhlaWdodCh0cnVlKSAtIGZvb3Rlci5vdXRlckhlaWdodCh0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudC5jc3MoJ21heC1oZWlnaHQnLCBNYXRoLm1heChjb250ZW50SGVpZ2h0LCAwKSArICdweCcpLmNzcygnYm94LXNpemluZycsICdib3JkZXItYm94Jyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gb25SZXNpemUoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmFja2Ryb3BFbGVtZW50LmZpbmQoJy5waXAtcG9wb3ZlcicpLmZpbmQoJy5waXAtY29udGVudCcpLmNzcygnbWF4LWhlaWdodCcsICcxMDAlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb24oKTtcclxuICAgICAgICAgICAgICAgICAgICBjYWxjSGVpZ2h0KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfSk7XHJcblxyXG59KSgpOyovXHJcbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi90eXBpbmdzL3RzZC5kLnRzXCIgLz5cclxuXHJcbmV4cG9ydCBjbGFzcyBQb3BvdmVyU2VydmljZSB7XHJcbiAgXHJcbiAgICBwcml2YXRlIF8kdGltZW91dDtcclxuICAgIHByaXZhdGUgXyRzY29wZTogbmcuSVNjb3BlO1xyXG4gICAgcHJpdmF0ZSBfJGNvbXBpbGU7XHJcbiAgICBwcml2YXRlIF8kcm9vdFNjb3BlOiBuZy5JUm9vdFNjb3BlU2VydmljZTtcclxuXHJcbiAgICBwdWJsaWMgcG9wb3ZlclRlbXBsYXRlOiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoIFxyXG4gICAgICAgICRjb21waWxlLFxyXG4gICAgICAgICRyb290U2NvcGUsIFxyXG4gICAgICAgICR0aW1lb3V0XHJcbiAgICAgICApIHtcclxuICAgICAgICAgICB0aGlzLl8kY29tcGlsZSA9ICRjb21waWxlO1xyXG4gICAgICAgICAgIHRoaXMuXyRyb290U2NvcGUgPSAkcm9vdFNjb3BlO1xyXG4gICAgICAgICAgIHRoaXMuXyR0aW1lb3V0ID0gJHRpbWVvdXQ7XHJcbiAgICAgICAgICAgdGhpcy5wb3BvdmVyVGVtcGxhdGUgPSBcIjxkaXYgY2xhc3M9J3BpcC1wb3BvdmVyLWJhY2tkcm9wIHt7IHBhcmFtcy5jbGFzcyB9fScgbmctY29udHJvbGxlcj0ncGFyYW1zLmNvbnRyb2xsZXInXCIgK1xyXG4gICAgICAgICAgICAgICAgXCIgdGFiaW5kZXg9JzEnPiA8cGlwLXBvcG92ZXIgcGlwLXBhcmFtcz0ncGFyYW1zJz4gPC9waXAtcG9wb3Zlcj4gPC9kaXY+XCI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNob3cocCkge1xyXG4gICAgICAgIGxldCBlbGVtZW50LCBzY29wZTogbmcuSVNjb3BlLCBwYXJhbXMsIGNvbnRlbnQ7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIGVsZW1lbnQgPSAkKCdib2R5Jyk7XHJcbiAgICAgICAgaWYgKGVsZW1lbnQuZmluZCgnbWQtYmFja2Ryb3AnKS5sZW5ndGggPiAwKSB7IHJldHVybjsgfVxyXG4gICAgICAgIHRoaXMuaGlkZSgpO1xyXG4gICAgICAgIHNjb3BlID0gdGhpcy5fJHJvb3RTY29wZS4kbmV3KCk7XHJcbiAgICAgICAgcGFyYW1zID0gcCAmJiBfLmlzT2JqZWN0KHApID8gcCA6IHt9O1xyXG4gICAgICAgIHNjb3BlWydwYXJhbXMnXSA9IHBhcmFtcztcclxuICAgICAgICBzY29wZVsnbG9jYWxzJ10gPSBwYXJhbXMubG9jYWxzO1xyXG4gICAgICAgIGNvbnRlbnQgPSB0aGlzLl8kY29tcGlsZSh0aGlzLnBvcG92ZXJUZW1wbGF0ZSkoc2NvcGUpO1xyXG4gICAgICAgIGVsZW1lbnQuYXBwZW5kKGNvbnRlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBoaWRlKCkge1xyXG4gICAgICAgIGxldCBiYWNrZHJvcEVsZW1lbnQgPSAkKCcucGlwLXBvcG92ZXItYmFja2Ryb3AnKTtcclxuICAgICAgICBiYWNrZHJvcEVsZW1lbnQucmVtb3ZlQ2xhc3MoJ29wZW5lZCcpO1xyXG4gICAgICAgIHRoaXMuXyR0aW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgYmFja2Ryb3BFbGVtZW50LnJlbW92ZSgpO1xyXG4gICAgICAgIH0sIDEwMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlc2l6ZSgpIHtcclxuICAgICAgICB0aGlzLl8kcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3BpcFBvcG92ZXJSZXNpemUnKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbigoKSA9PiB7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncGlwUG9wb3Zlci5TZXJ2aWNlJywgW10pXHJcbiAgICAgICAgLnNlcnZpY2UoJ3BpcFBvcG92ZXJTZXJ2aWNlJywgUG9wb3ZlclNlcnZpY2UpO1xyXG59KSgpOyIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi90eXBpbmdzL3RzZC5kLnRzXCIgLz5cclxuXHJcbmNsYXNzIFJvdXRpbmdDb250cm9sbGVyIHtcclxuICAgIHByaXZhdGUgX2ltYWdlOiBhbnk7XHJcblxyXG4gICAgcHVibGljIGxvZ29Vcmw6IHN0cmluZztcclxuICAgIHB1YmxpYyBzaG93UHJvZ3Jlc3M6IEZ1bmN0aW9uO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCBcclxuICAgICAgICAkc2NvcGU6IG5nLklTY29wZSxcclxuICAgICAgICAkZWxlbWVudClcclxuICAgIHtcclxuXHJcbiAgICAgICAgdGhpcy5faW1hZ2UgPSAkZWxlbWVudC5jaGlsZHJlbignaW1nJyk7IFxyXG4gICAgICAgIHRoaXMuc2hvd1Byb2dyZXNzID0gJHNjb3BlWydzaG93UHJvZ3Jlc3MnXVxyXG4gICAgICAgIHRoaXMubG9nb1VybCA9ICRzY29wZVsnbG9nb1VybCddOyAgICAgICAgXHJcbiAgICAgICAgdGhpcy5sb2FkUHJvZ3Jlc3NJbWFnZSgpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbG9hZFByb2dyZXNzSW1hZ2UoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMubG9nb1VybCkge1xyXG4gICAgICAgICAgICB0aGlzLl9pbWFnZS5hdHRyKCdzcmMnLCB0aGlzLmxvZ29VcmwpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn1cclxuXHJcblxyXG4oKCkgPT4ge1xyXG5cclxuICAgIGZ1bmN0aW9uIFJvdXRpbmdQcm9ncmVzcygpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcclxuICAgICAgICAgICAgc2NvcGU6IHtcclxuICAgICAgICAgICAgICAgICAgICBzaG93UHJvZ3Jlc3M6ICcmJyxcclxuICAgICAgICAgICAgICAgICAgICBsb2dvVXJsOiAnQCdcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAncHJvZ3Jlc3Mvcm91dGluZ19wcm9ncmVzcy5odG1sJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogUm91dGluZ0NvbnRyb2xsZXIsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJ1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdwaXBSb3V0aW5nUHJvZ3Jlc3MnLCBbJ25nTWF0ZXJpYWwnXSlcclxuICAgICAgICAuZGlyZWN0aXZlKCdwaXBSb3V0aW5nUHJvZ3Jlc3MnLCBSb3V0aW5nUHJvZ3Jlc3MpO1xyXG5cclxufSkoKTtcclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxyXG5cclxuaW50ZXJmYWNlIElQaXBUb2FzdCB7XHJcbiAgICB0eXBlOiBzdHJpbmc7XHJcbiAgICBpZDogc3RyaW5nO1xyXG4gICAgZXJyb3I6IGFueTtcclxuICAgIG1lc3NhZ2U6IHN0cmluZztcclxuICAgIGFjdGlvbnM6IHN0cmluZ1tdO1xyXG4gICAgZHVyYXRpb246IG51bWJlcjtcclxuICAgIHN1Y2Nlc3NDYWxsYmFjazogRnVuY3Rpb247XHJcbiAgICBjYW5jZWxDYWxsYmFjazogRnVuY3Rpb25cclxufVxyXG5cclxuY2xhc3MgVG9hc3RDb250cm9sbGVyIHtcclxuICAgIHByaXZhdGUgXyRtZFRvYXN0OiBhbmd1bGFyLm1hdGVyaWFsLklUb2FzdFNlcnZpY2U7XHJcbiAgICBwcml2YXRlIF9waXBFcnJvckRldGFpbHNEaWFsb2c7XHJcblxyXG4gICAgcHVibGljIG1lc3NhZ2U6IHN0cmluZztcclxuICAgIHB1YmxpYyBhY3Rpb25zOiBzdHJpbmdbXTtcclxuICAgIHB1YmxpYyB0b2FzdDogSVBpcFRvYXN0O1xyXG4gICAgcHVibGljIGFjdGlvbkxlbmdodDogbnVtYmVyO1xyXG4gICAgcHVibGljIHNob3dEZXRhaWxzOiBib29sZWFuO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCBcclxuICAgICAgICAkbWRUb2FzdDogYW5ndWxhci5tYXRlcmlhbC5JVG9hc3RTZXJ2aWNlLCBcclxuICAgICAgICB0b2FzdDogSVBpcFRvYXN0LCBcclxuICAgICAgICAkaW5qZWN0b3JcclxuICAgICAgICkge1xyXG4gICAgICAgICAgICB0aGlzLl9waXBFcnJvckRldGFpbHNEaWFsb2cgPSAkaW5qZWN0b3IuaGFzKCdwaXBFcnJvckRldGFpbHNEaWFsb2cnKSBcclxuICAgICAgICAgICAgICAgID8gJGluamVjdG9yLmdldCgncGlwRXJyb3JEZXRhaWxzRGlhbG9nJykgOiBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLl8kbWRUb2FzdCA9ICRtZFRvYXN0O1xyXG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2UgPSB0b2FzdC5tZXNzYWdlO1xyXG4gICAgICAgICAgICB0aGlzLmFjdGlvbnMgPSB0b2FzdC5hY3Rpb25zO1xyXG4gICAgICAgICAgICB0aGlzLnRvYXN0ID0gdG9hc3Q7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAodG9hc3QuYWN0aW9ucy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWN0aW9uTGVuZ2h0ID0gMDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWN0aW9uTGVuZ2h0ID0gdG9hc3QuYWN0aW9ucy5sZW5ndGggPT09IDEgPyB0b2FzdC5hY3Rpb25zWzBdLnRvU3RyaW5nKCkubGVuZ3RoIDogbnVsbDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5zaG93RGV0YWlscyA9IHRoaXMuX3BpcEVycm9yRGV0YWlsc0RpYWxvZyAhPSBudWxsO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAgcHVibGljIG9uRGV0YWlscygpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl8kbWRUb2FzdC5oaWRlKCk7XHJcbiAgICAgICAgaWYgKHRoaXMuX3BpcEVycm9yRGV0YWlsc0RpYWxvZykge1xyXG4gICAgICAgICAgICB0aGlzLl9waXBFcnJvckRldGFpbHNEaWFsb2cuc2hvdyhcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZXJyb3I6IHRoaXMudG9hc3QuZXJyb3IsXHJcbiAgICAgICAgICAgICAgICBvazogJ09rJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBhbmd1bGFyLm5vb3AsXHJcbiAgICAgICAgICAgIGFuZ3VsYXIubm9vcFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25BY3Rpb24oYWN0aW9uKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fJG1kVG9hc3QuaGlkZShcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGFjdGlvbjogYWN0aW9uLFxyXG4gICAgICAgICAgICBpZDogdGhpcy50b2FzdC5pZCxcclxuICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5tZXNzYWdlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG59XHJcblxyXG5pbnRlcmZhY2UgSVRvYXN0U2VydmljZSB7XHJcbiAgICBzaG93TmV4dFRvYXN0KCk6IHZvaWQ7XHJcbiAgICBzaG93VG9hc3QodG9hc3Q6IElQaXBUb2FzdCk6IHZvaWQ7XHJcbiAgICBhZGRUb2FzdCh0b2FzdCk6IHZvaWQ7XHJcbiAgICByZW1vdmVUb2FzdHModHlwZTogc3RyaW5nKTogdm9pZDtcclxuICAgIGdldFRvYXN0QnlJZChpZDogc3RyaW5nKTogSVBpcFRvYXN0O1xyXG4gICAgcmVtb3ZlVG9hc3RzQnlJZChpZDogc3RyaW5nKTogdm9pZDtcclxuICAgIG9uQ2xlYXJUb2FzdHMoKTogdm9pZDtcclxuICAgIHNob3dOb3RpZmljYXRpb24obWVzc2FnZTogc3RyaW5nLCBhY3Rpb25zOiBzdHJpbmdbXSwgc3VjY2Vzc0NhbGxiYWNrLCBjYW5jZWxDYWxsYmFjaywgaWQ6IHN0cmluZyk7XHJcbiAgICBzaG93TWVzc2FnZShtZXNzYWdlOiBzdHJpbmcsIHN1Y2Nlc3NDYWxsYmFjaywgY2FuY2VsQ2FsbGJhY2ssIGlkPzogc3RyaW5nKTtcclxuICAgIHNob3dFcnJvcihtZXNzYWdlOiBzdHJpbmcsIHN1Y2Nlc3NDYWxsYmFjaywgY2FuY2VsQ2FsbGJhY2ssIGlkOiBzdHJpbmcsIGVycm9yOiBhbnkpO1xyXG4gICAgaGlkZUFsbFRvYXN0cygpOiB2b2lkO1xyXG4gICAgY2xlYXJUb2FzdHModHlwZT86IHN0cmluZyk7XHJcbn1cclxuXHJcbmNsYXNzIFRvYXN0U2VydmljZSBpbXBsZW1lbnRzIElUb2FzdFNlcnZpY2Uge1xyXG4gICAgcHJpdmF0ZSBTSE9XX1RJTUVPVVQ6IG51bWJlciA9IDIwMDAwO1xyXG4gICAgcHJpdmF0ZSBTSE9XX1RJTUVPVVRfTk9USUZJQ0FUSU9OUzogbnVtYmVyID0gMjAwMDA7XHJcbiAgICBwcml2YXRlIHRvYXN0czogSVBpcFRvYXN0W10gPSBbXTtcclxuICAgIHByaXZhdGUgY3VycmVudFRvYXN0OiBhbnk7XHJcbiAgICBwcml2YXRlIHNvdW5kczogYW55ID0ge307XHJcblxyXG4gICAgcHJpdmF0ZSBfJG1kVG9hc3Q6IGFuZ3VsYXIubWF0ZXJpYWwuSVRvYXN0U2VydmljZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICAkcm9vdFNjb3BlOiBuZy5JUm9vdFNjb3BlU2VydmljZSwgXHJcbiAgICAgICAgJG1kVG9hc3Q6IGFuZ3VsYXIubWF0ZXJpYWwuSVRvYXN0U2VydmljZSkge1xyXG5cclxuICAgICAgICB0aGlzLl8kbWRUb2FzdCA9ICRtZFRvYXN0O1xyXG5cclxuICAgICAgICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3VjY2VzcycsICgpID0+IHt0aGlzLm9uU3RhdGVDaGFuZ2VTdWNjZXNzKCl9KTtcclxuICAgICAgICAkcm9vdFNjb3BlLiRvbigncGlwU2Vzc2lvbkNsb3NlZCcsICgpID0+IHt0aGlzLm9uQ2xlYXJUb2FzdHMoKX0pO1xyXG4gICAgICAgICRyb290U2NvcGUuJG9uKCdwaXBJZGVudGl0eUNoYW5nZWQnLCAoKSA9PiB7dGhpcy5vbkNsZWFyVG9hc3RzKCl9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2hvd05leHRUb2FzdCgpOiB2b2lkIHtcclxuICAgICAgICBsZXQgdG9hc3Q6IElQaXBUb2FzdDtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMudG9hc3RzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdG9hc3QgPSB0aGlzLnRvYXN0c1swXTtcclxuICAgICAgICAgICAgdGhpcy50b2FzdHMuc3BsaWNlKDAsIDEpO1xyXG4gICAgICAgICAgICB0aGlzLnNob3dUb2FzdCh0b2FzdCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgICAvLyBTaG93IHRvYXN0XHJcbiAgICAgcHVibGljIHNob3dUb2FzdCh0b2FzdDogSVBpcFRvYXN0KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50VG9hc3QgPSB0b2FzdDtcclxuXHJcbiAgICAgICAgdGhpcy5fJG1kVG9hc3Quc2hvdyh7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndG9hc3QvdG9hc3QuaHRtbCcsXHJcbiAgICAgICAgICAgIGhpZGVEZWxheTogdG9hc3QuZHVyYXRpb24gfHwgdGhpcy5TSE9XX1RJTUVPVVQsXHJcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYm90dG9tIGxlZnQnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBUb2FzdENvbnRyb2xsZXIsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICAgICAgbG9jYWxzOiB7XHJcbiAgICAgICAgICAgICAgICB0b2FzdDogdGhpcy5jdXJyZW50VG9hc3QsXHJcbiAgICAgICAgICAgICAgICBzb3VuZHM6IHRoaXMuc291bmRzXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKCBcclxuICAgICAgICAgICAgKGFjdGlvbjogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dUb2FzdE9rUmVzdWx0KGFjdGlvbik7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIChhY3Rpb246IHN0cmluZykgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zaG93VG9hc3RDYW5jZWxSZXN1bHQoYWN0aW9uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzaG93VG9hc3RDYW5jZWxSZXN1bHQoYWN0aW9uOiBzdHJpbmcpOnZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRUb2FzdC5jYW5jZWxDYWxsYmFjaykge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRUb2FzdC5jYW5jZWxDYWxsYmFjayhhY3Rpb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmN1cnJlbnRUb2FzdCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5zaG93TmV4dFRvYXN0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzaG93VG9hc3RPa1Jlc3VsdChhY3Rpb246IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRUb2FzdC5zdWNjZXNzQ2FsbGJhY2spIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50VG9hc3Quc3VjY2Vzc0NhbGxiYWNrKGFjdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY3VycmVudFRvYXN0ID0gbnVsbDtcclxuICAgICAgICB0aGlzLnNob3dOZXh0VG9hc3QoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkVG9hc3QodG9hc3QpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50VG9hc3QgJiYgdG9hc3QudHlwZSAhPT0gJ2Vycm9yJykge1xyXG4gICAgICAgICAgICB0aGlzLnRvYXN0cy5wdXNoKHRvYXN0KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnNob3dUb2FzdCh0b2FzdCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW1vdmVUb2FzdHModHlwZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IHJlc3VsdDogYW55W10gPSBbXTtcclxuICAgICAgICBfLmVhY2godGhpcy50b2FzdHMsICh0b2FzdCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIXRvYXN0LnR5cGUgfHwgdG9hc3QudHlwZSAhPT0gdHlwZSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2godG9hc3QpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy50b2FzdHMgPSBfLmNsb25lRGVlcChyZXN1bHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW1vdmVUb2FzdHNCeUlkKGlkOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICBfLnJlbW92ZSh0aGlzLnRvYXN0cywge2lkOiBpZH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRUb2FzdEJ5SWQoaWQ6IHN0cmluZyk6IElQaXBUb2FzdCB7XHJcbiAgICAgICAgcmV0dXJuIF8uZmluZCh0aGlzLnRvYXN0cywge2lkOiBpZH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvblN0YXRlQ2hhbmdlU3VjY2VzcygpIHt9XHJcblxyXG4gICAgcHVibGljIG9uQ2xlYXJUb2FzdHMoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5jbGVhclRvYXN0cyhudWxsKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2hvd05vdGlmaWNhdGlvbihtZXNzYWdlOiBzdHJpbmcsIGFjdGlvbnM6IHN0cmluZ1tdLCBzdWNjZXNzQ2FsbGJhY2ssIGNhbmNlbENhbGxiYWNrLCBpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5hZGRUb2FzdCh7XHJcbiAgICAgICAgICAgIGlkOiBpZCB8fCBudWxsLFxyXG4gICAgICAgICAgICB0eXBlOiAnbm90aWZpY2F0aW9uJyxcclxuICAgICAgICAgICAgbWVzc2FnZTogbWVzc2FnZSxcclxuICAgICAgICAgICAgYWN0aW9uczogYWN0aW9ucyB8fCBbJ29rJ10sXHJcbiAgICAgICAgICAgIHN1Y2Nlc3NDYWxsYmFjazogc3VjY2Vzc0NhbGxiYWNrLFxyXG4gICAgICAgICAgICBjYW5jZWxDYWxsYmFjazogY2FuY2VsQ2FsbGJhY2ssXHJcbiAgICAgICAgICAgIGR1cmF0aW9uOiB0aGlzLlNIT1dfVElNRU9VVF9OT1RJRklDQVRJT05TXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNob3dNZXNzYWdlKG1lc3NhZ2U6IHN0cmluZywgc3VjY2Vzc0NhbGxiYWNrLCBjYW5jZWxDYWxsYmFjaywgaWQ/OiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLmFkZFRvYXN0KHtcclxuICAgICAgICAgICAgaWQ6IGlkIHx8IG51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6ICdtZXNzYWdlJyxcclxuICAgICAgICAgICAgbWVzc2FnZTogbWVzc2FnZSxcclxuICAgICAgICAgICAgYWN0aW9uczogWydvayddLFxyXG4gICAgICAgICAgICBzdWNjZXNzQ2FsbGJhY2s6IHN1Y2Nlc3NDYWxsYmFjayxcclxuICAgICAgICAgICAgY2FuY2VsQ2FsbGJhY2s6IGNhbmNlbENhbGxiYWNrXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgIHB1YmxpYyBzaG93RXJyb3IobWVzc2FnZTogc3RyaW5nLCBzdWNjZXNzQ2FsbGJhY2ssIGNhbmNlbENhbGxiYWNrLCBpZDogc3RyaW5nLCBlcnJvcjogYW55KSB7XHJcbiAgICAgICAgdGhpcy5hZGRUb2FzdCh7XHJcbiAgICAgICAgICAgIGlkOiBpZCB8fCBudWxsLFxyXG4gICAgICAgICAgICBlcnJvcjogZXJyb3IsXHJcbiAgICAgICAgICAgIHR5cGU6ICdlcnJvcicsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UgfHwgJ1Vua25vd24gZXJyb3IuJyxcclxuICAgICAgICAgICAgYWN0aW9uczogWydvayddLFxyXG4gICAgICAgICAgICBzdWNjZXNzQ2FsbGJhY2s6IHN1Y2Nlc3NDYWxsYmFjayxcclxuICAgICAgICAgICAgY2FuY2VsQ2FsbGJhY2s6IGNhbmNlbENhbGxiYWNrXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGhpZGVBbGxUb2FzdHMoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fJG1kVG9hc3QuY2FuY2VsKCk7XHJcbiAgICAgICAgdGhpcy50b2FzdHMgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2xlYXJUb2FzdHModHlwZT86IHN0cmluZykge1xyXG4gICAgICAgIGlmICh0eXBlKSB7XHJcbiAgICAgICAgICAgIC8vIHBpcEFzc2VydC5pc1N0cmluZyh0eXBlLCAncGlwVG9hc3RzLmNsZWFyVG9hc3RzOiB0eXBlIHNob3VsZCBiZSBhIHN0cmluZycpO1xyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZVRvYXN0cyh0eXBlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl8kbWRUb2FzdC5jYW5jZWwoKTtcclxuICAgICAgICAgICAgdGhpcy50b2FzdHMgPSBbXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5cclxuKCgpID0+IHtcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdwaXBUb2FzdHMnLCBbJ25nTWF0ZXJpYWwnLCAncGlwQ29udHJvbHMuVHJhbnNsYXRlJ10pXHJcbiAgICAgICAgLnNlcnZpY2UoJ3BpcFRvYXN0cycsIFRvYXN0U2VydmljZSk7XHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbihtb2R1bGUpIHtcbnRyeSB7XG4gIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBDb250cm9scy5UZW1wbGF0ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcENvbnRyb2xzLlRlbXBsYXRlcycsIFtdKTtcbn1cbm1vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgnY29sb3JfcGlja2VyL2NvbG9yX3BpY2tlci5odG1sJyxcbiAgICAnPHVsIGNsYXNzPVwicGlwLWNvbG9yLXBpY2tlciB7e3ZtLmNsYXNzfX1cIiBwaXAtc2VsZWN0ZWQ9XCJ2bS5jdXJyZW50Q29sb3JJbmRleFwiIHBpcC1lbnRlci1zcGFjZS1wcmVzcz1cInZtLmVudGVyU3BhY2VQcmVzcygkZXZlbnQpXCI+PGxpIHRhYmluZGV4PVwiLTFcIiBuZy1yZXBlYXQ9XCJjb2xvciBpbiB2bS5jb2xvcnMgdHJhY2sgYnkgY29sb3JcIj48bWQtYnV0dG9uIHRhYmluZGV4PVwiLTFcIiBjbGFzcz1cIm1kLWljb24tYnV0dG9uIHBpcC1zZWxlY3RhYmxlXCIgbmctY2xpY2s9XCJ2bS5zZWxlY3RDb2xvcigkaW5kZXgpXCIgYXJpYS1sYWJlbD1cImNvbG9yXCIgbmctZGlzYWJsZWQ9XCJ2bS5kaXNhYmxlZCgpXCI+PG1kLWljb24gbmctc3R5bGU9XCJ7XFwnY29sb3JcXCc6IGNvbG9yfVwiIG1kLXN2Zy1pY29uPVwiaWNvbnM6e3sgY29sb3IgPT0gdm0uY3VycmVudENvbG9yID8gXFwnY2lyY2xlXFwnIDogXFwncmFkaW8tb2ZmXFwnIH19XCI+PC9tZC1pY29uPjwvbWQtYnV0dG9uPjwvbGk+PC91bD4nKTtcbn1dKTtcbn0pKCk7XG5cbihmdW5jdGlvbihtb2R1bGUpIHtcbnRyeSB7XG4gIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBDb250cm9scy5UZW1wbGF0ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcENvbnRyb2xzLlRlbXBsYXRlcycsIFtdKTtcbn1cbm1vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgncG9wb3Zlci9wb3BvdmVyLmh0bWwnLFxuICAgICc8ZGl2IG5nLWlmPVwidm0udGVtcGxhdGVVcmxcIiBjbGFzcz1cInBpcC1wb3BvdmVyIGZsZXggbGF5b3V0LWNvbHVtblwiIG5nLWNsaWNrPVwidm0ub25Qb3BvdmVyQ2xpY2soJGV2ZW50KVwiIG5nLWluY2x1ZGU9XCJ2bS50ZW1wbGF0ZVVybFwiPjwvZGl2PjxkaXYgbmctaWY9XCJ2bS50ZW1wbGF0ZVwiIGNsYXNzPVwicGlwLXBvcG92ZXJcIiBuZy1jbGljaz1cInZtLm9uUG9wb3ZlckNsaWNrKCRldmVudClcIj48L2Rpdj4nKTtcbn1dKTtcbn0pKCk7XG5cbihmdW5jdGlvbihtb2R1bGUpIHtcbnRyeSB7XG4gIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBDb250cm9scy5UZW1wbGF0ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcENvbnRyb2xzLlRlbXBsYXRlcycsIFtdKTtcbn1cbm1vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgncHJvZ3Jlc3Mvcm91dGluZ19wcm9ncmVzcy5odG1sJyxcbiAgICAnPGRpdiBjbGFzcz1cInBpcC1yb3V0aW5nLXByb2dyZXNzIGxheW91dC1jb2x1bW4gbGF5b3V0LWFsaWduLWNlbnRlci1jZW50ZXJcIiBuZy1zaG93PVwidm0uc2hvd1Byb2dyZXNzKClcIj48ZGl2IGNsYXNzPVwibG9hZGVyXCI+PHN2ZyBjbGFzcz1cImNpcmN1bGFyXCIgdmlld2JveD1cIjI1IDI1IDUwIDUwXCI+PGNpcmNsZSBjbGFzcz1cInBhdGhcIiBjeD1cIjUwXCIgY3k9XCI1MFwiIHI9XCIyMFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1taXRlcmxpbWl0PVwiMTBcIj48L2NpcmNsZT48L3N2Zz48L2Rpdj48aW1nIHNyYz1cIlwiIGhlaWdodD1cIjQwXCIgd2lkdGg9XCI0MFwiIGNsYXNzPVwicGlwLWltZ1wiPjxtZC1wcm9ncmVzcy1jaXJjdWxhciBtZC1kaWFtZXRlcj1cIjk2XCIgY2xhc3M9XCJmaXgtaWVcIj48L21kLXByb2dyZXNzLWNpcmN1bGFyPjwvZGl2PicpO1xufV0pO1xufSkoKTtcblxuKGZ1bmN0aW9uKG1vZHVsZSkge1xudHJ5IHtcbiAgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcENvbnRyb2xzLlRlbXBsYXRlcycpO1xufSBjYXRjaCAoZSkge1xuICBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgncGlwQ29udHJvbHMuVGVtcGxhdGVzJywgW10pO1xufVxubW9kdWxlLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCd0b2FzdC90b2FzdC5odG1sJyxcbiAgICAnPG1kLXRvYXN0IGNsYXNzPVwibWQtYWN0aW9uIHBpcC10b2FzdFwiIG5nLWNsYXNzPVwie1xcJ3BpcC1lcnJvclxcJzogdm0udG9hc3QudHlwZT09XFwnZXJyb3JcXCcsIFxcJ3BpcC1jb2x1bW4tdG9hc3RcXCc6IHZtLnRvYXN0LmFjdGlvbnMubGVuZ3RoID4gMSB8fCB2bS5hY3Rpb25MZW5naHQgPiA0LCBcXCdwaXAtbm8tYWN0aW9uLXRvYXN0XFwnOiB2bS5hY3Rpb25MZW5naHQgPT0gMH1cIiBzdHlsZT1cImhlaWdodDppbml0aWFsOyBtYXgtaGVpZ2h0OiBpbml0aWFsO1wiPjxzcGFuIGNsYXNzPVwiZmxleC12YXIgcGlwLXRleHRcIiBuZy1iaW5kLWh0bWw9XCJ2bS5tZXNzYWdlXCI+PC9zcGFuPjxkaXYgY2xhc3M9XCJsYXlvdXQtcm93IGxheW91dC1hbGlnbi1lbmQtc3RhcnQgcGlwLWFjdGlvbnNcIiBuZy1pZj1cInZtLmFjdGlvbnMubGVuZ3RoID4gMCB8fCAodm0udG9hc3QudHlwZT09XFwnZXJyb3JcXCcgJiYgdm0udG9hc3QuZXJyb3IpXCI+PGRpdiBjbGFzcz1cImZsZXhcIiBuZy1pZj1cInZtLnRvYXN0LmFjdGlvbnMubGVuZ3RoID4gMVwiPjwvZGl2PjxtZC1idXR0b24gY2xhc3M9XCJmbGV4LWZpeGVkIHBpcC10b2FzdC1idXR0b25cIiBuZy1pZj1cInZtLnRvYXN0LnR5cGU9PVxcJ2Vycm9yXFwnICYmIHZtLnRvYXN0LmVycm9yICYmIHZtLnNob3dEZXRhaWxzXCIgbmctY2xpY2s9XCJ2bS5vbkRldGFpbHMoKVwiPkRldGFpbHM8L21kLWJ1dHRvbj48bWQtYnV0dG9uIGNsYXNzPVwiZmxleC1maXhlZCBwaXAtdG9hc3QtYnV0dG9uXCIgbmctY2xpY2s9XCJ2bS5vbkFjdGlvbihhY3Rpb24pXCIgbmctcmVwZWF0PVwiYWN0aW9uIGluIHZtLmFjdGlvbnNcIiBhcmlhLWxhYmVsPVwie3s6OmFjdGlvbnwgdHJhbnNsYXRlfX1cIj57ezo6YWN0aW9ufCB0cmFuc2xhdGV9fTwvbWQtYnV0dG9uPjwvZGl2PjwvbWQtdG9hc3Q+Jyk7XG59XSk7XG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1waXAtd2VidWktY29udHJvbHMtaHRtbC5taW4uanMubWFwXG4iXX0=