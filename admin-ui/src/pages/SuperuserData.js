import { createResource } from 'solid-js'
import userApi from '@/api/user'
import { useSearchParams } from '@solidjs/router'

function routeData() {
    const [searchParams] = useSearchParams()
    const [data] = createResource(
        () => ({
            take: Number(searchParams.take),
            page: Number( searchParams.page),
        }), 
        sp => userApi.find(sp)
    )

    return data
}

export default routeData