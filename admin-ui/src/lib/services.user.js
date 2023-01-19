import { writable, derived } from 'svelte/store'
import { req } from './createRequest'

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

export function useUserCreate() {}

export function useUserGet() {}

export function useUserUpdate() {}

export function useUserRemove() {}