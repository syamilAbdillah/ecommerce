import { A, useNavigate } from "@solidjs/router"
import { FiChevronLeft } from "solid-icons/fi"
import { Show } from "solid-js"
import TextInput from "../components/TextInput"
import userStore, { createUser } from "../datastore/user"

function SuperuserCreate() {
    const navigate = useNavigate()
    const handleSubmit = async e => {
        e.preventDefault()

        const result = await createUser(Object.fromEntries(new FormData(e.target)))

        if(result.user) {
            e.target.reset()
            navigate('/superuser')
            return
        }
    }

    return <>
        <A href="/superuser" inactiveClass="btn btn-neutral mb-4" end={true}>
            <FiChevronLeft></FiChevronLeft>
            <span>daftar superuser</span>
        </A>

        <form onSubmit={handleSubmit} className="grid gap-4 lg:grid-cols-2">
            <TextInput 
                label="Nama Superuser"
                name="name"
                required={true}
                error={userStore.invalidErrors?.name}
            />
            <TextInput 
                label="Email"
                name="email"
                type="email"
                required={true}
                error={userStore.invalidErrors?.email}
            />
            <TextInput 
                label="Password"
                name="password"
                type="password"
                required={true}
                error={userStore.invalidErrors?.password}
            />
            <TextInput 
                label="Konfirmasi Password"
                name="confirm"
                type="password"
                required={true}
                error={userStore.invalidErrors?.confirm}
            />

            <div className="flex justify-end gap-4 lg:col-span-2">
                <Show when={!userStore.loading}>
                    <button className="btn bg-gray-100" type="reset">reset</button>
                    <button className="btn btn-primary" type="submit">submit</button>
                </Show>

                <Show when={userStore.loading}>
                    <button className="btn bg-gray-100" disabled>loading</button>
                </Show>
            </div>
        </form>
    </>
}

export default SuperuserCreate