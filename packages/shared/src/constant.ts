export const NAME = 'vite-plugin-svelte-devtools';
// virtual modules
export const V_OPTIONS = 'virtual:svelte-devtools-options';
export const V_PATH = 'virtual:svelte-devtools-path';
export const V_PATH_APP_LOAD_KIT = `${V_PATH}:app-load-kit.js`;
// dev tools hooks
export const DevToolsHooks = {
	APP_INIT: 'app:init',
	SHOW_EYE_DROPPER: 'show:eye:dropper',
	SHOW_TAB: 'show:tab',
	HREF_CHANGE: 'href:change',
	CLICK_OUTSIDE_CHANGE: 'click:outside',
	DARK_CHANGE: 'dark:change',
	SHOW_INSPECTOR: 'show:inspector'
};
export const DevToolsInjectAppHooks = {
	APP_GOTO: 'svelte:devtools:goto'
};
// client frame id
export const CLIENT_FRAME_ID = '__svelte_devtools_iframe__';
// client container id
export const CLIENT_CONTAINER_ID = '__svelte-devtools-container__';

export const outerLinks = {
	svelte: 'https://svelte.dev/',
	svelteKit: 'https://kit.svelte.dev/',
	secureContext: 'https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts',
	browserCompatibility:
		'https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper#browser_compatibility'
};

export const svelteConfig = '__svelte_config';
export const svelteGraphConfig = '__svelte_graph_config';
export const documentDetail = [
	{
		id: 'svelte',
		name: 'svelte.js',
		description: 'Cybernetically enhanced web apps',
		website: outerLinks.svelte,
		github: 'https://github.com/sveltejs/svelte',
		icon: 'Logo'
	},
	{
		id: 'svelte-kit',
		name: 'svelte kit',
		description: 'The official application framework from the Svelte team',
		website: outerLinks.svelteKit,
		github: 'https://github.com/sveltejs/kit',
		icon: 'Logo'
	},
	{
		id: 'query',
		name: 'query',
		description:
			'Powerful asynchronous state management, server-state utilities and data fetching for the web.',
		website: 'https://tanstack.com/query/latest',
		github: 'https://github.com/tanstack/query',
		icon: 'CarbonQuery'
	},
	{
		id: 'ikun-ui',
		name: 'ikun-ui',
		description: '🐔A Svelte.js based UnoCSS UI library that allows you to make websites',
		website: 'https://ikun-ui.netlify.app/',
		github: 'https://github.com/ikun-svelte/ikun-ui',
		icon: 'CarbonCarbon'
	}
];
