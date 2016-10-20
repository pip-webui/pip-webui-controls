/**
 * @file Registration of basic WebUI controls
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function (angular) {
    'use strict';

    angular.module('pipControls', [
        'pipMarkdown',
        'pipColorPicker',
        'pipRoutingProgress',
        'pipPopover',
        'pipImageSlider',
        'pipToasts',
        'pipUnsavedChanges',
        'pipControls.Translate',
        'pipDraggable'
    ]);

})(window.angular);


(function(module) {
try {
  module = angular.module('pipControls.Templates');
} catch (e) {
  module = angular.module('pipControls.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('color_picker/color_picker.html',
    '<ul class="pip-color-picker {{class}}" pip-selected="currentColorIndex" pip-enter-space-press="enterSpacePress($event)">\n' +
    '    <li tabindex="-1" ng-repeat="color in colors track by color">\n' +
    '        <md-button  tabindex="-1" class="md-icon-button pip-selectable" ng-click="selectColor($index)" aria-label="color" ng-disabled="disabled()">\n' +
    '            <md-icon ng-style="{\'color\': color}" md-svg-icon="icons:{{ color == currentColor ? \'circle\' : \'radio-off\' }}">\n' +
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
    '<div ng-if="params.templateUrl" class=\'pip-popover flex layout-column\'\n' +
    '     ng-click="onPopoverClick($event)" ng-include="params.templateUrl">\n' +
    '</div>\n' +
    '\n' +
    '<div ng-if="params.template" class=\'pip-popover\' ng-click="onPopoverClick($event)">\n' +
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
  $templateCache.put('progress/routing_progress.html',
    '<div class="pip-routing-progress layout-column layout-align-center-center"\n' +
    '        ng-show="showProgress()">\n' +
    '     <!--ng-show="$routing || $reset || toolInitialized">-->\n' +
    '    <div class="loader">\n' +
    '        <svg class="circular" viewBox="25 25 50 50">\n' +
    '            <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/>\n' +
    '        </svg>\n' +
    '    </div>\n' +
    '\n' +
    '    <img src=""  height="40" width="40" class="pip-img">\n' +
    '\n' +
    '    <md-progress-circular md-diameter="96"\n' +
    '                          class="fix-ie"></md-progress-circular>\n' +
    '\n' +
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
    '          ng-class="{\'pip-error\': toast.type==\'error\',\n' +
    '          \'pip-column-toast\': toast.type == \'error\' || toast.actions.length > 1 || actionLenght > 4,\n' +
    '          \'pip-no-action-toast\': actionLenght == 0}"\n' +
    '          style="height:initial; max-height: initial; ">\n' +
    '\n' +
    '    <span class="flex-var pip-text" ng-bind-html="message"></span>\n' +
    '    <div class="layout-row layout-align-end-start" class="pip-actions" ng-if="actions.length > 0 || (toast.type==\'error\' && toast.error)">\n' +
    '        <md-button class="flex-fixed pip-toast-button" ng-if="toast.type==\'error\' && toast.error && showDetails" ng-click="onDetails()">Details</md-button>\n' +
    '        <md-button class="flex-fixed pip-toast-button"\n' +
    '                   ng-click="onAction(action)"\n' +
    '                   ng-repeat="action in actions"\n' +
    '                   aria-label="{{::action| translate}}">\n' +
    '            {{::action| translate}}\n' +
    '        </md-button>\n' +
    '    </div>\n' +
    '\n' +
    '</md-toast>');
}]);
})();

/**
 * @file Color picker control
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular, _) {
    'use strict';

    var thisModule = angular.module('pipColorPicker', [ 'pipControls.Templates']); // 'pipFocused',

    thisModule.directive('pipColorPicker',
        function () {
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
        }
    );
    thisModule.controller('pipColorPickerController',
        ['$scope', '$element', '$attrs', '$timeout', function ($scope, $element, $attrs, $timeout) {
            var
                DEFAULT_COLORS = ['purple', 'lightgreen', 'green', 'darkred', 'pink', 'yellow', 'cyan'];

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
        }]
    );

})(window.angular, window._);

/**
 * @file Optional filter to translate string resources
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipControls.Translate', []);

    thisModule.filter('translate', ['$injector', function ($injector) {
        var pipTranslate = $injector.has('pipTranslate') 
            ? $injector.get('pipTranslate') : null;

        return function (key) {
            return pipTranslate  ? pipTranslate.translate(key) || key : key;
        }
    }]);

})();

/**
 * @file Drag & drop attachable behavior
 * @description
 * Based on https://github.com/fatlinesofcode/pipDraggable
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipDraggable", ['pipUtils']);

    thisModule.service('pipDraggable', function () {

        var scope = this;
        scope.inputEvent = function (event) {
            if (angular.isDefined(event.touches)) {
                return event.touches[0];
            }
            //Checking both is not redundent. If only check if touches isDefined, angularjs isDefnied will return error and stop the remaining scripty if event.originalEvent is not defined.
            else if (angular.isDefined(event.originalEvent) && angular.isDefined(event.originalEvent.touches)) {
                return event.originalEvent.touches[0];
            }
            return event;
        };

    });

    thisModule.directive('pipDrag', ['$rootScope', '$parse', '$document', '$window', 'pipDraggable', 'pipUtils', function ($rootScope, $parse, $document, $window, pipDraggable, pipUtils) {
            return {

                restrict: 'A',
                link: function (scope, element, attrs) {
                    scope.value = attrs.ngDrag;
                    var LONG_PRESS = 50; // 50ms for longpress
                    var offset, _centerAnchor = false, _mx, _my, _tx, _ty, _mrx, _mry;
                    var _hasTouch = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;
                    var _pressEvents = 'touchstart mousedown';
                    var _moveEvents = 'touchmove mousemove';
                    var _releaseEvents = 'touchend mouseup';
                    var _dragHandle;

                    // to identify the element in order to prevent getting superflous events when a single element has both drag and drop directives on it.
                    var _myid = scope.$id;
                    var _data = null;

                    var _dragOffset = null;

                    var _dragEnabled = false;

                    var _pressTimer = null;

                    var _elementStyle = {};

                    var onDragStartCallback = $parse(attrs.pipDragStart) || null;
                    var onDragStopCallback = $parse(attrs.pipDragStop) || null;
                    var onDragSuccessCallback = $parse(attrs.pipDragSuccess) || null;
                    var allowTransform = angular.isDefined(attrs.allowTransform) ? scope.$eval(attrs.allowTransform) : false;

                    var getDragData = $parse(attrs.pipDragData);
                    var
                        verticalScroll = pipUtils.toBoolean(attrs.pipVerticalScroll) || true,
                        horizontalScroll = pipUtils.toBoolean(attrs.pipHorizontalScroll) || true,
                        activationDistance = parseFloat(attrs.pipActivationDistance) || 75,
                        scrollDistance = parseFloat(attrs.pipScrollDistance) || 50,
                        scrollParent = false,

                        scrollContainer = angular.element(window),
                        scrollContainerGetter = $parse(attrs.pipScrollContainer);

                    // deregistration function for mouse move events in $rootScope triggered by jqLite trigger handler
                    var _deregisterRootMoveListener = angular.noop;

                    var initialize = function () {
                        element.attr('pip-draggable', 'false'); // prevent native drag
                        // check to see if drag handle(s) was specified
                        // if querySelectorAll is available, we use this instead of find
                        // as JQLite find is limited to tagnames
                        if (element[0].querySelectorAll) {
                            var dragHandles = angular.element(element[0].querySelectorAll('[pip-drag-handle]'));
                        } else {
                            var dragHandles = element.find('[pip-drag-handle]');
                        }
                        if (dragHandles.length) {
                            _dragHandle = dragHandles;
                        }
                        toggleListeners(true);

                        // Initialize scroll container
                        if (scrollParent) {
                            scrollContainer = angular.element($element.parent());
                        } else if (attrs.pipScrollContainer) {
                            scrollContainer = angular.element(scrollContainerGetter(scope));
                        } else {
                            scrollContainer = angular.element(window);
                        }
                    };

                    var toggleListeners = function (enable) {
                        if (!enable)return;
                        // add listeners.

                        scope.$on('$destroy', onDestroy);
                        scope.$watch(attrs.pipDrag, onEnableChange);
                        scope.$watch(attrs.pipCenterAnchor, onCenterAnchor);
                        // wire up touch events
                        if (_dragHandle) {
                            // handle(s) specified, use those to initiate drag
                            _dragHandle.on(_pressEvents, onpress);
                        } else {
                            // no handle(s) specified, use the element as the handle
                            element.on(_pressEvents, onpress);
                        }
                        if (!_hasTouch && element[0].nodeName.toLowerCase() == "img") {
                            element.on('mousedown', function () {
                                return false;
                            }); // prevent native drag for images
                        }
                    };
                    var onDestroy = function (enable) {
                        toggleListeners(false);
                    };
                    var onEnableChange = function (newVal, oldVal) {
                        _dragEnabled = (newVal);
                    };
                    var onCenterAnchor = function (newVal, oldVal) {
                        if (angular.isDefined(newVal))
                            _centerAnchor = (newVal || 'true');
                    };

                    var isClickableElement = function (evt) {
                        return (
                            angular.isDefined(angular.element(evt.target).attr("pip-cancel-drag"))
                        );
                    };
                    /*
                     * When the element is clicked start the drag behaviour
                     * On touch devices as a small delay so as not to prevent native window scrolling
                     */
                    var onpress = function (evt) {
                        if (!_dragEnabled)return;

                        if (isClickableElement(evt)) {
                            return;
                        }

                        if (evt.type == "mousedown" && evt.button != 0) {
                            // Do not start dragging on right-click
                            return;
                        }

                        saveElementStyles();

                        if (_hasTouch) {
                            cancelPress();
                            _pressTimer = setTimeout(function () {
                                cancelPress();
                                onlongpress(evt);
                            }, LONG_PRESS);
                            $document.on(_moveEvents, cancelPress);
                            $document.on(_releaseEvents, cancelPress);
                        } else {
                            onlongpress(evt);
                        }

                    };

                    function saveElementStyles() {
                        _elementStyle.left = element.css('css') || 0;
                        _elementStyle.top = element.css('top') || 0;
                        _elementStyle.position = element.css('position');
                        _elementStyle.width = element.css('width');    
                    }

                    var cancelPress = function () {
                        clearTimeout(_pressTimer);
                        $document.off(_moveEvents, cancelPress);
                        $document.off(_releaseEvents, cancelPress);
                    };

                    var onlongpress = function (evt) {
                        if (!_dragEnabled)return;
                        evt.preventDefault();

                        offset = element[0].getBoundingClientRect();
                        if (allowTransform)
                            _dragOffset = offset;
                        else {
                            _dragOffset = {left: document.body.scrollLeft, top: document.body.scrollTop};
                        }


                        element.centerX = element[0].offsetWidth / 2;
                        element.centerY = element[0].offsetHeight / 2;

                        _mx = pipDraggable.inputEvent(evt).pageX;
                        _my = pipDraggable.inputEvent(evt).pageY;
                        _mrx = _mx - offset.left;
                        _mry = _my - offset.top;
                        if (_centerAnchor) {
                            _tx = _mx - element.centerX - $window.pageXOffset;
                            _ty = _my - element.centerY - $window.pageYOffset;
                        } else {
                            _tx = _mx - _mrx - $window.pageXOffset;
                            _ty = _my - _mry - $window.pageYOffset;
                        }

                        $document.on(_moveEvents, onmove);
                        $document.on(_releaseEvents, onrelease);
                        // This event is used to receive manually triggered mouse move events
                        // jqLite unfortunately only supports triggerHandler(...)
                        // See http://api.jquery.com/triggerHandler/
                        // _deregisterRootMoveListener = $rootScope.$on('draggable:_triggerHandlerMove', onmove);
                        _deregisterRootMoveListener = $rootScope.$on('draggable:_triggerHandlerMove', function (event, origEvent) {
                            onmove(origEvent);
                        });
                    };

                    var onmove = function (evt) {
                        if (!_dragEnabled)return;
                        evt.preventDefault();

                        if (!element.hasClass('pip-dragging')) {
                            _data = getDragData(scope);
                            element.addClass('pip-dragging');
                            $rootScope.$broadcast('draggable:start', {
                                x: _mx,
                                y: _my,
                                tx: _tx,
                                ty: _ty,
                                event: evt,
                                element: element,
                                data: _data
                            });

                            if (onDragStartCallback) {
                                scope.$apply(function () {
                                    onDragStartCallback(scope, {$data: _data, $event: evt});
                                });
                            }
                        }

                        _mx = pipDraggable.inputEvent(evt).pageX;
                        _my = pipDraggable.inputEvent(evt).pageY;

                        if (horizontalScroll || verticalScroll) {
                            dragToScroll();
                        }

                        if (_centerAnchor) {
                            _tx = _mx - element.centerX - _dragOffset.left;
                            _ty = _my - element.centerY - _dragOffset.top;
                        } else {
                            _tx = _mx - _mrx - _dragOffset.left;
                            _ty = _my - _mry - _dragOffset.top;
                        }

                        moveElement(_tx, _ty);

                        $rootScope.$broadcast('draggable:move', {
                            x: _mx,
                            y: _my,
                            tx: _tx,
                            ty: _ty,
                            event: evt,
                            element: element,
                            data: _data,
                            uid: _myid,
                            dragOffset: _dragOffset
                        });
                    };

                    var onrelease = function (evt) {
                        if (!_dragEnabled)
                            return;
                        evt.preventDefault();
                        $rootScope.$broadcast('draggable:end', {
                            x: _mx,
                            y: _my,
                            tx: _tx,
                            ty: _ty,
                            event: evt,
                            element: element,
                            data: _data,
                            callback: onDragComplete,
                            uid: _myid
                        });
                        element.removeClass('pip-dragging');
                        element.parent().find('.pip-drag-enter').removeClass('pip-drag-enter');
                        reset();
                        $document.off(_moveEvents, onmove);
                        $document.off(_releaseEvents, onrelease);

                        if (onDragStopCallback) {
                            scope.$apply(function () {
                                onDragStopCallback(scope, {$data: _data, $event: evt});
                            });
                        }

                        _deregisterRootMoveListener();
                    };

                    var onDragComplete = function (evt) {


                        if (!onDragSuccessCallback)return;

                        scope.$apply(function () {
                            onDragSuccessCallback(scope, {$data: _data, $event: evt});
                        });
                    };

                    var reset = function () {
                        if (allowTransform)
                            element.css({transform: '', 'z-index': '', '-webkit-transform': '', '-ms-transform': ''});
                        else {
                            element.css({'position': _elementStyle.position, top: _elementStyle.top, left: _elementStyle.left, 'z-index': '', width: _elementStyle.width});
                        }
                    };

                    var moveElement = function (x, y) {
                        var eWidth = element.css('width');
                        if (allowTransform) {
                            element.css({
                                transform: 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ' + x + ', ' + y + ', 0, 1)',
                                'z-index': 99999,
                                '-webkit-transform': 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ' + x + ', ' + y + ', 0, 1)',
                                '-ms-transform': 'matrix(1, 0, 0, 1, ' + x + ', ' + y + ')'
                            });
                        } else {
                            element.css({
                                'left': x + 'px',
                                'top': y + 'px',
                                'position': 'fixed',
                                'z-index': 100,
                                width: eWidth
                            });
                        }
                    };

                    var dragToScroll = function () {
                        var scrollX = 0, scrollY = 0,
                            offset = function (element) {
                                return element.offset() || {left: 0, top: 0};
                            };

                        if (horizontalScroll) {
                            var
                                containerLeft = offset(scrollContainer).left,
                                containerWidth = scrollContainer.innerWidth(),
                                containerRight = containerLeft + containerWidth;

                            if ((_mx - containerLeft) < activationDistance) {
                                scrollX = -scrollDistance;
                            }
                            else if ((containerRight - _mx) < activationDistance) {
                                scrollX = scrollDistance;
                            }
                        }

                        if (verticalScroll) {
                            var
                                containerTop = offset(scrollContainer).top,
                                containerHeight = scrollContainer.innerHeight(),
                                containerBottom = containerTop + containerHeight;

                            if ((_my - containerTop) < activationDistance) {
                                scrollY = -scrollDistance + 30;
                            }
                            else if ((containerBottom - _my) < activationDistance) {
                                scrollY = scrollDistance - 30;
                            }
                        }
                        if (scrollX !== 0 || scrollY !== 0) {
                            var
                                containerScrollLeft = scrollContainer.scrollLeft(),
                                containerScrollTop = scrollContainer.scrollTop();

                            scrollContainer.scrollLeft(containerScrollLeft + scrollX);
                            scrollContainer.scrollTop(containerScrollTop + scrollY);
                        }

                    };

                    initialize();
                }
            };
        }]);

    thisModule.directive('pipDrop', ['$parse', '$timeout', '$window', '$document', 'pipDraggable', function ($parse, $timeout, $window, $document, pipDraggable) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.value = attrs.pipDrop;
                scope.isTouching = false;

                var _lastDropTouch = null;

                var _myid = scope.$id;

                var _dropEnabled = false;

                var onDropCallback = $parse(attrs.pipDropSuccess);// || function(){};

                var onDragStartCallback = $parse(attrs.pipDragStart);
                var onDragStopCallback = $parse(attrs.pipDragStop);
                var onDragMoveCallback = $parse(attrs.pipDragMove);

                var initialize = function () {
                    toggleListeners(true);
                };

                var toggleListeners = function (enable) {
                    // remove listeners

                    if (!enable)return;
                    // add listeners.
                    scope.$watch(attrs.pipDrop, onEnableChange);
                    scope.$on('$destroy', onDestroy);
                    scope.$on('draggable:start', onDragStart);
                    scope.$on('draggable:move', onDragMove);
                    scope.$on('draggable:end', onDragEnd);
                };

                var onDestroy = function (enable) {
                    toggleListeners(false);
                };
                var onEnableChange = function (newVal, oldVal) {
                    _dropEnabled = newVal;
                };
                var onDragStart = function (evt, obj) {
                    if (!_dropEnabled)return;
                    isTouching(obj.x, obj.y, obj.element);

                    if (attrs.pipDragStart) {
                        $timeout(function () {
                            onDragStartCallback(scope, {$data: obj.data, $event: obj});
                        });
                    }
                };
                var onDragMove = function (evt, obj) {
                    if (!_dropEnabled)return;
                    isTouching(obj.x, obj.y, obj.element);

                    if (attrs.pipDragMove) {
                        $timeout(function () {
                            onDragMoveCallback(scope, {$data: obj.data, $event: obj});
                        });
                    }
                };

                var onDragEnd = function (evt, obj) {

                    // don't listen to drop events if this is the element being dragged
                    // only update the styles and return
                    if (!_dropEnabled || _myid === obj.uid) {
                        updateDragStyles(false, obj.element);
                        return;
                    }
                    if (isTouching(obj.x, obj.y, obj.element)) {
                        // call the pipDraggable pipDragSuccess element callback
                        if (obj.callback) {
                            obj.callback(obj);
                        }

                        if (attrs.pipDropSuccess) {
                            $timeout(function () {
                                onDropCallback(scope, {
                                    $data: obj.data,
                                    $event: obj,
                                    $target: scope.$eval(scope.value)
                                });
                            });
                        }
                    }

                    if (attrs.pipDragStop) {
                        $timeout(function () {
                            onDragStopCallback(scope, {$data: obj.data, $event: obj});
                        });
                    }

                    updateDragStyles(false, obj.element);
                };

                var isTouching = function (mouseX, mouseY, dragElement) {
                    var touching = hitTest(mouseX, mouseY);
                    scope.isTouching = touching;
                    if (touching) {
                        _lastDropTouch = element;
                    }
                    updateDragStyles(touching, dragElement);
                    return touching;
                };

                var updateDragStyles = function (touching, dragElement) {
                    if (touching) {
                        element.addClass('pip-drag-enter');
                        dragElement.addClass('pip-drag-over');
                    } else if (_lastDropTouch == element) {
                        _lastDropTouch = null;
                        element.removeClass('pip-drag-enter');
                        dragElement.removeClass('pip-drag-over');
                    }
                };

                var hitTest = function (x, y) {
                    var bounds = element[0].getBoundingClientRect();
                    x -= $document[0].body.scrollLeft + $document[0].documentElement.scrollLeft;
                    y -= $document[0].body.scrollTop + $document[0].documentElement.scrollTop;
                    return x >= bounds.left
                        && x <= bounds.right
                        && y <= bounds.bottom
                        && y >= bounds.top;
                };

                initialize();
            }
        };
    }]);

    //thisModule.directive('pipDragClone', ['$parse', '$timeout', 'pipDraggable', function ($parse, $timeout, pipDraggable) {
    //    return {
    //        restrict: 'A',
    //        link: function (scope, element, attrs) {
    //            var img, _allowClone = true;
    //            var _dragOffset = null;
    //            scope.clonedData = {};
    //            var initialize = function () {
