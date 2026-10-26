import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  </StrictMode>,
);
