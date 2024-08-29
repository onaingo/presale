const { override, addWebpackPlugin } = require('customize-cra');
const webpack = require('webpack');

module.exports = override(
  // Other overrides
  addWebpackPlugin(
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    })
  ),
  // Update devServer configuration
  (config) => {
    if (config.devServer) {
      config.devServer.setupMiddlewares = (middlewares, devServer) => {
        // You can add custom middleware here if needed
        // Example: middlewares.push(yourCustomMiddleware);
        return middlewares;
      };
      delete config.devServer.onAfterSetupMiddleware;
      delete config.devServer.onBeforeSetupMiddleware;
    }
    return config;
  }
);
