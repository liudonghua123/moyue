import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Scene from "../components/Scene.jsx";
import { POEMS, getPoem } from "../data/poems.js";
import { PAINTING_URLS } from "../data/paintings.js";
import { useSpeech } from "../hooks/useSpeech.js";

const EASE = [0.32, 0.72, 0, 1];

/** 诗卡内部元素的入场节奏 */
const cardItem = {
  hidden: { opacity: 0, y: 24 },
  show: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.9, ease: EASE, delay: 0.25 + i * 0.12 },
  }),
};

export default function PoemPage() {
  const { id } = useParams();
  const poem = getPoem(id);
  const { playing, speakingIndex, toggle } = useSpeech(poem);

  useEffect(() => {
    document.title = `${poem.title} · ${poem.author} · 墨月`;
  }, [poem]);

  const idx = POEMS.indexOf(poem);

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

      <motion.article
        className="poem-card"
        aria-live="polite"
        initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
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
        <motion.div className="poem-details" custom={3} variants={cardItem} initial="hidden" animate="show">
          <div className="detail">
            <h3>译</h3>
            <p>{poem.translation}</p>
          </div>
          <div className="detail">
            <h3>赏</h3>
            <p>{poem.appreciation}</p>
          </div>
          <div className="detail">
            <h3>背景</h3>
            <p>{poem.background}</p>
          </div>
        </motion.div>
        <motion.div className="poem-tags" custom={4} variants={cardItem} initial="hidden" animate="show">
          {poem.tags.map((t) => <span key={t}>{t}</span>)}
        </motion.div>
        {poem.painting && (
          <motion.figure className="poem-painting" custom={5} variants={cardItem} initial="hidden" animate="show">
            <img src={PAINTING_URLS[poem.painting.src]} alt={poem.painting.caption} loading="lazy" width="1000" height="800" />
            <figcaption>{poem.painting.caption}</figcaption>
          </motion.figure>
        )}
      </motion.article>

      <nav className="poem-topbar" aria-label="诗页导航">
        <Link className="back" to="/">← 回到诗卷</Link>
        <div className="poem-switch">
          {POEMS.map((p, i) => (
            <Link
              key={p.id}
              to={`/poem/${p.id}`}
              className={i === idx ? "current" : ""}
              aria-current={i === idx ? "page" : undefined}
            >
              {p.title}
            </Link>
          ))}
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
