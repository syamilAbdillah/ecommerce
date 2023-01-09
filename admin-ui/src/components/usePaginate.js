import { useSearchParams } from "@solidjs/router";
import { createMemo } from "solid-js";

export function usePaginate() {
    const [searchParams, setSearchParams] = useSearchParams()
    const page = createMemo(function() {
        if(Number(searchParams.page) == Number(searchParams.page) && Number(searchParams.page) > 0) {
            return Number(searchParams.page)
        }

        return 1
    })

    const take = createMemo(function() {
        if(Number(searchParams.take) == Number(searchParams.take) && Number(searchParams.take) > 0) {
            return Number(searchParams.take)
        }

        return 10
    })

    const skip = createMemo(() => (page() - 1) * take())

    const next = () => setSearchParams({
        page: page() + 1
    })

    const prev = () => setSearchParams({ page: page() -1 })

    return {page, take, skip, next, prev}
}