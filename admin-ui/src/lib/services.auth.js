import { writable, derived } from 'svelte/store'
import { req } from './createRequest'

const store = writable({ user: undefined })
export const user = derived(store, $store => $store.user)

export function useAuthenticate() {
	const loading = writable(false)
	const error = writable(undefined)

	async function authenticate() {
		loading.set(true)
		error.set(undefined)

		const {user, error: err, httpStatusCode} = await req('/auth/me')

		if(user) store.set({user: user})
		if(err && httpStatusCode != 401) error.set(err)

		loading.set(false)

		return {user, error: err, httpStatusCode}
	}

	return {
		authenticate, 
		loading: derived(loading, $loading => $loading),
		error: derived(error, $error => $error),
	}
}

export function useLogin() {
	const loading = writable(false)
	const error = writable(undefined)

	async function login(email, password) {
		loading.set(true)
		error.set(undefined)
		
		const {httpStatusCode, user, error: err} = await req('/auth/login', {
			method: 'POST', 
			body: JSON.stringify({email, password}),
		})

		if(user) store.set({user})
		if(httpStatusCode == 401) error.set('email / password tidak cocok')
		if(err && httpStatusCode != 401) {
			error.set(err)
			import.meta.env.DEV && console.error(err)
		}

		loading.set(false)

		return {httpStatusCode, user, error}
	}

	return {
		login,
		loading: derived(loading, $loading => $loading),
		error: derived(error, $error => $error),
	}
}

export function useLogout() {
	const loading = writable(false)
	const error = writable(undefined)

	async function logout() {
		loading.set(true)
		error.set(undefined)

		const {httpStatusCode, error: err} = await req('/auth/logout', {method: 'DELETE'})
		if(err && httpStatusCode != 401) error.set(err)
		if(httpStatusCode == 401 || httpStatusCode == 200) store.set({user: undefined})
		if(err && import.meta.env.DEV) console.error(err)

		loading.set(false)
	}

	return {
		logout,	
		loading: derived(loading, $loading => $loading),
		error: derived(error, $error => $error),
	}
}
