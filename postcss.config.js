/* eslint import/no-extraneous-dependencies: 0, global-require: 0 */

module.exports = {
  plugins: [
    require("postcss-initial")({
      reset: "all"
    }),
    require("autoprefixer")({
      browsers: ["last 5 versions"]
    }),
    require("postcss-import"),
    require("postcss-nested"),
    require("postcss-color-gray")
  ]
}
