/**
 * @file Registration of pictures WebUI controls
 * @copyright Digital Living Software Corp. 2014-2015
 */

/* global angular */

(function () {
    'use strict';

    angular.module('pipPictures', [        
        'pipAddImage',
        'pipAvatar',
        'pipAvatarEdit',
        'pipPicture',
        'pipPictureEdit',
        'pipCollage',
        'pipPictureListEdit',        
        'pipCameraDialog',        
        'pipPictureUrlDialog'
    ]);
    
})();



(function(module) {
try {
  module = angular.module('pipPictures.Templates');
} catch (e) {
  module = angular.module('pipPictures.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('add_image/add_image.html',
    ' <!--\n' +
    '@file Add image directive content\n' +
    '@copyright Digital Living Software Corp. 2014-2015\n' +
    '-->\n' +
    '\n' +
    '<md-menu>\n' +
    '        <ng-transclude class="pip-add-image-open-button" ng-click="ngDisabled() ? \'\' : $mdOpenMenu()"></ng-transclude>\n' +
    '        <md-menu-content width="4">\n' +
    '            <md-menu-item>\n' +
    '                <md-button layout="row" layout-align="start center" accept="image/*"\n' +
    '                           ng-keydown="onKeyDown($event)" ng-multiple="isMulti()"\n' +
    '                           ng-file-select ng-file-change="onFileChange($files)" ng-click="hideMenu()" ng-file-drop>\n' +
    '\n' +
    '                    <md-icon class="text-headline text-grey rm24-flex" md-svg-icon="icons:folder"></md-icon>\n' +
    '                    <!--<span class="icon-folder text-headline text-grey tp8 rm24-flex"></span>-->\n' +
    '                    <span class="text-grey">{{::\'FILE\' | translate}}</span>\n' +
    '                </md-button>\n' +
    '            </md-menu-item>\n' +
    '            <md-menu-item>\n' +
    '                <md-button layout="row" layout-align="start center" ng-click="onWebLinkClick()">\n' +
    '                    <md-icon class="text-headline text-grey rm24-flex" md-svg-icon="icons:weblink"></md-icon>\n' +
    '                    <!--<span class="icon-weblink text-headline text-grey tp8 rm24-flex"></span>-->\n' +
    '                    <span class="text-grey">{{::\'WEB_LINK\' | translate}}</span>\n' +
    '                </md-button>\n' +
    '            </md-menu-item>\n' +
    '            <md-menu-item>\n' +
    '                <md-button layout="row" layout-align="start center" ng-click="onCameraClick()">\n' +
    '                    <md-icon class="text-headline text-grey rm24-flex" md-svg-icon="icons:camera"></md-icon>\n' +
    '                    <!--<span class="icon-camera text-headline text-grey tp8 rm24-flex"></span>-->\n' +
    '                    <span class="text-grey">{{::\'CAMERA\' | translate}}</span>\n' +
    '                </md-button>\n' +
    '            </md-menu-item>\n' +
    '            <md-menu-item>\n' +
    '                <md-button layout="row" layout-align="start center" ng-click="onGalleryClick()">\n' +
    '                    <md-icon class="text-headline text-grey rm24-flex" md-svg-icon="icons:images"></md-icon>\n' +
    '                    <!--<span class="icon-images text-headline text-grey tp8 rm24-flex"></span>-->\n' +
    '                    <span class="text-grey">{{::\'IMAGE_GALLERY\' | translate}}</span>\n' +
    '                </md-button>\n' +
    '            </md-menu-item>\n' +
    '        </md-menu-content>\n' +
    '    </md-menu>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipPictures.Templates');
} catch (e) {
  module = angular.module('pipPictures.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('camera_dialog/camera_dialog.html',
    '<!--\n' +
    '@file Camera dialog content\n' +
    '@copyright Digital Living Software Corp. 2014-2015\n' +
    '-->\n' +
    '\n' +
    '<md-dialog class="pip-dialog pip-picture-dialog pip-camera-dialog" layout="column" md-theme="{{theme}}"\n' +
    '           ng-show="browser != \'android\'"\n' +
    '        ng-class="{\'pip-android-dialog\': browser == \'android\' || !browser}">\n' +
    '    <div class="pip-header"  layout="row" layout-align="start center">\n' +
    '        <md-button  ng-click="onCancelClick()" class="md-icon-button"\n' +
    '                    aria-label="{{ ::\'CANCEL\' | translate }}">\n' +
    '            <md-icon class="text-grey" md-svg-icon="icons:arrow-left"></md-icon>\n' +
    '        </md-button>\n' +
    '        <h3 class="m0 text-title">{{ ::\'TAKE_PICTURE\' | translate }}</h3>\n' +
    '    </div>\n' +
    '\n' +
    '    <div class="pip-body">\n' +
    '        <div class="camera-stream" ng-hide="webCamError || browser == \'android\'"></div>\n' +
    '        <div class="camera-error"\n' +
    '             ng-show="webCamError || browser == \'android\'"\n' +
    '             layout="row" layout-align="center center">\n' +
    '            <span>{{ ::\'WEB_CAM_ERROR\' | translate }}</span>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '\n' +
    '    <div class="pip-footer">\n' +
    '        <div class="w48">\n' +
    '            <md-button ng-click="onResetPicture()"\n' +
    '                       ng-hide="!$freeze || webCamError"\n' +
    '                       class="md-icon-button"\n' +
    '                       ng-disabled="transaction.busy()"\n' +
    '                       aria-label="{{ ::\'REMOVE_PICTURE\' | translate }}">\n' +
    '                <md-icon class="text-grey" md-svg-icon="icons:refresh"></md-icon>\n' +
    '            </md-button>\n' +
    '        </div>\n' +
    '        <div flex></div>\n' +
    '        <div class="w48">\n' +
    '            <md-button ng-click="onTakePictureClick()"\n' +
    '                       ng-hide="webCamError"\n' +
    '                       class="md-icon-button"\n' +
    '                       aria-label="{{ ::\'TAKE_PICTURE\' | translate }}">\n' +
    '                <md-icon class="text-grey icon-button" md-svg-icon="icons:{{$freeze ? \'check\' : \'camera\'}}"></md-icon>\n' +
    '            </md-button>\n' +
    '\n' +
    '        </div>\n' +
    '        <div flex></div>\n' +
    '        <div class="w48">\n' +
    '            <md-button  ng-click="onCancelClick()" class="md-icon-button"\n' +
    '                        aria-label="{{ ::\'CANCEL\' | translate }}">\n' +
    '                <md-icon class="text-grey" md-svg-icon="icons:cross"></md-icon>\n' +
    '            </md-button>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '\n' +
    '</md-dialog>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipPictures.Templates');
} catch (e) {
  module = angular.module('pipPictures.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('gallery_search_dialog/gallery_search_dialog.html',
    '<md-dialog class="pip-dialog pip-gallery-search-dialog pip-picture-dialog"\n' +
    '           layout="column"  md-theme="{{theme}}">\n' +
    '    <md-progress-linear\n' +
    '            ng-show="transaction.busy()" md-mode="indeterminate">\n' +
    '    </md-progress-linear>\n' +
    '\n' +
    '    <md-dialog-content class="pip-body lp0 rp0 tp0 pip-scroll" layout="row" flex  >\n' +
    '        <div layout="column" layout-align="start start" flex>\n' +
    '            <div class="pip-header w-stretch" layout="column" layout-align="start start">\n' +
    '                <h3 class="w-stretch text-title m0 bp8">\n' +
    '                    <md-button  class="md-icon-button m0"\n' +
    '                                ng-click="onCancelClick()"\n' +
    '                                aria-label="{{ ::\'CANCEL\' | translate }}">\n' +
    '                        <md-icon class="text-grey" md-svg-icon="icons:arrow-left"></md-icon>\n' +
    '                    </md-button>\n' +
    '                    {{::\'IMAGE_GALLERY\' | translate}}\n' +
    '                </h3>\n' +
    '                <div class="w-stretch divider-bottom " layout="row" layout="start center">\n' +
    '                    <input class="no-divider rm8 text-subhead1" flex\n' +
    '                           ng-disabled="transaction.busy()"\n' +
    '                           ng-model="$search" ng-keypress="onKeyPress($event)"\n' +
    '                           placeholder="{{::\'SEARCH_PICTURES\' | translate}}"\n' +
    '                           type="text" tabindex="1">\n' +
    '\n' +
    '                    <md-button class="md-icon-button md-icon-button-square p0 pip-search-button md-primary"\n' +
    '                               ng-click="onSearchClick()"\n' +
    '                               ng-hide="optionDefault"\n' +
    '                               tabindex="-1" aria-label="SEARCH">\n' +
    '                        <md-icon class="text-opacity md-primary" md-svg-icon="icons:search-square "></md-icon>\n' +
    '                    </md-button>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <div class="pip-content" flex\n' +
    '                 ng-show="$images.length > 0">\n' +
    '                <div class="pip-image-container"\n' +
    '                     ng-click="onImageClick(image)"\n' +
    '                     ng-repeat="image in $images track by $index"\n' +
    '                     ng-class="{\'checked\': image.checked}"\n' +
    '                     tabindex="{{ $index + 2 }}">\n' +
    '\n' +
    '                    <pip-picture pip-src="image.thumbnail"\n' +
    '                                 pip-default-icon="icon-images"\n' +
    '                                 pip-rebind="true">\n' +
    '                    </pip-picture>\n' +
    '                    <div class="pip-checked-cover"></div>\n' +
    '                    <div class="pip-checkbox-backdrop">\n' +
    '                        <md-checkbox md-no-ink\n' +
    '                                     ng-model="image.checked"\n' +
    '                                     ng-click="image.checked = !image.checked"\n' +
    '                                     aria-label="CHECKED">\n' +
    '                        </md-checkbox>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <div class="pip-no-images w-stretch" layout="column" layout-align="center center" flex\n' +
    '                 ng-show="$images.length == 0">\n' +
    '                <img src="images/add_from_image_library.svg" width="200" height="200">\n' +
    '                <p class="text-secondary opacity-secondary text-center">{{\'IMAGE_START_SEARCH\' | translate}}</p>\n' +
    '                <!--<md-icon class="text-grey" md-svg-icon="icons:images"></md-icon> -->\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </md-dialog-content>\n' +
    '    <div class="pip-footer">\n' +
    '        <md-button  ng-click="onCancelClick()"\n' +
    '                    ng-hide="transaction.busy()"\n' +
    '                    aria-label="{{ ::\'CANCEL\' | translate }}"\n' +
    '                    tabindex="{{ $images.length + 3 }}">\n' +
    '                <span class="text-grey">\n' +
    '                    {{ ::\'CANCEL\' | translate }}\n' +
    '                </span>\n' +
    '        </md-button>\n' +
    '        <md-button ng-if="transaction.busy()" ng-click="onStopSearchClick()" class="md-raised md-warn m0"\n' +
    '                   tabindex="5" aria-label="ABORT"\n' +
    '                   pip-test="button-cancel">\n' +
    '            {{::\'CANCEL\' | translate}}\n' +
    '        </md-button>\n' +
    '        <md-button  class="md-accent"\n' +
    '                    ng-hide="transaction.busy()"\n' +
    '                    ng-disabled="addButtonDisabled()"\n' +
    '                    ng-click="onAddClick()"\n' +
    '                    aria-label="{{ ::\'ADD\' | translate }}"\n' +
    '                    tabindex="{{ $images.length + 4 }}">\n' +
    '\n' +
    '            {{ ::\'ADD\' | translate }}\n' +
    '        </md-button>\n' +
    '    </div>\n' +
    '</md-dialog>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipPictures.Templates');
} catch (e) {
  module = angular.module('pipPictures.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('picture_edit/picture_edit.html',
    '<div class="pip-picture-upload pip-picture-drop md-focused"\n' +
    '	 ng-keydown="onKeyDown($event)"\n' +
    ' 	 tabindex="{{ ngDisabled() || control.uploading ? -1 : 0 }}"\n' +
    '	 pip-changed="readItemLocally(url, file)"\n' +
    '	 ng-disabled="ngDisabled()"\n' +
    '	 pip-multi="false"\n' +
    '	 ng-focus="onFocus()"\n' +
    '	 ng-blur="onBlur()"\n' +
    '	 pip-add-image>\n' +
    '\n' +
    '	<div class="pip-default-icon" ng-show="empty()">\n' +
    '		<md-icon  class="pip-picture-icon" md-svg-icon="icons:{{icon}}"></md-icon>\n' +
    '	</div>\n' +
    '	<div class="pip-default-text" ng-show="empty()">\n' +
    '		<span>{{text | translate}}</span>\n' +
    '	</div>\n' +
    '\n' +
    '	<img class="pip-picture-image"\n' +
    '		 ng-src="{{control.url}}"\n' +
    '		 ng-show="!empty()"\n' +
    '		 ng-class="{ \'pip-image-new\': isUpdated(), \'cursor-default\' : ngDisabled() || control.uploading }"\n' +
    ' 		 ui-event="{ error: \'onImageError($event)\', load: \'onImageLoad($event)\' }">\n' +
    '\n' +
    '	<md-button class="md-icon-button"\n' +
    '			   ng-click="onDeleteClick($event)"\n' +
    '			   tabindex="-1" aria-label="delete"\n' +
    '			   ng-hide="empty() || ngDisabled()"\n' +
    '			   ng-disabled="ngDisabled() || control.uploading">\n' +
    '		<md-icon  md-svg-icon="icons:cross"></md-icon>\n' +
    '	</md-button>\n' +
    '\n' +
    '	<md-progress-linear ng-show="control.uploading"\n' +
    '						ng-value="control.progress">\n' +
    '	</md-progress-linear>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('pipPictures.Templates');
} catch (e) {
  module = angular.module('pipPictures.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('picture_list_edit/picture_list_edit.html',
    '<div pip-focused>\n' +
    '	<div class="pip-picture-upload pointer pip-focusable"\n' +
    '		 ng-class="{\'pip-picture-error\': item.error}"\n' +
    '		 ng-keydown="onKeyDown($event, item)"\n' +
    '		 tabindex="{{ ngDisabled() ? -1 : 0 }}"\n' +
    '		 ng-repeat="item in control.items | filter: filterItem">\n' +
    '\n' +
    '		<div class="pip-default-icon" ng-hide="item.loaded || item.error">\n' +
    '			<md-icon  pip-cancel-drag="true" class="pip-picture-icon" md-svg-icon="icons:{{icon}}"></md-icon>\n' +
    '		</div>\n' +
    '		<div class="pip-default-text" ng-show="item.error">\n' +
    '			<!--span style="color: red">{{ \'ERROR_IMAGE_PRELOADING\' | translate}}</span-->\n' +
    '			<md-icon  pip-cancel-drag="true" md-svg-icon="icons:warn-circle"></md-icon>\n' +
    '		</div>\n' +
    '		<img ng-src="{{::item.url}}"\n' +
    '			 pip-cancel-drag="true"\n' +
    '			 ng-hide="item.error"\n' +
    '			 ng-class="{ \'pip-image-new\': item.state == \'added\' }"\n' +
    '			 ui-event="{ error: \'onImageError($event, item)\', load: \'onImageLoad($event, item)\' }">\n' +
    '\n' +
    '		<md-button ng-click="onDeleteClick(item)"\n' +
    '				   ng-disabled="ngDisabled() || control.uploading" tabindex="-1"\n' +
    '				   aria-label="delete"\n' +
    '				   class="md-icon-button">\n' +
    '\n' +
    '			<md-icon  pip-cancel-drag="true" md-svg-icon="icons:cross"></md-icon>\n' +
    '		</md-button>\n' +
    '		<md-progress-linear md-mode="indeterminate" ng-show="item.uploading" value="{{ item.progress }}">\n' +
    '		</md-progress-linear>\n' +
    '	</div>\n' +
    '\n' +
    '	<button class="pip-picture-upload pip-picture-drop pip-focusable"\n' +
    '			pip-add-image\n' +
    '		    ng-focus="onFocus()"\n' +
    '	        ng-blur="onBlur()"\n' +
    '			pip-changed="readItemLocally(url, file)"\n' +
    '			ng-disabled="ngDisabled() || control.uploading">\n' +
    '\n' +
    '		<div class="pip-default-icon">\n' +
    '			<md-icon  pip-cancel-drag="true" class="pip-picture-icon" md-svg-icon="icons:{{icon}}"></md-icon>\n' +
    '		</div>\n' +
    '		<div class="pip-default-text">\n' +
    '			<span>{{text | translate}}</span>\n' +
    '		</div>\n' +
    '	</button>\n' +
    '	<div class="clearfix"></div>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('pipPictures.Templates');
} catch (e) {
  module = angular.module('pipPictures.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('picture_url_dialog/picture_url_dialog.html',
    '<!--\n' +
    '@file Picture URL dialog content\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '\n' +
    '<md-dialog class="pip-dialog pip-picture-url-dialog pip-picture-dialog"\n' +
    '           layout="column" md-theme="{{theme}}">\n' +
    '\n' +
    '    <md-dialog-content class="pip-body lp0 rp0 tp0 pip-scroll">\n' +
    '        <div class="pip-header bm16"  layout="row" layout-align="start center">\n' +
    '            <md-button  ng-click="onCancelClick()" class="md-icon-button lm0"\n' +
    '                        aria-label="{{ ::\'CANCEL\' | translate }}">\n' +
    '                <md-icon class="text-grey" md-svg-icon="icons:arrow-left"></md-icon>\n' +
    '            </md-button>\n' +
    '            <h3 class="text-title m0">\n' +
    '                {{ ::\'PICTURE_FROM_WEBLINK\' | translate}}\n' +
    '            </h3>\n' +
    '        </div>\n' +
    '\n' +
    '        <div class="pip-content">\n' +
    '            <md-input-container md-no-float class="w-stretch text-subhead1">\n' +
    '                <input type="text" ng-model="url" ng-change="checkUrl()" placeholder="{{:: \'LINK_PICTURE\' | translate}}"/>\n' +
    '            </md-input-container>\n' +
    '\n' +
    '            <div class="w-stretch"\n' +
    '                 ng-hide="invalid"\n' +
    '                 layout="row" layout-align="center center">\n' +
    '                <img id="url_image"/>\n' +
    '            </div>\n' +
    '\n' +
    '            <div class="pip-no-images" ng-show="invalid"\n' +
    '                 layout="row" layout-align="center center">\n' +
    '                <md-icon class="text-grey" md-svg-icon="icons:images"></md-icon>\n' +
    '            </div>\n' +
    '\n' +
    '        </div>\n' +
    '    </md-dialog-content>\n' +
    '    <div class="pip-footer">\n' +
    '        <md-button ng-click="onCancelClick()" aria-label="{{ ::\'CANCEL\' | translate }}">\n' +
    '            {{ ::\'CANCEL\' | translate }}\n' +
    '        </md-button>\n' +
    '\n' +
    '        <md-button class="md-accent" ng-click="onAddClick()" ng-disabled="invalid"\n' +
    '                   aria-label="{{ ::\'ADD\' | translate }}">\n' +
    '            {{ ::\'ADD\' | translate }}\n' +
    '        </md-button>\n' +
    '    </div>\n' +
    '</md-dialog>');
}]);
})();