//
    //                img = element.find('img');
    //                element.attr('pip-draggable', 'false');
    //                img.attr('draggable', 'false');
    //                reset();
    //                toggleListeners(true);
    //            };
//
//
    //            var toggleListeners = function (enable) {
    //                // remove listeners
//
    //                if (!enable)return;
    //                // add listeners.
    //                scope.$on('draggable:start', onDragStart);
    //                scope.$on('draggable:move', onDragMove);
    //                scope.$on('draggable:end', onDragEnd);
    //                preventContextMenu();
//
    //            };
    //            var preventContextMenu = function () {
    //                //  element.off('mousedown touchstart touchmove touchend touchcancel', absorbEvent_);
    //                img.off('mousedown touchstart touchmove touchend touchcancel', absorbEvent_);
    //                //  element.on('mousedown touchstart touchmove touchend touchcancel', absorbEvent_);
    //                img.on('mousedown touchstart touchmove touchend touchcancel', absorbEvent_);
    //            };
    //            var onDragStart = function (evt, obj, elm) {
    //                _allowClone = true;
    //                if (angular.isDefined(obj.data.allowClone)) {
    //                    _allowClone = obj.data.allowClone;
    //                }
    //                if (_allowClone) {
    //                    scope.$apply(function () {
    //                        scope.clonedData = obj.data;
    //                    });
    //                    element.css('width', obj.element[0].offsetWidth);
    //                    element.css('height', obj.element[0].offsetHeight);
