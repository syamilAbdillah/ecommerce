import { createResource } from "solid-js"
import userApi from "../api/user"

function routeData({params}) {
    const [data] = createResource(() => params, p => userApi.get(p.id))
    return data
}

export default routeData