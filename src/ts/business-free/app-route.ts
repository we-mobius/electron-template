import { tapValueT, makeScopeManager } from 'MobiusUtils'
import { appRouteDriver, initAppRoute } from 'MobiusJS'

export const routeDriverScopeManager = makeScopeManager(appRouteDriver)
export const appRouteDriverInstance = routeDriverScopeManager.scope('app')

initAppRoute({
  instance: appRouteDriverInstance,
  startPath: '/home'
})

tapValueT('Route')(appRouteDriverInstance.outputs.route)
