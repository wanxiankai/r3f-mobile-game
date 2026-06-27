import { Suspense } from 'react'
import { GAME_CONFIG } from '@/config/gameConfig'
import { ASSET_MANIFEST } from '@/loaders/assetManifest'
import { DEFAULT_ACTION_MAP } from '@/core/actionMap'
import { createDefaultAssetPack } from '@/core/assetPacks'
import type { GameDefinition, GameSceneContext } from '@/core/gameDefinition'
import type { SystemEntry } from '@/core/systemRegistry'
import { Lights } from '@/components/three/Lights'
import { Environment } from '@/components/three/Environment'
import { InstancedEnemies } from '@/components/three/InstancedEnemies'
import { CameraRig } from '@/systems/CameraRig'
import { InputSystem } from '@/systems/InputSystem'
import { SpawnSystem } from '@/systems/SpawnSystem'
import { Ground } from '@/entities/Ground'
import { Player } from '@/entities/Player'
import { Postprocess } from '@/rendering/postprocess'

const systems: SystemEntry<GameSceneContext>[] = [
  {
    id: 'environment',
    phase: 'environment',
    order: 10,
    render: () => <Environment />
  },
  {
    id: 'lights',
    phase: 'environment',
    order: 20,
    render: () => <Lights />
  },
  {
    id: 'player',
    phase: 'entity',
    order: 100,
    render: ({ bindPlayer }) => (
      <Suspense fallback={null}>
        <Player ref={bindPlayer} />
      </Suspense>
    )
  },
  {
    id: 'ground',
    phase: 'entity',
    order: 110,
    render: () => <Ground />
  },
  {
    id: 'enemy-instances',
    phase: 'entity',
    order: 120,
    render: ({ playerTarget }) => <InstancedEnemies target={playerTarget} />
  },
  {
    id: 'camera-follow',
    phase: 'logic',
    order: 200,
    render: ({ playerTarget }) => <CameraRig target={playerTarget} />
  },
  {
    id: 'input',
    phase: 'logic',
    order: 210,
    render: () => <InputSystem />
  },
  {
    id: 'enemy-spawn',
    phase: 'logic',
    order: 220,
    render: () => <SpawnSystem />
  },
  {
    id: 'postprocess',
    phase: 'rendering',
    order: 300,
    enabled: ({ quality }) => quality !== 'low',
    render: () => <Postprocess />
  }
]

export const survivalShooterDefinition: GameDefinition = {
  id: 'survival-shooter',
  name: 'Survival Shooter',
  description: 'A compact mobile survival-shooter starter built from reusable template systems.',
  config: GAME_CONFIG,
  assets: ASSET_MANIFEST,
  assetPacks: [createDefaultAssetPack(ASSET_MANIFEST)],
  actions: DEFAULT_ACTION_MAP,
  ui: {
    title: '主菜单',
    subtitle: '触摸左侧摇杆移动，右侧按钮跳跃 / 开火',
    startLabel: '开始游戏',
    loadingTitle: 'R3F MOBILE GAME',
    loadingSubtitle: '加载资源中…'
  },
  systems
}
