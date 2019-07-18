const path = require('path');
const MinifyPlugin = require("babel-minify-webpack-plugin");


module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'rkdrnf-watcher.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
    library: 'rkdrnfWatcher',
    umdNamedDefine: true,
    globalObject: `(typeof self !== 'undefined' ? self : this)`
  }
};