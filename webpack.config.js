 var path = require('path');
 var webpack = require('webpack');

 var mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';

 module.exports = {
    mode: mode,
    entry: "./src/scripts/client/index.js",
    output: {
      path: path.resolve(__dirname, "public"),
      filename: "bundle.js"
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"]
            }
          }
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|jpe?g|gif)$/i,
          type: 'asset/resource'
        },
      ]
    }
  };