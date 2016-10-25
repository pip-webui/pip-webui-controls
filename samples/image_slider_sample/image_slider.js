(function (angular) {
    'use strict';

    var thisModule = angular.module('appControls.ImageSlider', []);

    thisModule.controller('ImageSliderController',
        function ($scope,  $timeout, $injector) { //pipAppBar,

            var pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;

            if (pipTranslate) {
                pipTranslate.setTranslations('en', {
                    'FADING': 'Fading',
                    'CAROUSEL': 'Carousel',
                    'PREV_NEXT_BUTTONS': 'Previous and next slider buttons',
                    'SLIDER_INDICATORS': 'Image slider indicators',
                    'SAMPLE': 'Sample',
                    CODE: 'Code'                    
                });
                pipTranslate.setTranslations('ru', {
                    'FADING': 'Затухание',
                    'CAROUSEL': 'Карусель',
                    'PREV_NEXT_BUTTONS': 'Кнопки для смены изображения вперед и назад',
                    'SLIDER_INDICATORS': 'Индикаторы слайдера изображений',
                    'SAMPLE': 'Пример',
                    CODE: 'Пример кода'                    
                });
                $scope.fading = pipTranslate.translate('FADING');
                $scope.carousel = pipTranslate.translate('CAROUSEL');
                $scope.controlButton = pipTranslate.translate('PREV_NEXT_BUTTONS');
                $scope.indicator = pipTranslate.translate('SLIDER_INDICATORS');
                $scope.sample = pipTranslate.translate('SAMPLE');
                $scope.code = pipTranslate.translate('CODE');
            } else {
                $scope.fading = 'Fading';
                $scope.carousel = 'Carousel';
                $scope.controlButton = 'Previous and next slider buttons';
                $scope.indicator = 'Image slider indicators';
                $scope.sample = 'Sample';
                $scope.code = 'Code';
            }

            $timeout(function() {
                $('pre code').each(function(i, block) {
                    Prism.highlightElement(block);
                });
            });

            $scope.images = [{url: 'https://static.pexels.com/photos/46082/pexels-photo-46082-large.jpeg'},
                {url: 'https://static.pexels.com/photos/65125/pexels-photo-65125-large.jpeg'},
                {url: 'https://static.pexels.com/photos/58951/pexels-photo-58951-large.jpeg'}];

            $scope.images2 = [{url: 'https://static.pexels.com/photos/160223/pexels-photo-160223-large.jpeg'}, // eslint-disable-line
                {url: 'https://static.pexels.com/photos/109016/pexels-photo-109016-large.jpeg'},
                {url: 'https://static.pexels.com/photos/110575/pexels-photo-110575-large.jpeg'}];
        }
    );

})(window.angular);
