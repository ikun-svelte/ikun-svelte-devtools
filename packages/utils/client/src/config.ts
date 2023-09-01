import {extend, localCache} from 'baiwusanyu-utils'
import {svelteConfig} from '@ikun-svelte-devtools/shared';
export const defaultConfig = {
    tabsHide: [
        false,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
    ],
    theme: 'light', // 'dark
    openPage: '/__devtools__/Overview',
    scale: 'Normal',
    clickOutside: false
}

export const getConfig = () => {
    const configCache = localCache.getJSON(svelteConfig)
    return extend(defaultConfig, configCache)
}

export const setConfig = (config: typeof  defaultConfig) => localCache.setJSON(svelteConfig, config)
