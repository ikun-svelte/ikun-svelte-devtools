import App from './App.svelte';
import 'virtual:uno.css';
import './assets/main.css';
import { createSvelteToolsClient } from './composables/init';
import '@unocss/reset/tailwind.css';
import 'uno.css';
createSvelteToolsClient();
const app = new App({
	target: document.getElementById('app')!
});

(
	window.parent as Window & { __SVELTE_DEVTOOLS_GLOBAL_HOOK__: any }
).__SVELTE_DEVTOOLS_GLOBAL_HOOK__.emit('app:init');
export default app;
