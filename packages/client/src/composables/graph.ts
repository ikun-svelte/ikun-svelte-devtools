import { localCache } from '@baiwusanyu/utils-com';
import { extend } from '@baiwusanyu/utils-obj';
import { svelteGraphConfig } from '@ikun-svelte-devtools/shared';
import { rpc } from './rpc';
import type { Options } from 'vis-network';
import type { ModuleInfo } from '@ikun-svelte-devtools/shared';
import Fuse from 'fuse.js';
export interface IGC {
	open: boolean;
	value?: string | 'custom' | 'absolute' | 'root';
	disabled: boolean;
}

export interface IGraphConfig {
	level: IGC & { levelCustom?: string };
	openEditor: IGC;
	highlight: IGC;
	globPattern: IGC;
	search?: string;
	includeNodeModules?: boolean;
	includeVirtual?: boolean;
	globPatternValue?: string;
}

export const graphDefaultConfig: IGraphConfig = {
	level: {
		open: true,
		value: 'root',
		disabled: false,
		levelCustom: '3'
	},
	openEditor: {
		open: false,
		disabled: false
	},
	highlight: {
		open: false,
		disabled: false
	},
	// TODO Glob pattern
	globPattern: {
		open: false,
		disabled: true
	},
	includeVirtual: false,
	includeNodeModules: false
};

export const getGraphConfigCache = () => localCache.getJSON(svelteGraphConfig);

export const setGraphConfigCache = (config: IGraphConfig) =>
	localCache.setJSON(svelteGraphConfig, config);

export const getGraphConfig = () => extend(graphDefaultConfig, getGraphConfigCache());

export const getGraphData = async () => {
	return await rpc.componentGraph();
};

function getDepsByExactId(data: ModuleInfo[], searchId: string) {
	const result = new Set<ModuleInfo>();
	const queue: string[] = [];
	const idToDepsMap: Record<string, string[]> = {};

	// get id to deps map
	data.forEach((item) => {
		if (item.deps.length > 0) idToDepsMap[item.id] = item.deps;
	});

	// find referenced ids
	data.forEach((item) => {
		if (item.id === searchId || (item.id in idToDepsMap && item.deps.includes(searchId))) {
			queue.push(item.id);
			result.add(item);
		}
	});

	while (queue.length > 0) {
		const currentId = queue.shift()!;
		const referencedIds = idToDepsMap[currentId];

		if (referencedIds) {
			referencedIds.forEach((referencedId) => {
				const item = data.find((item) => item.id === referencedId)!;
				if (!result.has(item)) {
					queue.push(referencedId);
					result.add(item);
				}
			});
		}
	}

	return Array.from(result);
}

function uniqById(data: ModuleInfo[]) {
	const uniqueSet = new Set<string>();
	const uniqueArray: ModuleInfo[] = [];

	for (const item of data) {
		if (!item) continue;

		if (!uniqueSet.has(item.id)) {
			uniqueSet.add(item.id);
			uniqueArray.push(item);
		}
	}

	return uniqueArray;
}

function fuzzySearchDeps(data: ModuleInfo[], id: string) {
	const fuzzySearcher = new Fuse(data, {
		ignoreLocation: true,
		keys: ['id'],
		shouldSort: true,
		threshold: 0.1
	});
	const result = fuzzySearcher.search(id).map((i) => i.item);
	if (!result) {
		return {
			main: [],
			allWithDeps: []
		};
	}
	return {
		main: result,
		allWithDeps: uniqById(result.flatMap((item) => getDepsByExactId(data, item.id)))
	};
}

export const initGraphData = (search: string, data: ModuleInfo[]) => {
	const config = getGraphConfig();
	let finalData = data;

	if (!config.includeVirtual) {
		finalData = finalData.filter((item) => !item.virtual);
	}

	if (!config.includeNodeModules) {
		finalData = finalData.filter((item) => !item.id.includes('/node_modules/'));
	}

	if (!search) {
		return {
			main: [],
			data: finalData
		};
	} else {
		// handle the data by search value
		const { main, allWithDeps } = fuzzySearchDeps(finalData, search.trim());
		return {
			main,
			data: allWithDeps
		};
	}
};

export function getHoverPath(
	level: 'custom' | 'absolute' | 'root',
	fullPath: string,
	rootPath: string,
	levelCustom: number
) {
	switch (level) {
		case 'absolute':
			return fullPath;
		case 'custom':
			return fullPath.split('/').slice(-levelCustom).join('/');
		case 'root':
		default:
			return fullPath.replace(rootPath, '');
	}
}

export const visNetworkOptions: Options = {
	nodes: {
		shape: 'dot',
		size: 16
	},
	interaction: {
		hover: true
	},
	physics: {
		maxVelocity: 146,
		solver: 'forceAtlas2Based',
		timestep: 0.35,
		stabilization: {
			enabled: true,
			iterations: 200
		}
	},
	groups: {
		ts: {
			color: '#41b1e0'
		},
		js: {
			color: '#d6cb2d'
		},
		json: {
			color: '#cf8f30'
		},
		css: {
			color: '#e6659a'
		},
		html: {
			color: '#e34c26'
		},
		svelte: {
			color: '#ff3e00'
		},
		jsx: {
			color: '#7d6fe8'
		},
		tsx: {
			color: '#42b883'
		}
	}
};
