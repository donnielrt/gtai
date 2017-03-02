var path = require('path')
var webpack = require('webpack')

const config = {
    entry: [
        './src/framework.js',
    ],
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'neurojs-v2.js'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        hot: true
    },
    module: {
      loaders: [
        { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
      ]
    }
}

module.exports = config