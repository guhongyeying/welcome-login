// 基本数据 Sheet：一条事实一行存储，展示时透视为矩阵。
// 示例数据为演示用估算值（PMI / BAT / JT），需以财报核实。

export type Period = "FY" | "Q1" | "Q2" | "Q3" | "Q4";
export const QUARTERS: Period[] = ["Q1", "Q2", "Q3", "Q4"];
export const SHEET_YEARS = Array.from({ length: 13 }, (_, i) => 2014 + i); // 模板覆盖范围
export const CHANNELS = ["ECO 专卖店", "便利店", "超市", "售货机", "其他零售网点"] as const;
export type Channel = (typeof CHANNELS)[number];
export const SHEET_CATS = ["传统卷烟", "HNB低温", "雾化", "口含", "全品类"] as const;
export type SheetCat = (typeof SHEET_CATS)[number];
export const ENTITIES = ["PMI", "BAT", "JT"] as const;
export const USER_TYPES = ["总用户", "活跃用户", "转化用户"];
export const PEN_TYPES = ["品类渗透", "用户渗透", "传统卷烟用户转化"];
export const ZONE_TOTAL = "大区合计";
export const ZONE_MARKET = "大区口径";

export type MetricKey = "净营收" | "出货量" | "市场份额" | "用户数" | "增长率" | "渠道网点数" | "渗透率" | "利润率" | "营收占比";

export interface MetricDef {
  key: MetricKey;
  reportName: string; // 保留财报指标名称
  additive: boolean; // 同一期间、同一口径下可加总 → 可用饼图
  ratio: boolean; // 百分比类指标，增长以 pt 表示
  required: string[]; // 必填口径字段
  variantKey?: string; // 区分同一指标不同口径的字段
  note: string;
}

export const METRIC_DEFS: MetricDef[] = [
  { key: "净营收", reportName: "Net Revenues", additive: true, ratio: false, required: [], note: "记录原始金额与原始币种，不做汇率换算" },
  { key: "出货量", reportName: "Shipment Volume", additive: true, ratio: false, required: ["量口径"], variantKey: "量口径", note: "区分销量 / 出货量，并记录单位（十亿支、百万罐等）" },
  { key: "市场份额", reportName: "Market Share", additive: false, ratio: true, required: ["计算方式", "分母", "市场范围"], variantKey: "计算方式", note: "标注按金额或按数量，记录分母、市场范围及品类" },
  { key: "用户数", reportName: "Users", additive: true, ratio: false, required: ["用户口径"], variantKey: "用户口径", note: "区分总用户、活跃用户、转化用户等披露口径" },
  { key: "增长率", reportName: "Growth（披露值）", additive: false, ratio: true, required: ["比较方式", "基准期间", "比较指标"], variantKey: "比较方式", note: "标注同比或环比及基准期间；同比须匹配上一年同期及同一口径" },
  { key: "渠道网点数", reportName: "Points of Sale", additive: true, ratio: false, required: ["统计时点"], note: "按渠道类型记录网点数量及统计时点" },
  { key: "渗透率", reportName: "Penetration", additive: false, ratio: true, required: ["渗透类型", "分子", "分母", "定义"], variantKey: "渗透类型", note: "区分品类渗透、用户渗透和传统卷烟用户转化" },
  { key: "利润率", reportName: "Operating Margin", additive: false, ratio: true, required: ["利润层级"], variantKey: "利润层级", note: "原 PRD 字段，列明利润层级；有披露或同口径数据时展示" },
  { key: "营收占比", reportName: "Revenue Share", additive: false, ratio: true, required: ["分母"], note: "原 PRD 字段，列明营收占比分母；有披露或同口径数据时展示" },
];
export const METRIC_KEYS = METRIC_DEFS.map((m) => m.key);
export const metricDef = (k: MetricKey) => METRIC_DEFS.find((m) => m.key === k)!;

export interface Fact {
  id: string;
  entity: string; // 主体
  zone: string; // 大区
  country: string; // 国家
  market: string; // 市场
  cat: SheetCat;
  brand?: string;
  channel?: Channel;
  year: number;
  period: Period; // FY = 年度披露；Q1–Q4 = 季度披露
  metric: MetricKey;
  value: number | null;
  unit: string; // 币种或单位
  basis: string; // 统计口径
  meta: Record<string, string>; // 指标专属口径字段
  missingReason?: string;
  source: string;
  evidence: string; // 证据位置
}

