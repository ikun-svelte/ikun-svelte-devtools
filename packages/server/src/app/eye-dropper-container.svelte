<script lang="ts">
  import EyeDropper from './eye-dropper.svelte';
  import { CarbonCenterCircle } from "@ikun-svelte-devtools/icons";
  import { outerLinks } from "@ikun-svelte-devtools/shared";
  const isSecureContext =  !!window.isSecureContext
  const linkSecureContext = outerLinks.secureContext
  const linkBrowserCompatibility = outerLinks.browserCompatibility

  let color = ''
  let isInit = true
  const getColor = async (cb) => {
    color = ''
    isInit = false
    const result = await cb()
    color = result.sRGBHex
  }

</script>

<EyeDropper let:open let:isSupported>
    <div class="eye-dropper-container">
        {#if !isSecureContext}
            <p>
                EyeDropper is not available due to
                <a class="text-primary transition-colors hover:text-primary/80"
                   href={linkSecureContext} target='_blank'>
                    secure context
                </a>
                restrict.
            </p>
        {:else if !isSupported}
            <p>
                Your browser doesn't support&nbsp;
                <a class="text-primary transition-colors hover:text-primary/80"
                   href={linkBrowserCompatibility}
                   target='_blank'>EyeDropper</a>.
            </p>
        {:else}
            {#if !color && !isInit}
                <p>Launching EyeDropper</p>
            {:else }
                {#if !isInit}
                    <div class="eye-dropper--color" style="background-color: {color}"></div>
                    <span class="eye-dropper--color---content">{color}</span>
                {/if}
                <div class="eye-dropper--color---btn" on:click={() => getColor(open)} aria-hidden="true">
                    <CarbonCenterCircle></CarbonCenterCircle>
                </div>
            {/if}
        {/if}
    </div>
</EyeDropper>
<style>
    .eye-dropper-container{
        padding: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        box-sizing: border-box;
    }

    .eye-dropper-container p{
        text-align: center;
        margin: 22px 0;
        font-size: 14px;
        width: 80%;
    }

    .eye-dropper--color{
        border-radius: 8px;
        width: 24px;
        height: 24px;
    }

    .eye-dropper--color---content{
        margin: 0 10px;
        font-family: Open Sans,ui-sans-serif,system-ui;
        font-size: 16px;
    }

    .eye-dropper--color---btn{
        cursor: pointer;
        color: rgb(125,125,125);
    }

    .eye-dropper--color---btn:hover{
        color: #ff3e00;
    }

    :global(.sdt--dark .eye-dropper-container){
        color: white;
    }

    :global(.sdt--light .eye-dropper-container){
        color: #1f1f1f;
    }
</style>
