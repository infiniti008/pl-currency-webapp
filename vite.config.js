import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'

// https://vitejs.dev/config/
export default defineConfig({
  clearScreen: false,
  css: {
    preprocessorOptions: {
      scss: {
        // additionalData: `@import "src/style.scss";`,
        charset: false,
      },
    },
  },
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    port: 3301,
    strictPort: true,
    https: true,
    hmr: true,
  },
})
