import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { normalizePath, type PluginOption, type ResolvedConfig, type ViteDevServer } from 'vite';
import sirv from 'sirv';
import Inspect from 'vite-plugin-inspect';
import svelteKitInspector from 'svelte-kit-inspector';
import skRouterGuard from 'vite-plugin-sk-router-guard';
import { parseRoute, createRPCServer } from '@ikun-svelte-devtools/utils-server';
import { injectGotoContent, injectGotoImport } from '@ikun-svelte-devtools/utils-server';
import { DIR_CLIENT } from '@ikun-svelte-devtools/client';
import type { RPCFunctions, ExecNpmScriptOptions } from '@ikun-svelte-devtools/shared';
import {
	getPackages,
	getSFCList,
	getStaticAssets,
	getTextAssetContent,
	getImageMeta,
	execNpmScript,
	getComponentsRelationships
} from '../rpc';
import { NAME, V_PATH, V_OPTIONS, V_PATH_APP_LOAD_KIT } from '@ikun-svelte-devtools/shared';
function getSvelteDevtoolsPath() {
	const pluginPath = normalizePath(path.dirname(fileURLToPath(import.meta.url)));
	return pluginPath.replace(/\/dist$/, '/src/app');
}

export interface VitePluginSvelteDevToolsOptions {
	/**
	 * route root path
	 */
	route?: string;
	/**
	 * sveltekit plugin
	 */
	sveltekit: any;
}

export default function VitePluginSvelteDevTools(
	options: VitePluginSvelteDevToolsOptions
): PluginOption {
	const { sveltekit } = options;
	const svelteDevtoolsPath = getSvelteDevtoolsPath();
	const inspect = Inspect({
		silent: true
	});
	let config: ResolvedConfig;
	// svelte-kit server fs allow list
	let allowList: string[] = [];

	// 基于 vite 的server 自定义服务
	function configureServer(server: ViteDevServer) {
		const base = server.config.base || '/';
		// 基于文件系统解析 route
		const route = parseRoute(options.route);
		// 创建一个中间件，插件客户端的请求，例如一些分析数据，都会在这个中间件处理
		server.middlewares.use(
			`${base}__devtools__`,
			sirv(DIR_CLIENT, {
				single: true,
				dev: true
			})
		);

		// 创建一个通信服务，用于与客户端通信
		const rpc = createRPCServer<RPCFunctions>(NAME, server.ws, {
			// 获得路由信息，返回给 client
			getRoutesInfo: () => {
				return route;
			},
			// get svelte-kit server fs allow list
			getAllowList: () => {
				return allowList;
			},
			// 获得组件关系
			componentGraph: () => getComponentsRelationships(inspect.api.rpc),
			inspectClientUrl: () => {
				return `${config.base || '/'}__inspect/`;
			},
			// 获取项目静态资源
			staticAssets: () => getStaticAssets(config),
			// 根据文件路径获取图片元信息宽、高、尺寸等
			getImageMeta,
			// 根据文件路径获取文本类静态资源的缩略内容
			getTextAssetContent,
			// 获取项目包依赖信息
			getPackages: async () => {
				const res = await getPackages(config.root);
				// 一个包含了项目依赖的对象，有名称，版本、是否时dev依赖
				return res;
			},
			// 获取SFC列表, 包含项目所有 sfc 文件的相对路径
			getSvelteSFCList: async () => {
				const res = await getSFCList(config.root);
				// 包含项目所有 sfc 文件的相对路径
				return res;
			},
			// 获取组件信息 根据文件名获取组件内容并解析，component docs 用到
			// getComponentInfo: async (filename: string) => {
			//   // 组件解析内容，包含组件的名称，各种 option 等。。。
			//   const res = await getComponentInfo(config.root, filename)
			//   return res
			// },
			// 安装项目依赖
			installPackage: (packages: string[], options: ExecNpmScriptOptions = {}) => {
				execNpmScript(packages, {
					...options,
					type: 'install',
					cwd: config.root,
					callback: (type: string, data: string) => {
						if (type === 'data') rpc.onTerminalData({ data });
						else if (type === 'exit') rpc.onTerminalExit({ data });
					}
				});
			},
			// 卸载项目依赖
			uninstallPackage: (packages: string[], options: ExecNpmScriptOptions = {}) => {
				execNpmScript(packages, {
					...options,
					type: 'uninstall',
					cwd: config.root,
					callback: (type: string, data: string) => {
						if (type === 'data') rpc.onTerminalData({ data });
						else if (type === 'exit') rpc.onTerminalExit({ data });
					}
				});
			},
			root: () => {
				return config.root;
			}
		});
	}

	let env = 'development';

	const plugin = <PluginOption>{
		name: NAME,
		enforce: 'pre',
		apply: 'serve',
		config(_, { mode }) {
			env = mode;
		},
		configResolved(resolvedConfig) {
			config = resolvedConfig;
			allowList = config.server.fs.allow;
		},

		configureServer(server) {
			configureServer(server);
		},
		// 生成虚拟模块 id
		async resolveId(importee: string) {
			if (importee.startsWith(V_OPTIONS)) {
				return importee;
			}

			// replace virtual module path
			else if (importee.startsWith(`${V_PATH}:`)) {
				const resolved = importee.replace(`${V_PATH}:`, `${svelteDevtoolsPath}/`);
				return resolved;
			}
		},
		// return virtual module code
		async load(id) {
			if (id === V_OPTIONS) return `export default ${JSON.stringify({ base: config.base })}`;
		}
	};

	const pluginInject = <PluginOption>{
		name: `${NAME}:inject`,
		enforce: 'pre',
		apply: 'serve',
		transform(code, id) {
			if (env === 'development' && id.includes('root.svelte')) {
				// inject virtual module `import 'virtual:svelte-devtools-path:app-load-kit.js'`
				code = code.replaceAll('<script>', `<script>\nimport '${V_PATH_APP_LOAD_KIT}'`);
				// inject goto hook
				code = code.replaceAll('<script>', `<script>\n${injectGotoImport}`);
				code = code.replaceAll('</script>', `${injectGotoContent}\n</script>`);
				return {
					code
				};
			}
		}
	};
	const hookPath = svelteDevtoolsPath.replace('app', 'guard');
	return [
		skRouterGuard({
			hookPath: `${hookPath}/router-guard.skrg.ts`
		}),
		svelteKitInspector({
			toggleButtonVisibility: 'never',
			toggleComboKey: false,
			enabled: false,
			kit: true
		}),
		pluginInject,
		sveltekit,
		plugin,
		inspect
	];
}
