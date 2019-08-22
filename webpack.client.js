/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { ReactLoadablePlugin } = require('react-loadable/webpack');

const config = {
  devtool: 'eval-source-map',
  entry: path.resolve(__dirname, 'src/client'),
  mode: 'development',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    chunkFilename: '[name].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'eslint-loader',
          },
        ],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: { minimize: true },
          },
        ],
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, 'src/common/assets/styles'),
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.less$/,
        include: path.resolve(__dirname, 'src/common/assets/styles'),
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
      {
        test: /\.(jpe?g|png|gif|svg|eot|ttf|woff)$/i,
        include: path.resolve(__dirname, 'src/common/assets/images'),
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'ssr-template.txt',
      inlineSource: '.(css)$',
    }),
    new ReactLoadablePlugin({
      filename: path.resolve(__dirname, 'dist', 'react-loadable.json'),
    }),
    new Dotenv({ path: './config/development.env' }),
  ],
};

module.exports = config;
