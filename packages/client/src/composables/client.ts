import type { SvelteDevtoolsHostClient } from '@ikun-svelte-devtools/shared'

const client = {
  hook: (window.parent as Window & { __SVELTE_DEVTOOLS_GLOBAL_HOOK__: any })?.__SVELTE_DEVTOOLS_GLOBAL_HOOK__,
  markClientLoaded: () => { },
  hookBuffer: [],
  categorizedHookBuffer: {},
  inspector: (window.parent as Window & { __SVELTE_KIT_INSPECTOR__: any })?.__SVELTE_KIT_INSPECTOR__
} as SvelteDevtoolsHostClient

export function useDevtoolsClient() {
  return client
}
