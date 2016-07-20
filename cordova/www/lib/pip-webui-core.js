/**
 * @file Registration of all WebUI core services
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    angular.module('pipCore', [
        'pipUtils',
        'pipErrors',
	    'pipTransactions',
	    'pipTranslate',
        'pipState',
        'pipTimer',
        'pipAssert',
        'pipDebug',
        'pipDateFormat',
        'pipDateTimeFilters',
        'pipTranslateFilters',
        'pipClearErrors',
        'pipTheme',

        'pipFocused',
        'pipSelected',
        'pipInfiniteScroll',
        'pipDraggable',
        'pipUnsavedChanges',
        'pipFabTooltipVisibility',
    ]);
    
})();
/**
 * @file Special error handling for forms
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipClearErrors', []);

    thisModule.directive('pipClearErrors', function () {
        return {
            restrict: 'A',
            require: ['ngModel', '^?form'],
            link: function ($scope, $element, $attrs, $ctrls) {
                var 
                    fieldController = $ctrls[0],
                    formController = $ctrls[1];

                $scope.$watch($attrs.ngModel, function (newValue) {
                    clearFieldErrors();
                    clearFormErrors();
                });

                //-------------------

                function clearFieldErrors() {
                    var errors = fieldController.$error;

                    for (var prop in errors) {
                        if (errors.hasOwnProperty(prop) && prop.substring(0, 6) == 'ERROR_') {
                            fieldController.$setValidity(prop, true);
                        }
                    };
                }

                function clearFormErrors() {
                    formController.$serverError = {};
                };
            }
        };
    });

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

                        if (_hasTouch) {
                            cancelPress();
                            _pressTimer = setTimeout(function () {
                                cancelPress();
                                onlongpress(evt);
                            }, 100);
                            $document.on(_moveEvents, cancelPress);
                            $document.on(_releaseEvents, cancelPress);
                        } else {
                            onlongpress(evt);
                        }

                    };

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
                        else
                            element.css({'position': '', top: '', left: '', 'z-index': '', width: ''});
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
 * @file Directive to show confirmation dialog when user tries to leave page with unsaved changes.
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function(){
    'use strict';

    var thisModule = angular.module("pipFabTooltipVisibility", []);

    thisModule.directive("pipFabTooltipVisibility", ['$parse', '$timeout', function ($parse, $timeout) {
        return {
            restrict: 'A',
            scope: false,
            controller: ['$scope', '$attrs', function($scope, $attrs) {
                var trigGetter = $parse($attrs.pipFabTooltipVisibility),
                    showGetter = $parse($attrs.pipFabShowTooltip),
                    showSetter = showGetter.assign;

                $scope.$watch(trigGetter, function(isOpen) {
                    if (isOpen) {
                        $timeout(function() {
                            showSetter($scope, isOpen);
                        }, 600);
                    } else {
                        showSetter($scope, isOpen);
                    }
                });
            }]
        };
    }]);

})();

/**
 * @file Keyboard navigation over few focusable controls
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipFocused", []);

    thisModule.directive('pipFocused', ['$timeout', '$mdConstant', function($timeout, $mdConstant) {
        return {
            require: "?ngModel",
            link: function ($scope, $element, $attrs) {
                var controls, controlsLength,
                    withHidden = $attrs.pipWithHidden;

                $timeout(init);
                $element.on('keydown', keydownListener);

                $scope.$watch($attrs.ngModel, function () {
                    $timeout(init);
                }, true);

                function init() {
                    var selector = withHidden ? '.pip-focusable' : '.pip-focusable:visible';
                    controls = $element.find(selector);
                    controlsLength = controls.length;

                    // add needed event listeners
                    controls.on('focus', function () {
                        $element.addClass('pip-focused-container');
                        $(this).addClass('md-focused');
                    }).on('focusout', function () {
                        $element.removeClass('pip-focused-container');
                    });
                }

                function keydownListener(e) {
                    var keyCode = e.which || e.keyCode;

                    // Check control keyCode
                    if (keyCode == $mdConstant.KEY_CODE.LEFT_ARROW ||
                        keyCode == $mdConstant.KEY_CODE.UP_ARROW ||
                        keyCode == $mdConstant.KEY_CODE.RIGHT_ARROW ||
                        keyCode == $mdConstant.KEY_CODE.DOWN_ARROW) {

                        e.preventDefault();

                        var 
                            increment = (keyCode == $mdConstant.KEY_CODE.RIGHT_ARROW || keyCode == $mdConstant.KEY_CODE.DOWN_ARROW) ? 1 : -1,
                            moveToControl = controls.index(controls.filter(".md-focused")) + increment;

                        // Move focus to next control
                        if (moveToControl >= 0 && moveToControl < controlsLength) {
                            controls[moveToControl].focus();
                        }
                    }
                }
            }
        };
    }]);

})();


/**
 * @file Infinite scrolling behavior
 * @description
 * Modified from https://github.com/sroze/ngInfiniteScroll
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipInfiniteScroll", []);

    thisModule.directive('pipInfiniteScroll', 
        ['$rootScope', '$window', '$interval', '$parse', function($rootScope, $window, $interval, $parse) {
            var THROTTLE_MILLISECONDS = 500;

            return {
                scope: {
                    pipInfiniteScroll: '&',
                    pipScrollContainer: '=',
                    pipScrollDistance: '=',
                    pipScrollDisabled: '=',
                    pipScrollUseDocumentBottom: '=',
                    pipScrollListenForEvent: '@'
                },
                link: function($scope, $element, $attrs) {
                    var 
                        checkWhenEnabled = null,
                        scrollContainer,
                        immediateCheck = true,
                        scrollDistance = null,
                        scrollEnabled = null, 
                        unregisterEventListener = null,
                        useDocumentBottom = false, 
                        windowElement = angular.element($window);
                    
                    function height(element) {
                        element = element[0] || element;
                        if (isNaN(element.offsetHeight)) {
                            return element.document.documentElement.clientHeight;
                        } else {
                            return element.offsetHeight;
                        }
                    };

                    function offsetTop(element) {
                        if (!element[0].getBoundingClientRect || element.css('none')) {
                            return;
                        }
                        return element[0].getBoundingClientRect().top + pageYOffset(element);
                    };

                    function pageYOffset(element) {
                        element = element[0] || element;
                        if (isNaN(window.pageYOffset)) {
                            return element.document.documentElement.scrollTop;
                        } else {
                            return element.ownerDocument.defaultView.pageYOffset;
                        }
                    };

                    var onContainerScroll = function() {
                        var 
                            containerBottom, 
                            containerTopOffset, 
                            elementBottom, 
                            remaining, 
                            shouldScroll;
                                                
                        if (scrollContainer === windowElement) {
                            containerBottom = height(scrollContainer) + pageYOffset(scrollContainer[0].document.documentElement);
                            elementBottom = offsetTop($element) + height($element);
                        } else {
                            containerBottom = height(scrollContainer);
                            containerTopOffset = 0;
                            if (offsetTop(scrollContainer) !== void 0) {
                                containerTopOffset = offsetTop(scrollContainer);
                            }
                            elementBottom = offsetTop($element) - containerTopOffset + height($element);
                        }

                        if (useDocumentBottom) {
                            elementBottom = height(($element[0].ownerDocument || $element[0].document).documentElement);
                        }

                        remaining = elementBottom - containerBottom;
                        shouldScroll = remaining <= height(scrollContainer) * scrollDistance + 1;
                        
                        if (shouldScroll) {
                            checkWhenEnabled = true;
                            if (scrollEnabled) {
                                if ($scope.$$phase || $rootScope.$$phase) {
                                    return $scope.pipInfiniteScroll();
                                } else {
                                    return $scope.$apply($scope.pipInfiniteScroll);
                                }
                            }
                        } else {
                            return checkWhenEnabled = false;
                        }
                    };

                    if (THROTTLE_MILLISECONDS != null) {
                        onContainerScroll = _.throttle(onContainerScroll, THROTTLE_MILLISECONDS);                    
                    }

                    $scope.$on('$destroy', function() {
                        scrollContainer.unbind('scroll', onContainerScroll);
                        if (unregisterEventListener != null) {
                            unregisterEventListener();
                            return unregisterEventListener = null;
                        }
                    });

                    function handleScrollDistance(v) {
                        return scrollDistance = parseFloat(v) || 0;
                    };
                    $scope.$watch('pipScrollDistance', handleScrollDistance);
                    handleScrollDistance($scope.pipScrollDistance);
                    
                    function handleScrollDisabled(v) {
                        scrollEnabled = !v;
                        if (scrollEnabled && checkWhenEnabled) {
                            checkWhenEnabled = false;
                            return onContainerScroll();
                        }
                    };
                    $scope.$watch('pipScrollDisabled', handleScrollDisabled);
                    handleScrollDisabled($scope.pipScrollDisabled);

                    function handleScrollUseDocumentBottom(v) {
                        return useDocumentBottom = v;
                    };
                    $scope.$watch('pipScrollUseDocumentBottom', handleScrollUseDocumentBottom);
                    handleScrollUseDocumentBottom($scope.pipScrollUseDocumentBottom);

                    function changeContainer(newContainer) {
                        if (scrollContainer != null) {
                            scrollContainer.unbind('scroll', onContainerScroll);
                        }

                        scrollContainer = newContainer;
                        if (newContainer != null) {
                            return scrollContainer.bind('scroll', onContainerScroll);
                        }
                    };

                    changeContainer(windowElement);
                    if ($scope.pipScrollListenForEvent) {
                        unregisterEventListener = $rootScope.$on($scope.pipScrollListenForEvent, onContainerScroll);
                    }

                    function handleScrollContainer(newContainer) {
                        if ((newContainer == null) || newContainer.length === 0) {
                            return;
                        }
                        if (newContainer instanceof HTMLElement) {
                            newContainer = angular.element(newContainer);
                        } else if (typeof newContainer.append === 'function') {
                            newContainer = angular.element(newContainer[newContainer.length - 1]);
                        } else if (typeof newContainer === 'string') {
                            newContainer = $element.parents().find(newContainer);
                        }

                        if (newContainer != null && (!Array.isArray(newContainer) ||
                            (Array.isArray(newContainer) && newContainer.length > 0))) {
                            return changeContainer(newContainer);
                        } else {
                            throw new Error("Invalid pip-scroll-container attribute.");
                        }
                    };
                    $scope.$watch('pipScrollContainer', function (newContainer) {
                        if (newContainer !== scrollContainer)
                            handleScrollContainer(newContainer);
                    });
                    handleScrollContainer($scope.pipScrollContainer || []);
                    
                    if ($attrs.pipScrollParent != null) {
                        changeContainer(angular.element($element.parent()));
                    }
                    if ($attrs.pipScrolImmediateCheck != null) {
                        immediateCheck = $scope.$eval($attrs.pipScrolImmediateCheck);
                    }
                    
                    return $interval((function() {
                        if (immediateCheck) {
                            return onContainerScroll();
                        }
                    }), 0, 1);
                }
            }
        }]
    );

})();


/**
 * @file Keyboard navigation with scrolling over non-focusable controls
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipSelected", ['pipUtils']);

    thisModule.directive('pipSelected',['$parse', 'pipUtils', '$mdConstant', '$timeout', function ($parse, pipUtils, $mdConstant, $timeout) {
        return {
            restrict: 'A',
            scope: false,
            link: function ($scope, $element, $attrs) {
                var
                    indexGetter = $attrs.pipSelected ? $parse($attrs.pipSelected) : null,
                    indexSetter = indexGetter ? indexGetter.assign : null,
                    idGetter = $attrs.pipSelectedId ? $parse($attrs.pipSelectedId) : null,
                    idSetter = idGetter ? idGetter.assign : null,
                    changeGetter = $attrs.pipSelect ? $parse($attrs.pipSelect) : null,
                    enterSpaceGetter = $attrs.pipEnterSpacePress ? $parse($attrs.pipEnterSpacePress) : null,
                    noScroll = pipUtils.toBoolean($attrs.pipNoScroll),
                    modifier = pipUtils.toBoolean($attrs.pipSkipHidden) ? ':visible' : '',
                    className = pipUtils.toBoolean($attrs.pipTreeList) ? '.pip-selectable-tree' : '.pip-selectable',
                    selectedIndex = indexGetter($scope),
                    currentElementTabinex = $element.attr('tabindex'),
                    pipSelectedWatch = $attrs.pipSelectedWatch;

                // Set tabindex if it's not set yet
                $element.attr('tabindex', currentElementTabinex || 0);

                // Watch selected item index
                if (!pipUtils.toBoolean($attrs.pipTreeList)) {
                    $scope.$watch(indexGetter, function(newSelectedIndex) {
                        selectItem({itemIndex: newSelectedIndex});
                    });
                } else {
                    $scope.$watch(idGetter, function(newSelectedId) {
                        setTimeout(function () {
                            selectItem({itemId: newSelectedId, raiseEvent: true});
                        }, 0);
                    });
                }

                // Watch resync selection
                if (pipSelectedWatch) {
                    $scope.$watch(pipSelectedWatch, function() {
                        // Delay update to allow ng-repeat to update DOM
                        setTimeout(function() {
                            selectedIndex = indexGetter($scope);
                            selectItem({itemIndex: selectedIndex});
                        }, 100);
                    });
                }

                // Select item defined by index
                selectItem({itemIndex: selectedIndex, items: $element.find(className)});

                // Functions and listeners

                function selectItem(itemParams) {
                    var itemIndex = itemParams.itemIndex,
                        itemId = itemParams.itemId,
                        items = itemParams.items || $element.find(className + modifier),
                        itemsLength = items.length,
                        item = (function () {
                            if (itemParams.item) return itemParams.item;
                            if (itemIndex === undefined && itemIndex === -1) {
                                itemIndex = items.index(items.filter('[pip-id=' + itemId + ']'));
                            }
                            if (itemIndex >= 0 && itemIndex < itemsLength) {
                                return items[itemIndex]
                            }
                        }()),
                        raiseEvent = itemParams.raiseEvent;

                    if (item) {
                        $element.find(className).removeClass('selected md-focused');
                        item = angular.element(item)
                            .addClass('selected md-focused')
                            .focus(); // todo сдвигает список тут, на первом проходе
                        if (!noScroll) scrollToItem(item);
                        if (raiseEvent) defineSelectedIndex(items);
                    }
                };

                function defineSelectedIndex(items) {
                    var oldSelectedIndex = selectedIndex;
                    selectedIndex = -1;
                    for (var index = 0; index < items.length; index++) {
                        if ($(items[index]).hasClass('selected')) {
                            selectedIndex = index;

                            break;
                        }
                    }

                    // Execute callback to notify about item select
                    if (oldSelectedIndex != selectedIndex && selectedIndex !== -1) {
                        $scope.$apply(updateIndex);
                    }

                    function updateIndex() {
                        var selectedItem = angular.element(items[selectedIndex]),
                            selectedId = selectedItem.attr('pip-id');

                        if (indexSetter) indexSetter($scope, selectedIndex);
                        if (idSetter) idSetter($scope, selectedId);
                        if (changeGetter) {
                            changeGetter($scope, {
                                $event: {
                                    target: $element,
                                    item: selectedItem,
                                    index: selectedIndex,
                                    id: selectedId,
                                    newIndex: selectedIndex,
                                    oldIndex: oldSelectedIndex
                                }
                            });
                        }
                    };
                };

                function scrollToItem($item) {
                    if (noScroll) return;

                    var
                        containerTop = $element.offset().top,
                        containerHeight = $element.height(),
                        containerBottom = containerTop + containerHeight,
                        itemTop = $item.offset().top,
                        itemHeight = $item.outerHeight(true),
                        itemBottom = itemTop + itemHeight,
                        containerScrollTop = $element.scrollTop();

                    if (containerTop > itemTop) {
                        $element.scrollTop(containerScrollTop + itemTop - containerTop);
                    }
                    else if (containerBottom < itemBottom) {
                        $element.scrollTop(containerScrollTop + itemBottom - containerBottom);
                    }

                };

                $element.on('click touchstart', className, function (event) {
                    selectItem({item: event.currentTarget, raiseEvent: true});
                });

                $element.on('keydown', function (e) {
                    var keyCode = e.which || e.keyCode;

                    // Check control keyCode
                    if (keyCode == $mdConstant.KEY_CODE.ENTER || keyCode == $mdConstant.KEY_CODE.SPACE) {
                        e.preventDefault();
                        e.stopPropagation();

                        if (enterSpaceGetter) {
                            enterSpaceGetter($scope, {
                                $event: {
                                    target: $element,
                                    index: selectedIndex,
                                    item: $element.find('.selected')
                                }
                            });
                        }

                    } else
                    if (keyCode == $mdConstant.KEY_CODE.LEFT_ARROW || keyCode == $mdConstant.KEY_CODE.RIGHT_ARROW ||
                        keyCode == $mdConstant.KEY_CODE.UP_ARROW || keyCode == $mdConstant.KEY_CODE.DOWN_ARROW) {

                        e.preventDefault();
                        e.stopPropagation();

                        // Get next selectable control index
                        var items = $element.find(className + modifier),
                            inc = (keyCode == $mdConstant.KEY_CODE.RIGHT_ARROW || keyCode == $mdConstant.KEY_CODE.DOWN_ARROW) ? 1 : -1,
                            newSelectedIndex = selectedIndex + inc;

                        // Set next control as selected
                        selectItem({itemIndex: newSelectedIndex, items: items, raiseEvent: true});
                    }
                });

                $element.on('focusin', function (event) {
                    // Choose selected element
                    var items,
                        selectedItem = $element.find(className + '.selected');

                    selectedItem.addClass('md-focused');

                    // If there are not selected elements then pick the first one
                    if (selectedItem.length === 0) {
                        selectedIndex = indexGetter($scope);
                        items = $element.find(className + modifier);
                        selectItem({itemIndex: selectedIndex || 0, items: items, raiseEvent: true});
                    }
                });

                $element.on('focusout', function (event) {
                    $element.find(className + '.md-focused' + modifier).removeClass('md-focused');
                });
            }
        };
    }]);

})();


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
/**
 * @file Date formatting service
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
 /* global _, angular */
 
