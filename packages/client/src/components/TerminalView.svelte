<script lang="ts">
  import { KMask } from "@ikun-ui/core";
  import { Terminal } from 'xterm'
  import { FitAddon } from 'xterm-addon-fit'
  import 'xterm/css/xterm.css'
  import { hookApi } from '../composables/hook'
  import { tick } from "svelte";
  export let modelValue = false
  let container = null
  let term: Terminal

  $:if(modelValue){
    renderTerminal()
  }

  async function renderTerminal(){
    await tick()
    term = new Terminal({
      convertEol: true,
      cols: 80,
      screenReaderMode: true,
    })
    const fitAddon = new FitAddon()
    term.loadAddon(fitAddon)
    term.open(container)
    fitAddon.fit()

    hookApi.hook.on('__svelte-devtools:terminal:data__', (data: string) => {
      term.write(data)
    })
    hookApi.hook.on('__svelte-devtools:terminal:exit__', () => {
      clear()
    })
  }
  function clear() {
    term?.clear()
  }
</script>
<KMask value={modelValue}>
    <div bind:this = {container}>
    </div>
</KMask>
