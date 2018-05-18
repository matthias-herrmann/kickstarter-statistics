/* eslint-disable */
const HtmlWebPackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  context: path.join(__dirname, '/src'),
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  devtool: "inline-source-map",
  devServer: {
    contentBase: "./dist"
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: "main.js"
  },
  plugins: [
    new CopyWebpackPlugin([
      {from: "assets", to: "assets"}  // not working if brackets are in project path (see https://github.com/webpack-contrib/copy-webpack-plugin/issues/231)
    ], {debug: 'debug', copyUnmodified: true}),
    new HtmlWebPackPlugin({
      template: "./index.html",
      filename: "./index.html"
    }),
  ],
  entry: "./main.js"
};
