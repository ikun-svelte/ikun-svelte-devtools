<script lang="ts">
import DividerTitle from "./DividerTitle.svelte";
import { KMessage, KIcon, KButton } from "@ikun-ui/core";
import AssetsPreview from "./AssetsPreview.svelte";
import type { AssetInfo } from "@ikun-svelte-devtools/shared";
// @ts-ignore
import {useDevtoolsClient} from "../composables/client";
import { rpc } from "../composables/rpc";
import { formatDate, relativeTime } from '@baiwusanyu/utils-date'
import { normalizeSizeUnits } from '@baiwusanyu/utils-normalize'
import Copy from "./Copy.svelte";
export let asset:(AssetInfo & {fileName: string}) = {
    path: '',
    type: 'text',
    publicPath: '',
    filePath: '',
    size: 0,
    mtime: 0,
    fileName: '',
}
const client = useDevtoolsClient()
const origin = window.parent.location.origin

let imageMeta: {width: number, height: number} = { width: 0, height: 0 }
let fileSize = normalizeSizeUnits(asset.size)
const getImageMeta = () => {
    if (asset.type !== 'image')
        return undefined
    return rpc.getImageMeta(asset.filePath).then((res: unknown) => {
      imageMeta = res as {width: number, height: number}
    })
}

let textContent: string = ''
const getTextContent = async () => {
    if (asset.type !== 'text')
        return undefined
    rpc.getTextAssetContent(asset.filePath).then((res: unknown) => {
        textContent = res as string
    })
}

let allowList: string[] = []
const getAllowList = async () => {
  if (asset.type !== 'text')
    return undefined
  rpc.getAllowList().then((res: unknown) => {
    allowList = res as string[]
  })
}
getAllowList()

const handleDownload = (url: string, filePath: string) => {
  if(allowList.length > 0 && !isPathInArrayOrSubPath(allowList, filePath)){
    KMessage.warning({
      content: 'Target cannot be downloaded or opened due to svelte-kit security policy'
    })
    return
  }
  const aLink = document.createElement("a");
  aLink.download = ''
  aLink.href = `${origin}${url}`;
  aLink.click();
  KMessage.success({
    content: 'Target opened successfully'
  })
}

const handleOpen= (url: string, filePath: string) => {
  if(allowList.length > 0 && !isPathInArrayOrSubPath(allowList, filePath)){
    KMessage.warning({
      content: 'Target cannot be downloaded or opened due to svelte-kit security policy'
    })
    return
  }
  const aLink = document.createElement("a");
  aLink.href = `${origin}${url}`;
  aLink.target='_blank'
  aLink.click();
  KMessage.success({
    content: 'Target opened successfully'
  })
}

function isPathInArrayOrSubPath(pathArray: string[], targetPath: string) {
  // 遍历路径数组
  for (let i = 0; i < pathArray.length; i++) {
    let currentPath = pathArray[i];

    // 使用字符串的 startsWith 方法检查当前路径是否是目标路径的父路径
    if (targetPath.startsWith(currentPath)) {
      return true;
    }
  }
  return false;
}


$: if (asset.filePath && asset.type){
    getImageMeta()
    getTextContent()
}
</script>
{#if asset}
    <div class="w-500px flex-col p-4 pt-0">
        <DividerTitle title={'Preview'}/>
        <AssetsPreview asset={asset} textContent={textContent}></AssetsPreview>
        <DividerTitle title={'Details'}/>
        <table class="max-w-full w-full table-fixed text-sm">
            <tbody>
            <tr>
                <td class="w-30 ws-nowrap p-1 pr5 text-right op50">
                    Filepath
                </td>
                <td class="p-1">
                    <div flex="~ gap-1" class="w-full flex items-center">
                        <span class="text-center of-hidden truncate ws-nowrap"
                              title={asset.filePath}>{asset.filePath}
                        </span>
                        <KIcon
                              btn
                              on:click={() => client.inspector.openInEditor(location.origin, asset.filePath, 1, 1)}
                              cls="hover-icon"
                              width="20px"
                              color="text-tx-light"
                              attrs={{title: 'open in Editor'}}
                              height="20px"
                              icon="i-carbon-launch">
                        </KIcon>
                    </div>
                </td>
            </tr>
            <tr>
                <td class="w-30 ws-nowrap p-1 pr5 text-right op50">
                    Public Path
                </td>
                <td class="p-1">
                    <div flex="~ gap-1" class="w-full of-hidden flex items-center">
                        <div class="flex-auto of-hidden truncate ws-pre">
                            { asset.publicPath }
                        </div>
                        <Copy data={asset.publicPath}
                              width="20px"
                              height="20px"
                              attrs={{title: 'copy public path'}}/>
                        <KIcon btn
                               cls="hover-icon"
                              color="text-tx-light"
                              width="20px"
                              on:click={()=>handleOpen(asset.publicPath, asset.filePath)}
                              height="20px"
                              attrs={{title: 'open in browser'}}
                              icon="i-carbon-launch">
                        </KIcon>
                    </div>
                </td>
            </tr>
            <tr>
                <td class="w-30 ws-nowrap p-1 pr5 text-right op50">
                    Type
                </td>
                <td class='capitalize p-1'>
                    { asset.type }
                </td>
            </tr>
            {#if imageMeta?.width}
                <tr>
                    <td class="w-30 ws-nowrap p-1 pr5 text-right op50">
                        Image Size
                    </td>
                    <td class="p-1">{ imageMeta.width } x { imageMeta.height }</td>
                </tr>
            {/if}
            <tr>
                <td class="w-30 ws-nowrap p-1 pr5 text-right op50">
                    File size
                </td>
                <td class="p-1">{fileSize}</td>
            </tr>
            <tr >
                <td class="w-30 ws-nowrap p-1 pr5 text-right op50">
                    Last modified
                </td>
                <td class="p-1">{ formatDate(asset.mtime.toString()) } <span class="op70">({ relativeTime(asset.mtime.toString(), String(new Date()), true, 'hour', 'en') })</span></td>
            </tr>
            </tbody>
        </table>
        <DividerTitle title={'Actions'}/>
        <div class="w-full flex-c">
            <KButton plain icon="i-carbon-download"
                    type="error"
                    on:click={()=>handleDownload(asset.publicPath, asset.filePath)}
                    cls='w-200px'>
                Download
            </KButton>
        </div>
    </div>
{/if}
