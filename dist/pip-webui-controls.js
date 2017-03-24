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
        templateUrl: 'color_picker/ColorPicker.html',
        controller: ColorPickerController
    };
    angular
        .module('pipColorPicker', ['pipControls.Templates'])
        .component('pipColorPicker', pipColorPicker);
}
},{}],2:[function(require,module,exports){
{
    translateFilter.$inject = ['$injector'];
    function translateFilter($injector) {
        var pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;
        return function (key) {
            return pipTranslate ? pipTranslate['translate'](key) || key : key;
        };
    }
    angular
        .module('pipControls.Translate', [])
        .filter('translate', translateFilter);
}
},{}],3:[function(require,module,exports){
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
    angular.module('pipImageSlider')
        .directive('pipImageSlider', ImageSlider);
}
},{}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
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
    angular
        .module('pipSliderButton', [])
        .directive('pipSliderButton', SliderButton);
}
},{}],6:[function(require,module,exports){
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
    angular
        .module('pipSliderIndicator', [])
        .directive('pipSliderIndicator', SliderIndicator);
}
},{}],7:[function(require,module,exports){
"use strict";
angular
    .module('pipImageSlider', ['pipSliderButton', 'pipSliderIndicator', 'pipImageSlider.Service']);
require("./ImageSlider");
require("./ImageSliderService");
require("./SliderButton");
require("./SliderIndicator");
},{"./ImageSlider":3,"./ImageSliderService":4,"./SliderButton":5,"./SliderIndicator":6}],8:[function(require,module,exports){
"use strict";
require("./dependencies/TranslateFilter");
require("./color_picker/ColorPicker");
require("./image_slider");
require("./markdown/Markdown");
require("./popover");
require("./progress/RoutingProgress");
require("./toast");
angular.module('pipControls', [
    'pipMarkdown',
    'pipColorPicker',
    'pipRoutingProgress',
    'pipPopover',
    'pipImageSlider',
    'pipToasts',
    'pipControls.Translate'
]);
},{"./color_picker/ColorPicker":1,"./dependencies/TranslateFilter":2,"./image_slider":7,"./markdown/Markdown":9,"./popover":12,"./progress/RoutingProgress":13,"./toast":16}],9:[function(require,module,exports){
{
    var ConfigTranslations = function ($injector) {
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
    };
    ConfigTranslations.$inject = ['$injector'];
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
    angular
        .module('pipMarkdown', ['ngSanitize'])
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
        templateUrl: 'popover/Popover.html',
        controller: PopoverController
    };
    angular
        .module('pipPopover')
        .component('pipPopover', Popover);
}
},{}],11:[function(require,module,exports){
"use strict";
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
"use strict";
angular.module('pipPopover', ['pipPopover.Service']);
require("./Popover");
require("./PopoverService");
},{"./Popover":10,"./PopoverService":11}],13:[function(require,module,exports){
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
        templateUrl: 'progress/RoutingProgress.html',
        controller: RoutingController
    };
    angular
        .module('pipRoutingProgress', ['ngMaterial'])
        .component('pipRoutingProgress', RoutingProgress);
}
},{}],14:[function(require,module,exports){
"use strict";
var Toast = (function () {
    function Toast() {
    }
    return Toast;
}());
exports.Toast = Toast;
},{}],15:[function(require,module,exports){
"use strict";
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
                templateUrl: 'toast/Toast.html',
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
        .module('pipToasts')
        .service('pipToasts', ToastService);
}
},{}],16:[function(require,module,exports){
"use strict";
angular.module('pipToasts', ['ngMaterial', 'pipControls.Translate']);
require("./ToastService");
require("./Toast");
},{"./Toast":14,"./ToastService":15}],17:[function(require,module,exports){
(function(module) {
try {
  module = angular.module('pipControls.Templates');
} catch (e) {
  module = angular.module('pipControls.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('color_picker/ColorPicker.html',
    '<ul class="pip-color-picker {{$ctrl.class}}" pip-selected="$ctrl.currentColorIndex" pip-enter-space-press="$ctrl.enterSpacePress($event)"><li tabindex="-1" ng-repeat="color in $ctrl.colors track by color"><md-button tabindex="-1" class="md-icon-button pip-selectable" ng-click="$ctrl.selectColor($index)" aria-label="color" ng-disabled="$ctrl.ngDisabled"><md-icon ng-style="{\'color\': color}" md-svg-icon="icons:{{ color == $ctrl.currentColor ? \'circle\' : \'radio-off\' }}"></md-icon></md-button></li></ul>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipControls.Templates');
} catch (e) {
  module = angular.module('pipControls.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('popover/Popover.html',
    '<div class="pip-popover" ng-click="$ctrl.params.onPopoverClick($event)"></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipControls.Templates');
} catch (e) {
  module = angular.module('pipControls.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('progress/RoutingProgress.html',
    '<div class="layout-column layout-align-center-center" ng-show="$ctrl.showProgress()"><div class="loader"><svg class="circular" viewbox="25 25 50 50"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"></circle></svg></div><img src="" height="40" width="40" class="pip-img"><md-progress-circular md-diameter="96" class="fix-ie"></md-progress-circular></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipControls.Templates');
} catch (e) {
  module = angular.module('pipControls.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('toast/Toast.html',
    '<md-toast class="md-action pip-toast" ng-class="{\'pip-error\': vm.toast.type==\'error\', \'pip-column-toast\': vm.toast.actions.length > 1 || vm.actionLenght > 4, \'pip-no-action-toast\': vm.actionLenght == 0}" style="height:initial; max-height: initial;"><span class="flex-var pip-text" ng-bind-html="vm.message"></span><div class="layout-row layout-align-end-start pip-actions" ng-if="vm.actions.length > 0 || (vm.toast.type==\'error\' && vm.toast.error)"><div class="flex" ng-if="vm.toast.actions.length > 1"></div><md-button class="flex-fixed pip-toast-button" ng-if="vm.toast.type==\'error\' && vm.toast.error && vm.showDetails" ng-click="vm.onDetails()">Details</md-button><md-button class="flex-fixed pip-toast-button" ng-click="vm.onAction(action)" ng-repeat="action in vm.actions" aria-label="{{::action| translate}}">{{::action| translate}}</md-button></div></md-toast>');
}]);
})();



},{}]},{},[17,8])(17)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29sb3JfcGlja2VyL0NvbG9yUGlja2VyLnRzIiwic3JjL2RlcGVuZGVuY2llcy9UcmFuc2xhdGVGaWx0ZXIudHMiLCJzcmMvaW1hZ2Vfc2xpZGVyL0ltYWdlU2xpZGVyLnRzIiwic3JjL2ltYWdlX3NsaWRlci9JbWFnZVNsaWRlclNlcnZpY2UudHMiLCJzcmMvaW1hZ2Vfc2xpZGVyL1NsaWRlckJ1dHRvbi50cyIsInNyYy9pbWFnZV9zbGlkZXIvU2xpZGVySW5kaWNhdG9yLnRzIiwic3JjL2ltYWdlX3NsaWRlci9pbmRleC50cyIsInNyYy9pbmRleC50cyIsInNyYy9tYXJrZG93bi9NYXJrZG93bi50cyIsInNyYy9wb3BvdmVyL1BvcG92ZXIudHMiLCJzcmMvcG9wb3Zlci9Qb3BvdmVyU2VydmljZS50cyIsInNyYy9wb3BvdmVyL2luZGV4LnRzIiwic3JjL3Byb2dyZXNzL1JvdXRpbmdQcm9ncmVzcy50cyIsInNyYy90b2FzdC9Ub2FzdC50cyIsInNyYy90b2FzdC9Ub2FzdFNlcnZpY2UudHMiLCJzcmMvdG9hc3QvaW5kZXgudHMiLCJ0ZW1wL3BpcC13ZWJ1aS1jb250cm9scy1odG1sLm1pbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLENBQUM7SUFjRyxJQUFNLG1CQUFtQixHQUF5QjtRQUM5QyxVQUFVLEVBQUUsY0FBYztRQUMxQixNQUFNLEVBQUUsWUFBWTtRQUNwQixZQUFZLEVBQUUsVUFBVTtRQUN4QixXQUFXLEVBQUUsWUFBWTtLQUM1QixDQUFBO0lBRUQ7UUFBQTtRQVFBLENBQUM7UUFBRCx5QkFBQztJQUFELENBUkEsQUFRQyxJQUFBO0lBRUQsSUFBTSxnQkFBYyxHQUFHLENBQUMsUUFBUSxFQUFFLFlBQVksRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFFOUY7UUFRSSwr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RSxDQUFDO1lBQ3JCLENBQUM7UUFDTCxDQUFDO1FBRUwsbUJBQUM7SUFBRCxDQXpKQSxBQXlKQyxJQUFBO0lBRUQsT0FBTztTQUNGLE1BQU0sQ0FBQyxXQUFXLENBQUM7U0FDbkIsT0FBTyxDQUFDLFdBQVcsRUFBRSxZQUFZLENBQUMsQ0FBQztBQUM1QyxDQUFDOzs7QUNuTkQsT0FBTyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxZQUFZLEVBQUUsdUJBQXVCLENBQUMsQ0FBQyxDQUFBO0FBRXBFLDBCQUF3QjtBQUN4QixtQkFBaUI7O0FDSGpCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwie1xyXG4gICAgaW50ZXJmYWNlIElDb2xvclBpY2tlckJpbmRpbmdzIHtcclxuICAgICAgICBba2V5OiBzdHJpbmddOiBhbnk7XHJcblxyXG4gICAgICAgIG5nRGlzYWJsZWQ6IGFueTtcclxuICAgICAgICBjb2xvcnM6IGFueTtcclxuICAgICAgICBjdXJyZW50Q29sb3I6IGFueTtcclxuICAgICAgICBjb2xvckNoYW5nZTogYW55O1xyXG4gICAgfVxyXG5cclxuICAgIGludGVyZmFjZSBJQ29sb3JQaWNrZXJBdHRyaWJ1dGVzIGV4dGVuZHMgbmcuSUF0dHJpYnV0ZXMge1xyXG4gICAgICAgIGNsYXNzOiBzdHJpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgQ29sb3JQaWNrZXJCaW5kaW5nczogSUNvbG9yUGlja2VyQmluZGluZ3MgPSB7XHJcbiAgICAgICAgbmdEaXNhYmxlZDogJzw/bmdEaXNhYmxlZCcsXHJcbiAgICAgICAgY29sb3JzOiAnPHBpcENvbG9ycycsXHJcbiAgICAgICAgY3VycmVudENvbG9yOiAnPW5nTW9kZWwnLFxyXG4gICAgICAgIGNvbG9yQ2hhbmdlOiAnJj9uZ0NoYW5nZSdcclxuICAgIH1cclxuXHJcbiAgICBjbGFzcyBDb2xvclBpY2tlckNoYW5nZXMgaW1wbGVtZW50cyBuZy5JT25DaGFuZ2VzT2JqZWN0LCBJQ29sb3JQaWNrZXJCaW5kaW5ncyB7XHJcbiAgICAgICAgW2tleTogc3RyaW5nXTogbmcuSUNoYW5nZXNPYmplY3QgPCBhbnkgPiA7XHJcblxyXG4gICAgICAgIGNvbG9yQ2hhbmdlOiBuZy5JQ2hhbmdlc09iamVjdCA8ICgpID0+IG5nLklQcm9taXNlIDwgYW55ID4+IDtcclxuICAgICAgICBjdXJyZW50Q29sb3I6IGFueTtcclxuXHJcbiAgICAgICAgbmdEaXNhYmxlZDogbmcuSUNoYW5nZXNPYmplY3QgPCBib29sZWFuID4gO1xyXG4gICAgICAgIGNvbG9yczogbmcuSUNoYW5nZXNPYmplY3QgPCBzdHJpbmdbXSA+IDtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBERUZBVUxUX0NPTE9SUyA9IFsncHVycGxlJywgJ2xpZ2h0Z3JlZW4nLCAnZ3JlZW4nLCAnZGFya3JlZCcsICdwaW5rJywgJ3llbGxvdycsICdjeWFuJ107XHJcblxyXG4gICAgY2xhc3MgQ29sb3JQaWNrZXJDb250cm9sbGVyIGltcGxlbWVudHMgSUNvbG9yUGlja2VyQmluZGluZ3Mge1xyXG4gICAgICAgIHB1YmxpYyBjbGFzczogc3RyaW5nO1xyXG4gICAgICAgIHB1YmxpYyBjb2xvcnM6IHN0cmluZ1tdO1xyXG4gICAgICAgIHB1YmxpYyBjdXJyZW50Q29sb3I6IHN0cmluZztcclxuICAgICAgICBwdWJsaWMgY3VycmVudENvbG9ySW5kZXg6IG51bWJlcjtcclxuICAgICAgICBwdWJsaWMgbmdEaXNhYmxlZDogYm9vbGVhbjtcclxuICAgICAgICBwdWJsaWMgY29sb3JDaGFuZ2U6IEZ1bmN0aW9uO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICAgICAgcHJpdmF0ZSAkc2NvcGU6IG5nLklTY29wZSxcclxuICAgICAgICAgICAgcHJpdmF0ZSAkZWxlbWVudDogSlF1ZXJ5LFxyXG4gICAgICAgICAgICAkYXR0cnM6IElDb2xvclBpY2tlckF0dHJpYnV0ZXMsXHJcbiAgICAgICAgICAgIHByaXZhdGUgJHRpbWVvdXQ6IG5nLklUaW1lb3V0U2VydmljZVxyXG4gICAgICAgICkgeyBcclxuICAgICAgICAgICAgdGhpcy5jbGFzcyA9ICRhdHRycy5jbGFzcyB8fCAnJzsgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgJG9uQ2hhbmdlcyhjaGFuZ2VzOiBDb2xvclBpY2tlckNoYW5nZXMpIHtcclxuICAgICAgICAgICAgdGhpcy5jb2xvcnMgPSBjaGFuZ2VzLmNvbG9ycyAmJiBfLmlzQXJyYXkoY2hhbmdlcy5jb2xvcnMuY3VycmVudFZhbHVlKSAmJiBjaGFuZ2VzLmNvbG9ycy5jdXJyZW50VmFsdWUubGVuZ3RoICE9PSAwID9cclxuICAgICAgICAgICAgICAgIGNoYW5nZXMuY29sb3JzLmN1cnJlbnRWYWx1ZSA6IERFRkFVTFRfQ09MT1JTO1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRDb2xvciA9IHRoaXMuY3VycmVudENvbG9yIHx8IHRoaXMuY29sb3JzWzBdO1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRDb2xvckluZGV4ID0gdGhpcy5jb2xvcnMuaW5kZXhPZih0aGlzLmN1cnJlbnRDb2xvcik7XHJcblxyXG4gICAgICAgICAgICB0aGlzLm5nRGlzYWJsZWQgPSBjaGFuZ2VzLm5nRGlzYWJsZWQuY3VycmVudFZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHNlbGVjdENvbG9yKGluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMubmdEaXNhYmxlZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudENvbG9ySW5kZXggPSBpbmRleDtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50Q29sb3IgPSB0aGlzLmNvbG9yc1t0aGlzLmN1cnJlbnRDb2xvckluZGV4XTtcclxuICAgICAgICAgICAgdGhpcy4kdGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRzY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5jb2xvckNoYW5nZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb2xvckNoYW5nZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcHVibGljIGVudGVyU3BhY2VQcmVzcyhldmVudCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdENvbG9yKGV2ZW50LmluZGV4KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBwaXBDb2xvclBpY2tlcjogbmcuSUNvbXBvbmVudE9wdGlvbnMgPSB7XHJcbiAgICAgICAgYmluZGluZ3M6IENvbG9yUGlja2VyQmluZGluZ3MsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdjb2xvcl9waWNrZXIvQ29sb3JQaWNrZXIuaHRtbCcsXHJcbiAgICAgICAgY29udHJvbGxlcjogQ29sb3JQaWNrZXJDb250cm9sbGVyXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3BpcENvbG9yUGlja2VyJywgWydwaXBDb250cm9scy5UZW1wbGF0ZXMnXSlcclxuICAgICAgICAuY29tcG9uZW50KCdwaXBDb2xvclBpY2tlcicsIHBpcENvbG9yUGlja2VyKTtcclxuXHJcbn0iLCJ7XHJcbiAgICBmdW5jdGlvbiB0cmFuc2xhdGVGaWx0ZXIoJGluamVjdG9yOiBuZy5hdXRvLklJbmplY3RvclNlcnZpY2UpIHtcclxuICAgICAgICBjb25zdCBwaXBUcmFuc2xhdGUgPSAkaW5qZWN0b3IuaGFzKCdwaXBUcmFuc2xhdGUnKSA/ICRpbmplY3Rvci5nZXQoJ3BpcFRyYW5zbGF0ZScpIDogbnVsbDtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChrZXk6IHN0cmluZykge1xyXG4gICAgICAgICAgICByZXR1cm4gcGlwVHJhbnNsYXRlID8gcGlwVHJhbnNsYXRlWyd0cmFuc2xhdGUnXShrZXkpIHx8IGtleSA6IGtleTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3BpcENvbnRyb2xzLlRyYW5zbGF0ZScsIFtdKVxyXG4gICAgICAgIC5maWx0ZXIoJ3RyYW5zbGF0ZScsIHRyYW5zbGF0ZUZpbHRlcik7XHJcbn1cclxuIiwiaW1wb3J0IHsgSUltYWdlU2xpZGVyU2VydmljZSB9IGZyb20gJy4vSUltYWdlU2xpZGVyU2VydmljZSc7XHJcblxyXG57XHJcbiAgICBjbGFzcyBwaXBJbWFnZVNsaWRlckNvbnRyb2xsZXIgaW1wbGVtZW50cyBuZy5JQ29udHJvbGxlciB7XHJcbiAgICAgICAgcHJpdmF0ZSBfYmxvY2tzOiBhbnlbXTtcclxuICAgICAgICBwcml2YXRlIF9pbmRleDogbnVtYmVyID0gMDtcclxuICAgICAgICBwcml2YXRlIF9uZXdJbmRleDogbnVtYmVyO1xyXG4gICAgICAgIHByaXZhdGUgX2RpcmVjdGlvbjogc3RyaW5nO1xyXG4gICAgICAgIHByaXZhdGUgX3R5cGU6IHN0cmluZztcclxuICAgICAgICBwcml2YXRlIERFRkFVTFRfSU5URVJWQUw6bnVtYmVyID0gNDUwMDtcclxuICAgICAgICBwcml2YXRlIF9pbnRlcnZhbDogbnVtYmVyIHwgc3RyaW5nO1xyXG4gICAgICAgIHByaXZhdGUgX3RpbWVQcm9taXNlcztcclxuICAgICAgICBwcml2YXRlIF90aHJvdHRsZWQ6IEZ1bmN0aW9uO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3dpcGVTdGFydDogbnVtYmVyID0gMDtcclxuICAgICAgICBwdWJsaWMgc2xpZGVySW5kZXg6IG51bWJlcjtcclxuICAgICAgICBwdWJsaWMgc2xpZGVUbzogRnVuY3Rpb247XHJcbiAgICAgICAgcHVibGljIHR5cGU6IEZ1bmN0aW9uO1xyXG4gICAgICAgIHB1YmxpYyBpbnRlcnZhbDogRnVuY3Rpb247XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgICAgICBwcml2YXRlICRzY29wZTogbmcuSVNjb3BlLFxyXG4gICAgICAgICAgICBwcml2YXRlICRlbGVtZW50OiBKUXVlcnksXHJcbiAgICAgICAgICAgIHByaXZhdGUgJGF0dHJzLFxyXG4gICAgICAgICAgICBwcml2YXRlICRwYXJzZTogbmcuSVBhcnNlU2VydmljZSxcclxuICAgICAgICAgICAgcHJpdmF0ZSAkdGltZW91dDogYW5ndWxhci5JVGltZW91dFNlcnZpY2UsXHJcbiAgICAgICAgICAgIHByaXZhdGUgJGludGVydmFsOiBhbmd1bGFyLklJbnRlcnZhbFNlcnZpY2UsXHJcbiAgICAgICAgICAgIHByaXZhdGUgcGlwSW1hZ2VTbGlkZXI6IElJbWFnZVNsaWRlclNlcnZpY2VcclxuICAgICAgICApIHtcclxuXHJcbiAgICAgICAgICAgIC8vdGhpcy5zbGlkZXJJbmRleCA9ICRzY29wZVsndm0nXVsnc2xpZGVySW5kZXgnXTtcclxuICAgICAgICAgICAgdGhpcy5fdHlwZSA9IHRoaXMudHlwZSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9pbnRlcnZhbCA9IHRoaXMuaW50ZXJ2YWwoKTtcclxuICAgICAgICAgICAgdGhpcy5zbGlkZVRvID0gdGhpcy5zbGlkZVRvUHJpdmF0ZTtcclxuXHJcbiAgICAgICAgICAgICRlbGVtZW50LmFkZENsYXNzKCdwaXAtaW1hZ2Utc2xpZGVyJyk7XHJcbiAgICAgICAgICAgICRlbGVtZW50LmFkZENsYXNzKCdwaXAtYW5pbWF0aW9uLScgKyB0aGlzLl90eXBlKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc2V0SW5kZXgoKTtcclxuXHJcbiAgICAgICAgICAgICR0aW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2Jsb2NrcyA9IDxhbnk+JGVsZW1lbnQuZmluZCgnLnBpcC1hbmltYXRpb24tYmxvY2snKTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9ibG9ja3MubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcy5fYmxvY2tzWzBdKS5hZGRDbGFzcygncGlwLXNob3cnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnN0YXJ0SW50ZXJ2YWwoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3Rocm90dGxlZCA9IF8udGhyb3R0bGUoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcGlwSW1hZ2VTbGlkZXIudG9CbG9jayh0aGlzLl90eXBlLCB0aGlzLl9ibG9ja3MsIHRoaXMuX2luZGV4LCB0aGlzLl9uZXdJbmRleCwgdGhpcy5fZGlyZWN0aW9uKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2luZGV4ID0gdGhpcy5fbmV3SW5kZXg7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldEluZGV4KCk7XHJcbiAgICAgICAgICAgIH0sIDcwMCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoJGF0dHJzLmlkKSB7XHJcbiAgICAgICAgICAgICAgICBwaXBJbWFnZVNsaWRlci5yZWdpc3RlclNsaWRlcigkYXR0cnMuaWQsICRzY29wZSlcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLiRvbignJGRlc3Ryb3knLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3BJbnRlcnZhbCgpO1xyXG4gICAgICAgICAgICAgICAgcGlwSW1hZ2VTbGlkZXIucmVtb3ZlU2xpZGVyKCRhdHRycy5pZCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBuZXh0QmxvY2soKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVzdGFydEludGVydmFsKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX25ld0luZGV4ID0gdGhpcy5faW5kZXggKyAxID09PSB0aGlzLl9ibG9ja3MubGVuZ3RoID8gMCA6IHRoaXMuX2luZGV4ICsgMTtcclxuICAgICAgICAgICAgdGhpcy5fZGlyZWN0aW9uID0gJ25leHQnO1xyXG4gICAgICAgICAgICB0aGlzLl90aHJvdHRsZWQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBwcmV2QmxvY2soKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVzdGFydEludGVydmFsKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX25ld0luZGV4ID0gdGhpcy5faW5kZXggLSAxIDwgMCA/IHRoaXMuX2Jsb2Nrcy5sZW5ndGggLSAxIDogdGhpcy5faW5kZXggLSAxO1xyXG4gICAgICAgICAgICB0aGlzLl9kaXJlY3Rpb24gPSAncHJldic7XHJcbiAgICAgICAgICAgIHRoaXMuX3Rocm90dGxlZCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzbGlkZVRvUHJpdmF0ZShuZXh0SW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgICAgICBpZiAobmV4dEluZGV4ID09PSB0aGlzLl9pbmRleCB8fCBuZXh0SW5kZXggPiB0aGlzLl9ibG9ja3MubGVuZ3RoIC0gMSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLnJlc3RhcnRJbnRlcnZhbCgpO1xyXG4gICAgICAgICAgICB0aGlzLl9uZXdJbmRleCA9IG5leHRJbmRleDtcclxuICAgICAgICAgICAgdGhpcy5fZGlyZWN0aW9uID0gbmV4dEluZGV4ID4gdGhpcy5faW5kZXggPyAnbmV4dCcgOiAncHJldic7XHJcbiAgICAgICAgICAgIHRoaXMuX3Rocm90dGxlZCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzZXRJbmRleCgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuJGF0dHJzLnBpcEltYWdlSW5kZXgpIHRoaXMuc2xpZGVySW5kZXggPSB0aGlzLl9pbmRleDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgc3RhcnRJbnRlcnZhbCgpIHtcclxuICAgICAgICAgICAgdGhpcy5fdGltZVByb21pc2VzID0gdGhpcy4kaW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbmV3SW5kZXggPSB0aGlzLl9pbmRleCArIDEgPT09IHRoaXMuX2Jsb2Nrcy5sZW5ndGggPyAwIDogdGhpcy5faW5kZXggKyAxO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZGlyZWN0aW9uID0gJ25leHQnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdGhyb3R0bGVkKCk7XHJcbiAgICAgICAgICAgIH0sIE51bWJlcih0aGlzLl9pbnRlcnZhbCB8fCB0aGlzLkRFRkFVTFRfSU5URVJWQUwpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgc3RvcEludGVydmFsKCkge1xyXG4gICAgICAgICAgICB0aGlzLiRpbnRlcnZhbC5jYW5jZWwodGhpcy5fdGltZVByb21pc2VzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgcmVzdGFydEludGVydmFsKCkge1xyXG4gICAgICAgICAgICB0aGlzLnN0b3BJbnRlcnZhbCgpO1xyXG4gICAgICAgICAgICB0aGlzLnN0YXJ0SW50ZXJ2YWwoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgSW1hZ2VTbGlkZXIgPSBmdW5jdGlvbigpOiBuZy5JRGlyZWN0aXZlIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBzY29wZToge1xyXG4gICAgICAgICAgICAgICAgc2xpZGVySW5kZXg6ICc9cGlwSW1hZ2VJbmRleCcsXHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnJnBpcEFuaW1hdGlvblR5cGUnLFxyXG4gICAgICAgICAgICAgICAgaW50ZXJ2YWw6ICcmcGlwQW5pbWF0aW9uSW50ZXJ2YWwnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IHBpcEltYWdlU2xpZGVyQ29udHJvbGxlcixcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgncGlwSW1hZ2VTbGlkZXInKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ3BpcEltYWdlU2xpZGVyJywgSW1hZ2VTbGlkZXIpO1xyXG59IiwiaW1wb3J0IHsgSUltYWdlU2xpZGVyU2VydmljZSB9IGZyb20gJy4vSUltYWdlU2xpZGVyU2VydmljZSc7XHJcblxyXG57XHJcbiAgICBjbGFzcyBJbWFnZVNsaWRlclNlcnZpY2UgaW1wbGVtZW50cyBJSW1hZ2VTbGlkZXJTZXJ2aWNlIHtcclxuICAgICAgICBwcml2YXRlIEFOSU1BVElPTl9EVVJBVElPTjogbnVtYmVyID0gNTUwO1xyXG4gICAgICAgIHByaXZhdGUgX3NsaWRlcnM6IE9iamVjdCA9IHt9O1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICAgICAgcHJpdmF0ZSAkdGltZW91dDogYW5ndWxhci5JVGltZW91dFNlcnZpY2VcclxuICAgICAgICApIHt9XHJcblxyXG4gICAgICAgIHB1YmxpYyByZWdpc3RlclNsaWRlcihzbGlkZXJJZDogc3RyaW5nLCBzbGlkZXJTY29wZTogbmcuSVNjb3BlKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX3NsaWRlcnNbc2xpZGVySWRdID0gc2xpZGVyU2NvcGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgcmVtb3ZlU2xpZGVyKHNsaWRlcklkOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX3NsaWRlcnNbc2xpZGVySWRdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGdldFNsaWRlclNjb3BlKHNsaWRlcklkOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NsaWRlcnNbc2xpZGVySWRdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIG5leHRDYXJvdXNlbChuZXh0QmxvY2s6IEpRdWVyeSwgcHJldkJsb2NrOiBKUXVlcnkpOiB2b2lkIHtcclxuICAgICAgICAgICAgbmV4dEJsb2NrLmFkZENsYXNzKCdwaXAtbmV4dCcpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy4kdGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBuZXh0QmxvY2suYWRkQ2xhc3MoJ2FuaW1hdGVkJykuYWRkQ2xhc3MoJ3BpcC1zaG93JykucmVtb3ZlQ2xhc3MoJ3BpcC1uZXh0Jyk7XHJcbiAgICAgICAgICAgICAgICBwcmV2QmxvY2suYWRkQ2xhc3MoJ2FuaW1hdGVkJykucmVtb3ZlQ2xhc3MoJ3BpcC1zaG93Jyk7XHJcbiAgICAgICAgICAgIH0sIDEwMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgcHJldkNhcm91c2VsKG5leHRCbG9jazogSlF1ZXJ5LCBwcmV2QmxvY2s6IEpRdWVyeSk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLiR0aW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIG5leHRCbG9jay5hZGRDbGFzcygnYW5pbWF0ZWQnKS5hZGRDbGFzcygncGlwLXNob3cnKTtcclxuICAgICAgICAgICAgICAgIHByZXZCbG9jay5hZGRDbGFzcygnYW5pbWF0ZWQnKS5hZGRDbGFzcygncGlwLW5leHQnKS5yZW1vdmVDbGFzcygncGlwLXNob3cnKTtcclxuICAgICAgICAgICAgfSwgMTAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB0b0Jsb2NrKHR5cGU6IHN0cmluZywgYmxvY2tzOiBhbnlbXSwgb2xkSW5kZXg6IG51bWJlciwgbmV4dEluZGV4OiBudW1iZXIsIGRpcmVjdGlvbjogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGNvbnN0IHByZXZCbG9jayA9ICQoYmxvY2tzW29sZEluZGV4XSksXHJcbiAgICAgICAgICAgICAgICBibG9ja0luZGV4ID0gbmV4dEluZGV4LFxyXG4gICAgICAgICAgICAgICAgbmV4dEJsb2NrID0gJChibG9ja3NbYmxvY2tJbmRleF0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKHR5cGUgPT09ICdjYXJvdXNlbCcpIHtcclxuICAgICAgICAgICAgICAgICQoYmxvY2tzKS5yZW1vdmVDbGFzcygncGlwLW5leHQnKS5yZW1vdmVDbGFzcygncGlwLXByZXYnKS5yZW1vdmVDbGFzcygnYW5pbWF0ZWQnKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZGlyZWN0aW9uICYmIChkaXJlY3Rpb24gPT09ICdwcmV2JyB8fCBkaXJlY3Rpb24gPT09ICduZXh0JykpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGlyZWN0aW9uID09PSAncHJldicpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmV2Q2Fyb3VzZWwobmV4dEJsb2NrLCBwcmV2QmxvY2spO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dENhcm91c2VsKG5leHRCbG9jaywgcHJldkJsb2NrKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXh0SW5kZXggJiYgbmV4dEluZGV4IDwgb2xkSW5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmV2Q2Fyb3VzZWwobmV4dEJsb2NrLCBwcmV2QmxvY2spO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dENhcm91c2VsKG5leHRCbG9jaywgcHJldkJsb2NrKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBwcmV2QmxvY2suYWRkQ2xhc3MoJ2FuaW1hdGVkJykucmVtb3ZlQ2xhc3MoJ3BpcC1zaG93Jyk7XHJcbiAgICAgICAgICAgICAgICBuZXh0QmxvY2suYWRkQ2xhc3MoJ2FuaW1hdGVkJykuYWRkQ2xhc3MoJ3BpcC1zaG93Jyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3BpcEltYWdlU2xpZGVyLlNlcnZpY2UnLCBbXSlcclxuICAgICAgICAuc2VydmljZSgncGlwSW1hZ2VTbGlkZXInLCBJbWFnZVNsaWRlclNlcnZpY2UpO1xyXG59IiwiaW1wb3J0IHsgSUltYWdlU2xpZGVyU2VydmljZSB9IGZyb20gJy4vSUltYWdlU2xpZGVyU2VydmljZSc7XHJcblxyXG57XHJcbiAgICBjbGFzcyBTbGlkZXJCdXR0b25Db250cm9sbGVyIGltcGxlbWVudHMgbmcuSUNvbnRyb2xsZXIge1xyXG4gICAgICAgIHB1YmxpYyBkaXJlY3Rpb246IEZ1bmN0aW9uO1xyXG4gICAgICAgIHB1YmxpYyBzbGlkZXJJZDogRnVuY3Rpb247XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgICAgICAkZWxlbWVudDogSlF1ZXJ5LFxyXG4gICAgICAgICAgICBwaXBJbWFnZVNsaWRlcjogSUltYWdlU2xpZGVyU2VydmljZVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICAkZWxlbWVudC5vbignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuc2xpZGVySWQoKSB8fCAhdGhpcy5kaXJlY3Rpb24oKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBwaXBJbWFnZVNsaWRlci5nZXRTbGlkZXJTY29wZSh0aGlzLnNsaWRlcklkKCkpLnZtW3RoaXMuZGlyZWN0aW9uKCkgKyAnQmxvY2snXSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgU2xpZGVyQnV0dG9uID0gZnVuY3Rpb24gKCk6IG5nLklEaXJlY3RpdmUge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHNjb3BlOiB7XHJcbiAgICAgICAgICAgICAgICBkaXJlY3Rpb246ICcmcGlwQnV0dG9uVHlwZScsXHJcbiAgICAgICAgICAgICAgICBzbGlkZXJJZDogJyZwaXBTbGlkZXJJZCdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnJGN0bHInLFxyXG4gICAgICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBTbGlkZXJCdXR0b25Db250cm9sbGVyXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncGlwU2xpZGVyQnV0dG9uJywgW10pXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgncGlwU2xpZGVyQnV0dG9uJywgU2xpZGVyQnV0dG9uKTtcclxuXHJcbn0iLCJpbXBvcnQgeyBJSW1hZ2VTbGlkZXJTZXJ2aWNlIH0gZnJvbSAnLi9JSW1hZ2VTbGlkZXJTZXJ2aWNlJztcclxuXHJcbntcclxuICAgIGNsYXNzIFNsaWRlckluZGljYXRvckNvbnRyb2xsZXIgaW1wbGVtZW50cyBuZy5JQ29udHJvbGxlciB7XHJcbiAgICAgICAgcHVibGljIHNsaWRlVG86IEZ1bmN0aW9uO1xyXG4gICAgICAgIHB1YmxpYyBzbGlkZXJJZDogRnVuY3Rpb247XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgICAgICAkZWxlbWVudDogSlF1ZXJ5LFxyXG4gICAgICAgICAgICBwaXBJbWFnZVNsaWRlcjogSUltYWdlU2xpZGVyU2VydmljZVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICAkZWxlbWVudC5jc3MoJ2N1cnNvcicsICdwb2ludGVyJyk7XHJcbiAgICAgICAgICAgICRlbGVtZW50Lm9uKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5zbGlkZXJJZCgpIHx8IHRoaXMuc2xpZGVUbygpID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcGlwSW1hZ2VTbGlkZXIuZ2V0U2xpZGVyU2NvcGUodGhpcy5zbGlkZXJJZCgpKS52bS5zbGlkZVRvKHRoaXMuc2xpZGVUbygpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IFNsaWRlckluZGljYXRvciA9IGZ1bmN0aW9uICgpOiBuZy5JRGlyZWN0aXZlIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBzY29wZToge1xyXG4gICAgICAgICAgICAgICAgc2xpZGVUbzogJyZwaXBTbGlkZVRvJyxcclxuICAgICAgICAgICAgICAgIHNsaWRlcklkOiAnJnBpcFNsaWRlcklkJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICckY3RscicsXHJcbiAgICAgICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFNsaWRlckluZGljYXRvckNvbnRyb2xsZXJcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3BpcFNsaWRlckluZGljYXRvcicsIFtdKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ3BpcFNsaWRlckluZGljYXRvcicsIFNsaWRlckluZGljYXRvcik7XHJcbn0iLCJhbmd1bGFyXHJcbiAgICAubW9kdWxlKCdwaXBJbWFnZVNsaWRlcicsIFsncGlwU2xpZGVyQnV0dG9uJywgJ3BpcFNsaWRlckluZGljYXRvcicsICdwaXBJbWFnZVNsaWRlci5TZXJ2aWNlJ10pO1xyXG5cclxuaW1wb3J0ICcuL0ltYWdlU2xpZGVyJztcclxuaW1wb3J0ICcuL0ltYWdlU2xpZGVyU2VydmljZSc7XHJcbmltcG9ydCAnLi9TbGlkZXJCdXR0b24nO1xyXG5pbXBvcnQgJy4vU2xpZGVySW5kaWNhdG9yJztcclxuXHJcbmV4cG9ydCAqIGZyb20gJy4vSUltYWdlU2xpZGVyU2VydmljZSc7Iiwi77u/aW1wb3J0ICcuL2RlcGVuZGVuY2llcy9UcmFuc2xhdGVGaWx0ZXInO1xyXG5pbXBvcnQgJy4vY29sb3JfcGlja2VyL0NvbG9yUGlja2VyJztcclxuaW1wb3J0ICcuL2ltYWdlX3NsaWRlcic7XHJcbmltcG9ydCAnLi9tYXJrZG93bi9NYXJrZG93bic7XHJcbmltcG9ydCAnLi9wb3BvdmVyJztcclxuaW1wb3J0ICcuL3Byb2dyZXNzL1JvdXRpbmdQcm9ncmVzcyc7XHJcbmltcG9ydCAnLi90b2FzdCc7XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgncGlwQ29udHJvbHMnLCBbXHJcbiAgICAncGlwTWFya2Rvd24nLFxyXG4gICAgJ3BpcENvbG9yUGlja2VyJyxcclxuICAgICdwaXBSb3V0aW5nUHJvZ3Jlc3MnLFxyXG4gICAgJ3BpcFBvcG92ZXInLFxyXG4gICAgJ3BpcEltYWdlU2xpZGVyJyxcclxuICAgICdwaXBUb2FzdHMnLFxyXG4gICAgJ3BpcENvbnRyb2xzLlRyYW5zbGF0ZSdcclxuXSk7XHJcblxyXG5leHBvcnQgKiBmcm9tICcuL2ltYWdlX3NsaWRlcic7XHJcbmV4cG9ydCAqIGZyb20gJy4vcG9wb3Zlcic7XHJcbmV4cG9ydCAqIGZyb20gJy4vdG9hc3QnOyIsImRlY2xhcmUgdmFyIG1hcmtlZDogYW55O1xyXG5cclxue1xyXG4gIGNvbnN0IENvbmZpZ1RyYW5zbGF0aW9ucyA9ICgkaW5qZWN0b3I6IG5nLmF1dG8uSUluamVjdG9yU2VydmljZSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHBpcFRyYW5zbGF0ZSA9ICRpbmplY3Rvci5oYXMoJ3BpcFRyYW5zbGF0ZScpID8gJGluamVjdG9yLmdldCgncGlwVHJhbnNsYXRlJykgOiBudWxsO1xyXG5cclxuICAgICAgICBpZiAocGlwVHJhbnNsYXRlKSB7XHJcbiAgICAgICAgICAgICg8YW55PnBpcFRyYW5zbGF0ZSkuc2V0VHJhbnNsYXRpb25zKCdlbicsIHtcclxuICAgICAgICAgICAgICAgICdNQVJLRE9XTl9BVFRBQ0hNRU5UUyc6ICdBdHRhY2htZW50czonLFxyXG4gICAgICAgICAgICAgICAgJ2NoZWNrbGlzdCc6ICdDaGVja2xpc3QnLFxyXG4gICAgICAgICAgICAgICAgJ2RvY3VtZW50cyc6ICdEb2N1bWVudHMnLFxyXG4gICAgICAgICAgICAgICAgJ3BpY3R1cmVzJzogJ1BpY3R1cmVzJyxcclxuICAgICAgICAgICAgICAgICdsb2NhdGlvbic6ICdMb2NhdGlvbicsXHJcbiAgICAgICAgICAgICAgICAndGltZSc6ICdUaW1lJ1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgKDxhbnk+cGlwVHJhbnNsYXRlKS5zZXRUcmFuc2xhdGlvbnMoJ3J1Jywge1xyXG4gICAgICAgICAgICAgICAgJ01BUktET1dOX0FUVEFDSE1FTlRTJzogJ9CS0LvQvtC20LXQvdC40Y86JyxcclxuICAgICAgICAgICAgICAgICdjaGVja2xpc3QnOiAn0KHQv9C40YHQvtC6JyxcclxuICAgICAgICAgICAgICAgICdkb2N1bWVudHMnOiAn0JTQvtC60YPQvNC10L3RgtGLJyxcclxuICAgICAgICAgICAgICAgICdwaWN0dXJlcyc6ICfQmNC30L7QsdGA0LDQttC10L3QuNGPJyxcclxuICAgICAgICAgICAgICAgICdsb2NhdGlvbic6ICfQnNC10YHRgtC+0L3QsNGF0L7QttC00LXQvdC40LUnLFxyXG4gICAgICAgICAgICAgICAgJ3RpbWUnOiAn0JLRgNC10LzRjydcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGludGVyZmFjZSBJTWFya2Rvd25CaW5kaW5ncyB7XHJcbiAgICAgICAgW2tleTogc3RyaW5nXTogYW55O1xyXG5cclxuICAgICAgICB0ZXh0OiBhbnk7XHJcbiAgICAgICAgaXNMaXN0OiBhbnk7XHJcbiAgICAgICAgY2xhbXA6IGFueTtcclxuICAgICAgICByZWJpbmQ6IGFueTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBNYXJrZG93bkJpbmRpbmdzOiBJTWFya2Rvd25CaW5kaW5ncyA9IHtcclxuICAgICAgICB0ZXh0OiAnPHBpcFRleHQnLFxyXG4gICAgICAgIGlzTGlzdDogJzw/cGlwTGlzdCcsXHJcbiAgICAgICAgY2xhbXA6ICc8P3BpcExpbmVDb3VudCcsXHJcbiAgICAgICAgcmViaW5kOiAnPD9waXBSZWJpbmQnXHJcbiAgICB9XHJcblxyXG4gICAgY2xhc3MgTWFya2Rvd25DaGFuZ2VzIGltcGxlbWVudHMgbmcuSU9uQ2hhbmdlc09iamVjdCwgSU1hcmtkb3duQmluZGluZ3Mge1xyXG4gICAgICAgIFtrZXk6IHN0cmluZ106IG5nLklDaGFuZ2VzT2JqZWN0IDwgYW55ID4gO1xyXG5cclxuICAgICAgICB0ZXh0OiBuZy5JQ2hhbmdlc09iamVjdCA8IHN0cmluZyA+IDtcclxuICAgICAgICBpc0xpc3Q6IG5nLklDaGFuZ2VzT2JqZWN0IDwgYm9vbGVhbiA+IDtcclxuICAgICAgICBjbGFtcDogbmcuSUNoYW5nZXNPYmplY3QgPCBudW1iZXIgfCBzdHJpbmcgPiA7XHJcbiAgICAgICAgcmViaW5kOiBuZy5JQ2hhbmdlc09iamVjdCA8IGJvb2xlYW4gPiA7XHJcbiAgICB9XHJcblxyXG4gICAgY2xhc3MgTWFya2Rvd25Db250cm9sbGVyIGltcGxlbWVudHMgSU1hcmtkb3duQmluZGluZ3MsIG5nLklDb250cm9sbGVyIHtcclxuICAgICAgICBwcml2YXRlIF9waXBUcmFuc2xhdGU7XHJcblxyXG4gICAgICAgIHB1YmxpYyB0ZXh0OiBzdHJpbmc7XHJcbiAgICAgICAgcHVibGljIGlzTGlzdDogYm9vbGVhbjtcclxuICAgICAgICBwdWJsaWMgY2xhbXA6IHN0cmluZyB8IG51bWJlcjtcclxuICAgICAgICBwdWJsaWMgcmViaW5kOiBib29sZWFuO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICAgICAgcHJpdmF0ZSAkc2NvcGU6IGFuZ3VsYXIuSVNjb3BlLFxyXG4gICAgICAgICAgICBwcml2YXRlICRlbGVtZW50OiBKUXVlcnksXHJcbiAgICAgICAgICAgICRpbmplY3RvcjogbmcuYXV0by5JSW5qZWN0b3JTZXJ2aWNlXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3BpcFRyYW5zbGF0ZSA9ICRpbmplY3Rvci5oYXMoJ3BpcFRyYW5zbGF0ZScpID8gJGluamVjdG9yLmdldCgncGlwVHJhbnNsYXRlJykgOiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljICRwb3N0TGluaygpIHtcclxuICAgICAgICAgICAgLy8gRmlsbCB0aGUgdGV4dFxyXG4gICAgICAgICAgICB0aGlzLmJpbmRUZXh0KHRoaXMudGV4dCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLiRzY29wZS4kb24oJ3BpcFdpbmRvd1Jlc2l6ZWQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5iaW5kVGV4dCkgdGhpcy5iaW5kVGV4dCh0aGlzLl90ZXh0KHRoaXMuXyRzY29wZSkpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIEFkZCBjbGFzc1xyXG4gICAgICAgICAgICB0aGlzLiRlbGVtZW50LmFkZENsYXNzKCdwaXAtbWFya2Rvd24nKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgJG9uQ2hhbmdlcyhjaGFuZ2VzOiBNYXJrZG93bkNoYW5nZXMpIHtcclxuICAgICAgICAgICAgY29uc3QgbmV3VGV4dCA9IGNoYW5nZXMudGV4dC5jdXJyZW50VmFsdWU7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5yZWJpbmQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudGV4dCA9IG5ld1RleHQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJpbmRUZXh0KHRoaXMudGV4dCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgZGVzY3JpYmVBdHRhY2htZW50cyhhcnJheSkge1xyXG4gICAgICAgICAgICB2YXIgYXR0YWNoU3RyaW5nID0gJycsXHJcbiAgICAgICAgICAgICAgICBhdHRhY2hUeXBlcyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgXy5lYWNoKGFycmF5LCBmdW5jdGlvbiAoYXR0YWNoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYXR0YWNoLnR5cGUgJiYgYXR0YWNoLnR5cGUgIT09ICd0ZXh0Jykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhdHRhY2hTdHJpbmcubGVuZ3RoID09PSAwICYmIHRoaXMuX3BpcFRyYW5zbGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRhY2hTdHJpbmcgPSB0aGlzLl9waXBUcmFuc2xhdGUudHJhbnNsYXRlKCdNQVJLRE9XTl9BVFRBQ0hNRU5UUycpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGF0dGFjaFR5cGVzLmluZGV4T2YoYXR0YWNoLnR5cGUpIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRhY2hUeXBlcy5wdXNoKGF0dGFjaC50eXBlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXR0YWNoU3RyaW5nICs9IGF0dGFjaFR5cGVzLmxlbmd0aCA+IDEgPyAnLCAnIDogJyAnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fcGlwVHJhbnNsYXRlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0YWNoU3RyaW5nICs9IHRoaXMuX3BpcFRyYW5zbGF0ZS50cmFuc2xhdGUoYXR0YWNoLnR5cGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gYXR0YWNoU3RyaW5nO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBiaW5kVGV4dCh2YWx1ZSkge1xyXG4gICAgICAgICAgICBsZXQgdGV4dFN0cmluZywgaXNDbGFtcGVkLCBoZWlnaHQsIG9wdGlvbnMsIG9iajtcclxuXHJcbiAgICAgICAgICAgIGlmIChfLmlzQXJyYXkodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICBvYmogPSBfLmZpbmQodmFsdWUsIGZ1bmN0aW9uIChpdGVtOiBhbnkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXRlbS50eXBlID09PSAndGV4dCcgJiYgaXRlbS50ZXh0O1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGV4dFN0cmluZyA9IG9iaiA/IG9iai50ZXh0IDogdGhpcy5kZXNjcmliZUF0dGFjaG1lbnRzKHZhbHVlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRleHRTdHJpbmcgPSB2YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaXNDbGFtcGVkID0gdGhpcy5jbGFtcCAmJiBfLmlzTnVtYmVyKHRoaXMuY2xhbXApO1xyXG4gICAgICAgICAgICBpc0NsYW1wZWQgPSBpc0NsYW1wZWQgJiYgdGV4dFN0cmluZyAmJiB0ZXh0U3RyaW5nLmxlbmd0aCA+IDA7XHJcbiAgICAgICAgICAgIG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICBnZm06IHRydWUsXHJcbiAgICAgICAgICAgICAgICB0YWJsZXM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBicmVha3M6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBzYW5pdGl6ZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHBlZGFudGljOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgc21hcnRMaXN0czogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHNtYXJ0eXBlbnRzOiBmYWxzZVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB0ZXh0U3RyaW5nID0gbWFya2VkKHRleHRTdHJpbmcgfHwgJycsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICBpZiAoaXNDbGFtcGVkKSB7XHJcbiAgICAgICAgICAgICAgICBoZWlnaHQgPSAxLjUgKiBOdW1iZXIodGhpcy5jbGFtcCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gQXNzaWduIHZhbHVlIGFzIEhUTUxcclxuICAgICAgICAgICAgdGhpcy4kZWxlbWVudC5odG1sKCc8ZGl2JyArIChpc0NsYW1wZWQgPyB0aGlzLmlzTGlzdCA/ICdjbGFzcz1cInBpcC1tYXJrZG93bi1jb250ZW50ICcgK1xyXG4gICAgICAgICAgICAgICAgJ3BpcC1tYXJrZG93bi1saXN0XCIgc3R5bGU9XCJtYXgtaGVpZ2h0OiAnICsgaGVpZ2h0ICsgJ2VtXCI+JyA6XHJcbiAgICAgICAgICAgICAgICAnIGNsYXNzPVwicGlwLW1hcmtkb3duLWNvbnRlbnRcIiBzdHlsZT1cIm1heC1oZWlnaHQ6ICcgKyBoZWlnaHQgKyAnZW1cIj4nIDogdGhpcy5pc0xpc3QgP1xyXG4gICAgICAgICAgICAgICAgJyBjbGFzcz1cInBpcC1tYXJrZG93bi1saXN0XCI+JyA6ICc+JykgKyB0ZXh0U3RyaW5nICsgJzwvZGl2PicpO1xyXG4gICAgICAgICAgICB0aGlzLiRlbGVtZW50LmZpbmQoJ2EnKS5hdHRyKCd0YXJnZXQnLCAnYmxhbmsnKTtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmlzTGlzdCAmJiBpc0NsYW1wZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuJGVsZW1lbnQuYXBwZW5kKCc8ZGl2IGNsYXNzPVwicGlwLWdyYWRpZW50LWJsb2NrXCI+PC9kaXY+Jyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCBNYXJrZG93bkNvbXBvbmVudCA9IHtcclxuICAgICAgICBjb250cm9sbGVyOiBNYXJrZG93bkNvbnRyb2xsZXIsXHJcbiAgICAgICAgYmluZGluZ3M6IE1hcmtkb3duQmluZGluZ3NcclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncGlwTWFya2Rvd24nLCBbJ25nU2FuaXRpemUnXSlcclxuICAgICAgICAucnVuKENvbmZpZ1RyYW5zbGF0aW9ucylcclxuICAgICAgICAuY29tcG9uZW50KCdwaXBNYXJrZG93bicsIE1hcmtkb3duQ29tcG9uZW50KTtcclxufSIsIntcclxuICAgIGludGVyZmFjZSBJUG9wb3ZlckJpbmRpbmdzIHtcclxuICAgICAgICBba2V5OiBzdHJpbmddOiBhbnk7XHJcblxyXG4gICAgICAgIHBhcmFtczogYW55O1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IFBvcG92ZXJCaW5kaW5nczogSVBvcG92ZXJCaW5kaW5ncyA9IHtcclxuICAgICAgICBwYXJhbXM6ICc8cGlwUGFyYW1zJ1xyXG4gICAgfVxyXG5cclxuICAgIGNsYXNzIFBvcG92ZXJDb250cm9sbGVyIGltcGxlbWVudHMgSVBvcG92ZXJCaW5kaW5ncywgbmcuSUNvbnRyb2xsZXIge1xyXG4gICAgICAgIHByaXZhdGUgYmFja2Ryb3BFbGVtZW50O1xyXG4gICAgICAgIHByaXZhdGUgY29udGVudDtcclxuICAgICAgICBwdWJsaWMgcGFyYW1zOiBhbnk7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgICAgICBwcml2YXRlICRzY29wZTogbmcuSVNjb3BlLFxyXG4gICAgICAgICAgICAkcm9vdFNjb3BlOiBuZy5JUm9vdFNjb3BlU2VydmljZSxcclxuICAgICAgICAgICAgJGVsZW1lbnQ6IEpRdWVyeSxcclxuICAgICAgICAgICAgcHJpdmF0ZSAkdGltZW91dDogbmcuSVRpbWVvdXRTZXJ2aWNlLFxyXG4gICAgICAgICAgICBwcml2YXRlICRjb21waWxlOiBuZy5JQ29tcGlsZVNlcnZpY2UsXHJcbiAgICAgICAgICAgIHByaXZhdGUgJHRlbXBsYXRlUmVxdWVzdDogbmcuSVRlbXBsYXRlUmVxdWVzdFNlcnZpY2VcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgdGhpcy5iYWNrZHJvcEVsZW1lbnQgPSAkKCcucGlwLXBvcG92ZXItYmFja2Ryb3AnKTtcclxuICAgICAgICAgICAgdGhpcy5iYWNrZHJvcEVsZW1lbnQub24oJ2NsaWNrIGtleWRvd24gc2Nyb2xsJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5iYWNrZHJvcENsaWNrKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLmJhY2tkcm9wRWxlbWVudC5hZGRDbGFzcyh0aGlzLnBhcmFtcy5yZXNwb25zaXZlICE9PSBmYWxzZSA/ICdwaXAtcmVzcG9uc2l2ZScgOiAnJyk7XHJcblxyXG4gICAgICAgICAgICAkdGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvc2l0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICBhbmd1bGFyLmV4dGVuZCgkc2NvcGUsIHRoaXMucGFyYW1zLmxvY2Fscyk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucGFyYW1zLnRlbXBsYXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50ID0gJGNvbXBpbGUodGhpcy5wYXJhbXMudGVtcGxhdGUpKCRzY29wZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgJGVsZW1lbnQuZmluZCgnLnBpcC1wb3BvdmVyJykuYXBwZW5kKHRoaXMuY29udGVudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLiR0ZW1wbGF0ZVJlcXVlc3QodGhpcy5wYXJhbXMudGVtcGxhdGVVcmwsIGZhbHNlKS50aGVuKChodG1sKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudCA9ICRjb21waWxlKGh0bWwpKCRzY29wZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRlbGVtZW50LmZpbmQoJy5waXAtcG9wb3ZlcicpLmFwcGVuZCh0aGlzLmNvbnRlbnQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbml0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJHRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYWxjSGVpZ2h0KCk7XHJcbiAgICAgICAgICAgIH0sIDIwMCk7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJG9uKCdwaXBQb3BvdmVyUmVzaXplJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vblJlc2l6ZSgpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkKHdpbmRvdykucmVzaXplKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMub25SZXNpemUoKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBiYWNrZHJvcENsaWNrKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5wYXJhbXMuY2FuY2VsQ2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGFyYW1zLmNhbmNlbENhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5jbG9zZVBvcG92ZXIoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBjbG9zZVBvcG92ZXIoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYmFja2Ryb3BFbGVtZW50LnJlbW92ZUNsYXNzKCdvcGVuZWQnKTtcclxuICAgICAgICAgICAgdGhpcy4kdGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJhY2tkcm9wRWxlbWVudC5yZW1vdmUoKTtcclxuICAgICAgICAgICAgfSwgMTAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBvblBvcG92ZXJDbGljayhldmVudCkge1xyXG4gICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgaW5pdCgpIHtcclxuICAgICAgICAgICAgdGhpcy5iYWNrZHJvcEVsZW1lbnQuYWRkQ2xhc3MoJ29wZW5lZCcpO1xyXG4gICAgICAgICAgICAkKCcucGlwLXBvcG92ZXItYmFja2Ryb3AnKS5mb2N1cygpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5wYXJhbXMudGltZW91dCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kdGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZVBvcG92ZXIoKTtcclxuICAgICAgICAgICAgICAgIH0sIHRoaXMucGFyYW1zLnRpbWVvdXQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHBvc2l0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5wYXJhbXMuZWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSAkKHRoaXMucGFyYW1zLmVsZW1lbnQpLFxyXG4gICAgICAgICAgICAgICAgICAgIHBvcyA9IGVsZW1lbnQub2Zmc2V0KCksXHJcbiAgICAgICAgICAgICAgICAgICAgd2lkdGggPSBlbGVtZW50LndpZHRoKCksXHJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0ID0gZWxlbWVudC5oZWlnaHQoKSxcclxuICAgICAgICAgICAgICAgICAgICBkb2NXaWR0aCA9ICQoZG9jdW1lbnQpLndpZHRoKCksXHJcbiAgICAgICAgICAgICAgICAgICAgZG9jSGVpZ2h0ID0gJChkb2N1bWVudCkuaGVpZ2h0KCksXHJcbiAgICAgICAgICAgICAgICAgICAgcG9wb3ZlciA9IHRoaXMuYmFja2Ryb3BFbGVtZW50LmZpbmQoJy5waXAtcG9wb3ZlcicpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChwb3MpIHtcclxuICAgICAgICAgICAgICAgICAgICBwb3BvdmVyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jc3MoJ21heC13aWR0aCcsIGRvY1dpZHRoIC0gKGRvY1dpZHRoIC0gcG9zLmxlZnQpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuY3NzKCdtYXgtaGVpZ2h0JywgZG9jSGVpZ2h0IC0gKHBvcy50b3AgKyBoZWlnaHQpIC0gMzIsIDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jc3MoJ2xlZnQnLCBwb3MubGVmdCAtIHBvcG92ZXIud2lkdGgoKSArIHdpZHRoIC8gMilcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmNzcygndG9wJywgcG9zLnRvcCArIGhlaWdodCArIDE2KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBvblJlc2l6ZSgpIHtcclxuICAgICAgICAgICAgdGhpcy5iYWNrZHJvcEVsZW1lbnQuZmluZCgnLnBpcC1wb3BvdmVyJykuZmluZCgnLnBpcC1jb250ZW50JykuY3NzKCdtYXgtaGVpZ2h0JywgJzEwMCUnKTtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbigpO1xyXG4gICAgICAgICAgICB0aGlzLmNhbGNIZWlnaHQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgY2FsY0hlaWdodCgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucGFyYW1zLmNhbGNIZWlnaHQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgcG9wb3ZlciA9IHRoaXMuYmFja2Ryb3BFbGVtZW50LmZpbmQoJy5waXAtcG9wb3ZlcicpLFxyXG4gICAgICAgICAgICAgICAgdGl0bGUgPSBwb3BvdmVyLmZpbmQoJy5waXAtdGl0bGUnKSxcclxuICAgICAgICAgICAgICAgIGZvb3RlciA9IHBvcG92ZXIuZmluZCgnLnBpcC1mb290ZXInKSxcclxuICAgICAgICAgICAgICAgIGNvbnRlbnQgPSBwb3BvdmVyLmZpbmQoJy5waXAtY29udGVudCcpLFxyXG4gICAgICAgICAgICAgICAgY29udGVudEhlaWdodCA9IHBvcG92ZXIuaGVpZ2h0KCkgLSB0aXRsZS5vdXRlckhlaWdodCh0cnVlKSAtIGZvb3Rlci5vdXRlckhlaWdodCh0cnVlKTtcclxuICAgICAgICAgICAgY29udGVudC5jc3MoJ21heC1oZWlnaHQnLCBNYXRoLm1heChjb250ZW50SGVpZ2h0LCAwKSArICdweCcpLmNzcygnYm94LXNpemluZycsICdib3JkZXItYm94Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IFBvcG92ZXI6IG5nLklDb21wb25lbnRPcHRpb25zID0ge1xyXG4gICAgICAgIGJpbmRpbmdzOiBQb3BvdmVyQmluZGluZ3MsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdwb3BvdmVyL1BvcG92ZXIuaHRtbCcsXHJcbiAgICAgICAgY29udHJvbGxlcjogUG9wb3ZlckNvbnRyb2xsZXJcclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncGlwUG9wb3ZlcicpXHJcbiAgICAgICAgLmNvbXBvbmVudCgncGlwUG9wb3ZlcicsIFBvcG92ZXIpO1xyXG59IiwiaW1wb3J0IHsgSVBvcG92ZXJTZXJ2aWNlIH0gZnJvbSAnLi9JUG9wb3ZlclNlcnZpY2UnO1xyXG5cclxue1xyXG4gICAgaW50ZXJmYWNlIFBvcG92ZXJUZW1wbGF0ZVNjb3BlIGV4dGVuZHMgbmcuSVNjb3BlIHtcclxuICAgICAgICBwYXJhbXMgPyA6IGFueTtcclxuICAgICAgICBsb2NhbHMgPyA6IGFueTtcclxuICAgIH1cclxuXHJcbiAgICBjbGFzcyBQb3BvdmVyU2VydmljZSBpbXBsZW1lbnRzIElQb3BvdmVyU2VydmljZSB7XHJcbiAgICAgICAgcHJpdmF0ZSBwb3BvdmVyVGVtcGxhdGU6IHN0cmluZztcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgICAgIHByaXZhdGUgJGNvbXBpbGU6IG5nLklDb21waWxlU2VydmljZSxcclxuICAgICAgICAgICAgcHJpdmF0ZSAkcm9vdFNjb3BlOiBuZy5JUm9vdFNjb3BlU2VydmljZSxcclxuICAgICAgICAgICAgcHJpdmF0ZSAkdGltZW91dDogbmcuSVRpbWVvdXRTZXJ2aWNlXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIHRoaXMucG9wb3ZlclRlbXBsYXRlID0gXCI8ZGl2IGNsYXNzPSdwaXAtcG9wb3Zlci1iYWNrZHJvcCB7eyBwYXJhbXMuY2xhc3MgfX0nIG5nLWNvbnRyb2xsZXI9J3BhcmFtcy5jb250cm9sbGVyJ1wiICtcclxuICAgICAgICAgICAgICAgIFwiIHRhYmluZGV4PScxJz4gPHBpcC1wb3BvdmVyIHBpcC1wYXJhbXM9J3BhcmFtcyc+IDwvcGlwLXBvcG92ZXI+IDwvZGl2PlwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHNob3cocDogT2JqZWN0KSB7XHJcbiAgICAgICAgICAgIGxldCBlbGVtZW50OiBKUXVlcnksIHNjb3BlOiBQb3BvdmVyVGVtcGxhdGVTY29wZSwgcGFyYW1zOiBhbnksIGNvbnRlbnQ6IG5nLklSb290RWxlbWVudFNlcnZpY2U7XHJcblxyXG4gICAgICAgICAgICBlbGVtZW50ID0gJCgnYm9keScpO1xyXG4gICAgICAgICAgICBpZiAoZWxlbWVudC5maW5kKCdtZC1iYWNrZHJvcCcpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmhpZGUoKTtcclxuICAgICAgICAgICAgc2NvcGUgPSB0aGlzLiRyb290U2NvcGUuJG5ldygpO1xyXG4gICAgICAgICAgICBwYXJhbXMgPSBwICYmIF8uaXNPYmplY3QocCkgPyBwIDoge307XHJcbiAgICAgICAgICAgIHNjb3BlLnBhcmFtcyA9IHBhcmFtcztcclxuICAgICAgICAgICAgc2NvcGUubG9jYWxzID0gcGFyYW1zLmxvY2FscztcclxuICAgICAgICAgICAgY29udGVudCA9IHRoaXMuJGNvbXBpbGUodGhpcy5wb3BvdmVyVGVtcGxhdGUpKHNjb3BlKTtcclxuICAgICAgICAgICAgZWxlbWVudC5hcHBlbmQoY29udGVudCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgaGlkZSgpIHtcclxuICAgICAgICAgICAgY29uc3QgYmFja2Ryb3BFbGVtZW50ID0gJCgnLnBpcC1wb3BvdmVyLWJhY2tkcm9wJyk7XHJcbiAgICAgICAgICAgIGJhY2tkcm9wRWxlbWVudC5yZW1vdmVDbGFzcygnb3BlbmVkJyk7XHJcbiAgICAgICAgICAgIHRoaXMuJHRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgYmFja2Ryb3BFbGVtZW50LnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB9LCAxMDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHJlc2l6ZSgpIHtcclxuICAgICAgICAgICAgdGhpcy4kcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3BpcFBvcG92ZXJSZXNpemUnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3BpcFBvcG92ZXIuU2VydmljZScsIFtdKVxyXG4gICAgICAgIC5zZXJ2aWNlKCdwaXBQb3BvdmVyU2VydmljZScsIFBvcG92ZXJTZXJ2aWNlKTtcclxufSIsImFuZ3VsYXIubW9kdWxlKCdwaXBQb3BvdmVyJywgWydwaXBQb3BvdmVyLlNlcnZpY2UnXSk7XHJcblxyXG5pbXBvcnQgJy4vUG9wb3Zlcic7XHJcbmltcG9ydCAnLi9Qb3BvdmVyU2VydmljZSc7XHJcblxyXG5leHBvcnQgKiBmcm9tICcuL0lQb3BvdmVyU2VydmljZSc7Iiwie1xyXG4gICAgaW50ZXJmYWNlIElSb3V0aW5nQmluZGluZ3Mge1xyXG4gICAgICAgIFtrZXk6IHN0cmluZ106IGFueTtcclxuXHJcbiAgICAgICAgbG9nb1VybDogYW55O1xyXG4gICAgICAgIHNob3dQcm9ncmVzczogYW55O1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IFJvdXRpbmdCaW5kaW5nczogSVJvdXRpbmdCaW5kaW5ncyA9IHtcclxuICAgICAgICBzaG93UHJvZ3Jlc3M6ICcmJyxcclxuICAgICAgICBsb2dvVXJsOiAnQCdcclxuICAgIH1cclxuXHJcbiAgICBjbGFzcyBSb3V0aW5nQ29udHJvbGxlciBpbXBsZW1lbnRzIG5nLklDb250cm9sbGVyLCBJUm91dGluZ0JpbmRpbmdzIHtcclxuICAgICAgICBwcml2YXRlIF9pbWFnZTogYW55O1xyXG5cclxuICAgICAgICBwdWJsaWMgbG9nb1VybDogc3RyaW5nO1xyXG4gICAgICAgIHB1YmxpYyBzaG93UHJvZ3Jlc3M6IEZ1bmN0aW9uO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICAgICAgJHNjb3BlOiBuZy5JU2NvcGUsXHJcbiAgICAgICAgICAgIHByaXZhdGUgJGVsZW1lbnQ6IEpRdWVyeVxyXG4gICAgICAgICkgeyB9XHJcblxyXG4gICAgICAgIHB1YmxpYyAkcG9zdExpbmsoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ltYWdlID0gdGhpcy4kZWxlbWVudC5maW5kKCdpbWcnKTtcclxuICAgICAgICAgICAgdGhpcy5sb2FkUHJvZ3Jlc3NJbWFnZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGxvYWRQcm9ncmVzc0ltYWdlKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5sb2dvVXJsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pbWFnZS5hdHRyKCdzcmMnLCB0aGlzLmxvZ29VcmwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IFJvdXRpbmdQcm9ncmVzczogbmcuSUNvbXBvbmVudE9wdGlvbnMgPSB7XHJcbiAgICAgICAgYmluZGluZ3M6IFJvdXRpbmdCaW5kaW5ncyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3Byb2dyZXNzL1JvdXRpbmdQcm9ncmVzcy5odG1sJyxcclxuICAgICAgICBjb250cm9sbGVyOiBSb3V0aW5nQ29udHJvbGxlclxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdwaXBSb3V0aW5nUHJvZ3Jlc3MnLCBbJ25nTWF0ZXJpYWwnXSlcclxuICAgICAgICAuY29tcG9uZW50KCdwaXBSb3V0aW5nUHJvZ3Jlc3MnLCBSb3V0aW5nUHJvZ3Jlc3MpO1xyXG59IiwiZXhwb3J0IGNsYXNzIFRvYXN0IHtcclxuICAgIHR5cGU6IHN0cmluZztcclxuICAgIGlkOiBzdHJpbmc7XHJcbiAgICBlcnJvcjogYW55O1xyXG4gICAgbWVzc2FnZTogc3RyaW5nO1xyXG4gICAgYWN0aW9uczogc3RyaW5nW107XHJcbiAgICBkdXJhdGlvbjogbnVtYmVyO1xyXG4gICAgc3VjY2Vzc0NhbGxiYWNrOiBGdW5jdGlvbjtcclxuICAgIGNhbmNlbENhbGxiYWNrOiBGdW5jdGlvblxyXG59XHJcbiIsImltcG9ydCB7IFRvYXN0IH0gZnJvbSAnLi9Ub2FzdCc7XHJcbmltcG9ydCB7IElUb2FzdFNlcnZpY2UgfSBmcm9tICcuL0lUb2FzdFNlcnZpY2UnO1xyXG5cclxue1xyXG4gICAgY2xhc3MgVG9hc3RDb250cm9sbGVyIHtcclxuICAgICAgICBwcml2YXRlIF9waXBFcnJvckRldGFpbHNEaWFsb2c7XHJcblxyXG4gICAgICAgIHB1YmxpYyBtZXNzYWdlOiBzdHJpbmc7XHJcbiAgICAgICAgcHVibGljIGFjdGlvbnM6IHN0cmluZ1tdO1xyXG4gICAgICAgIHB1YmxpYyBhY3Rpb25MZW5naHQ6IG51bWJlcjtcclxuICAgICAgICBwdWJsaWMgc2hvd0RldGFpbHM6IGJvb2xlYW47XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgICAgICBwcml2YXRlICRtZFRvYXN0OiBhbmd1bGFyLm1hdGVyaWFsLklUb2FzdFNlcnZpY2UsXHJcbiAgICAgICAgICAgIHB1YmxpYyB0b2FzdDogVG9hc3QsXHJcbiAgICAgICAgICAgICRpbmplY3RvcjogbmcuYXV0by5JSW5qZWN0b3JTZXJ2aWNlXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3BpcEVycm9yRGV0YWlsc0RpYWxvZyA9ICRpbmplY3Rvci5oYXMoJ3BpcEVycm9yRGV0YWlsc0RpYWxvZycpID9cclxuICAgICAgICAgICAgICAgICRpbmplY3Rvci5nZXQoJ3BpcEVycm9yRGV0YWlsc0RpYWxvZycpIDogbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5tZXNzYWdlID0gdG9hc3QubWVzc2FnZTtcclxuICAgICAgICAgICAgdGhpcy5hY3Rpb25zID0gdG9hc3QuYWN0aW9ucztcclxuXHJcbiAgICAgICAgICAgIGlmICh0b2FzdC5hY3Rpb25zLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hY3Rpb25MZW5naHQgPSAwO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hY3Rpb25MZW5naHQgPSB0b2FzdC5hY3Rpb25zLmxlbmd0aCA9PT0gMSA/IHRvYXN0LmFjdGlvbnNbMF0udG9TdHJpbmcoKS5sZW5ndGggOiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLnNob3dEZXRhaWxzID0gdGhpcy5fcGlwRXJyb3JEZXRhaWxzRGlhbG9nICE9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgb25EZXRhaWxzKCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLiRtZFRvYXN0LmhpZGUoKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3BpcEVycm9yRGV0YWlsc0RpYWxvZykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcGlwRXJyb3JEZXRhaWxzRGlhbG9nLnNob3coe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogdGhpcy50b2FzdC5lcnJvcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2s6ICdPaydcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIubm9vcCxcclxuICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLm5vb3BcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBvbkFjdGlvbihhY3Rpb24pOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy4kbWRUb2FzdC5oaWRlKHtcclxuICAgICAgICAgICAgICAgIGFjdGlvbjogYWN0aW9uLFxyXG4gICAgICAgICAgICAgICAgaWQ6IHRoaXMudG9hc3QuaWQsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiB0aGlzLm1lc3NhZ2VcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNsYXNzIFRvYXN0U2VydmljZSBpbXBsZW1lbnRzIElUb2FzdFNlcnZpY2Uge1xyXG4gICAgICAgIHByaXZhdGUgU0hPV19USU1FT1VUOiBudW1iZXIgPSAyMDAwMDtcclxuICAgICAgICBwcml2YXRlIFNIT1dfVElNRU9VVF9OT1RJRklDQVRJT05TOiBudW1iZXIgPSAyMDAwMDtcclxuICAgICAgICBwcml2YXRlIHRvYXN0czogVG9hc3RbXSA9IFtdO1xyXG4gICAgICAgIHByaXZhdGUgY3VycmVudFRvYXN0OiBhbnk7XHJcbiAgICAgICAgcHJpdmF0ZSBzb3VuZHM6IGFueSA9IHt9O1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICAgICAgJHJvb3RTY29wZTogbmcuSVJvb3RTY29wZVNlcnZpY2UsXHJcbiAgICAgICAgICAgIHByaXZhdGUgJG1kVG9hc3Q6IGFuZ3VsYXIubWF0ZXJpYWwuSVRvYXN0U2VydmljZVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3VjY2VzcycsICgpID0+IHsgdGhpcy5vblN0YXRlQ2hhbmdlU3VjY2VzcygpIH0pO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRvbigncGlwU2Vzc2lvbkNsb3NlZCcsICgpID0+IHsgdGhpcy5vbkNsZWFyVG9hc3RzKCkgfSk7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJG9uKCdwaXBJZGVudGl0eUNoYW5nZWQnLCAoKSA9PiB7IHRoaXMub25DbGVhclRvYXN0cygpIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHNob3dOZXh0VG9hc3QoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGxldCB0b2FzdDogVG9hc3Q7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy50b2FzdHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgdG9hc3QgPSB0aGlzLnRvYXN0c1swXTtcclxuICAgICAgICAgICAgICAgIHRoaXMudG9hc3RzLnNwbGljZSgwLCAxKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hvd1RvYXN0KHRvYXN0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gU2hvdyB0b2FzdFxyXG4gICAgICAgIHB1YmxpYyBzaG93VG9hc3QodG9hc3Q6IFRvYXN0KTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFRvYXN0ID0gdG9hc3Q7XHJcblxyXG4gICAgICAgICAgICB0aGlzLiRtZFRvYXN0LnNob3coe1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndG9hc3QvVG9hc3QuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgaGlkZURlbGF5OiB0b2FzdC5kdXJhdGlvbiB8fCB0aGlzLlNIT1dfVElNRU9VVCxcclxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2JvdHRvbSBsZWZ0JyxcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBUb2FzdENvbnRyb2xsZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gICAgICAgICAgICAgICAgICAgIGxvY2Fsczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b2FzdDogdGhpcy5jdXJyZW50VG9hc3QsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdW5kczogdGhpcy5zb3VuZHNcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oXHJcbiAgICAgICAgICAgICAgICAgICAgKGFjdGlvbjogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd1RvYXN0T2tSZXN1bHQoYWN0aW9uKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIChhY3Rpb246IHN0cmluZykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNob3dUb2FzdENhbmNlbFJlc3VsdChhY3Rpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHNob3dUb2FzdENhbmNlbFJlc3VsdChhY3Rpb246IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50VG9hc3QuY2FuY2VsQ2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFRvYXN0LmNhbmNlbENhbGxiYWNrKGFjdGlvbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50VG9hc3QgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLnNob3dOZXh0VG9hc3QoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgc2hvd1RvYXN0T2tSZXN1bHQoYWN0aW9uOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudFRvYXN0LnN1Y2Nlc3NDYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50VG9hc3Quc3VjY2Vzc0NhbGxiYWNrKGFjdGlvbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50VG9hc3QgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLnNob3dOZXh0VG9hc3QoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBhZGRUb2FzdCh0b2FzdCk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50VG9hc3QgJiYgdG9hc3QudHlwZSAhPT0gJ2Vycm9yJykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50b2FzdHMucHVzaCh0b2FzdCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dUb2FzdCh0b2FzdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyByZW1vdmVUb2FzdHModHlwZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdDogYW55W10gPSBbXTtcclxuICAgICAgICAgICAgXy5lYWNoKHRoaXMudG9hc3RzLCAodG9hc3QpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICghdG9hc3QudHlwZSB8fCB0b2FzdC50eXBlICE9PSB0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2godG9hc3QpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy50b2FzdHMgPSBfLmNsb25lRGVlcChyZXN1bHQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHJlbW92ZVRvYXN0c0J5SWQoaWQ6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgICAgICBfLnJlbW92ZSh0aGlzLnRvYXN0cywge1xyXG4gICAgICAgICAgICAgICAgaWQ6IGlkXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGdldFRvYXN0QnlJZChpZDogc3RyaW5nKTogVG9hc3Qge1xyXG4gICAgICAgICAgICByZXR1cm4gXy5maW5kKHRoaXMudG9hc3RzLCB7XHJcbiAgICAgICAgICAgICAgICBpZDogaWRcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgb25TdGF0ZUNoYW5nZVN1Y2Nlc3MoKSB7fVxyXG5cclxuICAgICAgICBwdWJsaWMgb25DbGVhclRvYXN0cygpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5jbGVhclRvYXN0cyhudWxsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzaG93Tm90aWZpY2F0aW9uKG1lc3NhZ2U6IHN0cmluZywgYWN0aW9uczogc3RyaW5nW10sIHN1Y2Nlc3NDYWxsYmFjaywgY2FuY2VsQ2FsbGJhY2ssIGlkOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5hZGRUb2FzdCh7XHJcbiAgICAgICAgICAgICAgICBpZDogaWQgfHwgbnVsbCxcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdub3RpZmljYXRpb24nLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogbWVzc2FnZSxcclxuICAgICAgICAgICAgICAgIGFjdGlvbnM6IGFjdGlvbnMgfHwgWydvayddLFxyXG4gICAgICAgICAgICAgICAgc3VjY2Vzc0NhbGxiYWNrOiBzdWNjZXNzQ2FsbGJhY2ssXHJcbiAgICAgICAgICAgICAgICBjYW5jZWxDYWxsYmFjazogY2FuY2VsQ2FsbGJhY2ssXHJcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogdGhpcy5TSE9XX1RJTUVPVVRfTk9USUZJQ0FUSU9OU1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzaG93TWVzc2FnZShtZXNzYWdlOiBzdHJpbmcsIHN1Y2Nlc3NDYWxsYmFjaywgY2FuY2VsQ2FsbGJhY2ssIGlkID8gOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5hZGRUb2FzdCh7XHJcbiAgICAgICAgICAgICAgICBpZDogaWQgfHwgbnVsbCxcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdtZXNzYWdlJyxcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICBhY3Rpb25zOiBbJ29rJ10sXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzQ2FsbGJhY2s6IHN1Y2Nlc3NDYWxsYmFjayxcclxuICAgICAgICAgICAgICAgIGNhbmNlbENhbGxiYWNrOiBjYW5jZWxDYWxsYmFja1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzaG93RXJyb3IobWVzc2FnZTogc3RyaW5nLCBzdWNjZXNzQ2FsbGJhY2ssIGNhbmNlbENhbGxiYWNrLCBpZDogc3RyaW5nLCBlcnJvcjogYW55KSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkVG9hc3Qoe1xyXG4gICAgICAgICAgICAgICAgaWQ6IGlkIHx8IG51bGwsXHJcbiAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3IsXHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnZXJyb3InLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogbWVzc2FnZSB8fCAnVW5rbm93biBlcnJvci4nLFxyXG4gICAgICAgICAgICAgICAgYWN0aW9uczogWydvayddLFxyXG4gICAgICAgICAgICAgICAgc3VjY2Vzc0NhbGxiYWNrOiBzdWNjZXNzQ2FsbGJhY2ssXHJcbiAgICAgICAgICAgICAgICBjYW5jZWxDYWxsYmFjazogY2FuY2VsQ2FsbGJhY2tcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgaGlkZUFsbFRvYXN0cygpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy4kbWRUb2FzdC5jYW5jZWwoKTtcclxuICAgICAgICAgICAgdGhpcy50b2FzdHMgPSBbXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBjbGVhclRvYXN0cyh0eXBlID8gOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGUpIHtcclxuICAgICAgICAgICAgICAgIC8vIHBpcEFzc2VydC5pc1N0cmluZyh0eXBlLCAncGlwVG9hc3RzLmNsZWFyVG9hc3RzOiB0eXBlIHNob3VsZCBiZSBhIHN0cmluZycpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVUb2FzdHModHlwZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRtZFRvYXN0LmNhbmNlbCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50b2FzdHMgPSBbXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3BpcFRvYXN0cycpXHJcbiAgICAgICAgLnNlcnZpY2UoJ3BpcFRvYXN0cycsIFRvYXN0U2VydmljZSk7XHJcbn0iLCJhbmd1bGFyLm1vZHVsZSgncGlwVG9hc3RzJywgWyduZ01hdGVyaWFsJywgJ3BpcENvbnRyb2xzLlRyYW5zbGF0ZSddKVxyXG5cclxuaW1wb3J0ICcuL1RvYXN0U2VydmljZSc7XHJcbmltcG9ydCAnLi9Ub2FzdCc7XHJcblxyXG5leHBvcnQgKiBmcm9tICcuL0lUb2FzdFNlcnZpY2UnOyIsIihmdW5jdGlvbihtb2R1bGUpIHtcbnRyeSB7XG4gIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBDb250cm9scy5UZW1wbGF0ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcENvbnRyb2xzLlRlbXBsYXRlcycsIFtdKTtcbn1cbm1vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgnY29sb3JfcGlja2VyL0NvbG9yUGlja2VyLmh0bWwnLFxuICAgICc8dWwgY2xhc3M9XCJwaXAtY29sb3ItcGlja2VyIHt7JGN0cmwuY2xhc3N9fVwiIHBpcC1zZWxlY3RlZD1cIiRjdHJsLmN1cnJlbnRDb2xvckluZGV4XCIgcGlwLWVudGVyLXNwYWNlLXByZXNzPVwiJGN0cmwuZW50ZXJTcGFjZVByZXNzKCRldmVudClcIj48bGkgdGFiaW5kZXg9XCItMVwiIG5nLXJlcGVhdD1cImNvbG9yIGluICRjdHJsLmNvbG9ycyB0cmFjayBieSBjb2xvclwiPjxtZC1idXR0b24gdGFiaW5kZXg9XCItMVwiIGNsYXNzPVwibWQtaWNvbi1idXR0b24gcGlwLXNlbGVjdGFibGVcIiBuZy1jbGljaz1cIiRjdHJsLnNlbGVjdENvbG9yKCRpbmRleClcIiBhcmlhLWxhYmVsPVwiY29sb3JcIiBuZy1kaXNhYmxlZD1cIiRjdHJsLm5nRGlzYWJsZWRcIj48bWQtaWNvbiBuZy1zdHlsZT1cIntcXCdjb2xvclxcJzogY29sb3J9XCIgbWQtc3ZnLWljb249XCJpY29uczp7eyBjb2xvciA9PSAkY3RybC5jdXJyZW50Q29sb3IgPyBcXCdjaXJjbGVcXCcgOiBcXCdyYWRpby1vZmZcXCcgfX1cIj48L21kLWljb24+PC9tZC1idXR0b24+PC9saT48L3VsPicpO1xufV0pO1xufSkoKTtcblxuKGZ1bmN0aW9uKG1vZHVsZSkge1xudHJ5IHtcbiAgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcENvbnRyb2xzLlRlbXBsYXRlcycpO1xufSBjYXRjaCAoZSkge1xuICBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgncGlwQ29udHJvbHMuVGVtcGxhdGVzJywgW10pO1xufVxubW9kdWxlLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCdwb3BvdmVyL1BvcG92ZXIuaHRtbCcsXG4gICAgJzxkaXYgY2xhc3M9XCJwaXAtcG9wb3ZlclwiIG5nLWNsaWNrPVwiJGN0cmwucGFyYW1zLm9uUG9wb3ZlckNsaWNrKCRldmVudClcIj48L2Rpdj4nKTtcbn1dKTtcbn0pKCk7XG5cbihmdW5jdGlvbihtb2R1bGUpIHtcbnRyeSB7XG4gIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBDb250cm9scy5UZW1wbGF0ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcENvbnRyb2xzLlRlbXBsYXRlcycsIFtdKTtcbn1cbm1vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgncHJvZ3Jlc3MvUm91dGluZ1Byb2dyZXNzLmh0bWwnLFxuICAgICc8ZGl2IGNsYXNzPVwibGF5b3V0LWNvbHVtbiBsYXlvdXQtYWxpZ24tY2VudGVyLWNlbnRlclwiIG5nLXNob3c9XCIkY3RybC5zaG93UHJvZ3Jlc3MoKVwiPjxkaXYgY2xhc3M9XCJsb2FkZXJcIj48c3ZnIGNsYXNzPVwiY2lyY3VsYXJcIiB2aWV3Ym94PVwiMjUgMjUgNTAgNTBcIj48Y2lyY2xlIGNsYXNzPVwicGF0aFwiIGN4PVwiNTBcIiBjeT1cIjUwXCIgcj1cIjIwXCIgZmlsbD1cIm5vbmVcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLW1pdGVybGltaXQ9XCIxMFwiPjwvY2lyY2xlPjwvc3ZnPjwvZGl2PjxpbWcgc3JjPVwiXCIgaGVpZ2h0PVwiNDBcIiB3aWR0aD1cIjQwXCIgY2xhc3M9XCJwaXAtaW1nXCI+PG1kLXByb2dyZXNzLWNpcmN1bGFyIG1kLWRpYW1ldGVyPVwiOTZcIiBjbGFzcz1cImZpeC1pZVwiPjwvbWQtcHJvZ3Jlc3MtY2lyY3VsYXI+PC9kaXY+Jyk7XG59XSk7XG59KSgpO1xuXG4oZnVuY3Rpb24obW9kdWxlKSB7XG50cnkge1xuICBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgncGlwQ29udHJvbHMuVGVtcGxhdGVzJyk7XG59IGNhdGNoIChlKSB7XG4gIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBDb250cm9scy5UZW1wbGF0ZXMnLCBbXSk7XG59XG5tb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoJ3RvYXN0L1RvYXN0Lmh0bWwnLFxuICAgICc8bWQtdG9hc3QgY2xhc3M9XCJtZC1hY3Rpb24gcGlwLXRvYXN0XCIgbmctY2xhc3M9XCJ7XFwncGlwLWVycm9yXFwnOiB2bS50b2FzdC50eXBlPT1cXCdlcnJvclxcJywgXFwncGlwLWNvbHVtbi10b2FzdFxcJzogdm0udG9hc3QuYWN0aW9ucy5sZW5ndGggPiAxIHx8IHZtLmFjdGlvbkxlbmdodCA+IDQsIFxcJ3BpcC1uby1hY3Rpb24tdG9hc3RcXCc6IHZtLmFjdGlvbkxlbmdodCA9PSAwfVwiIHN0eWxlPVwiaGVpZ2h0OmluaXRpYWw7IG1heC1oZWlnaHQ6IGluaXRpYWw7XCI+PHNwYW4gY2xhc3M9XCJmbGV4LXZhciBwaXAtdGV4dFwiIG5nLWJpbmQtaHRtbD1cInZtLm1lc3NhZ2VcIj48L3NwYW4+PGRpdiBjbGFzcz1cImxheW91dC1yb3cgbGF5b3V0LWFsaWduLWVuZC1zdGFydCBwaXAtYWN0aW9uc1wiIG5nLWlmPVwidm0uYWN0aW9ucy5sZW5ndGggPiAwIHx8ICh2bS50b2FzdC50eXBlPT1cXCdlcnJvclxcJyAmJiB2bS50b2FzdC5lcnJvcilcIj48ZGl2IGNsYXNzPVwiZmxleFwiIG5nLWlmPVwidm0udG9hc3QuYWN0aW9ucy5sZW5ndGggPiAxXCI+PC9kaXY+PG1kLWJ1dHRvbiBjbGFzcz1cImZsZXgtZml4ZWQgcGlwLXRvYXN0LWJ1dHRvblwiIG5nLWlmPVwidm0udG9hc3QudHlwZT09XFwnZXJyb3JcXCcgJiYgdm0udG9hc3QuZXJyb3IgJiYgdm0uc2hvd0RldGFpbHNcIiBuZy1jbGljaz1cInZtLm9uRGV0YWlscygpXCI+RGV0YWlsczwvbWQtYnV0dG9uPjxtZC1idXR0b24gY2xhc3M9XCJmbGV4LWZpeGVkIHBpcC10b2FzdC1idXR0b25cIiBuZy1jbGljaz1cInZtLm9uQWN0aW9uKGFjdGlvbilcIiBuZy1yZXBlYXQ9XCJhY3Rpb24gaW4gdm0uYWN0aW9uc1wiIGFyaWEtbGFiZWw9XCJ7ezo6YWN0aW9ufCB0cmFuc2xhdGV9fVwiPnt7OjphY3Rpb258IHRyYW5zbGF0ZX19PC9tZC1idXR0b24+PC9kaXY+PC9tZC10b2FzdD4nKTtcbn1dKTtcbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBpcC13ZWJ1aS1jb250cm9scy1odG1sLm1pbi5qcy5tYXBcbiJdfQ==