(function () {
    'use strict';

    var thisModule = angular.module('pipDateFormat', ['pipUtils', 'pipTranslate']);

	thisModule.config(['pipTranslateProvider', function(pipTranslateProvider) {

        pipTranslateProvider.translations('en', {
            // Months - 'MONTH_' + monthIndex
            // start at 0 to match JS date format
            'MONTH_1': 'January',
            'MONTH_2': 'February',
            'MONTH_3': 'March',
            'MONTH_4': 'April',
            'MONTH_5': 'May',
            'MONTH_6': 'June',
            'MONTH_7': 'July',
            'MONTH_8': 'August',
            'MONTH_9': 'September',
            'MONTH_10': 'October',
            'MONTH_11': 'November',
            'MONTH_12': 'December',

            'MONTH_LONG_1': 'January',
            'MONTH_LONG_2': 'February',
            'MONTH_LONG_3': 'March',
            'MONTH_LONG_4': 'April',
            'MONTH_LONG_5': 'May',
            'MONTH_LONG_6': 'June',
            'MONTH_LONG_7': 'July',
            'MONTH_LONG_8': 'August',
            'MONTH_LONG_9': 'September',
            'MONTH_LONG_10': 'October',
            'MONTH_LONG_11': 'November',
            'MONTH_LONG_12': 'December',

            'MONTH_SHORT_1': 'Jan',
            'MONTH_SHORT_2': 'Feb',
            'MONTH_SHORT_3': 'Mar',
            'MONTH_SHORT_4': 'Apr',
            'MONTH_SHORT_5': 'May',
            'MONTH_SHORT_6': 'Jun',
            'MONTH_SHORT_7': 'Jul',
            'MONTH_SHORT_8': 'Aug',
            'MONTH_SHORT_9': 'Sep',
            'MONTH_SHORT_10': 'Oct',
            'MONTH_SHORT_11': 'Nov',
            'MONTH_SHORT_12': 'Dec',

            // Days of the week - 'DAY_' + dayIndex
            // start at 1 to match JS date format
            'DAY_1': 'Monday',
            'DAY_2': 'Tuesday',
            'DAY_3': 'Wednesday',
            'DAY_4': 'Thursday',
            'DAY_5': 'Friday',
            'DAY_6': 'Saturday',
            'DAY_7': 'Sunday',

            'ELAPSED_TODAY': 'Today',
            'ELAPSED_YESTERDAY': 'Yesterday',
            'ELAPSED_YEARS': 'y',
            'ELAPSED_MONTHS': 'mth',
            'ELAPSED_WEEKS': 'w',
            'ELAPSED_DAYS': 'd',
            'ELAPSED_HOURS': 'h',
            'ELAPSED_MINUTES': 'm',
            'ELAPSED_SECONDS': 's',
            'ELAPSED_AT': 'at',
            'ELAPSED_AGO': 'ago',
            'ELAPSED_JUST_NOW': 'Just now',
            'ELAPSED_FEW_MIN_AGO': 'Few min ago',
            'ELAPSED_MIN_AGO': 'min ago',
            'ELAPSED_HOUR_AGO': 'hour ago',
            'ELAPSED_HOURS_AGO': 'hours ago',
            'ELAPSED_HOURS_AGO_MORE_THAN_FIVE': 'hours ago'
        });

        pipTranslateProvider.translations('ru', {
            // Months - 'MONTH_' + monthIndex
            // start at 0 to match JS date format
            'MONTH_1': 'январь',
            'MONTH_2': 'февраль',
            'MONTH_3': 'март',
            'MONTH_4': 'апрель',
            'MONTH_5': 'май',
            'MONTH_6': 'июнь',
            'MONTH_7': 'июль',
            'MONTH_8': 'август',
            'MONTH_9': 'сентябрь',
            'MONTH_10': 'октябрь',
            'MONTH_11': 'ноябрь',
            'MONTH_12': 'декабрь',

            'MONTH_LONG_1': 'января',
            'MONTH_LONG_2': 'февраля',
            'MONTH_LONG_3': 'марта',
            'MONTH_LONG_4': 'апреля',
            'MONTH_LONG_5': 'мая',
            'MONTH_LONG_6': 'июня',
            'MONTH_LONG_7': 'июля',
            'MONTH_LONG_8': 'августа',
            'MONTH_LONG_9': 'сентября',
            'MONTH_LONG_10': 'октября',
            'MONTH_LONG_11': 'ноября',
            'MONTH_LONG_12': 'декабря',

            'MONTH_SHORT_1': 'янв',
            'MONTH_SHORT_2': 'фев',
            'MONTH_SHORT_3': 'мар',
            'MONTH_SHORT_4': 'апр',
            'MONTH_SHORT_5': 'май',
            'MONTH_SHORT_6': 'июн',
            'MONTH_SHORT_7': 'июл',
            'MONTH_SHORT_8': 'авг',
            'MONTH_SHORT_9': 'сен',
            'MONTH_SHORT_10': 'окт',
            'MONTH_SHORT_11': 'ноя',
            'MONTH_SHORT_12': 'дек',

            // Days of the week - 'DAY_' + dayIndex
            // start at 1 to match JS date format
            'DAY_1': 'понедельник',
            'DAY_2': 'вторник',
            'DAY_3': 'среда',
            'DAY_4': 'четверг',
            'DAY_5': 'пятница',
            'DAY_6': 'суббота',
            'DAY_7': 'воскресенье',

            'ELAPSED_TODAY': 'Сегодня',
            'ELAPSED_YESTERDAY': 'Вчера',
            'ELAPSED_YEARS': 'г',
            'ELAPSED_MONTHS': 'мц',
            'ELAPSED_WEEKS': 'н',
            'ELAPSED_DAYS': 'д',
            'ELAPSED_HOURS': 'ч',
            'ELAPSED_MINUTES': 'м',
            'ELAPSED_SECONDS': 'с',
            'ELAPSED_AT': 'в',
            'ELAPSED_AGO': 'тн',
            'ELAPSED_JUST_NOW': 'Только что',
            'ELAPSED_FEW_MIN_AGO': 'Несколько мин тн',
            'ELAPSED_MIN_AGO': 'мин тн',
            'ELAPSED_HOUR_AGO': 'час тн',
            'ELAPSED_HOURS_AGO': 'часа тн',
            'ELAPSED_HOURS_AGO_MORE_THAN_FIVE': 'часов тн'
        });
		
	}]);

    thisModule.factory('pipDateFormat',
        ['pipDates', 'pipTranslate', '$rootScope', function (pipDates, pipTranslate, $rootScope) {

            return {
                formatDate: formatDate,
                formatLongDate: formatLongDate,
                formatShortDate: formatShortDate,
                formatShortDateWithYear: formatShortDateWithYear,
                formatLongDateWithYear: formatLongDateWithYear,

                formatLongMonth: formatLongMonth,
                formatMonth: formatMonth,
                formatYear: formatYear,
                formatShortWeek: formatShortWeek,
                formatShortDayAndMonth: formatShortDayAndMonth,
                formatLongDayAndMonth: formatLongDayAndMonth,

                formatDateRange: formatDateRange,
                formatDateTimeRange: formatDateTimeRange,

                formatTime: formatTime,
                formatLongTime: formatLongTime,
                formatShortTime: formatShortTime, 

                formatLongDateTime: formatLongDateTime,
                formatShortDateTime: formatShortDateTime,

                formatElapsedTime: formatElapsedTime,
                formatElapsedInterval: formatElapsedInterval,

                formatMillisecondsToSeconds: formatMillisecondsToSeconds
            };


            function twoDigits(value) {
                return value < 10 ? '0' + value : value; 
            };

            function formatDate(value, format, str) {
                if (value == null) return '';

                var
                    strict = str || false,
                    value = _.isDate(value) ? value : new Date(value),
                    thisYear = new Date().getUTCFullYear(),
                    year = value.getUTCFullYear(),
                    month = value.getUTCMonth(),
                    longMonthName = pipTranslate.translate('MONTH_LONG_' + (month + 1)),
                    shortMonthName = pipTranslate.translate('MONTH_SHORT_' + (month + 1)),
                    monthName = pipTranslate.translate('MONTH_' + (month + 1)),
                    day = value.getUTCDate(),
                    startWeek = pipDates.toStartWeek(value),
                    endWeek = pipDates.toEndWeek(value, -1);

                if (strict == false && format == 'd MMMM yyyy' && thisYear === year) {
                        format = 'MMMM d';
                }
                if (strict == false && format == 'd MMM yyyy' && thisYear === year) {
                        format = 'MMM d';
                }
                if ((format == 'MMM d') && $rootScope.$language == 'ru') {
                        format = 'd MMM';
                }
                if ((format == 'MMMM d') && $rootScope.$language == 'ru') {
                    format = 'd MMMM';
                }

                if (format == 'd MMMM yyyy')
                    return '' + day + ' ' + longMonthName + ' ' + year
                else if (format == 'MMMM d, yyyy')
                    return '' + monthName + ' ' + day + ', ' + year
                if (format == 'd MMM yyyy')
                    return '' + day + ' ' + shortMonthName + ' ' + year
                else if (format == 'MMM d, yyyy')
                    return '' + shortMonthName + ' ' + day + ', ' + year
                else if (format == 'd MMMM')
                    return '' + day + ' ' + longMonthName
                else if (format == 'd MMM')
                    return '' + day + ' ' + shortMonthName
                else if (format == 'MMM d')
                    return '' + shortMonthName + ' ' + day;
                else if (format == 'MMMM d')
                    return '' + longMonthName + ' ' + day;
                else if (format == 'yyyy/M/d')
                    return '' + year + '/' + month + '/' + day;
                else if (format == 'yyy-M-d')
                    return '' + year + '-' + month + '-' + day;
                else if (format == 'MMMM')
                    return '' + longMonthName + ' ' + year;
                else if (format == 'yyyy')
                    return '' + year;
                else if (format == 'ww')
                    return '' + startWeek.getUTCDate() + ' - ' + endWeek.getUTCDate() + ' ' + monthName + ' ' + year;

                return '' + day + ' ' + monthName + ' ' + year
            }

            function formatLongDate(value) {
                return formatDate(value, 'd MMMM yyyy');
            }

            function formatShortDateWithYear(value) {
                return formatDate(value, 'd MMM yyyy', true);
            }

            function formatLongDateWithYear(value) {
                return formatDate(value, 'd MMMM yyyy', true);
            }

            function formatShortDate(value) {
                return formatDate(value, 'd MMM yyyy');
            }

            function formatLongMonth(value) {
                return formatDate(value, 'MMMM');
            }

            function formatYear(value) {
                return formatDate(value, 'yyyy');
            }

            function formatShortWeek(value) {
                return formatDate(value, 'ww');
            }

            function formatShortDayAndMonth(value) {
                return formatDate(value, 'd MMM');
            }

            function formatLongDayAndMonth(value) {
                if ($rootScope.$language == 'ru')
                    return formatDate(value, 'd MMMM');
                else
                    return formatDate(value, 'MMMM d');
            }

            function formatDateRange(value1, value2) {
                value1 =  value1 ? (_.isDate(value1) ? value1 : new Date(value1)) : null;
                value2 =  value2 ? (_.isDate(value2) ? value2 : new Date(value2)) : null;

                if (value1 == null) {
                    if ($rootScope.$language == 'ru')
                        return formatDate(value2, 'd MMM yyyy', true);
                    else
                        return formatDate(value2, 'MMM d, yyyy', true);
                }

                if (value2 == null || value1 == value2) {
                    if ($rootScope.$language == 'ru')
                        return formatDate(value1, 'd MMM yyyy', true);
                    else
                        return formatDate(value1, 'MMM d, yyyy', true);
                }

                if (value1.getUTCFullYear() !== value2.getUTCFullYear()) {
                    if ($rootScope.$language == 'ru')
                        return formatDate(value1, 'd MMM yyyy', true) + '-' + formatDate(value2, 'd MMM yyyy', true);
                    else
                        return formatDate(value1, 'MMM d, yyyy', true) + '-' + formatDate(value2, 'MMM d, yyyy', true);
                } else {
                        return formatDate(value1, 'd MMM') + ' - ' + formatDate(value2, 'd MMM')
                            + ((new Date().getUTCFullYear() !== value1.getUTCFullYear()) ? ' ' + formatDate(value1, 'yyyy') : '');
                }
            }

            function formatDateTimeRange(value1, value2) {
                value1 =  value1 ? (_.isDate(value1) ? value1 : new Date(value1)) : null;
                value2 =  value2 ? (_.isDate(value2) ? value2 : new Date(value2)) : null;
                if (value1 == null && value2 == null) return '';

                if (value1 == null) {
                    return formatShortDateTime(value2);
                }

                if (value2 == null || value1 == value2) {
                    return formatShortDateTime(value1);
                }

                var dayStart, monthStart, yearStart,
                    dayEnd, monthEnd, yearEnd;

                dayStart = value1.getUTCDate();
                monthStart = value1.getUTCMonth();
                yearStart = value1.getUTCFullYear();
                dayEnd = value2.getUTCDate();
                monthEnd = value2.getUTCMonth();
                yearEnd = value2.getUTCFullYear();


                if (yearStart !== yearEnd) {
                    return formatDate(value1, 'd MMM') + ', ' + yearStart + ' ' + formatTime(value1, 'hh:mm') +
                        ' - ' + formatDate(value2, 'd MMM') + ', ' + yearEnd + ' ' + formatTime(value2, 'hh:mm');
                } else {
                    if (monthStart != monthEnd && !dayStart != dayEnd)
                        return formatDate(value1, 'd MMM') + ', ' + formatTime(value1, 'hh:mm') +
                            ' - ' + formatDate(value2, 'd MMM') + ', ' + formatTime(value2, 'hh:mm');
                    else
                        return formatTime(value1, 'hh:mm') + ' - ' + formatTime(value2, 'hh:mm')
                }
            }

            function formatTime(value, format) {
                if (value == null) return '';

                value = _.isDate(value) ? value : new Date(value);
                
                var 
                    hours = value.getHours(),
                    mins = value.getMinutes(),
                    secs = value.getSeconds(),
                    ampm = '';

                if (pipTranslate.use() == 'en') {
                    ampm = hours >= 12 ? ' PM' : ' AM';
                    hours = hours % 12;
                    if (hours == 0) hours = 12;
                }

                if (format == 'hh:mm:ss')
                    return '' + twoDigits(hours) + ':' + twoDigits(mins) + ':' + twoDigits(secs) + ampm;
                else if (format == 'hh:mm')
                    return '' + twoDigits(hours) + ':' + twoDigits(mins) + ampm;

                return '' + twoDigits(hours) + ':' + twoDigits(mins) + ':' + twoDigits(secs) + ampm;
            }

            function formatMonth(value, short) {
                if (value == null) return '';
                return short ? pipTranslate.translate('MONTH_SHORT_' + value) : pipTranslate.translate('MONTH_' + value);
            }

            function formatLongTime(value) {
                return formatTime(value, 'hh:mm:ss');
            }

            function formatShortTime(value) {
                return formatTime(value, 'hh:mm');
            }

            function formatLongDateTime(value) {
                if (value == null) return '';
                value = _.isDate(value) ? value : new Date(value);
                return formatLongDate(value) + ' ' + formatLongTime(value);
            }

            function formatShortDateTime(value) {
                if (value == null) return '';
                value = _.isDate(value) ? value : new Date(value);
                return formatShortDate(value) + ' ' + formatShortTime(value);
            }

            function formatElapsedTime(value, format) {
                if (value == null) return '';

                value = _.isDate(value) ? value : new Date(value);

                var 
                    current = new Date(),
                    diff = Math.floor(((current.getTime() + current.getTimezoneOffset()) - (value.getTime() + value.getTimezoneOffset())) / 1000);

                if (diff < 1) return pipTranslate.translate('ELAPSED_JUST_NOW');

                var years, months, weeks, days, hours, mins, secs;

                secs = diff % 60;

                diff = Math.floor(diff / 60);
                mins = diff % 60;

                diff = Math.floor(diff / 60);
                hours = diff % 24;

                diff = diff / 24;
                years = Math.floor(diff / 365),

                diff = diff - years * 365;
                months = Math.floor(diff / 30),
                days = Math.floor(diff - months * 30);

                if (days % 7 == 0) {
                    weeks = Math.floor(days / 7);
                    days = 0;
                } else {
                    weeks = 0;
                }

                if (format == 'interval') {
                    var result = '';

                    if (years) {
                        result += ' ' + years + pipTranslate.translate('ELAPSED_YEARS');
                        weeks = days = hours = mins = secs = null;
                    }
                    if (months) {
                        result += ' ' + months + pipTranslate.translate('ELAPSED_MONTHS');
                        days = hours = mins = secs = null;
                    }
                    if (weeks) {
                        result += ' ' + weeks + pipTranslate.translate('ELAPSED_WEEKS');
                        hours = mins = secs = null;
                    }
                    if (days) {
                        result += ' ' + days + pipTranslate.translate('ELAPSED_DAYS');
                        mins = secs = null;
                    }
                    if (hours) {
                        result += ' ' + hours + pipTranslate.translate('ELAPSED_HOURS');
                        secs = null;
                    }
                    if (mins) result += ' ' + mins + pipTranslate.translate('ELAPSED_MINUTES');
                    if (secs) result += ' ' + secs + pipTranslate.translate('ELAPSED_SECONDS');

                    return result != '' ? result + ' ' + pipTranslate.translate('ELAPSED_AGO') 
                        : pipTranslate.translate('ELAPSED_JUST_NOW');
                }

                // Default time format = 'default'

                if (years > 0) {
                    return formatDate(value, 'd MMM yyyy');
                }

                if (months > 0 || weeks > 0 || days > 1) {
                    return formatDate(value, 'MMM d') 
                        + ', ' + formatTime(value, 'hh:mm');
                }

                if (days == 1) {
                    return pipTranslate.translate('ELAPSED_YESTERDAY') 
                        + ', ' + formatTime(value, 'hh:mm');
                }

                if (hours > 10) {
                    return pipTranslate.translate('ELAPSED_TODAY') 
                        + ', ' + formatTime(value, 'hh:mm');
                }

                if (hours > 0) {
                    return '' + hours + ' ' + (hours < 2 ? pipTranslate.translate('ELAPSED_HOUR_AGO') :
                        hours < 5 ? pipTranslate.translate('ELAPSED_HOURS_AGO') : pipTranslate.translate('ELAPSED_HOURS_AGO_MORE_THAN_FIVE'));
                }

                if (mins > 10) {
                    return '' + mins + ' ' + pipTranslate.translate('ELAPSED_MIN_AGO');
                }

                if (mins > 0) {
                    return pipTranslate.translate('ELAPSED_FEW_MIN_AGO');
                }

                return pipTranslate.translate('ELAPSED_JUST_NOW');
            }

            function formatElapsedInterval(value) {
                return formatElapsedTime(value, 'interval');  
            }

            function formatMillisecondsToSeconds(value) {
                return Math.floor(value / 1000)
            }

        }]
    );
    
})();

