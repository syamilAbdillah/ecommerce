<script>
    import { Route } from 'tinro'
    import DashboardLayout from './DashboardLayout.svelte'
</script>

<DashboardLayout>
    <Route path="/">
        <p>home index</p>
    </Route>
    <Route path="/superuser">
        <p>superuser index</p>
    </Route>
    <Route path="/produk">
        <p>produk index</p>
    </Route>
</DashboardLayout>