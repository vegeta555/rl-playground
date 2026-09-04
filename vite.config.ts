/// <reference types="vitest/config" />
import { cpSync } from 'node:fs'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@mdx-js/rollup'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'

/**
 * GitHub Pages 的 SPA 兜底：未知路径（如 /chapter/00-intro 直达链接）会返回 404.html，
 * 把 index.html 复制为 404.html，前端路由即可接管深层链接。
 */
function spaFallback404(): Plugin {
  return {
    name: 'spa-fallback-404',
    closeBundle() {
      cpSync('dist/index.html', 'dist/404.html')
    },
  }
}

// GitHub Pages 项目页部署在 /rl-playground/ 子路径下。
// 本地 dev/preview 也使用同一 base，保证与线上行为一致（访问 http://localhost:5173/rl-playground/）。
export default defineConfig({
  base: '/rl-playground/',
  // MDX 必须先于 React 插件处理 .mdx 文件
  plugins: [
    { enforce: 'pre', ...mdx({ remarkPlugins: [remarkMath, remarkGfm], rehypePlugins: [rehypeKatex] }) },
    react(),
    tailwindcss(),
    spaFallback404(),
  ],
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
