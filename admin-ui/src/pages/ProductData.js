import { createResource } from 'solid-js'
import { productFind } from '@/api/product'
import { usePaginate } from '../components/usePaginate'

export function productData() {
    const paginate = usePaginate()
    const [data] = createResource(
        () => ({ take: paginate.take(), page: paginate.page() }),
        p => productFind(p)
    )
    return data 
}