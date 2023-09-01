<script lang="ts">
  import { onMount, tick, onDestroy } from 'svelte'
  import {
    SvelteLogo as Logo,
    CloseIcon as Close,
  } from "@ikun-svelte-devtools/icons"
  import EyeDropperContainer from './eye-dropper-container.svelte'
  // virtual module
  // @ts-ignore
  import svelteDevToolsOptions from 'virtual:svelte-devtools-options'
  import {CLIENT_FRAME_ID, DevToolsHooks} from "@ikun-svelte-devtools/shared";
  import {
    defaultConfig,
    getConfig,
    babbleInteract,
    wrapperEvt,
    clickOutside,
    darkLight,
    dragResize,
  } from "@ikun-svelte-devtools/utils-client";
  import type { SvelteDevtoolsHostClientHook } from"@ikun-svelte-devtools/shared";

  export let hook:SvelteDevtoolsHostClientHook | null = null
  const hookInner = hook
  let state = 'modal'

  /********* interact/display start ******** */
  let clearEvt:null | (()=> void) = null
  let showModal = false
  let eyeDropperRef:null | HTMLElement = null
  const toggleModal = async (show: boolean) => {
    if(state == 'inspector'){
      // @ts-ignore
      window.__SVELTE_KIT_INSPECTOR__.disable()
    }
    state = 'modal';
    showModal = show
  }

  const toggleEyeDropper = async (show: boolean) => {
      state = 'eye';
      showEyeDropper = show
      showModal = !show
  }

  const toggleInspector = async (show: boolean) => {
    state = 'inspector';
    showModal = !show;
    // @ts-ignore
    window.__SVELTE_KIT_INSPECTOR__.enable()
  }

  let showClose = true
  const hrefChange = (url: string) => {
    if(url.includes('Inspect')){
      showClose = false
    }else {
      showClose = true
    }
  }

  const config = getConfig() as typeof defaultConfig;
  let disableClickOutside = !config.clickOutside
  $: disableClickOutsideParams = {
    cb: () => toggleModal(false),
    disabled: disableClickOutside
  }
  const doDisabledClickOutside = (disabled: boolean) => {
    disableClickOutside = disabled
  }

  async function resetBabbleInteract(){
    clearEvt && clearEvt()
    babbleInteract('#sdt_bubble',toggleModal.bind(true))
  }

  /**
   * control display
   */
  async function toggleShow (type = 'modal') {
      if(type === 'modal' || type === 'inspector'){
          if (showModal){
              modalRef && (modalRef.style.display = 'initial')
              setTimeout(() => bubbleRef && (bubbleRef.style.display = 'none'), 350)
          }else {
              setTimeout(() => modalRef && (modalRef.style.display = 'none'), 350)
              bubbleRef && (bubbleRef.style.display = 'flex')
          }
          return
      }

      if(type === 'eye'){
          if(showEyeDropper){
            eyeDropperRef && (eyeDropperRef.style.display = 'flex')
            setTimeout(() => modalRef && (modalRef.style.display = 'none'), 350)
          }else {
            setTimeout(() => bubbleRef && (bubbleRef.style.display = 'none'), 350)
            modalRef && (modalRef.style.display = 'initial')
          }
          return
      }
  }
  /********* interact/display end ******** */

  let iframe:null | HTMLIFrameElement = null
  const clientUrl = `${svelteDevToolsOptions.base || '/'}__devtools__/`
  function getIframe() {
    iframe = document.createElement('iframe')
    iframe.id = CLIENT_FRAME_ID
    iframe.src = clientUrl
    iframe.style.width = '100%'
    iframe.style.height = '100%'
    iframe.style.outline = '0'
    iframe.style.border = 'none'
    iframe.style.borderRadius = '8px'
    iframe.setAttribute('data-sv-inspector-ignore', 'true')
    iframe.onload = async () => {
      await waitForClientInjection()
      setupClient()
    }
    return iframe
  }

  let iframeInner:null | HTMLIFrameElement = null
  let modalRef :null | HTMLElement = null
  let bubbleRef: null | HTMLElement = null
  async function mountClient(){
    await tick()
    // mount client
    if (modalRef &&
      !iframeInner &&
      Array.from(modalRef.children).every(el => el !== iframe)){
      const iframe = getIframe()
      iframe.style.pointerEvents = 'auto'
      modalRef.appendChild(iframe)
      iframeInner = iframe
    }
  }

  /*********** client start ***********/

  let isAppCreated = false
  function waitForClientInjection(retry = 50, timeout = 200) {
    const test = () => {
      // @ts-ignore
      return !!iframe?.contentWindow?.__SVELTE_DEVTOOLS_VIEW__ && isAppCreated
    }
    if (test())
      return

    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (test()) {
          clearInterval(interval)
          resolve(true)
        }
        else if (retry-- <= 0) {
          clearInterval(interval)
          reject(Error('Svelte Devtools client injection failed'))
        }
      }, timeout)
    })
  }

  function setupClient() {
    // 向客户端注入钩子
    // @ts-ignore
    const injection = iframe?.contentWindow?.__SVELTE_DEVTOOLS_VIEW__
    injection.setClient({
      hook: hookInner
    })
  }
  /************client end ***********/

  /********* init start ******** */
  const keyDownOpen = (e) => {
      // cmd + shift + D in <macOS>
      // alt + shift + D in <Windows>
      if (e.code === 'KeyD' && e.altKey && e.shiftKey)
          toggleModal(true)
  }
  onMount(() => {
    toggleShow(state)
    clearEvt = babbleInteract('#sdt_bubble', toggleModal.bind(true));
    document.addEventListener('keydown', keyDownOpen);
  })
  document.onresize = wrapperEvt('onresize', resetBabbleInteract)

  let showEyeDropper = false
  const initClient = () => {
    if(hookInner){
      // 初始化时，从client层触发到容器层，在从容器层注入钩子方法（setupClient）
      hookInner.on(DevToolsHooks.APP_INIT, () => {
        setTimeout(() => {
          isAppCreated = true
        }, 80)
      });

      hookInner.on(DevToolsHooks.SHOW_EYE_DROPPER, toggleEyeDropper);

      hookInner.on(DevToolsHooks.HREF_CHANGE, hrefChange);

      hookInner.on(DevToolsHooks.CLICK_OUTSIDE_CHANGE, doDisabledClickOutside);

      hookInner.on(DevToolsHooks.DARK_CHANGE, doToggleDark);

      hookInner.on(DevToolsHooks.SHOW_INSPECTOR, toggleInspector);
    }

  }
  initClient()
  /********* init end ******** */

  onDestroy(() => {
    document.removeEventListener('keydown', keyDownOpen)
  })

  $: if (showModal && !showEyeDropper) {
    toggleShow(state)
    mountClient()
  }else if(!showModal && showEyeDropper){
    toggleShow(state)
  } else {
    toggleShow(state)
    resetBabbleInteract()
  }

  let clsDark = 'sdt--light'
  function doToggleDark(){
      const dark = darkLight()
      if(dark === 'dark'){
          clsDark = 'sdt--dark'
      }else {
          clsDark = 'sdt--light'
      }
  }

  doToggleDark()

  let isResizing = ''
  $:if(isResizing){
    iframeInner && (iframeInner.style.pointerEvents = 'none')
  }else{
    iframeInner && (iframeInner.style.pointerEvents = 'auto')
  }
  function setResizingType(type: string) {
    isResizing = type
  }