/**
 * @file Add image control
 * @copyright Digital Living Software Corp. 2014-2015
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipAddImage", ['pipCameraDialog', 'pipPictureUrlDialog', 'pipGallerySearchDialog', 'pipCore']);

    thisModule.config(['pipTranslateProvider', function(pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            'FILE' : 'Upload pictures',
            'WEB_LINK' : 'Use web link',
            'CAMERA' : 'Take photo',
            'IMAGE_GALLERY': 'Use image library',
        });
        pipTranslateProvider.translations('ru', {
            'FILE' : 'Загрузить картинку',
            'WEB_LINK' : 'Вставить веб ссылка',
            'CAMERA' : 'Использовать камеру',
            'IMAGE_GALLERY': 'Открыть галерею изображений'
        });
    }]);

    thisModule.directive('pipAddImage', 
        function() {
            return {
                restrict: 'AC',
                scope: {
                    $images: '=pipImages',
                    onChange: '&pipChanged',
                    multi: '&pipMulti',
                    ngDisabled: '&'
                },
                transclude: true,
                templateUrl: 'add_image/add_image.html',
                controller: 'pipAddImageController'
            }
        }
    );

    thisModule.controller('pipAddImageController',
        ['$scope', '$element', '$mdMenu', '$timeout', 'pipCameraDialog', 'pipPictureUrlDialog', 'pipGallerySearchDialog', 'pipUtils', function ($scope, $element, $mdMenu, $timeout, pipCameraDialog, pipPictureUrlDialog, pipGallerySearchDialog, pipUtils) {

            $scope.hideMenu = hideMenu;
            $scope.onFileChange = onFileChange;
            $scope.onWebLinkClick = onWebLinkClick;
            $scope.onCameraClick = onCameraClick;
            $scope.onGalleryClick = onGalleryClick;
            $scope.isMulti = isMulti;

            $element.click(function () {
                if (!$scope.ngDisabled()) openMenu();
            });

            return;

            function openMenu() {
                $($element).find('.pip-add-image-open-button').scope().$mdOpenMenu();
            }

            function isMulti() {
                if ($scope.multi() !== undefined)
                    return  pipUtils.toBoolean($scope.multi());
                else return true;
            }

            function hideMenu () {
                $mdMenu.hide();
            }

            function dataURItoBlob(dataURI) {
                var byteString;
                
                if (dataURI.split(',')[0].indexOf('base64') >= 0)
                    byteString = atob(dataURI.split(',')[1]);
                else
                    byteString = unescape(dataURI.split(',')[1]);

                var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

                var ia = new Uint8Array(byteString.length);
                for (var i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }

                return new Blob([ia], {type:mimeString});
            }

            function addImages(images) {

                if (images === undefined) return;

                if (Array.isArray(images)) {
                    images.forEach(function (img) {
                        if ($scope.onChange)
                            $scope.onChange({url: img.url, file: img.file});
                    });
                } else {
                    if ($scope.onChange)
                        $scope.onChange({url: images.url, file: images.file});
                }

                if ($scope.$images === undefined || !Array.isArray($scope.$images))
                    return;

                if (Array.isArray(images)) {
                    images.forEach(function (img) {
                        $scope.$images.push(img.url);
                    });
                } else {
                    $scope.$images.push(images.url);
                }
            }

            // Process user actions

            function onFileChange ($files) {
                if ($files == null || $files.length == 0)
                    return;

                $files.forEach(function (file) {
                    if (file.type.indexOf('image') > -1) {
                        $timeout(function() {
                            var fileReader = new FileReader();
                            fileReader.readAsDataURL(file);
                            fileReader.onload = function(e) {
                                $timeout(function() {
                                    addImages({url: e.target.result, file: file});
                                });
                            }
                        });
                    }
                });

            }

            function onWebLinkClick () {
                pipPictureUrlDialog.show(function (result) {
                    var blob = null;
                    if (result.substring(0, 10) == 'data:image') {
                        blob = dataURItoBlob(result);
                        blob.name = result.slice(result.lastIndexOf('/') + 1, result.length).split('?')[0];
                    }
                    addImages({url: result, file: blob});
                });
            }

            function onCameraClick () {
                pipCameraDialog.show(function (result) {
                  var blob = dataURItoBlob(result);

                    blob.name = 'camera';
                    addImages({url: result, file: blob});
                });
            }

            function onGalleryClick () {
                pipGallerySearchDialog.show(function (result) {
                    var imgs = [];
                    result.forEach(function (url) {
                        imgs.push({url: url, file: null});
                    });
                    addImages(imgs);
                }, $scope.isMulti());
            }
    }]);

})();



/**
 * @file Avatar control
 * @copyright Digital Living Software Corp. 2014-2015
 * @todo
 * - Improve samples in sampler app
 * - Replace placeholder with default image generated on server
 * - Fix resizing problem
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipAvatar", ['pipCore', 'pipRest', 'pipImageUtils']);

    thisModule.directive('pipAvatar',
        function () {
            return {
                restrict: 'EA',
                scope: false,
                template: '<md-icon></md-icon><img/>'
                + '<div><md-icon class="default_icon" id="icon-film" md-svg-icon="icons:film"></md-icon>'
                + '<md-icon class="default_icon" id="icon-task" md-svg-icon="icons:task"></md-icon>'
                + '<md-icon class="default_icon" id="icon-folder" md-svg-icon="icons:folder"></md-icon></div>',
                controller: 'pipAvatarController'
            }
        }
    );

    thisModule.controller('pipAvatarController',
        ['$scope', '$rootScope', '$element', '$attrs', '$parse', 'pipUtils', 'pipStrings', 'pipRest', '$http', 'pipImageUtils', function ($scope, $rootScope, $element, $attrs, $parse, pipUtils, pipStrings, pipRest, $http, pipImageUtils) {
            var
                $svg = $element.children('md-icon'),
                $image = $element.children('img'),
                $defaultBlock = $element.children('div'),
                $iconFilm = $element.find('#icon-film'),
                $iconTask = $element.find('#icon-task'),
                $iconFolder = $element.find('#icon-folder'),
                image = null,

                partyIdGetter = $parse($attrs.pipPartyId),
                partyNameGetter = $parse($attrs.pipPartyName),
                typeGetter = $parse($attrs.pipEntityType),
                idGetter = $parse($attrs.pipId),

                colors = pipImageUtils.getAvatarColors(),
                colorClasses = pipImageUtils.getColorClasses(),
                entityTypes = pipImageUtils.getEntityTypes();

            // When image is loaded resize/reposition it
            $image.load(function ($event) {
                image = $($event.target);
                pipImageUtils.setImageMarginCSS($element, image);
            });

            // Add class
            $element.addClass('pip-avatar flex-fixed');

            if ($attrs.ngClass) {
                $scope.$watch($attrs.ngClass, function () {
                    setTimeout(function () {
                        pipImageUtils.setImageMarginCSS($element, image);
                    }, 50);
                });
            }

            // Optimization to avoid binding
            bindControl();

            if (pipUtils.toBoolean($attrs.pipRebindAvatar)) {
                $rootScope.$on('pipPartyAvatarUpdated', refreshAvatar);
            }

            // Also optimization to avoid watch if it is unnecessary
            if (pipUtils.toBoolean($attrs.pipRebind)) {
                $scope.$watch(partyIdGetter, function (newValue, oldValue) {
                    if (oldValue !== newValue)
                        bindControl();
                });

                $scope.$watch(idGetter, function (newValue, oldValue) {
                    if (oldValue !== newValue)
                        bindControl();
                });
            }

            return;

            function refreshAvatar() {
                $iconTask.css('display', 'none');
                $iconFilm.css('display', 'none');
                $iconFolder.css('display', 'none');
                $defaultBlock.css('display', 'none');
                $image.attr('src', '');
                $svg.css('display', 'none');
                $image.css('display', 'inline-block');
                bindControl();
            };

            function bindControl() {
                var
                    partyName = partyNameGetter($scope),
                    partyId = partyIdGetter($scope),
                    id = idGetter($scope),
                    type = typeGetter($scope);

                $iconTask.css('display', 'none');
                $iconFilm.css('display', 'none');
                $iconFolder.css('display', 'none');
                $defaultBlock.css('display', 'none');

                // Timestamp to avoid caching images for too long
                var url = pipImageUtils.getAvatarUrl(partyId, partyName, id, type, false, false);

                if ((type && id && partyId) || (partyId && partyName)) {
                    if (type && id && partyId) {
                        if (type == 'category') return;

                        if (entityTypes[type] == 'goals' || entityTypes[type] == 'areas' ) {
                            $image.attr('src', url);
                            $svg.css('display', 'none');
                            $image.css('display', 'inline-block');
                        } else {
                            $defaultBlock.css('display', 'block');
                            var colorClassIndex = pipStrings.hashCode(id) % colors.length;
                            $element.addClass(colorClasses[colorClassIndex]);
                            switch(type) {
                                case 'vision':
                                    $svg.css('display', 'none');
                                    $iconFilm.css('display', 'inline-block');
                                    $iconTask.css('display', 'none');
                                    $iconFolder.css('display', 'none');
                                    $image.css('display', 'none');
                                    break;
                                case 'event':
                                    $svg.css('display', 'none');
                                    $iconTask.css('display', 'inline-block');
                                    $iconFilm.css('display', 'none');
                                    $iconFolder.css('display', 'none');
                                    $image.css('display', 'none');
                                    break;
                                case 'note':
                                    $svg.css('display', 'none');
                                    $iconFolder.css('display', 'inline-block');
                                    $iconTask.css('display', 'none');
                                    $iconFilm.css('display', 'none');
                                    $image.css('display', 'none');
                                    break;
                            }
                        }
                    } else {
                        $image.attr('src', url);
                        $svg.css('display', 'none');
                        $image.css('display', 'inline-block');
                    }
                }
            };

        }]
    );

})();


/**
 * @file Avatar control
 * @copyright Digital Living Software Corp. 2014-2015
 * @todo
 * - Improve samples in sampler app
 * - Replace placeholder with default image generated on server
 * - Generate file url based on entity type, do not set it as full url via pipSrc
 */
 
