/**
 * @file Registration of basic WebUI controls
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function (angular) {
    'use strict';

    angular.module('pipControls', [
        'pipMarkdown',
        'pipColorPicker',
        'pipRoutingProgress',
        'pipPopover',
        'pipImageSlider',
        'pipToasts',
        'pipUnsavedChanges',
        'pipControls.Translate',
        'pipDraggable'
    ]);

})(window.angular);