/**
 * @file Assertion utilities
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global _, angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipAssert', ['pipDebug']);

    thisModule.provider('pipAssert', ['pipDebugProvider', function (pipDebugProvider) {

        return {
            isEmpty: pipDebugProvider.enabled() ? isEmpty : noop,
            isObjectId: pipDebugProvider.enabled() ? isObjectId : noop,
            isDefined: pipDebugProvider.enabled() ? isDefined : noop,
            isDef: pipDebugProvider.enabled() ? isDefined : noop,
            contains: pipDebugProvider.enabled() ? contains : noop,
            equal: pipDebugProvider.enabled() ? equal : noop,
            notEqual: pipDebugProvider.enabled() ? notEqual : noop,
            strictEqual: pipDebugProvider.enabled() ? strictEqual : noop,
            notStrictEqual: pipDebugProvider.enabled() ? notStrictEqual : noop,
            isArray: pipDebugProvider.enabled() ? isArray : noop,
            isBoolean: pipDebugProvider.enabled() ? isBoolean : noop,
            isNumber: pipDebugProvider.enabled() ? isNumber : noop,
            isString: pipDebugProvider.enabled() ? isString : noop,
            isObject: pipDebugProvider.enabled() ? isObject : noop,
            isDate: pipDebugProvider.enabled() ? isDate : noop,
            isError: pipDebugProvider.enabled() ? isError : noop,
            isFunction: pipDebugProvider.enabled() ? isFunction : noop,
            isNotNull: pipDebugProvider.enabled() ? isNotNull : noop,
            
            $get: ['pipDebug', function(pipDebug) {
                return {
                    isEmpty: pipDebug.enabled() ? isEmpty : noop,
                    isObjectId: pipDebug.enabled() ? isObjectId : noop,
                    isDefined: pipDebug.enabled() ? isDefined : noop,
                    isDef: pipDebug.enabled() ? isDefined : noop,
                    contains: pipDebug.enabled() ? contains : noop,
                    equal: pipDebug.enabled() ? equal :  noop,
                    notEqual: pipDebug.enabled() ? notEqual : noop,
                    strictEqual: pipDebug.enabled() ? strictEqual : noop,
                    notStrictEqual: pipDebug.enabled() ? notStrictEqual :  noop,
                    isArray: pipDebug.enabled() ? isArray : noop,
                    isBoolean: pipDebug.enabled() ? isBoolean : noop,
                    isNumber: pipDebug.enabled() ? isNumber : noop,
                    isString: pipDebug.enabled() ? isString : noop,
                    isObject: pipDebug.enabled() ? isObject : noop,
                    isDate: pipDebug.enabled() ? isDate : noop,
                    isError: pipDebug.enabled() ? isError : noop,
                    isFunction: pipDebug.enabled() ? isFunction : noop,
                    isNotNull: pipDebug.enabled() ? isNotNull : noop
                }
            }]
        };

        function noop() {}

        function objectToString(o) {
            return Object.prototype.toString.call(o);
        }

        function isArray(arg, message) {
            if (!Array.isArray(arg)) {
                throw new Error(message || arg + ' should be array');
            }
        }

        function isBoolean(arg, message) {
            if (typeof arg !== 'boolean') {
                throw new Error(message || arg + ' should be boolean');
            }
        }

        function isNotNull(arg, message) {
            if (arg === null) {
                throw new Error(message || arg + ' should be not null');
            }
        }

        function isNumber(arg, message) {
            if (typeof arg !== 'number') {
                throw new Error(message || arg + ' should be number');
            }
        }

        function isString(arg, message) {
            if (typeof arg !== 'string') {
                throw new Error(message || arg + ' should be string');
            }
        }

        function isObject(arg, message) {
            if (typeof arg !== 'object') {
                throw new Error(message || arg + ' should be an object');
            }
        }

        function isDate(d, message) {
            if (typeof d === 'object' && objectToString(d) !== '[object Date]') {
                throw new Error(message || d + ' should be a date');
            }
        }

        function isError(e, message) {
            if (typeof e === 'object' && (objectToString(e) !== '[object Error]' || e instanceof Error)) {
                throw new Error(message || e + ' should be an error');
            }
        }

        function isFunction(arg, message) {
            if (typeof arg !== 'function') {
                throw new Error(message || arg + ' should be a function');
            }
        }

        function isDefined(arg, message) {
           if (typeof arg === "undefined") {
               throw new Error(message || arg + ' should be defined');
           }
        }

        function isEmpty(arg, message) {
            if (arg === null || arg === undefined || arg === false) {
                throw new Error(message || arg + ' should be not null or undefined or false');
            }
        }

        function contains(obj, prop, message) {
            if (typeof obj !== 'object') {
                throw new Error(obj + ' should be an object');
            }
            if (obj[prop] === null || obj[prop] === undefined) {
                throw new Error(message || prop + ' should be in object ' + obj);
            }
        }

        // Compares args with ==
        function equal(actual, expected, message) {
            if (actual != expected) {
                throw new Error(message || actual + ' should be not equal ' + expected);
            }
        }

        // Compares args with !=
        function notEqual(actual, expected, message) {
            if (actual == expected) {
                throw new Error(message || actual + ' should be equal ' + expected);
            }
        }

        // Compares args with ===
        function strictEqual(actual, expected, message) {
            if (actual !== expected) {
                throw new Error(message || actual + ' should not be strict equal ' + expected);
            }
        }

        // Compares args with !==
        function notStrictEqual(actual, expected, message) {
            if (actual === expected) {
                throw new Error(message || actual + ' should not strict equal ' + expected);
            }
        }

        // Checks if value is a valid ObjectId
        function isObjectId(value, message) {
            var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
            if (!checkForHexRegExp.test(value)) {
                throw new Error(message || value + ' should be an object id');
            }
        }

    }]);

})();

/**
 * @file Debugging service
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global _, angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipDebug', []);

    thisModule.provider('pipDebug', ['$logProvider', function ($logProvider) {

        this.enabled = true;

        return {
            enable: enable,
            disable: disable,
            enabled: enabled,
            
            $get: ['$log', function($log) {
                return {
                    enabled: enabled,
                    log: $log.log,
                    info: $log.info,
                    warn: $log.warn,
                    error: $log.error,
                    debug: $log.debug
                }
            }]
        };

        function enabled() {
            return this.enabled;
        }

        function enable() {
            this.enabled = true;
            $logProvider.debugEnabled(true);
        }

        function disable() {
            this.enabled = false;
            $logProvider.debugEnabled(false);
        }

    }]);

})();

/**
 * @file Error context
 * @description
 * Error context decouples business components that throw errors
 * and visualization components that show them to users
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
/* global angular */
 
