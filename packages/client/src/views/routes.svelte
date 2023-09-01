<script lang="ts">
    import { Pane, Splitpanes } from 'svelte-splitpanes';
    import type { routeInfo } from '@ikun-svelte-devtools/shared';
    import {rpc} from "../composables/rpc.js";
    import JSONTree from 'svelte-json-tree'
    import Copy from "../components/Copy.svelte";
    let routes: Array<routeInfo> | null = []
    let selectRoute = {}
    rpc.getRoutesInfo().then((res) => {
        routes = res.sort((a, b) => {
            if (a.filePath < b.filePath) {
                return -1;
            }
            if (a.filePath > b.filePath) {
                return 1;
            }
            return 0;
        });
        selectRoute = routes[0]
    })

    const setActive = (index) => {
        routes.forEach(value => value.active = false)
        routes[index].active = true
        selectRoute = routes[index]
    }
</script>

<Splitpanes>
    <Pane size={40}>
        <div class="p4">
            {#each routes as route, index (route.filePath)}
                {#if route.params && route.params.length > 0}
                    <p class="
                hover:text-main
                dark:hover:text-white
                cursor-pointer
                flex
                justify-between
                rounded
                text-tx
                dark:text-white
                hover:bg-rose-50
                dark:hover:bg-main:50
                py1
                px-2
                {route.active ? 'bg-rose-50 !text-main dark:bg-main:50 !dark:text-white' : ''}"
                       aria-hidden="true"
                       on:click={() => setActive(index)}>
                        <span class="flex items-center">
                              {route.routePath}
                            {#each route.params as param (param.name)}
                                   {#if param.optional}
                                       <span class="rounded text-muted dark:text-white  px1 border border-muted border-dashed">[{param.name}]</span>
                                   {:else if param.reset}
                                       <span class="rounded text-muted dark:text-white  px1 border border-muted border-dashed">...{param.name}</span>
                                   {:else if param.matcher}
                                       <span class="rounded text-muted dark:text-white  px1 border border-muted border-dashed">{param.name} = {param.matcher}</span>
                                   {:else}
                                       <span class="rounded text-muted dark:text-white  px1 border border-muted border-dashed">{param.name}</span>
                                   {/if}
                              {/each}
                            <span class="mx-1">/</span>
                        </span>
                    </p>
                {:else}
                    <p class="
                flex
                justify-between
                cursor-pointer
                rounded
                py1
                px-2
                text-tx
                dark:text-white
                hover:text-main
                dark:hover:text-white
                hover:bg-rose-50
                dark:hover:bg-main:50
                {route.active ? 'bg-rose-50 !text-main dark:bg-main:50 !dark:text-white' : ''}"
                       aria-hidden="true"
                       on:click={() => setActive(index)}>
                        <span> {route.routePath} </span>
                    </p>
                {/if}
            {/each}
        </div>
    </Pane>
    <Pane size={60}>
        <div class="p4 overflow-y-auto scroll-bar pr-6">
            <div class="flex mb-2">
                <Copy data={JSON.stringify(selectRoute)}></Copy>
            </div>
            <JSONTree value={selectRoute}></JSONTree>
        </div>
    </Pane>
</Splitpanes>
