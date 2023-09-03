import { runTask } from './utils.js';

runTask('pnpm run build', 'packages/shared', 'build').finally(() => {
	runTask('pnpm run build', 'packages/utils/client', 'build').finally(() => {
		runTask('pnpm run build', 'packages/utils/server', 'build').finally(() => {
			runTask('pnpm run build', 'packages/icons', 'build').finally(() => {
				runTask('pnpm run build', 'packages/server', 'build').finally(() => {

				});
			});
		});
	});
});

