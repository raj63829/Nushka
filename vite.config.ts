import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      "/api": {
        target: "http://casper-ai-573fqmg7wa-uc.a.run.app",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },

  build: {
    outDir: "dist",
    // Optional: modern target for latest Node + browsers
    target: "esnext",
    sourcemap: true,
  },

  define: {
    "process.env": {}, // avoids issues if using dotenv or env vars in functions
  },
});
