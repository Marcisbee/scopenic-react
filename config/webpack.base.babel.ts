// @ts-nocheck
/**
 * COMMON WEBPACK CONFIGURATION
 */

// @ts-ignore TS2451
const path = require('path');
// @ts-ignore TS2451
const webpack = require('webpack');
// @ts-ignore TS2451
const HtmlWebpackPlugin = require('html-webpack-plugin');
const dotenv = require('dotenv');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { TypedCssModulesPlugin } = require('typed-css-modules-webpack-plugin');

const ENV_PATH = path.resolve(process.cwd(), '.env');
dotenv.config(ENV_PATH);

// @ts-ignore TS2339
process.noDeprecation = true;

module.exports = (options) => ({
  mode: options.mode,
  entry: options.entry,
  output: Object.assign(
    {
      path: path.resolve(process.cwd(), 'dist'),
      publicPath: '/'
    },
    options.output
  ), // Merge with env dependent settings
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            babelrc: false,
            presets: [
              '@babel/preset-env',
              '@babel/preset-typescript',
              '@babel/preset-react',
            ],
            plugins: [
              // plugin-proposal-decorators is only needed if you're using experimental decorators in TypeScript
              ['@babel/plugin-proposal-decorators', { legacy: true }],
              ['@babel/plugin-proposal-class-properties', { loose: true }],
            ],
          },
        },
      },
      {
        // Preprocess our own .css files
        // This is the place to add your own loaders (e.g. sass/less etc.)
        // for a list of loaders, see https://webpack.js.org/loaders/#styling
        test: /^(?!.*?\.module).*\.(sa|sc|c)ss$/,
        exclude: /node_modules/,
        use: [
          options.mode === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: options.mode === 'development',
            }
          },
        ],
      },
      {
        // Preprocess 3rd party .css files located in node_modules
        test: /^(?!.*?\.module).*\.(sa|sc|c)ss$/,
        include: /node_modules/,
        use: [
          options.mode === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: options.mode === 'development',
            }
          },
        ],
      },
      {
        test: /\.module\.(sa|sc|c)ss$/,
        exclude: /node_modules/,
        use: [
          options.mode === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: options.mode === 'development',
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: options.mode === 'development',
            }
          }
        ]
      },
      {
        test: /\.(eot|otf|ttf|woff|woff2)$/,
        use: 'file-loader',
      },
      {
        test: /\.(jpg|png|gif|ico)$/,
        use: 'file-loader',
      },
      {
        issuer: {
          test: /\.tsx?$/,
        },
        test: /\.icon\.svg$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              icon: true,
              svgoConfig: {
                plugins: [{ prefixIds: false }],
              },
            },
          },
          'url-loader',
        ],
      },
      {
        test: /(?!.*?\.icon)\.svg$/,
        use: [
          'url-loader',
        ],
      },
    ],
  },
  plugins: options.plugins.concat([
    new TypedCssModulesPlugin({
      globPattern: 'src/**/*.module.scss',
    }),

    new webpack.NamedModulesPlugin(),

    new webpack.ProvidePlugin({
      // make fetch available
      fetch: 'exports-loader?self.fetch!whatwg-fetch'
    }),

    // Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
    // inside your code for any environment checks; UglifyJS will automatically
    // drop any unreachable code.
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        API_URL: JSON.stringify(process.env.API_URL),
      },
    }),

    new MiniCssExtractPlugin({
      filename: options.mode === 'development' ? '[name].css' : '[name].[hash].css',
      chunkFilename: options.mode === 'development' ? '[id].css' : '[id].[hash].css'
    }),
  ]),
  resolve: {
    modules: ['node_modules'],
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    mainFields: ['browser', 'jsnext:main', 'main'],
    ...options.resolve,
  },
  devServer: options.devServer,
  devtool: options.devtool,
  target: 'web', // Make web variables accessible to webpack, e.g. window
  performance: options.performance || {},
  optimization: {
    namedModules: true,
    splitChunks: {
      cacheGroups: {
        default: false,
        vendors: false,
        // vendor chunk
        vendor: {
          name: 'vendor',
          // sync + async chunks
          chunks: 'all',
          // import file path containing node_modules
          test: /node_modules/,
          priority: 20,
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          priority: 10,
          reuseExistingChunk: true,
          enforce: true,
        },
      },
    },
  },
});
