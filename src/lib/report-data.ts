// 示例数据（PMI），为演示用的整理/估算值，需以财报核实
export type Cat = "传统卷烟" | "HNB低温" | "雾化" | "口含";
export const CATS: Cat[] = ["传统卷烟", "HNB低温", "雾化", "口含"];

export const legal = [
  ["规范名称", "Philip Morris International Inc."],
  ["中文名称", "菲利普莫里斯国际"],
  ["英文名称", "Philip Morris International"],
  ["简称 / 别名", "PMI"],
  ["官网", "pmi.com"],
  ["成立日期", "2008-03（自奥驰亚分拆）"],
  ["上市代码 / 交易所", "PM / NYSE"],
  ["并购时间", "2022 收购 Swedish Match"],
  ["收购时间", "2021 收购 Fertin Pharma"],
];
export const profile = [
  ["主体类型", "跨国烟草集团"],
  ["报告模式", "半年报"],
  ["重点品类", "HNB低温 · 口含 · 雾化"],
  ["集团层级", "母公司"],
  ["管理层 / 董事会", "CEO Jacek Olczak"],
  ["员工规模", "≈ 83,000"],
  ["总部 / 主要基地", "美国斯坦福德 / 瑞士洛桑"],
];

export const subsidiaries: {
  name: string; cat: Cat; group: string; head: string; rd: string; factory: string; sales: string; note: string;
}[] = [
  { name: "PMI R&D Cube Neuchâtel", group: "研发中心", cat: "HNB低温", head: "研发负责人（待核）", rd: "瑞士纳沙泰尔 · 约 400–600 人（区间） · IQOS 平台研发", factory: "—", sales: "—", note: "研发投入重心" },
  { name: "Philip Morris Italia (Crespellano)", group: "生产制造", cat: "HNB低温", head: "工厂负责人（待核）", rd: "—", factory: "意大利博洛尼亚 · HEETS/TEREA 烟弹主力产地", sales: "欧盟 · 增长 +15%", note: "产能核心" },
  { name: "Philip Morris Korea", group: "生产制造", cat: "HNB低温", head: "（待核）", rd: "—", factory: "韩国梁山 · 面向亚洲市场烟弹", sales: "韩国 · 份额稳定", note: "" },
  { name: "Swedish Match AB", group: "并购主体", cat: "口含", head: "（待核）", rd: "瑞典 · 口含配方", factory: "瑞典 / 美国 Owensboro · ZYN", sales: "美国 · ZYN 增长 +40%", note: "口含主体" },
  { name: "Fertin Pharma", group: "并购主体", cat: "口含", head: "（待核）", rd: "丹麦 · 口腔递送技术", factory: "丹麦 Vejle", sales: "B2B", note: "" },
  { name: "PMI VEEV 业务单元", group: "业务单元", cat: "雾化", head: "（待核）", rd: "瑞士 · VEEV 平台", factory: "代工为主（中国深圳）", sales: "欧洲 30+ 市场", note: "代工依赖" },
  { name: "Philip Morris USA（历史）", group: "业务单元", cat: "传统卷烟", head: "—", rd: "—", factory: "全球 30+ 卷烟厂", sales: "全球 · 量 -2%/年", note: "现金牛" },
];

