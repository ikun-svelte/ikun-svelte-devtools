// @ts-ignore
import { browser } from '$app/environment';
export const navigate = {
	afterNavigate(
		// @ts-ignore
		navigation: import('@sveltejs/kit').AfterNavigate
	) {
		if (browser && navigation.to) {
			(
				window.parent as Window & { __SVELTE_DEVTOOLS_GLOBAL_HOOK__: any }
			)?.__SVELTE_DEVTOOLS_GLOBAL_HOOK__.emit(
				'__svelte-devtools:navigation',
				navigation.to.url.pathname
			);
		}
	}
};