//
    //                    moveElement(obj.tx, obj.ty);
    //                }
//
    //            };
    //            var onDragMove = function (evt, obj) {
    //                if (_allowClone) {
//
    //                    _tx = obj.tx + obj.dragOffset.left;
    //                    _ty = obj.ty + obj.dragOffset.top;
//
    //                    moveElement(_tx, _ty);
    //                }
    //            };
    //            var onDragEnd = function (evt, obj) {
    //                //moveElement(obj.tx,obj.ty);
    //                if (_allowClone) {
    //                    reset();
    //                }
    //            };
//
    //            var reset = function () {
    //                element.css({left: 0, top: 0, position: 'fixed', 'z-index': -1, visibility: 'hidden'});
    //            };
    //            var moveElement = function (x, y) {
    //                element.css({
    //                    transform: 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ' + x + ', ' + y + ', 0, 1)',
    //                    'z-index': 99999,
    //                    'visibility': 'visible',
    //                    '-webkit-transform': 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ' + x + ', ' + y + ', 0, 1)',
    //                    '-ms-transform': 'matrix(1, 0, 0, 1, ' + x + ', ' + y + ')'
    //                    //,margin: '0'  don't monkey with the margin,
    //                });
    //            };
//
    //            var absorbEvent_ = function (event) {
    //                var e = event;//.originalEvent;
    //                e.preventDefault && e.preventDefault();
    //                e.stopPropagation && e.stopPropagation();
    //                e.cancelBubble = true;
    //                e.returnValue = false;
    //                return false;
    //            };
