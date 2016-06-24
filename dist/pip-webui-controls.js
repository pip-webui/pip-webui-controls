(function(module) {
try {
  module = angular.module('pipBasicControls.Templates');
} catch (e) {
  module = angular.module('pipBasicControls.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('color_picker/color_picker.html',
    '<ul class="pip-color-picker lp0 {{class}}" pip-selected="currentColorIndex" pip-enter-space-press="enterSpacePress($event)">\n' +
    '    <li tabindex="-1" ng-repeat="color in colors track by color">\n' +
    '        <md-button  tabindex="-1" class="md-icon-button pip-selectable" ng-click="selectColor($index)" aria-label="color" ng-disabled="disabled()">\n' +
    '            <md-icon ng-style="{\'color\': color}" md-svg-icon="icons:{{ color == currentColor ? \'circle\' : \'radio-off\' }}">\n' +
    '            </md-icon>\n' +
    '        </md-button>\n' +
    '    </li>\n' +
    '</ul>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('pipBasicControls.Templates');
} catch (e) {
  module = angular.module('pipBasicControls.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('confirmation_dialog/confirmation_dialog.html',
    '<!--\n' +
    '@file Confirmation dialog template\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '\n' +
    '<md-dialog class="pip-dialog pip-confirmation-dialog" layout="column" width="400" md-theme="{{::theme}}">\n' +
    '    <div class="pip-header text-subhead1">\n' +
    '        <h3 class="m0">{{:: title | translate }}</h3>\n' +
    '    </div>\n' +
    '    <div class="pip-footer">\n' +
    '        <div>\n' +
    '            <md-button ng-click="onCancel()">{{:: cancel | translate }}</md-button>\n' +
    '            <md-button class="md-accent" ng-click="onOk()">{{:: ok | translate }}</md-button>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</md-dialog>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('pipBasicControls.Templates');
} catch (e) {
  module = angular.module('pipBasicControls.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('conversion_dialog/conversion_dialog.html',
    '<!--\n' +
    '@file Conversion dialog content\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '\n' +
    '<md-dialog class="pip-dialog pip-conversion-dialog" layout="column" min-width="450" md-theme="{{theme}}">\n' +
    '    <md-dialog-content class="pip-body p0 pip-scroll">\n' +
    '        <div class="pip-header" ng-if="!withoutTitle || deleted" ng-class="{\'header-hint\': withoutTitle && deleted}">\n' +
    '            <h3 class="m0 text-title" ng-hide="withoutTitle">\n' +
    '                {{::title | translate}}\n' +
    '            </h3>\n' +
    '            <p class="tp8 pip-subtitle" ng-hide="withoutTitle">\n' +
    '                <span pip-translate-html="{{::subtitle | translate}}"/>\n' +
    '            </p>\n' +
    '            <div ng-show="withoutTitle && deleted" class="dialog-hint" layout="row" layout-align="start center">\n' +
    '                <div class="w40" flex-fixed><md-icon md-svg-icon="icons:info-circle-outline"></md-icon></div>\n' +
    '                <div>{{::withoutTitle | translate}}</div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div class="pip-divider"  ng-if="!withoutTitle"></div>\n' +
    '        <div class="h8"  ng-if="withoutTitle"></div>\n' +
    '        <div class="pip-content">\n' +
    '            <div class="pip-list md-primary" md-no-ink="true" ng-keydown="onKeyDown($event)"\n' +
    '                            ng-keypress="onKeyPress($event)" tabindex="0">\n' +
    '                <div ng-repeat="option in options" class="pip-list-item" md-ink-ripple\n' +
    '                     ui-event="{ click: \'onOptionSelect($event, option)\' }"\n' +
    '                     ng-class="{ selected: option.name == selectedOptionName,\n' +
    '                            \'divider-bottom\': $index < options.length - 1 }">\n' +
    '\n' +
    '                        <div class="pip-content lp24-flex rp24-flex" flex>\n' +
    '                            <div class="pip-title" ng-if="option.title">\n' +
    '                                {{::option.title | translate}}\n' +
    '                            </div>\n' +
    '                            <div class="pip-subtitle" ng-if="option.subtitle">\n' +
    '                                <span pip-translate-html="{{::option.subtitle | translate}}"/>\n' +
    '                            </div>\n' +
    '                            <div class="pip-text" ng-if="option.text">\n' +
    '                                <span pip-translate-html="{{::option.text | translate}}"/>\n' +
    '                            </div>\n' +
    '                        </div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div class="h8"></div>\n' +
    '    </md-dialog-content>\n' +
    '</md-dialog>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipBasicControls.Templates');
} catch (e) {
  module = angular.module('pipBasicControls.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('date/date.html',
    '<!--\n' +
    '@file Date control content\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '\n' +
    '<div class="pip-date" tabindex="-1" layout="row" flex>\n' +
    '	<md-input-container flex class="tm0">\n' +
    '		<md-select class="pip-date-day tm0" ng-disabled="disableControls"\n' +
    '				   ng-model="day" placeholder="{{dayLabel}}" ng-change="onDayChanged()" flex>\n' +
    '			<md-option ng-value="opt" ng-repeat="opt in days track by opt">{{:: opt }}</md-option>\n' +
    '		</md-select>\n' +
    '	</md-input-container>\n' +
    '	<div class="w16 flex-fixed"></div>\n' +
    '	<md-input-container flex class="tm0">\n' +
    '		<md-select class="pip-date-month tm0" ng-disabled="disableControls"\n' +
    '				   ng-model="month" placeholder="{{monthLabel}}" ng-change="onMonthChanged()" flex>\n' +
    '			<md-option ng-value="opt.id" ng-repeat="opt in months track by opt.id">{{:: opt.name }}</md-option>\n' +
    '		</md-select>\n' +
    '	</md-input-container>\n' +
    '	<div class="w16 flex-fixed"></div>\n' +
    '	<md-input-container flex class="tm0">\n' +
    '		<md-select class="pip-date-year tm0" ng-disabled="disableControls"\n' +
    '				   ng-model="year" placeholder="{{yearLabel}}" ng-change="onYearChanged()" flex>\n' +
    '			<md-option ng-value="opt" ng-repeat="opt in years track by opt">{{:: opt }}</md-option>\n' +
    '		</md-select>\n' +
    '	</md-input-container>\n' +
    '</div>\n' +
    '					');
}]);
})();

