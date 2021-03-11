import { emptyDirSync, copyFileSync, rootResolvePath } from './utils.js'
import { getWebpackConfig } from '../webpack.config.js'
import webpack from 'webpack'
import path from 'path'

const BUILD_MODE = 'production'
const BUILD_TARGET_DES = 'dist'
const resolvePathInDes = (...paths) => path.join(BUILD_TARGET_DES, ...paths)

const empty = () => {
  return new Promise((resolve) => {
    emptyDirSync(rootResolvePath(BUILD_TARGET_DES))
    resolve()
  })
}

const webpackConfig = getWebpackConfig({ mode: BUILD_MODE })
console.info('【webpackConfig】' + JSON.stringify(webpackConfig))
const [mainConfig, rendererConfig] = webpackConfig

const packRenderer = () => {
  return new Promise((resolve, reject) => {
    console.log('【pack renderer】 start...')
    webpack(rendererConfig)
      .run((err, stats) => {
        // @see https://webpack.js.org/api/node/#error-handling
        if (err) {
          console.error(err.stack || err)
          if (err.details) {
            console.error(err.details)
          }
          return
        }

        const info = stats.toJson()

        if (stats.hasErrors()) {
          console.error(info.errors)
        }

        if (stats.hasWarnings()) {
          console.warn(info.warnings)
        }

        console.log('【pack renderer】 complete!')

        resolve()
      })
  })
}

const packMain = () => {
  return new Promise((resolve, reject) => {
    console.log('【pack main】 start...')
    webpack(mainConfig)
      .run((err, stats) => {
        // @see https://webpack.js.org/api/node/#error-handling
        if (err) {
          console.error(err.stack || err)
          if (err.details) {
            console.error(err.details)
          }
          return
        }

        const info = stats.toJson()

        if (stats.hasErrors()) {
          console.error(info.errors)
        }

        if (stats.hasWarnings()) {
          console.warn(info.warnings)
        }

        console.log('【pack main】 complete...')

        resolve()
      })
  })
}

const copy = () => {
  return new Promise((resolve) => {
    console.log('【copy】 start...')
    copyFileSync(
      rootResolvePath('src/statics/images/thoughts-daily.png'),
      rootResolvePath(resolvePathInDes('statics/images/thoughts-daily.png'))
    )
    copyFileSync(
      rootResolvePath('src/statics/images/beian.png'),
      rootResolvePath(resolvePathInDes('statics/images/beian.png'))
    )
    copyFileSync(
      rootResolvePath('src/.package.json'),
      rootResolvePath(resolvePathInDes('package.json'))
    )
    console.log('【copy】 complete!')
    resolve()
  })
}

// execute
empty()
  .then(() => Promise.all([packRenderer(), packMain()]))
  .then(() => copy())
  .then(() => {
    console.log(`${BUILD_MODE} Build Complete!!!`)
  })
