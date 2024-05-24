const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  entry: {
    script: './scripts/test.js',
    styleTW: './styles/normal.css',
  },
  output: {
    filename: 'scripts/[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', { modules: 'auto' }]],
            sourceType: 'module',
          }
        }
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html',
      chunks: ['index', 'styleTW'],
    }),
    new HtmlWebpackPlugin({
      filename: 'pages/A_propos.html',
      template: './pages/A_propos.html',
      chunks: ['A_propos', 'styleTW'],
    }),
    new HtmlWebpackPlugin({
        filename: 'pages/inscription.html',
        template: './pages/inscription.html',
        chunks: ['inscription', 'styleTW'],
    }),
    new HtmlWebpackPlugin({
      filename: 'pages/connexion.html',
      template: './pages/connexion.html',
      chunks: ['connexion', 'styleTW'],
    }),
    new HtmlWebpackPlugin({
        filename: 'pages/mydraw.html',
        template: './pages/mydraw.html',
        chunks: ['mydraw', 'styleTW'],
    }),
    new HtmlWebpackPlugin({
      filename: 'pages/AllDraw.html',
      template: './pages/AllDraw.html',
      chunks: ['AllDraw', 'styleTW'],
    }),
    new HtmlWebpackPlugin({
        filename: 'pages/OnlySee.html',
        template: './pages/OnlySee.html',
        chunks: ['OnlySee', 'styleTW'],
    }),
    new HtmlWebpackPlugin({
        filename: 'pages/dessin.html',
        template: './pages/dessin.html',
        chunks: ['dessin', 'styleTW'],
    }),
    new MiniCssExtractPlugin({
      filename: 'styles/[name].css',
    }),
  ],
  resolve: {
    extensions: ['.js'],
  },
};