(function(module) {
try {
  module = angular.module('pipBasicControls.Templates');
} catch (e) {
  module = angular.module('pipBasicControls.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('date_range/date_range.html',
    '<!--\n' +
    '@file Date range control content\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '\n' +
    '<div class="pip-date-range" tabindex="-1" layout="row" flex>\n' +
    '    <md-input-container flex ng-show="isDay()" class="tm0 pip-day"\n' +
    '            ng-class="{\'flex-fixed\' : $mdMedia(\'gt-xs\')}">\n' +
    '        <md-select class="select-day w-stretch"\n' +
    '                   ng-class="{\'pip-no-line\' : pipNoLine}"\n' +
    '                   ng-disable="{{disableControls}}"\n' +
    '                   md-on-open="onDayClick()"\n' +
    '                   ng-model="day"\n' +
    '                   ng-change="onDayChanged()"\n' +
    '                   placeholder="{{dayLabel}}"\n' +
    '                   aria-label="DAY">\n' +
    '\n' +
    '            <md-option ng-value="opt" ng-repeat="opt in days track by opt ">\n' +
    '               {{nameDays[$index]}} {{ opt }}\n' +
    '            </md-option>\n' +
    '        </md-select>\n' +
    '    </md-input-container>\n' +
    '    <md-input-container flex ng-show="isWeek()" class="tm0"\n' +
    '                        ng-class="{\'flex-fixed\' : $mdMedia(\'gt-xs\')}">\n' +
    '        <md-select class="select-week w-stretch"\n' +
    '                   ng-class="{\'pip-no-line\' : pipNoLine}"\n' +
    '                   ng-disable="{{disableControls}}"\n' +
    '                   ng-model="week"\n' +
    '                   ng-change="onWeekChange()"\n' +
    '                   placeholder="{{weekLabel}}"\n' +
    '                   aria-label="WEEK">\n' +
    '\n' +
    '            <md-option ng-value="opt.id" ng-repeat="opt in weeks track by opt.id">\n' +
    '                {{ opt.name }}\n' +
    '            </md-option>\n' +
    '        </md-select>\n' +
    '    </md-input-container >\n' +
    '    <div class="flex-fixed"\n' +
    '         ng-class="{\'w16\': $mdMedia(\'gt-xs\'), \'w8\':  $mdMedia(\'xs\')}"\n' +
    '         ng-show="isDay() || isWeek()">\n' +
    '    </div>\n' +
    '    <md-input-container flex ng-show="isMonth() && !monthFormatShort " class="tm0 min-w72"\n' +
    '                        ng-class="{\'flex-fixed\' : $mdMedia(\'gt-xs\')}">\n' +
    '        <md-select class="select-month w-stretch"\n' +
    '                   ng-class="{\'pip-no-line\' : pipNoLine}"\n' +
    '                   ng-disable="{{disableControls}}"\n' +
    '                   md-on-open="onMonthClick()"\n' +
    '                   ng-model="month"\n' +
    '                   ng-change="onMonthChanged()"\n' +
    '                   placeholder="{{monthLabel}}"\n' +
    '                   aria-label="MONTH">\n' +
    '\n' +
    '            <md-option ng-value="opt.id" ng-repeat="opt in months track by opt.id">\n' +
    '                {{ opt.name }}\n' +
    '            </md-option>\n' +
    '        </md-select>\n' +
    '    </md-input-container>\n' +
    '    <md-input-container flex ng-show="isMonth() && monthFormatShort" class="tm0"\n' +
    '                        ng-class="{\'flex-fixed\' : $mdMedia(\'gt-xs\')}">\n' +
    '        <md-select class="select-month w-stretch"\n' +
    '                   ng-class="{\'pip-no-line\' : pipNoLine}"\n' +
    '                   ng-disable="{{disableControls}}"\n' +
    '                   md-on-open="onMonthClick()"\n' +
    '                   ng-model="month"\n' +
    '                   ng-change="onMonthChanged()"\n' +
    '                   placeholder="{{monthLabel}}"\n' +
    '                   aria-label="MONTH">\n' +
    '\n' +
    '            <md-option ng-value="opt.id" ng-repeat="opt in shortMonths track by opt.id">\n' +
    '                {{ opt.name }}\n' +
    '            </md-option>\n' +
    '        </md-select>\n' +
    '    </md-input-container>\n' +
    '    <div class="flex-fixed"\n' +
    '         ng-class="{\'w16\': $mdMedia(\'gt-xs\'), \'w8\':  $mdMedia(\'xs\')}"\n' +
    '         ng-show="isMonth()">\n' +
    '    </div>\n' +
    '    <md-input-container flex class="tm0"\n' +
    '                        ng-class="{\'flex-fixed\' : $mdMedia(\'gt-xs\')}">\n' +
    '        <md-select class="select-year w-stretch"\n' +
    '                   ng-class="{\'pip-no-line\' : pipNoLine}"\n' +
    '                   ng-disable="{{disableControls}}"\n' +
    '                   md-on-open="onYearClick()"\n' +
    '                   ng-model="year"\n' +
    '                   ng-change="onYearChanged()"\n' +
    '                   placeholder="{{yearLabel}}"\n' +
    '                   aria-label="YEAR">\n' +
    '\n' +
    '            <md-option ng-value="opt" ng-repeat="opt in years track by opt">\n' +
    '                {{ opt }}\n' +
    '            </md-option>\n' +
    '        </md-select>\n' +
    '    </md-input-container>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipBasicControls.Templates');
} catch (e) {
  module = angular.module('pipBasicControls.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('error_details_dialog/error_details_dialog.html',
    '<!--\n' +
    '@file Confirmation dialog template\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '\n' +
    '<md-dialog class="pip-dialog pip-details-dialog" layout="column" width="400" md-theme="{{theme}}">\n' +
    '    <div class="pip-body">\n' +
    '\n' +
    '        <div class="pip-header p0 bp8  text-subhead1">{{::\'ERROR_DETAILS\' | translate}}</div>\n' +
    '        <div layout="row" layout-align="start center" class="h48 text-body2 color-secondary-text" ng-if="error.code || (error.data && error.data.code)">\n' +
    '            {{::\'CODE\' | translate}}\n' +
    '        </div>\n' +
    '        <div layout="row" layout-align="start center" ng-if="error.code || (error.data && error.data.code)">\n' +
    '            {{error.code || error.data.code}}\n' +
    '        </div>\n' +
    '\n' +
    '        <div layout="row" layout-align="start center" class="h48 text-body2 color-secondary-text" ng-if="error.path || (error.data && error.data.path)">\n' +
    '            {{::\'PATH\' | translate}}\n' +
    '        </div>\n' +
    '        <div layout="row" layout-align="start center" ng-if="error.path || (error.data && error.data.path)">\n' +
    '            {{error.path || error.data.path}}\n' +
    '        </div>\n' +
    '\n' +
    '        <div layout="row" layout-align="start center" class="h48 text-body2 color-secondary-text" ng-if="error.error || (error.data && error.data.error)">\n' +
    '            {{::\'ERROR\' | translate}}\n' +
    '        </div>\n' +
    '        <div layout="row" layout-align="start center" ng-if="error.error || (error.data && error.data.error)">\n' +
    '            {{error.error || error.data.error}}\n' +
    '        </div>\n' +
    '\n' +
    '        <div layout="row" layout-align="start center" class="h48 text-body2 color-secondary-text" ng-if="error.method || (error.data && error.data.method)">\n' +
    '            {{::\'METHOD\' | translate}}\n' +
    '        </div>\n' +
    '        <div layout="row" layout-align="start center" ng-if="error.method || (error.data && error.data.method)">\n' +
    '            {{error.method || error.data.method}}\n' +
    '        </div>\n' +
    '\n' +
    '        <div layout="row" layout-align="start center" class="h48 text-body2 color-secondary-text" ng-if="error.message || (error.data && error.data.message)">\n' +
    '            {{::\'MESSAGE\' | translate}}\n' +
    '        </div>\n' +
    '        <div layout="row" layout-align="start center" ng-if="error.message || (error.data && error.data.message)">\n' +
    '            {{error.message || error.data.message}}\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div class="pip-footer rp16">\n' +
    '        <div>\n' +
    '            <md-button class="md-accent m0" ng-click="onOk()">{{::\'DISMISS\' | translate }}</md-button>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</md-dialog>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('pipBasicControls.Templates');
} catch (e) {
  module = angular.module('pipBasicControls.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('information_dialog/information_dialog.html',
    '<!--\n' +
    '@file Information dialog content\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '\n' +
    '<md-dialog class="pip-dialog pip-information-dialog" layout="column" width="400" md-theme="{{theme}}">\n' +
    '    <div class="pip-header">\n' +
    '        <h3 class="m0">{{ title | translate }}</h3>\n' +
    '    </div>\n' +
    '    <div class="pip-body">\n' +
    '        <div class="pip-content">\n' +
    '            {{ content }}\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div class="pip-footer">\n' +
    '        <div>\n' +
    '            <md-button class="md-accent" ng-click="onOk()">{{ ok | translate }}</md-button>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</md-dialog>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('pipBasicControls.Templates');
} catch (e) {
  module = angular.module('pipBasicControls.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('popover/popover.template.html',
    '<div ng-if="params.templateUrl" class=\'pip-popover flex layout-column\'\n' +
    '     ng-click="onPopoverClick($event)" ng-include="params.templateUrl">\n' +
    '</div>\n' +
    '\n' +
    '<div ng-if="params.template" class=\'pip-popover\' ng-click="onPopoverClick($event)">\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('pipBasicControls.Templates');
} catch (e) {
  module = angular.module('pipBasicControls.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('options_dialog/options_dialog.html',
    '<!--\n' +
    '@file Options dialog content\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '\n' +
    '<md-dialog class="pip-dialog pip-options-dialog" layout="column" min-width="400" md-theme="{{theme}}">\n' +
    '    <md-dialog-content class="pip-body lp0 tp0 rp0 bp24 pip-scroll">\n' +
    '        <div class="pip-header" >\n' +
    '            <h3 class="m0 bm16 text-title">{{::title | translate}}</h3>\n' +
    '            <div ng-show="deletedTitle" class="bp16 tp8 text-subhead1 divider-bottom">\n' +
    '                <md-checkbox ng-model="deleted" aria-label="CHECKBOX" class="m0">{{::deletedTitle | translate}}</md-checkbox>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div class="pip-content">\n' +
    '            <md-radio-group ng-model="selectedOptionName" class="pip-list md-primary" md-no-ink="true"\n' +
    '                            ng-keypress="onKeyPress($event)" tabindex="0">\n' +
    '                <div ng-repeat="option in options" class="pip-list-item p0" md-ink-ripple\n' +
    '                     ui-event="{ click: \'onOptionSelect($event, option)\' }"\n' +
    '                     ng-class="{ selected: option.name == selectedOptionName }">\n' +
    '                    <div class="pip-list-item">\n' +
    '                        <md-icon class="pip-option-icon rm12" md-svg-icon="icons:{{option.icon}}" ng-if="option.icon">\n' +
    '                        </md-icon>\n' +
    '                        <div class="pip-option-title">\n' +
    '                            {{::option.title | translate}}\n' +
    '                        </div>\n' +
    '                        <md-radio-button ng-value="option.name" tabindex="-1"\n' +
    '                                         aria-label="{{::option.title | translate}}">\n' +
    '                        </md-radio-button>\n' +
    '                    </div>\n' +
    '\n' +
    '                </div>\n' +
    '            </md-radio-group>\n' +
    '        </div>\n' +
    '    </md-dialog-content>\n' +
    '    <div class="pip-footer">\n' +
    '        <div>\n' +
    '            <md-button class="pip-cancel" ng-click="onCancel()">{{::\'CANCEL\' | translate}}</md-button>\n' +
    '            <md-button class="pip-submit md-accent" ng-click="onSelect()">{{::applyButtonTitle | translate}}</md-button>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</md-dialog>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('pipBasicControls.Templates');
} catch (e) {
  module = angular.module('pipBasicControls.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('options_dialog/options_dialog_big.html',
    '<!--\n' +
    '@file Options dialog content\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '\n' +
    '<md-dialog class="pip-dialog pip-options-dialog-big" layout="column" min-width="400" md-theme="{{theme}}">\n' +
    '    <md-dialog-content class="pip-body p0 pip-scroll" ng-class="{\'bp24\': !noActions}">\n' +
    '        <div class="pip-header" ng-class="{\'header-hint\': noTitle && hint}">\n' +
    '            <h3 class="m0 text-title"  ng-if="!noTitle">\n' +
    '                {{::title | translate}}\n' +
    '            </h3>\n' +
    '            <div ng-show="noTitle && hint" class="dialog-hint" layout="row" layout-align="start center">\n' +
    '                <div class="w40" flex-fixed><md-icon md-svg-icon="icons:info-circle-outline"></md-icon></div>\n' +
    '                <div>{{::hint | translate}}</div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div class="pip-divider"  ng-if="!noTitle"></div>\n' +
    '        <div class="pip-content">\n' +
    '            <div class="h8" ng-if="noTitle && hint"></div>\n' +
    '            <md-list class="pip-menu  pip-ref-list w-stretch"\n' +
    '                     pip-selected="optionIndex" index="{{optionIndex }}"\n' +
    '                     pip-select="onSelected($event)">\n' +
    '\n' +
    '                <md-list-item class="pip-ref-list-item pip-selectable"\n' +
    '                              ng-class="{\'selected\' : option.name == selectedOptionName,\n' +
    '                              \'divider-bottom\': $index != options.length - 1}"\n' +
    '                              layout="row" layout-align="start center" md-ink-ripple\n' +
    '                              xxxxng-keypress="onKeyPress($event)"\n' +
    '                              ng-keyup="onKeyUp($event, $index)"\n' +
    '                              ng-repeat="option in options" ng-click="onOptionSelect($event, option)">\n' +
    '\n' +
    '                    <div class="pip-content  line-height-string  max-w100-stretch">\n' +
    '                        <p class="pip-title  rp24-flex" ng-if="option.title" style="margin-bottom: 4px !important;">\n' +
    '                            {{::option.title | translate}}\n' +
    '                        </p>\n' +
    '                        <div class="pip-subtitle  rp24-flex"\n' +
    '                             style="height: inherit"\n' +
    '                             ng-if="option.subtitle">\n' +
    '                            {{::option.subtitle | translate}}\n' +
    '                        </div>\n' +
    '                        <div class="pip-subtitle  rp24-flex"\n' +
    '                             style="height: inherit" ng-if="option.text"\n' +
    '                             pip-translate-html="{{::option.text | translate}}">\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '\n' +
    '                </md-list-item>\n' +
    '\n' +
    '            </md-list>\n' +
    '            <!--\n' +
    '            <md-radio-group ng-model="selectedOptionName" class="pip-list md-primary" md-no-ink="true"\n' +
    '                            ng-keypress="onKeyPress($event)" tabindex="0">\n' +
    '                <div ng-repeat="option in options" class="pip-list-item p0" md-ink-ripple\n' +
    '                     ui-event="{ click: \'onOptionSelect($event, option)\' }"\n' +
    '                     ng-class="{ selected: option.name == selectedOptionName }">\n' +
    '                    <div class="pip-list-item">\n' +
    '\n' +
    '                        <div class="pip-content lp24-flex rp24-flex" flex>\n' +
    '                            <div class="pip-title" ng-if="option.title">\n' +
    '                                {{::option.title | translate}}\n' +
    '                            </div>\n' +
    '                            <div class="pip-subtitle" ng-if="option.subtitle">\n' +
    '                                {{::option.subtitle | translate}}\n' +
    '                            </div>\n' +
    '                            <div class="pip-text" ng-if="option.text">\n' +
    '\n' +
    '                                <span pip-translate-html="{{::option.text | translate}}"/>\n' +
    '                            </div>\n' +
    '                        </div>\n' +
    '\n' +
    '                        <md-radio-button ng-value="option.name" tabindex="-1" class="rm24-flex"\n' +
    '                                         aria-label="{{::option.title | translate}}">\n' +
    '                        </md-radio-button>\n' +
    '                    </div>\n' +
    '\n' +
    '                </div>\n' +
    '            </md-radio-group> -->\n' +
    '        </div>\n' +
    '        <div class="h8" ng-if="noActions"></div>\n' +
    '    </md-dialog-content>\n' +
    '\n' +
    '    <div class="pip-footer" ng-if="!noActions">\n' +
    '        <div>\n' +
    '            <md-button class="pip-cancel" ng-click="onCancel()">{{::\'CANCEL\' | translate}}</md-button>\n' +
    '            <md-button class="pip-submit md-accent" ng-click="onSelect()" style="margin-right: -6px">\n' +
    '                {{::applyButtonTitle | translate}}\n' +
    '            </md-button>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</md-dialog>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('pipBasicControls.Templates');
} catch (e) {
  module = angular.module('pipBasicControls.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('progress/routing_progress.html',
    '<div class="pip-routing-progress" layout="column" layout-align="center center" ng-show="$routing || $reset">\n' +
    '    <div class="loader">\n' +
    '        <svg class="circular" viewBox="25 25 50 50">\n' +
    '            <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/>\n' +
    '        </svg>\n' +
    '    </div>\n' +
    '\n' +
    '    <img src="images/Logo_animation.svg"  height="40" width="40" class="pip-img">\n' +
    '\n' +
    '    <md-progress-circular md-diameter="96"\n' +
    '                          class="fix-ie"></md-progress-circular>\n' +
    '\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('pipBasicControls.Templates');
} catch (e) {
  module = angular.module('pipBasicControls.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('tags/tag_list.html',
    '<div class="pip-chip rm4 pip-type-chip pip-type-chip-left {{\'bg-\' + pipType + \'-chips\'}}"\n' +
    '     ng-if="pipType && !pipTypeLocal">\n' +
    '\n' +
    '    <span>{{pipType.toUpperCase() | translate | uppercase}}</span>\n' +
    '</div>\n' +
    '<div class="pip-chip rm4 pip-type-chip pip-type-chip-left {{\'bg-\' + pipType + \'-chips\'}}"\n' +
    '     ng-if="pipType && pipTypeLocal">\n' +
    '\n' +
    '    <span>{{pipTypeLocal.toUpperCase() | translate | uppercase}}</span>\n' +
    '</div>\n' +
    '<div class="pip-chip rm4" ng-repeat="tag in pipTags">\n' +
    '    <span>{{::tag}}</span>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipBasicControls.Templates');
} catch (e) {
  module = angular.module('pipBasicControls.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('time_edit/time_edit.html',
    '<!--\n' +
    '@file Time edit control content\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '\n' +
    '<div layout="row" class="event-edit" layout-xs="column" flex layout-align="start start">\n' +
    '    <div flex="47" class="w-stretch rm24-flex0">\n' +
    '        <p class="text-caption text-grey tm0">{{startLabel}}</p>\n' +
    '\n' +
    '        <div layout="row" layout-align="space-between center">\n' +
    '            <div class="rm16 pip-datepicker-container" flex="49">\n' +
    '                <md-datepicker ng-model="data.startDate"\n' +
    '                               xmd-placeholder="{{startLabel}}"\n' +
    '                               ng-change="onChangeStartDate()"\n' +
    '                               ng-disabled="isDisabled()"\n' +
    '                               aria-label="START-DATE">\n' +
    '                </md-datepicker>\n' +
    '            </div>\n' +
    '            <div flex>\n' +
    '                <md-input-container class="w-stretch tm0">\n' +
    '                    <md-select aria-label="START-TIME" class="tm0 bm0" ng-model="data.startTime" ng-disabled="isDisabled()"\n' +
    '                               ng-change="onChangeStartTime()">\n' +
    '                        <md-option ng-value="opt.id" ng-repeat="opt in intervalTimeCollection track by opt.id">{{ opt.time }}\n' +
    '                        </md-option>\n' +
    '                    </md-select>\n' +
    '                </md-input-container>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div flex="47" class="w-stretch">\n' +
    '        <p class="text-caption text-grey tm0">{{endLabel}}</p>\n' +
    '\n' +
    '        <div layout="row" layout-align="space-between center">\n' +
    '            <div class="rm16 pip-datepicker-container" flex="49">\n' +
    '                <md-datepicker ng-model="data.endDate"\n' +
    '                               xmd-placeholder="{{endLabel}}"\n' +
    '                               ng-disabled="isDisabled()"\n' +
    '                               ng-change="onChangeEndDate()"\n' +
    '                               aria-label="END-DATE">\n' +
    '                </md-datepicker>\n' +
    '            </div>\n' +
    '            <div flex>\n' +
    '                <md-input-container class="w-stretch tm0">\n' +
    '                    <md-select aria-label="END-TIME" class="tm0 bm0" ng-model="data.endTime" ng-change="onChangeEndTime()"\n' +
    '                               ng-disabled="isDisabled()">\n' +
    '                        <md-option ng-value="opt.id" ng-repeat="opt in intervalTimeCollection track by opt.id">{{\n' +
    '                            opt.time }}\n' +
    '                        </md-option>\n' +
    '                    </md-select>\n' +
    '                </md-input-container>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('pipBasicControls.Templates');
} catch (e) {
  module = angular.module('pipBasicControls.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('toast/toast.html',
    '<md-toast class="md-action pip-toast"\n' +
    '          ng-class="{\'pip-error\': toast.type==\'error\',\n' +
    '          \'pip-column-toast\': toast.type == \'error\' || toast.actions.length > 1 || actionLenght > 4,\n' +
    '          \'pip-no-action-toast\': actionLenght == 0}"\n' +
    '          style="height:initial; max-height: initial; ">\n' +
    '\n' +
    '    <span class="flex-var m0 pip-text" ng-bind-html="message"></span>\n' +
    '    <div layout="row" layout-align="end start" class="pip-actions" ng-if="actions.length > 0 || (toast.type==\'error\' && toast.error)">\n' +
    '        <md-button class="flex-fixed m0 lm8" ng-if="toast.type==\'error\' && toast.error" ng-click="onDetails()">Details</md-button>\n' +
    '        <md-button class="flex-fixed m0 lm8"\n' +
    '                   ng-click="onAction(action)"\n' +
    '                   ng-repeat="action in actions"\n' +
    '                   aria-label="{{::action| translate}}">\n' +
    '            {{::action| translate}}\n' +
    '        </md-button>\n' +
    '    </div>\n' +
    '\n' +
    '</md-toast>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipBasicControls.Templates');
} catch (e) {
  module = angular.module('pipBasicControls.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('time_view/time_view.html',
    '<p>\n' +
    '    <span ng-if="data.start != null">{{data.start | formatShortDateTime}}</span>\n' +
    '    <span  class="rm4 lm4" ng-if="data.start && data.end"> - </span>\n' +
    '    <span ng-if="data.end != null">{{data.end | formatShortDateTime}}</span>\n' +
    '</p>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipBasicControls.Templates');
} catch (e) {
  module = angular.module('pipBasicControls.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('toggle_buttons/toggle_buttons.html',
    '<div class="pip-toggle-buttons flex layout-row {{class}}" pip-selected="bufButtonIndex" pip-enter-space-press="enterSpacePress($event)"\n' +
    '     ng-if="$mdMedia(\'gt-xs\')">\n' +
    '    <md-button tabindex="-1" ng-repeat="button in buttons"\n' +
    '               ng-class="{\'md-accent md-raised selected color-accent-bg\' : currentButtonIndex == $index}"\n' +
    '               ng-attr-style="{{ \'background-color:\' + (currentButtonIndex == $index ? button.backgroundColor : \'\') + \'!important\' }}"\n' +
    '               class="pip-selectable pip-chip-button flex" ng-click="buttonSelected($index, $event)"\n' +
    '               ng-disabled="button.disabled || disabled()">\n' +
    '        {{button.name || button.title | translate}}\n' +
    '        <span ng-if="button.checked || button.complete || button.filled" class="pip-tagged">*</span>\n' +
    '    </md-button>\n' +
    '</div>\n' +
    '\n' +
    '<md-input-container class="md-block" ng-if="$mdMedia(\'xs\')">\n' +
    '    <md-select ng-model="currentButtonIndex" ng-disabled="disabled()" aria-label="DROPDOWN" md-on-close="buttonSelected(currentButtonIndex)">\n' +
    '        <md-option ng-repeat="action in buttons" value="{{ ::$index }}">\n' +
    '            {{ (action.title || action.name) | translate }}\n' +
    '            <span ng-if="action.checked || action.complete || action.filled" class="pip-tagged">*</span>\n' +
    '        </md-option>\n' +
    '    </md-select>\n' +
    '</md-input-container>\n' +
    '');
}]);
})();

/**
 * @file Registration of basic WebUI controls
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    angular.module('pipControls', [        
        'pipMarkdown',
        'pipToggleButtons',
        'pipRefreshButton',
        'pipColorPicker',
        'pipRoutingProgress',
        'pipPopover',
        'pipImageSlider',
        'pipToasts',
        "pipTagList",

        'pipDate',
        'pipDateRange',
        'pipTimeEdit',
        'pipTimeView',

        'pipInformationDialog',
        'pipConfirmationDialog',
        'pipOptionsDialog',
        'pipOptionsBigDialog',
        'pipConversionDialog',
        'pipErrorDetailsDialog'
    ]);

    angular.module('pipBasicControls', [ 'pipControls' ]);
    
})();



/**
 * @file Color picker control
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipColorPicker", ['pipUtils', 'pipFocused', 'pipBasicControls.Templates']);

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
        ['$scope', '$element', '$attrs', '$timeout', function ($scope, $element, $attrs, $timeout) {
            var
                DEFAULT_COLORS = ['purple', 'lightgreen', 'green', 'darkred', 'pink', 'yellow', 'cyan'];

            $scope.class = $attrs.class || '';

            if (!$scope.colors || (_.isArray($scope.colors) && $scope.colors.length === 0)) {
                $scope.colors = DEFAULT_COLORS;
            }

            $scope.currentColor = $scope.currentColor || $scope.colors[0];
            $scope.currentColorIndex = $scope.colors.indexOf($scope.currentColor);

            $scope.disabled = function () {
                if ($scope.ngDisabled) {
                    return $scope.ngDisabled();
                } else {
                    return true;
                }
            };

            $scope.selectColor = function (index) {
                if ($scope.disabled()) return;
                $scope.currentColorIndex = index;

                $scope.currentColor = $scope.colors[$scope.currentColorIndex];

                $timeout(function() {
                    $scope.$apply();
                });

                if ($scope.colorChange) {
                    $scope.colorChange();
                }
            }

            $scope.enterSpacePress = function (event) {
                $scope.selectColor(event.index);
            };
    }])

})();
/**
 * @file Confirmation dialog
 * @copyright Digital Living Software Corp. 2014-2016
 * @todo
 * - Improve sample in sampler app
 */
 
/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipConfirmationDialog', 
        ['ngMaterial', 'pipUtils', 'pipTranslate', 'pipBasicControls.Templates']);

    thisModule.config(['pipTranslateProvider', function(pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            'CONFIRM_TITLE': 'Confirm'
        });
        pipTranslateProvider.translations('ru', {
            'CONFIRM_TITLE': 'Подтвердите'
        });
    }]);

    thisModule.factory('pipConfirmationDialog', 
        ['$mdDialog', function ($mdDialog) {
            return {
                show: function (params, successCallback, cancelCallback) {
                    $mdDialog.show({
                        targetEvent: params.event,
                        templateUrl: 'confirmation_dialog/confirmation_dialog.html',
                        controller: 'pipConfirmationDialogController',
                        locals: { params: params },
                        clickOutsideToClose: true
                    })
                    .then(function () {
                        if (successCallback) {
                            successCallback();
                        }
                    }, function () {
                        if (cancelCallback) {
                            cancelCallback();
                        }
                    });
                }
            };
        }]
    );

    thisModule.controller('pipConfirmationDialogController',
        ['$scope', '$rootScope', '$mdDialog', 'pipTranslate', 'params', function ($scope, $rootScope, $mdDialog, pipTranslate, params) {
            $scope.theme = $rootScope.$theme;
            $scope.title = params.title || 'CONFIRM_TITLE';

            $scope.ok = params.ok || 'OK';
            $scope.cancel = params.cancel || 'CANCEL';

            $scope.onCancel = function () {
                $mdDialog.cancel();
            };

            $scope.onOk = function () {
                $mdDialog.hide();
            };
        }]
    );

})();

