/// <reference path="../../typings/tsd.d.ts" />

class RoutingController {
    private _image: any;

    public logoUrl: string;
    public showProgress: Function;

    constructor( 
        $scope: ng.IScope,
        $element)
    {

        this._image = $element.children('img'); 
        this.showProgress = $scope['showProgress']
        this.logoUrl = $scope['logoUrl'];        
        this.loadProgressImage();

    }

    public loadProgressImage() {
        if (this.logoUrl) {
            this._image.attr('src', this.logoUrl);
        }
    }

}


(() => {

    function RoutingProgress() {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                    showProgress: '&',
                    logoUrl: '@'
                },
            templateUrl: 'progress/routing_progress.html',
            controller: RoutingController,
            controllerAs: 'vm'
        };
    }


    angular
        .module('pipRoutingProgress', ['ngMaterial'])
        .directive('pipRoutingProgress', RoutingProgress);

})();