export const GROUPS = ["研发中心", "生产制造", "并购主体", "业务单元"];
export type Lane = "品牌" | "投资" | "产线";
export const LANES: { key: Lane; desc: string }[] = [
  { key: "品牌", desc: "品牌与产品发布" },
  { key: "投资", desc: "并购 / 投资 / 主体变化" },
  { key: "产线", desc: "工厂与产能布局" },
];
export const events: { year: number; lane: Lane; title: string; major?: boolean }[] = [
  { year: 2008, lane: "投资", title: "自奥驰亚分拆独立上市", major: true },
  { year: 2014, lane: "品牌", title: "IQOS 名古屋 / 米兰试点", major: true },
  { year: 2014, lane: "产线", title: "博洛尼亚 HNB 工厂投产" },
  { year: 2016, lane: "品牌", title: "IQOS 日本全国铺开" },
  { year: 2017, lane: "产线", title: "韩国梁山烟弹工厂" },
  { year: 2019, lane: "品牌", title: "IQOS 获 FDA 上市许可", major: true },
  { year: 2019, lane: "品牌", title: "VEEV 雾化发布" },
  { year: 2021, lane: "投资", title: "收购 Fertin Pharma / Vectura" },
  { year: 2021, lane: "品牌", title: "IQOS ILUMA 感应加热" },
  { year: 2022, lane: "投资", title: "收购 Swedish Match（ZYN）", major: true },
  { year: 2023, lane: "产线", title: "美国 ZYN 产能扩建" },
  { year: 2024, lane: "投资", title: "收回 IQOS 美国权益" },
  { year: 2025, lane: "品牌", title: "ILUMA i 系列" },
];

// 商业大事记 · 大节点（并购 / 发展历程核心节点；示例整理，需以财报核实）
export type BizKind = "发展" | "并购" | "市场";
export const milestones: { year: string; kind: BizKind; title: string; metric?: string; text: string }[] = [
  { year: "2008", kind: "发展", title: "分拆独立上市", metric: "NYSE: PM", text: "自奥驰亚分拆，专注美国以外市场" },
  { year: "2014", kind: "发展", title: "涉足低温烟业务", metric: "IQOS 首发", text: "名古屋 / 米兰试点，开启 HNB 品类" },
  { year: "2016", kind: "发展", title: "提出无烟未来战略", text: "以无烟产品逐步替代卷烟" },
  { year: "2019", kind: "市场", title: "日本市场渗透率达 50%", metric: "≈ 50%", text: "IQOS 主导日本 HNB 品类" },
  { year: "2021", kind: "并购", title: "收购 Fertin Pharma / Vectura", text: "补口腔递送与吸入技术" },
  { year: "2022", kind: "并购", title: "收购 Swedish Match", metric: "≈ $16B", text: "取得 ZYN，进入美国口含市场" },
  { year: "2022", kind: "市场", title: "无烟营收占比突破 30%", metric: "> 30%", text: "无烟业务成为第二增长曲线" },
  { year: "2024", kind: "并购", title: "收回 IQOS 美国权益", metric: "≈ $2.7B", text: "自主运营美国 HNB 市场" },
  { year: "2025", kind: "市场", title: "无烟营收占比约 40%", metric: "≈ 40%", text: "目标 2030 年超过 2/3" },
];
export const kpis = [
  { label: "总营收", value: "$37.9B", delta: "+7.7%" },
  { label: "无烟业务占比", value: "40%", delta: "+3pt" },
  { label: "IQOS 用户", value: "3,200 万", delta: "+12%" },
  { label: "HNB 全球份额", value: "≈ 76%", delta: "持平" },
];
export const REGIONS = ["EU", "US", "AS", "EA"] as const;
export const YEARS = Array.from({ length: 13 }, (_, i) => 2014 + i);
export const METRICS = ["量", "销售额", "市占率"] as const;
// 伪随机但确定的示例数据
export function cell(region: string, cat: Cat, year: number, metric: string) {
  const seed = (region.charCodeAt(0) * 7 + cat.length * 13 + year * 3 + metric.length) % 97;
  const base = cat === "传统卷烟" ? 60 : cat === "HNB低温" ? 4 + (year - 2014) * 3 : cat === "雾化" ? 1 + (year - 2014) : year >= 2022 ? 5 + (year - 2022) * 4 : 0;
  if (base <= 0) return "—";
  const v = base + (seed % 9) - 4;
  return metric === "市占率" ? `${Math.max(0, v).toFixed(0)}%` : Math.max(0, v * (metric === "销售额" ? 1.8 : 1)).toFixed(1);
}

