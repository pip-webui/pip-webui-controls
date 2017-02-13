export interface IColorPicker {
    class: string;
    colors: string[];
    currentColor: string;
    currentColorIndex: number;
    ngDisabled: Function;
    colorChange: Function;

    enterSpacePress(event): void;
    disabled(): boolean;
    selectColor(index: number);
}

export class ColorPickerController implements IColorPicker {
  
    private _$timeout;
    private _$scope: ng.IScope;

    public class: string;
    public colors: string[];
    public currentColor: string;
    public currentColorIndex: number;
    public ngDisabled: Function;
    public colorChange: Function;

    constructor( 
        $scope: ng.IScope, 
        $element,
        $attrs, 
        $timeout ) {
            let DEFAULT_COLORS = ['purple', 'lightgreen', 'green', 'darkred', 'pink', 'yellow', 'cyan'];
            this._$timeout = $timeout;
            this._$scope = $scope;

            this.class = $attrs.class || '';
            this.colors = !$scope['colors'] || _.isArray($scope['colors']) && $scope['colors'].length === 0 ? DEFAULT_COLORS : $scope['colors'];
            this.colorChange = $scope['colorChange'] || null;
            this.currentColor = $scope['currentColor'] || this.colors[0];
            this.currentColorIndex = this.colors.indexOf(this.currentColor);
            this.ngDisabled = $scope['ngDisabled'];

    }

    public disabled(): boolean {
        if (this.ngDisabled) {
            return this.ngDisabled();
        }

        return true;
    };

     public selectColor(index: number) {
        if (this.disabled()) { return; }
        this.currentColorIndex = index;
        this.currentColor = this.colors[this.currentColorIndex];
        this._$timeout(() => {
            this._$scope.$apply();
        });

        if (this.colorChange) {
            this.colorChange();
        }
    };

    public enterSpacePress(event): void {
        this.selectColor(event.index);
    };

}

(() => {
    function pipColorPicker($parse: any) {
        "ngInject";

          return {
                restrict: 'EA',
                scope: {
                    ngDisabled: '&',
                    colors: '=pipColors',
                    currentColor: '=ngModel',
                    colorChange: '&ngChange'
                },
                templateUrl: 'color_picker/color_picker.html',
                controller: ColorPickerController,
                controllerAs: 'vm'
            };
    }


    angular
        .module('pipColorPicker', ['pipControls.Templates'])
        .directive('pipColorPicker', pipColorPicker);


})();


/// <reference path="../../typings/tsd.d.ts" />
/*
(function () {
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
        function ($scope, $element, $attrs, $timeout) {
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
        }
    );

})();
*/


//import {FileUploadController} from './upload/FileUploadController';
//import {FileProgressController} from './progress/FileProgressController';
//import {FileUploadService} from './service/FileUploadService';