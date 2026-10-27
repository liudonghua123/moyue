/**
 * Step 1: 把语料 tags 融入 skeleton（过滤掉「唐诗三百首」「初中古诗」等通用标签）。
 * Step 2: 把 skeleton 合入 poems.js（translation 等留空 -> 先用占位生成可运行版本）。
 *
 * 实际正文文案由 AI 分批写入 scripts/enrich-*.json 后，由 merge-poems.mjs 合并。
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenCC from 'opencc-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const conv = OpenCC.Converter({ from: 't', to: 'cn' });
const corpus = JSON.parse(fs.readFileSync(path.join(__dirname, 'tangshi300.json'), 'utf8'));
const skeleton = JSON.parse(fs.readFileSync(path.join(__dirname, 'new-poems-skeleton.json'), 'utf8'));

const GENERIC = new Set(['唐诗三百首', '初中古诗', '小学古诗', '八年级下册(课外)', '隋・唐・五代', '古诗三百首', '唐诗三百首全集']);

// 建立 corpus 标题→tags 映射（转简体）
function normTitle(t) {
  let s = conv(t);
  s = s.replace(/^(鼓吹曲辞|横吹曲辞|相和歌辞|清商曲辞|舞曲歌辞|琴曲歌辞|杂曲歌辞|近代曲辞|杂歌谣辞|新乐府辞)\s*/, '');
  s = s.replace(/[（(].*?[)）]/g, '');
  s = s.replace(/\s*[一二三四五六七八九十百千]+(首|章)?\s*([一二三四五六七八九十]+)?$/, '');
  s = s.replace(/[·\s]/g, '');
  return s;
}
const corpusTags = new Map();
for (const c of corpus) {
  const t = normTitle(c.title);
  const tags = (c.tags || []).filter(x => !GENERIC.has(x)).map(x => conv(x));
  corpusTags.set(t + '|' + conv(c.author), tags);
}

// 匹配 skeleton
let withTags = 0;
for (const p of skeleton) {
  const direct = corpusTags.get(p.title + '|' + p.author);
  if (direct && direct.length) { p.tags = direct.slice(0, 4); withTags++; }
}
console.log('skeleton:', skeleton.length, '| got corpus tags:', withTags);

fs.writeFileSync(path.join(__dirname, 'new-poems-skeleton.json'), JSON.stringify(skeleton, null, 1));
console.log('updated skeleton written');
