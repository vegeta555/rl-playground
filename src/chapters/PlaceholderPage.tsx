import { Link, useParams } from 'react-router-dom'
import { CHAPTERS, ELEMENT_COLOR } from '../app/Layout'

/** M0 占位页：各章节上线前先展示建设状态 */
export function PlaceholderPage() {
  const { chapterId } = useParams()
  const chapter = CHAPTERS.find((c) => c.id === chapterId)

  return (
    <div className="mx-auto max-w-xl rounded-lg border border-gold/50 bg-parchment-card p-10 text-center">
      {chapter ? (
        <>
          <span
            className="mx-auto mb-4 block h-3 w-3 rounded-full"
            style={{ backgroundColor: ELEMENT_COLOR[chapter.element] }}
          />
          <h1 className="font-serif text-2xl font-bold text-inktext">
            {String(chapter.index).padStart(2, '0')} · {chapter.title}
          </h1>
          <p className="mt-2 text-sm text-subtext">{chapter.tagline}</p>
          <p className="mt-6 inline-block rounded border border-gold/60 px-3 py-1 text-xs text-gold-deep">
            本章计划于 {chapter.milestone} 里程碑上线 · 建设中
          </p>
        </>
      ) : (
        <p className="text-sm text-subtext">页面不存在或尚未开放。</p>
      )}
      <div className="mt-8">
        <Link to="/" className="text-sm text-gold-deep underline underline-offset-4 hover:text-ink">
          返回首页
        </Link>
      </div>
    </div>
  )
}
