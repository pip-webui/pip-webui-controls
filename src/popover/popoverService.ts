/// <reference path="../../typings/tsd.d.ts" />

{
    interface PopoverTemplateScope extends ng.IScope {
        params ? : any;
        locals ? : any;
    }

    class PopoverService {
        private popoverTemplate: string;

        constructor(
            private $compile: ng.ICompileService,
            private $rootScope: ng.IRootScopeService,
            private $timeout: ng.ITimeoutService
        ) {
            this.popoverTemplate = "<div class='pip-popover-backdrop {{ params.class }}' ng-controller='params.controller'" +
                " tabindex='1'> <pip-popover pip-params='params'> </pip-popover> </div>";
        }

        public show(p) {
            let element: JQuery, scope: PopoverTemplateScope, params: any, content: ng.IRootElementService;

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
        }

        public hide() {
            const backdropElement = $('.pip-popover-backdrop');
            backdropElement.removeClass('opened');
            this.$timeout(() => {
                backdropElement.remove();
            }, 100);
        }

        public resize() {
            this.$rootScope.$broadcast('pipPopoverResize');
        }
    }

    angular
        .module('pipPopover.Service', [])
        .service('pipPopoverService', PopoverService);
}