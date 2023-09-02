<script lang="ts">
  import { Link } from 'svelte-routing'
  import { useCategorizedTabs } from '../composables/tabs'
  import { SvelteLogo as Logo } from '@ikun-svelte-devtools/icons'
  import SideNavItem from './SideNavItem.svelte'
  import { KTooltip, KIcon } from "@ikun-ui/core";
  import { DevToolsHooks } from '@ikun-svelte-devtools/shared';
  import { hookApi } from "../composables/hook";

  let categories = useCategorizedTabs()
  let activeIndex:number = 0

  const setActiveIndex = (index: number) => {
    activeIndex = index
  }

  const handleClick = (index: number, tab:{path: string, evt: <T>(arg: T) => void}) => {
      setActiveIndex(index)
      if(!tab.path && tab.evt){
          tab.evt(hookApi.hook)
      }
    hookApi.hook.emit(DevToolsHooks.HREF_CHANGE, tab.path || '')
  }

  function updateTab() {
    hookApi.hook.on(DevToolsHooks.SHOW_TAB, () => {
          categories = useCategorizedTabs()
      })
  }
  updateTab()
</script>

 <div class="flex h-full items-center z-100 of-x-hidden of-y-auto gap-0.5 flex-col border-0 border-c border-r border-solid no-scrollbar">
        <div class="sticky top-0 z-1 mb1 items-center pt3 flex-col">
            <div
               class="cursor-pointer"
               title="Svelte DevTools">
                <Logo width="30px" height="30px"/>
            </div>
            <div class="mt-2 h-1px w-8 border-0 border-c border-b border-solid"></div>
        </div>
        <div class="of-auto py1 of-auto gap-0.5 items-center flex-col flex no-scrollbar flex-auto">
            {#each categories as item, index (item.path + item.title)}
                {#if item && !item.hide}
                    {#if index && (item.category !== categories[index -1].category)}
                        <div class="border-0 border-c border-b border-solid my1 h-1px w-8"></div>
                    {/if}
                    <div on:click={() => handleClick(index, item)} aria-hidden="true">
                        {#if item.path}
                            <Link to={item.path}>
                                <SideNavItem tab={item} active="{activeIndex === index}"/>
                            </Link>
                        {:else }
                            <SideNavItem tab={item} active="{activeIndex === index}"/>
                        {/if}
                    </div>
                {/if}
            {/each}
        </div>

        <div class="flex-col flex flex-none items-center">
            <div class="border-0 border-c border-b border-solid h-1px w-8"></div>
            <Link to={'/__devtools__/Setting'}>
                <KTooltip content='Setting' placement='right'>
                    <div aria-hidden="true" slot="triggerEl" class="cursor-pointer h-10 w-10 hover:bg-light-300 dark:hover:bg-dark-50 flex-c rounded-xl my-2 { activeIndex < 0 ? 'bg-rose-50 dark:bg-dark-50' : ''}"
                         on:click={() => setActiveIndex(-1) }>
                        <KIcon icon="i-carbon-settings"
                               cls="hover-icon"
                               color={ activeIndex < 0 ? 'text-main' : 'text-tx-light'}/>
                    </div>
                </KTooltip>
            </Link>
        </div>
</div>