/**
 * @file Convert parent dialog
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global $, angular */

(function () {
    'use strict';
        
    var thisModule = angular.module('pipConversionDialog',
        ['ngMaterial', 'pipUtils', 'pipTranslate', 'pipBasicControls.Templates']);

    thisModule.config(['pipTranslateProvider', function(pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            'CONVERT_PARENT_TITLE': 'Choose type of the parent record',
            'CONVERT_PARENT_SUBTITLE': 'The <b>%s</b> is missing and will be created from scratch. Find and clarify it later',

            'CONVERT_TO_GOAL_SUBTITLE': 'Result that requires significant efforts',
            'CONVERT_TO_TASK_SUBTITLE': 'Simple work that doesn\'t need a plan',
            'CONVERT_TO_AREA_SUBTITLE': 'Area of interests or actions of any kind',
            'CONVERT_TO_VISION_SUBTITLE': 'Situation in specific time period',
            'CONVERT_TO_CANCEL': 'Do not create a parent record',
            'CONVERT_TO_CANCEL_SUBTITLE': 'The <b>%s</b> is deleted',

            'CONVERT_RECORD_TO_GOAL': 'Result that requires significant efforts',
            'CONVERT_RECORD_TO_TASK': 'Simple work that doesn\'t need a plan',
            'CONVERT_RECORD_TO_EVENT': 'Reminder or scheduled block of time',
            'CONVERT_RECORD_TO_POST': 'Any useful information'
        });
        pipTranslateProvider.translations('ru', {
            'CONVERT_PARENT_TITLE': 'Определите тип родительской записи',
            'CONVERT_PARENT_SUBTITLE': 'Запись <b>%s</b> отсутствует и будет создана с нуля. Найдите и скорректируйте ее позже',

            'CONVERT_TO_GOAL_SUBTITLE': 'Результат требующий значительных усилий',
            'CONVERT_TO_TASK_SUBTITLE': 'Простая работа, для которой не нужен план',
            'CONVERT_TO_AREA_SUBTITLE': 'Область интересов или какой-либо активности',
            'CONVERT_TO_VISION_SUBTITLE': 'Ситуация в определенный промежуток времени',
            'CONVERT_TO_CANCEL': 'Не создавать родительскую запись',
            'CONVERT_TO_CANCEL_SUBTITLE': '<b>%s</b> будет удалена',

            'CONVERT_RECORD_TO_GOAL': 'Результат требующий значительных усилий',
            'CONVERT_RECORD_TO_TASK': 'Простая работа, для которой не нужен план',
            'CONVERT_RECORD_TO_EVENT': 'Напоминание или блок времени в расписании',
            'CONVERT_RECORD_TO_POST': 'Любая полезная информация'
        });
    }]);

    thisModule.factory('pipConversionDialog',
        ['$mdDialog', function ($mdDialog) {
            return {
                show: function (params, successCallback, cancelCallback) {
                    if (params.event) {
                        params.event.stopPropagation();
                        params.event.preventDefault();
                    }
                    if (!params.options || params.options.length == 0) return;

                    function focusToggleControl() {
                        if (params.event && params.event.currentTarget)
                            params.event.currentTarget.focus();
                    }

                    $mdDialog.show({
                        targetEvent: params.event,
                        templateUrl: 'conversion_dialog/conversion_dialog.html',
                        controller: 'pipConversionDialogController',
                        locals: { params: params },
                        clickOutsideToClose: true
                    })
                        .then(function (option) {
                            focusToggleControl();

                            if (successCallback) successCallback(option);
                        }, function () {
                            focusToggleControl();
                            if (cancelCallback) cancelCallback();
                        });
                }
            };
        }]
    );

    thisModule.controller('pipConversionDialogController',
        ['$scope', '$rootScope', '$mdDialog', 'params', 'pipUtils', 'pipTranslate', function ($scope, $rootScope, $mdDialog, params, pipUtils, pipTranslate) {

            $scope.theme = $rootScope.$theme;
            $scope.title = params.title || 'CONVERT_PARENT_TITLE';
            $scope.recordName = params.recordName || '';
            $scope.subtitle = params.subtitle || pipUtils.sprintf(pipTranslate.translate('CONVERT_PARENT_SUBTITLE'), $scope.recordName);
            $scope.withoutTitle = params.deleteTitle ? params.deleteTitle : false;
            $scope.deleted = !!params.deleted;
            $scope.options = _.cloneDeep(params.options);
            $scope.selectedIndex  = -1;
            $scope.cancelConverting = $scope.recordName ? true : false;
            $scope.selectedOptionName = '';

            if ($scope.cancelConverting) $scope.options.push({
                name: 'cancel',
                title: 'CONVERT_TO_CANCEL',
                subtitle: pipUtils.sprintf(pipTranslate.translate('CONVERT_TO_CANCEL_SUBTITLE'), $scope.recordName)
            });

            $scope.onOptionSelect = function (event, option) {
                event.stopPropagation();
                $scope.selectedOptionName = option.name;

                $scope.onSelect();
            };

            $scope.onKeyPress = function(event) {
                if (event.keyCode == 32 || event.keyCode == 13) {
                    event.stopPropagation();
                    event.preventDefault();
                    $scope.selectedOptionName = $scope.selectedIndex == -1 ? $scope.options[0].name : $scope.options[$scope.selectedIndex].name;
                    $scope.onSelect();
                    return ;
                }
            };

            $scope.onKeyDown = function(event) {
                if (event.keyCode == 40) {
                    event.stopPropagation();
                    event.preventDefault();
                    $scope.selectedIndex += 1;
                    $scope.selectedIndex = $scope.selectedIndex % $scope.options.length;
                    $scope.selectedOptionName = $scope.options[$scope.selectedIndex].name;
                    return ;
                }
                if (event.keyCode == 38) {
                    event.stopPropagation();
                    event.preventDefault();
                    $scope.selectedIndex = $scope.selectedIndex <= 0 ? $scope.selectedIndex = $scope.options.length - 1 : $scope.selectedIndex - 1;
                    $scope.selectedOptionName = $scope.options[$scope.selectedIndex].name;
                    return ;
                }
            };

            $scope.onCancel = function () {
                $mdDialog.cancel();
            };

            $scope.onSelect = function () {
                var option = _.find($scope.options, {name: $scope.selectedOptionName});

                if (option && option.name != 'cancel') $mdDialog.hide({ option: option, deleted: $scope.deleted });
                else $mdDialog.hide(null);
            };

            // Setting focus to input control
            function focusInput() {
                var list = $('.pip-conversion-dialog .pip-list');
                list.focus();
            };
            setTimeout(focusInput, 500);

        }]
    );

})();

