import { derived, writable } from "svelte/store";
import { createRequestAPI } from "./createRequestAPI";

const store = writable({
    products: null,
    total: null,
    loading: false,
    error: null,
})

const api = createRequestAPI(`${import.meta.env.VITE_API}/products`)

export function useProductsFindService() {
    const products = derived(store, $store => $store.products)
    const total = derived(store, $store => $store.total)
    const loading = derived(store, $store => $store.loading)
    const error = derived(store, $store => $store.error)

    const find = async () => {
        store.update(s => ({...s, loading: true, error: null}))
        
        const result = await api('/')

        if(result.error) {
            store.update(s => ({...s, error: result.error}))
        }

        if(result.products && Number(result.total) == Number(result.total)) {
            store.update(s => ({
                ...s,
                products: result.products,
                total: Number(result.total)
            }))
        }

        store.update(s => ({...s, loading: false}))
    }

    return {products, loading, error, total, find}
}