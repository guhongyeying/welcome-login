import { describe, expect, it } from "vitest";
import { CHANNELS, FACTS, METRIC_KEYS, buildSeries, canPie, growthAt, pivot, rowKey, validateFact, colKey, type Fact } from "./fact-sheet";

const mk = (o: Partial<Fact>): Fact => ({
  id: "T", entity: "PMI", zone: "欧洲", country: "意大利", market: "国内", cat: "HNB低温", year: 2025, period: "Q2",
  metric: "净营收", value: 100, unit: "USD 百万", basis: "报告口径", meta: {}, source: "s", evidence: "e", ...o,
});
const getter = (facts: Fact[]) => {
  const row = pivot(facts)[0];
  return (y: number, p: Fact["period"]) => row.cells.get(colKey(y, p))?.value;
};

describe("基本数据 Sheet 口径", () => {
  it("删除「增长区域」字段", () => {
    expect(METRIC_KEYS).not.toContain("增长区域");
  });

  it("渠道细分为五类", () => {
    expect([...CHANNELS]).toEqual(["ECO 专卖店", "便利店", "超市", "售货机", "其他零售网点"]);
  });

  it("年报全年值不拆分填入季度（2019 年前 PMI 只有年度值）", () => {
    expect(FACTS.filter((f) => f.entity === "PMI" && f.year < 2019 && f.period !== "FY")).toHaveLength(0);
    expect(FACTS.some((f) => f.entity === "PMI" && f.year === 2017 && f.period === "FY" && f.metric === "净营收")).toBe(true);
  });

  it("同比匹配上一年同期", () => {
    const g = growthAt(getter([mk({ year: 2024, value: 100 }), mk({ year: 2024, period: "Q1", value: 1 }), mk({ year: 2025, value: 110 })]), 2025, "Q2", "同比", false);
    expect(g.value).toBe(10);
    expect(g.base).toBe("2024 Q2");
  });

  it("同比要求同一口径：口径不同不能作为基准", () => {
    const facts = [mk({ year: 2024, value: 100, basis: "固定汇率口径" }), mk({ year: 2025, value: 110 })];
    const rows = pivot(facts);
    expect(rows).toHaveLength(2);
    const cur = rows.find((r) => r.head.basis === "报告口径")!;
    const g = growthAt((y, p) => cur.cells.get(colKey(y, p))?.value, 2025, "Q2", "同比", false);
    expect(g.value).toBeNull();
  });

  it("环比：Q1 以上一年 Q4 为基准，年度值不算环比", () => {
    const get = getter([mk({ year: 2024, period: "Q4", value: 200 }), mk({ year: 2025, period: "Q1", value: 150 })]);
    expect(growthAt(get, 2025, "Q1", "环比", false).value).toBe(-25);
    expect(growthAt(get, 2025, "FY", "环比", false).value).toBeNull();
  });

  it("比率类指标的增长以百分点计", () => {
    const get = getter([mk({ metric: "市场份额", unit: "%", year: 2024, value: 20, meta: { 计算方式: "按数量", 分母: "d", 市场范围: "m" } }),
      mk({ metric: "市场份额", unit: "%", year: 2025, value: 23, meta: { 计算方式: "按数量", 分母: "d", 市场范围: "m" } })]);
    expect(growthAt(get, 2025, "Q2", "同比", true).value).toBe(3);
  });

  it("字段校验：份额须标注按金额/按数量及分母、市场范围", () => {
    expect(validateFact(mk({ metric: "市场份额", meta: {} }))).toEqual(expect.arrayContaining(["缺少口径字段：计算方式", "缺少口径字段：分母", "缺少口径字段：市场范围"]));
    expect(validateFact(mk({ metric: "市场份额", meta: { 计算方式: "按人数", 分母: "d", 市场范围: "m" } }))).toContain("市场份额计算方式须为按金额或按数量");
  });

  it("空值必须注明原因，零值必须有证据", () => {
    expect(validateFact(mk({ value: null }))).toContain("空值需注明缺失原因");
    expect(validateFact(mk({ value: 0 }))).toContain("零值需有明确证据（零值依据）");
    expect(validateFact(mk({ value: 0, meta: { 零值依据: "官方披露" } }))).toHaveLength(0);
  });

  it("用户数区分口径、渗透率记录分子分母定义、增长率标注比较方式", () => {
    expect(validateFact(mk({ metric: "用户数", meta: { 用户口径: "注册用户" } }))).toContain("用户口径须为总用户、活跃用户或转化用户");
    expect(validateFact(mk({ metric: "渗透率", meta: { 渗透类型: "品类渗透" } }))).toEqual(expect.arrayContaining(["缺少口径字段：分子", "缺少口径字段：分母", "缺少口径字段：定义"]));
    expect(validateFact(mk({ metric: "增长率", meta: {} }))).toContain("缺少口径字段：基准期间");
  });

  it("全部示例事实字段完整", () => {
    const bad = FACTS.map((f) => [f.id, validateFact(f)] as const).filter(([, i]) => i.length);
    expect(bad).toEqual([]);
  });

  it("饼图仅用于可加总指标", () => {
    expect(canPie("净营收")).toBe(true);
    expect(canPie("渠道网点数")).toBe(true);
    expect(canPie("市场份额")).toBe(false);
    expect(canPie("渗透率")).toBe(false);
  });

  it("比率类指标按维度汇总时不加总", () => {
    const share = { 计算方式: "按数量", 分母: "d", 市场范围: "m" };
    const s = buildSeries([mk({ metric: "市场份额", unit: "%", meta: share }), mk({ metric: "市场份额", unit: "%", country: "德国", meta: share })], "大区");
    expect(s[0].values.get("2025Q2")).toBeNull();
    expect(s[0].mixed).toBe(true);
    const r = buildSeries([mk({}), mk({ country: "德国", value: 50 })], "大区");
    expect(r[0].values.get("2025Q2")).toBe(150);
  });

  it("行键包含口径与单位，不同币种不混行", () => {
    expect(rowKey(mk({ unit: "USD 百万" }))).not.toBe(rowKey(mk({ unit: "GBP 百万" })));
  });
});