/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipAvatarEdit", ['ui.event', 'angularFileUpload', 'pipPicturePaste', 'pipRest',
        'pipImageUtils', 'pipPictures.Templates']);

    thisModule.config(['pipTranslateProvider', function(pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            'PICTURE_EDIT_TEXT': 'Click here to upload a picture'
        });
        pipTranslateProvider.translations('ru', {
            'PICTURE_EDIT_TEXT': 'Нажмите сюда для загрузки картинки'
        });
    }]);

    thisModule.directive('pipAvatarEdit',
        function() {
            return {
                restrict: 'EA',
                scope: {
                    ngDisabled: '&',
                    pipPartyId: '&',
                    pipEntityType: '&',
                    pipId: '&',
                    pipCreated: '&',
                    pipChanged: '&',
                    pipReset: '&'
                },
                templateUrl: 'picture_edit/picture_edit.html',
                controller: 'pipAvatarEditController' 
            };
        }
    );

    thisModule.controller('pipAvatarEditController',
        ['$scope', '$element', '$attrs', '$http', '$upload', '$rootScope', 'pipPicturePaste', 'pipRest', 'pipImageUtils', function($scope, $element, $attrs, $http, $upload, $rootScope, pipPicturePaste, pipRest, pipImageUtils) {
            var 
                $control = $element.children('.pip-picture-upload'),
                $input = $control.children('input[type=file]'),
                entityTypes = pipImageUtils.getEntityTypes(),
                serverUrl = pipRest.serverUrl();
            
            $scope.text = $attrs.pipDefaultText || 'PICTURE_EDIT_TEXT'; 
            $scope.icon = $attrs.pipDefaultIcon || 'picture-no-border';
            $scope.control = {
                url: '',
                progress: 0,
                uploaded: false,
                uploading: false,
                loaded: false,

                file: null,
                state: 'original'
            };

            $scope.control.reset = reset;
            $scope.control.save = save;
            $scope.empty = empty;
            $scope.isUpdated = isUpdated;
            $scope.readItemLocally = readItemLocally;
            $scope.onDeleteClick = onDeleteClick;
            $scope.onKeyDown = onKeyDown;
            $scope.onImageError = onImageError;
            $scope.onImageLoad = onImageLoad;
            $scope.onChange = onChange;

            // Watching for changes
            $scope.$watch($scope.pipId, function(newValue) {
                if ($scope.pipReset() !== false)
                    $scope.control.reset();
            });

            $scope.$watch($scope.pipPartyId, function(newValue) {
                if ($scope.pipReset() !== false)
                    $scope.control.reset();
            });

            $scope.$watch($scope.ngDisabled, function(newValue) {
                $input.attr('disabled', $scope.control.disabled);
            });

            // Add paste listener
            $element.children('.pip-picture-upload').focus(function () {
                pipPicturePaste.addPasteListener(function (item) {
                    $scope.readItemLocally(item.url, item.file);
                });
            });

            $element.children('.pip-picture-upload').blur(function () {
                pipPicturePaste.removePasteListener();
            });

            // Add class
            $element.addClass('pip-picture-edit');

            // Execute callback
            if ($scope.pipCreated) {
                $scope.pipCreated({
                    $event: { sender: $scope.control },
                    $control: $scope.control
                });
            }

            // Initialize control
            $scope.control.reset();

            return;

            // --------------------------------

            // Utility functions

            function reset(afterDeleting) {
                $scope.control.progress = 0;
                $scope.control.uploading = false;
                $scope.control.uploaded = false;

                $scope.control.file = null;
                $scope.control.state = 'original';
                $scope.control.url = '';

                if (!afterDeleting) {
                    var url = pipImageUtils.getAvatarUrl($scope.pipPartyId(), '',
                        $scope.pipId(), $scope.pipEntityType(), false, true);

                    if (!url) return;

                    //pipImageUtils.addHttpHeaders();
                    $scope.control.progress = 0;

                    $scope.control.url = url;
                    $scope.control.uploaded = $scope.control.url != '';
                    $scope.onChange();

                } else $scope.onChange();
            };

            function generateUrl() {
                if ($scope.pipEntityType() && $scope.pipId() && $scope.pipPartyId()) {
                    return serverUrl + '/api/parties/' + $scope.pipPartyId() + '/'
                        + entityTypes[$scope.pipEntityType()] + '/' + $scope.pipId() + '/avatar';
                } else {
                    if ($scope.pipPartyId() && !$scope.pipEntityType()) {
                        if ($attrs.pipEntityType || $attrs.pipId)
                            return '';
                        return serverUrl + '/api/parties/' + $scope.pipPartyId()
                            + '/avatar';
                    }
                }

                return '';
            }

            function saveItemUrl() {
                var url = $scope.control.url,
                    FILE_URL = generateUrl();
                var name = url.slice(url.lastIndexOf('/') + 1, url.length).split('?')[0];

                return FILE_URL + '?name=' + name + '&url=' + url
            };

            function savePicture(successCallback, errorCallback) {
                var
                    control = $scope.control,
                    file = control.file;

                if ($scope.control.file !== null) {
                    var 
                        fileReader = new FileReader(),
                        FILE_URL = generateUrl();
                        
                    fileReader.onload = function (e) {
                        control.uploading = true;
                        var upload = $upload.http({
                                url: FILE_URL + '?name=' + file.name,
                                headers: { 'Content-Type': file.type },
                                data: e.target.result
                            })
                            .then(
                            function (response) {
                                control.reset();
                                if (successCallback) successCallback(response);
                            },
                            function (error) {
                                control.uploading = false;
                                control.upload = false;
                                control.progress = 0;

                                if (errorCallback) errorCallback(error);
                                else console.error(error);
                            },
                            function (e) {
                                // Math.min is to fix IE which reports 200% sometimes
                                control.progress = Math.min(100, parseInt(100.0 * e.loaded / e.total));
                            }
                        );
                    };

                    fileReader.readAsArrayBuffer(file);
                } else {
                     var url = saveItemUrl();
                     control.uploading = true;

                     $http['post'](url)
                         .success(function (response) {
                             control.reset();
 
                             if (successCallback) successCallback(response);
                         })
                         .error(function (error) {
                             control.uploading = false;
                             control.upload = false;

                             if (errorCallback) errorCallback(error);
                             else console.error(error);
                         });
                }
            };

            function deletePicture(successCallback, errorCallback) {
                var control = $scope.control;
                $http['delete'](generateUrl())
                .success(function (data) {
                    control.reset(true);

                    if (successCallback) successCallback();
                })
                .error(function (error) {
                    control.uploading = false;
                    control.upload = false;
                    control.progress = 0;
                    //$scope.$apply();

                    if (errorCallback) errorCallback(error);
                    else console.error(error);
                });
            };

            function save(successCallback, errorCallback) {
                // Process changes of the image
                if ($scope.control.state == 'changed') {
                    savePicture(successCallback, errorCallback);
                } 
                // Process deletion of the image
                else if ($scope.control.state == 'deleted') {
                    deletePicture(successCallback, errorCallback);
                }
                // Process if no changes were made 
                else {
                    if (successCallback) successCallback();                            
                }
            };


            // Visual functions
            function empty() {
                return $scope.control.url == '' && !$scope.control.uploading;
            };

            function isUpdated() {
                return $scope.control.state != 'original';
            };

            // Process user events

            function readItemLocally(url, file) {
                $scope.control.file = file;
                $scope.control.url = url;
                $scope.control.state = 'changed';
                $scope.onChange();
            };

            function onDeleteClick($event) {
                $event.stopPropagation();

                $control.focus();

                $scope.control.file = null;
                $scope.control.url = '';
                $scope.control.state = 'deleted';

                $scope.onChange();
            };

            function onKeyDown($event) {
                if ($event.keyCode == 13 || $event.keyCode == 32) {
                    setTimeout(function() {
                        $control.trigger('click');
                    }, 0);
                } else if ($event.keyCode == 46 || $event.keyCode == 8) {
                    $scope.control.file = null;
                    $scope.control.url = '';

                    $scope.control.state = 'deleted';

                    $scope.onChange();
                } else if ($event.keyCode == 27) {
                    $scope.control.reset();
                }
            };

            // Clean up url to remove broken icon
            function onImageError($event) {
                $scope.$apply(function() {
                    $scope.control.url = '';
                    var image = $($event.target);

                    pipImageUtils.setErrorImageCSS(image, {width: 'auto', height: '100%'});
                });
            };

            // When image is loaded resize/reposition it
            function onImageLoad($event) {
                var image = $($event.target);
                pipImageUtils.setImageMarginCSS({clientWidth: 80, clientHeight: 80}, image);
                $scope.control.uploading = false;
            };

            // On change event
            function onChange() {
                if ($scope.pipChanged) {
                    $scope.pipChanged({
                        $event: { sender: $scope.control },
                        $control: $scope.control
                    });
                }
            };
        }]        
    );
    
})();


/**
 * @file Camera dialog
 * @copyright Digital Living Software Corp. 2014-2015
 * @todo
 * - Add sample to sampler app
 */

/* global angular, Webcam */

(function () {
    'use strict';

    var thisModule = angular.module('pipCameraDialog',
        ['ngMaterial', 'pipCore', 'pipPictures.Templates']);

    thisModule.config(['pipTranslateProvider', function (pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            'TAKE_PICTURE': 'Take a picture',
            'WEB_CAM_ERROR': 'Webcam is missing or was not found'
        });
        pipTranslateProvider.translations('ru', {
            'TAKE_PICTURE': 'Сделать фото',
            'WEB_CAM_ERROR': 'Web-камера отсутствует или не найдена'
        });
    }]);

    thisModule.factory('pipCameraDialog',
        ['$mdDialog', function ($mdDialog) {
            return {
                show: function (successCallback) {
                    $mdDialog.show({
                        templateUrl: 'camera_dialog/camera_dialog.html',
                        clickOutsideToClose: true,
                        controller: 'pipCameraController'
                    }).then(function (result) {
                        Webcam.reset();
                        console.log(result);
                        if (successCallback) {
                            successCallback(result);
                        }
                    }, function () {
                        Webcam.reset();
                    });
                }
            };
        }]);

    thisModule.controller('pipCameraController',
        ['$scope', '$rootScope', '$timeout', '$mdMenu', '$mdDialog', 'pipUtils', function ($scope, $rootScope, $timeout, $mdMenu, $mdDialog, pipUtils) { // $cordovaCamera
            $scope.browser = pipUtils.getBrowser().os;
            $scope.theme = $rootScope.$theme;

            if ($scope.browser !== 'android') {
                console.log('webcam');
                Webcam.init();

                setTimeout(function () {
                    Webcam.attach('.camera-stream');
                }, 0);

                Webcam.on('error', function (err) {
                    $scope.webCamError = true;
                    console.error(err);
                });

                Webcam.set({
                    width: 400,
                    height: 300,

                    dest_width: 400,
                    dest_height: 300,

                    crop_width: 400,
                    crop_height: 300,

                    image_format: 'jpeg',
                    jpeg_quality: 90
                });

                //Webcam.setSWFLocation('../../../dist/webcam.swf');
                Webcam.setSWFLocation('webcam.swf');

            } else {
                document.addEventListener("deviceready",onDeviceReady,false);

            }
            // todo add logic in callbacks
            function onDeviceReady() {
                navigator.camera.getPicture(onSuccess, onFail,
                    {
                        sourceType: Camera.PictureSourceType.CAMERA,
                        correctOrientation: true,
                        quality: 75,
                        targetWidth: 200,
                        destinationType: Camera.DestinationType.DATA_URL
                    });
            }


            function onSuccess(imageData) {
                var picture = imageData;
                var picture = 'data:image/jpeg;base64,' + imageData;
                $mdDialog.hide(picture);
            }

            function onFail(message) {
                alert('Failed because: ' + message);
                $mdDialog.hide();
            }

            $scope.$freeze = false;

            $scope.onTakePictureClick = onTakePictureClick;
            $scope.onResetPicture = onResetPicture;
            $scope.onCancelClick = onCancelClick;

            return;

            function onTakePictureClick() {
                if (Webcam) {
                    if ($scope.$freeze) {
                        Webcam.snap(function (dataUri) {
                            $scope.$freeze = false;
                            $mdDialog.hide(dataUri);
                        });
                    } else {
                        $scope.$freeze = true;
                        Webcam.freeze();
                    }
                }
            };

            function onResetPicture() {
                $scope.$freeze = false;
                Webcam.unfreeze();
            };

            function onCancelClick() {
                $mdDialog.cancel();
            };
        }]
    );

})();
/**
 * @file Collage control
 * @copyright Digital Living Software Corp. 2014-2015
 * @todo
 * - Improve samples in sampler app
 * - Replace placeholder with default image generated on server
 * - Fix resizing problem
 */
 
