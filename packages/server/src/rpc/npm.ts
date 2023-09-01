import { detect, parseNi, parseNun } from '@antfu/ni'

import type { ExecNpmScriptOptions } from '@ikun-svelte-devtools/shared'

// 这个方法也很简单， 根据参数和配置 ，执行 npm 的安装或卸载依赖包指令
export async function execNpmScript(packages: string[], options: ExecNpmScriptOptions = {}) {
  const {
    isDev = false,
    cwd = process.cwd(),
    callback = () => { },
    type = 'install',
  } = options
  const agent = await detect({})

  const fn = type === 'install' ? parseNi : parseNun
  const command = await fn(agent!, [...packages, ...(isDev ? ['-D'] : []), type === 'install' ? '--ignore-scripts' : ''])
  const { execaCommand } = await import('execa')

  const _process = execaCommand(command!, {
    encoding: 'utf-8',
    cwd,
    env: {
      COLORS: 'true',
      FORCE_COLOR: 'true',
    },
  })

  callback('data', `\n\n> ${command}\n\n`)
  _process.stdout!.on('data', (data) => {
    callback('data', data.toString())
  })
  _process.stderr!.on('data', (data) => {
    callback('data', data.toString())
  })
  _process.on('exit', (code) => {
    callback('data', `\n\n> Successfully ${type === 'install' ? 'installed' : 'removed'}. \n\n`)
    callback('exit', `${code}`)
  })
}
