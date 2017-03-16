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
},{}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
"use strict";
angular
    .module('pipImageSlider', ['pipSliderButton', 'pipSliderIndicator', 'pipImageSlider.Service']);
require("./ImageSlider");
require("./ImageSliderService");
require("./SliderButton");
require("./SliderIndicator");
},{"./ImageSlider":4,"./ImageSliderService":5,"./SliderButton":6,"./SliderIndicator":7}],9:[function(require,module,exports){
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
},{"./color_picker/ColorPicker":1,"./dependencies/TranslateFilter":2,"./image_slider":8,"./markdown/Markdown":10,"./popover":14,"./progress/RoutingProgress":15,"./toast":19}],10:[function(require,module,exports){
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
    angular
        .module('pipMarkdown', ['ngSanitize'])
        .run(ConfigTranslations)
        .component('pipMarkdown', MarkdownComponent);
}
},{}],11:[function(require,module,exports){
"use strict";
},{}],12:[function(require,module,exports){
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
},{}],13:[function(require,module,exports){
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
},{}],14:[function(require,module,exports){
"use strict";
angular.module('pipPopover', ['pipPopover.Service']);
require("./Popover");
require("./PopoverService");
},{"./Popover":12,"./PopoverService":13}],15:[function(require,module,exports){
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
},{}],16:[function(require,module,exports){
"use strict";
},{}],17:[function(require,module,exports){
"use strict";
var Toast = (function () {
    function Toast() {
    }
    return Toast;
}());
exports.Toast = Toast;
},{}],18:[function(require,module,exports){
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
},{}],19:[function(require,module,exports){
"use strict";
angular.module('pipToasts', ['ngMaterial', 'pipControls.Translate']);
require("./ToastService");
require("./Toast");
},{"./Toast":17,"./ToastService":18}],20:[function(require,module,exports){
(function(module) {
try {
  module = angular.module('pipControls.Templates');
} catch (e) {
  module = angular.module('pipControls.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('color_picker/ColorPicker.html',
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
  $templateCache.put('popover/Popover.html',
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
  $templateCache.put('progress/RoutingProgress.html',
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
  $templateCache.put('toast/Toast.html',
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



},{}]},{},[20,1,2,3,4,5,8,6,7,9,10,14,11,12,13,15,19,16,17,18])(20)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29sb3JfcGlja2VyL0NvbG9yUGlja2VyLnRzIiwic3JjL2RlcGVuZGVuY2llcy9UcmFuc2xhdGVGaWx0ZXIudHMiLCJzcmMvaW1hZ2Vfc2xpZGVyL0ltYWdlU2xpZGVyLnRzIiwic3JjL2ltYWdlX3NsaWRlci9JbWFnZVNsaWRlclNlcnZpY2UudHMiLCJzcmMvaW1hZ2Vfc2xpZGVyL1NsaWRlckJ1dHRvbi50cyIsInNyYy9pbWFnZV9zbGlkZXIvU2xpZGVySW5kaWNhdG9yLnRzIiwic3JjL2ltYWdlX3NsaWRlci9pbmRleC50cyIsInNyYy9pbmRleC50cyIsInNyYy9tYXJrZG93bi9NYXJrZG93bi50cyIsInNyYy9wb3BvdmVyL1BvcG92ZXIudHMiLCJzcmMvcG9wb3Zlci9Qb3BvdmVyU2VydmljZS50cyIsInNyYy9wb3BvdmVyL2luZGV4LnRzIiwic3JjL3Byb2dyZXNzL1JvdXRpbmdQcm9ncmVzcy50cyIsInNyYy90b2FzdC9Ub2FzdC50cyIsInNyYy90b2FzdC9Ub2FzdFNlcnZpY2UudHMiLCJzcmMvdG9hc3QvaW5kZXgudHMiLCJ0ZW1wL3BpcC13ZWJ1aS1jb250cm9scy1odG1sLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsQ0FBQztJQWNHLElBQU0sbUJBQW1CLEdBQXlCO1FBQzlDLFVBQVUsRUFBRSxjQUFjO1FBQzFCLE1BQU0sRUFBRSxZQUFZO1FBQ3BCLFlBQVksRUFBRSxVQUFVO1FBQ3hCLFdBQVcsRUFBRSxZQUFZO0tBQzVCLENBQUE7SUFFRDtRQUFBO1FBUUEsQ0FBQztRQUFELHlCQUFDO0lBQUQsQ0FSQSxBQVFDLElBQUE7SUFFRCxJQUFNLGdCQUFjLEdBQUcsQ0FBQyxRQUFRLEVBQUUsWUFBWSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUU5RjtRQVFJLCtCQUNZ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UUFDTCxDQUFDO1FBRUwsbUJBQUM7SUFBRCxDQXpKQSxBQXlKQyxJQUFBO0lBRUQsT0FBTztTQUNGLE1BQU0sQ0FBQyxXQUFXLENBQUM7U0FDbkIsT0FBTyxDQUFDLFdBQVcsRUFBRSxZQUFZLENBQUMsQ0FBQztBQUM1QyxDQUFDOzs7QUNuTkQsT0FBTyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxZQUFZLEVBQUUsdUJBQXVCLENBQUMsQ0FBQyxDQUFBO0FBRXBFLDBCQUF3QjtBQUN4QixtQkFBaUI7O0FDSGpCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwie1xyXG4gICAgaW50ZXJmYWNlIElDb2xvclBpY2tlckJpbmRpbmdzIHtcclxuICAgICAgICBba2V5OiBzdHJpbmddOiBhbnk7XHJcblxyXG4gICAgICAgIG5nRGlzYWJsZWQ6IGFueTtcclxuICAgICAgICBjb2xvcnM6IGFueTtcclxuICAgICAgICBjdXJyZW50Q29sb3I6IGFueTtcclxuICAgICAgICBjb2xvckNoYW5nZTogYW55O1xyXG4gICAgfVxyXG5cclxuICAgIGludGVyZmFjZSBJQ29sb3JQaWNrZXJBdHRyaWJ1dGVzIGV4dGVuZHMgbmcuSUF0dHJpYnV0ZXMge1xyXG4gICAgICAgIGNsYXNzOiBzdHJpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgQ29sb3JQaWNrZXJCaW5kaW5nczogSUNvbG9yUGlja2VyQmluZGluZ3MgPSB7XHJcbiAgICAgICAgbmdEaXNhYmxlZDogJzw/bmdEaXNhYmxlZCcsXHJcbiAgICAgICAgY29sb3JzOiAnPHBpcENvbG9ycycsXHJcbiAgICAgICAgY3VycmVudENvbG9yOiAnPW5nTW9kZWwnLFxyXG4gICAgICAgIGNvbG9yQ2hhbmdlOiAnJj9uZ0NoYW5nZSdcclxuICAgIH1cclxuXHJcbiAgICBjbGFzcyBDb2xvclBpY2tlckNoYW5nZXMgaW1wbGVtZW50cyBuZy5JT25DaGFuZ2VzT2JqZWN0LCBJQ29sb3JQaWNrZXJCaW5kaW5ncyB7XHJcbiAgICAgICAgW2tleTogc3RyaW5nXTogbmcuSUNoYW5nZXNPYmplY3QgPCBhbnkgPiA7XHJcblxyXG4gICAgICAgIGNvbG9yQ2hhbmdlOiBuZy5JQ2hhbmdlc09iamVjdCA8ICgpID0+IG5nLklQcm9taXNlIDwgYW55ID4+IDtcclxuICAgICAgICBjdXJyZW50Q29sb3I6IGFueTtcclxuXHJcbiAgICAgICAgbmdEaXNhYmxlZDogbmcuSUNoYW5nZXNPYmplY3QgPCBib29sZWFuID4gO1xyXG4gICAgICAgIGNvbG9yczogbmcuSUNoYW5nZXNPYmplY3QgPCBzdHJpbmdbXSA+IDtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBERUZBVUxUX0NPTE9SUyA9IFsncHVycGxlJywgJ2xpZ2h0Z3JlZW4nLCAnZ3JlZW4nLCAnZGFya3JlZCcsICdwaW5rJywgJ3llbGxvdycsICdjeWFuJ107XHJcblxyXG4gICAgY2xhc3MgQ29sb3JQaWNrZXJDb250cm9sbGVyIGltcGxlbWVudHMgSUNvbG9yUGlja2VyQmluZGluZ3Mge1xyXG4gICAgICAgIHB1YmxpYyBjbGFzczogc3RyaW5nO1xyXG4gICAgICAgIHB1YmxpYyBjb2xvcnM6IHN0cmluZ1tdO1xyXG4gICAgICAgIHB1YmxpYyBjdXJyZW50Q29sb3I6IHN0cmluZztcclxuICAgICAgICBwdWJsaWMgY3VycmVudENvbG9ySW5kZXg6IG51bWJlcjtcclxuICAgICAgICBwdWJsaWMgbmdEaXNhYmxlZDogYm9vbGVhbjtcclxuICAgICAgICBwdWJsaWMgY29sb3JDaGFuZ2U6IEZ1bmN0aW9uO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICAgICAgcHJpdmF0ZSAkc2NvcGU6IG5nLklTY29wZSxcclxuICAgICAgICAgICAgcHJpdmF0ZSAkZWxlbWVudDogSlF1ZXJ5LFxyXG4gICAgICAgICAgICAkYXR0cnM6IElDb2xvclBpY2tlckF0dHJpYnV0ZXMsXHJcbiAgICAgICAgICAgIHByaXZhdGUgJHRpbWVvdXQ6IG5nLklUaW1lb3V0U2VydmljZVxyXG4gICAgICAgICkgeyBcclxuICAgICAgICAgICAgdGhpcy5jbGFzcyA9ICRhdHRycy5jbGFzcyB8fCAnJzsgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgJG9uQ2hhbmdlcyhjaGFuZ2VzOiBDb2xvclBpY2tlckNoYW5nZXMpIHtcclxuICAgICAgICAgICAgdGhpcy5jb2xvcnMgPSBjaGFuZ2VzLmNvbG9ycyAmJiBfLmlzQXJyYXkoY2hhbmdlcy5jb2xvcnMuY3VycmVudFZhbHVlKSAmJiBjaGFuZ2VzLmNvbG9ycy5jdXJyZW50VmFsdWUubGVuZ3RoICE9PSAwID9cclxuICAgICAgICAgICAgICAgIGNoYW5nZXMuY29sb3JzLmN1cnJlbnRWYWx1ZSA6IERFRkFVTFRfQ09MT1JTO1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRDb2xvciA9IHRoaXMuY3VycmVudENvbG9yIHx8IHRoaXMuY29sb3JzWzBdO1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRDb2xvckluZGV4ID0gdGhpcy5jb2xvcnMuaW5kZXhPZih0aGlzLmN1cnJlbnRDb2xvcik7XHJcblxyXG4gICAgICAgICAgICB0aGlzLm5nRGlzYWJsZWQgPSBjaGFuZ2VzLm5nRGlzYWJsZWQuY3VycmVudFZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHNlbGVjdENvbG9yKGluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMubmdEaXNhYmxlZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudENvbG9ySW5kZXggPSBpbmRleDtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50Q29sb3IgPSB0aGlzLmNvbG9yc1t0aGlzLmN1cnJlbnRDb2xvckluZGV4XTtcclxuICAgICAgICAgICAgdGhpcy4kdGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRzY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5jb2xvckNoYW5nZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb2xvckNoYW5nZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcHVibGljIGVudGVyU3BhY2VQcmVzcyhldmVudCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdENvbG9yKGV2ZW50LmluZGV4KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBwaXBDb2xvclBpY2tlcjogbmcuSUNvbXBvbmVudE9wdGlvbnMgPSB7XHJcbiAgICAgICAgYmluZGluZ3M6IENvbG9yUGlja2VyQmluZGluZ3MsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdjb2xvcl9waWNrZXIvQ29sb3JQaWNrZXIuaHRtbCcsXHJcbiAgICAgICAgY29udHJvbGxlcjogQ29sb3JQaWNrZXJDb250cm9sbGVyXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3BpcENvbG9yUGlja2VyJywgWydwaXBDb250cm9scy5UZW1wbGF0ZXMnXSlcclxuICAgICAgICAuY29tcG9uZW50KCdwaXBDb2xvclBpY2tlcicsIHBpcENvbG9yUGlja2VyKTtcclxuXHJcbn0iLCJ7XHJcbiAgICBmdW5jdGlvbiB0cmFuc2xhdGVGaWx0ZXIoJGluamVjdG9yOiBuZy5hdXRvLklJbmplY3RvclNlcnZpY2UpIHtcclxuICAgICAgICBjb25zdCBwaXBUcmFuc2xhdGUgPSAkaW5qZWN0b3IuaGFzKCdwaXBUcmFuc2xhdGUnKSA/ICRpbmplY3Rvci5nZXQoJ3BpcFRyYW5zbGF0ZScpIDogbnVsbDtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChrZXk6IHN0cmluZykge1xyXG4gICAgICAgICAgICByZXR1cm4gcGlwVHJhbnNsYXRlID8gcGlwVHJhbnNsYXRlWyd0cmFuc2xhdGUnXShrZXkpIHx8IGtleSA6IGtleTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3BpcENvbnRyb2xzLlRyYW5zbGF0ZScsIFtdKVxyXG4gICAgICAgIC5maWx0ZXIoJ3RyYW5zbGF0ZScsIHRyYW5zbGF0ZUZpbHRlcik7XHJcbn1cclxuIiwiaW1wb3J0IHsgSUltYWdlU2xpZGVyU2VydmljZSB9IGZyb20gJy4vSUltYWdlU2xpZGVyU2VydmljZSc7XHJcblxyXG57XHJcbiAgICBjbGFzcyBwaXBJbWFnZVNsaWRlckNvbnRyb2xsZXIgaW1wbGVtZW50cyBuZy5JQ29udHJvbGxlciB7XHJcbiAgICAgICAgcHJpdmF0ZSBfYmxvY2tzOiBhbnlbXTtcclxuICAgICAgICBwcml2YXRlIF9pbmRleDogbnVtYmVyID0gMDtcclxuICAgICAgICBwcml2YXRlIF9uZXdJbmRleDogbnVtYmVyO1xyXG4gICAgICAgIHByaXZhdGUgX2RpcmVjdGlvbjogc3RyaW5nO1xyXG4gICAgICAgIHByaXZhdGUgX3R5cGU6IHN0cmluZztcclxuICAgICAgICBwcml2YXRlIERFRkFVTFRfSU5URVJWQUw6bnVtYmVyID0gNDUwMDtcclxuICAgICAgICBwcml2YXRlIF9pbnRlcnZhbDogbnVtYmVyIHwgc3RyaW5nO1xyXG4gICAgICAgIHByaXZhdGUgX3RpbWVQcm9taXNlcztcclxuICAgICAgICBwcml2YXRlIF90aHJvdHRsZWQ6IEZ1bmN0aW9uO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3dpcGVTdGFydDogbnVtYmVyID0gMDtcclxuICAgICAgICBwdWJsaWMgc2xpZGVySW5kZXg6IG51bWJlcjtcclxuICAgICAgICBwdWJsaWMgc2xpZGVUbzogRnVuY3Rpb247XHJcbiAgICAgICAgcHVibGljIHR5cGU6IEZ1bmN0aW9uO1xyXG4gICAgICAgIHB1YmxpYyBpbnRlcnZhbDogRnVuY3Rpb247XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgICAgICBwcml2YXRlICRzY29wZTogbmcuSVNjb3BlLFxyXG4gICAgICAgICAgICBwcml2YXRlICRlbGVtZW50OiBKUXVlcnksXHJcbiAgICAgICAgICAgIHByaXZhdGUgJGF0dHJzLFxyXG4gICAgICAgICAgICBwcml2YXRlICRwYXJzZTogbmcuSVBhcnNlU2VydmljZSxcclxuICAgICAgICAgICAgcHJpdmF0ZSAkdGltZW91dDogYW5ndWxhci5JVGltZW91dFNlcnZpY2UsXHJcbiAgICAgICAgICAgIHByaXZhdGUgJGludGVydmFsOiBhbmd1bGFyLklJbnRlcnZhbFNlcnZpY2UsXHJcbiAgICAgICAgICAgIHByaXZhdGUgcGlwSW1hZ2VTbGlkZXI6IElJbWFnZVNsaWRlclNlcnZpY2VcclxuICAgICAgICApIHtcclxuXHJcbiAgICAgICAgICAgIC8vdGhpcy5zbGlkZXJJbmRleCA9ICRzY29wZVsndm0nXVsnc2xpZGVySW5kZXgnXTtcclxuICAgICAgICAgICAgdGhpcy5fdHlwZSA9IHRoaXMudHlwZSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9pbnRlcnZhbCA9IHRoaXMuaW50ZXJ2YWwoKTtcclxuICAgICAgICAgICAgdGhpcy5zbGlkZVRvID0gdGhpcy5zbGlkZVRvUHJpdmF0ZTtcclxuXHJcbiAgICAgICAgICAgICRlbGVtZW50LmFkZENsYXNzKCdwaXAtaW1hZ2Utc2xpZGVyJyk7XHJcbiAgICAgICAgICAgICRlbGVtZW50LmFkZENsYXNzKCdwaXAtYW5pbWF0aW9uLScgKyB0aGlzLl90eXBlKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc2V0SW5kZXgoKTtcclxuXHJcbiAgICAgICAgICAgICR0aW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2Jsb2NrcyA9IDxhbnk+JGVsZW1lbnQuZmluZCgnLnBpcC1hbmltYXRpb24tYmxvY2snKTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9ibG9ja3MubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcy5fYmxvY2tzWzBdKS5hZGRDbGFzcygncGlwLXNob3cnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnN0YXJ0SW50ZXJ2YWwoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3Rocm90dGxlZCA9IF8udGhyb3R0bGUoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcGlwSW1hZ2VTbGlkZXIudG9CbG9jayh0aGlzLl90eXBlLCB0aGlzLl9ibG9ja3MsIHRoaXMuX2luZGV4LCB0aGlzLl9uZXdJbmRleCwgdGhpcy5fZGlyZWN0aW9uKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2luZGV4ID0gdGhpcy5fbmV3SW5kZXg7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldEluZGV4KCk7XHJcbiAgICAgICAgICAgIH0sIDcwMCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoJGF0dHJzLmlkKSB7XHJcbiAgICAgICAgICAgICAgICBwaXBJbWFnZVNsaWRlci5yZWdpc3RlclNsaWRlcigkYXR0cnMuaWQsICRzY29wZSlcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLiRvbignJGRlc3Ryb3knLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3BJbnRlcnZhbCgpO1xyXG4gICAgICAgICAgICAgICAgcGlwSW1hZ2VTbGlkZXIucmVtb3ZlU2xpZGVyKCRhdHRycy5pZCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBuZXh0QmxvY2soKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVzdGFydEludGVydmFsKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX25ld0luZGV4ID0gdGhpcy5faW5kZXggKyAxID09PSB0aGlzLl9ibG9ja3MubGVuZ3RoID8gMCA6IHRoaXMuX2luZGV4ICsgMTtcclxuICAgICAgICAgICAgdGhpcy5fZGlyZWN0aW9uID0gJ25leHQnO1xyXG4gICAgICAgICAgICB0aGlzLl90aHJvdHRsZWQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBwcmV2QmxvY2soKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVzdGFydEludGVydmFsKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX25ld0luZGV4ID0gdGhpcy5faW5kZXggLSAxIDwgMCA/IHRoaXMuX2Jsb2Nrcy5sZW5ndGggLSAxIDogdGhpcy5faW5kZXggLSAxO1xyXG4gICAgICAgICAgICB0aGlzLl9kaXJlY3Rpb24gPSAncHJldic7XHJcbiAgICAgICAgICAgIHRoaXMuX3Rocm90dGxlZCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzbGlkZVRvUHJpdmF0ZShuZXh0SW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgICAgICBpZiAobmV4dEluZGV4ID09PSB0aGlzLl9pbmRleCB8fCBuZXh0SW5kZXggPiB0aGlzLl9ibG9ja3MubGVuZ3RoIC0gMSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLnJlc3RhcnRJbnRlcnZhbCgpO1xyXG4gICAgICAgICAgICB0aGlzLl9uZXdJbmRleCA9IG5leHRJbmRleDtcclxuICAgICAgICAgICAgdGhpcy5fZGlyZWN0aW9uID0gbmV4dEluZGV4ID4gdGhpcy5faW5kZXggPyAnbmV4dCcgOiAncHJldic7XHJcbiAgICAgICAgICAgIHRoaXMuX3Rocm90dGxlZCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzZXRJbmRleCgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuJGF0dHJzLnBpcEltYWdlSW5kZXgpIHRoaXMuc2xpZGVySW5kZXggPSB0aGlzLl9pbmRleDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgc3RhcnRJbnRlcnZhbCgpIHtcclxuICAgICAgICAgICAgdGhpcy5fdGltZVByb21pc2VzID0gdGhpcy4kaW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbmV3SW5kZXggPSB0aGlzLl9pbmRleCArIDEgPT09IHRoaXMuX2Jsb2Nrcy5sZW5ndGggPyAwIDogdGhpcy5faW5kZXggKyAxO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZGlyZWN0aW9uID0gJ25leHQnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdGhyb3R0bGVkKCk7XHJcbiAgICAgICAgICAgIH0sIE51bWJlcih0aGlzLl9pbnRlcnZhbCB8fCB0aGlzLkRFRkFVTFRfSU5URVJWQUwpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgc3RvcEludGVydmFsKCkge1xyXG4gICAgICAgICAgICB0aGlzLiRpbnRlcnZhbC5jYW5jZWwodGhpcy5fdGltZVByb21pc2VzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgcmVzdGFydEludGVydmFsKCkge1xyXG4gICAgICAgICAgICB0aGlzLnN0b3BJbnRlcnZhbCgpO1xyXG4gICAgICAgICAgICB0aGlzLnN0YXJ0SW50ZXJ2YWwoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgSW1hZ2VTbGlkZXIgPSBmdW5jdGlvbigpOiBuZy5JRGlyZWN0aXZlIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBzY29wZToge1xyXG4gICAgICAgICAgICAgICAgc2xpZGVySW5kZXg6ICc9cGlwSW1hZ2VJbmRleCcsXHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnJnBpcEFuaW1hdGlvblR5cGUnLFxyXG4gICAgICAgICAgICAgICAgaW50ZXJ2YWw6ICcmcGlwQW5pbWF0aW9uSW50ZXJ2YWwnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IHBpcEltYWdlU2xpZGVyQ29udHJvbGxlcixcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgncGlwSW1hZ2VTbGlkZXInKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ3BpcEltYWdlU2xpZGVyJywgSW1hZ2VTbGlkZXIpO1xyXG59IiwiaW1wb3J0IHsgSUltYWdlU2xpZGVyU2VydmljZSB9IGZyb20gJy4vSUltYWdlU2xpZGVyU2VydmljZSc7XHJcblxyXG57XHJcbiAgICBjbGFzcyBJbWFnZVNsaWRlclNlcnZpY2UgaW1wbGVtZW50cyBJSW1hZ2VTbGlkZXJTZXJ2aWNlIHtcclxuICAgICAgICBwcml2YXRlIEFOSU1BVElPTl9EVVJBVElPTjogbnVtYmVyID0gNTUwO1xyXG4gICAgICAgIHByaXZhdGUgX3NsaWRlcnM6IE9iamVjdCA9IHt9O1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICAgICAgcHJpdmF0ZSAkdGltZW91dDogYW5ndWxhci5JVGltZW91dFNlcnZpY2VcclxuICAgICAgICApIHt9XHJcblxyXG4gICAgICAgIHB1YmxpYyByZWdpc3RlclNsaWRlcihzbGlkZXJJZDogc3RyaW5nLCBzbGlkZXJTY29wZTogbmcuSVNjb3BlKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX3NsaWRlcnNbc2xpZGVySWRdID0gc2xpZGVyU2NvcGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgcmVtb3ZlU2xpZGVyKHNsaWRlcklkOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX3NsaWRlcnNbc2xpZGVySWRdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGdldFNsaWRlclNjb3BlKHNsaWRlcklkOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NsaWRlcnNbc2xpZGVySWRdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIG5leHRDYXJvdXNlbChuZXh0QmxvY2s6IEpRdWVyeSwgcHJldkJsb2NrOiBKUXVlcnkpOiB2b2lkIHtcclxuICAgICAgICAgICAgbmV4dEJsb2NrLmFkZENsYXNzKCdwaXAtbmV4dCcpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy4kdGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBuZXh0QmxvY2suYWRkQ2xhc3MoJ2FuaW1hdGVkJykuYWRkQ2xhc3MoJ3BpcC1zaG93JykucmVtb3ZlQ2xhc3MoJ3BpcC1uZXh0Jyk7XHJcbiAgICAgICAgICAgICAgICBwcmV2QmxvY2suYWRkQ2xhc3MoJ2FuaW1hdGVkJykucmVtb3ZlQ2xhc3MoJ3BpcC1zaG93Jyk7XHJcbiAgICAgICAgICAgIH0sIDEwMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgcHJldkNhcm91c2VsKG5leHRCbG9jazogSlF1ZXJ5LCBwcmV2QmxvY2s6IEpRdWVyeSk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLiR0aW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIG5leHRCbG9jay5hZGRDbGFzcygnYW5pbWF0ZWQnKS5hZGRDbGFzcygncGlwLXNob3cnKTtcclxuICAgICAgICAgICAgICAgIHByZXZCbG9jay5hZGRDbGFzcygnYW5pbWF0ZWQnKS5hZGRDbGFzcygncGlwLW5leHQnKS5yZW1vdmVDbGFzcygncGlwLXNob3cnKTtcclxuICAgICAgICAgICAgfSwgMTAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB0b0Jsb2NrKHR5cGU6IHN0cmluZywgYmxvY2tzOiBhbnlbXSwgb2xkSW5kZXg6IG51bWJlciwgbmV4dEluZGV4OiBudW1iZXIsIGRpcmVjdGlvbjogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGNvbnN0IHByZXZCbG9jayA9ICQoYmxvY2tzW29sZEluZGV4XSksXHJcbiAgICAgICAgICAgICAgICBibG9ja0luZGV4ID0gbmV4dEluZGV4LFxyXG4gICAgICAgICAgICAgICAgbmV4dEJsb2NrID0gJChibG9ja3NbYmxvY2tJbmRleF0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKHR5cGUgPT09ICdjYXJvdXNlbCcpIHtcclxuICAgICAgICAgICAgICAgICQoYmxvY2tzKS5yZW1vdmVDbGFzcygncGlwLW5leHQnKS5yZW1vdmVDbGFzcygncGlwLXByZXYnKS5yZW1vdmVDbGFzcygnYW5pbWF0ZWQnKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZGlyZWN0aW9uICYmIChkaXJlY3Rpb24gPT09ICdwcmV2JyB8fCBkaXJlY3Rpb24gPT09ICduZXh0JykpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGlyZWN0aW9uID09PSAncHJldicpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmV2Q2Fyb3VzZWwobmV4dEJsb2NrLCBwcmV2QmxvY2spO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dENhcm91c2VsKG5leHRCbG9jaywgcHJldkJsb2NrKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXh0SW5kZXggJiYgbmV4dEluZGV4IDwgb2xkSW5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmV2Q2Fyb3VzZWwobmV4dEJsb2NrLCBwcmV2QmxvY2spO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dENhcm91c2VsKG5leHRCbG9jaywgcHJldkJsb2NrKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBwcmV2QmxvY2suYWRkQ2xhc3MoJ2FuaW1hdGVkJykucmVtb3ZlQ2xhc3MoJ3BpcC1zaG93Jyk7XHJcbiAgICAgICAgICAgICAgICBuZXh0QmxvY2suYWRkQ2xhc3MoJ2FuaW1hdGVkJykuYWRkQ2xhc3MoJ3BpcC1zaG93Jyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3BpcEltYWdlU2xpZGVyLlNlcnZpY2UnLCBbXSlcclxuICAgICAgICAuc2VydmljZSgncGlwSW1hZ2VTbGlkZXInLCBJbWFnZVNsaWRlclNlcnZpY2UpO1xyXG59IiwiaW1wb3J0IHsgSUltYWdlU2xpZGVyU2VydmljZSB9IGZyb20gJy4vSUltYWdlU2xpZGVyU2VydmljZSc7XHJcblxyXG57XHJcbiAgICBjbGFzcyBTbGlkZXJCdXR0b25Db250cm9sbGVyIGltcGxlbWVudHMgbmcuSUNvbnRyb2xsZXIge1xyXG4gICAgICAgIHB1YmxpYyBkaXJlY3Rpb246IEZ1bmN0aW9uO1xyXG4gICAgICAgIHB1YmxpYyBzbGlkZXJJZDogRnVuY3Rpb247XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgICAgICAkZWxlbWVudDogSlF1ZXJ5LFxyXG4gICAgICAgICAgICBwaXBJbWFnZVNsaWRlcjogSUltYWdlU2xpZGVyU2VydmljZVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICAkZWxlbWVudC5vbignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuc2xpZGVySWQoKSB8fCAhdGhpcy5kaXJlY3Rpb24oKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBwaXBJbWFnZVNsaWRlci5nZXRTbGlkZXJTY29wZSh0aGlzLnNsaWRlcklkKCkpLnZtW3RoaXMuZGlyZWN0aW9uKCkgKyAnQmxvY2snXSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgU2xpZGVyQnV0dG9uID0gZnVuY3Rpb24gKCk6IG5nLklEaXJlY3RpdmUge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHNjb3BlOiB7XHJcbiAgICAgICAgICAgICAgICBkaXJlY3Rpb246ICcmcGlwQnV0dG9uVHlwZScsXHJcbiAgICAgICAgICAgICAgICBzbGlkZXJJZDogJyZwaXBTbGlkZXJJZCdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnJGN0bHInLFxyXG4gICAgICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBTbGlkZXJCdXR0b25Db250cm9sbGVyXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncGlwU2xpZGVyQnV0dG9uJywgW10pXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgncGlwU2xpZGVyQnV0dG9uJywgU2xpZGVyQnV0dG9uKTtcclxuXHJcbn0iLCJpbXBvcnQgeyBJSW1hZ2VTbGlkZXJTZXJ2aWNlIH0gZnJvbSAnLi9JSW1hZ2VTbGlkZXJTZXJ2aWNlJztcclxuXHJcbntcclxuICAgIGNsYXNzIFNsaWRlckluZGljYXRvckNvbnRyb2xsZXIgaW1wbGVtZW50cyBuZy5JQ29udHJvbGxlciB7XHJcbiAgICAgICAgcHVibGljIHNsaWRlVG86IEZ1bmN0aW9uO1xyXG4gICAgICAgIHB1YmxpYyBzbGlkZXJJZDogRnVuY3Rpb247XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgICAgICAkZWxlbWVudDogSlF1ZXJ5LFxyXG4gICAgICAgICAgICBwaXBJbWFnZVNsaWRlcjogSUltYWdlU2xpZGVyU2VydmljZVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICAkZWxlbWVudC5jc3MoJ2N1cnNvcicsICdwb2ludGVyJyk7XHJcbiAgICAgICAgICAgICRlbGVtZW50Lm9uKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5zbGlkZXJJZCgpIHx8IHRoaXMuc2xpZGVUbygpID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcGlwSW1hZ2VTbGlkZXIuZ2V0U2xpZGVyU2NvcGUodGhpcy5zbGlkZXJJZCgpKS52bS5zbGlkZVRvKHRoaXMuc2xpZGVUbygpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IFNsaWRlckluZGljYXRvciA9IGZ1bmN0aW9uICgpOiBuZy5JRGlyZWN0aXZlIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBzY29wZToge1xyXG4gICAgICAgICAgICAgICAgc2xpZGVUbzogJyZwaXBTbGlkZVRvJyxcclxuICAgICAgICAgICAgICAgIHNsaWRlcklkOiAnJnBpcFNsaWRlcklkJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICckY3RscicsXHJcbiAgICAgICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFNsaWRlckluZGljYXRvckNvbnRyb2xsZXJcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3BpcFNsaWRlckluZGljYXRvcicsIFtdKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ3BpcFNsaWRlckluZGljYXRvcicsIFNsaWRlckluZGljYXRvcik7XHJcbn0iLCJhbmd1bGFyXHJcbiAgICAubW9kdWxlKCdwaXBJbWFnZVNsaWRlcicsIFsncGlwU2xpZGVyQnV0dG9uJywgJ3BpcFNsaWRlckluZGljYXRvcicsICdwaXBJbWFnZVNsaWRlci5TZXJ2aWNlJ10pO1xyXG5cclxuaW1wb3J0ICcuL0ltYWdlU2xpZGVyJztcclxuaW1wb3J0ICcuL0ltYWdlU2xpZGVyU2VydmljZSc7XHJcbmltcG9ydCAnLi9TbGlkZXJCdXR0b24nO1xyXG5pbXBvcnQgJy4vU2xpZGVySW5kaWNhdG9yJztcclxuXHJcbmV4cG9ydCAqIGZyb20gJy4vSUltYWdlU2xpZGVyU2VydmljZSc7Iiwi77u/aW1wb3J0ICcuL2RlcGVuZGVuY2llcy9UcmFuc2xhdGVGaWx0ZXInO1xyXG5pbXBvcnQgJy4vY29sb3JfcGlja2VyL0NvbG9yUGlja2VyJztcclxuaW1wb3J0ICcuL2ltYWdlX3NsaWRlcic7XHJcbmltcG9ydCAnLi9tYXJrZG93bi9NYXJrZG93bic7XHJcbmltcG9ydCAnLi9wb3BvdmVyJztcclxuaW1wb3J0ICcuL3Byb2dyZXNzL1JvdXRpbmdQcm9ncmVzcyc7XHJcbmltcG9ydCAnLi90b2FzdCc7XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgncGlwQ29udHJvbHMnLCBbXHJcbiAgICAncGlwTWFya2Rvd24nLFxyXG4gICAgJ3BpcENvbG9yUGlja2VyJyxcclxuICAgICdwaXBSb3V0aW5nUHJvZ3Jlc3MnLFxyXG4gICAgJ3BpcFBvcG92ZXInLFxyXG4gICAgJ3BpcEltYWdlU2xpZGVyJyxcclxuICAgICdwaXBUb2FzdHMnLFxyXG4gICAgJ3BpcENvbnRyb2xzLlRyYW5zbGF0ZSdcclxuXSk7XHJcblxyXG5leHBvcnQgKiBmcm9tICcuL2ltYWdlX3NsaWRlcic7XHJcbmV4cG9ydCAqIGZyb20gJy4vcG9wb3Zlcic7XHJcbmV4cG9ydCAqIGZyb20gJy4vdG9hc3QnOyIsImRlY2xhcmUgdmFyIG1hcmtlZDogYW55O1xyXG5cclxue1xyXG4gICAgZnVuY3Rpb24gQ29uZmlnVHJhbnNsYXRpb25zKCRpbmplY3RvcjogbmcuYXV0by5JSW5qZWN0b3JTZXJ2aWNlKSB7XHJcbiAgICAgICAgY29uc3QgcGlwVHJhbnNsYXRlID0gJGluamVjdG9yLmhhcygncGlwVHJhbnNsYXRlJykgPyAkaW5qZWN0b3IuZ2V0KCdwaXBUcmFuc2xhdGUnKSA6IG51bGw7XHJcblxyXG4gICAgICAgIGlmIChwaXBUcmFuc2xhdGUpIHtcclxuICAgICAgICAgICAgKDxhbnk+cGlwVHJhbnNsYXRlKS5zZXRUcmFuc2xhdGlvbnMoJ2VuJywge1xyXG4gICAgICAgICAgICAgICAgJ01BUktET1dOX0FUVEFDSE1FTlRTJzogJ0F0dGFjaG1lbnRzOicsXHJcbiAgICAgICAgICAgICAgICAnY2hlY2tsaXN0JzogJ0NoZWNrbGlzdCcsXHJcbiAgICAgICAgICAgICAgICAnZG9jdW1lbnRzJzogJ0RvY3VtZW50cycsXHJcbiAgICAgICAgICAgICAgICAncGljdHVyZXMnOiAnUGljdHVyZXMnLFxyXG4gICAgICAgICAgICAgICAgJ2xvY2F0aW9uJzogJ0xvY2F0aW9uJyxcclxuICAgICAgICAgICAgICAgICd0aW1lJzogJ1RpbWUnXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAoPGFueT5waXBUcmFuc2xhdGUpLnNldFRyYW5zbGF0aW9ucygncnUnLCB7XHJcbiAgICAgICAgICAgICAgICAnTUFSS0RPV05fQVRUQUNITUVOVFMnOiAn0JLQu9C+0LbQtdC90LjRjzonLFxyXG4gICAgICAgICAgICAgICAgJ2NoZWNrbGlzdCc6ICfQodC/0LjRgdC+0LonLFxyXG4gICAgICAgICAgICAgICAgJ2RvY3VtZW50cyc6ICfQlNC+0LrRg9C80LXQvdGC0YsnLFxyXG4gICAgICAgICAgICAgICAgJ3BpY3R1cmVzJzogJ9CY0LfQvtCx0YDQsNC20LXQvdC40Y8nLFxyXG4gICAgICAgICAgICAgICAgJ2xvY2F0aW9uJzogJ9Cc0LXRgdGC0L7QvdCw0YXQvtC20LTQtdC90LjQtScsXHJcbiAgICAgICAgICAgICAgICAndGltZSc6ICfQktGA0LXQvNGPJ1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW50ZXJmYWNlIElNYXJrZG93bkJpbmRpbmdzIHtcclxuICAgICAgICBba2V5OiBzdHJpbmddOiBhbnk7XHJcblxyXG4gICAgICAgIHRleHQ6IGFueTtcclxuICAgICAgICBpc0xpc3Q6IGFueTtcclxuICAgICAgICBjbGFtcDogYW55O1xyXG4gICAgICAgIHJlYmluZDogYW55O1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IE1hcmtkb3duQmluZGluZ3M6IElNYXJrZG93bkJpbmRpbmdzID0ge1xyXG4gICAgICAgIHRleHQ6ICc8cGlwVGV4dCcsXHJcbiAgICAgICAgaXNMaXN0OiAnPD9waXBMaXN0JyxcclxuICAgICAgICBjbGFtcDogJzw/cGlwTGluZUNvdW50JyxcclxuICAgICAgICByZWJpbmQ6ICc8P3BpcFJlYmluZCdcclxuICAgIH1cclxuXHJcbiAgICBjbGFzcyBNYXJrZG93bkNoYW5nZXMgaW1wbGVtZW50cyBuZy5JT25DaGFuZ2VzT2JqZWN0LCBJTWFya2Rvd25CaW5kaW5ncyB7XHJcbiAgICAgICAgW2tleTogc3RyaW5nXTogbmcuSUNoYW5nZXNPYmplY3QgPCBhbnkgPiA7XHJcblxyXG4gICAgICAgIHRleHQ6IG5nLklDaGFuZ2VzT2JqZWN0IDwgc3RyaW5nID4gO1xyXG4gICAgICAgIGlzTGlzdDogbmcuSUNoYW5nZXNPYmplY3QgPCBib29sZWFuID4gO1xyXG4gICAgICAgIGNsYW1wOiBuZy5JQ2hhbmdlc09iamVjdCA8IG51bWJlciB8IHN0cmluZyA+IDtcclxuICAgICAgICByZWJpbmQ6IG5nLklDaGFuZ2VzT2JqZWN0IDwgYm9vbGVhbiA+IDtcclxuICAgIH1cclxuXHJcbiAgICBjbGFzcyBNYXJrZG93bkNvbnRyb2xsZXIgaW1wbGVtZW50cyBJTWFya2Rvd25CaW5kaW5ncywgbmcuSUNvbnRyb2xsZXIge1xyXG4gICAgICAgIHByaXZhdGUgX3BpcFRyYW5zbGF0ZTtcclxuXHJcbiAgICAgICAgcHVibGljIHRleHQ6IHN0cmluZztcclxuICAgICAgICBwdWJsaWMgaXNMaXN0OiBib29sZWFuO1xyXG4gICAgICAgIHB1YmxpYyBjbGFtcDogc3RyaW5nIHwgbnVtYmVyO1xyXG4gICAgICAgIHB1YmxpYyByZWJpbmQ6IGJvb2xlYW47XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgICAgICBwcml2YXRlICRzY29wZTogYW5ndWxhci5JU2NvcGUsXHJcbiAgICAgICAgICAgIHByaXZhdGUgJGVsZW1lbnQ6IEpRdWVyeSxcclxuICAgICAgICAgICAgJGluamVjdG9yOiBuZy5hdXRvLklJbmplY3RvclNlcnZpY2VcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgdGhpcy5fcGlwVHJhbnNsYXRlID0gJGluamVjdG9yLmhhcygncGlwVHJhbnNsYXRlJykgPyAkaW5qZWN0b3IuZ2V0KCdwaXBUcmFuc2xhdGUnKSA6IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgJHBvc3RMaW5rKCkge1xyXG4gICAgICAgICAgICAvLyBGaWxsIHRoZSB0ZXh0XHJcbiAgICAgICAgICAgIHRoaXMuYmluZFRleHQodGhpcy50ZXh0KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuJHNjb3BlLiRvbigncGlwV2luZG93UmVzaXplZCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmJpbmRUZXh0KSB0aGlzLmJpbmRUZXh0KHRoaXMuX3RleHQodGhpcy5fJHNjb3BlKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gQWRkIGNsYXNzXHJcbiAgICAgICAgICAgIHRoaXMuJGVsZW1lbnQuYWRkQ2xhc3MoJ3BpcC1tYXJrZG93bicpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyAkb25DaGFuZ2VzKGNoYW5nZXM6IE1hcmtkb3duQ2hhbmdlcykge1xyXG4gICAgICAgICAgICBjb25zdCBuZXdUZXh0ID0gY2hhbmdlcy50ZXh0LmN1cnJlbnRWYWx1ZTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnJlYmluZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0ID0gbmV3VGV4dDtcclxuICAgICAgICAgICAgICAgIHRoaXMuYmluZFRleHQodGhpcy50ZXh0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBkZXNjcmliZUF0dGFjaG1lbnRzKGFycmF5KSB7XHJcbiAgICAgICAgICAgIHZhciBhdHRhY2hTdHJpbmcgPSAnJyxcclxuICAgICAgICAgICAgICAgIGF0dGFjaFR5cGVzID0gW107XHJcblxyXG4gICAgICAgICAgICBfLmVhY2goYXJyYXksIGZ1bmN0aW9uIChhdHRhY2gpIHtcclxuICAgICAgICAgICAgICAgIGlmIChhdHRhY2gudHlwZSAmJiBhdHRhY2gudHlwZSAhPT0gJ3RleHQnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGF0dGFjaFN0cmluZy5sZW5ndGggPT09IDAgJiYgdGhpcy5fcGlwVHJhbnNsYXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dGFjaFN0cmluZyA9IHRoaXMuX3BpcFRyYW5zbGF0ZS50cmFuc2xhdGUoJ01BUktET1dOX0FUVEFDSE1FTlRTJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoYXR0YWNoVHlwZXMuaW5kZXhPZihhdHRhY2gudHlwZSkgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dGFjaFR5cGVzLnB1c2goYXR0YWNoLnR5cGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRhY2hTdHJpbmcgKz0gYXR0YWNoVHlwZXMubGVuZ3RoID4gMSA/ICcsICcgOiAnICc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9waXBUcmFuc2xhdGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRhY2hTdHJpbmcgKz0gdGhpcy5fcGlwVHJhbnNsYXRlLnRyYW5zbGF0ZShhdHRhY2gudHlwZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBhdHRhY2hTdHJpbmc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGJpbmRUZXh0KHZhbHVlKSB7XHJcbiAgICAgICAgICAgIGxldCB0ZXh0U3RyaW5nLCBpc0NsYW1wZWQsIGhlaWdodCwgb3B0aW9ucywgb2JqO1xyXG5cclxuICAgICAgICAgICAgaWYgKF8uaXNBcnJheSh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIG9iaiA9IF8uZmluZCh2YWx1ZSwgZnVuY3Rpb24gKGl0ZW06IGFueSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLnR5cGUgPT09ICd0ZXh0JyAmJiBpdGVtLnRleHQ7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICB0ZXh0U3RyaW5nID0gb2JqID8gb2JqLnRleHQgOiB0aGlzLmRlc2NyaWJlQXR0YWNobWVudHModmFsdWUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGV4dFN0cmluZyA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpc0NsYW1wZWQgPSB0aGlzLmNsYW1wICYmIF8uaXNOdW1iZXIodGhpcy5jbGFtcCk7XHJcbiAgICAgICAgICAgIGlzQ2xhbXBlZCA9IGlzQ2xhbXBlZCAmJiB0ZXh0U3RyaW5nICYmIHRleHRTdHJpbmcubGVuZ3RoID4gMDtcclxuICAgICAgICAgICAgb3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgIGdmbTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHRhYmxlczogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGJyZWFrczogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHNhbml0aXplOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgcGVkYW50aWM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBzbWFydExpc3RzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgc21hcnR5cGVudHM6IGZhbHNlXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHRleHRTdHJpbmcgPSBtYXJrZWQodGV4dFN0cmluZyB8fCAnJywgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIGlmIChpc0NsYW1wZWQpIHtcclxuICAgICAgICAgICAgICAgIGhlaWdodCA9IDEuNSAqIE51bWJlcih0aGlzLmNsYW1wKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBBc3NpZ24gdmFsdWUgYXMgSFRNTFxyXG4gICAgICAgICAgICB0aGlzLiRlbGVtZW50Lmh0bWwoJzxkaXYnICsgKGlzQ2xhbXBlZCA/IHRoaXMuaXNMaXN0ID8gJ2NsYXNzPVwicGlwLW1hcmtkb3duLWNvbnRlbnQgJyArXHJcbiAgICAgICAgICAgICAgICAncGlwLW1hcmtkb3duLWxpc3RcIiBzdHlsZT1cIm1heC1oZWlnaHQ6ICcgKyBoZWlnaHQgKyAnZW1cIj4nIDpcclxuICAgICAgICAgICAgICAgICcgY2xhc3M9XCJwaXAtbWFya2Rvd24tY29udGVudFwiIHN0eWxlPVwibWF4LWhlaWdodDogJyArIGhlaWdodCArICdlbVwiPicgOiB0aGlzLmlzTGlzdCA/XHJcbiAgICAgICAgICAgICAgICAnIGNsYXNzPVwicGlwLW1hcmtkb3duLWxpc3RcIj4nIDogJz4nKSArIHRleHRTdHJpbmcgKyAnPC9kaXY+Jyk7XHJcbiAgICAgICAgICAgIHRoaXMuJGVsZW1lbnQuZmluZCgnYScpLmF0dHIoJ3RhcmdldCcsICdibGFuaycpO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNMaXN0ICYmIGlzQ2xhbXBlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kZWxlbWVudC5hcHBlbmQoJzxkaXYgY2xhc3M9XCJwaXAtZ3JhZGllbnQtYmxvY2tcIj48L2Rpdj4nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnN0IE1hcmtkb3duQ29tcG9uZW50ID0ge1xyXG4gICAgICAgIGNvbnRyb2xsZXI6IE1hcmtkb3duQ29udHJvbGxlcixcclxuICAgICAgICBiaW5kaW5nczogTWFya2Rvd25CaW5kaW5nc1xyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdwaXBNYXJrZG93bicsIFsnbmdTYW5pdGl6ZSddKVxyXG4gICAgICAgIC5ydW4oQ29uZmlnVHJhbnNsYXRpb25zKVxyXG4gICAgICAgIC5jb21wb25lbnQoJ3BpcE1hcmtkb3duJywgTWFya2Rvd25Db21wb25lbnQpO1xyXG59Iiwie1xyXG4gICAgaW50ZXJmYWNlIElQb3BvdmVyQmluZGluZ3Mge1xyXG4gICAgICAgIFtrZXk6IHN0cmluZ106IGFueTtcclxuXHJcbiAgICAgICAgcGFyYW1zOiBhbnk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgUG9wb3ZlckJpbmRpbmdzOiBJUG9wb3ZlckJpbmRpbmdzID0ge1xyXG4gICAgICAgIHBhcmFtczogJzxwaXBQYXJhbXMnXHJcbiAgICB9XHJcblxyXG4gICAgY2xhc3MgUG9wb3ZlckNvbnRyb2xsZXIgaW1wbGVtZW50cyBJUG9wb3ZlckJpbmRpbmdzLCBuZy5JQ29udHJvbGxlciB7XHJcbiAgICAgICAgcHJpdmF0ZSBiYWNrZHJvcEVsZW1lbnQ7XHJcbiAgICAgICAgcHJpdmF0ZSBjb250ZW50O1xyXG4gICAgICAgIHB1YmxpYyBwYXJhbXM6IGFueTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgICAgIHByaXZhdGUgJHNjb3BlOiBuZy5JU2NvcGUsXHJcbiAgICAgICAgICAgICRyb290U2NvcGU6IG5nLklSb290U2NvcGVTZXJ2aWNlLFxyXG4gICAgICAgICAgICAkZWxlbWVudDogSlF1ZXJ5LFxyXG4gICAgICAgICAgICBwcml2YXRlICR0aW1lb3V0OiBuZy5JVGltZW91dFNlcnZpY2UsXHJcbiAgICAgICAgICAgIHByaXZhdGUgJGNvbXBpbGU6IG5nLklDb21waWxlU2VydmljZSxcclxuICAgICAgICAgICAgcHJpdmF0ZSAkdGVtcGxhdGVSZXF1ZXN0OiBuZy5JVGVtcGxhdGVSZXF1ZXN0U2VydmljZVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICB0aGlzLmJhY2tkcm9wRWxlbWVudCA9ICQoJy5waXAtcG9wb3Zlci1iYWNrZHJvcCcpO1xyXG4gICAgICAgICAgICB0aGlzLmJhY2tkcm9wRWxlbWVudC5vbignY2xpY2sga2V5ZG93biBzY3JvbGwnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJhY2tkcm9wQ2xpY2soKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuYmFja2Ryb3BFbGVtZW50LmFkZENsYXNzKHRoaXMucGFyYW1zLnJlc3BvbnNpdmUgIT09IGZhbHNlID8gJ3BpcC1yZXNwb25zaXZlJyA6ICcnKTtcclxuXHJcbiAgICAgICAgICAgICR0aW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMucG9zaXRpb24oKTtcclxuICAgICAgICAgICAgICAgIGFuZ3VsYXIuZXh0ZW5kKCRzY29wZSwgdGhpcy5wYXJhbXMubG9jYWxzKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wYXJhbXMudGVtcGxhdGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnQgPSAkY29tcGlsZSh0aGlzLnBhcmFtcy50ZW1wbGF0ZSkoJHNjb3BlKTtcclxuICAgICAgICAgICAgICAgICAgICAkZWxlbWVudC5maW5kKCcucGlwLXBvcG92ZXInKS5hcHBlbmQodGhpcy5jb250ZW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbml0KCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuJHRlbXBsYXRlUmVxdWVzdCh0aGlzLnBhcmFtcy50ZW1wbGF0ZVVybCwgZmFsc2UpLnRoZW4oKGh0bWwpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50ID0gJGNvbXBpbGUoaHRtbCkoJHNjb3BlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGVsZW1lbnQuZmluZCgnLnBpcC1wb3BvdmVyJykuYXBwZW5kKHRoaXMuY29udGVudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmluaXQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAkdGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhbGNIZWlnaHQoKTtcclxuICAgICAgICAgICAgfSwgMjAwKTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kb24oJ3BpcFBvcG92ZXJSZXNpemUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uUmVzaXplKClcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICQod2luZG93KS5yZXNpemUoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vblJlc2l6ZSgpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGJhY2tkcm9wQ2xpY2soKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnBhcmFtcy5jYW5jZWxDYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wYXJhbXMuY2FuY2VsQ2FsbGJhY2soKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmNsb3NlUG9wb3ZlcigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGNsb3NlUG9wb3ZlcigpIHtcclxuICAgICAgICAgICAgdGhpcy5iYWNrZHJvcEVsZW1lbnQucmVtb3ZlQ2xhc3MoJ29wZW5lZCcpO1xyXG4gICAgICAgICAgICB0aGlzLiR0aW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYmFja2Ryb3BFbGVtZW50LnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB9LCAxMDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIG9uUG9wb3ZlckNsaWNrKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBpbml0KCkge1xyXG4gICAgICAgICAgICB0aGlzLmJhY2tkcm9wRWxlbWVudC5hZGRDbGFzcygnb3BlbmVkJyk7XHJcbiAgICAgICAgICAgICQoJy5waXAtcG9wb3Zlci1iYWNrZHJvcCcpLmZvY3VzKCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnBhcmFtcy50aW1lb3V0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3NlUG9wb3ZlcigpO1xyXG4gICAgICAgICAgICAgICAgfSwgdGhpcy5wYXJhbXMudGltZW91dCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgcG9zaXRpb24oKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnBhcmFtcy5lbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZWxlbWVudCA9ICQodGhpcy5wYXJhbXMuZWxlbWVudCksXHJcbiAgICAgICAgICAgICAgICAgICAgcG9zID0gZWxlbWVudC5vZmZzZXQoKSxcclxuICAgICAgICAgICAgICAgICAgICB3aWR0aCA9IGVsZW1lbnQud2lkdGgoKSxcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQgPSBlbGVtZW50LmhlaWdodCgpLFxyXG4gICAgICAgICAgICAgICAgICAgIGRvY1dpZHRoID0gJChkb2N1bWVudCkud2lkdGgoKSxcclxuICAgICAgICAgICAgICAgICAgICBkb2NIZWlnaHQgPSAkKGRvY3VtZW50KS5oZWlnaHQoKSxcclxuICAgICAgICAgICAgICAgICAgICBwb3BvdmVyID0gdGhpcy5iYWNrZHJvcEVsZW1lbnQuZmluZCgnLnBpcC1wb3BvdmVyJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHBvcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHBvcG92ZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmNzcygnbWF4LXdpZHRoJywgZG9jV2lkdGggLSAoZG9jV2lkdGggLSBwb3MubGVmdCkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jc3MoJ21heC1oZWlnaHQnLCBkb2NIZWlnaHQgLSAocG9zLnRvcCArIGhlaWdodCkgLSAzMiwgMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmNzcygnbGVmdCcsIHBvcy5sZWZ0IC0gcG9wb3Zlci53aWR0aCgpICsgd2lkdGggLyAyKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuY3NzKCd0b3AnLCBwb3MudG9wICsgaGVpZ2h0ICsgMTYpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIG9uUmVzaXplKCkge1xyXG4gICAgICAgICAgICB0aGlzLmJhY2tkcm9wRWxlbWVudC5maW5kKCcucGlwLXBvcG92ZXInKS5maW5kKCcucGlwLWNvbnRlbnQnKS5jc3MoJ21heC1oZWlnaHQnLCAnMTAwJScpO1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uKCk7XHJcbiAgICAgICAgICAgIHRoaXMuY2FsY0hlaWdodCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBjYWxjSGVpZ2h0KCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5wYXJhbXMuY2FsY0hlaWdodCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBwb3BvdmVyID0gdGhpcy5iYWNrZHJvcEVsZW1lbnQuZmluZCgnLnBpcC1wb3BvdmVyJyksXHJcbiAgICAgICAgICAgICAgICB0aXRsZSA9IHBvcG92ZXIuZmluZCgnLnBpcC10aXRsZScpLFxyXG4gICAgICAgICAgICAgICAgZm9vdGVyID0gcG9wb3Zlci5maW5kKCcucGlwLWZvb3RlcicpLFxyXG4gICAgICAgICAgICAgICAgY29udGVudCA9IHBvcG92ZXIuZmluZCgnLnBpcC1jb250ZW50JyksXHJcbiAgICAgICAgICAgICAgICBjb250ZW50SGVpZ2h0ID0gcG9wb3Zlci5oZWlnaHQoKSAtIHRpdGxlLm91dGVySGVpZ2h0KHRydWUpIC0gZm9vdGVyLm91dGVySGVpZ2h0KHRydWUpO1xyXG4gICAgICAgICAgICBjb250ZW50LmNzcygnbWF4LWhlaWdodCcsIE1hdGgubWF4KGNvbnRlbnRIZWlnaHQsIDApICsgJ3B4JykuY3NzKCdib3gtc2l6aW5nJywgJ2JvcmRlci1ib3gnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgUG9wb3ZlcjogbmcuSUNvbXBvbmVudE9wdGlvbnMgPSB7XHJcbiAgICAgICAgYmluZGluZ3M6IFBvcG92ZXJCaW5kaW5ncyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3BvcG92ZXIvUG9wb3Zlci5odG1sJyxcclxuICAgICAgICBjb250cm9sbGVyOiBQb3BvdmVyQ29udHJvbGxlclxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdwaXBQb3BvdmVyJylcclxuICAgICAgICAuY29tcG9uZW50KCdwaXBQb3BvdmVyJywgUG9wb3Zlcik7XHJcbn0iLCJpbXBvcnQgeyBJUG9wb3ZlclNlcnZpY2UgfSBmcm9tICcuL0lQb3BvdmVyU2VydmljZSc7XHJcblxyXG57XHJcbiAgICBpbnRlcmZhY2UgUG9wb3ZlclRlbXBsYXRlU2NvcGUgZXh0ZW5kcyBuZy5JU2NvcGUge1xyXG4gICAgICAgIHBhcmFtcyA/IDogYW55O1xyXG4gICAgICAgIGxvY2FscyA/IDogYW55O1xyXG4gICAgfVxyXG5cclxuICAgIGNsYXNzIFBvcG92ZXJTZXJ2aWNlIGltcGxlbWVudHMgSVBvcG92ZXJTZXJ2aWNlIHtcclxuICAgICAgICBwcml2YXRlIHBvcG92ZXJUZW1wbGF0ZTogc3RyaW5nO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICAgICAgcHJpdmF0ZSAkY29tcGlsZTogbmcuSUNvbXBpbGVTZXJ2aWNlLFxyXG4gICAgICAgICAgICBwcml2YXRlICRyb290U2NvcGU6IG5nLklSb290U2NvcGVTZXJ2aWNlLFxyXG4gICAgICAgICAgICBwcml2YXRlICR0aW1lb3V0OiBuZy5JVGltZW91dFNlcnZpY2VcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgdGhpcy5wb3BvdmVyVGVtcGxhdGUgPSBcIjxkaXYgY2xhc3M9J3BpcC1wb3BvdmVyLWJhY2tkcm9wIHt7IHBhcmFtcy5jbGFzcyB9fScgbmctY29udHJvbGxlcj0ncGFyYW1zLmNvbnRyb2xsZXInXCIgK1xyXG4gICAgICAgICAgICAgICAgXCIgdGFiaW5kZXg9JzEnPiA8cGlwLXBvcG92ZXIgcGlwLXBhcmFtcz0ncGFyYW1zJz4gPC9waXAtcG9wb3Zlcj4gPC9kaXY+XCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc2hvdyhwOiBPYmplY3QpIHtcclxuICAgICAgICAgICAgbGV0IGVsZW1lbnQ6IEpRdWVyeSwgc2NvcGU6IFBvcG92ZXJUZW1wbGF0ZVNjb3BlLCBwYXJhbXM6IGFueSwgY29udGVudDogbmcuSVJvb3RFbGVtZW50U2VydmljZTtcclxuXHJcbiAgICAgICAgICAgIGVsZW1lbnQgPSAkKCdib2R5Jyk7XHJcbiAgICAgICAgICAgIGlmIChlbGVtZW50LmZpbmQoJ21kLWJhY2tkcm9wJykubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xyXG4gICAgICAgICAgICBzY29wZSA9IHRoaXMuJHJvb3RTY29wZS4kbmV3KCk7XHJcbiAgICAgICAgICAgIHBhcmFtcyA9IHAgJiYgXy5pc09iamVjdChwKSA/IHAgOiB7fTtcclxuICAgICAgICAgICAgc2NvcGUucGFyYW1zID0gcGFyYW1zO1xyXG4gICAgICAgICAgICBzY29wZS5sb2NhbHMgPSBwYXJhbXMubG9jYWxzO1xyXG4gICAgICAgICAgICBjb250ZW50ID0gdGhpcy4kY29tcGlsZSh0aGlzLnBvcG92ZXJUZW1wbGF0ZSkoc2NvcGUpO1xyXG4gICAgICAgICAgICBlbGVtZW50LmFwcGVuZChjb250ZW50KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBoaWRlKCkge1xyXG4gICAgICAgICAgICBjb25zdCBiYWNrZHJvcEVsZW1lbnQgPSAkKCcucGlwLXBvcG92ZXItYmFja2Ryb3AnKTtcclxuICAgICAgICAgICAgYmFja2Ryb3BFbGVtZW50LnJlbW92ZUNsYXNzKCdvcGVuZWQnKTtcclxuICAgICAgICAgICAgdGhpcy4kdGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBiYWNrZHJvcEVsZW1lbnQucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIH0sIDEwMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgcmVzaXplKCkge1xyXG4gICAgICAgICAgICB0aGlzLiRyb290U2NvcGUuJGJyb2FkY2FzdCgncGlwUG9wb3ZlclJlc2l6ZScpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncGlwUG9wb3Zlci5TZXJ2aWNlJywgW10pXHJcbiAgICAgICAgLnNlcnZpY2UoJ3BpcFBvcG92ZXJTZXJ2aWNlJywgUG9wb3ZlclNlcnZpY2UpO1xyXG59IiwiYW5ndWxhci5tb2R1bGUoJ3BpcFBvcG92ZXInLCBbJ3BpcFBvcG92ZXIuU2VydmljZSddKTtcclxuXHJcbmltcG9ydCAnLi9Qb3BvdmVyJztcclxuaW1wb3J0ICcuL1BvcG92ZXJTZXJ2aWNlJztcclxuXHJcbmV4cG9ydCAqIGZyb20gJy4vSVBvcG92ZXJTZXJ2aWNlJzsiLCJ7XHJcbiAgICBpbnRlcmZhY2UgSVJvdXRpbmdCaW5kaW5ncyB7XHJcbiAgICAgICAgW2tleTogc3RyaW5nXTogYW55O1xyXG5cclxuICAgICAgICBsb2dvVXJsOiBhbnk7XHJcbiAgICAgICAgc2hvd1Byb2dyZXNzOiBhbnk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgUm91dGluZ0JpbmRpbmdzOiBJUm91dGluZ0JpbmRpbmdzID0ge1xyXG4gICAgICAgIHNob3dQcm9ncmVzczogJyYnLFxyXG4gICAgICAgIGxvZ29Vcmw6ICdAJ1xyXG4gICAgfVxyXG5cclxuICAgIGNsYXNzIFJvdXRpbmdDb250cm9sbGVyIGltcGxlbWVudHMgbmcuSUNvbnRyb2xsZXIsIElSb3V0aW5nQmluZGluZ3Mge1xyXG4gICAgICAgIHByaXZhdGUgX2ltYWdlOiBhbnk7XHJcblxyXG4gICAgICAgIHB1YmxpYyBsb2dvVXJsOiBzdHJpbmc7XHJcbiAgICAgICAgcHVibGljIHNob3dQcm9ncmVzczogRnVuY3Rpb247XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgICAgICAkc2NvcGU6IG5nLklTY29wZSxcclxuICAgICAgICAgICAgcHJpdmF0ZSAkZWxlbWVudDogSlF1ZXJ5XHJcbiAgICAgICAgKSB7IH1cclxuXHJcbiAgICAgICAgcHVibGljICRwb3N0TGluaygpIHtcclxuICAgICAgICAgICAgdGhpcy5faW1hZ2UgPSB0aGlzLiRlbGVtZW50LmZpbmQoJ2ltZycpO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRQcm9ncmVzc0ltYWdlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgbG9hZFByb2dyZXNzSW1hZ2UoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmxvZ29VcmwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2ltYWdlLmF0dHIoJ3NyYycsIHRoaXMubG9nb1VybCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgUm91dGluZ1Byb2dyZXNzOiBuZy5JQ29tcG9uZW50T3B0aW9ucyA9IHtcclxuICAgICAgICBiaW5kaW5nczogUm91dGluZ0JpbmRpbmdzLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAncHJvZ3Jlc3MvUm91dGluZ1Byb2dyZXNzLmh0bWwnLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IFJvdXRpbmdDb250cm9sbGVyXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3BpcFJvdXRpbmdQcm9ncmVzcycsIFsnbmdNYXRlcmlhbCddKVxyXG4gICAgICAgIC5jb21wb25lbnQoJ3BpcFJvdXRpbmdQcm9ncmVzcycsIFJvdXRpbmdQcm9ncmVzcyk7XHJcbn0iLCJleHBvcnQgY2xhc3MgVG9hc3Qge1xyXG4gICAgdHlwZTogc3RyaW5nO1xyXG4gICAgaWQ6IHN0cmluZztcclxuICAgIGVycm9yOiBhbnk7XHJcbiAgICBtZXNzYWdlOiBzdHJpbmc7XHJcbiAgICBhY3Rpb25zOiBzdHJpbmdbXTtcclxuICAgIGR1cmF0aW9uOiBudW1iZXI7XHJcbiAgICBzdWNjZXNzQ2FsbGJhY2s6IEZ1bmN0aW9uO1xyXG4gICAgY2FuY2VsQ2FsbGJhY2s6IEZ1bmN0aW9uXHJcbn1cclxuIiwiaW1wb3J0IHsgVG9hc3QgfSBmcm9tICcuL1RvYXN0JztcclxuaW1wb3J0IHsgSVRvYXN0U2VydmljZSB9IGZyb20gJy4vSVRvYXN0U2VydmljZSc7XHJcblxyXG57XHJcbiAgICBjbGFzcyBUb2FzdENvbnRyb2xsZXIge1xyXG4gICAgICAgIHByaXZhdGUgX3BpcEVycm9yRGV0YWlsc0RpYWxvZztcclxuXHJcbiAgICAgICAgcHVibGljIG1lc3NhZ2U6IHN0cmluZztcclxuICAgICAgICBwdWJsaWMgYWN0aW9uczogc3RyaW5nW107XHJcbiAgICAgICAgcHVibGljIGFjdGlvbkxlbmdodDogbnVtYmVyO1xyXG4gICAgICAgIHB1YmxpYyBzaG93RGV0YWlsczogYm9vbGVhbjtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgICAgIHByaXZhdGUgJG1kVG9hc3Q6IGFuZ3VsYXIubWF0ZXJpYWwuSVRvYXN0U2VydmljZSxcclxuICAgICAgICAgICAgcHVibGljIHRvYXN0OiBUb2FzdCxcclxuICAgICAgICAgICAgJGluamVjdG9yOiBuZy5hdXRvLklJbmplY3RvclNlcnZpY2VcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgdGhpcy5fcGlwRXJyb3JEZXRhaWxzRGlhbG9nID0gJGluamVjdG9yLmhhcygncGlwRXJyb3JEZXRhaWxzRGlhbG9nJykgP1xyXG4gICAgICAgICAgICAgICAgJGluamVjdG9yLmdldCgncGlwRXJyb3JEZXRhaWxzRGlhbG9nJykgOiBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2UgPSB0b2FzdC5tZXNzYWdlO1xyXG4gICAgICAgICAgICB0aGlzLmFjdGlvbnMgPSB0b2FzdC5hY3Rpb25zO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRvYXN0LmFjdGlvbnMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFjdGlvbkxlbmdodCA9IDA7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFjdGlvbkxlbmdodCA9IHRvYXN0LmFjdGlvbnMubGVuZ3RoID09PSAxID8gdG9hc3QuYWN0aW9uc1swXS50b1N0cmluZygpLmxlbmd0aCA6IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuc2hvd0RldGFpbHMgPSB0aGlzLl9waXBFcnJvckRldGFpbHNEaWFsb2cgIT0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBvbkRldGFpbHMoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuJG1kVG9hc3QuaGlkZSgpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fcGlwRXJyb3JEZXRhaWxzRGlhbG9nKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9waXBFcnJvckRldGFpbHNEaWFsb2cuc2hvdyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiB0aGlzLnRvYXN0LmVycm9yLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvazogJ09rJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5ub29wLFxyXG4gICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIubm9vcFxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIG9uQWN0aW9uKGFjdGlvbik6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLiRtZFRvYXN0LmhpZGUoe1xyXG4gICAgICAgICAgICAgICAgYWN0aW9uOiBhY3Rpb24sXHJcbiAgICAgICAgICAgICAgICBpZDogdGhpcy50b2FzdC5pZCxcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHRoaXMubWVzc2FnZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY2xhc3MgVG9hc3RTZXJ2aWNlIGltcGxlbWVudHMgSVRvYXN0U2VydmljZSB7XHJcbiAgICAgICAgcHJpdmF0ZSBTSE9XX1RJTUVPVVQ6IG51bWJlciA9IDIwMDAwO1xyXG4gICAgICAgIHByaXZhdGUgU0hPV19USU1FT1VUX05PVElGSUNBVElPTlM6IG51bWJlciA9IDIwMDAwO1xyXG4gICAgICAgIHByaXZhdGUgdG9hc3RzOiBUb2FzdFtdID0gW107XHJcbiAgICAgICAgcHJpdmF0ZSBjdXJyZW50VG9hc3Q6IGFueTtcclxuICAgICAgICBwcml2YXRlIHNvdW5kczogYW55ID0ge307XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgICAgICAkcm9vdFNjb3BlOiBuZy5JUm9vdFNjb3BlU2VydmljZSxcclxuICAgICAgICAgICAgcHJpdmF0ZSAkbWRUb2FzdDogYW5ndWxhci5tYXRlcmlhbC5JVG9hc3RTZXJ2aWNlXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdWNjZXNzJywgKCkgPT4geyB0aGlzLm9uU3RhdGVDaGFuZ2VTdWNjZXNzKCkgfSk7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJG9uKCdwaXBTZXNzaW9uQ2xvc2VkJywgKCkgPT4geyB0aGlzLm9uQ2xlYXJUb2FzdHMoKSB9KTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kb24oJ3BpcElkZW50aXR5Q2hhbmdlZCcsICgpID0+IHsgdGhpcy5vbkNsZWFyVG9hc3RzKCkgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc2hvd05leHRUb2FzdCgpOiB2b2lkIHtcclxuICAgICAgICAgICAgbGV0IHRvYXN0OiBUb2FzdDtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnRvYXN0cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICB0b2FzdCA9IHRoaXMudG9hc3RzWzBdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50b2FzdHMuc3BsaWNlKDAsIDEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zaG93VG9hc3QodG9hc3QpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBTaG93IHRvYXN0XHJcbiAgICAgICAgcHVibGljIHNob3dUb2FzdCh0b2FzdDogVG9hc3QpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50VG9hc3QgPSB0b2FzdDtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuJG1kVG9hc3Quc2hvdyh7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0b2FzdC9Ub2FzdC5odG1sJyxcclxuICAgICAgICAgICAgICAgICAgICBoaWRlRGVsYXk6IHRvYXN0LmR1cmF0aW9uIHx8IHRoaXMuU0hPV19USU1FT1VULFxyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYm90dG9tIGxlZnQnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFRvYXN0Q29udHJvbGxlcixcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvYXN0OiB0aGlzLmN1cnJlbnRUb2FzdCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc291bmRzOiB0aGlzLnNvdW5kc1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAudGhlbihcclxuICAgICAgICAgICAgICAgICAgICAoYWN0aW9uOiBzdHJpbmcpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG93VG9hc3RPa1Jlc3VsdChhY3Rpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgKGFjdGlvbjogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd1RvYXN0Q2FuY2VsUmVzdWx0KGFjdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgc2hvd1RvYXN0Q2FuY2VsUmVzdWx0KGFjdGlvbjogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRUb2FzdC5jYW5jZWxDYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50VG9hc3QuY2FuY2VsQ2FsbGJhY2soYWN0aW9uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRUb2FzdCA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvd05leHRUb2FzdCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzaG93VG9hc3RPa1Jlc3VsdChhY3Rpb246IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50VG9hc3Quc3VjY2Vzc0NhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRUb2FzdC5zdWNjZXNzQ2FsbGJhY2soYWN0aW9uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRUb2FzdCA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvd05leHRUb2FzdCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGFkZFRvYXN0KHRvYXN0KTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRUb2FzdCAmJiB0b2FzdC50eXBlICE9PSAnZXJyb3InKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRvYXN0cy5wdXNoKHRvYXN0KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hvd1RvYXN0KHRvYXN0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHJlbW92ZVRvYXN0cyh0eXBlOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICAgICAgY29uc3QgcmVzdWx0OiBhbnlbXSA9IFtdO1xyXG4gICAgICAgICAgICBfLmVhY2godGhpcy50b2FzdHMsICh0b2FzdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0b2FzdC50eXBlIHx8IHRvYXN0LnR5cGUgIT09IHR5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh0b2FzdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLnRvYXN0cyA9IF8uY2xvbmVEZWVwKHJlc3VsdCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgcmVtb3ZlVG9hc3RzQnlJZChpZDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgICAgIF8ucmVtb3ZlKHRoaXMudG9hc3RzLCB7XHJcbiAgICAgICAgICAgICAgICBpZDogaWRcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgZ2V0VG9hc3RCeUlkKGlkOiBzdHJpbmcpOiBUb2FzdCB7XHJcbiAgICAgICAgICAgIHJldHVybiBfLmZpbmQodGhpcy50b2FzdHMsIHtcclxuICAgICAgICAgICAgICAgIGlkOiBpZFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBvblN0YXRlQ2hhbmdlU3VjY2VzcygpIHt9XHJcblxyXG4gICAgICAgIHB1YmxpYyBvbkNsZWFyVG9hc3RzKCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLmNsZWFyVG9hc3RzKG51bGwpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHNob3dOb3RpZmljYXRpb24obWVzc2FnZTogc3RyaW5nLCBhY3Rpb25zOiBzdHJpbmdbXSwgc3VjY2Vzc0NhbGxiYWNrLCBjYW5jZWxDYWxsYmFjaywgaWQ6IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLmFkZFRvYXN0KHtcclxuICAgICAgICAgICAgICAgIGlkOiBpZCB8fCBudWxsLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogJ25vdGlmaWNhdGlvbicsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBtZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgYWN0aW9uczogYWN0aW9ucyB8fCBbJ29rJ10sXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzQ2FsbGJhY2s6IHN1Y2Nlc3NDYWxsYmFjayxcclxuICAgICAgICAgICAgICAgIGNhbmNlbENhbGxiYWNrOiBjYW5jZWxDYWxsYmFjayxcclxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiB0aGlzLlNIT1dfVElNRU9VVF9OT1RJRklDQVRJT05TXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHNob3dNZXNzYWdlKG1lc3NhZ2U6IHN0cmluZywgc3VjY2Vzc0NhbGxiYWNrLCBjYW5jZWxDYWxsYmFjaywgaWQgPyA6IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLmFkZFRvYXN0KHtcclxuICAgICAgICAgICAgICAgIGlkOiBpZCB8fCBudWxsLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogJ21lc3NhZ2UnLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogbWVzc2FnZSxcclxuICAgICAgICAgICAgICAgIGFjdGlvbnM6IFsnb2snXSxcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3NDYWxsYmFjazogc3VjY2Vzc0NhbGxiYWNrLFxyXG4gICAgICAgICAgICAgICAgY2FuY2VsQ2FsbGJhY2s6IGNhbmNlbENhbGxiYWNrXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHNob3dFcnJvcihtZXNzYWdlOiBzdHJpbmcsIHN1Y2Nlc3NDYWxsYmFjaywgY2FuY2VsQ2FsbGJhY2ssIGlkOiBzdHJpbmcsIGVycm9yOiBhbnkpIHtcclxuICAgICAgICAgICAgdGhpcy5hZGRUb2FzdCh7XHJcbiAgICAgICAgICAgICAgICBpZDogaWQgfHwgbnVsbCxcclxuICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvcixcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdlcnJvcicsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBtZXNzYWdlIHx8ICdVbmtub3duIGVycm9yLicsXHJcbiAgICAgICAgICAgICAgICBhY3Rpb25zOiBbJ29rJ10sXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzQ2FsbGJhY2s6IHN1Y2Nlc3NDYWxsYmFjayxcclxuICAgICAgICAgICAgICAgIGNhbmNlbENhbGxiYWNrOiBjYW5jZWxDYWxsYmFja1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBoaWRlQWxsVG9hc3RzKCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLiRtZFRvYXN0LmNhbmNlbCgpO1xyXG4gICAgICAgICAgICB0aGlzLnRvYXN0cyA9IFtdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGNsZWFyVG9hc3RzKHR5cGUgPyA6IHN0cmluZykge1xyXG4gICAgICAgICAgICBpZiAodHlwZSkge1xyXG4gICAgICAgICAgICAgICAgLy8gcGlwQXNzZXJ0LmlzU3RyaW5nKHR5cGUsICdwaXBUb2FzdHMuY2xlYXJUb2FzdHM6IHR5cGUgc2hvdWxkIGJlIGEgc3RyaW5nJyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZVRvYXN0cyh0eXBlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuJG1kVG9hc3QuY2FuY2VsKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRvYXN0cyA9IFtdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncGlwVG9hc3RzJylcclxuICAgICAgICAuc2VydmljZSgncGlwVG9hc3RzJywgVG9hc3RTZXJ2aWNlKTtcclxufSIsImFuZ3VsYXIubW9kdWxlKCdwaXBUb2FzdHMnLCBbJ25nTWF0ZXJpYWwnLCAncGlwQ29udHJvbHMuVHJhbnNsYXRlJ10pXHJcblxyXG5pbXBvcnQgJy4vVG9hc3RTZXJ2aWNlJztcclxuaW1wb3J0ICcuL1RvYXN0JztcclxuXHJcbmV4cG9ydCAqIGZyb20gJy4vSVRvYXN0U2VydmljZSc7IiwiKGZ1bmN0aW9uKG1vZHVsZSkge1xudHJ5IHtcbiAgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcENvbnRyb2xzLlRlbXBsYXRlcycpO1xufSBjYXRjaCAoZSkge1xuICBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgncGlwQ29udHJvbHMuVGVtcGxhdGVzJywgW10pO1xufVxubW9kdWxlLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCdjb2xvcl9waWNrZXIvQ29sb3JQaWNrZXIuaHRtbCcsXG4gICAgJzx1bCBjbGFzcz1cInBpcC1jb2xvci1waWNrZXIge3skY3RybC5jbGFzc319XCIgcGlwLXNlbGVjdGVkPVwiJGN0cmwuY3VycmVudENvbG9ySW5kZXhcIiBwaXAtZW50ZXItc3BhY2UtcHJlc3M9XCIkY3RybC5lbnRlclNwYWNlUHJlc3MoJGV2ZW50KVwiPlxcbicgK1xuICAgICcgICAgPGxpIHRhYmluZGV4PVwiLTFcIiBuZy1yZXBlYXQ9XCJjb2xvciBpbiAkY3RybC5jb2xvcnMgdHJhY2sgYnkgY29sb3JcIj5cXG4nICtcbiAgICAnICAgICAgICA8bWQtYnV0dG9uICB0YWJpbmRleD1cIi0xXCIgY2xhc3M9XCJtZC1pY29uLWJ1dHRvbiBwaXAtc2VsZWN0YWJsZVwiIG5nLWNsaWNrPVwiJGN0cmwuc2VsZWN0Q29sb3IoJGluZGV4KVwiIFxcbicgK1xuICAgICcgICAgICAgICAgICAgICAgYXJpYS1sYWJlbD1cImNvbG9yXCIgbmctZGlzYWJsZWQ9XCIkY3RybC5uZ0Rpc2FibGVkXCI+XFxuJyArXG4gICAgJyAgICAgICAgICAgIDxtZC1pY29uIG5nLXN0eWxlPVwie1xcJ2NvbG9yXFwnOiBjb2xvcn1cIiBtZC1zdmctaWNvbj1cImljb25zOnt7IGNvbG9yID09ICRjdHJsLmN1cnJlbnRDb2xvciA/IFxcJ2NpcmNsZVxcJyA6IFxcJ3JhZGlvLW9mZlxcJyB9fVwiPlxcbicgK1xuICAgICcgICAgICAgICAgICA8L21kLWljb24+XFxuJyArXG4gICAgJyAgICAgICAgPC9tZC1idXR0b24+XFxuJyArXG4gICAgJyAgICA8L2xpPlxcbicgK1xuICAgICc8L3VsPlxcbicgK1xuICAgICcnKTtcbn1dKTtcbn0pKCk7XG5cbihmdW5jdGlvbihtb2R1bGUpIHtcbnRyeSB7XG4gIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBDb250cm9scy5UZW1wbGF0ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcENvbnRyb2xzLlRlbXBsYXRlcycsIFtdKTtcbn1cbm1vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgncG9wb3Zlci9Qb3BvdmVyLmh0bWwnLFxuICAgICc8ZGl2IGNsYXNzPVxcJ3BpcC1wb3BvdmVyXFwnIG5nLWNsaWNrPVwiJGN0cmwucGFyYW1zLm9uUG9wb3ZlckNsaWNrKCRldmVudClcIj5cXG4nICtcbiAgICAnPC9kaXY+XFxuJyArXG4gICAgJycpO1xufV0pO1xufSkoKTtcblxuKGZ1bmN0aW9uKG1vZHVsZSkge1xudHJ5IHtcbiAgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcENvbnRyb2xzLlRlbXBsYXRlcycpO1xufSBjYXRjaCAoZSkge1xuICBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgncGlwQ29udHJvbHMuVGVtcGxhdGVzJywgW10pO1xufVxubW9kdWxlLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCdwcm9ncmVzcy9Sb3V0aW5nUHJvZ3Jlc3MuaHRtbCcsXG4gICAgJzxkaXYgY2xhc3M9XCJsYXlvdXQtY29sdW1uIGxheW91dC1hbGlnbi1jZW50ZXItY2VudGVyXCIgbmctc2hvdz1cIiRjdHJsLnNob3dQcm9ncmVzcygpXCI+XFxuJyArXG4gICAgJyAgICA8ZGl2IGNsYXNzPVwibG9hZGVyXCI+XFxuJyArXG4gICAgJyAgICAgICAgPHN2ZyBjbGFzcz1cImNpcmN1bGFyXCIgdmlld0JveD1cIjI1IDI1IDUwIDUwXCI+XFxuJyArXG4gICAgJyAgICAgICAgICAgIDxjaXJjbGUgY2xhc3M9XCJwYXRoXCIgY3g9XCI1MFwiIGN5PVwiNTBcIiByPVwiMjBcIiBmaWxsPVwibm9uZVwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbWl0ZXJsaW1pdD1cIjEwXCIvPlxcbicgK1xuICAgICcgICAgICAgIDwvc3ZnPlxcbicgK1xuICAgICcgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgICA8aW1nIHNyYz1cIlwiICBoZWlnaHQ9XCI0MFwiIHdpZHRoPVwiNDBcIiBjbGFzcz1cInBpcC1pbWdcIj5cXG4nICtcbiAgICAnICAgIDxtZC1wcm9ncmVzcy1jaXJjdWxhciBtZC1kaWFtZXRlcj1cIjk2XCIgY2xhc3M9XCJmaXgtaWVcIj48L21kLXByb2dyZXNzLWNpcmN1bGFyPlxcbicgK1xuICAgICc8L2Rpdj5cXG4nICtcbiAgICAnJyk7XG59XSk7XG59KSgpO1xuXG4oZnVuY3Rpb24obW9kdWxlKSB7XG50cnkge1xuICBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgncGlwQ29udHJvbHMuVGVtcGxhdGVzJyk7XG59IGNhdGNoIChlKSB7XG4gIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBDb250cm9scy5UZW1wbGF0ZXMnLCBbXSk7XG59XG5tb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoJ3RvYXN0L1RvYXN0Lmh0bWwnLFxuICAgICc8bWQtdG9hc3QgY2xhc3M9XCJtZC1hY3Rpb24gcGlwLXRvYXN0XCJcXG4nICtcbiAgICAnICAgICAgICAgIG5nLWNsYXNzPVwie1xcJ3BpcC1lcnJvclxcJzogdm0udG9hc3QudHlwZT09XFwnZXJyb3JcXCcsXFxuJyArXG4gICAgJyAgICAgICAgICBcXCdwaXAtY29sdW1uLXRvYXN0XFwnOiB2bS50b2FzdC5hY3Rpb25zLmxlbmd0aCA+IDEgfHwgdm0uYWN0aW9uTGVuZ2h0ID4gNCxcXG4nICtcbiAgICAnICAgICAgICAgIFxcJ3BpcC1uby1hY3Rpb24tdG9hc3RcXCc6IHZtLmFjdGlvbkxlbmdodCA9PSAwfVwiXFxuJyArXG4gICAgJyAgICAgICAgICBzdHlsZT1cImhlaWdodDppbml0aWFsOyBtYXgtaGVpZ2h0OiBpbml0aWFsOyBcIj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgICA8c3BhbiBjbGFzcz1cImZsZXgtdmFyIHBpcC10ZXh0XCIgbmctYmluZC1odG1sPVwidm0ubWVzc2FnZVwiPjwvc3Bhbj5cXG4nICtcbiAgICAnICAgIDxkaXYgY2xhc3M9XCJsYXlvdXQtcm93IGxheW91dC1hbGlnbi1lbmQtc3RhcnQgcGlwLWFjdGlvbnNcIiBuZy1pZj1cInZtLmFjdGlvbnMubGVuZ3RoID4gMCB8fCAodm0udG9hc3QudHlwZT09XFwnZXJyb3JcXCcgJiYgdm0udG9hc3QuZXJyb3IpXCI+XFxuJyArXG4gICAgJyAgICAgICAgPGRpdiBjbGFzcz1cImZsZXhcIiBuZy1pZj1cInZtLnRvYXN0LmFjdGlvbnMubGVuZ3RoID4gMVwiPiA8L2Rpdj5cXG4nICtcbiAgICAnICAgICAgICAgICAgPG1kLWJ1dHRvbiBjbGFzcz1cImZsZXgtZml4ZWQgcGlwLXRvYXN0LWJ1dHRvblwiIG5nLWlmPVwidm0udG9hc3QudHlwZT09XFwnZXJyb3JcXCcgJiYgdm0udG9hc3QuZXJyb3IgJiYgdm0uc2hvd0RldGFpbHNcIiBuZy1jbGljaz1cInZtLm9uRGV0YWlscygpXCI+RGV0YWlsczwvbWQtYnV0dG9uPlxcbicgK1xuICAgICcgICAgICAgICAgICA8bWQtYnV0dG9uIGNsYXNzPVwiZmxleC1maXhlZCBwaXAtdG9hc3QtYnV0dG9uXCJcXG4nICtcbiAgICAnICAgICAgICAgICAgICAgICAgICBuZy1jbGljaz1cInZtLm9uQWN0aW9uKGFjdGlvbilcIlxcbicgK1xuICAgICcgICAgICAgICAgICAgICAgICAgIG5nLXJlcGVhdD1cImFjdGlvbiBpbiB2bS5hY3Rpb25zXCJcXG4nICtcbiAgICAnICAgICAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPVwie3s6OmFjdGlvbnwgdHJhbnNsYXRlfX1cIj5cXG4nICtcbiAgICAnICAgICAgICAgICAgICAgIHt7OjphY3Rpb258IHRyYW5zbGF0ZX19XFxuJyArXG4gICAgJyAgICAgICAgICAgIDwvbWQtYnV0dG9uPlxcbicgK1xuICAgICcgICAgICAgXFxuJyArXG4gICAgJyAgICA8L2Rpdj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJzwvbWQtdG9hc3Q+Jyk7XG59XSk7XG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1waXAtd2VidWktY29udHJvbHMtaHRtbC5qcy5tYXBcbiJdfQ==