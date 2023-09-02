<script lang="ts">
import {rpc} from "../composables/rpc";
import type {AssetInfo} from "@ikun-svelte-devtools/shared";
import {
  KIcon,
  KInput,
  KDrawer,
  KCollapse,
} from "@ikun-ui/core";

import AssetsBlock from "../components/AssetsBlock.svelte";
import {deepClone} from "@baiwusanyu/utils-obj";
import AssetsDetail from "../components/AssetsDetail.svelte";
let assets:Array<AssetInfo & {fileName: string}> = []
let orgAssets:Array<AssetInfo & {fileName: string}> = []
let assetsGrid: Record<string, (AssetInfo & {fileName: string})[]> = {}
let orgAssetsGrid: Record<string, (AssetInfo & {fileName: string})[]> = {}
async function getAssets() {
    assets = (await rpc.staticAssets()) as Array<AssetInfo & {fileName: string}>
    assets.forEach(classifyAssets)
    orgAssets = deepClone(assets)
    orgAssetsGrid = deepClone(assetsGrid)
}
getAssets()

function classifyAssets(value){
  const basePath = value.path.split('/');
  (value as (AssetInfo & {fileName: string})).fileName = basePath.pop()
  let key = basePath.join('/') || '/'
  if(!assetsGrid[key]){
    assetsGrid[key] = []
  }
  assetsGrid[key].push(value as (AssetInfo & {fileName: string}))
}

let searchValue = ''
let matchedNum = 0
function searchAssets(search: string){
  if(search){
    matchedNum = 0
    if(showAssetsList){
      assets = []
      assets = orgAssets.filter(value => {
        if(value.filePath.includes(search)){
          matchedNum++
          return  true
        }
      })
    }else {
      assetsGrid = {}
      orgAssets.filter(value => {
        if(value.filePath.includes(search)){
          matchedNum++
          return  true
        }
      }).forEach(classifyAssets)
    }
  }else {
    assets = deepClone(orgAssets)
    assetsGrid = deepClone(orgAssetsGrid)
  }
}

let showAssetsList = false
const triggerShowList = (show: boolean) => {
  searchValue = ''
  matchedNum = 0
  showAssetsList = show
}

let showAssetsDetail = false
let selectAssets = {} as AssetInfo & {fileName: string}
const triggerAssetsDetail = (
  show: boolean,
  asset?: AssetInfo & {fileName: string}
) => {
    asset && (selectAssets = asset)
    showAssetsDetail = show
}

const iconDict = {
    image: 'i-carbon-image',
    text: 'i-carbon-document',
    font: 'i-carbon-text-small-caps',
    video: 'i-carbon-video',
    audio: 'i-carbon-document-audio',
    other: 'i-carbon-document-unknown'
}
</script>
<div class="flex flex-col h-full">
    <div class="w-full pt-6 px-4 pb-2 shadow">
        <div class="flex items-center mt-4 ">
            {#if showAssetsList}
                <div class="cursor-pointer mr-2"
                     aria-hidden="true"
                     on:click={() => triggerShowList(false)}>
                    <KIcon icon="i-carbon-list" color="text-tx-light"></KIcon>
                </div>
            {:else }
                <div class="cursor-pointer mr-2"
                     aria-hidden="true"
                     on:click={() => triggerShowList(true)}>
                    <KIcon icon="i-carbon-grid" color="text-tx-light"></KIcon>
                </div>
            {/if}
            <KInput  on:input={(e)=>searchAssets(e.detail)}
                    value={searchValue}
                    cls="w-full"
                     placeholder="Search"
                     iconPrefix="i-carbon-search">
            </KInput>
        </div>
        <p class="text-muted dark:text-white  text-sm mt-2">
            <span>{ orgAssets.length } assets in total</span>
            {#if searchValue}
                <span class="{matchedNum=== 0 ? 'text-warning' : ''}">({ matchedNum } matched) </span>
            {/if}
        </p>
    </div>
    {#if assets}
        <div class="w-full flex-auto overflow-y-auto px-2 scroll-bar relative">
            {#if showAssetsList}
                {#each assets as asset (asset.filePath)}
                    <p class="text-tx dark:text-white  hover:text-main dark:hover:text-white py-1 px-2 w-full hover:bg-rose-50 dark:hover:bg-main:50 rounded cursor-pointer flex items-center"
                       aria-hidden="true"
                       on:click={() => triggerAssetsDetail(true, asset)}>
                        <KIcon icon={iconDict[asset.type]} color="text-tx-light"></KIcon>
                        <span class="ml-2">{asset.path}</span>
                    </p>
                {/each}
            {:else }
                {#each Object.keys(assetsGrid) as key (key)}
                    <KCollapse show="{true}" cls="mt-4 hover:bg-gray-50 dark:hover:bg-dark-200">
                        <div slot="title">
                            <p class="ml-2">{key}</p>
                            <p class="ml-2 text-muted dark:text-white  text-sm">{assetsGrid[key].length} items</p>
                        </div>
                        <div slot="content" class="grid grid-cols-minmax-8rem">
                            {#each assetsGrid[key] as asset (asset.filePath)}
                                <div class="cursor-pointer gap-2"
                                     aria-hidden="true"
                                   on:click={() => triggerAssetsDetail(true, asset)}>
                                    <AssetsBlock asset={asset}></AssetsBlock>
                                </div>
                            {/each}
                        </div>
                    </KCollapse>
                {/each}
            {/if}

            <KDrawer on:close={() => triggerAssetsDetail(false)}
                     cls="of-hidden scroll-bar shadow-lg"
                     value={showAssetsDetail}>
                <AssetsDetail asset={selectAssets}/>
            </KDrawer>
        </div>
    {:else }
        <div class="w-full flex-auto flex-c flex-col ">
            <KIcon icon="i-carbon-image-search" color="text-tx-light" width="60px" height="60px"></KIcon>
            <p class="text-muted dark:text-white  text-sm mt-2 text-center"> No Assets </p>
        </div>
    {/if}
</div>
<style>
    :global(.k-drawer--base .k-drawer--content){
        overflow-x: hidden;
    }

    :global(.k-drawer--base .k-drawer--content){
        overflow-x: hidden;
    }

    :global(.k-drawer--content::-webkit-scrollbar-track-piece) {
        background: rgba(255, 62, 0, 0.2);
    }

    :global(.k-drawer--content::-webkit-scrollbar) {
        width: 6px;
    }

    :global(.k-drawer--content::-webkit-scrollbar-thumb) {
        background: rgba(255, 62, 0, 0.38);
        border-radius: 20px;
    }
</style>