export const productLines = [
  { name: "IQOS（HNB）", steps: ["1.0 2014 · 刀片加热", "2.4 PLUS 2016 · 续航", "3 DUO 2019 · 连抽", "ILUMA 2021 · 感应加热", "ILUMA i 2025 · 交互屏"] },
  { name: "lil / HEETS 烟弹", steps: ["HEETS 2015", "lil SOLID 2020（与 KT&G）", "TEREA 2021 · 无刀片"] },
  { name: "VEEV（雾化）", steps: ["VEEV 2019 · 封闭式", "VEEV ONE 2023 · 一次性"] },
  { name: "ZYN（口含）", steps: ["ZYN 美国扩张 2022", "ZYN 产能翻倍 2024"] },
];

export const tech = [
  { topic: "感应加热（ILUMA）", status: "核心专利布局完善", risk: "与 BAT glo 专利诉讼（美 ITC）" },
  { topic: "刀片加热", status: "逐步退出", risk: "美国 ITC 禁令 2021 导致 IQOS 下架" },
  { topic: "尼古丁袋配方", status: "Swedish Match 专利", risk: "FDA PMTA 监管趋严" },
];
export const competitors = [
  { name: "BAT", cat: "HNB低温", region: "EU / AS", event: "glo hyper 降价抢份额", channel: "便利店 + 线上" },
  { name: "JTI", cat: "HNB低温", region: "日本", event: "Ploom X 份额提升", channel: "直营店" },
  { name: "Altria / NJOY", cat: "雾化", region: "美国", event: "收购 NJOY 布局雾化", channel: "零售" },
  { name: "BAT Velo", cat: "口含", region: "EU / US", event: "与 ZYN 正面竞争", channel: "零售" },
];

export const SUPPLY = ["原料供应", "产品代工 / 自有工厂", "技术合作"] as const;
export const suppliers: { cat: Cat; type: (typeof SUPPLY)[number]; name: string; since: string; scale: string; good: string; bad: string }[] = [
  { cat: "HNB低温", type: "产品代工 / 自有工厂", name: "伟创力 / 富士康（设备代工）", since: "2014", scale: "年千万台级设备", good: "规模化、良率稳定", bad: "单一地区集中" },
  { cat: "HNB低温", type: "原料供应", name: "烟叶再造薄片供应商", since: "2014", scale: "（待核）", good: "自有配方", bad: "原料价格波动" },
  { cat: "HNB低温", type: "技术合作", name: "KT&G", since: "2020", scale: "15 年合作协议", good: "lil 品牌出海", bad: "利润分成" },
  { cat: "雾化", type: "产品代工 / 自有工厂", name: "深圳雾化代工厂", since: "2019", scale: "（待核）", good: "成本低", bad: "关税与合规风险" },
  { cat: "口含", type: "产品代工 / 自有工厂", name: "ZYN 自有工厂（Owensboro）", since: "2022", scale: "年产数亿罐", good: "自主可控", bad: "扩产周期长" },
  { cat: "传统卷烟", type: "原料供应", name: "全球烟叶采购网络", since: "—", scale: "数十个国家", good: "供给稳定", bad: "ESG 压力" },
];

export const demands = [
  ["商业诉求", "提升无烟业务利润率，2030 年无烟营收占比 >2/3"],
  ["市场诉求", "重返美国 HNB 市场，扩大 ZYN 渗透"],
  ["产品诉求", "ILUMA 平台全球替换，补齐雾化短板"],
  ["技术诉求", "规避感应加热专利冲突，降低单机成本"],
];
export const transfers = [
  { kind: "品类", from: "雾化", to: "HNB低温", why: "健康感知 + 口感接近卷烟" },
  { kind: "品类", from: "HEETS", to: "ILUMA / TEREA", why: "无刀片、易清洁" },
  { kind: "技术", from: "电阻加热", to: "感应 / 微波加热", why: "加热均匀、规避专利" },
  { kind: "地区", from: "日韩", to: "欧洲 / 美国", why: "监管放开、人口基数" },
];

// ============= 公司树节点详情（示例/估算值，需以财报核实） =============
export type NodeKind = "母公司" | "分支" | "子公司";
export type NodeInfo = {
  id: string;
  kind: NodeKind;
  title: string;
  enName?: string;
  cat?: Cat;
  summary: string;
  basic: [string, string][];
  business: [string, string][];
  products: string[];
  markets: string[];
  events: { year: string; text: string }[];
  risks: string[];
  children?: string[];
};

