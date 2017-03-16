import './dependencies/TranslateFilter';
import './color_picker';
import './image_slider';
import './markdown';
import './popover';
import './progress';
import './toast';

angular.module('pipControls', [
    'pipMarkdown',
    'pipColorPicker',
    'pipRoutingProgress',
    'pipPopover',
    'pipImageSlider',
    'pipToasts',
    'pipControls.Translate'
]);

export * from './image_slider';
export * from './popover';
export * from './toast';