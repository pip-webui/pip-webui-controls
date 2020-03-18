{
    interface IRoutingBindings {
        [key: string]: any;

        logoUrl: any;
        showProgress: any;
    }

    const RoutingBindings: IRoutingBindings = {
        showProgress: '&',
        logoUrl: '@'
    }

    class RoutingController implements ng.IController, IRoutingBindings {
        private _image: any;

        public logoUrl: string;
        public showProgress: Function;

        constructor(
            $scope: ng.IScope,
            private $element: JQuery
        ) { "ngInject"; }

        public $postLink() {
            this._image = this.$element.find('img');
            this.loadProgressImage();
        }

        public loadProgressImage() {
            if (this.logoUrl) {
                this._image.attr('src', this.logoUrl);
            }
        }
    }

    const RoutingProgress: ng.IComponentOptions = {
        bindings: RoutingBindings,
        templateUrl: 'progress/RoutingProgress.html',
        controller: RoutingController
    }

    angular
        .module('pipRoutingProgress', ['ngMaterial'])
        .component('pipRoutingProgress', RoutingProgress);
}