/**
 * @file Date control
 * @copyright Digital Living Software Corp. 2014-2016
 * @todo
 * - Improve samples int sampler app
 * - Optimize. It is way to slow on samples
 */
 
 /* global angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipDate", ['pipBasicControls.Templates']);

    thisModule.directive('pipDate',
        ['$parse', function ($parse) {
            return {
                restrict: 'EA',
                require: 'ngModel',
                scope: {
                    timeMode: '@pipTimeMode',
                    disabled: '&ngDisabled',
                    model: '=ngModel',
                    ngChange: '&'
                },
                templateUrl: 'date/date.html',
                controller: 'pipDateController'
            }
        }]
    );

    thisModule.controller('pipDateController',
        ['$scope', '$element', 'pipTranslate', function ($scope, $element, pipTranslate) {

            function dayList(month, year) {
                var count = 31;

                if (month == 4 || month == 6 || month == 9 || month == 11) {
                    count = 30;
                } else if (month == 2) {
                    if (year)
                    // Calculate leap year (primitive)
                        count = year % 4 == 0 ? 29 : 28;
                    else count = 28;
                }

                var days = [];
                for (var i = 1; i <= count; i++) {
                    days.push(i);
                }

                return days;
            };

            function monthList() {
                var months = [];

                for (var i = 1; i <= 12; i++) {
                    months.push({
                        id: i,
                        name: pipTranslate.translate('MONTH_' + i)
                    })
                }

                return months;
            };

            function yearList() {
                var
                    currentYear = new Date().getFullYear(),
                    startYear = $scope.timeMode == 'future' ? currentYear : currentYear - 100,
                    endYear = $scope.timeMode == 'past' ? currentYear : currentYear + 100,
                    years = [];

                if ($scope.timeMode == 'past') {
                    for (var i = endYear; i >= startYear; i--) {
                        years.push(i);
                    }
                } else {
                    for (var i = startYear; i <= endYear; i++) {
                        years.push(i);
                    }
                }

                return years;
            };

            function adjustDay() {
                var days = dayList($scope.month, $scope.year);

                if ($scope.days.length != days.length) {
                    if ($scope.day > days.length) {
                        $scope.day = days.length;
                    }

                    $scope.days = days;
                }
            };

            function getValue(value) {
                value = value ? (_.isDate(value) ? value : new Date(value)) : null;

                // Define values
                var day = value ? value.getDate() : null;
                var month = value ? value.getMonth() + 1 : null;
                var year = value ? value.getFullYear() : null;

                // Update day list if month and year were changed
                if ($scope.month != month
                    && $scope.year != year) {
                    $scope.days = dayList($scope.month, $scope.year);
                }

                // Assign values to scope
                $scope.day = day;
                $scope.month = month;
                $scope.year = year;
            };

            function setValue() {
                if ($scope.day && $scope.month && $scope.year) {
                    var value = new Date($scope.year, $scope.month - 1, $scope.day, 0, 0, 0, 0);
                    $scope.model = value;
                    $scope.ngChange();
                }
            };

            $scope.onDayChanged = function () {
                setValue();
            };

            $scope.onMonthChanged = function () {
                adjustDay();
                setValue();
            };

            $scope.onYearChanged = function () {
                adjustDay();
                setValue();
            };

            // Set initial values
            var value = $scope.model ? (_.isDate($scope.model) ? $scope.model : new Date($scope.model)) : null;
            $scope.day = value ? value.getDate() : null;
            $scope.month = value ? value.getMonth() + 1 : null;
            $scope.year = value ? value.getFullYear() : null;

            $scope.dayLabel = pipTranslate.translate('DAY');
            $scope.monthLabel = pipTranslate.translate('MONTH');
            $scope.yearLabel = pipTranslate.translate('YEAR');

            $scope.days = dayList($scope.month, $scope.year);
            $scope.months = monthList();
            $scope.years = yearList();

            $scope.disableControls = $scope.disabled ? $scope.disabled() : false;

            // React on changes
            $scope.$watch('model', function (newValue, oldValue) {
                getValue(newValue);
            });

            $scope.$watch($scope.disabled, function (newValue) {
                $scope.disableControls = newValue;
            });
        }]
    );

})();


/**
 * @file Confirmation dialog
 * @copyright Digital Living Software Corp. 2014-2016
 * @todo
 * - Improve sample in sampler app
 */
 
/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipErrorDetailsDialog',
        ['ngMaterial', 'pipUtils', 'pipTranslate', 'pipBasicControls.Templates']);

    thisModule.config(['pipTranslateProvider', function(pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            'ERROR_DETAILS': 'Error details',
            'CODE': 'Code',
            'PATH': 'Path',
            'ERROR': "Error code",
            'METHOD': 'Method',
            'MESSAGE':"Message"

        });
        pipTranslateProvider.translations('ru', {
            'ERROR_DETAILS': 'Детали ошибки',
            'CODE': 'Код',
            'PATH': 'Путь',
            'ERROR': "Код ошибки",
            'METHOD': 'Метод',
            'MESSAGE':"Сообщение"
        });
    }]);

    thisModule.factory('pipErrorDetailsDialog',
        ['$mdDialog', function ($mdDialog) {
            return {
                show: function (params, successCallback, cancelCallback) {
                    $mdDialog.show({
                        targetEvent: params.event,
                        templateUrl: 'error_details_dialog/error_details_dialog.html',
                        controller: 'pipErrorDetailsDialogController',
                        locals: { params: params },
                        clickOutsideToClose: true
                    })
                    .then(function () {
                        if (successCallback) {
                            successCallback();
                        }
                    }, function () {
                        if (cancelCallback) {
                            cancelCallback();
                        }
                    });
                }
            };
        }]
    );

    thisModule.controller('pipErrorDetailsDialogController',
        ['$scope', '$rootScope', '$mdDialog', 'pipTranslate', 'params', function ($scope, $rootScope, $mdDialog, pipTranslate, params) {
           $scope.error = params.error;
            $scope.ok = params.ok || 'OK';
            $scope.cancel = params.cancel || 'CANCEL';

            $scope.onCancel = function () {
                $mdDialog.cancel();
            };

            $scope.onOk = function () {
                $mdDialog.hide();
            };
        }]
    );

})();

/**
 * @file Date range control
 * @copyright Digital Living Software Corp. 2014-2016
 * @todo
 * - Improve samples int sampler app
 * - Optimize. It is way to slow on samples
 */

/* global angular */

/*
 pip-date-range-type
 [ daily,  weekly,  monthly,  yearly ]
 */

