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
Object.defineProperty(exports, "__esModule", { value: true });
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
Object.defineProperty(exports, "__esModule", { value: true });
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
Object.defineProperty(exports, "__esModule", { value: true });
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
Object.defineProperty(exports, "__esModule", { value: true });
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
Object.defineProperty(exports, "__esModule", { value: true });
angular
    .module('pipImageSlider', ['pipSliderButton', 'pipSliderIndicator', 'pipImageSlider.Service']);
require("./ImageSlider");
require("./ImageSliderService");
require("./SliderButton");
require("./SliderIndicator");
},{"./ImageSlider":3,"./ImageSliderService":4,"./SliderButton":5,"./SliderIndicator":6}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        MarkdownController.$inject = ['$scope', '$element', '$injector'];
        function MarkdownController($scope, $element, $injector) {
            "ngInject";
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
Object.defineProperty(exports, "__esModule", { value: true });
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
Object.defineProperty(exports, "__esModule", { value: true });
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
Object.defineProperty(exports, "__esModule", { value: true });
var Toast = (function () {
    function Toast() {
    }
    return Toast;
}());
exports.Toast = Toast;
},{}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
{
    var ToastController_1 = (function () {
        ToastController_1.$inject = ['$mdToast', 'toast', '$injector'];
        function ToastController_1($mdToast, toast, $injector) {
            "ngInject";
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
        ToastController_1.prototype.onMessageClick = function () {
            if (this.toast.type !== 'clickable_error' || !this.showDetails)
                return;
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
            "ngInject";
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
            if (this.currentToast && this.currentToast.cancelCallback) {
                this.currentToast.cancelCallback(action);
            }
            this.currentToast = null;
            this.showNextToast();
        };
        ToastService.prototype.showToastOkResult = function (action) {
            if (this.currentToast && this.currentToast.successCallback) {
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
        ToastService.prototype.showClickableError = function (message, successCallback, cancelCallback, id, error) {
            this.addToast({
                id: id || null,
                error: error,
                type: 'clickable_error',
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
Object.defineProperty(exports, "__esModule", { value: true });
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
    '<md-toast class="md-action pip-toast" ng-class="{\'pip-error\': vm.toast.type==\'error\' || vm.toast.type==\'clickable_error\', \'pip-column-toast\': vm.toast.actions.length > 1 || vm.actionLenght > 4, \'pip-no-action-toast\': vm.actionLenght == 0}" style="height:initial; max-height: initial;"><span class="flex-var pip-text" ng-bind-html="vm.message" ng-class="{\'clickable\': vm.showDetails && vm.toast.type==\'clickable_error\' }" ng-click="vm.onMessageClick()"></span><div class="layout-row layout-align-end-start pip-actions" ng-if="vm.actions.length > 0 || ((vm.toast.type==\'error\' || vm.toast.type==\'clickable_error\') && vm.toast.error)"><div class="flex" ng-if="vm.toast.actions.length > 1"></div><md-button class="flex-fixed pip-toast-button" ng-if="vm.toast.type==\'error\' && vm.toast.error && vm.showDetails" ng-click="vm.onDetails()">Details</md-button><md-button class="flex-fixed pip-toast-button" ng-click="vm.onAction(action)" ng-repeat="action in vm.actions" aria-label="{{::action| translate}}">{{::action| translate}}</md-button></div></md-toast>');
}]);
})();



},{}]},{},[17,8])(17)
});

//# sourceMappingURL=pip-webui-controls.js.map
