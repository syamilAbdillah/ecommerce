<script>
	import { LoaderIcon } from 'svelte-feather-icons'
	import { user, useLogout } from './services.auth'

	const {logout, error, loading} = useLogout()
</script>

{#if $user}
	<div class="bg-slate-600 text-white flex flex-col items-center p-4 rounded">
		<img 
			src="{$user.profile_picture}" 
			alt="{$user.name}" 
			class="w-24 h-24 rounded-full border"
		>
		<h1>{$user.name}</h1>
		<p class="text-sm text-slate-100">{$user.email}</p>
		<div class="grid grid-cols-2 mt-6 w-full gap-1">
			<button class="btn hover:bg-slate-500">edit</button>
			{#if $loading}
				<button class="btn italic" disabled>
					<span class="animate-spin"><LoaderIcon size="16" /></span>
					<span class="ml-2">loading</span>
				</button>
			{:else}
				<button 
					class="btn text-rose-500 hover:bg-slate-500" 
					on:click={logout}
				>logout</button>
			{/if}
		</div>
	</div>
{/if}
