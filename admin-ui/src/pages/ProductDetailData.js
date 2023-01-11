import { productGet } from '../api/product'
import { createResource } from 'solid-js'
// import { user } from '../components/serviceAuth'

export function productDetailData({params}) {
    const [data] = createResource(() => params, p => productGet(p.id))

    return data
}