export function validateFact(f: Fact): string[] {
  const issues: string[] = [];
  const def = metricDef(f.metric);
  for (const k of def.required) if (!f.meta[k]) issues.push(`缺少口径字段：${k}`);
  if (!f.unit) issues.push("缺少币种或单位");
  if (!f.basis) issues.push("缺少统计口径");
  if (!f.source) issues.push("缺少来源");
  if (!f.evidence) issues.push("缺少证据位置");
  if (f.value === null && !f.missingReason) issues.push("空值需注明缺失原因");
  if (f.value === 0 && !f.meta["零值依据"]) issues.push("零值需有明确证据（零值依据）");
  if (f.metric === "渠道网点数" && !f.channel) issues.push("渠道网点需记录渠道类型");
  if (f.metric === "市场份额" && f.meta["计算方式"] && !["按金额", "按数量"].includes(f.meta["计算方式"])) issues.push("市场份额计算方式须为按金额或按数量");
  if (f.metric === "增长率" && f.meta["比较方式"] && !["同比", "环比"].includes(f.meta["比较方式"])) issues.push("增长率比较方式须为同比或环比");
  if (f.metric === "用户数" && f.meta["用户口径"] && !USER_TYPES.includes(f.meta["用户口径"])) issues.push("用户口径须为总用户、活跃用户或转化用户");
  if (f.metric === "渗透率" && f.meta["渗透类型"] && !PEN_TYPES.includes(f.meta["渗透类型"])) issues.push("渗透类型须为品类渗透、用户渗透或传统卷烟用户转化");
  return issues;
}

export const variantOf = (f: Fact) => {
  const k = metricDef(f.metric).variantKey;
  return k ? f.meta[k] ?? "" : "";
};
export const colKey = (y: number, p: Period) => `${y}${p}`;
export const rowKey = (f: Fact) =>
  [f.entity, f.zone, f.country, f.market, f.cat, f.brand ?? "", f.channel ?? "", f.metric, variantOf(f), f.unit, f.basis].join("|");

// ---------- 透视 ----------
export interface SheetRow { key: string; head: Fact; cells: Map<string, Fact> }

const ZONES_ORDER = () => GEO.map((g) => g.zone);
const COUNTRY_ORDER = () => [...GEO.flatMap((g) => g.countries.map((c) => c.country)), ZONE_TOTAL];
const idx = (arr: readonly string[], v: string | undefined) => { const i = arr.indexOf(v ?? ""); return i < 0 ? 999 : i; };

export function pivot(facts: Fact[]): SheetRow[] {
  const map = new Map<string, SheetRow>();
  for (const f of facts) {
    const k = rowKey(f);
    let r = map.get(k);
    if (!r) { r = { key: k, head: f, cells: new Map() }; map.set(k, r); }
    r.cells.set(colKey(f.year, f.period), f);
  }
  const zo = ZONES_ORDER(), co = COUNTRY_ORDER();
  const ord = (f: Fact) => [idx(ENTITIES, f.entity), idx(zo, f.zone), idx(co, f.country), f.market === "国内" ? 0 : 1, idx(SHEET_CATS, f.cat), idx(METRIC_KEYS, f.metric)];
  return [...map.values()].sort((a, b) => {
    const x = ord(a.head), y = ord(b.head);
    for (let i = 0; i < x.length; i++) if (x[i] !== y[i]) return x[i] - y[i];
    return a.key.localeCompare(b.key, "zh");
  });
}

// ---------- 增长：同比 / 环比 ----------
export type Mode = "原值" | "同比" | "环比";
export function basePeriod(year: number, period: Period, mode: "同比" | "环比"): [number, Period] | null {
  if (mode === "同比") return [year - 1, period]; // 上一年同期
  if (period === "FY") return null;
  const i = QUARTERS.indexOf(period);
  return i === 0 ? [year - 1, "Q4"] : [year, QUARTERS[i - 1]];
}

