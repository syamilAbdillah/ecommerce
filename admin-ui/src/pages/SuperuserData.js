import { createResource } from 'solid-js'
import { useSearchParams } from '@solidjs/router'
import { userFind } from '../api/user'

/** @type import('@solidjs/router/dist').RouteDataFunc */
function routeData() {
    const [searchParams] = useSearchParams()
    const [data] = createResource(
        () => ({
            take: Number(searchParams.take),
            page: Number( searchParams.page),
        }), 
        sp => userFind(sp)
    )

    return data
}

export default routeData