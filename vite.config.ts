import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration for the JAYU Music project.
// - base: ensures assets resolve correctly on GitHub Pages under /jayu-music/
// - build.outDir: output to docs/ so Pages can serve from main branch
export default defineConfig({
  base: '/jayu-music/',
  plugins: [react()],
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },
});
