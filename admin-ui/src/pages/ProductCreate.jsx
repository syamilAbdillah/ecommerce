import { IndexPageButton } from "../components/Buttons"
import { productCreate } from '../api/product'
import { createSignal } from "solid-js"
import { failed, success } from "../components/Toaster"
import { useNavigate } from "@solidjs/router"
import { dispatch } from "./error"
import TextInput from "../components/TextInput"


const PRODUCT_CREATED_MESSAGE = 'berhasil menambahkan data produk baru'
const INVALID_ERRORS_MESSAGE = 'data yang anda masukan tidak valid'
const INTERNAL_ERROR_MESSAGE = 'terjadi kesalahan pada server, saat manambahkan user'
/**
 * @todo upload image not yet implemented, so use this source instead
 */
const DEFAULT_IMAGE_SOURCE = 'https://res.cloudinary.com/abdillahsyamil77/image/upload/v1655644509/samples/ecommerce/shoes.png'

function ProductCreate() {
    const [loading, setLoading] = createSignal(false)
    const [errors, setErrors] = createSignal({})
    const navigate = useNavigate()


    const handleSubmit = async ev => {
        ev.preventDefault()

        const data = Object.fromEntries(new FormData(ev.target))
        data.price = Number(data.price)

        setLoading(true)
        const result = await productCreate(data)

        if(result.error) {
            failed(INTERNAL_ERROR_MESSAGE)
            import.meta.env.DEV && console.error(result.error)
        }

        if(result.product) {
            success(PRODUCT_CREATED_MESSAGE)
            ev.target.reset()
            navigate('/produk') 
        }

        if(result.invalid_errors) {
            const ie = result.invalid_errors
            const errs = {}
            for(let key of Object.keys(ie)) {
                errs[key] = dispatch(ie[key].rule, ie[key].param)
            }

            import.meta.env.DEV && console.log(result.invalid_errors, errs)
            
            failed(INVALID_ERRORS_MESSAGE)
            setErrors(errs)
        }

        setLoading(false)
    }
    return <>
        <IndexPageButton href="/produk">daftar produk</IndexPageButton>
        <form onSubmit={handleSubmit} className="grid gap-4 lg:grid-cols-2">
            <input type="hidden" name="image" value={DEFAULT_IMAGE_SOURCE} />
            <TextInput 
                name="name"
                label="Nama Produk"
                required={true}
                error={errors().name}
            ></TextInput>
            <TextInput 
                name="price"
                label="Harga Produk"
                required={true}
                type="number"
                error={errors().price}
            ></TextInput>

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

export default ProductCreate