/**
 * 作者聚合：从 POEMS 派生作者 → 诗列表。
 */
import { POEMS } from "../data/poems.js";

export const AUTHORS = (() => {
  const map = new Map();
  for (const p of POEMS) {
    if (!map.has(p.author)) map.set(p.author, []);
    map.get(p.author).push(p);
  }
  // 按作品数降序
  return [...map.entries()]
    .map(([name, poems]) => ({ name, poems, count: poems.length }))
    .sort((a, b) => b.count - a.count);
})();

export function getAuthor(name) {
  const found = AUTHORS.find((a) => a.name === name);
  return found || null;
}

/** 作者 ID（URL 用）：中文转拼音代价高，用序号 + 名称双段，或直接 encode 中文名 */
export function authorSlug(name) {
  return encodeURIComponent(name);
}

export function authorFromSlug(slug) {
  return getAuthor(decodeURIComponent(slug));
}
