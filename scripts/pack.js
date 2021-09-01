import packager from 'electron-packager'

const pack = () => {
  return packager({
    appCopyright: 'Copyright © 2021 cigaret.',
    appVersion: '0.1.0',
    arch: ['x64', 'arm64'],
    asar: true,
    dir: './dist',
    name: 'Mobius Electron Application',
    icon: './src/statics/favicons/favicon.ico',
    out: 'packed',
    overwrite: true,
    platform: ['win32']
  })
}

pack().then(res => {
  console.log('[pack] complete! ', res)
})
