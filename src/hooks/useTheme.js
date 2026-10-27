/**
 * 主题管理：light（默认）/ dark
 * 持久化到 localStorage；读取由 index.html 内联脚本完成（防闪烁），
 * 这里只负责读写与 React 状态同步。
 */
import { useEffect, useState, useCallback } from "react";

const KEY = "moyue-theme";

/** 移动端浏览器 UI 配色随主题同步 */
const THEME_COLOR = { light: "#f5f1e8", dark: "#101418" };

export function getInitialTheme() {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    // theme-color meta：没有就建一个
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      document.head.appendChild(meta);
    }
    meta.content = THEME_COLOR[theme] || THEME_COLOR.light;
    try {
      localStorage.setItem(KEY, theme);
    } catch {
      /* 私密模式等存储不可用时静默降级 */
    }
  }, [theme]);

  const toggle = useCallback(() => {
    // 挂过渡类，500ms 后移除（与 CSS 过渡时长一致）
    const root = document.documentElement;
    root.classList.add("theme-anim");
    clearTimeout(root._themeAnimT);
    root._themeAnimT = setTimeout(() => root.classList.remove("theme-anim"), 520);
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  return { theme, toggle };
}
