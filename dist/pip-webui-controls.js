(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.pip || (g.pip = {})).controls = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
{
    var ColorPickerBindings = {
        ngDisabled: '<?ngDisabled',
        colors: '<pipColors',
        currentColor: '=ngModel',
        colorChange: '&?ngChange'
    };
    var ColorPickerChanges = (function () {
        function ColorPickerChanges() {
        }
        return ColorPickerChanges;
    }());
    var DEFAULT_COLORS_1 = ['purple', 'lightgreen', 'green', 'darkred', 'pink', 'yellow', 'cyan'];
    var ColorPickerController = (function () {
        function ColorPickerController($scope, $element, $attrs, $timeout) {
            this.$scope = $scope;
            this.$element = $element;
            this.$timeout = $timeout;
            this.class = $attrs.class || '';
        }
        ColorPickerController.prototype.$onChanges = function (changes) {
            this.colors = changes.colors && _.isArray(changes.colors.currentValue) && changes.colors.currentValue.length !== 0 ?
                changes.colors.currentValue : DEFAULT_COLORS_1;
            this.currentColor = this.currentColor || this.colors[0];
            this.currentColorIndex = this.colors.indexOf(this.currentColor);
            this.ngDisabled = changes.ngDisabled.currentValue;
        };
        ColorPickerController.prototype.selectColor = function (index) {
            var _this = this;
            if (this.ngDisabled) {
                return;
            }
            this.currentColorIndex = index;
            this.currentColor = this.colors[this.currentColorIndex];
            this.$timeout(function () {
                _this.$scope.$apply();
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
    var pipColorPicker = {
        bindings: ColorPickerBindings,
        templateUrl: 'color_picker/colorPicker.html',
        controller: ColorPickerController
    };
    angular
        .module('pipColorPicker', ['pipControls.Templates'])
        .component('pipColorPicker', pipColorPicker);
}
},{}],2:[function(require,module,exports){
angular.module('pipControls', [
    'pipMarkdown',
    'pipColorPicker',
    'pipRoutingProgress',
    'pipPopover',
    'pipImageSlider',
    'pipToasts',
    'pipControls.Translate'
]);
},{}],3:[function(require,module,exports){
{
    translateControls.$inject = ['$injector'];
    function translateControls($injector) {
        var pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;
        return function (key) {
            return pipTranslate ? pipTranslate['translate'](key) || key : key;
        };
    }
    angular.module('pipControls.Translate', [])
        .filter('translate', translateControls);
}
},{}],4:[function(require,module,exports){
"use strict";
},{}],5:[function(require,module,exports){
"use strict";
{
    var pipImageSliderController_1 = (function () {
        pipImageSliderController_1.$inject = ['$scope', '$element', '$attrs', '$parse', '$timeout', '$interval', 'pipImageSlider'];
        function pipImageSliderController_1($scope, $element, $attrs, $parse, $timeout, $interval, pipImageSlider) {
            var _this = this;
            this.$scope = $scope;
            this.$element = $element;
            this.$attrs = $attrs;
            this.$parse = $parse;
            this.$timeout = $timeout;
            this.$interval = $interval;
            this.pipImageSlider = pipImageSlider;
            this._index = 0;
            this.DEFAULT_INTERVAL = 4500;
            this.swipeStart = 0;
            this._type = this.type();
            this._interval = this.interval();
            this.slideTo = this.slideToPrivate;
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
            $scope.$on('$destroy', function () {
                _this.stopInterval();
                pipImageSlider.removeSlider($attrs.id);
            });
        }
        pipImageSliderController_1.prototype.nextBlock = function () {
            this.restartInterval();
            this._newIndex = this._index + 1 === this._blocks.length ? 0 : this._index + 1;
            this._direction = 'next';
            this._throttled();
        };
        pipImageSliderController_1.prototype.prevBlock = function () {
            this.restartInterval();
            this._newIndex = this._index - 1 < 0 ? this._blocks.length - 1 : this._index - 1;
            this._direction = 'prev';
            this._throttled();
        };
        pipImageSliderController_1.prototype.slideToPrivate = function (nextIndex) {
            if (nextIndex === this._index || nextIndex > this._blocks.length - 1) {
                return;
            }
            this.restartInterval();
            this._newIndex = nextIndex;
            this._direction = nextIndex > this._index ? 'next' : 'prev';
            this._throttled();
        };
        pipImageSliderController_1.prototype.setIndex = function () {
            if (this.$attrs.pipImageIndex)
                this.sliderIndex = this._index;
        };
        pipImageSliderController_1.prototype.startInterval = function () {
            var _this = this;
            this._timePromises = this.$interval(function () {
                _this._newIndex = _this._index + 1 === _this._blocks.length ? 0 : _this._index + 1;
                _this._direction = 'next';
                _this._throttled();
            }, Number(this._interval || this.DEFAULT_INTERVAL));
        };
        pipImageSliderController_1.prototype.stopInterval = function () {
            this.$interval.cancel(this._timePromises);
        };
        pipImageSliderController_1.prototype.restartInterval = function () {
            this.stopInterval();
            this.startInterval();
        };
        return pipImageSliderController_1;
    }());
    var ImageSlider = function () {
        return {
            scope: {
                sliderIndex: '=pipImageIndex',
                type: '&pipAnimationType',
                interval: '&pipAnimationInterval'
            },
            bindToController: true,
            controller: pipImageSliderController_1,
            controllerAs: 'vm'
        };
    };
    angular
        .module('pipImageSlider', ['pipSliderButton', 'pipSliderIndicator', 'pipImageSlider.Service'])
        .directive('pipImageSlider', ImageSlider);
}
},{}],6:[function(require,module,exports){
"use strict";
{
    var ImageSliderService = (function () {
        ImageSliderService.$inject = ['$timeout'];
        function ImageSliderService($timeout) {
            this.$timeout = $timeout;
            this.ANIMATION_DURATION = 550;
            this._sliders = {};
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
            this.$timeout(function () {
                nextBlock.addClass('animated').addClass('pip-show').removeClass('pip-next');
                prevBlock.addClass('animated').removeClass('pip-show');
            }, 100);
        };
        ImageSliderService.prototype.prevCarousel = function (nextBlock, prevBlock) {
            this.$timeout(function () {
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
    angular
        .module('pipImageSlider.Service', [])
        .service('pipImageSlider', ImageSliderService);
}
},{}],7:[function(require,module,exports){
"use strict";
{
    var SliderButtonController_1 = (function () {
        SliderButtonController_1.$inject = ['$element', 'pipImageSlider'];
        function SliderButtonController_1($element, pipImageSlider) {
            var _this = this;
            $element.on('click', function () {
                if (!_this.sliderId() || !_this.direction()) {
                    return;
                }
                pipImageSlider.getSliderScope(_this.sliderId()).vm[_this.direction() + 'Block']();
            });
        }
        return SliderButtonController_1;
    }());
    var SliderButton = function () {
        return {
            scope: {
                direction: '&pipButtonType',
                sliderId: '&pipSliderId'
            },
            controllerAs: '$ctlr',
            bindToController: true,
            controller: SliderButtonController_1
        };
    };
    angular.module('pipSliderButton', [])
        .directive('pipSliderButton', SliderButton);
}
},{}],8:[function(require,module,exports){
"use strict";
{
    var SliderIndicatorController_1 = (function () {
        SliderIndicatorController_1.$inject = ['$element', 'pipImageSlider'];
        function SliderIndicatorController_1($element, pipImageSlider) {
            var _this = this;
            $element.css('cursor', 'pointer');
            $element.on('click', function () {
                if (!_this.sliderId() || _this.slideTo() === undefined) {
                    return;
                }
                pipImageSlider.getSliderScope(_this.sliderId()).vm.slideTo(_this.slideTo());
            });
        }
        return SliderIndicatorController_1;
    }());
    var SliderIndicator = function () {
        return {
            scope: {
                slideTo: '&pipSlideTo',
                sliderId: '&pipSliderId'
            },
            controllerAs: '$ctlr',
            bindToController: true,
            controller: SliderIndicatorController_1
        };
    };
    angular.module('pipSliderIndicator', [])
        .directive('pipSliderIndicator', SliderIndicator);
}
},{}],9:[function(require,module,exports){
{
    ConfigTranslations.$inject = ['$injector'];
    function ConfigTranslations($injector) {
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
    var MarkdownBindings = {
        text: '<pipText',
        isList: '<?pipList',
        clamp: '<?pipLineCount',
        rebind: '<?pipRebind'
    };
    var MarkdownChanges = (function () {
        function MarkdownChanges() {
        }
        return MarkdownChanges;
    }());
    var MarkdownController = (function () {
        function MarkdownController($scope, $element, $injector) {
            this.$scope = $scope;
            this.$element = $element;
            this._pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;
        }
        MarkdownController.prototype.$postLink = function () {
            this.bindText(this.text);
            this.$scope.$on('pipWindowResized', function () {
                if (this.bindText)
                    this.bindText(this._text(this._$scope));
            });
            this.$element.addClass('pip-markdown');
        };
        MarkdownController.prototype.$onChanges = function (changes) {
            var newText = changes.text.currentValue;
            if (this.rebind) {
                this.text = newText;
                this.bindText(this.text);
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
            isClamped = this.clamp && _.isNumber(this.clamp);
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
                height = 1.5 * Number(this.clamp);
            }
            this.$element.html('<div' + (isClamped ? this.isList ? 'class="pip-markdown-content ' +
                'pip-markdown-list" style="max-height: ' + height + 'em">' :
                ' class="pip-markdown-content" style="max-height: ' + height + 'em">' : this.isList ?
                ' class="pip-markdown-list">' : '>') + textString + '</div>');
            this.$element.find('a').attr('target', 'blank');
            if (!this.isList && isClamped) {
                this.$element.append('<div class="pip-gradient-block"></div>');
            }
        };
        return MarkdownController;
    }());
    var MarkdownComponent = {
        controller: MarkdownController,
        bindings: MarkdownBindings
    };
    angular.module('pipMarkdown', ['ngSanitize'])
        .run(ConfigTranslations)
        .component('pipMarkdown', MarkdownComponent);
}
},{}],10:[function(require,module,exports){
{
    var PopoverBindings = {
        params: '<pipParams'
    };
    var PopoverController = (function () {
        function PopoverController($scope, $rootScope, $element, $timeout, $compile, $templateRequest) {
            var _this = this;
            this.$scope = $scope;
            this.$timeout = $timeout;
            this.$compile = $compile;
            this.$templateRequest = $templateRequest;
            this.backdropElement = $('.pip-popover-backdrop');
            this.backdropElement.on('click keydown scroll', function () {
                _this.backdropClick();
            });
            this.backdropElement.addClass(this.params.responsive !== false ? 'pip-responsive' : '');
            $timeout(function () {
                _this.position();
                angular.extend($scope, _this.params.locals);
                if (_this.params.template) {
                    _this.content = $compile(_this.params.template)($scope);
                    $element.find('.pip-popover').append(_this.content);
                    _this.init();
                }
                else {
                    _this.$templateRequest(_this.params.templateUrl, false).then(function (html) {
                        _this.content = $compile(html)($scope);
                        $element.find('.pip-popover').append(_this.content);
                        _this.init();
                    });
                }
            });
            $timeout(function () {
                _this.calcHeight();
            }, 200);
            $rootScope.$on('pipPopoverResize', function () {
                _this.onResize();
            });
            $(window).resize(function () {
                _this.onResize();
            });
        }
        PopoverController.prototype.backdropClick = function () {
            if (this.params.cancelCallback) {
                this.params.cancelCallback();
            }
            this.closePopover();
        };
        PopoverController.prototype.closePopover = function () {
            var _this = this;
            this.backdropElement.removeClass('opened');
            this.$timeout(function () {
                _this.backdropElement.remove();
            }, 100);
        };
        PopoverController.prototype.onPopoverClick = function (event) {
            event.stopPropagation();
        };
        PopoverController.prototype.init = function () {
            this.backdropElement.addClass('opened');
            $('.pip-popover-backdrop').focus();
            if (this.params.timeout) {
                this.$timeout(function () {
                    this.closePopover();
                }, this.params.timeout);
            }
        };
        PopoverController.prototype.position = function () {
            if (this.params.element) {
                var element = $(this.params.element), pos = element.offset(), width = element.width(), height = element.height(), docWidth = $(document).width(), docHeight = $(document).height(), popover = this.backdropElement.find('.pip-popover');
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
            if (this.params.calcHeight === false) {
                return;
            }
            var popover = this.backdropElement.find('.pip-popover'), title = popover.find('.pip-title'), footer = popover.find('.pip-footer'), content = popover.find('.pip-content'), contentHeight = popover.height() - title.outerHeight(true) - footer.outerHeight(true);
            content.css('max-height', Math.max(contentHeight, 0) + 'px').css('box-sizing', 'border-box');
        };
        return PopoverController;
    }());
    var Popover = {
        bindings: PopoverBindings,
        templateUrl: 'popover/popover.html',
        controller: PopoverController
    };
    angular
        .module('pipPopover', ['pipPopover.Service'])
        .component('pipPopover', Popover);
}
},{}],11:[function(require,module,exports){
{
    var PopoverService = (function () {
        PopoverService.$inject = ['$compile', '$rootScope', '$timeout'];
        function PopoverService($compile, $rootScope, $timeout) {
            this.$compile = $compile;
            this.$rootScope = $rootScope;
            this.$timeout = $timeout;
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
            scope = this.$rootScope.$new();
            params = p && _.isObject(p) ? p : {};
            scope.params = params;
            scope.locals = params.locals;
            content = this.$compile(this.popoverTemplate)(scope);
            element.append(content);
        };
        PopoverService.prototype.hide = function () {
            var backdropElement = $('.pip-popover-backdrop');
            backdropElement.removeClass('opened');
            this.$timeout(function () {
                backdropElement.remove();
            }, 100);
        };
        PopoverService.prototype.resize = function () {
            this.$rootScope.$broadcast('pipPopoverResize');
        };
        return PopoverService;
    }());
    angular
        .module('pipPopover.Service', [])
        .service('pipPopoverService', PopoverService);
}
},{}],12:[function(require,module,exports){
{
    var RoutingBindings = {
        showProgress: '&',
        logoUrl: '@'
    };
    var RoutingController = (function () {
        function RoutingController($scope, $element) {
            this.$element = $element;
        }
        RoutingController.prototype.$postLink = function () {
            this._image = this.$element.find('img');
            this.loadProgressImage();
        };
        RoutingController.prototype.loadProgressImage = function () {
            if (this.logoUrl) {
                this._image.attr('src', this.logoUrl);
            }
        };
        return RoutingController;
    }());
    var RoutingProgress = {
        bindings: RoutingBindings,
        templateUrl: 'progress/routingProgress.html',
        controller: RoutingController
    };
    angular
        .module('pipRoutingProgress', ['ngMaterial'])
        .component('pipRoutingProgress', RoutingProgress);
}
},{}],13:[function(require,module,exports){
{
    var ToastController_1 = (function () {
        function ToastController_1($mdToast, toast, $injector) {
            this.$mdToast = $mdToast;
            this.toast = toast;
            this._pipErrorDetailsDialog = $injector.has('pipErrorDetailsDialog') ?
                $injector.get('pipErrorDetailsDialog') : null;
            this.message = toast.message;
            this.actions = toast.actions;
            if (toast.actions.length === 0) {
                this.actionLenght = 0;
            }
            else {
                this.actionLenght = toast.actions.length === 1 ? toast.actions[0].toString().length : null;
            }
            this.showDetails = this._pipErrorDetailsDialog != null;
        }
        ToastController_1.prototype.onDetails = function () {
            this.$mdToast.hide();
            if (this._pipErrorDetailsDialog) {
                this._pipErrorDetailsDialog.show({
                    error: this.toast.error,
                    ok: 'Ok'
                }, angular.noop, angular.noop);
            }
        };
        ToastController_1.prototype.onAction = function (action) {
            this.$mdToast.hide({
                action: action,
                id: this.toast.id,
                message: this.message
            });
        };
        return ToastController_1;
    }());
    var ToastService = (function () {
        ToastService.$inject = ['$rootScope', '$mdToast'];
        function ToastService($rootScope, $mdToast) {
            var _this = this;
            this.$mdToast = $mdToast;
            this.SHOW_TIMEOUT = 20000;
            this.SHOW_TIMEOUT_NOTIFICATIONS = 20000;
            this.toasts = [];
            this.sounds = {};
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
            this.$mdToast.show({
                templateUrl: 'toast/toast.html',
                hideDelay: toast.duration || this.SHOW_TIMEOUT,
                position: 'bottom left',
                controller: ToastController_1,
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
            _.remove(this.toasts, {
                id: id
            });
        };
        ToastService.prototype.getToastById = function (id) {
            return _.find(this.toasts, {
                id: id
            });
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
            this.$mdToast.cancel();
            this.toasts = [];
        };
        ToastService.prototype.clearToasts = function (type) {
            if (type) {
                this.removeToasts(type);
            }
            else {
                this.$mdToast.cancel();
                this.toasts = [];
            }
        };
        return ToastService;
    }());
    angular
        .module('pipToasts', ['ngMaterial', 'pipControls.Translate'])
        .service('pipToasts', ToastService);
}
},{}],14:[function(require,module,exports){
(function(module) {
try {
  module = angular.module('pipControls.Templates');
} catch (e) {
  module = angular.module('pipControls.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('color_picker/colorPicker.html',
    '<ul class="pip-color-picker {{$ctrl.class}}" pip-selected="$ctrl.currentColorIndex" pip-enter-space-press="$ctrl.enterSpacePress($event)">\n' +
    '    <li tabindex="-1" ng-repeat="color in $ctrl.colors track by color">\n' +
    '        <md-button  tabindex="-1" class="md-icon-button pip-selectable" ng-click="$ctrl.selectColor($index)" \n' +
    '                aria-label="color" ng-disabled="$ctrl.ngDisabled">\n' +
    '            <md-icon ng-style="{\'color\': color}" md-svg-icon="icons:{{ color == $ctrl.currentColor ? \'circle\' : \'radio-off\' }}">\n' +
    '            </md-icon>\n' +
    '        </md-button>\n' +
    '    </li>\n' +
    '</ul>\n' +
    '');
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
    '<div class=\'pip-popover\' ng-click="$ctrl.params.onPopoverClick($event)">\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('pipControls.Templates');
} catch (e) {
  module = angular.module('pipControls.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('progress/routingProgress.html',
    '<div class="layout-column layout-align-center-center" ng-show="$ctrl.showProgress()">\n' +
    '    <div class="loader">\n' +
    '        <svg class="circular" viewBox="25 25 50 50">\n' +
    '            <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/>\n' +
    '        </svg>\n' +
    '    </div>\n' +
    '    <img src=""  height="40" width="40" class="pip-img">\n' +
    '    <md-progress-circular md-diameter="96" class="fix-ie"></md-progress-circular>\n' +
    '</div>\n' +
    '');
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
    '<md-toast class="md-action pip-toast"\n' +
    '          ng-class="{\'pip-error\': vm.toast.type==\'error\',\n' +
    '          \'pip-column-toast\': vm.toast.actions.length > 1 || vm.actionLenght > 4,\n' +
    '          \'pip-no-action-toast\': vm.actionLenght == 0}"\n' +
    '          style="height:initial; max-height: initial; ">\n' +
    '\n' +
    '    <span class="flex-var pip-text" ng-bind-html="vm.message"></span>\n' +
    '    <div class="layout-row layout-align-end-start pip-actions" ng-if="vm.actions.length > 0 || (vm.toast.type==\'error\' && vm.toast.error)">\n' +
    '        <div class="flex" ng-if="vm.toast.actions.length > 1"> </div>\n' +
    '            <md-button class="flex-fixed pip-toast-button" ng-if="vm.toast.type==\'error\' && vm.toast.error && vm.showDetails" ng-click="vm.onDetails()">Details</md-button>\n' +
    '            <md-button class="flex-fixed pip-toast-button"\n' +
    '                    ng-click="vm.onAction(action)"\n' +
    '                    ng-repeat="action in vm.actions"\n' +
    '                    aria-label="{{::action| translate}}">\n' +
    '                {{::action| translate}}\n' +
    '            </md-button>\n' +
    '       \n' +
    '    </div>\n' +
    '\n' +
    '</md-toast>');
}]);
})();



},{}]},{},[14,1,2,3,4,5,6,7,8,9,10,11,12,13])(14)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29sb3JfcGlja2VyL2NvbG9yUGlja2VyLnRzIiwic3JjL2NvbnRyb2xzLnRzIiwic3JjL2RlcGVuZGVuY2llcy90cmFuc2xhdGUudHMiLCJzcmMvaW1hZ2Vfc2xpZGVyL2ltYWdlU2xpZGVyLnRzIiwic3JjL2ltYWdlX3NsaWRlci9pbWFnZVNsaWRlclNlcnZpY2UudHMiLCJzcmMvaW1hZ2Vfc2xpZGVyL3NsaWRlckJ1dHRvbi50cyIsInNyYy9pbWFnZV9zbGlkZXIvc2xpZGVySW5kaWNhdG9yLnRzIiwic3JjL21hcmtkb3duL21hcmtkb3duLnRzIiwic3JjL3BvcG92ZXIvcG9wb3Zlci50cyIsInNyYy9wb3BvdmVyL3BvcG92ZXJTZXJ2aWNlLnRzIiwic3JjL3Byb2dyZXNzL3JvdXRpbmdQcm9ncmVzcy50cyIsInNyYy90b2FzdC90b2FzdHMudHMiLCJ0ZW1wL3BpcC13ZWJ1aS1jb250cm9scy1odG1sLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsQ0FBQztJQWNHLElBQU0sbUJBQW1CLEdBQXlCO1FBQzlDLFVBQVUsRUFBRSxjQUFjO1FBQzFCLE1BQU0sRUFBRSxZQUFZO1FBQ3BCLFlBQVksRUFBRSxVQUFVO1FBQ3hCLFdBQVcsRUFBRSxZQUFZO0tBQzVCLENBQUE7SUFFRDtRQUFBO1FBUUEsQ0FBQztRQUFELHlCQUFDO0lBQUQsQ0FSQSxBQVFDLElBQUE7SUFFRCxJQUFNLGdCQUFjLEdBQUcsQ0FBQyxRQUFRLEVBQUUsWUFBWSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUU5RjtRQVFJLCtCQUNZLE1BQWlCLEVBQ2pCLFFBQWdCLEVBQ3hCLE1BQThCLEVBQ3RCLFFBQTRCO1lBSDVCLFdBQU0sR0FBTixNQUFNLENBQVc7WUFDakIsYUFBUSxHQUFSLFFBQVEsQ0FBUTtZQUVoQixh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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ7XHJcbiAgICBpbnRlcmZhY2UgSUNvbG9yUGlja2VyQmluZGluZ3Mge1xyXG4gICAgICAgIFtrZXk6IHN0cmluZ106IGFueTtcclxuXHJcbiAgICAgICAgbmdEaXNhYmxlZDogYW55O1xyXG4gICAgICAgIGNvbG9yczogYW55O1xyXG4gICAgICAgIGN1cnJlbnRDb2xvcjogYW55O1xyXG4gICAgICAgIGNvbG9yQ2hhbmdlOiBhbnk7XHJcbiAgICB9XHJcblxyXG4gICAgaW50ZXJmYWNlIElDb2xvclBpY2tlckF0dHJpYnV0ZXMgZXh0ZW5kcyBuZy5JQXR0cmlidXRlcyB7XHJcbiAgICAgICAgY2xhc3M6IHN0cmluZztcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBDb2xvclBpY2tlckJpbmRpbmdzOiBJQ29sb3JQaWNrZXJCaW5kaW5ncyA9IHtcclxuICAgICAgICBuZ0Rpc2FibGVkOiAnPD9uZ0Rpc2FibGVkJyxcclxuICAgICAgICBjb2xvcnM6ICc8cGlwQ29sb3JzJyxcclxuICAgICAgICBjdXJyZW50Q29sb3I6ICc9bmdNb2RlbCcsXHJcbiAgICAgICAgY29sb3JDaGFuZ2U6ICcmP25nQ2hhbmdlJ1xyXG4gICAgfVxyXG5cclxuICAgIGNsYXNzIENvbG9yUGlja2VyQ2hhbmdlcyBpbXBsZW1lbnRzIG5nLklPbkNoYW5nZXNPYmplY3QsIElDb2xvclBpY2tlckJpbmRpbmdzIHtcclxuICAgICAgICBba2V5OiBzdHJpbmddOiBuZy5JQ2hhbmdlc09iamVjdCA8IGFueSA+IDtcclxuXHJcbiAgICAgICAgY29sb3JDaGFuZ2U6IG5nLklDaGFuZ2VzT2JqZWN0IDwgKCkgPT4gbmcuSVByb21pc2UgPCBhbnkgPj4gO1xyXG4gICAgICAgIGN1cnJlbnRDb2xvcjogYW55O1xyXG5cclxuICAgICAgICBuZ0Rpc2FibGVkOiBuZy5JQ2hhbmdlc09iamVjdCA8IGJvb2xlYW4gPiA7XHJcbiAgICAgICAgY29sb3JzOiBuZy5JQ2hhbmdlc09iamVjdCA8IHN0cmluZ1tdID4gO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IERFRkFVTFRfQ09MT1JTID0gWydwdXJwbGUnLCAnbGlnaHRncmVlbicsICdncmVlbicsICdkYXJrcmVkJywgJ3BpbmsnLCAneWVsbG93JywgJ2N5YW4nXTtcclxuXHJcbiAgICBjbGFzcyBDb2xvclBpY2tlckNvbnRyb2xsZXIgaW1wbGVtZW50cyBJQ29sb3JQaWNrZXJCaW5kaW5ncyB7XHJcbiAgICAgICAgcHVibGljIGNsYXNzOiBzdHJpbmc7XHJcbiAgICAgICAgcHVibGljIGNvbG9yczogc3RyaW5nW107XHJcbiAgICAgICAgcHVibGljIGN1cnJlbnRDb2xvcjogc3RyaW5nO1xyXG4gICAgICAgIHB1YmxpYyBjdXJyZW50Q29sb3JJbmRleDogbnVtYmVyO1xyXG4gICAgICAgIHB1YmxpYyBuZ0Rpc2FibGVkOiBib29sZWFuO1xyXG4gICAgICAgIHB1YmxpYyBjb2xvckNoYW5nZTogRnVuY3Rpb247XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgICAgICBwcml2YXRlICRzY29wZTogbmcuSVNjb3BlLFxyXG4gICAgICAgICAgICBwcml2YXRlICRlbGVtZW50OiBKUXVlcnksXHJcbiAgICAgICAgICAgICRhdHRyczogSUNvbG9yUGlja2VyQXR0cmlidXRlcyxcclxuICAgICAgICAgICAgcHJpdmF0ZSAkdGltZW91dDogbmcuSVRpbWVvdXRTZXJ2aWNlXHJcbiAgICAgICAgKSB7IFxyXG4gICAgICAgICAgICB0aGlzLmNsYXNzID0gJGF0dHJzLmNsYXNzIHx8ICcnOyBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyAkb25DaGFuZ2VzKGNoYW5nZXM6IENvbG9yUGlja2VyQ2hhbmdlcykge1xyXG4gICAgICAgICAgICB0aGlzLmNvbG9ycyA9IGNoYW5nZXMuY29sb3JzICYmIF8uaXNBcnJheShjaGFuZ2VzLmNvbG9ycy5jdXJyZW50VmFsdWUpICYmIGNoYW5nZXMuY29sb3JzLmN1cnJlbnRWYWx1ZS5sZW5ndGggIT09IDAgP1xyXG4gICAgICAgICAgICAgICAgY2hhbmdlcy5jb2xvcnMuY3VycmVudFZhbHVlIDogREVGQVVMVF9DT0xPUlM7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudENvbG9yID0gdGhpcy5jdXJyZW50Q29sb3IgfHwgdGhpcy5jb2xvcnNbMF07XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudENvbG9ySW5kZXggPSB0aGlzLmNvbG9ycy5pbmRleE9mKHRoaXMuY3VycmVudENvbG9yKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMubmdEaXNhYmxlZCA9IGNoYW5nZXMubmdEaXNhYmxlZC5jdXJyZW50VmFsdWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc2VsZWN0Q29sb3IoaW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5uZ0Rpc2FibGVkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50Q29sb3JJbmRleCA9IGluZGV4O1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRDb2xvciA9IHRoaXMuY29sb3JzW3RoaXMuY3VycmVudENvbG9ySW5kZXhdO1xyXG4gICAgICAgICAgICB0aGlzLiR0aW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuJHNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbG9yQ2hhbmdlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbG9yQ2hhbmdlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBwdWJsaWMgZW50ZXJTcGFjZVByZXNzKGV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0Q29sb3IoZXZlbnQuaW5kZXgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHBpcENvbG9yUGlja2VyOiBuZy5JQ29tcG9uZW50T3B0aW9ucyA9IHtcclxuICAgICAgICBiaW5kaW5nczogQ29sb3JQaWNrZXJCaW5kaW5ncyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbG9yX3BpY2tlci9jb2xvclBpY2tlci5odG1sJyxcclxuICAgICAgICBjb250cm9sbGVyOiBDb2xvclBpY2tlckNvbnRyb2xsZXJcclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncGlwQ29sb3JQaWNrZXInLCBbJ3BpcENvbnRyb2xzLlRlbXBsYXRlcyddKVxyXG4gICAgICAgIC5jb21wb25lbnQoJ3BpcENvbG9yUGlja2VyJywgcGlwQ29sb3JQaWNrZXIpO1xyXG5cclxufSIsIu+7vy8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi90eXBpbmdzL3RzZC5kLnRzXCIgLz5cclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdwaXBDb250cm9scycsIFtcclxuICAgICdwaXBNYXJrZG93bicsXHJcbiAgICAncGlwQ29sb3JQaWNrZXInLFxyXG4gICAgJ3BpcFJvdXRpbmdQcm9ncmVzcycsXHJcbiAgICAncGlwUG9wb3ZlcicsXHJcbiAgICAncGlwSW1hZ2VTbGlkZXInLFxyXG4gICAgJ3BpcFRvYXN0cycsXHJcbiAgICAncGlwQ29udHJvbHMuVHJhbnNsYXRlJ1xyXG5dKTsiLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vdHlwaW5ncy90c2QuZC50c1wiIC8+XHJcblxyXG57XHJcblxyXG4gICAgZnVuY3Rpb24gdHJhbnNsYXRlQ29udHJvbHMoJGluamVjdG9yOiBuZy5hdXRvLklJbmplY3RvclNlcnZpY2UpIHtcclxuICAgICAgICBjb25zdCBwaXBUcmFuc2xhdGUgPSAkaW5qZWN0b3IuaGFzKCdwaXBUcmFuc2xhdGUnKSA/ICRpbmplY3Rvci5nZXQoJ3BpcFRyYW5zbGF0ZScpIDogbnVsbDtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChrZXk6IHN0cmluZykge1xyXG4gICAgICAgICAgICByZXR1cm4gcGlwVHJhbnNsYXRlID8gcGlwVHJhbnNsYXRlWyd0cmFuc2xhdGUnXShrZXkpIHx8IGtleSA6IGtleTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ3BpcENvbnRyb2xzLlRyYW5zbGF0ZScsIFtdKVxyXG4gICAgICAgIC5maWx0ZXIoJ3RyYW5zbGF0ZScsIHRyYW5zbGF0ZUNvbnRyb2xzKTtcclxuXHJcbn1cclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxyXG5cclxuaW1wb3J0IHsgSUltYWdlU2xpZGVyU2VydmljZSB9IGZyb20gJy4vSUltYWdlU2xpZGVyU2VydmljZSc7XHJcblxyXG57XHJcbiAgICBjbGFzcyBwaXBJbWFnZVNsaWRlckNvbnRyb2xsZXIgaW1wbGVtZW50cyBuZy5JQ29udHJvbGxlciB7XHJcbiAgICAgICAgcHJpdmF0ZSBfYmxvY2tzOiBhbnlbXTtcclxuICAgICAgICBwcml2YXRlIF9pbmRleDogbnVtYmVyID0gMDtcclxuICAgICAgICBwcml2YXRlIF9uZXdJbmRleDogbnVtYmVyO1xyXG4gICAgICAgIHByaXZhdGUgX2RpcmVjdGlvbjogc3RyaW5nO1xyXG4gICAgICAgIHByaXZhdGUgX3R5cGU6IHN0cmluZztcclxuICAgICAgICBwcml2YXRlIERFRkFVTFRfSU5URVJWQUw6bnVtYmVyID0gNDUwMDtcclxuICAgICAgICBwcml2YXRlIF9pbnRlcnZhbDogbnVtYmVyIHwgc3RyaW5nO1xyXG4gICAgICAgIHByaXZhdGUgX3RpbWVQcm9taXNlcztcclxuICAgICAgICBwcml2YXRlIF90aHJvdHRsZWQ6IEZ1bmN0aW9uO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3dpcGVTdGFydDogbnVtYmVyID0gMDtcclxuICAgICAgICBwdWJsaWMgc2xpZGVySW5kZXg6IG51bWJlcjtcclxuICAgICAgICBwdWJsaWMgc2xpZGVUbzogRnVuY3Rpb247XHJcbiAgICAgICAgcHVibGljIHR5cGU6IEZ1bmN0aW9uO1xyXG4gICAgICAgIHB1YmxpYyBpbnRlcnZhbDogRnVuY3Rpb247XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgICAgICBwcml2YXRlICRzY29wZTogbmcuSVNjb3BlLFxyXG4gICAgICAgICAgICBwcml2YXRlICRlbGVtZW50OiBKUXVlcnksXHJcbiAgICAgICAgICAgIHByaXZhdGUgJGF0dHJzLFxyXG4gICAgICAgICAgICBwcml2YXRlICRwYXJzZTogbmcuSVBhcnNlU2VydmljZSxcclxuICAgICAgICAgICAgcHJpdmF0ZSAkdGltZW91dDogYW5ndWxhci5JVGltZW91dFNlcnZpY2UsXHJcbiAgICAgICAgICAgIHByaXZhdGUgJGludGVydmFsOiBhbmd1bGFyLklJbnRlcnZhbFNlcnZpY2UsXHJcbiAgICAgICAgICAgIHByaXZhdGUgcGlwSW1hZ2VTbGlkZXI6IElJbWFnZVNsaWRlclNlcnZpY2VcclxuICAgICAgICApIHtcclxuXHJcbiAgICAgICAgICAgIC8vdGhpcy5zbGlkZXJJbmRleCA9ICRzY29wZVsndm0nXVsnc2xpZGVySW5kZXgnXTtcclxuICAgICAgICAgICAgdGhpcy5fdHlwZSA9IHRoaXMudHlwZSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9pbnRlcnZhbCA9IHRoaXMuaW50ZXJ2YWwoKTtcclxuICAgICAgICAgICAgdGhpcy5zbGlkZVRvID0gdGhpcy5zbGlkZVRvUHJpdmF0ZTtcclxuXHJcbiAgICAgICAgICAgICRlbGVtZW50LmFkZENsYXNzKCdwaXAtaW1hZ2Utc2xpZGVyJyk7XHJcbiAgICAgICAgICAgICRlbGVtZW50LmFkZENsYXNzKCdwaXAtYW5pbWF0aW9uLScgKyB0aGlzLl90eXBlKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc2V0SW5kZXgoKTtcclxuXHJcbiAgICAgICAgICAgICR0aW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2Jsb2NrcyA9IDxhbnk+JGVsZW1lbnQuZmluZCgnLnBpcC1hbmltYXRpb24tYmxvY2snKTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9ibG9ja3MubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcy5fYmxvY2tzWzBdKS5hZGRDbGFzcygncGlwLXNob3cnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnN0YXJ0SW50ZXJ2YWwoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3Rocm90dGxlZCA9IF8udGhyb3R0bGUoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcGlwSW1hZ2VTbGlkZXIudG9CbG9jayh0aGlzLl90eXBlLCB0aGlzLl9ibG9ja3MsIHRoaXMuX2luZGV4LCB0aGlzLl9uZXdJbmRleCwgdGhpcy5fZGlyZWN0aW9uKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2luZGV4ID0gdGhpcy5fbmV3SW5kZXg7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldEluZGV4KCk7XHJcbiAgICAgICAgICAgIH0sIDcwMCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoJGF0dHJzLmlkKSB7XHJcbiAgICAgICAgICAgICAgICBwaXBJbWFnZVNsaWRlci5yZWdpc3RlclNsaWRlcigkYXR0cnMuaWQsICRzY29wZSlcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLiRvbignJGRlc3Ryb3knLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3BJbnRlcnZhbCgpO1xyXG4gICAgICAgICAgICAgICAgcGlwSW1hZ2VTbGlkZXIucmVtb3ZlU2xpZGVyKCRhdHRycy5pZCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBuZXh0QmxvY2soKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVzdGFydEludGVydmFsKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX25ld0luZGV4ID0gdGhpcy5faW5kZXggKyAxID09PSB0aGlzLl9ibG9ja3MubGVuZ3RoID8gMCA6IHRoaXMuX2luZGV4ICsgMTtcclxuICAgICAgICAgICAgdGhpcy5fZGlyZWN0aW9uID0gJ25leHQnO1xyXG4gICAgICAgICAgICB0aGlzLl90aHJvdHRsZWQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBwcmV2QmxvY2soKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVzdGFydEludGVydmFsKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX25ld0luZGV4ID0gdGhpcy5faW5kZXggLSAxIDwgMCA/IHRoaXMuX2Jsb2Nrcy5sZW5ndGggLSAxIDogdGhpcy5faW5kZXggLSAxO1xyXG4gICAgICAgICAgICB0aGlzLl9kaXJlY3Rpb24gPSAncHJldic7XHJcbiAgICAgICAgICAgIHRoaXMuX3Rocm90dGxlZCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzbGlkZVRvUHJpdmF0ZShuZXh0SW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgICAgICBpZiAobmV4dEluZGV4ID09PSB0aGlzLl9pbmRleCB8fCBuZXh0SW5kZXggPiB0aGlzLl9ibG9ja3MubGVuZ3RoIC0gMSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLnJlc3RhcnRJbnRlcnZhbCgpO1xyXG4gICAgICAgICAgICB0aGlzLl9uZXdJbmRleCA9IG5leHRJbmRleDtcclxuICAgICAgICAgICAgdGhpcy5fZGlyZWN0aW9uID0gbmV4dEluZGV4ID4gdGhpcy5faW5kZXggPyAnbmV4dCcgOiAncHJldic7XHJcbiAgICAgICAgICAgIHRoaXMuX3Rocm90dGxlZCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzZXRJbmRleCgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuJGF0dHJzLnBpcEltYWdlSW5kZXgpIHRoaXMuc2xpZGVySW5kZXggPSB0aGlzLl9pbmRleDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgc3RhcnRJbnRlcnZhbCgpIHtcclxuICAgICAgICAgICAgdGhpcy5fdGltZVByb21pc2VzID0gdGhpcy4kaW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbmV3SW5kZXggPSB0aGlzLl9pbmRleCArIDEgPT09IHRoaXMuX2Jsb2Nrcy5sZW5ndGggPyAwIDogdGhpcy5faW5kZXggKyAxO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZGlyZWN0aW9uID0gJ25leHQnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdGhyb3R0bGVkKCk7XHJcbiAgICAgICAgICAgIH0sIE51bWJlcih0aGlzLl9pbnRlcnZhbCB8fCB0aGlzLkRFRkFVTFRfSU5URVJWQUwpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgc3RvcEludGVydmFsKCkge1xyXG4gICAgICAgICAgICB0aGlzLiRpbnRlcnZhbC5jYW5jZWwodGhpcy5fdGltZVByb21pc2VzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgcmVzdGFydEludGVydmFsKCkge1xyXG4gICAgICAgICAgICB0aGlzLnN0b3BJbnRlcnZhbCgpO1xyXG4gICAgICAgICAgICB0aGlzLnN0YXJ0SW50ZXJ2YWwoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgSW1hZ2VTbGlkZXIgPSBmdW5jdGlvbigpOiBuZy5JRGlyZWN0aXZlIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBzY29wZToge1xyXG4gICAgICAgICAgICAgICAgc2xpZGVySW5kZXg6ICc9cGlwSW1hZ2VJbmRleCcsXHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnJnBpcEFuaW1hdGlvblR5cGUnLFxyXG4gICAgICAgICAgICAgICAgaW50ZXJ2YWw6ICcmcGlwQW5pbWF0aW9uSW50ZXJ2YWwnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IHBpcEltYWdlU2xpZGVyQ29udHJvbGxlcixcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncGlwSW1hZ2VTbGlkZXInLCBbJ3BpcFNsaWRlckJ1dHRvbicsICdwaXBTbGlkZXJJbmRpY2F0b3InLCAncGlwSW1hZ2VTbGlkZXIuU2VydmljZSddKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ3BpcEltYWdlU2xpZGVyJywgSW1hZ2VTbGlkZXIpO1xyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxyXG5cclxuaW1wb3J0IHsgSUltYWdlU2xpZGVyU2VydmljZSB9IGZyb20gJy4vSUltYWdlU2xpZGVyU2VydmljZSc7XHJcblxyXG57XHJcbiAgICBjbGFzcyBJbWFnZVNsaWRlclNlcnZpY2UgaW1wbGVtZW50cyBJSW1hZ2VTbGlkZXJTZXJ2aWNlIHtcclxuICAgICAgICBwcml2YXRlIEFOSU1BVElPTl9EVVJBVElPTjogbnVtYmVyID0gNTUwO1xyXG4gICAgICAgIHByaXZhdGUgX3NsaWRlcnM6IE9iamVjdCA9IHt9O1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICAgICAgcHJpdmF0ZSAkdGltZW91dDogYW5ndWxhci5JVGltZW91dFNlcnZpY2VcclxuICAgICAgICApIHt9XHJcblxyXG4gICAgICAgIHB1YmxpYyByZWdpc3RlclNsaWRlcihzbGlkZXJJZDogc3RyaW5nLCBzbGlkZXJTY29wZTogbmcuSVNjb3BlKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX3NsaWRlcnNbc2xpZGVySWRdID0gc2xpZGVyU2NvcGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgcmVtb3ZlU2xpZGVyKHNsaWRlcklkOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX3NsaWRlcnNbc2xpZGVySWRdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGdldFNsaWRlclNjb3BlKHNsaWRlcklkOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NsaWRlcnNbc2xpZGVySWRdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIG5leHRDYXJvdXNlbChuZXh0QmxvY2s6IEpRdWVyeSwgcHJldkJsb2NrOiBKUXVlcnkpOiB2b2lkIHtcclxuICAgICAgICAgICAgbmV4dEJsb2NrLmFkZENsYXNzKCdwaXAtbmV4dCcpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy4kdGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBuZXh0QmxvY2suYWRkQ2xhc3MoJ2FuaW1hdGVkJykuYWRkQ2xhc3MoJ3BpcC1zaG93JykucmVtb3ZlQ2xhc3MoJ3BpcC1uZXh0Jyk7XHJcbiAgICAgICAgICAgICAgICBwcmV2QmxvY2suYWRkQ2xhc3MoJ2FuaW1hdGVkJykucmVtb3ZlQ2xhc3MoJ3BpcC1zaG93Jyk7XHJcbiAgICAgICAgICAgIH0sIDEwMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgcHJldkNhcm91c2VsKG5leHRCbG9jazogSlF1ZXJ5LCBwcmV2QmxvY2s6IEpRdWVyeSk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLiR0aW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIG5leHRCbG9jay5hZGRDbGFzcygnYW5pbWF0ZWQnKS5hZGRDbGFzcygncGlwLXNob3cnKTtcclxuICAgICAgICAgICAgICAgIHByZXZCbG9jay5hZGRDbGFzcygnYW5pbWF0ZWQnKS5hZGRDbGFzcygncGlwLW5leHQnKS5yZW1vdmVDbGFzcygncGlwLXNob3cnKTtcclxuICAgICAgICAgICAgfSwgMTAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB0b0Jsb2NrKHR5cGU6IHN0cmluZywgYmxvY2tzOiBhbnlbXSwgb2xkSW5kZXg6IG51bWJlciwgbmV4dEluZGV4OiBudW1iZXIsIGRpcmVjdGlvbjogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGNvbnN0IHByZXZCbG9jayA9ICQoYmxvY2tzW29sZEluZGV4XSksXHJcbiAgICAgICAgICAgICAgICBibG9ja0luZGV4ID0gbmV4dEluZGV4LFxyXG4gICAgICAgICAgICAgICAgbmV4dEJsb2NrID0gJChibG9ja3NbYmxvY2tJbmRleF0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKHR5cGUgPT09ICdjYXJvdXNlbCcpIHtcclxuICAgICAgICAgICAgICAgICQoYmxvY2tzKS5yZW1vdmVDbGFzcygncGlwLW5leHQnKS5yZW1vdmVDbGFzcygncGlwLXByZXYnKS5yZW1vdmVDbGFzcygnYW5pbWF0ZWQnKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZGlyZWN0aW9uICYmIChkaXJlY3Rpb24gPT09ICdwcmV2JyB8fCBkaXJlY3Rpb24gPT09ICduZXh0JykpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGlyZWN0aW9uID09PSAncHJldicpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmV2Q2Fyb3VzZWwobmV4dEJsb2NrLCBwcmV2QmxvY2spO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dENhcm91c2VsKG5leHRCbG9jaywgcHJldkJsb2NrKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXh0SW5kZXggJiYgbmV4dEluZGV4IDwgb2xkSW5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmV2Q2Fyb3VzZWwobmV4dEJsb2NrLCBwcmV2QmxvY2spO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dENhcm91c2VsKG5leHRCbG9jaywgcHJldkJsb2NrKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBwcmV2QmxvY2suYWRkQ2xhc3MoJ2FuaW1hdGVkJykucmVtb3ZlQ2xhc3MoJ3BpcC1zaG93Jyk7XHJcbiAgICAgICAgICAgICAgICBuZXh0QmxvY2suYWRkQ2xhc3MoJ2FuaW1hdGVkJykuYWRkQ2xhc3MoJ3BpcC1zaG93Jyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3BpcEltYWdlU2xpZGVyLlNlcnZpY2UnLCBbXSlcclxuICAgICAgICAuc2VydmljZSgncGlwSW1hZ2VTbGlkZXInLCBJbWFnZVNsaWRlclNlcnZpY2UpO1xyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxyXG5cclxuaW1wb3J0IHtcclxuICAgIElJbWFnZVNsaWRlclNlcnZpY2VcclxufSBmcm9tICcuL0lJbWFnZVNsaWRlclNlcnZpY2UnO1xyXG5cclxue1xyXG4gICAgY2xhc3MgU2xpZGVyQnV0dG9uQ29udHJvbGxlciBpbXBsZW1lbnRzIG5nLklDb250cm9sbGVyIHtcclxuICAgICAgICBwdWJsaWMgZGlyZWN0aW9uOiBGdW5jdGlvbjtcclxuICAgICAgICBwdWJsaWMgc2xpZGVySWQ6IEZ1bmN0aW9uO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICAgICAgJGVsZW1lbnQ6IEpRdWVyeSxcclxuICAgICAgICAgICAgcGlwSW1hZ2VTbGlkZXI6IElJbWFnZVNsaWRlclNlcnZpY2VcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgJGVsZW1lbnQub24oJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnNsaWRlcklkKCkgfHwgIXRoaXMuZGlyZWN0aW9uKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcGlwSW1hZ2VTbGlkZXIuZ2V0U2xpZGVyU2NvcGUodGhpcy5zbGlkZXJJZCgpKS52bVt0aGlzLmRpcmVjdGlvbigpICsgJ0Jsb2NrJ10oKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IFNsaWRlckJ1dHRvbiA9IGZ1bmN0aW9uICgpOiBuZy5JRGlyZWN0aXZlIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBzY29wZToge1xyXG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uOiAnJnBpcEJ1dHRvblR5cGUnLFxyXG4gICAgICAgICAgICAgICAgc2xpZGVySWQ6ICcmcGlwU2xpZGVySWQnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJyRjdGxyJyxcclxuICAgICAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZSxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogU2xpZGVyQnV0dG9uQ29udHJvbGxlclxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ3BpcFNsaWRlckJ1dHRvbicsIFtdKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ3BpcFNsaWRlckJ1dHRvbicsIFNsaWRlckJ1dHRvbik7XHJcblxyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxyXG5cclxuaW1wb3J0IHtcclxuICAgIElJbWFnZVNsaWRlclNlcnZpY2VcclxufSBmcm9tICcuL0lJbWFnZVNsaWRlclNlcnZpY2UnO1xyXG5cclxue1xyXG4gICAgY2xhc3MgU2xpZGVySW5kaWNhdG9yQ29udHJvbGxlciBpbXBsZW1lbnRzIG5nLklDb250cm9sbGVyIHtcclxuICAgICAgICBwdWJsaWMgc2xpZGVUbzogRnVuY3Rpb247XHJcbiAgICAgICAgcHVibGljIHNsaWRlcklkOiBGdW5jdGlvbjtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgICAgICRlbGVtZW50OiBKUXVlcnksXHJcbiAgICAgICAgICAgIHBpcEltYWdlU2xpZGVyOiBJSW1hZ2VTbGlkZXJTZXJ2aWNlXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICRlbGVtZW50LmNzcygnY3Vyc29yJywgJ3BvaW50ZXInKTtcclxuICAgICAgICAgICAgJGVsZW1lbnQub24oJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnNsaWRlcklkKCkgfHwgdGhpcy5zbGlkZVRvKCkgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBwaXBJbWFnZVNsaWRlci5nZXRTbGlkZXJTY29wZSh0aGlzLnNsaWRlcklkKCkpLnZtLnNsaWRlVG8odGhpcy5zbGlkZVRvKCkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgU2xpZGVySW5kaWNhdG9yID0gZnVuY3Rpb24gKCk6IG5nLklEaXJlY3RpdmUge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHNjb3BlOiB7XHJcbiAgICAgICAgICAgICAgICBzbGlkZVRvOiAnJnBpcFNsaWRlVG8nLFxyXG4gICAgICAgICAgICAgICAgc2xpZGVySWQ6ICcmcGlwU2xpZGVySWQnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJyRjdGxyJyxcclxuICAgICAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZSxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogU2xpZGVySW5kaWNhdG9yQ29udHJvbGxlclxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgncGlwU2xpZGVySW5kaWNhdG9yJywgW10pXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgncGlwU2xpZGVySW5kaWNhdG9yJywgU2xpZGVySW5kaWNhdG9yKTtcclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi90eXBpbmdzL3RzZC5kLnRzXCIgLz5cclxuXHJcbmRlY2xhcmUgdmFyIG1hcmtlZDogYW55O1xyXG5cclxue1xyXG4gICAgZnVuY3Rpb24gQ29uZmlnVHJhbnNsYXRpb25zKCRpbmplY3RvcjogbmcuYXV0by5JSW5qZWN0b3JTZXJ2aWNlKSB7XHJcbiAgICAgICAgY29uc3QgcGlwVHJhbnNsYXRlID0gJGluamVjdG9yLmhhcygncGlwVHJhbnNsYXRlJykgPyAkaW5qZWN0b3IuZ2V0KCdwaXBUcmFuc2xhdGUnKSA6IG51bGw7XHJcblxyXG4gICAgICAgIGlmIChwaXBUcmFuc2xhdGUpIHtcclxuICAgICAgICAgICAgKDxhbnk+cGlwVHJhbnNsYXRlKS5zZXRUcmFuc2xhdGlvbnMoJ2VuJywge1xyXG4gICAgICAgICAgICAgICAgJ01BUktET1dOX0FUVEFDSE1FTlRTJzogJ0F0dGFjaG1lbnRzOicsXHJcbiAgICAgICAgICAgICAgICAnY2hlY2tsaXN0JzogJ0NoZWNrbGlzdCcsXHJcbiAgICAgICAgICAgICAgICAnZG9jdW1lbnRzJzogJ0RvY3VtZW50cycsXHJcbiAgICAgICAgICAgICAgICAncGljdHVyZXMnOiAnUGljdHVyZXMnLFxyXG4gICAgICAgICAgICAgICAgJ2xvY2F0aW9uJzogJ0xvY2F0aW9uJyxcclxuICAgICAgICAgICAgICAgICd0aW1lJzogJ1RpbWUnXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAoPGFueT5waXBUcmFuc2xhdGUpLnNldFRyYW5zbGF0aW9ucygncnUnLCB7XHJcbiAgICAgICAgICAgICAgICAnTUFSS0RPV05fQVRUQUNITUVOVFMnOiAn0JLQu9C+0LbQtdC90LjRjzonLFxyXG4gICAgICAgICAgICAgICAgJ2NoZWNrbGlzdCc6ICfQodC/0LjRgdC+0LonLFxyXG4gICAgICAgICAgICAgICAgJ2RvY3VtZW50cyc6ICfQlNC+0LrRg9C80LXQvdGC0YsnLFxyXG4gICAgICAgICAgICAgICAgJ3BpY3R1cmVzJzogJ9CY0LfQvtCx0YDQsNC20LXQvdC40Y8nLFxyXG4gICAgICAgICAgICAgICAgJ2xvY2F0aW9uJzogJ9Cc0LXRgdGC0L7QvdCw0YXQvtC20LTQtdC90LjQtScsXHJcbiAgICAgICAgICAgICAgICAndGltZSc6ICfQktGA0LXQvNGPJ1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW50ZXJmYWNlIElNYXJrZG93bkJpbmRpbmdzIHtcclxuICAgICAgICBba2V5OiBzdHJpbmddOiBhbnk7XHJcblxyXG4gICAgICAgIHRleHQ6IGFueTtcclxuICAgICAgICBpc0xpc3Q6IGFueTtcclxuICAgICAgICBjbGFtcDogYW55O1xyXG4gICAgICAgIHJlYmluZDogYW55O1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IE1hcmtkb3duQmluZGluZ3M6IElNYXJrZG93bkJpbmRpbmdzID0ge1xyXG4gICAgICAgIHRleHQ6ICc8cGlwVGV4dCcsXHJcbiAgICAgICAgaXNMaXN0OiAnPD9waXBMaXN0JyxcclxuICAgICAgICBjbGFtcDogJzw/cGlwTGluZUNvdW50JyxcclxuICAgICAgICByZWJpbmQ6ICc8P3BpcFJlYmluZCdcclxuICAgIH1cclxuXHJcbiAgICBjbGFzcyBNYXJrZG93bkNoYW5nZXMgaW1wbGVtZW50cyBuZy5JT25DaGFuZ2VzT2JqZWN0LCBJTWFya2Rvd25CaW5kaW5ncyB7XHJcbiAgICAgICAgW2tleTogc3RyaW5nXTogbmcuSUNoYW5nZXNPYmplY3QgPCBhbnkgPiA7XHJcblxyXG4gICAgICAgIHRleHQ6IG5nLklDaGFuZ2VzT2JqZWN0IDwgc3RyaW5nID4gO1xyXG4gICAgICAgIGlzTGlzdDogbmcuSUNoYW5nZXNPYmplY3QgPCBib29sZWFuID4gO1xyXG4gICAgICAgIGNsYW1wOiBuZy5JQ2hhbmdlc09iamVjdCA8IG51bWJlciB8IHN0cmluZyA+IDtcclxuICAgICAgICByZWJpbmQ6IG5nLklDaGFuZ2VzT2JqZWN0IDwgYm9vbGVhbiA+IDtcclxuICAgIH1cclxuXHJcbiAgICBjbGFzcyBNYXJrZG93bkNvbnRyb2xsZXIgaW1wbGVtZW50cyBJTWFya2Rvd25CaW5kaW5ncywgbmcuSUNvbnRyb2xsZXIge1xyXG4gICAgICAgIHByaXZhdGUgX3BpcFRyYW5zbGF0ZTtcclxuXHJcbiAgICAgICAgcHVibGljIHRleHQ6IHN0cmluZztcclxuICAgICAgICBwdWJsaWMgaXNMaXN0OiBib29sZWFuO1xyXG4gICAgICAgIHB1YmxpYyBjbGFtcDogc3RyaW5nIHwgbnVtYmVyO1xyXG4gICAgICAgIHB1YmxpYyByZWJpbmQ6IGJvb2xlYW47XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgICAgICBwcml2YXRlICRzY29wZTogYW5ndWxhci5JU2NvcGUsXHJcbiAgICAgICAgICAgIHByaXZhdGUgJGVsZW1lbnQ6IEpRdWVyeSxcclxuICAgICAgICAgICAgJGluamVjdG9yOiBuZy5hdXRvLklJbmplY3RvclNlcnZpY2VcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgdGhpcy5fcGlwVHJhbnNsYXRlID0gJGluamVjdG9yLmhhcygncGlwVHJhbnNsYXRlJykgPyAkaW5qZWN0b3IuZ2V0KCdwaXBUcmFuc2xhdGUnKSA6IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgJHBvc3RMaW5rKCkge1xyXG4gICAgICAgICAgICAvLyBGaWxsIHRoZSB0ZXh0XHJcbiAgICAgICAgICAgIHRoaXMuYmluZFRleHQodGhpcy50ZXh0KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuJHNjb3BlLiRvbigncGlwV2luZG93UmVzaXplZCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmJpbmRUZXh0KSB0aGlzLmJpbmRUZXh0KHRoaXMuX3RleHQodGhpcy5fJHNjb3BlKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gQWRkIGNsYXNzXHJcbiAgICAgICAgICAgIHRoaXMuJGVsZW1lbnQuYWRkQ2xhc3MoJ3BpcC1tYXJrZG93bicpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyAkb25DaGFuZ2VzKGNoYW5nZXM6IE1hcmtkb3duQ2hhbmdlcykge1xyXG4gICAgICAgICAgICBjb25zdCBuZXdUZXh0ID0gY2hhbmdlcy50ZXh0LmN1cnJlbnRWYWx1ZTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnJlYmluZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0ID0gbmV3VGV4dDtcclxuICAgICAgICAgICAgICAgIHRoaXMuYmluZFRleHQodGhpcy50ZXh0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBkZXNjcmliZUF0dGFjaG1lbnRzKGFycmF5KSB7XHJcbiAgICAgICAgICAgIHZhciBhdHRhY2hTdHJpbmcgPSAnJyxcclxuICAgICAgICAgICAgICAgIGF0dGFjaFR5cGVzID0gW107XHJcblxyXG4gICAgICAgICAgICBfLmVhY2goYXJyYXksIGZ1bmN0aW9uIChhdHRhY2gpIHtcclxuICAgICAgICAgICAgICAgIGlmIChhdHRhY2gudHlwZSAmJiBhdHRhY2gudHlwZSAhPT0gJ3RleHQnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGF0dGFjaFN0cmluZy5sZW5ndGggPT09IDAgJiYgdGhpcy5fcGlwVHJhbnNsYXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dGFjaFN0cmluZyA9IHRoaXMuX3BpcFRyYW5zbGF0ZS50cmFuc2xhdGUoJ01BUktET1dOX0FUVEFDSE1FTlRTJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoYXR0YWNoVHlwZXMuaW5kZXhPZihhdHRhY2gudHlwZSkgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dGFjaFR5cGVzLnB1c2goYXR0YWNoLnR5cGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRhY2hTdHJpbmcgKz0gYXR0YWNoVHlwZXMubGVuZ3RoID4gMSA/ICcsICcgOiAnICc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9waXBUcmFuc2xhdGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRhY2hTdHJpbmcgKz0gdGhpcy5fcGlwVHJhbnNsYXRlLnRyYW5zbGF0ZShhdHRhY2gudHlwZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBhdHRhY2hTdHJpbmc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGJpbmRUZXh0KHZhbHVlKSB7XHJcbiAgICAgICAgICAgIGxldCB0ZXh0U3RyaW5nLCBpc0NsYW1wZWQsIGhlaWdodCwgb3B0aW9ucywgb2JqO1xyXG5cclxuICAgICAgICAgICAgaWYgKF8uaXNBcnJheSh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIG9iaiA9IF8uZmluZCh2YWx1ZSwgZnVuY3Rpb24gKGl0ZW06IGFueSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLnR5cGUgPT09ICd0ZXh0JyAmJiBpdGVtLnRleHQ7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICB0ZXh0U3RyaW5nID0gb2JqID8gb2JqLnRleHQgOiB0aGlzLmRlc2NyaWJlQXR0YWNobWVudHModmFsdWUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGV4dFN0cmluZyA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpc0NsYW1wZWQgPSB0aGlzLmNsYW1wICYmIF8uaXNOdW1iZXIodGhpcy5jbGFtcCk7XHJcbiAgICAgICAgICAgIGlzQ2xhbXBlZCA9IGlzQ2xhbXBlZCAmJiB0ZXh0U3RyaW5nICYmIHRleHRTdHJpbmcubGVuZ3RoID4gMDtcclxuICAgICAgICAgICAgb3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgIGdmbTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHRhYmxlczogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGJyZWFrczogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHNhbml0aXplOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgcGVkYW50aWM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBzbWFydExpc3RzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgc21hcnR5cGVudHM6IGZhbHNlXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHRleHRTdHJpbmcgPSBtYXJrZWQodGV4dFN0cmluZyB8fCAnJywgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIGlmIChpc0NsYW1wZWQpIHtcclxuICAgICAgICAgICAgICAgIGhlaWdodCA9IDEuNSAqIE51bWJlcih0aGlzLmNsYW1wKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBBc3NpZ24gdmFsdWUgYXMgSFRNTFxyXG4gICAgICAgICAgICB0aGlzLiRlbGVtZW50Lmh0bWwoJzxkaXYnICsgKGlzQ2xhbXBlZCA/IHRoaXMuaXNMaXN0ID8gJ2NsYXNzPVwicGlwLW1hcmtkb3duLWNvbnRlbnQgJyArXHJcbiAgICAgICAgICAgICAgICAncGlwLW1hcmtkb3duLWxpc3RcIiBzdHlsZT1cIm1heC1oZWlnaHQ6ICcgKyBoZWlnaHQgKyAnZW1cIj4nIDpcclxuICAgICAgICAgICAgICAgICcgY2xhc3M9XCJwaXAtbWFya2Rvd24tY29udGVudFwiIHN0eWxlPVwibWF4LWhlaWdodDogJyArIGhlaWdodCArICdlbVwiPicgOiB0aGlzLmlzTGlzdCA/XHJcbiAgICAgICAgICAgICAgICAnIGNsYXNzPVwicGlwLW1hcmtkb3duLWxpc3RcIj4nIDogJz4nKSArIHRleHRTdHJpbmcgKyAnPC9kaXY+Jyk7XHJcbiAgICAgICAgICAgIHRoaXMuJGVsZW1lbnQuZmluZCgnYScpLmF0dHIoJ3RhcmdldCcsICdibGFuaycpO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNMaXN0ICYmIGlzQ2xhbXBlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kZWxlbWVudC5hcHBlbmQoJzxkaXYgY2xhc3M9XCJwaXAtZ3JhZGllbnQtYmxvY2tcIj48L2Rpdj4nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnN0IE1hcmtkb3duQ29tcG9uZW50ID0ge1xyXG4gICAgICAgIGNvbnRyb2xsZXI6IE1hcmtkb3duQ29udHJvbGxlcixcclxuICAgICAgICBiaW5kaW5nczogTWFya2Rvd25CaW5kaW5nc1xyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdwaXBNYXJrZG93bicsIFsnbmdTYW5pdGl6ZSddKVxyXG4gICAgICAgIC5ydW4oQ29uZmlnVHJhbnNsYXRpb25zKVxyXG4gICAgICAgIC5jb21wb25lbnQoJ3BpcE1hcmtkb3duJywgTWFya2Rvd25Db21wb25lbnQpO1xyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxyXG5cclxue1xyXG4gICAgaW50ZXJmYWNlIElQb3BvdmVyQmluZGluZ3Mge1xyXG4gICAgICAgIFtrZXk6IHN0cmluZ106IGFueTtcclxuXHJcbiAgICAgICAgcGFyYW1zOiBhbnk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgUG9wb3ZlckJpbmRpbmdzOiBJUG9wb3ZlckJpbmRpbmdzID0ge1xyXG4gICAgICAgIHBhcmFtczogJzxwaXBQYXJhbXMnXHJcbiAgICB9XHJcblxyXG4gICAgY2xhc3MgUG9wb3ZlckNvbnRyb2xsZXIgaW1wbGVtZW50cyBJUG9wb3ZlckJpbmRpbmdzLCBuZy5JQ29udHJvbGxlciB7XHJcbiAgICAgICAgcHJpdmF0ZSBiYWNrZHJvcEVsZW1lbnQ7XHJcbiAgICAgICAgcHJpdmF0ZSBjb250ZW50O1xyXG4gICAgICAgIHB1YmxpYyBwYXJhbXM6IGFueTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgICAgIHByaXZhdGUgJHNjb3BlOiBuZy5JU2NvcGUsXHJcbiAgICAgICAgICAgICRyb290U2NvcGU6IG5nLklSb290U2NvcGVTZXJ2aWNlLFxyXG4gICAgICAgICAgICAkZWxlbWVudDogSlF1ZXJ5LFxyXG4gICAgICAgICAgICBwcml2YXRlICR0aW1lb3V0OiBuZy5JVGltZW91dFNlcnZpY2UsXHJcbiAgICAgICAgICAgIHByaXZhdGUgJGNvbXBpbGU6IG5nLklDb21waWxlU2VydmljZSxcclxuICAgICAgICAgICAgcHJpdmF0ZSAkdGVtcGxhdGVSZXF1ZXN0OiBuZy5JVGVtcGxhdGVSZXF1ZXN0U2VydmljZVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICB0aGlzLmJhY2tkcm9wRWxlbWVudCA9ICQoJy5waXAtcG9wb3Zlci1iYWNrZHJvcCcpO1xyXG4gICAgICAgICAgICB0aGlzLmJhY2tkcm9wRWxlbWVudC5vbignY2xpY2sga2V5ZG93biBzY3JvbGwnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJhY2tkcm9wQ2xpY2soKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuYmFja2Ryb3BFbGVtZW50LmFkZENsYXNzKHRoaXMucGFyYW1zLnJlc3BvbnNpdmUgIT09IGZhbHNlID8gJ3BpcC1yZXNwb25zaXZlJyA6ICcnKTtcclxuXHJcbiAgICAgICAgICAgICR0aW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMucG9zaXRpb24oKTtcclxuICAgICAgICAgICAgICAgIGFuZ3VsYXIuZXh0ZW5kKCRzY29wZSwgdGhpcy5wYXJhbXMubG9jYWxzKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wYXJhbXMudGVtcGxhdGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnQgPSAkY29tcGlsZSh0aGlzLnBhcmFtcy50ZW1wbGF0ZSkoJHNjb3BlKTtcclxuICAgICAgICAgICAgICAgICAgICAkZWxlbWVudC5maW5kKCcucGlwLXBvcG92ZXInKS5hcHBlbmQodGhpcy5jb250ZW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbml0KCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuJHRlbXBsYXRlUmVxdWVzdCh0aGlzLnBhcmFtcy50ZW1wbGF0ZVVybCwgZmFsc2UpLnRoZW4oKGh0bWwpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50ID0gJGNvbXBpbGUoaHRtbCkoJHNjb3BlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGVsZW1lbnQuZmluZCgnLnBpcC1wb3BvdmVyJykuYXBwZW5kKHRoaXMuY29udGVudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmluaXQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAkdGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhbGNIZWlnaHQoKTtcclxuICAgICAgICAgICAgfSwgMjAwKTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kb24oJ3BpcFBvcG92ZXJSZXNpemUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uUmVzaXplKClcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICQod2luZG93KS5yZXNpemUoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vblJlc2l6ZSgpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGJhY2tkcm9wQ2xpY2soKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnBhcmFtcy5jYW5jZWxDYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wYXJhbXMuY2FuY2VsQ2FsbGJhY2soKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmNsb3NlUG9wb3ZlcigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGNsb3NlUG9wb3ZlcigpIHtcclxuICAgICAgICAgICAgdGhpcy5iYWNrZHJvcEVsZW1lbnQucmVtb3ZlQ2xhc3MoJ29wZW5lZCcpO1xyXG4gICAgICAgICAgICB0aGlzLiR0aW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYmFja2Ryb3BFbGVtZW50LnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB9LCAxMDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIG9uUG9wb3ZlckNsaWNrKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBpbml0KCkge1xyXG4gICAgICAgICAgICB0aGlzLmJhY2tkcm9wRWxlbWVudC5hZGRDbGFzcygnb3BlbmVkJyk7XHJcbiAgICAgICAgICAgICQoJy5waXAtcG9wb3Zlci1iYWNrZHJvcCcpLmZvY3VzKCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnBhcmFtcy50aW1lb3V0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3NlUG9wb3ZlcigpO1xyXG4gICAgICAgICAgICAgICAgfSwgdGhpcy5wYXJhbXMudGltZW91dCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgcG9zaXRpb24oKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnBhcmFtcy5lbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZWxlbWVudCA9ICQodGhpcy5wYXJhbXMuZWxlbWVudCksXHJcbiAgICAgICAgICAgICAgICAgICAgcG9zID0gZWxlbWVudC5vZmZzZXQoKSxcclxuICAgICAgICAgICAgICAgICAgICB3aWR0aCA9IGVsZW1lbnQud2lkdGgoKSxcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQgPSBlbGVtZW50LmhlaWdodCgpLFxyXG4gICAgICAgICAgICAgICAgICAgIGRvY1dpZHRoID0gJChkb2N1bWVudCkud2lkdGgoKSxcclxuICAgICAgICAgICAgICAgICAgICBkb2NIZWlnaHQgPSAkKGRvY3VtZW50KS5oZWlnaHQoKSxcclxuICAgICAgICAgICAgICAgICAgICBwb3BvdmVyID0gdGhpcy5iYWNrZHJvcEVsZW1lbnQuZmluZCgnLnBpcC1wb3BvdmVyJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHBvcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHBvcG92ZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmNzcygnbWF4LXdpZHRoJywgZG9jV2lkdGggLSAoZG9jV2lkdGggLSBwb3MubGVmdCkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jc3MoJ21heC1oZWlnaHQnLCBkb2NIZWlnaHQgLSAocG9zLnRvcCArIGhlaWdodCkgLSAzMiwgMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmNzcygnbGVmdCcsIHBvcy5sZWZ0IC0gcG9wb3Zlci53aWR0aCgpICsgd2lkdGggLyAyKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuY3NzKCd0b3AnLCBwb3MudG9wICsgaGVpZ2h0ICsgMTYpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIG9uUmVzaXplKCkge1xyXG4gICAgICAgICAgICB0aGlzLmJhY2tkcm9wRWxlbWVudC5maW5kKCcucGlwLXBvcG92ZXInKS5maW5kKCcucGlwLWNvbnRlbnQnKS5jc3MoJ21heC1oZWlnaHQnLCAnMTAwJScpO1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uKCk7XHJcbiAgICAgICAgICAgIHRoaXMuY2FsY0hlaWdodCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBjYWxjSGVpZ2h0KCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5wYXJhbXMuY2FsY0hlaWdodCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBwb3BvdmVyID0gdGhpcy5iYWNrZHJvcEVsZW1lbnQuZmluZCgnLnBpcC1wb3BvdmVyJyksXHJcbiAgICAgICAgICAgICAgICB0aXRsZSA9IHBvcG92ZXIuZmluZCgnLnBpcC10aXRsZScpLFxyXG4gICAgICAgICAgICAgICAgZm9vdGVyID0gcG9wb3Zlci5maW5kKCcucGlwLWZvb3RlcicpLFxyXG4gICAgICAgICAgICAgICAgY29udGVudCA9IHBvcG92ZXIuZmluZCgnLnBpcC1jb250ZW50JyksXHJcbiAgICAgICAgICAgICAgICBjb250ZW50SGVpZ2h0ID0gcG9wb3Zlci5oZWlnaHQoKSAtIHRpdGxlLm91dGVySGVpZ2h0KHRydWUpIC0gZm9vdGVyLm91dGVySGVpZ2h0KHRydWUpO1xyXG4gICAgICAgICAgICBjb250ZW50LmNzcygnbWF4LWhlaWdodCcsIE1hdGgubWF4KGNvbnRlbnRIZWlnaHQsIDApICsgJ3B4JykuY3NzKCdib3gtc2l6aW5nJywgJ2JvcmRlci1ib3gnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgUG9wb3ZlcjogbmcuSUNvbXBvbmVudE9wdGlvbnMgPSB7XHJcbiAgICAgICAgYmluZGluZ3M6IFBvcG92ZXJCaW5kaW5ncyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3BvcG92ZXIvcG9wb3Zlci5odG1sJyxcclxuICAgICAgICBjb250cm9sbGVyOiBQb3BvdmVyQ29udHJvbGxlclxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdwaXBQb3BvdmVyJywgWydwaXBQb3BvdmVyLlNlcnZpY2UnXSlcclxuICAgICAgICAuY29tcG9uZW50KCdwaXBQb3BvdmVyJywgUG9wb3Zlcik7XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vdHlwaW5ncy90c2QuZC50c1wiIC8+XHJcblxyXG57XHJcbiAgICBpbnRlcmZhY2UgUG9wb3ZlclRlbXBsYXRlU2NvcGUgZXh0ZW5kcyBuZy5JU2NvcGUge1xyXG4gICAgICAgIHBhcmFtcyA/IDogYW55O1xyXG4gICAgICAgIGxvY2FscyA/IDogYW55O1xyXG4gICAgfVxyXG5cclxuICAgIGNsYXNzIFBvcG92ZXJTZXJ2aWNlIHtcclxuICAgICAgICBwcml2YXRlIHBvcG92ZXJUZW1wbGF0ZTogc3RyaW5nO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICAgICAgcHJpdmF0ZSAkY29tcGlsZTogbmcuSUNvbXBpbGVTZXJ2aWNlLFxyXG4gICAgICAgICAgICBwcml2YXRlICRyb290U2NvcGU6IG5nLklSb290U2NvcGVTZXJ2aWNlLFxyXG4gICAgICAgICAgICBwcml2YXRlICR0aW1lb3V0OiBuZy5JVGltZW91dFNlcnZpY2VcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgdGhpcy5wb3BvdmVyVGVtcGxhdGUgPSBcIjxkaXYgY2xhc3M9J3BpcC1wb3BvdmVyLWJhY2tkcm9wIHt7IHBhcmFtcy5jbGFzcyB9fScgbmctY29udHJvbGxlcj0ncGFyYW1zLmNvbnRyb2xsZXInXCIgK1xyXG4gICAgICAgICAgICAgICAgXCIgdGFiaW5kZXg9JzEnPiA8cGlwLXBvcG92ZXIgcGlwLXBhcmFtcz0ncGFyYW1zJz4gPC9waXAtcG9wb3Zlcj4gPC9kaXY+XCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc2hvdyhwKSB7XHJcbiAgICAgICAgICAgIGxldCBlbGVtZW50OiBKUXVlcnksIHNjb3BlOiBQb3BvdmVyVGVtcGxhdGVTY29wZSwgcGFyYW1zOiBhbnksIGNvbnRlbnQ6IG5nLklSb290RWxlbWVudFNlcnZpY2U7XHJcblxyXG4gICAgICAgICAgICBlbGVtZW50ID0gJCgnYm9keScpO1xyXG4gICAgICAgICAgICBpZiAoZWxlbWVudC5maW5kKCdtZC1iYWNrZHJvcCcpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmhpZGUoKTtcclxuICAgICAgICAgICAgc2NvcGUgPSB0aGlzLiRyb290U2NvcGUuJG5ldygpO1xyXG4gICAgICAgICAgICBwYXJhbXMgPSBwICYmIF8uaXNPYmplY3QocCkgPyBwIDoge307XHJcbiAgICAgICAgICAgIHNjb3BlLnBhcmFtcyA9IHBhcmFtcztcclxuICAgICAgICAgICAgc2NvcGUubG9jYWxzID0gcGFyYW1zLmxvY2FscztcclxuICAgICAgICAgICAgY29udGVudCA9IHRoaXMuJGNvbXBpbGUodGhpcy5wb3BvdmVyVGVtcGxhdGUpKHNjb3BlKTtcclxuICAgICAgICAgICAgZWxlbWVudC5hcHBlbmQoY29udGVudCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgaGlkZSgpIHtcclxuICAgICAgICAgICAgY29uc3QgYmFja2Ryb3BFbGVtZW50ID0gJCgnLnBpcC1wb3BvdmVyLWJhY2tkcm9wJyk7XHJcbiAgICAgICAgICAgIGJhY2tkcm9wRWxlbWVudC5yZW1vdmVDbGFzcygnb3BlbmVkJyk7XHJcbiAgICAgICAgICAgIHRoaXMuJHRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgYmFja2Ryb3BFbGVtZW50LnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB9LCAxMDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHJlc2l6ZSgpIHtcclxuICAgICAgICAgICAgdGhpcy4kcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3BpcFBvcG92ZXJSZXNpemUnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3BpcFBvcG92ZXIuU2VydmljZScsIFtdKVxyXG4gICAgICAgIC5zZXJ2aWNlKCdwaXBQb3BvdmVyU2VydmljZScsIFBvcG92ZXJTZXJ2aWNlKTtcclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi90eXBpbmdzL3RzZC5kLnRzXCIgLz5cclxuXHJcbntcclxuICAgIGludGVyZmFjZSBJUm91dGluZ0JpbmRpbmdzIHtcclxuICAgICAgICBba2V5OiBzdHJpbmddOiBhbnk7XHJcblxyXG4gICAgICAgIGxvZ29Vcmw6IGFueTtcclxuICAgICAgICBzaG93UHJvZ3Jlc3M6IGFueTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBSb3V0aW5nQmluZGluZ3M6IElSb3V0aW5nQmluZGluZ3MgPSB7XHJcbiAgICAgICAgc2hvd1Byb2dyZXNzOiAnJicsXHJcbiAgICAgICAgbG9nb1VybDogJ0AnXHJcbiAgICB9XHJcblxyXG4gICAgY2xhc3MgUm91dGluZ0NvbnRyb2xsZXIgaW1wbGVtZW50cyBuZy5JQ29udHJvbGxlciwgSVJvdXRpbmdCaW5kaW5ncyB7XHJcbiAgICAgICAgcHJpdmF0ZSBfaW1hZ2U6IGFueTtcclxuXHJcbiAgICAgICAgcHVibGljIGxvZ29Vcmw6IHN0cmluZztcclxuICAgICAgICBwdWJsaWMgc2hvd1Byb2dyZXNzOiBGdW5jdGlvbjtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgICAgICRzY29wZTogbmcuSVNjb3BlLFxyXG4gICAgICAgICAgICBwcml2YXRlICRlbGVtZW50OiBKUXVlcnlcclxuICAgICAgICApIHsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgJHBvc3RMaW5rKCkge1xyXG4gICAgICAgICAgICB0aGlzLl9pbWFnZSA9IHRoaXMuJGVsZW1lbnQuZmluZCgnaW1nJyk7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZFByb2dyZXNzSW1hZ2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBsb2FkUHJvZ3Jlc3NJbWFnZSgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMubG9nb1VybCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faW1hZ2UuYXR0cignc3JjJywgdGhpcy5sb2dvVXJsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBSb3V0aW5nUHJvZ3Jlc3M6IG5nLklDb21wb25lbnRPcHRpb25zID0ge1xyXG4gICAgICAgIGJpbmRpbmdzOiBSb3V0aW5nQmluZGluZ3MsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdwcm9ncmVzcy9yb3V0aW5nUHJvZ3Jlc3MuaHRtbCcsXHJcbiAgICAgICAgY29udHJvbGxlcjogUm91dGluZ0NvbnRyb2xsZXJcclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncGlwUm91dGluZ1Byb2dyZXNzJywgWyduZ01hdGVyaWFsJ10pXHJcbiAgICAgICAgLmNvbXBvbmVudCgncGlwUm91dGluZ1Byb2dyZXNzJywgUm91dGluZ1Byb2dyZXNzKTtcclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi90eXBpbmdzL3RzZC5kLnRzXCIgLz5cclxuXHJcbntcclxuICAgIGludGVyZmFjZSBJUGlwVG9hc3Qge1xyXG4gICAgICAgIHR5cGU6IHN0cmluZztcclxuICAgICAgICBpZDogc3RyaW5nO1xyXG4gICAgICAgIGVycm9yOiBhbnk7XHJcbiAgICAgICAgbWVzc2FnZTogc3RyaW5nO1xyXG4gICAgICAgIGFjdGlvbnM6IHN0cmluZ1tdO1xyXG4gICAgICAgIGR1cmF0aW9uOiBudW1iZXI7XHJcbiAgICAgICAgc3VjY2Vzc0NhbGxiYWNrOiBGdW5jdGlvbjtcclxuICAgICAgICBjYW5jZWxDYWxsYmFjazogRnVuY3Rpb25cclxuICAgIH1cclxuXHJcbiAgICBjbGFzcyBUb2FzdENvbnRyb2xsZXIge1xyXG4gICAgICAgIHByaXZhdGUgX3BpcEVycm9yRGV0YWlsc0RpYWxvZztcclxuXHJcbiAgICAgICAgcHVibGljIG1lc3NhZ2U6IHN0cmluZztcclxuICAgICAgICBwdWJsaWMgYWN0aW9uczogc3RyaW5nW107XHJcbiAgICAgICAgcHVibGljIGFjdGlvbkxlbmdodDogbnVtYmVyO1xyXG4gICAgICAgIHB1YmxpYyBzaG93RGV0YWlsczogYm9vbGVhbjtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgICAgIHByaXZhdGUgJG1kVG9hc3Q6IGFuZ3VsYXIubWF0ZXJpYWwuSVRvYXN0U2VydmljZSxcclxuICAgICAgICAgICAgcHVibGljIHRvYXN0OiBJUGlwVG9hc3QsXHJcbiAgICAgICAgICAgICRpbmplY3RvcjogbmcuYXV0by5JSW5qZWN0b3JTZXJ2aWNlXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3BpcEVycm9yRGV0YWlsc0RpYWxvZyA9ICRpbmplY3Rvci5oYXMoJ3BpcEVycm9yRGV0YWlsc0RpYWxvZycpID9cclxuICAgICAgICAgICAgICAgICRpbmplY3Rvci5nZXQoJ3BpcEVycm9yRGV0YWlsc0RpYWxvZycpIDogbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5tZXNzYWdlID0gdG9hc3QubWVzc2FnZTtcclxuICAgICAgICAgICAgdGhpcy5hY3Rpb25zID0gdG9hc3QuYWN0aW9ucztcclxuXHJcbiAgICAgICAgICAgIGlmICh0b2FzdC5hY3Rpb25zLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hY3Rpb25MZW5naHQgPSAwO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hY3Rpb25MZW5naHQgPSB0b2FzdC5hY3Rpb25zLmxlbmd0aCA9PT0gMSA/IHRvYXN0LmFjdGlvbnNbMF0udG9TdHJpbmcoKS5sZW5ndGggOiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLnNob3dEZXRhaWxzID0gdGhpcy5fcGlwRXJyb3JEZXRhaWxzRGlhbG9nICE9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgb25EZXRhaWxzKCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLiRtZFRvYXN0LmhpZGUoKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3BpcEVycm9yRGV0YWlsc0RpYWxvZykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcGlwRXJyb3JEZXRhaWxzRGlhbG9nLnNob3coe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogdGhpcy50b2FzdC5lcnJvcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2s6ICdPaydcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIubm9vcCxcclxuICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLm5vb3BcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBvbkFjdGlvbihhY3Rpb24pOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy4kbWRUb2FzdC5oaWRlKHtcclxuICAgICAgICAgICAgICAgIGFjdGlvbjogYWN0aW9uLFxyXG4gICAgICAgICAgICAgICAgaWQ6IHRoaXMudG9hc3QuaWQsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiB0aGlzLm1lc3NhZ2VcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGludGVyZmFjZSBJVG9hc3RTZXJ2aWNlIHtcclxuICAgICAgICBzaG93TmV4dFRvYXN0KCk6IHZvaWQ7XHJcbiAgICAgICAgc2hvd1RvYXN0KHRvYXN0OiBJUGlwVG9hc3QpOiB2b2lkO1xyXG4gICAgICAgIGFkZFRvYXN0KHRvYXN0KTogdm9pZDtcclxuICAgICAgICByZW1vdmVUb2FzdHModHlwZTogc3RyaW5nKTogdm9pZDtcclxuICAgICAgICBnZXRUb2FzdEJ5SWQoaWQ6IHN0cmluZyk6IElQaXBUb2FzdDtcclxuICAgICAgICByZW1vdmVUb2FzdHNCeUlkKGlkOiBzdHJpbmcpOiB2b2lkO1xyXG4gICAgICAgIG9uQ2xlYXJUb2FzdHMoKTogdm9pZDtcclxuICAgICAgICBzaG93Tm90aWZpY2F0aW9uKG1lc3NhZ2U6IHN0cmluZywgYWN0aW9uczogc3RyaW5nW10sIHN1Y2Nlc3NDYWxsYmFjaywgY2FuY2VsQ2FsbGJhY2ssIGlkOiBzdHJpbmcpO1xyXG4gICAgICAgIHNob3dNZXNzYWdlKG1lc3NhZ2U6IHN0cmluZywgc3VjY2Vzc0NhbGxiYWNrLCBjYW5jZWxDYWxsYmFjaywgaWQgPyA6IHN0cmluZyk7XHJcbiAgICAgICAgc2hvd0Vycm9yKG1lc3NhZ2U6IHN0cmluZywgc3VjY2Vzc0NhbGxiYWNrLCBjYW5jZWxDYWxsYmFjaywgaWQ6IHN0cmluZywgZXJyb3I6IGFueSk7XHJcbiAgICAgICAgaGlkZUFsbFRvYXN0cygpOiB2b2lkO1xyXG4gICAgICAgIGNsZWFyVG9hc3RzKHR5cGUgPyA6IHN0cmluZyk7XHJcbiAgICB9XHJcblxyXG4gICAgY2xhc3MgVG9hc3RTZXJ2aWNlIGltcGxlbWVudHMgSVRvYXN0U2VydmljZSB7XHJcbiAgICAgICAgcHJpdmF0ZSBTSE9XX1RJTUVPVVQ6IG51bWJlciA9IDIwMDAwO1xyXG4gICAgICAgIHByaXZhdGUgU0hPV19USU1FT1VUX05PVElGSUNBVElPTlM6IG51bWJlciA9IDIwMDAwO1xyXG4gICAgICAgIHByaXZhdGUgdG9hc3RzOiBJUGlwVG9hc3RbXSA9IFtdO1xyXG4gICAgICAgIHByaXZhdGUgY3VycmVudFRvYXN0OiBhbnk7XHJcbiAgICAgICAgcHJpdmF0ZSBzb3VuZHM6IGFueSA9IHt9O1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICAgICAgJHJvb3RTY29wZTogbmcuSVJvb3RTY29wZVNlcnZpY2UsXHJcbiAgICAgICAgICAgIHByaXZhdGUgJG1kVG9hc3Q6IGFuZ3VsYXIubWF0ZXJpYWwuSVRvYXN0U2VydmljZVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3VjY2VzcycsICgpID0+IHsgdGhpcy5vblN0YXRlQ2hhbmdlU3VjY2VzcygpIH0pO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRvbigncGlwU2Vzc2lvbkNsb3NlZCcsICgpID0+IHsgdGhpcy5vbkNsZWFyVG9hc3RzKCkgfSk7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJG9uKCdwaXBJZGVudGl0eUNoYW5nZWQnLCAoKSA9PiB7IHRoaXMub25DbGVhclRvYXN0cygpIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHNob3dOZXh0VG9hc3QoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGxldCB0b2FzdDogSVBpcFRvYXN0O1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMudG9hc3RzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHRvYXN0ID0gdGhpcy50b2FzdHNbMF07XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRvYXN0cy5zcGxpY2UoMCwgMSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dUb2FzdCh0b2FzdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFNob3cgdG9hc3RcclxuICAgICAgICBwdWJsaWMgc2hvd1RvYXN0KHRvYXN0OiBJUGlwVG9hc3QpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50VG9hc3QgPSB0b2FzdDtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuJG1kVG9hc3Quc2hvdyh7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0b2FzdC90b2FzdC5odG1sJyxcclxuICAgICAgICAgICAgICAgICAgICBoaWRlRGVsYXk6IHRvYXN0LmR1cmF0aW9uIHx8IHRoaXMuU0hPV19USU1FT1VULFxyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYm90dG9tIGxlZnQnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFRvYXN0Q29udHJvbGxlcixcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvYXN0OiB0aGlzLmN1cnJlbnRUb2FzdCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc291bmRzOiB0aGlzLnNvdW5kc1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAudGhlbihcclxuICAgICAgICAgICAgICAgICAgICAoYWN0aW9uOiBzdHJpbmcpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG93VG9hc3RPa1Jlc3VsdChhY3Rpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgKGFjdGlvbjogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd1RvYXN0Q2FuY2VsUmVzdWx0KGFjdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgc2hvd1RvYXN0Q2FuY2VsUmVzdWx0KGFjdGlvbjogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRUb2FzdC5jYW5jZWxDYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50VG9hc3QuY2FuY2VsQ2FsbGJhY2soYWN0aW9uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRUb2FzdCA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvd05leHRUb2FzdCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzaG93VG9hc3RPa1Jlc3VsdChhY3Rpb246IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50VG9hc3Quc3VjY2Vzc0NhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRUb2FzdC5zdWNjZXNzQ2FsbGJhY2soYWN0aW9uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRUb2FzdCA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvd05leHRUb2FzdCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGFkZFRvYXN0KHRvYXN0KTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRUb2FzdCAmJiB0b2FzdC50eXBlICE9PSAnZXJyb3InKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRvYXN0cy5wdXNoKHRvYXN0KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hvd1RvYXN0KHRvYXN0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHJlbW92ZVRvYXN0cyh0eXBlOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICAgICAgY29uc3QgcmVzdWx0OiBhbnlbXSA9IFtdO1xyXG4gICAgICAgICAgICBfLmVhY2godGhpcy50b2FzdHMsICh0b2FzdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0b2FzdC50eXBlIHx8IHRvYXN0LnR5cGUgIT09IHR5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh0b2FzdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLnRvYXN0cyA9IF8uY2xvbmVEZWVwKHJlc3VsdCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgcmVtb3ZlVG9hc3RzQnlJZChpZDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgICAgIF8ucmVtb3ZlKHRoaXMudG9hc3RzLCB7XHJcbiAgICAgICAgICAgICAgICBpZDogaWRcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgZ2V0VG9hc3RCeUlkKGlkOiBzdHJpbmcpOiBJUGlwVG9hc3Qge1xyXG4gICAgICAgICAgICByZXR1cm4gXy5maW5kKHRoaXMudG9hc3RzLCB7XHJcbiAgICAgICAgICAgICAgICBpZDogaWRcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgb25TdGF0ZUNoYW5nZVN1Y2Nlc3MoKSB7fVxyXG5cclxuICAgICAgICBwdWJsaWMgb25DbGVhclRvYXN0cygpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5jbGVhclRvYXN0cyhudWxsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzaG93Tm90aWZpY2F0aW9uKG1lc3NhZ2U6IHN0cmluZywgYWN0aW9uczogc3RyaW5nW10sIHN1Y2Nlc3NDYWxsYmFjaywgY2FuY2VsQ2FsbGJhY2ssIGlkOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5hZGRUb2FzdCh7XHJcbiAgICAgICAgICAgICAgICBpZDogaWQgfHwgbnVsbCxcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdub3RpZmljYXRpb24nLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogbWVzc2FnZSxcclxuICAgICAgICAgICAgICAgIGFjdGlvbnM6IGFjdGlvbnMgfHwgWydvayddLFxyXG4gICAgICAgICAgICAgICAgc3VjY2Vzc0NhbGxiYWNrOiBzdWNjZXNzQ2FsbGJhY2ssXHJcbiAgICAgICAgICAgICAgICBjYW5jZWxDYWxsYmFjazogY2FuY2VsQ2FsbGJhY2ssXHJcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogdGhpcy5TSE9XX1RJTUVPVVRfTk9USUZJQ0FUSU9OU1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzaG93TWVzc2FnZShtZXNzYWdlOiBzdHJpbmcsIHN1Y2Nlc3NDYWxsYmFjaywgY2FuY2VsQ2FsbGJhY2ssIGlkID8gOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5hZGRUb2FzdCh7XHJcbiAgICAgICAgICAgICAgICBpZDogaWQgfHwgbnVsbCxcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdtZXNzYWdlJyxcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICBhY3Rpb25zOiBbJ29rJ10sXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzQ2FsbGJhY2s6IHN1Y2Nlc3NDYWxsYmFjayxcclxuICAgICAgICAgICAgICAgIGNhbmNlbENhbGxiYWNrOiBjYW5jZWxDYWxsYmFja1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzaG93RXJyb3IobWVzc2FnZTogc3RyaW5nLCBzdWNjZXNzQ2FsbGJhY2ssIGNhbmNlbENhbGxiYWNrLCBpZDogc3RyaW5nLCBlcnJvcjogYW55KSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkVG9hc3Qoe1xyXG4gICAgICAgICAgICAgICAgaWQ6IGlkIHx8IG51bGwsXHJcbiAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3IsXHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnZXJyb3InLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogbWVzc2FnZSB8fCAnVW5rbm93biBlcnJvci4nLFxyXG4gICAgICAgICAgICAgICAgYWN0aW9uczogWydvayddLFxyXG4gICAgICAgICAgICAgICAgc3VjY2Vzc0NhbGxiYWNrOiBzdWNjZXNzQ2FsbGJhY2ssXHJcbiAgICAgICAgICAgICAgICBjYW5jZWxDYWxsYmFjazogY2FuY2VsQ2FsbGJhY2tcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgaGlkZUFsbFRvYXN0cygpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy4kbWRUb2FzdC5jYW5jZWwoKTtcclxuICAgICAgICAgICAgdGhpcy50b2FzdHMgPSBbXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBjbGVhclRvYXN0cyh0eXBlID8gOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGUpIHtcclxuICAgICAgICAgICAgICAgIC8vIHBpcEFzc2VydC5pc1N0cmluZyh0eXBlLCAncGlwVG9hc3RzLmNsZWFyVG9hc3RzOiB0eXBlIHNob3VsZCBiZSBhIHN0cmluZycpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVUb2FzdHModHlwZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRtZFRvYXN0LmNhbmNlbCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50b2FzdHMgPSBbXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3BpcFRvYXN0cycsIFsnbmdNYXRlcmlhbCcsICdwaXBDb250cm9scy5UcmFuc2xhdGUnXSlcclxuICAgICAgICAuc2VydmljZSgncGlwVG9hc3RzJywgVG9hc3RTZXJ2aWNlKTtcclxufSIsIihmdW5jdGlvbihtb2R1bGUpIHtcbnRyeSB7XG4gIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBDb250cm9scy5UZW1wbGF0ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcENvbnRyb2xzLlRlbXBsYXRlcycsIFtdKTtcbn1cbm1vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgnY29sb3JfcGlja2VyL2NvbG9yUGlja2VyLmh0bWwnLFxuICAgICc8dWwgY2xhc3M9XCJwaXAtY29sb3ItcGlja2VyIHt7JGN0cmwuY2xhc3N9fVwiIHBpcC1zZWxlY3RlZD1cIiRjdHJsLmN1cnJlbnRDb2xvckluZGV4XCIgcGlwLWVudGVyLXNwYWNlLXByZXNzPVwiJGN0cmwuZW50ZXJTcGFjZVByZXNzKCRldmVudClcIj5cXG4nICtcbiAgICAnICAgIDxsaSB0YWJpbmRleD1cIi0xXCIgbmctcmVwZWF0PVwiY29sb3IgaW4gJGN0cmwuY29sb3JzIHRyYWNrIGJ5IGNvbG9yXCI+XFxuJyArXG4gICAgJyAgICAgICAgPG1kLWJ1dHRvbiAgdGFiaW5kZXg9XCItMVwiIGNsYXNzPVwibWQtaWNvbi1idXR0b24gcGlwLXNlbGVjdGFibGVcIiBuZy1jbGljaz1cIiRjdHJsLnNlbGVjdENvbG9yKCRpbmRleClcIiBcXG4nICtcbiAgICAnICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJjb2xvclwiIG5nLWRpc2FibGVkPVwiJGN0cmwubmdEaXNhYmxlZFwiPlxcbicgK1xuICAgICcgICAgICAgICAgICA8bWQtaWNvbiBuZy1zdHlsZT1cIntcXCdjb2xvclxcJzogY29sb3J9XCIgbWQtc3ZnLWljb249XCJpY29uczp7eyBjb2xvciA9PSAkY3RybC5jdXJyZW50Q29sb3IgPyBcXCdjaXJjbGVcXCcgOiBcXCdyYWRpby1vZmZcXCcgfX1cIj5cXG4nICtcbiAgICAnICAgICAgICAgICAgPC9tZC1pY29uPlxcbicgK1xuICAgICcgICAgICAgIDwvbWQtYnV0dG9uPlxcbicgK1xuICAgICcgICAgPC9saT5cXG4nICtcbiAgICAnPC91bD5cXG4nICtcbiAgICAnJyk7XG59XSk7XG59KSgpO1xuXG4oZnVuY3Rpb24obW9kdWxlKSB7XG50cnkge1xuICBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgncGlwQ29udHJvbHMuVGVtcGxhdGVzJyk7XG59IGNhdGNoIChlKSB7XG4gIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBDb250cm9scy5UZW1wbGF0ZXMnLCBbXSk7XG59XG5tb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoJ3BvcG92ZXIvcG9wb3Zlci5odG1sJyxcbiAgICAnPGRpdiBjbGFzcz1cXCdwaXAtcG9wb3ZlclxcJyBuZy1jbGljaz1cIiRjdHJsLnBhcmFtcy5vblBvcG92ZXJDbGljaygkZXZlbnQpXCI+XFxuJyArXG4gICAgJzwvZGl2PlxcbicgK1xuICAgICcnKTtcbn1dKTtcbn0pKCk7XG5cbihmdW5jdGlvbihtb2R1bGUpIHtcbnRyeSB7XG4gIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBDb250cm9scy5UZW1wbGF0ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcENvbnRyb2xzLlRlbXBsYXRlcycsIFtdKTtcbn1cbm1vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgncHJvZ3Jlc3Mvcm91dGluZ1Byb2dyZXNzLmh0bWwnLFxuICAgICc8ZGl2IGNsYXNzPVwibGF5b3V0LWNvbHVtbiBsYXlvdXQtYWxpZ24tY2VudGVyLWNlbnRlclwiIG5nLXNob3c9XCIkY3RybC5zaG93UHJvZ3Jlc3MoKVwiPlxcbicgK1xuICAgICcgICAgPGRpdiBjbGFzcz1cImxvYWRlclwiPlxcbicgK1xuICAgICcgICAgICAgIDxzdmcgY2xhc3M9XCJjaXJjdWxhclwiIHZpZXdCb3g9XCIyNSAyNSA1MCA1MFwiPlxcbicgK1xuICAgICcgICAgICAgICAgICA8Y2lyY2xlIGNsYXNzPVwicGF0aFwiIGN4PVwiNTBcIiBjeT1cIjUwXCIgcj1cIjIwXCIgZmlsbD1cIm5vbmVcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLW1pdGVybGltaXQ9XCIxMFwiLz5cXG4nICtcbiAgICAnICAgICAgICA8L3N2Zz5cXG4nICtcbiAgICAnICAgIDwvZGl2PlxcbicgK1xuICAgICcgICAgPGltZyBzcmM9XCJcIiAgaGVpZ2h0PVwiNDBcIiB3aWR0aD1cIjQwXCIgY2xhc3M9XCJwaXAtaW1nXCI+XFxuJyArXG4gICAgJyAgICA8bWQtcHJvZ3Jlc3MtY2lyY3VsYXIgbWQtZGlhbWV0ZXI9XCI5NlwiIGNsYXNzPVwiZml4LWllXCI+PC9tZC1wcm9ncmVzcy1jaXJjdWxhcj5cXG4nICtcbiAgICAnPC9kaXY+XFxuJyArXG4gICAgJycpO1xufV0pO1xufSkoKTtcblxuKGZ1bmN0aW9uKG1vZHVsZSkge1xudHJ5IHtcbiAgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcENvbnRyb2xzLlRlbXBsYXRlcycpO1xufSBjYXRjaCAoZSkge1xuICBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgncGlwQ29udHJvbHMuVGVtcGxhdGVzJywgW10pO1xufVxubW9kdWxlLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCd0b2FzdC90b2FzdC5odG1sJyxcbiAgICAnPG1kLXRvYXN0IGNsYXNzPVwibWQtYWN0aW9uIHBpcC10b2FzdFwiXFxuJyArXG4gICAgJyAgICAgICAgICBuZy1jbGFzcz1cIntcXCdwaXAtZXJyb3JcXCc6IHZtLnRvYXN0LnR5cGU9PVxcJ2Vycm9yXFwnLFxcbicgK1xuICAgICcgICAgICAgICAgXFwncGlwLWNvbHVtbi10b2FzdFxcJzogdm0udG9hc3QuYWN0aW9ucy5sZW5ndGggPiAxIHx8IHZtLmFjdGlvbkxlbmdodCA+IDQsXFxuJyArXG4gICAgJyAgICAgICAgICBcXCdwaXAtbm8tYWN0aW9uLXRvYXN0XFwnOiB2bS5hY3Rpb25MZW5naHQgPT0gMH1cIlxcbicgK1xuICAgICcgICAgICAgICAgc3R5bGU9XCJoZWlnaHQ6aW5pdGlhbDsgbWF4LWhlaWdodDogaW5pdGlhbDsgXCI+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgICAgPHNwYW4gY2xhc3M9XCJmbGV4LXZhciBwaXAtdGV4dFwiIG5nLWJpbmQtaHRtbD1cInZtLm1lc3NhZ2VcIj48L3NwYW4+XFxuJyArXG4gICAgJyAgICA8ZGl2IGNsYXNzPVwibGF5b3V0LXJvdyBsYXlvdXQtYWxpZ24tZW5kLXN0YXJ0IHBpcC1hY3Rpb25zXCIgbmctaWY9XCJ2bS5hY3Rpb25zLmxlbmd0aCA+IDAgfHwgKHZtLnRvYXN0LnR5cGU9PVxcJ2Vycm9yXFwnICYmIHZtLnRvYXN0LmVycm9yKVwiPlxcbicgK1xuICAgICcgICAgICAgIDxkaXYgY2xhc3M9XCJmbGV4XCIgbmctaWY9XCJ2bS50b2FzdC5hY3Rpb25zLmxlbmd0aCA+IDFcIj4gPC9kaXY+XFxuJyArXG4gICAgJyAgICAgICAgICAgIDxtZC1idXR0b24gY2xhc3M9XCJmbGV4LWZpeGVkIHBpcC10b2FzdC1idXR0b25cIiBuZy1pZj1cInZtLnRvYXN0LnR5cGU9PVxcJ2Vycm9yXFwnICYmIHZtLnRvYXN0LmVycm9yICYmIHZtLnNob3dEZXRhaWxzXCIgbmctY2xpY2s9XCJ2bS5vbkRldGFpbHMoKVwiPkRldGFpbHM8L21kLWJ1dHRvbj5cXG4nICtcbiAgICAnICAgICAgICAgICAgPG1kLWJ1dHRvbiBjbGFzcz1cImZsZXgtZml4ZWQgcGlwLXRvYXN0LWJ1dHRvblwiXFxuJyArXG4gICAgJyAgICAgICAgICAgICAgICAgICAgbmctY2xpY2s9XCJ2bS5vbkFjdGlvbihhY3Rpb24pXCJcXG4nICtcbiAgICAnICAgICAgICAgICAgICAgICAgICBuZy1yZXBlYXQ9XCJhY3Rpb24gaW4gdm0uYWN0aW9uc1wiXFxuJyArXG4gICAgJyAgICAgICAgICAgICAgICAgICAgYXJpYS1sYWJlbD1cInt7OjphY3Rpb258IHRyYW5zbGF0ZX19XCI+XFxuJyArXG4gICAgJyAgICAgICAgICAgICAgICB7ezo6YWN0aW9ufCB0cmFuc2xhdGV9fVxcbicgK1xuICAgICcgICAgICAgICAgICA8L21kLWJ1dHRvbj5cXG4nICtcbiAgICAnICAgICAgIFxcbicgK1xuICAgICcgICAgPC9kaXY+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICc8L21kLXRvYXN0PicpO1xufV0pO1xufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGlwLXdlYnVpLWNvbnRyb2xzLWh0bWwuanMubWFwXG4iXX0=