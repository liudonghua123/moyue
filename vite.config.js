import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages 项目页部署在 /moyue/ 子路径下
  base: process.env.BASE_PATH ?? "/",
  build: {
    // 画卷是公有领域大图，压缩阈值放宽，避免小图被二次转 base64
    assetsInlineLimit: 0,
  },
});
