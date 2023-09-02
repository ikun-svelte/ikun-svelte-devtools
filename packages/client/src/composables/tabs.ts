import type { BuiltinTab } from '@ikun-svelte-devtools/shared';
import { DevToolsHooks } from '@ikun-svelte-devtools/shared';
import { getConfig } from '../../../utils/client/src/config';

export function useCategorizedTabs() {
	const builtinTabs: BuiltinTab[] = [
		{
			path: '/__devtools__/Overview',
			title: 'Overview',
			icon: 'i-carbon-information',
			category: 'App',
			hide: false,
			disable: false
		},
		{
			path: '/__devtools__/PagesAnalysis',
			title: 'Pages',
			icon: 'i-carbon-tree-view-alt',
			category: 'App',
			hide: false,
			disable: false
		},
		{
			path: '/__devtools__/Components',
			title: 'Components',
			icon: 'i-carbon-assembly-cluster',
			category: 'App',
			hide: false,
			disable: true
		},
		{
			path: '/__devtools__/Assets',
			title: 'Assets',
			icon: 'i-carbon-image-copy',
			category: 'App',
			hide: false,
			disable: false
		},
		{
			path: '/__devtools__/timeline',
			title: 'Timeline',
			icon: 'i-carbon-ibm-process-mining',
			category: 'App',
			hide: false,
			disable: true
		},
		{
			path: '/__devtools__/RouteAnalysis',
			title: 'Routes',
			icon: 'i-carbon-z-lpar',
			category: 'Modules',
			hide: false,
			disable: false
		},
		{
			path: '/__devtools__/Store',
			title: 'Store',
			icon: 'i-carbon-cube',
			category: 'Modules',
			hide: false,
			disable: true
		},
		{
			title: 'Inspector',
			icon: 'i-carbon-select-window',
			category: 'Advanced',
			hide: false,
			disable: false,
			evt: (hook) => {
				hook.emit(DevToolsHooks.SHOW_INSPECTOR, true);
			}
		},
		{
			title: 'EyeDropper',
			icon: 'i-carbon-center-circle',
			category: 'Advanced',
			hide: false,
			disable: false,
			evt: (hook) => {
				hook.emit(DevToolsHooks.SHOW_EYE_DROPPER, true);
			}
		},
		{
			path: '/__devtools__/component-docs',
			title: 'Component docs',
			icon: 'i-carbon-document-preliminary',
			category: 'Advanced',
			hide: false,
			disable: true
		},
		{
			path: '/__devtools__/Npm',
			title: 'Search packages',
			icon: 'i-carbon-logo-npm',
			category: 'Advanced',
			hide: false,
			disable: false
		},
		{
			path: '/__devtools__/Graph',
			title: 'Graph',
			icon: 'i-carbon-network-4',
			category: 'Advanced',
			hide: false,
			disable: false
		},
		{
			path: '/__devtools__/Inspect',
			title: 'Inspect',
			icon: 'i-carbon-ibm-watson-discovery',
			category: 'Advanced',
			hide: false,
			disable: false
		},
		{
			path: '/__devtools__/Documentations',
			title: 'Documentations',
			icon: 'i-carbon-document',
			category: 'Awd',
			hide: false,
			disable: false
		}
	];

	return setTabByConfig(builtinTabs);
}

function setTabByConfig(tabs: BuiltinTab[]) {
	const config = getConfig();
	return tabs.map((v, index) => {
		v.hide = config.tabsHide[index];
		return v;
	});
}