//
    //            initialize();
    //        }
    //    };
    //}]);

    thisModule.directive('pipPreventDrag', ['$parse', '$timeout', function ($parse, $timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var initialize = function () {

                    element.attr('pip-draggable', 'false');
                    toggleListeners(true);
                };


                var toggleListeners = function (enable) {
                    // remove listeners

                    if (!enable)return;
                    // add listeners.
                    element.on('mousedown touchstart touchmove touchend touchcancel', absorbEvent_);
                };


                var absorbEvent_ = function (event) {
                    var e = event.originalEvent;
                    e.preventDefault && e.preventDefault();
                    e.stopPropagation && e.stopPropagation();
                    e.cancelBubble = true;
                    e.returnValue = false;
                    return false;
                };

                initialize();
            }
        };
    }]);

    thisModule.directive('pipCancelDrag', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.find('*').attr('pip-cancel-drag', 'pip-cancel-drag');
            }
        };
    });
})();


/**
 * @file Image slider control
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular, _, $) {
    'use strict';

    var thisModule = angular.module('pipImageSlider', ['pipSliderButton', 'pipSliderIndicator', 'pipImageSlider.Service']);

    thisModule.directive('pipImageSlider',
        function () {
            return {
                scope: {
                    sliderIndex: '=pipImageIndex'
                },
                controller: ['$scope', '$element', '$attrs', '$parse', '$timeout', '$interval', '$pipImageSlider', function ($scope, $element, $attrs, $parse, $timeout, $interval, $pipImageSlider) {
                    var blocks,
                        index = 0, newIndex,
                        direction,
                        type = $parse($attrs.pipAnimationType)($scope),
                        DEFAULT_INTERVAL = 4500,
                        interval = $parse($attrs.pipAnimationInterval)($scope),
                        timePromises,
                        throttled;

                    $element.addClass('pip-image-slider');
                    $element.addClass('pip-animation-' + type);

                    $scope.swipeStart = 0;
                    /*
                     if ($swipe)
                     $swipe.bind($element, {
                     'start': function(coords) {
                     if (coords) $scope.swipeStart = coords.x;
                     else $scope.swipeStart = 0;
                     },
                     'end': function(coords) {
                     var delta;
                     if (coords) {
                     delta = $scope.swipeStart - coords.x;
                     if (delta > 150)  $scope.nextBlock();
                     if (delta < -150)  $scope.prevBlock();
                     $scope.swipeStart = 0;
                     } else $scope.swipeStart = 0;
                     }
                     });
                     */
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
                    
                    if ($attrs.id) $pipImageSlider.registerSlider($attrs.id, $scope);

                    function setIndex() {
                        if ($attrs.pipImageIndex) $scope.sliderIndex = index;
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
        }
    );

})(window.angular, window._, window.jQuery);