export const nodes: NodeInfo[] = [
  {
    id: "parent", kind: "母公司", title: "Philip Morris International Inc.", enName: "PMI · NYSE: PM",
    summary: "集团母公司，负责全球战略、无烟产品平台与资本配置；财报口径下按四类分支管理关键子公司。",
    basic: [
      ["规范名称", "Philip Morris International Inc."],
      ["中文名称", "菲利普莫里斯国际"],
      ["简称 / 别名", "PMI"],
      ["主体类型", "跨国烟草集团（母公司）"],
      ["总部 / 主要基地", "美国斯坦福德 / 瑞士洛桑"],
      ["上市代码 / 交易所", "PM / NYSE"],
      ["成立日期", "2008-03（自奥驰亚分拆）"],
      ["员工规模", "≈ 83,000"],
      ["管理层 / 董事会", "CEO Jacek Olczak"],
      ["官网", "pmi.com"],
    ],
    business: [
      ["报告模式", "半年报"],
      ["重点品类", "HNB低温 · 口含 · 雾化"],
      ["总营收", "$37.9B（+7.7%）"],
      ["无烟营收占比", "约 40%（2025）"],
      ["下辖主体", "4 类分支 · 7 家关键子公司"],
    ],
    products: ["IQOS", "TEREA / HEETS", "VEEV", "ZYN"],
    markets: ["欧洲", "美国", "亚洲", "欧亚其他"],
    events: [
      { year: "2008", text: "自奥驰亚分拆独立上市" },
      { year: "2014", text: "IQOS 首发，进入低温烟业务" },
      { year: "2022", text: "收购 Swedish Match，取得 ZYN" },
      { year: "2025", text: "无烟营收占比约 40%，目标 2030 年超 2/3" },
    ],
    risks: ["感应加热专利与 BAT 的 ITC 诉讼", "FDA PMTA 与各国监管趋严", "传统卷烟量 -2%/年，现金牛承压"],
    children: ["group:研发中心", "group:生产制造", "group:并购主体", "group:业务单元"],
  },
  {
    id: "group:研发中心", kind: "分支", title: "研发中心",
    summary: "财报口径的研发类主体：承担 IQOS 平台结构、烟弹配方与口腔递送技术研究。",
    basic: [
      ["分支类型", "研发"],
      ["主体数量", "1 家（示例）"],
      ["主要分布", "瑞士纳沙泰尔"],
      ["对应品类", "HNB低温"],
    ],
    business: [
      ["职能", "平台研发、配方与感官评价"],
      ["投入方向", "研发投入重心，倾向 ILUMA 平台"],
      ["成果", "IQOS ILUMA / TEREA 配方"],
    ],
    products: ["IQOS ILUMA", "TEREA"],
    markets: ["内部服务全球市场"],
    events: [
      { year: "2014", text: "刀片加热平台成型" },
      { year: "2021", text: "感应加热 ILUMA 进入量产" },
    ],
    risks: ["核心研发人才集中", "专利诉讼影响平台路线"],
    children: ["PMI R&D Cube Neuchâtel"],
  },
  {
    id: "group:生产制造", kind: "分支", title: "生产制造",
    summary: "烟弹与设备制造类主体：欧盟与亚洲两大产能支点。",
    basic: [
      ["分支类型", "制造"],
      ["主体数量", "2 家（示例）"],
      ["主要分布", "意大利博洛尼亚 / 韩国梁山"],
      ["对应品类", "HNB低温"],
    ],
    business: [
      ["职能", "HEETS / TEREA 烟弹与设备制造"],
      ["产能定位", "欧盟主力 + 亚洲供应"],
      ["扩张方式", "既有卷烟厂转产 HNB 产线"],
    ],
    products: ["HEETS", "TEREA"],
    markets: ["欧盟", "韩国", "亚洲"],
    events: [
      { year: "2014", text: "博洛尼亚 HNB 工厂投产" },
      { year: "2017", text: "韩国梁山烟弹工厂" },
    ],
    risks: ["产能地区集中", "关税与本地化合规成本"],
    children: ["Philip Morris Italia (Crespellano)", "Philip Morris Korea"],
  },
  {
    id: "group:并购主体", kind: "分支", title: "并购主体",
    summary: "通过收购纳入的独立法人：补口含品类与口腔递送技术。",
    basic: [
      ["分支类型", "并购"],
      ["主体数量", "2 家（示例）"],
      ["主要分布", "瑞典斯德哥尔摩 / 丹麦韦勒"],
      ["对应品类", "口含"],
    ],
    business: [
      ["职能", "尼古丁袋与口腔递送技术"],
      ["取得方式", "2021 Fertin Pharma、2022 Swedish Match"],
      ["协同", "配方 + 递送技术 + 品牌渠道"],
    ],
    products: ["ZYN", "尼古丁袋代工"],
    markets: ["美国", "北欧", "B2B"],
    events: [
      { year: "2021", text: "收购 Fertin Pharma" },
      { year: "2022", text: "收购 Swedish Match（ZYN）" },
    ],
    risks: ["FDA PMTA 与青少年使用审查", "并购整合与产能爬坡周期"],
    children: ["Swedish Match AB", "Fertin Pharma"],
  },
  {
    id: "group:业务单元", kind: "分支", title: "业务单元",
    summary: "按品类划分的业务经营单元：雾化平台与传统卷烟存量。",
    basic: [
      ["分支类型", "业务单元"],
      ["主体数量", "2 家（示例）"],
      ["主要分布", "瑞士 / 全球存量网络"],
      ["对应品类", "雾化 · 传统卷烟"],
    ],
    business: [
      ["职能", "VEEV 雾化平台经营；传统卷烟存量管理"],
      ["模式", "雾化以代工为主，自有品牌运营"],
      ["定位", "雾化补位增长，卷烟提供现金流"],
    ],
    products: ["VEEV", "传统卷烟品牌"],
    markets: ["欧洲 30+ 市场", "全球存量市场"],
    events: [
      { year: "2019", text: "VEEV 雾化发布" },
      { year: "2025", text: "ILUMA i 系列带动设备更新" },
    ],
    risks: ["雾化代工依赖单一地区", "传统卷烟量 -2%/年"],
    children: ["PMI VEEV 业务单元", "Philip Morris USA（历史）"],
  },
  {
    id: "PMI R&D Cube Neuchâtel", kind: "子公司", title: "PMI R&D Cube Neuchâtel", cat: "HNB低温",
    enName: "瑞士纳沙泰尔研发中心",
    summary: "集团研发投入重心，IQOS 平台结构、烟弹配方与感官评价的核心实验基地。",
    basic: [
      ["节点类型", "研发中心"],
      ["上级主体", "Philip Morris International Inc."],
      ["所在地", "瑞士 纳沙泰尔"],
      ["负责人", "研发负责人（待核）"],
      ["员工规模", "约 400–600 人（区间）"],
      ["持股", "100% 自有"],
    ],
    business: [
      ["主营业务", "IQOS 平台研发（加热结构、烟弹配方、感官评价）"],
      ["规模", "实验室 + 感官评价舱（待核）"],
      ["营收贡献", "不单独披露，计入集团研发费用"],
      ["服务对象", "全球平台与制造基地"],
    ],
    products: ["IQOS ILUMA", "TEREA 配方"],
    markets: ["内部（服务全球）"],
    events: [
      { year: "2014", text: "刀片加热平台支撑 IQOS 首发" },
      { year: "2021", text: "感应加热 ILUMA 量产落地" },
    ],
    risks: ["感应加热专利与 BAT glo 诉讼", "核心人才与设计知识高度集中"],
  },
  {
    id: "Philip Morris Italia (Crespellano)", kind: "子公司", title: "Philip Morris Italia (Crespellano)", cat: "HNB低温",
    enName: "意大利博洛尼亚 Crespellano 工厂",
    summary: "HEETS / TEREA 烟弹主力产地，欧盟市场供给的产能核心。",
    basic: [
      ["节点类型", "制造基地"],
      ["上级主体", "Philip Morris International Inc."],
      ["所在地", "意大利 博洛尼亚 Crespellano"],
      ["负责人", "工厂负责人（待核）"],
      ["员工规模", "≈ 1,500+（待核）"],
      ["持股", "100% 自有"],
    ],
    business: [
      ["主营业务", "HEETS / TEREA 烟弹制造与包装"],
      ["产能", "欧盟主力产能（待核）"],
      ["营收贡献", "计入欧洲区域，不单独披露"],
      ["主要市场", "欧盟 · 增长 +15%"],
    ],
    products: ["HEETS", "TEREA"],
    markets: ["欧盟"],
    events: [
      { year: "2014", text: "博洛尼亚 HNB 工厂投产" },
      { year: "2021", text: "产线切换至 TEREA（无刀片）" },
    ],
    risks: ["产能高度集中，单点故障影响欧盟供货", "欧盟税制与监管变动"],
  },
  {
    id: "Philip Morris Korea", kind: "子公司", title: "Philip Morris Korea", cat: "HNB低温",
    enName: "韩国梁山工厂",
    summary: "面向亚洲市场的烟弹产地，与 KT&G 合作支撑 lil 品牌。",
    basic: [
      ["节点类型", "制造基地"],
      ["上级主体", "Philip Morris International Inc."],
      ["所在地", "韩国 梁山"],
      ["负责人", "（待核）"],
      ["员工规模", "（待核）"],
      ["持股", "100% 自有"],
    ],
    business: [
      ["主营业务", "HNB 烟弹制造，供应亚洲"],
      ["合作", "与 KT&G 联合运营 lil 品牌"],
      ["营收贡献", "韩国 · 份额稳定"],
      ["主要市场", "韩国 / 亚洲"],
    ],
    products: ["lil", "HEETS"],
    markets: ["韩国", "亚洲"],
    events: [
      { year: "2017", text: "韩国梁山烟弹工厂投产" },
      { year: "2020", text: "与 KT&G 签署 lil 合作协议" },
    ],
    risks: ["与 KT&G 的利润分成", "韩国本土品牌竞争"],
  },
  {
    id: "Swedish Match AB", kind: "子公司", title: "Swedish Match AB", cat: "口含",
    enName: "瑞典斯德哥尔摩 · 2022 年被 PMI 收购",
    summary: "口含品类主体，ZYN 品牌与配方的持有与运营方，无烟营收的重要来源。",
    basic: [
      ["节点类型", "并购主体"],
      ["上级主体", "Philip Morris International Inc."],
      ["所在地", "瑞典 斯德哥尔摩"],
      ["成立", "1915（2022 年被 PMI 收购）"],
      ["负责人", "（待核）"],
      ["员工规模", "≈ 3,000+（待核）"],
      ["持股", "100%"],
    ],
    business: [
      ["主营业务", "尼古丁袋（ZYN）与口含烟"],
      ["制造", "瑞典 / 美国 Owensboro 工厂"],
      ["营收贡献", "美国 · ZYN 增长 +40%"],
      ["主要市场", "美国 / 北欧"],
    ],
    products: ["ZYN", "口含烟（snus）"],
    markets: ["美国", "北欧"],
    events: [
      { year: "2022", text: "PMI 完成收购，取得 ZYN" },
      { year: "2023", text: "美国 ZYN 产能扩建" },
      { year: "2024", text: "ZYN 产能翻倍计划推进" },
    ],
    risks: ["FDA PMTA 审批与青少年使用审查", "美国州级监管与诉讼风险"],
  },
  {
    id: "Fertin Pharma", kind: "子公司", title: "Fertin Pharma", cat: "口含",
    enName: "丹麦韦勒 · 2021 年被 PMI 收购",
    summary: "口腔递送技术主体，为集团与合作客户提供尼古丁袋配方与代工能力。",
    basic: [
      ["节点类型", "并购主体"],
      ["上级主体", "Philip Morris International Inc."],
      ["所在地", "丹麦 韦勒（Vejle）"],
      ["成立", "1969（2021 年被 PMI 收购）"],
      ["负责人", "（待核）"],
      ["员工规模", "≈ 1,000+（待核）"],
      ["持股", "100%"],
    ],
    business: [
      ["主营业务", "口腔/口腔黏膜递送技术研发与代工"],
      ["制造", "丹麦 Vejle 工厂"],
      ["营收贡献", "B2B 代工与技术服务"],
      ["主要市场", "B2B（含竞争对手客户）"],
    ],
    products: ["尼古丁袋代工", "递送技术方案"],
    markets: ["B2B"],
    events: [
      { year: "2021", text: "PMI 收购，补口腔递送技术" },
      { year: "2023", text: "产线转供 ZYN 外溢需求" },
    ],
    risks: ["B2B 客户集中，与客户存在竞争关系", "技术专利到期与模仿"],
  },
  {
    id: "PMI VEEV 业务单元", kind: "子公司", title: "PMI VEEV 业务单元", cat: "雾化",
    enName: "雾化平台业务单元",
    summary: "雾化品类经营单元，以代工为主、自有品牌运营，用于补齐产品组合短板。",
    basic: [
      ["节点类型", "业务单元"],
      ["上级主体", "Philip Morris International Inc."],
      ["所在地", "瑞士（运营）/ 中国深圳（代工）"],
      ["负责人", "（待核）"],
      ["员工规模", "（待核）"],
      ["持股", "100%（自有品牌）"],
    ],
    business: [
      ["主营业务", "VEEV 封闭式与一次性雾化设备"],
      ["制造", "代工为主（中国深圳）"],
      ["营收贡献", "规模小、增速高（待核）"],
      ["主要市场", "欧洲 30+ 市场"],
    ],
    products: ["VEEV", "VEEV ONE"],
    markets: ["欧洲", "其他监管放开市场"],
    events: [
      { year: "2019", text: "VEEV 封闭式设备发布" },
      { year: "2023", text: "VEEV ONE 一次性设备上市" },
    ],
    risks: ["代工依赖，成本与关税波动", "一次性设备环保与监管压力"],
  },
  {
    id: "Philip Morris USA（历史）", kind: "子公司", title: "Philip Morris USA（历史）", cat: "传统卷烟",
    enName: "传统卷烟存量业务",
    summary: "传统卷烟存量业务的现金牛：为无烟转型提供现金流，量随行业缓慢衰退。",
    basic: [
      ["节点类型", "业务单元（历史/存量）"],
      ["上级主体", "Philip Morris International Inc."],
      ["所在地", "全球 30+ 卷烟厂"],
      ["负责人", "—"],
      ["员工规模", "（待核）"],
      ["持股", "—"],
    ],
    business: [
      ["主营业务", "传统卷烟制造与销售"],
      ["产能", "全球 30+ 卷烟厂"],
      ["营收贡献", "全球 · 量 -2%/年"],
      ["主要市场", "全球存量市场"],
    ],
    products: ["Marlboro（美国以外）", "本地卷烟品牌"],
    markets: ["全球"],
    events: [
      { year: "2008", text: "随分拆进入 PMI 体系（美国权益另属奥驰亚）" },
      { year: "2022", text: "无烟占比提升，卷烟资源逐步让位" },
    ],
    risks: ["美国卷烟业务实际由奥驰亚（Altria）持有，PMI 通过协议合作（待核）", "健康诉求与税制推动量长期下滑"],
  },
];