/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipCollage", ['pipCore', 'pipRest']);

    thisModule.directive('pipCollage',
        function () {
            return {
                restrict: 'EA',
                scope: false,
                controller: 'pipCollageController' 
            }
        }
    );

    thisModule.controller('pipCollageController',
        ['$scope', '$element', '$attrs', '$parse', '$rootScope', 'pipUtils', 'pipStrings', 'pipRest', 'pipImageUtils', function ($scope, $element, $attrs, $parse, $rootScope, pipUtils, pipStrings, pipRest, pipImageUtils) {
            var                         
                pictureIdsGetter = $attrs.pipPictureIds ? $parse($attrs.pipPictureIds) : null,
                srcsGetter = $attrs.pipSrcs ? $parse($attrs.pipSrcs) : null,
                uniqueCodeGetter = $attrs.pipUniqueCode ? $parse($attrs.pipUniqueCode) : null,
                multipleGetter = $attrs.pipMultiple ? $parse($attrs.pipMultiple) : null,
                allowOpen = pipUtils.toBoolean($attrs.pipOpen),
                collageSchemes = pipImageUtils.getCollageSchemes(),
                resized = 0,
                $svgData = '<?xml version="1.0" encoding="utf-8"?>'+
                    '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'+
                    '<svg version="1.1"'+
                    'xmlns="http://www.w3.org/2000/svg"'+
                    'xmlns:xlink="http://www.w3.org/1999/xlink"'+
                    'x="0px" y="0px"'+
                    'viewBox="0 0 510 510"'+
                    'style="enable-background:new 0 0 515 515;"'+
                    'xml:space="preserve">'+
                    '<defs>'+
                    '<style type="text/css"><![CDATA['+
                    '#symbol-picture-no-border {'+
                    '        transform-origin: 50% 50%;'+
                    '        transform: scale(0.6, -0.6);'+
                    '    }'+
                    '        ]]></style>'+
                    '        </defs>'+
                    '<rect x="0" width="515" height="515"/>'+
                    '<path id="symbol-picture-no-border" d="M120 325l136-102 69 33 136-82 0-54-410 0 0 136z m341 15c0-28-23-51-51-51-29 0-52 23-52 51 0 29 23 52 52 52 28 0 51-23 51-52z" />'+
                    '</svg>';

            // Add class
            $element.addClass('pip-collage');

            // Also optimization to avoid watch if it is unnecessary
            if (pipUtils.toBoolean($attrs.pipRebind)) {
                if (srcsGetter) {
                    $scope.$watch(srcsGetter, function (newValue) {
                        //getImageUrls();
                        generateContent();
                    });
                    $scope.$watchCollection(srcsGetter, function (newValue) {
                        //getImageUrls();
                        generateContent();
                    });
                }
                else if (pictureIdsGetter) {
                    $scope.$watch(pictureIdsGetter, function (newValue) {
                        //getImageUrls();
                        generateContent();
                    });
                }
            }

            $scope.getElementDimensions = getElementDimensions;

            var update = _.debounce(calculateResize, 50);

            function calculateResize() {
                var ims = $element.find('img');
                var i = 0;
                for ( i; i < ims.length; i++ ) {
                    var container = angular.element(ims[i].parentElement),
                        image = angular.element(ims[i]);

                    if (image.css('display') != 'none')
                        pipImageUtils.setImageMarginCSS(container, image);
                }

                var icns = $element.find('md-icon');

                var i = 0;
                for ( i; i < icns.length; i++ ) {
                    var container = angular.element(icns[i].parentElement),
                        icn = angular.element(icns[i]);
                    if (container.css('display') != 'none') {
                        pipImageUtils.setIconMarginCSS(container[0], icn);
                    }

                }
            };

            $scope.$watch($scope.getElementDimensions, function (newValue, oldValue) {
                if (newValue && oldValue && oldValue.h == newValue.h && oldValue.w == newValue.w) return;
                calculateResize();
            }, true);

            generateContent();
            //getImageUrls();

            return;

            function getElementDimensions() {
                var dimension = {
                    'h': $element.height(),
                    'w': $element.width()
                };

                return dimension;
            };

            // Clean up url to remove broken icon
            function onImageError(event) {
                var 
                    image = $(event.target),
                    container = image.parent(),
                    defaultBlock = container.children('div'),
                    defaultIcon = image.parent().find('md-icon');

                defaultBlock.css('display', 'block');
                image.css('display', 'none');
                pipImageUtils.setIconMarginCSS(container[0], defaultIcon);
                defaultIcon.empty().append($svgData);
            };

            // When image is loaded resize/reposition it
            function onImageLoad($event) {
                var image = $($event.target),
                    container =  image.parent(),
                    defaultBlock = container.children('div');

                pipImageUtils.setImageMarginCSS(container, image);

                defaultBlock.css('display', 'none');
            };

            function getScheme(count) {
                var schemes = collageSchemes[count - 1];

                // If nothing to choose from then return
                if (schemes.length == 1) return schemes[0];

                // Calculate unique had code
                var uniqueCode = uniqueCodeGetter ? '' + uniqueCodeGetter($scope) : '';
                var hash = pipStrings.hashCode(uniqueCode);

                // Return reproducable scheme by hashcode
                return schemes[hash % schemes.length];
            };

            function getImageUrls() {
                // Simply return sources
                if (srcsGetter) {
                    var srcs = srcsGetter($scope);
                    //generateContent();
                    return _.clone(srcs);
                }

                // Calculate urls if picture ids are specified
                if (pictureIdsGetter) {
                    var
                        ids = pictureIdsGetter($scope) || [],
                        serverUrl = pipRest.serverUrl(),
                        userId = ($rootScope.$user || {}).id,
                        partyId = ($rootScope.$party || {}).id || userId,
                        result = [];

                    for (var i = 0; i < ids.length; i++) {
                        result.push(
                            serverUrl + '/api/parties/' + partyId + '/files/' + ids[i] + '/content'
                        );
                    }

                    return result;
                }

                // Return an empty array otherwise
                return [];
            };

            function generatePicture(urls, scheme) {
                var 
                    url = urls[0],
                    containerClasses = '',
                    pictureClasses = '';

                urls.splice(0, 1);

                containerClasses += scheme.fullWidth ? ' pip-full-width' : '';
                containerClasses += scheme.fullHeight ? ' pip-full-height' : '';
                containerClasses += ' flex-' + scheme.flex;

                pictureClasses += scheme.leftPadding ? ' pip-left' : '';
                pictureClasses += scheme.rightPadding ? ' pip-right' : '';
                pictureClasses += scheme.topPadding ? ' pip-top' : '';
                pictureClasses += scheme.bottomPadding ? ' pip-bottom' : '';

                if (allowOpen) {
                    return '<a class="pip-picture-container' + containerClasses + '" flex="' + scheme.flex + '" '
                        + 'href="' + url + '"  target="_blank">'
                        + '<div class="pip-picture' + pictureClasses + '"><img src="' + url + '"/>'
                        + '<div><md-icon></md-icon></div></div></a>';
                }

                return '<div class="pip-picture-container' + containerClasses + '" flex="' + scheme.flex + '">'
                    + '<div class="pip-picture' + pictureClasses + '"><img src="' + url + '"/>'
                    + '<div><md-icon></md-icon></div></div></div>';
            };

            function generatePictureGroup(urls, scheme) {
                var classes = '', result;

                classes += scheme.fullWidth ? ' pip-full-width' : '';
                classes += scheme.fullHeight ? ' pip-full-height' : '';
                classes += ' flex-' + scheme.flex;
                classes += ' layout-' + scheme.layout;

                result = '<div class="pip-picture-group layout' + classes + '" flex="'
                    + scheme.flex + '" layout="' + scheme.layout + '">';

                // Generate content for children recursively
                for (var i = 0; i < scheme.children.length; i++) {
                    result += generate(urls, scheme.children[i]);
                }

                result += '</div>';
                return result;
            };

            function generate(urls, scheme) {
                if (scheme.group)
                    return generatePictureGroup(urls, scheme);
                return generatePicture(urls, scheme);
            };

            function generateContent(urls) {
                // Unbind previously defined actions handlers
                $element.find('img')
                    .unbind('error')
                    .unbind('load');

                // Clean up content
                $element.empty();

                // Calculate list of image urls
                var urls = getImageUrls();

                // And exit if nothing to show
                if (urls.length == 0) {
                    $element.hide();
                    return;
                }

                // Limit collage only to one element if not specified otherwise
                if (urls.length > 8) {
                    var multiple = multipleGetter ? multipleGetter($scope) : false;

                    if (!multiple) {
                        urls.length = 8;
                    }
                }

                if (urls.length <= 8) {
                    // Get scheme for visualization
                    var scheme = getScheme(urls.length);

                    // Generate and add content
                    var html = '<div class="pip-collage-section">' + generate(urls, scheme) + '</div>';
                    html += '<div class="clearfix"></div>';
                    $element.html(html);
                } else {
                    var html = '';

                    while (urls.length > 0) {
                        var partialUrls = urls.splice(0, 8);

                        // Get scheme for visualization
                        var scheme = getScheme(partialUrls.length);

                        // Generate and add content
                        html += '<div class="pip-collage-section">' + generate(partialUrls, scheme) + '</div>';
                    }

                    html += '<div class="clearfix"></div>';
                    $element.html(html);
                }

                // Bind events to images...
                $element.find('img')
                    .bind('error', onImageError)
                    .bind('load', onImageLoad);

                // Show the new element
                $element.show();
            };

        }]

    );

})();


/**
 * @file Camera dialog
 * @copyright Digital Living Software Corp. 2014-2015
 * @todo
 * - Add sample to sampler app
 */

/* global angular, Webcam */

(function () {
    'use strict';

    var thisModule = angular.module('pipGallerySearchDialog',
        ['ngMaterial', 'pipCore', 'pipPictures.Templates', 'pipRest']);

    thisModule.config(['pipTranslateProvider', function (pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            'IMAGE_GALLERY': 'Add from image gallery',
            'SEARCH_PICTURES': 'Search for pictures...',
            'IMAGE_START_SEARCH': 'Images will appear here once you start searching'
        });
        pipTranslateProvider.translations('ru', {
            'IMAGE_GALLERY': 'Добавить из галереи изображений',
            'SEARCH_PICTURES': 'Поиск изображений...',
            'IMAGE_START_SEARCH': 'Картинки появятся после начала поиска'
        });
    }]);

    thisModule.factory('pipGallerySearchDialog',
        ['$mdDialog', function ($mdDialog) {
            return {
                show: function (successCallback, multiple) {
                    $mdDialog.show({
                        templateUrl: 'gallery_search_dialog/gallery_search_dialog.html',
                        clickOutsideToClose: true,
                        controller: 'pipGallerySearchController',
                        locals: {
                            multiple: multiple
                        }
                    }).then(function (result) {
                        if (successCallback) {
                            successCallback(result);
                        }
                    }, function () {

                    });
                }
            };
        }]);

    thisModule.controller('pipGallerySearchController',
        ['$scope', '$rootScope', '$timeout', '$mdMenu', '$mdDialog', '$http', 'pipRest', 'multiple', 'pipTransaction', function ($scope, $rootScope, $timeout, $mdMenu, $mdDialog, $http, pipRest, multiple, pipTransaction) {

            var prevSearch = '',
                url = pipRest.serverUrl() + '/api/images/search',
                images = [];

            $scope.theme = $rootScope.$theme;
            $scope.$serverUrl = pipRest.serverUrl();
            $scope.$search = '';
            $scope.$images = [];
            $scope.transaction = pipTransaction('search', $scope);

            $scope.onSearchClick = onSearchClick;
            $scope.onKeyPress = onKeyPress;
            $scope.onImageClick = onImageClick;
            $scope.onAddClick = onAddClick;
            $scope.onCancelClick = onCancelClick;
            $scope.addButtonDisabled = addButtonDisabled;
            $scope.onStopSearchClick = onStopSearchClick;

            focusSearchText();

            return;

            function onSearchClick() {
                if ($scope.transaction.busy()) return;

                if ($scope.$search == '' || $scope.$search == prevSearch) return;

                prevSearch = $scope.$search;
                $scope.$images = [];
                $scope.stop = null;
                var requestUrl = url + '?q=' + $scope.$search;

                var transactionId = $scope.transaction.begin('ENTERING');
                if (!transactionId) return;

                $http['get'](requestUrl)
                    .success(function (results) {
                        if ($scope.transaction.aborted(transactionId))return;


                        for (var i = 0; i < results.length; i++) {
                            $scope.$images.push({
                                checked: false,
                                url: results[i].link,
                                thumbnail: results[i].thumbnail
                            });
                        }
                        $scope.transaction.end();


                    }).
                    error(function (error) {
                        console.error(error)
                    });
            }

            function onStopSearchClick() {
                $scope.transaction.abort();
                prevSearch = '';
            }

            function onKeyPress($event) {
                if ($event.keyCode === 13)
                    $scope.onSearchClick();
            }

            function onImageClick(image) {
                if ($scope.transaction.busy()) return;

                image.checked = !image.checked;

                if (multiple) {
                    if (image.checked) {
                        images.push(image);
                    } else {
                        _.remove(images, {url: image.url});
                    }
                } else {
                    if (image.checked) {
                        if (images.length > 0) {
                            images[0].checked = false;
                            images[0] = image;
                        } else {
                            images.push(image);
                        }
                    } else {
                        images = [];
                    }
                }
            }

            function onAddClick() {
                if ($scope.transaction.busy()) return;

                var result = [];
                images.forEach(function (image) {
                    if (image.checked)
                        result.push(image.url);
                });
                $mdDialog.hide(result);
            }

            function onCancelClick() {
                $mdDialog.cancel();
            }

            function addButtonDisabled() {
                return images.length == 0 || $scope.transaction.busy();
            }

            function focusSearchText() {
                setTimeout(function () {
                    var element = $('.pip-gallery-search-dialog .search-images');
                    if (element.length > 0)
                        element.focus();
                }, 0);
            }

        }]
    );

})();
/**
 * @file Picture control
 * @copyright Digital Living Software Corp. 2014-2015
 * @todo
 * - Improve samples in sampler app
 * - Replace placeholder with default image generated on server
 * - Fix resizing problem
 */
 
