import 'Styles/style.css'
import '@we-mobius/mobius-ui/css'

import { completeStateRD } from 'MobiusUtils'
import { initMobiusCSS, makeAppContainerRD, runApp } from 'MobiusUI'
import { initConfig, initTheme } from 'MobiusJS'

import { appTemplateRD } from 'Interface/app'

initMobiusCSS()
// initConfig()
initTheme({
  isAutoToggle: () => 'open'
})
console.warn('[Application] index.js loaded!')
completeStateRD.subscribe(() => {
  console.log('[Application] initialize start!')

  const appContainerRD = makeAppContainerRD('mobius-app', {
    className: 'mobius-app mobius-select--none'
  })
  runApp(appContainerRD, appTemplateRD)

  console.log('[Application] initialize ended!')
})
