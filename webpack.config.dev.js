const { merge } = require('webpack-merge');
const path = require('path');
const common = require('./webpack.config.js');


module.exports = merge(common, {
  mode: 'development',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist')
  },
  
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 8080,
    writeToDisk: true
  },

});