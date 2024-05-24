const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  entry: {
    A_propos: './scripts/A_propos.js',
    AllDraw: './scripts/AllDraw.js',
    connexion: './scripts/connexion.js',
    dessin: './scripts/dessin.js',
    header: './scripts/header.js',
    index: './scripts/index.js',
    inscription: './scripts/inscription.js',
    main: './scripts/main.js',
    mydraw: './scripts/mydraw.js',
    OnlySee: './scripts/Onlysee.js',
    verif_connexion: './scripts/verif_connexion.js',
  },
  output: {
    filename: 'scripts/[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.png$/, // matchez uniquement les fichiers PNG
        type: 'asset/resource', // utilisez le loader asset/resource pour traiter les fichiers PNG comme des ressources
        generator: {
          filename: 'images/cercle.png', // définit le nom et le chemin de sortie des fichiers PNG
        },
      },
      {
        test: /\.png$/, // matchez uniquement les fichiers PNG
        type: 'asset/resource', // utilisez le loader asset/resource pour traiter les fichiers PNG comme des ressources
        generator: {
          filename: 'images/gomme.png', // définit le nom et le chemin de sortie des fichiers PNG
        },
      },
      {
        test: /\.png$/, // matchez uniquement les fichiers PNG
        type: 'asset/resource', // utilisez le loader asset/resource pour traiter les fichiers PNG comme des ressources
        generator: {
          filename: 'images/palette.png', // définit le nom et le chemin de sortie des fichiers PNG
        },
      },
      {
        test: /\.png$/, // matchez uniquement les fichiers PNG
        type: 'asset/resource', // utilisez le loader asset/resource pour traiter les fichiers PNG comme des ressources
        generator: {
          filename: 'images/rectangle.png', // définit le nom et le chemin de sortie des fichiers PNG
        },
      },
      {
        test: /\.png$/, // matchez uniquement les fichiers PNG
        type: 'asset/resource', // utilisez le loader asset/resource pour traiter les fichiers PNG comme des ressources
        generator: {
          filename: 'images/sauvegarde.png', // définit le nom et le chemin de sortie des fichiers PNG
        },
      },
      {
        test: /\.png$/, // matchez uniquement les fichiers PNG
        type: 'asset/resource', // utilisez le loader asset/resource pour traiter les fichiers PNG comme des ressources
        generator: {
          filename: 'images/seau.png', // définit le nom et le chemin de sortie des fichiers PNG
        },
      },
      {
        test: /\.png$/, // matchez uniquement les fichiers PNG
        type: 'asset/resource', // utilisez le loader asset/resource pour traiter les fichiers PNG comme des ressources
        generator: {
          filename: 'images/stylo.png', // définit le nom et le chemin de sortie des fichiers PNG
        },
      },
      {
        test: /\.png$/, // matchez uniquement les fichiers PNG
        type: 'asset/resource', // utilisez le loader asset/resource pour traiter les fichiers PNG comme des ressources
        generator: {
          filename: 'images/trash.png', // définit le nom et le chemin de sortie des fichiers PNG
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
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
      chunks: ['index'],
    }),
    new HtmlWebpackPlugin({
      filename: 'pages/A_propos.html',
      template: './pages/A_propos.html',
      chunks: ['A_propos'],
    }),
    new HtmlWebpackPlugin({
        filename: 'pages/inscription.html',
        template: './pages/inscription.html',
        chunks: ['inscription'],
    }),
    new HtmlWebpackPlugin({
      filename: 'pages/connexion.html',
      template: './pages/connexion.html',
      chunks: ['connexion'],
    }),
    new HtmlWebpackPlugin({
        filename: 'pages/mydraw.html',
        template: './pages/mydraw.html',
        chunks: ['mydraw'],
    }),
    new HtmlWebpackPlugin({
      filename: 'pages/AllDraw.html',
      template: './pages/AllDraw.html',
      chunks: ['AllDraw'],
    }),
    new HtmlWebpackPlugin({
        filename: 'pages/OnlySee.html',
        template: './pages/OnlySee.html',
        chunks: ['OnlySee'],
    }),
    new HtmlWebpackPlugin({
        filename: 'pages/dessin.html',
        template: './pages/dessin.html',
        chunks: ['dessin'],
    }),
    new MiniCssExtractPlugin({
      filename: 'styles/normal.css',
    }),
    new MiniCssExtractPlugin({
      filename: 'styles/A_propos.css',
    }),
    new MiniCssExtractPlugin({
      filename: 'styles/connexion.css',
    }),
    new MiniCssExtractPlugin({
      filename: 'styles/dessin.css',
    }),
    new MiniCssExtractPlugin({
      filename: 'styles/footer.css',
    }),
    new MiniCssExtractPlugin({
      filename: 'styles/header.css',
    }),
    new MiniCssExtractPlugin({
      filename: 'styles/index.css',
    }),
    new MiniCssExtractPlugin({
      filename: 'styles/inscription.css',
    }),
    new MiniCssExtractPlugin({
      filename: 'styles/mydraw.css',
    }),
    new MiniCssExtractPlugin({
      filename: 'styles/normal.css',
    }),
    new MiniCssExtractPlugin({
      filename: 'styles/OnlySee.css',
    }),
  ],
  resolve: {
    extensions: ['.js'],
  },
};
