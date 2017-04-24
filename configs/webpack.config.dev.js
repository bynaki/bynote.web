/**
 * webpack.comfig.dev
 */

const webpackConfig = require('./webpack.config.base')
const WebpackBrowserPlugin = require('webpack-browser-plugin')


webpackConfig.devServer = {
  port: 8080,
  host: "localhost",
  historyApiFallback: true,
  watchOptions: {aggregateTimeout: 300, poll: 1000},
  contentBase: './src',
  // open: true
};
webpackConfig.plugins.push(new WebpackBrowserPlugin({
  browser: 'Chrome',
}))

module.exports = webpackConfig
