<script lang="ts">
    import type { AssetInfo } from "@ikun-svelte-devtools/shared";
    import { KIcon } from "@ikun-ui/core";
    import AssetsPreviewFont from "./AssetsPreviewFont.svelte";
    export let asset:(AssetInfo & {fileName: string}) = {
        path: '',
        type: 'text',
        publicPath: '',
        filePath: '',
        size: 0,
        mtime: 0,
        fileName: '',
    }
    export let textContent:string = ''
</script>


<div class="flex-c of-hidden object-cover p1">
    {#if asset.type === 'image'}
        <img class="min-w-30px" src={asset.publicPath} alt={asset.publicPath}/>
    {:else if asset.type === 'font'}
        <AssetsPreviewFont asset={asset} />
    {:else if asset.type === 'text' && !textContent}
        <KIcon icon='i-carbon-document' width="40px" height="40px" color="text-tx-light"  cls="hover-icon"></KIcon>
    {:else if asset.type === 'text' && textContent}
        <div class="w-full h-max-10rem of-hidden border-c border-solid border rounded">
            <pre class="p-2 of-hidden text-xs bg-gray-50 dark:bg-dark-200">{@html textContent}</pre>
        </div>

    {:else}
        <KIcon icon='i-carbon-document-unknown' width="40px" height="40px" color="text-tx-light" cls="hover-icon"></KIcon>
    {/if}
</div>
