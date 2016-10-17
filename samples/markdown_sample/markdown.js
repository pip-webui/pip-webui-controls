(function (angular) {
    'use strict';

    var thisModule = angular.module('appControls.Markdown', []);
/*
    thisModule.config(function (pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            COMMON: 'Common',
            EXAMPLES_LIMITED_LINES: 'Examples with limited line counts',
            IN: 'in',
            INTERACTIVE: 'Interactive',
            CHANGE_TEXT: 'Change text of item',
            LINES: 'lines',
            LINE: 'line',
            SAMPLE_WITH_ATTACHMENTS: 'Example with attachment:',
            SAMPLE_CAPITAL: 'Sample'
        });
        pipTranslateProvider.translations('ru', {
            COMMON: 'Общий',
            EXAMPLES_LIMITED_LINES: 'Примеры с ограниченным количеством строк',
            IN: 'в',
            INTERACTIVE: 'Интерактивный',
            CHANGE_TEXT: 'Изменить текст элемента',
            LINES: 'линий',
            LINE: 'линия',
            SAMPLE_WITH_ATTACHMENTS: 'Пример с вложением:',
            SAMPLE_CAPITAL: 'Пример'
        });
    });
*/
    thisModule.controller('MarkdownController',
        function ($scope, $timeout) { //pipAppBar, 
            /* eslint-disable max-len*/

            $timeout(function() {
                $('pre code').each(function(i, block) {
                    Prism.highlightElement(block);
                });
            });
            
            $scope.data = {
                text: '# h1 header \n## h2 header \n### h3 header\n#### h4 header \n**strong** \nColumn1 | Column2 | 3 | 6 | 7\n---|---\nValue1 | Value2 | Yes | 5 | Loooooooong Value\n' +
            '\n*Italic* \n_italic_\n__strong__ \n* no spaces before \n * one space before \n   * three spaces before \n * one space before \n* no spaces before' +
                '\n\n       function () {\n            six or more spaces before for code text\n       }\n\n> a \n> b \n> c',
                text2: 'some text \n*Italic looooooooooooooooooooooooong string* \n**strong striiiiiiiiiiiiiiiiiiing**\n_italic string 2_\n some text'
            };

            $scope.data2 = {
                content: [
                    {type: 'text', text: ''},
                    {type: 'checklist'},
                    {type: 'pictures'},
                    {type: 'documents'},
                    {type: 'location'},
                    {type: 'time'}
                ]
            };

            $scope.item = {
                title: 'title',
                parent: 'parent name',
                time: 'time',
                text: 'Enthusiastically visualize virtual process improvements with dynamic strategic theme areas. Energistically benchmark interactive niche markets whereas global intellectual capital. Seamlessly visualize best-of-breed opportunities whereas client-centric applications. Uniquely target scalable channels after functional meta-services. Intrinsicly innovate resource sucking infrastructures rather than prospective innovation.Synergistically utilize reliable leadership via error-free.'
            };

            $scope.item2 = {
                title: 'title2',
                time: 'time2',
                text: '# Enthusiastically visualize virtual \n process improvements with dynamic strategic theme areas. Energistically benchmark interactive niche markets whereas global intellectual capital. Seamlessly visualize best-of-breed opportunities whereas client-centric applications. Uniquely target scalable channels after functional meta-services. Intrinsicly innovate resource sucking infrastructures rather than prospective innovation. Synergistically utilize reliable leadership via error-free.'
            };

            $scope.item3 = {
                title: 'Dynamically synergize bricks-and-clicks solutions for equity invested platforms. Objectively promote accurate "outside the box" thinking without bleeding-edge deliverables. Dramatically iterate fully researched applications rather than economically sound initiatives. Dramatically.',
                time: 'time3',
                text: '# Enthusiastically visualize virtual \n process improvements with dynamic strategic theme areas. Energistically benchmark interactive niche markets whereas global intellectual capital. Seamlessly visualize best-of-breed opportunities whereas client-centric applications. Uniquely target scalable channels after functional meta-services. Intrinsicly innovate resource sucking infrastructures rather than prospective innovation. Synergistically utilize reliable leadership via error-free.'
            };
        }
    );

})(window.angular);
