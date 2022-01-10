const webpack = require('webpack')

module.exports = {
  configureWebpack: () => ({
    plugins: [
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
    ],
  }),
  transpileDependencies: [
    "@sinclair/typebox"
  ]
}
