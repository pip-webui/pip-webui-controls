# Pip.WebUI Controls
UI controls is a sub-module of Pip.Services platform and can be used in applications based on the platform.

These ones are simple and atomic and used to solve local problem. The represented controls assets allow to resolve
the most common issues. All components have responsive layout and independence on screen size.

This module provides next functionality:

* Behaviors: Draggable, Focused, Selected, Infinite Scroll
* Side navigation bar and Application bar
* Simple controls: Markdown, Locations, Color Picker, Progress, Refresh, Toggle Buttons
* Standard dialogs: Information, Confirmation, Options

In the version 1.0.0 the implementation was cleaned up and covered with unit tests.
Implementation became fully portable across browser and devices.

[API reference](http://link.com)

### The complete library

* [https://github.com/pip-webui/pip-webui](https://github.com/pip-webui/pip-webui)

## Demos

[Examples Online](http://webui.pipdevs.com/pip-webui-controls/index.html)


## Quick links

* [Module dependencies](#dependencies)
* [Components](#components)
  - [Color picker](#color_picker)
  - [Dialogs (confirmation, converstaion, error, information)](#dialogs)
  - [Date range](#date_range)
  - [Image slider](#image_slider)
  - [Markdown](#markdown)
  - [Popover](#popover)
  - [Progress](#progress)
  - [Refresh button](#refresh_btn)
  - [Tags](#tags)
  - [Time edit](#time_edit)
  - [Time view](#time_view)
  - [Toast](#toasts)
  - [Toggle buttons](#toggle_btn)

* [Browsers compatibility](#compatibility)
* [Community](#community)
* [Contributing](#contributing)
* [Build](#build)
* [License](#license)


## <a name="dependencies"></a>Module dependencies

* <a href="https://github.com/pip-webui/pip-webui-tasks">pip-webui-tasks</a> - Helpful tasks for development
* <a href="https://github.com/pip-webui/pip-webui-lib">pip-webui-lib</a> - Vendor libraries
* <a href="https://github.com/pip-webui/pip-webui-css">pip-webui-css</a> - CSS Framework
* <a href="https://github.com/pip-webui/pip-webui-core">pip-webui-core</a> - Core platform module
* <a href="https://github.com/pip-webui/pip-webui-layouts">pip-webui-layouts</a> - Document layouts


## <a name="components"></a>Module components

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


## <a name="compatibility"></a>Compatibility

PIP.WEBUI has been thoroughly tested against all major browsers and supports:

 * IE11+,
 * Edge
 * Chrome 47+,
 * Firefox 43
 * Opera 35

## <a name="community"></a>Community

* Follow [@pip.webui on Twitter](http://link.com)
* Subscribe to the [PIP.WebUI Newsletter](http://link.com)
* Have a question that's not a feature request or bug report? Discuss on the [PIP Forum](https://groups.google.com/forum/#!forum/pipdevs)
* Have a feature request or find a bug? [Submit an issue](http://link.com)
* Join our Community Slack Group! [PIP Worldwide](http://link.com)


## <a name="contributing"></a>Contributing

Developers interested in contributing should read the following guidelines:

* [Issue Guidelines](http://somelink.com)
* [Contributing Guidelines](http://somelink.com)
* [Coding guidelines](http://somelink.com)

> Please do **not** ask general questions in an issue. Issues are only to report bugs, request
  enhancements, or request new features. For general questions and discussions, use the
  [Pip Devs Forum](https://groups.google.com/forum/#!forum/pipdevs).

It is important to note that for each release, the [ChangeLog](CHANGELOG.md) is a resource that will
itemize all:

- Bug Fixes
- New Features
- Breaking Changes

## <a name="build"></a>Build

Projects environment deploy is occurred using npm and gulp.

First install or update your local project's **npm** tools:

```bash
# First install all the NPM tools:
npm install

# Or update
npm update
```

Then run the **gulp** tasks:

```bash
# To clean '/build' and '/dist' directories
gulp clean

# To build distribution files in the `/dist` directory
gulp build

# To launch samples (build will open samples/index page in web browser)
gulp launch
```

For more details on how the build process works and additional commands (available for testing and
debugging) developers should read the [Build Instructions](docs/guides/BUILD.md).


## <a name="license"></a>License

PIP.WebUI is under [MIT licensed](LICENSE).

