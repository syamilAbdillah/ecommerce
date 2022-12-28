import { Show } from "solid-js"
import { useRouteData } from "@solidjs/router"

function SuperuserDetail() {
    const data = useRouteData()
    return <>
        <Show when={data.loading}>
            <p>loading...</p>
        </Show>

        <Show when={!data.loading}>
            <Show when={data().user}>
                <p>{JSON.stringify(data().user)}</p>
            </Show>

            <Show when={data().error}>
                <p>{data().error}</p>
            </Show>
        </Show>
    </>
}

export default SuperuserDetail