(function () {
    'use strict';

    var thisModule = angular.module('pipErrors', ['pipUtils', 'pipAssert']);

    /*
     * Error is designed to assist with error handling
     * within different application scopes & controllers without overlap.
     *
     * A unique identification of the scope/controller is passed to the service
     * when it is initialized to identify the error for that scope.
     * */
    thisModule.factory('pipError',
        ['$rootScope', 'pipAssert', function ($rootScope, pipAssert) {

            // Initialize error scope
            $rootScope.errors = {};

            return createError;

            //----------------------------

            function initError(scope) {
                $rootScope.errors[scope] = {
                    message: undefined,
                    code: undefined,
                    details: undefined
                };
            };

            function errorMessage(error) {
                if (_.isNull(error)) {
                    return null;
                }

                // Process regular messages
                if (error.message) {
                    return error.message;
                }

                // Process server application errors
                if (error.data) {
                    if (error.data.code) {
                        // process server error codes here
                        return 'ERROR_' + error.data.code;
                    }

                    if (error.data.message) {
                        return error.data.message;
                    }
                }

                // Process standard HTTP errors
                if (error.statusText) {
                    return error.statusText;
                }

                if (error.status) {
                    return 'ERROR_' + error.status;
                }
                
                return error.data ? error.data : error;
            };

            function errorCode(error) {
                if (_.isNull(error)) {
                    return null;
                }

                if (error.data && error.data.code) {
                    return error.data.code;
                }

                if (error.status) {
                    return error.status;
                }
                
                return null;
            };

            function errorDetails(error) {
                return error && error.data ? error.data : error;
            };

            function createError(scope, scopeObject) {
                scope = scope || 'global';

                var error = {
                    reset: function () {
                        initError(scope);
                    },

                    empty: function() {
                        var error = $rootScope.errors[scope];
                        return _.isNull(error) || (_.isNull(error.message) && _.isNull(error.code));
                    },

                    get: function () {
                        if ($rootScope.errors[scope]) {
                            return $rootScope.errors[scope];
                        }
                        return '';
                    },

                    message: function () {
                        if ($rootScope.errors[scope]) {
                            return $rootScope.errors[scope].message;
                        }
                        return null;
                    },

                    code: function () {
                        if ($rootScope.errors[scope]) {
                            return $rootScope.errors[scope].code;
                        }
                        return null;
                    },

                    details: function () {
                        if ($rootScope.errors[scope]) {
                            return $rootScope.errors[scope].details;
                        }
                        return null;
                    },

                    set: function (error) {
                        if (error) {
                            pipAssert.isObject(error, "Setting error: error should be an object");

                            $rootScope.errors[scope] = {
                                message: errorMessage(error),
                                code: errorCode(error),
                                details: errorDetails(error)
                            };
                            console.error($rootScope.errors[scope]);
                        } else {
                            initError(scope);
                        }
                    }
                };

                // Assign error into scope
                if (_.isObject(scopeObject)) scopeObject.error = error;

                return error;
            };
        }]
    );
    
})();
/**
 * @file Application router extended from ui.router
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
 /* global angular */
 
(function () {
    'use strict';
    
    var thisModule = angular.module('pipState', ['ui.router', 'pipTranslate', 'pipAssert']);

    thisModule.config(
        ['$locationProvider', '$httpProvider', 'pipTranslateProvider', function($locationProvider, $httpProvider, pipTranslateProvider) {
            // Switch to HTML5 routing mode
            //$locationProvider.html5Mode(true);
            pipTranslateProvider.translations('en', {
                'ERROR_SWITCHING': 'Error while switching route. Try again.'
            });

            pipTranslateProvider.translations('ru', {
                'ERROR_SWITCHING': 'Ошибка при переходе. Попробуйте ещё раз.'
            });
        }]
    );

    thisModule.run(
        ['$rootScope', 'pipTranslate', '$state', function($rootScope, pipTranslate, $state) {
            $rootScope.$on('$stateChangeSuccess',
                function(event, toState, toParams, fromState, fromParams) {
                    if ($rootScope.$user && $rootScope.$user.id && toState.params && toState.params.access) {
                        if (toParams && toParams.party_id) {
                            var party = _.find($rootScope.$user.party_access, {party_id: toParams.party_id});
                            if (party) {
                                if (toState.params.access == 'manager' && !party.manager ||
                                    toState.params.access == 'contributor' && !party.contributor) {
                                    if (toState.params.toState) {
                                        event.preventDefault();
                                        $state.go(toState.params.toState, toParams);
                                        return;
                                    }
                                }
                            } else {
                                if (toParams.party_id != $rootScope.$user.id && toState.params.toState) {
                                    event.preventDefault();
                                    $state.go(toState.params.toState, toParams);
                                    return;
                                }
                            }
                        }
                    }
                    // Unset routing variable to disable page transition
                    $rootScope.$routing = false;
                    // Record current and previous state
                    $rootScope.$state = {name: toState.name, url: toState.url, params: toParams};
                    $rootScope.$prevState = {name: fromState.name, url: fromState.url, params: fromParams};
                }
            );

            // Intercept route error
            $rootScope.$on('$stateChangeError',
                function(event, toState, toParams, fromState, fromParams, error) {
                    // Unset routing variable to disable page transition
                    $rootScope.$routing = false;

                    console.error('Error while switching route to ' + toState.name);
                    console.error(error);
                }
            );


            // Intercept route error
            $rootScope.$on('$stateNotFound',
                function(event, unfoundState, fromState, fromParams) {
                    event.preventDefault();

                    // todo make configured error state name
                    $state.go('errors_missing_route',  {
                            unfoundState: unfoundState,
                            fromState : {
                                to: fromState ? fromState.name : '',
                                fromParams: fromParams
                            }
                        }
                    );
                    $rootScope.$routing = false;
                }
            );

        }]
    );

    thisModule.provider('pipState', ['$stateProvider', 'pipAssertProvider', function($stateProvider, pipAssertProvider) {
        // Configuration of redirected states
        var redirectedStates = {};

        this.redirect = setRedirect;
        this.state = $stateProvider.state;

        this.$get = ['$state', '$timeout', 'pipAssert', function ($state, $timeout, pipAssert) {
            $state.redirect = redirect;
            
            return $state;
            
			//------------------------
            function redirect(event, state, params, $rootScope) {
                pipAssert.contains(state, 'name', "$state.redirect: state should contains name prop");
                pipAssert.isObject(params, "$state.redirect: params should be an object");

                var toState;

                $rootScope.$routing = true;
                toState = redirectedStates[state.name];
                if (_.isFunction(toState)) {
                    toState = toState(state.name, params, $rootScope);

                    if (_.isNull(toState)) {
                        $rootScope.$routing = false;
                        throw new Error('Redirected toState cannot be null');
                    }
                }

                if (!!toState) {
                    $timeout(function() {
                        event.preventDefault();
                        $state.transitionTo(toState, params, {location: 'replace'});
                    });

                    return true;
                }

                return false;
            }
        }];

        return;        
        //------------------

        // Specify automatic redirect from one state to another
        function setRedirect(fromState, toState) {
            pipAssertProvider.isNotNull(fromState, "pipState.redirect: fromState cannot be null");
            pipAssertProvider.isNotNull(toState, "pipState.redirect: toState cannot be null");
            
            redirectedStates[fromState] = toState;  

            return this;
        };

    }]);

})();


