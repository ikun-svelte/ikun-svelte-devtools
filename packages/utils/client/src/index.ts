export * from './babble-interact';
export * from './click-outside';
export * from './modal-interact';
export * from './config';
export function isMacOS() {
	return navigator?.platform
		? navigator?.platform.toLowerCase().includes('mac')
		: /Macintosh/.test(navigator.userAgent);
}
export function darkLight() {
	const prefersDark =
		window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
	const setting = localStorage.getItem('color-schema') || 'auto';
	let dark = 'light';
	if (setting === 'dark' || (prefersDark && setting !== 'light')) dark = 'dark';

	return dark;
}

export function toggleDark(dark = 'auto') {
	localStorage.setItem('color-schema', dark);
	document.documentElement.classList.toggle('dark', dark === 'dark');
	document.documentElement.classList.toggle('light', dark === 'light');
}
