import './dependencies/TranslateFilter';
import './color_picker/ColorPicker';
import './image_slider';
import './markdown/Markdown';
import './popover';
import './progress/RoutingProgress';
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