import { useNavigate } from "@solidjs/router";
import { createMemo, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { authAuthenticate, authLogin } from "../api/auth";
import { createRequesAPI } from "../api/base";
import { failed, success } from "./Toaster";

/**
 * 
 * 
 * @todo implement global state, to store user session info
 * @todo implement route guard
 */
const [authStore, setAuthStore] = createStore({
    user: undefined,
    logout: {
        loading: false,
        error: undefined,
    }
})

const api = createRequesAPI(`${import.meta.env.VITE_API}/auth`)

export const user = createMemo(() => authStore.user)


const INTERNAL_SERVER_ERROR = 'terjadi kesalahan, tolong muat ulang'
const INVALID_CREDENTIALS = 'email / password anda tidak cocok'
const UNAUTHORIZE = 'silahkan login terlebih dahulu'
const WELCOME = name => `selamat datang ${name}`


export function useLoginService() {
    const [loading, setLoading] = createSignal(false)
    /**
     * @type [Accessor<string | undefined>, Setter<string | undefined>]
     */
    const [error, setError] = createSignal(undefined)


    /**
     * 
     * @param {{ email: string; password: string; }} credentials 
    */
    async function login(credentials){
        setLoading(true)
        
        const result = await authLogin(credentials)

        if(result.httpStatus == 500) {
            setError(INTERNAL_SERVER_ERROR)
            failed(INTERNAL_SERVER_ERROR)
            import.meta.env.DEV && console.error(result.error)
        }

        if(result.httpStatus == 401) {
            setError(INVALID_CREDENTIALS)
            failed(INTERNAL_SERVER_ERROR)
        }

        if(result.user) {
            setAuthStore(() => ({
                user: result.user,
            }))
            success(WELCOME(result.user.name))
        }

        setLoading(false)
    }

    return {loading, error, login, user}
}

export function useAuthenticateService() {
    const [loading, setLoading] = createSignal(false)
    /**
     * @type [Accessor<string | undefined>, Setter<string | undefined>]
     */
    const [error, setError] = createSignal(undefined)

    async function authenticate() {
        setLoading(true)
        const result = await authAuthenticate()

        if(result.httpStatusCode == 500) {
            setError(INTERNAL_SERVER_ERROR)
            failed(INTERNAL_SERVER_ERROR)
            import.meta.env.DEV && console.error(result.error)
        }

        if(result.httpStatusCode == 401) {
            setError(UNAUTHORIZE)
            failed(UNAUTHORIZE)
        }

        if(result.user) {
            setAuthStore(() => ({user: result.user}))
            success(WELCOME(result.user.name))
        }

        setLoading(false)
    }

    return {authenticate, loading, error, user}
}

export function useLogoutService() {
    const loading = createMemo(() => authStore.logout.loading)
    const error = createMemo(() => authStore.logout.error)

    async function logout() {
        setAuthStore("logout", "loading", () => true)
        const result = await api('/logout', {method: 'DELETE'})
        
        if(result.error) {
            setAuthStore('logout', 'error', () => result.error)
        }

        if(result.httpStatusCode == 200) {
            setAuthStore('user', () => undefined)
        }

        setAuthStore("logout", "loading", () => false)
    }

    return {loading, error, user, logout}
}