export function growthAt(
  get: (y: number, p: Period) => number | null | undefined,
  year: number, period: Period, mode: "同比" | "环比", ratio: boolean,
): { value: number | null; base: string; reason?: string } {
  const cur = get(year, period);
  const bp = basePeriod(year, period, mode);
  if (!bp) return { value: null, base: "", reason: "年度值不计算环比" };
  const base = `${bp[0]} ${bp[1] === "FY" ? "全年" : bp[1]}`;
  if (cur == null) return { value: null, base, reason: "本期无值" };
  const prev = get(bp[0], bp[1]);
  if (prev == null) return { value: null, base, reason: `基准期 ${base} 无同口径数据` };
  if (ratio) return { value: +(cur - prev).toFixed(2), base };
  if (prev === 0) return { value: null, base, reason: "基准期为零" };
  return { value: +(((cur - prev) / prev) * 100).toFixed(2), base };
}

// ---------- 图表序列（按维度汇总） ----------
export type Dim = "明细" | "主体" | "大区" | "国家" | "市场" | "品类" | "渠道";
export interface Series { key: string; label: string; unit: string; values: Map<string, number | null>; mixed: boolean }

export function rowLabel(f: Fact) {
  const geo = f.country === ZONE_TOTAL ? f.zone : `${f.country}·${f.market}`;
  return [f.entity, geo, f.cat, f.brand, f.channel, variantOf(f)].filter(Boolean).join(" · ");
}

export function buildSeries(facts: Fact[], dim: Dim): Series[] {
  const out = new Map<string, Series & { n: Map<string, number> }>();
  for (const f of facts) {
    const dv = dim === "明细" ? rowLabel(f) : dim === "主体" ? f.entity : dim === "大区" ? f.zone : dim === "国家" ? f.country
      : dim === "市场" ? `${f.country}·${f.market}` : dim === "品类" ? f.cat : f.channel ?? "不分渠道";
    const v = variantOf(f);
    const key = dim === "明细" ? rowKey(f) : [dv, f.metric, v, f.brand ?? "", f.unit, f.basis].join("|");
    let s = out.get(key);
    if (!s) {
      s = { key, label: dim === "明细" ? dv : [dv, f.brand, v].filter(Boolean).join(" · "), unit: f.unit, values: new Map(), mixed: false, n: new Map() };
      out.set(key, s);
    }
    const ck = colKey(f.year, f.period);
    if (f.value === null) { if (!s.values.has(ck)) s.values.set(ck, null); continue; }
    s.n.set(ck, (s.n.get(ck) ?? 0) + 1);
    s.values.set(ck, +((s.values.get(ck) ?? 0) + f.value).toFixed(2));
  }
  // 比率类指标跨多行不可加总
  const additive = facts.length ? metricDef(facts[0].metric).additive : true;
  return [...out.values()].map(({ n, ...s }) => {
    if (!additive) for (const [ck, c] of n) if (c > 1) { s.values.set(ck, null); s.mixed = true; }
    return s;
  });
}

export const canPie = (m: MetricKey) => metricDef(m).additive;

