<script>
	import { invalidErrorsMapper } from '../../lib/utils'
	import { req } from '../../lib/createRequest'
	import { createEventDispatcher } from 'svelte'
	import { pushSuccess, pushDanger } from '../../lib/Toaster.svelte'

	const dispatch = createEventDispatcher()

	let loading = false
	let error 
	let errors = {}

	async function create({name, price, image}) {
		error = undefined
		errors = []
		loading = true

		const res = await req('/products', {
			method: 'POST',
			body: JSON.stringify({name, image, price: Number(price)})
		})

		if(res.product) {
			dispatch('created', {product: res.product})
			pushSuccess('berhasil membuat data produk "' + res.product.name + '"')
		}

		if(res.error) {
			error = res.error
			pushDanger('gagal menambah data produk')
			import.meta.env.DEV && console.table(res)
		}

		if(res.invalid_errors) {
			errors = invalidErrorsMapper(res.invalid_errors)
			pushDanger('masukan nilai yang valid')
		}

		loading = false
	}

	async function update({id, name, price, image}) {
		error = undefined
		errors = []
		loading = true

		const res = await req('/products/' + id, {
			method: 'PUT',
			body: JSON.stringify({name, image, price: Number(price)})
		})

		if(res.product) {
			dispatch('updated', {product: res.product})
			pushSuccess('berhasil membuat data produk "' + res.product.name + '"')
		}

		if(res.error) {
			error = res.error
			pushDanger('gagal menambah data produk')
			import.meta.env.DEV && console.table(res)
		}

		if(res.invalid_errors) {
			errors = invalidErrorsMapper(res.invalid_errors)
			pushDanger('masukan nilai yang valid')
		}

		loading = false
	}
</script>

<slot {create} {update} {loading} {error} {errors}></slot>