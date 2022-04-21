const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      fallback: {
        stream: require.resolve('stream-browserify'),
        url: require.resolve('url/'),
        crypto: require.resolve('crypto-browserify'),
        assert: require.resolve('assert/'),
        fs: false,
        net: false,
        tls: false,
      },
    },
    module: {
      rules: [
        {
          test: /\.wasm$/,
          type: 'webassembly/sync',
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
      syncWebAssembly: true,
      topLevelAwait: true,
    },
  },
  chainWebpack: config => {
    config
        .plugin('html')
        .tap(args => {
          args[0].url = process.env.DEPLOY_PRIME_URL
          return args
        })
  }
})