(function () {
    'use strict';

    config.$inject = ['$mdThemingProvider', 'pipTranslateProvider'];
    run.$inject = ['localStorageService', 'pipTheme', '$rootScope'];
    ThemeFactory.$inject = ['localStorageService', '$mdTheming', '$rootScope', '$timeout', '$state', '$stateParams'];
    angular
        .module('pipTheme', ['ngMaterial'])
        .config(config)
        .run(run)
        .factory('pipTheme', ThemeFactory);

    function config($mdThemingProvider, pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            THEME: 'Theme',
            blue: 'Blue',
            pink: 'Pink',
            amber: 'Amber',
            orange: 'Orange',
            green: 'Green',
            navy: 'Navy',
            grey: 'Grey'
        });
        pipTranslateProvider.translations('ru', {
            THEME: 'Тема',
            blue: 'Голубая',
            pink: 'Розовая',
            amber: 'Янтарная',
            orange: 'Оранжевая',
            green: 'Зеленая',
            navy: 'Сине-серая',
            grey: 'Серая'
        });


        registerBlueTheme('default');
        registerBlueTheme('blue');
        registerPinkTheme('pink');
        registerAmberTheme('amber');
        registerOrangeTheme('orange');
        registerGreenTheme('green');
        registerNavyTheme('navy');
        registerGreyTheme('grey');
       // registerDarkTheme('dark');
       // registerBlackTheme('black');

        $mdThemingProvider.setDefaultTheme('default');
        $mdThemingProvider.alwaysWatchTheme(true);

        function registerBlueTheme(themeName) {
            var bluePrimaryPalette = $mdThemingProvider.extendPalette('blue', {
                'contrastDefaultColor': 'light',
                'contrastDarkColors': undefined
            });
            $mdThemingProvider.definePalette('blue-primary', bluePrimaryPalette);

            var blueBackgroundPalette = $mdThemingProvider.extendPalette('grey', {
                'A100': 'rgba(231, 231, 231, 1)',
                'A200': 'rgba(33, 150, 243, 1)'
            });
            $mdThemingProvider.definePalette('blue-background', blueBackgroundPalette);

            var blueAccentPalette = $mdThemingProvider.extendPalette('green', {
                '600': 'rgba(0, 200, 83, 1)'
            });
            $mdThemingProvider.definePalette('blue-accent', blueAccentPalette);

            $mdThemingProvider.theme(themeName)
                .primaryPalette('blue-primary', {
                    'default': '500',
                    'hue-1': '300'
                })
                .backgroundPalette('blue-background', {
                    'default': '50',  // background
                    'hue-1': 'A200',  // tiles dialog
                    'hue-2': 'A700'   // app bar
                })
                .warnPalette('red', {
                    'default': 'A200'
                })
                .accentPalette('blue-accent', {
                    'default': '600'
                });
        }

        function registerPinkTheme(themeName) {
            var PinkBackgroundPalette = $mdThemingProvider.extendPalette('grey', {
                'A100': 'rgba(231, 231, 231, 1)',
                'A200': 'rgba(188, 86, 121, 1)',
                'contrastDefaultColor': 'dark',
                'contrastLightColors': ['A200', 'A700']
            });
            $mdThemingProvider.definePalette('pink-background', PinkBackgroundPalette);

            var PinkPrimaryPalette = $mdThemingProvider.extendPalette('pink', {
                '600': 'rgba(255, 128, 171, 1)',
                '700': 'rgba(188, 86, 121, .54)',
                '900': 'rgba(188, 86, 121, 1)',
                'contrastDefaultColor': 'light'
            });
            $mdThemingProvider.definePalette('pink-primary', PinkPrimaryPalette);

            $mdThemingProvider.theme(themeName)
                .primaryPalette('pink-primary', {
                    'default': '900',
                    'hue-1': '700'
                })
                .backgroundPalette('pink-background', {
                    'default': '50',  // background
                    'hue-1': 'A200',  // tiles dialog
                    'hue-2': 'A700'   // app bar
                })
                .warnPalette('red', {
                    'default': 'A200'
                })
                .accentPalette('pink-primary', {
                    'default': '600'
                });
        }


        function registerAmberTheme(themeName) {
            var orangeBackgroundPalette = $mdThemingProvider.extendPalette('grey', {
                'A100': 'rgba(231, 231, 231, 1)',
                'A200': 'rgba(255, 152, 0, 1)'
            });
            $mdThemingProvider.definePalette('orange-background', orangeBackgroundPalette);

            var orangePrimaryPalette = $mdThemingProvider.extendPalette('orange', {
                '800': 'rgba(255, 152, 0, 1)',
                '900': 'rgba(255, 152, 0, .54);'
            });
            $mdThemingProvider.definePalette('orange-primary', orangePrimaryPalette);

            $mdThemingProvider.theme(themeName)
                .primaryPalette('orange-primary', {
                    'default': '800',
                    'hue-1': '900'
                })
                .backgroundPalette('orange-background', {
                    'default': '50',  // background
                    'hue-1': 'A200',  // tiles dialog
                    'hue-2': 'A700'   // app bar
                })
                .warnPalette('red', {
                    'default': 'A200'
                })
                .accentPalette('orange', {
                    'default': '900'
                });
        }

        function registerOrangeTheme(themeName) {
            var RedBackgroundPalette = $mdThemingProvider.extendPalette('grey', {
                'A100': 'rgba(231, 231, 231, 1)',
                'A200': 'rgba(255, 112, 67, 1)',
                'contrastLightColors': ['600', '700', '800', '900', 'A200']
            });
            $mdThemingProvider.definePalette('red-background', RedBackgroundPalette);

            var RedPrimaryPalette = $mdThemingProvider.extendPalette('orange', {
                '800': 'rgba(255, 112, 67, 1)',
                '900': 'rgba(255, 152, 67, .54)',
                'A100': 'rgba(255, 171, 64, 1)',
                'contrastLightColors': ['800', '900', 'A100']
            });
            $mdThemingProvider.definePalette('red-primary', RedPrimaryPalette);

            $mdThemingProvider.theme(themeName)
                .primaryPalette('red-primary', {
                    'default': '800',
                    'hue-1': '900'
                })
                .backgroundPalette('red-background', {
                    'default': '50',  // background
                    'hue-1': 'A200',  // tiles dialog
                    'hue-2': 'A700'   // app bar
                })
                .warnPalette('red', {
                    'default': 'A200'
                })
                .accentPalette('red-primary', {
                    'default': 'A100'
                });
        }

        function registerGreenTheme(themeName) {
            var greenBackgroundPalette = $mdThemingProvider.extendPalette('grey', {
                'A100': 'rgba(231, 231, 231, 1)',
                'A200': 'rgba(76, 175, 80, 1)'
            });
            $mdThemingProvider.definePalette('green-background', greenBackgroundPalette);

            var greenPrimaryPalette = $mdThemingProvider.extendPalette('green', {
                '300':'#9ed4a1',
                'contrastLightColors': ['500', '300']
            });
            $mdThemingProvider.definePalette('green-primary', greenPrimaryPalette);


            var greenAccentPalette = $mdThemingProvider.extendPalette('amber', {
                'contrastLightColors': ['A700']
            });
            $mdThemingProvider.definePalette('green-accent', greenAccentPalette);

            $mdThemingProvider.theme(themeName)
                .primaryPalette('green-primary', {
                    'default': '500',
                    'hue-1': '300'
                })
                .backgroundPalette('green-background', {
                    'default': '50',  // background
                    'hue-1': 'A200',  // tiles dialog
                    'hue-2': 'A700'   // app bar
                })
                .warnPalette('red', {
                    'default': 'A200'
                })
                .accentPalette('green-accent', {
                    'default': 'A700'
                });
        }

        function registerNavyTheme(themeName) {
            var greyPalette = $mdThemingProvider.extendPalette('grey', {
                '700': 'rgba(86, 97, 125, 1)',
                '800': 'rgba(86, 97, 125, .54)',
                'A100': 'rgba(231, 231, 231, 1)'
            });
            $mdThemingProvider.definePalette('grey', greyPalette);

            var tealPalette = $mdThemingProvider.extendPalette('teal', {
                'contrastLightColors': [ '500', '600', '700', '800', '900', 'A700']
            });
            $mdThemingProvider.definePalette('teal', tealPalette);

            $mdThemingProvider.theme(themeName)
                .primaryPalette('grey', {
                    'default': '700',
                    'hue-1': '800'
                })
                .backgroundPalette('grey', {
                    'default': '50',  // background
                    'hue-1': '700',  // tiles dialog
                    'hue-2': 'A700'   // app bar
                })
                .warnPalette('red', {
                    'default': 'A200'
                })
                .accentPalette('teal', {
                    'default': 'A700'
                });
        }

        function registerGreyTheme(themeName) {
            var thirdPartyPalette = $mdThemingProvider.extendPalette('grey', {
                'A100': 'rgba(231, 231, 231, 1)',
                'A200': 'rgba(255, 152, 0, 1)',
                'A400': '#a9b9c0',
                '500': '#607D8B',
                'A700': '#90A4AE',
                //'800': '',
                'contrastDefaultColor': 'dark',
                'contrastLightColors': [ '300', '400', '500', '600', '700', '800', '900', 'A700']
            });
            $mdThemingProvider.definePalette('third-party', thirdPartyPalette);


            $mdThemingProvider.theme(themeName)
                .primaryPalette('third-party', {
                    'default': '500',
                    'hue-1': 'A400'
                })
                .backgroundPalette('third-party', {
                    'default': '50',  // background
                    'hue-1': '500',  // tiles dialog
                    'hue-2': 'A700'   // app bar
                })
                .warnPalette('red', {
                    'default': 'A200'
                })
                .accentPalette('third-party', {
                    'default': 'A700'
                });
        }

        function registerDarkTheme(themeName) {
            var darkBackgroundPalette = $mdThemingProvider.extendPalette('grey', {
                '600': 'rgba(48, 48, 48, 1)',
                '700': 'rgba(255, 255, 255, 0.54)',
                '800': 'rgba(66, 66, 66, 1)'
            });
            $mdThemingProvider.definePalette('dark-background', darkBackgroundPalette);

            var darkAccentPalette = $mdThemingProvider.extendPalette('green', {
                '600': 'rgba(0, 200, 83, 1)'
            });
            $mdThemingProvider.definePalette('dark-accent', darkAccentPalette);

            $mdThemingProvider.theme(themeName)
                .primaryPalette('dark-background', {
                    'default': '900',
                    'hue-1': '700'
                })
                .backgroundPalette('dark-background', {
                    'default': '800',  // background
                    'hue-1': '900',  // tiles dialog
                    'hue-2': 'A700'   // app bar
                })
                .warnPalette('red', {
                    'default': 'A200'
                })
                .accentPalette('dark-accent', {
                    'default': '600'
                });
        }

        function registerBlackTheme(themeName) {
            var blackBackgroundPalette = $mdThemingProvider.extendPalette('grey', {
                '600': 'rgba(48, 48, 48, 1)',
                '700': 'rgba(255, 255, 255, 0.54)',
                '800': 'rgba(66, 66, 66, 1)',
                '500': 'rgba(38, 50, 56, 1)'
            });
            $mdThemingProvider.definePalette('black-background', blackBackgroundPalette);

            var blackAccentPalette = $mdThemingProvider.extendPalette('blue-grey', {
                '700': 'rgba(255, 255, 255, 0.54)'
            });
            $mdThemingProvider.definePalette('black-accent', blackAccentPalette);

            $mdThemingProvider.theme(themeName)
                .primaryPalette('black-accent', {
                    'default': '900',
                    'hue-1': '700'
                })
                .backgroundPalette('black-background', {
                    'default': '800',  // background
                    'hue-1': '500',  // tiles dialog
                    'hue-2': '800'   // app bar
                })
                .warnPalette('red', {
                    'default': 'A200'
                })
                .accentPalette('black-accent', {
                    'default': '600'
                });
        }
    }



    function run(localStorageService, pipTheme, $rootScope) {
        try {
            var currentTheme = ($rootScope.$user && $rootScope.$user.theme) ?
                $rootScope.$user.theme : localStorageService.get('theme');

            pipTheme.initializeTheme(currentTheme);
        } catch (ex) {
            pipTheme.initializeTheme('blue');
        }
    }

    /**
     * @ngdoc service
     * @name pipTheme
     */
    function ThemeFactory(localStorageService, $mdTheming, $rootScope, $timeout, $state, $stateParams) {
        return {
            /**
             * Set current theme
             * @param {String} theme - theme name
             * @param {String}
             * @throws {Error} 'Theme is not specified' in case if theme is not defined
             * @throws {Error} 'Theme XXX is not registered. Please, register it first with $mdThemingProvider' if theme is not registered
             */
            setCurrentTheme: function (theme) {
                if (theme == null || theme === '') {
                    throw new Error('Theme is not specified');
                }

                if (localStorageService.get('theme') == theme && $rootScope.$theme == theme) {
                    return;
                }

                if (!(theme in $mdTheming.THEMES)) {
                    throw new Error('Theme ' + theme + ' is not registered. Please, register it first with $mdThemingProvider');
                }
                localStorageService.set('theme', theme);
                $rootScope.$theme = theme;
            },

            /** Add attribute 'md-theme' with value current theme
             *  Add current theme class
             */
            initializeTheme: function (theme) {
                if (theme == null || theme === '') {
                    throw new Error('Theme is not specified');
                }

                if (!(theme in $mdTheming.THEMES)) {
                    throw new Error('Theme ' + theme + ' is not registered. Please, register it first with $mdThemingProvider');
                }

                $rootScope.$theme = theme;
                $('body').attr('md-theme', '{{ $theme }}').addClass('{{ $theme }}');
            }
        };
    }
})();

/**
 * @file Global application timer service
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
 /* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipTimer', []);

    thisModule.service('pipTimer', 
        ['$interval', '$rootScope', function ($interval, $rootScope) {
            var 
                AUTO_PULL_CHANGES_TIMEOUT = 60000, // 1 min
                AUTO_UPDATE_PAGE_TIMEOUT = 15000,  // 15 sec
                AUTO_UPDATE_COLLECTION_TIMEOUT = 300000, // 5 min
                started = false, 
                autoPullChangesInterval, 
                autoUpdatePageInterval,
                autoUpdateCollectionInterval;

            return {
                isStarted: isStarted,
                start: start,
                stop: stop
            };

            //------------------------

            function isStarted() {
                return started;
            };

            function start() {
                if (started) return;

                autoPullChangesInterval = $interval(function () {
                    $rootScope.$broadcast('pipAutoPullChanges');
                }, AUTO_PULL_CHANGES_TIMEOUT);

                autoUpdatePageInterval = $interval(function () {
                    $rootScope.$broadcast('pipAutoUpdatePage');
                }, AUTO_UPDATE_PAGE_TIMEOUT);

                autoUpdateCollectionInterval = $interval(function () {
                    $rootScope.$broadcast('pipAutoUpdateCollection');
                }, AUTO_UPDATE_COLLECTION_TIMEOUT);

                started = true;
            };

            function stop() {
                if (autoPullChangesInterval)
                    $interval.cancel(autoPullChangesInterval);

                if (autoUpdatePageInterval)
                    $interval.cancel(autoUpdatePageInterval);

                if (autoUpdateCollectionInterval)
                    $interval.cancel(autoUpdatePageInterval);

                started = false;
            };
        }]
    );

})();

/**
 * @file Transaction context
 * @description
 * Transaction context helps to wrap multiple server requests
 * into one logical transaction. It decouples transaction
 * management and progress visualization to the user
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
 /* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipTransactions', ['pipTranslate', 'pipErrors']);

	thisModule.config(['pipTranslateProvider', function(pipTranslateProvider) {
        
        pipTranslateProvider.translations('en', {
            'ENTERING': 'Entering...',
            'PROCESSING': 'Processing...',
            'LOADING': 'Loading...',
            'SAVING': 'Saving...'
        });

        pipTranslateProvider.translations('ru', {
            'ENTERING': 'Вход в систему...',
            'PROCESSING': 'Обрабатывается...',
            'LOADING': 'Загружается...',
            'SAVING': 'Сохраняется...'
        });
		
	}]);

    /*
     * Transaction is designed to assist with transaction processing
     * within different application scopes & controllers without overlap.
     *
     * A unique identification of the scope/controller is passed to the service
     * when it is initialized to identify the error for that scope.
     * 
     * Transaction is also integrated with Error service. So you don't need to double it
     * */
    thisModule.factory('pipTransaction',
        ['$rootScope', 'pipError', function ($rootScope, pipError) {

            // Initialize transaction scope
            $rootScope.transactions = {};

            return createTransaction;

            //---------------------------------

            function initTransaction(scope) {
                $rootScope.transactions[scope] = {
                    id: undefined,
                    operation: undefined
                };
            }
            
            function createTransaction(scope, scopeObject) {
                scope = scope || 'global';

                var error = pipError(scope);
                var transaction = {
                    error: error,

                    reset: function () {
                        initTransaction();
                        error.reset();
                    },

                    busy: function() {
                        var transaction = $rootScope.transactions[scope];
                        return transaction != null && transaction.id;
                    },

                    failed: function() {
                        return !error.empty();
                    },

                    aborted: function(id) {
                        var transaction = $rootScope.transactions[scope];
                        return _.isNull(transaction) || transaction.id != id;
                    },

                    get: function () {
                        if (_.isNull($rootScope.transactions[scope])) {
                            initTransaction(scope);
                        }
                        return $rootScope.transactions[scope];
                    },

                    id: function () {
                        var transaction = $rootScope.transactions[scope];
                        return transaction ? transaction.id : null;
                    },

                    operation: function () {
                        var transaction = $rootScope.transactions[scope];
                        return transaction ? transaction.operation : null;
                    },

                    errorMessage: function () {
                        return error.message();
                    },

                    begin: function (operation) {
                        var transaction = $rootScope.transactions[scope];
                        // Transaction already in progress
                        if (transaction != null && transaction.id) {
                            return null;
                        }                      

                        transaction = $rootScope.transactions[scope] = {
                            id: new Date().getTime(),
                            operation: operation || 'PROCESSING'
                        };
                        error.reset();

                        return transaction.id;
                    },

                    abort: function() {
                        var transaction = $rootScope.transactions[scope];
                        if (transaction) {
                            transaction.id = null;
                        }
                        error.reset();
                    },

                    end: function (err) {
                        if (err) error.set(err);
                        else error.reset();

                        var transaction = $rootScope.transactions[scope];
                        if (transaction != null) {
                            transaction.id = null;
                        }                      
                    }
                };

                if (_.isObject(scopeObject)) {
                    scopeObject.error = error;
                    scopeObject.transaction = transaction;
                }

                return transaction;
            }
        }]
    );

})();

