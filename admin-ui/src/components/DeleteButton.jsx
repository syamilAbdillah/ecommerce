import { FiTrash2 } from "solid-icons/fi"
import { createSignal, Show } from "solid-js"
import { clickOutside } from "./directives"

function DeleteButton(props) {
    const [show, setShow] = createSignal(false)
    const open = () => setShow(true)
    const close = () => setShow(false)

    const handleDelete= (e) => {
        if(typeof props.onDelete == 'function') {
            props.onDelete(e)
            close()
        }
    }

    return <div className="relative">
        <Show when={show()}>
            <div className="absolute top-4 -left-36 bg-white rounded border p-6 z-30" use:clickOutside={close}>
                <div className="py-6">
                    <p>data yang dihapus tidak dapat dipulihkan kembali</p>
                </div>
                <div className="flex justify-center gap-2">
                    <button onClick={close} className="btn bg-gray-200 text-gray-800">cancel</button>
                    <button onClick={handleDelete} className="btn btn-danger-light">confirm</button>
                </div>
            </div>
        </Show>
        <button className="btn btn-danger-light" onClick={open}>
            <FiTrash2></FiTrash2>
            <span>delete</span>
        </button>
    </div>
}

export default DeleteButton