(function () {
    'use strict';

    var thisModule = angular.module("pipDateRange", []);

    thisModule.directive('pipDateRange',
        function () {
            return {
                restrict: 'EA',
                require: 'ngModel',
                scope: {
                    timeMode: '@pipTimeMode',
                    disabled: '&ngDisabled',
                    model: '=ngModel',
                    pipChanged: '&',
                    pipDateRangeType: '@',
                    pipDateFormat: '@',
                    pipNoLine: '@'
                },
                templateUrl: 'date_range/date_range.html',
                controller: 'pipDateRangeController'
            }
        });

    thisModule.controller('pipDateRangeController',
        ['$scope', '$element', 'pipTranslate', '$mdMedia', '$rootScope', function ($scope, $element, pipTranslate, $mdMedia, $rootScope) {
            var bufMonth,
                currentDate = new Date(),
                currentYear = currentDate.getUTCFullYear(),
                currentMonth = currentDate.getUTCMonth() + 1,
                currentDay = currentDate.getUTCDate(),
                prevState = {}, currentState = {};
            $scope.daysWeek = {
                en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                ru: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
            };

            $scope.onDayChanged = function () {
                setValue();
            };

            $scope.onMonthChanged = function () {
                if ($scope.pipDateRangeType == 'weekly') {
                    var date = new Date(Date.UTC($scope.year, $scope.month - 1, 1));
                    var dayOfWeek = date.getUTCDay() ? date.getUTCDay() : 7;
                    $scope.week = getWeekByDate(dayOfWeek, $scope.month - 1, $scope.year);
                    correctWeek();
                    adjustWeek();
                } else {
                    adjustDay();
                }
                setValue();
            };

            $scope.onYearChanged = function () {
                if ($scope.pipDateRangeType == 'weekly') {
                    var date = new Date(Date.UTC($scope.year, $scope.month - 1, 1));
                    var dayOfWeek = date.getUTCDay() ? date.getUTCDay() : 7;
                    $scope.week = getWeekByDate(dayOfWeek, $scope.month - 1, $scope.year);
                    adjustWeek();
                    correctWeek();
                } else {
                    adjustDay();
                }
                setValue();
            };

            $scope.onWeekChange = function () {
                if ($scope.pipDateRangeType == 'weekly') {
                    adjustWeek();
                    correctWeek();
                } else {
                    adjustDay();
                }
                setValue();
            };

            // visibility
            $scope.isDay = function () {
                return $scope.pipDateRangeType == 'daily';
            };

            $scope.isWeek = function () {
                return $scope.pipDateRangeType == 'weekly';
            };

            $scope.isMonth = function () {
                return (($scope.pipDateRangeType == 'daily') ||
                ($scope.pipDateRangeType == 'weekly') ||
                ($scope.pipDateRangeType == 'monthly'));
            };

            $scope.onChange = function () {
                if ($scope.pipChanged) {
                    $scope.pipChanged();
                }
            };

            function setCurrent() {
                currentState.day = $scope.day;
                currentState.month = $scope.month;
                currentState.year = $scope.year;
                currentState.week = $scope.week;
                currentState.dateRangeType = $scope.pipDateRangeType;
                currentState.model = $scope.model;
            }

            function fillLists() {
                $scope.days = dayList($scope.month, $scope.year);
                $scope.weeks = weekList($scope.month, $scope.year);
                $scope.months = monthList();
                $scope.shortMonths = monthList(true);
                $scope.years = yearList();

            };

            function correctWeek() {
                if (!prevState.model || (prevState.model && prevState.model.getTime() >= $scope.model.getTime())) {
                    // if shift week -> increase month
                    if ($scope.weeks && $scope.weeks[$scope.week] && $scope.weeks[$scope.week].id <= 0) {
                        if ($scope.month < 12) $scope.month += 1;
                        else {
                            $scope.month = 1;
                            $scope.year += 1;
                        }
                        fillLists();
                    }
                }
            };

            function init() {
                var value = $scope.model ? new Date($scope.model) : null;
                $scope.day = value ? value.getUTCDate() : null;
                $scope.month = value ? value.getUTCMonth() + 1 : null;
                $scope.year = value ? value.getUTCFullYear() : null;
                $scope.week = value ? getWeekByDate($scope.day, $scope.month - 1, $scope.year) : null;

                fillLists();

                if ($scope.pipDateRangeType == 'weekly') {
                    correctWeek();
                    adjustWeek();
                } else {
                    adjustDay();
                }
                setValue();
            }

            // Set initial values
            $scope.$mdMedia = $mdMedia;

            init();

            $scope.disableControls = $scope.disabled ? $scope.disabled() : false;

            // React on changes
            $scope.$watch('model', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    getValue(newValue);
                }
            });

            $scope.$watch($scope.disabled, function (newValue) {
                $scope.disableControls = newValue;
            });

            $scope.$watch('pipDateRangeType', function (newValue, oldValue) {
                if ((newValue != oldValue) && (oldValue)) {
                    init();
                }
            });

            $scope.onYearClick = function () {
                if ($scope.year == null) $scope.year = currentYear;
            };

            $scope.onMonthClick = function () {
                if ($scope.month == null) $scope.month = currentMonth;
            };

            $scope.onDayClick = function () {
                if ($scope.year == null) $scope.day = currentDay;
            };

            return;

            // ---------------------------------------------------------------------------------------

            function getCountDay(month, year) {
                var count = 31;

                if (month == 4 || month == 6 || month == 9 || month == 11) {
                    count = 30;
                } else if (month == 2) {
                    if (year)
                    // Calculate leap year (primitive)
                        count = year % 4 == 0 ? 29 : 28;
                    else count = 28;
                }
                return count;
            }

            function dayList(month, year) {
                var count = getCountDay(month, year);

                $scope.nameDays = [];
                var days = [];
                for (var i = 1; i <= count; i++) {
                    days.push(i);

                    $scope.nameDays.push($scope.daysWeek[$rootScope.$language || 'en'][new Date(year, month - 1, i).getDay()]);
                }
                return days;
            }

            function getWeekByDate(day, month, year) {
                var date = new Date(Date.UTC(year, month, day));
                var dayOfWeek = date.getUTCDay() ? date.getUTCDay() : 7;
                var startWeek;

                if (dayOfWeek == 1) {
                    startWeek = day;
                } else {
                    startWeek = day + 1 - dayOfWeek;
                }

                return startWeek;
            }

            function getWeek(day, countDay, countPrevMonthDay) {
                var endDay = (day + 6) > countDay ? countDay - day - 6 : day + 6;
                var startDay = (day > 0) ? day : countPrevMonthDay + day;
                return (startDay).toString() + ' - ' + (Math.abs(endDay)).toString();
            }

            function weekList(month, year) { // возвращает список начала надели
                var weeks = [];  // в массиве первые дни недели в текущем месяце
                var countDay = getCountDay(month, year);
                var countPrevMonthDay;
                var startWeek = getWeekByDate(1, month - 1, year);

                countPrevMonthDay = month - 1 ? getCountDay(month - 1, year) : getCountDay(12, year - 1);
                while (startWeek < countDay + 1) {
                    weeks.push({
                        id: startWeek,
                        name: getWeek(startWeek, countDay, countPrevMonthDay)
                    });
                    startWeek = startWeek + 7;
                }

                return weeks;
            }

            function monthList(isShort) {
                var months = [];

                for (var i = 1; i <= 12; i++) {
                    months.push({
                        id: i,
                        name: pipTranslate.translate('MONTH_' + i)
                    })
                }

                return months;
            }

            function yearList() {
                var
                    startYear,
                    endYear,
                    years = [];

                switch ($scope.timeMode) {
                    case 'future':
                        startYear = currentYear;
                        endYear = currentYear + 100;
                        break;
                    case 'past':
                        startYear = currentYear - 100;
                        endYear = currentYear;
                        break;
                    case 'now':
                        startYear = currentYear - 50;
                        endYear = currentYear + 100;
                        break;
                    default:
                        startYear = currentYear - 50;
                        endYear = currentYear + 50;
                        break;
                }
                if ($scope.timeMode == 'future') {
                    for (var i = startYear; i <= endYear; i++) {
                        years.push(i);
                    }
                } else {
                    for (var i = endYear; i >= startYear; i--) {
                        years.push(i);
                    }
                }
                return years;
            }

            function adjustDay() {
                var days = dayList($scope.month, $scope.year);

                switch ($scope.pipDateRangeType) {
                    case 'monthly':
                        $scope.day = 1;
                        break;
                    case 'yearly':
                        $scope.month = 1;
                        $scope.day = 1;
                        break;
                    default:
                        if ($scope.days.length != days.length) {
                            if ($scope.day > days.length) {
                                $scope.day = days.length;
                            }
                        }
                        break;
                }
                $scope.days = days;
            }

            function adjustWeek() {
                var weeks = weekList($scope.month, $scope.year);
                $scope.week = getWeekByDate($scope.week, $scope.month - 1, $scope.year);
                $scope.weeks = weeks;
            }

            function getValue(value) {
                value = value ? new Date(value) : null;
                // Define values
                var day = value ? value.getUTCDate() : null;
                var month = value ? value.getUTCMonth() + 1 : null;
                var year = value ? value.getUTCFullYear() : null;
                var week = value ? getWeekByDate(day, month - 1, year) : null;
                // Exit if nothing to update
                if ($scope.day == day && $scope.month == month
                    && $scope.year == year && $scope.week == week)
                    return;
                // Assign values to scope
                $scope.day = day;
                $scope.month = month;
                $scope.year = year;
                $scope.week = week;

                // Define data sources
                $scope.days = dayList($scope.month, $scope.year);
                $scope.weeks = weekList($scope.month, $scope.year);
            }

            function setValue() {
                var value;
                if ($scope.pipDateRangeType == 'weekly') {
                    value = new Date($scope.year, $scope.month - 1, $scope.week, 0, 0, 0, 0);
                    value = new Date(value.getTime() - value.getTimezoneOffset() * 60000);
                    $scope.model = value;
                } else {
                    value = new Date($scope.year, $scope.month - 1, $scope.day, 0, 0, 0, 0);
                    value = new Date(value.getTime() - value.getTimezoneOffset() * 60000);
                    $scope.model = value;
                }

                prevState = _.cloneDeep(currentState);
                setCurrent();
                $scope.onChange();
            }
        }]
    );

})();


/**
 * @file Information dialog
 * @copyright Digital Living Software Corp. 2014-2016
 * @todo
 * - Improve sample in sampler app
 */
 
/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipInformationDialog', 
        ['ngMaterial', 'pipUtils', 'pipTranslate', 'pipBasicControls.Templates']);

    thisModule.config(['pipTranslateProvider', function(pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            'INFORMATION_TITLE': 'Information'
        });
        pipTranslateProvider.translations('ru', {
            'INFORMATION_TITLE': 'Информация'
        });
    }]);
        
    thisModule.factory('pipInformationDialog', 
        ['$mdDialog', '$timeout', function ($mdDialog, $timeout) {
            return {
                show: function (params, callback) {
                    $mdDialog.show({
                        targetEvent: params.event,
                        templateUrl: 'information_dialog/information_dialog.html',
                        controller: 'pipInformationDialogController',
                        locals: { params: params },
                        clickOutsideToClose: true
                    })
                    .then(function () {
                        if (callback) callback();
                    });
                }
            };
        }]
    );

    thisModule.controller('pipInformationDialogController',
        ['$scope', '$rootScope', '$mdDialog', 'pipTranslate', 'params', 'pipUtils', function ($scope, $rootScope, $mdDialog, pipTranslate, params, pipUtils) {
            $scope.theme = $rootScope.$theme;
            $scope.title = params.title || 'INFORMATION_TITLE';

            var content = pipTranslate.translate(params.message);
            if (params.item) {
                var item = _.truncate(params.item, 25);
                content = pipUtils.sprintf(content, item);
            }
            $scope.content = content;
            $scope.ok = params.ok || 'OK';

            $scope.onOk = function () {
                $mdDialog.hide();
            };
        }]        
    );

})();

/**
 * @file Image slider control
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global _, angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipImageSlider", []);

    thisModule.directive('pipImageSlider',
        function () {
            return {
                scope: false,
                controller: ['$scope', '$element', '$attrs', '$parse', '$timeout', '$interval', '$pipImageSlider', function ($scope, $element, $attrs, $parse, $timeout, $interval, $pipImageSlider/*, $swipe*/) {
                    var blocks,
                        indexSetter = $parse($attrs.pipImageSliderIndex).assign,
                        index = 0, newIndex,
                        direction,
                        type = $parse($attrs.pipAnimationType)($scope),
                        DEFAULT_INTERVAL = 4500,
                        interval = $parse($attrs.pipAnimationInterval)($scope),
                        timePromises;

                    $element.addClass('pip-image-slider');
                    $element.addClass('pip-animation-' + type);

                    $scope.swipeStart = 0;
/*
                    if ($swipe)
                        $swipe.bind($element, {
                            'start': function(coords) {
                                if (coords) $scope.swipeStart = coords.x;
                                else $scope.swipeStart = 0;
                            },
                            'end': function(coords) {
                                var delta;
                                if (coords) {
                                    delta = $scope.swipeStart - coords.x;
                                    if (delta > 150)  $scope.nextBlock();
                                    if (delta < -150)  $scope.prevBlock();
                                    $scope.swipeStart = 0;
                                } else $scope.swipeStart = 0;
                            }
                        });
*/
                    setIndex();

                    $timeout(function () {
                        blocks = $element.find('.pip-animation-block');
                        if (blocks.length > 0) $(blocks[0]).addClass('pip-show');
                    });

                    startInterval();

                    var throttled = _.throttle(function () {
                        $pipImageSlider.toBlock(type, blocks, index, newIndex, direction);
                        index = newIndex;
                        setIndex();
                    }, 600);

                    $scope.nextBlock = function() {
                        restartInterval();
                        newIndex = index + 1 == blocks.length ? 0 : index + 1;
                        direction = 'next';
                        throttled();
                    };

                    $scope.prevBlock = function() {
                        restartInterval();
                        newIndex = index - 1 < 0 ? blocks.length - 1 : index - 1;
                        direction = 'prev';
                        throttled();
                    };

                    $scope.slideTo = function (nextIndex) {
                        if (nextIndex == index || nextIndex > blocks.length - 1) return;

                        restartInterval();
                        newIndex = nextIndex;
                        direction = nextIndex > index ? 'next' : 'prev';
                        throttled();
                    };

                    function setIndex() {
                        if (indexSetter) indexSetter($scope, index);
                    }

                    function startInterval() {
                        timePromises = $interval(function () {
                            newIndex = index + 1 == blocks.length ? 0 : index + 1;
                            direction = 'next';
                            throttled();
                        }, interval || DEFAULT_INTERVAL);
                    }

                    function stopInterval() {
                        $interval.cancel(timePromises);
                    }

                    $element.on('$destroy', function() {
                        stopInterval();
                    });

                    function restartInterval() {
                        stopInterval();
                        startInterval();
                    }
                }]
            };
        }
    );

    thisModule.directive('pipSliderButton',
        function () {
            return {
                scope: {},
                controller: ['$scope', '$element', '$parse', '$attrs', function ($scope, $element, $parse, $attrs) {
                    var type = $parse($attrs.pipButtonType)($scope),
                        sliderId = $parse($attrs.pipSliderId)($scope);

                    $element.on('click', function () {
                        if (!sliderId || !type) return;

                        angular.element(document.getElementById(sliderId)).scope()[type + 'Block']();
                    });
                }]
            }
        }
    );

    thisModule.directive('pipSliderIndicator',
        function () {
            return {
                scope: false,
                controller: ['$scope', '$element', '$parse', '$attrs', function ($scope, $element, $parse, $attrs) {
                    var sliderId = $parse($attrs.pipSliderId)($scope),
                        slideTo = $parse($attrs.pipSlideTo)($scope);

                    $element.css('cursor', 'pointer');
                    $element.on('click', function () {
                        if (!sliderId || (slideTo && slideTo < 0)) return;

                        angular.element(document.getElementById(sliderId)).scope().slideTo(slideTo);
                    });
                }]
            }
        }
    );

    thisModule.service('$pipImageSlider',
        ['$timeout', function ($timeout) {

            var ANIMATION_DURATION = 550;

            return {
                nextCarousel: nextCarousel,
                prevCarousel: prevCarousel,
                toBlock: toBlock
            };

            function nextCarousel(nextBlock, prevBlock) {
                nextBlock.removeClass('animated').addClass('pip-next');

                $timeout(function () {
                    nextBlock.addClass('animated').addClass('pip-show').removeClass('pip-next');
                    prevBlock.addClass('animated').removeClass('pip-show');
                }, 100);
            }

            function prevCarousel (nextBlock, prevBlock) {
                nextBlock.removeClass('animated');

                $timeout(function () {
                    nextBlock.addClass('animated').addClass('pip-show');
                    prevBlock.addClass('animated').addClass('pip-next').removeClass('pip-show');

                    $timeout(function () {
                        prevBlock.removeClass('pip-next').removeClass('animated');
                    }, ANIMATION_DURATION - 100);
                }, 100);
            }

            function toBlock(type, blocks, oldIndex, nextIndex, direction) {
                var prevBlock = $(blocks[oldIndex]),
                    blockIndex = nextIndex;
                var nextBlock = $(blocks[blockIndex]);

                if (type == 'carousel') {
                    $(blocks).removeClass('pip-next').removeClass('pip-prev');

                    if (direction && direction == 'prev')
                        prevCarousel(nextBlock, prevBlock);
                    else {
                        if (direction && direction == 'next') {
                            nextCarousel(nextBlock, prevBlock);
                        } else {
                            if (nextIndex && nextIndex < oldIndex)
                                prevCarousel(nextBlock, prevBlock);
                            else
                                nextCarousel(nextBlock, prevBlock);
                        }
                    }
                } else {
                    prevBlock.addClass('animated').removeClass('pip-show');
                    nextBlock.addClass('animated').addClass('pip-show');
                }
            }
        }]
    );

})();

