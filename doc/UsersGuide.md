# Pip.WebUI.Controls User's Guide

## <a name="contents"></a> Contents
- [Installing](#install)
- [pip-color-picker directive](#color_picker)
- [pip-image-slider directive](#image_slider)
- [pip-markdown directive](#markdown)
- [pip-popover directive](#popover)
- [pip-routing-progress directive](#routing_progress)
- [pip-refresh-button directive](#refresh_button)
- [pip-tag-list directive](#tag_list)
- [pip-toggle-buttons directive](#toggle_buttons)
- [pipToasts service](#toasts)
- [Questions and bugs](#issues)


## <a name="install"></a> Installing

Add dependency to **pip-webui** into your **bower.json** or **package.json** file depending what you use.
```javascript
"dependencies": {
  ...
  "pip-webui": "*"
  ...
}
```

Alternatively you can install **pip-webui** manually using **bower**:
```bash
bower install pip-webui
```

or install it using **npm**:
```bash
npm install pip-webui
```

Include **pip-webui** files into your web application.
```html
<link rel="stylesheet" href=".../pip-webui-lib.min.css"/>
<link rel="stylesheet" href=".../pip-webui.min.css"/>
...
<script src=".../pip-webui-lib.min.js"></script>
<script src=".../pip-webui.min.js"></script>
```

Register **pipControls** module in angular module dependencies.
```javascript
angular.module('myApp',[..., 'pipControls']);
```

## <a name="color_picker"></a> pip-color-picker directive

**pip-color-picker** directive allows to select a color from predefined pallette.

### Usage
```html
<pip-color-picker ng-model="color" ng-disabled="disabled" pip-colors="colors">
</pip-color-picker>
```

<img src="images/img-color-picker.png"/>

See online sample [here...](http://webui.pipdevs.com/pip-webui-controls/index.html#/color_picker)

### Attributes
* **pip-colors** - colors array

## <a name="image_slider"></a> pip-image-slider directive

**pip-image-slider** directive creates an interactive image carusel with smooth animations. It is usually used on landing or guidance screens.

### Usage
```html
<div pip-image-slider pip-animation-type="'fading'" class="w-stretch" pip-animation-interval="5000">
     <div class="pip-animation-block w-stretch" ng-repeat="image in images">
         <img src="{{ image.url }}" alt="{{ image.url }}" class="w-stretch"/>
     </div>
</div>
```

<img src="images/img-slider.png"/>

See online sample [here...](http://webui.pipdevs.com/pip-webui-controls/index.html#/image_slider)

### Attributes
* **pip-animation-type** - type of animation (carousel, fading)
* **pip-animation-interval** - interval animation in ms. By default equal 4500 ms

## <a name="markdown"></a> pip-markdown directive

**pip-markdown** directive visualizes hypertext formated as markdown and converted int HTML.

### Usage
```html
<pip-markdown pip-text="text" pip-rebind="true" pip-line-count="5"></pip-markdown>
```

<img src="images/img-markdown.png"/>

See online sample [here...](http://webui.pipdevs.com/pip-webui-controls/index.html#/markdown)

### Attributes
* **pip-text** - text object
* **pip-line-count** - max number of lines for a display
* **pip-rebind** - binding field pip-text. By default equal false

## <a name="popover"></a> pip-popover directive

**pip-popover** directive provides nice looking popovers with achors. Usually that control is used for context guidance.

### Usage
```javascript 
pipPopover.show({
   class: 'pip-tip',
   locals: {
       title: $scope.title,
       content: $scope.content
   },
   cancelCallback: function () {
       console.log('backdrop clicked');
   },
   controller: 'customController',
   template: 'custom.html'
});
```

<img src="images/img-popover.png"/>

See online sample [here...](http://webui.pipdevs.com/pip-webui-controls/index.html#/popover)

### Methods
* **show** - open popover

## <a name="routing_progress"></a> pip-routing-progress directive

**pip-routing-progress** directive shows animated ring with a logo inside. It is used in page transitions and initial application loading.

### Usage
```html
<pip-routing-progress></pip-routing-progress>
```

<img src="images/img-progress.png"/>

See online samples [here...](http://webui.pipdevs.com/pip-webui-controls/index.html#/progress)

## <a name="refresh_button"></a> pip-refresh-button directive

**pip-refresh-button** shows at the top of the screen when new data is available. By clicking on it, user triggers the update. It is used as a visual confirmation of he data arrival and helps to manager user expectations.

### Usage
```html
<pip-refresh-button pip-text="refreshText" pip-visible="showRefresh" pip-refresh="onRefresh()">
</pip-refresh-button>
```

<img src="images/img-btn-refresh.png"/>

See online samples [here...](http://webui.pipdevs.com/pip-webui-controls/index.html#/refresh)

### Attributes
* **pip-text** - string to display text in refresh toast 
* **pip-refresh** - function for updating string

## <a name="tag_list"></a> pip-tag-list directive

**pip-tag-list** directive visializes a list of read-only chips (tags)

### Usage
```html
<pip-tag-list pip-tags="tags"
              pip-type="type"
              pip-type-local="typeLocal"
              pip-rebind="true">
</pip-tag-list>
```

<img src="images/img-tags.png"/>

See online samples [here...](http://webui.pipdevs.com/pip-webui-controls/index.html#/tags)

### Attributes
* **pip-tags** - array of tags
* **pip-type** - string for type chips
* **pip-type-local** - string to display type chips
* **pip-rebind** - binding pip-tags array. By default equal false

## <a name="toggle_buttons"></a> pip-toggle-buttons directive

**pip-toggle-buttons** directive implement multiple radio buttons. Only one of them can be pressed at any time. On phones buttons are replaced with dropdown list.

### Usage
```html
<pip-toggle-buttons ng-model="activeButton"
                    pip-rebind="true"
                    pip-buttons="buttonsCollection">
</pip-toggle-buttons>
```

<img src="images/img-toggle-btns.png"/>

See online samples [here...](http://webui.pipdevs.com/pip-webui-controls/index.html#/toggle_buttons)

### Attributes
* **buttonsCollection** - array buttons 
* **pip-rebind** - binding buttonsCollection array. By default equal false

## <a name="toasts_service"></a> pipToasts service

**pipToast** services allows to show toast messages, formatted in different ways and presented in priority order. It ensures that one toast message will not hide another one, until timeout expires or users handles it.

### Usage
```javascript
thisModule.controller('ToastsController',
  function (pipToasts) {
  
     pipToasts.showNotification('Do you want accept goal?', ['accept', 'reject']);
     ...
     var error = {
           path: '/api/1.0/parties/:id/followers',
           method: 'POST',
           code: 400,
           name: 'Bad Request',
           error: 1402,
           message: 'Missing party information'
     };
     pipToasts.showError(error.message, null, null, null, error);
 });
```
<img src="images/img-toast.png"/>

See online samples [here...](http://webui.pipdevs.com/pip-webui-controls/index.html#/toasts)

### Methods
* **showNotification** - show toast with notification message and actions
* **showMessage** - show toast with notification message 
* **showError** - show toast with error message
* **hideAllToasts** - hide all toasts in queue
* **clearToasts** - delete all toasts in queue
* **removeToastsById** - delete toast in queue when id toast equal id in params
* **getToastById** - return data toast by id

## <a name="issues"></a> Questions and bugs

If you have any questions regarding the module, you can ask them using our 
[discussion forum](https://groups.google.com/forum/#!forum/pip-webui).

Bugs related to this module can be reported using [github issues](https://github.com/pip-webui/pip-webui-controls/issues).
