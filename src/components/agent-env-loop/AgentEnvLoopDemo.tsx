import { useCallback, useEffect, useRef, useState } from 'react'
import { CorridorEnv, mulberry32, randomCorridorAction, type CorridorAction } from '../../rl-core'
import { PlaybackControls } from '../PlaybackControls'

/** 一拍内的两个半程时长（ms，除以速度倍率） */
const ACT_MS = 550
const FEEDBACK_MS = 550
const BEAT_MS = 1300

type Phase = 'idle' | 'act' | 'feedback'
type Mode = 'auto' | 'manual'
type InfoKey = 'agent' | 'env' | 'action' | 'feedback' | null

interface LogEntry {
  key: number
  t: number
  s: number
  a: CorridorAction
  r: number
  sNext: number
  done: boolean
}

const INFO: Record<Exclude<InfoKey, null>, { title: string; body: string }> = {
  agent: {
    title: '智能体（Agent）',
    body: '做决策的主体，也就是"学习者"。它只能看到环境给它的状态，并据此选择动作。它的决策规则叫策略（Policy）——强化学习的全部目标，就是把这个策略越学越好。',
  },
  env: {
    title: '环境（Environment）',
    body: '智能体之外的一切，负责"回应"动作：告诉智能体世界变成了什么样（状态），以及这个动作好不好（奖励）。本页的环境就是这条 5 格走廊。',
  },
  action: {
    title: '动作（Action）',
    body: '智能体在当前状态下能做的选择。走廊世界里只有两个动作：向左、向右。真实问题里动作可以是游戏按键、机械臂关节扭矩、推荐系统选出的内容……',
  },
  feedback: {
    title: '状态与奖励（State & Reward）',
    body: '环境对动作的回应：新状态 s 告诉你"现在在哪"，奖励 r 告诉你"这一步好不好"。奖励是智能体唯一的学习信号——它不知道规则，只认奖励。',
  },
}

const ACTION_NAME: Record<CorridorAction, string> = { 0: '← 向左', 1: '向右 →' }
const CELL = 44
const GAP = 8

/**
 * AgentEnvLoopDemo —— 第 0 章核心交互：智能体-环境循环。
 * 上方是走廊世界，下方是循环图。自动模式由随机策略驱动，手动模式由读者亲手控制智能体。
 */
