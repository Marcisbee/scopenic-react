// @ts-nocheck
/**
 * DEVELOPMENT WEBPACK CONFIGURATION
 */

// @ts-ignore TS2451
const path = require('path');
// @ts-ignore TS2451
const webpack = require('webpack');
// @ts-ignore TS2451
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = require('./webpack.base.babel.ts')({
  mode: 'development',
  entry: [
    path.join(process.cwd(), 'src/index')
  ],

  // Don't use hashes in dev mode for better performance
  output: {
    filename: '[name].js',
    chunkFilename: '[name].chunk.js'
  },

  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },

  // Add development plugins
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // Tell webpack we want hot reloading
    new webpack.WatchIgnorePlugin([
      /css\.d\.ts$/
    ]),
    new ForkTsCheckerWebpackPlugin({
      async: false,
    }),
    new HtmlWebpackPlugin({
      inject: true,
      favicon: 'public/favicon.ico',
      template: 'public/index.html',
    }),
  ],

  // Emit a source map for easier debugging
  // See https://webpack.js.org/configuration/devtool/#devtool
  devtool: 'eval-source-map',

  performance: {
    hints: false
  },

  devServer: {
    contentBase: path.join(__dirname, 'public'),
    compress: false,
    port: process.env.PORT || 3000,
    hot: true,
    open: true,
    overlay: true,
    historyApiFallback: true,
  },
});