/**
 * @file Translatation service
 * @copyright Digital Living Software Corp. 2014-2016
 * @todo:
 * - Move directives to more appropriate places
 */
 
 /* global _, angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipTranslate', ['LocalStorageModule', 'pipAssert']);

    thisModule.provider('pipTranslate', ['pipAssertProvider', function(pipAssertProvider) {
        var 
            language = 'en',
            persist = true,
            setRoot = true,
            translationMap = {
                en: {
                    'en': 'English',
                    'ru': 'Russian',
                    'es': 'Spanish',
                    'pt': 'Portuguese',
                    'de': 'German',
                    'fr': 'French'
                },
                ru: {
                    'en': 'Английский',
                    'ru': 'Русский',
                    'es': 'Испанский',
                    'pt': 'Португальский',
                    'de': 'Немецкий',
                    'fr': 'Французский'
                }
            };

        this.translations = setTranslations;
        this.language = initLanguage;
        this.use = initLanguage;
        this.persist = initPersist;
        this.setRoot = initSetRoot;

        this.$get = ['$rootScope', '$timeout', 'localStorageService', 'pipAssert', function ($rootScope, $timeout, localStorageService, pipAssert) {
            // Read language from persistent storage
            if (persist)
                language = localStorageService.get('language') || language;

            // Set root variable
            if (setRoot) 
                $rootScope.$language = language;
            
            // Resetting root scope to force update language on the screen
            function reset(fullReset, partialReset) {
                fullReset = fullReset !== undefined ? !!fullReset : true;
                partialReset = partialReset !== undefined ? !!partialReset : true;

                $rootScope.$reset = fullReset;
                $rootScope.$partialReset = partialReset;
                $timeout(function() {
                    $rootScope.$reset = false;
                    $rootScope.$partialReset = false;
                }, 0);
            }

            return {
                use: function (newLanguage, fullReset, partialReset) {
                    pipAssert.isString(newLanguage || '', "pipTranslate.use: argument should be a string");
                    if (newLanguage != null && newLanguage != language) {
                        language = newLanguage;
                        if (persist)
                            localStorageService.set('language', language);
                        if (setRoot)
                            $rootScope.$language = language;
                        reset(fullReset, partialReset);
                    }
                    return language;
                },

                translations: setTranslations,
                translate: translate,
                translateArray: translateArray,
                translateSet: translateSet,
                translateObjects: translateObjects,
                translateById: translateById,
                translateSetById: translateSetById,
                translateStringsSet: translateStringsSet
            }
        }];

        // Initialize language selection
        function initLanguage(newLanguage) {
            pipAssertProvider.isString(newLanguage || '', "pipTranslateProvider.use or pipTranslateProvider.language: argument should be a string");

            if (newLanguage != null) {
                language = newLanguage;
            }
            return language;
        }

        // Initialize persistence flag
        function initPersist(newPersist) {
            if (newPersist != null) {
                pipAssertProvider.isBoolean(newPersist || '', "pipTranslateProvider.persist: argument should be a boolean");
                persist = newPersist;
            }
            return persist;
        }

        // Initialize set root flag
        function initSetRoot(newSetRoot) {
            if (newSetRoot != null) {
                pipAssertProvider.isBoolean(newSetRoot || '', "pipTranslateProvider.setRoot: argument should be a boolean");
                setRoot = newSetRoot;
            }
            return setRoot;  
        }

        // Set translation strings for specific language
        function setTranslations(language, languageMap) {
            pipAssertProvider.isString(language, "pipTranslate.setTranslations or pipTranslateProvider.translations: first argument should be a string");
            pipAssertProvider.isObject(languageMap, "pipTranslate.setTranslations or pipTranslateProvider.translations: second argument should be an object");

            var map = translationMap[language] || {};
            translationMap[language] = _.extend(map, languageMap);
        }

        // Translate a string by key using set language
        function translate(key) {
            if (_.isNull(key) || _.isUndefined(key)) return '';

            var map = translationMap[language] || {};
            return map[key] || key;
        }

        // Translate an array of strings
        function translateArray(keys) {
            if (_.isNull(keys) || keys.length == 0) return [];

            pipAssertProvider.isArray(keys, "pipTranslate.translateArray: argument should be an array");

            var values = [];
            var map = translationMap[language] || {};

            _.each(keys, function (k) {
                var key = k || '';
                values.push(map[key] || key);
            });

            return values;
        }

        // Translate an array of strings into array of objects (set)
        function translateSet(keys, key, value) {
            if (_.isNull(keys) || keys.length == 0) return [];

            pipAssertProvider.isArray(keys, "pipTranslate.translateSet: first argument should be an array");
            pipAssertProvider.isString(key || '', "pipTranslate.translateSet: second argument should be a string");
            pipAssertProvider.isString(value || '', "pipTranslate.translateSet: third argument should be a string");

            key = key || 'id';
            value = value || 'name';

            var values = [];
            var map = translationMap[language] || {};

            _.each(keys, function (k) {
                var obj = {}, mapKey = k || '';

                obj[key] = mapKey;
                obj[value] = map[mapKey] || mapKey;

                values.push(obj);
            });

            return values;
        }

        // Translate a collection of objects
        function translateObjects(items, key, value) {
            if (_.isNull(items) || items.length == 0) return [];

            pipAssertProvider.isArray(items, "pipTranslate.translateObjects: first argument should be an array");
            pipAssertProvider.isString(key || '', "pipTranslate.translateObjects: second argument should be a string");
            pipAssertProvider.isString(value || '', "pipTranslate.translateObjects: third argument should be a string");

            key = key || 'name';
            value = value || 'nameLocal';

            var map = translationMap[language] || {};

            _.each(items, function (i) {
                var item = i, mapKey = item[key] || '';

                item[value] = map[mapKey] || mapKey;
            });

            return items;
        }

        // Translate a string by key  with prefix using set language todo
        function translateById(prefix, key) {
            pipAssertProvider.isString(key || '', "pipTranslate.translateById: second argument should be a string");
            pipAssertProvider.isString(prefix || '', "pipTranslate.translateById: first argument should be a string");

            prefix = prefix ? prefix + '_' : '';
            key = (prefix + key).replace(/ /g, '_').toUpperCase();
            if (key == null) return '';
            var map = translationMap[language] || {};
            return map[key] || key;
        };

        function translateSetById(keys, prefix, key, value) {
            if (_.isNull(keys) || keys.length == 0) return [];

            pipAssertProvider.isArray(keys, "pipTranslate.translateSetById: first argument should be an array");
            pipAssertProvider.isString(prefix || '', "pipTranslate.translateSetById: second argument should be a string");
            pipAssertProvider.isString(key || '', "pipTranslate.translateSetById: third argument should be a string");
            pipAssertProvider.isString(value || '', "pipTranslate.translateSetById: forth argument should be a string");

            prefix = prefix ? prefix.replace(/ /g, '_').toUpperCase() : '';
            key = key || 'id';
            value = value || 'name';

            var values = [];
            var map = translationMap[language] || {};

            _.each(keys, function (k) {
                var obj = {}, mapKey = k || '';

                obj[key] = mapKey;
                obj[value] = map[prefix + '_' + mapKey] || mapKey;

                values.push(obj);
            });

            return values;
        }

        // Translate an array of strings, apply uppercase and replace ' ' => '_'
        function translateStringsSet(keys, prefix, key, value) {
            if (_.isNull(keys) || keys.length == 0) return [];

            pipAssertProvider.isArray(keys, "pipTranslate.translateStringsSet: first argument should be an array");
            pipAssertProvider.isString(prefix || '', "pipTranslate.translateStringsSet: second argument should be a string");
            pipAssertProvider.isString(key || '', "pipTranslate.translateStringsSet: third argument should be a string");
            pipAssertProvider.isString(value || '', "pipTranslate.translateStringsSet: forth argument should be a string");

            key = key || 'id';
            value = value || 'name';
            prefix = prefix ? prefix.replace(/ /g, '_').toUpperCase() + '_': '';

            var values = [];
            var map = translationMap[language] || {};

            _.each(keys, function (k) {
                var obj = {}, mapKey = k || '';
                obj[key] = mapKey;
                obj[value] = map[prefix + mapKey.replace(/ /g, '_').toUpperCase()]
                    || (prefix + mapKey.replace(/ /g, '_').toUpperCase());

                values.push(obj);
            });

            return values;
        }
    }]);

    thisModule.directive('pipTranslate', ['pipTranslate', function(pipTranslate) {
        return {
            restrict: 'EA',
            scope: {
                key1: '@pipTranslate',
                key2: '@key'
            },
            link: function (scope, element, attrs) {
                var key = scope.key1 || scope.key2;
                var value = pipTranslate.translate(key);
                element.text(value);
            }

        };
    }]);

    thisModule.directive('pipTranslateHtml', ['pipTranslate', function(pipTranslate) {
        return {
            restrict: 'EA',
            scope: {
                key1: '@pipTranslateHtml',
                key2: '@key'
            },
            link: function (scope, element, attrs) {
                var key = scope.key1 || scope.key2;
                var value = pipTranslate.translate(key);
                element.html(value);
            }

        };
    }]);

})();
/**
 * @file Filter to format date and time
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipDateTimeFilters', ['pipDateFormat']);

    thisModule.filter('formatDate',  
        ['pipDateFormat', function (pipDateFormat) {
            return function(value, format) {
                return pipDateFormat.formatDate(value, format);  
            };
        }]
    );

    thisModule.filter('formatLongDate', 
        ['pipDateFormat', function (pipDateFormat) {
            return function(value) {
                return pipDateFormat.formatLongDate(value);  
            };
        }]
    );

    thisModule.filter('formatLongDateWithYear',
        ['pipDateFormat', function (pipDateFormat) {
            return function(value) {
                return pipDateFormat.formatLongDateWithYear(value);
            };
        }]
    );

    thisModule.filter('formatMonth',
        ['pipDateFormat', function (pipDateFormat) {
            return function(value, format) {
                return pipDateFormat.formatMonth(value, format);
            };
        }]
    );

    thisModule.filter('formatShortDate', 
        ['pipDateFormat', function (pipDateFormat) {
            return function(value) {
                return pipDateFormat.formatShortDate(value);  
            };
        }]
    );

    thisModule.filter('formatShortDateWithYear',
        ['pipDateFormat', function (pipDateFormat) {
            return function(value) {
                return pipDateFormat.formatShortDateWithYear(value);
            };
        }]
    );

    thisModule.filter('formatLongMonth',
        ['pipDateFormat', function (pipDateFormat) {
            return function(value) {
                return pipDateFormat.formatLongMonth(value);
            };
        }]
    );

    thisModule.filter('formatYear',
        ['pipDateFormat', function (pipDateFormat) {
            return function(value) {
                return pipDateFormat.formatYear(value);
            };
        }]
    );

    thisModule.filter('formatShortWeek',
        ['pipDateFormat', function (pipDateFormat) {
            return function(value) {
                return pipDateFormat.formatShortWeek(value);
            };
        }]
    );

    thisModule.filter('formatTime', 
        ['pipDateFormat', function (pipDateFormat) {
            return function(value, format) {
                return pipDateFormat.formatTime(value, format);  
            };
        }]
    );

    thisModule.filter('formatLongTime', 
        ['pipDateFormat', function (pipDateFormat) {
            return function(value) {
                return pipDateFormat.formatLongTime(value);  
            };
        }]
    );

    thisModule.filter('formatShortTime', 
        ['pipDateFormat', function (pipDateFormat) {
            return function(value) {
                return pipDateFormat.formatShortTime(value);  
            };
        }]
    );

    thisModule.filter('formatLongDateTime', 
        ['pipDateFormat', function (pipDateFormat) {
            return function(value) {
                return pipDateFormat.formatLongDateTime(value);  
            };
        }]
    );

    thisModule.filter('formatShortDateTime', 
        ['pipDateFormat', function (pipDateFormat) {
            return function(value) {
                return pipDateFormat.formatShortDateTime(value);  
            };
        }]
    );

    thisModule.filter('formatElapsedInterval', 
        ['pipDateFormat', function (pipDateFormat) {
            return function(value) {
                return pipDateFormat.formatElapsedInterval(value);  
            };
        }]
    );

    thisModule.filter('formatElapsedTime', 
        ['pipDateFormat', function (pipDateFormat) {
            return function(value) {
                return pipDateFormat.formatElapsedTime(value);  
            };
        }]
    );

    thisModule.filter('formatMillisecondsToSeconds',
        ['pipDateFormat', function (pipDateFormat) {
            return function(value) {
                return pipDateFormat.formatMillisecondsToSeconds(value);
            };
        }]
    );

    thisModule.filter('formatDateRange',
        ['pipDateFormat', function (pipDateFormat) {
            return function(value1, value2) {
                return pipDateFormat.formatDateRange(value1, value2);
            };
        }]
    );

    thisModule.filter('formatDateTimeRange',
        ['pipDateFormat', function (pipDateFormat) {
            return function(value1, value2) {
                return pipDateFormat.formatDateTimeRange(value1, value2);
            };
        }]
    );


})();

/**
 * @file Filter to translate string resources
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipTranslateFilters', ['pipTranslate']);

    thisModule.filter('translate', ['pipTranslate', function (pipTranslate) {
        return function (key) {
            return pipTranslate.translate(key) || key;
        }
    }]);

})();

/**
 * @file Collection utilities
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global _, angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipUtils.Collections', []);

    thisModule.factory('pipCollections', function () {
        var collections = {};

        // Index of element in array by key
        collections.indexBy = function (items, key, value) {
            if (!items || !items.length)
                return null;
            for (var i = 0; i < items.length; i++) {
                if (items[i][key] == value) {
                    return i;
                }
            }
            return null;
        };
    
        // Find element in array by key
        collections.findBy = function (items, key, value) {
            if (!items || !items.length)
                return null;
            for (var i = 0; i < items.length; i++) {
                if (items[i][key] == value) {
                    return items[i];
                }
            }
            return null;
        };
    
        // Remove element from array by value
        collections.remove = function (items, item) {
            if (!items || !items.length)
                return null;
            for (var i = 0; i < items.length; i++) {
                if (items[i] == item) {
                    items.splice(i, 1);
                    i--;
                }
            }
        };
    
        // Removes element from array by key
        collections.removeBy = function (items, key, value) {
            if (!items || !items.length)
                return null;
            for (var i = 0; i < items.length; i++) {
                if (items[i][key] == value) {
                    items.splice(i, 1);
                    i--;
                }
            }
        };
    
        // Replaced element by key
        collections.replaceBy = function (items, key, value, data) {
            if (!items || !items.length)
                return null;
            for (var i = 0; i < items.length; i++) {
                if (items[i][key] == value) {
                    items[i] = data;
                    return;
                }
            }
        };
    
        // Calculate difference between two collections
        collections.difference = function (a1, a2, comparator) {
            var result = [];
    
            _.each(a1, function (e1) {
                var e2 = _.find(a2, function (e) {
                    return comparator(e1, e);
                });
    
                if (e2 == null) {
                    result.push(e1);
                }
            })
    
            return result;
        };

        return collections;
    });

})();

/**
 * @file Date utilities
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global _, angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipUtils.Dates', []);

    thisModule.factory('pipDates', function () {
        var dates = {};

        dates.addHours = function (date, hours) {
            date = _.isDate(date) ? date : new Date(date);
            var time = date.getTime() + hours * 3600000;
            return new Date(time);
        };

        dates.toStartDay = function (date) {
            date = _.isDate(date) ? date : new Date(date);
            return new Date(date.getFullYear(), date.getMonth(), date.getDate());
        };

        dates.toEndDay = function (date, offset) {
            date = _.isDate(date) ? date : new Date(date);
            offset = offset != null ? offset : 0;
            var start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            return new Date(start.getTime() + 24 * 3600000 + offset);
        };

        dates.toStartWeek = function (date) {
            date = _.isDate(date) ? date : new Date(date);
            var dayOfWeek = date.getDay() ? date.getDay() : 7;
            date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            return new Date(date.getTime() - (dayOfWeek - 1) * 24 * 3600000);  // dayOfWeek = 0 для воскресенья
        };

        dates.toEndWeek = function (date, offset) {
            date = _.isDate(date) ? date : new Date(date);
            offset = offset != null ? offset : 0;
            var dayOfWeek = date.getDay() ? date.getDay() : 7;
            date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            return new Date(date.getTime() + (8 - dayOfWeek) * 24 * 3600000 + offset);
        };

        dates.toStartMonth = function (date) {
            date = _.isDate(date) ? date : new Date(date);
            return new Date(date.getFullYear(), date.getMonth(), 1);
        };

        dates.toEndMonth = function (date, offset) {
            date = _.isDate(date) ? date : new Date(date);

            var
                month = date.getMonth() + 1,
                year = date.getFullYear();

            if (month > 11) {
                year++;
                month = 0;
            }

            date = new Date(year, month, 1);

            if (offset != null) {
                date = new Date(date.getTime() + offset);
            }

            return date;
        };

        dates.toStartYear = function (date) {
            date = _.isDate(date) ? date : new Date(date);
            return new Date(date.getFullYear(), 0, 1);
        };

        dates.toEndYear = function (date, offset) {
            date = _.isDate(date) ? date : new Date(date);
            date = new Date(date.getFullYear() + 1, 0, 1);

            if (offset != null) {
                date = new Date(date.getTime() + offset);
            }

            return date;
        };

        /** UTC functions  - **/
        dates.toUTCDate = function (year, month, day) {
            return new Date(Date.UTC(year, month, day));
        };

        dates.toUTCDate = function (date) {
            return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        };

        dates.fromUTCDate = function (date) {
            if (date == null) date = new Date();
            return new Date(
                date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
        };

        dates.toUTCStartWeek = function (date) {
            if(!_.isDate(date)) {
                date = new Date(date);
                date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
            }
            var dayOfWeek = date.getDay() ? date.getDay() : 7;
            date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            date = dayOfWeek != 1 ? new Date(date.getTime() - (dayOfWeek - 1) * 24 * 3600000) : date;
            return  new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        };

        dates.toUTCEndWeek = function (date, offset) {
            if(!_.isDate(date)) {
                date = new Date(date);
                date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
            }
            offset = offset != null ? offset : 0;
            var dayOfWeek = date.getDay() ? date.getDay() : 7;
            date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            date = new Date(date.getTime() + (8 - dayOfWeek) * 24 * 3600000 + offset);
            return  new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        };

        return dates;
    });
})();

