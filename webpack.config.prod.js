const { merge } = require('webpack-merge');
const path = require('path');
const common = require('./webpack.config.js');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'public')
  },

  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  }
});