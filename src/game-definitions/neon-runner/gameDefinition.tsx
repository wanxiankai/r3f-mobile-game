import { Suspense } from 'react'
import { GAME_CONFIG } from '@/config/gameConfig'
import { ASSET_MANIFEST } from '@/loaders/assetManifest'
import { createDefaultAssetPack } from '@/core/assetPacks'
import type { ActionMap } from '@/core/actionMap'
import type { GameDefinition, GameSceneContext } from '@/core/gameDefinition'
import type { SystemEntry } from '@/core/systemRegistry'
import { Environment } from '@/components/three/Environment'
import { Lights } from '@/components/three/Lights'
import { CameraRig } from '@/systems/CameraRig'
import { InputSystem } from '@/systems/InputSystem'
import { PerformanceGuard } from '@/systems/PerformanceGuard'
import { Postprocess } from '@/rendering/postprocess'
import { RunnerPlayer } from '@/entities/runner/RunnerPlayer'
import { RunnerCourse } from '@/systems/runner/RunnerCourse'

const runnerActions: ActionMap = {
  bindings: [
    {
      action: 'jump',
      label: 'Jump',
      kind: 'button',
      keyboard: [' ', 'w', 'arrowup'],
      touch: { zone: 'right-button', label: 'JUMP' }
    },
    {
      action: 'move',
      label: 'Move',
      kind: 'vector2',
      keyboard: ['a', 'd', 's', 'arrowleft', 'arrowright', 'arrowdown'],
      touch: { zone: 'left-stick' }
    },
    {
      action: 'slide',
      label: 'Slide',
      kind: 'button',
      keyboard: ['s', 'arrowdown']
    }
  ]
}

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
    id: 'runner-course',
    phase: 'entity',
    order: 90,
    render: () => <RunnerCourse />
  },
  {
    id: 'runner-player',
    phase: 'entity',
    order: 100,
    render: ({ bindPlayer }) => (
      <Suspense fallback={null}>
        <RunnerPlayer ref={bindPlayer} />
      </Suspense>
    )
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
    id: 'performance-guard',
    phase: 'logic',
    order: 240,
    render: () => <PerformanceGuard />
  },
  {
    id: 'postprocess',
    phase: 'rendering',
    order: 300,
    enabled: ({ quality }) => quality !== 'low',
    render: () => <Postprocess />
  }
]

export const neonRunnerDefinition: GameDefinition = {
  id: 'neon-runner',
  name: 'Neon Runner',
  description: 'A mobile lane runner with jumps, slides, collectible coins, escalating speed, and reusable procedural assets.',
  config: GAME_CONFIG,
  assets: ASSET_MANIFEST,
  assetPacks: [createDefaultAssetPack(ASSET_MANIFEST)],
  actions: runnerActions,
  ui: {
    title: 'NEON RUNNER',
    subtitle: '切道躲避障碍，跳过路障，下滑穿过拱门，收集金币冲高分',
    startLabel: '开始跑酷',
    loadingTitle: 'NEON RUNNER',
    loadingSubtitle: '准备赛道中...'
  },
  systems
}
