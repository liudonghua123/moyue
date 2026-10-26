/**
 * 诗词分类体系。
 *
 * 七大类覆盖全部 44 首，每首恰归一类（主分类，单选）。
 * 分类按「意境」划分而非严格体裁，便于浏览与教学场景使用。
 * 新增诗时在 CATEGORIES 对应 cat 的 ids 里补 id 即可；
 * validate() 会在开发期校验遗漏与重复。
 *
 * @typedef {Object} Category
 * @property {string} key   分类键，用于路由与筛选
 * @property {string} label 分类名
 * @property {string} en    英文小注（装饰）
 * @property {string} desc  一句话描述（下拉面板用）
 * @property {string[]} ids 归入该分类的诗 id 列表（按 POEMS 原序展示）
 */

export const CATEGORIES = [
  {
    key: "moon",
    label: "望月",
    en: "MOON",
    desc: "月光落在床前、洞庭与杯盏之间",
    ids: [
      "jing-ye-si",        // 静夜思
      "shui-diao-ge-tou",  // 水调歌头·明月几时有
      "gu-lang-yue-xing",  // 古朗月行
      "wang-dong-ting",    // 望洞庭
      "chu-sai",           // 出塞（明月关山）
      "feng-qiao-ye-bo-er",// 夜雨寄北（夜雨思人）
    ],
  },
  {
    key: "landscape",
    label: "山水",
    en: "LANDSCAPE",
    desc: "山川入眼，天地入怀",
    ids: [
      "wang-lu-shan-pu-bu",// 望庐山瀑布
      "deng-guan-que-lou", // 登鹳雀楼
      "zao-fa-bai-di-cheng",// 早发白帝城
      "shan-xing",         // 山行
      "jiang-xue-yu-lin",  // 题西林壁
      "yin-hu-chu-shang-qing-yu", // 饮湖上初晴后雨
      "qi-yue",            // 六月二十七日望湖楼醉书
      "lang-tao-sha",      // 浪淘沙（黄河）
      "guan-cang-hai",     // 观沧海
      "jiang-xue",         // 江雪（寒江独钓）
      "chun-xiao",         // 春晓（晨起闻鸟）
    ],
  },
  {
    key: "season",
    label: "四时",
    en: "SEASONS",
    desc: "春雨夏荷秋枫冬雪，季节的信",
    ids: [
      "chun-ye-xi-yu",     // 春夜喜雨
      "qing-ming",         // 清明
      "jiang-nan-chun",    // 江南春
      "xiao-chi",          // 小池（初夏）
      "bu-suan-zi-yong-mei",// 卜算子·咏梅（冬）
      "chao-tian-zi",      // 天净沙·秋思
      "chang-ge-xing",     // 长歌行（秋惜时）
    ],
  },
  {
    key: "frontier",
    label: "边塞",
    en: "FRONTIER",
    desc: "羌笛、大雪与未还之人",
    ids: [
      "liu-zhou-ci",       // 凉州词
      "sai-xia-qu",        // 塞下曲
      "jian-ke",           // 剑客（侠气同源）
      "guo-ling-ding-yang",// 过零丁洋（气节绝笔）
    ],
  },
  {
    key: "idyll",
    label: "田园",
    en: "IDYLL",
    desc: "村烟、牧童与荷锄的黄昏",
    ids: [
      "shan-guo-gu-ren-zhuang", // 过故人庄
      "mo-shang-sang",     // 村晚
      "jing-ye-niu",       // 所见
      "ru-meng-ling",      // 如梦令（溪亭日暮）
      "xi-he-pan",         // 寻隐者不遇
      "qing-ping-diao",    // 清平调（花与美人）
    ],
  },
  {
    key: "parting",
    label: "离别",
    en: "PARTING",
    desc: "柳色、孤帆与劝君更尽一杯酒",
    ids: [
      "song-yuan-er-shi-an-xi", // 送元二使安西
      "xiao-chu-jing-ci",  // 晓出净慈寺送林子方
      "feng-qiao-ye-bo",   // 枫桥夜泊（羁旅）
      "jing-ting-shan",    // 独坐敬亭山（独游）
      "you-zhou-tai-ge",   // 登幽州台歌（怆然独登）
    ],
  },
  {
    key: "history",
    label: "怀古咏怀",
    en: "REFLECTION",
    desc: "兴亡之叹与不屈之志",
    ids: [
      "huang-he-lou",      // 黄鹤楼
      "wu-yi-xiang",       // 乌衣巷
      "chun-wang",         // 春望
      "yue-yang-lou-ji",   // 登岳阳楼
      "mo-mei",            // 墨梅（品格自许）
    ],
  },
];

/** 校验：无遗漏、无重复（开发期调用） */
export function validateCategories() {
  const all = CATEGORIES.flatMap((c) => c.ids);
  const dup = all.filter((id, i) => all.indexOf(id) !== i);
  const missing = POEMS_IDS.filter((id) => !all.includes(id));
  return { dup, missing };
}

// 避免循环依赖：从 poems.js 之外独立收集全部 id
import { POEMS } from "./poems.js";
const POEMS_IDS = POEMS.map((p) => p.id);

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