</script>

<div use:clickOutside={disableClickOutsideParams}>
    <div class="sdt-bubble {!showModal ? 'vanishIn' : 'vanishOut'}"
         id="sdt_bubble"
         bind:this={bubbleRef}
         style="left: 50%; top: calc(100vh - 35px)">
        {#if state === 'inspector'}
            <Close/>
        {:else }
            <Logo marginBottom={'4px'}/>
        {/if}
    </div>

    <div class="sdt-modal {showModal ? 'vanishIn' : 'vanishOut'} {clsDark}"
         bind:this={modalRef}
         use:dragResize = {{isResizing, iframeInner}}
         id="sdt_modal">
        {#if showClose}
            <div class="sdt-modal--close"
                 aria-hidden="true"
                 on:click={()=>toggleModal(false)}>
                <Close />
            </div>
        {/if}

       <div class="svelte-devtools-resize-handle svelte-devtools-resize-handle-horizontal"
            style="top: 0"
            aria-hidden="true"
            on:mousedown|preventDefault ={() => setResizingType('t')}>
       </div>


        <div class="svelte-devtools-resize-handle svelte-devtools-resize-handle-vertical"
             style="right: 0"
             aria-hidden="true"
             on:mousedown|preventDefault ={() => setResizingType('r')}>
        </div>

        <div class="svelte-devtools-resize-handle svelte-devtools-resize-handle-corner"
             style="top: 0; right: 0; cursor: nesw-resize "
             aria-hidden="true"
             on:mousedown|preventDefault ={() => setResizingType('tr')}>
        </div>

        <div class="svelte-devtools-resize-handle svelte-devtools-resize-handle-corner"
             style="top: 0; left: 0; cursor: move "
             aria-hidden="true"
             on:mousedown|preventDefault ={() => setResizingType('m')}>
        </div>

    </div>

    <div class="sdt-eye-dropper {showEyeDropper ? 'vanishIn' : 'vanishOut'} {clsDark}"
         bind:this={eyeDropperRef}
         style="display: none"
         id="sdt_eye_dropper">
        <div class="sdt-modal--close"
             aria-hidden="true"
             on:click={()=>toggleEyeDropper(false)}>
            <Close />
        </div>
        <EyeDropperContainer/>
    </div>
</div>


<style>
    .sdt-bubble{
        position: fixed;
        z-index: 99999999;
        width: 35px;
        height: 35px;
        background-color: white;
        border-radius: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        margin-bottom: 10px;
        box-shadow: 0 0 12px rgba(0, 0, 0, .12)
    }
    .sdt-bubble:hover {
        box-shadow: 0 0 12px rgba(255, 62, 0, .5)
    }

    .sdt-modal{
        position: fixed;
        z-index: 99999999;
        background-color: white;
        border-radius: 8px;
        width: 60vw;
        height: 60vh;
        left: 20%;
        bottom: 30px;
        box-shadow: 0 0 12px rgba(0, 0, 0, .12)
    }

    .sdt-eye-dropper{
        position: fixed;
        z-index: 99999999;
        background-color: white;
        border-radius: 8px;
        width: 300px;
        height: 80px;
        left: calc(50% - 140px);
        bottom: 10px;
        box-shadow: 0 0 12px rgba(0, 0, 0, .12)
    }

    .sdt-modal--close{
        cursor: pointer;
        margin: 10px;
        position: absolute;
        right: 0;
        top: 0;
    }

    .sdt--dark{
        background-color: #1f1f1f;
        color: white;
    }
    .sdt--dark .sdt-modal--close{
        color: white;
    }
    .sdt--light{
        background-color: #fff;
        color: #1f1f1f;
    }
    .sdt--light .sdt-modal--close{
        color: rgb(125,125,125);
    }

    .sdt--dark .sdt-modal--close:hover,
    .sdt--light .sdt-modal--close:hover{
        color: #ff3e00;
    }
    .vanishIn {
        animation-name: vanishIn;
        animation-duration: 500ms;
    }

    @-webkit-keyframes vanishIn {
        0% {
            opacity: 0;
            transform-origin: 50% 50%;
            transform: scale(2, 2);
            filter: blur(90px);
        }
        100% {
            opacity: 1;
            transform-origin: 50% 50%;
            transform: scale(1, 1);
            filter: blur(0px);
        }
    }

    @keyframes vanishIn {
        0% {
            opacity: 0;
            transform-origin: 50% 50%;
            transform: scale(2, 2);
            filter: blur(90px);
            display: none;
        }
        100% {
            opacity: 1;
            transform-origin: 50% 50%;
            transform: scale(1, 1);
            filter: blur(0px);
        }
    }

    .vanishOut {
        animation-name: vanishOut;
        animation-duration: 500ms;
    }

    @-webkit-keyframes vanishOut {
        0% {
            opacity: 1;
            transform-origin: 50% 50%;
            transform: scale(1, 1);
            filter: blur(0px);
        }
        100% {
            opacity: 0;
            transform-origin: 50% 50%;
            transform: scale(2, 2);
            filter: blur(20px);
        }
    }

    @keyframes vanishOut {
        0% {
            opacity: 1;
            transform-origin: 50% 50%;
            transform: scale(1, 1);
            filter: blur(0px);
        }
        100% {
            opacity: 0;
            transform-origin: 50% 50%;
            transform: scale(2, 2);
            filter: blur(20px);
        }
    }

    .svelte-devtools-resize-handle-horizontal {
        position: absolute;
        left: 6px;
        right: 6px;
        height: 10px;
        margin: -5px 0;
        cursor: ns-resize;
        border-radius: 5px;
    }
    .svelte-devtools-resize-handle-vertical {
        position: absolute;
        top: 6px;
        bottom: 0;
        width: 10px;
        margin: 0 -5px;
        cursor: ew-resize;
        border-radius: 5px;
    }
    .svelte-devtools-resize-handle-corner {
        position: absolute;
        width: 14px;
        height: 14px;
        margin: -6px;
        border-radius: 6px;
    }
    .svelte-devtools-resize-handle:hover {
        background: rgba(125,125,125,0.1);
    }
</style>
