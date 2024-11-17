const webpack = require('@nativescript/webpack');
const { resolve } = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = (env) => {
  webpack.init(env);
  const config = webpack.resolveConfig();

  // Add Node.js polyfills
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    path: require.resolve('path-browserify'),
    os: require.resolve('os-browserify'),
    util: require.resolve('util/'),
    buffer: require.resolve('buffer/'),
  };

  // Add environment variables support
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
    new Dotenv({
      path: resolve(__dirname, '.env'),
      systemvars: true,
      safe: true,
      defaults: true,
    })
  );

  return config;
};