const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/, // .jsまたは.jsxの拡張子を持つファイルにローダーを適用
        exclude: /node_modules/, // node_modulesディレクトリは除外
        use: {
          loader: "babel-loader", // Babelローダーを使用
          options: {
            presets: ["@babel/preset-react"], // Reactのプリセットを使用
          },
        },
      },
    ],
  },
  resolve: {
    fallback: {
      http: require.resolve("stream-http"),
    },
  },
};
