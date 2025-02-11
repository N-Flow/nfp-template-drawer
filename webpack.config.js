const path = require('path')
const webpack = require('webpack')
const WebSocket = require('ws')

class CompilationNotifierPlugin {
  apply(compiler) {
    let wss

    compiler.hooks.compile.tap('CompilationNotifierPlugin', () => {
      if (wss) return;
      wss = new WebSocket.Server({ port: 8081 })
      console.log('\nCompilation NotifierPlugin Websocket Started.\n')
    })

    compiler.hooks.done.tap('CompilationNotifierPlugin', () => {
      if (!wss) return;
      setTimeout(() => {
        let message = 'Compiled at: ' + Date.now()
        console.log('\n' + message + '\n')
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(message)
          }
        })
      }, 1)
    })
  }
}

module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                namedExport: false,
                localIdentName: '[path][name]_[local]__[hash:base64:8]',
              }
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                namedExport: false,
                localIdentName: '[path][name]_[local]__[hash:base64:8]',
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
            configFile: path.resolve(__dirname, 'tsconfig.json'),
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 8080,
    hot: false,
    watchFiles: ['src/**/*'],
    liveReload: false,
    open: false,
    client: {
      reconnect: true,
      overlay: {
        warnings: false,
        errors: true,
      }
    },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new CompilationNotifierPlugin(),
  ],
}
