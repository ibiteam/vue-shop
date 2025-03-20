import router from "./index";
export function appRoute(routeName, query = {}, routeType = 'push') { /*router参数：push,replace,默认是push*/
    if (routeType === 'replace') {
        router.replace({name: routeName, query: query})
    } else {
        router.push({name: routeName, query: query})
    }
}