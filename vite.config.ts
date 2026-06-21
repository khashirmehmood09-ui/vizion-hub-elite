import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    ssr: {
      external: [],
    },
  },
  nitro: {
    preset: "node-server",
    outDir: "dist/server",
    rollupConfig: {
      output: {
        entryFileNames: "index.js",
      },
    },
  },
});
