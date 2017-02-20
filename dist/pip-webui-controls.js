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
        console.log($scope, $attrs);
        this._type = $parse($attrs.pipAnimationType)($scope);
        this._interval = $parse($attrs.pipAnimationInterval)($scope);
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
                sliderIndex: '=pipImageIndex'
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29sb3JfcGlja2VyL2NvbG9yX3BpY2tlci50cyIsInNyYy9jb250cm9scy50cyIsInNyYy9kZXBlbmRlbmNpZXMvdHJhbnNsYXRlLnRzIiwic3JjL2ltYWdlX3NsaWRlci9pbWFnZV9zbGlkZXIudHMiLCJzcmMvaW1hZ2Vfc2xpZGVyL2ltYWdlX3NsaWRlcl9zZXJ2aWNlLnRzIiwic3JjL2ltYWdlX3NsaWRlci9zbGlkZXJfYnV0dG9uLnRzIiwic3JjL2ltYWdlX3NsaWRlci9zbGlkZXJfaW5kaWNhdG9yLnRzIiwic3JjL21hcmtkb3duL21hcmtkb3duLnRzIiwic3JjL3BvcG92ZXIvcG9wb3Zlci50cyIsInNyYy9wb3BvdmVyL3BvcG92ZXJfc2VydmljZS50cyIsInNyYy9wcm9ncmVzcy9yb3V0aW5nX3Byb2dyZXNzLnRzIiwic3JjL3RvYXN0L3RvYXN0cy50cyIsInRlbXAvcGlwLXdlYnVpLWNvbnRyb2xzLWh0bWwubWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ2FBO0lBWUksK0JBQ0ksTUFBaUIsRUFDakIsUUFBUSxFQUNSLE1BQU0sRUFDTixRQUFRO1FBQ0osSUFBSSxjQUFjLEdBQUcsQ0FBQyxRQUFRLEVBQUUsWUFBWSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUM1RixJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztRQUMxQixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUV0QixJQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsR0FBRyxjQUFjLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3BJLElBQUksQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLElBQUksQ0FBQztRQUNqRCxJQUFJLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdELElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDaEUsSUFBSSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7SUFFL0MsQ0FBQztJQUVNLHdDQUFRLEdBQWY7UUFDSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNsQixNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQzdCLENBQUM7UUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFBQSxDQUFDO0lBRU0sMkNBQVcsR0FBbEIsVUFBbUIsS0FBYTtRQUFoQyxpQkFXQTtRQVZHLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFBQyxNQUFNLENBQUM7UUFBQyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxLQUFLLENBQUM7UUFDL0IsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxTQUFTLENBQUM7WUFDWCxLQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQzFCLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDbkIsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3ZCLENBQUM7SUFDTCxDQUFDO0lBQUEsQ0FBQztJQUVLLCtDQUFlLEdBQXRCLFVBQXVCLEtBQUs7UUFDeEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUFBLENBQUM7SUFFTiw0QkFBQztBQUFELENBdkRBLEFBdURDLElBQUE7QUF2RFksc0RBQXFCO0FBeURsQyxDQUFDO0lBQ0csd0JBQXdCLE1BQVc7UUFDL0IsVUFBVSxDQUFDO1FBRVQsTUFBTSxDQUFDO1lBQ0QsUUFBUSxFQUFFLElBQUk7WUFDZCxLQUFLLEVBQUU7Z0JBQ0gsVUFBVSxFQUFFLEdBQUc7Z0JBQ2YsTUFBTSxFQUFFLFlBQVk7Z0JBQ3BCLFlBQVksRUFBRSxVQUFVO2dCQUN4QixXQUFXLEVBQUUsV0FBVzthQUMzQjtZQUNELFdBQVcsRUFBRSxnQ0FBZ0M7WUFDN0MsVUFBVSxFQUFFLHFCQUFxQjtZQUNqQyxZQUFZLEVBQUUsSUFBSTtTQUNyQixDQUFDO0lBQ1YsQ0FBQztJQUdELE9BQU87U0FDRixNQUFNLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1NBQ25ELFNBQVMsQ0FBQyxnQkFBZ0IsRUFBRSxjQUFjLENBQUMsQ0FBQztBQUdyRCxDQUFDLENBQUMsRUFBRSxDQUFDOztBQzVGTCxDQUFDO0lBQ0csWUFBWSxDQUFDO0lBRWIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUU7UUFDMUIsYUFBYTtRQUNiLGdCQUFnQjtRQUNoQixvQkFBb0I7UUFDcEIsWUFBWTtRQUNaLGdCQUFnQjtRQUNoQixXQUFXO1FBQ1gsdUJBQXVCO0tBQzFCLENBQUMsQ0FBQztBQUVQLENBQUMsQ0FBQyxFQUFFLENBQUM7O0FDYkwsQ0FBQztJQUNHLFlBQVksQ0FBQztJQUViLElBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsdUJBQXVCLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFFN0QsVUFBVSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsVUFBVSxTQUFTO1FBQzlDLElBQUksWUFBWSxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDO2NBQzFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBRTNDLE1BQU0sQ0FBQyxVQUFVLEdBQUc7WUFDaEIsTUFBTSxDQUFDLFlBQVksR0FBSSxZQUFZLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFDcEUsQ0FBQyxDQUFBO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFUCxDQUFDLENBQUMsRUFBRSxDQUFDOztBQ3lHTDtJQW1CSSxrQ0FDSSxNQUFpQixFQUNqQixRQUFRLEVBQ1IsTUFBTSxFQUNOLE1BQU0sRUFDTixRQUFpQyxFQUNqQyxTQUFtQyxFQUNuQyxlQUFlO1FBUG5CLGlCQTRDQztRQXpETyxXQUFNLEdBQVcsQ0FBQyxDQUFDO1FBSW5CLHFCQUFnQixHQUFHLElBQUksQ0FBQztRQUt6QixlQUFVLEdBQVcsQ0FBQyxDQUFDO1FBYTFCLElBQUksQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3pDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzVCLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3JELElBQUksQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzdELElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO1FBQzVCLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDO1FBRXhDLFFBQVEsQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUN0QyxRQUFRLENBQUMsUUFBUSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUVqRCxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFFaEIsUUFBUSxDQUFDO1lBQ0wsS0FBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUM7WUFDckQsRUFBRSxDQUFDLENBQUMsS0FBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDMUIsQ0FBQyxDQUFDLEtBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDNUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQztZQUN6QixlQUFlLENBQUMsT0FBTyxDQUFDLEtBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSSxDQUFDLE9BQU8sRUFBRSxLQUFJLENBQUMsTUFBTSxFQUFFLEtBQUksQ0FBQyxTQUFTLEVBQUUsS0FBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ2hHLEtBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSSxDQUFDLFNBQVMsQ0FBQztZQUFBLENBQUM7WUFDOUIsTUFBTSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEtBQUksQ0FBQyxNQUFNLENBQUM7WUFDcEMsS0FBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3BCLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUVSLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQUMsZUFBZSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFBO1FBQUMsQ0FBQztRQUVwRSxRQUFRLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRTtZQUNwQixLQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDcEIsZUFBZSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDNUMsQ0FBQyxDQUFDLENBQUM7SUFFUCxDQUFDO0lBRU0sNENBQVMsR0FBaEI7UUFDSSxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsS0FBSyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDL0UsSUFBSSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUM7UUFDekIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ3RCLENBQUM7SUFFTSw0Q0FBUyxHQUFoQjtRQUNJLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUN2QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDakYsSUFBSSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUM7UUFDekIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ3RCLENBQUM7SUFFTSxpREFBYyxHQUFyQixVQUFzQixTQUFpQjtRQUNuQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xCLEVBQUUsQ0FBQyxDQUFDLFNBQVMsS0FBSyxJQUFJLENBQUMsTUFBTSxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25FLE1BQU0sQ0FBQztRQUNYLENBQUM7UUFFRCxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQzVELElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUN0QixDQUFDO0lBRU8sMkNBQVEsR0FBaEI7UUFDSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQztZQUFDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUNuRSxDQUFDO0lBRU8sZ0RBQWEsR0FBckI7UUFBQSxpQkFNQztRQUxHLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUNqQyxLQUFJLENBQUMsU0FBUyxHQUFHLEtBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxLQUFLLEtBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxLQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztZQUMvRSxLQUFJLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQztZQUN6QixLQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDdEIsQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVPLCtDQUFZLEdBQXBCO1FBQ0ksSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFTyxrREFBZSxHQUF2QjtRQUNJLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNwQixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUVMLCtCQUFDO0FBQUQsQ0FoSEEsQUFnSEMsSUFBQTtBQUlELENBQUM7SUFFRztRQUNJLE1BQU0sQ0FBQztZQUNILEtBQUssRUFBRTtnQkFDSCxXQUFXLEVBQUUsZ0JBQWdCO2FBQ2hDO1lBQ0QsVUFBVSxFQUFFLHdCQUF3QjtZQUNwQyxZQUFZLEVBQUUsSUFBSTtTQUNyQixDQUFDO0lBQ04sQ0FBQztJQUdELE9BQU87U0FDRixNQUFNLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxvQkFBb0IsRUFBRSx3QkFBd0IsQ0FBQyxDQUFDO1NBQzdGLFNBQVMsQ0FBQyxnQkFBZ0IsRUFBRSxjQUFjLENBQUMsQ0FBQztBQUVyRCxDQUFDLENBQUMsRUFBRSxDQUFDOztBQ25QTDtJQUtJLDRCQUFZLFFBQWlDO1FBSHJDLHVCQUFrQixHQUFXLEdBQUcsQ0FBQztRQUNqQyxhQUFRLEdBQUcsRUFBRSxDQUFDO1FBR2xCLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO0lBQzlCLENBQUM7SUFFTSwyQ0FBYyxHQUFyQixVQUFzQixRQUFnQixFQUFFLFdBQVc7UUFDL0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDaEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxXQUFXLENBQUM7SUFDMUMsQ0FBQztJQUVNLHlDQUFZLEdBQW5CLFVBQW9CLFFBQWdCO1FBQ2hDLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRU0sMkNBQWMsR0FBckIsVUFBc0IsUUFBZ0I7UUFDbEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN6QyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRU0seUNBQVksR0FBbkIsVUFBb0IsU0FBUyxFQUFFLFNBQVM7UUFDcEMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUUvQixJQUFJLENBQUMsU0FBUyxDQUFDO1lBQ1gsU0FBUyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzVFLFNBQVMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzNELENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNaLENBQUM7SUFFTSx5Q0FBWSxHQUFuQixVQUFvQixTQUFTLEVBQUUsU0FBUztRQUNwQyxJQUFJLENBQUMsU0FBUyxDQUFDO1lBQ1gsU0FBUyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDcEQsU0FBUyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2hGLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNaLENBQUM7SUFFTSxvQ0FBTyxHQUFkLFVBQWUsSUFBWSxFQUFFLE1BQWEsRUFBRSxRQUFnQixFQUFFLFNBQWlCLEVBQUUsU0FBaUI7UUFDOUYsSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUMvQixVQUFVLEdBQVcsU0FBUyxFQUM5QixTQUFTLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBRXRDLEVBQUUsQ0FBQyxDQUFDLElBQUksS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUVsRixFQUFFLENBQUMsQ0FBQyxTQUFTLElBQUksQ0FBQyxTQUFTLEtBQUssTUFBTSxJQUFJLFNBQVMsS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzlELEVBQUUsQ0FBQyxDQUFDLFNBQVMsS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDO29CQUN2QixJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztnQkFDNUMsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztnQkFDNUMsQ0FBQztZQUNMLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixFQUFFLENBQUMsQ0FBQyxTQUFTLElBQUksU0FBUyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUM7b0JBQ3BDLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO2dCQUM1QyxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNKLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO2dCQUM1QyxDQUFDO1lBQ0wsQ0FBQztRQUNMLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLFNBQVMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3ZELFNBQVMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3hELENBQUM7SUFDTCxDQUFDO0lBRUwseUJBQUM7QUFBRCxDQWxFQSxBQWtFQyxJQUFBO0FBR0QsQ0FBQztJQUNHLFlBQVksQ0FBQztJQUNiLE9BQU87U0FDRixNQUFNLENBQUMsd0JBQXdCLEVBQUUsRUFBRSxDQUFDO1NBQ3BDLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO0FBRXhELENBQUMsQ0FBQyxFQUFFLENBQUM7O0FDcEZMLENBQUM7SUFDRyxZQUFZLENBQUM7SUFFYixJQUFJLFVBQVUsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLGlCQUFpQixFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBRXZELFVBQVUsQ0FBQyxTQUFTLENBQUMsaUJBQWlCLEVBQ2xDO1FBQ0ksTUFBTSxDQUFDO1lBQ0gsS0FBSyxFQUFFLEVBQUU7WUFDVCxVQUFVLEVBQUUsVUFBVSxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsZUFBZTtnQkFDbkUsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFDM0MsUUFBUSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBRWxELFFBQVEsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFO29CQUNqQixFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7d0JBQ3JCLE1BQU0sQ0FBQztvQkFDWCxDQUFDO29CQUVELGVBQWUsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDO2dCQUNsRSxDQUFDLENBQUMsQ0FBQztZQUNQLENBQUM7U0FDSixDQUFDO0lBQ04sQ0FBQyxDQUNKLENBQUM7QUFFTixDQUFDLENBQUMsRUFBRSxDQUFDOztBQ3pCTCxDQUFDO0lBQ0csWUFBWSxDQUFDO0lBRWIsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUUxRCxVQUFVLENBQUMsU0FBUyxDQUFDLG9CQUFvQixFQUNyQztRQUNJLE1BQU0sQ0FBQztZQUNILEtBQUssRUFBRSxLQUFLO1lBQ1osVUFBVSxFQUFFLFVBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLGVBQWU7Z0JBQzFELElBQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQzdDLE9BQU8sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUVoRCxRQUFRLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztnQkFDbEMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUc7b0JBQ2xCLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxJQUFJLE9BQU8sSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDdEMsTUFBTSxDQUFDO29CQUNYLENBQUM7b0JBQ0QsZUFBZSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUN4RSxDQUFDLENBQUMsQ0FBQztZQUNQLENBQUM7U0FDSixDQUFDO0lBQ04sQ0FBQyxDQUNKLENBQUM7QUFFTixDQUFDLENBQUMsRUFBRSxDQUFDOztBQ3ZCTCxDQUFDO0lBQ0csWUFBWSxDQUFDO0lBRWIsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO0lBRS9ELFVBQVUsQ0FBQyxHQUFHLENBQUMsVUFBVSxTQUFTO1FBQzlCLElBQUksWUFBWSxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsR0FBRyxJQUFJLENBQUM7UUFFeEYsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUNmLFlBQVksQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFO2dCQUMvQixzQkFBc0IsRUFBRSxjQUFjO2dCQUN0QyxXQUFXLEVBQUUsV0FBVztnQkFDeEIsV0FBVyxFQUFFLFdBQVc7Z0JBQ3hCLFVBQVUsRUFBRSxVQUFVO2dCQUN0QixVQUFVLEVBQUUsVUFBVTtnQkFDdEIsTUFBTSxFQUFFLE1BQU07YUFDakIsQ0FBQyxDQUFDO1lBQ0gsWUFBWSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUU7Z0JBQy9CLHNCQUFzQixFQUFFLFdBQVc7Z0JBQ25DLFdBQVcsRUFBRSxRQUFRO2dCQUNyQixXQUFXLEVBQUUsV0FBVztnQkFDeEIsVUFBVSxFQUFFLGFBQWE7Z0JBQ3pCLFVBQVUsRUFBRSxpQkFBaUI7Z0JBQzdCLE1BQU0sRUFBRSxPQUFPO2FBQ2xCLENBQUMsQ0FBQztRQUNQLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFVBQVUsQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUM5QixVQUFVLE1BQU0sRUFBRSxTQUFTO1FBQ3ZCLElBQUksWUFBWSxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsR0FBRyxJQUFJLENBQUM7UUFFeEYsTUFBTSxDQUFDO1lBQ0gsUUFBUSxFQUFFLElBQUk7WUFDZCxLQUFLLEVBQUUsS0FBSztZQUNaLElBQUksRUFBRSxVQUFVLE1BQVcsRUFBRSxRQUFRLEVBQUUsTUFBVztnQkFDOUMsSUFDSSxVQUFVLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFDbkMsVUFBVSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQ25DLFdBQVcsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUU5Qyw2QkFBNkIsS0FBSztvQkFDOUIsSUFBSSxZQUFZLEdBQUcsRUFBRSxFQUNqQixXQUFXLEdBQUcsRUFBRSxDQUFDO29CQUVyQixDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxVQUFVLE1BQU07d0JBQzFCLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksTUFBTSxDQUFDLElBQUksS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDOzRCQUN4QyxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxZQUFZLENBQUMsQ0FBQyxDQUFDO2dDQUM1QyxZQUFZLEdBQUcsWUFBWSxDQUFDLFNBQVMsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDOzRCQUNsRSxDQUFDOzRCQUVELEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0NBQ3ZDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO2dDQUM5QixZQUFZLElBQUksV0FBVyxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsSUFBSSxHQUFHLEdBQUcsQ0FBQztnQ0FDcEQsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDO29DQUNiLFlBQVksSUFBSSxZQUFZLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQzs0QkFDNUQsQ0FBQzt3QkFDTCxDQUFDO29CQUNMLENBQUMsQ0FBQyxDQUFDO29CQUVILE1BQU0sQ0FBQyxZQUFZLENBQUM7Z0JBQ3hCLENBQUM7Z0JBRUQsbUJBQW1CLEtBQUs7b0JBQ3BCLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUM7d0JBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztvQkFDaEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7d0JBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztvQkFDekIsS0FBSyxHQUFHLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztvQkFDdkMsTUFBTSxDQUFDLEtBQUssSUFBSSxHQUFHLElBQUksS0FBSyxJQUFJLE1BQU0sQ0FBQztnQkFDM0MsQ0FBQztnQkFFRCxrQkFBa0IsS0FBSztvQkFDbkIsSUFBSSxVQUFVLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsR0FBRyxDQUFDO29CQUVoRCxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDbkIsR0FBRyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLFVBQVUsSUFBUzs0QkFDbkMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssTUFBTSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUM7d0JBQzdDLENBQUMsQ0FBQyxDQUFDO3dCQUVILFVBQVUsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLElBQUksR0FBRyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDN0QsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDSixVQUFVLEdBQUcsS0FBSyxDQUFDO29CQUN2QixDQUFDO29CQUVELFNBQVMsR0FBRyxNQUFNLENBQUMsWUFBWSxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztvQkFDN0QsU0FBUyxHQUFHLFNBQVMsSUFBSSxVQUFVLElBQUksVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7b0JBQzdELE9BQU8sR0FBRzt3QkFDTixHQUFHLEVBQUUsSUFBSTt3QkFDVCxNQUFNLEVBQUUsSUFBSTt3QkFDWixNQUFNLEVBQUUsSUFBSTt3QkFDWixRQUFRLEVBQUUsSUFBSTt3QkFDZCxRQUFRLEVBQUUsSUFBSTt3QkFDZCxVQUFVLEVBQUUsSUFBSTt3QkFDaEIsV0FBVyxFQUFFLEtBQUs7cUJBQ3JCLENBQUM7b0JBQ0YsVUFBVSxHQUFHLE1BQU0sQ0FBQyxVQUFVLElBQUksRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO29CQUMvQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO3dCQUNaLE1BQU0sR0FBRyxHQUFHLEdBQUcsV0FBVyxFQUFFLENBQUM7b0JBQ2pDLENBQUM7b0JBRUQsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxTQUFTLEdBQUcsVUFBVSxFQUFFLEdBQUcsOEJBQThCO3dCQUM3RSx3Q0FBd0MsR0FBRyxNQUFNLEdBQUcsTUFBTTswQkFDcEQsbURBQW1ELEdBQUcsTUFBTSxHQUFHLE1BQU0sR0FBRyxVQUFVLEVBQUU7MEJBQ3BGLDZCQUE2QixHQUFHLEdBQUcsQ0FBQyxHQUFHLFVBQVUsR0FBRyxRQUFRLENBQUMsQ0FBQztvQkFDeEUsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO29CQUMzQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUM7d0JBQzdCLFFBQVEsQ0FBQyxNQUFNLENBQUMsd0NBQXdDLENBQUMsQ0FBQztvQkFDOUQsQ0FBQztnQkFDTCxDQUFDO2dCQUdELFFBQVEsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFHN0IsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzlCLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLFVBQVUsUUFBUTt3QkFDeEMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUN2QixDQUFDLENBQUMsQ0FBQztnQkFDUCxDQUFDO2dCQUVELE1BQU0sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUU7b0JBQzNCLFFBQVEsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDakMsQ0FBQyxDQUFDLENBQUM7Z0JBR0gsUUFBUSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUN0QyxDQUFDO1NBQ0osQ0FBQztJQUNOLENBQUMsQ0FDSixDQUFDO0FBRU4sQ0FBQyxDQUFDLEVBQUUsQ0FBQzs7O0FDbklMO0lBZ0JJLDJCQUNJLE1BQWlCLEVBQ2pCLFVBQVUsRUFDVixRQUFRLEVBQ1IsUUFBUSxFQUNSLFFBQVE7UUFMWixpQkFpQ0M7UUF6Qk0sSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7UUFDMUIsSUFBSSxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsV0FBVyxDQUFDO1FBQ2hELElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQztRQUMxQyxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUM7UUFDeEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDO1FBQ3hDLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFVBQVUsQ0FBQztRQUN6QyxJQUFJLENBQUMsY0FBYyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxjQUFjLENBQUM7UUFDdEQsSUFBSSxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUNsRCxJQUFJLENBQUMsZUFBZSxDQUFDLEVBQUUsQ0FBQyxzQkFBc0IsRUFBQyxjQUFPLEtBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQSxDQUFBLENBQUMsQ0FBQyxDQUFDO1FBQzdFLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxVQUFVLEtBQUssS0FBSyxHQUFHLGdCQUFnQixHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBRTdGLFFBQVEsQ0FBQztZQUNKLEtBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNoQixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDNUIsS0FBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUMzRCxRQUFRLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDdkQsQ0FBQztZQUVELEtBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNqQixDQUFDLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyxjQUFRLEtBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUM1QyxVQUFVLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLGNBQVEsS0FBSSxDQUFDLFFBQVEsRUFBRSxDQUFBLENBQUEsQ0FBQyxDQUFDLENBQUM7UUFDN0QsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxjQUFRLEtBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRW5ELENBQUM7SUFFTSx5Q0FBYSxHQUFwQjtRQUNJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUMxQixDQUFDO1FBQ0QsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3hCLENBQUM7SUFFTSx3Q0FBWSxHQUFuQjtRQUFBLGlCQUtDO1FBSkcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDM0MsSUFBSSxDQUFDLFNBQVMsQ0FBQztZQUNYLEtBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDbEMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ1osQ0FBQztJQUVNLDBDQUFjLEdBQXJCLFVBQXNCLEVBQUU7UUFDcEIsRUFBRSxDQUFDLGVBQWUsRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFHTyxnQ0FBSSxHQUFaO1FBQ0ksSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDeEMsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDbkMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDZixJQUFJLENBQUMsU0FBUyxDQUFDO2dCQUNYLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUN4QixDQUFDLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3JCLENBQUM7SUFDTCxDQUFDO0lBRU8sb0NBQVEsR0FBaEI7UUFDSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNmLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQ3pCLEdBQUcsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQ3RCLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQ3ZCLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQ3pCLFFBQVEsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQzlCLFNBQVMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQ2hDLE9BQU8sR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUV4RCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNOLE9BQU87cUJBQ0YsR0FBRyxDQUFDLFdBQVcsRUFBRSxRQUFRLEdBQUcsQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO3FCQUNsRCxHQUFHLENBQUMsWUFBWSxFQUFFLFNBQVMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztxQkFDekQsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxLQUFLLEVBQUUsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDO3FCQUNuRCxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxHQUFHLEdBQUcsTUFBTSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQzNDLENBQUM7UUFDTCxDQUFDO0lBQ0wsQ0FBQztJQUVPLG9DQUFRLEdBQWhCO1FBQ0ksSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDekYsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUN0QixDQUFDO0lBRU8sc0NBQVUsR0FBbEI7UUFDSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFBQyxNQUFNLENBQUM7UUFBQyxDQUFDO1FBQ3JDLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxFQUN2RCxLQUFLLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsRUFDbEMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQ3BDLE9BQU8sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxFQUN0QyxhQUFhLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN0RixPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQ2pHLENBQUM7SUFDTCx3QkFBQztBQUFELENBbkhBLEFBbUhDLElBQUE7QUFuSFksOENBQWlCO0FBcUg5QixDQUFDO0lBQ0csb0JBQW9CLE1BQVc7UUFDM0IsVUFBVSxDQUFDO1FBRVQsTUFBTSxDQUFDO1lBQ0QsUUFBUSxFQUFFLElBQUk7WUFDZCxLQUFLLEVBQUUsSUFBSTtZQUNYLFdBQVcsRUFBRSxzQkFBc0I7WUFDbkMsVUFBVSxFQUFFLGlCQUFpQjtZQUM3QixZQUFZLEVBQUUsSUFBSTtTQUNyQixDQUFDO0lBQ1YsQ0FBQztJQUdELE9BQU87U0FDRixNQUFNLENBQUMsWUFBWSxFQUFFLENBQUMsb0JBQW9CLENBQUMsQ0FBQztTQUM1QyxTQUFTLENBQUMsWUFBWSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBRzdDLENBQUMsQ0FBQyxFQUFFLENBQUM7OztBQ3pJTDtJQVNJLHdCQUNJLFFBQVEsRUFDUixVQUFVLEVBQ1YsUUFBUTtRQUVMLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO1FBQzFCLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO1FBQzlCLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO1FBQzFCLElBQUksQ0FBQyxlQUFlLEdBQUcsd0ZBQXdGO1lBQzFHLHdFQUF3RSxDQUFDO0lBQ3JGLENBQUM7SUFFTSw2QkFBSSxHQUFYLFVBQVksQ0FBQztRQUNULElBQUksT0FBTyxFQUFFLEtBQWdCLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQztRQUUvQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3BCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFBQyxNQUFNLENBQUM7UUFBQyxDQUFDO1FBQ3ZELElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNaLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2hDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ3JDLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxNQUFNLENBQUM7UUFDekIsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDaEMsT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3RELE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUVNLDZCQUFJLEdBQVg7UUFDSSxJQUFJLGVBQWUsR0FBRyxDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUNqRCxlQUFlLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxTQUFTLENBQUM7WUFDWCxlQUFlLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDN0IsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ1osQ0FBQztJQUVNLCtCQUFNLEdBQWI7UUFDSSxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFDTCxxQkFBQztBQUFELENBOUNBLEFBOENDLElBQUE7QUE5Q1ksd0NBQWM7QUFpRDNCLENBQUM7SUFDRyxPQUFPO1NBQ0YsTUFBTSxDQUFDLG9CQUFvQixFQUFFLEVBQUUsQ0FBQztTQUNoQyxPQUFPLENBQUMsbUJBQW1CLEVBQUUsY0FBYyxDQUFDLENBQUM7QUFDdEQsQ0FBQyxDQUFDLEVBQUUsQ0FBQzs7QUNyREw7SUFNSSwyQkFDSSxNQUFpQixFQUNqQixRQUFRO1FBR1IsSUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxZQUFZLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFBO1FBQzFDLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBRTdCLENBQUM7SUFFTSw2Q0FBaUIsR0FBeEI7UUFDSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNmLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDMUMsQ0FBQztJQUNMLENBQUM7SUFFTCx3QkFBQztBQUFELENBeEJBLEFBd0JDLElBQUE7QUFHRCxDQUFDO0lBRUc7UUFDSSxNQUFNLENBQUM7WUFDSCxRQUFRLEVBQUUsSUFBSTtZQUNkLE9BQU8sRUFBRSxJQUFJO1lBQ2IsS0FBSyxFQUFFO2dCQUNDLFlBQVksRUFBRSxHQUFHO2dCQUNqQixPQUFPLEVBQUUsR0FBRzthQUNmO1lBQ0wsV0FBVyxFQUFFLGdDQUFnQztZQUM3QyxVQUFVLEVBQUUsaUJBQWlCO1lBQzdCLFlBQVksRUFBRSxJQUFJO1NBQ3JCLENBQUM7SUFDTixDQUFDO0lBR0QsT0FBTztTQUNGLE1BQU0sQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLFlBQVksQ0FBQyxDQUFDO1NBQzVDLFNBQVMsQ0FBQyxvQkFBb0IsRUFBRSxlQUFlLENBQUMsQ0FBQztBQUUxRCxDQUFDLENBQUMsRUFBRSxDQUFDOztBQ3JDTDtJQVVJLHlCQUNJLFFBQXdDLEVBQ3hDLEtBQWdCLEVBQ2hCLFNBQVM7UUFFTCxJQUFJLENBQUMsc0JBQXNCLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQztjQUM5RCxTQUFTLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ3BELElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO1FBQzFCLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztRQUM3QixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFDN0IsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFFbkIsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3QixJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQztRQUMxQixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDL0YsQ0FBQztRQUVELElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixJQUFJLElBQUksQ0FBQztJQUUvRCxDQUFDO0lBRU8sbUNBQVMsR0FBaEI7UUFDRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3RCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUM7WUFDOUIsSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FDaEM7Z0JBQ0ksS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSztnQkFDdkIsRUFBRSxFQUFFLElBQUk7YUFDWCxFQUNELE9BQU8sQ0FBQyxJQUFJLEVBQ1osT0FBTyxDQUFDLElBQUksQ0FDWCxDQUFDO1FBQ04sQ0FBQztJQUNMLENBQUM7SUFFTSxrQ0FBUSxHQUFmLFVBQWdCLE1BQU07UUFDbEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQ25CO1lBQ0ksTUFBTSxFQUFFLE1BQU07WUFDZCxFQUFFLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ2pCLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztTQUN4QixDQUFDLENBQUM7SUFFUCxDQUFDO0lBQ0wsc0JBQUM7QUFBRCxDQXZEQSxBQXVEQyxJQUFBO0FBaUJEO0lBU0ksc0JBQ0ksVUFBZ0MsRUFDaEMsUUFBd0M7UUFGNUMsaUJBU0M7UUFqQk8saUJBQVksR0FBVyxLQUFLLENBQUM7UUFDN0IsK0JBQTBCLEdBQVcsS0FBSyxDQUFDO1FBQzNDLFdBQU0sR0FBZ0IsRUFBRSxDQUFDO1FBRXpCLFdBQU0sR0FBUSxFQUFFLENBQUM7UUFRckIsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7UUFFMUIsVUFBVSxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsRUFBRSxjQUFPLEtBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFBLENBQUEsQ0FBQyxDQUFDLENBQUM7UUFDM0UsVUFBVSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxjQUFPLEtBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQSxDQUFBLENBQUMsQ0FBQyxDQUFDO1FBQ2pFLFVBQVUsQ0FBQyxHQUFHLENBQUMsb0JBQW9CLEVBQUUsY0FBTyxLQUFJLENBQUMsYUFBYSxFQUFFLENBQUEsQ0FBQSxDQUFDLENBQUMsQ0FBQztJQUN2RSxDQUFDO0lBRU0sb0NBQWEsR0FBcEI7UUFDSSxJQUFJLEtBQWdCLENBQUM7UUFFckIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QixLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2QixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDekIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMxQixDQUFDO0lBQ0wsQ0FBQztJQUdPLGdDQUFTLEdBQWhCLFVBQWlCLEtBQWdCO1FBQWpDLGlCQXNCQTtRQXJCRyxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztRQUUxQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztZQUNoQixXQUFXLEVBQUUsa0JBQWtCO1lBQy9CLFNBQVMsRUFBRSxLQUFLLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxZQUFZO1lBQzlDLFFBQVEsRUFBRSxhQUFhO1lBQ3ZCLFVBQVUsRUFBRSxlQUFlO1lBQzNCLFlBQVksRUFBRSxJQUFJO1lBQ2xCLE1BQU0sRUFBRTtnQkFDSixLQUFLLEVBQUUsSUFBSSxDQUFDLFlBQVk7Z0JBQ3hCLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTthQUN0QjtTQUNKLENBQUM7YUFDRCxJQUFJLENBQ0QsVUFBQyxNQUFjO1lBQ1gsS0FBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ25DLENBQUMsRUFDRCxVQUFDLE1BQWM7WUFDWCxLQUFJLENBQUMscUJBQXFCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUNKLENBQUM7SUFDTixDQUFDO0lBRU8sNENBQXFCLEdBQTdCLFVBQThCLE1BQWM7UUFDeEMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1lBQ25DLElBQUksQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzdDLENBQUM7UUFDRCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztRQUN6QixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUVPLHdDQUFpQixHQUF6QixVQUEwQixNQUFjO1FBQ3BDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztZQUNwQyxJQUFJLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM5QyxDQUFDO1FBQ0QsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7UUFDekIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFFTSwrQkFBUSxHQUFmLFVBQWdCLEtBQUs7UUFDakIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDOUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDNUIsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMxQixDQUFDO0lBQ0wsQ0FBQztJQUVNLG1DQUFZLEdBQW5CLFVBQW9CLElBQVk7UUFDNUIsSUFBSSxNQUFNLEdBQVUsRUFBRSxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxVQUFDLEtBQUs7WUFDdEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDckMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN2QixDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUVNLHVDQUFnQixHQUF2QixVQUF3QixFQUFVO1FBQzlCLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUMsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFTSxtQ0FBWSxHQUFuQixVQUFvQixFQUFVO1FBQzFCLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBQyxFQUFFLEVBQUUsRUFBRSxFQUFDLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRU0sMkNBQW9CLEdBQTNCLGNBQStCLENBQUM7SUFFekIsb0NBQWEsR0FBcEI7UUFDSSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFFTSx1Q0FBZ0IsR0FBdkIsVUFBd0IsT0FBZSxFQUFFLE9BQWlCLEVBQUUsZUFBZSxFQUFFLGNBQWMsRUFBRSxFQUFVO1FBQ25HLElBQUksQ0FBQyxRQUFRLENBQUM7WUFDVixFQUFFLEVBQUUsRUFBRSxJQUFJLElBQUk7WUFDZCxJQUFJLEVBQUUsY0FBYztZQUNwQixPQUFPLEVBQUUsT0FBTztZQUNoQixPQUFPLEVBQUUsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQzFCLGVBQWUsRUFBRSxlQUFlO1lBQ2hDLGNBQWMsRUFBRSxjQUFjO1lBQzlCLFFBQVEsRUFBRSxJQUFJLENBQUMsMEJBQTBCO1NBQzVDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTSxrQ0FBVyxHQUFsQixVQUFtQixPQUFlLEVBQUUsZUFBZSxFQUFFLGNBQWMsRUFBRSxFQUFXO1FBQzVFLElBQUksQ0FBQyxRQUFRLENBQUM7WUFDVixFQUFFLEVBQUUsRUFBRSxJQUFJLElBQUk7WUFDZCxJQUFJLEVBQUUsU0FBUztZQUNmLE9BQU8sRUFBRSxPQUFPO1lBQ2hCLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQztZQUNmLGVBQWUsRUFBRSxlQUFlO1lBQ2hDLGNBQWMsRUFBRSxjQUFjO1NBQ2pDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTyxnQ0FBUyxHQUFoQixVQUFpQixPQUFlLEVBQUUsZUFBZSxFQUFFLGNBQWMsRUFBRSxFQUFVLEVBQUUsS0FBVTtRQUN0RixJQUFJLENBQUMsUUFBUSxDQUFDO1lBQ1YsRUFBRSxFQUFFLEVBQUUsSUFBSSxJQUFJO1lBQ2QsS0FBSyxFQUFFLEtBQUs7WUFDWixJQUFJLEVBQUUsT0FBTztZQUNiLE9BQU8sRUFBRSxPQUFPLElBQUksZ0JBQWdCO1lBQ3BDLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQztZQUNmLGVBQWUsRUFBRSxlQUFlO1lBQ2hDLGNBQWMsRUFBRSxjQUFjO1NBQ2pDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTSxvQ0FBYSxHQUFwQjtRQUNJLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDeEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7SUFDckIsQ0FBQztJQUVNLGtDQUFXLEdBQWxCLFVBQW1CLElBQWE7UUFDNUIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUVQLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUIsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUN4QixJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNyQixDQUFDO0lBQ0wsQ0FBQztJQUVMLG1CQUFDO0FBQUQsQ0F6SkEsQUF5SkMsSUFBQTtBQUdELENBQUM7SUFDRyxPQUFPO1NBQ0YsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDLFlBQVksRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO1NBQzVELE9BQU8sQ0FBQyxXQUFXLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFDNUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQzs7QUNyUEw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJleHBvcnQgaW50ZXJmYWNlIElDb2xvclBpY2tlciB7XHJcbiAgICBjbGFzczogc3RyaW5nO1xyXG4gICAgY29sb3JzOiBzdHJpbmdbXTtcclxuICAgIGN1cnJlbnRDb2xvcjogc3RyaW5nO1xyXG4gICAgY3VycmVudENvbG9ySW5kZXg6IG51bWJlcjtcclxuICAgIG5nRGlzYWJsZWQ6IEZ1bmN0aW9uO1xyXG4gICAgY29sb3JDaGFuZ2U6IEZ1bmN0aW9uO1xyXG5cclxuICAgIGVudGVyU3BhY2VQcmVzcyhldmVudCk6IHZvaWQ7XHJcbiAgICBkaXNhYmxlZCgpOiBib29sZWFuO1xyXG4gICAgc2VsZWN0Q29sb3IoaW5kZXg6IG51bWJlcik7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDb2xvclBpY2tlckNvbnRyb2xsZXIgaW1wbGVtZW50cyBJQ29sb3JQaWNrZXIge1xyXG4gIFxyXG4gICAgcHJpdmF0ZSBfJHRpbWVvdXQ7XHJcbiAgICBwcml2YXRlIF8kc2NvcGU6IG5nLklTY29wZTtcclxuXHJcbiAgICBwdWJsaWMgY2xhc3M6IHN0cmluZztcclxuICAgIHB1YmxpYyBjb2xvcnM6IHN0cmluZ1tdO1xyXG4gICAgcHVibGljIGN1cnJlbnRDb2xvcjogc3RyaW5nO1xyXG4gICAgcHVibGljIGN1cnJlbnRDb2xvckluZGV4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgbmdEaXNhYmxlZDogRnVuY3Rpb247XHJcbiAgICBwdWJsaWMgY29sb3JDaGFuZ2U6IEZ1bmN0aW9uO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCBcclxuICAgICAgICAkc2NvcGU6IG5nLklTY29wZSwgXHJcbiAgICAgICAgJGVsZW1lbnQsXHJcbiAgICAgICAgJGF0dHJzLCBcclxuICAgICAgICAkdGltZW91dCApIHtcclxuICAgICAgICAgICAgbGV0IERFRkFVTFRfQ09MT1JTID0gWydwdXJwbGUnLCAnbGlnaHRncmVlbicsICdncmVlbicsICdkYXJrcmVkJywgJ3BpbmsnLCAneWVsbG93JywgJ2N5YW4nXTtcclxuICAgICAgICAgICAgdGhpcy5fJHRpbWVvdXQgPSAkdGltZW91dDtcclxuICAgICAgICAgICAgdGhpcy5fJHNjb3BlID0gJHNjb3BlO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jbGFzcyA9ICRhdHRycy5jbGFzcyB8fCAnJztcclxuICAgICAgICAgICAgdGhpcy5jb2xvcnMgPSAhJHNjb3BlWydjb2xvcnMnXSB8fCBfLmlzQXJyYXkoJHNjb3BlWydjb2xvcnMnXSkgJiYgJHNjb3BlWydjb2xvcnMnXS5sZW5ndGggPT09IDAgPyBERUZBVUxUX0NPTE9SUyA6ICRzY29wZVsnY29sb3JzJ107XHJcbiAgICAgICAgICAgIHRoaXMuY29sb3JDaGFuZ2UgPSAkc2NvcGVbJ2NvbG9yQ2hhbmdlJ10gfHwgbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50Q29sb3IgPSAkc2NvcGVbJ2N1cnJlbnRDb2xvciddIHx8IHRoaXMuY29sb3JzWzBdO1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRDb2xvckluZGV4ID0gdGhpcy5jb2xvcnMuaW5kZXhPZih0aGlzLmN1cnJlbnRDb2xvcik7XHJcbiAgICAgICAgICAgIHRoaXMubmdEaXNhYmxlZCA9ICRzY29wZVsnbmdEaXNhYmxlZCddO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGlzYWJsZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHRoaXMubmdEaXNhYmxlZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5uZ0Rpc2FibGVkKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH07XHJcblxyXG4gICAgIHB1YmxpYyBzZWxlY3RDb2xvcihpbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQoKSkgeyByZXR1cm47IH1cclxuICAgICAgICB0aGlzLmN1cnJlbnRDb2xvckluZGV4ID0gaW5kZXg7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50Q29sb3IgPSB0aGlzLmNvbG9yc1t0aGlzLmN1cnJlbnRDb2xvckluZGV4XTtcclxuICAgICAgICB0aGlzLl8kdGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuXyRzY29wZS4kYXBwbHkoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY29sb3JDaGFuZ2UpIHtcclxuICAgICAgICAgICAgdGhpcy5jb2xvckNoYW5nZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHVibGljIGVudGVyU3BhY2VQcmVzcyhldmVudCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuc2VsZWN0Q29sb3IoZXZlbnQuaW5kZXgpO1xyXG4gICAgfTtcclxuXHJcbn1cclxuXHJcbigoKSA9PiB7XHJcbiAgICBmdW5jdGlvbiBwaXBDb2xvclBpY2tlcigkcGFyc2U6IGFueSkge1xyXG4gICAgICAgIFwibmdJbmplY3RcIjtcclxuXHJcbiAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgICAgICAgICBzY29wZToge1xyXG4gICAgICAgICAgICAgICAgICAgIG5nRGlzYWJsZWQ6ICcmJyxcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcnM6ICc9cGlwQ29sb3JzJyxcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50Q29sb3I6ICc9bmdNb2RlbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3JDaGFuZ2U6ICcmbmdDaGFuZ2UnXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb2xvcl9waWNrZXIvY29sb3JfcGlja2VyLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogQ29sb3JQaWNrZXJDb250cm9sbGVyLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nXHJcbiAgICAgICAgICAgIH07XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdwaXBDb2xvclBpY2tlcicsIFsncGlwQ29udHJvbHMuVGVtcGxhdGVzJ10pXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgncGlwQ29sb3JQaWNrZXInLCBwaXBDb2xvclBpY2tlcik7XHJcblxyXG5cclxufSkoKTtcclxuXHJcblxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vdHlwaW5ncy90c2QuZC50c1wiIC8+XHJcbi8qXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIHRoaXNNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgncGlwQ29sb3JQaWNrZXInLCBbICdwaXBDb250cm9scy5UZW1wbGF0ZXMnXSk7IC8vICdwaXBGb2N1c2VkJyxcclxuXHJcbiAgICB0aGlzTW9kdWxlLmRpcmVjdGl2ZSgncGlwQ29sb3JQaWNrZXInLFxyXG4gICAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgICAgICAgICAgc2NvcGU6IHtcclxuICAgICAgICAgICAgICAgICAgICBuZ0Rpc2FibGVkOiAnJicsXHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3JzOiAnPXBpcENvbG9ycycsXHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudENvbG9yOiAnPW5nTW9kZWwnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yQ2hhbmdlOiAnJm5nQ2hhbmdlJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29sb3JfcGlja2VyL2NvbG9yX3BpY2tlci5odG1sJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdwaXBDb2xvclBpY2tlckNvbnRyb2xsZXInXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgKTtcclxuICAgIHRoaXNNb2R1bGUuY29udHJvbGxlcigncGlwQ29sb3JQaWNrZXJDb250cm9sbGVyJyxcclxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzLCAkdGltZW91dCkge1xyXG4gICAgICAgICAgICB2YXJcclxuICAgICAgICAgICAgICAgIERFRkFVTFRfQ09MT1JTID0gWydwdXJwbGUnLCAnbGlnaHRncmVlbicsICdncmVlbicsICdkYXJrcmVkJywgJ3BpbmsnLCAneWVsbG93JywgJ2N5YW4nXTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5jbGFzcyA9ICRhdHRycy5jbGFzcyB8fCAnJztcclxuXHJcbiAgICAgICAgICAgIGlmICghJHNjb3BlLmNvbG9ycyB8fCBfLmlzQXJyYXkoJHNjb3BlLmNvbG9ycykgJiYgJHNjb3BlLmNvbG9ycy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5jb2xvcnMgPSBERUZBVUxUX0NPTE9SUztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmN1cnJlbnRDb2xvciA9ICRzY29wZS5jdXJyZW50Q29sb3IgfHwgJHNjb3BlLmNvbG9yc1swXTtcclxuICAgICAgICAgICAgJHNjb3BlLmN1cnJlbnRDb2xvckluZGV4ID0gJHNjb3BlLmNvbG9ycy5pbmRleE9mKCRzY29wZS5jdXJyZW50Q29sb3IpO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmRpc2FibGVkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCRzY29wZS5uZ0Rpc2FibGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRzY29wZS5uZ0Rpc2FibGVkKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuc2VsZWN0Q29sb3IgPSBmdW5jdGlvbiAoaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgIGlmICgkc2NvcGUuZGlzYWJsZWQoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICRzY29wZS5jdXJyZW50Q29sb3JJbmRleCA9IGluZGV4O1xyXG5cclxuICAgICAgICAgICAgICAgICRzY29wZS5jdXJyZW50Q29sb3IgPSAkc2NvcGUuY29sb3JzWyRzY29wZS5jdXJyZW50Q29sb3JJbmRleF07XHJcblxyXG4gICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICgkc2NvcGUuY29sb3JDaGFuZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY29sb3JDaGFuZ2UoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5lbnRlclNwYWNlUHJlc3MgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5zZWxlY3RDb2xvcihldmVudC5pbmRleCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgKTtcclxuXHJcbn0pKCk7XHJcbiovXHJcblxyXG5cclxuLy9pbXBvcnQge0ZpbGVVcGxvYWRDb250cm9sbGVyfSBmcm9tICcuL3VwbG9hZC9GaWxlVXBsb2FkQ29udHJvbGxlcic7XHJcbi8vaW1wb3J0IHtGaWxlUHJvZ3Jlc3NDb250cm9sbGVyfSBmcm9tICcuL3Byb2dyZXNzL0ZpbGVQcm9ncmVzc0NvbnRyb2xsZXInO1xyXG4vL2ltcG9ydCB7RmlsZVVwbG9hZFNlcnZpY2V9IGZyb20gJy4vc2VydmljZS9GaWxlVXBsb2FkU2VydmljZSc7Iiwi77u/Ly8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxyXG5cclxuKCgpID0+IHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgncGlwQ29udHJvbHMnLCBbXHJcbiAgICAgICAgJ3BpcE1hcmtkb3duJyxcclxuICAgICAgICAncGlwQ29sb3JQaWNrZXInLFxyXG4gICAgICAgICdwaXBSb3V0aW5nUHJvZ3Jlc3MnLFxyXG4gICAgICAgICdwaXBQb3BvdmVyJyxcclxuICAgICAgICAncGlwSW1hZ2VTbGlkZXInLFxyXG4gICAgICAgICdwaXBUb2FzdHMnLFxyXG4gICAgICAgICdwaXBDb250cm9scy5UcmFuc2xhdGUnXHJcbiAgICBdKTtcclxuXHJcbn0pKCk7XHJcblxyXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vdHlwaW5ncy90c2QuZC50c1wiIC8+XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciB0aGlzTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcENvbnRyb2xzLlRyYW5zbGF0ZScsIFtdKTtcclxuXHJcbiAgICB0aGlzTW9kdWxlLmZpbHRlcigndHJhbnNsYXRlJywgZnVuY3Rpb24gKCRpbmplY3Rvcikge1xyXG4gICAgICAgIHZhciBwaXBUcmFuc2xhdGUgPSAkaW5qZWN0b3IuaGFzKCdwaXBUcmFuc2xhdGUnKSBcclxuICAgICAgICAgICAgPyAkaW5qZWN0b3IuZ2V0KCdwaXBUcmFuc2xhdGUnKSA6IG51bGw7XHJcblxyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwaXBUcmFuc2xhdGUgID8gcGlwVHJhbnNsYXRlLnRyYW5zbGF0ZShrZXkpIHx8IGtleSA6IGtleTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbn0pKCk7XHJcbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi90eXBpbmdzL3RzZC5kLnRzXCIgLz5cclxuLypcclxuKCgpID0+IHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgdGhpc01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBJbWFnZVNsaWRlcicsIFsncGlwU2xpZGVyQnV0dG9uJywgJ3BpcFNsaWRlckluZGljYXRvcicsICdwaXBJbWFnZVNsaWRlci5TZXJ2aWNlJ10pO1xyXG5cclxuICAgIHRoaXNNb2R1bGUuZGlyZWN0aXZlKCdwaXBJbWFnZVNsaWRlcicsXHJcbiAgICAgICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgc2NvcGU6IHtcclxuICAgICAgICAgICAgICAgICAgICBzbGlkZXJJbmRleDogJz1waXBJbWFnZUluZGV4J1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uICgkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMsICRwYXJzZSwgJHRpbWVvdXQsICRpbnRlcnZhbCwgJHBpcEltYWdlU2xpZGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGJsb2NrcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSAwLCBuZXdJbmRleCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlID0gJHBhcnNlKCRhdHRycy5waXBBbmltYXRpb25UeXBlKSgkc2NvcGUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBERUZBVUxUX0lOVEVSVkFMID0gNDUwMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJ2YWwgPSAkcGFyc2UoJGF0dHJzLnBpcEFuaW1hdGlvbkludGVydmFsKSgkc2NvcGUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aW1lUHJvbWlzZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm90dGxlZDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJGVsZW1lbnQuYWRkQ2xhc3MoJ3BpcC1pbWFnZS1zbGlkZXInKTtcclxuICAgICAgICAgICAgICAgICAgICAkZWxlbWVudC5hZGRDbGFzcygncGlwLWFuaW1hdGlvbi0nICsgdHlwZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5zd2lwZVN0YXJ0ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgLy9pZiAoJHN3aXBlKVxyXG4gICAgICAgICAgICAgICAgICAgICAvLyRzd2lwZS5iaW5kKCRlbGVtZW50LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgIC8vJ3N0YXJ0JzogZnVuY3Rpb24oY29vcmRzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgIC8vaWYgKGNvb3JkcykgJHNjb3BlLnN3aXBlU3RhcnQgPSBjb29yZHMueDtcclxuICAgICAgICAgICAgICAgICAgICAgLy9lbHNlICRzY29wZS5zd2lwZVN0YXJ0ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgLy99LFxyXG4gICAgICAgICAgICAgICAgICAgICAvLydlbmQnOiBmdW5jdGlvbihjb29yZHMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgLy92YXIgZGVsdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgIC8vaWYgKGNvb3Jkcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAvL2RlbHRhID0gJHNjb3BlLnN3aXBlU3RhcnQgLSBjb29yZHMueDtcclxuICAgICAgICAgICAgICAgICAgICAgLy9pZiAoZGVsdGEgPiAxNTApICAkc2NvcGUubmV4dEJsb2NrKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgIC8vaWYgKGRlbHRhIDwgLTE1MCkgICRzY29wZS5wcmV2QmxvY2soKTtcclxuICAgICAgICAgICAgICAgICAgICAgLy8kc2NvcGUuc3dpcGVTdGFydCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgIC8vfSBlbHNlICRzY29wZS5zd2lwZVN0YXJ0ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgLy99XHJcbiAgICAgICAgICAgICAgICAgICAgIC8vfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHNldEluZGV4KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2tzID0gJGVsZW1lbnQuZmluZCgnLnBpcC1hbmltYXRpb24tYmxvY2snKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJsb2Nrcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKGJsb2Nrc1swXSkuYWRkQ2xhc3MoJ3BpcC1zaG93Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRJbnRlcnZhbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm90dGxlZCA9IF8udGhyb3R0bGUoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkcGlwSW1hZ2VTbGlkZXIudG9CbG9jayh0eXBlLCBibG9ja3MsIGluZGV4LCBuZXdJbmRleCwgZGlyZWN0aW9uKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBuZXdJbmRleDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0SW5kZXgoKTtcclxuICAgICAgICAgICAgICAgICAgICB9LCA3MDApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubmV4dEJsb2NrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN0YXJ0SW50ZXJ2YWwoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3SW5kZXggPSBpbmRleCArIDEgPT09IGJsb2Nrcy5sZW5ndGggPyAwIDogaW5kZXggKyAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb24gPSAnbmV4dCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm90dGxlZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5wcmV2QmxvY2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3RhcnRJbnRlcnZhbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdJbmRleCA9IGluZGV4IC0gMSA8IDAgPyBibG9ja3MubGVuZ3RoIC0gMSA6IGluZGV4IC0gMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uID0gJ3ByZXYnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdHRsZWQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc2xpZGVUbyA9IGZ1bmN0aW9uIChuZXh0SW5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5leHRJbmRleCA9PT0gaW5kZXggfHwgbmV4dEluZGV4ID4gYmxvY2tzLmxlbmd0aCAtIDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdGFydEludGVydmFsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0luZGV4ID0gbmV4dEluZGV4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb24gPSBuZXh0SW5kZXggPiBpbmRleCA/ICduZXh0JyA6ICdwcmV2JztcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3R0bGVkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBpZiAoJGF0dHJzLmlkKSAkcGlwSW1hZ2VTbGlkZXIucmVnaXN0ZXJTbGlkZXIoJGF0dHJzLmlkLCAkc2NvcGUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBzZXRJbmRleCgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCRhdHRycy5waXBJbWFnZUluZGV4KSAkc2NvcGUuc2xpZGVySW5kZXggPSBpbmRleDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHN0YXJ0SW50ZXJ2YWwoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVQcm9taXNlcyA9ICRpbnRlcnZhbChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdJbmRleCA9IGluZGV4ICsgMSA9PT0gYmxvY2tzLmxlbmd0aCA/IDAgOiBpbmRleCArIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb24gPSAnbmV4dCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdHRsZWQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgaW50ZXJ2YWwgfHwgREVGQVVMVF9JTlRFUlZBTCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBzdG9wSW50ZXJ2YWwoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRpbnRlcnZhbC5jYW5jZWwodGltZVByb21pc2VzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRlbGVtZW50Lm9uKCckZGVzdHJveScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RvcEludGVydmFsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRwaXBJbWFnZVNsaWRlci5yZW1vdmVTbGlkZXIoJGF0dHJzLmlkKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gcmVzdGFydEludGVydmFsKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9wSW50ZXJ2YWwoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRJbnRlcnZhbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICApO1xyXG5cclxufSkoKTtcclxuKi9cclxuXHJcbmNsYXNzIHBpcEltYWdlU2xpZGVyQ29udHJvbGxlcntcclxuXHJcbiAgICBwcml2YXRlIF8kYXR0cnM7XHJcbiAgICBwcml2YXRlIF8kaW50ZXJ2YWw6IGFuZ3VsYXIuSUludGVydmFsU2VydmljZTtcclxuXHJcbiAgICBwcml2YXRlIF9ibG9ja3M6IGFueVtdO1xyXG4gICAgcHJpdmF0ZSBfaW5kZXg6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIF9uZXdJbmRleDogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfZGlyZWN0aW9uOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIF90eXBlOiBhbnk7XHJcbiAgICBwcml2YXRlIERFRkFVTFRfSU5URVJWQUwgPSA0NTAwO1xyXG4gICAgcHJpdmF0ZSBfaW50ZXJ2YWw7XHJcbiAgICBwcml2YXRlIF90aW1lUHJvbWlzZXM7XHJcbiAgICBwcml2YXRlIF90aHJvdHRsZWQ6IEZ1bmN0aW9uO1xyXG5cclxuICAgIHB1YmxpYyBzd2lwZVN0YXJ0OiBudW1iZXIgPSAwO1xyXG4gICAgcHVibGljIHNsaWRlckluZGV4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgc2xpZGVUbzogRnVuY3Rpb247XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgJHNjb3BlOiBuZy5JU2NvcGUsIFxyXG4gICAgICAgICRlbGVtZW50LCBcclxuICAgICAgICAkYXR0cnMsIFxyXG4gICAgICAgICRwYXJzZSwgXHJcbiAgICAgICAgJHRpbWVvdXQ6IGFuZ3VsYXIuSVRpbWVvdXRTZXJ2aWNlLFxyXG4gICAgICAgICRpbnRlcnZhbDogYW5ndWxhci5JSW50ZXJ2YWxTZXJ2aWNlLCBcclxuICAgICAgICAkcGlwSW1hZ2VTbGlkZXIpIHtcclxuXHJcbiAgICAgICAgdGhpcy5zbGlkZXJJbmRleCA9ICRzY29wZVsnc2xpZGVySW5kZXgnXTtcclxuICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUsICRhdHRycyk7XHJcbiAgICAgICAgdGhpcy5fdHlwZSA9ICRwYXJzZSgkYXR0cnMucGlwQW5pbWF0aW9uVHlwZSkoJHNjb3BlKTtcclxuICAgICAgICB0aGlzLl9pbnRlcnZhbCA9ICRwYXJzZSgkYXR0cnMucGlwQW5pbWF0aW9uSW50ZXJ2YWwpKCRzY29wZSk7XHJcbiAgICAgICAgdGhpcy5fJGF0dHJzID0gJGF0dHJzO1xyXG4gICAgICAgIHRoaXMuXyRpbnRlcnZhbCA9ICRpbnRlcnZhbDtcclxuICAgICAgICAkc2NvcGVbJ3NsaWRlVG8nXSA9IHRoaXMuc2xpZGVUb1ByaXZhdGU7XHJcblxyXG4gICAgICAgICRlbGVtZW50LmFkZENsYXNzKCdwaXAtaW1hZ2Utc2xpZGVyJyk7XHJcbiAgICAgICAgJGVsZW1lbnQuYWRkQ2xhc3MoJ3BpcC1hbmltYXRpb24tJyArIHRoaXMuX3R5cGUpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuc2V0SW5kZXgoKTtcclxuXHJcbiAgICAgICAgJHRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9ibG9ja3MgPSAkZWxlbWVudC5maW5kKCcucGlwLWFuaW1hdGlvbi1ibG9jaycpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fYmxvY2tzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICQodGhpcy5fYmxvY2tzWzBdKS5hZGRDbGFzcygncGlwLXNob3cnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXJ0SW50ZXJ2YWwoKTtcclxuICAgICAgICB0aGlzLl90aHJvdHRsZWQgPSBfLnRocm90dGxlKCgpID0+IHtcclxuICAgICAgICAgICAgJHBpcEltYWdlU2xpZGVyLnRvQmxvY2sodGhpcy5fdHlwZSwgdGhpcy5fYmxvY2tzLCB0aGlzLl9pbmRleCwgdGhpcy5fbmV3SW5kZXgsIHRoaXMuX2RpcmVjdGlvbik7XHJcbiAgICAgICAgICAgIHRoaXMuX2luZGV4ID0gdGhpcy5fbmV3SW5kZXg7O1xyXG4gICAgICAgICAgICAkc2NvcGVbJ3NlbGVjdEluZGV4J10gPSB0aGlzLl9pbmRleDtcclxuICAgICAgICAgICAgdGhpcy5zZXRJbmRleCgpO1xyXG4gICAgICAgIH0sIDcwMCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKCRhdHRycy5pZCkgeyAkcGlwSW1hZ2VTbGlkZXIucmVnaXN0ZXJTbGlkZXIoJGF0dHJzLmlkLCAkc2NvcGUpIH1cclxuXHJcbiAgICAgICAgJGVsZW1lbnQub24oJyRkZXN0cm95JywgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnN0b3BJbnRlcnZhbCgpO1xyXG4gICAgICAgICAgICAkcGlwSW1hZ2VTbGlkZXIucmVtb3ZlU2xpZGVyKCRhdHRycy5pZCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBuZXh0QmxvY2soKSB7XHJcbiAgICAgICAgdGhpcy5yZXN0YXJ0SW50ZXJ2YWwoKTtcclxuICAgICAgICB0aGlzLl9uZXdJbmRleCA9IHRoaXMuX2luZGV4ICsgMSA9PT0gdGhpcy5fYmxvY2tzLmxlbmd0aCA/IDAgOiB0aGlzLl9pbmRleCArIDE7XHJcbiAgICAgICAgdGhpcy5fZGlyZWN0aW9uID0gJ25leHQnO1xyXG4gICAgICAgIHRoaXMuX3Rocm90dGxlZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBwcmV2QmxvY2soKSB7XHJcbiAgICAgICAgdGhpcy5yZXN0YXJ0SW50ZXJ2YWwoKTtcclxuICAgICAgICB0aGlzLl9uZXdJbmRleCA9IHRoaXMuX2luZGV4IC0gMSA8IDAgPyB0aGlzLl9ibG9ja3MubGVuZ3RoIC0gMSA6IHRoaXMuX2luZGV4IC0gMTtcclxuICAgICAgICB0aGlzLl9kaXJlY3Rpb24gPSAncHJldic7XHJcbiAgICAgICAgdGhpcy5fdGhyb3R0bGVkKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNsaWRlVG9Qcml2YXRlKG5leHRJbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcyk7XHJcbiAgICAgICAgaWYgKG5leHRJbmRleCA9PT0gdGhpcy5faW5kZXggfHwgbmV4dEluZGV4ID4gdGhpcy5fYmxvY2tzLmxlbmd0aCAtIDEpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5yZXN0YXJ0SW50ZXJ2YWwoKTtcclxuICAgICAgICB0aGlzLl9uZXdJbmRleCA9IG5leHRJbmRleDtcclxuICAgICAgICB0aGlzLl9kaXJlY3Rpb24gPSBuZXh0SW5kZXggPiB0aGlzLl9pbmRleCA/ICduZXh0JyA6ICdwcmV2JztcclxuICAgICAgICB0aGlzLl90aHJvdHRsZWQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldEluZGV4KCkge1xyXG4gICAgICAgIGlmICh0aGlzLl8kYXR0cnMucGlwSW1hZ2VJbmRleCkgdGhpcy5zbGlkZXJJbmRleCA9IHRoaXMuX2luZGV4O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhcnRJbnRlcnZhbCgpIHtcclxuICAgICAgICB0aGlzLl90aW1lUHJvbWlzZXMgPSB0aGlzLl8kaW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9uZXdJbmRleCA9IHRoaXMuX2luZGV4ICsgMSA9PT0gdGhpcy5fYmxvY2tzLmxlbmd0aCA/IDAgOiB0aGlzLl9pbmRleCArIDE7XHJcbiAgICAgICAgICAgIHRoaXMuX2RpcmVjdGlvbiA9ICduZXh0JztcclxuICAgICAgICAgICAgdGhpcy5fdGhyb3R0bGVkKCk7XHJcbiAgICAgICAgfSwgdGhpcy5faW50ZXJ2YWwgfHwgdGhpcy5ERUZBVUxUX0lOVEVSVkFMKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0b3BJbnRlcnZhbCgpIHtcclxuICAgICAgICB0aGlzLl8kaW50ZXJ2YWwuY2FuY2VsKHRoaXMuX3RpbWVQcm9taXNlcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZXN0YXJ0SW50ZXJ2YWwoKSB7XHJcbiAgICAgICAgdGhpcy5zdG9wSW50ZXJ2YWwoKTtcclxuICAgICAgICB0aGlzLnN0YXJ0SW50ZXJ2YWwoKTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcblxyXG5cclxuKCgpID0+IHtcclxuXHJcbiAgICBmdW5jdGlvbiBwaXBJbWFnZVNsaWRlcigpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBzY29wZToge1xyXG4gICAgICAgICAgICAgICAgc2xpZGVySW5kZXg6ICc9cGlwSW1hZ2VJbmRleCdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogcGlwSW1hZ2VTbGlkZXJDb250cm9sbGVyLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bSdcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncGlwSW1hZ2VTbGlkZXInLCBbJ3BpcFNsaWRlckJ1dHRvbicsICdwaXBTbGlkZXJJbmRpY2F0b3InLCAncGlwSW1hZ2VTbGlkZXIuU2VydmljZSddKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ3BpcEltYWdlU2xpZGVyJywgcGlwSW1hZ2VTbGlkZXIpO1xyXG5cclxufSkoKTtcclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxyXG5cclxuaW50ZXJmYWNlIElJbWFnZVNsaWRlclNlcnZpY2Uge1xyXG4gICAgcmVnaXN0ZXJTbGlkZXIoc2xpZGVySWQ6IHN0cmluZywgc2xpZGVyU2NvcGUpOiB2b2lkO1xyXG4gICAgcmVtb3ZlU2xpZGVyKHNsaWRlcklkOiBzdHJpbmcpOiB2b2lkO1xyXG4gICAgZ2V0U2xpZGVyU2NvcGUoc2xpZGVySWQ6IHN0cmluZyk7XHJcbiAgICBuZXh0Q2Fyb3VzZWwobmV4dEJsb2NrLCBwcmV2QmxvY2spOiB2b2lkO1xyXG4gICAgcHJldkNhcm91c2VsKG5leHRCbG9jaywgcHJldkJsb2NrKTogdm9pZDtcclxuICAgIHRvQmxvY2sodHlwZTogc3RyaW5nLCBibG9ja3M6IGFueVtdLCBvbGRJbmRleDogbnVtYmVyLCBuZXh0SW5kZXg6IG51bWJlciwgZGlyZWN0aW9uOiBzdHJpbmcpOiB2b2lkO1xyXG59XHJcblxyXG5jbGFzcyBJbWFnZVNsaWRlclNlcnZpY2Uge1xyXG4gICAgcHJpdmF0ZSBfJHRpbWVvdXQ6IGFuZ3VsYXIuSVRpbWVvdXRTZXJ2aWNlO1xyXG4gICAgcHJpdmF0ZSBBTklNQVRJT05fRFVSQVRJT046IG51bWJlciA9IDU1MDtcclxuICAgIHByaXZhdGUgX3NsaWRlcnMgPSB7fTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigkdGltZW91dDogYW5ndWxhci5JVGltZW91dFNlcnZpY2UpIHtcclxuICAgICAgICB0aGlzLl8kdGltZW91dCA9ICR0aW1lb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZWdpc3RlclNsaWRlcihzbGlkZXJJZDogc3RyaW5nLCBzbGlkZXJTY29wZSk6IHZvaWQge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdyZWcnLCBzbGlkZXJTY29wZSk7XHJcbiAgICAgICAgdGhpcy5fc2xpZGVyc1tzbGlkZXJJZF0gPSBzbGlkZXJTY29wZTtcclxuICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICBwdWJsaWMgcmVtb3ZlU2xpZGVyKHNsaWRlcklkOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICBkZWxldGUgdGhpcy5fc2xpZGVyc1tzbGlkZXJJZF07XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFNsaWRlclNjb3BlKHNsaWRlcklkOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnZ2dnJywgdGhpcy5fc2xpZGVycywgJ2pqaicpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zbGlkZXJzW3NsaWRlcklkXTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbmV4dENhcm91c2VsKG5leHRCbG9jaywgcHJldkJsb2NrKTogdm9pZCB7XHJcbiAgICAgICAgbmV4dEJsb2NrLmFkZENsYXNzKCdwaXAtbmV4dCcpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgdGhpcy5fJHRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICBuZXh0QmxvY2suYWRkQ2xhc3MoJ2FuaW1hdGVkJykuYWRkQ2xhc3MoJ3BpcC1zaG93JykucmVtb3ZlQ2xhc3MoJ3BpcC1uZXh0Jyk7XHJcbiAgICAgICAgICAgIHByZXZCbG9jay5hZGRDbGFzcygnYW5pbWF0ZWQnKS5yZW1vdmVDbGFzcygncGlwLXNob3cnKTtcclxuICAgICAgICB9LCAxMDApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBwcmV2Q2Fyb3VzZWwobmV4dEJsb2NrLCBwcmV2QmxvY2spOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl8kdGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIG5leHRCbG9jay5hZGRDbGFzcygnYW5pbWF0ZWQnKS5hZGRDbGFzcygncGlwLXNob3cnKTtcclxuICAgICAgICAgICAgcHJldkJsb2NrLmFkZENsYXNzKCdhbmltYXRlZCcpLmFkZENsYXNzKCdwaXAtbmV4dCcpLnJlbW92ZUNsYXNzKCdwaXAtc2hvdycpO1xyXG4gICAgICAgIH0sIDEwMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHRvQmxvY2sodHlwZTogc3RyaW5nLCBibG9ja3M6IGFueVtdLCBvbGRJbmRleDogbnVtYmVyLCBuZXh0SW5kZXg6IG51bWJlciwgZGlyZWN0aW9uOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICBsZXQgcHJldkJsb2NrID0gJChibG9ja3Nbb2xkSW5kZXhdKSxcclxuICAgICAgICAgICAgYmxvY2tJbmRleDogbnVtYmVyID0gbmV4dEluZGV4LFxyXG4gICAgICAgICAgICBuZXh0QmxvY2sgPSAkKGJsb2Nrc1tibG9ja0luZGV4XSk7XHJcblxyXG4gICAgICAgIGlmICh0eXBlID09PSAnY2Fyb3VzZWwnKSB7XHJcbiAgICAgICAgICAgICQoYmxvY2tzKS5yZW1vdmVDbGFzcygncGlwLW5leHQnKS5yZW1vdmVDbGFzcygncGlwLXByZXYnKS5yZW1vdmVDbGFzcygnYW5pbWF0ZWQnKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChkaXJlY3Rpb24gJiYgKGRpcmVjdGlvbiA9PT0gJ3ByZXYnIHx8IGRpcmVjdGlvbiA9PT0gJ25leHQnKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gJ3ByZXYnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmV2Q2Fyb3VzZWwobmV4dEJsb2NrLCBwcmV2QmxvY2spO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHRDYXJvdXNlbChuZXh0QmxvY2ssIHByZXZCbG9jayk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobmV4dEluZGV4ICYmIG5leHRJbmRleCA8IG9sZEluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmV2Q2Fyb3VzZWwobmV4dEJsb2NrLCBwcmV2QmxvY2spO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHRDYXJvdXNlbChuZXh0QmxvY2ssIHByZXZCbG9jayk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBwcmV2QmxvY2suYWRkQ2xhc3MoJ2FuaW1hdGVkJykucmVtb3ZlQ2xhc3MoJ3BpcC1zaG93Jyk7XHJcbiAgICAgICAgICAgIG5leHRCbG9jay5hZGRDbGFzcygnYW5pbWF0ZWQnKS5hZGRDbGFzcygncGlwLXNob3cnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5cclxuKCgpID0+IHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdwaXBJbWFnZVNsaWRlci5TZXJ2aWNlJywgW10pXHJcbiAgICAgICAgLnNlcnZpY2UoJyRwaXBJbWFnZVNsaWRlcicsIEltYWdlU2xpZGVyU2VydmljZSk7XHJcblxyXG59KSgpO1xyXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vdHlwaW5ncy90c2QuZC50c1wiIC8+XHJcblxyXG4oKCkgPT4ge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciB0aGlzTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcFNsaWRlckJ1dHRvbicsIFtdKTtcclxuXHJcbiAgICB0aGlzTW9kdWxlLmRpcmVjdGl2ZSgncGlwU2xpZGVyQnV0dG9uJyxcclxuICAgICAgICBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBzY29wZToge30sXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbiAoJHNjb3BlLCAkZWxlbWVudCwgJHBhcnNlLCAkYXR0cnMsICRwaXBJbWFnZVNsaWRlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0eXBlID0gJHBhcnNlKCRhdHRycy5waXBCdXR0b25UeXBlKSgkc2NvcGUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzbGlkZXJJZCA9ICRwYXJzZSgkYXR0cnMucGlwU2xpZGVySWQpKCRzY29wZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRlbGVtZW50Lm9uKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFzbGlkZXJJZCB8fCAhdHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkcGlwSW1hZ2VTbGlkZXIuZ2V0U2xpZGVyU2NvcGUoc2xpZGVySWQpLnZtW3R5cGUgKyAnQmxvY2snXSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICk7XHJcblxyXG59KSgpO1xyXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vdHlwaW5ncy90c2QuZC50c1wiIC8+XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciB0aGlzTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcFNsaWRlckluZGljYXRvcicsIFtdKTtcclxuXHJcbiAgICB0aGlzTW9kdWxlLmRpcmVjdGl2ZSgncGlwU2xpZGVySW5kaWNhdG9yJyxcclxuICAgICAgICBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBzY29wZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAoJHNjb3BlLCAkZWxlbWVudCwgJHBhcnNlLCAkYXR0cnMsICRwaXBJbWFnZVNsaWRlcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzbGlkZXJJZCA9ICRwYXJzZSgkYXR0cnMucGlwU2xpZGVySWQpKCRzY29wZSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlVG8gPSAkcGFyc2UoJGF0dHJzLnBpcFNsaWRlVG8pKCRzY29wZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRlbGVtZW50LmNzcygnY3Vyc29yJywgJ3BvaW50ZXInKTtcclxuICAgICAgICAgICAgICAgICAgICAkZWxlbWVudC5vbignY2xpY2snLCAgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXNsaWRlcklkIHx8IHNsaWRlVG8gJiYgc2xpZGVUbyA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkcGlwSW1hZ2VTbGlkZXIuZ2V0U2xpZGVyU2NvcGUoc2xpZGVySWQpLnZtLnNsaWRlVG9Qcml2YXRlKHNsaWRlVG8pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICk7XHJcblxyXG59KSgpO1xyXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vdHlwaW5ncy90c2QuZC50c1wiIC8+XHJcblxyXG5kZWNsYXJlIHZhciBtYXJrZWQ6IGFueTtcclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIHRoaXNNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgncGlwTWFya2Rvd24nLCBbJ25nU2FuaXRpemUnXSk7XHJcblxyXG4gICAgdGhpc01vZHVsZS5ydW4oZnVuY3Rpb24gKCRpbmplY3Rvcikge1xyXG4gICAgICAgIHZhciBwaXBUcmFuc2xhdGUgPSAkaW5qZWN0b3IuaGFzKCdwaXBUcmFuc2xhdGUnKSA/ICRpbmplY3Rvci5nZXQoJ3BpcFRyYW5zbGF0ZScpIDogbnVsbDtcclxuXHJcbiAgICAgICAgaWYgKHBpcFRyYW5zbGF0ZSkge1xyXG4gICAgICAgICAgICBwaXBUcmFuc2xhdGUuc2V0VHJhbnNsYXRpb25zKCdlbicsIHtcclxuICAgICAgICAgICAgICAgICdNQVJLRE9XTl9BVFRBQ0hNRU5UUyc6ICdBdHRhY2htZW50czonLFxyXG4gICAgICAgICAgICAgICAgJ2NoZWNrbGlzdCc6ICdDaGVja2xpc3QnLFxyXG4gICAgICAgICAgICAgICAgJ2RvY3VtZW50cyc6ICdEb2N1bWVudHMnLFxyXG4gICAgICAgICAgICAgICAgJ3BpY3R1cmVzJzogJ1BpY3R1cmVzJyxcclxuICAgICAgICAgICAgICAgICdsb2NhdGlvbic6ICdMb2NhdGlvbicsXHJcbiAgICAgICAgICAgICAgICAndGltZSc6ICdUaW1lJ1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcGlwVHJhbnNsYXRlLnNldFRyYW5zbGF0aW9ucygncnUnLCB7XHJcbiAgICAgICAgICAgICAgICAnTUFSS0RPV05fQVRUQUNITUVOVFMnOiAn0JLQu9C+0LbQtdC90LjRjzonLFxyXG4gICAgICAgICAgICAgICAgJ2NoZWNrbGlzdCc6ICfQodC/0LjRgdC+0LonLFxyXG4gICAgICAgICAgICAgICAgJ2RvY3VtZW50cyc6ICfQlNC+0LrRg9C80LXQvdGC0YsnLFxyXG4gICAgICAgICAgICAgICAgJ3BpY3R1cmVzJzogJ9CY0LfQvtCx0YDQsNC20LXQvdC40Y8nLFxyXG4gICAgICAgICAgICAgICAgJ2xvY2F0aW9uJzogJ9Cc0LXRgdGC0L7QvdCw0YXQvtC20LTQtdC90LjQtScsXHJcbiAgICAgICAgICAgICAgICAndGltZSc6ICfQktGA0LXQvNGPJ1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzTW9kdWxlLmRpcmVjdGl2ZSgncGlwTWFya2Rvd24nLFxyXG4gICAgICAgIGZ1bmN0aW9uICgkcGFyc2UsICRpbmplY3Rvcikge1xyXG4gICAgICAgICAgICB2YXIgcGlwVHJhbnNsYXRlID0gJGluamVjdG9yLmhhcygncGlwVHJhbnNsYXRlJykgPyAkaW5qZWN0b3IuZ2V0KCdwaXBUcmFuc2xhdGUnKSA6IG51bGw7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgICAgICAgICBzY29wZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBsaW5rOiBmdW5jdGlvbiAoJHNjb3BlOiBhbnksICRlbGVtZW50LCAkYXR0cnM6IGFueSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhclxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0R2V0dGVyID0gJHBhcnNlKCRhdHRycy5waXBUZXh0KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdEdldHRlciA9ICRwYXJzZSgkYXR0cnMucGlwTGlzdCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYW1wR2V0dGVyID0gJHBhcnNlKCRhdHRycy5waXBMaW5lQ291bnQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBkZXNjcmliZUF0dGFjaG1lbnRzKGFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRhY2hTdHJpbmcgPSAnJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dGFjaFR5cGVzID0gW107XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfLmVhY2goYXJyYXksIGZ1bmN0aW9uIChhdHRhY2gpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhdHRhY2gudHlwZSAmJiBhdHRhY2gudHlwZSAhPT0gJ3RleHQnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGF0dGFjaFN0cmluZy5sZW5ndGggPT09IDAgJiYgcGlwVHJhbnNsYXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dGFjaFN0cmluZyA9IHBpcFRyYW5zbGF0ZS50cmFuc2xhdGUoJ01BUktET1dOX0FUVEFDSE1FTlRTJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXR0YWNoVHlwZXMuaW5kZXhPZihhdHRhY2gudHlwZSkgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dGFjaFR5cGVzLnB1c2goYXR0YWNoLnR5cGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRhY2hTdHJpbmcgKz0gYXR0YWNoVHlwZXMubGVuZ3RoID4gMSA/ICcsICcgOiAnICc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwaXBUcmFuc2xhdGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRhY2hTdHJpbmcgKz0gcGlwVHJhbnNsYXRlLnRyYW5zbGF0ZShhdHRhY2gudHlwZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhdHRhY2hTdHJpbmc7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiB0b0Jvb2xlYW4odmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlID09IG51bGwpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF2YWx1ZSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlID09ICcxJyB8fCB2YWx1ZSA9PSAndHJ1ZSc7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBiaW5kVGV4dCh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGV4dFN0cmluZywgaXNDbGFtcGVkLCBoZWlnaHQsIG9wdGlvbnMsIG9iajtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChfLmlzQXJyYXkodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmogPSBfLmZpbmQodmFsdWUsIGZ1bmN0aW9uIChpdGVtOiBhbnkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXRlbS50eXBlID09PSAndGV4dCcgJiYgaXRlbS50ZXh0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dFN0cmluZyA9IG9iaiA/IG9iai50ZXh0IDogZGVzY3JpYmVBdHRhY2htZW50cyh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0U3RyaW5nID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzQ2xhbXBlZCA9ICRhdHRycy5waXBMaW5lQ291bnQgJiYgXy5pc051bWJlcihjbGFtcEdldHRlcigpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNDbGFtcGVkID0gaXNDbGFtcGVkICYmIHRleHRTdHJpbmcgJiYgdGV4dFN0cmluZy5sZW5ndGggPiAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2ZtOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFibGVzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2FuaXRpemU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwZWRhbnRpYzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNtYXJ0TGlzdHM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzbWFydHlwZW50czogZmFsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dFN0cmluZyA9IG1hcmtlZCh0ZXh0U3RyaW5nIHx8ICcnLCBvcHRpb25zKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzQ2xhbXBlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0ID0gMS41ICogY2xhbXBHZXR0ZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBBc3NpZ24gdmFsdWUgYXMgSFRNTFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkZWxlbWVudC5odG1sKCc8ZGl2JyArIChpc0NsYW1wZWQgPyBsaXN0R2V0dGVyKCkgPyAnY2xhc3M9XCJwaXAtbWFya2Rvd24tY29udGVudCAnICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdwaXAtbWFya2Rvd24tbGlzdFwiIHN0eWxlPVwibWF4LWhlaWdodDogJyArIGhlaWdodCArICdlbVwiPidcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICcgY2xhc3M9XCJwaXAtbWFya2Rvd24tY29udGVudFwiIHN0eWxlPVwibWF4LWhlaWdodDogJyArIGhlaWdodCArICdlbVwiPicgOiBsaXN0R2V0dGVyKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICcgY2xhc3M9XCJwaXAtbWFya2Rvd24tbGlzdFwiPicgOiAnPicpICsgdGV4dFN0cmluZyArICc8L2Rpdj4nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGVsZW1lbnQuZmluZCgnYScpLmF0dHIoJ3RhcmdldCcsICdibGFuaycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWxpc3RHZXR0ZXIoKSAmJiBpc0NsYW1wZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRlbGVtZW50LmFwcGVuZCgnPGRpdiBjbGFzcz1cInBpcC1ncmFkaWVudC1ibG9ja1wiPjwvZGl2PicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBGaWxsIHRoZSB0ZXh0XHJcbiAgICAgICAgICAgICAgICAgICAgYmluZFRleHQodGV4dEdldHRlcigkc2NvcGUpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gQWxzbyBvcHRpbWl6YXRpb24gdG8gYXZvaWQgd2F0Y2ggaWYgaXQgaXMgdW5uZWNlc3NhcnlcclxuICAgICAgICAgICAgICAgICAgICBpZiAodG9Cb29sZWFuKCRhdHRycy5waXBSZWJpbmQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS4kd2F0Y2godGV4dEdldHRlciwgZnVuY3Rpb24gKG5ld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiaW5kVGV4dChuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiRvbigncGlwV2luZG93UmVzaXplZCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmluZFRleHQodGV4dEdldHRlcigkc2NvcGUpKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gQWRkIGNsYXNzXHJcbiAgICAgICAgICAgICAgICAgICAgJGVsZW1lbnQuYWRkQ2xhc3MoJ3BpcC1tYXJrZG93bicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICk7XHJcblxyXG59KSgpO1xyXG5cclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBQb3BvdmVyQ29udHJvbGxlciB7XHJcbiAgXHJcbiAgICBwcml2YXRlIF8kdGltZW91dDtcclxuICAgIHByaXZhdGUgXyRzY29wZTogbmcuSVNjb3BlO1xyXG5cclxuICAgIHB1YmxpYyB0aW1lb3V0O1xyXG4gICAgcHVibGljIGJhY2tkcm9wRWxlbWVudDtcclxuICAgIHB1YmxpYyBjb250ZW50O1xyXG4gICAgcHVibGljIGVsZW1lbnQ7XHJcbiAgICBwdWJsaWMgY2FsY0g6IGJvb2xlYW47XHJcblxyXG4gICAgcHVibGljIHRlbXBsYXRlVXJsO1xyXG4gICAgcHVibGljIHRlbXBsYXRlXHJcblxyXG4gICAgcHVibGljIGNhbmNlbENhbGxiYWNrOiBGdW5jdGlvbjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciggXHJcbiAgICAgICAgJHNjb3BlOiBuZy5JU2NvcGUsXHJcbiAgICAgICAgJHJvb3RTY29wZSxcclxuICAgICAgICAkZWxlbWVudCxcclxuICAgICAgICAkdGltZW91dCwgXHJcbiAgICAgICAgJGNvbXBpbGVcclxuICAgICAgICkge1xyXG4gICAgICAgICAgIC8vJHNjb3BlID0gXy5kZWZhdWx0cygkc2NvcGUsICRzY29wZS4kcGFyZW50KTsgICAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBcclxuICAgICAgICAgICB0aGlzLl8kdGltZW91dCA9ICR0aW1lb3V0O1xyXG4gICAgICAgICAgIHRoaXMudGVtcGxhdGVVcmwgPSAkc2NvcGVbJ3BhcmFtcyddLnRlbXBsYXRlVXJsO1xyXG4gICAgICAgICAgIHRoaXMudGVtcGxhdGUgPSAkc2NvcGVbJ3BhcmFtcyddLnRlbXBsYXRlO1xyXG4gICAgICAgICAgIHRoaXMudGltZW91dCA9ICRzY29wZVsncGFyYW1zJ10udGltZW91dDtcclxuICAgICAgICAgICB0aGlzLmVsZW1lbnQgPSAkc2NvcGVbJ3BhcmFtcyddLmVsZW1lbnQ7XHJcbiAgICAgICAgICAgdGhpcy5jYWxjSCA9ICRzY29wZVsncGFyYW1zJ10uY2FsY0hlaWdodDtcclxuICAgICAgICAgICB0aGlzLmNhbmNlbENhbGxiYWNrID0gJHNjb3BlWydwYXJhbXMnXS5jYW5jZWxDYWxsYmFjaztcclxuICAgICAgICAgICB0aGlzLmJhY2tkcm9wRWxlbWVudCA9ICQoJy5waXAtcG9wb3Zlci1iYWNrZHJvcCcpO1xyXG4gICAgICAgICAgIHRoaXMuYmFja2Ryb3BFbGVtZW50Lm9uKCdjbGljayBrZXlkb3duIHNjcm9sbCcsKCkgPT57IHRoaXMuYmFja2Ryb3BDbGljaygpfSk7XHJcbiAgICAgICAgICAgdGhpcy5iYWNrZHJvcEVsZW1lbnQuYWRkQ2xhc3MoJHNjb3BlWydwYXJhbXMnXS5yZXNwb25zaXZlICE9PSBmYWxzZSA/ICdwaXAtcmVzcG9uc2l2ZScgOiAnJyk7XHJcblxyXG4gICAgICAgICAgICR0aW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMucG9zaXRpb24oKTtcclxuICAgICAgICAgICAgICAgIGlmICgkc2NvcGVbJ3BhcmFtcyddLnRlbXBsYXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50ID0gJGNvbXBpbGUoJHNjb3BlWydwYXJhbXMnXS50ZW1wbGF0ZSkoJHNjb3BlKTtcclxuICAgICAgICAgICAgICAgICAgICAkZWxlbWVudC5maW5kKCcucGlwLXBvcG92ZXInKS5hcHBlbmQodGhpcy5jb250ZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmluaXQoKTtcclxuICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgJHRpbWVvdXQoKCkgPT4geyB0aGlzLmNhbGNIZWlnaHQoKTsgfSwgMjAwKTtcclxuICAgICAgICAgICAkcm9vdFNjb3BlLiRvbigncGlwUG9wb3ZlclJlc2l6ZScsICgpID0+IHsgdGhpcy5vblJlc2l6ZSgpfSk7XHJcbiAgICAgICAgICAgJCh3aW5kb3cpLnJlc2l6ZSgoKSA9PiB7IHRoaXMub25SZXNpemUoKSB9KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGJhY2tkcm9wQ2xpY2soKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY2FuY2VsQ2FsbGJhY2spIHtcclxuICAgICAgICAgICAgdGhpcy5jYW5jZWxDYWxsYmFjaygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNsb3NlUG9wb3ZlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjbG9zZVBvcG92ZXIoKSB7XHJcbiAgICAgICAgdGhpcy5iYWNrZHJvcEVsZW1lbnQucmVtb3ZlQ2xhc3MoJ29wZW5lZCcpO1xyXG4gICAgICAgIHRoaXMuXyR0aW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5iYWNrZHJvcEVsZW1lbnQucmVtb3ZlKCk7XHJcbiAgICAgICAgfSwgMTAwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25Qb3BvdmVyQ2xpY2soJGUpIHtcclxuICAgICAgICAkZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcHJpdmF0ZSBpbml0KCkge1xyXG4gICAgICAgIHRoaXMuYmFja2Ryb3BFbGVtZW50LmFkZENsYXNzKCdvcGVuZWQnKTtcclxuICAgICAgICAkKCcucGlwLXBvcG92ZXItYmFja2Ryb3AnKS5mb2N1cygpO1xyXG4gICAgICAgIGlmICh0aGlzLnRpbWVvdXQpIHtcclxuICAgICAgICAgICAgdGhpcy5fJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbG9zZVBvcG92ZXIoKTtcclxuICAgICAgICAgICAgfSwgdGhpcy50aW1lb3V0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBwb3NpdGlvbigpIHtcclxuICAgICAgICBpZiAodGhpcy5lbGVtZW50KSB7XHJcbiAgICAgICAgICAgIGxldCBlbGVtZW50ID0gJCh0aGlzLmVsZW1lbnQpLFxyXG4gICAgICAgICAgICAgICAgcG9zID0gZWxlbWVudC5vZmZzZXQoKSxcclxuICAgICAgICAgICAgICAgIHdpZHRoID0gZWxlbWVudC53aWR0aCgpLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0ID0gZWxlbWVudC5oZWlnaHQoKSxcclxuICAgICAgICAgICAgICAgIGRvY1dpZHRoID0gJChkb2N1bWVudCkud2lkdGgoKSxcclxuICAgICAgICAgICAgICAgIGRvY0hlaWdodCA9ICQoZG9jdW1lbnQpLmhlaWdodCgpLFxyXG4gICAgICAgICAgICAgICAgcG9wb3ZlciA9IHRoaXMuYmFja2Ryb3BFbGVtZW50LmZpbmQoJy5waXAtcG9wb3ZlcicpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHBvcykge1xyXG4gICAgICAgICAgICAgICAgcG9wb3ZlclxyXG4gICAgICAgICAgICAgICAgICAgIC5jc3MoJ21heC13aWR0aCcsIGRvY1dpZHRoIC0gKGRvY1dpZHRoIC0gcG9zLmxlZnQpKVxyXG4gICAgICAgICAgICAgICAgICAgIC5jc3MoJ21heC1oZWlnaHQnLCBkb2NIZWlnaHQgLSAocG9zLnRvcCArIGhlaWdodCkgLSAzMiwgMClcclxuICAgICAgICAgICAgICAgICAgICAuY3NzKCdsZWZ0JywgcG9zLmxlZnQgLSBwb3BvdmVyLndpZHRoKCkgKyB3aWR0aCAvIDIpXHJcbiAgICAgICAgICAgICAgICAgICAgLmNzcygndG9wJywgcG9zLnRvcCArIGhlaWdodCArIDE2KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uUmVzaXplKCkge1xyXG4gICAgICAgIHRoaXMuYmFja2Ryb3BFbGVtZW50LmZpbmQoJy5waXAtcG9wb3ZlcicpLmZpbmQoJy5waXAtY29udGVudCcpLmNzcygnbWF4LWhlaWdodCcsICcxMDAlJyk7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbigpO1xyXG4gICAgICAgIHRoaXMuY2FsY0hlaWdodCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY2FsY0hlaWdodCgpIHtcclxuICAgICAgICBpZiAodGhpcy5jYWxjSCA9PT0gZmFsc2UpIHsgcmV0dXJuOyB9XHJcbiAgICAgICAgbGV0IHBvcG92ZXIgPSB0aGlzLmJhY2tkcm9wRWxlbWVudC5maW5kKCcucGlwLXBvcG92ZXInKSxcclxuICAgICAgICB0aXRsZSA9IHBvcG92ZXIuZmluZCgnLnBpcC10aXRsZScpLFxyXG4gICAgICAgIGZvb3RlciA9IHBvcG92ZXIuZmluZCgnLnBpcC1mb290ZXInKSxcclxuICAgICAgICBjb250ZW50ID0gcG9wb3Zlci5maW5kKCcucGlwLWNvbnRlbnQnKSxcclxuICAgICAgICBjb250ZW50SGVpZ2h0ID0gcG9wb3Zlci5oZWlnaHQoKSAtIHRpdGxlLm91dGVySGVpZ2h0KHRydWUpIC0gZm9vdGVyLm91dGVySGVpZ2h0KHRydWUpO1xyXG4gICAgICAgIGNvbnRlbnQuY3NzKCdtYXgtaGVpZ2h0JywgTWF0aC5tYXgoY29udGVudEhlaWdodCwgMCkgKyAncHgnKS5jc3MoJ2JveC1zaXppbmcnLCAnYm9yZGVyLWJveCcpO1xyXG4gICAgfVxyXG59XHJcblxyXG4oKCkgPT4ge1xyXG4gICAgZnVuY3Rpb24gcGlwUG9wb3ZlcigkcGFyc2U6IGFueSkge1xyXG4gICAgICAgIFwibmdJbmplY3RcIjtcclxuXHJcbiAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgICAgICAgICBzY29wZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAncG9wb3Zlci9wb3BvdmVyLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogUG9wb3ZlckNvbnRyb2xsZXIsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bSdcclxuICAgICAgICAgICAgfTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3BpcFBvcG92ZXInLCBbJ3BpcFBvcG92ZXIuU2VydmljZSddKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ3BpcFBvcG92ZXInLCBwaXBQb3BvdmVyKTtcclxuXHJcblxyXG59KSgpO1xyXG5cclxuXHJcblxyXG4vKlxyXG4oZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciB0aGlzTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcFBvcG92ZXInLCBbJ3BpcFBvcG92ZXIuU2VydmljZSddKTtcclxuXHJcbiAgICB0aGlzTW9kdWxlLmRpcmVjdGl2ZSgncGlwUG9wb3ZlcicsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICAgICAgc2NvcGU6IHRydWUsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAncG9wb3Zlci9wb3BvdmVyLmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbiAoJHNjb3BlLCAkcm9vdFNjb3BlLCAkZWxlbWVudCwgJHRpbWVvdXQsICRjb21waWxlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYmFja2Ryb3BFbGVtZW50LCBjb250ZW50O1xyXG5cclxuICAgICAgICAgICAgICAgIGJhY2tkcm9wRWxlbWVudCA9ICQoJy5waXAtcG9wb3Zlci1iYWNrZHJvcCcpO1xyXG4gICAgICAgICAgICAgICAgYmFja2Ryb3BFbGVtZW50Lm9uKCdjbGljayBrZXlkb3duIHNjcm9sbCcsIGJhY2tkcm9wQ2xpY2spO1xyXG4gICAgICAgICAgICAgICAgYmFja2Ryb3BFbGVtZW50LmFkZENsYXNzKCRzY29wZS5wYXJhbXMucmVzcG9uc2l2ZSAhPT0gZmFsc2UgPyAncGlwLXJlc3BvbnNpdmUnIDogJycpO1xyXG5cclxuICAgICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkc2NvcGUucGFyYW1zLnRlbXBsYXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQgPSAkY29tcGlsZSgkc2NvcGUucGFyYW1zLnRlbXBsYXRlKSgkc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkZWxlbWVudC5maW5kKCcucGlwLXBvcG92ZXInKS5hcHBlbmQoY29udGVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpbml0KCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsY0hlaWdodCgpO1xyXG4gICAgICAgICAgICAgICAgfSwgMjAwKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkc2NvcGUub25Qb3BvdmVyQ2xpY2sgPSBvblBvcG92ZXJDbGljaztcclxuICAgICAgICAgICAgICAgICRzY29wZSA9IF8uZGVmYXVsdHMoJHNjb3BlLCAkc2NvcGUuJHBhcmVudCk7ICAgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgXHJcblxyXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kb24oJ3BpcFBvcG92ZXJSZXNpemUnLCBvblJlc2l6ZSk7XHJcbiAgICAgICAgICAgICAgICAkKHdpbmRvdykucmVzaXplKG9uUmVzaXplKTtcclxuXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJhY2tkcm9wRWxlbWVudC5hZGRDbGFzcygnb3BlbmVkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLnBpcC1wb3BvdmVyLWJhY2tkcm9wJykuZm9jdXMoKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoJHNjb3BlLnBhcmFtcy50aW1lb3V0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsb3NlUG9wb3ZlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAkc2NvcGUucGFyYW1zLnRpbWVvdXQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBiYWNrZHJvcENsaWNrKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkc2NvcGUucGFyYW1zLmNhbmNlbENhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5wYXJhbXMuY2FuY2VsQ2FsbGJhY2soKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNsb3NlUG9wb3ZlcigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGNsb3NlUG9wb3ZlcigpIHtcclxuICAgICAgICAgICAgICAgICAgICBiYWNrZHJvcEVsZW1lbnQucmVtb3ZlQ2xhc3MoJ29wZW5lZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmFja2Ryb3BFbGVtZW50LnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIDEwMCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gb25Qb3BvdmVyQ2xpY2soJGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAkZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBwb3NpdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoJHNjb3BlLnBhcmFtcy5lbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlbGVtZW50ID0gJCgkc2NvcGUucGFyYW1zLmVsZW1lbnQpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zID0gZWxlbWVudC5vZmZzZXQoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoID0gZWxlbWVudC53aWR0aCgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0ID0gZWxlbWVudC5oZWlnaHQoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY1dpZHRoID0gJChkb2N1bWVudCkud2lkdGgoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY0hlaWdodCA9ICQoZG9jdW1lbnQpLmhlaWdodCgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9wb3ZlciA9IGJhY2tkcm9wRWxlbWVudC5maW5kKCcucGlwLXBvcG92ZXInKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwb3MpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvcG92ZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY3NzKCdtYXgtd2lkdGgnLCBkb2NXaWR0aCAtIChkb2NXaWR0aCAtIHBvcy5sZWZ0KSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY3NzKCdtYXgtaGVpZ2h0JywgZG9jSGVpZ2h0IC0gKHBvcy50b3AgKyBoZWlnaHQpIC0gMzIsIDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNzcygnbGVmdCcsIHBvcy5sZWZ0IC0gcG9wb3Zlci53aWR0aCgpICsgd2lkdGggLyAyKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jc3MoJ3RvcCcsIHBvcy50b3AgKyBoZWlnaHQgKyAxNik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gY2FsY0hlaWdodCgpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoJHNjb3BlLnBhcmFtcy5jYWxjSGVpZ2h0ID09PSBmYWxzZSkgeyByZXR1cm47IH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBvcG92ZXIgPSBiYWNrZHJvcEVsZW1lbnQuZmluZCgnLnBpcC1wb3BvdmVyJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlID0gcG9wb3Zlci5maW5kKCcucGlwLXRpdGxlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvb3RlciA9IHBvcG92ZXIuZmluZCgnLnBpcC1mb290ZXInKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudCA9IHBvcG92ZXIuZmluZCgnLnBpcC1jb250ZW50JyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnRIZWlnaHQgPSBwb3BvdmVyLmhlaWdodCgpIC0gdGl0bGUub3V0ZXJIZWlnaHQodHJ1ZSkgLSBmb290ZXIub3V0ZXJIZWlnaHQodHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQuY3NzKCdtYXgtaGVpZ2h0JywgTWF0aC5tYXgoY29udGVudEhlaWdodCwgMCkgKyAncHgnKS5jc3MoJ2JveC1zaXppbmcnLCAnYm9yZGVyLWJveCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIG9uUmVzaXplKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJhY2tkcm9wRWxlbWVudC5maW5kKCcucGlwLXBvcG92ZXInKS5maW5kKCcucGlwLWNvbnRlbnQnKS5jc3MoJ21heC1oZWlnaHQnLCAnMTAwJScpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsY0hlaWdodCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH0pO1xyXG5cclxufSkoKTsqL1xyXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vdHlwaW5ncy90c2QuZC50c1wiIC8+XHJcblxyXG5leHBvcnQgY2xhc3MgUG9wb3ZlclNlcnZpY2Uge1xyXG4gIFxyXG4gICAgcHJpdmF0ZSBfJHRpbWVvdXQ7XHJcbiAgICBwcml2YXRlIF8kc2NvcGU6IG5nLklTY29wZTtcclxuICAgIHByaXZhdGUgXyRjb21waWxlO1xyXG4gICAgcHJpdmF0ZSBfJHJvb3RTY29wZTogbmcuSVJvb3RTY29wZVNlcnZpY2U7XHJcblxyXG4gICAgcHVibGljIHBvcG92ZXJUZW1wbGF0ZTogc3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCBcclxuICAgICAgICAkY29tcGlsZSxcclxuICAgICAgICAkcm9vdFNjb3BlLCBcclxuICAgICAgICAkdGltZW91dFxyXG4gICAgICAgKSB7XHJcbiAgICAgICAgICAgdGhpcy5fJGNvbXBpbGUgPSAkY29tcGlsZTtcclxuICAgICAgICAgICB0aGlzLl8kcm9vdFNjb3BlID0gJHJvb3RTY29wZTtcclxuICAgICAgICAgICB0aGlzLl8kdGltZW91dCA9ICR0aW1lb3V0O1xyXG4gICAgICAgICAgIHRoaXMucG9wb3ZlclRlbXBsYXRlID0gXCI8ZGl2IGNsYXNzPSdwaXAtcG9wb3Zlci1iYWNrZHJvcCB7eyBwYXJhbXMuY2xhc3MgfX0nIG5nLWNvbnRyb2xsZXI9J3BhcmFtcy5jb250cm9sbGVyJ1wiICtcclxuICAgICAgICAgICAgICAgIFwiIHRhYmluZGV4PScxJz4gPHBpcC1wb3BvdmVyIHBpcC1wYXJhbXM9J3BhcmFtcyc+IDwvcGlwLXBvcG92ZXI+IDwvZGl2PlwiO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzaG93KHApIHtcclxuICAgICAgICBsZXQgZWxlbWVudCwgc2NvcGU6IG5nLklTY29wZSwgcGFyYW1zLCBjb250ZW50O1xyXG4gICAgICAgICAgICBcclxuICAgICAgICBlbGVtZW50ID0gJCgnYm9keScpO1xyXG4gICAgICAgIGlmIChlbGVtZW50LmZpbmQoJ21kLWJhY2tkcm9wJykubGVuZ3RoID4gMCkgeyByZXR1cm47IH1cclxuICAgICAgICB0aGlzLmhpZGUoKTtcclxuICAgICAgICBzY29wZSA9IHRoaXMuXyRyb290U2NvcGUuJG5ldygpO1xyXG4gICAgICAgIHBhcmFtcyA9IHAgJiYgXy5pc09iamVjdChwKSA/IHAgOiB7fTtcclxuICAgICAgICBzY29wZVsncGFyYW1zJ10gPSBwYXJhbXM7XHJcbiAgICAgICAgc2NvcGVbJ2xvY2FscyddID0gcGFyYW1zLmxvY2FscztcclxuICAgICAgICBjb250ZW50ID0gdGhpcy5fJGNvbXBpbGUodGhpcy5wb3BvdmVyVGVtcGxhdGUpKHNjb3BlKTtcclxuICAgICAgICBlbGVtZW50LmFwcGVuZChjb250ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaGlkZSgpIHtcclxuICAgICAgICBsZXQgYmFja2Ryb3BFbGVtZW50ID0gJCgnLnBpcC1wb3BvdmVyLWJhY2tkcm9wJyk7XHJcbiAgICAgICAgYmFja2Ryb3BFbGVtZW50LnJlbW92ZUNsYXNzKCdvcGVuZWQnKTtcclxuICAgICAgICB0aGlzLl8kdGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGJhY2tkcm9wRWxlbWVudC5yZW1vdmUoKTtcclxuICAgICAgICB9LCAxMDApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZXNpemUoKSB7XHJcbiAgICAgICAgdGhpcy5fJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdwaXBQb3BvdmVyUmVzaXplJyk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG4oKCkgPT4ge1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3BpcFBvcG92ZXIuU2VydmljZScsIFtdKVxyXG4gICAgICAgIC5zZXJ2aWNlKCdwaXBQb3BvdmVyU2VydmljZScsIFBvcG92ZXJTZXJ2aWNlKTtcclxufSkoKTsiLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vdHlwaW5ncy90c2QuZC50c1wiIC8+XHJcblxyXG5jbGFzcyBSb3V0aW5nQ29udHJvbGxlciB7XHJcbiAgICBwcml2YXRlIF9pbWFnZTogYW55O1xyXG5cclxuICAgIHB1YmxpYyBsb2dvVXJsOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgc2hvd1Byb2dyZXNzOiBGdW5jdGlvbjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciggXHJcbiAgICAgICAgJHNjb3BlOiBuZy5JU2NvcGUsXHJcbiAgICAgICAgJGVsZW1lbnQpXHJcbiAgICB7XHJcblxyXG4gICAgICAgIHRoaXMuX2ltYWdlID0gJGVsZW1lbnQuY2hpbGRyZW4oJ2ltZycpOyBcclxuICAgICAgICB0aGlzLnNob3dQcm9ncmVzcyA9ICRzY29wZVsnc2hvd1Byb2dyZXNzJ11cclxuICAgICAgICB0aGlzLmxvZ29VcmwgPSAkc2NvcGVbJ2xvZ29VcmwnXTsgICAgICAgIFxyXG4gICAgICAgIHRoaXMubG9hZFByb2dyZXNzSW1hZ2UoKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGxvYWRQcm9ncmVzc0ltYWdlKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmxvZ29VcmwpIHtcclxuICAgICAgICAgICAgdGhpcy5faW1hZ2UuYXR0cignc3JjJywgdGhpcy5sb2dvVXJsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5cclxuKCgpID0+IHtcclxuXHJcbiAgICBmdW5jdGlvbiBSb3V0aW5nUHJvZ3Jlc3MoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgICAgIHJlcGxhY2U6IHRydWUsXHJcbiAgICAgICAgICAgIHNjb3BlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2hvd1Byb2dyZXNzOiAnJicsXHJcbiAgICAgICAgICAgICAgICAgICAgbG9nb1VybDogJ0AnXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3Byb2dyZXNzL3JvdXRpbmdfcHJvZ3Jlc3MuaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFJvdXRpbmdDb250cm9sbGVyLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bSdcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncGlwUm91dGluZ1Byb2dyZXNzJywgWyduZ01hdGVyaWFsJ10pXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgncGlwUm91dGluZ1Byb2dyZXNzJywgUm91dGluZ1Byb2dyZXNzKTtcclxuXHJcbn0pKCk7XHJcbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi90eXBpbmdzL3RzZC5kLnRzXCIgLz5cclxuXHJcbmludGVyZmFjZSBJUGlwVG9hc3Qge1xyXG4gICAgdHlwZTogc3RyaW5nO1xyXG4gICAgaWQ6IHN0cmluZztcclxuICAgIGVycm9yOiBhbnk7XHJcbiAgICBtZXNzYWdlOiBzdHJpbmc7XHJcbiAgICBhY3Rpb25zOiBzdHJpbmdbXTtcclxuICAgIGR1cmF0aW9uOiBudW1iZXI7XHJcbiAgICBzdWNjZXNzQ2FsbGJhY2s6IEZ1bmN0aW9uO1xyXG4gICAgY2FuY2VsQ2FsbGJhY2s6IEZ1bmN0aW9uXHJcbn1cclxuXHJcbmNsYXNzIFRvYXN0Q29udHJvbGxlciB7XHJcbiAgICBwcml2YXRlIF8kbWRUb2FzdDogYW5ndWxhci5tYXRlcmlhbC5JVG9hc3RTZXJ2aWNlO1xyXG4gICAgcHJpdmF0ZSBfcGlwRXJyb3JEZXRhaWxzRGlhbG9nO1xyXG5cclxuICAgIHB1YmxpYyBtZXNzYWdlOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgYWN0aW9uczogc3RyaW5nW107XHJcbiAgICBwdWJsaWMgdG9hc3Q6IElQaXBUb2FzdDtcclxuICAgIHB1YmxpYyBhY3Rpb25MZW5naHQ6IG51bWJlcjtcclxuICAgIHB1YmxpYyBzaG93RGV0YWlsczogYm9vbGVhbjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciggXHJcbiAgICAgICAgJG1kVG9hc3Q6IGFuZ3VsYXIubWF0ZXJpYWwuSVRvYXN0U2VydmljZSwgXHJcbiAgICAgICAgdG9hc3Q6IElQaXBUb2FzdCwgXHJcbiAgICAgICAgJGluamVjdG9yXHJcbiAgICAgICApIHtcclxuICAgICAgICAgICAgdGhpcy5fcGlwRXJyb3JEZXRhaWxzRGlhbG9nID0gJGluamVjdG9yLmhhcygncGlwRXJyb3JEZXRhaWxzRGlhbG9nJykgXHJcbiAgICAgICAgICAgICAgICA/ICRpbmplY3Rvci5nZXQoJ3BpcEVycm9yRGV0YWlsc0RpYWxvZycpIDogbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5fJG1kVG9hc3QgPSAkbWRUb2FzdDtcclxuICAgICAgICAgICAgdGhpcy5tZXNzYWdlID0gdG9hc3QubWVzc2FnZTtcclxuICAgICAgICAgICAgdGhpcy5hY3Rpb25zID0gdG9hc3QuYWN0aW9ucztcclxuICAgICAgICAgICAgdGhpcy50b2FzdCA9IHRvYXN0O1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKHRvYXN0LmFjdGlvbnMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFjdGlvbkxlbmdodCA9IDA7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFjdGlvbkxlbmdodCA9IHRvYXN0LmFjdGlvbnMubGVuZ3RoID09PSAxID8gdG9hc3QuYWN0aW9uc1swXS50b1N0cmluZygpLmxlbmd0aCA6IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuc2hvd0RldGFpbHMgPSB0aGlzLl9waXBFcnJvckRldGFpbHNEaWFsb2cgIT0gbnVsbDtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgIHB1YmxpYyBvbkRldGFpbHMoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fJG1kVG9hc3QuaGlkZSgpO1xyXG4gICAgICAgIGlmICh0aGlzLl9waXBFcnJvckRldGFpbHNEaWFsb2cpIHtcclxuICAgICAgICAgICAgdGhpcy5fcGlwRXJyb3JEZXRhaWxzRGlhbG9nLnNob3coXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGVycm9yOiB0aGlzLnRvYXN0LmVycm9yLFxyXG4gICAgICAgICAgICAgICAgb2s6ICdPaydcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYW5ndWxhci5ub29wLFxyXG4gICAgICAgICAgICBhbmd1bGFyLm5vb3BcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uQWN0aW9uKGFjdGlvbik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuXyRtZFRvYXN0LmhpZGUoXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBhY3Rpb246IGFjdGlvbixcclxuICAgICAgICAgICAgaWQ6IHRoaXMudG9hc3QuaWQsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IHRoaXMubWVzc2FnZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxufVxyXG5cclxuaW50ZXJmYWNlIElUb2FzdFNlcnZpY2Uge1xyXG4gICAgc2hvd05leHRUb2FzdCgpOiB2b2lkO1xyXG4gICAgc2hvd1RvYXN0KHRvYXN0OiBJUGlwVG9hc3QpOiB2b2lkO1xyXG4gICAgYWRkVG9hc3QodG9hc3QpOiB2b2lkO1xyXG4gICAgcmVtb3ZlVG9hc3RzKHR5cGU6IHN0cmluZyk6IHZvaWQ7XHJcbiAgICBnZXRUb2FzdEJ5SWQoaWQ6IHN0cmluZyk6IElQaXBUb2FzdDtcclxuICAgIHJlbW92ZVRvYXN0c0J5SWQoaWQ6IHN0cmluZyk6IHZvaWQ7XHJcbiAgICBvbkNsZWFyVG9hc3RzKCk6IHZvaWQ7XHJcbiAgICBzaG93Tm90aWZpY2F0aW9uKG1lc3NhZ2U6IHN0cmluZywgYWN0aW9uczogc3RyaW5nW10sIHN1Y2Nlc3NDYWxsYmFjaywgY2FuY2VsQ2FsbGJhY2ssIGlkOiBzdHJpbmcpO1xyXG4gICAgc2hvd01lc3NhZ2UobWVzc2FnZTogc3RyaW5nLCBzdWNjZXNzQ2FsbGJhY2ssIGNhbmNlbENhbGxiYWNrLCBpZD86IHN0cmluZyk7XHJcbiAgICBzaG93RXJyb3IobWVzc2FnZTogc3RyaW5nLCBzdWNjZXNzQ2FsbGJhY2ssIGNhbmNlbENhbGxiYWNrLCBpZDogc3RyaW5nLCBlcnJvcjogYW55KTtcclxuICAgIGhpZGVBbGxUb2FzdHMoKTogdm9pZDtcclxuICAgIGNsZWFyVG9hc3RzKHR5cGU/OiBzdHJpbmcpO1xyXG59XHJcblxyXG5jbGFzcyBUb2FzdFNlcnZpY2UgaW1wbGVtZW50cyBJVG9hc3RTZXJ2aWNlIHtcclxuICAgIHByaXZhdGUgU0hPV19USU1FT1VUOiBudW1iZXIgPSAyMDAwMDtcclxuICAgIHByaXZhdGUgU0hPV19USU1FT1VUX05PVElGSUNBVElPTlM6IG51bWJlciA9IDIwMDAwO1xyXG4gICAgcHJpdmF0ZSB0b2FzdHM6IElQaXBUb2FzdFtdID0gW107XHJcbiAgICBwcml2YXRlIGN1cnJlbnRUb2FzdDogYW55O1xyXG4gICAgcHJpdmF0ZSBzb3VuZHM6IGFueSA9IHt9O1xyXG5cclxuICAgIHByaXZhdGUgXyRtZFRvYXN0OiBhbmd1bGFyLm1hdGVyaWFsLklUb2FzdFNlcnZpY2U7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgJHJvb3RTY29wZTogbmcuSVJvb3RTY29wZVNlcnZpY2UsIFxyXG4gICAgICAgICRtZFRvYXN0OiBhbmd1bGFyLm1hdGVyaWFsLklUb2FzdFNlcnZpY2UpIHtcclxuXHJcbiAgICAgICAgdGhpcy5fJG1kVG9hc3QgPSAkbWRUb2FzdDtcclxuXHJcbiAgICAgICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN1Y2Nlc3MnLCAoKSA9PiB7dGhpcy5vblN0YXRlQ2hhbmdlU3VjY2VzcygpfSk7XHJcbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ3BpcFNlc3Npb25DbG9zZWQnLCAoKSA9PiB7dGhpcy5vbkNsZWFyVG9hc3RzKCl9KTtcclxuICAgICAgICAkcm9vdFNjb3BlLiRvbigncGlwSWRlbnRpdHlDaGFuZ2VkJywgKCkgPT4ge3RoaXMub25DbGVhclRvYXN0cygpfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNob3dOZXh0VG9hc3QoKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IHRvYXN0OiBJUGlwVG9hc3Q7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnRvYXN0cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHRvYXN0ID0gdGhpcy50b2FzdHNbMF07XHJcbiAgICAgICAgICAgIHRoaXMudG9hc3RzLnNwbGljZSgwLCAxKTtcclxuICAgICAgICAgICAgdGhpcy5zaG93VG9hc3QodG9hc3QpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAgLy8gU2hvdyB0b2FzdFxyXG4gICAgIHB1YmxpYyBzaG93VG9hc3QodG9hc3Q6IElQaXBUb2FzdCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuY3VycmVudFRvYXN0ID0gdG9hc3Q7XHJcblxyXG4gICAgICAgIHRoaXMuXyRtZFRvYXN0LnNob3coe1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RvYXN0L3RvYXN0Lmh0bWwnLFxyXG4gICAgICAgICAgICBoaWRlRGVsYXk6IHRvYXN0LmR1cmF0aW9uIHx8IHRoaXMuU0hPV19USU1FT1VULFxyXG4gICAgICAgICAgICBwb3NpdGlvbjogJ2JvdHRvbSBsZWZ0JyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogVG9hc3RDb250cm9sbGVyLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgICAgICAgICAgIGxvY2Fsczoge1xyXG4gICAgICAgICAgICAgICAgdG9hc3Q6IHRoaXMuY3VycmVudFRvYXN0LFxyXG4gICAgICAgICAgICAgICAgc291bmRzOiB0aGlzLnNvdW5kc1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICAudGhlbiggXHJcbiAgICAgICAgICAgIChhY3Rpb246IHN0cmluZykgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zaG93VG9hc3RPa1Jlc3VsdChhY3Rpb24pO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAoYWN0aW9uOiBzdHJpbmcpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hvd1RvYXN0Q2FuY2VsUmVzdWx0KGFjdGlvbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2hvd1RvYXN0Q2FuY2VsUmVzdWx0KGFjdGlvbjogc3RyaW5nKTp2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50VG9hc3QuY2FuY2VsQ2FsbGJhY2spIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50VG9hc3QuY2FuY2VsQ2FsbGJhY2soYWN0aW9uKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jdXJyZW50VG9hc3QgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuc2hvd05leHRUb2FzdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2hvd1RvYXN0T2tSZXN1bHQoYWN0aW9uOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50VG9hc3Quc3VjY2Vzc0NhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFRvYXN0LnN1Y2Nlc3NDYWxsYmFjayhhY3Rpb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmN1cnJlbnRUb2FzdCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5zaG93TmV4dFRvYXN0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZFRvYXN0KHRvYXN0KTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFRvYXN0ICYmIHRvYXN0LnR5cGUgIT09ICdlcnJvcicpIHtcclxuICAgICAgICAgICAgdGhpcy50b2FzdHMucHVzaCh0b2FzdCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zaG93VG9hc3QodG9hc3QpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVtb3ZlVG9hc3RzKHR5cGU6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIGxldCByZXN1bHQ6IGFueVtdID0gW107XHJcbiAgICAgICAgXy5lYWNoKHRoaXMudG9hc3RzLCAodG9hc3QpID0+IHtcclxuICAgICAgICAgICAgaWYgKCF0b2FzdC50eXBlIHx8IHRvYXN0LnR5cGUgIT09IHR5cGUpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHRvYXN0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMudG9hc3RzID0gXy5jbG9uZURlZXAocmVzdWx0KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVtb3ZlVG9hc3RzQnlJZChpZDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgXy5yZW1vdmUodGhpcy50b2FzdHMsIHtpZDogaWR9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0VG9hc3RCeUlkKGlkOiBzdHJpbmcpOiBJUGlwVG9hc3Qge1xyXG4gICAgICAgIHJldHVybiBfLmZpbmQodGhpcy50b2FzdHMsIHtpZDogaWR9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25TdGF0ZUNoYW5nZVN1Y2Nlc3MoKSB7fVxyXG5cclxuICAgIHB1YmxpYyBvbkNsZWFyVG9hc3RzKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuY2xlYXJUb2FzdHMobnVsbCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNob3dOb3RpZmljYXRpb24obWVzc2FnZTogc3RyaW5nLCBhY3Rpb25zOiBzdHJpbmdbXSwgc3VjY2Vzc0NhbGxiYWNrLCBjYW5jZWxDYWxsYmFjaywgaWQ6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuYWRkVG9hc3Qoe1xyXG4gICAgICAgICAgICBpZDogaWQgfHwgbnVsbCxcclxuICAgICAgICAgICAgdHlwZTogJ25vdGlmaWNhdGlvbicsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXHJcbiAgICAgICAgICAgIGFjdGlvbnM6IGFjdGlvbnMgfHwgWydvayddLFxyXG4gICAgICAgICAgICBzdWNjZXNzQ2FsbGJhY2s6IHN1Y2Nlc3NDYWxsYmFjayxcclxuICAgICAgICAgICAgY2FuY2VsQ2FsbGJhY2s6IGNhbmNlbENhbGxiYWNrLFxyXG4gICAgICAgICAgICBkdXJhdGlvbjogdGhpcy5TSE9XX1RJTUVPVVRfTk9USUZJQ0FUSU9OU1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzaG93TWVzc2FnZShtZXNzYWdlOiBzdHJpbmcsIHN1Y2Nlc3NDYWxsYmFjaywgY2FuY2VsQ2FsbGJhY2ssIGlkPzogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5hZGRUb2FzdCh7XHJcbiAgICAgICAgICAgIGlkOiBpZCB8fCBudWxsLFxyXG4gICAgICAgICAgICB0eXBlOiAnbWVzc2FnZScsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXHJcbiAgICAgICAgICAgIGFjdGlvbnM6IFsnb2snXSxcclxuICAgICAgICAgICAgc3VjY2Vzc0NhbGxiYWNrOiBzdWNjZXNzQ2FsbGJhY2ssXHJcbiAgICAgICAgICAgIGNhbmNlbENhbGxiYWNrOiBjYW5jZWxDYWxsYmFja1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgICBwdWJsaWMgc2hvd0Vycm9yKG1lc3NhZ2U6IHN0cmluZywgc3VjY2Vzc0NhbGxiYWNrLCBjYW5jZWxDYWxsYmFjaywgaWQ6IHN0cmluZywgZXJyb3I6IGFueSkge1xyXG4gICAgICAgIHRoaXMuYWRkVG9hc3Qoe1xyXG4gICAgICAgICAgICBpZDogaWQgfHwgbnVsbCxcclxuICAgICAgICAgICAgZXJyb3I6IGVycm9yLFxyXG4gICAgICAgICAgICB0eXBlOiAnZXJyb3InLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBtZXNzYWdlIHx8ICdVbmtub3duIGVycm9yLicsXHJcbiAgICAgICAgICAgIGFjdGlvbnM6IFsnb2snXSxcclxuICAgICAgICAgICAgc3VjY2Vzc0NhbGxiYWNrOiBzdWNjZXNzQ2FsbGJhY2ssXHJcbiAgICAgICAgICAgIGNhbmNlbENhbGxiYWNrOiBjYW5jZWxDYWxsYmFja1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBoaWRlQWxsVG9hc3RzKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuXyRtZFRvYXN0LmNhbmNlbCgpO1xyXG4gICAgICAgIHRoaXMudG9hc3RzID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNsZWFyVG9hc3RzKHR5cGU/OiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAodHlwZSkge1xyXG4gICAgICAgICAgICAvLyBwaXBBc3NlcnQuaXNTdHJpbmcodHlwZSwgJ3BpcFRvYXN0cy5jbGVhclRvYXN0czogdHlwZSBzaG91bGQgYmUgYSBzdHJpbmcnKTtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmVUb2FzdHModHlwZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fJG1kVG9hc3QuY2FuY2VsKCk7XHJcbiAgICAgICAgICAgIHRoaXMudG9hc3RzID0gW107XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufVxyXG5cclxuXHJcbigoKSA9PiB7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncGlwVG9hc3RzJywgWyduZ01hdGVyaWFsJywgJ3BpcENvbnRyb2xzLlRyYW5zbGF0ZSddKVxyXG4gICAgICAgIC5zZXJ2aWNlKCdwaXBUb2FzdHMnLCBUb2FzdFNlcnZpY2UpO1xyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24obW9kdWxlKSB7XG50cnkge1xuICBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgncGlwQ29udHJvbHMuVGVtcGxhdGVzJyk7XG59IGNhdGNoIChlKSB7XG4gIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBDb250cm9scy5UZW1wbGF0ZXMnLCBbXSk7XG59XG5tb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoJ2NvbG9yX3BpY2tlci9jb2xvcl9waWNrZXIuaHRtbCcsXG4gICAgJzx1bCBjbGFzcz1cInBpcC1jb2xvci1waWNrZXIge3t2bS5jbGFzc319XCIgcGlwLXNlbGVjdGVkPVwidm0uY3VycmVudENvbG9ySW5kZXhcIiBwaXAtZW50ZXItc3BhY2UtcHJlc3M9XCJ2bS5lbnRlclNwYWNlUHJlc3MoJGV2ZW50KVwiPjxsaSB0YWJpbmRleD1cIi0xXCIgbmctcmVwZWF0PVwiY29sb3IgaW4gdm0uY29sb3JzIHRyYWNrIGJ5IGNvbG9yXCI+PG1kLWJ1dHRvbiB0YWJpbmRleD1cIi0xXCIgY2xhc3M9XCJtZC1pY29uLWJ1dHRvbiBwaXAtc2VsZWN0YWJsZVwiIG5nLWNsaWNrPVwidm0uc2VsZWN0Q29sb3IoJGluZGV4KVwiIGFyaWEtbGFiZWw9XCJjb2xvclwiIG5nLWRpc2FibGVkPVwidm0uZGlzYWJsZWQoKVwiPjxtZC1pY29uIG5nLXN0eWxlPVwie1xcJ2NvbG9yXFwnOiBjb2xvcn1cIiBtZC1zdmctaWNvbj1cImljb25zOnt7IGNvbG9yID09IHZtLmN1cnJlbnRDb2xvciA/IFxcJ2NpcmNsZVxcJyA6IFxcJ3JhZGlvLW9mZlxcJyB9fVwiPjwvbWQtaWNvbj48L21kLWJ1dHRvbj48L2xpPjwvdWw+Jyk7XG59XSk7XG59KSgpO1xuXG4oZnVuY3Rpb24obW9kdWxlKSB7XG50cnkge1xuICBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgncGlwQ29udHJvbHMuVGVtcGxhdGVzJyk7XG59IGNhdGNoIChlKSB7XG4gIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBDb250cm9scy5UZW1wbGF0ZXMnLCBbXSk7XG59XG5tb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoJ3BvcG92ZXIvcG9wb3Zlci5odG1sJyxcbiAgICAnPGRpdiBuZy1pZj1cInZtLnRlbXBsYXRlVXJsXCIgY2xhc3M9XCJwaXAtcG9wb3ZlciBmbGV4IGxheW91dC1jb2x1bW5cIiBuZy1jbGljaz1cInZtLm9uUG9wb3ZlckNsaWNrKCRldmVudClcIiBuZy1pbmNsdWRlPVwidm0udGVtcGxhdGVVcmxcIj48L2Rpdj48ZGl2IG5nLWlmPVwidm0udGVtcGxhdGVcIiBjbGFzcz1cInBpcC1wb3BvdmVyXCIgbmctY2xpY2s9XCJ2bS5vblBvcG92ZXJDbGljaygkZXZlbnQpXCI+PC9kaXY+Jyk7XG59XSk7XG59KSgpO1xuXG4oZnVuY3Rpb24obW9kdWxlKSB7XG50cnkge1xuICBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgncGlwQ29udHJvbHMuVGVtcGxhdGVzJyk7XG59IGNhdGNoIChlKSB7XG4gIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBDb250cm9scy5UZW1wbGF0ZXMnLCBbXSk7XG59XG5tb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoJ3Byb2dyZXNzL3JvdXRpbmdfcHJvZ3Jlc3MuaHRtbCcsXG4gICAgJzxkaXYgY2xhc3M9XCJwaXAtcm91dGluZy1wcm9ncmVzcyBsYXlvdXQtY29sdW1uIGxheW91dC1hbGlnbi1jZW50ZXItY2VudGVyXCIgbmctc2hvdz1cInZtLnNob3dQcm9ncmVzcygpXCI+PGRpdiBjbGFzcz1cImxvYWRlclwiPjxzdmcgY2xhc3M9XCJjaXJjdWxhclwiIHZpZXdib3g9XCIyNSAyNSA1MCA1MFwiPjxjaXJjbGUgY2xhc3M9XCJwYXRoXCIgY3g9XCI1MFwiIGN5PVwiNTBcIiByPVwiMjBcIiBmaWxsPVwibm9uZVwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbWl0ZXJsaW1pdD1cIjEwXCI+PC9jaXJjbGU+PC9zdmc+PC9kaXY+PGltZyBzcmM9XCJcIiBoZWlnaHQ9XCI0MFwiIHdpZHRoPVwiNDBcIiBjbGFzcz1cInBpcC1pbWdcIj48bWQtcHJvZ3Jlc3MtY2lyY3VsYXIgbWQtZGlhbWV0ZXI9XCI5NlwiIGNsYXNzPVwiZml4LWllXCI+PC9tZC1wcm9ncmVzcy1jaXJjdWxhcj48L2Rpdj4nKTtcbn1dKTtcbn0pKCk7XG5cbihmdW5jdGlvbihtb2R1bGUpIHtcbnRyeSB7XG4gIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBDb250cm9scy5UZW1wbGF0ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcENvbnRyb2xzLlRlbXBsYXRlcycsIFtdKTtcbn1cbm1vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgndG9hc3QvdG9hc3QuaHRtbCcsXG4gICAgJzxtZC10b2FzdCBjbGFzcz1cIm1kLWFjdGlvbiBwaXAtdG9hc3RcIiBuZy1jbGFzcz1cIntcXCdwaXAtZXJyb3JcXCc6IHZtLnRvYXN0LnR5cGU9PVxcJ2Vycm9yXFwnLCBcXCdwaXAtY29sdW1uLXRvYXN0XFwnOiB2bS50b2FzdC5hY3Rpb25zLmxlbmd0aCA+IDEgfHwgdm0uYWN0aW9uTGVuZ2h0ID4gNCwgXFwncGlwLW5vLWFjdGlvbi10b2FzdFxcJzogdm0uYWN0aW9uTGVuZ2h0ID09IDB9XCIgc3R5bGU9XCJoZWlnaHQ6aW5pdGlhbDsgbWF4LWhlaWdodDogaW5pdGlhbDtcIj48c3BhbiBjbGFzcz1cImZsZXgtdmFyIHBpcC10ZXh0XCIgbmctYmluZC1odG1sPVwidm0ubWVzc2FnZVwiPjwvc3Bhbj48ZGl2IGNsYXNzPVwibGF5b3V0LXJvdyBsYXlvdXQtYWxpZ24tZW5kLXN0YXJ0IHBpcC1hY3Rpb25zXCIgbmctaWY9XCJ2bS5hY3Rpb25zLmxlbmd0aCA+IDAgfHwgKHZtLnRvYXN0LnR5cGU9PVxcJ2Vycm9yXFwnICYmIHZtLnRvYXN0LmVycm9yKVwiPjxkaXYgY2xhc3M9XCJmbGV4XCIgbmctaWY9XCJ2bS50b2FzdC5hY3Rpb25zLmxlbmd0aCA+IDFcIj48L2Rpdj48bWQtYnV0dG9uIGNsYXNzPVwiZmxleC1maXhlZCBwaXAtdG9hc3QtYnV0dG9uXCIgbmctaWY9XCJ2bS50b2FzdC50eXBlPT1cXCdlcnJvclxcJyAmJiB2bS50b2FzdC5lcnJvciAmJiB2bS5zaG93RGV0YWlsc1wiIG5nLWNsaWNrPVwidm0ub25EZXRhaWxzKClcIj5EZXRhaWxzPC9tZC1idXR0b24+PG1kLWJ1dHRvbiBjbGFzcz1cImZsZXgtZml4ZWQgcGlwLXRvYXN0LWJ1dHRvblwiIG5nLWNsaWNrPVwidm0ub25BY3Rpb24oYWN0aW9uKVwiIG5nLXJlcGVhdD1cImFjdGlvbiBpbiB2bS5hY3Rpb25zXCIgYXJpYS1sYWJlbD1cInt7OjphY3Rpb258IHRyYW5zbGF0ZX19XCI+e3s6OmFjdGlvbnwgdHJhbnNsYXRlfX08L21kLWJ1dHRvbj48L2Rpdj48L21kLXRvYXN0PicpO1xufV0pO1xufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGlwLXdlYnVpLWNvbnRyb2xzLWh0bWwubWluLmpzLm1hcFxuIl19