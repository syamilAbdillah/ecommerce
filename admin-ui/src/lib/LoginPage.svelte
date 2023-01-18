<script>
	import { getContext } from 'svelte'
	import { LockIcon, ShieldIcon, LoaderIcon } from 'svelte-feather-icons'
	import { useLogin } from './services.auth'
	import TextInput from './TextInput.svelte'

	const {login, loading} = useLogin()

	let email
	let password
	const handleSubmit = ev => {
		login(email, password)
	}
</script>

<main class="min-h-screen flex justify-center items-center bg-slate-100 py-8 px-6">
	<form on:submit|preventDefault={handleSubmit} class="w-full sm:w-96 bg-white rounded p-6 grid gap-6">
		<div class="flex flex-col items-center justify-center text-slate-600">
			<div class="flex text-2xl mb-1 items-center">
				<LockIcon size="24" class="mr-2" />
				<h1>login</h1>
			</div>
			<p class="font-light text-slate-500">silahkan login terlebih dahulu</p>
		</div>
		<TextInput type="email" label="email" bind:value={email} required/>
		<TextInput type="password" label="password" bind:value={password} required/>
		{#if $loading}
			<button class="btn italic" disabled>
				<span class="animate-spin"><LoaderIcon size="16" /></span>
				<span class="ml-2">loading</span>
			</button>
		{:else}
			<button class="btn btn-neutral" type="submit">
				<span>login</span>
			</button>
		{/if}
	</form>
</main>