/**
 * @file Markdown control
 * @copyright Digital Living Software Corp. 2014-2016
 * @todo
 * - Move css styles under control
 * - Improve samples in sampler app
 */

/* global angular, pip, marked */

(function () {
    'use strict';

    var thisModule = angular.module("pipMarkdown", ['ngSanitize', 'pipUtils', 'pipTranslate']);

    thisModule.config(['pipTranslateProvider', function(pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            'MARKDOWN_ATTACHMENTS': 'Attachments:',
            'checklist': 'Checklist',
            'documents': 'Documents',
            'pictures': 'Pictures',
            'location': 'Location',
            'time': 'Time'
        });
        pipTranslateProvider.translations('ru', {
            'MARKDOWN_ATTACHMENTS': 'Вложения:',
            'checklist': 'Список',
            'documents': 'Документы',
            'pictures': 'Изображения',
            'location': 'Местонахождение',
            'time': 'Время'
        });
    }]);

    thisModule.directive('pipMarkdown',
        ['$parse', 'pipUtils', 'pipTranslate', function($parse, pipUtils, pipTranslate) {
            return {
                restrict: 'EA',
                scope: false,
                link: function ($scope, $element, $attrs) {
                    var
                        textGetter = $parse($attrs.pipText),
                        listGetter = $parse($attrs.pipList),
                        clampGetter = $parse($attrs.pipLineCount);

                    function describeAttachments(array) {
                        var attachString = '',
                            attachTypes = [];

                        _.each(array, function(attach) {
                            if (attach.type && attach.type != 'text') {
                                if (attachString.length == 0) attachString = pipTranslate.translate('MARKDOWN_ATTACHMENTS');

                                if (attachTypes.indexOf(attach.type) < 0) {
                                    attachTypes.push(attach.type);
                                    attachString += (attachTypes.length > 1 ? ', ' : ' ') + pipTranslate.translate(attach.type);
                                }
                            }
                        })

                        return attachString;
                    }

                    function bindText(value) {
                        var textString;

                        if (_.isArray(value)) {
                            var obj = _.find(value, function(item) {
                                return item.type == 'text' && item.text;
                            });

                            textString =  obj ? obj.text : describeAttachments(value);
                        } else {
                            textString = value;
                        }

                        var isClamped = $attrs.pipLineCount && _.isNumber(clampGetter()) && (textString && textString.length > 0),
                            height,
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
                        if (isClamped) height = 1.5 * clampGetter();
                        // Assign value as HTML
                        $element.html('<div' + (isClamped ? listGetter()?' class="pip-markdown-content pip-markdown-list" style="max-height: ' + height + 'em">' :
                                ' class="pip-markdown-content" style="max-height: ' + height + 'em">' :  listGetter()? ' class="pip-markdown-list">' : '>') + textString + '</div>');
                        $element.find('a').attr('target', 'blank');
                        if (!listGetter() && isClamped) $element.append('<div class="pip-gradient-block"></div>');
                    }

                    // Fill the text
                    bindText(textGetter($scope));

                    // Also optimization to avoid watch if it is unnecessary
                    if (pipUtils.toBoolean($attrs.pipRebind)) {
                        $scope.$watch(textGetter, function(newValue) {
                            bindText(newValue);
                        });
                    }

                    $scope.$on('pipWindowResized', function () {
                        bindText(textGetter($scope));
                    });

                    // Add class
                    $element.addClass('pip-markdown');
                }
            }
        }]
    );

})();


/**
 * @file Popover control
 * @copyright Digital Living Software Corp. 2014-2016
 *
 */

/* global _, angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipPopover", ['pipAssert']);

    thisModule.directive('pipPopover', function () {
        return {
            restrict: 'EA',
            scope: true,
            templateUrl: 'popover/popover.template.html',
            controller:
                ['$scope', '$rootScope', '$element', '$timeout', '$compile', function ($scope, $rootScope, $element, $timeout, $compile) {
                    var backdropElement = $('.pip-popover-backdrop');
                    backdropElement.on('click keydown scroll', backdropClick);
                    backdropElement.addClass($scope.params.responsive !== false ? 'pip-responsive' : '');

                    $timeout(function () {
                        position();
                        if ($scope.params.template) {
                            var content = $compile($scope.params.template)($scope);
                            $element.find('.pip-popover').append(content);
                        }

                        init();
                    });

                    $timeout(function() {
                        calcHeight();
                    }, 200);

                    $scope.onPopoverClick = onPopoverClick;
                    $scope = _.defaults($scope, $scope.$parent);

                    $rootScope.$on('pipPopoverResize', onResize);
                    $(window).resize(onResize);

                    function init() {
                        backdropElement.addClass('opened');
                        $('.pip-popover-backdrop').focus();
                        if ($scope.params.timeout) {
                            $timeout(function () {
                                closePopover();
                            }, $scope.params.timeout);
                        }
                    }

                    function backdropClick() {
                        if ($scope.params.cancelCallback)
                            $scope.params.cancelCallback();

                        closePopover();
                    }

                    function closePopover () {
                        backdropElement.removeClass('opened');
                        $timeout(function () {
                            backdropElement.remove();
                        }, 100);
                    }

                    function onPopoverClick ($e) {
                        $e.stopPropagation();
                    }

                    function position() {
                        if ($scope.params.element) {
                            var element = $($scope.params.element),
                                pos = element.offset(),
                                width = element.width(),
                                height = element.height(),
                                docWidth = $(document).width(),
                                docHeight = $(document).height(),
                                popover = backdropElement.find('.pip-popover');

                            if (pos)
                                popover
                                    .css('max-width', docWidth - (docWidth - pos.left))
                                    .css('max-height', docHeight - (pos.top + height) - 32, 0)
                                    .css('left', pos.left - popover.width() + (width / 2))
                                    .css('top', pos.top + height + 16);
                        }
                    }

                    function calcHeight () {
                        if ($scope.params.calcHeight === false) return;

                        var popover = backdropElement.find('.pip-popover'),
                            title = popover.find('.pip-title'),
                            footer = popover.find('.pip-footer'),
                            content = popover.find('.pip-content'),
                            contentHeight = popover.height() - title.outerHeight(true) - footer.outerHeight(true);

                        content.css('max-height', Math.max(contentHeight, 0) + 'px').css('box-sizing', 'border-box');
                    }

                    function onResize () {
                        backdropElement.find('.pip-popover').find('.pip-content').css('max-height', '100%');
                        position();
                        calcHeight();
                    }
                }]
        };
    });

    thisModule.service('$pipPopover',
        ['$compile', '$rootScope', '$timeout', function ($compile, $rootScope, $timeout) {
            var popoverTemplate = "<div class='pip-popover-backdrop {{ params.class }}' ng-controller='params.controller' tabindex='1'>" +
                                    "<pip-popover pip-params='params'>" +
                                    "</pip-popover>" +
                                  "</div>";

            return {
                show: onShow,
                hide: onHide,
                resize: onResize
            };

            function onShow(params) {
                var element = $('body');

                if (element.find('md-backdrop').length > 0) return;
                onHide();

                var scope = $rootScope.$new(),
                    params = params && _.isObject(params) ? params : {},
                    content;

                scope.params = params;
                scope.locals = params.locals;
                content = $compile(popoverTemplate)(scope);
                element.append(content);
            }

            function onHide () {
                var backdropElement = $('.pip-popover-backdrop');

                backdropElement.removeClass('opened');
                $timeout(function () {
                    backdropElement.remove();
                }, 100);
            }

            function onResize () {
                $rootScope.$broadcast('pipPopoverResize');
            }

        }]
    );

})();

/**
 * @file Options dialog
 * @copyright Digital Living Software Corp. 2014-2016
 * @todo
 * - Improve sample in sampler app
 * - Remove deleted hack in the controller
 */
 
/* global $, angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipOptionsDialog', 
        ['ngMaterial', 'pipUtils', 'pipTranslate', 'pipBasicControls.Templates']);

    thisModule.config(['pipTranslateProvider', function(pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            'OPTIONS_TITLE': 'Choose Option'
        });
        pipTranslateProvider.translations('ru', {
            'OPTIONS_TITLE': 'Выберите опцию'
        });
    }]);

    thisModule.factory('pipOptionsDialog', 
        ['$mdDialog', function ($mdDialog) {
            return {
                show: function (params, successCallback, cancelCallback) {
                    if (params.event) {
                        params.event.stopPropagation();
                        params.event.preventDefault();
                    }

                    function focusToggleControl() {
                        if (params.event && params.event.currentTarget)
                            params.event.currentTarget.focus();
                    }

                    $mdDialog.show({
                        targetEvent: params.event,
                        templateUrl: 'options_dialog/options_dialog.html',
                        controller: 'pipOptionsDialogController',
                        locals: { params: params },
                        clickOutsideToClose: true
                    })
                    .then(function (option) {
                        focusToggleControl();

                        if (successCallback) successCallback(option);
                    }, function () {
                        focusToggleControl();
                        if (cancelCallback) cancelCallback();
                    });
                }
            };
        }]
    );

    thisModule.controller('pipOptionsDialogController',
        ['$scope', '$rootScope', '$mdDialog', 'params', function ($scope, $rootScope, $mdDialog, params) {
            $scope.theme = $rootScope.$theme;
            $scope.title = params.title || 'OPTIONS_TITLE';
            $scope.options = params.options;
            $scope.selectedOption = _.find(params.options, {active: true}) || {};
            $scope.selectedOptionName = $scope.selectedOption.name;
            $scope.applyButtonTitle = params.appleButtonTitle || 'SELECT';
            
            $scope.deleted = params.deleted;
            $scope.deletedTitle = params.deletedTitle;
    
            $scope.onOptionSelect = function (event, option) {
                event.stopPropagation();
                $scope.selectedOptionName = option.name;
            };
    
            $scope.onKeyPress = function(event) {
                if (event.keyCode == 32 || event.keyCode == 13) {
                    event.stopPropagation();
                    event.preventDefault();
                    $scope.onSelect();
                }
            };
    
            $scope.onCancel = function () {
                $mdDialog.cancel();
            };
            
            $scope.onSelect = function () {
                var option = _.find(params.options, {name: $scope.selectedOptionName});
                $mdDialog.hide({ option: option, deleted: $scope.deleted });
            };
    
            // Setting focus to input control
            function focusInput() {
                var list = $('.pip-options-dialog .pip-list');
                list.focus();
            };
            setTimeout(focusInput, 500);
    
        }]
    );

})();

/**
 * @file Options dialog
 * @copyright Digital Living Software Corp. 2014-2016
 * @todo
 * - Improve sample in sampler app
 * - Remove deleted hack in the controller
 */
 
