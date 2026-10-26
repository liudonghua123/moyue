import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Scene from "../components/Scene.jsx";
import { POEMS } from "../data/poems.js";
import imgLandscape from "../assets/landscape.jpg";
import imgPavilion from "../assets/landscape-with-pavilion.jpg";
import imgMountain from "../assets/mountain-landscape.jpg";
import imgStream from "../assets/landscape-2.jpg";

const EASE = [0.32, 0.72, 0, 1];

/** 滚动进入：轻微上浮 + 模糊消散 */
const riseIn = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  show: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.9, ease: EASE },
  },
};

const GALLERY = [
  { cls: "g-a", src: imgLandscape, alt: "雾中山水，十六世纪水墨挂轴", cap: "雾中山水 · 狩野元信" },
  { cls: "g-b", src: imgPavilion, alt: "山水楼阁，十五世纪水墨挂轴", cap: "山水楼阁 · 賢江祥啓" },
  { cls: "g-c", src: imgMountain, alt: "群山楼阁，十八世纪水墨", cap: "群山楼阁 · 曾我萧白" },
  { cls: "g-d", src: imgStream, alt: "溪山楼观，十五世纪末水墨挂轴", cap: "溪山楼观 · 佚名" },
];

/** Hero 场景轮播：每 9 秒换一境，联动诗句 */
function useHeroScene() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % POEMS.length), 9000);
    return () => clearInterval(t);
  }, []);
  return i;
}

function Hero() {
  const idx = useHeroScene();
  const poem = POEMS[idx];
  return (
    <header className="hero" aria-label="首屏：四境轮播">
      <AnimatePresence mode="sync">
        <motion.div
          key={poem.id}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: EASE }}
          style={{ position: "absolute", inset: 0 }}
          aria-hidden="true"
        >
          <Scene sceneKey={poem.scene} />
        </motion.div>
      </AnimatePresence>

      <div className="hero-content">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15, delayChildren: 0.4 } } }}
        >
          <motion.h1
            className="hero-title"
            variants={{ hidden: { opacity: 0, y: 32 }, show: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE } } }}
          >
            一诗<span className="accent">一</span>境
          </motion.h1>
          <motion.p
            className="hero-sub"
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } } }}
          >
            走进唐诗发生的时刻。每一页只有一首诗：全屏动态画境，人物与山水各自动，还有一段朗读，替古人开口。
          </motion.p>
          <motion.div
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } } }}
          >
            <Link className="hero-cta" to={`/poem/${poem.id}`}>
              入「{poem.title}」之境
            </Link>
          </motion.div>
          <motion.div
            className="hero-verses"
            aria-live="off"
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 1.2, delay: 0.6 } } }}
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={poem.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.8, ease: EASE }}
              >
                {poem.lines[0]}
                <span className="hero-verses-rest">{poem.lines[1]}　{poem.lines[2]}　{poem.lines[3]}</span>
              </motion.p>
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* 境点：四境切换指示 */}
        <div className="hero-dots" role="presentation">
          {POEMS.map((p, k) => (
            <span key={p.id} className={k === idx ? "on" : ""} />
          ))}
        </div>
      </div>
    </header>
  );
}

/** 诗卷：场景缩略卡，每张卡内嵌对应动态画境 */
function Shelf() {
  return (
    <section className="shelf" id="shelf" aria-label="诗卷目录">
      <div className="wrap">
        <motion.div className="section-head" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} variants={riseIn}>
              <h2>诗卷</h2>
              <p>十四首诗，十四段时辰。点开一境，人在画中。</p>
        </motion.div>
        <div className="shelf-grid">
          {POEMS.map((p, i) => (
            <motion.div
              key={p.id}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={{ ...riseIn, show: { ...riseIn.show, transition: { ...riseIn.show.transition, delay: i * 0.08 } } }}
            >
              <Link className="scene-card" to={`/poem/${p.id}`} aria-label={`进入《${p.title}》`}>
                <div className="scene-card-art" aria-hidden="true">
                  <Scene sceneKey={p.scene} />
                  <span className="scene-card-time">{p.sceneTime}</span>
                </div>
                <div className="scene-card-body">
                  <h3>{p.title}</h3>
                  <p className="scene-card-author">{p.dynasty} · {p.author}</p>
                  <p className="scene-card-line">{p.lines[0]}{p.lines[1]}</p>
                  <span className="scene-card-go">入此境 →</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** 缘起标语：滚动进入时逐句点亮 */
function Tagline() {
  const phrases = ["诗不是用来背的，", "是用来住的。", "我们把每一首诗，", "还原成它发生的那一刻。"];
  return (
    <motion.blockquote
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.5 } } }}
    >
      {phrases.map((p) => (
        <motion.span
          key={p}
          variants={{
            hidden: { color: "var(--muted)" },
            show: { color: "var(--ink)", transition: { duration: 0.8, ease: EASE } },
          }}
        >
          {p}
        </motion.span>
      ))}
    </motion.blockquote>
  );
}

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">跳到主要内容</a>

      <nav className="site-nav" aria-label="站点导航">
        <Link className="brand" to="/">墨<em>月</em></Link>
        <div className="nav-links">
          <a href="#shelf">诗卷</a>
          <a href="#philosophy">缘起</a>
        </div>
      </nav>

      <main id="main">
        <Hero />
        <Shelf />

        {/* 画卷 · 馆藏真迹 */}
        <section className="gallery" id="gallery" aria-label="画卷：馆藏真迹">
          <div className="wrap">
            <motion.div className="section-head" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} variants={riseIn}>
              <h2>画卷</h2>
              <p>大都会艺术博物馆开放藏品中的山水真迹，与四首诗同游。</p>
            </motion.div>
            <div className="gallery-grid">
              {GALLERY.map((g) => (
                <motion.figure
                  key={g.src}
                  className={`g-item ${g.cls}`}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={riseIn}
                >
                  <img src={g.src} alt={g.alt} loading="lazy" width="1000" height="800" />
                  <figcaption>{g.cap}</figcaption>
                </motion.figure>
              ))}
            </div>
          </div>
        </section>

        {/* 缘起 */}
        <section className="philosophy" id="philosophy" aria-label="缘起">
          <div className="wrap">
            <Tagline />
            <motion.cite initial="hidden" whileInView="show" viewport={{ once: true }} variants={riseIn}>
              —— 墨月 · 编者的话
            </motion.cite>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-cols">
          <div>
            <h3>墨月</h3>
            <p>一诗一境的唐诗宋词读本。<br />目前收录十四首诗词，持续增补。</p>
          </div>
          <div>
            <h3>诗卷</h3>
            {POEMS.map((p) => (
              <p key={p.id}><Link to={`/poem/${p.id}`}>{p.title} · {p.author}</Link></p>
            ))}
          </div>
          <div>
            <h3>说明</h3>
            <p>朗读由浏览器语音合成提供，<br />各设备音色略有不同。<br />画卷为大都会艺术博物馆开放藏品。</p>
          </div>
        </div>
        <div className="footer-word" aria-hidden="true">诗中有画</div>
        <div className="footer-legal">© 2026 墨月 · 唐诗宋词 · MIT License · 画卷：大都会艺术博物馆开放藏品（公有领域）</div>
      </footer>
    </>
  );
}
