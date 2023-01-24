<script>
	import { onMount } from 'svelte'
	import { req } from '../../lib/createRequest'

	let products = []
	let total = 0
	let loading = false
	let error
	let selected
	$: product = products.find(p => p.id == selected)

	async function find() {
		loading = true
		error = undefined

		const res = await req('/products?limit=100')

		if(res.products) products = res.products
		if(res.error) error = res.error

		loading = false
	}

	function select(id) {
		selected = id
	}

	async function remove(id) {
		products = products.filter(p => p.id != id)
	}

	async function replace(p) {
		products = products.map(el => {
			if(el.id == p.id) {
				return p
			}

			return el
		})
	}

	async function push(p) {
		products = [p, ...products]
	}
	
	onMount(find)
</script>

<slot 
	{products} 
	{product} 
	{total} 
	{loading} 
	{error} 
	{find} 
	{select}
	{remove}
	{replace}
	{push}
></slot>