/**
 * @file Image slider service
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular, _, $) {
    'use strict';

    var thisModule = angular.module('pipImageSlider.Service', []);

    thisModule.service('$pipImageSlider',
        ['$timeout', function ($timeout) {

            var ANIMATION_DURATION = 550,
                sliders = {};

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
                var prevBlock = $(blocks[oldIndex]),
                    blockIndex = nextIndex,
                    nextBlock = $(blocks[blockIndex]);

                if (type === 'carousel') {
                    $(blocks).removeClass('pip-next').removeClass('pip-prev').removeClass('animated');

                    if (direction && (direction === 'prev' || direction === 'next')) {
                        if (direction === 'prev') {
                            prevCarousel(nextBlock, prevBlock);
                        } else {
                            nextCarousel(nextBlock, prevBlock);
                        }
                    } else {
                        if (nextIndex && nextIndex < oldIndex) {
                            prevCarousel(nextBlock, prevBlock);
                        } else {
                            nextCarousel(nextBlock, prevBlock);
                        }
                    }
                } else {
                    prevBlock.addClass('animated').removeClass('pip-show');
                    nextBlock.addClass('animated').addClass('pip-show');
                }
            }
        }]
    );

})(window.angular, window._, window.jQuery);

/**
 * @file Image slider button
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular, _, $) {
    'use strict';

    var thisModule = angular.module('pipSliderButton', []);

    thisModule.directive('pipSliderButton',
        function () {
            return {
                scope: {},
                controller: ['$scope', '$element', '$parse', '$attrs', '$pipImageSlider', function ($scope, $element, $parse, $attrs, $pipImageSlider) {
                    var type = $parse($attrs.pipButtonType)($scope),
                        sliderId = $parse($attrs.pipSliderId)($scope);

                    $element.on('click', function () {
                        if (!sliderId || !type) {
                            return;
                        }

                        $pipImageSlider.getSliderScope(sliderId)[type + 'Block']();
                    });
                }]
            };
        }
    );

})(window.angular, window._, window.jQuery);

/**
 * @file Slider indicator
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular, _, $) {
    'use strict';

    var thisModule = angular.module('pipSliderIndicator', []);

    thisModule.directive('pipSliderIndicator',
        function () {
            return {
                scope: false,
                controller: ['$scope', '$element', '$parse', '$attrs', '$pipImageSlider', function ($scope, $element, $parse, $attrs, $pipImageSlider) {
                    var sliderId = $parse($attrs.pipSliderId)($scope),
                        slideTo = $parse($attrs.pipSlideTo)($scope);

                    $element.css('cursor', 'pointer');
                    $element.on('click', function () {
                        if (!sliderId || slideTo && slideTo < 0) {
                            return;
                        }

                        $pipImageSlider.getSliderScope(sliderId).slideTo(slideTo);
                    });
                }]
            };
        }
    );

})(window.angular, window._, window.jQuery);

/**
 * @file Markdown control
 * @copyright Digital Living Software Corp. 2014-2016
 * @todo
 * - Move css styles under control
 * - Improve samples in sampler app
 */

