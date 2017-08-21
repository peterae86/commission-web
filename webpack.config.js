import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import AddAssetHtmlPlugin from 'add-asset-html-webpack-plugin';
import packageJson from './package';
import path from 'path';
import autoprefixer from 'autoprefixer';

const distDir = "./src/" + packageJson.name;
const dllDir = "./src/" + packageJson.name + "/dllVendor";
const dllManifest = require(path.join(__dirname, dllDir, '/vendor-manifest.json'));

export default {

  //These options were replaced by a single option resolve.modules. See resolving for more usage.
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  devtool: 'eval-source-map', // more info:https://webpack.github.io/docs/build-performance.html#sourcemaps and https://webpack.github.io/docs/configuration.html#devtool
  entry: [
      'webpack-hot-middleware/client?reload=true',
      path.resolve(__dirname, 'src/index.js'),
  ],
  // Defining path seems necessary for this to work consistently on Windows machines.
  target: 'web', // necessary per https://webpack.github.io/docs/testing.html#compile-and-test
  output: {
    path: path.resolve(__dirname, distDir), // Note: Physical files are only output by the production build task `npm run build`.
    publicPath: '/',
    filename: distDir + "/[name].js",
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      debug: true
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'), // Tells React to build in either dev or prod modes. https://facebook.github.io/react/downloads.html (See bottom)
      __DEV__: true
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DllReferencePlugin({
      context: path.join(__dirname),
      manifest: dllManifest
    }),
    new HtmlWebpackPlugin({     // Create HTML file that includes references to bundled CSS and JS.
        template: 'src/index.ejs',
        minify: {
          removeComments: true,
          collapseWhitespace: true
        },
        inject: true,
        remoteDebugger: ""
    }),
    new AddAssetHtmlPlugin({
      filepath: require.resolve(path.join(__dirname, dllDir, dllManifest.name + ".dll.js")),
      includeSourcemap: true,
      hash: true,
      outputPath: path.resolve(__dirname, distDir + '/dll'), // Note: Physical files are only output by the production build task `npm run build`.
      publicPath: '/dll',
    })
  ],
  module: {
    rules: [
      {test: /\.jsx?$/, exclude: /node_modules/, use: ["babel-loader"]},
      {
        test: /\.(jpe?g|png|gif)$/i,
        use: [{
          loader: "file-loader",
          options: {
            "name": "[path][name].[ext]"
          }
        }]
      },
      {
        test: /\.ico$/,
        use: [{
          loader: "file-loader",
          options: {
            "name": "[path][name].[ext]"
          }
        }]
      },
      {
        test: /(\.css|\.scss)$/,
        use: ["style-loader", {
          loader: "css-loader",
          options: {
            sourceMap: true
          }
        }, {
          loader: "sass-loader",
          options: {
            "sourceMap": true
          }
        }]
      }
    ]
  }
};
