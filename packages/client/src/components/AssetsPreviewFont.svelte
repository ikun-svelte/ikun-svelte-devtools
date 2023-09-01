<script lang="ts">
    import type { AssetInfo } from "@ikun-svelte-devtools/shared";
    import { hash } from "ohash";
    import {onMount} from "svelte";
    export let asset:(AssetInfo & {fileName: string}) = {
        path: '',
        type: 'text',
        publicPath: '',
        filePath: '',
        size: 0,
        mtime: 0,
        fileName: '',
    }
    const id = hash(asset)
    $: key = `devtools-assets-${hash(asset)}`

    $: injectFontFamily = `
    @font-face {
    font-family: '${key}';
    src: url('${asset.publicPath}');
  }
`
    let init = true
    let oldFontFamily = injectFontFamily
    $: if(injectFontFamily !== oldFontFamily && !init){
        const el = (document.getElementById(id) || document.createElement('style')) as HTMLStyleElement
        el.textContent = injectFontFamily
        oldFontFamily = injectFontFamily
    }

    onMount(() => {
        init = false
        const el = (document.getElementById(id) || document.createElement('style')) as HTMLStyleElement
        el.textContent = injectFontFamily
        document.head.appendChild(el)
    })
</script>

<div class="of-hidden text-tx dark:text-white " style='fontFamily: {key}'>
    Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz
</div>
