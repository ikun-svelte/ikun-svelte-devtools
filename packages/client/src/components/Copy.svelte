<script lang="ts">
    import { copyText } from 'baiwusanyu-utils'
    import { KMessage, KIcon } from "@ikun-ui/core";
    export let data: {}
    export let width = '24px'
    export let height = '24px'
    export let attrs={}
    const handleCopy = (content: string) => {
      copyText(content)
      KMessage.success({
        content: 'target copied successfully'
      })
    }
</script>
<div on:click={() => handleCopy(JSON.stringify(data))}
    aria-hidden="true">
    <KIcon btn
          width="{width}"
          height="{height}"
          attrs="{attrs}"
          color="text-tx-light"
          cls="hover-icon"
          icon="i-carbon-copy mr-2">
    </KIcon>
</div>
