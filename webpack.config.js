const path = require('path');

// Using a method instead of json object in order to access the 'argv' variable.
// Also it allows writing more advanced configuration in the future.
module.exports = (env, argv) => {
  return {
    entry: ['./frontend/entry-point.jsx', './frontend/entry-point.styl'],
    mode: argv.mode,
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
    // By default webpack outputs too much information, with these option on
    // webpack will only output the time which it took it to build the bundle.
    stats: {
      hash: false,
      version: false,
      warnings: false,
      modules: false,
      assets: false,
      entrypoints: false,
      builtAt: false
    },
    module: {
      rules: [
        {
          test: /\.jsx$/,
          loader: 'babel-loader',
          exclude: /node_modules/
        },
        {
          test: /\.styl$/,
          use: [
            'style-loader',
            'css-loader',
            'stylus-loader',
          ],
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      modules: ["node_modules"]
    },
  }
};
