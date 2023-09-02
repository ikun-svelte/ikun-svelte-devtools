<script lang="ts">
    import {rpc} from '../composables/rpc';
    import { SvelteLogo as Logo } from '@ikun-svelte-devtools/icons';
    import pkg from '../../../../package.json'
    import {Link} from 'svelte-routing';
    import { isMacOS } from '@ikun-svelte-devtools/utils-client';
    import {outerLinks} from '@ikun-svelte-devtools/shared';
    import {
      KIcon,
      KButton,
    } from "@ikun-ui/core";
    let routesNum = 0
    rpc.getRoutesInfo().then((res) => {
        routesNum = (res as Array<unknown>).length
    })

    let svelteVersion = '0.0.0'
    let svelteKitVersion = '0.0.0'
    rpc.getPackages().then((res: unknown) => {
        svelteVersion = (res as Record<string, any>).packages['svelte'].version
        svelteKitVersion = (res as Record<string, any>).packages['@sveltejs/kit'].version
    })

    let sfcNum = 0
    rpc.getSvelteSFCList().then((res) => {
        sfcNum = (res as Array<unknown>).length
    })

    const linkHover = {
        star: 'i-carbon-star',
        bug: 'i-carbon-debug',
        setting: 'i-carbon-settings',
    }

    const links = {
        svelte: outerLinks.svelte,
        svelteKit: outerLinks.svelteKit,
        pages: '/__devtools__/PagesAnalysis',
        components: '/__devtools__/Components',
        star: '',
        bug: '',
        setting: '/__devtools__/Setting'
    }
</script>

<div class="p4 flex-c flex-col overflow-y-auto scroll-bar h-full">
 <div class="flex-c">
     <Logo width="70px" height="70px"/>
    <h1 class="text-40px ml-2 mt-4">
       DevTools
    </h1>
 </div>
 <p class="my-4 text-muted dark:text-white ">Svelte DevTools v{pkg.version}</p>
 <div class="flex-c w-full flex-wrap">
     <a target="_blank"
        href={links.svelte}
        class="
        flex-col
        hover:animate-LianYi
        min-w-124px
        hover:shadow-lg m-2 flex-c flex-1 rounded-lg
        h-100px border border-solid border-main">
         <Logo width="30px" height="30px"/>
         <span class="my-2 text-muted dark:text-white  text-sm break-keep">svelte v{svelteVersion}</span>
     </a>
     <a target="_blank"
        href={links.svelteKit}
        class="
        flex-col
        min-w-124px
        hover:animate-LianYi
        hover:shadow-lg m-2 flex-c flex-1 rounded-lg
        h-100px border border-solid border-main ">
         <Logo width="30px" height="30px"/>
         <span class="my-2 text-muted dark:text-white  text-sm break-keep">svelte-kit v{svelteKitVersion}</span>
     </a>
     <i class="flex-col cursor-pointer
         hover:animate-LianYi
           hover:shadow-lg m-2 flex-c flex-1 rounded-lg min-w-124px
           h-100px border border-solid border-main">
         <Link to={links.pages} class="w-full h-full flex-c flex-col">
             <KIcon icon="i-carbon-tree-view-alt"
                    width="30px"
                    height="30px"
                    color="text-tx-light">
             </KIcon>
             <span class="my-2 text-muted dark:text-white  text-sm break-keep">{routesNum} pages</span>
         </Link>
     </i>
     <i class="flex-col cursor-pointer
          hover:animate-LianYi
           hover:shadow-lg m-2 flex-c flex-1 rounded-lg min-w-124px
           h-100px border border-solid border-main">
         <Link to={links.components} class="w-full h-full flex-c flex-col">
             <KIcon icon="i-carbon-assembly-cluster"
                    width="30px"
                    height="30px"
                    color="text-tx-light">
             </KIcon>
             <span class="my-2 text-muted dark:text-white  text-sm break-keep">{sfcNum} components</span>
         </Link>
     </i>
 </div>
 <div class="flex-c flex-col flex-wrap">
     <div class="flex-c my-2 text-muted dark:text-white  flex-wrap">
         <a class="flex-c m2 hover:text-green-400"
            aria-hidden="true"
            on:mouseenter={() => linkHover.star = 'i-carbon-star !text-green-400'}
            on:mouseleave={() => linkHover.star = 'i-carbon-star'}
            target="_blank" href={links.star}>
             <KIcon icon="{linkHover.star}"
                    color="text-tx-light">
             </KIcon>
             <span class="ml-1">Star on Github</span>
         </a>
         <a
             on:mouseenter={() => linkHover.bug = 'i-carbon-debug !text-main'}
             on:mouseleave={() => linkHover.bug = 'i-carbon-debug'}
             aria-hidden="true"
             class="flex-c m2 hover:text-main"
             target="_blank"
             href={links.bug}>
             <KIcon icon="{linkHover.bug}" color="text-tx-light"></KIcon>
             <span class="ml-1">Bug Reports</span>
         </a>
         <i
             on:mouseenter={() => linkHover.setting = 'i-carbon-settings !text-tx dark:text-white dark:hover:text-mute'}
             on:mouseleave={() => linkHover.setting = 'i-carbon-settings'}
             aria-hidden="true"
             class="flex-c m2 hover:text-tx dark:hover:text-mute ">
           <Link
              class="flex-c"
              to={links.setting}>
             <KIcon icon="{linkHover.setting}" color="text-tx-light"></KIcon>
             <span class="ml-1">Settings</span>
           </Link>
         </i>
     </div>
     <div class="flex-c pb-8 text-xs text-muted dark:text-white  mt-6 flex-wrap">
         Press
         {#if isMacOS()}
             <KButton plain type="info" cls="mx2">
                 ⇧ Shift
             </KButton>
             <span>+</span>
             <KButton plain type="info" cls="mx2">
                 ⌥ Option
             </KButton>
             <span>+</span>
             <KButton plain type="info" cls="mx2">
                 D
             </KButton>
         {:else }
             <KButton plain type="info" cls="mx2">
                 Shift
             </KButton>
             <span>+</span>
             <KButton plain type="info" cls="mx2">
                 Alt
             </KButton>
             <span>+</span>
             <KButton plain type="info" cls="mx2">
                 D
             </KButton>
         {/if}
         to toggle DevTools
     </div>
 </div>
</div>
