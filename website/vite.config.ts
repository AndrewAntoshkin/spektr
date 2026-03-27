import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  base: "/spektr/",
  plugins: [react()],
  resolve: {
    alias: {
      spektr: resolve(__dirname, "../src/index.tsx"),
    },
  },
});
