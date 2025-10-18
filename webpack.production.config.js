const path = require('path')

const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const packageJson = require('./package.json')
const packageName = packageJson.name

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.scss', '.sass', '.css', '.json'],
  },
  externals: {
    'next-flow-interface': 'NextFlowInterface',
    'next-flow-interface/api': 'NextFlowInterfaceApi',
    react: 'React',
    'react-dom': 'ReactDOM',
    '@babylonjs/core': 'BabylonCore',
    valtio: 'Valtio',
    'rhine-var': 'RhineVar',
    'rhine-var/react': 'RhineVarReact',
    antd: 'AntD',
    'file-type': 'FileType',
    mime: 'Mime',
    'brotli-wasm': 'BrotliWasm',
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
                localIdentName: '[hash:base64:8]',
                localIdentHashSalt: packageName,
              },
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
                localIdentName: '[hash:base64:8]',
                localIdentHashSalt: packageName,
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
      filename: 'index.css',
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
  },
}
