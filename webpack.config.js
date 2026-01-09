import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

import webpack from 'webpack'
import WebSocket from 'ws'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import TerserPlugin from 'terser-webpack-plugin'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'))
const packageName = packageJson.name

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

class MessagesProcessorPlugin {
  constructor(options = {}) {
    this.isDevelopment = options.isDevelopment || false
  }

  apply(compiler) {
    compiler.hooks.thisCompilation.tap('MessagesProcessorPlugin', (compilation) => {
      compilation.hooks.processAssets.tapAsync(
        {
          name: 'MessagesProcessorPlugin',
          stage: compilation.PROCESS_ASSETS_STAGE_ADDITIONAL
        },
        (assets, callback) => {
          this.processMessages(compilation, callback)
        }
      )
    })

    // 在开发环境中，监听 messages 文件变化
    if (this.isDevelopment) {
      compiler.hooks.afterCompile.tap('MessagesProcessorPlugin', (compilation) => {
        const messagesSourcePath = path.resolve(__dirname, 'messages')
        if (fs.existsSync(messagesSourcePath)) {
          const messageFiles = fs.readdirSync(messagesSourcePath)
            .filter(file => file.endsWith('.json'))
            .map(file => path.join(messagesSourcePath, file))

          // 将 messages 文件添加到 webpack 的依赖中，这样文件变化时会触发重新编译
          messageFiles.forEach(filePath => {
            compilation.fileDependencies.add(filePath)
          })
        }
      })
    }
  }

  processMessages(compilation, callback) {
    const messagesSourcePath = path.resolve(__dirname, 'messages')
    const messagesDistPath = 'messages'

    try {
      // 检查 messages 源目录是否存在
      if (!fs.existsSync(messagesSourcePath)) {
        console.warn('Messages directory not found, skipping messages processing.')
        callback()
        return
      }

      // 读取 messages 目录中的所有 .json 文件
      const messageFiles = fs.readdirSync(messagesSourcePath)
        .filter(file => file.endsWith('.json'))

      messageFiles.forEach(file => {
        const sourceFilePath = path.join(messagesSourcePath, file)
        const targetFilePath = path.join(messagesDistPath, file)

        try {
          // 读取原始 JSON 文件
          const jsonContent = fs.readFileSync(sourceFilePath, 'utf8')
          const jsonData = JSON.parse(jsonContent)

          // 简单压缩：移除所有不必要的空格和缩进
          const compressedJson = JSON.stringify(jsonData)

          // 添加到 webpack 编译输出
          compilation.emitAsset(targetFilePath, {
            source: () => compressedJson,
            size: () => compressedJson.length
          })

          console.log(`Messages file processed: ${file}`)
        } catch (error) {
          console.error(`Error processing messages file ${file}:`, error)
        }
      })

      callback()
    } catch (error) {
      console.error('Error in MessagesProcessorPlugin:', error)
      callback(error)
    }
  }
}

export default (env, argv) => {
  const isServe = argv.serve || process.env.WEBPACK_SERVE === 'true'
  const isDevelopment = isServe

  return {
    mode: isDevelopment ? 'development' : 'production',
    entry: './src/index.ts',
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: isServe ? '/' : `https://cdn.nextflow.art/public/plugins/${packageJson.plugin.id}/v${packageJson.version}/`,
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.scss', '.sass', '.css', '.json'],
    },
    externals: {
      'next-flow-interface': 'NextFlowInterface',
      'next-flow-design': 'NextFlowDesign',
      'next-flow-design/react': 'NextFlowDesignReact',
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
      clsx: 'clsx'
    },
    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: [
            isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                modules: {
                  namedExport: false,
                  localIdentName: isDevelopment
                    ? '[path][name]_[local]__[hash:base64:8]'
                    : '[hash:base64:8]',
                  ...(isDevelopment ? {} : { localIdentHashSalt: packageName }),
                },
              },
            },
            'sass-loader',
          ],
        },
        {
          test: /\.css$/i,
          use: [
            isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                modules: {
                  namedExport: false,
                  localIdentName: isDevelopment
                    ? '[path][name]_[local]__[hash:base64:8]'
                    : '[hash:base64:8]',
                  ...(isDevelopment ? {} : { localIdentHashSalt: packageName }),
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
              configFile: path.resolve(
                __dirname,
                isDevelopment ? 'tsconfig.json' : 'tsconfig.production.json'
              ),
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
    ...(isDevelopment
      ? {
        devServer: {
          static: {
            directory: path.join(__dirname, 'dist'),
          },
          port: packageJson.plugin.port.dev,
          hot: false,
          watchFiles: ['src/**/*', 'messages/**/*'],
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
        plugins: [new webpack.HotModuleReplacementPlugin(), new CompilationNotifierPlugin(), new MessagesProcessorPlugin({ isDevelopment })],
      }
      : {
        plugins: [
          new MiniCssExtractPlugin({
            filename: 'index.css',
          }),
          new MessagesProcessorPlugin(),
        ],
        optimization: {
          minimize: true,
          minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
        },
      }),
  }
}
