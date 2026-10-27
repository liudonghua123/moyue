/**
 * 把 new-poems-enriched.json 合并进 src/data/poems.js 与 src/data/categories.js。
 *
 * 产出：
 * - src/data/poems.js：现有 44 首 + 新 310 首 = 354 首
 * - src/data/categories.js：七分类全量重建（现有诗的分类保留，新诗用 cat 字段）
 *
 * 新诗 id 用 key（t300-xxx）；painting 缺省不填（画卷区显示会跳过）。
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const enriched = JSON.parse(fs.readFileSync(path.join(__dirname, 'new-poems-enriched.json'), 'utf8'));

// 读取现有 poems.js 提取 44 首原始对象（import 它并 JSON 序列化其字段）
const poemsSrc = fs.readFileSync(path.join(ROOT, 'src/data/poems.js'), 'utf8');

// 用动态 import 读取现有数据
const { POEMS } = await import('../src/data/poems.js');
const { CATEGORIES } = await import('../src/data/categories.js');

// ---- 1. 构建新诗对象 ----
function jsStr(s) {
  return JSON.stringify(s).replace(/\\u/g, '\\u');
}

const newEntries = enriched.map((p) => {
  const lines = p.lines.map(jsStr).join(', ');
  const tags = (p.tags || []).map(jsStr).join(', ');
  return `  {
    id: ${jsStr(p.key)},
    scene: ${jsStr(p.scene)},
    title: ${jsStr(p.title)},
    dynasty: ${jsStr(p.dynasty || '唐')},
    author: ${jsStr(p.author)},
    lines: [${lines}],
    translation: ${jsStr(p.translation)},
    appreciation: ${jsStr(p.appreciation)},
    background: ${jsStr(p.background)},
    tags: [${tags}],
    sceneTime: ${jsStr(p.sceneTime)},
    sceneDesc: ${jsStr(p.sceneDesc)},
  },`;
});

const existingEntries = POEMS.map((p) => {
  const fields = [];
  fields.push(`    id: ${jsStr(p.id)},`);
  fields.push(`    scene: ${jsStr(p.scene)},`);
  fields.push(`    title: ${jsStr(p.title)},`);
  fields.push(`    dynasty: ${jsStr(p.dynasty)},`);
  fields.push(`    author: ${jsStr(p.author)},`);
  fields.push(`    lines: [${p.lines.map(jsStr).join(', ')}],`);
  fields.push(`    translation: ${jsStr(p.translation)},`);
  fields.push(`    appreciation: ${jsStr(p.appreciation)},`);
  fields.push(`    background: ${jsStr(p.background)},`);
  fields.push(`    tags: [${p.tags.map(jsStr).join(', ')}],`);
  fields.push(`    sceneTime: ${jsStr(p.sceneTime)},`);
  fields.push(`    sceneDesc: ${jsStr(p.sceneDesc)},`);
  if (p.painting) {
    fields.push(`    painting: { src: ${jsStr(p.painting.src)}, caption: ${jsStr(p.painting.caption)} },`);
  }
  return '  {\n' + fields.join('\n') + '\n  },';
});

const poemsOut = `/**
 * 诗词数据库。
 *
 * 结构：POEMS = [原 44 首精选] + [唐诗三百首批量收录 310 首]
 * - t300-xxx 开头的 id 为唐诗三百首批量收录条目。
 * - 每首含 id/scene/title/dynasty/author/lines/translation/appreciation/background/tags/sceneTime/sceneDesc，
 *   部分原精选条目含 painting（馆藏画卷）。
 *
 * @typedef {Object} Poem
 * @property {string} id          唯一 id，用于路由 /poem/:id
 * @property {string} scene       场景 key（scenes/index.js）
 * @property {string} title       诗题
 * @property {string} dynasty     朝代
 * @property {string} author      作者
 * @property {string[]} lines     诗句（逐句）
 * @property {string} translation 白话译文
 * @property {string} appreciation 赏析
 * @property {string} background  创作背景
 * @property {string[]} tags      主题标签
 * @property {string} sceneTime   时辰角标
 * @property {string} sceneDesc   场景字幕
 * @property {{src: string, caption: string}} [painting] 配图
 *
 * @type {Poem[]}
 */
