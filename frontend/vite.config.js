import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  build: {
    // Target modern browsers for better optimization
    target: 'es2020',
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Enable source maps for production debugging (optional, set to false for smaller builds)
    sourcemap: false,
    // Report compressed size
    reportCompressedSize: true,
    // Optimize chunk size
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // React core libraries (most critical)
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
            // Mermaid diagram library (large, lazy loaded)
            if (id.includes('mermaid') || id.includes('dayjs')) {
              return 'diagram';
            }
            // Toast notifications
            if (id.includes('react-hot-toast')) {
              return 'toast';
            }
            // PDF export libraries (lazy loaded)
            if (id.includes('jspdf') || id.includes('html2canvas')) {
              return 'pdf';
            }
            // Supabase
            if (id.includes('@supabase')) {
              return 'supabase';
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
          } else if (/css/i.test(ext)) {
            return 'assets/css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
  },
  // Optimize dependencies - pre-bundle for faster cold starts
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'axios',
      'zustand',
      'mermaid', // pre-bundle mermaid so Vite wraps its CJS deps (dayjs) correctly
      'react-hot-toast',
      'dompurify',
      'zod',
    ],
    // Force optimization even if already cached
    force: false,
  },
  server: {
    port: 5173,
    host: true,
  },
})
