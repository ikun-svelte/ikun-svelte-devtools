import { useDevtoolsClient } from './client'
import type { SvelteDevtoolsHostClient } from '@ikun-svelte-devtools/shared'

export interface SvelteDevtoolsGlobal {
  loaded: boolean
  setClient(client: SvelteDevtoolsHostClient): void
}

export function createSvelteToolsClient() {
  globalThis.__SVELTE_DEVTOOLS_VIEW__ = <SvelteDevtoolsGlobal>{
    loaded: false,
    setClient(_client) {
      let client = useDevtoolsClient()
      client = _client
      client.markClientLoaded = () => {
        this.loaded = true
      }
    },
  }
}
