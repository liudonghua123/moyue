import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import Scene from "../components/Scene.jsx";
import { authorFromSlug } from "../data/authors.js";
import ThemeToggle from "../components/ThemeToggle.jsx";
import { useEffect } from "react";

const EASE = [0.32, 0.72, 0, 1];

const riseIn = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  show: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.9, ease: EASE },
  },
};

/** 作者页顶栏：返回 + 标题 */
function AuthorTopbar({ name }) {
  return (
    <nav className="poem-topbar" aria-label="作者页导航">
      <Link className="back" to="/" aria-label="回到诗卷">←</Link>
      <span className="switch-toggle" aria-current="page">
        <span className="switch-now">{name}</span>
      </span>
      <ThemeToggle />
    </nav>
  );
}

/** 一首诗的横条 */
function PoemRow({ poem }) {
  return (
    <motion.div variants={riseIn} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }}>
      <Link className="poem-row" to={`/poem/${poem.id}`}>
        <div className="poem-row-inner">
          <h3 className="poem-row-title">{poem.title}</h3>
          <p className="poem-row-first">{poem.lines[0]}</p>
          <span className="poem-row-go">入此境 →</span>
        </div>
      </Link>
    </motion.div>
  );
}

export default function AuthorPage() {
  const { slug } = useParams();
  const author = authorFromSlug(slug);

  useEffect(() => {
    document.title = author ? `${author.name} · 诗作 ${author.count} 首 · 墨月` : "作者 · 墨月";
  }, [author]);

  if (!author) {
    return (
      <main className="author-page" id="main">
        <AuthorTopbar name="未找到" />
        <div className="wrap author-head" style={{ paddingTop: 140 }}>
          <h1>这位诗人还没收录</h1>
          <p className="author-meta"><Link to="/">回到诗卷</Link></p>
        </div>
      </main>
    );
  }

  const { name, poems, count } = author;
  // 朝代去重（同一作者理论上一朝）
  const dynasty = poems[0]?.dynasty;

  return (
    <main className="author-page" id="main">
      <AuthorTopbar name={name} />

      <header className="wrap author-head">
        <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } } }}>
          <motion.p className="author-dynasty" variants={riseIn}>{dynasty}</motion.p>
          <motion.h1 className="author-name" variants={riseIn}>{name}</motion.h1>
          <motion.p className="author-meta" variants={riseIn}>
            收录诗作 {count} 首
            {count >= 10 && ` · 唐诗三百首中的重要身影`}
          </motion.p>
        </motion.div>
      </header>

      {/* 作者代表场景：用其第一首诗的场景做横幅 */}
      <div className="author-hero" aria-hidden="true">
        <Scene sceneKey={poems[0].scene} />
        <div className="author-hero-veil" />
        <motion.p className="author-hero-line" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.4, delay: 0.5 }}>
          {poems[0].lines[0]}
        </motion.p>
      </div>

      <section className="wrap author-list" aria-label={`${name}的诗作`}>
        {poems.map((p) => <PoemRow key={p.id} poem={p} />)}
      </section>

      <footer className="site-footer">
        <div className="footer-cols">
          <div>
            <h3>墨月</h3>
            <p>一诗一境的唐诗宋词读本。<br />{name}诗作 {count} 首。</p>
          </div>
          <div>
            <h3>诗卷</h3>
            <p><Link to="/">全部诗词 · 分类浏览</Link></p>
          </div>
          <div>
            <h3>说明</h3>
            <p>朗读由浏览器语音合成提供，<br />各设备音色略有不同。</p>
          </div>
        </div>
        <div className="footer-legal">© 2026 墨月 · 唐诗宋词 · MIT License</div>
      </footer>
    </main>
  );
}
