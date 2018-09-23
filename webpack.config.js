const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

const dist = path.join(__dirname, 'dist')

module.exports = {
  entry: [
    'babel-polyfill',
    path.join(__dirname, 'apps', 'index.js')
  ],
  output: {
    path: dist,
    filename: '[name].bundle.js'
  },
  resolve: {
    alias: {
      apps: path.join(__dirname, 'apps')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'apps', 'index.html')
    }),
    new webpack.DefinePlugin({
      USE_METAMASK: JSON.stringify(process.argv.includes('--metamask'))
    })
  ],
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    host: '0.0.0.0'
  }
}
