<script lang="ts">
    import type { AssetInfo } from "@ikun-svelte-devtools/shared";
    import { KIcon } from "@ikun-ui/core";
    import AssetsPreview from "./AssetsPreview.svelte";
    export let textContent:string = ''

    export let asset:(AssetInfo & {fileName: string}) = {
        path: '',
        type: 'text',
        publicPath: '',
        filePath: '',
        size: 0,
        mtime: 0,
        fileName: '',
    }
    const iconDict = {
        text: 'i-carbon-document',
        video: 'i-carbon-video',
        audio: 'i-carbon-document-audio',
        other: 'i-carbon-document-unknown'
    } as any

    let assetInner:any = {}
    $:if(asset){
        assetInner = asset
    }

    let textContentInner: string = ''
    $:if(textContent){
        textContentInner = textContent
    }
</script>
{#if assetInner}
    <div class="flex-col flex-c p2 rounded-lg text-muted dark:text-white  'hover:bg-rose-50 hover:text-main'}">
        <div class="flex-col flex-c  h-30 w-30 {textContentInner ? '' : 'border-c border-solid border rounded' }">
            {#if assetInner.type === 'image' || assetInner.type === 'font' || assetInner.type === 'text'}
                <AssetsPreview asset={assetInner} textContent="{textContentInner}"></AssetsPreview>
            {:else if iconDict[assetInner.type]}
                <KIcon icon={iconDict[assetInner.type]} width="40px" height="40px" color="text-tx-light"></KIcon>
            {:else}
                <KIcon icon='i-carbon-document-unknown' width="40px" height="40px" color="text-tx-light"></KIcon>
            {/if}
        </div>
        <p class="text-xs mt-2 text-center of-hidden truncate ws-nowrap">{assetInner.fileName}</p>
    </div>
{/if}
