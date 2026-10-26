# 墨月 · 唐诗宋词

一诗一境的沉浸式唐诗读本。每页只有一首诗：全屏动态 SVG 山水场景、切合诗境的 motion 动画、Web Speech 朗读。

**在线体验：https://liudonghua123.github.io/moyue/**

## ✨ 特性

- 🏞️ **一诗一境** — 每首诗配一个手绘 SVG 动态场景：静夜思的月夜望月人、江雪的寒江蓑笠翁、春晓的落花庭院、登鹳雀楼的落日黄河
- 🎬 **Motion 动画** — Framer Motion 驱动：场景 crossfade 进场、诗卡分层入场、滚动渐显、缘起标语逐句点亮
- 🔊 **朗读** — Web Speech API 慢速中文朗读，逐句高亮，Esc 停止
- 🖼️ **馆藏画卷** — 大都会艺术博物馆 Open Access 公有领域水墨真迹与诗互映
- 📱 **响应式** — 桌面 / 平板 / 手机三端适配，`prefers-reduced-motion` 无障碍回退

## 🚀 快速开始

```bash
git clone https://github.com/liudonghua123/moyue.git
cd moyue
npm install
npm run dev
```

## 🏗️ 技术栈

- [Vite](https://vite.dev/) + [React 19](https://react.dev/)
- [Framer Motion](https://motion.dev/) — 页面过渡与滚动编排
- [React Router](https://reactrouter.com/) — `/poem/:id` 路由
- 原生 CSS（自定义属性 + keyframes），SVG 以 `?raw` 导入注入

## 📁 目录结构

```
src/
├── data/poems.js        诗词数据库 ← 新增诗在这里加一个对象
├── data/paintings.js    画卷文件名 → 打包 URL 映射
├── scenes/*.svg         四个画境（星月/雪江/春晨/落日山河）
├── scenes/index.js      场景注册表
├── components/Scene.jsx 场景背景组件
├── hooks/useSpeech.js   朗读引擎（逐句高亮）
└── pages/               Home（诗卷） / PoemPage（诗境页）
```

## ✍️ 新增一首诗

在 `src/data/poems.js` 的 `POEMS` 数组加一个对象即可，页面、路由、导航自动生成：

```js
{
  id: "wang-yue",            // 路由 /poem/wang-yue
  scene: "moonlit",          // 场景 key（SCENES 注册表里的键）
  title: "望岳",
  dynasty: "唐",
  author: "杜甫",
  lines: ["岱宗夫如何？", "齐鲁青未了。", "荡胸生曾云，", "决眦入归鸟。"],
  translation: "…",
  appreciation: "…",
  background: "…",
  tags: ["山河", "壮志"],
  sceneDesc: "场景字幕：一句话描述画面",
  painting: { src: "landscape.jpg", caption: "画卷名 · 作者（来源）" },
}
```

需要新画境时：在 `src/scenes/` 加一个 `.svg`（约定 `viewBox="0 0 1600 900"`，内部 `<style>` 写 CSS 动画），并在 `scenes/index.js` 注册。

## 📦 部署

GitHub Pages 已配置好（`.github/workflows/deploy.yml`），推送到 `main` 即自动构建发布到 `gh-pages`。

手动部署到其他子路径时：

```bash
BASE_PATH=/你的子路径/ npm run build
```

## 📄 许可

代码以 [MIT](./LICENSE) 许可发布。

诗词本身为公有领域古籍；画卷为大都会艺术博物馆 Open Access 公有领域藏品（CC0），来源与链接见 [LICENSE](./LICENSE) 附注。
