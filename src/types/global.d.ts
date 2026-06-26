/// <reference types="vite/client" />
/// <reference types="@react-three/fiber" />

interface ImportMetaEnv {
  readonly DEV: boolean
  readonly PROD: boolean
  readonly MODE: string
  readonly BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Allow importing static asset modules if needed.
declare module '*.glb' {
  const src: string
  export default src
}

declare module '*.ktx2' {
  const src: string
  export default src
}

declare module '*.hdr' {
  const src: string
  export default src
}

declare module '*.mp3' {
  const src: string
  export default src
}
