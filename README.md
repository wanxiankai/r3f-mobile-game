# R3F Mobile Game Template

面向移动端 H5 的 3D 小游戏通用模板。技术栈为 React 18、React Three Fiber、Three.js、Rapier、Zustand、Howler、Vite 和 TypeScript。

这个模板的目标不是只跑一个 demo，而是让你在明确玩法之后，通过替换 `game-definition`、资源包、prefab 和少量系统组合，快速制作一个性能稳定、移动端体验完整的 3D H5 小游戏。

## 快速启动

```bash
pnpm install
pnpm run dev
pnpm run build
pnpm run preview
```

开发服务默认监听 `0.0.0.0:3000`，手机和电脑在同一局域网时可以用 `http://你的局域网 IP:3000` 真机调试。

## 当前能力

- 持久 R3F Canvas、DOM UI overlay、Canvas 内 3D 场景路由。
- `GameDefinition` 游戏包入口，可组合资源、配置、输入、UI 和系统。
- `SystemRegistry` 系统注册机制，支持按顺序组合环境、实体、逻辑和渲染系统。
- `AssetPack` 资源包模型，支持按 boot/menu/gameplay/lazy 阶段组织资源。
- `ActionMap` 输入映射，兼容键盘、虚拟摇杆和触控按钮。
- `RuntimeCollection` 高频运行时集合，避免敌人、子弹等对象进入 React state。
- 生存射击 prefab：敌人生成、波次难度、实例化敌人、实例化子弹、命中计分。
- 移动端体验：安全区、动态视口高度、设置面板、音量、画质、震动反馈。
- 性能守护：FPS 采样、持续低帧率自动降画质、Vite chunk 拆分、gzip/brotli、PWA 缓存。

## 目录导览

```text
src/app/                    应用壳、Canvas、路由、加载器初始化
src/core/                   模板内核接口：GameDefinition、SystemRegistry、AssetPack、ActionMap
src/game-definitions/       当前游戏包和常见游戏模板预设
src/scenes/                 DOM 场景和 3D 游戏场景
src/systems/                运行时系统：输入、生成、相机、物理、性能守护
src/entities/               具体 3D 实体：Player、Ground、Enemy、Bullet
src/prefabs/                可复用玩法模块：波次、难度、投射物、运行时重置
src/components/three/       可复用 3D 组件：灯光、环境、实例化敌人、LOD
src/components/ui/          DOM UI：HUD、摇杆、按钮、设置面板、加载条
src/stores/                 Zustand 状态：game、ui、input、settings、performance
src/loaders/                GLTF/KTX2/Draco/Meshopt 加载和预加载
src/rendering/              Canvas、画质、后处理、性能预算
src/audio/                  Howler 音频管理
src/utils/                  eventBus、对象池、数学工具、震动
```

## 第一次制作新游戏的流程

### 1. 选一个玩法预设

查看 [src/game-definitions/gameTemplates.ts](/Users/kw/workspace/sq/r3f-mobile-game/src/game-definitions/gameTemplates.ts)，当前预置了：

- 生存射击：固定场地刷怪、发射子弹、波次成长。
- 跑酷躲避：自动前进、切道、障碍、金币。
- 收集闯关：探索小地图、收集目标、计时或达成条件过关。

如果你的玩法接近其中一种，优先复用它推荐的 systems 和 prefabs。

### 2. 创建游戏包

复制当前示例：

```text
src/game-definitions/survival-shooter/
```

改成你的游戏目录，例如：

```text
src/game-definitions/my-game/
```

然后在 [src/game-definitions/current.ts](/Users/kw/workspace/sq/r3f-mobile-game/src/game-definitions/current.ts) 切换导出：

```ts
export const CURRENT_GAME_DEFINITION = myGameDefinition
```

### 3. 修改游戏定义

核心入口是 `GameDefinition`：

```ts
export const myGameDefinition: GameDefinition = {
  id: 'my-game',
  name: 'My Game',
  description: '...',
  config,
  assets,
  assetPacks,
  actions,
  ui,
  systems
}
```

你通常只需要改这些部分：

- `config`：移动速度、生命、重力、相机、敌人、子弹、关卡数值。
- `assets`：模型、贴图、环境、音频路径。
- `assetPacks`：哪些资源首屏加载，哪些进入关卡再加载。
- `actions`：移动、跳跃、开火、技能、冲刺等输入映射。
- `ui`：菜单、加载页、按钮文案。
- `systems`：组合需要的玩法系统。

### 4. 替换资源

