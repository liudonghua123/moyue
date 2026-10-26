import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Scene from "../components/Scene.jsx";
import { POEMS, getPoem } from "../data/poems.js";
import { CATEGORIES } from "../data/categories.js";
import { PAINTING_URLS } from "../data/paintings.js";
import { useSpeech } from "../hooks/useSpeech.js";

const EASE = [0.32, 0.72, 0, 1];

/** 诗牌内部元素的入场节奏 */
const cardItem = {
  hidden: { opacity: 0, y: 24 },
  show: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.9, ease: EASE, delay: 0.25 + i * 0.12 },
  }),
};

const TABS = [
  { key: "translation", label: "译" },
  { key: "appreciation", label: "赏" },
  { key: "background", label: "背景" },
  { key: "painting", label: "画卷" },
];

export default function PoemPage() {
  const { id } = useParams();
  const poem = getPoem(id);
  const { playing, speakingIndex, toggle } = useSpeech(poem);
  const [tab, setTab] = useState("translation");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [switchOpen, setSwitchOpen] = useState(false);
  const currentRef = useRef(null);

  // 展开切换器时把当前诗滚到中间
  useEffect(() => {
    if (switchOpen && currentRef.current) {
      currentRef.current.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
    }
  }, [switchOpen]);

  // 切诗时收起抽屉与切换器并回到第一个标签
  useEffect(() => {
    setDrawerOpen(false);
    setTab("translation");
    setSwitchOpen(false);
  }, [poem.id]);

  useEffect(() => {
    document.title = `${poem.title} · ${poem.author} · 墨月`;
  }, [poem]);

  // Esc 关闭抽屉与切换器
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setDrawerOpen(false);
        setSwitchOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="poem-page">
      {/* 场景：按诗切换，crossfade 进场 */}
      <motion.div
        key={poem.id}
        className="scene-holder"
        style={{ position: "absolute", inset: 0 }}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: EASE }}
      >
        <Scene sceneKey={poem.scene} />
      </motion.div>

      <div className="scene-caption" aria-hidden="true">{poem.sceneDesc}</div>

      {/* 诗牌：居左，让画面呼吸 */}
      <motion.article
        className="poem-card"
        aria-live="polite"
        initial={{ opacity: 0, x: -32, filter: "blur(8px)" }}
        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
        transition={{ duration: 1.1, ease: EASE, delay: 0.15 }}
      >
        <motion.h1 className="poem-title" custom={0} variants={cardItem} initial="hidden" animate="show">
          {poem.title}
        </motion.h1>
        <motion.p className="poem-byline" custom={1} variants={cardItem} initial="hidden" animate="show">
          {poem.dynasty} · <b>{poem.author}</b>
        </motion.p>
        <motion.ol className="poem-lines" custom={2} variants={cardItem} initial="hidden" animate="show">
          {poem.lines.map((line, i) => (
            <li key={i} className={speakingIndex === i ? "speaking" : ""}>{line}</li>
          ))}
        </motion.ol>
        <motion.p className="poem-first-feel" custom={3} variants={cardItem} initial="hidden" animate="show">
          {poem.translation.split("。")[0]}。
        </motion.p>
      </motion.article>

      {/* 释义抽屉开关 */}
      <motion.button
        className={`drawer-toggle ${drawerOpen ? "open" : ""}`}
        onClick={() => setDrawerOpen((v) => !v)}
        aria-expanded={drawerOpen}
        aria-controls="poem-drawer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.9 }}
      >
        {drawerOpen ? "收起" : "释义"}
      </motion.button>

      {/* 释义抽屉：译 / 赏 / 背景 / 画卷 */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.aside
            id="poem-drawer"
            className="poem-drawer"
            initial={{ x: "105%" }}
            animate={{ x: 0 }}
            exit={{ x: "105%" }}
            transition={{ duration: 0.7, ease: EASE }}
            aria-label={`${poem.title} 释义`}
          >
            <div className="drawer-tabs" role="tablist" aria-label="释义分类">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  role="tab"
                  aria-selected={tab === t.key}
                  className={tab === t.key ? "active" : ""}
                  onClick={() => setTab(t.key)}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="drawer-body" role="tabpanel">
              {tab === "painting" ? (
                poem.painting && (
                  <figure className="drawer-painting">
                    <img
                      src={PAINTING_URLS[poem.painting.src]}
                      alt={poem.painting.caption}
                      loading="lazy"
                      width="1000"
                      height="800"
                    />
                    <figcaption>{poem.painting.caption}</figcaption>
                  </figure>
                )
              ) : (
                <p>{poem[tab]}</p>
              )}
            </div>
            <div className="drawer-tags">
              {poem.tags.map((t) => <span key={t}>{t}</span>)}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <nav className={`poem-topbar ${switchOpen ? "open" : ""}`} aria-label="诗页导航">
        <Link className="back" to="/" aria-label="回到诗卷">←</Link>
        <button
          className="switch-toggle"
          onClick={() => setSwitchOpen((v) => !v)}
          aria-expanded={switchOpen}
          aria-controls="poem-switch"
        >
          <span className="switch-now">{poem.title}</span>
          <span className="switch-caret" aria-hidden="true">▾</span>
        </button>
        {/* 诗签条：按分类分组的横滑列 */}
        <div className="poem-switch" id="poem-switch" aria-hidden={!switchOpen}>
          <div className="poem-switch-scroll">
            {CATEGORIES.map((cat) => {
              const poems = cat.ids
                .map((pid) => POEMS.find((p) => p.id === pid))
                .filter(Boolean);
              return (
                <div className="poem-switch-group" key={cat.key}>
                  <p className="poem-switch-cat">{cat.label}</p>
                  <div className="poem-switch-rail">
                    {poems.map((p, i) => (
                      <Link
                        key={p.id}
                        to={`/poem/${p.id}`}
                        className={p.id === poem.id ? "current" : ""}
                        aria-current={p.id === poem.id ? "page" : undefined}
                        onClick={() => setSwitchOpen(false)}
                        ref={p.id === poem.id ? (el) => { currentRef.current = el; } : undefined}
                      >
                        {p.title}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </nav>

      <motion.button
        className={`speak-btn ${playing ? "playing" : ""}`}
        onClick={toggle}
        aria-label={playing ? "停止朗读" : "朗读这首诗"}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.8 }}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
      >
        <svg className="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M8 5.5v13l11-6.5z" />
        </svg>
        <span className="wave" aria-hidden="true"><i /><i /><i /><i /></span>
        <span>{playing ? "停" : "朗读"}</span>
      </motion.button>
    </div>
  );
}
