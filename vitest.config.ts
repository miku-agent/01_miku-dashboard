import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/lib/setupTests.ts"],
    exclude: ["**/node_modules/**", "**/e2e/**"], // 🎹 Playwright 무대는 Vitest가 건드리지 않게! 🎷
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
