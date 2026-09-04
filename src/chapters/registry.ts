import { lazy } from 'react'
import type { ComponentType } from 'react'

/** 章节组件注册表：每章一个懒加载入口，未注册的章节走 PlaceholderPage */
const IntroChapter = lazy(() => import('./00-intro/ChapterPage'))

export const CHAPTER_COMPONENTS: Record<string, ComponentType> = {
  '00-intro': IntroChapter,
}
