import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Member 2: set `base` to `/<repository-name>/` before GitHub Pages deployment.
export default defineConfig({
  plugins: [react()],
  base: '/study-planner-midterm/',
});
