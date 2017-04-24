/**
 * webpack.config.base
 */

const DefinePlugin = require('webpack/lib/DefinePlugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ProvidePlugin = require('webpack/lib/ProvidePlugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const {src, dist} = require('./helpers')


module.exports = {
  entry: {
    main: src('main.ts'),
  },
  output: {
    path: dist(),
    filename: '[name].js',
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.js', '.html'],
    alias: {
      'vue$': 'vue/dist/vue.common.js',
    },
  },
  module: {
    rules: [{
        test: /\.ts?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        // options: {
        //   transpileOnly: true,
        // }
      },
      {
        test: /\.html$/,
        loader: 'raw-loader',
        exclude: [src('index.html')],
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: 'css-loader'
        }),
      }],
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: src('assets'),
        to: dist('assets'),
      },
      {
        from: src('css'),
        to: dist('css'),
        ignore: ['main.css'],
      },
      {
        from: src('../node_modules/bootstrap/dist/css/bootstrap.min.css'),
        to: dist('css/bootstrap.min.css'),
      },
      {
        from: src('../node_modules/notie/dist/notie.min.css'),
        to: dist('css/notie.min.css'),
      },
      {
        from: src((process.env.NODE_ENV === 'production')? 
          'index.prod.html' : 'index.html'),
        to: dist('index.html'),
      },
    ]),
    new ExtractTextPlugin('css/[name].css'),
    new DefinePlugin({
      'process.env': {
        'ENV': `'${process.env.NODE_ENV}'`,
        'NODE_ENV': `'${process.env.NODE_ENV}'`,
      },
    }),
    new ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
      jquery: 'jquery',
    }),
  ],
}