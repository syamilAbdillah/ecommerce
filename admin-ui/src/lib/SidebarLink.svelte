<script>
	import { active } from 'tinro'
	export let href
	export let exact = false
</script>

<a use:active class="flex items-center py-3 px-4 rounded transition hover:bg-slate-500 active:scale-95 text-slate-50" data-exact={exact} {href}>
	<slot></slot>
</a>