// const webpack = require("webpack");
const path = require('path');

module.exports = {
    // mode: 'production',
    mode: 'development',
    entry: './src/entry.js',
    output: {
        path: path.resolve(__dirname, 'public/js'),
        filename: 'bundle.js',
        // libraryTarget: "umd",
        // library: "Simulation",
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/
        }]
    }
};