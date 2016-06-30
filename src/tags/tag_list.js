/**
 * @file Tag list control
 * @copyright Digital Living Software Corp. 2014-2015
 * @todo
 * - Improve samples in sampler app
 * - What's pipType and pipTypeLocal? Give better name
 * - Do not use ng-if, instead generate template statically
 */

(function (angular) {
    'use strict';

    var thisModule = angular.module('pipTagList', ['pipCore']);

    /**
     * pipTags - set of tags
     * pipType - additional type tag
     * pipTypeLocal - additional translated type tag
     */
    thisModule.directive('pipTagList',
        function ($parse) {
            return {
                restrict: 'EA',
                scope: {
                    pipTags: '=',
                    pipType: '=',
                    pipTypeLocal: '='
                },
                templateUrl: 'tags/tag_list.html',
                controller: function ($scope, $element, $attrs, pipUtils) {
                    var tagsGetter;

                    tagsGetter = $parse($attrs.pipTags);
                    $element.css('display', 'block');
                    // Set tags
                    $scope.tags = tagsGetter($scope);

                    // Also optimization to avoid watch if it is unnecessary
                    if (pipUtils.toBoolean($attrs.pipRebind)) {
                        $scope.$watch(tagsGetter, function (newValue) {
                            $scope.tags = tagsGetter($scope);
                        });
                    }

                    // Add class
                    $element.addClass('pip-tag-list');
                }
            };
        }
    );

})(window.angular);