资源路径集中在 [src/loaders/assetManifest.ts](/Users/kw/workspace/sq/r3f-mobile-game/src/loaders/assetManifest.ts) 或你自己的游戏包 assets 文件。

推荐资源格式：

```bash
gltfpack -i input.glb -o output.glb -cc -tc
toktx --bcmp --t2 output.ktx2 input.png
toktx --t2 --encode uastc env.ktx2 env.hdr
```

建议：

- 模型使用 GLB，并用 Draco/Meshopt 压缩。
- 纹理优先 KTX2。
- 音频区分 BGM 和 SFX。
- 首屏资源尽量少，把关卡资源放进 gameplay/lazy 阶段。

### 5. 组合系统

当前示例系统在 [src/game-definitions/survival-shooter/gameDefinition.tsx](/Users/kw/workspace/sq/r3f-mobile-game/src/game-definitions/survival-shooter/gameDefinition.tsx)。

一个系统条目长这样：

```tsx
{
  id: 'projectiles',
  phase: 'entity',
  order: 130,
  render: ({ playerTarget }) => <ProjectileSystem owner={playerTarget} />
}
```

规则：

- `environment`：灯光、天空、环境贴图。
- `entity`：玩家、地面、敌人、子弹、道具。
- `logic`：输入、生成、波次、性能守护。
- `rendering`：后处理、调试渲染。

通过 `enabled` 可以按画质或玩法条件开关系统。

### 6. 维护性能边界

模板默认遵守这些规则：

- 高频位置、速度、生命周期放在 `RuntimeCollection`、`useRef`、Three/Rapier 对象里。
- Zustand 只放低频状态，例如分数、生命、等级、设置。
- `useFrame` 内不要调用 React `setState`。
- 大量重复对象使用 instancing。
- 移动端低画质关闭后处理和阴影。
- `PerformanceGuard` 会在持续低 FPS 时自动降画质。

新增玩法时，优先复用：

- [src/core/runtimeCollection.ts](/Users/kw/workspace/sq/r3f-mobile-game/src/core/runtimeCollection.ts)
- [src/utils/objectPool.ts](/Users/kw/workspace/sq/r3f-mobile-game/src/utils/objectPool.ts)
- [src/prefabs/projectiles/ProjectileSystem.tsx](/Users/kw/workspace/sq/r3f-mobile-game/src/prefabs/projectiles/ProjectileSystem.tsx)
- [src/prefabs/level/WaveSystem.tsx](/Users/kw/workspace/sq/r3f-mobile-game/src/prefabs/level/WaveSystem.tsx)

## 常见二次开发任务

### 改成跑酷游戏

- 保留 `Player`、`InputSystem`、`CameraRig`、`PerformanceGuard`、`SettingsPanel`。
- 移除 `ProjectileSystem` 和 `InstancedEnemies`。
- 新增道路循环系统、障碍物集合、金币集合。
- `ActionMap` 改为左右切道、跳跃、下滑。
- 地面和障碍物都使用对象复用或实例化渲染。

### 改成收集游戏

- 保留移动、相机、HUD、设置、性能守护。
- 新增 collectible registry 和实例化渲染。
- 命中检测可以先用距离检测，复杂地形再接 Rapier sensor。
- HUD 展示目标数量、倒计时、当前关卡。

### 增加技能按钮

在 action map 增加：

```ts
{
  action: 'skill1',
  label: 'Skill',
  kind: 'button',
  keyboard: ['k'],
  touch: { zone: 'custom', label: 'S' }
}
```

然后扩展 `VirtualJoystick` 或新增技能按钮组件，把按下状态写入 `inputStore.actions.skill1`。

## 验收建议

每次完成一个玩法阶段后至少运行：

```bash
pnpm run build
```

上线前建议检查：

- 真机首屏加载是否可接受。
- iOS Safari / 微信 WebView 音频是否能在首次触摸后播放。
- 横屏、竖屏、刘海屏按钮是否没有被遮挡。
- 低端机是否会自动降画质。
- `dist` 中主业务 chunk 是否保持在预算内。
- 重复对象是否使用实例化或对象池。

## 当前示例 TODO

- 替换 `assets/models/player.glb`、`enemy.glb`。
- 补充真实地面 KTX2 纹理和环境贴图。
- 补充 `bgm.mp3`、`shoot.mp3`、`hit.mp3`。
- 根据实际玩法扩展技能、关卡目标和结算面板。
- 为 PWA 添加 `icon-192.png` 和 `icon-512.png`。
