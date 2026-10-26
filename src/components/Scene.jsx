import { useEffect, useRef } from "react";
import { SCENES } from "../scenes/index.js";

/**
 * 场景背景：把注册的 SVG 以 dangerouslySetInnerHTML 注入并铺满容器。
 * 每首诗同时只渲染一份场景，SVG defs id 不会冲突。
 *
 * 滚动视差：进入视口的场景，bg / fg 两组随滚动各自缓移——
 * 背景走"天"的位移（慢、上移），人物走"地"的位移（较快、下沉），
 * 时间动画照常播放，两者叠加即"分离/独立变动"。
 * prefers-reduced-motion 时禁用。
 *
 * @param {{ sceneKey: string, className?: string }} props
 */
export default function Scene({ sceneKey, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // 进度：元素中心相对视口中心，-1（下方）→ 1（上方），屏内约 -1..1
      const p = Math.max(-1, Math.min(1, (r.top + r.height / 2 - vh / 2) / vh));
      const bg = el.querySelector("g.bg");
      const fg = el.querySelector("g.fg");
      if (bg) bg.style.transform = `translateY(${p * -46}px)`;
      if (fg) fg.style.transform = `translateY(${p * 34}px)`;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const svg = SCENES[sceneKey] ?? SCENES.moonlit;
  return (
    <div
      ref={ref}
      className={`scene ${className}`}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
