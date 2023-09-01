<script lang="ts">
    import type { routeInfo } from '@ikun-svelte-devtools/shared';
    import { rpc } from '../composables/rpc'
    import {
      KIcon,
      KInput,
      KCollapse,
      KPopover,
      KButton,
      KTag,
    } from "@ikun-ui/core";


    import {hookApi} from "../composables/hook";
    // @ts-ignore
    import { DevToolsInjectAppHooks } from '@ikun-svelte-devtools/shared';
    import {onMount} from "svelte";

    let routes: Array<routeInfo> | null = null

    let showCollapse = false
    let currentRoute = ''
    let nextRoute = ''
    setCurrentAndNextRoute()
    $: routeNum =  routes ? routes.length : 0

    rpc.getRoutesInfo().then((res) => {
      // TODO 参数校验（必填、matcher）
      routes = res.map((v)=>matchRouteNextAndActive(v, 'active')).sort((a, b) => {
        if (a.filePath < b.filePath) {
          return -1;
        }
        if (a.filePath > b.filePath) {
          return 1;
        }
        return 0;
      });

      showCollapse = true
    })

    const inputPathParams = []
    $: resolveDisabled = (index) => {
        if(index === 0 || inputPathParams[index - 1] ) return false
        return true
    }

    function handleNavigate(base){
        const path = `${base}${inputPathParams.filter(v => !!v).join('/')}`
        goto(path)
    }

    function goto(path){
      hookApi.hook.emit(DevToolsInjectAppHooks.APP_GOTO, path)
    }


    function handleInputChange(e) {
      nextRoute = e.detail
      isMatched = false
      routes = routes.map((v)=>matchRouteNextAndActive(v, 'next'))
    }

     function setCurrentAndNextRoute(path = ''){
      nextRoute = currentRoute = path ? path : window.parent.location.pathname;
      console.log(currentRoute, nextRoute)
    }


    let isMatched = true
    function matchRouteNextAndActive(route, type: 'active' | 'next' = 'active'){
      route[type] = false
      const nRoute = (`${nextRoute.endsWith('/') ? nextRoute : `${nextRoute}/`}`).trim()
      if(route.routePath === nRoute &&
        (!route.params ||
        route.params &&
        route.params.length === 0)){
        isMatched = true
        route[type] = true
        return route
      }

      // route params
      if(nRoute.startsWith(route.routePath) &&
        route.routePath !== '/' &&
        route.routePath !== nRoute &&
        route.params &&
        route.params.length > 0){
        isMatched = true
        route[type] = true
        return route
      }
      return route
    }

    onMount(() => {
      hookApi.hook.on('__svelte-devtools:navigation', (to) => {
        setCurrentAndNextRoute(to)
        routes = routes.map((v)=>matchRouteNextAndActive(v, 'active'))
      })
    })
</script>

