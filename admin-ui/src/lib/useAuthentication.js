import { writable } from 'svelte/store'
import { req } from './createRequest'


const err = Object.freeze({
	UNAUTHORIZE: 'UNAUTHORIZE',
	INTERNAL_SERVER: 'INTERNAL_SERVER',
})

export function useAuthentication() {
	const {subscribe, set, update} = writable({
		user: {},
		error: undefined,
		loading: false,
		status: 0,
	})

	async function login(email, password) {
		update(s => ({...s, loading: true}))
		
		const result = await req('/auth/login', {
			method: 'POST', 
			body: JSON.stringify({email, password}),
		})

		result.user && update(s => ({...s, user: result.user}))

		if(result.error && (result.httpStatusCode == 500)) {
			update(s => ({...s, error: result.error}))
		}

		if(result.error && (result.httpStatusCode == 401)) {
			update(s => ({...s, error: 'email / password tidak cocok'}))
		}

		update(s => ({...s, loading: false}))
	}

	async function authenticate() {
		update(s => ({...s, loading: true}))

		const result = await req('/auth/me')

		result.user && update(s => ({...s, user: result.user}))
		(result.httpStatusCode == 401) && update(s => ({...s, error: err.UNAUTHORIZE}))
		(result.httpStatusCode == 500) && update(s => ({...s, error: err.INTERNAL_SERVER}))

		update(s => ({...s, loading: false}))
	}

	return {subscribe, login, authenticate}
}

export const key = 'auth-store'
