import { rootResolvePath } from '../scripts/utils.js'
import { getDevelopmentLoaders } from './loaders.config.js'
import { getDevelopmentPlugins } from './plugins.config.js'
import CopyPlugin from 'copy-webpack-plugin'
import path from 'path'

const PATHS = {
  output: rootResolvePath('dev')
}

const reusedConfigs = {
  mode: 'development',
  output: {
    path: PATHS.output
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        oneOf: [...getDevelopmentLoaders()]
      }
    ]
  },
  plugins: [
    ...getDevelopmentPlugins(),
    // CopyPlugin configurations: https://github.com/webpack-contrib/copy-webpack-plugin
    new CopyPlugin([
      {
        from: './src/statics/favicons/',
        // to 可以写相对 webpack.config.output.path 的路径，比如 './statics/favicons/'
        // 但 CopyPlugin 插件的文档中没有明确说明 to 最终路径的计算规则
        // 所以我个人推荐手动计算绝对路径，如下
        to: path.resolve(PATHS.output, './statics/favicons/'),
        toType: 'dir'
      }
    ])
  ],
  // devtool: 'eval-source-map',
  devtool: 'source-map',
  // ref: https://webpack.js.org/configuration/dev-server/
  // in ./scripts/dev.js
  devServer: {}
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

export const getDevelopmentConfig = () => ([{
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
