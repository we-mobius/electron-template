import { app, BrowserWindow, nativeImage, protocol } from 'electron'
import { cwd } from 'process'
import { existsSync } from 'fs'
import path from 'path'

export const ROOT = cwd()
export const rootResolvePath = (...paths) => path.resolve(ROOT, ...paths)

const appPath = app.getAppPath()
const resolveToAppPath = (...paths) => path.resolve(appPath, ...paths)

const createWindow = () => {
  // refer: https://www.electronjs.org/docs/api/native-image
  const iconPath = resolveToAppPath('./statics/favicons/favicon.ico')
  const iconImage = nativeImage.createFromPath(iconPath)

  // refer: https://www.electronjs.org/docs/api/browser-window
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    icon: iconImage,
    frame: false,
    // darkTheme: true,
    // transparent: true,
    webPreferences: {
      nodeIntegration: false,
      webSecurity: true,
      allowRunningInsecureContent: false
    }
  })

  win.loadFile('./index.html')

  console.log('[main] window initialized!')
}

app.whenReady().then(() => {
  // file:///D:/Files/CodeSpace/mobius-project-workspace/thoughts-matrix/dev/index.html
  protocol.interceptFileProtocol('file', (request, callback) => {
    // url:
    //  -> absolute: file:///D:/styles/static.78a6a6ff39.css
    //  -> relative: file:///statics/images/developing.7caabdb67e.png
    // baseurl:
    //  -> absolute: D:/styles/static.78a6a6ff39.css
    //  -> relative: statics/images/developing.7caabdb67e.png
    // basename:  static.78a6a6ff39.css
    const baseurl = request.url.slice(8)
    const basename = path.basename(baseurl)

    console.log('app: ', appPath)
    console.log('url: ', request.url)
    console.log('baseurl: ', baseurl)
    console.log('basename: ', path.basename(baseurl))

    let dest

    if (['static.js', 'index.js'].includes(basename)) {
      dest = path.resolve(appPath, basename)
    } else if (baseurl.startsWith('statics') || baseurl.startsWith('styles')) {
      dest = path.resolve(appPath, baseurl)
    } else if (baseurl.slice(3).startsWith('styles') || baseurl.slice(3).startsWith('statics')) {
      dest = path.resolve(appPath, baseurl.slice(3))
    } else {
      dest = baseurl
    }

    console.log('prev dest: ', dest)

    dest = existsSync(dest) ? dest : path.resolve(appPath, './index.html')

    console.log('post dest: ', dest)

    callback(dest)
  })
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
