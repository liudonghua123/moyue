/**
 * 把 8 个 enrich batch 合并回完整数据。
 * 校验：每首 translation/appreciation/background/sceneDesc 非空、tags 非空。
 * 输出 scripts/new-poems-enriched.json
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const files = fs.readdirSync(__dirname).filter(f => /^enrich-batch-\d+\.json$/.test(f)).sort();
const all = [];
for (const f of files) {
  const arr = JSON.parse(fs.readFileSync(path.join(__dirname, f), 'utf8'));
  all.push(...arr);
  console.log(f, arr.length);
}
console.log('total:', all.length);

// 校验
const problems = [];
for (const p of all) {
  if (!p.translation?.trim()) problems.push(p.key + ' translation');
  if (!p.appreciation?.trim()) problems.push(p.key + ' appreciation');
  if (!p.background?.trim()) problems.push(p.key + ' background');
  if (!p.sceneDesc?.trim()) problems.push(p.key + ' sceneDesc');
  if (!p.tags?.length) problems.push(p.key + ' tags');
}
if (problems.length) {
  console.error('PROBLEMS:', problems.length);
  console.error(problems.slice(0, 30).join('\n'));
  process.exit(1);
}
fs.writeFileSync(path.join(__dirname, 'new-poems-enriched.json'), JSON.stringify(all, null, 1));
console.log('OK → new-poems-enriched.json');
