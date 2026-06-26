import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import compression from 'vite-plugin-compression'
import { resolve } from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // gzip
    compression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024,
      deleteOriginFile: false
    }),
    // brotli
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 1024,
      deleteOriginFile: false
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'manifest.json'],
      manifest: {
        name: 'R3F Mobile Game',
        short_name: 'R3FGame',
        description: 'Mobile H5 3D game built with React Three Fiber',
        theme_color: '#0b0e14',
        background_color: '#0b0e14',
        display: 'fullscreen',
        orientation: 'any',
        start_url: '/',
        icons: []
      },
      workbox: {
        // Cache the heavy 3D / media assets.
        maximumFileSizeToCacheInBytes: 20 * 1024 * 1024,
        globPatterns: ['**/*.{js,css,html,glb,ktx2,mp3,png,wasm,json,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /\.(?:glb|ktx2|hdr)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'model-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 }
            }
          },
          {
            urlPattern: /\.(?:mp3|ogg|wav)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'audio-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|webp|svg)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  optimizeDeps: {
    // WASM module must not be pre-bundled.
    exclude: ['@dimforge/rapier3d-compat']
  },
  server: {
    host: '0.0.0.0',
    port: 3000
  },
  build: {
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          three: ['three', '@react-three/fiber', '@react-three/drei'],
          physics: ['@react-three/rapier', '@dimforge/rapier3d-compat'],
          postprocess: ['@react-three/postprocessing']
        }
      }
    }
  }
})
