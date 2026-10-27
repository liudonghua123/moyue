/**
 * 主题管理：light（默认）/ dark
 * 持久化到 localStorage；读取由 index.html 内联脚本完成（防闪烁），
 * 这里只负责读写与 React 状态同步。
 */
import { useEffect, useState, useCallback } from "react";

const KEY = "moyue-theme";

export function getInitialTheme() {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(KEY, theme);
    } catch {
      /* 私密模式等存储不可用时静默降级 */
    }
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  return { theme, toggle };
}
