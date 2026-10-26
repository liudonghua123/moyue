import { SCENES } from "../scenes/index.js";

/**
 * 场景背景：把注册的 SVG 以 dangerouslySetInnerHTML 注入并铺满容器。
 * 每首诗同时只渲染一份场景，SVG defs id 不会冲突。
 *
 * @param {{ sceneKey: string, className?: string }} props
 */
export default function Scene({ sceneKey, className = "" }) {
  const svg = SCENES[sceneKey] ?? SCENES.moonlit;
  return (
    <div
      className={`scene ${className}`}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