/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipPicture", ['pipCore']);

    thisModule.directive('pipPicture', 
        function() {
            return {
                restrict: 'EA',
                scope: {
                    src: '&pipSrc',
                    pictureId: '=pipPictureId',
                    defaultIcon: '=pipDefaultIcon'
                },
                template: '<img ui-event="{ error: \'onImageError($event)\', load: \'onImageLoad($event)\' }"/>'
                          + '<div><span></span></div>',
                controller: 'pipPictureController' 
            }
        }
    );

    thisModule.controller('pipPictureController',
        ['$scope', '$element', '$attrs', '$rootScope', 'pipUtils', 'pipImageUtils', 'pipRest', function ($scope, $element, $attrs, $rootScope, pipUtils, pipImageUtils, pipRest) {
            var 
                image = $element.children('img'),
                defaultBlock = $element.children('div');

            $scope.onImageError = onImageError;
            $scope.onImageLoad = onImageLoad;

            // Add class
            $element.addClass('pip-picture');

            bindControl();

            // Also optimization to avoid watch if it is unnecessary
            if (pipUtils.toBoolean($attrs.pipRebind)) {
                $scope.$watch($scope.pictureId, function(newValue) {
                    if ($scope.pictureId != newValue) bindControl();
                });
            }

            if (pipUtils.toBoolean($attrs.pipRebind)) {
                $scope.$watch($scope.src, function(newValue) {
                    if ($scope.src != newValue)
                      bindControl();
                });
            }

            return;

            // Clean up url to remove broken icon
            function onImageError($event) {
                $scope.$apply(function() {
                    var image = $($event.target);

                    pipImageUtils.setErrorImageCSS(image);
                    defaultBlock.css('display', 'block');
                });
            };

            // When image is loaded resize/reposition it
            function onImageLoad($event) {
                var image = $($event.target);
                pipImageUtils.setImageMarginCSS($element, image);
                defaultBlock.css('display', 'none');
            };

            function bindControl() {
                if ($scope.pictureId) {
                    var serverUrl = pipRest.serverUrl(),
                        userId = ($rootScope.$user || {}).id,
                        partyId = ($rootScope.$party || {}).id || userId,
                        url = serverUrl + '/api/parties/' + partyId + '/files/' + $scope.pictureId + '/content';

                    image.attr('src', url);
                } else {
                    if ($scope.src) image.attr('src', $scope.src());
                    else image.attr('src', '');
                }
            };
        }]        
    ); 

})();


/**
 * @file Picture control
 * @copyright Digital Living Software Corp. 2014-2015
 * @todo
 * - Improve samples in sampler app
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipPictureEdit", ['ui.event', 'angularFileUpload', 'pipRest', 'pipPicturePaste',
        'pipTranslate', 'pipPictures.Templates']);

    thisModule.config(['pipTranslateProvider', function(pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            'ERROR_WRONG_IMAGE_FILE':'Incorrect image file. Please, choose another one',
            'PICTURE_EDIT_TEXT': 'Click here to upload a picture'
        });
        pipTranslateProvider.translations('ru', {
            'ERROR_WRONG_IMAGE_FILE': 'Неправильный файл с изображением. Выберете другой файл',
            'PICTURE_EDIT_TEXT': 'Нажмите сюда для загрузки картинки'
        });
    }]);

    thisModule.directive('pipPictureEdit',
        function() {
            return {
                restrict: 'EA',
                scope: {
                    ngDisabled: '&',
                    pipCreated: '&',
                    pipChanged: '&',
                    pipReset: '&',
                    pipPictureId: '=',
                    pipAddedPicture: '='
                },
                templateUrl: 'picture_edit/picture_edit.html',
                controller: 'pipPictureEditController'
            };
        }
    );

    thisModule.controller('pipPictureEditController',
        ['$scope', '$element', '$attrs', '$http', '$upload', '$timeout', '$rootScope', '$parse', 'pipRest', 'pipPicturePaste', 'pipImageUtils', 'pipUtils', function($scope, $element, $attrs, $http, $upload, $timeout, $rootScope, $parse, pipRest, pipPicturePaste,
                 pipImageUtils, pipUtils) {
            var
                $control = $element.children('.pip-picture-upload'),
                $input = $control.children('input[type=file]'),
                serverUrl = pipRest.serverUrl(),
                fileUrl = serverUrl + "/api/parties/" + $rootScope.$party.id + "/files";

            $scope.text = $attrs.pipDefaultText || 'PICTURE_EDIT_TEXT';
            $scope.icon = $attrs.pipDefaultIcon || 'picture-no-border';
            $scope.pictureStartState = pipUtils.toBoolean($scope.pipAddedPicture) ? 'copied' : 'original';

            $scope.control = {
                url: '',
                progress: 0,
                uploaded: false,
                uploading: false,
                loaded: false,
                file: null,
                state: $scope.pictureStartState //'original'
            };

            $scope.control.reset = resetImage;
            $scope.control.save = saveImage;
            $scope.empty = empty;
            $scope.isUpdated = isUpdated;
            $scope.readItemLocally = readItemLocally;
            $scope.onDeleteClick = onDeleteClick;
            $scope.onKeyDown = onKeyDown;
            $scope.onImageError = onImageError;
            $scope.onImageLoad = onImageLoad;
            $scope.onChange = onChange;
            $scope.onBlur = onBlur;
            $scope.onFocus = onFocus;

            // Also optimization to avoid watch if it is unnecessary
            if (pipUtils.toBoolean($attrs.pipRebind)) {
                $scope.$watch('pipPictureId', function(newValue) {
                        $scope.control.reset();
                });
            }

            $scope.$watch($scope.ngDisabled, function(newValue) {
                $input.attr('disabled', $scope.control.disabled);
            });

            //// Add paste listener
            //$element.children('.pip-picture-upload').focus(function () {
            //    console.log('addPasteListener');
            //    pipPicturePaste.addPasteListener(function (item) {
            //        $scope.readItemLocally(item.url, item.file);
            //    });
            //});

            //$element.children('.pip-picture-upload').blur(function () {
            //    pipPicturePaste.removePasteListener();
            //});

            // Add class
            $element.addClass('pip-picture-edit');

            // Initialize control
            $scope.control.reset();

            // Execute callback
            if ($scope.pipCreated) {
                $scope.pipCreated({
                    $event: { sender: $scope.control },
                    $control: $scope.control
                });
            }

            return ;

            function resetImage(afterDeleting) {
                $scope.control.progress = 0;
                $scope.control.uploading = false;
                $scope.control.uploaded = false;
                $scope.control.file = null;
                $scope.control.state = $scope.pictureStartState; //'original';
                $scope.control.url = '';
                var url = '';

                if (!afterDeleting) {
                    if ($rootScope.$party && $rootScope.$party.id && $scope.pipPictureId) {
                        url = fileUrl + '/' + $scope.pipPictureId + '/content';
                    }
                    if (!url) return;

                    $scope.control.url = url;
                    $scope.control.uploaded = true;
                    $scope.onChange();
                } else $scope.onChange();
            };

            function saveItemUrl() {
                var
                    url = $scope.control.url,
                    name = url.slice(url.lastIndexOf('/') + 1, url.length).split('?')[0];
                return fileUrl + '?name=' + name + '&url=' + url;
            };

            function onFocus() {
                pipPicturePaste.addPasteListener(function (item) {
                    $scope.readItemLocally(item.url, item.file);
                });
            };

            function onBlur () {
                pipPicturePaste.removePasteListener();
            };

            function savePicture(successCallback, errorCallback) {
                var
                    control = $scope.control,
                    file = control.file;

                if ($scope.control.file !== null) {
                    var fileReader = new FileReader();

                    fileReader.onload = function (e) {
                        control.uploading = true;
                //        pipImageUtils.addHttpHeaders();
                        var upload = $upload.http({
                                url: fileUrl + '?name=' + file.name,
                                headers: { 'Content-Type': file.type },
                                data: e.target.result
                            })
                            .then(
                            function (response) {
                                $scope.pipPictureId = response.data.id;
                                control.reset();
                                if (successCallback) successCallback(response);
                            },
                            function (error) {
                                control.uploading = false;
                                control.upload = false;
                                control.progress = 0;

                                if (errorCallback) errorCallback(error);
                                else console.error(error);
                            },
                            function (e) {
                                // Math.min is to fix IE which reports 200% sometimes
                                control.progress = Math.min(100, parseInt(100.0 * e.loaded / e.total));
                            }
                        );
                    };

                    fileReader.readAsArrayBuffer(file);
                } else {
                    var url = saveItemUrl();
                    control.uploading = true;

     //               pipImageUtils.addHttpHeaders();
                    $http['post'](url)
                        .success(function (response) {
                            $scope.pipPictureId = response.id;
                            control.reset();

                            if (successCallback) successCallback(response);
                        })
                        .error(function (error) {
                            control.uploading = false;
                            control.upload = false;

                            if (errorCallback) errorCallback(error);
                            else console.error(error);
                        });
                }

            };

            function deletePicture(successCallback, errorCallback) {
                var control = $scope.control;
                $http['delete'](fileUrl + '/' + $scope.pipPictureId)
                .success(function (data) {
                    $scope.pipPictureId = null;
                    control.reset(true);

                    if (successCallback) successCallback();
                })
                .error(function (error) {
                    control.uploading = false;
                    control.upload = false;
                    control.progress = 0;

                    if (errorCallback) errorCallback(error);
                    else console.error(error);
                });
            };

            function saveImage(successCallback, errorCallback) {
                // Process changes of the image
                if ($scope.control.state == 'changed') {
                    savePicture(successCallback, errorCallback);
                }
                // Process deletion of the image
                else if ($scope.control.state == 'deleted') {
                    deletePicture(successCallback, errorCallback);
                }
                // Process if no changes were made
                else {
                    if (successCallback) successCallback();
                }
            };

            // Visual functions
            function empty() {
                return $scope.control.url == '' && !$scope.control.uploading;
            };

            function isUpdated() {
                return $scope.control.state != 'original';
            };

            // Process user events
            function readItemLocally(url, file) {
                $scope.control.file = file;
                $scope.control.url = url;
                $scope.control.state = 'changed';
                $scope.onChange();
            };

            function onDeleteClick($event) {
                $event.stopPropagation();

                $control.focus();

                $scope.control.file = null;
                $scope.control.url = '';
                if ($scope.control.state != 'copied') $scope.control.state = 'deleted';

                $scope.onChange();
            };

            function onKeyDown($event) {
                if ($event.keyCode == 13 || $event.keyCode == 32) {
                    // !! Avoid clash with $apply()
                    setTimeout(function() {
                        $control.trigger('click');
                    }, 0);
                } else if ($event.keyCode == 46 || $event.keyCode == 8) {
                    $scope.control.file = null;
                    $scope.control.url = '';

                    $scope.control.state = 'deleted';

                    $scope.onChange();
                } else if ($event.keyCode == 27) {
                    $scope.control.reset();
                }
            };

            // Clean up url to remove broken icon
            function onImageError($event) {
                $scope.$apply(function() {
                    $scope.control.url = '';

                    var image = $($event.target);

                    pipImageUtils.setErrorImageCSS(image, {width: 'auto', height: '100%'});
                });
            };

            // When image is loaded resize/reposition it
            function onImageLoad($event) {
                var image = $($event.target);
                pipImageUtils.setImageMarginCSS({clientWidth: 80, clientHeight: 80}, image);
                $scope.control.uploading = false;
            };

            // On change event
            function onChange() {
                if ($scope.pipChanged) {
                    $scope.pipChanged({
                        $event: { sender: $scope.control },
                        $control: $scope.control
                    });
                }
            };

        }]
    );

})();


/**
 * @file Picture list edit control
 * @copyright Digital Living Software Corp. 2014-2015
 * @todo
 * - Improve samples in sampler app
 * - Add animations to add/remove pictures
 * - ?? Replace placeholder with default image generated on server?
 */
 
