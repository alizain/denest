const webpack = require("webpack")
const build = require("./base.config.js")()

build.plugins.push(
  new webpack.DefinePlugin({
    "process.env": {
      "NODE_ENV": "production"
    }
  })
)

build.plugins.push(
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: true
    },
    sourceMap: true
  })
)

build.devtool = "source-map"

module.exports = build
