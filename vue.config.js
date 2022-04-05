const { defineConfig } = require("@vue/cli-service");
const webpack = require('webpack');

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.wasm$/,
          type: "webassembly/sync",
        },
      ],
    },
    plugins: [
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
    ],
    devtool: 'source-map',
    experiments: {
      syncWebAssembly: true,
    },
  },
});
