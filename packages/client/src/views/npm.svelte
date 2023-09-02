<script lang="ts">
import InfiniteScroll from "svelte-infinite-scroll";
import algoliasearch from 'algoliasearch'
import type { SearchResponse } from '@algolia/client-search'
import { KMsgBox } from "@ikun-ui/core";
import {
  KIcon,
  KInput,
  KCollapse,
  KPopover,
  KButton,
} from "@ikun-ui/core";
import {rpc} from "../composables/rpc";
import type {  PackageMeta, PackageInfo } from '@ikun-svelte-devtools/shared'
import { debounce } from '@baiwusanyu/utils-com'
import TerminalView from "../components/TerminalView.svelte";
import { hookApi } from '../composables/hook'
const algoliaConfig = {
  appId: 'OFCNCOG2CU',
  apiKey: 'f54e21fa3a2a0160595bb058179bfb1e',
  indexName: 'npm-search',
}

const algolia = algoliasearch(algoliaConfig.appId, algoliaConfig.apiKey).initIndex(
  algoliaConfig.indexName,
)

function toThousands(num: number): string {
  return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
}

let searchValue = ''
let total = 0
let page = 0
let list:SearchResponse['hits'] = []

const searchPackage = async (isSearch = false) => {
  if(isSearch){
    total = 0
    page = 0
    list = []
  }
  const res = (await algolia.search<PackageInfo>(searchValue, {
    attributesToRetrieve: [
      'name',
      'version',
      'description',
      'owner',
      'repository',
      'humanDownloadsLast30Days',
      'versions',
    ],
    page,
    hitsPerPage: 20,
  }) as SearchResponse)
  total = (res as SearchResponse).nbHits
  const hits = (res as SearchResponse<{version: string, selectedVersion: string}>).hits.map(v => {
    v.selectedVersion = v.version
    return v
  })
  list = page ? list.concat(hits) : hits
  packageListVisible = true
}
const debounceSearch = debounce((e) => {
  searchValue = e.detail
  // 搜索觸發重置參數
  searchPackage(true)
},300)
searchPackage()

let packageListVisible = true
const loadMore = () => {
  if (list.length >= total || !packageListVisible)
    return
  page++
  searchPackage()
}

let projectDeps = {}
let projectDepsNum = 0
const getProjectDeps = () => {
  rpc.getPackages().then((res) => {
    projectDeps = res.packages
    projectDepsNum = Object.keys(projectDeps).length
  })
}
getProjectDeps()

let terminalVisible = false

let isUninstall = false
async function uninstall(item: PackageMeta, type: string) {
    const isDev = type !== 'dependencies'
    terminalVisible = true
  isUninstall = true
    rpc.uninstallPackage([`${item}`], { isDev })
      .catch(err => {console.log(err)})
  hookApi.hook.on('__svelte-devtools:terminal:exit__', () => {
        if(isUninstall){
          setTimeout(() => {
            terminalVisible = false
            console.log('1')
            getProjectDeps()
            KMsgBox.confirm({
              title: 'Info',
              emoType: 'success',
              content: 'operation complete',
            })
          }, 2000)
          isUninstall = false
        }
    })
}

let isDownload = false
async function download(item, isDev: boolean) {
  terminalVisible = true
  isDownload = true
  rpc.installPackage([`${item.name}@${item.selectedVersion ?? item.version}`], { isDev })
    .catch(err => {console.log(err)})
  hookApi.hook.on('__svelte-devtools:terminal:exit__', () => {
    if(isDownload){
      setTimeout(() => {
        terminalVisible = false
        getProjectDeps()
        KMsgBox.confirm({
          title: 'Info',
          emoType: 'success',
          content: 'operation complete',
        })
        isDownload = false
      }, 2000)
    }

  })
}
</script>

