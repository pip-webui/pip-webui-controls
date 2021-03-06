module.exports = {
    module: {
        name: 'pipControls',
        styles: 'index',
        export: 'pip.controls',
        standalone: 'pip.controls'
    },
    build: {
        js: false,
        ts: false,
        tsd: true,
        bundle: true,
        html: true,
        sass: true,
        lib: true,
        images: true,
        dist: false
    },
    browserify: {
        entries: [
            './temp/pip-webui-controls-html.min.js',
            './src/index.ts'
        ]
    },
    file: {
        lib: [
            '../pip-webui-test/dist/**/*',
            '../pip-webui-lib/dist/**/*',
            // '../pip-webui-css/dist/**/*',
            // '../pip-webui-csscomponents/dist/**/*',
            '../pip-webui-services/dist/**/*',
            //  '../pip-webui-data/dist/**/*',
            //  '../pip-webui-rest/dist/**/*',
            '../pip-webui-controls/dist/**/*',
            //  '../pip-webui-nav/dist/**/*',
            //  '../pip-webui-layouts/dist/**/*',
             '../pip-webui-dialogs/dist/**/*',
             '../pip-webui-themes/dist/**/*',             
            //  '../pip-webui-dates/dist/**/*',             
            // '../pip-webui-pictures/dist/**/*',
            // '../pip-webui-locations/dist/**/*',
            // '../pip-webui-documents/dist/**/*',
            // '../pip-webui-composite/dist/**/*',
            // '../pip-webui-errors/dist/**/*',
            // '../pip-webui-entry/dist/**/*',
            // '../pip-webui-settings/dist/**/*',
            // '../pip-webui-guidance/dist/**/*',
            // '../pip-webui-support/dist/**/*',
            // '../pip-webui-help/dist/**/*'
        ]
    },
    samples: {
        port: 8060
    },
    api: {
        port: 8061
    }
};
