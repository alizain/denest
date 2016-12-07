const ExtractTextPlugin = require("extract-text-webpack-plugin")
const path = require("path")

module.exports = function() {

  return {

    entry: [
      "whatwg-fetch", "./src/app.js"
    ],

    output: {
      path: path.resolve("./public/assets"),
      publicPath: "/assets/",
      filename: "bundle.js"
    },

    plugins: [
      new ExtractTextPlugin("bundle.css")
    ],

    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          loader: "babel-loader"
        }, {
          test: /\.json$/,
          loader: "json-loader"
        }, {
          test: /\.css$/,
          loaders: ExtractTextPlugin.extract({
            fallbackLoader: "style-loader?sourceMap",
            loader: [
              "css-loader?sourceMap",
              "postcss-loader?sourceMap"
            ]
          })
        }
      ]
    }

  }

}
