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
  name: string; cat: Cat; head: string; rd: string; factory: string; sales: string; note: string;
}[] = [
  { name: "PMI R&D Cube Neuchâtel", cat: "HNB低温", head: "研发负责人（待核）", rd: "瑞士纳沙泰尔 · 约 400–600 人（区间） · IQOS 平台研发", factory: "—", sales: "—", note: "研发投入重心" },
  { name: "Philip Morris Italia (Crespellano)", cat: "HNB低温", head: "工厂负责人（待核）", rd: "—", factory: "意大利博洛尼亚 · HEETS/TEREA 烟弹主力产地", sales: "欧盟 · 增长 +15%", note: "产能核心" },
  { name: "Philip Morris Korea", cat: "HNB低温", head: "（待核）", rd: "—", factory: "韩国梁山 · 面向亚洲市场烟弹", sales: "韩国 · 份额稳定", note: "" },
  { name: "Swedish Match AB", cat: "口含", head: "（待核）", rd: "瑞典 · 口含配方", factory: "瑞典 / 美国 Owensboro · ZYN", sales: "美国 · ZYN 增长 +40%", note: "口含主体" },
  { name: "Fertin Pharma", cat: "口含", head: "（待核）", rd: "丹麦 · 口腔递送技术", factory: "丹麦 Vejle", sales: "B2B", note: "" },
  { name: "PMI VEEV 业务单元", cat: "雾化", head: "（待核）", rd: "瑞士 · VEEV 平台", factory: "代工为主（中国深圳）", sales: "欧洲 30+ 市场", note: "代工依赖" },
  { name: "Philip Morris USA（历史）", cat: "传统卷烟", head: "—", rd: "—", factory: "全球 30+ 卷烟厂", sales: "全球 · 量 -2%/年", note: "现金牛" },
];

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

export const milestones = [
  { year: "2014", text: "开始涉足低温烟业务，IQOS 首发" },
  { year: "2019", text: "日本市场 HNB 渗透率接近 25%，IQOS 品类主导" },
  { year: "2022", text: "无烟产品营收占比突破 30%" },
  { year: "2025", text: "无烟营收占比约 40%，目标 2030 年超 2/3" },
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
