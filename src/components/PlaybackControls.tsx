import type { ReactNode } from 'react'

export interface PlaybackControlsProps {
  playing: boolean
  onTogglePlay: () => void
  /** 单步执行一次（不提供则隐藏按钮） */
  onStep?: () => void
  onReset: () => void
  speed: number
  onSpeedChange: (speed: number) => void
  speedOptions?: readonly number[]
  /** 提供则显示随机种子输入框（实验可复现的关键） */
  seed?: number
  onSeedChange?: (seed: number) => void
  /** 播放/单步是否禁用（如回合结束后） */
  disabled?: boolean
  /** 插槽：组件自定义控制区（如手动模式的方向按钮） */
  children?: ReactNode
}

const DEFAULT_SPEEDS = [0.5, 1, 2, 5] as const

const btn =
  'rounded border border-ink-soft/40 bg-ink px-3 py-1.5 text-xs text-parchment transition-colors hover:bg-ink-soft disabled:cursor-not-allowed disabled:opacity-40'
const chip =
  'rounded border border-gold/60 bg-transparent px-1.5 py-1 text-[10px] tracking-wider text-gold-deep'

/**
 * PlaybackControls —— 全站统一的演示操控条。
 * 播放/暂停、单步、重置、速度、随机种子，所有交互演示共用同一套操控习惯。
 */
export function PlaybackControls({
  playing,
  onTogglePlay,
  onStep,
  onReset,
  speed,
  onSpeedChange,
  speedOptions = DEFAULT_SPEEDS,
  seed,
  onSeedChange,
  disabled = false,
  children,
}: PlaybackControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" className={btn} onClick={onTogglePlay} disabled={disabled && !playing}>
        {playing ? '⏸ 暂停' : '▶ 播放'}
      </button>
      {onStep && (
        <button type="button" className={btn} onClick={onStep} disabled={disabled}>
          单步
        </button>
      )}
      <button type="button" className={btn} onClick={onReset}>
        重置
      </button>
      <label className="flex items-center gap-1 text-xs text-subtext">
        速度
        <select
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="rounded border border-gold/60 bg-parchment px-1.5 py-1 text-xs text-inktext"
        >
          {speedOptions.map((s) => (
            <option key={s} value={s}>
              {s}×
            </option>
          ))}
        </select>
      </label>
      {seed !== undefined && onSeedChange && (
        <label className="flex items-center gap-1 text-xs text-subtext">
          种子
          <input
            type="number"
            value={seed}
            onChange={(e) => onSeedChange(Math.floor(Number(e.target.value) || 0))}
            className="w-20 rounded border border-gold/60 bg-parchment px-1.5 py-1 text-right text-xs text-inktext"
          />
        </label>
      )}
      {children}
      <span className={chip}>演示数据可复现</span>
    </div>
  )
}
