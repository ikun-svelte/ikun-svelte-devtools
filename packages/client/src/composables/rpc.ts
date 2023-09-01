import { createHotContext } from 'vite-hot-client'
import { createRPCClient } from '../../../utils/server/src/vite-dev-rpc'
import { hookApi } from './hook'
import type { RPCFunctions } from '@ikun-svelte-devtools/shared'
import {NAME} from '@ikun-svelte-devtools/shared';

export const rpc
  = createRPCClient<RPCFunctions>(
     NAME,
    (
        await createHotContext(
            '/___',
            `${location.pathname.split('/__devtools__')[0] || ''}/`.replace(/\/\//g, '/')
        )
    ), {
    // 触发命令行钩子，从浏览器安装npm包这个功能用得到
    onTerminalData({ data }: { id?: string, data: string }) {
      hookApi.hook.emit('__svelte-devtools:terminal:data__', data)
    },
    onTerminalExit({ data }: { id?: string, data: string }) {
      hookApi.hook.emit('__svelte-devtools:terminal:exit__', data)
    },
  })
