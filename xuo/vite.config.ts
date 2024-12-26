import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/configs
export default defineConfig({
  plugins: [react()],
})
