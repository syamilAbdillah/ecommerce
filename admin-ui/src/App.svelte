<script>
    import Counter from './lib/Counter.svelte'
    import Loading from './lib/Loading.svelte'
    import { useAuthenticate, user } from './lib/services.auth'
    import Lazy from './lib/Lazy.svelte'

    const {loading, authenticate} = useAuthenticate()

    authenticate()
    const Dashboard = import('./lib/Dashboard.svelte')
    const LoginPage = import('./lib/LoginPage.svelte')
</script>
{#if $loading}
    <div class="min-h-screen flex justify-center items-center">
        <Loading/>
    </div>
{:else}
    {#if $user}
        <Lazy component={Dashboard}/>
    {:else}
        <Lazy component={LoginPage}>
            <div class="min-h-screen flex justify-center items-center" slot="loading">
                <Loading/>
            </div>
        </Lazy>
    {/if}
{/if}