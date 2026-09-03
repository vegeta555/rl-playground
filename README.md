# RL Playground · 强化学习可视化教室

用看得见的算法和玩得起来的实验场理解强化学习。纯前端实现，RL 算法以 TypeScript 编写并在浏览器内运行。

## 技术栈

React 19 · TypeScript · Vite · Tailwind CSS v4 · MDX（规划）· KaTeX · Vitest · 自研 rl-core 算法库

## 本地开发

```bash
npm install        # 安装依赖（依赖锁在 package-lock.json，等价于"虚拟环境"）
npm run dev        # 开发服务器：http://localhost:5173/rl-playground/
npm run test       # Vitest 监听模式
npm run test:ci    # 单次运行全部测试
npm run lint       # ESLint
npm run build      # 类型检查 + 产线构建到 dist/
npm run preview    # 本地预览构建产物
```

> 注意：站点部署在 GitHub Pages 项目页子路径下，`vite.config.ts` 中 `base: '/rl-playground/'`，
> 因此本地访问地址是 `http://localhost:5173/rl-playground/`（不带后缀会 404）。

## 仓库结构

见 [docs/WORKPLAN.md](docs/WORKPLAN.md)（项目唯一事实来源：内容规划、技术方案、里程碑）。

- `src/rl-core/` — 纯 TS 算法库（环境 / 算法 / 微型神经网络 / 种子随机数），零 UI 依赖
- `src/app/` — 布局、路由、课程数据
- `src/chapters/` — 各章节页面
- `src/components/` — 通用交互组件（里程碑 M1 起填充）

## 部署

推送到 `main` 分支后，GitHub Actions（`.github/workflows/deploy.yml`）自动执行：lint → test → build → 发布到 GitHub Pages。
首次启用需在仓库 Settings → Pages 中把 Source 设为 **GitHub Actions**。
