# R3F Mobile Game Skeleton

移动端 H5 3D 小游戏项目骨架。React 18 + React Three Fiber + Rapier + TypeScript + Vite + Zustand。

> ⚠️ 本仓库由 AI 生成完整可运行源码。**`pnpm install / lint / build / dev` 需在你本地 Node 环境执行**（当前生成环境无 Node 运行时，无法代跑验收命令）。

## 1. 技术栈
React 18.3 · @react-three/fiber 8 · @react-three/drei 9 · @react-three/rapier 1 · three 0.162 · zustand 4 · howler · mitt · detect-gpu · Vite 5 · TypeScript 5 · pnpm。

## 2. 环境要求
Node 18+ · pnpm 8+。

## 3. 启动命令
```bash
pnpm install      # 自动 postinstall 复制 draco/basis 解码器
pnpm run dev      # http://localhost:3000 (host=0.0.0.0 可真机访问)
pnpm run build    # 输出 dist (es2020, terser 移除 console, gzip+brotli)
pnpm run preview  # 预览构建产物
pnpm run lint     # ESLint
pnpm run format   # Prettier
```

## 4. 目录说明（R3F 组件化思想）
- `app/` 应用壳：`App`(DOM+Canvas 协调) · `GameCanvas`(R3F Canvas) · `Router`(Canvas 内场景路由) · `LoaderSetup`(解码器注入)
- `scenes/` 场景：Loading/Menu/GameOver 为 **DOM 层**；GameScene 为 **Canvas 内 3D 场景**
- `entities/` 3D 实体（Player/Enemy/Bullet/Ground）声明式组件
- `systems/` 逻辑系统（Physics/Input/CameraRig/Spawn/Animation）渲染 null，仅驱动循环
- `components/three/` 可复用 3D（Lights/Environment/InstancedEnemies/LODModel）
- `components/ui/` DOM UI（HUD/LoadingBar/VirtualJoystick/Button）
- `stores/` Zustand（game/ui/input/settings）
- `loaders/` `gltfLoader`(Draco+KTX2+Meshopt) · `preloadAssets` · `assetManifest`
- `rendering/` canvas/postprocess/quality 配置
- `audio/` Howler 单例 · `utils/` eventBus/disposer/objectPool/math · `config/` 数值与画质三档 · `types/`

## 5. 状态管理规范
- **React state**：UI 局部状态（如 LoadingScene 进度数字）
- **Zustand 订阅式**：`useStore(s => s.x)` —— 仅低频 UI/游戏状态（score、lives、scene、quality）
- **Zustand getState 式**：`useStore.getState().x` —— useFrame / 游戏循环内读取（input、paused），**不触发重渲染**
- **直接操作 Three.js / Rapier 对象**：高频数据（位置、速度、矩阵）经 `useRef` 引用直接 mutate；敌人 transform 存于非 React 的 `systems/enemyRegistry.ts`

## 6. R3F 性能要点
1. `useFrame` 内**禁止 setState**（见 `hooks/useGameLoop` 封装）
2. 高频数据用 `useRef`，绝不进 React state
3. Zustand 订阅必须带 selector；多字段用 `shallow`
4. per-frame 读 store 用 `getState()` / `getInput()`
5. 生产环境不包 StrictMode（`main.tsx`）
6. 大量重复对象用 `<Instances>`（`InstancedEnemies`，按画质档位 cap 数量）
7. Canvas 内优先 Zustand 而非 Context

## 7. 资源压缩工具链
```bash
gltfpack -i input.glb -o output.glb -cc -tc     # Draco + Meshopt
toktx --bcmp --t2 output.ktx2 input.png         # 纹理 → KTX2
toktx --t2 --encode uastc env.ktx2 env.hdr      # HDR 环境贴图
```

## 8. 解码器位置
`postinstall` 自动复制：
- `public/assets/draco/`  ← three/examples/jsm/libs/draco
- `public/assets/basis/`  ← three/examples/jsm/libs/basis
（已加入 `.gitignore`，由 install 重新生成；目录保留 `.gitkeep`）

## 9. 设备分级与画质档位
`hooks/useDeviceTier`(detect-gpu) → 写入 `settingsStore.quality`。三档见 `config/qualityConfig.ts`：
| 档 | dpr | shadows | postprocess | maxLights | instanceLimit |
|----|-----|---------|-------------|-----------|---------------|
| low | 1 | ✗ | ✗ | 1 | 100 |
| mid | [1,1.5] | ✗ | ✓ | 2 | 500 |
| high | [1,2] | ✓ | ✓ | 3 | 1000 |

## 10. 移动端调试
同局域网真机访问 `http://<你的IP>:3000`；DEV 自动注入 Eruda 控制台 + r3f-perf 性能面板（左上角）。

## 11. 常见问题
- **iOS 音频**：首次 pointerdown/touchend 解锁（`audioManager` 内处理）
- **刘海屏**：UI 用 `env(safe-area-inset-*)`；html viewport-fit=cover
- **后台暂停**：`visibilitychange` → `paused`，frameloop 切 `never`
- **WeChat WebView**：避免 100vh 用 100dvh；触摸全部经 inputStore

---

## TODO（资源/逻辑占位）
- `assets/models/player.glb`、`enemy.glb`：缺失时降级为 Capsule/Box（见 Player/Enemy/InstancedEnemies 注释 `// TODO`）
- `assets/textures/ground.ktx2`：地面当前为纯色材质
- `assets/envmaps/studio.hdr`：高端机环境贴图当前用 drei preset
- `assets/audio/*.mp3`：bgm/shoot/hit 占位路径
- 业务逻辑占位：子弹发射与碰撞结算、敌人受击/死亡计分、玩家受击掉血、生成难度曲线
- `public/assets/icon-192.png` / `icon-512.png`：PWA 图标待补

## 美术资源 checklist
- [ ] player.glb（Draco+Meshopt，含 idle/run 动画）
- [ ] enemy.glb（低面数，适配 Instances）
- [ ] ground.ktx2 平铺纹理
- [ ] studio.hdr / .ktx2 环境贴图
- [ ] bgm.mp3 / shoot.mp3 / hit.mp3
- [ ] PWA 图标 192/512

## 下一步开发建议
1. 接入真实 GLB + AnimationSystem 播放角色动画
2. 实现子弹对象池（`utils/objectPool`）+ Rapier 传感器碰撞 → `enemy:die` 事件 → 计分
3. SpawnSystem 难度曲线（随 level 提升 spawnInterval/速度）
4. 玩家受击 → `gameStore.loseLife` → 归零进入 GameOver
5. 设置面板（音量滑块）接入 settingsStore
6. 关卡/波次系统与 BGM 切换