/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipPictureListEdit", 
        ['ui.event', 'angularFileUpload', 'pipCore', 'pipFocused', 'pipRest', 'pipPicturePaste']);

    thisModule.config(['pipTranslateProvider', function(pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            'PICTURE_LIST_EDIT_TEXT': 'Click here to add a picture',
            'ERROR_TRANSACTION_IN_PROGRESS': 'Transaction is in progress. Please, wait until it is finished or abort',
            'ERROR_IMAGE_PRELOADING': 'Image loading error. The picture can not be saved'
        });
        pipTranslateProvider.translations('ru', {
            'PICTURE_LIST_EDIT_TEXT': 'Нажмите сюда чтобы добавить картинку',
            'ERROR_TRANSACTION_IN_PROGRESS': 'Транзакция еще не завершена. Подождите окончания или прервите её',
            'ERROR_IMAGE_PRELOADING': 'Ошибка при загрузки картинки. Картинка не сохранена.'
        });
    }]);

    thisModule.directive('pipPictureListEdit', 
        function() {
            return {
                restrict: 'EA',
                scope: {
                    pipPictureIds: '=',
                    pipAddedPicture: '=',
                    ngDisabled: '&',
                    pipCreated: '&',
                    pipChanged: '&'
                },
                templateUrl: 'picture_list_edit/picture_list_edit.html',
                controller: 'pipPictureListEditController' 
            };
        }
    );

    thisModule.controller('pipPictureListEditController',
        ['$scope', '$rootScope', '$element', '$attrs', '$parse', '$http', '$upload', '$timeout', 'pipUtils', 'pipRest', 'pipPicturePaste', 'pipImageUtils', function($scope, $rootScope, $element, $attrs, $parse, $http, $upload, $timeout, pipUtils,
                 pipRest, pipPicturePaste, pipImageUtils) {
                
            var
                $control = $element.children('.pip-picture-drop'),
                itemPin = 0;

            $scope.text = $attrs.pipDefaultText || 'PICTURE_LIST_EDIT_TEXT';
            $scope.icon = $attrs.pipDefaultIcon || 'picture-no-border';
            $scope.pipRebind = pipUtils.toBoolean($attrs.pipRebind);
            $scope.pictureStartState = pipUtils.toBoolean($scope.pipAddedPicture) ? 'copied' : 'original';

            $scope.control = {
                uploading: 0,
                items: []
            };

            $scope.control.reset = reset;
            $scope.control.save = save;
            $scope.control.abort = abort;
            $scope.filterItem = function(item) {
                return item.state != 'deleted';
            };
            $scope.readItemLocally = readItemLocally;
            $scope.onSelectClick = onSelectClick;
            $scope.onDeleteClick = onDeleteClick;
            $scope.onKeyDown = onKeyDown;
            $scope.onImageError = onImageError;
            $scope.onImageLoad = onImageLoad;
            $scope.onChange = onChange;
            $scope.onBlur = onBlur;
            $scope.onFocus = onFocus;
            
            // Watch for changes
            if ($scope.pipRebind) {
                $scope.$watch(
                    function () {
                        // Todo: Optimize change tracking
                        return $scope.pipPictureIds;
                    },
                    function (newValue) {
                        $scope.control.reset();
                    }
                );
            }

            // // Add paste listeners
            // $element.find('.pip-picture-upload').focus(function () {
            //     pipPicturePaste.addPasteListener(function (item) {
            //         $scope.readItemLocally(item.url, item.file);
            //     });
            // });
            // $element.find('.pip-picture-upload').blur(function () {
            //     pipPicturePaste.removePasteListener();
            // });

            // Add class
            $element.addClass('pip-picture-list-edit');

            // Initialize control
            $scope.control.reset();

            // Execute callback
            if ($scope.pipCreated) {
                $scope.pipCreated({
                    $event: { sender: $scope.control },
                    $control: $scope.control
                });
            }

            return;

            function contentUrl(id) {
                var
                    serverUrl = pipRest.serverUrl(),
                    partyId = $scope.$party ? $scope.$party.id : pipRest.userId();

                return serverUrl + '/api/parties/' + partyId + '/files/' + id + '/content';
            }

            function onImageError($event, item) {
                item.error = true;
            };
            
            function onFocus(a) {
                pipPicturePaste.addPasteListener(function (item) {
                    $scope.readItemLocally(item.url, item.file);
                });
            };

            function onBlur () {
                pipPicturePaste.removePasteListener();
            };

            function getItems() {
                var
                    pictureIds = $scope.pipPictureIds,
                    items = [];

                if (pictureIds == null || pictureIds.length == 0)
                    return items;

                for (var i = 0; i < pictureIds.length; i++) {
                    items.push({
                        pin: itemPin++,
                        id: pictureIds[i],
                        uploading: false,
                        uploaded: false,
                        progress: 0,
                        file: null,
                        url: contentUrl(pictureIds[i]),
                        state: $scope.pictureStartState //'original'
                    });
                }

                return items;
            }

            function setItems() {
                // Clean the array
                if ($scope.pipPictureIds && $scope.pipPictureIds.length > 0)
                    $scope.pipPictureIds.splice(0, $scope.pipPictureIds.length);

                for (var i = 0; i < $scope.control.items.length; i++) {
                    var item = $scope.control.items[i];
                    if (item.id)
                        $scope.pipPictureIds.push(item.id);
                }
            }

            function reset() {
                $scope.control.uploading = 0;
                $scope.control.items = getItems();

            }

            function addItemUrl(item) {
                var name = item.url.slice(item.url.lastIndexOf('/') + 1, item.url.length).split('?')[0];
                var
                    serverUrl = pipRest.serverUrl(),
                    partyId = $scope.$party ? $scope.$party.id : pipRest.userId();

                return serverUrl + '/api/parties/' + partyId + '/files?name=' + name + '&url=' + item.url
            }

            function addItemUrlWithFile(item) {
                var
                    serverUrl = pipRest.serverUrl(),
                    partyId = $scope.$party ? $scope.$party.id : pipRest.userId();

                return serverUrl + '/api/parties/' + partyId + '/files?name=' + item.file.name
            }

            function addItem(item, callback) {
                if (item.file !== null) {
                    var file = item.file;

                    var fileReader = new FileReader();
                    fileReader.onload = function (e) {
                        if (item.uploading) return;
                        item.uploading = true;
                        item.upload = $upload.http({
                            url: addItemUrlWithFile(item),
                            headers: {'Content-Type': file.type},
                            data: e.target.result
                        })
                            .then(
                            function (response) {
                                item.id = response.data ? response.data.id : null;
                                item.uploaded = true;
                                item.uploading = false;
                                item.progress = 0;
                                item.upload = null;
                                item.file = null;
                                item.url = contentUrl(item.id);
                                item.state = 'original';

                                callback();
                            },
                            function (error) {
                                item.uploaded = false;
                                item.uploading = false;
                                item.progress = 0;
                                item.upload = null;
                                //$scope.$apply();
//
                                callback(error);
                            },
                            function (e) {
                                // Math.min is to fix IE which reports 200% sometimes
                                item.progress = Math.min(100, parseInt(100.0 * e.loaded / e.total));
                            }
                        );
                    };

                    fileReader.readAsArrayBuffer(file);
                } else {
                    var url = addItemUrl(item);
                    item.uploading = true;
                    $http['post'](url)
                        .success(function (response) {
                            item.id = response.data ? response.data.id : response.id || null;
                            item.uploaded = true;
                            item.uploading = false;
                            item.progress = 0;
                            item.upload = null;
                            item.file = null;
                            item.url = contentUrl(item.id);
                            item.state = 'original';

                            callback();
                        })
                        .error(function (error) {
                            item.uploaded = false;
                            item.uploading = false;
                            item.progress = 0;
                            item.upload = null;

                            callback();
                        });
                }
            }

            function deleteItemUrl(item) {
                var
                    serverUrl = pipRest.serverUrl(),
                    partyId = $scope.$party ? $scope.$party.id : pipRest.userId();

                return serverUrl + '/api/parties/' + partyId + '/files/' + item.id;
            }

            function deleteItem(item, callback) {
                var control = $scope.control;

                // Avoid double transactions
                if (item.upload) {
                    item.upload.abort();
                    item.upload = null;
                }

                if (item.state != 'deleted')
                    return;

                //pipImageUtils.addHttpHeaders();
                $http['delete'](deleteItemUrl(item))
                .success(function (data) {
                    _.remove(control.items, {pin: item.pin});
                    callback();
                })
                .error(function (data, status) {
                    // Todo: perform a better processing
                    if (data == null) {
                        _.remove(control.items, {pin: item.pin});
                    } else {
                        item.uploaded = false;
                        item.uploading = false;
                        item.progress = 0;
                        item.upload = null;
                    }

                    callback(data);
                });
            }

            function save(successCallback, errorCallback) {
                var control = $scope.control;

                if (control.uploading) {
                    if (errorCallback) errorCallback('ERROR_TRANSACTION_IN_PROGRESS');
                    return;
                }

                control.error = null;
                control.uploading = 0;

                var onItemCallback = function(error) {
                    // Storing only the first error
                    if (error && !control.error) {
                        control.error = error;
                    }

                    control.uploading--;

                    // Finished uploading
                    if (control.uploading == 0) {
                        if (control.error) {
                            if (errorCallback) errorCallback(control.error);
                            else console.error(control.error);
                        } else {
                            setItems();
                            if (successCallback) successCallback();
                        }
                    }
                };

                for (var i = 0; i < control.items.length; i++) {
                    var item = control.items[i];
                    if (item.state == 'added' && !item.error) {
                        control.uploading++;
                        addItem(item, onItemCallback);
                    } else if (item.state == 'deleted') {
                        control.uploading++;
                        deleteItem(item, onItemCallback);
                    }
                }

                // Nothing was uploaded
                if (control.uploading == 0) {
                    if (successCallback) successCallback();
                }
            }

            function abort() {
                var control = $scope.control;

                for (var i = 0; i < control.items.length; i++) {
                    var item = control.items[i];

                    if (item.uploading) {
                        if (item.upload) item.upload.abort();

                        item.uploaded = false;
                        item.uploading = false;
                        item.progress = 0;
                        item.upload = null;
                    }
                }

                // Abort transaction
                control.uploading = 0;
            }

            function readItemLocally(url, file) {
                $scope.control.items.push({
                    pin: itemPin++,
                    id: null,
                    uploading: false,
                    uploaded: false,
                    progress: 0,
                    file: file,
                    url: url,
                    state: 'added'
                });

                $scope.onChange();
            }

            function onSelectClick($files) {
                $control.focus();

                if ($files == null || $files.length == 0)
                    return;
                for (var i = 0; i < $files.length; i++) {
                    var file = $files[i];

                    if (file.type.indexOf('image') > -1) {
                        readItemLocally(file);
                    }
                }
            }

            function onDeleteClick(item) {
                if (item.state == 'added' || item.state == 'copied') {
                    _.remove($scope.control.items, {pin: item.pin});
                } else {
                    item.state = 'deleted';
                }

                $scope.onChange();
            }

            function onKeyDown($event, item) {
                if (item) {
                    if ($event.keyCode == 46 || $event.keyCode == 8) {
                        if (item.state == 'added') {
                            _.remove($scope.control.items, {pin: item.pin});
                        } else {
                            item.state = 'deleted';
                        }

                        $scope.onChange();
                    }
                } else {
                    if ($event.keyCode == 13 || $event.keyCode == 32) {
                        // !! Avoid clash with $apply()
                        setTimeout(function() {
                            $control.trigger('click');
                        }, 0);
                    }
                }
            }

            function onImageLoad($event, item) {
                item.error = false;
                setTimeout(function () {
                    var image = $($event.target);
                    pipImageUtils.setImageMarginCSS({clientWidth: 80, clientHeight: 80}, image);
                }, 250);

                item.loaded = true;
            }

            // On change event
            function onChange() {
                if ($scope.pipChanged) {
                    $scope.pipChanged({
                        $event: { sender: $scope.control },
                        $control: $scope.control
                    });
                }
            }
        }]
        
    ); 

})();


/**
 * @file Picture URL dialog
 * @copyright Digital Living Software Corp. 2014-2016
 * @todo
 * - Add sample to sampler app
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipPictureUrlDialog',
        ['ngMaterial', 'pipCore', 'pipPictures.Templates']);

    thisModule.config(['pipTranslateProvider', function(pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            'PICTURE_FROM_WEBLINK': 'Add from web link',
            'LINK_PICTURE': 'Link to the picture...'
        });
        pipTranslateProvider.translations('ru', {
            'PICTURE_FROM_WEBLINK': 'Добавить из веб ссылки',
            'LINK_PICTURE': 'Ссылка на изображение...'
        });
    }]);

    thisModule.factory('pipPictureUrlDialog',
        ['$mdDialog', function ($mdDialog) {
            return {
                show: function (successCallback) {
                    $mdDialog.show({
                        templateUrl: 'picture_url_dialog/picture_url_dialog.html',
                        clickOutsideToClose: true,
                        controller: 'pipPictureUrlDialogController'
                    }).then(function (result) {
                        if (successCallback) {
                            successCallback(result);
                        }
                    });
                }
            };
    }]);

    thisModule.controller('pipPictureUrlDialogController', 
        ['$scope', '$rootScope', '$timeout', '$mdMenu', '$mdDialog', 'pipImageUtils', function ($scope, $rootScope, $timeout, $mdMenu, $mdDialog, pipImageUtils) {
            $scope.url = '';
            $scope.invalid = true;
            $scope.theme = $rootScope.$theme;
            $scope.checkUrl = checkUrl;
            $scope.onCancelClick = onCancelClick;
            $scope.onAddClick = onAddClick;

            return;

            function setImageSize(img) {
                var imageWidth = img.width(),
                    imageHeight = img.height();

                var cssParams = {};

                if ((imageWidth) > (imageHeight)) {
                    cssParams['width'] = '250px';
                    cssParams['height'] = 'auto';
                } else {
                    cssParams['width'] = 'auto';
                    cssParams['height'] = '250px';
                }

                img.css(cssParams);
            }

            function checkUrl() {
                var img = $("img#url_image")
                    .on('error', function () {
                        $scope.invalid = true;
                        $scope.$apply();
                    })
                    .on('load', function () {
                        $scope.invalid = false;
                        setImageSize(img);
                        $scope.$apply();
                    })
                    .attr("src", $scope.url);
            };
            
            function onCancelClick() {
                $mdDialog.cancel();
            };
            
            function onAddClick() {
                $mdDialog.hide($scope.url);
            };
        }]
    );

})();
/**
 * @file Picture paste service
 * @copyright Digital Living Software Corp. 2014-2015
 */

