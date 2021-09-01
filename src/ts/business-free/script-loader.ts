import { tapValueT, makeScopeManager } from 'MobiusUtils'
import { scriptLoaderDriver } from 'MobiusJS'

export const scriptLoaderDriverScopeManager = makeScopeManager(scriptLoaderDriver)
export const appScriptLoaderDriverInstance = scriptLoaderDriverScopeManager.scope('app')

tapValueT('javascriptLoadResult')(appScriptLoaderDriverInstance.outputs.javascriptLoadResult)
