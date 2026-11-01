const commonConfig = require("./webpack.common");

module.exports = {
  ...commonConfig,
  mode: "development",
  devServer: {
    static: "./dist",
    open: true,
  },
};