(function (angular, marked, _) {
    'use strict';

    var thisModule = angular.module('pipMarkdown', ['ngSanitize']);

    thisModule.run(['$injector', function ($injector) {
        var pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;

        if (pipTranslate) {
            pipTranslate.translations('en', {
                'MARKDOWN_ATTACHMENTS': 'Attachments:',
                'checklist': 'Checklist',
                'documents': 'Documents',
                'pictures': 'Pictures',
                'location': 'Location',
                'time': 'Time'
            });
            pipTranslate.translations('ru', {
                'MARKDOWN_ATTACHMENTS': 'Вложения:',
                'checklist': 'Список',
                'documents': 'Документы',
                'pictures': 'Изображения',
                'location': 'Местонахождение',
                'time': 'Время'
            });
        }

    }]);

    thisModule.directive('pipMarkdown',
        ['$parse', '$injector', function ($parse, $injector) {
            var pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;

            return {
                restrict: 'EA',
                scope: false,
                link: function ($scope, $element, $attrs) {
                    var
                        textGetter = $parse($attrs.pipText),
                        listGetter = $parse($attrs.pipList),
                        clampGetter = $parse($attrs.pipLineCount);

                    function describeAttachments(array) {
                        var attachString = '',
                            attachTypes = [];

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
                        if (value == null) return false;
                        if (!value) return false;
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
                        } else {
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
                        // Assign value as HTML
                        $element.html('<div' + (isClamped ? listGetter() ? 'class="pip-markdown-content ' +
                            'pip-markdown-list" style="max-height: ' + height + 'em">'
                                : ' class="pip-markdown-content" style="max-height: ' + height + 'em">' : listGetter()
                                ? ' class="pip-markdown-list">' : '>') + textString + '</div>');
                        $element.find('a').attr('target', 'blank');
                        if (!listGetter() && isClamped) {
                            $element.append('<div class="pip-gradient-block"></div>');
                        }
                    }

                    // Fill the text
                    bindText(textGetter($scope));

                    // Also optimization to avoid watch if it is unnecessary
                    if (toBoolean($attrs.pipRebind)) {
                        $scope.$watch(textGetter, function (newValue) {
                            bindText(newValue);
                        });
                    }

                    $scope.$on('pipWindowResized', function () {
                        bindText(textGetter($scope));
                    });

                    // Add class
                    $element.addClass('pip-markdown');
                }
            };
        }]
    );

})(window.angular, window.marked, window._);


