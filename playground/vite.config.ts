import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import svelteDevtools from '@ikun-svelte-devtools/server';
import Inspect from 'vite-plugin-inspect';
export default defineConfig({
	plugins: [
		// ssr
		svelteDevtools({
			sveltekit: sveltekit()
		}),
		Inspect()
	],
	server: {
		port: 5174
	}
});
