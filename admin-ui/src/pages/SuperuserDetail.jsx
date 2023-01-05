import { createSignal, Show } from "solid-js"
import { FiChevronLeft, FiTrash2 } from 'solid-icons/fi'
import { useRouteData, useParams, A } from "@solidjs/router"
import TextInput from '@/components/TextInput'
import DeleteButton from "../components/DeleteButton"
import { userDelete, userUpdate } from "../api/user"

function SuperuserDetail() {
    const data = useRouteData()
    const params = useParams()

    const [errors, setErrors] = createSignal({})
    const [hasError, setHasError] = createSignal(undefined)
    const [loading, setLoading] = createSignal(false)

    const handleSubmit = async e => {
        e.preventDefault()
        const userData = Object.fromEntries(new FormData(e.target))
        if(userData.password != userData.confirm) 
            return setErrors({confirm: 'tidak sama dengan password'})

        setLoading(true)
        setErrors({})     
        hasError() && setHasError(undefined)   
        
        const result = await userUpdate(params.id, userData)
        result.invalid_errors && setErrors(result.invalid_errors)
        result.user && alert('success')
        result.error && setHasError(result.error)


        setLoading(false)
    }

    const handleDelete = async e => {
        setLoading(true)
        hasError() && setHasError(undefined)

        const result = await userDelete(params.id)
        result.error && setHasError(result.error)
        
        /** @todo implement if success */
        console.log(result)

        setLoading(false)
    }

    return <>

        <div className="flex justify-between py-4">
            <A href="/superuser" inactiveClass="btn btn-neutral" end={true}>
                <FiChevronLeft></FiChevronLeft>
                <span>daftar superuser</span>
            </A>

            <DeleteButton onDelete={handleDelete}></DeleteButton>
        </div>

        <Show when={data.loading}>
            <p>loading...</p>
        </Show>

        <Show when={hasError()}>
            <p>{hasError()}</p>
        </Show>

        <Show when={!data.loading && !hasError()}>
            <Show when={data().user}>
                <form onSubmit={handleSubmit} className="grid gap-4 lg:grid-cols-2">
                    <TextInput 
                        label="Nama Superuser"
                        name="name"
                        required={true}
                        error={errors().name}
                        value={data().user.name}
                    />
                    <TextInput 
                        label="Email"
                        name="email"
                        type="email"
                        required={true}
                        error={errors().email}
                        value={data().user.email}
                    />
                    <TextInput 
                        label="Password"
                        name="password"
                        type="password"
                        required={true}
                        error={errors().password}
                    />
                    <TextInput 
                        label="Konfirmasi Password"
                        name="confirm"
                        type="password"
                        required={true}
                        error={errors().confirm}
                    />

                    <div className="flex justify-end gap-4 lg:col-span-2">
                        <Show when={!loading()}>
                            <button className="btn bg-gray-100" type="reset">reset</button>
                            <button className="btn btn-primary" type="submit">submit</button>
                        </Show>

                        <Show when={loading()}>
                            <button className="btn bg-gray-100" disabled>loading</button>
                        </Show>
                    </div>
                </form>
            </Show>

            <Show when={data().error}>
                <p>{data().error}</p>
            </Show>
        </Show>
    </>
}

export default SuperuserDetail