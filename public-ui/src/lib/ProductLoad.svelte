<script>
    import { fade } from "svelte/transition";
</script>

<div class="border rounded overflow-hidden cursor-pointer" out:fade>
    <div class="aspect-square bg-gray-100 w-full animate-pulse"></div>
    <div class="p-4">
        <div class="w-8/12 h-4 bg-gray-100 rounded mb-2 animate-pulse"></div>
        <div class="w-6/12 h-8 bg-gray-100 rounded animate-pulse"></div>
    </div>
</div>