/* global $, angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipOptionsBigDialog',
        ['ngMaterial', 'pipUtils', 'pipTranslate', 'pipBasicControls.Templates']);

    thisModule.config(['pipTranslateProvider', function(pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            'OPTIONS_TITLE': 'Choose Option'
        });
        pipTranslateProvider.translations('ru', {
            'OPTIONS_TITLE': 'Выберите опцию'
        });
    }]);

    thisModule.factory('pipOptionsBigDialog',
        ['$mdDialog', function ($mdDialog) {
            return {
                show: function (params, successCallback, cancelCallback) {
                    if (params.event) {
                        params.event.stopPropagation();
                        params.event.preventDefault();
                    }

                    function focusToggleControl() {
                        if (params.event && params.event.currentTarget)
                            params.event.currentTarget.focus();
                    }

                    $mdDialog.show({
                        targetEvent: params.event,
                        templateUrl: 'options_dialog/options_dialog_big.html',
                        controller: 'pipOptionsDialogBigController',
                        locals: { params: params },
                        clickOutsideToClose: true
                    })
                    .then(function (option) {
                        focusToggleControl();

                        if (successCallback) successCallback(option);
                    }, function () {
                        focusToggleControl();
                        if (cancelCallback) cancelCallback();
                    });
                }
            };
        }]
    );

    thisModule.controller('pipOptionsDialogBigController',
        ['$scope', '$rootScope', '$mdDialog', 'params', function ($scope, $rootScope, $mdDialog, params) {
            $scope.theme = $rootScope.$theme;
            $scope.title = params.title || 'OPTIONS_TITLE';
            $scope.options = params.options;
            $scope.noActions = params.noActions || false;
            $scope.noTitle = params.noTitle || false;
            $scope.hint = params.hint || '';
            $scope.selectedOption = _.find(params.options, {active: true}) || {};
            $scope.selectedOptionName = $scope.selectedOption.name;
            $scope.optionIndex  = _.findIndex(params.options,$scope.selectedOption);
            $scope.applyButtonTitle = params.applyButtonTitle || 'SELECT';
            
            $scope.deleted = params.deleted;
            $scope.deletedTitle = params.deletedTitle;
    
            $scope.onOptionSelect = function (event, option) {
                event.stopPropagation();
                $scope.selectedOptionName = option.name;

                if ($scope.noActions) {
                    $scope.onSelect();
                }
            };

            $scope.onSelected = function (event) {
                $scope.selectedOptionName = $scope.options[$scope.optionIndex].name;

                if ($scope.noActions) {
                    // $scope.onSelect();
                }
            };
    
            $scope.onKeyUp = function(event, index) {
                if (event.keyCode == 32 || event.keyCode == 13) {
                    event.stopPropagation();
                    event.preventDefault();
                    if (index != undefined && index > -1 && index < $scope.options.length) {
                        $scope.selectedOptionName = $scope.options[index].name;
                        $scope.onSelect();
                    }
                }
            };
    
            $scope.onCancel = function () {
                $mdDialog.cancel();
            };
            
            $scope.onSelect = function () {
                var option = _.find($scope.options, {name: $scope.selectedOptionName});
                $mdDialog.hide({ option: option, deleted: $scope.deleted });
            };
    
            // Setting focus to input control
            function focusInput() {
                var list = $('.pip-options-dialog .pip-list');
                list.focus();
            };
            setTimeout(focusInput, 500);
    
        }]
    );

})();

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
/**
 * @file Tag list control
 * @copyright Digital Living Software Corp. 2014-2015
 * @todo
 * - Improve samples in sampler app
 * - What's pipType and pipTypeLocal? Give better name
 * - Do not use ng-if, instead generate template statically
 */
 
/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipTagList", ['pipCore']);

    /**
     * pipTags - set of tags
     * pipType - additional type tag
     * pipTypeLocal - additional translated type tag
     */
    thisModule.directive('pipTagList', 
        ['$parse', function ($parse) {
            return {
                restrict: 'EA',
                scope: {
                    pipTags: '=',
                    pipType: '=',
                    pipTypeLocal: '='
                },
                templateUrl: 'tags/tag_list.html',
                controller:
                    ['$scope', '$element', '$attrs', 'pipUtils', function ($scope, $element, $attrs, pipUtils) {
                        var tagsGetter = $parse($attrs.pipTags);
                        
                        $element.css("display", "block");
                        
                        // Set tags
                        $scope.tags = tagsGetter($scope);

                        // Also optimization to avoid watch if it is unnecessary
                        if (pipUtils.toBoolean($attrs.pipRebind)) {
                            $scope.$watch(tagsGetter, function (newValue) {
                                $scope.tags = tagsGetter($scope)
                            });
                        }

                        // Add class
                        $element.addClass('pip-tag-list');
                    }]
            }
        }]
    );

})();


/**
 * @file Refresh button control
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipRefreshButton", ['ngMaterial']);

    thisModule.directive('pipRefreshButton',  
        ['$parse', function($parse) {
            return {
                restrict: 'EA',
                scope: false,
                template: String()
                    + '<md-button class="pip-refresh-button" tabindex="-1" ng-click="onClick($event)" aria-label="REFRESH">'
                    + '<md-icon md-svg-icon="icons:refresh"></md-icon>'
                    + ' <span class="pip-refresh-text"></span>'
                    + '</md-button>',
                replace: false,
                link: function ($scope, $element, $attrs) {
                    var
                        textGetter = $parse($attrs.pipText),
                        visibleGetter = $parse($attrs.pipVisible),
                        refreshGetter = $parse($attrs.pipRefresh),
                        $button = $element.children('.md-button'),
                        $text = $button.children('.pip-refresh-text');

                    var show = function() {
                        // Set a new text
                        var text = textGetter($scope);
                        $text.text(text);

                        // Show button
                        $button.show();
                        
                        // Adjust position
                        var width = $button.width();
                        $button.css('margin-left', '-' + (width / 2) + 'px');
                    };

                    function hide() {
                        $button.hide();  
                    };

                    $scope.onClick = function(event) {
                        refreshGetter($scope);  
                    };

                    $scope.$watch(visibleGetter, function(newValue) {
                        if (newValue == true) show();
                        else hide();
                    });

                    $scope.$watch(textGetter, function(newValue) {
                        $text.text(newValue);
                    });
                }
            }
        }]
    );

})();


/**
 * @file Time control
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipTimeView", ['pipUtils']);

    thisModule.directive('pipTimeView',
        ['pipUtils', function (pipUtils) {
            return {
                restrict: 'EA',
                scope: {
                    pipStartDate: '=',
                    pipEndDate: '='
                },
                templateUrl:  'time_view/time_view.html',
                link: function ($scope, $element, $attrs) {

                    function getDateJSON(value) {
                        var date = value ? new Date(value) : null;
                        return date;
                    };

                    function defineStartDate() {
                        if (($scope.pipStartDate !== null) && ($scope.pipStartDate !== undefined)) {
                            $scope.data.start = _.isDate($scope.pipStartDate) ?  $scope.pipStartDate : getDateJSON($scope.pipStartDate);
                        }
                    };

                    function defineEndDate() {
                        if (($scope.pipEndDate !== null) && ($scope.pipEndDate !== undefined)) {
                            $scope.data.end = _.isDate($scope.pipEndDate) ?  $scope.pipEndDate : getDateJSON($scope.pipEndDate);
                        }
                    };

                    $scope.data = {};
                    $scope.data.start = null;
                    $scope.data.end = null;
                    defineStartDate();
                    defineEndDate();

                    if (pipUtils.toBoolean($attrs.pipRebind)) {
                        $scope.$watch('pipStartDate',
                            function (newValue) {
                                $scope.data.start = null;
                                defineStartDate();
                            }
                        );
                        $scope.$watch('pipEndDate',
                            function (newValue) {
                                $scope.data.end = null;
                                defineEndDate();
                            }
                        );
                    }

                    // Add class
                    $element.addClass('pip-time-view');
                }
            }
        }]
    );

})();

/**
 * @file Time control
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipTimeEdit", ['pipUtils', 'pipTranslate']);

    thisModule.directive('pipTimeEdit',
        function () {
            return {
                restrict: 'EA',
                scope: {
                    pipStartDate: '=',
                    pipChanged: '&',
                    pipEndDate: '=',
                    pipStartLabel: '@',
                    pipEndLabel: '@',
                    disabled: '&ngDisabled',
                    pipSize: '='
                },
                templateUrl: 'time_edit/time_edit.html',
                controller: 'pipTimeEditController'
            }
        }
    );

    thisModule.controller('pipTimeEditController',
        ['$scope', '$element', '$attrs', 'pipDates', 'pipTranslate', function ($scope, $element, $attrs, pipDates, pipTranslate) {

            function getDateJSON(value) {
                var date = value ? new Date(value) : null;
                return date;
            };

            function setDuration() {
                if (!$scope.data.startDate || !$scope.data.endDate)
                    return null;

                var start, end;
                start = new Date($scope.data.startDate.getTime() + $scope.data.startTime * 60 * 1000);
                end = new Date($scope.data.endDate.getTime() + $scope.data.endTime * 60 * 1000);
                return end - start;
            };

            function validateStartDate() {
                // если начальная дата не задана, обнуляем и выходим
                if (!$scope.data.startDate) {
                    $scope.data.startTime = null;
                    return;
                }
                // еcли не задано начальное время - задаем его
                if (!$scope.data.startTime) {
                    if (!$scope.data.endTime) {
                        var date = new Date();
                        $scope.data.startTime = Math.floor((date.getTime() -  pipDates.toStartDay(date)) / (30 * 60 * 1000)) * 30;
                    } else {
                        $scope.data.startTime = $scope.data.endTime == 0 ? 0 : $scope.data.endTime - 30;
                    }
                }

                // если конечная дата не задана, обнуляем и выходим
                if (!$scope.data.endDate) {
                    $scope.data.endTime = null;
                    return;
                }

                var start, end;
                start = new Date($scope.data.startDate.getTime() + $scope.data.startTime * 60 * 1000);
                // Если есть длительность, то сохраняем ее. Длительность можно изменить только изменяя конечную дату
                if ($scope.data.duration) {
                    end = new Date(start.getTime() + $scope.data.duration);
                    $scope.data.endDate = pipDates.toStartDay(end);
                    $scope.data.endTime = Math.floor((end.getTime() - $scope.data.endDate.getTime()) / (30 * 60 * 1000)) * 30;
                } else {
                    // Если нет длительности сравниваем даты
                    end = new Date($scope.data.endDate.getTime() + $scope.data.endTime * 60 * 1000);
                    if (start >= end) {
                        // Если начальная дата больше, то двигаем конечную дату
                        $scope.data.endDate = pipDates.toStartDay(new Date(start.getTime() + (30 * 60000)));
                        $scope.data.endTime = ($scope.data.startTime + 30) % 1440;
                    }
                }
            };

            function validateEndDate() {
                // если начальная дата не задана, обнуляем и выходим
                if (!$scope.data.endDate) {
                    $scope.data.endTime = null;
                    return;
                }
                // еcли не задано конечное время - задаем его
                if (!$scope.data.endTime) {
                    if (!$scope.data.startTime) {
                        var date = new Date();
                        $scope.data.endTime = Math.floor((date.getTime() -  pipDates.toStartDay(date)) / (30 * 60 * 1000)) * 30;
                    } else {
                        $scope.data.endTime = $scope.data.startTime == 1410 ? 1410 : $scope.data.startTime + 30;
                    }
                }

                // если yачальная дата не задана, обнуляем и выходим
                if (!$scope.data.startDate) {
                    $scope.data.startTime = null;
                    return;
                }

                var start, end;
                start = new Date($scope.data.startDate.getTime() + $scope.data.startTime * 60 * 1000);
                end = new Date($scope.data.endDate.getTime() + $scope.data.endTime * 60 * 1000);
                if (start >= end) {
                    // Если начальная дата больше, то двигаем начальную дату
                    $scope.data.startDate = pipDates.toStartDay(new Date(end.getTime() - 30 * 60000));
                    $scope.data.startTime = ($scope.data.endTime % 1440 == 0) ? 1410 : $scope.data.endTime - 30;
                }

                $scope.data.duration = setDuration();
            };

            function setDate() {
                $scope.data.bind = false;
                if($scope.data.startDate) {
                    var time = $scope.data.startTime ? $scope.data.startTime * 60 * 1000 : 0;
                    $scope.pipStartDate = new Date($scope.data.startDate.getTime() + time);
                }
                if($scope.data.endDate) {
                    var time = $scope.data.endTime ? $scope.data.endTime * 60 * 1000 : 0;
                    $scope.pipEndDate = new Date($scope.data.endDate.getTime() + time);
                }
                $scope.data.bind = true;
            };

            function defineDate() {
                var start, end;
                if (($scope.pipStartDate !== null) && ($scope.pipStartDate !== undefined)) {
                    var start = _.isDate($scope.pipStartDate) ?  $scope.pipStartDate : null;
                    if (!start) {
                        start = getDateJSON($scope.pipStartDate);
                    }
                    $scope.data.startDate = pipDates.toStartDay(start);
                    $scope.data.startTime = (new Date(start) - $scope.data.startDate) / (60 * 1000);
                }

                if (($scope.pipEndDate !== null) && ($scope.pipEndDate !== undefined)) {
                    var end = _.isDate($scope.pipEndDate) ?  $scope.pipEndDate : null;
                    if (!start) {
                        end = getDateJSON($scope.pipEndDate);
                    }
                    $scope.data.endDate = pipDates.toStartDay(end);
                    $scope.data.endTime = (new Date(end) - $scope.data.endDate) / (60 * 1000);
                }
                validateStartDate();
                $scope.data.duration = setDuration();
                setDate();
            };

            function getTimeInterval() {
                var result = [];

                for (var i = 0; i < 24; i++) {
                    for (var j = 0; j < 2; j++) {
                        var minutes = j * 30;
                        result.push({
                            id: (i * 60 + minutes),
                            time: _.pad(i.toString(),3,'0').substr(0, 2) + ':' + _.pad(minutes.toString(),2,'0')
                        });
                    }
                }

                return result;
            };

            function initDate() {
                $scope.data.startDate = null;
                $scope.data.startTime = null;
                $scope.data.endDate = null;
                $scope.data.endTime = null;
                $scope.data.duration = null;
            };

            // initialize data
            $scope.intervalTimeCollection = getTimeInterval();
            $scope.data = {};
            $scope.startLabel = $scope.pipStartLabel ? pipTranslate.translate($scope.pipStartLabel) : pipTranslate.translate('EVENT_NEW_START_TIME');
            $scope.endLabel = $scope.pipEndLabel ? pipTranslate.translate($scope.pipEndLabel) : pipTranslate.translate('EVENT_NEW_END_TIME');
            initDate();
            defineDate();

            // process function
            $scope.onChangeStartDate = function () {
                validateStartDate();
                $scope.data.duration = setDuration();
                setDate();
                $scope.pipChanged();
            };

            $scope.onChangeEndDate = function () {
                validateEndDate();
                $scope.data.duration = setDuration();
                setDate();
                $scope.pipChanged();
            };

            $scope.onChangeStartTime = function () {
                if (!$scope.data.startDate)
                    $scope.data.startDate = pipDates.toStartDay(new Date());
                validateStartDate();
                $scope.data.duration = setDuration();
                setDate();
                $scope.pipChanged();
            };

            $scope.onChangeEndTime = function () {
                if (!$scope.data.endDate)
                    $scope.data.endDate = pipDates.toStartDay(new Date());
                validateEndDate();
                $scope.data.duration = setDuration();
                setDate();
                $scope.pipChanged();
            };

            $scope.isDisabled = function () {
                if ($scope.disabled){
                    return $scope.disabled();
                } else {
                    return false;
                }
            }

            $scope.$watchGroup([$scope.pipStartDate, $scope.pipEndDate], function() {
                if ($scope.data.bind) {
                    initDate();
                    defineDate();
                }
            });

            $scope.$watch($scope.disabled, function(newValue) {
                $scope.disableControls = newValue;
            });

            // Add class
            $element.addClass('pip-time-edit');
        }]
    );

})();
/**
 * @file Toasts management service
 * @copyright Digital Living Software Corp. 2014-2016
 * @todo Replace ngAudio with alternative service
 */
 
 /* global _, angular */
 
