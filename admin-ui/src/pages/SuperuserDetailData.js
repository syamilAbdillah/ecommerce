import { createResource } from "solid-js"
import {userGetById} from "../api/user"

/** @type import('@solidjs/router/dist').RouteDataFunc */
function routeData({params}) {
    const [data] = createResource(() => params, p => userGetById(p.id))
    return data
}

export default routeData