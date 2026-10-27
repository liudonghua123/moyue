/**
 * 语料行格式 → 墨月 lines 格式。
 * 语料每元素是一联（"出句，对句。"），需拆成每短句一元素。
 * 输出 scripts/new-poems-draft.json：每首含 title/author/dynasty/lines/linesFormat
 * 后续由 AI 批量补 translation/appreciation/background/tags/scene。
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const poems = JSON.parse(fs.readFileSync(path.join(__dirname, 'missing-unique.json'), 'utf8'));

function splitLines(paragraphs) {
  // 每联 "XXXX，XXXX。" → ["XXXX，", "XXXX。"]
  const out = [];
  for (const p of paragraphs) {
    // 匹配所有以 ，。！？；结尾的短句
    const parts = p.match(/[^，。！？；]+[，。！？；]/g) || [p];
    out.push(...parts);
  }
  return out;
}

// 朝代推断：唐诗三百首全部为唐（含五代），明皇帝→唐
const draft = poems.map((p, i) => {
  const lines = splitLines(p.lines);
  return {
    n: i + 1,
    title: p.title,
    author: p.author,
    dynasty: '唐',
    lines,
    charCount: lines.join('').length,
  };
});

fs.writeFileSync(path.join(__dirname, 'new-poems-draft.json'), JSON.stringify(draft, null, 1));
console.log('draft count:', draft.length);
// 长诗（超 200 字）需要确认是否全文收录
const long = draft.filter(d => d.charCount > 240);
console.log('long poems (>240 chars):', long.length);
console.log(long.map(d => `${d.n}. ${d.title} / ${d.author} (${d.charCount}字)`).join('\n'));
