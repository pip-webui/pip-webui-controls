(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.pip || (g.pip = {})).controls = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var DEFAULT_COLORS = ['purple', 'lightgreen', 'green', 'darkred', 'pink', 'yellow', 'cyan'];
var ColorPickerController = (function () {
    function ColorPickerController($scope, $element, $attrs, $timeout) {
        this._$timeout = $timeout;
        this._$scope = $scope;
        this.class = $attrs.class || '';
        this.colors = !$scope['vm']['colors'] ||
            _.isArray($scope['vm']['colors']) && $scope['vm']['colors'].length === 0 ? DEFAULT_COLORS : $scope['vm']['colors'];
        this.colorChange = $scope['vm']['colorChange'] || null;
        this.currentColor = $scope['vm']['currentColor'] || this.colors[0];
        this.currentColorIndex = this.colors.indexOf(this.currentColor);
        this.ngDisabled = $scope['vm']['ngDisabled'] || false;
    }
    ColorPickerController.prototype.$onChanges = function (changes) {
        this.colors = _.isArray(changes['colors'].currentValue) && changes['colors'].currentValue.length !== 0 ?
            changes['colors'].currentValue : DEFAULT_COLORS;
        this.currentColor = changes['currentColor'].currentValue || this.colors[0];
    };
    ColorPickerController.prototype.disabled = function () {
        if (this.ngDisabled) {
            return true;
        }
        return false;
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
var pipColorPicker = {
    bindings: {
        ngDisabled: '<?ngDisabled',
        colors: '<pipColors',
        currentColor: '=ngModel',
        colorChange: '<?ngChange'
    },
    templateUrl: 'color_picker/color_picker.html',
    controller: ColorPickerController,
    controllerAs: 'vm'
};
angular
    .module('pipColorPicker', ['pipControls.Templates'])
    .component('pipColorPicker', pipColorPicker);
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
    pipImageSliderController.$inject = ['$scope', '$element', '$attrs', '$parse', '$timeout', '$interval', 'pipImageSlider'];
    function pipImageSliderController($scope, $element, $attrs, $parse, $timeout, $interval, pipImageSlider) {
        var _this = this;
        this._index = 0;
        this.DEFAULT_INTERVAL = 4500;
        this.swipeStart = 0;
        this.sliderIndex = $scope['vm']['sliderIndex'];
        this._type = $scope['vm']['type']();
        this._interval = $scope['vm']['interval']();
        this._$attrs = $attrs;
        this._$interval = $interval;
        this._$scope = $scope;
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
            pipImageSlider.toBlock(_this._type, _this._blocks, _this._index, _this._newIndex, _this._direction);
            _this._index = _this._newIndex;
            _this.setIndex();
        }, 700);
        if ($attrs.id) {
            pipImageSlider.registerSlider($attrs.id, $scope);
        }
        $element.on('$destroy', function () {
            _this.stopInterval();
            pipImageSlider.removeSlider($attrs.id);
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
            bindToController: true,
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
        this._sliders[sliderId] = sliderScope;
    };
    ImageSliderService.prototype.removeSlider = function (sliderId) {
        delete this._sliders[sliderId];
    };
    ImageSliderService.prototype.getSliderScope = function (sliderId) {
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
        .service('pipImageSlider', ImageSliderService);
})();
},{}],6:[function(require,module,exports){
(function () {
    'use strict';
    var thisModule = angular.module('pipSliderButton', []);
    thisModule.directive('pipSliderButton', function () {
        return {
            scope: {},
            controller: ['$scope', '$element', '$parse', '$attrs', 'pipImageSlider', function ($scope, $element, $parse, $attrs, pipImageSlider) {
                var type = $parse($attrs.pipButtonType)($scope), sliderId = $parse($attrs.pipSliderId)($scope);
                $element.on('click', function () {
                    if (!sliderId || !type) {
                        return;
                    }
                    pipImageSlider.getSliderScope(sliderId).vm[type + 'Block']();
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
            controller: ['$scope', '$element', '$parse', '$attrs', 'pipImageSlider', function ($scope, $element, $parse, $attrs, pipImageSlider) {
                var sliderId = $parse($attrs.pipSliderId)($scope), slideTo = $parse($attrs.pipSlideTo)($scope);
                $element.css('cursor', 'pointer');
                $element.on('click', function () {
                    if (!sliderId || slideTo && slideTo < 0) {
                        return;
                    }
                    pipImageSlider.getSliderScope(sliderId).vm.slideToPrivate(slideTo);
                });
            }]
        };
    });
})();
},{}],8:[function(require,module,exports){
Config.$inject = ['$injector'];
function Config($injector) {
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
}
var MarkdownController = (function () {
    function MarkdownController($scope, $parse, $attrs, $element, $injector) {
        this._pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;
        this._$parse = $parse;
        this._$scope = $scope;
        this._$injector = $injector;
        this._$element = $element;
        this._$attrs = $attrs;
        this._text = $scope['$ctrl']['text'];
        this._isList = $scope['$ctrl']['isList'];
        this._clamp = $scope['$ctrl']['clamp'];
        this._rebind = $scope['$ctrl']['rebind'];
    }
    MarkdownController.prototype.$postLink = function () {
        this.bindText(this._text);
        this._$scope.$on('pipWindowResized', function () {
            if (this.bindText)
                this.bindText(this._text(this._$scope));
        });
        this._$element.addClass('pip-markdown');
    };
    MarkdownController.prototype.$onChanges = function (changes) {
        var newText = changes['text'].currentValue;
        if (this._rebind) {
            if (this._text !== newText) {
                this._text = newText;
                this.bindText(this._text);
            }
        }
    };
    MarkdownController.prototype.describeAttachments = function (array) {
        var attachString = '', attachTypes = [];
        _.each(array, function (attach) {
            if (attach.type && attach.type !== 'text') {
                if (attachString.length === 0 && this._pipTranslate) {
                    attachString = this._pipTranslate.translate('MARKDOWN_ATTACHMENTS');
                }
                if (attachTypes.indexOf(attach.type) < 0) {
                    attachTypes.push(attach.type);
                    attachString += attachTypes.length > 1 ? ', ' : ' ';
                    if (this._pipTranslate)
                        attachString += this._pipTranslate.translate(attach.type);
                }
            }
        });
        return attachString;
    };
    MarkdownController.prototype.bindText = function (value) {
        var textString, isClamped, height, options, obj;
        if (_.isArray(value)) {
            obj = _.find(value, function (item) {
                return item.type === 'text' && item.text;
            });
            textString = obj ? obj.text : this.describeAttachments(value);
        }
        else {
            textString = value;
        }
        isClamped = this._$attrs.pipLineCount && _.isNumber(this._clamp);
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
            height = 1.5 * this._clamp;
        }
        this._$element.html('<div' + (isClamped ? this._isList ? 'class="pip-markdown-content ' +
            'pip-markdown-list" style="max-height: ' + height + 'em">' :
            ' class="pip-markdown-content" style="max-height: ' + height + 'em">' : this._isList ?
            ' class="pip-markdown-list">' : '>') + textString + '</div>');
        this._$element.find('a').attr('target', 'blank');
        if (!this._isList && isClamped) {
            this._$element.append('<div class="pip-gradient-block"></div>');
        }
    };
    return MarkdownController;
}());
(function () {
    'use strict';
    var MarkdownComponent = {
        controller: MarkdownController,
        bindings: {
            text: '<pipText',
            isList: '<?pipList',
            clamp: '<?pipLineCount',
            rebind: '<?pipRebind'
        }
    };
    angular.module('pipMarkdown', ['ngSanitize'])
        .run(Config)
        .component('pipMarkdown', MarkdownComponent);
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
    function RoutingController($scope, $element) {
        this._$element = $element;
        this.showProgress = $scope['vm']['showProgress'];
        this.logoUrl = $scope['vm']['logoUrl'];
    }
    RoutingController.prototype.$postLink = function () {
        this._image = this._$element.find('img');
        this.loadProgressImage();
    };
    RoutingController.prototype.loadProgressImage = function () {
        if (this.logoUrl) {
            this._image.attr('src', this.logoUrl);
        }
    };
    return RoutingController;
}());
(function () {
    var RoutingProgress = {
        replace: true,
        bindings: {
            showProgress: '&',
            logoUrl: '@'
        },
        templateUrl: 'progress/routing_progress.html',
        controller: RoutingController,
        controllerAs: 'vm'
    };
    angular
        .module('pipRoutingProgress', ['ngMaterial'])
        .component('pipRoutingProgress', RoutingProgress);
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29sb3JfcGlja2VyL2NvbG9yX3BpY2tlci50cyIsInNyYy9jb250cm9scy50cyIsInNyYy9kZXBlbmRlbmNpZXMvdHJhbnNsYXRlLnRzIiwic3JjL2ltYWdlX3NsaWRlci9pbWFnZV9zbGlkZXIudHMiLCJzcmMvaW1hZ2Vfc2xpZGVyL2ltYWdlX3NsaWRlcl9zZXJ2aWNlLnRzIiwic3JjL2ltYWdlX3NsaWRlci9zbGlkZXJfYnV0dG9uLnRzIiwic3JjL2ltYWdlX3NsaWRlci9zbGlkZXJfaW5kaWNhdG9yLnRzIiwic3JjL21hcmtkb3duL21hcmtkb3duLnRzIiwic3JjL3BvcG92ZXIvcG9wb3Zlci50cyIsInNyYy9wb3BvdmVyL3BvcG92ZXJfc2VydmljZS50cyIsInNyYy9wcm9ncmVzcy9yb3V0aW5nX3Byb2dyZXNzLnRzIiwic3JjL3RvYXN0L3RvYXN0cy50cyIsInRlbXAvcGlwLXdlYnVpLWNvbnRyb2xzLWh0bWwubWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ2FBLElBQU0sY0FBYyxHQUFHLENBQUMsUUFBUSxFQUFFLFlBQVksRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFFOUY7SUFZSSwrQkFDSSxNQUFpQixFQUNqQixRQUFRLEVBQ1IsTUFBTSxFQUNOLFFBQVE7UUFDUixJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztRQUMxQixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUV0QixJQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDO1lBQzdCLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLEdBQUcsY0FBYyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMzSCxJQUFJLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxhQUFhLENBQUMsSUFBSSxJQUFJLENBQUM7UUFDdkQsSUFBSSxDQUFDLFlBQVksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsY0FBYyxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuRSxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ2hFLElBQUksQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLEtBQUssQ0FBQztJQUMxRCxDQUFDO0lBRU0sMENBQVUsR0FBakIsVUFBa0IsT0FBWTtRQUMxQixJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxZQUFZLENBQUMsTUFBTSxLQUFLLENBQUM7WUFDbEcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFlBQVksR0FBRyxjQUFjLENBQUM7UUFDcEQsSUFBSSxDQUFDLFlBQVksR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDL0UsQ0FBQztJQUVNLHdDQUFRLEdBQWY7UUFDSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNsQixNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFFRCxNQUFNLENBQUMsS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFBQSxDQUFDO0lBRUssMkNBQVcsR0FBbEIsVUFBbUIsS0FBYTtRQUFoQyxpQkFhQztRQVpHLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDbEIsTUFBTSxDQUFDO1FBQ1gsQ0FBQztRQUNELElBQUksQ0FBQyxpQkFBaUIsR0FBRyxLQUFLLENBQUM7UUFDL0IsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxTQUFTLENBQUM7WUFDWCxLQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQzFCLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDbkIsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3ZCLENBQUM7SUFDTCxDQUFDO0lBQUEsQ0FBQztJQUVLLCtDQUFlLEdBQXRCLFVBQXVCLEtBQUs7UUFDeEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUFBLENBQUM7SUFFTiw0QkFBQztBQUFELENBOURBLEFBOERDLElBQUE7QUE5RFksc0RBQXFCO0FBZ0VsQyxJQUFNLGNBQWMsR0FBRztJQUNuQixRQUFRLEVBQUU7UUFDTixVQUFVLEVBQUUsY0FBYztRQUMxQixNQUFNLEVBQUUsWUFBWTtRQUNwQixZQUFZLEVBQUUsVUFBVTtRQUN4QixXQUFXLEVBQUUsWUFBWTtLQUM1QjtJQUNELFdBQVcsRUFBRSxnQ0FBZ0M7SUFDN0MsVUFBVSxFQUFFLHFCQUFxQjtJQUNqQyxZQUFZLEVBQUUsSUFBSTtDQUNyQixDQUFBO0FBRUQsT0FBTztLQUNGLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLHVCQUF1QixDQUFDLENBQUM7S0FDbkQsU0FBUyxDQUFDLGdCQUFnQixFQUFFLGNBQWMsQ0FBQyxDQUFDOztBQzNGakQsQ0FBQztJQUNHLFlBQVksQ0FBQztJQUViLE9BQU8sQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFO1FBQzFCLGFBQWE7UUFDYixnQkFBZ0I7UUFDaEIsb0JBQW9CO1FBQ3BCLFlBQVk7UUFDWixnQkFBZ0I7UUFDaEIsV0FBVztRQUNYLHVCQUF1QjtLQUMxQixDQUFDLENBQUM7QUFFUCxDQUFDLENBQUMsRUFBRSxDQUFDOztBQ2JMLENBQUM7SUFDRyxZQUFZLENBQUM7SUFFYixJQUFJLFVBQVUsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLHVCQUF1QixFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBRTdELFVBQVUsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLFVBQVUsU0FBUztRQUM5QyxJQUFJLFlBQVksR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQztjQUMxQyxTQUFTLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUUzQyxNQUFNLENBQUMsVUFBVSxHQUFHO1lBQ2hCLE1BQU0sQ0FBQyxZQUFZLEdBQUksWUFBWSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ3BFLENBQUMsQ0FBQTtJQUNMLENBQUMsQ0FBQyxDQUFDO0FBRVAsQ0FBQyxDQUFDLEVBQUUsQ0FBQzs7QUNkTDtJQW9CSSxrQ0FDSSxNQUFpQixFQUNqQixRQUFRLEVBQ1IsTUFBTSxFQUNOLE1BQXdCLEVBQ3hCLFFBQWlDLEVBQ2pDLFNBQW1DLEVBQ25DLGNBQWM7UUFQbEIsaUJBNENDO1FBekRPLFdBQU0sR0FBVyxDQUFDLENBQUM7UUFJbkIscUJBQWdCLEdBQUcsSUFBSSxDQUFDO1FBS3pCLGVBQVUsR0FBVyxDQUFDLENBQUM7UUFhMUIsSUFBSSxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDL0MsSUFBSSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztRQUNwQyxJQUFJLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDO1FBQzVDLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO1FBQzVCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDO1FBRXhDLFFBQVEsQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUN0QyxRQUFRLENBQUMsUUFBUSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUVqRCxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFFaEIsUUFBUSxDQUFDO1lBQ0wsS0FBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUM7WUFDckQsRUFBRSxDQUFDLENBQUMsS0FBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDMUIsQ0FBQyxDQUFDLEtBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDNUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBRXJCLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQztZQUN6QixjQUFjLENBQUMsT0FBTyxDQUFDLEtBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSSxDQUFDLE9BQU8sRUFBRSxLQUFJLENBQUMsTUFBTSxFQUFFLEtBQUksQ0FBQyxTQUFTLEVBQUUsS0FBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQy9GLEtBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSSxDQUFDLFNBQVMsQ0FBQztZQUM3QixLQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDcEIsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBRVIsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFBQyxjQUFjLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUE7UUFBQyxDQUFDO1FBRW5FLFFBQVEsQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFO1lBQ3BCLEtBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUNwQixjQUFjLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMzQyxDQUFDLENBQUMsQ0FBQztJQUVQLENBQUM7SUFFTSw0Q0FBUyxHQUFoQjtRQUNJLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUN2QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxLQUFLLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUMvRSxJQUFJLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQztRQUN6QixJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUVNLDRDQUFTLEdBQWhCO1FBQ0ksSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUNqRixJQUFJLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQztRQUN6QixJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUVPLGlEQUFjLEdBQXRCLFVBQXVCLFNBQWlCO1FBQ3BDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsS0FBSyxJQUFJLENBQUMsTUFBTSxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25FLE1BQU0sQ0FBQztRQUNYLENBQUM7UUFFRCxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQzVELElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUN0QixDQUFDO0lBRU8sMkNBQVEsR0FBaEI7UUFDSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQztZQUFDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUNuRSxDQUFDO0lBRU8sZ0RBQWEsR0FBckI7UUFBQSxpQkFNQztRQUxHLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUNqQyxLQUFJLENBQUMsU0FBUyxHQUFHLEtBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxLQUFLLEtBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxLQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztZQUMvRSxLQUFJLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQztZQUN6QixLQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDdEIsQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVPLCtDQUFZLEdBQXBCO1FBQ0ksSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFTyxrREFBZSxHQUF2QjtRQUNJLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNwQixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUNMLCtCQUFDO0FBQUQsQ0EvR0EsQUErR0MsSUFBQTtBQUVELENBQUM7SUFFRztRQUNJLE1BQU0sQ0FBQztZQUNILEtBQUssRUFBRTtnQkFDSCxXQUFXLEVBQUUsZ0JBQWdCO2dCQUM3QixJQUFJLEVBQUUsbUJBQW1CO2dCQUN6QixRQUFRLEVBQUUsdUJBQXVCO2FBQ3BDO1lBQ0QsZ0JBQWdCLEVBQUUsSUFBSTtZQUN0QixVQUFVLEVBQUUsd0JBQXdCO1lBQ3BDLFlBQVksRUFBRSxJQUFJO1NBQ3JCLENBQUM7SUFDTixDQUFDO0lBR0QsT0FBTztTQUNGLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLGlCQUFpQixFQUFFLG9CQUFvQixFQUFFLHdCQUF3QixDQUFDLENBQUM7U0FDN0YsU0FBUyxDQUFDLGdCQUFnQixFQUFFLGNBQWMsQ0FBQyxDQUFDO0FBQ3JELENBQUMsQ0FBQyxFQUFFLENBQUM7O0FDM0hMO0lBS0ksNEJBQVksUUFBaUM7UUFIckMsdUJBQWtCLEdBQVcsR0FBRyxDQUFDO1FBQ2pDLGFBQVEsR0FBRyxFQUFFLENBQUM7UUFHbEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7SUFDOUIsQ0FBQztJQUVNLDJDQUFjLEdBQXJCLFVBQXNCLFFBQWdCLEVBQUUsV0FBVztRQUMvQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxHQUFHLFdBQVcsQ0FBQztJQUMxQyxDQUFDO0lBRU0seUNBQVksR0FBbkIsVUFBb0IsUUFBZ0I7UUFDaEMsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFFTSwyQ0FBYyxHQUFyQixVQUFzQixRQUFnQjtRQUNsQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRU0seUNBQVksR0FBbkIsVUFBb0IsU0FBUyxFQUFFLFNBQVM7UUFDcEMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUUvQixJQUFJLENBQUMsU0FBUyxDQUFDO1lBQ1gsU0FBUyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzVFLFNBQVMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzNELENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNaLENBQUM7SUFFTSx5Q0FBWSxHQUFuQixVQUFvQixTQUFTLEVBQUUsU0FBUztRQUNwQyxJQUFJLENBQUMsU0FBUyxDQUFDO1lBQ1gsU0FBUyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDcEQsU0FBUyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2hGLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNaLENBQUM7SUFFTSxvQ0FBTyxHQUFkLFVBQWUsSUFBWSxFQUFFLE1BQWEsRUFBRSxRQUFnQixFQUFFLFNBQWlCLEVBQUUsU0FBaUI7UUFDOUYsSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUMvQixVQUFVLEdBQVcsU0FBUyxFQUM5QixTQUFTLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBRXRDLEVBQUUsQ0FBQyxDQUFDLElBQUksS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUVsRixFQUFFLENBQUMsQ0FBQyxTQUFTLElBQUksQ0FBQyxTQUFTLEtBQUssTUFBTSxJQUFJLFNBQVMsS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzlELEVBQUUsQ0FBQyxDQUFDLFNBQVMsS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDO29CQUN2QixJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztnQkFDNUMsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztnQkFDNUMsQ0FBQztZQUNMLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixFQUFFLENBQUMsQ0FBQyxTQUFTLElBQUksU0FBUyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUM7b0JBQ3BDLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO2dCQUM1QyxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNKLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO2dCQUM1QyxDQUFDO1lBQ0wsQ0FBQztRQUNMLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLFNBQVMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3ZELFNBQVMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3hELENBQUM7SUFDTCxDQUFDO0lBRUwseUJBQUM7QUFBRCxDQWhFQSxBQWdFQyxJQUFBO0FBR0QsQ0FBQztJQUNHLFlBQVksQ0FBQztJQUNiLE9BQU87U0FDRixNQUFNLENBQUMsd0JBQXdCLEVBQUUsRUFBRSxDQUFDO1NBQ3BDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO0FBQ3ZELENBQUMsQ0FBQyxFQUFFLENBQUM7O0FDakZMLENBQUM7SUFDRyxZQUFZLENBQUM7SUFFYixJQUFJLFVBQVUsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLGlCQUFpQixFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBRXZELFVBQVUsQ0FBQyxTQUFTLENBQUMsaUJBQWlCLEVBQ2xDO1FBQ0ksTUFBTSxDQUFDO1lBQ0gsS0FBSyxFQUFFLEVBQUU7WUFDVCxVQUFVLEVBQUUsVUFBVSxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsY0FBYztnQkFDbEUsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFDM0MsUUFBUSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBRWxELFFBQVEsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFO29CQUNqQixFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7d0JBQ3JCLE1BQU0sQ0FBQztvQkFDWCxDQUFDO29CQUVELGNBQWMsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDO2dCQUNqRSxDQUFDLENBQUMsQ0FBQztZQUNQLENBQUM7U0FDSixDQUFDO0lBQ04sQ0FBQyxDQUNKLENBQUM7QUFFTixDQUFDLENBQUMsRUFBRSxDQUFDOztBQ3pCTCxDQUFDO0lBQ0csWUFBWSxDQUFDO0lBRWIsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUUxRCxVQUFVLENBQUMsU0FBUyxDQUFDLG9CQUFvQixFQUNyQztRQUNJLE1BQU0sQ0FBQztZQUNILEtBQUssRUFBRSxLQUFLO1lBQ1osVUFBVSxFQUFFLFVBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLGNBQWM7Z0JBQ3pELElBQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQzdDLE9BQU8sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUVoRCxRQUFRLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztnQkFDbEMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUc7b0JBQ2xCLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxJQUFJLE9BQU8sSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDdEMsTUFBTSxDQUFDO29CQUNYLENBQUM7b0JBQ0QsY0FBYyxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUN2RSxDQUFDLENBQUMsQ0FBQztZQUNQLENBQUM7U0FDSixDQUFDO0lBQ04sQ0FBQyxDQUNKLENBQUM7QUFFTixDQUFDLENBQUMsRUFBRSxDQUFDOztBQ3ZCTCxnQkFBZ0IsU0FBUztJQUNyQixJQUFNLFlBQVksR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLEdBQUcsSUFBSSxDQUFDO0lBRTFGLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7UUFDZixZQUFZLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRTtZQUMvQixzQkFBc0IsRUFBRSxjQUFjO1lBQ3RDLFdBQVcsRUFBRSxXQUFXO1lBQ3hCLFdBQVcsRUFBRSxXQUFXO1lBQ3hCLFVBQVUsRUFBRSxVQUFVO1lBQ3RCLFVBQVUsRUFBRSxVQUFVO1lBQ3RCLE1BQU0sRUFBRSxNQUFNO1NBQ2pCLENBQUMsQ0FBQztRQUNILFlBQVksQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFO1lBQy9CLHNCQUFzQixFQUFFLFdBQVc7WUFDbkMsV0FBVyxFQUFFLFFBQVE7WUFDckIsV0FBVyxFQUFFLFdBQVc7WUFDeEIsVUFBVSxFQUFFLGFBQWE7WUFDekIsVUFBVSxFQUFFLGlCQUFpQjtZQUM3QixNQUFNLEVBQUUsT0FBTztTQUNsQixDQUFDLENBQUM7SUFDUCxDQUFDO0FBQ0wsQ0FBQztBQUVEO0lBWUksNEJBQ0ksTUFBc0IsRUFDdEIsTUFBNkIsRUFDN0IsTUFBTSxFQUNOLFFBQVEsRUFDUixTQUFTO1FBRVQsSUFBSSxDQUFDLGFBQWEsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQzFGLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO1FBQzVCLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO1FBQzFCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3pDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFTSxzQ0FBUyxHQUFoQjtRQUVJLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRTFCLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFO1lBQ2pDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7Z0JBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQy9ELENBQUMsQ0FBQyxDQUFDO1FBR0gsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUM7SUFFNUMsQ0FBQztJQUVNLHVDQUFVLEdBQWpCLFVBQWtCLE9BQVk7UUFDMUIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFlBQVksQ0FBQztRQUU3QyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNmLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDekIsSUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUM7Z0JBQ3JCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzlCLENBQUM7UUFDTCxDQUFDO0lBQ0wsQ0FBQztJQUVPLGdEQUFtQixHQUEzQixVQUE0QixLQUFLO1FBQzdCLElBQUksWUFBWSxHQUFHLEVBQUUsRUFDakIsV0FBVyxHQUFHLEVBQUUsQ0FBQztRQUVyQixDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxVQUFVLE1BQU07WUFDMUIsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxNQUFNLENBQUMsSUFBSSxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ3hDLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO29CQUNsRCxZQUFZLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsc0JBQXNCLENBQUMsQ0FBQztnQkFDeEUsQ0FBQztnQkFFRCxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN2QyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDOUIsWUFBWSxJQUFJLFdBQVcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLElBQUksR0FBRyxHQUFHLENBQUM7b0JBQ3BELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUM7d0JBQ25CLFlBQVksSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2xFLENBQUM7WUFDTCxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsWUFBWSxDQUFDO0lBQ3hCLENBQUM7SUFFTyxxQ0FBUSxHQUFoQixVQUFpQixLQUFLO1FBQ2xCLElBQUksVUFBVSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLEdBQUcsQ0FBQztRQUVoRCxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuQixHQUFHLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsVUFBVSxJQUFTO2dCQUNuQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxNQUFNLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQztZQUM3QyxDQUFDLENBQUMsQ0FBQztZQUVILFVBQVUsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbEUsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osVUFBVSxHQUFHLEtBQUssQ0FBQztRQUN2QixDQUFDO1FBRUQsU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2pFLFNBQVMsR0FBRyxTQUFTLElBQUksVUFBVSxJQUFJLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQzdELE9BQU8sR0FBRztZQUNOLEdBQUcsRUFBRSxJQUFJO1lBQ1QsTUFBTSxFQUFFLElBQUk7WUFDWixNQUFNLEVBQUUsSUFBSTtZQUNaLFFBQVEsRUFBRSxJQUFJO1lBQ2QsUUFBUSxFQUFFLElBQUk7WUFDZCxVQUFVLEVBQUUsSUFBSTtZQUNoQixXQUFXLEVBQUUsS0FBSztTQUNyQixDQUFDO1FBQ0YsVUFBVSxHQUFHLE1BQU0sQ0FBQyxVQUFVLElBQUksRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQy9DLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDWixNQUFNLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDL0IsQ0FBQztRQUVELElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxHQUFHLDhCQUE4QjtZQUNuRix3Q0FBd0MsR0FBRyxNQUFNLEdBQUcsTUFBTTtZQUMxRCxtREFBbUQsR0FBRyxNQUFNLEdBQUcsTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPO1lBQ3BGLDZCQUE2QixHQUFHLEdBQUcsQ0FBQyxHQUFHLFVBQVUsR0FBRyxRQUFRLENBQUMsQ0FBQztRQUNsRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ2pELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQzdCLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLHdDQUF3QyxDQUFDLENBQUM7UUFDcEUsQ0FBQztJQUNMLENBQUM7SUFDTCx5QkFBQztBQUFELENBbkhBLEFBbUhDLElBQUE7QUFFRCxDQUFDO0lBQ0csWUFBWSxDQUFDO0lBRWIsSUFBTSxpQkFBaUIsR0FBRztRQUN0QixVQUFVLEVBQUUsa0JBQWtCO1FBQzlCLFFBQVEsRUFBRTtZQUNOLElBQUksRUFBRSxVQUFVO1lBQ2hCLE1BQU0sRUFBRSxXQUFXO1lBQ25CLEtBQUssRUFBRSxnQkFBZ0I7WUFDdkIsTUFBTSxFQUFFLGFBQWE7U0FDeEI7S0FDSixDQUFBO0lBRUQsT0FBTyxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUN4QyxHQUFHLENBQUMsTUFBTSxDQUFDO1NBQ1gsU0FBUyxDQUFDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO0FBQ3JELENBQUMsQ0FBQyxFQUFFLENBQUM7OztBQzdKTDtJQWdCSSwyQkFDSSxNQUFpQixFQUNqQixVQUFVLEVBQ1YsUUFBUSxFQUNSLFFBQVEsRUFDUixRQUFRO1FBTFosaUJBaUNDO1FBekJNLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO1FBQzFCLElBQUksQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFdBQVcsQ0FBQztRQUNoRCxJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUM7UUFDMUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDO1FBQ3hDLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUN4QyxJQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxVQUFVLENBQUM7UUFDekMsSUFBSSxDQUFDLGNBQWMsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsY0FBYyxDQUFDO1FBQ3RELElBQUksQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLENBQUM7UUFDbEQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUMsc0JBQXNCLEVBQUMsY0FBTyxLQUFJLENBQUMsYUFBYSxFQUFFLENBQUEsQ0FBQSxDQUFDLENBQUMsQ0FBQztRQUM3RSxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsVUFBVSxLQUFLLEtBQUssR0FBRyxnQkFBZ0IsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUU3RixRQUFRLENBQUM7WUFDSixLQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDaEIsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQzVCLEtBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDM0QsUUFBUSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3ZELENBQUM7WUFFRCxLQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDakIsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsY0FBUSxLQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDNUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxjQUFRLEtBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQSxDQUFBLENBQUMsQ0FBQyxDQUFDO1FBQzdELENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsY0FBUSxLQUFJLENBQUMsUUFBUSxFQUFFLENBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVuRCxDQUFDO0lBRU0seUNBQWEsR0FBcEI7UUFDSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztZQUN0QixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDMUIsQ0FBQztRQUNELElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUN4QixDQUFDO0lBRU0sd0NBQVksR0FBbkI7UUFBQSxpQkFLQztRQUpHLElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQyxTQUFTLENBQUM7WUFDWCxLQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2xDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNaLENBQUM7SUFFTSwwQ0FBYyxHQUFyQixVQUFzQixFQUFFO1FBQ3BCLEVBQUUsQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBR08sZ0NBQUksR0FBWjtRQUNJLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3hDLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ25DLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ2YsSUFBSSxDQUFDLFNBQVMsQ0FBQztnQkFDWCxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDeEIsQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNyQixDQUFDO0lBQ0wsQ0FBQztJQUVPLG9DQUFRLEdBQWhCO1FBQ0ksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDZixJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUN6QixHQUFHLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUN0QixLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUN2QixNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUN6QixRQUFRLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUM5QixTQUFTLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUNoQyxPQUFPLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7WUFFeEQsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDTixPQUFPO3FCQUNGLEdBQUcsQ0FBQyxXQUFXLEVBQUUsUUFBUSxHQUFHLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDbEQsR0FBRyxDQUFDLFlBQVksRUFBRSxTQUFTLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7cUJBQ3pELEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQztxQkFDbkQsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsR0FBRyxHQUFHLE1BQU0sR0FBRyxFQUFFLENBQUMsQ0FBQztZQUMzQyxDQUFDO1FBQ0wsQ0FBQztJQUNMLENBQUM7SUFFTyxvQ0FBUSxHQUFoQjtRQUNJLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3pGLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNoQixJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUVPLHNDQUFVLEdBQWxCO1FBQ0ksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQUMsTUFBTSxDQUFDO1FBQUMsQ0FBQztRQUNyQyxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsRUFDdkQsS0FBSyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQ2xDLE1BQU0sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUNwQyxPQUFPLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsRUFDdEMsYUFBYSxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdEYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxZQUFZLENBQUMsQ0FBQztJQUNqRyxDQUFDO0lBQ0wsd0JBQUM7QUFBRCxDQW5IQSxBQW1IQyxJQUFBO0FBbkhZLDhDQUFpQjtBQXFIOUIsQ0FBQztJQUNHLG9CQUFvQixNQUFXO1FBQzNCLFVBQVUsQ0FBQztRQUVULE1BQU0sQ0FBQztZQUNELFFBQVEsRUFBRSxJQUFJO1lBQ2QsS0FBSyxFQUFFLElBQUk7WUFDWCxXQUFXLEVBQUUsc0JBQXNCO1lBQ25DLFVBQVUsRUFBRSxpQkFBaUI7WUFDN0IsWUFBWSxFQUFFLElBQUk7U0FDckIsQ0FBQztJQUNWLENBQUM7SUFFRCxPQUFPO1NBQ0YsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDLG9CQUFvQixDQUFDLENBQUM7U0FDNUMsU0FBUyxDQUFDLFlBQVksRUFBRSxVQUFVLENBQUMsQ0FBQztBQUU3QyxDQUFDLENBQUMsRUFBRSxDQUFDOzs7QUN2SUw7SUFTSSx3QkFDSSxRQUFRLEVBQ1IsVUFBVSxFQUNWLFFBQVE7UUFFTCxJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztRQUMxQixJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztRQUM5QixJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztRQUMxQixJQUFJLENBQUMsZUFBZSxHQUFHLHdGQUF3RjtZQUMxRyx3RUFBd0UsQ0FBQztJQUNyRixDQUFDO0lBRU0sNkJBQUksR0FBWCxVQUFZLENBQUM7UUFDVCxJQUFJLE9BQU8sRUFBRSxLQUFnQixFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUM7UUFFL0MsT0FBTyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNwQixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQUMsTUFBTSxDQUFDO1FBQUMsQ0FBQztRQUN2RCxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDWixLQUFLLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNoQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNyQyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQ3pCLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2hDLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN0RCxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFTSw2QkFBSSxHQUFYO1FBQ0ksSUFBSSxlQUFlLEdBQUcsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLENBQUM7UUFDakQsZUFBZSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN0QyxJQUFJLENBQUMsU0FBUyxDQUFDO1lBQ1gsZUFBZSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQzdCLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNaLENBQUM7SUFFTSwrQkFBTSxHQUFiO1FBQ0ksSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBQ0wscUJBQUM7QUFBRCxDQTlDQSxBQThDQyxJQUFBO0FBOUNZLHdDQUFjO0FBaUQzQixDQUFDO0lBQ0csT0FBTztTQUNGLE1BQU0sQ0FBQyxvQkFBb0IsRUFBRSxFQUFFLENBQUM7U0FDaEMsT0FBTyxDQUFDLG1CQUFtQixFQUFFLGNBQWMsQ0FBQyxDQUFDO0FBQ3RELENBQUMsQ0FBQyxFQUFFLENBQUM7O0FDckRMO0lBT0ksMkJBQ0ksTUFBaUIsRUFDakIsUUFBUTtRQUdSLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO1FBQzFCLElBQUksQ0FBQyxZQUFZLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ2pELElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFTSxxQ0FBUyxHQUFoQjtRQUNJLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDekMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7SUFDN0IsQ0FBQztJQUVNLDZDQUFpQixHQUF4QjtRQUNJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ2YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMxQyxDQUFDO0lBQ0wsQ0FBQztJQUNMLHdCQUFDO0FBQUQsQ0EzQkEsQUEyQkMsSUFBQTtBQUdELENBQUM7SUFFRyxJQUFNLGVBQWUsR0FBRztRQUNoQixPQUFPLEVBQUUsSUFBSTtRQUNiLFFBQVEsRUFBRTtZQUNOLFlBQVksRUFBRSxHQUFHO1lBQ2pCLE9BQU8sRUFBRSxHQUFHO1NBQ2Y7UUFDRCxXQUFXLEVBQUUsZ0NBQWdDO1FBQzdDLFVBQVUsRUFBRSxpQkFBaUI7UUFDN0IsWUFBWSxFQUFFLElBQUk7S0FDekIsQ0FBQTtJQUdELE9BQU87U0FDRixNQUFNLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUM1QyxTQUFTLENBQUMsb0JBQW9CLEVBQUUsZUFBZSxDQUFDLENBQUM7QUFFMUQsQ0FBQyxDQUFDLEVBQUUsQ0FBQzs7QUNyQ0w7SUFVSSx5QkFDSSxRQUF3QyxFQUN4QyxLQUFnQixFQUNoQixTQUFTO1FBRUwsSUFBSSxDQUFDLHNCQUFzQixHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUM7Y0FDOUQsU0FBUyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUNwRCxJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztRQUMxQixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFDN0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO1FBQzdCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBRW5CLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0IsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7UUFDMUIsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQy9GLENBQUM7UUFFRCxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxzQkFBc0IsSUFBSSxJQUFJLENBQUM7SUFFL0QsQ0FBQztJQUVPLG1DQUFTLEdBQWhCO1FBQ0csSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN0QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDO1lBQzlCLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQ2hDO2dCQUNJLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUs7Z0JBQ3ZCLEVBQUUsRUFBRSxJQUFJO2FBQ1gsRUFDRCxPQUFPLENBQUMsSUFBSSxFQUNaLE9BQU8sQ0FBQyxJQUFJLENBQ1gsQ0FBQztRQUNOLENBQUM7SUFDTCxDQUFDO0lBRU0sa0NBQVEsR0FBZixVQUFnQixNQUFNO1FBQ2xCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUNuQjtZQUNJLE1BQU0sRUFBRSxNQUFNO1lBQ2QsRUFBRSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNqQixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87U0FDeEIsQ0FBQyxDQUFDO0lBRVAsQ0FBQztJQUNMLHNCQUFDO0FBQUQsQ0F2REEsQUF1REMsSUFBQTtBQWlCRDtJQVNJLHNCQUNJLFVBQWdDLEVBQ2hDLFFBQXdDO1FBRjVDLGlCQVNDO1FBakJPLGlCQUFZLEdBQVcsS0FBSyxDQUFDO1FBQzdCLCtCQUEwQixHQUFXLEtBQUssQ0FBQztRQUMzQyxXQUFNLEdBQWdCLEVBQUUsQ0FBQztRQUV6QixXQUFNLEdBQVEsRUFBRSxDQUFDO1FBUXJCLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO1FBRTFCLFVBQVUsQ0FBQyxHQUFHLENBQUMscUJBQXFCLEVBQUUsY0FBTyxLQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQSxDQUFBLENBQUMsQ0FBQyxDQUFDO1FBQzNFLFVBQVUsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsY0FBTyxLQUFJLENBQUMsYUFBYSxFQUFFLENBQUEsQ0FBQSxDQUFDLENBQUMsQ0FBQztRQUNqRSxVQUFVLENBQUMsR0FBRyxDQUFDLG9CQUFvQixFQUFFLGNBQU8sS0FBSSxDQUFDLGFBQWEsRUFBRSxDQUFBLENBQUEsQ0FBQyxDQUFDLENBQUM7SUFDdkUsQ0FBQztJQUVNLG9DQUFhLEdBQXBCO1FBQ0ksSUFBSSxLQUFnQixDQUFDO1FBRXJCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekIsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDMUIsQ0FBQztJQUNMLENBQUM7SUFHTyxnQ0FBUyxHQUFoQixVQUFpQixLQUFnQjtRQUFqQyxpQkFzQkE7UUFyQkcsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7UUFFMUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7WUFDaEIsV0FBVyxFQUFFLGtCQUFrQjtZQUMvQixTQUFTLEVBQUUsS0FBSyxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsWUFBWTtZQUM5QyxRQUFRLEVBQUUsYUFBYTtZQUN2QixVQUFVLEVBQUUsZUFBZTtZQUMzQixZQUFZLEVBQUUsSUFBSTtZQUNsQixNQUFNLEVBQUU7Z0JBQ0osS0FBSyxFQUFFLElBQUksQ0FBQyxZQUFZO2dCQUN4QixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07YUFDdEI7U0FDSixDQUFDO2FBQ0QsSUFBSSxDQUNELFVBQUMsTUFBYztZQUNYLEtBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNuQyxDQUFDLEVBQ0QsVUFBQyxNQUFjO1lBQ1gsS0FBSSxDQUFDLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZDLENBQUMsQ0FDSixDQUFDO0lBQ04sQ0FBQztJQUVPLDRDQUFxQixHQUE3QixVQUE4QixNQUFjO1FBQ3hDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztZQUNuQyxJQUFJLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM3QyxDQUFDO1FBQ0QsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7UUFDekIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFFTyx3Q0FBaUIsR0FBekIsVUFBMEIsTUFBYztRQUNwQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7WUFDcEMsSUFBSSxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDOUMsQ0FBQztRQUNELElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBRU0sK0JBQVEsR0FBZixVQUFnQixLQUFLO1FBQ2pCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQzlDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzVCLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDMUIsQ0FBQztJQUNMLENBQUM7SUFFTSxtQ0FBWSxHQUFuQixVQUFvQixJQUFZO1FBQzVCLElBQUksTUFBTSxHQUFVLEVBQUUsQ0FBQztRQUN2QixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsVUFBQyxLQUFLO1lBQ3RCLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3JDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDdkIsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFTSx1Q0FBZ0IsR0FBdkIsVUFBd0IsRUFBVTtRQUM5QixDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBQyxFQUFFLEVBQUUsRUFBRSxFQUFDLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBRU0sbUNBQVksR0FBbkIsVUFBb0IsRUFBVTtRQUMxQixNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUMsRUFBRSxFQUFFLEVBQUUsRUFBQyxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUVNLDJDQUFvQixHQUEzQixjQUErQixDQUFDO0lBRXpCLG9DQUFhLEdBQXBCO1FBQ0ksSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMzQixDQUFDO0lBRU0sdUNBQWdCLEdBQXZCLFVBQXdCLE9BQWUsRUFBRSxPQUFpQixFQUFFLGVBQWUsRUFBRSxjQUFjLEVBQUUsRUFBVTtRQUNuRyxJQUFJLENBQUMsUUFBUSxDQUFDO1lBQ1YsRUFBRSxFQUFFLEVBQUUsSUFBSSxJQUFJO1lBQ2QsSUFBSSxFQUFFLGNBQWM7WUFDcEIsT0FBTyxFQUFFLE9BQU87WUFDaEIsT0FBTyxFQUFFLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQztZQUMxQixlQUFlLEVBQUUsZUFBZTtZQUNoQyxjQUFjLEVBQUUsY0FBYztZQUM5QixRQUFRLEVBQUUsSUFBSSxDQUFDLDBCQUEwQjtTQUM1QyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRU0sa0NBQVcsR0FBbEIsVUFBbUIsT0FBZSxFQUFFLGVBQWUsRUFBRSxjQUFjLEVBQUUsRUFBVztRQUM1RSxJQUFJLENBQUMsUUFBUSxDQUFDO1lBQ1YsRUFBRSxFQUFFLEVBQUUsSUFBSSxJQUFJO1lBQ2QsSUFBSSxFQUFFLFNBQVM7WUFDZixPQUFPLEVBQUUsT0FBTztZQUNoQixPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUM7WUFDZixlQUFlLEVBQUUsZUFBZTtZQUNoQyxjQUFjLEVBQUUsY0FBYztTQUNqQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRU8sZ0NBQVMsR0FBaEIsVUFBaUIsT0FBZSxFQUFFLGVBQWUsRUFBRSxjQUFjLEVBQUUsRUFBVSxFQUFFLEtBQVU7UUFDdEYsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUNWLEVBQUUsRUFBRSxFQUFFLElBQUksSUFBSTtZQUNkLEtBQUssRUFBRSxLQUFLO1lBQ1osSUFBSSxFQUFFLE9BQU87WUFDYixPQUFPLEVBQUUsT0FBTyxJQUFJLGdCQUFnQjtZQUNwQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUM7WUFDZixlQUFlLEVBQUUsZUFBZTtZQUNoQyxjQUFjLEVBQUUsY0FBYztTQUNqQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRU0sb0NBQWEsR0FBcEI7UUFDSSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFFTSxrQ0FBVyxHQUFsQixVQUFtQixJQUFhO1FBQzVCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFFUCxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVCLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDeEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDckIsQ0FBQztJQUNMLENBQUM7SUFFTCxtQkFBQztBQUFELENBekpBLEFBeUpDLElBQUE7QUFHRCxDQUFDO0lBQ0csT0FBTztTQUNGLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxZQUFZLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztTQUM1RCxPQUFPLENBQUMsV0FBVyxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQzVDLENBQUMsQ0FBQyxFQUFFLENBQUM7O0FDclBMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZXhwb3J0IGludGVyZmFjZSBJQ29sb3JQaWNrZXIge1xyXG4gICAgY2xhc3M6IHN0cmluZztcclxuICAgIGNvbG9yczogc3RyaW5nW107XHJcbiAgICBjdXJyZW50Q29sb3I6IHN0cmluZztcclxuICAgIGN1cnJlbnRDb2xvckluZGV4OiBudW1iZXI7XHJcbiAgICBuZ0Rpc2FibGVkOiBGdW5jdGlvbjtcclxuICAgIGNvbG9yQ2hhbmdlOiBGdW5jdGlvbjtcclxuXHJcbiAgICBlbnRlclNwYWNlUHJlc3MoZXZlbnQpOiB2b2lkO1xyXG4gICAgZGlzYWJsZWQoKTogYm9vbGVhbjtcclxuICAgIHNlbGVjdENvbG9yKGluZGV4OiBudW1iZXIpO1xyXG59XHJcblxyXG5jb25zdCBERUZBVUxUX0NPTE9SUyA9IFsncHVycGxlJywgJ2xpZ2h0Z3JlZW4nLCAnZ3JlZW4nLCAnZGFya3JlZCcsICdwaW5rJywgJ3llbGxvdycsICdjeWFuJ107XHJcblxyXG5leHBvcnQgY2xhc3MgQ29sb3JQaWNrZXJDb250cm9sbGVyIGltcGxlbWVudHMgSUNvbG9yUGlja2VyIHtcclxuXHJcbiAgICBwcml2YXRlIF8kdGltZW91dDtcclxuICAgIHByaXZhdGUgXyRzY29wZTogbmcuSVNjb3BlO1xyXG5cclxuICAgIHB1YmxpYyBjbGFzczogc3RyaW5nO1xyXG4gICAgcHVibGljIGNvbG9yczogc3RyaW5nW107XHJcbiAgICBwdWJsaWMgY3VycmVudENvbG9yOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgY3VycmVudENvbG9ySW5kZXg6IG51bWJlcjtcclxuICAgIHB1YmxpYyBuZ0Rpc2FibGVkOiBGdW5jdGlvbjtcclxuICAgIHB1YmxpYyBjb2xvckNoYW5nZTogRnVuY3Rpb247XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgJHNjb3BlOiBuZy5JU2NvcGUsXHJcbiAgICAgICAgJGVsZW1lbnQsXHJcbiAgICAgICAgJGF0dHJzLFxyXG4gICAgICAgICR0aW1lb3V0KSB7XHJcbiAgICAgICAgdGhpcy5fJHRpbWVvdXQgPSAkdGltZW91dDtcclxuICAgICAgICB0aGlzLl8kc2NvcGUgPSAkc2NvcGU7XHJcblxyXG4gICAgICAgIHRoaXMuY2xhc3MgPSAkYXR0cnMuY2xhc3MgfHwgJyc7XHJcbiAgICAgICAgdGhpcy5jb2xvcnMgPSAhJHNjb3BlWyd2bSddWydjb2xvcnMnXSB8fCBcclxuICAgICAgICAgICAgICAgIF8uaXNBcnJheSgkc2NvcGVbJ3ZtJ11bJ2NvbG9ycyddKSAmJiAkc2NvcGVbJ3ZtJ11bJ2NvbG9ycyddLmxlbmd0aCA9PT0gMCA/IERFRkFVTFRfQ09MT1JTIDogJHNjb3BlWyd2bSddWydjb2xvcnMnXTtcclxuICAgICAgICB0aGlzLmNvbG9yQ2hhbmdlID0gJHNjb3BlWyd2bSddWydjb2xvckNoYW5nZSddIHx8IG51bGw7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50Q29sb3IgPSAkc2NvcGVbJ3ZtJ11bJ2N1cnJlbnRDb2xvciddIHx8IHRoaXMuY29sb3JzWzBdO1xyXG4gICAgICAgIHRoaXMuY3VycmVudENvbG9ySW5kZXggPSB0aGlzLmNvbG9ycy5pbmRleE9mKHRoaXMuY3VycmVudENvbG9yKTtcclxuICAgICAgICB0aGlzLm5nRGlzYWJsZWQgPSAkc2NvcGVbJ3ZtJ11bJ25nRGlzYWJsZWQnXSB8fCBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgJG9uQ2hhbmdlcyhjaGFuZ2VzOiBhbnkpIHtcclxuICAgICAgICB0aGlzLmNvbG9ycyA9IF8uaXNBcnJheShjaGFuZ2VzWydjb2xvcnMnXS5jdXJyZW50VmFsdWUpICYmIGNoYW5nZXNbJ2NvbG9ycyddLmN1cnJlbnRWYWx1ZS5sZW5ndGggIT09IDAgPyBcclxuICAgICAgICAgICAgY2hhbmdlc1snY29sb3JzJ10uY3VycmVudFZhbHVlIDogREVGQVVMVF9DT0xPUlM7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50Q29sb3IgPSBjaGFuZ2VzWydjdXJyZW50Q29sb3InXS5jdXJyZW50VmFsdWUgfHwgdGhpcy5jb2xvcnNbMF07XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRpc2FibGVkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLm5nRGlzYWJsZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9O1xyXG5cclxuICAgIHB1YmxpYyBzZWxlY3RDb2xvcihpbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQoKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY3VycmVudENvbG9ySW5kZXggPSBpbmRleDtcclxuICAgICAgICB0aGlzLmN1cnJlbnRDb2xvciA9IHRoaXMuY29sb3JzW3RoaXMuY3VycmVudENvbG9ySW5kZXhdO1xyXG4gICAgICAgIHRoaXMuXyR0aW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fJHNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jb2xvckNoYW5nZSkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbG9yQ2hhbmdlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwdWJsaWMgZW50ZXJTcGFjZVByZXNzKGV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RDb2xvcihldmVudC5pbmRleCk7XHJcbiAgICB9O1xyXG5cclxufVxyXG5cclxuY29uc3QgcGlwQ29sb3JQaWNrZXIgPSB7XHJcbiAgICBiaW5kaW5nczoge1xyXG4gICAgICAgIG5nRGlzYWJsZWQ6ICc8P25nRGlzYWJsZWQnLFxyXG4gICAgICAgIGNvbG9yczogJzxwaXBDb2xvcnMnLFxyXG4gICAgICAgIGN1cnJlbnRDb2xvcjogJz1uZ01vZGVsJyxcclxuICAgICAgICBjb2xvckNoYW5nZTogJzw/bmdDaGFuZ2UnXHJcbiAgICB9LFxyXG4gICAgdGVtcGxhdGVVcmw6ICdjb2xvcl9waWNrZXIvY29sb3JfcGlja2VyLmh0bWwnLFxyXG4gICAgY29udHJvbGxlcjogQ29sb3JQaWNrZXJDb250cm9sbGVyLFxyXG4gICAgY29udHJvbGxlckFzOiAndm0nXHJcbn1cclxuXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ3BpcENvbG9yUGlja2VyJywgWydwaXBDb250cm9scy5UZW1wbGF0ZXMnXSlcclxuICAgIC5jb21wb25lbnQoJ3BpcENvbG9yUGlja2VyJywgcGlwQ29sb3JQaWNrZXIpOyIsIu+7vy8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi90eXBpbmdzL3RzZC5kLnRzXCIgLz5cclxuXHJcbigoKSA9PiB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ3BpcENvbnRyb2xzJywgW1xyXG4gICAgICAgICdwaXBNYXJrZG93bicsXHJcbiAgICAgICAgJ3BpcENvbG9yUGlja2VyJyxcclxuICAgICAgICAncGlwUm91dGluZ1Byb2dyZXNzJyxcclxuICAgICAgICAncGlwUG9wb3ZlcicsXHJcbiAgICAgICAgJ3BpcEltYWdlU2xpZGVyJyxcclxuICAgICAgICAncGlwVG9hc3RzJyxcclxuICAgICAgICAncGlwQ29udHJvbHMuVHJhbnNsYXRlJ1xyXG4gICAgXSk7XHJcblxyXG59KSgpO1xyXG5cclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgdGhpc01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBDb250cm9scy5UcmFuc2xhdGUnLCBbXSk7XHJcblxyXG4gICAgdGhpc01vZHVsZS5maWx0ZXIoJ3RyYW5zbGF0ZScsIGZ1bmN0aW9uICgkaW5qZWN0b3IpIHtcclxuICAgICAgICB2YXIgcGlwVHJhbnNsYXRlID0gJGluamVjdG9yLmhhcygncGlwVHJhbnNsYXRlJykgXHJcbiAgICAgICAgICAgID8gJGluamVjdG9yLmdldCgncGlwVHJhbnNsYXRlJykgOiBudWxsO1xyXG5cclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgICAgICByZXR1cm4gcGlwVHJhbnNsYXRlICA/IHBpcFRyYW5zbGF0ZS50cmFuc2xhdGUoa2V5KSB8fCBrZXkgOiBrZXk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG59KSgpO1xyXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vdHlwaW5ncy90c2QuZC50c1wiIC8+XHJcblxyXG5jbGFzcyBwaXBJbWFnZVNsaWRlckNvbnRyb2xsZXJ7XHJcblxyXG4gICAgcHJpdmF0ZSBfJGF0dHJzO1xyXG4gICAgcHJpdmF0ZSBfJGludGVydmFsOiBhbmd1bGFyLklJbnRlcnZhbFNlcnZpY2U7XHJcbiAgICBwcml2YXRlIF8kc2NvcGU6IGFuZ3VsYXIuSVNjb3BlO1xyXG5cclxuICAgIHByaXZhdGUgX2Jsb2NrczogYW55W107XHJcbiAgICBwcml2YXRlIF9pbmRleDogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgX25ld0luZGV4OiBudW1iZXI7XHJcbiAgICBwcml2YXRlIF9kaXJlY3Rpb246IHN0cmluZztcclxuICAgIHByaXZhdGUgX3R5cGU6IGFueTtcclxuICAgIHByaXZhdGUgREVGQVVMVF9JTlRFUlZBTCA9IDQ1MDA7XHJcbiAgICBwcml2YXRlIF9pbnRlcnZhbDtcclxuICAgIHByaXZhdGUgX3RpbWVQcm9taXNlcztcclxuICAgIHByaXZhdGUgX3Rocm90dGxlZDogRnVuY3Rpb247XHJcblxyXG4gICAgcHVibGljIHN3aXBlU3RhcnQ6IG51bWJlciA9IDA7XHJcbiAgICBwdWJsaWMgc2xpZGVySW5kZXg6IG51bWJlcjtcclxuICAgIHB1YmxpYyBzbGlkZVRvOiBGdW5jdGlvbjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICAkc2NvcGU6IG5nLklTY29wZSwgXHJcbiAgICAgICAgJGVsZW1lbnQsIFxyXG4gICAgICAgICRhdHRycywgXHJcbiAgICAgICAgJHBhcnNlOiBuZy5JUGFyc2VTZXJ2aWNlLCBcclxuICAgICAgICAkdGltZW91dDogYW5ndWxhci5JVGltZW91dFNlcnZpY2UsXHJcbiAgICAgICAgJGludGVydmFsOiBhbmd1bGFyLklJbnRlcnZhbFNlcnZpY2UsIFxyXG4gICAgICAgIHBpcEltYWdlU2xpZGVyKSB7XHJcblxyXG4gICAgICAgIHRoaXMuc2xpZGVySW5kZXggPSAkc2NvcGVbJ3ZtJ11bJ3NsaWRlckluZGV4J107XHJcbiAgICAgICAgdGhpcy5fdHlwZSA9ICRzY29wZVsndm0nXVsndHlwZSddKCk7XHJcbiAgICAgICAgdGhpcy5faW50ZXJ2YWwgPSAkc2NvcGVbJ3ZtJ11bJ2ludGVydmFsJ10oKTtcclxuICAgICAgICB0aGlzLl8kYXR0cnMgPSAkYXR0cnM7XHJcbiAgICAgICAgdGhpcy5fJGludGVydmFsID0gJGludGVydmFsO1xyXG4gICAgICAgIHRoaXMuXyRzY29wZSA9ICRzY29wZTtcclxuICAgICAgICAkc2NvcGVbJ3NsaWRlVG8nXSA9IHRoaXMuc2xpZGVUb1ByaXZhdGU7XHJcblxyXG4gICAgICAgICRlbGVtZW50LmFkZENsYXNzKCdwaXAtaW1hZ2Utc2xpZGVyJyk7XHJcbiAgICAgICAgJGVsZW1lbnQuYWRkQ2xhc3MoJ3BpcC1hbmltYXRpb24tJyArIHRoaXMuX3R5cGUpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuc2V0SW5kZXgoKTtcclxuXHJcbiAgICAgICAgJHRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9ibG9ja3MgPSAkZWxlbWVudC5maW5kKCcucGlwLWFuaW1hdGlvbi1ibG9jaycpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fYmxvY2tzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICQodGhpcy5fYmxvY2tzWzBdKS5hZGRDbGFzcygncGlwLXNob3cnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXJ0SW50ZXJ2YWwoKTtcclxuXHJcbiAgICAgICAgdGhpcy5fdGhyb3R0bGVkID0gXy50aHJvdHRsZSgoKSA9PiB7XHJcbiAgICAgICAgICAgIHBpcEltYWdlU2xpZGVyLnRvQmxvY2sodGhpcy5fdHlwZSwgdGhpcy5fYmxvY2tzLCB0aGlzLl9pbmRleCwgdGhpcy5fbmV3SW5kZXgsIHRoaXMuX2RpcmVjdGlvbik7XHJcbiAgICAgICAgICAgIHRoaXMuX2luZGV4ID0gdGhpcy5fbmV3SW5kZXg7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0SW5kZXgoKTtcclxuICAgICAgICB9LCA3MDApO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICgkYXR0cnMuaWQpIHsgcGlwSW1hZ2VTbGlkZXIucmVnaXN0ZXJTbGlkZXIoJGF0dHJzLmlkLCAkc2NvcGUpIH1cclxuXHJcbiAgICAgICAgJGVsZW1lbnQub24oJyRkZXN0cm95JywgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnN0b3BJbnRlcnZhbCgpO1xyXG4gICAgICAgICAgICBwaXBJbWFnZVNsaWRlci5yZW1vdmVTbGlkZXIoJGF0dHJzLmlkKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG5leHRCbG9jaygpIHtcclxuICAgICAgICB0aGlzLnJlc3RhcnRJbnRlcnZhbCgpO1xyXG4gICAgICAgIHRoaXMuX25ld0luZGV4ID0gdGhpcy5faW5kZXggKyAxID09PSB0aGlzLl9ibG9ja3MubGVuZ3RoID8gMCA6IHRoaXMuX2luZGV4ICsgMTtcclxuICAgICAgICB0aGlzLl9kaXJlY3Rpb24gPSAnbmV4dCc7XHJcbiAgICAgICAgdGhpcy5fdGhyb3R0bGVkKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHByZXZCbG9jaygpIHtcclxuICAgICAgICB0aGlzLnJlc3RhcnRJbnRlcnZhbCgpO1xyXG4gICAgICAgIHRoaXMuX25ld0luZGV4ID0gdGhpcy5faW5kZXggLSAxIDwgMCA/IHRoaXMuX2Jsb2Nrcy5sZW5ndGggLSAxIDogdGhpcy5faW5kZXggLSAxO1xyXG4gICAgICAgIHRoaXMuX2RpcmVjdGlvbiA9ICdwcmV2JztcclxuICAgICAgICB0aGlzLl90aHJvdHRsZWQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNsaWRlVG9Qcml2YXRlKG5leHRJbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKG5leHRJbmRleCA9PT0gdGhpcy5faW5kZXggfHwgbmV4dEluZGV4ID4gdGhpcy5fYmxvY2tzLmxlbmd0aCAtIDEpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5yZXN0YXJ0SW50ZXJ2YWwoKTtcclxuICAgICAgICB0aGlzLl9uZXdJbmRleCA9IG5leHRJbmRleDtcclxuICAgICAgICB0aGlzLl9kaXJlY3Rpb24gPSBuZXh0SW5kZXggPiB0aGlzLl9pbmRleCA/ICduZXh0JyA6ICdwcmV2JztcclxuICAgICAgICB0aGlzLl90aHJvdHRsZWQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldEluZGV4KCkge1xyXG4gICAgICAgIGlmICh0aGlzLl8kYXR0cnMucGlwSW1hZ2VJbmRleCkgdGhpcy5zbGlkZXJJbmRleCA9IHRoaXMuX2luZGV4O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhcnRJbnRlcnZhbCgpIHtcclxuICAgICAgICB0aGlzLl90aW1lUHJvbWlzZXMgPSB0aGlzLl8kaW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9uZXdJbmRleCA9IHRoaXMuX2luZGV4ICsgMSA9PT0gdGhpcy5fYmxvY2tzLmxlbmd0aCA/IDAgOiB0aGlzLl9pbmRleCArIDE7XHJcbiAgICAgICAgICAgIHRoaXMuX2RpcmVjdGlvbiA9ICduZXh0JztcclxuICAgICAgICAgICAgdGhpcy5fdGhyb3R0bGVkKCk7XHJcbiAgICAgICAgfSwgdGhpcy5faW50ZXJ2YWwgfHwgdGhpcy5ERUZBVUxUX0lOVEVSVkFMKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0b3BJbnRlcnZhbCgpIHtcclxuICAgICAgICB0aGlzLl8kaW50ZXJ2YWwuY2FuY2VsKHRoaXMuX3RpbWVQcm9taXNlcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZXN0YXJ0SW50ZXJ2YWwoKSB7XHJcbiAgICAgICAgdGhpcy5zdG9wSW50ZXJ2YWwoKTtcclxuICAgICAgICB0aGlzLnN0YXJ0SW50ZXJ2YWwoKTtcclxuICAgIH1cclxufVxyXG5cclxuKCgpID0+IHtcclxuXHJcbiAgICBmdW5jdGlvbiBwaXBJbWFnZVNsaWRlcigpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBzY29wZToge1xyXG4gICAgICAgICAgICAgICAgc2xpZGVySW5kZXg6ICc9cGlwSW1hZ2VJbmRleCcsXHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnJnBpcEFuaW1hdGlvblR5cGUnLFxyXG4gICAgICAgICAgICAgICAgaW50ZXJ2YWw6ICcmcGlwQW5pbWF0aW9uSW50ZXJ2YWwnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IHBpcEltYWdlU2xpZGVyQ29udHJvbGxlcixcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3BpcEltYWdlU2xpZGVyJywgWydwaXBTbGlkZXJCdXR0b24nLCAncGlwU2xpZGVySW5kaWNhdG9yJywgJ3BpcEltYWdlU2xpZGVyLlNlcnZpY2UnXSlcclxuICAgICAgICAuZGlyZWN0aXZlKCdwaXBJbWFnZVNsaWRlcicsIHBpcEltYWdlU2xpZGVyKTtcclxufSkoKTtcclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxyXG5cclxuaW50ZXJmYWNlIElJbWFnZVNsaWRlclNlcnZpY2Uge1xyXG4gICAgcmVnaXN0ZXJTbGlkZXIoc2xpZGVySWQ6IHN0cmluZywgc2xpZGVyU2NvcGUpOiB2b2lkO1xyXG4gICAgcmVtb3ZlU2xpZGVyKHNsaWRlcklkOiBzdHJpbmcpOiB2b2lkO1xyXG4gICAgZ2V0U2xpZGVyU2NvcGUoc2xpZGVySWQ6IHN0cmluZyk7XHJcbiAgICBuZXh0Q2Fyb3VzZWwobmV4dEJsb2NrLCBwcmV2QmxvY2spOiB2b2lkO1xyXG4gICAgcHJldkNhcm91c2VsKG5leHRCbG9jaywgcHJldkJsb2NrKTogdm9pZDtcclxuICAgIHRvQmxvY2sodHlwZTogc3RyaW5nLCBibG9ja3M6IGFueVtdLCBvbGRJbmRleDogbnVtYmVyLCBuZXh0SW5kZXg6IG51bWJlciwgZGlyZWN0aW9uOiBzdHJpbmcpOiB2b2lkO1xyXG59XHJcblxyXG5jbGFzcyBJbWFnZVNsaWRlclNlcnZpY2Uge1xyXG4gICAgcHJpdmF0ZSBfJHRpbWVvdXQ6IGFuZ3VsYXIuSVRpbWVvdXRTZXJ2aWNlO1xyXG4gICAgcHJpdmF0ZSBBTklNQVRJT05fRFVSQVRJT046IG51bWJlciA9IDU1MDtcclxuICAgIHByaXZhdGUgX3NsaWRlcnMgPSB7fTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigkdGltZW91dDogYW5ndWxhci5JVGltZW91dFNlcnZpY2UpIHtcclxuICAgICAgICB0aGlzLl8kdGltZW91dCA9ICR0aW1lb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZWdpc3RlclNsaWRlcihzbGlkZXJJZDogc3RyaW5nLCBzbGlkZXJTY29wZSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX3NsaWRlcnNbc2xpZGVySWRdID0gc2xpZGVyU2NvcGU7XHJcbiAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgcHVibGljIHJlbW92ZVNsaWRlcihzbGlkZXJJZDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX3NsaWRlcnNbc2xpZGVySWRdO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRTbGlkZXJTY29wZShzbGlkZXJJZDogc3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NsaWRlcnNbc2xpZGVySWRdO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBuZXh0Q2Fyb3VzZWwobmV4dEJsb2NrLCBwcmV2QmxvY2spOiB2b2lkIHtcclxuICAgICAgICBuZXh0QmxvY2suYWRkQ2xhc3MoJ3BpcC1uZXh0Jyk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICB0aGlzLl8kdGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIG5leHRCbG9jay5hZGRDbGFzcygnYW5pbWF0ZWQnKS5hZGRDbGFzcygncGlwLXNob3cnKS5yZW1vdmVDbGFzcygncGlwLW5leHQnKTtcclxuICAgICAgICAgICAgcHJldkJsb2NrLmFkZENsYXNzKCdhbmltYXRlZCcpLnJlbW92ZUNsYXNzKCdwaXAtc2hvdycpO1xyXG4gICAgICAgIH0sIDEwMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHByZXZDYXJvdXNlbChuZXh0QmxvY2ssIHByZXZCbG9jayk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuXyR0aW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgbmV4dEJsb2NrLmFkZENsYXNzKCdhbmltYXRlZCcpLmFkZENsYXNzKCdwaXAtc2hvdycpO1xyXG4gICAgICAgICAgICBwcmV2QmxvY2suYWRkQ2xhc3MoJ2FuaW1hdGVkJykuYWRkQ2xhc3MoJ3BpcC1uZXh0JykucmVtb3ZlQ2xhc3MoJ3BpcC1zaG93Jyk7XHJcbiAgICAgICAgfSwgMTAwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdG9CbG9jayh0eXBlOiBzdHJpbmcsIGJsb2NrczogYW55W10sIG9sZEluZGV4OiBudW1iZXIsIG5leHRJbmRleDogbnVtYmVyLCBkaXJlY3Rpb246IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIGxldCBwcmV2QmxvY2sgPSAkKGJsb2Nrc1tvbGRJbmRleF0pLFxyXG4gICAgICAgICAgICBibG9ja0luZGV4OiBudW1iZXIgPSBuZXh0SW5kZXgsXHJcbiAgICAgICAgICAgIG5leHRCbG9jayA9ICQoYmxvY2tzW2Jsb2NrSW5kZXhdKTtcclxuXHJcbiAgICAgICAgaWYgKHR5cGUgPT09ICdjYXJvdXNlbCcpIHtcclxuICAgICAgICAgICAgJChibG9ja3MpLnJlbW92ZUNsYXNzKCdwaXAtbmV4dCcpLnJlbW92ZUNsYXNzKCdwaXAtcHJldicpLnJlbW92ZUNsYXNzKCdhbmltYXRlZCcpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGRpcmVjdGlvbiAmJiAoZGlyZWN0aW9uID09PSAncHJldicgfHwgZGlyZWN0aW9uID09PSAnbmV4dCcpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGlyZWN0aW9uID09PSAncHJldicpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByZXZDYXJvdXNlbChuZXh0QmxvY2ssIHByZXZCbG9jayk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dENhcm91c2VsKG5leHRCbG9jaywgcHJldkJsb2NrKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChuZXh0SW5kZXggJiYgbmV4dEluZGV4IDwgb2xkSW5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByZXZDYXJvdXNlbChuZXh0QmxvY2ssIHByZXZCbG9jayk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dENhcm91c2VsKG5leHRCbG9jaywgcHJldkJsb2NrKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHByZXZCbG9jay5hZGRDbGFzcygnYW5pbWF0ZWQnKS5yZW1vdmVDbGFzcygncGlwLXNob3cnKTtcclxuICAgICAgICAgICAgbmV4dEJsb2NrLmFkZENsYXNzKCdhbmltYXRlZCcpLmFkZENsYXNzKCdwaXAtc2hvdycpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn1cclxuXHJcblxyXG4oKCkgPT4ge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3BpcEltYWdlU2xpZGVyLlNlcnZpY2UnLCBbXSlcclxuICAgICAgICAuc2VydmljZSgncGlwSW1hZ2VTbGlkZXInLCBJbWFnZVNsaWRlclNlcnZpY2UpO1xyXG59KSgpO1xyXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vdHlwaW5ncy90c2QuZC50c1wiIC8+XHJcblxyXG4oKCkgPT4ge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciB0aGlzTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcFNsaWRlckJ1dHRvbicsIFtdKTtcclxuXHJcbiAgICB0aGlzTW9kdWxlLmRpcmVjdGl2ZSgncGlwU2xpZGVyQnV0dG9uJyxcclxuICAgICAgICBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBzY29wZToge30sXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbiAoJHNjb3BlLCAkZWxlbWVudCwgJHBhcnNlLCAkYXR0cnMsIHBpcEltYWdlU2xpZGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHR5cGUgPSAkcGFyc2UoJGF0dHJzLnBpcEJ1dHRvblR5cGUpKCRzY29wZSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlcklkID0gJHBhcnNlKCRhdHRycy5waXBTbGlkZXJJZCkoJHNjb3BlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJGVsZW1lbnQub24oJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXNsaWRlcklkIHx8ICF0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpcEltYWdlU2xpZGVyLmdldFNsaWRlclNjb3BlKHNsaWRlcklkKS52bVt0eXBlICsgJ0Jsb2NrJ10oKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICApO1xyXG5cclxufSkoKTtcclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgdGhpc01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBTbGlkZXJJbmRpY2F0b3InLCBbXSk7XHJcblxyXG4gICAgdGhpc01vZHVsZS5kaXJlY3RpdmUoJ3BpcFNsaWRlckluZGljYXRvcicsXHJcbiAgICAgICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgc2NvcGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogKCRzY29wZSwgJGVsZW1lbnQsICRwYXJzZSwgJGF0dHJzLCBwaXBJbWFnZVNsaWRlcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzbGlkZXJJZCA9ICRwYXJzZSgkYXR0cnMucGlwU2xpZGVySWQpKCRzY29wZSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlVG8gPSAkcGFyc2UoJGF0dHJzLnBpcFNsaWRlVG8pKCRzY29wZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRlbGVtZW50LmNzcygnY3Vyc29yJywgJ3BvaW50ZXInKTtcclxuICAgICAgICAgICAgICAgICAgICAkZWxlbWVudC5vbignY2xpY2snLCAgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXNsaWRlcklkIHx8IHNsaWRlVG8gJiYgc2xpZGVUbyA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwaXBJbWFnZVNsaWRlci5nZXRTbGlkZXJTY29wZShzbGlkZXJJZCkudm0uc2xpZGVUb1ByaXZhdGUoc2xpZGVUbyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgKTtcclxuXHJcbn0pKCk7XHJcbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi90eXBpbmdzL3RzZC5kLnRzXCIgLz5cclxuXHJcbmRlY2xhcmUgdmFyIG1hcmtlZDogYW55O1xyXG5cclxuZnVuY3Rpb24gQ29uZmlnKCRpbmplY3Rvcikge1xyXG4gICAgY29uc3QgcGlwVHJhbnNsYXRlID0gJGluamVjdG9yLmhhcygncGlwVHJhbnNsYXRlJykgPyAkaW5qZWN0b3IuZ2V0KCdwaXBUcmFuc2xhdGUnKSA6IG51bGw7XHJcblxyXG4gICAgaWYgKHBpcFRyYW5zbGF0ZSkge1xyXG4gICAgICAgIHBpcFRyYW5zbGF0ZS5zZXRUcmFuc2xhdGlvbnMoJ2VuJywge1xyXG4gICAgICAgICAgICAnTUFSS0RPV05fQVRUQUNITUVOVFMnOiAnQXR0YWNobWVudHM6JyxcclxuICAgICAgICAgICAgJ2NoZWNrbGlzdCc6ICdDaGVja2xpc3QnLFxyXG4gICAgICAgICAgICAnZG9jdW1lbnRzJzogJ0RvY3VtZW50cycsXHJcbiAgICAgICAgICAgICdwaWN0dXJlcyc6ICdQaWN0dXJlcycsXHJcbiAgICAgICAgICAgICdsb2NhdGlvbic6ICdMb2NhdGlvbicsXHJcbiAgICAgICAgICAgICd0aW1lJzogJ1RpbWUnXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcGlwVHJhbnNsYXRlLnNldFRyYW5zbGF0aW9ucygncnUnLCB7XHJcbiAgICAgICAgICAgICdNQVJLRE9XTl9BVFRBQ0hNRU5UUyc6ICfQktC70L7QttC10L3QuNGPOicsXHJcbiAgICAgICAgICAgICdjaGVja2xpc3QnOiAn0KHQv9C40YHQvtC6JyxcclxuICAgICAgICAgICAgJ2RvY3VtZW50cyc6ICfQlNC+0LrRg9C80LXQvdGC0YsnLFxyXG4gICAgICAgICAgICAncGljdHVyZXMnOiAn0JjQt9C+0LHRgNCw0LbQtdC90LjRjycsXHJcbiAgICAgICAgICAgICdsb2NhdGlvbic6ICfQnNC10YHRgtC+0L3QsNGF0L7QttC00LXQvdC40LUnLFxyXG4gICAgICAgICAgICAndGltZSc6ICfQktGA0LXQvNGPJ1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBNYXJrZG93bkNvbnRyb2xsZXIge1xyXG4gICAgcHJpdmF0ZSBfcGlwVHJhbnNsYXRlO1xyXG4gICAgcHJpdmF0ZSBfJHBhcnNlOiBhbmd1bGFyLklQYXJzZVNlcnZpY2U7XHJcbiAgICBwcml2YXRlIF8kc2NvcGU6IGFuZ3VsYXIuSVNjb3BlO1xyXG4gICAgcHJpdmF0ZSBfJGluamVjdG9yO1xyXG4gICAgcHJpdmF0ZSBfJGVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIF8kYXR0cnM7XHJcbiAgICBwcml2YXRlIF90ZXh0O1xyXG4gICAgcHJpdmF0ZSBfaXNMaXN0O1xyXG4gICAgcHJpdmF0ZSBfY2xhbXA7XHJcbiAgICBwcml2YXRlIF9yZWJpbmQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgJHNjb3BlOiBhbmd1bGFyLklTY29wZSxcclxuICAgICAgICAkcGFyc2U6IGFuZ3VsYXIuSVBhcnNlU2VydmljZSxcclxuICAgICAgICAkYXR0cnMsXHJcbiAgICAgICAgJGVsZW1lbnQsXHJcbiAgICAgICAgJGluamVjdG9yXHJcbiAgICApIHtcclxuICAgICAgICB0aGlzLl9waXBUcmFuc2xhdGUgPSAkaW5qZWN0b3IuaGFzKCdwaXBUcmFuc2xhdGUnKSA/ICRpbmplY3Rvci5nZXQoJ3BpcFRyYW5zbGF0ZScpIDogbnVsbDtcclxuICAgICAgICB0aGlzLl8kcGFyc2UgPSAkcGFyc2U7XHJcbiAgICAgICAgdGhpcy5fJHNjb3BlID0gJHNjb3BlO1xyXG4gICAgICAgIHRoaXMuXyRpbmplY3RvciA9ICRpbmplY3RvcjtcclxuICAgICAgICB0aGlzLl8kZWxlbWVudCA9ICRlbGVtZW50O1xyXG4gICAgICAgIHRoaXMuXyRhdHRycyA9ICRhdHRycztcclxuICAgICAgICB0aGlzLl90ZXh0ID0gJHNjb3BlWyckY3RybCddWyd0ZXh0J107XHJcbiAgICAgICAgdGhpcy5faXNMaXN0ID0gJHNjb3BlWyckY3RybCddWydpc0xpc3QnXTtcclxuICAgICAgICB0aGlzLl9jbGFtcCA9ICRzY29wZVsnJGN0cmwnXVsnY2xhbXAnXTtcclxuICAgICAgICB0aGlzLl9yZWJpbmQgPSAkc2NvcGVbJyRjdHJsJ11bJ3JlYmluZCddO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyAkcG9zdExpbmsoKSB7XHJcbiAgICAgICAgLy8gRmlsbCB0aGUgdGV4dFxyXG4gICAgICAgIHRoaXMuYmluZFRleHQodGhpcy5fdGV4dCk7XHJcblxyXG4gICAgICAgIHRoaXMuXyRzY29wZS4kb24oJ3BpcFdpbmRvd1Jlc2l6ZWQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmJpbmRUZXh0KSB0aGlzLmJpbmRUZXh0KHRoaXMuX3RleHQodGhpcy5fJHNjb3BlKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIEFkZCBjbGFzc1xyXG4gICAgICAgIHRoaXMuXyRlbGVtZW50LmFkZENsYXNzKCdwaXAtbWFya2Rvd24nKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljICRvbkNoYW5nZXMoY2hhbmdlczogYW55KSB7XHJcbiAgICAgICAgY29uc3QgbmV3VGV4dCA9IGNoYW5nZXNbJ3RleHQnXS5jdXJyZW50VmFsdWU7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9yZWJpbmQpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3RleHQgIT09IG5ld1RleHQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3RleHQgPSBuZXdUZXh0O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5iaW5kVGV4dCh0aGlzLl90ZXh0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGRlc2NyaWJlQXR0YWNobWVudHMoYXJyYXkpIHtcclxuICAgICAgICB2YXIgYXR0YWNoU3RyaW5nID0gJycsXHJcbiAgICAgICAgICAgIGF0dGFjaFR5cGVzID0gW107XHJcblxyXG4gICAgICAgIF8uZWFjaChhcnJheSwgZnVuY3Rpb24gKGF0dGFjaCkge1xyXG4gICAgICAgICAgICBpZiAoYXR0YWNoLnR5cGUgJiYgYXR0YWNoLnR5cGUgIT09ICd0ZXh0Jykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGF0dGFjaFN0cmluZy5sZW5ndGggPT09IDAgJiYgdGhpcy5fcGlwVHJhbnNsYXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXR0YWNoU3RyaW5nID0gdGhpcy5fcGlwVHJhbnNsYXRlLnRyYW5zbGF0ZSgnTUFSS0RPV05fQVRUQUNITUVOVFMnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoYXR0YWNoVHlwZXMuaW5kZXhPZihhdHRhY2gudHlwZSkgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXR0YWNoVHlwZXMucHVzaChhdHRhY2gudHlwZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYXR0YWNoU3RyaW5nICs9IGF0dGFjaFR5cGVzLmxlbmd0aCA+IDEgPyAnLCAnIDogJyAnO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9waXBUcmFuc2xhdGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dGFjaFN0cmluZyArPSB0aGlzLl9waXBUcmFuc2xhdGUudHJhbnNsYXRlKGF0dGFjaC50eXBlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gYXR0YWNoU3RyaW5nO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYmluZFRleHQodmFsdWUpIHtcclxuICAgICAgICB2YXIgdGV4dFN0cmluZywgaXNDbGFtcGVkLCBoZWlnaHQsIG9wdGlvbnMsIG9iajtcclxuXHJcbiAgICAgICAgaWYgKF8uaXNBcnJheSh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgb2JqID0gXy5maW5kKHZhbHVlLCBmdW5jdGlvbiAoaXRlbTogYW55KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbS50eXBlID09PSAndGV4dCcgJiYgaXRlbS50ZXh0O1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRleHRTdHJpbmcgPSBvYmogPyBvYmoudGV4dCA6IHRoaXMuZGVzY3JpYmVBdHRhY2htZW50cyh2YWx1ZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGV4dFN0cmluZyA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaXNDbGFtcGVkID0gdGhpcy5fJGF0dHJzLnBpcExpbmVDb3VudCAmJiBfLmlzTnVtYmVyKHRoaXMuX2NsYW1wKTtcclxuICAgICAgICBpc0NsYW1wZWQgPSBpc0NsYW1wZWQgJiYgdGV4dFN0cmluZyAmJiB0ZXh0U3RyaW5nLmxlbmd0aCA+IDA7XHJcbiAgICAgICAgb3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgZ2ZtOiB0cnVlLFxyXG4gICAgICAgICAgICB0YWJsZXM6IHRydWUsXHJcbiAgICAgICAgICAgIGJyZWFrczogdHJ1ZSxcclxuICAgICAgICAgICAgc2FuaXRpemU6IHRydWUsXHJcbiAgICAgICAgICAgIHBlZGFudGljOiB0cnVlLFxyXG4gICAgICAgICAgICBzbWFydExpc3RzOiB0cnVlLFxyXG4gICAgICAgICAgICBzbWFydHlwZW50czogZmFsc2VcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRleHRTdHJpbmcgPSBtYXJrZWQodGV4dFN0cmluZyB8fCAnJywgb3B0aW9ucyk7XHJcbiAgICAgICAgaWYgKGlzQ2xhbXBlZCkge1xyXG4gICAgICAgICAgICBoZWlnaHQgPSAxLjUgKiB0aGlzLl9jbGFtcDtcclxuICAgICAgICB9IFxyXG4gICAgICAgIC8vIEFzc2lnbiB2YWx1ZSBhcyBIVE1MXHJcbiAgICAgICAgdGhpcy5fJGVsZW1lbnQuaHRtbCgnPGRpdicgKyAoaXNDbGFtcGVkID8gdGhpcy5faXNMaXN0ID8gJ2NsYXNzPVwicGlwLW1hcmtkb3duLWNvbnRlbnQgJyArXHJcbiAgICAgICAgICAgICdwaXAtbWFya2Rvd24tbGlzdFwiIHN0eWxlPVwibWF4LWhlaWdodDogJyArIGhlaWdodCArICdlbVwiPicgOlxyXG4gICAgICAgICAgICAnIGNsYXNzPVwicGlwLW1hcmtkb3duLWNvbnRlbnRcIiBzdHlsZT1cIm1heC1oZWlnaHQ6ICcgKyBoZWlnaHQgKyAnZW1cIj4nIDogdGhpcy5faXNMaXN0ID9cclxuICAgICAgICAgICAgJyBjbGFzcz1cInBpcC1tYXJrZG93bi1saXN0XCI+JyA6ICc+JykgKyB0ZXh0U3RyaW5nICsgJzwvZGl2PicpO1xyXG4gICAgICAgIHRoaXMuXyRlbGVtZW50LmZpbmQoJ2EnKS5hdHRyKCd0YXJnZXQnLCAnYmxhbmsnKTtcclxuICAgICAgICBpZiAoIXRoaXMuX2lzTGlzdCAmJiBpc0NsYW1wZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5fJGVsZW1lbnQuYXBwZW5kKCc8ZGl2IGNsYXNzPVwicGlwLWdyYWRpZW50LWJsb2NrXCI+PC9kaXY+Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGNvbnN0IE1hcmtkb3duQ29tcG9uZW50ID0ge1xyXG4gICAgICAgIGNvbnRyb2xsZXI6IE1hcmtkb3duQ29udHJvbGxlcixcclxuICAgICAgICBiaW5kaW5nczoge1xyXG4gICAgICAgICAgICB0ZXh0OiAnPHBpcFRleHQnLFxyXG4gICAgICAgICAgICBpc0xpc3Q6ICc8P3BpcExpc3QnLFxyXG4gICAgICAgICAgICBjbGFtcDogJzw/cGlwTGluZUNvdW50JyxcclxuICAgICAgICAgICAgcmViaW5kOiAnPD9waXBSZWJpbmQnXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdwaXBNYXJrZG93bicsIFsnbmdTYW5pdGl6ZSddKVxyXG4gICAgICAgIC5ydW4oQ29uZmlnKVxyXG4gICAgICAgIC5jb21wb25lbnQoJ3BpcE1hcmtkb3duJywgTWFya2Rvd25Db21wb25lbnQpO1xyXG59KSgpOyIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi90eXBpbmdzL3RzZC5kLnRzXCIgLz5cclxuXHJcblxyXG5leHBvcnQgY2xhc3MgUG9wb3ZlckNvbnRyb2xsZXIge1xyXG4gIFxyXG4gICAgcHJpdmF0ZSBfJHRpbWVvdXQ7XHJcbiAgICBwcml2YXRlIF8kc2NvcGU6IG5nLklTY29wZTtcclxuXHJcbiAgICBwdWJsaWMgdGltZW91dDtcclxuICAgIHB1YmxpYyBiYWNrZHJvcEVsZW1lbnQ7XHJcbiAgICBwdWJsaWMgY29udGVudDtcclxuICAgIHB1YmxpYyBlbGVtZW50O1xyXG4gICAgcHVibGljIGNhbGNIOiBib29sZWFuO1xyXG5cclxuICAgIHB1YmxpYyB0ZW1wbGF0ZVVybDtcclxuICAgIHB1YmxpYyB0ZW1wbGF0ZVxyXG5cclxuICAgIHB1YmxpYyBjYW5jZWxDYWxsYmFjazogRnVuY3Rpb247XHJcblxyXG4gICAgY29uc3RydWN0b3IoIFxyXG4gICAgICAgICRzY29wZTogbmcuSVNjb3BlLFxyXG4gICAgICAgICRyb290U2NvcGUsXHJcbiAgICAgICAgJGVsZW1lbnQsXHJcbiAgICAgICAgJHRpbWVvdXQsIFxyXG4gICAgICAgICRjb21waWxlXHJcbiAgICAgICApIHtcclxuICAgICAgICAgICAvLyRzY29wZSA9IF8uZGVmYXVsdHMoJHNjb3BlLCAkc2NvcGUuJHBhcmVudCk7ICAgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgXHJcbiAgICAgICAgICAgdGhpcy5fJHRpbWVvdXQgPSAkdGltZW91dDtcclxuICAgICAgICAgICB0aGlzLnRlbXBsYXRlVXJsID0gJHNjb3BlWydwYXJhbXMnXS50ZW1wbGF0ZVVybDtcclxuICAgICAgICAgICB0aGlzLnRlbXBsYXRlID0gJHNjb3BlWydwYXJhbXMnXS50ZW1wbGF0ZTtcclxuICAgICAgICAgICB0aGlzLnRpbWVvdXQgPSAkc2NvcGVbJ3BhcmFtcyddLnRpbWVvdXQ7XHJcbiAgICAgICAgICAgdGhpcy5lbGVtZW50ID0gJHNjb3BlWydwYXJhbXMnXS5lbGVtZW50O1xyXG4gICAgICAgICAgIHRoaXMuY2FsY0ggPSAkc2NvcGVbJ3BhcmFtcyddLmNhbGNIZWlnaHQ7XHJcbiAgICAgICAgICAgdGhpcy5jYW5jZWxDYWxsYmFjayA9ICRzY29wZVsncGFyYW1zJ10uY2FuY2VsQ2FsbGJhY2s7XHJcbiAgICAgICAgICAgdGhpcy5iYWNrZHJvcEVsZW1lbnQgPSAkKCcucGlwLXBvcG92ZXItYmFja2Ryb3AnKTtcclxuICAgICAgICAgICB0aGlzLmJhY2tkcm9wRWxlbWVudC5vbignY2xpY2sga2V5ZG93biBzY3JvbGwnLCgpID0+eyB0aGlzLmJhY2tkcm9wQ2xpY2soKX0pO1xyXG4gICAgICAgICAgIHRoaXMuYmFja2Ryb3BFbGVtZW50LmFkZENsYXNzKCRzY29wZVsncGFyYW1zJ10ucmVzcG9uc2l2ZSAhPT0gZmFsc2UgPyAncGlwLXJlc3BvbnNpdmUnIDogJycpO1xyXG5cclxuICAgICAgICAgICAkdGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvc2l0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoJHNjb3BlWydwYXJhbXMnXS50ZW1wbGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudCA9ICRjb21waWxlKCRzY29wZVsncGFyYW1zJ10udGVtcGxhdGUpKCRzY29wZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgJGVsZW1lbnQuZmluZCgnLnBpcC1wb3BvdmVyJykuYXBwZW5kKHRoaXMuY29udGVudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5pbml0KCk7XHJcbiAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICR0aW1lb3V0KCgpID0+IHsgdGhpcy5jYWxjSGVpZ2h0KCk7IH0sIDIwMCk7XHJcbiAgICAgICAgICAgJHJvb3RTY29wZS4kb24oJ3BpcFBvcG92ZXJSZXNpemUnLCAoKSA9PiB7IHRoaXMub25SZXNpemUoKX0pO1xyXG4gICAgICAgICAgICQod2luZG93KS5yZXNpemUoKCkgPT4geyB0aGlzLm9uUmVzaXplKCkgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBiYWNrZHJvcENsaWNrKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmNhbmNlbENhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2FuY2VsQ2FsbGJhY2soKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jbG9zZVBvcG92ZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2xvc2VQb3BvdmVyKCkge1xyXG4gICAgICAgIHRoaXMuYmFja2Ryb3BFbGVtZW50LnJlbW92ZUNsYXNzKCdvcGVuZWQnKTtcclxuICAgICAgICB0aGlzLl8kdGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuYmFja2Ryb3BFbGVtZW50LnJlbW92ZSgpO1xyXG4gICAgICAgIH0sIDEwMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uUG9wb3ZlckNsaWNrKCRlKSB7XHJcbiAgICAgICAgJGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHByaXZhdGUgaW5pdCgpIHtcclxuICAgICAgICB0aGlzLmJhY2tkcm9wRWxlbWVudC5hZGRDbGFzcygnb3BlbmVkJyk7XHJcbiAgICAgICAgJCgnLnBpcC1wb3BvdmVyLWJhY2tkcm9wJykuZm9jdXMoKTtcclxuICAgICAgICBpZiAodGhpcy50aW1lb3V0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuXyR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xvc2VQb3BvdmVyKCk7XHJcbiAgICAgICAgICAgIH0sIHRoaXMudGltZW91dCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcG9zaXRpb24oKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudCkge1xyXG4gICAgICAgICAgICBsZXQgZWxlbWVudCA9ICQodGhpcy5lbGVtZW50KSxcclxuICAgICAgICAgICAgICAgIHBvcyA9IGVsZW1lbnQub2Zmc2V0KCksXHJcbiAgICAgICAgICAgICAgICB3aWR0aCA9IGVsZW1lbnQud2lkdGgoKSxcclxuICAgICAgICAgICAgICAgIGhlaWdodCA9IGVsZW1lbnQuaGVpZ2h0KCksXHJcbiAgICAgICAgICAgICAgICBkb2NXaWR0aCA9ICQoZG9jdW1lbnQpLndpZHRoKCksXHJcbiAgICAgICAgICAgICAgICBkb2NIZWlnaHQgPSAkKGRvY3VtZW50KS5oZWlnaHQoKSxcclxuICAgICAgICAgICAgICAgIHBvcG92ZXIgPSB0aGlzLmJhY2tkcm9wRWxlbWVudC5maW5kKCcucGlwLXBvcG92ZXInKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChwb3MpIHtcclxuICAgICAgICAgICAgICAgIHBvcG92ZXJcclxuICAgICAgICAgICAgICAgICAgICAuY3NzKCdtYXgtd2lkdGgnLCBkb2NXaWR0aCAtIChkb2NXaWR0aCAtIHBvcy5sZWZ0KSlcclxuICAgICAgICAgICAgICAgICAgICAuY3NzKCdtYXgtaGVpZ2h0JywgZG9jSGVpZ2h0IC0gKHBvcy50b3AgKyBoZWlnaHQpIC0gMzIsIDApXHJcbiAgICAgICAgICAgICAgICAgICAgLmNzcygnbGVmdCcsIHBvcy5sZWZ0IC0gcG9wb3Zlci53aWR0aCgpICsgd2lkdGggLyAyKVxyXG4gICAgICAgICAgICAgICAgICAgIC5jc3MoJ3RvcCcsIHBvcy50b3AgKyBoZWlnaHQgKyAxNik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvblJlc2l6ZSgpIHtcclxuICAgICAgICB0aGlzLmJhY2tkcm9wRWxlbWVudC5maW5kKCcucGlwLXBvcG92ZXInKS5maW5kKCcucGlwLWNvbnRlbnQnKS5jc3MoJ21heC1oZWlnaHQnLCAnMTAwJScpO1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24oKTtcclxuICAgICAgICB0aGlzLmNhbGNIZWlnaHQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNhbGNIZWlnaHQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY2FsY0ggPT09IGZhbHNlKSB7IHJldHVybjsgfVxyXG4gICAgICAgIGxldCBwb3BvdmVyID0gdGhpcy5iYWNrZHJvcEVsZW1lbnQuZmluZCgnLnBpcC1wb3BvdmVyJyksXHJcbiAgICAgICAgdGl0bGUgPSBwb3BvdmVyLmZpbmQoJy5waXAtdGl0bGUnKSxcclxuICAgICAgICBmb290ZXIgPSBwb3BvdmVyLmZpbmQoJy5waXAtZm9vdGVyJyksXHJcbiAgICAgICAgY29udGVudCA9IHBvcG92ZXIuZmluZCgnLnBpcC1jb250ZW50JyksXHJcbiAgICAgICAgY29udGVudEhlaWdodCA9IHBvcG92ZXIuaGVpZ2h0KCkgLSB0aXRsZS5vdXRlckhlaWdodCh0cnVlKSAtIGZvb3Rlci5vdXRlckhlaWdodCh0cnVlKTtcclxuICAgICAgICBjb250ZW50LmNzcygnbWF4LWhlaWdodCcsIE1hdGgubWF4KGNvbnRlbnRIZWlnaHQsIDApICsgJ3B4JykuY3NzKCdib3gtc2l6aW5nJywgJ2JvcmRlci1ib3gnKTtcclxuICAgIH1cclxufVxyXG5cclxuKCgpID0+IHtcclxuICAgIGZ1bmN0aW9uIHBpcFBvcG92ZXIoJHBhcnNlOiBhbnkpIHtcclxuICAgICAgICBcIm5nSW5qZWN0XCI7XHJcblxyXG4gICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgICAgICAgICAgc2NvcGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3BvcG92ZXIvcG9wb3Zlci5odG1sJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFBvcG92ZXJDb250cm9sbGVyLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nXHJcbiAgICAgICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3BpcFBvcG92ZXInLCBbJ3BpcFBvcG92ZXIuU2VydmljZSddKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ3BpcFBvcG92ZXInLCBwaXBQb3BvdmVyKTtcclxuXHJcbn0pKCk7IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxyXG5cclxuZXhwb3J0IGNsYXNzIFBvcG92ZXJTZXJ2aWNlIHtcclxuICBcclxuICAgIHByaXZhdGUgXyR0aW1lb3V0O1xyXG4gICAgcHJpdmF0ZSBfJHNjb3BlOiBuZy5JU2NvcGU7XHJcbiAgICBwcml2YXRlIF8kY29tcGlsZTtcclxuICAgIHByaXZhdGUgXyRyb290U2NvcGU6IG5nLklSb290U2NvcGVTZXJ2aWNlO1xyXG5cclxuICAgIHB1YmxpYyBwb3BvdmVyVGVtcGxhdGU6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3RvciggXHJcbiAgICAgICAgJGNvbXBpbGUsXHJcbiAgICAgICAgJHJvb3RTY29wZSwgXHJcbiAgICAgICAgJHRpbWVvdXRcclxuICAgICAgICkge1xyXG4gICAgICAgICAgIHRoaXMuXyRjb21waWxlID0gJGNvbXBpbGU7XHJcbiAgICAgICAgICAgdGhpcy5fJHJvb3RTY29wZSA9ICRyb290U2NvcGU7XHJcbiAgICAgICAgICAgdGhpcy5fJHRpbWVvdXQgPSAkdGltZW91dDtcclxuICAgICAgICAgICB0aGlzLnBvcG92ZXJUZW1wbGF0ZSA9IFwiPGRpdiBjbGFzcz0ncGlwLXBvcG92ZXItYmFja2Ryb3Age3sgcGFyYW1zLmNsYXNzIH19JyBuZy1jb250cm9sbGVyPSdwYXJhbXMuY29udHJvbGxlcidcIiArXHJcbiAgICAgICAgICAgICAgICBcIiB0YWJpbmRleD0nMSc+IDxwaXAtcG9wb3ZlciBwaXAtcGFyYW1zPSdwYXJhbXMnPiA8L3BpcC1wb3BvdmVyPiA8L2Rpdj5cIjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2hvdyhwKSB7XHJcbiAgICAgICAgbGV0IGVsZW1lbnQsIHNjb3BlOiBuZy5JU2NvcGUsIHBhcmFtcywgY29udGVudDtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgZWxlbWVudCA9ICQoJ2JvZHknKTtcclxuICAgICAgICBpZiAoZWxlbWVudC5maW5kKCdtZC1iYWNrZHJvcCcpLmxlbmd0aCA+IDApIHsgcmV0dXJuOyB9XHJcbiAgICAgICAgdGhpcy5oaWRlKCk7XHJcbiAgICAgICAgc2NvcGUgPSB0aGlzLl8kcm9vdFNjb3BlLiRuZXcoKTtcclxuICAgICAgICBwYXJhbXMgPSBwICYmIF8uaXNPYmplY3QocCkgPyBwIDoge307XHJcbiAgICAgICAgc2NvcGVbJ3BhcmFtcyddID0gcGFyYW1zO1xyXG4gICAgICAgIHNjb3BlWydsb2NhbHMnXSA9IHBhcmFtcy5sb2NhbHM7XHJcbiAgICAgICAgY29udGVudCA9IHRoaXMuXyRjb21waWxlKHRoaXMucG9wb3ZlclRlbXBsYXRlKShzY29wZSk7XHJcbiAgICAgICAgZWxlbWVudC5hcHBlbmQoY29udGVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGhpZGUoKSB7XHJcbiAgICAgICAgbGV0IGJhY2tkcm9wRWxlbWVudCA9ICQoJy5waXAtcG9wb3Zlci1iYWNrZHJvcCcpO1xyXG4gICAgICAgIGJhY2tkcm9wRWxlbWVudC5yZW1vdmVDbGFzcygnb3BlbmVkJyk7XHJcbiAgICAgICAgdGhpcy5fJHRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICBiYWNrZHJvcEVsZW1lbnQucmVtb3ZlKCk7XHJcbiAgICAgICAgfSwgMTAwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVzaXplKCkge1xyXG4gICAgICAgIHRoaXMuXyRyb290U2NvcGUuJGJyb2FkY2FzdCgncGlwUG9wb3ZlclJlc2l6ZScpO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuKCgpID0+IHtcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdwaXBQb3BvdmVyLlNlcnZpY2UnLCBbXSlcclxuICAgICAgICAuc2VydmljZSgncGlwUG9wb3ZlclNlcnZpY2UnLCBQb3BvdmVyU2VydmljZSk7XHJcbn0pKCk7IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxyXG5cclxuY2xhc3MgUm91dGluZ0NvbnRyb2xsZXIge1xyXG4gICAgcHJpdmF0ZSBfaW1hZ2U6IGFueTtcclxuICAgIHByaXZhdGUgXyRlbGVtZW50O1xyXG5cclxuICAgIHB1YmxpYyBsb2dvVXJsOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgc2hvd1Byb2dyZXNzOiBGdW5jdGlvbjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciggXHJcbiAgICAgICAgJHNjb3BlOiBuZy5JU2NvcGUsXHJcbiAgICAgICAgJGVsZW1lbnQpXHJcbiAgICB7XHJcblxyXG4gICAgICAgIHRoaXMuXyRlbGVtZW50ID0gJGVsZW1lbnQ7XHJcbiAgICAgICAgdGhpcy5zaG93UHJvZ3Jlc3MgPSAkc2NvcGVbJ3ZtJ11bJ3Nob3dQcm9ncmVzcyddO1xyXG4gICAgICAgIHRoaXMubG9nb1VybCA9ICRzY29wZVsndm0nXVsnbG9nb1VybCddOyAgICBcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgJHBvc3RMaW5rKCkge1xyXG4gICAgICAgIHRoaXMuX2ltYWdlID0gdGhpcy5fJGVsZW1lbnQuZmluZCgnaW1nJyk7IFxyXG4gICAgICAgIHRoaXMubG9hZFByb2dyZXNzSW1hZ2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbG9hZFByb2dyZXNzSW1hZ2UoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMubG9nb1VybCkge1xyXG4gICAgICAgICAgICB0aGlzLl9pbWFnZS5hdHRyKCdzcmMnLCB0aGlzLmxvZ29VcmwpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuXHJcbigoKSA9PiB7XHJcblxyXG4gICAgY29uc3QgUm91dGluZ1Byb2dyZXNzID0ge1xyXG4gICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxyXG4gICAgICAgICAgICBiaW5kaW5nczoge1xyXG4gICAgICAgICAgICAgICAgc2hvd1Byb2dyZXNzOiAnJicsXHJcbiAgICAgICAgICAgICAgICBsb2dvVXJsOiAnQCdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwcm9ncmVzcy9yb3V0aW5nX3Byb2dyZXNzLmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBSb3V0aW5nQ29udHJvbGxlcixcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nXHJcbiAgICB9XHJcblxyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdwaXBSb3V0aW5nUHJvZ3Jlc3MnLCBbJ25nTWF0ZXJpYWwnXSlcclxuICAgICAgICAuY29tcG9uZW50KCdwaXBSb3V0aW5nUHJvZ3Jlc3MnLCBSb3V0aW5nUHJvZ3Jlc3MpO1xyXG5cclxufSkoKTtcclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxyXG5cclxuaW50ZXJmYWNlIElQaXBUb2FzdCB7XHJcbiAgICB0eXBlOiBzdHJpbmc7XHJcbiAgICBpZDogc3RyaW5nO1xyXG4gICAgZXJyb3I6IGFueTtcclxuICAgIG1lc3NhZ2U6IHN0cmluZztcclxuICAgIGFjdGlvbnM6IHN0cmluZ1tdO1xyXG4gICAgZHVyYXRpb246IG51bWJlcjtcclxuICAgIHN1Y2Nlc3NDYWxsYmFjazogRnVuY3Rpb247XHJcbiAgICBjYW5jZWxDYWxsYmFjazogRnVuY3Rpb25cclxufVxyXG5cclxuY2xhc3MgVG9hc3RDb250cm9sbGVyIHtcclxuICAgIHByaXZhdGUgXyRtZFRvYXN0OiBhbmd1bGFyLm1hdGVyaWFsLklUb2FzdFNlcnZpY2U7XHJcbiAgICBwcml2YXRlIF9waXBFcnJvckRldGFpbHNEaWFsb2c7XHJcblxyXG4gICAgcHVibGljIG1lc3NhZ2U6IHN0cmluZztcclxuICAgIHB1YmxpYyBhY3Rpb25zOiBzdHJpbmdbXTtcclxuICAgIHB1YmxpYyB0b2FzdDogSVBpcFRvYXN0O1xyXG4gICAgcHVibGljIGFjdGlvbkxlbmdodDogbnVtYmVyO1xyXG4gICAgcHVibGljIHNob3dEZXRhaWxzOiBib29sZWFuO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCBcclxuICAgICAgICAkbWRUb2FzdDogYW5ndWxhci5tYXRlcmlhbC5JVG9hc3RTZXJ2aWNlLCBcclxuICAgICAgICB0b2FzdDogSVBpcFRvYXN0LCBcclxuICAgICAgICAkaW5qZWN0b3JcclxuICAgICAgICkge1xyXG4gICAgICAgICAgICB0aGlzLl9waXBFcnJvckRldGFpbHNEaWFsb2cgPSAkaW5qZWN0b3IuaGFzKCdwaXBFcnJvckRldGFpbHNEaWFsb2cnKSBcclxuICAgICAgICAgICAgICAgID8gJGluamVjdG9yLmdldCgncGlwRXJyb3JEZXRhaWxzRGlhbG9nJykgOiBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLl8kbWRUb2FzdCA9ICRtZFRvYXN0O1xyXG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2UgPSB0b2FzdC5tZXNzYWdlO1xyXG4gICAgICAgICAgICB0aGlzLmFjdGlvbnMgPSB0b2FzdC5hY3Rpb25zO1xyXG4gICAgICAgICAgICB0aGlzLnRvYXN0ID0gdG9hc3Q7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAodG9hc3QuYWN0aW9ucy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWN0aW9uTGVuZ2h0ID0gMDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWN0aW9uTGVuZ2h0ID0gdG9hc3QuYWN0aW9ucy5sZW5ndGggPT09IDEgPyB0b2FzdC5hY3Rpb25zWzBdLnRvU3RyaW5nKCkubGVuZ3RoIDogbnVsbDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5zaG93RGV0YWlscyA9IHRoaXMuX3BpcEVycm9yRGV0YWlsc0RpYWxvZyAhPSBudWxsO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAgcHVibGljIG9uRGV0YWlscygpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl8kbWRUb2FzdC5oaWRlKCk7XHJcbiAgICAgICAgaWYgKHRoaXMuX3BpcEVycm9yRGV0YWlsc0RpYWxvZykge1xyXG4gICAgICAgICAgICB0aGlzLl9waXBFcnJvckRldGFpbHNEaWFsb2cuc2hvdyhcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZXJyb3I6IHRoaXMudG9hc3QuZXJyb3IsXHJcbiAgICAgICAgICAgICAgICBvazogJ09rJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBhbmd1bGFyLm5vb3AsXHJcbiAgICAgICAgICAgIGFuZ3VsYXIubm9vcFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25BY3Rpb24oYWN0aW9uKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fJG1kVG9hc3QuaGlkZShcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGFjdGlvbjogYWN0aW9uLFxyXG4gICAgICAgICAgICBpZDogdGhpcy50b2FzdC5pZCxcclxuICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5tZXNzYWdlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG59XHJcblxyXG5pbnRlcmZhY2UgSVRvYXN0U2VydmljZSB7XHJcbiAgICBzaG93TmV4dFRvYXN0KCk6IHZvaWQ7XHJcbiAgICBzaG93VG9hc3QodG9hc3Q6IElQaXBUb2FzdCk6IHZvaWQ7XHJcbiAgICBhZGRUb2FzdCh0b2FzdCk6IHZvaWQ7XHJcbiAgICByZW1vdmVUb2FzdHModHlwZTogc3RyaW5nKTogdm9pZDtcclxuICAgIGdldFRvYXN0QnlJZChpZDogc3RyaW5nKTogSVBpcFRvYXN0O1xyXG4gICAgcmVtb3ZlVG9hc3RzQnlJZChpZDogc3RyaW5nKTogdm9pZDtcclxuICAgIG9uQ2xlYXJUb2FzdHMoKTogdm9pZDtcclxuICAgIHNob3dOb3RpZmljYXRpb24obWVzc2FnZTogc3RyaW5nLCBhY3Rpb25zOiBzdHJpbmdbXSwgc3VjY2Vzc0NhbGxiYWNrLCBjYW5jZWxDYWxsYmFjaywgaWQ6IHN0cmluZyk7XHJcbiAgICBzaG93TWVzc2FnZShtZXNzYWdlOiBzdHJpbmcsIHN1Y2Nlc3NDYWxsYmFjaywgY2FuY2VsQ2FsbGJhY2ssIGlkPzogc3RyaW5nKTtcclxuICAgIHNob3dFcnJvcihtZXNzYWdlOiBzdHJpbmcsIHN1Y2Nlc3NDYWxsYmFjaywgY2FuY2VsQ2FsbGJhY2ssIGlkOiBzdHJpbmcsIGVycm9yOiBhbnkpO1xyXG4gICAgaGlkZUFsbFRvYXN0cygpOiB2b2lkO1xyXG4gICAgY2xlYXJUb2FzdHModHlwZT86IHN0cmluZyk7XHJcbn1cclxuXHJcbmNsYXNzIFRvYXN0U2VydmljZSBpbXBsZW1lbnRzIElUb2FzdFNlcnZpY2Uge1xyXG4gICAgcHJpdmF0ZSBTSE9XX1RJTUVPVVQ6IG51bWJlciA9IDIwMDAwO1xyXG4gICAgcHJpdmF0ZSBTSE9XX1RJTUVPVVRfTk9USUZJQ0FUSU9OUzogbnVtYmVyID0gMjAwMDA7XHJcbiAgICBwcml2YXRlIHRvYXN0czogSVBpcFRvYXN0W10gPSBbXTtcclxuICAgIHByaXZhdGUgY3VycmVudFRvYXN0OiBhbnk7XHJcbiAgICBwcml2YXRlIHNvdW5kczogYW55ID0ge307XHJcblxyXG4gICAgcHJpdmF0ZSBfJG1kVG9hc3Q6IGFuZ3VsYXIubWF0ZXJpYWwuSVRvYXN0U2VydmljZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICAkcm9vdFNjb3BlOiBuZy5JUm9vdFNjb3BlU2VydmljZSwgXHJcbiAgICAgICAgJG1kVG9hc3Q6IGFuZ3VsYXIubWF0ZXJpYWwuSVRvYXN0U2VydmljZSkge1xyXG5cclxuICAgICAgICB0aGlzLl8kbWRUb2FzdCA9ICRtZFRvYXN0O1xyXG5cclxuICAgICAgICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3VjY2VzcycsICgpID0+IHt0aGlzLm9uU3RhdGVDaGFuZ2VTdWNjZXNzKCl9KTtcclxuICAgICAgICAkcm9vdFNjb3BlLiRvbigncGlwU2Vzc2lvbkNsb3NlZCcsICgpID0+IHt0aGlzLm9uQ2xlYXJUb2FzdHMoKX0pO1xyXG4gICAgICAgICRyb290U2NvcGUuJG9uKCdwaXBJZGVudGl0eUNoYW5nZWQnLCAoKSA9PiB7dGhpcy5vbkNsZWFyVG9hc3RzKCl9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2hvd05leHRUb2FzdCgpOiB2b2lkIHtcclxuICAgICAgICBsZXQgdG9hc3Q6IElQaXBUb2FzdDtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMudG9hc3RzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdG9hc3QgPSB0aGlzLnRvYXN0c1swXTtcclxuICAgICAgICAgICAgdGhpcy50b2FzdHMuc3BsaWNlKDAsIDEpO1xyXG4gICAgICAgICAgICB0aGlzLnNob3dUb2FzdCh0b2FzdCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgICAvLyBTaG93IHRvYXN0XHJcbiAgICAgcHVibGljIHNob3dUb2FzdCh0b2FzdDogSVBpcFRvYXN0KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50VG9hc3QgPSB0b2FzdDtcclxuXHJcbiAgICAgICAgdGhpcy5fJG1kVG9hc3Quc2hvdyh7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndG9hc3QvdG9hc3QuaHRtbCcsXHJcbiAgICAgICAgICAgIGhpZGVEZWxheTogdG9hc3QuZHVyYXRpb24gfHwgdGhpcy5TSE9XX1RJTUVPVVQsXHJcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYm90dG9tIGxlZnQnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBUb2FzdENvbnRyb2xsZXIsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICAgICAgbG9jYWxzOiB7XHJcbiAgICAgICAgICAgICAgICB0b2FzdDogdGhpcy5jdXJyZW50VG9hc3QsXHJcbiAgICAgICAgICAgICAgICBzb3VuZHM6IHRoaXMuc291bmRzXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKCBcclxuICAgICAgICAgICAgKGFjdGlvbjogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dUb2FzdE9rUmVzdWx0KGFjdGlvbik7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIChhY3Rpb246IHN0cmluZykgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zaG93VG9hc3RDYW5jZWxSZXN1bHQoYWN0aW9uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzaG93VG9hc3RDYW5jZWxSZXN1bHQoYWN0aW9uOiBzdHJpbmcpOnZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRUb2FzdC5jYW5jZWxDYWxsYmFjaykge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRUb2FzdC5jYW5jZWxDYWxsYmFjayhhY3Rpb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmN1cnJlbnRUb2FzdCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5zaG93TmV4dFRvYXN0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzaG93VG9hc3RPa1Jlc3VsdChhY3Rpb246IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRUb2FzdC5zdWNjZXNzQ2FsbGJhY2spIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50VG9hc3Quc3VjY2Vzc0NhbGxiYWNrKGFjdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY3VycmVudFRvYXN0ID0gbnVsbDtcclxuICAgICAgICB0aGlzLnNob3dOZXh0VG9hc3QoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkVG9hc3QodG9hc3QpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50VG9hc3QgJiYgdG9hc3QudHlwZSAhPT0gJ2Vycm9yJykge1xyXG4gICAgICAgICAgICB0aGlzLnRvYXN0cy5wdXNoKHRvYXN0KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnNob3dUb2FzdCh0b2FzdCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW1vdmVUb2FzdHModHlwZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IHJlc3VsdDogYW55W10gPSBbXTtcclxuICAgICAgICBfLmVhY2godGhpcy50b2FzdHMsICh0b2FzdCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIXRvYXN0LnR5cGUgfHwgdG9hc3QudHlwZSAhPT0gdHlwZSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2godG9hc3QpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy50b2FzdHMgPSBfLmNsb25lRGVlcChyZXN1bHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW1vdmVUb2FzdHNCeUlkKGlkOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICBfLnJlbW92ZSh0aGlzLnRvYXN0cywge2lkOiBpZH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRUb2FzdEJ5SWQoaWQ6IHN0cmluZyk6IElQaXBUb2FzdCB7XHJcbiAgICAgICAgcmV0dXJuIF8uZmluZCh0aGlzLnRvYXN0cywge2lkOiBpZH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvblN0YXRlQ2hhbmdlU3VjY2VzcygpIHt9XHJcblxyXG4gICAgcHVibGljIG9uQ2xlYXJUb2FzdHMoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5jbGVhclRvYXN0cyhudWxsKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2hvd05vdGlmaWNhdGlvbihtZXNzYWdlOiBzdHJpbmcsIGFjdGlvbnM6IHN0cmluZ1tdLCBzdWNjZXNzQ2FsbGJhY2ssIGNhbmNlbENhbGxiYWNrLCBpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5hZGRUb2FzdCh7XHJcbiAgICAgICAgICAgIGlkOiBpZCB8fCBudWxsLFxyXG4gICAgICAgICAgICB0eXBlOiAnbm90aWZpY2F0aW9uJyxcclxuICAgICAgICAgICAgbWVzc2FnZTogbWVzc2FnZSxcclxuICAgICAgICAgICAgYWN0aW9uczogYWN0aW9ucyB8fCBbJ29rJ10sXHJcbiAgICAgICAgICAgIHN1Y2Nlc3NDYWxsYmFjazogc3VjY2Vzc0NhbGxiYWNrLFxyXG4gICAgICAgICAgICBjYW5jZWxDYWxsYmFjazogY2FuY2VsQ2FsbGJhY2ssXHJcbiAgICAgICAgICAgIGR1cmF0aW9uOiB0aGlzLlNIT1dfVElNRU9VVF9OT1RJRklDQVRJT05TXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNob3dNZXNzYWdlKG1lc3NhZ2U6IHN0cmluZywgc3VjY2Vzc0NhbGxiYWNrLCBjYW5jZWxDYWxsYmFjaywgaWQ/OiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLmFkZFRvYXN0KHtcclxuICAgICAgICAgICAgaWQ6IGlkIHx8IG51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6ICdtZXNzYWdlJyxcclxuICAgICAgICAgICAgbWVzc2FnZTogbWVzc2FnZSxcclxuICAgICAgICAgICAgYWN0aW9uczogWydvayddLFxyXG4gICAgICAgICAgICBzdWNjZXNzQ2FsbGJhY2s6IHN1Y2Nlc3NDYWxsYmFjayxcclxuICAgICAgICAgICAgY2FuY2VsQ2FsbGJhY2s6IGNhbmNlbENhbGxiYWNrXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgIHB1YmxpYyBzaG93RXJyb3IobWVzc2FnZTogc3RyaW5nLCBzdWNjZXNzQ2FsbGJhY2ssIGNhbmNlbENhbGxiYWNrLCBpZDogc3RyaW5nLCBlcnJvcjogYW55KSB7XHJcbiAgICAgICAgdGhpcy5hZGRUb2FzdCh7XHJcbiAgICAgICAgICAgIGlkOiBpZCB8fCBudWxsLFxyXG4gICAgICAgICAgICBlcnJvcjogZXJyb3IsXHJcbiAgICAgICAgICAgIHR5cGU6ICdlcnJvcicsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UgfHwgJ1Vua25vd24gZXJyb3IuJyxcclxuICAgICAgICAgICAgYWN0aW9uczogWydvayddLFxyXG4gICAgICAgICAgICBzdWNjZXNzQ2FsbGJhY2s6IHN1Y2Nlc3NDYWxsYmFjayxcclxuICAgICAgICAgICAgY2FuY2VsQ2FsbGJhY2s6IGNhbmNlbENhbGxiYWNrXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGhpZGVBbGxUb2FzdHMoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fJG1kVG9hc3QuY2FuY2VsKCk7XHJcbiAgICAgICAgdGhpcy50b2FzdHMgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2xlYXJUb2FzdHModHlwZT86IHN0cmluZykge1xyXG4gICAgICAgIGlmICh0eXBlKSB7XHJcbiAgICAgICAgICAgIC8vIHBpcEFzc2VydC5pc1N0cmluZyh0eXBlLCAncGlwVG9hc3RzLmNsZWFyVG9hc3RzOiB0eXBlIHNob3VsZCBiZSBhIHN0cmluZycpO1xyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZVRvYXN0cyh0eXBlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl8kbWRUb2FzdC5jYW5jZWwoKTtcclxuICAgICAgICAgICAgdGhpcy50b2FzdHMgPSBbXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5cclxuKCgpID0+IHtcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdwaXBUb2FzdHMnLCBbJ25nTWF0ZXJpYWwnLCAncGlwQ29udHJvbHMuVHJhbnNsYXRlJ10pXHJcbiAgICAgICAgLnNlcnZpY2UoJ3BpcFRvYXN0cycsIFRvYXN0U2VydmljZSk7XHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbihtb2R1bGUpIHtcbnRyeSB7XG4gIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBDb250cm9scy5UZW1wbGF0ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcENvbnRyb2xzLlRlbXBsYXRlcycsIFtdKTtcbn1cbm1vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgnY29sb3JfcGlja2VyL2NvbG9yX3BpY2tlci5odG1sJyxcbiAgICAnPHVsIGNsYXNzPVwicGlwLWNvbG9yLXBpY2tlciB7e3ZtLmNsYXNzfX1cIiBwaXAtc2VsZWN0ZWQ9XCJ2bS5jdXJyZW50Q29sb3JJbmRleFwiIHBpcC1lbnRlci1zcGFjZS1wcmVzcz1cInZtLmVudGVyU3BhY2VQcmVzcygkZXZlbnQpXCI+PGxpIHRhYmluZGV4PVwiLTFcIiBuZy1yZXBlYXQ9XCJjb2xvciBpbiB2bS5jb2xvcnMgdHJhY2sgYnkgY29sb3JcIj48bWQtYnV0dG9uIHRhYmluZGV4PVwiLTFcIiBjbGFzcz1cIm1kLWljb24tYnV0dG9uIHBpcC1zZWxlY3RhYmxlXCIgbmctY2xpY2s9XCJ2bS5zZWxlY3RDb2xvcigkaW5kZXgpXCIgYXJpYS1sYWJlbD1cImNvbG9yXCIgbmctZGlzYWJsZWQ9XCJ2bS5kaXNhYmxlZCgpXCI+PG1kLWljb24gbmctc3R5bGU9XCJ7XFwnY29sb3JcXCc6IGNvbG9yfVwiIG1kLXN2Zy1pY29uPVwiaWNvbnM6e3sgY29sb3IgPT0gdm0uY3VycmVudENvbG9yID8gXFwnY2lyY2xlXFwnIDogXFwncmFkaW8tb2ZmXFwnIH19XCI+PC9tZC1pY29uPjwvbWQtYnV0dG9uPjwvbGk+PC91bD4nKTtcbn1dKTtcbn0pKCk7XG5cbihmdW5jdGlvbihtb2R1bGUpIHtcbnRyeSB7XG4gIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBDb250cm9scy5UZW1wbGF0ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcENvbnRyb2xzLlRlbXBsYXRlcycsIFtdKTtcbn1cbm1vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgncG9wb3Zlci9wb3BvdmVyLmh0bWwnLFxuICAgICc8ZGl2IG5nLWlmPVwidm0udGVtcGxhdGVVcmxcIiBjbGFzcz1cInBpcC1wb3BvdmVyIGZsZXggbGF5b3V0LWNvbHVtblwiIG5nLWNsaWNrPVwidm0ub25Qb3BvdmVyQ2xpY2soJGV2ZW50KVwiIG5nLWluY2x1ZGU9XCJ2bS50ZW1wbGF0ZVVybFwiPjwvZGl2PjxkaXYgbmctaWY9XCJ2bS50ZW1wbGF0ZVwiIGNsYXNzPVwicGlwLXBvcG92ZXJcIiBuZy1jbGljaz1cInZtLm9uUG9wb3ZlckNsaWNrKCRldmVudClcIj48L2Rpdj4nKTtcbn1dKTtcbn0pKCk7XG5cbihmdW5jdGlvbihtb2R1bGUpIHtcbnRyeSB7XG4gIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBDb250cm9scy5UZW1wbGF0ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcENvbnRyb2xzLlRlbXBsYXRlcycsIFtdKTtcbn1cbm1vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgncHJvZ3Jlc3Mvcm91dGluZ19wcm9ncmVzcy5odG1sJyxcbiAgICAnPGRpdiBjbGFzcz1cInBpcC1yb3V0aW5nLXByb2dyZXNzIGxheW91dC1jb2x1bW4gbGF5b3V0LWFsaWduLWNlbnRlci1jZW50ZXJcIiBuZy1zaG93PVwidm0uc2hvd1Byb2dyZXNzKClcIj48ZGl2IGNsYXNzPVwibG9hZGVyXCI+PHN2ZyBjbGFzcz1cImNpcmN1bGFyXCIgdmlld2JveD1cIjI1IDI1IDUwIDUwXCI+PGNpcmNsZSBjbGFzcz1cInBhdGhcIiBjeD1cIjUwXCIgY3k9XCI1MFwiIHI9XCIyMFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1taXRlcmxpbWl0PVwiMTBcIj48L2NpcmNsZT48L3N2Zz48L2Rpdj48aW1nIHNyYz1cIlwiIGhlaWdodD1cIjQwXCIgd2lkdGg9XCI0MFwiIGNsYXNzPVwicGlwLWltZ1wiPjxtZC1wcm9ncmVzcy1jaXJjdWxhciBtZC1kaWFtZXRlcj1cIjk2XCIgY2xhc3M9XCJmaXgtaWVcIj48L21kLXByb2dyZXNzLWNpcmN1bGFyPjwvZGl2PicpO1xufV0pO1xufSkoKTtcblxuKGZ1bmN0aW9uKG1vZHVsZSkge1xudHJ5IHtcbiAgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcENvbnRyb2xzLlRlbXBsYXRlcycpO1xufSBjYXRjaCAoZSkge1xuICBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgncGlwQ29udHJvbHMuVGVtcGxhdGVzJywgW10pO1xufVxubW9kdWxlLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCd0b2FzdC90b2FzdC5odG1sJyxcbiAgICAnPG1kLXRvYXN0IGNsYXNzPVwibWQtYWN0aW9uIHBpcC10b2FzdFwiIG5nLWNsYXNzPVwie1xcJ3BpcC1lcnJvclxcJzogdm0udG9hc3QudHlwZT09XFwnZXJyb3JcXCcsIFxcJ3BpcC1jb2x1bW4tdG9hc3RcXCc6IHZtLnRvYXN0LmFjdGlvbnMubGVuZ3RoID4gMSB8fCB2bS5hY3Rpb25MZW5naHQgPiA0LCBcXCdwaXAtbm8tYWN0aW9uLXRvYXN0XFwnOiB2bS5hY3Rpb25MZW5naHQgPT0gMH1cIiBzdHlsZT1cImhlaWdodDppbml0aWFsOyBtYXgtaGVpZ2h0OiBpbml0aWFsO1wiPjxzcGFuIGNsYXNzPVwiZmxleC12YXIgcGlwLXRleHRcIiBuZy1iaW5kLWh0bWw9XCJ2bS5tZXNzYWdlXCI+PC9zcGFuPjxkaXYgY2xhc3M9XCJsYXlvdXQtcm93IGxheW91dC1hbGlnbi1lbmQtc3RhcnQgcGlwLWFjdGlvbnNcIiBuZy1pZj1cInZtLmFjdGlvbnMubGVuZ3RoID4gMCB8fCAodm0udG9hc3QudHlwZT09XFwnZXJyb3JcXCcgJiYgdm0udG9hc3QuZXJyb3IpXCI+PGRpdiBjbGFzcz1cImZsZXhcIiBuZy1pZj1cInZtLnRvYXN0LmFjdGlvbnMubGVuZ3RoID4gMVwiPjwvZGl2PjxtZC1idXR0b24gY2xhc3M9XCJmbGV4LWZpeGVkIHBpcC10b2FzdC1idXR0b25cIiBuZy1pZj1cInZtLnRvYXN0LnR5cGU9PVxcJ2Vycm9yXFwnICYmIHZtLnRvYXN0LmVycm9yICYmIHZtLnNob3dEZXRhaWxzXCIgbmctY2xpY2s9XCJ2bS5vbkRldGFpbHMoKVwiPkRldGFpbHM8L21kLWJ1dHRvbj48bWQtYnV0dG9uIGNsYXNzPVwiZmxleC1maXhlZCBwaXAtdG9hc3QtYnV0dG9uXCIgbmctY2xpY2s9XCJ2bS5vbkFjdGlvbihhY3Rpb24pXCIgbmctcmVwZWF0PVwiYWN0aW9uIGluIHZtLmFjdGlvbnNcIiBhcmlhLWxhYmVsPVwie3s6OmFjdGlvbnwgdHJhbnNsYXRlfX1cIj57ezo6YWN0aW9ufCB0cmFuc2xhdGV9fTwvbWQtYnV0dG9uPjwvZGl2PjwvbWQtdG9hc3Q+Jyk7XG59XSk7XG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1waXAtd2VidWktY29udHJvbHMtaHRtbC5taW4uanMubWFwXG4iXX0=