<div>
    <div class="p6 mt-20px">
        {#if nextRoute !== currentRoute}
            <p class="text-muted dark:text-white  mb-2">
                Navigate from
                <span class="font-bold text-tx dark:text-white ">{currentRoute}</span>
                to
            </p>
            {:else }
            <p class="text-muted dark:text-white  mb-2">
                Current route
            </p>
        {/if}
        <KInput iconPrefix={'i-carbon-direction-right-01 scale-y--100'}
               cls={!isMatched ? 'border-amber-400 unmatched-input' : ''}
               on:input={handleInputChange}
               on:enter={()=> isMatched && goto(nextRoute)}
               value={nextRoute}/>
        <p class="text-muted dark:text-white  my-2">
            Press
            <span class="font-bold text-tx dark:text-white ">Enter</span>
            to navigate
            {#if !isMatched}
                <span class="text-amber-400">(no match)</span>
            {/if}
        </p>

        <KCollapse show={showCollapse}>
            <div slot="title" class="flex">
                <KIcon icon='i-carbon-tree-view-alt'
                       width="40px"
                       height="40px"
                       color="text-tx-light"/>
                <div class="ml-4">
                    <p class="text-lg text-muted dark:text-white ">All Routes</p>
                    <p class="text-md text-muted dark:text-white ">
                        <span class="text-main">{routeNum}</span>
                        routes registered in your application
                    </p>
                </div>
            </div>
            <div slot="content">
                <h2 class="text-md font-bold border-c border-solid border-b-1 h-40px mb-4">
                   Route Path
                </h2>
                    {#each routes as route (route.filePath)}
                        {#if route.params && route.params.length > 0}
                            <p class="flex justify-between rounded py1 px-2 hover:bg-rose-50 dark:hover:bg-main:50 {route.active || route.next ? 'bg-light-300 dark:bg-dark-50' : ''}">
                              <KPopover trigger="click">
                                  <div slot="triggerEl">
                                      <span class="flex items-center text-tx dark:text-white  cursor-pointer">
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
                                  </div>
                                  <div slot="contentEl" class="p1">
                                       <p class="text-md text-muted dark:text-white  mt-4">Fill params and navigate: </p>
                                       <span class="flex items-center text-tx dark:text-white  my-4">
                                          {route.routePath}
                                           {#each route.params as param, index (param.name)}
                                              {#if param.optional}
                                                  <KInput
                                                          disabled={resolveDisabled(index)}
                                                          attrs={{title:`[${param.name}]`}}
                                                          value={inputPathParams[index]}
                                                          on:input={(e) => inputPathParams[index] = e.detail}
                                                          placeholder={`[${param.name}]`}
                                                          cls="params-input">
                                                  </KInput>
                                              {:else if param.reset}
                                                  <KInput
                                                          disabled={resolveDisabled(index)}
                                                          attrs={{title:`...${param.name}`}}
                                                          value={inputPathParams[index]}
                                                          on:input={(e) => inputPathParams[index] = e.detail}
                                                          placeholder={`...${param.name}`}
                                                          cls="params-input">
                                                  </KInput>
                                              {:else if param.matcher}
                                                  <KInput
                                                          disabled={resolveDisabled(index)}
                                                          attrs={{title:`${param.name} = ${param.matcher}`}}
                                                          value={inputPathParams[index]}
                                                          on:input={(e) => inputPathParams[index] = e.detail}
                                                          placeholder={`${param.name} = ${param.matcher}`}
                                                          cls="params-input">
                                                  </KInput>
                                              {:else}
                                                  <KInput
                                                          disabled={resolveDisabled(index)}
                                                          attrs={{title:`${param.name}`}}
                                                          value={inputPathParams[index]}
                                                          on:input={(e) => inputPathParams[index] = e.detail}
                                                          placeholder={`${param.name}`}
                                                          cls="params-input">
                                                  </KInput>
                                              {/if}
                                               <span class="mx-1">/</span>
                                          {/each}
                                      </span>
                                      <KButton plain type="primary"
                                              on:click={()=> handleNavigate(route.routePath)}
                                              cls ="w-full mb-4">
                                          Navigate
                                      </KButton>
                                  </div>
                              </KPopover>
                              <span class="flex-c">
                                  {#if route.active}
                                      <KTag type="success">active</KTag>
                                  {/if}
                                  {#if route.next}
                                      <KTag type="primary">next</KTag>
                                  {/if}
                              </span>
                            </p>
                        {:else}
                            <p class="flex justify-between rounded py1 px-2 hover:bg-rose-50 dark:hover:bg-main:50 {route.active || route.next ? 'bg-light-300 dark:bg-dark-50' : ''}">
                                <span class="text-tx dark:text-white  cursor-pointer" aria-hidden="true" on:click={() => goto(route.routePath)}>
                                    {route.routePath}
                                </span>
                                <span class="flex-c">
                                    {#if route.active}
                                        <KTag type="success">active</KTag>
                                    {/if}
                                    {#if route.next}
                                        <KTag type="primary">next</KTag>
                                    {/if}
                                </span>
                            </p>
                        {/if}
                    {/each}
            </div>
        </KCollapse>
    </div>
</div>
<style>
    :global(.params-input input){
        width: 60px;
    }
    :global(.unmatched-input input){
        @apply text-amber-400;
    }

    :global(.unmatched-input div){
        @apply important-text-amber-400;
    }
</style>
