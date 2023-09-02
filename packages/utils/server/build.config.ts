import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
	entries: ['src/index'],
	clean: false,
	declaration: true,
	external: ['unocss', 'fast-glob', 'vite', 'birpc', 'vite-hot-client'],
	rollup: {
		emitCJS: true,
		inlineDependencies: true
	}
});
