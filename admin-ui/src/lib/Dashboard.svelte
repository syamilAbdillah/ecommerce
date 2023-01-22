<script>
    import { Route } from 'tinro'
    import DashboardLayout from './DashboardLayout.svelte'
    import Lazy from './Lazy.svelte'
</script>

<DashboardLayout>
    <Route path="/">
        <p>home index</p>
    </Route>
    <Route path="/superuser/*">
        <Route path="/">
            <Lazy 
                component={
                    () => import('./PageSuperuser.svelte')
                } 
            />
        </Route>
        <Route path="/tambah">
            <Lazy 
                component={
                    () => import('./PageSuperuserCreate.svelte')
                } 
            />
        </Route>
    </Route>
    <Route path="/produk">
        <p>produk index</p>
    </Route>
</DashboardLayout>