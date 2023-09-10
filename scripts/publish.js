import { runTask } from './utils.js';

(async () => {
	await runTask('pnpm run publish:npm', 'packages', 'publish');
})();
