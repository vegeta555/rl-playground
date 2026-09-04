import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { CHAPTERS, ELEMENT_COLOR } from '../app/Layout'

interface ChapterLayoutProps {
  chapterId: string
  children: ReactNode
}

/** 章节页外壳：彩色章节头、正文排版区、上一章/下一章导航 */
export function ChapterLayout({ chapterId, children }: ChapterLayoutProps) {
  const idx = CHAPTERS.findIndex((c) => c.id === chapterId)
  const meta = idx >= 0 ? CHAPTERS[idx] : undefined
  const prev = idx > 0 ? CHAPTERS[idx - 1] : undefined
  const next = idx >= 0 && idx < CHAPTERS.length - 1 ? CHAPTERS[idx + 1] : undefined

  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-8">
        {meta && (
          <>
            <div className="mb-3 flex items-center gap-2 text-xs tracking-wider text-subtext">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: ELEMENT_COLOR[meta.element] }}
              />
              第 {meta.index} 章 · CHAPTER {String(meta.index).padStart(2, '0')}
            </div>
            <h1 className="font-serif text-3xl font-bold text-inktext">{meta.title}</h1>
            <p className="mt-2 text-sm text-subtext">{meta.tagline}</p>
            <div className="mt-5 h-px bg-gradient-to-r from-gold via-gold/40 to-transparent" />
          </>
        )}
      </header>

      <article className="prose rl-prose max-w-none prose-headings:font-serif prose-headings:scroll-mt-24 prose-table:text-sm">
        {children}
      </article>

      <nav className="mt-12 flex gap-4 border-t border-gold/40 pt-6">
        {prev ? (
          <Link
            to={`/chapter/${prev.id}`}
            className="flex-1 rounded-lg border border-gold/40 bg-parchment-card p-4 transition-colors hover:border-gold"
          >
            <span className="text-xs text-subtext">← 上一章</span>
            <span className="mt-1 block font-serif text-sm font-bold text-inktext">{prev.title}</span>
          </Link>
        ) : (
          <span className="flex-1" />
        )}
        {next ? (
          <Link
            to={`/chapter/${next.id}`}
            className="flex-1 rounded-lg border border-gold/40 bg-parchment-card p-4 text-right transition-colors hover:border-gold"
          >
            <span className="text-xs text-subtext">下一章 →</span>
            <span className="mt-1 block font-serif text-sm font-bold text-inktext">{next.title}</span>
          </Link>
        ) : (
          <span className="flex-1" />
        )}
      </nav>
    </div>
  )
}
