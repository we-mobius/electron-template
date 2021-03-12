import { app, BrowserWindow, nativeImage } from 'electron'
import { cwd } from 'process'
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
    // frame: false,
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

app.whenReady().then(createWindow)

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
