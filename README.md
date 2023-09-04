<p align="center">
  <img src="https://ikun-ui.netlify.app/logo.svg" width="180" height="180"/>
</p>
<h1 align="center">
ikun-svelte-devtools
</h1>
<p align="center">
🍨 A vite plugin that improves the svelte development experience
</p>


## Features

![overview.png](public%2Foverview.png)

### page

In the pages module, you can quickly understand which pages the project contains  

![page.png](public%2Fpage.png)

### Routes
In the Routes module, you can quickly understand the routing information of the project  

![router.png](public%2Frouter.png)

### Assets
In the Assets module, you can quickly understand the static resources of the project, including pictures, fonts, etc.  

![assets.png](public%2Fassets.png)

### Search Packages
In the Search Packages module you can search for dependencies and install or uninstall them  

![search-package.png](public%2Fsearch-package.png)

### Inspect
In the Inspect module you can view the compiled code, It comes from `vite-plugin-inspect` support.  

![inpect.png](public%2Finpect.png)

### Graph
In the Graph module, you can quickly understand the reference relationship between js and sfc through visualization  

![graph.png](public%2Fgraph.png)

### Inspector
In the Inspector module, you can click on an element on the page to open the corresponding source code in the IDE.  
It comes from `svelte-kit-inspector` support.


### EyeDropper
EyeDropper module can open a color picker

## Install

```bash
npm i @ikun-svelte-devtools/server -D
```
Or
```bash
yarn add @ikun-svelte-devtools/server -D
```
Or
```bash
pnpm add @ikun-svelte-devtools/server -D
```

## Usage
```ts
// vite.config.ts
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import svelteDevtools from '@ikun-svelte-devtools/server';
export default defineConfig({
  plugins: [
    svelteDevtools({
      sveltekit: sveltekit()
    }),
  ],
});

```
## Thanks

- [svelte](https://github.com/sveltejs/svelte)
- [unocss](https://github.com/nuxt/devtools)
- [vite-plugin-vue-devtools](https://github.com/webfansplz/vite-plugin-vue-devtools)
