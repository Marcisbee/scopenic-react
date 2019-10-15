// Important modules this config uses
// @ts-ignore TS2451
const path = require('path');
// @ts-ignore TS2451
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = require('./webpack.base.babel.ts')({
  mode: 'production',
  // In production, we skip all hot-reloading stuff
  entry: [
    // require.resolve('react-app-polyfill/ie11'),
    path.join(process.cwd(), 'src/index')
  ],

  // Utilize long-term caching by adding content hashes (not compilation hashes) to compiled assets
  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].chunk.js'
  },

  plugins: [

    // Minify and optimize the index.html
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      favicon: 'public/favicon.ico',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
      inject: true
    }),
  ],

  performance: {
    assetFilter: (assetFilename) => !(/(\.map$)|(^(main\.|favicon\.))/.test(assetFilename)),
  },
});
