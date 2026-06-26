import { cp, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'

const tasks = [
  { from: 'node_modules/three/examples/jsm/libs/draco/', to: 'public/assets/draco/' },
  { from: 'node_modules/three/examples/jsm/libs/basis/', to: 'public/assets/basis/' }
]

for (const { from, to } of tasks) {
  if (existsSync(from)) {
    await mkdir(to, { recursive: true })
    await cp(from, to, { recursive: true })
    console.log(`\u2713 Copied ${from} \u2192 ${to}`)
  } else {
    console.warn(`\u26a0 Source not found, skipped: ${from}`)
  }
}
