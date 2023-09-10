import { runTask } from './utils.js';

(async () => {
	await runTask('pnpm run build', 'packages/shared', 'build');
	await runTask('pnpm run build', 'packages/utils/client', 'build');
	await runTask('pnpm run build', 'packages/utils/server', 'build');
	await runTask('pnpm run build', 'packages/icons', 'build');
	await runTask('pnpm run build', 'packages/server', 'build');
	await runTask('pnpm run build', 'packages/client', 'build');
})();