/* global $, angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipPicturePaste', []);

    thisModule.factory('pipPicturePaste', ['$timeout', function ($timeout) {
        var paste = {};
        var pasteCatcher = null;

        paste.addPasteListener = function (onPaste) {
            if (!window.Clipboard) {
                if (pasteCatcher !== null) this.removePasteElement();

                pasteCatcher = document.createElement("div");

                // Firefox allows images to be pasted into contenteditable elements
                pasteCatcher.setAttribute("contenteditable", "true");

                // We can hide the element and append it to the body,
                //pasteCatcher.style.opacity = 0;
                $(pasteCatcher).css({
                    "position": "absolute",
                    "left": "-999",
                    width: "0",
                    height: "0",
                    "overflow": "hidden",
                    outline: 0
                });

                document.body.appendChild(pasteCatcher);
            }

            $(document).on('paste', function (event) {
                if (event.clipboardData == null && event.originalEvent) {
                    event = event.originalEvent;
                }

                // Paste for chrome
                if (event.clipboardData) {
                    var items = event.clipboardData.items;

                    _.each(items, function (item) {
                        if (item.type.indexOf("image") != -1) {
                            var file = item.getAsFile();

                            var fileReader = new FileReader();
                            fileReader.onload = function (e) {
                                $timeout(function () {
                                    onPaste({url: e.target.result, file: file});
                                });
                            };
                            fileReader.readAsDataURL(file);
                        }
                    });
                }
                // Paste for IE
                else if (window.clipboardData && window.clipboardData.files) {
                    _.each(window.clipboardData.files, function (file) {
                        var fileReader = new FileReader();
                        fileReader.onload = function (e) {
                            $timeout(function () {
                                onPaste({url: e.target.result, file: file});
                            });
                        };
                        fileReader.readAsDataURL(file);
                    });
                }
            });
        };

        paste.removePasteListener = function () {
            if (!window.Clipboard) {
                if (pasteCatcher !== null) {
                    document.body.removeChild(pasteCatcher);
                    pasteCatcher = null;
                }
            }
            $(document).off('paste');
        };

        return paste;
    }]);

})();

/**
 * @file Areas data cache
 * @copyright Digital Living Software Corp. 2014-2015
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipImageUtils', []);

    thisModule.service('pipImageUtils',
        ['$http', 'pipStrings', '$rootScope', 'pipRest', function($http, pipStrings, $rootScope, pipRest) {

            var
                colorClasses = [
                    'pip-avatar-color-0', 'pip-avatar-color-1', 'pip-avatar-color-2', 'pip-avatar-color-3',
                    'pip-avatar-color-4', 'pip-avatar-color-5', 'pip-avatar-color-6', 'pip-avatar-color-7',
                    'pip-avatar-color-8', 'pip-avatar-color-9', 'pip-avatar-color-10', 'pip-avatar-color-11',
                    'pip-avatar-color-12', 'pip-avatar-color-13', 'pip-avatar-color-14', 'pip-avatar-color-15'
                ],

                colors = [
                    'rgba(239,83,80,1)', 'rgba(236,64,122,1)', 'rgba(171,71,188,1)',
                    'rgba(126,87,194,1)', 'rgba(92,107,192,1)', 'rgba(3,169,244,1)',
                    'rgba(0,188,212,1)', 'rgba(0,150,136,1)', 'rgba(76,175,80,1)',
                    'rgba(139,195,74,1)', 'rgba(205,220,57,1)', 'rgba(255,193,7,1)',
                    'rgba(255,152,0,1)', 'rgba(255,87,34,1)', 'rgba(121,85,72,1)',
                    'rgba(96,125,139,1)'
                ],

                entityTypes = {
                    goal: 'goals',
                    objective: 'goals',
                    dream: 'goals',
                    accomplishment: 'goals',
                    area: 'areas',
                    overall: 'visions',
                    vision: 'visions',
                    event: 'events',
                    instance: 'events'
                },

                collageSchemes = [
                    // 1
                    [
                        { flex: 100, fullWidth: true, fullHeight: true }
                    ],
                    // 2
                    [
                        {
                            group: true,
                            layout: 'row',
                            flex: 100,
                            fullHeight: true,
                            children: [
                                { flex: 50, fullHeight: true, rightPadding: true },
                                { flex: 50, fullHeight: true, leftPadding: true }
                            ]
                        }
                    ],
                    // 3
                    [
                        {
                            group: true,
                            layout: 'row',
                            flex: 100,
                            fullHeight: true,
                            children: [
                                { flex: 33, fullHeight: true, rightPadding: true },
                                { flex: 33, fullHeight: true, leftPadding: true, rightPadding: true },
                                { flex: 33, fullHeight: true, leftPadding: true }
                            ]
                        },
                        {
                            group: true,
                            layout: 'row',
                            flex: 100,
                            fullHeight: true,
                            children: [
                                { flex: 50, fullHeight: true, rightPadding: true },
                                {
                                    group: true,
                                    layout: 'column',
                                    flex: 50,
                                    fullHeight: true,
                                    children: [
                                        { flex: 50, leftPadding: true, bottomPadding: true },
                                        { flex: 50, leftPadding: true, topPadding: true }
                                    ]
                                }
                            ]
                        },
                        {
                            group: true,
                            layout: 'row',
                            flex: 100,
                            fullHeight: true,
                            children: [
                                { flex: 70, fullHeight: true, rightPadding: true },
                                {
                                    group: true,
                                    layout: 'column',
                                    flex: 30,
                                    fullHeight: true,
                                    children: [
                                        { flex: 50, leftPadding: true, bottomPadding: true },
                                        { flex: 50, leftPadding: true, topPadding: true }
                                    ]
                                }
                            ]
                        },
                        {
                            group: true,
                            layout: 'column',
                            flex: 100,
                            fullHeight: true,
                            children: [
                                { flex: 50, fullWidth: true, bottomPadding: true },
                                {
                                    group: true,
                                    layout: 'row',
                                    flex: 50,
                                    fullHeight: true,
                                    children: [
                                        { flex: 50, rightPadding: true, topPadding: true },
                                        { flex: 50, leftPadding: true, topPadding: true }
                                    ]
                                }
                            ]
                        }
                    ],
                    // 4
                    [
                        {
                            group: true,
                            layout: 'column',
                            flex: 100,
                            fullHeight: true,
                            children: [
                                {
                                    group: true,
                                    layout: 'row',
                                    flex: 50,
                                    fullHeight: true,
                                    children: [
                                        { flex: 50, fullWidth: true, rightPadding: true, bottomPadding: true },
                                        { flex: 50, fullWidth: true, leftPadding: true, bottomPadding: true }
                                    ]
                                },
                                {
                                    group: true,
                                    layout: 'row',
                                    flex: 50,
                                    fullHeight: true,
                                    children: [
                                        { flex: 50, fullWidth: true, rightPadding: true, topPadding: true },
                                        { flex: 50, fullWidth: true, leftPadding: true, topPadding: true }
                                    ]
                                }
                            ]
                        },
                        {
                            group: true,
                            layout: 'row',
                            flex: 100,
                            fullHeight: true,
                            children: [
                                { flex: 50, fullWidth: true, rightPadding: true },
                                {
                                    group: true,
                                    layout: 'column',
                                    flex: 50,
                                    fullHeight: true,
                                    children: [
                                        { flex: 50, fullWidth: true, leftPadding: true, bottomPadding: true },
                                        {
                                            group: true,
                                            layout: 'row',
                                            flex: 50,
                                            fullHeight: true,
                                            children: [
                                                { flex: 50, fullWidth: true, leftPadding: true, rightPadding: true, topPadding: true },
                                                { flex: 50, fullWidth: true, leftPadding: true, topPadding: true }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            group: true,
                            layout: 'row',
                            flex: 100,
                            fullHeight: true,
                            children: [
                                { flex: 30, fullWidth: true, rightPadding: true },
                                {
                                    group: true,
                                    layout: 'column',
                                    flex: 70,
                                    fullHeight: true,
                                    children: [
                                        { flex: 50, fullWidth: true, leftPadding: true, bottomPadding: true },
                                        {
                                            group: true,
                                            layout: 'row',
                                            flex: 50,
                                            fullHeight: true,
                                            children: [
                                                { flex: 50, fullWidth: true, leftPadding: true, rightPadding: true, topPadding: true },
                                                { flex: 50, fullWidth: true, leftPadding: true, topPadding: true }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            group: true,
                            layout: 'column',
                            flex: 100,
                            fullHeight: true,
                            children: [
                                {
                                    group: true,
                                    layout: 'row',
                                    flex: 50,
                                    fullHeight: true,
                                    children: [
                                        { flex: 100, fullWidth: true, bottomPadding: true }
                                    ]
                                },
                                {
                                    group: true,
                                    layout: 'row',
                                    flex: 50,
                                    fullHeight: true,
                                    children: [
                                        { flex: 33, fullWidth: true, rightPadding: true, topPadding: true },
                                        { flex: 33, fullWidth: true, leftPadding: true, rightPadding: true, topPadding: true },
                                        { flex: 33, fullWidth: true, leftPadding: true, topPadding: true }
                                    ]
                                }
                            ]
                        }
                    ],
                    // 5
                    [
                        {
                            group: true,
                            layout: 'column',
                            flex: 100,
                            fullHeight: true,
                            children: [
                                {
                                    group: true,
                                    layout: 'row',
                                    flex: 50,
                                    fullHeight: true,
                                    children: [
                                        { flex: 50, fullWidth: true, rightPadding: true, bottomPadding: true },
                                        { flex: 50, fullWidth: true, leftPadding: true, bottomPadding: true }
                                    ]
                                },
                                {
                                    group: true,
                                    layout: 'row',
                                    flex: 50,
                                    fullHeight: true,
                                    children: [
                                        { flex: 33, fullWidth: true, rightPadding: true, topPadding: true },
                                        { flex: 33, fullWidth: true, leftPadding: true, rightPadding: true, topPadding: true },
                                        { flex: 33, fullWidth: true, leftPadding: true, topPadding: true }
                                    ]
                                }
                            ]
                        },
                        {
                            group: true,
                            layout: 'row',
                            flex: 100,
                            fullHeight: true,
                            children: [
                                { flex: 50, fullWidth: true, rightPadding: true },
                                {
                                    group: true,
                                    layout: 'column',
                                    flex: 50,
                                    fullHeight: true,
                                    children: [
                                        {
                                            group: true,
                                            layout: 'row',
                                            flex: 50,
                                            fullHeight: true,
                                            children: [
                                                { flex: 50, fullWidth: true, leftPadding: true, rightPadding: true, bottomPadding: true },
                                                { flex: 50, fullWidth: true, leftPadding: true, bottomPadding: true }
                                            ]
                                        },
                                        {
                                            group: true,
                                            layout: 'row',
                                            flex: 50,
                                            fullHeight: true,
                                            children: [
                                                { flex: 50, fullWidth: true, leftPadding: true, rightPadding: true, topPadding: true },
                                                { flex: 50, fullWidth: true, leftPadding: true, topPadding: true }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            group: true,
                            layout: 'row',
                            flex: 100,
                            fullHeight: true,
                            children: [
                                { flex: 33, fullWidth: true, rightPadding: true },
                                {
                                    group: true,
                                    layout: 'column',
                                    flex: 67,
                                    fullHeight: true,
                                    children: [
                                        {
                                            group: true,
                                            layout: 'row',
                                            flex: 50,
                                            fullHeight: true,
                                            children: [
                                                { flex: 50, fullWidth: true, leftPadding: true, rightPadding: true, bottomPadding: true },
                                                { flex: 50, fullWidth: true, leftPadding: true, bottomPadding: true }
                                            ]
                                        },
                                        {
                                            group: true,
                                            layout: 'row',
                                            flex: 50,
                                            fullHeight: true,
                                            children: [
                                                { flex: 50, fullWidth: true, leftPadding: true, rightPadding: true, topPadding: true },
                                                { flex: 50, fullWidth: true, leftPadding: true, topPadding: true }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            group: true,
                            layout: 'column',
                            flex: 100,
                            fullHeight: true,
                            children: [
                                {
                                    group: true,
                                    layout: 'row',
                                    flex: 50,
                                    fullHeight: true,
                                    children: [
                                        { flex: 100, fullWidth: true, bottomPadding: true }
                                    ]
                                },
                                {
                                    group: true,
                                    layout: 'row',
                                    flex: 50,
                                    fullHeight: true,
                                    children: [
                                        { flex: 25, fullWidth: true, rightPadding: true, topPadding: true },
                                        { flex: 25, fullWidth: true, leftPadding: true, rightPadding: true, topPadding: true },
                                        { flex: 25, fullWidth: true, leftPadding: true, rightPadding: true, topPadding: true },
                                        { flex: 25, fullWidth: true, leftPadding: true, topPadding: true }
                                    ]
                                }
                            ]
                        }
                    ],
                    // 6
                    [
                        {
                            group: true,
                            layout: 'column',
                            flex: 100,
                            fullHeight: true,
                            children: [
                                {
                                    group: true,
                                    layout: 'row',
                                    flex: 50,
                                    fullHeight: true,
                                    children: [
                                        { flex: 33, fullWidth: true, rightPadding: true, bottomPadding: true },
                                        { flex: 33, fullWidth: true, leftPadding: true, rightPadding: true, bottomPadding: true },
                                        { flex: 33, fullWidth: true, leftPadding: true, bottomPadding: true }
                                    ]
                                },
                                {
                                    group: true,
                                    layout: 'row',
                                    flex: 50,
                                    fullHeight: true,
                                    children: [
                                        { flex: 33, fullWidth: true, rightPadding: true, topPadding: true },
                                        { flex: 33, fullWidth: true, leftPadding: true, rightPadding: true, topPadding: true },
                                        { flex: 33, fullWidth: true, leftPadding: true, topPadding: true }
                                    ]
                                }
                            ]
                        },
                        {
                            group: true,
                            layout: 'column',
                            flex: 100,
                            fullHeight: true,
                            children: [
                                {
                                    group: true,
                                    layout: 'row',
                                    flex: 50,
                                    fullHeight: true,
                                    children: [
                                        { flex: 50, fullWidth: true, rightPadding: true, bottomPadding: true },
                                        { flex: 25, fullWidth: true, leftPadding: true, rightPadding: true, bottomPadding: true },
                                        { flex: 25, fullWidth: true, leftPadding: true, bottomPadding: true }
                                    ]
                                },
                                {
                                    group: true,
                                    layout: 'row',
                                    flex: 50,
                                    fullHeight: true,
                                    children: [
                                        { flex: 50, fullWidth: true, rightPadding: true, topPadding: true },
                                        { flex: 25, fullWidth: true, leftPadding: true, rightPadding: true, topPadding: true },
                                        { flex: 25, fullWidth: true, leftPadding: true, topPadding: true }
                                    ]
                                }
                            ]
                        },
                        {
                            group: true,
                            layout: 'row',
                            flex: 100,
                            fullHeight: true,
                            children: [
                                { flex: 33, fullWidth: true, rightPadding: true },
                                {
                                    group: true,
                                    layout: 'column',
                                    flex: 67,
                                    fullHeight: true,
                                    children: [
                                        {
                                            group: true,
                                            layout: 'row',
                                            flex: 50,
                                            fullHeight: true,
                                            children: [
                                                { flex: 50, fullWidth: true, leftPadding: true, rightPadding: true, bottomPadding: true },
                                                { flex: 50, fullWidth: true, leftPadding: true, bottomPadding: true }
                                            ]
                                        },
                                        {
                                            group: true,
                                            layout: 'row',
                                            flex: 50,
                                            fullHeight: true,
                                            children: [
                                                { flex: 33, fullWidth: true, leftPadding: true, rightPadding: true, topPadding: true },
                                                { flex: 33, fullWidth: true, leftPadding: true, rightPadding: true, topPadding: true },
                                                { flex: 33, fullWidth: true, leftPadding: true, topPadding: true }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            group: true,
                            layout: 'column',
                            flex: 100,
                            fullHeight: true,
                            children: [
                                {
                                    group: true,
                                    layout: 'row',
                                    flex: 50,
                                    fullHeight: true,
                                    children: [
                                        { flex: 50, fullWidth: true, rightPadding: true, bottomPadding: true },
                                        { flex: 50, fullWidth: true, leftPadding: true, bottomPadding: true }
                                    ]
                                },
                                {
                                    group: true,
                                    layout: 'row',
                                    flex: 50,
                                    fullHeight: true,
                                    children: [
                                        { flex: 25, fullWidth: true, rightPadding: true, topPadding: true },
                                        { flex: 25, fullWidth: true, leftPadding: true, rightPadding: true, topPadding: true },
                                        { flex: 25, fullWidth: true, leftPadding: true, rightPadding: true, topPadding: true },
                                        { flex: 25, fullWidth: true, leftPadding: true, topPadding: true }
                                    ]
                                }
                            ]
                        }
                    ],
                    // 7
                    [
                        {
                            group: true,
                            layout: 'column',
                            flex: 100,
                            fullHeight: true,
                            children: [
                                {
                                    group: true,
                                    layout: 'row',
                                    flex: 50,
                                    fullHeight: true,
                                    children: [
                                        { flex: 33, fullWidth: true, rightPadding: true, bottomPadding: true },
                                        { flex: 33, fullWidth: true, leftPadding: true, rightPadding: true, bottomPadding: true },
                                        { flex: 33, fullWidth: true, leftPadding: true, bottomPadding: true }
                                    ]
                                },
                                {
                                    group: true,
                                    layout: 'row',
                                    flex: 50,
                                    fullHeight: true,
                                    children: [
                                        { flex: 25, fullWidth: true, rightPadding: true, topPadding: true },
                                        { flex: 25, fullWidth: true, leftPadding: true, rightPadding: true, topPadding: true },
                                        { flex: 25, fullWidth: true, leftPadding: true, rightPadding: true, topPadding: true },
                                        { flex: 25, fullWidth: true, leftPadding: true, topPadding: true }
                                    ]
                                }
                            ]
                        },
                        {
                            group: true,
                            layout: 'column',
                            flex: 100,
                            fullHeight: true,
                            children: [
                                {
                                    group: true,
                                    layout: 'row',
                                    flex: 50,
                                    fullHeight: true,
                                    children: [
                                        { flex: 50, fullWidth: true, rightPadding: true, bottomPadding: true },
                                        { flex: 25, fullWidth: true, leftPadding: true, rightPadding: true, bottomPadding: true },
                                        { flex: 25, fullWidth: true, leftPadding: true, bottomPadding: true }
                                    ]
                                },
                                {
                                    group: true,
                                    layout: 'row',
                                    flex: 50,
                                    fullHeight: true,
                                    children: [
                                        { flex: 25, fullWidth: true, rightPadding: true, topPadding: true },
                                        { flex: 25, fullWidth: true, leftPadding: true, rightPadding: true, topPadding: true },
                                        { flex: 25, fullWidth: true, leftPadding: true, rightPadding: true, topPadding: true },
                                        { flex: 25, fullWidth: true, leftPadding: true, topPadding: true }
                                    ]
                                }
                            ]
                        },
                        {
                            group: true,
                            layout: 'row',
                            flex: 100,
                            fullHeight: true,
                            children: [
                                { flex: 25, fullWidth: true, rightPadding: true },
                                {
                                    group: true,
                                    layout: 'column',
                                    flex: 75,
                                    fullHeight: true,
                                    children: [
                                        {
                                            group: true,
                                            layout: 'row',
                                            flex: 50,
                                            fullHeight: true,
                                            children: [
                                                { flex: 33, fullWidth: true, leftPadding: true, rightPadding: true, bottomPadding: true },
                                                { flex: 33, fullWidth: true, leftPadding: true, rightPadding: true, bottomPadding: true },
                                                { flex: 33, fullWidth: true, leftPadding: true, bottomPadding: true }
                                            ]
                                        },
                                        {
                                            group: true,
                                            layout: 'row',
                                            flex: 50,
                                            fullHeight: true,
                                            children: [
                                                { flex: 33, fullWidth: true, leftPadding: true, rightPadding: true, topPadding: true },
                                                { flex: 33, fullWidth: true, leftPadding: true, rightPadding: true, topPadding: true },
                                                { flex: 33, fullWidth: true, leftPadding: true, topPadding: true }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                    // 8
                    [
                        {
                            group: true,
                            layout: 'column',
                            flex: 100,
                            fullHeight: true,
                            fullWidth: true,
                            children: [
                                {
                                    group: true,
                                    layout: 'row',
                                    flex: 50,
                                    fullWidth: true,
                                    children: [
                                        { flex: 25, fullWidth: true, rightPadding: true, bottomPadding: true },
                                        { flex: 25, fullWidth: true, leftPadding: true, rightPadding: true, bottomPadding: true },
                                        { flex: 25, fullWidth: true, leftPadding: true, rightPadding: true, bottomPadding: true },
                                        { flex: 25, fullWidth: true, leftPadding: true, bottomPadding: true }
                                    ]
                                },
                                {
                                    group: true,
                                    layout: 'row',
                                    flex: 50,
                                    fullWidth: true,
                                    children: [
                                        { flex: 25, fullWidth: true, rightPadding: true, topPadding: true },
                                        { flex: 25, fullWidth: true, leftPadding: true, rightPadding: true, topPadding: true },
                                        { flex: 25, fullWidth: true, leftPadding: true, rightPadding: true, topPadding: true },
                                        { flex: 25, fullWidth: true, leftPadding: true, topPadding: true }
                                    ]
                                }
                            ]
                        }
                    ]
                ];


            return {
                getColorClasses: getColorClasses,
                getAvatarColors: getAvatarColors,
                getEntityTypes: getEntityTypes,
                setErrorImageCSS: setErrorImageCSS,
                setImageMarginCSS: setImageMarginCSS,
                setIconMarginCSS: setIconMarginCSS,
                getAvatarUrl: getAvatarUrl,
                bindFile: bindFile,
                getCollageSchemes: getCollageSchemes
            };

            function getEntityTypes() {
                return entityTypes;
            };

            function getColorClasses() {
                return colorClasses;
            };

            function getAvatarColors() {
                return colors;
            };

            function getCollageSchemes() {
                return collageSchemes;
            };

            function getAvatarUrl(partyId, partyName, id, type, noRedirect, noDefault) {
                var
                    timestamp = Math.floor(new Date().getTime() / 1000) * 1000,
                    colorClassIndex = pipStrings.hashCode(id) % colors.length,
                    chr = null,
                    url = null, default_template = '',
                    serverUrl = pipRest.serverUrl();

                noRedirect = noRedirect && noRedirect === true ? '&no_redirect=true' : '';
                if ((type && id && partyId) || (partyId)) {
                    if (type && id && partyId) {
                        if (type == 'category') return;
                        if (!noDefault) default_template = 'default_template='
                        + type + '&bg=' + colors[colorClassIndex]
                        + '&fg=white&';
                        if (entityTypes[type] == 'goals' || entityTypes[type] == 'areas' ) {
                            url = serverUrl + '/api/parties/' + partyId + '/' + entityTypes[type]
                            + '/' + id + '/avatar?' + default_template + 'timestamp=' + timestamp
                            + '&obj_id=' + id + noRedirect;
                        }
                    } else if (partyId && partyName) {
                        colorClassIndex = pipStrings.hashCode(partyId) % colors.length;
                        chr = (partyName[0] || '?').toUpperCase();
                        if (!noDefault) default_template = 'default_template=letter&bg=' + colors[colorClassIndex]
                        + '&fg=white&chr=' + chr + '&';
                        url = serverUrl + '/api/parties/' + partyId
                        + '/avatar?' + default_template + 'timestamp=' + timestamp + '&obj_id=' + partyId + noRedirect;
                    } else if (partyId && (!type && !id)) {
                        url = serverUrl + '/api/parties/' + partyId
                        + '/avatar?timestamp=' + timestamp + '&obj_id=' + partyId + noRedirect;
                    }
                }

                return url;
            };

            function bindFile(imageId, successCallback, errorCallback) {
                var url,
                    userId = ($rootScope.$user || {}).id,
                    partyId = ($rootScope.$party || {}).id || userId,
                    fileUrl = pipRest.serverUrl() + "/api/parties/" + partyId + "/files/" + imageId;

                //if (addHttpHeaders() && fileUrl)
                if (fileUrl)
                    $http.get(fileUrl)
                        .success(function (response) {
                            url = response && response.url ? response.url : '';

                            if (successCallback) successCallback(url);
                        })
                        .error(function (error) {
                            if (errorCallback) errorCallback(error);
                        });
            };

            function setErrorImageCSS(image, params) {
                var cssParams = {
                    'width': '',
                    'margin-left': '',
                    'height': '',
                    'margin-top': ''
                };

                if (params) cssParams = _.assign(cssParams, params);

                if (image)  image.css(cssParams);
            };

            function setImageMarginCSS($element, image, params) {
                var
                    containerWidth = $element.width ? $element.width() : $element.clientWidth, // || 80,
                    //containerWidth = $element.clientWidth ? $element.clientWidth : $element.width, // || 80,
                    //containerHeight = $element.clientHeight ? $element.clientHeight : $element.height, // || 80,
                    containerHeight = $element.height ? $element.height() : $element.clientHeight, // || 80,
                    imageWidth = image[0].naturalWidth || image.width,
                    imageHeight = image[0].naturalHeight || image.height,
                    margin = 0;
                var cssParams = {};

                if ((imageWidth / containerWidth) > (imageHeight / containerHeight)) {
                    margin = -((imageWidth / imageHeight * containerHeight - containerWidth) / 2);
                    cssParams['margin-left'] = '' + margin + 'px';
                    cssParams['height'] = '' + containerHeight + 'px';//'100%';
                    cssParams['width'] = '' + imageWidth * containerHeight/imageHeight + 'px';//'100%';
                    cssParams['margin-top'] = '';
                } else {
                    margin = -((imageHeight / imageWidth * containerWidth - containerHeight) / 2);
                    cssParams['margin-top'] = '' + margin + 'px';
                    cssParams['height'] = '' + imageHeight * containerWidth/imageWidth + 'px';//'100%';
                    cssParams['width'] = '' + containerWidth + 'px';//'100%';
                    cssParams['margin-left'] = '';
                }

                if (params) cssParams = _.assign(cssParams, params);

                image.css(cssParams);
            };

            function setIconMarginCSS(container, icon) {
                var
                    containerWidth = container.clientWidth ? container.clientWidth : container.width,
                    containerHeight = container.clientHeight ? container.clientHeight : container.height,
                    margin = 0,
                    iconSize = containerWidth > containerHeight ? containerHeight : containerWidth;

                var cssParams = {
                    'width': '' + iconSize + 'px',
                    'margin-left': '',
                    'height': '' + iconSize + 'px',
                    'margin-top': ''
                };

                if ((containerWidth) > (containerHeight)) {
                    margin = ((containerWidth - containerHeight) / 2);
                    cssParams['margin-left'] = '' + margin + 'px';
                } else {
                    margin = ((containerHeight - containerWidth) / 2);
                    cssParams['margin-top'] = '' + margin + 'px';
                }

                icon.css(cssParams);
            };

        }]
    );

})();


//# sourceMappingURL=pip-webui-pictures.js.map
