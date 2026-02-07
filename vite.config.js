import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repoBase = '/forgotten-flavors/'

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? repoBase : '/',
})
