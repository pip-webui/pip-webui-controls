/// <reference path="../../typings/tsd.d.ts" />

declare var marked: any;

function Config($injector) {
    const pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;

    if (pipTranslate) {
        pipTranslate.setTranslations('en', {
            'MARKDOWN_ATTACHMENTS': 'Attachments:',
            'checklist': 'Checklist',
            'documents': 'Documents',
            'pictures': 'Pictures',
            'location': 'Location',
            'time': 'Time'
        });
        pipTranslate.setTranslations('ru', {
            'MARKDOWN_ATTACHMENTS': 'Вложения:',
            'checklist': 'Список',
            'documents': 'Документы',
            'pictures': 'Изображения',
            'location': 'Местонахождение',
            'time': 'Время'
        });
    }
}

class MarkdownController {
    private _pipTranslate;
    private _$parse: angular.IParseService;
    private _$scope: angular.IScope;
    private _$injector;
    private _$element;
    private _$attrs;
    private _text;
    private _isList;
    private _clamp;
    private _rebind;

    constructor(
        $scope: angular.IScope,
        $parse: angular.IParseService,
        $attrs,
        $element,
        $injector
    ) {
        this._pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;
        this._$parse = $parse;
        this._$scope = $scope;
        this._$injector = $injector;
        this._$element = $element;
        this._$attrs = $attrs;
        this._text = $scope['$ctrl']['text'];
        this._isList = $scope['$ctrl']['isList'];
        this._clamp = $scope['$ctrl']['clamp'];
        this._rebind = $scope['$ctrl']['rebind'];
    }

    public $postLink() {
        // Fill the text
        this.bindText(this._text);

        this._$scope.$on('pipWindowResized', function () {
            if (this.bindText) this.bindText(this._text(this._$scope));
        });

        // Add class
        this._$element.addClass('pip-markdown');

    }

    public $onChanges(changes: any) {
        const newText = changes['text'].currentValue;

        if (this._rebind) {
            if (this._text !== newText) {
                this._text = newText;
                this.bindText(this._text);
            }
        }
    }

    private describeAttachments(array) {
        var attachString = '',
            attachTypes = [];

        _.each(array, function (attach) {
            if (attach.type && attach.type !== 'text') {
                if (attachString.length === 0 && this._pipTranslate) {
                    attachString = this._pipTranslate.translate('MARKDOWN_ATTACHMENTS');
                }

                if (attachTypes.indexOf(attach.type) < 0) {
                    attachTypes.push(attach.type);
                    attachString += attachTypes.length > 1 ? ', ' : ' ';
                    if (this._pipTranslate)
                        attachString += this._pipTranslate.translate(attach.type);
                }
            }
        });

        return attachString;
    }

    private bindText(value) {
        var textString, isClamped, height, options, obj;

        if (_.isArray(value)) {
            obj = _.find(value, function (item: any) {
                return item.type === 'text' && item.text;
            });

            textString = obj ? obj.text : this.describeAttachments(value);
        } else {
            textString = value;
        }

        isClamped = this._$attrs.pipLineCount && _.isNumber(this._clamp);
        isClamped = isClamped && textString && textString.length > 0;
        options = {
            gfm: true,
            tables: true,
            breaks: true,
            sanitize: true,
            pedantic: true,
            smartLists: true,
            smartypents: false
        };
        textString = marked(textString || '', options);
        if (isClamped) {
            height = 1.5 * this._clamp;
        } 
        // Assign value as HTML
        this._$element.html('<div' + (isClamped ? this._isList ? 'class="pip-markdown-content ' +
            'pip-markdown-list" style="max-height: ' + height + 'em">' :
            ' class="pip-markdown-content" style="max-height: ' + height + 'em">' : this._isList ?
            ' class="pip-markdown-list">' : '>') + textString + '</div>');
        this._$element.find('a').attr('target', 'blank');
        if (!this._isList && isClamped) {
            this._$element.append('<div class="pip-gradient-block"></div>');
        }
    }
}

(function () {
    'use strict';

    const MarkdownComponent = {
        controller: MarkdownController,
        bindings: {
            text: '<pipText',
            isList: '<?pipList',
            clamp: '<?pipLineCount',
            rebind: '<?pipRebind'
        }
    }

    angular.module('pipMarkdown', ['ngSanitize'])
        .run(Config)
        .component('pipMarkdown', MarkdownComponent);
})();