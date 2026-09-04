import { NavLink, Outlet } from 'react-router-dom'

/** 课程章节数据——单一来源，首页大纲与导航都从这里取（M1 起挂接真实路由） */
export interface ChapterMeta {
  id: string
  index: number
  title: string
  tagline: string
  milestone: string
  /** 元素身份色，取设计 tokens 的七元素色板 */
  element: 'pyro' | 'hydro' | 'anemo' | 'electro' | 'dendro' | 'geo' | 'cryo'
}

export const CHAPTERS: ChapterMeta[] = [
  { id: '00-intro', index: 0, title: '导论：什么是强化学习', tagline: '智能体、环境与奖励循环', milestone: 'M1', element: 'anemo' },
  { id: '01-bandit', index: 1, title: '多臂老虎机', tagline: '探索与利用的平衡术', milestone: 'M2', element: 'pyro' },
  { id: '02-mdp', index: 2, title: '马尔可夫决策过程', tagline: '用数学语言描述决策', milestone: 'M2', element: 'hydro' },
  { id: '03-dp', index: 3, title: '动态规划', tagline: '已知世界的完美求解', milestone: 'M2', element: 'cryo' },
  { id: '04-mc-td', index: 4, title: '蒙特卡洛与时间差分', tagline: '从经验中学习价值', milestone: 'M2', element: 'dendro' },
  { id: '05-q-learning', index: 5, title: 'Q-Learning 与 SARSA', tagline: '表格型方法的巅峰对决', milestone: 'M2', element: 'geo' },
  { id: '06-dqn', index: 6, title: '深度 Q 网络', tagline: '当神经网络遇上 Q 学习', milestone: 'M3', element: 'electro' },
  { id: '07-policy-gradient', index: 7, title: '策略梯度与 REINFORCE', tagline: '直接优化策略', milestone: 'M4', element: 'pyro' },
  { id: '08-ppo', index: 8, title: 'Actor-Critic 与 PPO', tagline: '稳定训练的艺术', milestone: 'M4', element: 'hydro' },
]

/** 已上线的章节（首页标记 + 章节导航用） */
export const LIVE_CHAPTERS = new Set(['00-intro'])

export const ELEMENT_COLOR: Record<ChapterMeta['element'], string> = {
  pyro: 'var(--color-pyro)',
  hydro: 'var(--color-hydro)',
  anemo: 'var(--color-anemo)',
  electro: 'var(--color-electro)',
  dendro: 'var(--color-dendro)',
  geo: 'var(--color-geo)',
  cryo: 'var(--color-cryo)',
}

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-gold/60 bg-ink text-parchment shadow-md">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-3">
          <NavLink to="/" className="flex items-center gap-3">
            <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden>
              <path d="M16 4 L26 16 L16 28 L6 16 Z" fill="var(--color-gold-bright)" />
              <circle cx="16" cy="16" r="2.4" fill="var(--color-ink)" />
            </svg>
            <span>
              <span className="block font-serif text-lg font-bold tracking-wide">RL Playground</span>
              <span className="block text-xs text-gold">强化学习可视化教室</span>
            </span>
          </NavLink>
          <nav className="ml-auto flex items-center gap-5 text-sm">
            <NavLink to="/" className="transition-colors hover:text-gold-bright">
              首页
            </NavLink>
            <a href="#outline" className="transition-colors hover:text-gold-bright">
              课程大纲
            </a>
          </nav>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-gold/40 bg-parchment-card py-4 text-center text-xs text-subtext">
        RL Playground · 强化学习可视化教室 — 算法即教材，可视化即直觉
      </footer>
    </div>
  )
}
