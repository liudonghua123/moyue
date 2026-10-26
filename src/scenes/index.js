import moonlitRaw from "./moonlit.svg?raw";
import snowRiverRaw from "./snow-river.svg?raw";
import springDawnRaw from "./spring-dawn.svg?raw";
import sunsetTowerRaw from "./sunset-tower.svg?raw";
import waterfallRaw from "./waterfall.svg?raw";
import gorgeMorningRaw from "./gorge-morning.svg?raw";
import frostFerryRaw from "./frost-ferry.svg?raw";
import autumnSlopeRaw from "./autumn-slope.svg?raw";
import rainPathRaw from "./rain-path.svg?raw";
import springRainRaw from "./spring-rain.svg?raw";
import lotusLakeRaw from "./lotus-lake.svg?raw";
import midAutumnRaw from "./mid-autumn.svg?raw";
import duskBoatRaw from "./dusk-boat.svg?raw";
import winterPlumRaw from "./winter-plum.svg?raw";

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
  waterfall: waterfallRaw,
  "gorge-morning": gorgeMorningRaw,
  "frost-ferry": frostFerryRaw,
  "autumn-slope": autumnSlopeRaw,
  "rain-path": rainPathRaw,
  "spring-rain": springRainRaw,
  "lotus-lake": lotusLakeRaw,
  "mid-autumn": midAutumnRaw,
  "dusk-boat": duskBoatRaw,
  "winter-plum": winterPlumRaw,
};

/** 场景 key → 惟一 id 前缀（避免多实例 SVG defs id 冲突） */
export const sceneKeyOf = (key) => key in SCENES ? key : "moonlit";
