/// <reference path="../../typings/tsd.d.ts" />


export class PopoverController {
  
    private _$timeout;
    private _$scope: ng.IScope;

    public timeout;
    public backdropElement;
    public content;
    public element;
    public calcH: boolean;

    public templateUrl;
    public template

    public cancelCallback: Function;

    constructor( 
        $scope: ng.IScope,
        $rootScope,
        $element,
        $timeout, 
        $compile
       ) {
           //$scope = _.defaults($scope, $scope.$parent);    // eslint-disable-line 
           this._$timeout = $timeout;
           this.templateUrl = $scope['params'].templateUrl;
           this.template = $scope['params'].template;
           this.timeout = $scope['params'].timeout;
           this.element = $scope['params'].element;
           this.calcH = $scope['params'].calcHeight;
           this.cancelCallback = $scope['params'].cancelCallback;
           this.backdropElement = $('.pip-popover-backdrop');
           this.backdropElement.on('click keydown scroll',() =>{ this.backdropClick()});
           this.backdropElement.addClass($scope['params'].responsive !== false ? 'pip-responsive' : '');

           $timeout(() => {
                this.position();
                if ($scope['params'].template) {
                    this.content = $compile($scope['params'].template)($scope);
                    $element.find('.pip-popover').append(this.content);
                }

                this.init();
           });

           $timeout(() => { this.calcHeight(); }, 200);
           $rootScope.$on('pipPopoverResize', () => { this.onResize()});
           $(window).resize(() => { this.onResize() });

    }

    public backdropClick() {
        if (this.cancelCallback) {
            this.cancelCallback();
        }
        this.closePopover();
    }

    public closePopover() {
        this.backdropElement.removeClass('opened');
        this._$timeout(() => {
            this.backdropElement.remove();
        }, 100);
    }

    public onPopoverClick($e) {
        $e.stopPropagation();
    }


    private init() {
        this.backdropElement.addClass('opened');
        $('.pip-popover-backdrop').focus();
        if (this.timeout) {
            this._$timeout(function () {
                this.closePopover();
            }, this.timeout);
        }
    }

    private position() {
        if (this.element) {
            let element = $(this.element),
                pos = element.offset(),
                width = element.width(),
                height = element.height(),
                docWidth = $(document).width(),
                docHeight = $(document).height(),
                popover = this.backdropElement.find('.pip-popover');

            if (pos) {
                popover
                    .css('max-width', docWidth - (docWidth - pos.left))
                    .css('max-height', docHeight - (pos.top + height) - 32, 0)
                    .css('left', pos.left - popover.width() + width / 2)
                    .css('top', pos.top + height + 16);
            }
        }
    }

    private onResize() {
        this.backdropElement.find('.pip-popover').find('.pip-content').css('max-height', '100%');
        this.position();
        this.calcHeight();
    }

    private calcHeight() {
        if (this.calcH === false) { return; }
        let popover = this.backdropElement.find('.pip-popover'),
        title = popover.find('.pip-title'),
        footer = popover.find('.pip-footer'),
        content = popover.find('.pip-content'),
        contentHeight = popover.height() - title.outerHeight(true) - footer.outerHeight(true);
        content.css('max-height', Math.max(contentHeight, 0) + 'px').css('box-sizing', 'border-box');
    }
}

(() => {
    function pipPopover($parse: any) {
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