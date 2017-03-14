{
    interface IPopoverBindings {
        [key: string]: any;

        params: any;
    }

    const PopoverBindings: IPopoverBindings = {
        params: '<pipParams'
    }

    class PopoverController implements IPopoverBindings, ng.IController {
        private backdropElement;
        private content;
        public params: any;

        constructor(
            private $scope: ng.IScope,
            $rootScope: ng.IRootScopeService,
            $element: JQuery,
            private $timeout: ng.ITimeoutService,
            private $compile: ng.ICompileService,
            private $templateRequest: ng.ITemplateRequestService
        ) {
            this.backdropElement = $('.pip-popover-backdrop');
            this.backdropElement.on('click keydown scroll', () => {
                this.backdropClick();
            });
            this.backdropElement.addClass(this.params.responsive !== false ? 'pip-responsive' : '');

            $timeout(() => {
                this.position();
                angular.extend($scope, this.params.locals);

                if (this.params.template) {
                    this.content = $compile(this.params.template)($scope);
                    $element.find('.pip-popover').append(this.content);

                    this.init();
                } else {
                    this.$templateRequest(this.params.templateUrl, false).then((html) => {
                        this.content = $compile(html)($scope);
                        $element.find('.pip-popover').append(this.content);

                        this.init();
                    });
                }
            });

            $timeout(() => {
                this.calcHeight();
            }, 200);
            $rootScope.$on('pipPopoverResize', () => {
                this.onResize()
            });
            $(window).resize(() => {
                this.onResize()
            });
        }

        public backdropClick() {
            if (this.params.cancelCallback) {
                this.params.cancelCallback();
            }
            this.closePopover();
        }

        public closePopover() {
            this.backdropElement.removeClass('opened');
            this.$timeout(() => {
                this.backdropElement.remove();
            }, 100);
        }

        public onPopoverClick(event) {
            event.stopPropagation();
        }

        private init() {
            this.backdropElement.addClass('opened');
            $('.pip-popover-backdrop').focus();
            if (this.params.timeout) {
                this.$timeout(function () {
                    this.closePopover();
                }, this.params.timeout);
            }
        }

        private position() {
            if (this.params.element) {
                let element = $(this.params.element),
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
            if (this.params.calcHeight === false) {
                return;
            }
            const popover = this.backdropElement.find('.pip-popover'),
                title = popover.find('.pip-title'),
                footer = popover.find('.pip-footer'),
                content = popover.find('.pip-content'),
                contentHeight = popover.height() - title.outerHeight(true) - footer.outerHeight(true);
            content.css('max-height', Math.max(contentHeight, 0) + 'px').css('box-sizing', 'border-box');
        }
    }

    const Popover: ng.IComponentOptions = {
        bindings: PopoverBindings,
        templateUrl: 'popover/Popover.html',
        controller: PopoverController
    }

    angular
        .module('pipPopover', ['pipPopover.Service'])
        .component('pipPopover', Popover);
}