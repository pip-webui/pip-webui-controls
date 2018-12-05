declare var marked: any;

{
  const ConfigTranslations = ($injector: ng.auto.IInjectorService) => {
        const pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;

        if (pipTranslate) {
            (<any>pipTranslate).setTranslations('en', {
                'MARKDOWN_ATTACHMENTS': 'Attachments:',
                'checklist': 'Checklist',
                'documents': 'Documents',
                'pictures': 'Pictures',
                'location': 'Location',
                'time': 'Time'
            });
            (<any>pipTranslate).setTranslations('ru', {
                'MARKDOWN_ATTACHMENTS': 'Вложения:',
                'checklist': 'Список',
                'documents': 'Документы',
                'pictures': 'Изображения',
                'location': 'Местонахождение',
                'time': 'Время'
            });
        }
    }

    interface IMarkdownBindings {
        [key: string]: any;

        text: any;
        isList: any;
        clamp: any;
        rebind: any;
    }

    const MarkdownBindings: IMarkdownBindings = {
        text: '<pipText',
        isList: '<?pipList',
        clamp: '<?pipLineCount',
        rebind: '<?pipRebind'
    }

    class MarkdownChanges implements ng.IOnChangesObject, IMarkdownBindings {
        [key: string]: ng.IChangesObject < any > ;

        text: ng.IChangesObject < string > ;
        isList: ng.IChangesObject < boolean > ;
        clamp: ng.IChangesObject < number | string > ;
        rebind: ng.IChangesObject < boolean > ;
    }

    class MarkdownController implements IMarkdownBindings, ng.IController {
        private _pipTranslate;

        public text: string;
        public isList: boolean;
        public clamp: string | number;
        public rebind: boolean;

        constructor(
            private $scope: angular.IScope,
            private $element: JQuery,
            $injector: ng.auto.IInjectorService
        ) {
            "ngInject";
            this._pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;
        }

        public $postLink() {
            // Fill the text
            this.bindText(this.text);

            this.$scope.$on('pipWindowResized', function () {
                if (this.bindText) this.bindText(this._text(this._$scope));
            });

            // Add class
            this.$element.addClass('pip-markdown');

        }

        public $onChanges(changes: MarkdownChanges) {
            const newText = changes.text.currentValue;

            if (this.rebind) {
                this.text = newText;
                this.bindText(this.text);
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
            let textString, isClamped, height, options, obj;

            if (_.isArray(value)) {
                obj = _.find(value, function (item: any) {
                    return item.type === 'text' && item.text;
                });

                textString = obj ? obj.text : this.describeAttachments(value);
            } else {
                textString = value;
            }

            isClamped = this.clamp && _.isNumber(this.clamp);
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
                height = 1.5 * Number(this.clamp);
            }
            // Assign value as HTML
            this.$element.html('<div' + (isClamped ? this.isList ? 'class="pip-markdown-content ' +
                'pip-markdown-list" style="max-height: ' + height + 'em">' :
                ' class="pip-markdown-content" style="max-height: ' + height + 'em">' : this.isList ?
                ' class="pip-markdown-list">' : '>') + textString + '</div>');
            this.$element.find('a').attr('target', 'blank');
            if (!this.isList && isClamped) {
                this.$element.append('<div class="pip-gradient-block"></div>');
            }
        }
    }
    const MarkdownComponent = {
        controller: MarkdownController,
        bindings: MarkdownBindings
    }

    angular
        .module('pipMarkdown', ['ngSanitize'])
        .run(ConfigTranslations)
        .component('pipMarkdown', MarkdownComponent);
}