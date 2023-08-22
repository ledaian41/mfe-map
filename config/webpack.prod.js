const { merge } = require('webpack-merge');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const commonConfig = require('./webpack.common');
const packageJson = require('../package.json');
const CopyPlugin = require("copy-webpack-plugin");

const prodConfig = {
  mode: 'production',
  devtool: 'source-map',
  output: {
    filename: '[name].[contenthash].js',
    publicPath: '/',
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'map',
      filename: 'remoteEntry.js',
      exposes: {
        './KakaoMap': './src/kakaoMap/bootstrap',
        './GoogleMap': './src/googleMap/bootstrap',
      },
      shared: packageJson.dependencies,
    }),
    new CopyPlugin({
      patterns: [
        { from: "web-component", to: "web-component" },
      ],
      options: {
        concurrency: 100,
      },
    }),
  ]
};

module.exports = merge(commonConfig, prodConfig);
