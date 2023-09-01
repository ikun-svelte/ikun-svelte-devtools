<script>
  import { Route, Router } from 'svelte-routing'
  import SideNav from './components/SideNav.svelte'
  import Overview from './views/overview.svelte'
  import PagesAnalysis from './views/pages.svelte'
  import RouteAnalysis from './views/routes.svelte'
  import Setting from './views/setting.svelte'
  import Components from './views/components.svelte'
  import Document from './views/document.svelte'
  import Assets from './views/assets.svelte'
  import Npm from './views/npm.svelte'
  import Inspect from './views/inspect.svelte'
  import Graph from './views/graph.svelte'

  const url = '/__devtools__/Overview'
</script>
<Router {url}>
  <main class="fixed inset-0 h-screen w-screen">
    <div class="h-full h-screen of-hidden font-sans grid grid-cols-[50px_1fr]">
      <SideNav />
      <div class="overflow-y-auto scroll-bar">
        <Route path="/__devtools__/Overview" component={Overview} />
        <Route path="/__devtools__/PagesAnalysis" component={PagesAnalysis} />
        <Route path="/__devtools__/RouteAnalysis" component={RouteAnalysis} />
        <Route path="/__devtools__/Setting" component={Setting} />
        <Route path="/__devtools__/Components" component={Components} />
        <Route path="/__devtools__/Documentations" component={Document} />
        <Route path="/__devtools__/Assets" component={Assets} />
        <Route path="/__devtools__/Npm" component={Npm} />
        <Route path="/__devtools__/Inspect" component={Inspect} />
        <Route path="/__devtools__/Graph" component={Graph} />
      </div>
    </div>
  </main>
</Router>