export function findNode(id: string): NodeInfo | undefined {
  return nodes.find((n) => n.id === id);
}

export function childNodes(id: string): NodeInfo[] {
  const n = findNode(id);
  if (!n?.children) return [];
  return n.children.map(findNode).filter((x): x is NodeInfo => Boolean(x));
}

// ============= 公司大事件（总公司 / PMI 自有品牌口径；示例整理，需以财报核实） =============
export type CoEventType = "发展历史" | "产品历史" | "品牌投资" | "并购";
export const CO_EVENT_TYPES: { key: CoEventType; desc: string }[] = [
  { key: "发展历史", desc: "公司沿革与战略转折" },
  { key: "产品历史", desc: "总公司自有品牌的产品发布" },
  { key: "品牌投资", desc: "品牌权益、合作与投资" },
  { key: "并购", desc: "收购 / 出售主体" },
];
export const coEvents: { date: string; type: CoEventType; title: string; detail: string; brand?: string; major?: boolean }[] = [
  { date: "1847", type: "发展历史", title: "Philip Morris 伦敦开设烟草店", detail: "公司起源，后发展为国际化卷烟企业。" },
  { date: "1924", type: "产品历史", title: "Marlboro 品牌推出", detail: "总公司核心卷烟品牌，后成为全球销量最大的卷烟品牌之一。", brand: "Marlboro" },
  { date: "2008-03", type: "发展历史", title: "自奥驰亚（Altria）分拆独立上市", detail: "PMI 负责美国以外市场，NYSE 代码 PM。", major: true },
  { date: "2014-11", type: "产品历史", title: "IQOS 名古屋 / 米兰试点上市", detail: "加热不燃烧（HNB）平台首发，配套 HEETS 烟弹。", brand: "IQOS", major: true },
  { date: "2016", type: "发展历史", title: "提出「无烟未来」战略", detail: "公开承诺以无烟产品逐步替代卷烟。", major: true },
  { date: "2016", type: "产品历史", title: "IQOS 日本全国铺开", detail: "日本成为 HNB 渗透率最高的市场。", brand: "IQOS" },
  { date: "2018", type: "产品历史", title: "IQOS 3 / 3 MULTI 发布", detail: "缩短充电时间，支持连续使用。", brand: "IQOS" },
  { date: "2019-04", type: "发展历史", title: "IQOS 获美国 FDA 上市许可（PMTA）", detail: "首个获 FDA 上市许可的 HNB 产品。", brand: "IQOS", major: true },
  { date: "2019", type: "产品历史", title: "VEEV 雾化产品发布", detail: "总公司自有雾化品牌，封闭式设备。", brand: "VEEV" },
  { date: "2020-01", type: "品牌投资", title: "与 KT&G 签署国际合作协议", detail: "由 PMI 在韩国以外市场销售 KT&G 的 lil 系列。", brand: "lil" },
  { date: "2020-07", type: "发展历史", title: "IQOS 获 FDA 风险调整（MRTP）授权", detail: "允许以「降低暴露」口径进行宣传。", brand: "IQOS" },
  { date: "2021-08", type: "产品历史", title: "IQOS ILUMA 感应加热 + TEREA 烟弹", detail: "无刀片、免清洁，逐步替换旧平台。", brand: "IQOS ILUMA", major: true },
  { date: "2021-09", type: "并购", title: "收购 Fertin Pharma", detail: "补齐口腔递送技术与尼古丁袋代工能力。" },
  { date: "2021-09", type: "并购", title: "收购 Vectura", detail: "吸入制剂技术，布局「超越尼古丁」健康业务。" },
  { date: "2022-11", type: "并购", title: "收购 Swedish Match", detail: "取得 ZYN 口含品牌，进入美国无烟市场。", major: true },
  { date: "2023", type: "产品历史", title: "VEEV ONE 一次性雾化上市", detail: "补充雾化产品线。", brand: "VEEV" },
  { date: "2024-04", type: "品牌投资", title: "收回 IQOS 美国商业化权益", detail: "向奥驰亚支付约 27 亿美元，自主运营美国 IQOS。", brand: "IQOS", major: true },
  { date: "2024", type: "并购", title: "出售 Vectura", detail: "退出吸入制剂业务，聚焦无烟主业。" },
  { date: "2024", type: "产品历史", title: "IQOS ILUMA i 系列发布", detail: "新增交互屏与暂停功能。", brand: "IQOS ILUMA" },
  { date: "2025", type: "发展历史", title: "无烟营收占比约 40%", detail: "目标 2030 年无烟营收占比超过 2/3。" },
];
