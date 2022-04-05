const { defineConfig } = require('@vue/cli-service');
const webpack = require('webpack');

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      fallback: {
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer'),
        process: require.resolve('process/browser'),
        url: require.resolve('url/'),
        crypto: require.resolve('crypto-browserify'),
        assert: require.resolve('assert/'),
        fs: false,
        net: false,
        tls: false
      }
    },
    module: {
      rules: [
        {
          test: /\.wasm$/,
          type: 'webassembly/async',
        },
      ],
    },
    plugins: [
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
    ],
    devtool: 'source-map',
    experiments: {
      asyncWebAssembly: true,
    },
  },
});
