# <img src="https://github.com/pip-webui/pip-webui/blob/master/doc/Logo.png" alt="Pip.WebUI Logo" style="max-width:30%"> <br/> Basic controls

![](https://img.shields.io/badge/license-MIT-blue.svg)

Pip.WebUI.Controls modules provides additional controls, that are "missing" in angular-material library.

### <a name="color_picker"></a>Color picker
<a href="doc/images/img-color-picker.png" style="border: 3px ridge #c8d2df; display: inline-block">
    <img src="doc/images/img-color-picker.png"/>
</a>

This component allows to chose needed color from passed palette. Passed palette colors should be in any of accepted
color format (as in CSS specification). This component can become disabled at any time.

Color picker [API reference](http://link.com)

[Online Example](http://webui.pipdevs.com/pip-webui-controls/index.html#/color_picker)

<br/>

### <a name="dialogs"></a>Dialogs
<a href="doc/images/img-info-dialog.png" style="border: 3px ridge #c8d2df; display: inline-block">
    <img src="doc/images/img-info-dialog.png"/>
</a>

Dialog component includes more than one dialog type exactly:
* confirmation dialog [example](http://webui.pipdevs.com/pip-webui-controls/index.html#/confirmation)
* conversion dialog [example](http://webui.pipdevs.com/pip-webui-controls/index.html#/conversion)
* error details dialog [example no online example](http://link.com)
* information dialog [example](http://webui.pipdevs.com/pip-webui-controls/index.html#/information)
* options dialog [example](http://webui.pipdevs.com/pip-webui-controls/index.html#/options)

Every dialog type is available as service and can be invoked from any controllers or services.
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

All dialogs are aligned at center of any screens.

Dialogs [API reference](http://link.com)

[Online Example](http://webui.pipdevs.com/pip-webui-controls/index.html#/color_picker)

<br/>

### <a name="date_range"></a>Date range control
<a href="doc/images/img-date.png" style="border: 3px ridge #c8d2df; display: inline-block">
    <img src="doc/images/img-date.png"/>
</a>

This component is consolidated complex data. This component have different types:
* daily
* weekly
* monthly

This component keeps Data JS Core format and allows to change data object by part of the whole data.

Date control [API reference](http://link.com)

[Online Example](http://webui.pipdevs.com/pip-webui-controls/index.html#/date)

<br/>

### <a name="image_slider"></a>Image slider
<a href="doc/images/img-slider.png" style="border: 3px ridge #c8d2df; display: inline-block">
    <img src="doc/images/img-slider.png"/>
</a>

Image slider component provides container for performing animated slideshows. Animation effect can be faiding or shifting.
Also for the component can be attached controls elements. Component is responsive and filled all available space of parent
container.

Image slider [API reference](http://link.com)

[Online Example](http://webui.pipdevs.com/pip-webui-controls/index.html#/image_slider)

<br/>

### <a name="markdown"></a>Markdown
<a href="doc/images/img-markdown.png" style="border: 3px ridge #c8d2df; display: inline-block">
    <img src="doc/images/img-markdown.png"/>
</a>

Markdown component provided section, which compiled markdown document into valid HTML. This component filled available width
of parent component.

Markdown [API reference](http://link.com)

[Online Example](http://webui.pipdevs.com/pip-webui-controls/index.html#/markdown)

<br/>

### <a name="popover"></a>Popover
<a href="doc/images/img-popover.png" style="border: 3px ridge #c8d2df; display: inline-block">
    <img src="doc/images/img-popover.png"/>
</a>

This component is available as service '$pipPopover' and it can be opened from any controller or directive. For example,
this component can be used to show intro tips in page heading.


Popover [API reference](http://link.com)

[Online Example](http://webui.pipdevs.com/pip-webui-controls/index.html#/popover)

<br/>

### <a name="progress"></a>Progress
<a href="doc/images/img-progress.png" style="border: 3px ridge #c8d2df; display: inline-block">
    <img src="doc/images/img-progress.png"/>
</a>

This component is provided centered block contained animated logo as usual. This component is handy to use for any pending
states (retriving data, transfer to another state etc).

Progress [API reference](http://link.com)

[Online Example](http://webui.pipdevs.com/pip-webui-controls/index.html#/progress)

<br/>

### <a name="refresh_btn"></a>Refresh button
<a href="doc/images/img-btn-refresh.png" style="border: 3px ridge #c8d2df; display: inline-block">
    <img src="doc/images/img-btn-refresh.png"/>
</a>

This component provides button with refresh icon which invokes passed function by click on it.

Refresh button [API reference](http://link.com)

[Online Example](http://webui.pipdevs.com/pip-webui-controls/index.html#/refresh)

<br/>

### <a name="tags"></a>Tags
<a href="doc/images/img-tags.png" style="border: 3px ridge #c8d2df; display: inline-block">
    <img src="doc/images/img-tags.png"/>
</a>

Tags provides a visual component to perform any lists in a handy format. It is suitable for showing category which it is
belonged.

Tags [API reference](http://link.com)

[Online Example](http://webui.pipdevs.com/pip-webui-controls/index.html#/tags)

<br/>

### <a name="time_edit"></a>Time edit
<a href="doc/images/img-time-edit.png" style="border: 3px ridge #c8d2df; display: inline-block">
    <img src="doc/images/img-time-edit.png"/>
</a>

Time edit [API reference](http://link.com)

[Online Example](http://webui.pipdevs.com/pip-webui-controls/index.html#/tags)

<br/>

### <a name="time_view"></a>Time view
<a href="doc/images/img-time-view.png" style="border: 3px ridge #c8d2df; display: inline-block">
    <img src="doc/images/img-time-view.png"/>
</a>

Time view [API reference](http://link.com)

[Online Example](http://webui.pipdevs.com/pip-webui-controls/index.html#/tags)

<br/>

### <a name="toasts"></a>Toast
<a href="doc/images/img-toast.png" style="border: 3px ridge #c8d2df; display: inline-block">
    <img src="doc/images/img-toast.png"/>
</a>

Toasts is a visual component to notify user about any happened actions. It can be located at any position of screen.
Usual, it is located at the bottom. Toasts is able to show some action buttons. Callback is passed within invoke
expression. On the screen less than 1200px the toast is expanded to all screen width.

Toast [API reference](http://link.com)

[Online Example](http://webui.pipdevs.com/pip-webui-controls/index.html#/toasts)

<br/>

### <a name="toggle_btn"></a>Toggle buttons
<a href="doc/images/img-toggle-btns.png" style="border: 3px ridge #c8d2df; display: inline-block">
    <img src="doc/images/img-toggle-btns.png"/>
</a>

These components provided button assets aligned into a horizontal line. The work principle like radio buttons elements.
In a single asset there is can be only one chosen button.

On mobile screens it is mutated into a simple dropdown list. This component also fills all available space.


Toggle buttons [API reference](http://link.com)

[Online Example](http://webui.pipdevs.com/pip-webui-controls/index.html#/toggle_buttons)


## Learn more about the module

- [User's guide](doc/UsersGuide.md)
- [Online samples](http://webui.pipdevs.com/pip-webui-controls/index.html)
- [API reference](http://webui-api.pipdevs.com/pip-webui-controls/index.html)
- [Developer's guide](doc/DevelopersGuide.md)
- [Changelog](CHANGELOG.md)
- [Pip.WebUI project website](http://www.pipwebui.org)
- [Pip.WebUI project wiki](https://github.com/pip-webui/pip-webui/wiki)
- [Pip.WebUI discussion forum](https://groups.google.com/forum/#!forum/pip-webui)
- [Pip.WebUI team blog](https://pip-webui.blogspot.com/)

## <a name="dependencies"></a>Module dependencies

* [pip-webui-lib](https://github.com/pip-webui/pip-webui-lib): angular, angular material and other 3rd party libraries
* [pip-webui-css](https://github.com/pip-webui/pip-webui-css): CSS styles and web components
* [pip-webui-core](https://github.com/pip-webui/pip-webui-core): localization and other core services

## <a name="license"></a>License

This module is released under [MIT license](License) and totally free for commercial and non-commercial use.
