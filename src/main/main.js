import { app, BrowserWindow, nativeImage } from 'electron'
import { cwd } from 'process'
import path from 'path'

export const ROOT = cwd()
export const rootResolvePath = (...paths) => path.resolve(ROOT, ...paths)

function createWindow () {
  // TODO: Differentiate different environments
  // refer: https://www.electronjs.org/docs/api/native-image
  console.log(ROOT)
  const iconPath = rootResolvePath('')

  // refer: https://www.electronjs.org/docs/api/browser-window
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    icon: './statics/favicons/favicon.ico',
    // frame: false,
    // darkTheme: true,
    // transparent: true,
    webPreferences: {
      nodeIntegration: false,
      webSecurity: true,
      allowRunningInsecureContent: false
    }
  })

  console.warn('[from main] oooooooooo!')

  win.loadFile('./index.html')
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
