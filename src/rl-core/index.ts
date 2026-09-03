/**
 * rl-core —— 强化学习算法核心库。
 *
 * 设计约束（docs/WORKPLAN.md §4.3）：
 * - 纯 TypeScript、零 UI 依赖，不 import 任何 React/DOM API；
 * - 所有随机性都来自带种子的 Rng，保证实验可复现；
 * - 算法代码保持教学级可读性：干净、带注释、与参考文献术语一致。
 */

export * from './seed'
