var webpack = require('webpack'),
    ExtractTextPlugin = require('extract-text-webpack-plugin');
    HtmlPlugin = require('./plugins/html-plugin'),
    path = require('path');

module.exports = {
  entry: {
    'bundle-js': './scripts/main.js',
    'bundle-css': './styles/css/index.scss'
  },

  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
  },

  module: {
    loaders: [
      { test: /\.json$/, loader: 'json-loader'},
      { test: /\.js$/, exclude: /(node_modules|bower_components)\//, loader: 'babel-loader'},
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader')
      },
      {test: /\.(png|jpg|ico)$/, loader: 'url-loader?limit=10000'},
      {test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000'},
      {test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000'},
      {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000'},
      {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000'},
      {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000'}
    ]
  },

  plugins: [
    new ExtractTextPlugin('[name].css', {
      allChunks: true
    }),
    new HtmlPlugin('index.html'),
    new webpack.DefinePlugin({
      Environment: JSON.stringify(require('config')),
    })
  ],

  resolve: {
    root: './scripts',
    extensions: ['', '.js', '.json'],
  },
};
