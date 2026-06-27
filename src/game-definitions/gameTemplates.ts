import type { AssetLoadPhase } from '@/core/assetPacks'

export interface GameTemplatePreset {
  id: string
  name: string
  fit: string
  recommendedSystems: string[]
  recommendedPrefabs: string[]
  assetPhases: AssetLoadPhase[]
  performanceNotes: string[]
}

export const GAME_TEMPLATE_PRESETS: GameTemplatePreset[] = [
  {
    id: 'survival-shooter',
    name: '生存射击',
    fit: '固定场地、持续刷怪、玩家移动射击、波次成长。',
    recommendedSystems: ['input', 'enemy-spawn', 'projectiles', 'waves', 'performance-guard'],
    recommendedPrefabs: ['ProjectileSystem', 'RuntimeCollection', 'WaveSystem', 'SettingsPanel'],
    assetPhases: ['boot', 'menu', 'gameplay'],
    performanceNotes: ['敌人和子弹优先实例化渲染', '碰撞可先用轻量距离检测，再按需求接 Rapier sensor']
  },
  {
    id: 'runner-dodge',
    name: '跑酷躲避',
    fit: '角色自动前进、左右切道、躲避障碍、吃金币或道具。',
    recommendedSystems: ['input', 'waves', 'performance-guard'],
    recommendedPrefabs: ['RuntimeCollection', 'DifficultyCurve', 'SettingsPanel'],
    assetPhases: ['boot', 'gameplay', 'lazy'],
    performanceNotes: ['道路和障碍物循环复用', '远景使用低模或贴片，避免长距离阴影']
  },
  {
    id: 'collector-arena',
    name: '收集闯关',
    fit: '小地图探索、收集目标物、计时或达成数量后过关。',
    recommendedSystems: ['input', 'waves', 'performance-guard'],
    recommendedPrefabs: ['RuntimeCollection', 'SettingsPanel'],
    assetPhases: ['boot', 'menu', 'gameplay'],
    performanceNotes: ['收集物用实例化渲染', 'UI 计数只订阅低频 store 字段']
  }
]