/**
 * @file Popover control
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular, $, _) {
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
                $scope = _.defaults($scope, $scope.$parent);    // eslint-disable-line 

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
                        var element = $($scope.params.element),
                            pos = element.offset(),
                            width = element.width(),
                            height = element.height(),
                            docWidth = $(document).width(),
                            docHeight = $(document).height(),
                            popover = backdropElement.find('.pip-popover');

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
                    if ($scope.params.calcHeight === false) { return; }

                    var popover = backdropElement.find('.pip-popover'),
                        title = popover.find('.pip-title'),
                        footer = popover.find('.pip-footer'),
                        content = popover.find('.pip-content'),
                        contentHeight = popover.height() - title.outerHeight(true) - footer.outerHeight(true);

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

})(window.angular, window.jQuery, window._);

/**
 * @file Popover service
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular, $, _) {
    'use strict';

    var thisModule = angular.module('pipPopover.Service', []);

    thisModule.service('pipPopoverService',
        ['$compile', '$rootScope', '$timeout', function ($compile, $rootScope, $timeout) {
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
                if (element.find('md-backdrop').length > 0) { return; }
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

        }]
    );

})(window.angular, window.jQuery, window._);

/**
 * @file Routing progress control
 * @description
 * This progress control is enabled by ui router
 * while switching between pages
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular) {
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

    thisModule.controller('pipRoutingProgressController',
        ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
            var  image = $element.children('img');          

            loadProgressImage();

            return;

            function loadProgressImage() {
                if ($scope.logoUrl) {
                    image.attr('src', $scope.logoUrl);
                }
            }

        }]
    );

})(window.angular);

/**
 * @file Toasts management service
 * @copyright Digital Living Software Corp. 2014-2016
 * @todo Replace ngAudio with alternative service
 * 
 * toast.error structure:
 * data: {
 *  code: error code,
 *  path: 
 *  error: 
 *  method:
 *  message: 
 * }
 */

