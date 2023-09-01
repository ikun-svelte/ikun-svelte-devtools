
export interface IClickOutsideParams {
  disabled?: boolean
  cb:()=> void
}
export function clickOutside(node,params:IClickOutsideParams) {
  function handleClickOutside(event){
    const target = event.target
    const container = node
    if (container && !container.contains(target)) {
      params.cb()
    }
  }

  if(params.disabled) {
    window.removeEventListener('click', handleClickOutside);
    return
  }
  window.addEventListener('click', handleClickOutside);
  return {
    destroy: () => {
     window.removeEventListener('click', handleClickOutside);
    },
    update: (nParams) => {
      if(nParams.disabled) {
        window.removeEventListener('click', handleClickOutside);
      }
    }
  }
}
