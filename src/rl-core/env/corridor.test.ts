import { describe, expect, it } from 'vitest'
import { mulberry32 } from '../seed'
import { CorridorEnv, randomCorridorAction } from './corridor'

describe('CorridorEnv', () => {
  it('一直向右：每步前进一步，最后一步到达目标并获得 +1 奖励', () => {
    const env = new CorridorEnv(5)
    expect(env.state.pos).toBe(0)

    // 前 3 步：0→1→2→3，无奖励
    for (const expected of [1, 2, 3]) {
      const [s, r, done] = env.step(1)
      expect(s.pos).toBe(expected)
      expect(r).toBe(0)
      expect(done).toBe(false)
    }
    // 第 4 步：3→4（目标），+1 且结束
    const [s, r, done] = env.step(1)
    expect(s.pos).toBe(4)
    expect(r).toBe(1)
    expect(done).toBe(true)
  })

  it('向左在起点被截断（撞墙原地不动）', () => {
    const env = new CorridorEnv(5)
    const [s] = env.step(0)
    expect(s.pos).toBe(0)
  })

  it('回合结束后 step 不再产生奖励或移动', () => {
    const env = new CorridorEnv(3)
    env.step(1)
    env.step(1)
    expect(env.state.done).toBe(true)
    const [s, r, done] = env.step(1)
    expect(s.pos).toBe(2)
    expect(r).toBe(0)
    expect(done).toBe(true)
  })

  it('reset 回到起点', () => {
    const env = new CorridorEnv(5)
    env.step(1)
    env.step(1)
    env.reset()
    expect(env.state).toEqual({ pos: 0, done: false })
  })
})

describe('randomCorridorAction', () => {
  it('同种子序列一致（可复现），且只产生 0/1', () => {
    const seqA = Array.from({ length: 50 }, () => randomCorridorAction(mulberry32(11)))
    const seqB = Array.from({ length: 50 }, () => randomCorridorAction(mulberry32(11)))
    expect(seqA).toEqual(seqB)
    for (const a of seqA) expect([0, 1]).toContain(a)
  })
})
