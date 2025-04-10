import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: ['9fcf-103-42-196-60.ngrok-free.app'], // <- Add your domain here
  },
})
