// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';
process.env.ASSET_PATH = '/';

var WebpackDevServer = require('webpack-dev-server'),
  webpack = require('webpack'),
  config = require('../webpack.config'),
  env = require('./env'),
  path = require('path');

var options = config.chromeExtensionBoilerplate || {};
var excludeEntriesToHotReload = options.notHotReload || [];

for (var entryName in config.entry) {
  if (excludeEntriesToHotReload.indexOf(entryName) === -1) {
    // config.entry[entryName] = [
    //   // 'webpack-dev-server/client?hot=true&http://localhost:' + env.PORT,
    //   `webpack-dev-server/client?hot=true&hostname=localhost&port=${env.PORT}`,
    //   'webpack/hot/dev-server',
    // ].concat(config.entry[entryName]);
    config.entry[entryName] = [
      'webpack/hot/dev-server',
      `webpack-dev-server/client?hot=true&hostname=localhost&port=${env.PORT}`,
    ].concat(config.entry[entryName]);
  }
}

config.plugins = [new webpack.HotModuleReplacementPlugin()].concat(
  config.plugins || []
);

delete config.chromeExtensionBoilerplate;

var compiler = webpack(config);

// var server = new WebpackDevServer(compiler, {
//   https: false,
//   hot: true,
//   injectClient: false,
//   writeToDisk: true,
//   port: env.PORT,
//   contentBase: path.join(__dirname, '../build'),
//   publicPath: `http://localhost:${env.PORT}`,
//   headers: {
//     'Access-Control-Allow-Origin': '*',
//   },
//   disableHostCheck: true,
// });

// if (process.env.NODE_ENV === 'development' && module.hot) {
//   module.hot.accept();
// }

// server.listen(env.PORT);

var server = new WebpackDevServer(
  {
    https: false,
    hot: false,
    client: false,
    host: 'localhost',
    port: env.PORT,
    static: {
      directory: path.join(__dirname, '../build'),
    },
    devMiddleware: {
      publicPath: `http://localhost:${env.PORT}/`,
      writeToDisk: true,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    allowedHosts: 'all',
  },
  compiler
);

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept();
}

(async () => {
  await server.start();
})();