// ---------- CSV ----------
const CSV_HEAD = ["ID", "主体", "大区", "国家", "市场", "品类", "品牌", "渠道", "年度", "季度", "指标", "财报指标名", "值", "币种或单位", "统计口径", "口径字段", "缺失原因", "来源", "证据位置"];
export function toCSV(facts: Fact[]) {
  const esc = (v: unknown) => { const s = v == null ? "" : String(v); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
  const lines = facts.map((f) => [f.id, f.entity, f.zone, f.country, f.market, f.cat, f.brand, f.channel, f.year, f.period, f.metric, metricDef(f.metric).reportName,
    f.value, f.unit, f.basis, Object.entries(f.meta).map(([k, v]) => `${k}=${v}`).join("; "), f.missingReason, f.source, f.evidence].map(esc).join(","));
  return "\uFEFF" + [CSV_HEAD.join(","), ...lines].join("\n");
}

// ---------- 地理层级：大区 → 国家 → 市场 ----------
export const GEO: { zone: string; countries: { country: string; markets: string[] }[] }[] = [
  { zone: "欧洲", countries: [{ country: "意大利", markets: ["国内"] }, { country: "德国", markets: ["国内"] }, { country: "波兰", markets: ["国内"] }] },
  { zone: "东亚·澳洲·免税", countries: [{ country: "日本", markets: ["国内", "免税"] }, { country: "韩国", markets: ["国内", "免税"] }] },
  { zone: "美洲", countries: [{ country: "美国", markets: ["国内"] }, { country: "墨西哥", markets: ["国内"] }] },
  { zone: "南亚东南亚·独联体·中东非", countries: [{ country: "印度尼西亚", markets: ["国内"] }, { country: "埃及", markets: ["国内"] }] },
];

// ---------- 示例数据生成（确定性） ----------
const h = (s: string) => { let x = 2166136261; for (let i = 0; i < s.length; i++) { x ^= s.charCodeAt(i); x = Math.imul(x, 16777619); } return ((x >>> 0) % 1000) / 1000; };
const r1 = (v: number) => Math.round(v * 10) / 10;
const LATEST = { year: 2026, q: 3 }; // 截至 2026-11，已披露到 Q3
type Aff = Partial<Record<SheetCat, number>>;
const AFF: Record<string, Record<string, Aff>> = {
  PMI: {
    意大利: { 传统卷烟: 1.2, HNB低温: 1.6, 雾化: 0.8, 口含: 0.1 }, 德国: { 传统卷烟: 1, HNB低温: 0.9, 雾化: 1, 口含: 0.1 },
    波兰: { 传统卷烟: 0.8, HNB低温: 0.7, 雾化: 0.5, 口含: 0.2 }, 日本: { 传统卷烟: 0.9, HNB低温: 3 }, 韩国: { 传统卷烟: 0.5, HNB低温: 1.2 },
    美国: { 传统卷烟: 0, HNB低温: 0.2, 口含: 3 }, 墨西哥: { 传统卷烟: 0.7, HNB低温: 0.1, 雾化: 0.1 },
    印度尼西亚: { 传统卷烟: 2, HNB低温: 0.1 }, 埃及: { 传统卷烟: 1.1, HNB低温: 0.2 },
  },
  BAT: { 日本: { 传统卷烟: 0.3, HNB低温: 1 }, 意大利: { 传统卷烟: 0.5, HNB低温: 0.3, 雾化: 0.6 }, 德国: { 传统卷烟: 0.6, 雾化: 0.8, 口含: 0.1 }, 美国: { 传统卷烟: 2.5, 雾化: 2, 口含: 0.6 } },
  JT: { 日本: { 传统卷烟: 1.6, HNB低温: 0.8 }, 意大利: { 传统卷烟: 0.6, HNB低温: 0.2 }, 德国: { 传统卷烟: 0.7, HNB低温: 0.1 } },
};
const CUR: Record<string, [string, number]> = { PMI: ["USD 百万", 1], BAT: ["GBP 百万", 0.55], JT: ["JPY 亿", 1.4] };
const START: Partial<Record<SheetCat, [number, string]>> = {
  HNB低温: [2015, "IQOS 2014-11 试点，年报未单列"], 雾化: [2019, "VEEV 2019 年上市前无该业务"], 口含: [2023, "2022-11 收购 Swedish Match 前未合并披露"],
};
const VOL_UNIT: Partial<Record<SheetCat, string>> = { 传统卷烟: "十亿支", HNB低温: "十亿支", 雾化: "百万颗烟弹", 口含: "百万罐" };

function curve(cat: SheetCat, y: number) {
  if (cat === "传统卷烟") return 1000 * (1 - 0.025 * (y - 2014));
  if (cat === "HNB低温") return y < 2015 ? 0 : 90 * Math.pow(y - 2014, 1.25);
  if (cat === "雾化") return y < 2019 ? 0 : 15 * (y - 2018);
  if (cat === "口含") return y < 2023 ? 0 : 220 * (y - 2022);
  return 0;
}
function shareCurve(cat: SheetCat, country: string, aff: number, y: number) {
  if (cat === "传统卷烟") return 22 + aff * 8 - (y - 2014) * 0.6;
  if (cat === "HNB低温") return country === "日本" ? Math.min(32, 2 + (y - 2015) * 3.2) : aff * Math.min(10, (y - 2014) * 1.1);
  if (cat === "雾化") return aff * Math.min(6, (y - 2018) * 1.2);
  return country === "美国" ? Math.min(75, 40 + (y - 2022) * 8) : aff * 10;
}

function generate(): Fact[] {
  const facts: Fact[] = [];
  let n = 0;
  const push = (f: Omit<Fact, "id">) => facts.push({ id: `F${String(++n).padStart(5, "0")}`, ...f });
  const CORE: SheetCat[] = ["传统卷烟", "HNB低温", "雾化", "口含"];
  const pmiQuarterly = (y: number) => y >= 2019;
  const after = (y: number, q: number) => y > LATEST.year || (y === LATEST.year && q > LATEST.q);

  for (const ent of ENTITIES) for (const g of GEO) for (const c of g.countries) for (const m of c.markets) {
    if (ent !== "PMI" && m !== "国内") continue;
    for (const cat of CORE) {
      const aff = AFF[ent]?.[c.country]?.[cat];
      if (aff === undefined) continue;
      const usZero = ent === "PMI" && c.country === "美国" && cat === "传统卷烟";
      if (aff === 0 && !usZero) continue;
      const w = aff * (m === "免税" ? 0.12 : 1);
      const [cur, scale] = CUR[ent];
      const loc = { entity: ent, zone: g.zone, country: c.country, market: m, cat };
      const specs: { metric: MetricKey; unit: string; basis: string; meta: Record<string, string>; flow: boolean; val: (y: number) => number }[] = [
        { metric: "净营收", unit: cur, basis: "报告口径（扣除消费税）", meta: {}, flow: true, val: (y) => curve(cat, y) * w * scale },
        { metric: "出货量", unit: VOL_UNIT[cat]!, basis: "出货量（向分销商发货）", meta: { 量口径: "出货量" }, flow: true, val: (y) => curve(cat, y) * w * 0.12 },
        { metric: "市场份额", unit: "%", basis: "零售审计", flow: false, val: (y) => shareCurve(cat, c.country, aff, y) * (ent === "PMI" ? 1 : 0.6),
          meta: { 计算方式: "按数量", 分母: cat === "口含" ? "尼古丁袋合法总销量" : cat === "雾化" ? "电子烟合法总销量" : "卷烟 + 加热烟合法总销量", 市场范围: `${c.country}·${m}` } },
      ];
      for (const sp of specs) {
        const key = `${ent}${c.country}${m}${cat}${sp.metric}`;
        const base = { ...loc, metric: sp.metric, unit: sp.unit, basis: sp.basis, meta: sp.meta };
        const src = (y: number, q?: number) => q
          ? { source: `${ent} ${y} Q${q} 业绩公告（示例）`, evidence: `附表 · ${g.zone} 分部数据` }
          : { source: `${ent} ${y} 年报（示例）`, evidence: `经营分析 · ${g.zone} 分部表` };
        for (const y of SHEET_YEARS) {
          if (usZero) {
            if (y <= 2025) push({ ...base, year: y, period: "FY", value: 0, meta: { ...sp.meta, 零值依据: "2008 年分拆后美国卷烟由 Altria 经营" }, ...src(y) });
            continue;
          }
          const st = START[cat];
          if (ent === "PMI" && st && y < st[0]) { push({ ...base, year: y, period: "FY", value: null, missingReason: st[1], ...src(y) }); continue; }
          if (curve(cat, y) <= 0) continue;
          const annual = sp.val(y) * (1 + (h(key + y) - 0.5) * 0.1);
          if (ent === "PMI" && pmiQuarterly(y)) {
            const qs: number[] = [];
            QUARTERS.forEach((p, i) => {
              const q = i + 1;
              if (after(y, q)) { push({ ...base, year: y, period: p, value: null, missingReason: "报告期未结束（截至 2026-11）", ...src(y, q) }); return; }
              const v = r1(sp.flow ? annual * (0.235 + 0.01 * q) * (1 + (h(key + y + p) - 0.5) * 0.04) : annual + (h(key + y + p) - 0.5) * 0.8);
              qs.push(v);
              push({ ...base, year: y, period: p, value: v, ...src(y, q) });
            });
            if (qs.length === 4) push({ ...base, year: y, period: "FY", value: r1(sp.flow ? qs.reduce((a, b) => a + b, 0) : qs.reduce((a, b) => a + b, 0) / 4), ...src(y) });
            else push({ ...base, year: y, period: "FY", value: null, missingReason: "全年未结束，年度值待年报披露", ...src(y) });
          } else if (y === 2026) {
            push({ ...base, year: y, period: "FY", value: null, missingReason: "年报未发布", ...src(y) });
          } else if (ent !== "PMI" && sp.metric === "市场份额" && h(key + y) < 0.12) {
            push({ ...base, year: y, period: "FY", value: null, missingReason: "公司当年未按国家披露份额", ...src(y) });
          } else {
            push({ ...base, year: y, period: "FY", value: r1(annual), ...src(y) });
          }
        }
      }
    }
  }

  // 品牌口径（可选字段）：日本 HNB 出货量按品牌
  for (const [brand, s0, k] of [["HEETS", 2017, 1], ["TEREA", 2021, 1.4], ["SENTIA", 2023, 0.3]] as const) {
    for (let y = s0; y <= 2025; y++) push({
      entity: "PMI", zone: "东亚·澳洲·免税", country: "日本", market: "国内", cat: "HNB低温", brand, year: y, period: "FY", metric: "出货量",
      value: r1((brand === "HEETS" && y > 2021 ? 30 - (y - 2021) * 6 : 6 + (y - s0) * 5) * k), unit: "十亿支", basis: "品牌口径出货量", meta: { 量口径: "出货量" },
      source: `PMI ${y} 年报（示例）`, evidence: "日本市场品牌表",
    });
  }

  // 用户数：区分总用户 / 转化用户
  for (const [country, k] of [["日本", 3], ["意大利", 1.4], ["韩国", 1], ["德国", 0.8]] as const) {
    const zone = GEO.find((g) => g.countries.some((c) => c.country === country))!.zone;
    for (let y = 2016; y <= 2026; y++) for (const t of ["总用户", "转化用户"]) {
      const v = r1(k * (y - 2015) * 0.9 * (t === "转化用户" ? 0.7 : 1));
      push({ entity: "PMI", zone, country, market: "国内", cat: "HNB低温", year: y, period: "FY", metric: "用户数", unit: "百万人", basis: "公司估算（成年用户）",
        meta: { 用户口径: t }, value: y === 2026 ? null : v, missingReason: y === 2026 ? "年度披露未发布" : undefined,
        source: `PMI ${y} 投资者材料（示例）`, evidence: "无烟产品用户页" });
    }
  }

  // 渠道网点：按渠道类型 + 统计时点
  const POS: Record<string, Partial<Record<Channel, number>>> = {
    日本: { "ECO 专卖店": 40, 便利店: 55000, 超市: 9000, 售货机: 120000, 其他零售网点: 30000 },
    意大利: { "ECO 专卖店": 60, 便利店: 2000, 超市: 4000, 售货机: 9000, 其他零售网点: 52000 },
    德国: { "ECO 专卖店": 30, 便利店: 14000, 超市: 21000, 售货机: 300000, 其他零售网点: 40000 },
    韩国: { "ECO 专卖店": 25, 便利店: 48000, 超市: 6000, 其他零售网点: 70000 },
  };
  for (const [country, chs] of Object.entries(POS)) {
    const zone = GEO.find((g) => g.countries.some((c) => c.country === country))!.zone;
    for (let y = 2017; y <= 2025; y++) for (const ch of CHANNELS) {
      const b = chs[ch];
      if (b === undefined) continue;
      const v = ch === "ECO 专卖店" ? b + (y - 2017) * b * 0.4 : b * (1 + (y - 2017) * (ch === "售货机" ? -0.03 : 0.01));
      push({ entity: "PMI", zone, country, market: "国内", cat: "全品类", channel: ch, year: y, period: "FY", metric: "渠道网点数", value: Math.round(v),
        unit: "家", basis: "年末在营网点", meta: { 统计时点: `${y}-12-31` }, source: `PMI ${y} 渠道数据（示例）`, evidence: `${country} 渠道覆盖表` });
    }
  }

  // 渗透率：分子 / 分母 / 定义
  const PEN: [string, string, string, string, (k: number, y: number) => number][] = [
    ["品类渗透", "加热烟销量", "卷烟 + 加热烟总销量", "加热烟占烟草总消费量比例", (k, y) => Math.min(40, k * (y - 2015) * 2.4)],
    ["用户渗透", "IQOS 成年用户数", "成年烟草使用者总数", "IQOS 用户占成年烟草使用者比例", (k, y) => Math.min(35, k * (y - 2015) * 2)],
    ["传统卷烟用户转化", "已完全转换的 IQOS 用户", "IQOS 总用户", "完全停用卷烟的用户占比", () => 0],
  ];
  for (const [country, k] of [["日本", 1.4], ["意大利", 0.7], ["韩国", 0.8]] as const) {
    const zone = GEO.find((g) => g.countries.some((c) => c.country === country))!.zone;
    for (let y = 2016; y <= 2025; y++) for (const [t, num, den, def, fn] of PEN) {
      if (t === "用户渗透" && country !== "日本") continue;
      const v = t === "传统卷烟用户转化" ? 62 + (y - 2016) * 1.5 + h(country + y) * 3 : fn(k, y);
      push({ entity: "PMI", zone, country, market: "国内", cat: "HNB低温", year: y, period: "FY", metric: "渗透率", value: r1(v), unit: "%", basis: "公司披露 / 估算",
        meta: { 渗透类型: t, 分子: num, 分母: den, 定义: def }, source: `PMI ${y} 年报（示例）`, evidence: "无烟转型进展页" });
    }
  }

  // 大区口径：利润率、营收占比、增长率（由同口径净营收推算的示例披露值）
  const zoneRev = (zone: string, y: number, p: Period, cat?: SheetCat) =>
    facts.filter((f) => f.entity === "PMI" && f.zone === zone && f.metric === "净营收" && f.year === y && f.period === p && !f.brand && (!cat || f.cat === cat))
      .reduce((a, f) => a + (f.value ?? 0), 0);
  for (const g of GEO) {
    const base = { entity: "PMI", zone: g.zone, country: ZONE_TOTAL, market: ZONE_MARKET };
    for (const y of SHEET_YEARS) {
      const src = { source: `PMI ${y} 年报（示例）`, evidence: `${g.zone} 分部利润表` };
      const done = y <= 2025;
      push({ ...base, cat: "全品类", year: y, period: "FY", metric: "利润率", unit: "%", basis: "分部营业利润口径", meta: { 利润层级: "营业利润 / 净营收" },
        value: done ? r1(36 + h(g.zone + y) * 10) : null, missingReason: done ? undefined : "全年未结束", ...src });
      for (const cat of ["HNB低温", "雾化", "口含"] as SheetCat[]) {
        const tot = zoneRev(g.zone, y, "FY"), part = zoneRev(g.zone, y, "FY", cat);
        if (!done || tot <= 0 || part <= 0) continue;
        push({ ...base, cat, year: y, period: "FY", metric: "营收占比", unit: "%", basis: "报告口径", meta: { 分母: "本大区净营收（同币种、同口径）" }, value: r1((part / tot) * 100), ...src });
      }
      if (y >= 2015 && done) {
        const a = zoneRev(g.zone, y, "FY"), b = zoneRev(g.zone, y - 1, "FY");
        if (a > 0 && b > 0) push({ ...base, cat: "全品类", year: y, period: "FY", metric: "增长率", unit: "%", basis: "报告口径",
          meta: { 比较方式: "同比", 基准期间: `${y - 1} 全年`, 比较指标: "净营收" }, value: r1(((a - b) / b) * 100), ...src });
      }
      if (y >= 2024) QUARTERS.forEach((p, i) => {
        if (after(y, i + 1)) return;
        const [py, pp] = basePeriod(y, p, "环比")!;
        const a = zoneRev(g.zone, y, p), b = zoneRev(g.zone, py, pp);
        if (a > 0 && b > 0) push({ ...base, cat: "全品类", year: y, period: p, metric: "增长率", unit: "%", basis: "报告口径",
          meta: { 比较方式: "环比", 基准期间: `${py} ${pp}`, 比较指标: "净营收" }, value: r1(((a - b) / b) * 100),
          source: `PMI ${y} Q${i + 1} 业绩公告（示例）`, evidence: `${g.zone} 分部数据` });
      });
    }
  }
  return facts;
}

export const FACTS: Fact[] = generate();
