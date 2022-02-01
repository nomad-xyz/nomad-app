const webpack = require('webpack')

module.exports = {
  configureWebpack: () => ({
    plugins: [
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
    ],
    devtool: 'source-map',
  }),
  // options...
  devServer: {
    proxy: 'http://localhost:8080/',
  },
  transpileDependencies: ['@sinclair/typebox'],
}
