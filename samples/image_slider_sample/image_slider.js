(function (angular) {
    'use strict';

    var thisModule = angular.module('appControls.ImageSlider', []);

    thisModule.config(function (pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            'FADING': 'Fading',
            'CAROUSEL': 'Carousel',
            'PREV_NEXT_BUTTONS': 'Previous and next slider buttons',
            'SLIDER_INDICATORS': 'Image slider indicators'
        });
        pipTranslateProvider.translations('ru', {
            'FADING': 'Затухание',
            'CAROUSEL': 'Карусель',
            'PREV_NEXT_BUTTONS': 'Кнопки для смены изображения вперед и назад',
            'SLIDER_INDICATORS': 'Индикаторы слайдера изображений'
        });
    });

    thisModule.controller('ImageSliderController',
        function ($scope, pipAppBar, $timeout) {

            $timeout(function() {
                $('pre code').each(function(i, block) {
                    Prism.highlightElement(block);
                });
            });
            
            pipAppBar.showMenuNavIcon();
            pipAppBar.showLanguage();
            pipAppBar.showTitleText('CONTROLS');

            $scope.images = [{url: 'https://i.ytimg.com/vi/mW3S0u8bj58/maxresdefault.jpg'},
                {url: 'https://www.catboxkingdom.com/wp-content/uploads/2014/06/Cute-Cats-cats-33440930-1280-800.jpg'},
                {url: 'http://purrfectcatbreeds.com/wp-content/uploads/2014/06/bengal1.jpg'}];

            $scope.images2 = [{url: 'http://goldenstateservicedogs.com/wp-content/uploads/2015/04/c50bdb2e-95bc-4423-862f-83e949001fbf.jpg'}, // eslint-disable-line
                {url: 'https://www.catboxkingdom.com/wp-content/uploads/2014/06/Cute-Cats-cats-33440930-1280-800.jpg'},
                {url: 'https://s.graphiq.com/sites/default/files/stories/t4/15_Tiniest_Dog_Breeds_1718_3083.jpg'}];
        }
    );

})(window.angular);
