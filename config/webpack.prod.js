import { rootResolvePath } from '../scripts/utils.js'
import { getMobiusConfig } from './mobius.config.js'
import { getProductionLoaders } from './loaders.config.js'
import { getProductionPlugins } from './plugins.config.js'

import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'

import path from 'path'

const PATHS = {
  src: rootResolvePath('src'),
  output: rootResolvePath('dist')
}

const reusedConfigs = {
  mode: 'production',
  output: {
    filename: '[name].js',
    path: PATHS.output,
    publicPath: getMobiusConfig().publicPath
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // 添加在 CSS 文件中引用的其它资源路径的前面，可用于配置 CDN，不如 file-loader 设置的 publicPath 优先
              // publicPath: 'https://cdn.cigaret.world/'
            }
          },
          'css-loader',
          'postcss-loader'
        ],
        sideEffects: true
      },
      {
        oneOf: [...getProductionLoaders()]
      }
    ]
  },
  plugins: [
    ...getProductionPlugins(),
    new MiniCssExtractPlugin({
      filename: 'styles/[name].[contenthash:10].css',
      chunkFilename: 'styles/[id].[contenthash:10].css'
    }),
    // CopyPlugin configurations: https://github.com/webpack-contrib/copy-webpack-plugin
    new CopyPlugin([
      {
        from: './src/statics/favicons/',
        // to 可以写相对 webpack.config.output.path 的路径，比如 './statics/favicons/'
        // 但 CopyPlugin 插件的文档中没有明确说明 to 最终路径的计算规则
        // 所以我个人推荐手动计算绝对路径，如下
        to: path.resolve(PATHS.output, './statics/favicons/'),
        toType: 'dir'
      },
      {
        from: './src/statics/styles/fonts/',
        to: path.resolve(PATHS.output, './statics/styles/fonts/'),
        toType: 'dir'
      }
    ])
  ],
  optimization: {
    minimize: true,
    providedExports: true,
    usedExports: true,
    sideEffects: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          sourceMap: true,
          compress: {
            drop_debugger: true,
            drop_console: true
          },
          format: {
            comments: false
          }
        }
      })
    ]
  },
  devtool: 'source-map'
  // devtool: 'hidden-nosources-source-map'
}

// mainConfig:
//   -> remove htmlWebpackPlugin for main entry
const mainConfig = { ...reusedConfigs }
mainConfig.plugins = mainConfig.plugins.slice(1)
// rendererConfig:
//   -> specify output target, refer: https://webpack.js.org/configuration/output/
const rendererConfig = { ...reusedConfigs }
// rendererConfig.output.globalObject = 'globalThis'
// rendererConfig.output.libraryTarget = 'commonjs2'

export const getProductionConfig = () => ([{
  target: 'electron-main',
  entry: {
    main: './src/main/main.js'
  },
  ...mainConfig
}, {
  target: 'web',
  // node: {
  //   global: true
  // },
  entry: {
    // NOTE: entry sort matters style cascading
    static: './src/static.js',
    index: './src/index.js'
  },
  ...rendererConfig
}])
