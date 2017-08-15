var path = require('path');
const BabiliPlugin = require("babili-webpack-plugin");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'FreeList.min.js',
        path: path.resolve(__dirname, './dist/')
    },
    plugins: [
        //new BabiliPlugin({}, {test: /\.js($|\?)/i}),
        //new UglifyJSPlugin()
    ]
};