(function (angular, _) {
    'use strict';
    var thisModule = angular.module('pipToasts', ['ngMaterial', 'pipControls.Translate']);

    thisModule.controller('pipToastController',
        ['$scope', '$mdToast', 'toast', '$injector', function ($scope, $mdToast, toast, $injector) {
            var pipErrorDetailsDialog = $injector.has('pipErrorDetailsDialog') 
                ? $injector.get('pipErrorDetailsDialog') : null;

            // if (toast.type && sounds['toast_' + toast.type]) {
            //     sounds['toast_' + toast.type].play();
            // }

            $scope.message = toast.message;
            $scope.actions = toast.actions;
            $scope.toast = toast;
            
            if (toast.actions.length === 0) {
                $scope.actionLenght = 0;
            } else if (toast.actions.length === 1) {
                $scope.actionLenght = toast.actions[0].toString().length;
            } else {
                $scope.actionLenght = null;
            }

            $scope.showDetails = pipErrorDetailsDialog != null;
            $scope.onDetails = function () {
                $mdToast.hide();

                if (pipErrorDetailsDialog) {
                    pipErrorDetailsDialog.show(
                        {
                            error: $scope.toast.error,
                            ok: 'Ok'
                        },
                        angular.noop,
                        angular.noop
                    );
                }
            };

            $scope.onAction = function (action) {
                $mdToast.hide(
                    {
                        action: action,
                        id: toast.id,
                        message: toast.message
                    });
            };
        }]
    );

    thisModule.service('pipToasts',
        ['$rootScope', '$mdToast', function ($rootScope, $mdToast) {
            var
                SHOW_TIMEOUT = 20000,
                SHOW_TIMEOUT_NOTIFICATIONS = 20000,
                toasts = [],
                currentToast,
                sounds = {};

            /** pre-load sounds for notifications */
                // sounds['toast_error'] = ngAudio.load('sounds/fatal.mp3');
                // sounds['toast_notification'] = ngAudio.load('sounds/error.mp3');
                // sounds['toast_message'] = ngAudio.load('sounds/warning.mp3');

                // Remove error toasts when page is changed
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

            // Take the next from queue and show it
            function showNextToast() {
                var toast;

                if (toasts.length > 0) {
                    toast = toasts[0];
                    toasts.splice(0, 1);
                    showToast(toast);
                }
            }

            // Show toast
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
                    .then(
                    function showToastOkResult(action) {
                        if (currentToast.successCallback) {
                            currentToast.successCallback(action);
                        }
                        currentToast = null;
                        showNextToast();
                    },
                    function showToastCancelResult(action) {
                        if (currentToast.cancelCallback) {
                            currentToast.cancelCallback(action);
                        }
                        currentToast = null;
                        showNextToast();
                    }
                );
            }

            function addToast(toast) {
                if (currentToast && toast.type !== 'error') {
                    toasts.push(toast);
                } else {
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
                _.remove(toasts, {id: id});
            }

            function getToastById(id) {
                return _.find(toasts, {id: id});
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

            // Show new notification toast at the top right
            function showNotification(message, actions, successCallback, cancelCallback, id) {
                // pipAssert.isDef(message, 'pipToasts.showNotification: message should be defined');
                // pipAssert.isString(message, 'pipToasts.showNotification: message should be a string');
                // pipAssert.isArray(actions || [], 'pipToasts.showNotification: actions should be an array');
                // if (successCallback) {
                //     pipAssert.isFunction(successCallback, 'showNotification: successCallback should be a function');
                // }
                // if (cancelCallback) {
                //     pipAssert.isFunction(cancelCallback, 'showNotification: cancelCallback should be a function');
                // }

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

            // Show new message toast at the top right
            function showMessage(message, successCallback, cancelCallback, id) {
                // pipAssert.isDef(message, 'pipToasts.showMessage: message should be defined');
                // pipAssert.isString(message, 'pipToasts.showMessage: message should be a string');
                // if (successCallback) {
                //     pipAssert.isFunction(successCallback, 'pipToasts.showMessage:successCallback should be a function');
                // }
                // if (cancelCallback) {
                //     pipAssert.isFunction(cancelCallback, 'pipToasts.showMessage: cancelCallback should be a function');
                // }

                addToast({
                    id: id || null,
                    type: 'message',
                    message: message,
                    actions: ['ok'],
                    successCallback: successCallback,
                    cancelCallback: cancelCallback
                });
            }

            // Show error toast at the bottom right after error occured
            function showError(message, successCallback, cancelCallback, id, error) {
                // pipAssert.isDef(message, 'pipToasts.showError: message should be defined');
                // pipAssert.isString(message, 'pipToasts.showError: message should be a string');
                // if (successCallback) {
                //     pipAssert.isFunction(successCallback, 'pipToasts.showError: successCallback should be a function');
                // }
                // if (cancelCallback) {
                //     pipAssert.isFunction(cancelCallback, 'pipToasts.showError: cancelCallback should be a function');
                // }

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

            // Hide and clear all toast when user signs out
            function hideAllToasts() {
                $mdToast.cancel();
                toasts = [];
            }

            // Clear toasts by type
            function clearToasts(type) {
                if (type) {
                    // pipAssert.isString(type, 'pipToasts.clearToasts: type should be a string');
                    removeToasts(type);
                } else {
                    $mdToast.cancel();
                    toasts = [];
                }
            }
        }]
    );

})(window.angular, window._);

/**
 * @file Directive to show confirmation dialog when user tries to leave page with unsaved changes.
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function(){
    'use strict';

    var thisModule = angular.module("pipUnsavedChanges", []);

    thisModule.directive("pipUnsavedChanges", ['$window', '$rootScope', function ($window, $rootScope) {
        return {
            restrict: 'AE',
            scope: {
                unsavedChangesAvailable: '&pipUnsavedChangesAvailable',
                unsavedChangesMessage: '@pipUnsavedChangesMessage',
                afterLeave: '&pipUnsavedChangesAfterLeave'
            },
            link: function($scope) {

                $window.onbeforeunload = function() {
                    if ($scope.unsavedChangesAvailable()) {
                        $rootScope.$routing = false;
                        return $scope.unsavedChangesMessage;
                    }
                };

                var unbindFunc = $scope.$on('$stateChangeStart', function(event) {
                    if ($scope.unsavedChangesAvailable() && !$window.confirm($scope.unsavedChangesMessage)) {
                        $rootScope.$routing = false;
                        event.preventDefault();
                    } else {
                        _.isFunction($scope.afterLeave) && $scope.afterLeave();
                    }
                });

                $scope.$on('$destroy', function() {
                    $window.onbeforeunload = null;
                    unbindFunc();
                });
            }
        };
    }]);

})();
//# sourceMappingURL=pip-webui-controls.js.map
