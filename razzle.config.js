const path = require('path');
const webpack = require('webpack');
const LoadableWebpackPlugin = require('@loadable/webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// Modifying the default Webpack config provided by razzle
// https://github.com/gregberge/loadable-components/tree/master/examples/razzle
module.exports = {
  modify: (config, { dev, target }) => {
    // Disable the source maps for production
    config.devtool = dev ? 'source-map' : false;

    // Turn off hints because the combined asset size exceeds the recommended limit
    config.performance = {
      ...config.performance,
      hints: false,
    };

    // @loadable support
    if (target === 'web') {
      const filename = path.resolve(__dirname, 'build');

      config.plugins = [
        ...config.plugins,
        new LoadableWebpackPlugin({
          outputAsset: false,
          writeToDisk: { filename },
        }),
      ];

      config.output.filename = dev ? 'static/js/[name].js' : 'static/js/[name].[chunkhash:8].js';

      config.optimization = Object.assign({}, config.optimization, {
        runtimeChunk: true,
        splitChunks: {
          chunks: 'all',
          name: dev,
        },
      });

      // Push the bundle analyzer plugin if the environment variable is set
      if (process.env.BUNDLE_ANALYZE) {
        config.plugins.push(new BundleAnalyzerPlugin());
      }
    }

    // Define the global environment variables used in the project
    config.plugins.push(
      new webpack.DefinePlugin({
        PORT: JSON.stringify(process.env.PORT),
        PRODUCT: JSON.stringify(process.env.PRODUCT),
        PRODUCT_DESCRIPTION: JSON.stringify(process.env.PRODUCT_DESCRIPTION),
        GATEWAY_API_SERVICE_URI: JSON.stringify(process.env.GATEWAY_API_SERVICE_URI),
        TASK_MANAGEMENT_TITLE: JSON.stringify(process.env.TASK_MANAGEMENT_TITLE),
      })
    );

    return config;
  },
};