export const POEMS = [
${existingEntries.join('\n')}
${newEntries.join('\n')}
];

export function getPoem(id) {
  return POEMS.find((p) => p.id === id);
}
`;

fs.writeFileSync(path.join(ROOT, 'src/data/poems.js'), poemsOut);
console.log('poems.js written:', POEMS.length, '+', newEntries.length, '=', POEMS.length + newEntries.length);

// ---- 2. 重建 categories.js ----
// 现有 44 首的分类（从旧 CATEGORIES 提取）
const oldCatOf = {};
for (const c of CATEGORIES) for (const id of c.ids) oldCatOf[id] = c.key;

const CAT_META = {
  moon: { label: '望月', en: 'MOON', desc: '月光落在床前、洞庭与杯盏之间' },
  landscape: { label: '山水', en: 'LANDSCAPE', desc: '山川入眼，天地入怀' },
  season: { label: '四时', en: 'SEASONS', desc: '春雨夏荷秋枫冬雪，季节的信' },
  frontier: { label: '边塞', en: 'FRONTIER', desc: '羌笛、大雪与未还之人' },
  idyll: { label: '田园', en: 'IDYLL', desc: '村烟、牧童与荷锄的黄昏' },
  parting: { label: '离别', en: 'PARTING', desc: '柳色、孤帆与劝君更尽一杯酒' },
  history: { label: '怀古咏怀', en: 'REFLECTION', desc: '兴亡之叹与不屈之志' },
};

// 归组：按现有顺序，新诗按 enriched 顺序
const groups = { moon: [], landscape: [], season: [], frontier: [], idyll: [], parting: [], history: [] };
for (const p of POEMS) {
  const c = oldCatOf[p.id];
  if (c && groups[c]) groups[c].push(p.id);
}
for (const p of enriched) {
  const c = groups[p.cat] ? p.cat : 'landscape';
  groups[c].push(p.key);
}

const catEntries = Object.entries(groups)
  .filter(([, ids]) => ids.length)
  .map(([key, ids]) => {
    const m = CAT_META[key];
    return `  {
    key: ${JSON.stringify(key)},
    label: ${JSON.stringify(m.label)},
    en: ${JSON.stringify(m.en)},
    desc: ${JSON.stringify(m.desc)},
    ids: [
${ids.map((id) => '      ' + JSON.stringify(id) + ',').join('\n')}
    ],
  },`;
  });

const catOut = `/**
 * 诗词分类体系。
 *
 * 七大类覆盖全部诗词，每首恰归一类（主分类，单选）。
 * 新增诗时在 CATEGORIES 对应 cat 的 ids 里补 id 即可。
 *
 * @typedef {Object} Category
 * @property {string} key   分类键
 * @property {string} label 分类名
 * @property {string} en    英文小注
 * @property {string} desc  一句话描述
 * @property {string[]} ids 归入该分类的诗 id 列表
 */

export const CATEGORIES = [
${catEntries.join('\n')}
];

import { POEMS } from "./poems.js";

/** 校验：无遗漏、无重复（开发期调用） */
export function validateCategories() {
  const all = CATEGORIES.flatMap((c) => c.ids);
  const dup = all.filter((id, i) => all.indexOf(id) !== i);
  const missing = POEMS.map((p) => p.id).filter((id) => !all.includes(id));
  return { dup, missing };
}

/** 由诗 id 反查所属分类 */
export const CATEGORY_OF = (() => {
  const map = {};
  for (const c of CATEGORIES) for (const id of c.ids) map[id] = c.key;
  return map;
})();

export function getCategoryOf(poemId) {
  return CATEGORY_OF[poemId] || null;
}

export function getCategory(key) {
  return CATEGORIES.find((c) => c.key === key) || null;
}
`;

fs.writeFileSync(path.join(ROOT, 'src/data/categories.js'), catOut);
console.log('categories.js written');
for (const [k, v] of Object.entries(groups)) console.log(' ', k, v.length);
