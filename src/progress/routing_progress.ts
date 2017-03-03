/// <reference path="../../typings/tsd.d.ts" />

class RoutingController {
    private _image: any;
    private _$element;

    public logoUrl: string;
    public showProgress: Function;

    constructor( 
        $scope: ng.IScope,
        $element)
    {

        this._$element = $element;
        this.showProgress = $scope['vm']['showProgress'];
        this.logoUrl = $scope['vm']['logoUrl'];    
    }

    public $postLink() {
        this._image = this._$element.find('img'); 
        this.loadProgressImage();
    }

    public loadProgressImage() {
        if (this.logoUrl) {
            this._image.attr('src', this.logoUrl);
        }
    }
}


(() => {

    const RoutingProgress = {
            replace: true,
            bindings: {
                showProgress: '&',
                logoUrl: '@'
            },
            templateUrl: 'progress/routing_progress.html',
            controller: RoutingController,
            controllerAs: 'vm'
    }


    angular
        .module('pipRoutingProgress', ['ngMaterial'])
        .component('pipRoutingProgress', RoutingProgress);

})();
