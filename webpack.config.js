var path = require('path');
const BabiliPlugin = require("babili-webpack-plugin");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: {
        'Freemamba': ['./src/ui_index.js'],
        'Worker': ['./src/wk_index.js']
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, './dist/')
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './',
        hot: true
    },
    plugins: [
        //new BabiliPlugin({}, {test: /\.js($|\?)/i}),
        //new UglifyJSPlugin()
    ]
};