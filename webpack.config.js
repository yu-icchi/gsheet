'use strict';

const webpack = require('webpack');

module.exports = {
  entry: './lib/index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'gsheet.js',
    libraryTarget: 'this'
  },
  plugins: [
    // new webpack.optimize.UglifyJsPlugin({minimize: true})
  ],
  module: {
    preLoaders: [
    ],
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  node: {
    fs: 'empty'
  }
};
