import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/plugin/index.ts'],
	clean: true,
	format: ['esm'],
	external: [
		'pathe',
		'vite',
		'vite-plugin-inspect',
		'@antfu/ni',
		'fast-glob',
		'image-meta',
		'vite-plugin-sk-router-guard',
		'svelte-kit-inspector',
		'sirv',
	],
	dts: true,
	minify: false
});
// TODO guard 、app
