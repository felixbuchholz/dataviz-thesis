module.exports = {
  devServer: {
    host: "localhost"
  },
  publicPath: process.env.NODE_ENV === "production" ? "/thesis2019/" : "/"
};
