<script>
	import TextInput from '../../lib/TextInput.svelte'
	import Action from './FormProductAction.svelte'
	import WithLoading from '../../lib/ButtonWithLoading.svelte'
	import { SaveIcon } from 'svelte-feather-icons'

	export let product = {}

	let name = product.name
	let price = product.price
	let image = 'https://res.cloudinary.com/abdillahsyamil77/image/upload/v1655644509/samples/ecommerce/shoes.png'
</script>

<Action 
	let:create 
	let:update 
	let:loading 
	let:errors 

	on:created
	on:updated
>
	<form 
		on:submit|preventDefault={
			ev => product.id ? 
				update({name, price, image: product.image, id: product.id}): 
				create({name, price, image})
		} 
		class="grid gap-4"
	>
		<TextInput 
			bind:value={name} 
			error={errors.name} 
			label="nama produk" 
			required 
		/>
		<TextInput 
			bind:value={price} 
			error={errors.price} 
			type="number"
			label="harga" 
			required 
		/>
		<div class="flex justify-end">
			<WithLoading {loading}>
				<button class="btn btn-neutral" type="submit" slot="button">
					<SaveIcon size="16" />
					<span class="ml-1">simpan</span>	
				</button>
			</WithLoading>
		</div>
	</form>
</Action>