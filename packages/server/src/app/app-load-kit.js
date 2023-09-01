// 虚拟模块。这是客户端的根组件
import { load } from 'virtual:svelte-devtools-path:app.js'
import { browser } from '$app/environment'
if (browser)
  load()
