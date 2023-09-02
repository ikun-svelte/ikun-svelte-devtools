import { defineConfig, type Plugin } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import Unocss from 'unocss/vite';
// https://vitejs.dev/config/
export default defineConfig({
	base: '/__devtools__/',
	plugins: [
		svelte(),
		Unocss(),
		{
			name: 'compatible:svelte:kit',
			post: 'pre',
			resolveId(id: string) {
				if (id === '$app/environment') return '\0$app/environment';
			},
			load(id: string) {
				if (id === '\0$app/environment') return 'export const browser = true';
			}
		} as Plugin
	],
	build: {
		target: 'esnext',
		minify: false, // 'esbuild',
		emptyOutDir: true,
		rollupOptions: {
			external: [/jiti/]
		}
	}
});
// TODO src
