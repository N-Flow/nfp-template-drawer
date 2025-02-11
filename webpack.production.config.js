const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const packageJson = require('./package.json');
const packageName = packageJson.name;

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  output: {
    filename: packageName + '.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.scss', '.sass', '.css'],
  },
  externals: {
    'oflow-interface': 'OFlowInterface',
    'react': 'React',
    'react-dom': 'ReactDOM',
    '@babylonjs/core': 'BabylonCore',
    'rhine-var': 'RhineVar',
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                namedExport: false,
                localIdentName: '[hash:base64]',
              }
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                namedExport: false,
                localIdentName: '[hash:base64]',
              },
            },
          },
        ],
      },
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: path.resolve(__dirname, 'tsconfig.production.json'),
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: packageName + '.css',
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin(),
    ],
  }
}
