import { createSignal } from "solid-js"
import { failed, success } from "../components/Toaster"
import { useNavigate, useRouteData, useParams } from "@solidjs/router"
import { productUpdate, productDelete } from '../api/product'
import { dispatch } from "./error"
import TextInput from "../components/TextInput"
import { IndexPageButton, DeleteButton } from "../components/Buttons"

const SUCCESS_DELETE_MESSAGE = 'berhasil menghapus data produk'
const FAILED_DELETE_MESSAGE = 'terjadi kesalahan, gagal menghapus produk'
const SUCCESS_UPDATE_MESSAGE = 'berhasil mengubah data produk'
const FAILED_UPDATE_MESSAGE = 'terjadi kesalahan, gagal mengubah produk'
const SUCCESS_REDIRECT = '/produk'
const INVALID_ERRORS_MESSAGE = 'data yang anda masukan tidak valid'
/**
 * @todo upload image not yet implemented, so use this source instead
 */
const DEFAULT_IMAGE_SOURCE = 'https://res.cloudinary.com/abdillahsyamil77/image/upload/v1655644509/samples/ecommerce/shoes.png'

function ProductDetail() {
    const [loading, setLoading] = createSignal(false)
    const [errors, setErrors] = createSignal({})
    const navigate = useNavigate()
    const params = useParams()
    const data = useRouteData()

    const handleSubmit = async ev => {
        ev.preventDefault()

        const productData = Object.fromEntries(new FormData(ev.target))
        productData.price = Number(productData.price)

        setLoading(true)
        const result = await productUpdate(params.id, productData)

        if(result.error) {
            failed(FAILED_UPDATE_MESSAGE)
            import.meta.env.DEV && console.error(result.error)
        }

        if(result.product) {
            success(SUCCESS_UPDATE_MESSAGE)
            ev.target.reset()
            navigate(SUCCESS_REDIRECT) 
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

    const handleDelete = async () => {
        setLoading(true)
        const result = await productDelete(params.id)

        if(result.product) {
            success(SUCCESS_DELETE_MESSAGE)
            navigate(SUCCESS_REDIRECT)
        }

        if(result.error) {
            failed(FAILED_DELETE_MESSAGE)
            import.meta.env.DEV && console.error(result.error)
        }

        setLoading(false)
    }

    return <>
        <div className="flex justify-between">
            <IndexPageButton href="/produk">daftar produk</IndexPageButton>
            <DeleteButton onDelete={handleDelete}/>
        </div>
        
        <Show when={data.loading}>
            <p>loading...</p>
        </Show>

        <Show when={!data.loading}>
            <Show when={data().product}>
                <form onSubmit={handleSubmit} className="grid gap-4 lg:grid-cols-2">
                    <input type="hidden" name="image" value={DEFAULT_IMAGE_SOURCE} />
                    <TextInput 
                        name="name"
                        label="Nama Produk"
                        required={true}
                        error={errors().name}
                        value={data().product?.name}
                    ></TextInput>
                    <TextInput 
                        name="price"
                        label="Harga Produk"
                        required={true}
                        type="number"
                        error={errors().price}
                        value={data().product.price}
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
            </Show>
            <Show when={data().error}>
                <p>{data().error}</p>
            </Show>
        </Show>
    </>
}

export default ProductDetail