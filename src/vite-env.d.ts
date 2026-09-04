/// <reference types="vite/client" />

declare module '*.mdx' {
  import type { ComponentType } from 'react'
  /** MDX 编译产物：默认导出为 React 组件，文章内 import 的交互组件通过 props.components 不需要——我们直接在文内 import */
  const MDXContent: ComponentType<Record<string, unknown>>
  export default MDXContent
}