<div class="flex flex-col h-full">
    <div class="w-full p-4 shadow">
        <KInput on:input={(e)=>debounceSearch(e)}
                value={searchValue}
                cls="npm-search"
                placeholder="Search"
                iconPrefix="i-carbon-search">
        </KInput>
    </div>
    <div class="w-full flex-auto overflow-y-auto px-2 scroll-bar relative">
        <KCollapse show={false} cls="mt-4 hover:bg-gray-50 dark:hover:bg-dark-200">
            <div slot="title">
                <p class="ml-2">Project dependencies</p>
                <p class="ml-2 text-muted dark:text-white  text-sm">found {projectDepsNum} packages</p>
            </div>
            <div class="of-hidden max-h-80%" slot="content">
                <table class="w-full">
                    <thead class="border-c border-solid border-b-1">
                    <tr>
                        <th class="text-left">
                            Name
                        </th>
                        <th class="text-left">
                            Version
                        </th>
                        <th class="text-center">
                            Type
                        </th>
                        <th class="text-center">
                            Uninstall
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {#each Object.keys(projectDeps) as key (key)}
                        <tr class="p-1 group h-7 text-muted dark:text-white  hover:bg-rose-50 hover:text-main dark:hover:text-white dark:hover:bg-main:50">
                            <td class="text-sm op70">
                                <div class="items-center gap-3 flex-inline">
                                    { key }
                                </div>
                            </td>
                            <td class="text-sm op70">
                                <div class="items-center gap-3 flex-inline">
                                    {  projectDeps[key].version }
                                </div>
                            </td>
                            <td class="flex justify-center text-sm op70">
                                <div>
                                    {  projectDeps[key].type }
                                </div>
                            </td>
                            <td class="w-30 text-center">
                                <KIcon icon='i-carbon-delete'
                                      btn
                                      color="text-tx-light"
                                      on:click={() => uninstall(key, projectDeps[key].type)}
                                      width="20px"
                                       cls="hover-icon"
                                      height="20px">
                                </KIcon>
                            </td>
                        </tr>
                    {/each}
                    </tbody>
                </table>
            </div>
        </KCollapse>
        <KCollapse show={packageListVisible}
                  on:updateModelValue = {(e) => packageListVisible = e.detail }
                  cls="mt-4 hover:bg-gray-50 dark:hover:bg-dark-200">
            <div slot="title">
                <p class="ml-2">Search Results</p>
                <p class="ml-2 text-muted dark:text-white  text-sm">found {toThousands(total)} packages</p>
            </div>
            <div class="of-hidden max-h-80%" slot="content">
                <table class="w-full">
                    <thead class="border-c border-solid border-b-1">
                    <tr>
                        <th class="text-left">
                            Name
                        </th>
                        <th class="text-left">
                            Version
                        </th>
                        <th class="text-center">
                            Author
                        </th>
                        <th class="text-center">
                            Downloads
                        </th>
                        <th class="text-center">
                            Download
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {#each list as item (item.name)}
                        <tr class="p-1 group h-7 text-muted dark:text-white  hover:bg-rose-50 hover:text-main dark:hover:text-white dark:hover:bg-main:50">
                            <td class="text-sm op70">
                                <div class="items-center gap-3 flex-inline">
                                    { item.name }
                                </div>
                            </td>

                            <td class="text-sm op70">
                                <KPopover trigger="click" placement="top">
                                    <div slot="contentEl" class="h-80px overflow-y-auto scroll-bar w-120px">
                                        {#each Object.keys(item.versions) as ver (ver)}
                                            <p class="cursor-pointer text-muted dark:text-white  hover:text-main text-center p1 rounded hover:bg-rose-50 dark:hover:text-white dark:hover:bg-main:50"
                                               aria-hidden="true"
                                               on:click = {() => {item.selectedVersion = ver}}>
                                                {ver}
                                            </p>
                                        {/each}
                                    </div>
                                    <div class="items-center gap-3 flex-inline cursor-pointer underline" slot="triggerEl">
                                        {  item.selectedVersion }
                                    </div>
                                </KPopover>
                            </td>
                            <td class="flex justify-center text-sm op70">
                                <div>
                                    {  item.owner.name }
                                </div>
                            </td>
                            <td class="text-sm op70 text-center">
                                <div>
                                    {  item.humanDownloadsLast30Days }
                                </div>
                            </td>
                            <td class="w-30 flex-c">
                                <KPopover trigger="click" placement="top">
                                    <div slot="contentEl" class="flex-c p1">
                                        <KButton plain type= 'info' cls="mx-1" on:click={() => download(item, true)}>Dev</KButton>
                                        <KButton plain cls="mx-1" on:click={() => download(item, false)}> Prod</KButton>
                                    </div>
                                    <KIcon icon='i-carbon-download'
                                          slot="triggerEl"
                                          btn
                                          color="text-tx-light"
                                          width="20px"
                                           cls="hover-icon"
                                          height="20px">
                                    </KIcon>
                                </KPopover>
                            </td>
                        </tr>
                    {/each}
                    </tbody>
                </table>
            </div>
        </KCollapse>
        <TerminalView modelValue={terminalVisible}></TerminalView>
        <InfiniteScroll threshold={100} on:loadMore={loadMore} />
    </div>

</div>
<style>
    :global(.npm-search){
        width: calc(100% - 30px);
    }
</style>
