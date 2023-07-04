const { merge } = require('webpack-merge');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const commonConfig = require('./webpack.common');
const packageJson = require('../package.json');

const prodConfig = {
  mode: 'production',
  devtool: 'source-map',
  output: {
    filename: '[name].[contenthash].js',
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
  ]
};

module.exports = merge(commonConfig, prodConfig);
