import { Fragment, useMemo, useState, type ReactNode } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import * as S from "@/lib/fact-sheet";

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)", "var(--primary)", "var(--accent)", "var(--muted-foreground)"];
const VIEWS = ["表格", "折线图", "条形图", "饼图", "事实明细"] as const;
type View = (typeof VIEWS)[number];
const DIMS: S.Dim[] = ["明细", "主体", "大区", "国家", "市场", "品类", "渠道"];
const fmt = (v: number) => v.toLocaleString("zh-CN", { maximumFractionDigits: 1 });
const card = "rounded-xl border border-border bg-card";

function Chip({ on, children, onClick, title }: { on: boolean; children: ReactNode; onClick: () => void; title?: string }) {
  return (
    <button type="button" title={title} onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs transition ${on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-secondary"}`}>
      {children}
    </button>
  );
}
function Seg<T extends string>({ items, value, onChange }: { items: readonly T[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex flex-wrap gap-1 rounded-lg bg-secondary p-1">
      {items.map((m) => (
        <button type="button" key={m} onClick={() => onChange(m)} className={`rounded-md px-3 py-1 text-xs ${value === m ? "bg-card shadow-sm" : "text-muted-foreground"}`}>{m}</button>
      ))}
    </div>
  );
}
function Row({ label, children }: { label: string; children: ReactNode }) {
  return <div className="flex flex-wrap items-center gap-2"><span className="w-14 shrink-0 text-xs text-muted-foreground">{label}</span>{children}</div>;
}
const uniq = <T,>(a: T[]) => [...new Set(a)];

export function FactSheet() {
  const [entity, setEntity] = useState("PMI");
  const [zone, setZone] = useState("全部");
  const [country, setCountry] = useState("全部");
  const [market, setMarket] = useState("全部");
  const [cat, setCat] = useState("全部");
  const [channel, setChannel] = useState("全部");
  const [metrics, setMetrics] = useState<S.MetricKey[]>(["净营收"]);
  const [y0, setY0] = useState(2014);
  const [y1, setY1] = useState(2026);
  const [gran, setGran] = useState<"年度" | "年度+季度">("年度");
  const [mode, setMode] = useState<S.Mode>("原值");
  const [view, setView] = useState<View>("表格");
  const [dim, setDim] = useState<S.Dim>("国家");
  const [chartMetric, setChartMetric] = useState<S.MetricKey>("净营收");
  const [picked, setPicked] = useState<string[] | null>(null);
  const [pieAt, setPieAt] = useState<{ year: number; period: S.Period }>({ year: 2025, period: "FY" });
  const [sel, setSel] = useState<S.Fact | null>(null);

  const zones = S.GEO.map((g) => g.zone);
  const countries = [...S.GEO.filter((g) => zone === "全部" || g.zone === zone).flatMap((g) => g.countries.map((c) => c.country)), S.ZONE_TOTAL];
  const markets = uniq([...S.GEO.flatMap((g) => g.countries).filter((c) => country === "全部" || c.country === country).flatMap((c) => c.markets), ...(country === "全部" || country === S.ZONE_TOTAL ? [S.ZONE_MARKET] : [])]);

  const facts = useMemo(() => S.FACTS.filter((f) =>
    (entity === "全部" || f.entity === entity) && (zone === "全部" || f.zone === zone) && (country === "全部" || f.country === country)
    && (market === "全部" || f.market === market) && (cat === "全部" || f.cat === cat)
    && (channel === "全部" || (channel === "不分渠道" ? !f.channel : f.channel === channel)) && metrics.includes(f.metric),
  ), [entity, zone, country, market, cat, channel, metrics]);

  const years = S.SHEET_YEARS.filter((y) => y >= y0 && y <= y1);
  const cols: [number, S.Period][] = years.flatMap((y) => gran === "年度" ? [[y, "FY"] as [number, S.Period]] : (["FY", ...S.QUARTERS] as S.Period[]).map((p) => [y, p] as [number, S.Period]));
  const rows = useMemo(() => S.pivot(facts), [facts]).filter((r) => cols.some(([y, p]) => r.cells.has(S.colKey(y, p))));
  const inRange = facts.filter((f) => f.year >= y0 && f.year <= y1 && (gran === "年度+季度" || f.period === "FY"));

  // 图表
  const cm = metrics.includes(chartMetric) ? chartMetric : metrics[0];
  const cdef = cm ? S.metricDef(cm) : undefined;
  const series = useMemo(() => cm ? S.buildSeries(facts.filter((f) => f.metric === cm), dim) : [], [facts, cm, dim]);
  const pk = (picked ?? series.slice(0, 5).map((s) => s.key)).filter((k) => series.some((s) => s.key === k));
  const unit = series.find((s) => s.key === pk[0])?.unit;
  const active = series.filter((s) => pk.includes(s.key) && s.unit === unit);
  const axis: [number, S.Period][] = gran === "年度" ? years.map((y) => [y, "FY"]) : years.flatMap((y) => S.QUARTERS.map((q) => [y, q] as [number, S.Period]));
  const chartData = axis.map(([y, p]) => {
    const o: Record<string, string | number | null> = { name: p === "FY" ? String(y) : `${y} ${p}` };
    active.forEach((s, i) => {
      o[`s${i}`] = mode === "原值" ? s.values.get(S.colKey(y, p)) ?? null
        : S.growthAt((yy, pp) => s.values.get(S.colKey(yy, pp)), y, p, mode, !!cdef?.ratio).value;
    });
    return o;
  });
  const valueUnit = mode === "原值" ? unit : cdef?.ratio ? "pt" : "%";
  const pieRows = active.map((s, i) => ({ name: s.label, value: s.values.get(S.colKey(pieAt.year, pieAt.period)) ?? 0, i })).filter((x) => x.value > 0);
  const pieTotal = pieRows.reduce((a, x) => a + x.value, 0);

  const toggleMetric = (m: S.MetricKey) => { setMetrics((ms) => ms.includes(m) ? ms.filter((x) => x !== m) : [...ms, m]); setPicked(null); };
  const exportCSV = () => {
    const url = URL.createObjectURL(new Blob([S.toCSV(inRange)], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a"); a.href = url; a.download = `基本数据sheet_${y0}-${y1}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  function renderCell(r: S.SheetRow, y: number, p: S.Period) {
    const f = r.cells.get(S.colKey(y, p));
    const def = S.metricDef(r.head.metric);
    let text = "", title = "未录入", cls = "text-muted-foreground/50";
    if (mode === "原值") {
      if (!f) { if (p !== "FY" && r.cells.has(S.colKey(y, "FY"))) { text = "仅年度"; title = "该期间仅有年度披露，全年值不拆分到季度"; cls = "text-[10px] text-muted-foreground/60"; } }
      else if (f.value === null) { text = "缺"; title = `缺失原因：${f.missingReason}`; cls = "text-destructive/80"; }
      else { text = fmt(f.value); title = `${f.unit} · 点击查看来源`; cls = ""; }
    } else {
      const g = S.growthAt((yy, pp) => r.cells.get(S.colKey(yy, pp))?.value, y, p, mode, def.ratio);
      if (g.value === null) { text = f ? "—" : ""; title = g.reason ?? ""; }
      else { text = `${g.value > 0 ? "+" : ""}${g.value.toFixed(1)}${def.ratio ? "pt" : "%"}`; title = `${mode}，较 ${g.base}`; cls = g.value >= 0 ? "text-accent" : "text-destructive"; }
    }
    return (
      <td key={`${y}${p}`} title={title} onClick={f ? () => setSel(f) : undefined}
        className={`whitespace-nowrap p-2 text-right tabular-nums ${p === "FY" && gran !== "年度" ? "border-l border-border bg-secondary/40 font-medium" : ""} ${f ? "cursor-pointer hover:bg-secondary" : ""} ${sel && f && sel.id === f.id ? "ring-2 ring-inset ring-accent" : ""} ${cls}`}>
        {text}
      </td>
    );
  }

  const labelCols: [string, (f: S.Fact) => string][] = [
    ["主体", (f) => f.entity], ["大区", (f) => f.zone], ["国家", (f) => f.country], ["市场", (f) => f.market], ["品类", (f) => f.cat],
    ["品牌/渠道", (f) => f.brand ?? f.channel ?? ""], ["指标（口径）", (f) => [f.metric, S.variantOf(f)].filter(Boolean).join(" · ")], ["单位", (f) => f.unit],
  ];

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="font-serif text-xl">基本数据 Sheet</h3>
          <p className="text-xs text-muted-foreground">一条事实一行存储，展示时透视为矩阵 · 年份 2014–2026 为模板覆盖范围，按可得资料填报 · 示例数据，需以财报核实</p>
        </div>
        <button type="button" onClick={exportCSV} className="rounded-md border border-border bg-card px-3 py-1.5 text-xs hover:bg-secondary">导出事实表 CSV（{inRange.length} 条）</button>
      </div>

      <div className={`${card} mt-4 space-y-2 p-4`}>
        <Row label="公司">{["全部", ...S.ENTITIES].map((e) => <Chip key={e} on={entity === e} onClick={() => setEntity(e)}>{e}</Chip>)}</Row>
        <Row label="大区">{["全部", ...zones].map((z) => <Chip key={z} on={zone === z} onClick={() => { setZone(z); setCountry("全部"); setMarket("全部"); }}>{z}</Chip>)}</Row>
        <Row label="国家">{["全部", ...countries].map((c) => <Chip key={c} on={country === c} onClick={() => { setCountry(c); setMarket("全部"); }}>{c}</Chip>)}</Row>
        <Row label="市场">{["全部", ...markets].map((m) => <Chip key={m} on={market === m} onClick={() => setMarket(m)}>{m}</Chip>)}</Row>
        <Row label="品类">{["全部", ...S.SHEET_CATS].map((c) => <Chip key={c} on={cat === c} onClick={() => setCat(c)}>{c}</Chip>)}</Row>
        <Row label="渠道">{["全部", "不分渠道", ...S.CHANNELS].map((c) => <Chip key={c} on={channel === c} onClick={() => setChannel(c)}>{c}</Chip>)}</Row>
        <Row label="指标">
          {S.METRIC_DEFS.map((m) => (
            <label key={m.key} title={`${m.reportName} · ${m.note}`} className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${metrics.includes(m.key) ? "border-primary bg-primary/10" : "border-border bg-card"}`}>
              <input type="checkbox" className="accent-[var(--primary)]" checked={metrics.includes(m.key)} onChange={() => toggleMetric(m.key)} />
              {m.key}
            </label>
          ))}
        </Row>
        <Row label="时间">
          <select aria-label="起始年份" value={y0} onChange={(e) => setY0(Math.min(+e.target.value, y1))} className="rounded-md border border-border bg-card px-2 py-1 text-xs">{S.SHEET_YEARS.map((y) => <option key={y}>{y}</option>)}</select>
          <span className="text-xs text-muted-foreground">至</span>
          <select aria-label="结束年份" value={y1} onChange={(e) => setY1(Math.max(+e.target.value, y0))} className="rounded-md border border-border bg-card px-2 py-1 text-xs">{S.SHEET_YEARS.map((y) => <option key={y}>{y}</option>)}</select>
          <Seg items={["年度", "年度+季度"] as const} value={gran} onChange={setGran} />
          <span className="ml-2 text-xs text-muted-foreground">数值</span>
          <Seg items={["原值", "同比", "环比"] as const} value={mode} onChange={setMode} />
        </Row>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <Seg items={VIEWS} value={view} onChange={setView} />
        <p className="text-xs text-muted-foreground">{facts.length} 条事实 → {rows.length} 行矩阵{mode !== "原值" && " · 增长按同一行（同口径、同单位）匹配基准期"}</p>
      </div>

      {!metrics.length ? (
        <p className={`${card} mt-4 py-16 text-center text-sm text-muted-foreground`}>请至少勾选一个指标</p>
      ) : view === "表格" ? (
        <div className={`${card} mt-4 max-h-[640px] overflow-auto`}>
          <table className="w-max min-w-full text-xs">
            <thead className="sticky top-0 z-10 bg-secondary">
              <tr>
                {labelCols.map(([h]) => <th key={h} rowSpan={gran === "年度" ? 1 : 2} className="whitespace-nowrap p-2 text-left font-medium">{h}</th>)}
                {years.map((y) => <th key={y} colSpan={gran === "年度" ? 1 : 5} className="border-l border-border p-2 text-center font-medium">{y}</th>)}
              </tr>
              {gran !== "年度" && (
                <tr>{years.map((y) => (["全年", "Q1", "Q2", "Q3", "Q4"]).map((p) => <th key={y + p} className={`p-1.5 text-right font-normal text-muted-foreground ${p === "全年" ? "border-l border-border" : ""}`}>{p}</th>))}</tr>
              )}
            </thead>
            <tbody>
              {rows.map((r, ri) => {
                const prev = rows[ri - 1]?.head;
                return (
                  <tr key={r.key} className="border-t border-border">
                    {labelCols.map(([h, get], ci) => {
                      const same = prev && labelCols.slice(0, ci + 1).every(([, g]) => g(prev) === g(r.head)) && ci < 5;
                      return <td key={h} className={`whitespace-nowrap p-2 ${ci === 6 ? "font-medium" : ""} ${same ? "text-transparent" : ""}`}>{get(r.head)}</td>;
                    })}
                    {cols.map(([y, p]) => renderCell(r, y, p))}
                  </tr>
                );
              })}
              {!rows.length && <tr><td colSpan={labelCols.length + cols.length} className="py-16 text-center text-muted-foreground">该条件下暂无数据</td></tr>}
            </tbody>
          </table>
        </div>
      ) : view === "事实明细" ? (
        <div className={`${card} mt-4 max-h-[640px] overflow-auto`}>
          <table className="w-max min-w-full text-xs">
            <thead className="sticky top-0 bg-secondary"><tr>
              {["ID", "主体", "大区", "国家", "市场", "品类", "品牌/渠道", "年度", "季度", "指标", "值", "币种/单位", "统计口径", "口径字段", "来源", "证据位置"].map((h) => <th key={h} className="whitespace-nowrap p-2 text-left font-medium">{h}</th>)}
            </tr></thead>
            <tbody>
              {inRange.slice(0, 300).map((f) => (
                <tr key={f.id} onClick={() => setSel(f)} className={`cursor-pointer border-t border-border hover:bg-secondary ${sel?.id === f.id ? "bg-secondary" : ""}`}>
                  {[f.id, f.entity, f.zone, f.country, f.market, f.cat, f.brand ?? f.channel ?? "", f.year, f.period === "FY" ? "全年" : f.period, f.metric].map((v, i) => <td key={i} className="whitespace-nowrap p-2">{v}</td>)}
                  <td className={`whitespace-nowrap p-2 text-right tabular-nums ${f.value === null ? "text-destructive/80" : ""}`}>{f.value === null ? `缺（${f.missingReason}）` : fmt(f.value)}</td>
                  {[f.unit, f.basis, Object.entries(f.meta).map(([k, v]) => `${k}：${v}`).join("；"), f.source, f.evidence].map((v, i) => <td key={i} className="whitespace-nowrap p-2 text-muted-foreground">{v}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
          {inRange.length > 300 && <p className="p-3 text-center text-xs text-muted-foreground">仅显示前 300 条，共 {inRange.length} 条；完整数据请导出 CSV</p>}
        </div>
      ) : (
        <div className="mt-4 grid gap-4 lg:grid-cols-[18rem_1fr]">
          <div className={`${card} space-y-3 p-4`}>
            <div>
              <p className="mb-1.5 text-xs text-muted-foreground">图表指标</p>
              <div className="flex flex-wrap gap-1.5">{metrics.map((m) => <Chip key={m} on={cm === m} onClick={() => { setChartMetric(m); setPicked(null); }}>{m}</Chip>)}</div>
            </div>
            <div>
              <p className="mb-1.5 text-xs text-muted-foreground">按维度汇总</p>
              <div className="flex flex-wrap gap-1.5">{DIMS.map((d) => <Chip key={d} on={dim === d} onClick={() => { setDim(d); setPicked(null); }}>{d}</Chip>)}</div>
            </div>
            <div>
              <p className="mb-1.5 text-xs text-muted-foreground">勾选序列 {unit && `· 单位 ${unit}`}</p>
              <ul className="max-h-72 space-y-1 overflow-auto pr-1">
                {series.map((s) => {
                  const on = pk.includes(s.key), off = !!unit && s.unit !== unit && !on;
                  return (
                    <li key={s.key}>
                      <label title={off ? `单位不同（${s.unit}），不能与 ${unit} 混画` : s.label} className={`flex items-start gap-2 text-xs ${off ? "opacity-40" : "cursor-pointer"}`}>
                        <input type="checkbox" disabled={off} checked={on} className="mt-0.5 accent-[var(--primary)]"
                          onChange={() => setPicked(on ? pk.filter((k) => k !== s.key) : [...pk, s.key])} />
                        <span>{s.label} <span className="text-muted-foreground">（{s.unit}）</span>{s.mixed && <span className="text-destructive"> 比率不可加总</span>}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className={`${card} p-5`}>
            <p className="font-medium">{cm} <span className="text-xs font-normal text-muted-foreground">{cdef?.reportName} · {view === "饼图" ? "构成" : mode} {valueUnit && view !== "饼图" ? `（${valueUnit}）` : ""}</span></p>
            {view === "饼图" ? (
              !cdef?.additive ? (
                <p className="py-24 text-center text-sm text-muted-foreground">「{cm}」是比率，同一期间不能加总，饼图不适用，请用折线图或条形图。</p>
              ) : (
                <>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <select aria-label="饼图年份" value={pieAt.year} onChange={(e) => setPieAt({ ...pieAt, year: +e.target.value })} className="rounded-md border border-border bg-card px-2 py-1 text-xs">{years.map((y) => <option key={y}>{y}</option>)}</select>
                    {(["FY", ...S.QUARTERS] as S.Period[]).map((p) => <Chip key={p} on={pieAt.period === p} onClick={() => setPieAt({ ...pieAt, period: p })}>{p === "FY" ? "全年" : p}</Chip>)}
                    <span className="text-xs text-muted-foreground">同一期间、同一口径（{unit}）下的构成</span>
                  </div>
                  {pieRows.length ? (
                    <div className="grid items-center gap-4 md:grid-cols-[1fr_14rem]">
                      <div className="h-80"><ResponsiveContainer><PieChart>
                        <Pie data={pieRows} dataKey="value" nameKey="name" innerRadius="50%" outerRadius="85%" paddingAngle={2} stroke="var(--card)">
                          {pieRows.map((x) => <Cell key={x.name} fill={COLORS[x.i % COLORS.length]} />)}
                        </Pie>
                        <Tooltip formatter={(v: number) => [`${fmt(v)} ${unit}（${((v / pieTotal) * 100).toFixed(1)}%）`, ""]} />
                      </PieChart></ResponsiveContainer></div>
                      <ul className="space-y-1 text-xs">{pieRows.map((x) => (
                        <li key={x.name} className="flex items-center gap-2"><span className="h-2 w-2 shrink-0 rounded-full" style={{ background: COLORS[x.i % COLORS.length] }} />{x.name}<span className="ml-auto tabular-nums">{((x.value / pieTotal) * 100).toFixed(1)}%</span></li>
                      ))}</ul>
                    </div>
                  ) : <p className="py-24 text-center text-sm text-muted-foreground">该期间没有可加总的数据（可能仅有年度或季度披露）</p>}
                </>
              )
            ) : active.length ? (
              <div className="mt-3 h-96"><ResponsiveContainer>
                {view === "折线图" ? (
                  <LineChart data={chartData}>
                    <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v: number) => `${fmt(v)} ${valueUnit ?? ""}`} /><Legend wrapperStyle={{ fontSize: 11 }} />
                    {active.map((s, i) => <Line key={s.key} dataKey={`s${i}`} name={s.label} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={false} connectNulls={false} />)}
                  </LineChart>
                ) : (
                  <BarChart data={chartData}>
                    <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v: number) => `${fmt(v)} ${valueUnit ?? ""}`} /><Legend wrapperStyle={{ fontSize: 11 }} />
                    {active.map((s, i) => <Bar key={s.key} dataKey={`s${i}`} name={s.label} fill={COLORS[i % COLORS.length]} />)}
                  </BarChart>
                )}
              </ResponsiveContainer></div>
            ) : <p className="py-24 text-center text-sm text-muted-foreground">请在左侧勾选序列</p>}
          </div>
        </div>
      )}

      {sel && (
        <div className={`${card} mt-4 p-5`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs tracking-widest text-muted-foreground">单元格溯源 · {sel.id}</p>
              <p className="mt-1 font-medium">{S.rowLabel(sel)} · {sel.metric} · {sel.year} {sel.period === "FY" ? "全年" : sel.period}</p>
            </div>
            <button type="button" onClick={() => setSel(null)} className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:bg-secondary">关闭</button>
          </div>
          <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
            {([
              ["值", sel.value === null ? `空值（${sel.missingReason}）` : `${fmt(sel.value)} ${sel.unit}`], ["财报指标名", S.metricDef(sel.metric).reportName],
              ["币种 / 单位", sel.unit], ["统计口径", sel.basis], ...Object.entries(sel.meta), ["来源", sel.source], ["证据位置", sel.evidence],
              ["字段校验", S.validateFact(sel).join("；") || "字段完整"],
            ] as [string, string][]).map(([k, v]) => (
              <Fragment key={k}><div className="flex gap-3"><dt className="w-24 shrink-0 text-muted-foreground">{k}</dt><dd>{v}</dd></div></Fragment>
            ))}
          </dl>
        </div>
      )}

      <details className={`${card} mt-4 p-4`}>
        <summary className="cursor-pointer text-sm font-medium">指标统计口径与字段要求</summary>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-secondary"><tr>{["指标", "财报指标名", "必填口径字段", "可加总 / 饼图", "说明"].map((h) => <th key={h} className="p-2 text-left font-medium">{h}</th>)}</tr></thead>
            <tbody>{S.METRIC_DEFS.map((m) => (
              <tr key={m.key} className="border-t border-border">
                <td className="p-2 font-medium">{m.key}</td><td className="p-2">{m.reportName}</td>
                <td className="p-2">{["值", "币种或单位", "统计口径", "来源", "证据位置", ...m.required].join("、")}</td>
                <td className="p-2">{m.additive ? "可" : "否（比率）"}</td><td className="p-2 text-muted-foreground">{m.note}</td>
              </tr>
            ))}</tbody>
          </table>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-muted-foreground">
            <li>保留年度披露与季度披露的原始粒度；年报全年值不拆分填入各季度（表中显示「仅年度」）。</li>
            <li>空值注明缺失原因（表中显示「缺」，悬停可看原因）；零值仅在有明确证据时填写。</li>
            <li>同比匹配上一年同期且同一口径、同一单位；环比 Q1 以上一年 Q4 为基准；比率类指标的增长以百分点（pt）计。</li>
            <li>原「增长区域」字段已删除，地区增长请选择大区 / 国家后切换到「同比」查看。</li>
            <li>原始币种不做换算，不同币种、不同口径不会混在同一行或同一张图里。</li>
          </ul>
        </div>
      </details>
    </div>
  );
}
