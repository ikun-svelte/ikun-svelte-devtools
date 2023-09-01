import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import svelteDevtools from '../packages/server/dist/index.js'
import Inspect from 'vite-plugin-inspect'
export default defineConfig({
  plugins: [
    // ssr
    svelteDevtools({
      sveltekit: sveltekit(),
    }),
    Inspect(),
  ],
  server: {
    port: 5174,
  },
})
