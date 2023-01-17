<script>
    import { onMount, setContext } from 'svelte'
    import { Route } from 'tinro'
    import Counter from './lib/Counter.svelte'
    import Loading from './lib/Loading.svelte'
    import Dashboard from './lib/Dashboard.svelte'
    import { useAuthentication, key } from './lib/useAuthentication'

    const auth = useAuthentication()

    setContext(key, auth)
    onMount(auth.authenticate)
</script>
{#if $auth.loading}
    <Loading/>
{:else}
    {#if $auth.user}
        <Dashboard>
            <Route path="/">
                <p>home index</p>
            </Route>
            <Route path="/superuser">
                <p>superuser index</p>
            </Route>
            <Route path="/produk">
                <p>produk index</p>
            </Route>
        </Dashboard>
    {:else}
        <p>should be login page</p>
    {/if}
{/if}