import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/RSAClientSide-ForPortfolio/', // 👈 this must match your repo name exactly
})
