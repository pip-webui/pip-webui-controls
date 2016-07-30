# Pip.WebUI.Controls User's Guide

## <a name="contents"></a> Contents
- [Installing](#install)
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
...
<script src=".../pip-webui-lib.min.js"></script>
<script src=".../pip-webui-test.min.js"></script>
```

Register **pipControls** module in angular module dependencies.
```javascript
angular.module('myApp',[..., 'pipControls']);
```

**Color picker** control allows to select a color from predefined pallette.

<a href="doc/images/img-color-picker.png" style="border: 3px ridge #c8d2df; display: inline-block">
    <img src="doc/images/img-color-picker.png"/>
</a>

See online sample [here...](http://webui.pipdevs.com/pip-webui-controls/index.html#/color_picker)

**Date** control allows to set a date using 3 comboboxes for day, month and year.

Todo: Add screenshot for pip-date control here

**Date range** control allows to pick a specific date range on daily, weekly, monthly or yearly time interval. 
This control can be helpful in various calendars and planning tools.

<a href="doc/images/img-date.png" style="border: 3px ridge #c8d2df; display: inline-block">
    <img src="doc/images/img-date.png"/>
</a>

See online sample [here...](http://webui.pipdevs.com/pip-webui-controls/index.html#/date)

**Time view** control visualizes specific time interval

<a href="doc/images/img-time-view.png" style="border: 3px ridge #c8d2df; display: inline-block">
    <img src="doc/images/img-time-view.png"/>
</a>

See online sample [here...](http://webui.pipdevs.com/pip-webui-controls/index.html#/tags)

**Time edit** control allows to specify time interval rounded to days or half-hour chunks

<a href="doc/images/img-time-edit.png" style="border: 3px ridge #c8d2df; display: inline-block">
    <img src="doc/images/img-time-edit.png"/>
</a>

See online sample [here...](http://webui.pipdevs.com/pip-webui-controls/index.html#/tags)

**Image slider** creates an interactive image carusel with smooth animations. This control is usually used on landing or guidance screens.

<a href="doc/images/img-slider.png" style="border: 3px ridge #c8d2df; display: inline-block">
    <img src="doc/images/img-slider.png"/>
</a>

See online sample [here...](http://webui.pipdevs.com/pip-webui-controls/index.html#/image_slider)

**Markdown** control visualizes hypertext formated as markdown and converted int HTML.

<a href="doc/images/img-markdown.png" style="border: 3px ridge #c8d2df; display: inline-block">
    <img src="doc/images/img-markdown.png"/>
</a>

See online sample [here...](http://webui.pipdevs.com/pip-webui-controls/index.html#/markdown)

**Popover** control provides nice looking popovers with achors. Usually that control is used for context guidance.

<a href="doc/images/img-popover.png" style="border: 3px ridge #c8d2df; display: inline-block">
    <img src="doc/images/img-popover.png"/>
</a>

See online sample [here...](http://webui.pipdevs.com/pip-webui-controls/index.html#/popover)

**Progress** control shows animated ring with a logo inside. It is used in page transitions and initial application loading.

<a href="doc/images/img-progress.png" style="border: 3px ridge #c8d2df; display: inline-block">
    <img src="doc/images/img-progress.png"/>
</a>

See online samples [here...](http://webui.pipdevs.com/pip-webui-controls/index.html#/progress)

**Refresh button** shows at the top of the screen when new data is available. By clicking on it, user triggers the update. It is used as a visual confirmation of he data arrival and helps to manager user expectations.

<a href="doc/images/img-btn-refresh.png" style="border: 3px ridge #c8d2df; display: inline-block">
    <img src="doc/images/img-btn-refresh.png"/>
</a>

See online samples [here...](http://webui.pipdevs.com/pip-webui-controls/index.html#/refresh)

**Tags** control visializes a list of read-only chips (tags)

<a href="doc/images/img-tags.png" style="border: 3px ridge #c8d2df; display: inline-block">
    <img src="doc/images/img-tags.png"/>
</a>

See online samples [here...](http://webui.pipdevs.com/pip-webui-controls/index.html#/tags)

**Toast** services allows to show toast messages, formatted in different ways and presented in priority order. It ensures that one toast message will not hide another one, until timeout expires or users handles it.

<a href="doc/images/img-toast.png" style="border: 3px ridge #c8d2df; display: inline-block">
    <img src="doc/images/img-toast.png"/>
</a>

See online samples [here...](http://webui.pipdevs.com/pip-webui-controls/index.html#/toasts)

**Toggle buttons** control implement multiple radio buttons. Only one of them can be pressed at any time. On phones buttons are replaced with dropdown list.

<a href="doc/images/img-toggle-btns.png" style="border: 3px ridge #c8d2df; display: inline-block">
    <img src="doc/images/img-toggle-btns.png"/>
</a>

See online samples [here...](http://webui.pipdevs.com/pip-webui-controls/index.html#/toggle_buttons)

**Standard dialogs** simplify developer task to show various messages. It includes:
- Information message dialog
- Confirmation message dialog
- Error message dialog
- Option selection dialog

<a href="doc/images/img-info-dialog.png" style="border: 3px ridge #c8d2df; display: inline-block">
    <img src="doc/images/img-info-dialog.png"/>
</a>

Standard dialogs require only few lines of code from developers:
```javascript
 pipInformationDialog.show(
        {
            event: event,
            title: 'Good!',
            message: 'Stuff %s was really good',
            item: 'Loooooong naaaaaaaaaaaaaame',
            ok: 'Take It'
        },
        function () {
            console.log('Taken');
        }
    );
```

See online samples [here...](http://webui.pipdevs.com/pip-webui-controls/index.html#/color_picker)


## <a name="issues"></a> Questions and bugs

If you have any questions regarding the module, you can ask them using our 
[discussion forum](https://groups.google.com/forum/#!forum/pip-webui).

Bugs related to this module can be reported using [github issues](https://github.com/pip-webui/pip-webui-controls/issues).
