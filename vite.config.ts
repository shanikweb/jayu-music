import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration for the JAYU Music project.  React support is
// provided via the official plugin.  See https://vitejs.dev/ for
// configuration details.
export default defineConfig({
  plugins: [react()],
});