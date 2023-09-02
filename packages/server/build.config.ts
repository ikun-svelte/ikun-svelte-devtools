import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
	entries: ['src/plugin/index'],
	clean: false,
	declaration: true,
	rollup: {
		emitCJS: true,
		inlineDependencies: true
	}
});
