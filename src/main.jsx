import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "./pages/Home.jsx";
import PoemPage from "./pages/PoemPage.jsx";
import "./index.css";

/** 路由切换时用 AnimatePresence 做页面过渡 */
function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/poem/:id" element={<PoemPage />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </AnimatePresence>
  );
}

// GitHub Pages 项目页部署在 /moyue/ 子路径且无服务端回退，
// 统一用 HashRouter：站内跳转永远是 /moyue/#/poem/xxx，不会丢 base 前缀。
// （404.html 仍保留，把旧的 /moyue/poem/xxx 路径转发到 hash 形式）
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter>
      <AnimatedRoutes />
    </HashRouter>
  </StrictMode>,
);
