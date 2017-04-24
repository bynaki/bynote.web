/**
 * webpack.config.prod
 */

const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin')
const CompressionPlugin = require('compression-webpack-plugin')
const webpackConfig = require('./webpack.config.base')
const {src} = require('./helpers')


webpackConfig.entry['main.min'] = src('main.ts')

webpackConfig.plugins = [...webpackConfig.plugins,
  new UglifyJsPlugin({
    include: /\.min\.js$/,
    minimize: true,
  }),
  new CompressionPlugin({
    asset: "[path].gz[query]",
    test: /\.min\.js$/,
  }),
]

module.exports = webpackConfig
