<script>
    import { fade } from "svelte/transition";
</script>

<div class="border rounded overflow-hidden cursor-pointer" in:fade>
    <div class="aspect-square bg-gray-100 w-full pulse"></div>
    <div class="p-4">
        <div class="w-full h-8 bg-gray-100 rounded"></div>
        <div class="w-full h-4 bg-gray-100 rounded"></div>
    </div>
</div>