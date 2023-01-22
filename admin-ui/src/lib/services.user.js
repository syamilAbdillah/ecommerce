import { writable, derived } from 'svelte/store'
import { req } from './createRequest'

function invalidErrorsMapper(invalid_errors) {
	const errorsMap = {
		"min": param => `minimal ${param} karakter`,
		"max": param => `maksimal ${param} karakter`,
		"required": () => `tidak boleh kosong`,
		"unique": () => `telah digunakan, masukan nilai lain`
	}

	return Object.keys(invalid_errors).reduce((acc, curr) => {
		const {rule, param} = invalid_errors[curr]
		const errRule = errorsMap[rule]
		
		acc[curr] = (typeof errRule == 'function') ? 
			errRule(param): 
			`${rule}(${param})` 

		return acc
	}, {})
}

export const roles = Object.freeze({
	SUPERUSER: 'SUPERUSER',
	USER: 'USER',
})

export function useUserFind() {
	const loading = writable(false)
	const error = writable()
	const users = writable([])
	const total = writable(0)

	async function find(take = 10, page = 1, role = roles.SUPERUSER) {
		loading.set(true)
		error.set(undefined)

		const params = new URLSearchParams()
		params.append('take', take)
		params.append('page', page)
		params.append('role', role)

		const res = await req('/users?' + params.toString())
		if(res.users) users.update(u => [...u, ...res.users])
		if(res.total) total.set(res.total)
		if(res.error) error.set(res.error)

		loading.set(false)
	}

	return {
		loading: derived(loading, $loading => $loading),
		error: derived(error, $error => $error),
		users: derived(users, $users => $users),
		total: derived(total, $total => $total),
		find,
	}
}

export function useUserCreate() {
	const user = writable()
	const loading = writable(false)
	const error = writable()
	const errors = writable({})

	async function create(name = '', email = '', password = '') {
		loading.set(true)

		const res = await req('/users', {
			method: 'POST',
			body: JSON.stringify({name, email, password})
		})

		if(res.user) user.set(res.user)
		if(res.invalid_errors) errors.set(invalidErrorsMapper(res.invalid_errors))
		if(res.error) error.set(res.error)

		loading.set(false)
		return res
	}

	return {user, loading, error, errors, create}
}

export function useUserGet() {}

export function useUserUpdate() {}

export function useUserRemove() {}