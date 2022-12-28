import { A, useNavigate } from "@solidjs/router"
import { FiChevronLeft } from "solid-icons/fi"
import { Show, createSignal } from "solid-js"
import userApi from "../api/user"
import TextInput from "../components/TextInput"

function SuperuserCreate() {
    const navigate = useNavigate()
    const [loading, setLoading] = createSignal(false)
    const [errors, setErrors] = createSignal({})
    
    const handleSubmit = async e => {
        e.preventDefault()
        const userData = Object.fromEntries(new FormData(e.target))
        if(userData.password != userData.confirm){
            setErrors({ confirm: 'tidak cocok dengan password' })
            return
        }
        setLoading(true)

        const result = await userApi.create(userData)

        if(result.user) {
            e.target.reset()
            navigate('/superuser')
        }

        if(result.invalid_errors) {
            setErrors(result.invalid_errors)
        }

        setLoading(false)
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
                error={errors().name}
            />
            <TextInput 
                label="Email"
                name="email"
                type="email"
                required={true}
                error={errors().email}
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
    </>
}

export default SuperuserCreate