import { runTask } from './utils.js';

runTask('pnpm run dev', 'packages/shared', 'dev').finally(() => {
    runTask('pnpm run dev', 'packages/utils/client', 'dev').finally(() => {
        runTask('pnpm run dev', 'packages/utils/server', 'dev').finally(() => {
            runTask('pnpm run build', 'packages/icons', 'dev').finally(() => {
                runTask('pnpm run dev', 'packages/server', 'dev').finally(() => {
                });
            });
        });
    });
});
