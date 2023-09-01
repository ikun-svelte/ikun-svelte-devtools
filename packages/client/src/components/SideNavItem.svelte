<script lang="ts">
    import type { BuiltinTab } from '@ikun-svelte-devtools/shared'
    import { KTooltip, KIcon } from "@ikun-ui/core";
    export let tab:BuiltinTab
    export let active: boolean = false
</script>

<div class="hover:bg-light-300 dark:hover:bg-dark-50 rounded-xl {active ? 'bg-rose-50 dark:bg-dark-50' : ''}">
   <div class="h-10 w-10 flex-c">
      <KTooltip content={tab.title} placement='right'>
         <KIcon slot="triggerEl"
               cls="hover-icon"
               color={active ? 'text-main' : 'text-tx-light'}
               icon={tab.icon}
               btn/>
      </KTooltip>
   </div>
</div>

