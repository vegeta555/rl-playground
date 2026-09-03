import { describe, expect, it } from 'vitest'
import { mulberry32, pick, randomInt, shuffled } from './index'

describe('mulberry32', () => {
  it('同一种子产生完全相同的序列（可复现性）', () => {
    const a = mulberry32(42)
    const b = mulberry32(42)
    const seqA = Array.from({ length: 100 }, () => a())
    const seqB = Array.from({ length: 100 }, () => b())
    expect(seqA).toEqual(seqB)
  })

  it('不同种子产生不同序列', () => {
    const a = mulberry32(1)
    const b = mulberry32(2)
    const seqA = Array.from({ length: 10 }, () => a())
    const seqB = Array.from({ length: 10 }, () => b())
    expect(seqA).not.toEqual(seqB)
  })

  it('输出落在 [0, 1) 且分布大致均匀', () => {
    const rng = mulberry32(7)
    const n = 10_000
    let sum = 0
    for (let i = 0; i < n; i++) {
      const v = rng()
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThan(1)
      sum += v
    }
    const mean = sum / n
    // 均匀分布期望 0.5，1 万样本的均值几乎必然落在 0.48 ~ 0.52
    expect(mean).toBeGreaterThan(0.48)
    expect(mean).toBeLessThan(0.52)
  })
})

describe('randomInt', () => {
  it('始终在 [0, maxExclusive) 内', () => {
    const rng = mulberry32(123)
    for (let i = 0; i < 1000; i++) {
      const v = randomInt(rng, 5)
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThan(5)
      expect(Number.isInteger(v)).toBe(true)
    }
  })
})

describe('pick', () => {
  it('只返回数组中的元素', () => {
    const rng = mulberry32(9)
    const items = ['a', 'b', 'c'] as const
    for (let i = 0; i < 100; i++) {
      expect(items).toContain(pick(rng, items))
    }
  })
})

describe('shuffled', () => {
  it('是原数组的排列（不丢不重），且不修改原数组', () => {
    const rng = mulberry32(2024)
    const original = [1, 2, 3, 4, 5, 6, 7, 8]
    const result = shuffled(rng, original)
    expect(result).toHaveLength(original.length)
    expect([...result].sort((x, y) => x - y)).toEqual(original)
    expect(original).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
  })

  it('同种子乱序结果一致（可复现性）', () => {
    expect(shuffled(mulberry32(5), [1, 2, 3, 4, 5])).toEqual(shuffled(mulberry32(5), [1, 2, 3, 4, 5]))
  })
})
