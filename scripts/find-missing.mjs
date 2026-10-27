/**
 * 比对唐诗三百首语料与现有 POEMS，输出缺失清单（含语料原文）。
 * 用 opencc-js 做繁→简转换后精确/包含匹配。
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenCC from 'opencc-js';
import { POEMS } from '../src/data/poems.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const corpus = JSON.parse(fs.readFileSync(path.join(__dirname, 'tangshi300.json'), 'utf8'));
const conv = OpenCC.Converter({ from: 't', to: 'cn' });

// 标题规范化：去乐府类前缀、去序号、去括号
function normTitle(t) {
  let s = conv(t);
  s = s.replace(/^(鼓吹曲辞|横吹曲辞|相和歌辞|清商曲辞|舞曲歌辞|琴曲歌辞|杂曲歌辞|近代曲辞|杂歌谣辞|新乐府辞)\s*/,'');
  s = s.replace(/[（(].*?[)）]/g, '');
  s = s.replace(/\s*[一二三四五六七八九十百千]+(首|章)?\s*([一二三四五六七八九十]+)?$/,'');
  s = s.replace(/[·\s]/g, '');
  return s;
}

const haveSet = new Set(POEMS.map(p => normTitle(p.title)));
const haveByAuthor = new Map(POEMS.map(p => [normTitle(p.title), p.author]));

const missing = [];
const matched = [];
for (const c of corpus) {
  const t = normTitle(c.title);
  const a = conv(c.author);
  const lines = c.paragraphs.map(p => conv(p));
  // 精确匹配
  if (haveSet.has(t) && haveByAuthor.get(t) === a) { matched.push({t, a}); continue; }
  // 包含匹配（如「出塞」vs「出塞其一」，或题名差异）
  let hit = false;
  for (const [ht, ha] of haveByAuthor) {
    if (ha !== a) continue;
    if ((ht.length >= 2 && (t.includes(ht) || ht.includes(t)))) { hit = true; break; }
  }
  if (hit) { matched.push({t, a, fuzzy: true}); continue; }
  // 首句匹配（标题差异大但首句一致）
  const l0 = lines[0]?.replace(/[，。！？、\s]/g, '').slice(0, 8);
  if (l0 && l0.length >= 4) {
    for (const p of POEMS) {
      const pl0 = (p.lines[0] || '').replace(/[，。！？、\s]/g, '').slice(0, 8);
      if (p.author === a && pl0 === l0) { hit = true; break; }
    }
  }
  if (hit) { matched.push({t, a, fuzzy: true}); continue; }
  missing.push({ title: t, origTitle: c.title, author: a, lines });
}

console.log('corpus:', corpus.length, '| matched:', matched.length, '| missing:', missing.length);
fs.writeFileSync(path.join(__dirname, 'missing-poems.json'), JSON.stringify(missing, null, 1));
console.log('--- missing list ---');
console.log(missing.map((m, i) => `${i + 1}. ${m.title} / ${m.author}`).join('\n'));
