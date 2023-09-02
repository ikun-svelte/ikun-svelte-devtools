/// <reference types="svelte" />
/// <reference types="vite/client" />

export {};
declare global {
	interface Window {
		__SVELTE_KIT_INSPECTOR__: any;
		__SVELTE_DEVTOOLS_VIEW__: any;
	}
}
