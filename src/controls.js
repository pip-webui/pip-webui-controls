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