export function AgentEnvLoopDemo() {
  const [mode, setMode] = useState<Mode>('auto')
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [seed, setSeed] = useState(7)
  const [pos, setPos] = useState(0)
  const [episodeT, setEpisodeT] = useState(0)
  const [phase, setPhase] = useState<Phase>('idle')
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [animKey, setAnimKey] = useState(0)
  const [info, setInfo] = useState<InfoKey>(null)

  const envRef = useRef(new CorridorEnv(5))
  const rngRef = useRef(mulberry32(seed))
  const phaseRef = useRef<Phase>('idle')
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const stepCountRef = useRef(0)

  /** 同步更新 phase 的 ref 与 state：ref 供回调读取最新值，避免闭包读到旧 phase */
  const applyPhase = useCallback((p: Phase) => {
    phaseRef.current = p
    setPhase(p)
  }, [])

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }, [])

  const doReset = useCallback(() => {
    clearTimers()
    envRef.current = new CorridorEnv(5)
    rngRef.current = mulberry32(seed)
    stepCountRef.current = 0
    setPos(0)
    setEpisodeT(0)
    applyPhase('idle')
    setLogs([])
    setPlaying(false)
  }, [clearTimers, seed, applyPhase])

  /** 执行一步：先"动作"令牌飞向环境，落地后环境转移，再"状态+奖励"令牌飞回来 */
  const runStep = useCallback(
    (action: CorridorAction) => {
      if (phaseRef.current !== 'idle') return
      const speedNow = speed
      const t = episodeT
      const s = envRef.current.state.pos
      setAnimKey((k) => k + 1)
      applyPhase('act')
      timersRef.current.push(
        setTimeout(() => {
          const [sNext, r, done] = envRef.current.step(action)
          setPos(sNext.pos)
          applyPhase('feedback')
          timersRef.current.push(
            setTimeout(() => {
              setLogs((l) =>
                [...l, { key: stepCountRef.current++, t, s, a: action, r, sNext: sNext.pos, done }].slice(-8),
              )
              setEpisodeT((x) => x + 1)
              applyPhase('idle')
              if (done) setPlaying(false)
            }, FEEDBACK_MS / speedNow),
          )
        }, ACT_MS / speedNow),
      )
    },
    [episodeT, speed, applyPhase],
  )

  // 自动模式的心跳：每拍由均匀随机策略选一个动作
  useEffect(() => {
    if (!playing || mode !== 'auto') return
    const id = setInterval(() => {
      if (envRef.current.state.done) {
        doReset()
        return
      }
      runStep(randomCorridorAction(rngRef.current))
    }, BEAT_MS)
    return () => clearInterval(id)
  }, [playing, mode, runStep, doReset])

  // 卸载时清理所有定时器
  useEffect(() => clearTimers, [clearTimers])

  const done = logs.at(-1)?.done ?? false
  const speedNow = speed

  return (
    <div className="not-prose my-8 overflow-hidden rounded-lg border border-gold/60 bg-parchment-card shadow-sm">
      {/* 走廊世界 */}
      <div className="border-b border-gold/40 px-6 py-5">
        <p className="mb-3 text-xs tracking-wider text-subtext">
          走廊世界 · CORRIDOR WORLD（5 格，从起点走到 ★）
        </p>
        <div className="relative inline-block" style={{ width: 5 * CELL + 4 * GAP, height: CELL + 8 }}>
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className="absolute top-1 flex items-center justify-center rounded border border-gold/50 bg-parchment text-lg"
              style={{ left: i * (CELL + GAP), width: CELL, height: CELL }}
            >
              {i === 4 ? '★' : ''}
            </div>
          ))}
          <div
            className="absolute text-2xl transition-all duration-300"
            style={{
              left: pos * (CELL + GAP) + CELL / 2,
              top: CELL / 2 + 4,
              transform: 'translate(-50%, -50%) rotate(45deg)',
              width: 18,
              height: 18,
              backgroundColor: 'var(--color-gold-bright)',
              border: '1.5px solid var(--color-ink)',
              borderRadius: 3,
            }}
            aria-label="智能体"
          />
        </div>
        <p className="mt-2 text-xs text-subtext">
          当前状态 s<sub>t</sub> = <b className="text-inktext">{pos}</b>
          {done && <span className="ml-3 text-gold-deep">★ 回合结束！</span>}
        </p>
      </div>

      {/* 循环图 */}
      <div className="px-6 py-6">
        <div className="flex items-stretch gap-3">
          <InfoBox
            label="智能体"
            en="AGENT"
            color="var(--color-gold-deep)"
            onClick={() => setInfo('agent')}
          />
          <div className="flex flex-1 flex-col justify-center gap-9 py-2">
            {/* 动作箭头：左 → 右 */}
            <div className="relative h-6">
              <div className="absolute top-1/2 w-full border-t-2 border-dashed border-ink-soft/70" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 border-y-4 border-l-8 border-y-transparent border-l-ink-soft/70" />
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-inktext">
                动作 a<sub>t</sub>（选择）
              </span>
              {phase === 'act' && (
                <span
                  key={`a-${animKey}`}
                  className="rl-dot"
                  style={{
                    backgroundColor: 'var(--color-gold-bright)',
                    border: '1px solid var(--color-ink)',
                    animation: `rl-fly-right ${ACT_MS / speedNow}ms linear forwards`,
                  }}
                />
              )}
            </div>
            {/* 反馈箭头：右 → 左 */}
            <div className="relative h-6">
              <div className="absolute top-1/2 w-full border-t-2 border-dashed border-ink-soft/70" />
              <div className="absolute left-0 top-1/2 -translate-y-1/2 border-y-4 border-r-8 border-y-transparent border-r-ink-soft/70" />
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-inktext">
                状态 s<sub>t+1</sub> · 奖励 r<sub>t+1</sub>（回应）
              </span>
              {phase === 'feedback' && (
                <>
                  <span
                    key={`s-${animKey}`}
                    className="rl-dot"
                    style={{
                      backgroundColor: 'var(--color-anemo)',
                      animation: `rl-fly-left ${FEEDBACK_MS / speedNow}ms linear forwards`,
                    }}
                  />
                  <span
                    key={`r-${animKey}`}
                    className="rl-dot"
                    style={{
                      top: '20%',
                      backgroundColor: 'var(--color-hydro)',
                      animation: `rl-fly-left ${FEEDBACK_MS / speedNow}ms linear forwards`,
                    }}
                  />
                </>
              )}
            </div>
          </div>
          <InfoBox
            label="环境"
            en="ENVIRONMENT"
            color="var(--color-anemo)"
            onClick={() => setInfo('env')}
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-[10px] text-subtext">
          <span className="flex items-center gap-1.5">
            <i className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--color-gold-bright)' }} />
            动作
          </span>
          <span className="flex items-center gap-1.5">
            <i className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--color-anemo)' }} />
            新状态
          </span>
          <span className="flex items-center gap-1.5">
            <i className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--color-hydro)' }} />
            奖励
          </span>
          <button type="button" className="underline underline-offset-2 hover:text-gold-deep" onClick={() => setInfo('action')}>
            点击图中的方块或令牌说明 →
          </button>
        </div>

        {/* 要素说明面板 */}
        <div className="mt-4 min-h-14 rounded border border-gold/50 bg-parchment px-4 py-3 text-xs leading-relaxed">
          {info ? (
            <>
              <b className="text-inktext">{INFO[info].title}</b>
              <span className="ml-2 text-subtext">{INFO[info].body}</span>
            </>
          ) : (
            <span className="text-subtext">💡 点击「智能体 / 环境」方块查看每个要素的含义。</span>
          )}
        </div>
      </div>

      {/* 控制与日志 */}
      <div className="border-t border-gold/40 bg-parchment px-6 py-4">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <div className="flex overflow-hidden rounded border border-ink-soft/40 text-xs">
            {(['auto', 'manual'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMode(m)
                  setPlaying(false)
                }}
                className={`px-3 py-1.5 transition-colors ${
                  mode === m ? 'bg-ink text-parchment' : 'bg-parchment text-inktext hover:bg-parchment-card'
                }`}
              >
                {m === 'auto' ? '自动（随机策略）' : '手动（你来控制）'}
              </button>
            ))}
          </div>
          <PlaybackControls
            playing={playing}
            onTogglePlay={() => setPlaying((p) => !p)}
            onStep={mode === 'auto' ? () => runStep(randomCorridorAction(rngRef.current)) : undefined}
            onReset={doReset}
            speed={speed}
            onSpeedChange={setSpeed}
            seed={seed}
            onSeedChange={(s) => {
              setSeed(s)
              // 种子立即生效：重建随机流并重置回合
              clearTimers()
              envRef.current = new CorridorEnv(5)
              rngRef.current = mulberry32(s)
              stepCountRef.current = 0
              setPos(0)
              setEpisodeT(0)
              applyPhase('idle')
              setLogs([])
              setPlaying(false)
            }}
            disabled={done}
          >
            {mode === 'manual' && (
              <span className="ml-1 flex gap-1.5">
                <button
                  type="button"
                  className="rounded border border-gold bg-gold-bright/40 px-4 py-1.5 text-xs text-inktext transition-colors hover:bg-gold-bright/70 disabled:opacity-40"
                  onClick={() => runStep(0)}
                  disabled={phase !== 'idle' || done}
                >
                  ← 向左
                </button>
                <button
                  type="button"
                  className="rounded border border-gold bg-gold-bright/40 px-4 py-1.5 text-xs text-inktext transition-colors hover:bg-gold-bright/70 disabled:opacity-40"
                  onClick={() => runStep(1)}
                  disabled={phase !== 'idle' || done}
                >
                  向右 →
                </button>
              </span>
            )}
          </PlaybackControls>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-125 text-left text-xs">
            <thead>
              <tr className="border-b border-gold/60 text-subtext">
                <th className="py-1.5 pr-3 font-medium">t</th>
                <th className="py-1.5 pr-3 font-medium">s_t</th>
                <th className="py-1.5 pr-3 font-medium">a_t</th>
                <th className="py-1.5 pr-3 font-medium">r_t+1</th>
                <th className="py-1.5 pr-3 font-medium">s_t+1</th>
                <th className="py-1.5 font-medium">回合结束</th>
              </tr>
            </thead>
            <tbody className="font-mono text-inktext">
              {[...logs].reverse().map((e) => (
                <tr key={e.key} className="border-b border-gold/20">
                  <td className="py-1.5 pr-3">{e.t}</td>
                  <td className="py-1.5 pr-3">{e.s}</td>
                  <td className="py-1.5 pr-3">{ACTION_NAME[e.a]}</td>
                  <td className={`py-1.5 pr-3 ${e.r > 0 ? 'font-bold text-gold-deep' : ''}`}>{e.r}</td>
                  <td className="py-1.5 pr-3">{e.sNext}</td>
                  <td className="py-1.5">{e.done ? '★' : ''}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-2 text-subtext">
                    尚无交互记录——点「播放」或在手动模式里走一步试试。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function InfoBox({ label, en, color, onClick }: { label: string; en: string; color: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-24 shrink-0 flex-col items-center justify-center gap-1 rounded-lg border-2 px-2 py-4 transition-transform hover:-translate-y-0.5"
      style={{ borderColor: color, backgroundColor: 'color-mix(in srgb, ' + color + ' 12%, var(--color-parchment))' }}
    >
      <span className="text-sm font-bold text-inktext">{label}</span>
      <span className="text-[10px] tracking-widest" style={{ color }}>
        {en}
      </span>
    </button>
  )
}
