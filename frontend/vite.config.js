import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Optimize JSX runtime
      jsxRuntime: 'automatic',
    })
  ],
  build: {
    // Target modern browsers for better optimization
    target: 'es2015',
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Optimize chunk size
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // React core libraries
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            // UI libraries
            if (id.includes('lucide-react') || id.includes('framer-motion')) {
              return 'ui-vendor';
            }
            // Utility libraries
            if (id.includes('axios') || id.includes('zustand') || id.includes('zod') || id.includes('dompurify')) {
              return 'utils';
            }
            // Mermaid diagram library (large, loaded on demand)
            if (id.includes('mermaid') || id.includes('dayjs')) {
              return 'diagram';
            }
            // Toast notifications
            if (id.includes('react-hot-toast')) {
              return 'toast';
            }
            // Other vendor libraries
            return 'vendor';
          }
        },
        // Optimize asset file names
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) return 'assets/[name]-[hash][extname]';
          
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return 'assets/images/[name]-[hash][extname]';
          } else if (/woff|woff2|eot|ttf|otf/i.test(ext)) {
            return 'assets/fonts/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
    chunkSizeWarningLimit: 3500,
    // Enable source maps for production debugging (optional)
    sourcemap: false,
    // Report compressed size
    reportCompressedSize: true,
  },
  // Optimize dependencies
  // IMPORTANT: mermaid must be in 'include' (not 'exclude') so Vite pre-bundles
  // it through its CJS->ESM transformer. Without this, mermaid's internal
  // dependency on dayjs (a CJS module) fails with:
  //   "dayjs.min.js does not provide an export named 'default'"
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'axios',
      'zustand',
      'mermaid', // pre-bundle mermaid so Vite wraps its CJS deps (dayjs) correctly
    ],
  },
  server: {
    port: 5173,
    strictPort: false,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
    }
  },
})
