import moonlitRaw from "./moonlit.svg?raw";
import snowRiverRaw from "./snow-river.svg?raw";
import springDawnRaw from "./spring-dawn.svg?raw";
import sunsetTowerRaw from "./sunset-tower.svg?raw";

/**
 * 场景注册表：诗的 `scene` 字段 → 原始 SVG 字符串。
 * 场景 SVG 内含 <style> 的 CSS keyframes 动画（星闪、雪落、花瓣、水流、人物微动等）。
 * 新增画境：在 src/scenes/ 下加一个 .svg 文件并在此注册。
 */
export const SCENES = {
  moonlit: moonlitRaw,
  "snow-river": snowRiverRaw,
  "spring-dawn": springDawnRaw,
  "sunset-tower": sunsetTowerRaw,
};

/** 场景 key → 惟一 id 前缀（避免多实例 SVG defs id 冲突） */
export const sceneKeyOf = (key) => key in SCENES ? key : "moonlit";
