<script lang="ts">
import { useCategorizedTabs } from '../composables/tabs';
import {
  KIcon,
  KSelect,
  KSwitch,
  KButton,
} from "@ikun-ui/core";

import { hookApi } from "../composables/hook";
import { DevToolsHooks } from '@ikun-svelte-devtools/shared';
import {
  darkLight,
  toggleDark,
  getConfig,
  setConfig
} from "@ikun-svelte-devtools/utils-client";
const categories = useCategorizedTabs()
let tab = categories
let categoriesMarks = {}


const config = getConfig()

const initCategoriesMarks = () => {
    tab.forEach(v => {
        if(categoriesMarks[v.category] === undefined){
            categoriesMarks[v.category] = true
        }

        if(v.hide){
            categoriesMarks[v.category] = !v.hide
        }
    })
}

initCategoriesMarks()

const handleSwitchTabMul = (value, type) => {
    categoriesMarks[type] = !categoriesMarks[type]
    tab = tab.map((v, index) => {
        if(v.category === type && !v.disable){
            v.hide = !value.detail
            config.tabsHide[index] = !value.detail
        }
        return v
    })

    setConfigByTabs()
}

const handleSwitchTab = (v, index) => {
    tab[index].hide = !v.detail
    config.tabsHide[index] = !v.detail
    categoriesMarks[tab[index].category] = v.detail
    setConfigByTabs()
}

function setConfigByTabs(){
    setConfig(config)
    hookApi.hook.emit(DevToolsHooks.SHOW_TAB)
}

let clickOutside = config.clickOutside
function toggleClickOutside(e){
  clickOutside =  e.detail
  const curConfig = getConfig()
  curConfig.clickOutside = clickOutside
  setConfig(curConfig)
  hookApi.hook.emit(DevToolsHooks.CLICK_OUTSIDE_CHANGE, !clickOutside);
}

let uiScale = config.scale
const scale = {
  'Tiny': '12px',
  'Small': '14px',
  'Normal': '15px',
  'Large': '16px',
  'Huge': '18px'
}
updatedScale()
function toggleUIScale(e){
  uiScale = e.detail
  const curConfig = getConfig()
  curConfig.scale = uiScale
  setConfig(curConfig)
  updatedScale()
}
function updatedScale(){
  document.body.style.fontSize = scale[uiScale]
}

let dark = darkLight()
function toggleDarkLight(){
    if(dark === 'dark'){
        dark = 'light'
    }else {
        dark = 'dark'
    }
    toggleDark(dark)
    hookApi.hook.emit(DevToolsHooks.DARK_CHANGE);
}
</script>
<h1 class="text-xl text-tx dark:text-white  flex p2 mb-2">
    <KIcon icon="i-carbon-settings" cls="mr-4" color="text-tx-light">
    </KIcon>
    DevTools Settings
</h1>
<div  class="gap-y-3 gap-x-10 p2 max-w-300 grid md:cols-2">
    <div class="gap-1 flex flex-col">
        {#each tab as item, index (`${item.title}${item.hide}${categoriesMarks[item.category]}`)}
            {#if item}
                {#if (index && (item.category !== tab[index -1].category)) || !tab[index -1]}
                    <div class="flex justify-between items-center p2">
                        <h2 class="text-tx dark:text-white  text-md my-2">{item.category}</h2>
                        <KSwitch value="{categoriesMarks[item.category]}"
                                checkedColor="!bg-success"
                                unCheckedColor="!bg-success:40"
                                on:updateValue ={(v) => handleSwitchTabMul(v, item.category)}>
                        </KSwitch>
                    </div>
                {/if}
                <div class="flex justify-between items-center p2 border border-solid border-c rounded hover:animate-LianYi">
                    <span class="text-sm text-muted dark:text-white ">{item.title}</span>
                    <KSwitch value={!item.hide}
                             disabled={item.disable}
                            on:updateValue ={(v) => handleSwitchTab(v, index)}>
                    </KSwitch>
                </div>
            {/if}
        {/each}
    </div>
    <div>
        <h1 class="text-tx dark:text-white  text-md my-4">Appearance</h1>
        <KButton plain type="info"
                on:click={() => toggleDarkLight()}
                icon="{dark === 'dark' ? 'i-carbon-moon' : 'i-carbon-sun'}">
            {dark === 'dark' ? 'dark' : 'light'}
        </KButton>
        <h1 class="text-tx dark:text-white  text-md my-4">UI Scale</h1>
        <KSelect value="{uiScale}"
                on:updateValue={toggleUIScale}>
            {#each ['Tiny', 'Small', 'Normal', 'Large', 'Huge'] as item (item)}
                <option>{item}</option>
            {/each}
        </KSelect>
        <h2 class="text-tx dark:text-white  text-md my-4 flex items-center">
            Close DevTools when clicking outside
            <KSwitch value={clickOutside}
                    cls ="ml-2"
                    on:updateValue ={toggleClickOutside}>
            </KSwitch>
        </h2>
    </div>
</div>