(function () {
    'use strict';
    
    var thisModule = angular.module('pipToasts', ['pipTranslate', 'ngMaterial', 'pipAssert']);

    thisModule.controller('pipToastController',
        ['$scope', '$mdToast', 'toast', 'pipErrorDetailsDialog', 'sounds', function ($scope, $mdToast, toast, pipErrorDetailsDialog, sounds) {
            // if (toast.type && sounds['toast_' + toast.type]) {
            //     sounds['toast_' + toast.type].play();
            // }

            $scope.message = toast.message;
            $scope.actions = toast.actions;
            $scope.toast = toast;
            if(toast.actions.length == 0 ){
                $scope.actionLenght = 0;
            } else{
                if(toast.actions.length == 1 ){
                    $scope.actionLenght = toast.actions[0].toString().length;
                } else {
                    $scope.actionLenght = null;
                }

            }
            console.log($scope.actionLenght);

            $scope.onDetails =  function(event) {
                $mdToast.hide();
                pipErrorDetailsDialog.show(
                    {
                        error: $scope.toast.error,
                        ok: 'Ok'
                    },
                    function () {
                        console.log('You agreed');
                    },
                    function () {
                        console.log('You disagreed');
                    }
                );
            };

            $scope.onAction = function (action) {
                $mdToast.hide({ action: action });
            };
        }]
    );

    thisModule.service('pipToasts', 
        ['$rootScope', '$mdToast', 'pipAssert', function ($rootScope, $mdToast, pipAssert) {
            var 
                SHOW_TIMEOUT = 20000,
                SHOW_TIMEOUT_NOTIFICATIONS = 20000,
                toasts = [], 
                currentToast,
                sounds = {};

            /** pre-load sounds for notifications */
            // sounds['toast_error'] = ngAudio.load('sounds/fatal.mp3');
            // sounds['toast_notification'] = ngAudio.load('sounds/error.mp3');
            // sounds['toast_message'] = ngAudio.load('sounds/warning.mp3');

            // Remove error toasts when page is changed
            $rootScope.$on('$stateChangeSuccess', onStateChangeSuccess);
            $rootScope.$on('pipSessionClosed', onClearToasts);

            return {
                showNotification: showNotification,
                showMessage: showMessage,
                showError: showError,
                hideAllToasts: hideAllToasts,
                clearToasts: clearToasts,
                removeToastsById: removeToastsById,
                getToastById: getToastById
            };

            //---------------------------

            // Take the next from queue and show it
            function showNextToast() {
                if (toasts.length > 0) {
                    var toast = toasts[0];
                    toasts.splice(0, 1);
                    showToast(toast);
                }
            }
    
            // Show toast
            function showToast(toast) {
                currentToast = toast;
    
                $mdToast.show({
                    templateUrl: 'toast/toast.html',
                    hideDelay: toast.duration || SHOW_TIMEOUT,
                    position: 'bottom left',
                    controller: 'pipToastController',
                    locals: {
                        toast: currentToast,
                        sounds: sounds
                    }
                })
                .then(
                    function showToastOkResult(action) {
                        if (currentToast.successCallback) {
                            currentToast.successCallback(action);
                        }
                        currentToast = null;
                        showNextToast();
                    }, 
                    function showToastCancelResult(action) {
                        if (currentToast.cancelCallback) {
                            currentToast.cancelCallback(action);
                        }
                        currentToast = null;
                        showNextToast();
                    }
                );
            }
    
            function addToast(toast) {

                if (currentToast && toast.type !='error')
                    toasts.push(toast);
                else showToast(toast);
            }
    
            function removeToasts(type) {
                var result = [];
                _.each(toasts, function (toast) {
                    if (!toast.type || toast.type != type)
                        result.push(toast);
                });
                toasts = _.cloneDeep(result);
            }

            function removeToastsById(id) {
                _.remove(toasts, {id: id});
            }

            function getToastById(id) {
                return _.find(toasts, {id: id});
            }
    
            function onStateChangeSuccess(event, toState, toParams, fromState, fromParams) {
                toasts = _.reject(toasts, function(toast) {
                    return toast.type == 'error'; 
                });

                if (currentToast && currentToast.type == 'error') {
                    $mdToast.cancel();
                    showNextToast();
                }
            }

            function onClearToasts(event) {
                clearToasts();
            }
    
            // Show new notification toast at the top right
            function showNotification(message, actions, successCallback, cancelCallback, id) {
                pipAssert.isDef(message, 'pipToasts.showNotification: message should be defined');
                pipAssert.isString(message, 'pipToasts.showNotification: message should be a string');
                pipAssert.isArray(actions || [], 'pipToasts.showNotification: actions should be an array');
                if (successCallback) pipAssert.isFunction(successCallback, 'pipToasts.showNotification: successCallback should be a function');
                if (cancelCallback) pipAssert.isFunction(cancelCallback, 'pipToasts.showNotification: cancelCallback should be a function');

                addToast({
                    id: id || null,
                    type: 'notification',
                    message: message,
                    actions: actions || ['ok'],
                    successCallback: successCallback,
                    cancelCallback: cancelCallback,
                    duration: SHOW_TIMEOUT_NOTIFICATIONS
                });
            }

            // Show new message toast at the top right
            function showMessage(message, successCallback, cancelCallback, id) {
                pipAssert.isDef(message, 'pipToasts.showMessage: message should be defined');
                pipAssert.isString(message, 'pipToasts.showMessage: message should be a string');
                if (successCallback) pipAssert.isFunction(successCallback, 'pipToasts.showMessage: successCallback should be a function');
                if (cancelCallback) pipAssert.isFunction(cancelCallback, 'pipToasts.showMessage: cancelCallback should be a function');

                addToast({
                    id: id || null,
                    type: 'message',
                    message: message,
                    actions: ['ok'],
                    successCallback: successCallback,
                    cancelCallback: cancelCallback
                });
            }

            // Show error toast at the bottom right after error occured
            function showError(message, successCallback, cancelCallback, id, error) {
                pipAssert.isDef(message, 'pipToasts.showError: message should be defined');
                pipAssert.isString(message, 'pipToasts.showError: message should be a string');
                if (successCallback) pipAssert.isFunction(successCallback, 'pipToasts.showError: successCallback should be a function');
                if (cancelCallback) pipAssert.isFunction(cancelCallback, 'pipToasts.showError: cancelCallback should be a function');

                addToast({
                    id: id || null,
                    error: error,
                    type: 'error',
                    message: message,
                    actions: ['ok'],
                    successCallback: successCallback,
                    cancelCallback: cancelCallback
                });
            }

            // Hide and clear all toast when user signs out
            function hideAllToasts() {
                $mdToast.cancel();
                toasts = [];
            }

            // Clear toasts by type
            function clearToasts(type) {
                if (type) {
                    pipAssert.isString(type, 'pipToasts.clearToasts: type should be a string');

                    removeToasts(type);
                } else {
                    $mdToast.cancel();
                    toasts = [];
                }
            }
        }]
    );

})();

/**
 * @file Toggle buttons control
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global _, angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipToggleButtons", ['pipBasicControls.Templates']);

    thisModule.directive('pipToggleButtons',
        function () {
            return {
                restrict: 'EA',
                scope: {
                    ngDisabled: '&',
                    buttons: '=pipButtons',
                    currentButtonValue: '=ngModel',
                    currentButton: '=?pipButtonObject',
                    change: '&ngChange'
                },
                templateUrl: 'toggle_buttons/toggle_buttons.html',
                controller: 
                    ['$scope', '$element', '$attrs', '$mdMedia', '$timeout', function ($scope, $element, $attrs, $mdMedia, $timeout) {
                        $scope.$mdMedia = $mdMedia;
                        $scope.class = $attrs.class || '';

                        if (!$scope.buttons || (_.isArray($scope.buttons) && $scope.buttons.length === 0)) {
                            $scope.buttons = [];
                            console.error('PipToggleButtons: attribute pipButtons should take array of buttons');
                        }

                        var index = _.indexOf($scope.buttons, _.find($scope.buttons, {id: $scope.currentButtonValue}));
                        $scope.currentButtonIndex = index < 0 ? 0 : index;
                        $scope.currentButton = $scope.buttons.length > 0 ? $scope.buttons[$scope.currentButtonIndex] : $scope.currentButton;

                        $scope.buttonSelected = function (index, $event) {
                            if ($scope.disabled()) return;

                            $scope.currentButtonIndex = index;
                            $scope.currentButton = $scope.buttons[$scope.currentButtonIndex];
                            $scope.currentButtonValue = $scope.currentButton.id || index;

                            $timeout(function() {
                                $scope.$apply();

                                if ($scope.change) {
                                    $scope.change();
                                }
                            });
                        };

                        $scope.enterSpacePress = function (event) {
                            $scope.buttonSelected(event.index);
                        };

                        $scope.disabled = function () {
                            if ($scope.ngDisabled) {
                                return $scope.ngDisabled();
                            }
                        };
                    }],
                link:
                    function (scope, elem, attr) {
                        elem
                            .on('focusin', function () {
                                elem.addClass('focused-container');
                            })
                            .on('focusout', function () {
                                elem.removeClass('focused-container')
                            })
                }
            };
        }
    );

})();
//# sourceMappingURL=pip-webui-controls.js.map
