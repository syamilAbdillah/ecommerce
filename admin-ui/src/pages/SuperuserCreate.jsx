import { A, useNavigate } from "@solidjs/router"
import { FiChevronLeft } from "solid-icons/fi"
import { Show, createSignal } from "solid-js"
import { userCreate } from "../api/user"
import TextInput from "../components/TextInput"
import { failed, success } from "../components/Toaster"

const USER_CREATED_MESSAGE   = 'berhasil menambahkan data user baru'
const INVALID_ERRORS_MESSAGE = 'data yang anda masukan tidak valid'
const INTERNAL_ERROR_MESSAGE = 'terjadi kesalahan pada server, saat manambahkan user'

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

        const result = await userCreate(userData)

        if(result.user) {
            e.target.reset()
            success(USER_CREATED_MESSAGE)
            navigate('/superuser')
        }

        if(result.invalid_errors) {
            const ie = result.invalid_errors
            const errs = {}
            for(let key of Object.keys(ie)) {
                errs[key] = dispatch(ie[key].rule, ie[key].param)
            }

            import.meta.env.DEV && console.log(result.invalid_errors, errs)
            
            setErrors(errs)
            failed(INVALID_ERRORS_MESSAGE)
        }

        result.error && failed(INTERNAL_ERROR_MESSAGE)

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