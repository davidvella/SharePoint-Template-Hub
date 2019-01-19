'use strict';

const gulp = require('gulp');
const build = require('@microsoft/sp-build-web');
const merge = require('webpack-merge');
const webpack = require('webpack');
build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

build
    .configureWebpack
    .setConfig({
        additionalConfiguration: function (config) {
            config
                .module
                .rules
                .push({
                    test: /\.scss$/,
                    use: [
                        'style-loader', // creates style nodes from JS strings
                        'css-loader', // translates CSS into CommonJS
                        'sass-loader' // compiles Sass to CSS, using Node Sass by default
                    ]
                },
                // All output '.js' files will have any sourcemaps re-processed by
                // 'source-map-loader'.
                {
                    enforce: 'pre',
                    test: /\.js$/,
                    loader: 'source-map-loader'
                },);

            if (build.getConfig().production) {
                var basePath = build.writeManifests.taskConfig.cdnBasePath;
                if (!basePath.endsWith('/')) {
                    basePath += '/';
                }
                config.output.publicPath = basePath;
            } else {
                config.output.publicPath = "/dist/";
            }

            let isDevelopment = process.env.NODE_ENV === 'DEVELOPMENT';
            let defineOptions;
            if (isDevelopment) {
                console.log('***********    Applying development settings to webpack *********************');
                defineOptions = {
                    '_TemplateHubName_': JSON.stringify('Template Hub'),
                    '_TemplateHubWebUrl_': JSON.stringify('https://occultum.sharepoint.com/sites/cthub2')
                }
            } else {
                // specify production keys here
                defineOptions = {
                    '_TemplateHubName_': JSON.stringify('https://your-real-api.com/')
                }
            }

            return merge(config, {
                plugins: [new webpack.DefinePlugin(defineOptions)]
            });
        }
    });

build.initialize(gulp);
