<script>
	import { createEventDispatcher } from 'svelte'
	import { req } from '../../lib/createRequest'
	import { pushSuccess, pushDanger } from '../../lib/Toaster.svelte'

	const dispatch = createEventDispatcher()

	let loading = false
	let error = false

	async function del(id) {
		loading = true

		const res = await req(`/products/${id}`, { method: 'DELETE' })
		if(res.httpStatusCode == 200) {
			dispatch('removed', {id})
			pushSuccess('berhasil menghapus produk dengan id => ' + id)
		}

		if(res.error) {
			pushDanger('gagal menghapus produk dengan id => ' + id)
			import.meta.env.DEV && console.table(res)
		}

		loading = false
	}

</script>

<slot {loading} {error} {del} ></slot>