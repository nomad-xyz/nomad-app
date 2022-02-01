const webpack = require('webpack')

module.exports = {
  configureWebpack: () => ({
    plugins: [
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
    ],
  }),
  // options...
  devServer: {
    proxy: 'http://localhost:8080/',
  },
  devTool: 'source-map',
  transpileDependencies: ['@sinclair/typebox'],
}
