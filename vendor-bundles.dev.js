import webpack from 'webpack';
import path from 'path';
import packageJson from './package.json';

const dllDir = "./src/" + packageJson.name + "/dllVendor";

export default {
  entry: {
    'vendor': [
      "react",
      "react-dom",
      "react-redux",
      "react-router",
      "react-router-redux",
      "redux",
      "redux-thunk"
    ]
  },
  devtool: '#source-map',
  output: {
    path: path.join(__dirname, dllDir),
    filename: '[name].dll.js',
    library: '[name]'
  },

  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, dllDir, '[name]-manifest.json'),
      name: '[name]'
    })
  ],
};
