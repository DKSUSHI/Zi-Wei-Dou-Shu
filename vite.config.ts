import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    base: './', // Crucial for GitHub Pages relative paths
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      // Polyfill process.env for libraries that expect it
      'process.env': {
        NODE_ENV: JSON.stringify(mode),
        API_KEY: JSON.stringify(env.API_KEY)
      }
    }
  }
})