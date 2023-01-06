import { Show, For, onCleanup, onMount } from 'solid-js'
import { createStore, produce } from 'solid-js/store'
import { FiCheck, FiX } from 'solid-icons/fi'

const TOAST_TYPE = Object.freeze({
    FAILED: 'failed',
    SUCCESS: 'success',
})

const [toasts, setToasts] = createStore([])

function addToast(toastData = {message: '', type: ''}) {
    setToasts(produce(toasts => toasts.unshift(toastData)))
}

/**
 * @description push success toaster message
 * @param {string} message 
 */
export function success(message) {
    addToast({message, type: TOAST_TYPE.SUCCESS})
}

/**
 * @description push failed toaster message
 * @param {string} message 
 */
export function failed(message) {
    addToast({message, type: TOAST_TYPE.FAILED})
}

function ToasterCard(props) {
    let timeout

    onMount(() => {
        timeout = setTimeout(() => {
            setToasts(toasts => toasts.filter((t, i) => props.index != i))
        }, 2000)
    })

    onCleanup(() => {
        clearTimeout(timeout)
    })

    const handleClick = e => {
        setToasts(toasts => toasts.filter((t, i) => props.index != i))
    }
    return <div 
        onClick={handleClick} 
        className="p-3 rounded flex gap-3 items-center cursor-pointer border bg-white"
    >
        <div 
            className="p-2 rounded-full font-bold text-white" 
            classList={{
                'bg-emerald-500': props.type == TOAST_TYPE.SUCCESS,
                'bg-rose-500': props.type == TOAST_TYPE.FAILED,
        }}>
            <Show when={props.type == TOAST_TYPE.SUCCESS}>
                <FiCheck></FiCheck>
            </Show>
            <Show when={props.type == TOAST_TYPE.FAILED}>
                <FiX></FiX>
            </Show>
        </div>
        <p>{props.message}</p>
    </div>
}

export function Toaster(props) {
    return <div className="fixed z-40 top-0 right-4 w-64 py-4 flex flex-col justify-end  gap-2 box-border">
        <For each={toasts} >
            {(toast, index) => (
                <ToasterCard index={index()} message={toast?.message} type={toast?.type}/>
            )}
        </For>
    </div>
}