// 虚拟模块。这是客户端的根组件
import App from 'virtual:svelte-devtools-path:devtools-container.svelte';
import { CLIENT_CONTAINER_ID } from '@ikun-svelte-devtools/shared';
// 挂载客户端，这段代码会被发送到浏览器中并执行
export function load() {
	const hook = (window.__SVELTE_DEVTOOLS_GLOBAL_HOOK__ ??= {
		events: new Map(),
		on(event, fn) {
			if (!this.events.has(event)) this.events.set(event, []);

			this.events.get(event).push(fn);
		},
		emit(event, ...payload) {
			if (this.events.has(event)) this.events.get(event).forEach((fn) => fn(...payload));
		}
	});

	const CONTAINER_ID = CLIENT_CONTAINER_ID;
	const el = document.createElement('div');
	el.setAttribute('id', CONTAINER_ID);
	el.setAttribute('data-sv-inspector-ignore', 'true');
	document.getElementsByTagName('body')[0].appendChild(el);

	// eslint-disable-next-line no-new
	new App({
		target: el,
		props: {
			hook
		}
	});
}
