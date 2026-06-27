import type { ReactNode, RefCallback, RefObject } from 'react'
import type * as THREE from 'three'
import type { AssetManifest } from '@/loaders/assetManifest'
import type { GameConfig } from '@/config/gameConfig'
import type { ActionMap } from '@/core/actionMap'
import type { AssetPack } from '@/core/assetPacks'
import type { SystemEntry, SystemRenderContext } from '@/core/systemRegistry'
import type { QualityTier } from '@/types/game'
import type { PlayerHandle } from '@/entities/Player'

export interface GameSceneContext extends SystemRenderContext {
  quality: QualityTier
  playerTarget: RefObject<THREE.Object3D | null>
  bindPlayer: RefCallback<PlayerHandle>
}

export interface GameUiDefinition {
  title: string
  subtitle: string
  startLabel: string
  loadingTitle: string
  loadingSubtitle: string
}

export interface LazySceneModule {
  id: string
  label: string
  load: () => Promise<{ default?: ReactNode } | Record<string, unknown>>
}

export interface GameDefinition {
  id: string
  name: string
  description: string
  config: GameConfig
  assets: AssetManifest
  assetPacks: AssetPack[]
  actions: ActionMap
  ui: GameUiDefinition
  systems: SystemEntry<GameSceneContext>[]
  lazyScenes?: LazySceneModule[]
}
