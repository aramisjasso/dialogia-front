import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';
import tsconfigPaths from "vite-tsconfig-paths"

dotenv.config();
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
})
