<script lang="ts">
    import {onDestroy, tick} from "svelte";
    import {darkLight} from "@ikun-svelte-devtools/utils-client";

    export let colorMode = darkLight()
    export let src = ''
    const iframeCacheMap = new Map<string, HTMLIFrameElement>()
    let anchor = null
    let iframeEl = null
    let box:DOMRect | null = null
    let isAddEvt = false
    $:if(anchor){
      box = (anchor as HTMLElement).getBoundingClientRect()
      updateIframeBox();
      if(!isAddEvt && iframeEl){
        window.addEventListener('resize',() => {
          box = (anchor as HTMLElement).getBoundingClientRect()
          updateIframeBox();
        })
        isAddEvt = true
      }
    }

    $:key = src
    let iframeLoaded = false
    $:if(src){
        if (iframeCacheMap.get(key)) {
            iframeEl = iframeCacheMap.get(key)!
            iframeEl.style.visibility = 'visible'
        }
        else {
            iframeEl = document.createElement('iframe')
            iframeCacheMap.set(key, iframeEl)
            iframeEl.src = src
            // CORS
            try {
                iframeEl.style.opacity = '0.01'
                iframeEl.onload = () => {
                    syncColorMode()
                    iframeEl!.style.opacity = '1'
                    iframeLoaded = true
                }
            }
            catch (e) {
                iframeEl.style.opacity = '1'
            }
            document.body.appendChild(iframeEl)
            tick()
            updateIframeBox()
        }
        setTimeout(syncColorMode, 100)
    }


    onDestroy(() => {
        if (iframeEl) {
            iframeEl.style.visibility = 'hidden'
            iframeLoaded = false
        }
      window.removeEventListener('resize',updateIframeBox)
    })

    function syncColorMode() {
        if (!iframeEl || !iframeEl.contentWindow)
            return
        try {
            const html = iframeEl.contentWindow.document.querySelector('html')
            html?.classList.toggle('dark', colorMode === 'dark')
            html?.classList.toggle('light', colorMode === 'dark')
        }
        catch (e) {
        }
    }

    function updateIframeBox() {
        if (!iframeEl)
            return
        if(box){
            Object.assign(iframeEl.style, {
                position: 'fixed',
                left: `${box.left}px`,
                top: `${box.top}px`,
                width: `${box.width}px`,
                height: `${box.height}px`,
                outline: 'none',
            })
        }
    }
</script>

<div bind:this={anchor} class="h-full w-full">
    {#if !iframeLoaded}
        <div class="absolute inset-0 flex items-center justify-center">
            <i class="mdi:loading animate-spin text-3xl"></i>
        </div>
    {/if}
</div>
