import App from './App.svelte';
import 'virtual:uno.css';
import './assets/main.css';
import { createSvelteToolsClient } from './composables/init';
import '@unocss/reset/tailwind.css';
import 'uno.css';
createSvelteToolsClient();
const app = new App({
	target: document.getElementById('app')
});

export default app;
