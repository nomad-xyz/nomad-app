const webpack = require('webpack')

module.exports = {
  configureWebpack: () => ({
    plugins: [
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
    ],
    transpileDependencies: true,
    devTool: 'source-map',
  }),
  // options...
  devServer: {
    proxy: 'http://localhost:8080/',
  },
  transpileDependencies: ['@sinclair/typebox'],
}
