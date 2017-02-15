/// <reference path="../../typings/tsd.d.ts" />

export class PopoverService {
  
    private _$timeout;
    private _$scope: ng.IScope;
    private _$compile;
    private _$rootScope: ng.IRootScopeService;

    public popoverTemplate: string;

    constructor( 
        $compile,
        $rootScope, 
        $timeout
       ) {
           this._$compile = $compile;
           this._$rootScope = $rootScope;
           this._$timeout = $timeout;
           this.popoverTemplate = "<div class='pip-popover-backdrop {{ params.class }}' ng-controller='params.controller'" +
                " tabindex='1'> <pip-popover pip-params='params'> </pip-popover> </div>";
    }

    public show(p) {
        let element, scope: ng.IScope, params, content;
            
        element = $('body');
        if (element.find('md-backdrop').length > 0) { return; }
        this.hide();
        scope = this._$rootScope.$new();
        params = p && _.isObject(p) ? p : {};
        scope['params'] = params;
        scope['locals'] = params.locals;
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