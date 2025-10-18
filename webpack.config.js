const path = require('path')

const webpack = require('webpack')
const WebSocket = require('ws')

const packageJson = require('./package.json')

class CompilationNotifierPlugin {
  apply(compiler) {
    let wss

    compiler.hooks.compile.tap('CompilationNotifierPlugin', () => {
      if (wss) return
      wss = new WebSocket.Server({ port: packageJson.plugin.port.debug })
      console.log('\nCompilation NotifierPlugin Websocket Started.\n')
    })

    compiler.hooks.done.tap('CompilationNotifierPlugin', () => {
      if (!wss) return
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
      {
        test: /\.json$/,
        type: 'json',
      },
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: packageJson.plugin.port.dev,
    hot: false,
    watchFiles: ['src/**/*'],
    liveReload: false,
    open: false,
    allowedHosts: 'all',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    client: {
      reconnect: true,
      overlay: {
        warnings: false,
        errors: true,
      },
    },
  },
  plugins: [new webpack.HotModuleReplacementPlugin(), new CompilationNotifierPlugin()],
}