/**
 * @file Form error utilities
 * @copyright Digital Living Software Corp. 2014-2016
 *
 */
 
 /* global _, angular */
 
(function () {
    'use strict';

    var thisModule = angular.module('pipUtils.FormErrors', []);

    thisModule.factory('pipFormErrors', ['$rootScope', function ($rootScope) {
		return {
			errorsWithHint: errorsWithHint,
            //submittedErrors: submittedErrors,
            //submittedErrorsWithHint: submittedErrorsWithHint,
            //dirtyErrors: dirtyErrors,
            //dirtyErrorsWithHint: dirtyErrorsWithHint,
            //touchedErrors: touchedErrors,            
            touchedErrorsWithHint: touchedErrorsWithHint,
            resetFormErrors: resetFormErrors,
            setFormError: setFormError,
            resetFieldsErrors: resetFieldsErrors
		};
		//-------------------

        function errorsWithHint(field) {
            if (field == null) return;
			
            return _.isEmpty(field.$error) ? { hint: true } : field.$error;
        };
		
//         function submittedErrors(form, field) {
//             if (form == null) throw new Error('Form is not set');
//             if (field == null) throw new Error('Field is not set');
// 
//             if (form.$submitted)
//                 return field.$error;
//             return {};
//         };
// 
//         function submittedErrorsWithHint(form, field) {
//             if (form == null) throw new Error('Form is not set');
//             if (field == null) throw new Error('Field is not set');
// 
//             if (form.$submitted) {
//                 return _.isEmpty(field.$error) ? { hint: true} : field.$error;
//             }
//             return { hint: true };
//         };
// 
//         function dirtyErrors(form, field) {
//             if (form == null) throw new Error('Form is not set');
//             if (field == null) throw new Error('Field is not set');
// 
//             if (field.$dirty || form.$dirty)
//                 return field.$error;
//             return {};
//         };
// 
//         function dirtyErrorsWithHint(form, field) {
//             if (form == null) throw new Error('Form is not set');
//             if (field == null) throw new Error('Field is not set');
// 
//             if (field.$dirty || form.$dirty) {
//                 return _.isEmpty(field.$error) ? { hint: true} : field.$error;
//             }
//             return { hint: true };
//         };
// 
//         function touchedErrors(form, field) {
//             if (form == null) throw new Error('Form is not set');
//             if (field == null) throw new Error('Field is not set');
//             
//             if (field.$touched || form.$dirty)
//                 return field.$error;
//             return {};
//         };

        function touchedErrorsWithHint(form, field) {
            if (form == null) return;
            if (field == null) return;

            if (form.$submitted && (field.$touched || form.$dirty) || !form.$submitted && (field.$touched || field.$dirty)) {
                var result = _.isEmpty(field.$error) ? { hint: true} : field.$error;
                return result;
            }
            return { hint: true };
        };

        function resetFormErrors(form, errors) {
            form.$setPristine();
            form.$setUntouched();

            if (errors) {
                form.$setDirty();
                form.$setSubmitted();
            }

            form.$serverError = {};
        };
        
        function resetFieldsErrors(form, field) {
            if (!form) return;
            if (field && form[field] && form[field].$error) {
                 form[field].$error = {};
            } else {
                for (var prop in form) {
                    if (form[prop] && form[prop].$error) {
                        form[prop].$error = {};
                    };
                }
                if (form && form.$error) form.$error = {};
            }
        };
        
        function setFormError(form, error, errorFieldMap) {
            if (error == null) return;
            // Prepare form server errors
            form.$serverError = form.$serverError || {};
            // Prepare error code
            var code = error.code || (error.data || {}).code || null;
            if (!code && error.status) code = error.status;

            if (code) {
                var 
                    errorName = 'ERROR_' + code,
                    field = errorFieldMap ? errorFieldMap[code] : null;
                // Set server error to fields
                if (field && form[field] && form[field].$setValidity) {
                    form[field].$setValidity(errorName, false);
                    return;
                }

                // Set server error to form
                if (field == 'form') {
                    form.$serverError[errorName] = true;
                    return;
                }
            }

            // if undefined error for this form or code === undefined/null, go to unhandled error page
            if (error.data && error.data.message) {
                form.$serverError['ERROR_UNKNOWN'] = error.data.message;
                goToUnhandledErrorPage(error);
                return;
            }

            // Set as undefined error
            if (error.message) {
                form.$serverError['ERROR_UNKNOWN'] = error.message;
                goToUnhandledErrorPage(error);
                return;
            }

            if (error.name) {
                form.$serverError['ERROR_UNKNOWN'] = error.name;
                goToUnhandledErrorPage(error);
                return;
            }

            form.$serverError['ERROR_UNKNOWN'] = error;
            goToUnhandledErrorPage(error);
        };

        function goToUnhandledErrorPage(error) {
            $rootScope.$emit('pipUnhandledInternalError', {
                error: error
            });
        };
        
	}]);

})();
/**
 * @file General purpose utilities
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global _, $, angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipUtils.General', ['pipState', 'pipAssert']);

    thisModule.factory('pipUtils', ['$rootScope', '$window', '$state', 'pipAssert', function ($rootScope, $window, $state, pipAssert) {

        function strRepeat(str, qty) {
            if (qty < 1) return '';
            var result = '';
            while (qty > 0) {
                if (qty & 1) result += str;
                qty >>= 1, str += str;
            }
            return result;
        }

        var toString = Object.prototype.toString;

        var sprintf = (function sprintf() {
            function get_type(variable) {
                return toString.call(variable).slice(8, -1).toLowerCase();
            }

            var str_repeat = strRepeat;

            var str_format = function() {
                if (!str_format.cache.hasOwnProperty(arguments[0])) {
                    str_format.cache[arguments[0]] = str_format.parse(arguments[0]);
                }
                return str_format.format.call(null, str_format.cache[arguments[0]], arguments);
            };

            str_format.format = function(parse_tree, argv) {
                var cursor = 1, tree_length = parse_tree.length, node_type = '', arg, output = [], i, k, match, pad, pad_character, pad_length;
                for (i = 0; i < tree_length; i++) {
                    node_type = get_type(parse_tree[i]);
                    if (node_type === 'string') {
                        output.push(parse_tree[i]);
                    }
                    else if (node_type === 'array') {
                        match = parse_tree[i]; // convenience purposes only
                        if (match[2]) { // keyword argument
                            arg = argv[cursor];
                            for (k = 0; k < match[2].length; k++) {
                                if (!arg.hasOwnProperty(match[2][k])) {
                                    throw new Error(sprintf('[_.sprintf] property "%s" does not exist', match[2][k]));
                                }
                                arg = arg[match[2][k]];
                            }
                        } else if (match[1]) { // positional argument (explicit)
                            arg = argv[match[1]];
                        }
                        else { // positional argument (implicit)
                            arg = argv[cursor++];
                        }

                        if (/[^s]/.test(match[8]) && (get_type(arg) != 'number')) {
                            throw new Error(sprintf('[_.sprintf] expecting number but found %s', get_type(arg)));
                        }
                        switch (match[8]) {
                            case 'b': arg = arg.toString(2); break;
                            case 'c': arg = String.fromCharCode(arg); break;
                            case 'd': arg = parseInt(arg, 10); break;
                            case 'e': arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential(); break;
                            case 'f': arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg); break;
                            case 'o': arg = arg.toString(8); break;
                            case 's': arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg); break;
                            case 'u': arg = Math.abs(arg); break;
                            case 'x': arg = arg.toString(16); break;
                            case 'X': arg = arg.toString(16).toUpperCase(); break;
                        }
                        arg = (/[def]/.test(match[8]) && match[3] && arg >= 0 ? '+'+ arg : arg);
                        pad_character = match[4] ? match[4] == '0' ? '0' : match[4].charAt(1) : ' ';
                        pad_length = match[6] - String(arg).length;
                        pad = match[6] ? str_repeat(pad_character, pad_length) : '';
                        output.push(match[5] ? arg + pad : pad + arg);
                    }
                }
                return output.join('');
            };

            str_format.cache = {};

            str_format.parse = function(fmt) {
                var _fmt = fmt, match = [], parse_tree = [], arg_names = 0;
                while (_fmt) {
                    if ((match = /^[^\x25]+/.exec(_fmt)) !== null) {
                        parse_tree.push(match[0]);
                    }
                    else if ((match = /^\x25{2}/.exec(_fmt)) !== null) {
                        parse_tree.push('%');
                    }
                    else if ((match = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(_fmt)) !== null) {
                        if (match[2]) {
                            arg_names |= 1;
                            var field_list = [], replacement_field = match[2], field_match = [];
                            if ((field_match = /^([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
                                field_list.push(field_match[1]);
                                while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
                                    if ((field_match = /^\.([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
                                        field_list.push(field_match[1]);
                                    }
                                    else if ((field_match = /^\[(\d+)\]/.exec(replacement_field)) !== null) {
                                        field_list.push(field_match[1]);
                                    }
                                    else {
                                        throw new Error('[_.sprintf] huh?');
                                    }
                                }
                            }
                            else {
                                throw new Error('[_.sprintf] huh?');
                            }
                            match[2] = field_list;
                        }
                        else {
                            arg_names |= 2;
                        }
                        if (arg_names === 3) {
                            throw new Error('[_.sprintf] mixing positional and named placeholders is not (yet) supported');
                        }
                        parse_tree.push(match);
                    }
                    else {
                        throw new Error('[_.sprintf] huh?');
                    }
                    _fmt = _fmt.substring(match[0].length);
                }
                return parse_tree;
            };

            return str_format;
        })();

        return {
            copyProperty: copyProperty,
            copy: copyProperty,
            swapProperties: swapProperties,
            swap: swapProperties,
            convertToBoolean: convertToBoolean,
            toBoolean: convertToBoolean,
            toBool: convertToBoolean,
            convertObjectIdsToString: convertObjectIdsToString,
            OidToString: convertObjectIdsToString,
            generateVerificationCode: generateVerificationCode,
            vercode: generateVerificationCode,
            goBack: goBack,
            goBackAndSelect: goBackAndSelect,
            scrollTo: scrollTo,
            equalObjectIds: equalObjectIds,
            eqOid: equalObjectIds,
            notEqualObjectIds: notEqualObjectIds,
            neqOid: notEqualObjectIds,
            containsObjectId: containsObjectId,
            hasOid: containsObjectId,
            isObjectId: isObjectId,
            // Strings functions. No analogues in lodash.strings
            sampleLine: sampleLine,
            hashCode: hashCode,
            makeString: makeString,
            getBrowser: getBrowser,
            checkSupported: checkSupported,
            sprintf: sprintf,
            // Collection function. No analogues in lodash. It may be in lodash later. Look gitHub/lodash issue #1022
            replaceBy: replaceBy
        };
        
        //--------------------
        function replaceBy(items, key, value, data) {
            if (!items || !items.length)
                return null;
            for (var i = 0; i < items.length; i++) {
                if (items[i][key] == value) {
                    items[i] = data;
                    return;
                }
            }
        };

        // Creates a sample line from a text
        function sampleLine(value, maxLength) {
            if (!value || value == '') return '';

            var length = value.indexOf('\n');
            length = length >= 0 ? length : value.length;
            length = length < maxLength ? value.length : maxLength;

            return value.substring(0, length);
        };

        // Simple version of string hashcode
        function hashCode(value) {
            if (value == null) return 0;
            var result = 0;
            for (var i = 0; i < value.length; i++) {
                result += value.charCodeAt(i);
            }
            return result;
        };

        // Ensure some object is a coerced to a string
        function makeString(object) {
            if (object == null) return '';
            return '' + object;
        };

        function isObjectId(value) {
            var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
            return checkForHexRegExp.test(value);
        }

        // Compares two ObjectIds (they are not equal by '==')
        function equalObjectIds(value1, value2) {
            if (value1 == null && value2 == null)
                return true;

            if (value1 == null || value2 == null)
                return false;

            return value1.toString() == value2.toString();
        };

        // Compares two ObjectIds (they are always not equal by '!=')
        function notEqualObjectIds(value1, value2) {
            if (value1 == null && value2 == null)
                return false;

            if (value1 == null || value2 == null)
                return true;

            return value1.toString() != value2.toString();
        };

        // Checks if array contains concrete objectId
        function containsObjectId(values, value) {
            return _.some(values, function (value1) {
                return equalObjectIds(value1, value);
            });
        };

        // Copy property from one object to another if it exists (not null)
        function copyProperty(dest, destProperty, orig, origProperty) {
            // Shift if only 3 arguments set
            if (_.isObject(destProperty)
                && typeof (origProperty) == 'undefined') {
                origProperty = orig;
                orig = destProperty;
                destProperty = origProperty;
            }
    
            if (orig[origProperty] || (typeof (orig[origProperty]) === 'number' && orig[origProperty] % 1 == 0)) {
                dest[destProperty] = orig[origProperty];
                return true;
            }
    
            return false;
        };
    
        // Swaps values of two properties
        function swapProperties(obj, prop1, prop2) {
            var 
                temp1 = obj[prop1],
                temp2 = obj[prop2];
    
            if (temp1) {
                obj[prop2] = temp1;
            }
            else {
                delete obj[prop2];
            }
    
            if (temp2) {
                obj[prop1] = temp2;
            }
            else {
                delete obj[prop1];
            }
        };
    
        // Converts value into boolean
        function convertToBoolean(value) {
            if (value == null) return false;
            if (!value) return false;
            value = value.toString().toLowerCase();
            return value == '1' || value == 'true';
        };
    
        // Converts array of object ids to strings (for comparison)
        function convertObjectIdsToString(values) {
            return _.map(values, function (value) {
                return value ? value.toString() : 0;
            });
        };

        // Generates random big number for verification codes
        function generateVerificationCode() {
            return Math.random().toString(36).substr(2, 10).toUpperCase(); // remove `0.`
        };

        // Navigation
        //-------------

        function goBack() {
            $window.history.back()
        };

        function goBackAndSelect(object, idParamName, objParamName) {
            pipAssert.isDef(object, 'pipUtils.goBack: first argument should be defined');
            pipAssert.isDef(idParamName, 'pipUtils.goBack: second argument should be defined');
            pipAssert.isDef(objParamName, 'pipUtils.goBack: third argument should be defined');
            pipAssert.isObject(object, 'pipUtils.goBack: first argument should be an object');
            pipAssert.isString(idParamName, 'pipUtils.goBack: second argument should a string');
            pipAssert.isString(objParamName, 'pipUtils.goBack: third argument should a string');
                
            if ($rootScope.$prevState && $rootScope.$prevState.name) {
                var state = _.cloneDeep($rootScope.$prevState);

                state.params[idParamName] = object.id;
                state.params[objParamName] = object;

                $state.go(state.name, state.params);
            } else {
                $window.history.back();
            }
        };

        // Scrolling
        //--------------
        
        function scrollTo(parentElement, childElement, animationDuration) {
            if(!parentElement || !childElement) return;
            if (animationDuration == undefined) animationDuration = 300;

            setTimeout(function () {
                if (!$(childElement).position()) return;
                var modDiff= Math.abs($(parentElement).scrollTop() - $(childElement).position().top);
                if (modDiff < 20) return;
                var scrollTo = $(parentElement).scrollTop() + ($(childElement).position().top - 20);
                if (animationDuration > 0)
                    $(parentElement).animate({
                        scrollTop: scrollTo + 'px'
                    }, animationDuration);
            }, 100);
        };

        // todo add support for iPhone
        function getBrowser() {
            var ua = $window.navigator.userAgent;

            var bName = function () {
                if (ua.search(/Edge/) > -1) return "edge";
                if (ua.search(/MSIE/) > -1) return "ie";
                if (ua.search(/Trident/) > -1) return "ie11";
                if (ua.search(/Firefox/) > -1) return "firefox";
                if (ua.search(/Opera/) > -1) return "opera";
                if (ua.search(/OPR/) > -1) return "operaWebkit";
                if (ua.search(/YaBrowser/) > -1) return "yabrowser";
                if (ua.search(/Chrome/) > -1) return "chrome";
                if (ua.search(/Safari/) > -1) return "safari";
                if (ua.search(/Maxthon/) > -1) return "maxthon";
            }();

            var version;
            switch (bName) {
                case "edge":
                    version = (ua.split("Edge")[1]).split("/")[1];
                    break;
                case "ie":
                    version = (ua.split("MSIE ")[1]).split(";")[0];
                    break;
                case "ie11":
                    bName = "ie";
                    version = (ua.split("; rv:")[1]).split(")")[0];
                    break;
                case "firefox":
                    version = ua.split("Firefox/")[1];
                    break;
                case "opera":
                    version = ua.split("Version/")[1];
                    break;
                case "operaWebkit":
                    bName = "opera";
                    version = ua.split("OPR/")[1];
                    break;
                case "yabrowser":
                    version = (ua.split("YaBrowser/")[1]).split(" ")[0];
                    break;
                case "chrome":
                    version = (ua.split("Chrome/")[1]).split(" ")[0];
                    break;
                case "safari":
                    version = (ua.split("Version/")[1]).split(" ")[0];
                    break;
                case "maxthon":
                    version = ua.split("Maxthon/")[1];
                    break;
            }

            var platform = 'desktop';
            if (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(ua.toLowerCase())) platform = 'mobile';

            var os;
            try {
                var osAll = (/(windows|mac|android|linux|blackberry|sunos|solaris|iphone)/.exec(ua.toLowerCase()) || [u])[0].replace('sunos', 'solaris'),
                    osAndroid = (/(android)/.exec(ua.toLowerCase()) || '');
                    os = osAndroid && (osAndroid == 'android' || (osAndroid[0] == 'android')) ? 'android' : osAll;
            } catch (err) {
                os = 'unknown'
            }

            var browsrObj;

            try {
                browsrObj = {
                    platform: platform,
                    browser: bName,
                    versionFull: version,
                    versionShort: version.split(".")[0],
                    os: os
                };
            } catch (err) {
                browsrObj = {
                    platform: platform,
                    browser: 'unknown',
                    versionFull: 'unknown',
                    versionShort: 'unknown',
                    os: 'unknown'
                };
            }

            return browsrObj;
        }

        // todo нужны каке нибудь настройки?
        function checkSupported(supported) {
            if (!supported) supported = {
                edge: 11,
                ie: 11,
                firefox: 43, //4, for testing
                opera: 35,
                chrome: 47
            };

            var systemInfo = getBrowser();

            if (systemInfo && systemInfo.browser && supported[systemInfo.browser]){
                if (systemInfo.versionShort >= supported[systemInfo.browser]) return true;
            }
            return true;

        };

    }]);

})();

/**
 * @file String utilities
 * @copyright Digital Living Software Corp. 2014-2016
 * @todo
 * - Move functions to general utilities
 */

