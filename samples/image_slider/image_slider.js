(function (angular) {
    'use strict';

    var thisModule = angular.module('appBasicControls.ImageSlider', []);

    thisModule.controller('ImageSliderController',
        function ($scope) {

            $scope.images = [{url: 'https://i.ytimg.com/vi/mW3S0u8bj58/maxresdefault.jpg'},
                {url: 'https://www.catboxkingdom.com/wp-content/uploads/2014/06/Cute-Cats-cats-33440930-1280-800.jpg'},
                {url: 'http://purrfectcatbreeds.com/wp-content/uploads/2014/06/bengal1.jpg'}];

            $scope.images2 = [{url: 'http://goldenstateservicedogs.com/wp-content/uploads/2015/04/c50bdb2e-95bc-4423-862f-83e949001fbf.jpg'}, // eslint-disable-line
                {url: 'https://www.catboxkingdom.com/wp-content/uploads/2014/06/Cute-Cats-cats-33440930-1280-800.jpg'},
                {url: 'https://s.graphiq.com/sites/default/files/stories/t4/15_Tiniest_Dog_Breeds_1718_3083.jpg'}];
        }
    );

})(window.angular);
