<script>
	import { router } from 'tinro'
	import TextInput from './TextInput.svelte'
	import ButtonWithLoading from './ButtonWithLoading.svelte'
	import { useUserCreate } from './services.user'
	import { pushSuccess, pushDanger } from './Toaster.svelte'

	const {user, loading, errors, error, create} = useUserCreate()

	let name = ''
	let email = ''
	let password = ''
	let confirm = ''
	let confirmErr

	function handleSubmit(ev) {
		if($loading) return

		if(password != confirm) {
			confirmErr = 'tidak cocok dengan password'
			return
		}

		create(name, email, password)
	}

	$: {
		if($user) {
			pushSuccess(`data ${$user.email} berhasil tersimpan`)
			router.goto('/superuser')
		} 
		if($error) pushDanger($error)
		if(Object.keys($errors).length || confirmErr) pushDanger('masukan nilai yang benar')
	}
</script>


<form on:submit|preventDefault={handleSubmit} class="grid gap-4 p-4 w-full md:w-md">
	<TextInput  
		bind:value={name}
		label="name user"
		error={$errors.name}
		required
	/>
	<TextInput  
		bind:value={email}
		label="email"
		error={$errors.email}
		type="email"
		required
	/>
	<TextInput  
		bind:value={password}
		label="password"
		error={$errors.password}
		type="password"
		required
	/>
	<TextInput  
		bind:value={confirm}
		label="konfirmasi password"
		error={confirmErr}
		type="password"
		required
	/>
	<div class="flex justify-end items-center">
		<ButtonWithLoading loading={$loading}>
			<button 
				class="btn btn-primary" 
				type="submit" 
				slot="button"
			>simpan</button>
		</ButtonWithLoading>
	</div>
	
</form>
