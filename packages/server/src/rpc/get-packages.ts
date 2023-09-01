import { promises as fsp } from 'node:fs'
import { resolve } from 'pathe'
import type { PackageMeta } from '@ikun-svelte-devtools/shared'

// 获取项目包依赖信息
export async function getPackages(root: string) {
    const pkgPath = resolve(root, 'package.json')
    const data = JSON.parse(await fsp.readFile(pkgPath, 'utf-8').catch(() => '{}'))
    const packages: Record<string, Omit<PackageMeta, 'name'>> = {}
    const depTypes = [
        'dependencies',
        'devDependencies',
        'optionalDependencies',
        'peerDependencies'
    ]
    for (const type of depTypes) {
        const dep = data[type]
        if (!dep)
            continue
        for (const depName in dep) {
            packages[depName] = {
                version: dep[depName],
                type,
            }
        }
    }

    return {
        packages,
    }
}
