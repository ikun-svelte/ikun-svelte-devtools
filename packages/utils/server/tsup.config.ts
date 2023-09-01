import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/index.ts'],
	clean: true,
	format: ['esm'],
	external: ['unocss', 'fast-glob', 'vite', 'birpc', 'vite-hot-client'],
	dts: true,
	minify: false
});
