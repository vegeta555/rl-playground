/**
 * 带种子的伪随机数生成（PRNG）。
 *
 * 为什么不用 Math.random()？
 * 教学实验场要求"可复现"：同一个随机种子必须产生完全相同的训练轨迹，
 * 这样用户才能分享链接、对比算法（如 SARSA vs Q-Learning 同种子对齐跑）。
 * mulberry32 小巧快速、统计性质足够教学使用。
 */

/** 随机数函数：每次调用返回 [0, 1) 内的浮点数 */
export type Rng = () => number

/** 由整数种子创建一个确定性随机流。同一种子 → 完全相同的序列 */
export function mulberry32(seed: number): Rng {
  let a = seed >>> 0
  return function () {
    a = (a + 0x6d2b79f5) | 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** 均匀随机整数，范围 [0, maxExclusive)。常见用途：随机选动作 randomInt(rng, nActions) */
export function randomInt(rng: Rng, maxExclusive: number): number {
  return Math.floor(rng() * maxExclusive)
}

/** 从数组中均匀随机取一个元素 */
export function pick<T>(rng: Rng, items: readonly T[]): T {
  return items[randomInt(rng, items.length)]
}

/** 返回数组的随机乱序副本（Fisher-Yates），不修改原数组 */
export function shuffled<T>(rng: Rng, items: readonly T[]): T[] {
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomInt(rng, i + 1)
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
