<script lang="ts">
    import { rpc } from '../composables/rpc'
    import IframeView from "../components/IframeView.svelte";
    let url = ''
    rpc.inspectClientUrl().then(res=>{
        url = res
    }).catch(err =>{
        console.error(err)
    })
</script>

<IframeView src={url} />
