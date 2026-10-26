/**
 * 诗词数据库。
 *
 * 新增一首诗只需要在 POEMS 数组加一个对象；
 * 若需要新画境，在 src/scenes/ 下新建场景组件并在 `scene` 字段引用。
 *
 * @typedef {Object} Painting
 * @property {string} src      画卷图片路径
 * @property {string} caption  图注（作品 · 作者 · 来源）
 *
 * @typedef {Object} Poem
 * @property {string} id          唯一 id，用于路由 /poem/:id
 * @property {string} scene       场景组件 key（SCENE_COMPONENTS 的键）
 * @property {string} title       诗题
 * @property {string} dynasty     朝代
 * @property {string} author      作者
 * @property {string[]} lines     诗句（逐句）
 * @property {string} translation 白话译文
 * @property {string} appreciation 赏析
 * @property {string} background  创作背景
 * @property {string[]} tags      主题标签
 * @property {string} sceneDesc   场景字幕：一句话描述画面
 * @property {Painting} [painting] 配图（馆藏画卷，公有领域）
 *
 * @type {Poem[]}
 */
export const POEMS = [
  {
    id: "jing-ye-si",
    scene: "moonlit",
    title: "静夜思",
    dynasty: "唐",
    author: "李白",
    lines: ["床前明月光，", "疑是地上霜。", "举头望明月，", "低头思故乡。"],
    translation:
      "明亮的月光洒在床前，好像地上泛起了一层秋霜。我抬起头来，望着天上的明月；不由得低下头，思念起远方的故乡。",
    appreciation:
      "这首小诗写于唐玄宗开元十四年（726 年），李白二十六岁，客居扬州旅舍。秋夜月明，游子独处，一个「疑」字写出恍惚之间的错觉，一个「望」一个「思」，把抬头与低头之间最寻常的动作，写成了千百年来所有异乡人共同的心情。全诗二十个字，没有一个生僻字，却道尽乡愁。",
    background:
      "李白一生漫游天下，此诗作于离开蜀地之后的第五年。扬州富庶繁华，但对一个二十五六岁、功业未成的青年来说，繁华是别人的。秋夜清冷，霜色般的月光落在床前，他便在这床前，想了一次家。",
    tags: ["思乡", "秋夜", "月亮"],
    sceneDesc: "夜深了。一轮满月悬在中天，月光穿过窗棂，落在床前。一个游子立在窗边，抬头望月。",
    painting: {
      src: "landscape.jpg",
      caption: "雾中山水 · 狩野元信（大都会博物馆，公有领域）",
    },
  },
  {
    id: "jiang-xue",
    scene: "snow-river",
    title: "江雪",
    dynasty: "唐",
    author: "柳宗元",
    lines: ["千山鸟飞绝，", "万径人踪灭。", "孤舟蓑笠翁，", "独钓寒江雪。"],
    translation:
      "千山万岭看不见一只飞鸟，千路万径不见一个行人的踪迹。江上孤舟，一位披蓑戴笠的老翁，独自在漫天风雪的寒江上垂钓。",
    appreciation:
      "柳宗元因参与永贞革新失败，被贬为永州司马，此诗即作于永州。天地空无一人，万籁俱寂，只余一舟、一翁、一钓竿——那个在漫天大雪里独钓的人，正是诗人自己：政治上被冻毙到极点，精神上却极端孤傲。前两句二十字铺开一个「绝」与「灭」的空白世界，后两句只放进去一个人，孤独便有了重量。",
    background:
      "永贞元年（805 年），柳宗元参与的革新失败，被贬永州十年。永州在今湖南南部，当时仍是荒僻之地。此诗与《永州八记》同为贬谪时期的作品：外在世界越空旷，内心世界越倔强。",
    tags: ["孤寂", "冬雪", "垂钓"],
    sceneDesc: "大雪封江。远山覆雪，江面空阔，一条孤舟停在寒江上，一位蓑笠老翁在雪中垂钓。",
    painting: {
      src: "mountain-landscape.jpg",
      caption: "群山楼阁 · 曾我萧白（大都会博物馆，公有领域）",
    },
  },
  {
    id: "chun-xiao",
    scene: "spring-dawn",
    title: "春晓",
    dynasty: "唐",
    author: "孟浩然",
    lines: ["春眠不觉晓，", "处处闻啼鸟。", "夜来风雨声，", "花落知多少。"],
    translation:
      "春天的夜里睡得香甜，不知不觉天就亮了，醒来只听见处处是鸟儿的啼鸣。昨夜隐约听到风雨的声音，不知庭院里的花儿被打落了多少。",
    appreciation:
      "孟浩然早年隐居襄阳鹿门山，此诗即写隐居的春晨。他不在场，却处处在场：听鸟啼、忆风雨、惜落花——全诗没有一个字写「看」，全是听觉与想象。夜里的一场风雨，让诗人最先想到的不是天气，而是花。惜花，即是惜春，即是惜时光本身。",
    background:
      "孟浩然一生大部分时间在襄阳度过，四十岁前隐居读书。此诗约作于隐居时期，是「不着一个愁字，而惜春之情溢于言表」的典范。他后来求仕不遇，终身布衣，回头看这首诗的闲适，也别有意味。",
    tags: ["惜春", "清晨", "鸟鸣"],
    sceneDesc: "春晨初醒。窗外莺燕啼鸣，庭院里落红满地，风过处花瓣飘散。一位诗人推窗而立。",
    painting: {
      src: "landscape-with-pavilion.jpg",
      caption: "山水楼阁 · 賢江祥啓（大都会博物馆，公有领域）",
    },
  },
  {
    id: "deng-guan-que-lou",
    scene: "sunset-tower",
    title: "登鹳雀楼",
    dynasty: "唐",
    author: "王之涣",
    lines: ["白日依山尽，", "黄河入海流。", "欲穷千里目，", "更上一层楼。"],
    translation:
      "夕阳依傍着西山慢慢地沉没，滔滔黄河朝着东海滚滚奔流。要想看到千里之外的风光，就要再登上一层楼。",
    appreciation:
      "鹳雀楼在蒲州（今山西永济），前瞻中条山，下临黄河，因常有鹳雀栖息而得名，是唐代登临胜地。此诗妙在「尽」与「流」两个动词：白日在沉落，黄河在奔流，一静一动，天地都在往前走；于是后两句的哲理便不是训诫，而是眼前景色自然生出的渴望——站得更高，才看得更远。二十个字对仗工整，气象却大。",
    background:
      "王之涣是盛唐边塞诗人，传世之作仅六首，《登鹳雀楼》与《凉州词》皆在其中。此诗约作于他三十五岁前后，卸任衡水主簿、赋闲漫游之时。原楼后毁于战火，今天的鹳雀楼为当代重建。",
    tags: ["登高", "哲理", "黄河"],
    sceneDesc: "落日西沉。黄河东流，远山层叠，高台之上一位诗人凭栏远眺，衣袂被风扬起。",
    painting: {
      src: "landscape-2.jpg",
      caption: "溪山楼观 · 佚名（大都会博物馆，公有领域）",
    },
  },
];

/** 按 id 查诗 */
export const getPoem = (id) => POEMS.find((p) => p.id === id) ?? POEMS[0];
