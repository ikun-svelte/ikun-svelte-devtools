import path from 'node:path';
import fg from 'fast-glob';
import type { routeInfo } from '@ikun-svelte-devtools/shared';
export function parseRoute(root?: string) {
	let routeRoot = 'src/routes';
	if (root) routeRoot = root;

	const sfcPath = getAllSFCPath(['**/+page**.svelte'], path.resolve(routeRoot));
	// console.log(sfcPath)
	// const sfcPath = [
	//   '+page.svelte',
	//   'about/[slug]/[slug2]/+page.svelte',
	//   'about/[slug]/[slug2]/[...rest]/+page.svelte',
	//   'about/[slug]/[[slug2]]/[...rest]/+page.svelte',
	//   'about/[slug=checker]/[slug2]/[...rest]/+page.svelte',
	// ]
	const routeInfoRes: routeInfo[] = [];

	for (let i = 0; i < sfcPath.length; i++) {
		// root route
		if (sfcPath[i] === '+page.svelte') {
			routeInfoRes.push({
				routePath: '/',
				filePath: `${routeRoot}`
			});
			continue;
		}
		if (sfcPath[i].includes('/')) {
			const pathNode = sfcPath[i].split('/');
			const routeInfoItem: routeInfo = {
				filePath: `${routeRoot}/${sfcPath[i]}`,
				routePath: '',
				params: []
			};

			pathNode.forEach((p) => {
				const param = p.match(/^\[(.*?)\]$/);
				if (param) {
					const paramOptional = param[1].match(/^\[(.*?)\]$/);
					// Optional param route
					if (paramOptional) {
						routeInfoItem.params &&
							routeInfoItem.params.push({
								optional: true,
								reset: false,
								name: paramOptional[1]
							});
					} else {
						const paramReset = param[1].match(/^\.\.\.(.*?)$/);
						const paramMatcher = param[1].match(/^(.*?)=(.*?)$/);

						// Reset param route
						if (paramReset) {
							routeInfoItem.params &&
								routeInfoItem.params.push({
									optional: false,
									reset: true,
									name: paramReset[1]
								});
						} else if (paramMatcher) {
							routeInfoItem.params &&
								routeInfoItem.params.push({
									optional: false,
									reset: false,
									name: paramMatcher[1],
									matcher: paramMatcher[2]
								});
						} else {
							routeInfoItem.params &&
								routeInfoItem.params.push({
									optional: false,
									reset: false,
									name: param[1]
								});
						}
					}
				} else {
					routeInfoItem.routePath = `${routeInfoItem.routePath}/${p.includes('+page') ? '' : p}`;
				}
			});
			routeInfoRes.push(routeInfoItem);
		}
	}
	// 常规     about/
	// 参数     about/[slug]/[slug2]
	// 剩余参数  about/[slug]/[slug2]/[...rest]
	// 可选参数  about/[slug]/[[slug2]]/[...rest]
	// 匹配器    about/[slug=checker]/[slug2]/[...rest]
	return routeInfoRes;
}

export function getAllSFCPath(includeCompile: string[], rootDir: string) {
	return fg.sync(includeCompile, {
		cwd: rootDir
	});
}
