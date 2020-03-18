{
    function translateFilter($injector: ng.auto.IInjectorService) {
        "ngInject";
        const pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;

        return function (key: string) {
            return pipTranslate ? pipTranslate['translate'](key) || key : key;
        }
    }

    angular
        .module('pipControls.Translate', [])
        .filter('translate', translateFilter);
}
