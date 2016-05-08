/**
 * @file Routing progress control
 * @description 
 * This progress control is enabled by ui router 
 * while switching between pages
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global _, angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipRoutingProgress", ['ngMaterial']);

    thisModule.directive('pipRoutingProgress', function() {
       return {
           restrict: 'EA',
           replace: true,
           templateUrl: 'progress/routing_progress.html'
       };
    });
   
})();