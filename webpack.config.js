var path = require('path');
const BabiliPlugin = require("babili-webpack-plugin");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: {
        'Freelist': ['./src/index.js'],
        'Worker': ['./src/worker_index.js']
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