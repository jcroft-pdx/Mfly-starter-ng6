var webpack = require('webpack');
var path    = require('path');
var config  = require('./webpack.config');

config.output = {
  filename: '[name].bundle.js',
  publicPath: '',
  path: path.resolve(__dirname, 'dist')
};

config.plugins = config.plugins.concat([

  new webpack.DefinePlugin({
    ANGULAR_DEBUG: false,
    DEBUG: false,
    MFLY_PROXY: false,
    SHOW_ERRORS: true
  })

]);

module.exports = config;
