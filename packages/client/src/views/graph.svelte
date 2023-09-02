<script lang="ts">
import type { Data } from 'vis-network'
import {debounce} from "@baiwusanyu/utils-com";
import { onMount, onDestroy } from 'svelte'
import { Network } from 'vis-network'
import {
  getGraphConfig,
  getGraphData,
  getHoverPath,
  initGraphData,
  visNetworkOptions,
  setGraphConfigCache,
} from "../composables/graph";
import {
  KModal,
  KCheckbox,
  KSwitch,
  KSelect,
  KInput,
  KIcon,
} from "@ikun-ui/core";
import {rpc} from "../composables/rpc";
import {darkLight} from "@ikun-svelte-devtools/utils-client";
import { useDevtoolsClient } from "../composables/client";

let rootPath = ''
const modulesMap = new Map<string, { filePath: string }>()
rpc.root().then(res => {
    rootPath = res
}).catch(err => {
    console.error(err)
})

let keyPress = false
const handleKeyPressDown = (event) => {
  if(event.key === 'Alt' || event.key === 'Meta' || event.key === 'Cmd'){
    keyPress = true
  }
}

const handleKeyPressUp = (event) => {
  if(event.key === 'Alt' || event.key === 'Meta' || event.key === 'Cmd'){
    keyPress = false
  }
}
onDestroy(() => {
  document.removeEventListener('keydown', handleKeyPressDown)
  document.removeEventListener('keyup', handleKeyPressUp)
})
/********* render chart ***********/
const handleDataToChartData = (initData) =>{

    if (!initData)
        return { node: [], edges: [] }

    const { data,  main } = initData
    const { level } = getGraphConfig()
    const nodes: Data['nodes'] = data.map((mod) => {
        const path = mod.id.replace(/\?.*$/, '').replace(/#.*$/, '')
        const pathSegments = path.split('/')
        const id = mod.id


        if (!modulesMap.has(id))
            modulesMap.set(id, {filePath: path})
        else
            modulesMap.get(id)!.filePath = path

        const isInMain = !!main.find(i => i.id === id)

        return {
            id,
             label: isInMain ? `<b>${pathSegments.at(-1)}</b>` : pathSegments.at(-1),
             title: getHoverPath(level.value, path, rootPath, level.levelCustom),
             group: path.match(/\.(\w+)$/)?.[1] || 'unknown',
             size: 15 + Math.min(mod.deps.length / 2, 8),
             font: {
                 color: isInMain
                     ? '#F19B4A'
                     : darkLight() === 'dark' ? 'white' : 'black',
                 multi: 'html',
             },
             shape: mod.id.includes('/node_modules/')
                 ? 'hexagon'
                 : mod.virtual
                     ? 'diamond'
                     : 'dot',
        }
    })

    const edges: Data['edges'] = data.flatMap(mod => mod.deps.map(dep => ({
        from: mod.id,
        to: dep,
        arrows: {
            to: {
                enabled: true,
                scaleFactor: 0.8,
            },
        },
    })))

    return {
        nodes,
        edges,
    }
}

let searchValue = ''
let graphData = null
const searchNode = debounce((e) => {
  updateChart(e.detail)
}, 300)

let lastSelectedNode = null
let networkChart = null
const client = useDevtoolsClient()
onMount(async () => {
    graphData = await getGraphData()
    let finalGraphData = initGraphData('', graphData)

    const container = document.getElementById('__svelte_devtools_graph')
    networkChart = new Network(container, handleDataToChartData(finalGraphData) as Data, visNetworkOptions)

    const resetNodeStyle = () => {
        // @ts-expect-error network body typing error
        networkChart.body.data.nodes.update(networkChart.body.data.nodes.getIds().map(id => ({ id, size: 16 })))
        // @ts-expect-error network body typing error
        networkChart.body.data.edges.update(networkChart.body.data.edges.getIds().map((id) => {
            // @ts-expect-error network body typing error
            const group = networkChart.body.data.nodes.get(networkChart.body.data.edges.get(id)!.from).group
            return {
                id,
                // default unknown group color
                color: visNetworkOptions.groups[group]?.color ?? '#97C2FC',
            }
        }))
    }

    networkChart.on('click', (params) => {
        const nodeId = params.nodes?.[0]
        if (!nodeId)
            return resetNodeStyle()

        const { highlight, openEditor } = getGraphConfig()
        if (openEditor.open && keyPress){
          return client.inspector.openInEditor(location.origin, modulesMap.get(nodeId)!.filePath, 1, 1)
        }


         if (lastSelectedNode && lastSelectedNode !== nodeId)
             resetNodeStyle()
         if (!highlight.open)
             return

        // highlight selected node
        // @ts-expect-error network body typing error
        const nonConnectedNodes = networkChart.body.data.nodes.getIds().filter(id => !networkChart.getConnectedNodes(nodeId).includes(id) && nodeId !== id)
        // @ts-expect-error network body typing error
        const nonConnectedEdges = networkChart.body.data.edges.getIds().filter(id => !networkChart.getConnectedEdges(nodeId).includes(id))
        // @ts-expect-error network body typing error
        networkChart.body.data.nodes.update(nonConnectedNodes.map(id => ({ id, color: 'rgb(69,69,69,.3)' })))
        // @ts-expect-error network body typing error
        networkChart.body.data.edges.update(nonConnectedEdges.map(id => ({ id, color: 'rgb(69,69,69,.3)' })))
        // @ts-expect-error network body typing error
        networkChart.body.data.nodes.update([{ id: nodeId, color: visNetworkOptions.groups[networkChart.body.data.nodes.get(nodeId).group]?.color, size: 26 }])
        lastSelectedNode = nodeId
    })

  document.addEventListener('keydown', handleKeyPressDown)
  document.addEventListener('keyup', handleKeyPressUp)
})
const updateChart = (search = '') => {
  const data = initGraphData(search, graphData)
  networkChart && networkChart.setData(handleDataToChartData(data) as Data)
}
/****************** show node_modules / virtual nodes **********************/
let includeV = false
let includeN = false
const {
  includeVirtual,
  includeNodeModules,
  highlight,
  level,
  openEditor
} = getGraphConfig()
includeV = includeVirtual
includeN = includeNodeModules
const handleCheckBox = (value: boolean, type: 'v' | 'n') => {
  const curConfig = getGraphConfig()
  if(type === 'v'){
    includeV = value
    curConfig.includeVirtual = includeV
  }else {
    includeN = value
    curConfig.includeNodeModules = includeN
  }
  // update config
  setGraphConfigCache(curConfig)
  updateChart()
}
/****************** show setting dialog **********************/
let showSetting = false
let isHighlight = highlight.open
let isOpenIDE = openEditor.open
const handleSwitch = (value: boolean, type: 'h' | 'o') => {
  const curConfig = getGraphConfig()
  if(type === 'h'){
    isHighlight = value
    curConfig.highlight.open = value
  }

  if(type === 'o'){
    isOpenIDE = value
    curConfig.openEditor.open = value
  }
  // update config
  setGraphConfigCache(curConfig)
}
/******************  custom hover path level **********************/
let hoverPathLevel = level.value
let hoverPathLevelCustom = level.levelCustom
const handleHoverPathLevel = (data) => {
  hoverPathLevel = data.detail
  const curConfig = getGraphConfig()
  curConfig.level.value = hoverPathLevel
  // update config
  setGraphConfigCache(curConfig)
  updateChart()
}
const handlePathLevelCustom = (data) => {
  hoverPathLevelCustom = data.detail
  const curConfig = getGraphConfig()
  curConfig.level.levelCustom = hoverPathLevelCustom
  // update config
  setGraphConfigCache(curConfig)
  updateChart()
}
</script>
<div class="relative h-screen w-full flex flex-col overflow-hidden">
    <div class="flex-c w-full px-4 pb-2 shadow">
        <KIcon btn
               icon="i-carbon-settings"
               on:click={() => showSetting = true}
               color="text-tx-light"
               cls="hover-icon mt-4 mx-2">
        </KIcon>
        <div class="flex flex-auto items-center mt-4">
            <KInput on:input={(e)=>searchNode(e)}
                    bind:value={searchValue}
                    cls="w-full" placeholder="Search" iconPrefix="i-carbon-search"></KInput>
        </div>
        <div class="flex justify-center flex-col flex-1 mt-4 mx-2">
            <KCheckbox value={includeN}
                      on:updateValue={(e) => handleCheckBox(e.detail, 'n')}
                      label="node_module"/>
            <KCheckbox value={includeV}
                      on:updateValue={(e) => handleCheckBox(e.detail, 'v')}
                      label="virtual"/>
        </div>
        <div class="flex-c flex-auto mt-4">
            <!--<Input  on:input={()=>searchNode(searchValue)}
                    bind:value={searchValue}
                    placeholder="Glob Pattern" icon="i-carbon-double-integer">
            </Input>-->
        </div>
    </div>
    <div class="flex-1" id='__svelte_devtools_graph'>
    </div>
    <KModal title="Graph Setting"
            on:close={() => showSetting = false}
            show={showSetting} >
        <div class="flex justify-between items-center w-550px">
            <div>
                <p class="text-md text-tx dark:text-white ">Path level</p>
                <span class="text-muted text-xs">Display the path level of the hovered node</span>
            </div>
            <div class="flex-c">
                <KSelect value="{hoverPathLevel}"
                        on:updateValue={handleHoverPathLevel}>
                    {#each ['absolute', 'root', 'custom'] as item (item)}
                        <option>{item}</option>
                    {/each}
                </KSelect>
                {#if hoverPathLevel === 'custom'}
                   <KSelect value="{hoverPathLevelCustom}"
                           cls="ml-2"
                           on:updateValue={handlePathLevelCustom}>
                       {#each ['2', '3', '4', '5', '6'] as item (item)}
                           <option>{item}</option>
                       {/each}
                   </KSelect>
                {/if}
            </div>
        </div>
        <div class="flex justify-between items-center w-550px my-2">
            <div>
                <p class="text-md text-tx dark:text-white ">Open in editor</p>
                <span class="text-muted text-xs">Press Alt/Cmd + click on a node to open the file in editor</span>
            </div>
            <KSwitch value={isOpenIDE}
                    on:updateValue ={(v) => handleSwitch(v.detail, 'o')}>
            </KSwitch>
        </div>
        <div class="flex justify-between items-center w-550px my-2">
            <div>
                <p class="text-md text-tx dark:text-white ">Highlight related node</p>
                <span class="text-muted text-xs">Highlight the directly related node when clicking on a node</span>
            </div>
            <KSwitch value={isHighlight}
                    on:updateValue ={(v) => handleSwitch(v.detail, 'h')}>
            </KSwitch>
        </div>
        <div class="flex justify-between items-center w-550px">
            <div class="w-500px">
                <p class="text-md text-tx dark:text-white ">Glob pattern</p>
                <span class="text-muted text-xs">Enable glob pattern to pre-filter modules. Use dot + space(", ") to separate multiple patterns.</span>
            </div>
            <KSwitch disabled></KSwitch>
        </div>
    </KModal>
</div>
<style>
    :global(.vis-tooltip) {
        --at-apply: bg-white px-2 py-1 absolute shadow;
    }

    :global(.dark .vis-tooltip) {
        --at-apply: bg-dark-300 text-white shadow-main shadow;
    }
</style>
