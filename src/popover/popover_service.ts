/// <reference path="../../typings/tsd.d.ts" />


export class PopoverService {
  
    private _$timeout;
    private _$scope: ng.IScope;
    private _$compile;
    private _$rootScope;

    public popoverTemplate: string;

    constructor( 
       $compile, $rootScope, $timeout
       ) {
           this._$compile = $compile;
           this._$rootScope = $rootScope;
           this._$timeout = $timeout;
           this.popoverTemplate = "<div class='pip-popover-backdrop {{ params.class }}' ng-controller='params.controller'" +
                " tabindex='1'> <pip-popover pip-params='params'> </pip-popover> </div>";
    }

    public show(p) {
        let element, scope, params, content;
            
        element = $('body');
        if (element.find('md-backdrop').length > 0) { return; }
        this.hide();
        scope = this._$rootScope.$new();
        params = p && _.isObject(p) ? p : {};
        scope.params = params;
        scope.locals = params.locals;
        content = this._$compile(this.popoverTemplate)(scope);
        element.append(content);
    }

    public hide() {
        let backdropElement = $('.pip-popover-backdrop');
        backdropElement.removeClass('opened');
        this._$timeout(() => {
            backdropElement.remove();
        }, 100);
    }

    public resize() {
        this._$rootScope.$broadcast('pipPopoverResize');
    }
}


(() => {
    angular
        .module('pipPopover.Service', [])
        .service('pipPopoverService', PopoverService);
})();

/*
(function () {
    'use strict';

    var thisModule = angular.module('pipPopover.Service', []);

    thisModule.service('pipPopoverService',
        function ($compile, $rootScope, $timeout) {
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

        }
    );

})();
*/