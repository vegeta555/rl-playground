import type { Rng } from '../seed'

/**
 * CorridorEnv —— 走廊世界：本站第一个教学环境。
 *
 * 一维走廊共 n 格（编号 0 … n-1），智能体从 0 号格出发，目标在最右端 n-1。
 * - 动作：0 = 向左，1 = 向右
 * - 奖励：某一步走到的格子是目标格 → +1；否则 0（"稀疏奖励"的最简形态）
 * - 转移：完全确定，撞墙则原地不动（第一课不引入随机性，聚焦循环本身）
 *
 * 它故意简单到"一眼看穿"——后面的章节会把它逐步升级成 GridWorld / CliffWalking。
 */

/** 动作编码：教学环境用最朴素的小整数，方便在日志表里阅读 */
export type CorridorAction = 0 | 1

export interface CorridorState {
  /** 智能体所在格子编号 */
  pos: number
  /** 回合是否已结束（到达目标） */
  done: boolean
}

export type CorridorStepResult = [state: CorridorState, reward: number, done: boolean]

export class CorridorEnv {
  readonly n: number
  private pos: number
  private done: boolean

  constructor(n = 5) {
    this.n = n
    this.pos = 0
    this.done = false
  }

  get state(): CorridorState {
    return { pos: this.pos, done: this.done }
  }

  /** 回合开始：智能体回到起点 */
  reset(): CorridorState {
    this.pos = 0
    this.done = false
    return this.state
  }

  /**
   * 执行一步，返回 [下一状态, 奖励, 是否结束]。
   * 这是所有环境共有的接口形态——之后 GridWorld、CartPole 都长这个样子。
   */
  step(action: CorridorAction): CorridorStepResult {
    if (this.done) return [this.state, 0, true]
    const delta = action === 1 ? 1 : -1
    this.pos = Math.min(this.n - 1, Math.max(0, this.pos + delta))
    if (this.pos === this.n - 1) {
      this.done = true
      return [this.state, 1, true]
    }
    return [this.state, 0, false]
  }
}

/** 均匀随机策略：智能体 50/50 地选左或右（第 0 章的"笨智能体"就靠它行动） */
export function randomCorridorAction(rng: Rng): CorridorAction {
  return rng() < 0.5 ? 0 : 1
}
