/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages 项目页部署在 /rl-playground/ 子路径下。
// 本地 dev/preview 也使用同一 base，保证与线上行为一致（访问 http://localhost:5173/rl-playground/）。
export default defineConfig({
  base: '/rl-playground/',
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
