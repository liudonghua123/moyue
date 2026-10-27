import { useTheme } from "../hooks/useTheme.js";

/** 主题切换：岛式导航里的圆形玻璃按钮，日/月字形 */
export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";
  return (
    <button
      className="theme-toggle"
      onClick={toggle}
      aria-label={dark ? "切换到日间模式" : "切换到夜间模式"}
      aria-pressed={dark}
      title={dark ? "日间模式" : "夜间模式"}
    >
      {dark ? "日" : "月"}
    </button>
  );
}
