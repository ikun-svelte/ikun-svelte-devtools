import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/index.ts'],
	clean: true,
	format: ['esm'],
	external: ['baiwusanyu-utils'],
	dts: true,
	minify: false
});
