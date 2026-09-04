import { Link } from 'react-router-dom'
import { CHAPTERS, ELEMENT_COLOR, LIVE_CHAPTERS } from './Layout'

export function HomePage() {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-lg border border-gold/60 bg-ink px-8 py-12 text-center text-parchment">
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            background:
              'radial-gradient(circle at 20% 30%, var(--color-gold) 0%, transparent 40%), radial-gradient(circle at 80% 70%, var(--color-gold-bright) 0%, transparent 40%)',
          }}
        />
        <h1 className="relative font-serif text-4xl font-bold tracking-wide">
          强化学习
          <span className="mx-3 text-gold-bright">·</span>
          可视化教室
        </h1>
        <p className="relative mt-4 text-sm text-parchment/85">
          看得见的算法，玩得起来的实验场。从多臂老虎机到 PPO，用直觉理解强化学习。
        </p>
        <Link
          to="/chapter/00-intro"
          className="relative mt-6 inline-block rounded border border-gold bg-transparent px-6 py-2 text-sm text-gold-bright transition-colors hover:bg-gold hover:text-ink"
        >
          从第 0 章开始学习
        </Link>
      </section>

      {/* 课程大纲 */}
      <section id="outline">
        <h2 className="mb-1 font-serif text-2xl font-bold text-inktext">课程大纲</h2>
        <p className="mb-5 text-sm text-subtext">共 9 章 · 每章配可交互实验场 · 分阶段上线</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CHAPTERS.map((ch) => (
            <Link
              key={ch.id}
              to={`/chapter/${ch.id}`}
              className="group rounded-lg border border-gold/50 bg-parchment-card p-5 transition-all hover:-translate-y-0.5 hover:border-gold hover:shadow-md"
            >
              <div className="mb-3 flex items-center justify-between">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: ELEMENT_COLOR[ch.element] }}
                />
                {LIVE_CHAPTERS.has(ch.id) ? (
                  <span className="rounded-sm border border-gold bg-gold-bright/30 px-1.5 py-0.5 text-[10px] tracking-wider text-inktext">
                    ★ 已上线
                  </span>
                ) : (
                  <span className="rounded-sm border border-gold/60 px-1.5 py-0.5 text-[10px] tracking-wider text-gold-deep">
                    {ch.milestone}
                  </span>
                )}
              </div>
              <h3 className="font-serif font-bold text-inktext group-hover:text-ink">
                {String(ch.index).padStart(2, '0')} · {ch.title}
              </h3>
              <p className="mt-1 text-xs text-subtext">{ch.tagline}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
