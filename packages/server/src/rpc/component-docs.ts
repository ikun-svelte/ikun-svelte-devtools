import fg from 'fast-glob'
export async function getSFCList(
    root: string,
    target: string[] = [ '**/*.svelte' ],
    ignore: string[] = ['**/node_modules/**', '**/dist/**']) {
    const files = await fg(target, {
        cwd: root,
        onlyFiles: true,
        ignore,
    })
    return files
}
