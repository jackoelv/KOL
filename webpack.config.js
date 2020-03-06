const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  node: {
    fs: 'empty'
  },
  entry: './app/javascripts/app.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'app.js'
  },
  plugins: [
    // Copy our app's index.html to the build folder.
    new CopyWebpackPlugin([
      { from: './app/index.html', to: "index.html" },
      { from: './app/msg_text.html', to: "msg_text.html" },
      { from: './app/javascripts/jquery-3.1.1.slim.min.js', to: "jquery-3.1.1.slim.min.js" },
    ]),
  ],

  module: {
    rules: [
      {
       test: /\.css$/,
       use: [ 'style-loader', 'css-loader' ]
      }
    ],
    loaders: [
      { test: /\.json$/, use: 'json-loader' },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
          plugins: ['transform-runtime']
        }
      }
    ]
  }
}
