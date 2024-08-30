const mix = require('laravel-mix');
require('laravel-mix-react-css-modules');
require('mix-env-file');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */
mix.env(process.env.ENV_FILE);

mix.react('resources/js/app.js', 'public/js')
    .reactCSSModules()
    .webpackConfig({
        output: {
            filename: '[name].js',
            chunkFilename: 'js/chunk.[name].[contenthash].js',
        },
    });