const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const InterpolateHtmlPlugin = require('interpolate-html-plugin');
const getClientEnvironment = require('./utils/env');

// Get environment variables to inject into our app.
const env = getClientEnvironment();

module.exports = {
  mode: 'development',
  entry: [
    require.resolve('react-app-polyfill/ie11'),
    './src/index',
  ],
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'main.[hash].min.js',
    publicPath: '/',
  },
  resolve: {
    modules: ['node_modules'],
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          // `.swcrc` can be used to configure swc
          loader: 'swc-loader',
        }
      },
      // {
      //   test: /\.ts(x?)$/,
      //   exclude: /node_modules/,
      //   use: {
      //     loader: 'babel-loader',
      //     options: {
      //       cacheDirectory: true,
      //       babelrc: false,
      //       presets: [
      //         [
      //           '@babel/preset-env',
      //           { targets: { browsers: 'last 2 versions' } }, // or whatever your project requires
      //         ],
      //         '@babel/preset-typescript',
      //         '@babel/preset-react',
      //       ],
      //       plugins: [
      //         // plugin-proposal-decorators is only needed if you're using experimental decorators in TypeScript
      //         ['@babel/plugin-proposal-decorators', { legacy: true }],
      //         ['@babel/plugin-proposal-class-properties', { loose: true }],
      //         'react-hot-loader/babel',
      //       ],
      //     },
      //   },
      // },
      {
        // Preprocess our own .css files
        // This is the place to add your own loaders (e.g. sass/less etc.)
        // for a list of loaders, see https://webpack.js.org/loaders/#styling
        test: /^(?!.*?\.module).*\.css$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader'],
      },
      {
        // Preprocess 3rd party .css files located in node_modules
        test: /^(?!.*?\.module).*\.css$/,
        include: /node_modules/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.module\.css$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'css-modules-typescript-loader',
            options: {
              mode: process.env.CI ? 'verify' : 'emit'
            }
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.(eot|otf|ttf|woff|woff2)$/,
        use: 'file-loader',
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              // Inline files smaller than 10 kB
              limit: 10 * 1024,
              noquotes: true,
            },
          },
        ],
      },
      {
        test: /\.(jpg|png|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              // Inline files smaller than 10 kB
              limit: 10 * 1024,
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                enabled: false,
                // NOTE: mozjpeg is disabled as it causes errors in some Linux environments
                // Try enabling it in your environment by switching the config to:
                // enabled: true,
                // progressive: true,
              },
              gifsicle: {
                interlaced: false,
              },
              optipng: {
                optimizationLevel: 7,
              },
              pngquant: {
                quality: '65-90',
                speed: 4,
              },
            },
          },
        ],
      },
      {
        test: /\.(mp4|webm)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
          },
        },
      },
    ],
  },
  resolve: {
    modules: ['node_modules', 'app'],
    extensions: ['.js', '.jsx', '.react.js', '.ts', '.tsx'],
    mainFields: ['browser', 'jsnext:main', 'main'],
  },
  devServer: {
    host: '0.0.0.0',
    contentBase: path.join(__dirname, 'public'),
    compress: false,
    port: process.env.PORT || 3000,
    hot: true,
    open: true,
    overlay: true,
    historyApiFallback: true,
  },
  // devtool: 'eval-source-map',
  devtool: 'cheap-module-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(env),
    }),
    new webpack.WatchIgnorePlugin([
      /css\.d\.ts$/
    ]),
    new ForkTsCheckerWebpackPlugin({
      async: false,
    }),
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      template: './public/index.html',
    }),
    new InterpolateHtmlPlugin(env),
  ],
  // Turn off performance hints during development because we don't do any
  // splitting or minification in interest of speed. These warnings become
  // cumbersome.
  performance: {
    hints: false,
  },
};
