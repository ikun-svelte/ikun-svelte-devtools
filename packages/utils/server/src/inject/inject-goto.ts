export const injectGotoContent = '\tif(__sdt_browser){\n'
  + '\t\twindow.__SVELTE_DEVTOOLS_GLOBAL_HOOK__.on(\'svelte:devtools:goto\', (path, opts) => {\n'
  + '\t\t\t__sdt_goto(path, opts)\n'
  + '\t\t})\n'
  + '\t}'

export const injectGotoImport = 'import { goto as __sdt_goto } from \'$app/navigation\';\n'
  + '\timport { browser as __sdt_browser } from \'$app/environment\'\n'