/* global _, angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipUtils.Strings', []);

    thisModule.factory('pipStrings', function () {
        var strings = {};

        // Creates a sample line from a text
        strings.sampleLine = function (value, maxLength) {
            if (!value || value == '') return '';
    
            var length = value.indexOf('\n');
            length = length >= 0 ? length : value.length;
            length = length < maxLength ? value.length : maxLength;
    
            return value.substring(0, length);
        };
    
        // Simple version of string hashcode
        strings.hashCode = function (value) {
            if (value == null) return 0;
            var result = 0;
            for (var i = 0; i < value.length; i++) {
                result += value.charCodeAt(i);
            }
            return result;
        };
    
        return strings;
    });

})();
/**
 * @file Search tag utilities
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global _, angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipUtils.Tags', []);

    thisModule.factory('pipTags', function () {
        var tags = {};
        
        var HASHTAG_REGEX = /#\w+/g;
    
        var normalizeTag = function (tag) {
            return tag 
                ? _.trim(tag.replace(/(_|#)+/g, ' '))
                : null;
        };
        tags.normalizeTag = normalizeTag;
    
        var compressTag = function (tag) {
            return tag
                ? tag.replace(/( |_|#)/g, '').toLowerCase()
                : null;
        };
        tags.compressTag = compressTag;
    
        var equalTags = function (tag1, tag2) {
            if (tag1 == null && tag2 == null)
                return true;
            if (tag1 == null || tag2 == null)
                return false;
            return compressTag(tag1) == compressTag(tag2);
        };
        tags.equalTags = equalTags;
    
        var normalizeTags = function (tags) {
            if (_.isString(tags)) {
                tags = tags.split(/( |,|;)+/);
            }
    
            tags = _.map(tags, function (tag) {
                return normalizeTag(tag);
            });
    
            return tags;
        };
        tags.normalizeTags = normalizeTags;
    
        var compressTags = function (tags) {
            if (_.isString(tags)) {
                tags = tags.split(/( |,|;)+/);
            }
    
            tags = _.map(tags, function (tag) {
                return compressTag(tag);
            });
    
            return tags;
        };
        tags.compressTags = compressTags;
    
        var extractTags = function (entity, searchFields) {
            var tags = normalizeTags(entity.tags);
    
            _.each(searchFields, function (field) {
                var text = entity[field] || '';
    
                if (text != '') {
                    var hashTags = text.match(HASHTAG_REGEX);
                    tags = tags.concat(normalizeTags(hashTags));
                }
            });
    
            return _.uniq(tags);
        };
        tags.extractTags = extractTags;

        return tags;
    });

})();

/**
 * @file Collection of utilities
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    angular.module('pipUtils', 
		['pipUtils.General', 'pipUtils.Strings', 'pipUtils.Dates', 'pipUtils.Tags', 'pipUtils.Collections', 'pipUtils.FormErrors']);
})();

//# sourceMappingURL=pip-webui-core.js.map
