import { createFileRoute } from "@tanstack/react-router";
import { Fragment, useState, type ReactNode } from "react";
import * as D from "@/lib/report-data";
import { CommercialCharts } from "@/components/CommercialCharts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "半年报 · 公司分析与三线脉络" },
      { name: "description", content: "主体公司分析：基本信息、三线脉络、商业、产品、技术、竞品、供应链与未来路线。" },
      { property: "og:title", content: "半年报 · 公司分析与三线脉络" },
      { property: "og:description", content: "低温、雾化、口含业务的半年度公司分析报告。" },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Report,
});

const NAV = [
  ["info", "1 公司基本信息"], ["commercial", "2 商业表现"], ["product", "3 产品表现"],
  ["tech", "4 技术表现"], ["compete", "5 竞品表现"], ["supply", "6 供应链"], ["future", "7 未来路线"],
];

function Chips<T extends string>({ items, value, onChange }: { items: readonly T[]; value: T | "全部"; onChange: (v: T | "全部") => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {(["全部", ...items] as (T | "全部")[]).map((c) => (
        <button key={c} onClick={() => onChange(c)}
          className={`rounded-full border px-3 py-1 text-xs transition ${value === c ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-secondary"}`}>
          {c}
        </button>
      ))}
    </div>
  );
}

function Section({ id, title, sub, children }: { id: string; title: string; sub?: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-6 border-b border-border py-10">
      <h2 className="font-serif text-2xl">{title}</h2>
      {sub && <p className="mt-1 text-sm text-muted-foreground">{sub}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}

const card = "rounded-xl border border-border bg-card p-5";

function Report() {
  const [tab, setTab] = useState<"analysis" | "timeline">("analysis");
  const [subCat, setSubCat] = useState<D.Cat | "全部">("全部");
  const [subDim, setSubDim] = useState<"skeleton" | "cat">("skeleton");
  const [majorOnly, setMajorOnly] = useState(false);
  const [metric, setMetric] = useState<(typeof D.METRICS)[number]>("销售额");
  const [region, setRegion] = useState<(typeof D.REGIONS)[number] | "全部">("全部");
  const [supCat, setSupCat] = useState<D.Cat | "全部">("全部");
  const [supType, setSupType] = useState<(typeof D.SUPPLY)[number] | "全部">("全部");

  const years = Array.from(new Set(D.events.map((e) => e.year))).sort();
  const evs = D.events.filter((e) => !majorOnly || e.major);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-primary px-8 pt-6 text-primary-foreground">
        <p className="text-xs tracking-widest text-primary-foreground/60">半年报 · 2026 H1 · 主体：低温 / 雾化 / 口含</p>
        <h1 className="mt-1 font-serif text-3xl">Philip Morris International</h1>
        <div className="mt-5 flex gap-1">
          {([["analysis", "公司分析"], ["timeline", "三线脉络"]] as const).map(([k, t]) => (
            <button key={k} onClick={() => setTab(k)}
              className={`rounded-t-lg px-5 py-2 text-sm font-medium transition ${tab === k ? "bg-background text-foreground" : "text-primary-foreground/70 hover:text-primary-foreground"}`}>{t}</button>
          ))}
        </div>
      </header>
      {tab === "timeline" ? (
        <div className="mx-auto max-w-7xl px-8">
          <Section id="timeline" title="三线脉络" sub="品牌 / 投资 / 产线 三条主线并行展示（数据来源：财报）">
            <label className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" checked={majorOnly} onChange={(e) => setMajorOnly(e.target.checked)} /> 仅显示重大事件（阈值）
            </label>
            <div className={`${card} overflow-x-auto`}>
              <div className="grid min-w-[900px]" style={{ gridTemplateColumns: `7rem repeat(${years.length}, minmax(0,1fr))` }}>
                <div />
                {years.map((y) => <div key={y} className="border-b border-border pb-2 text-center text-xs font-medium">{y}</div>)}
                {D.LANES.map((l) => (
                  <Fragment key={l.key}>
                    <div className="border-b border-border py-4 pr-2">
                      <p className="font-medium">{l.key}线</p><p className="text-xs text-muted-foreground">{l.desc}</p>
                    </div>
                    {years.map((y) => (
                      <div key={l.key + y} className="relative flex flex-col justify-center gap-1 border-b border-border px-1 py-4">
                        <span className="absolute inset-x-0 top-1/2 h-px bg-border" />
                        {evs.filter((e) => e.year === y && e.lane === l.key).map((e) => (
                          <span key={e.title} className={`relative rounded-md px-1.5 py-1 text-[11px] leading-tight ${e.major ? "bg-accent text-accent-foreground" : "border border-border bg-background"}`}>{e.title}</span>
                        ))}
                      </div>
                    ))}
                  </Fragment>
                ))}
              </div>
            </div>
          </Section>

        </div>
      ) : (
      <div className="mx-auto flex max-w-7xl gap-8 px-8">
        <nav className="sticky top-0 hidden h-screen w-44 shrink-0 py-10 lg:block">
          {NAV.map(([id, t]) => (
            <a key={id} href={`#${id}`} className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground">{t}</a>
          ))}
        </nav>
        <main className="min-w-0 flex-1">
          <Section id="info" title="1、公司基本信息" sub="法人主体 · 关键子公司骨架">
            <div className="grid gap-4 md:grid-cols-2">
              {[D.legal, D.profile].map((rows, i) => (
                <div key={i} className={card}>
                  <dl className="grid grid-cols-[7rem_1fr] gap-y-2 text-sm">
                    {rows.map(([k, v]) => (<Fragment key={k}><dt className="text-muted-foreground">{k}</dt><dd>{v}</dd></Fragment>))}
                  </dl>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h3 className="font-medium">关键子公司骨架</h3>
                <div className="flex rounded-full border border-border bg-card p-0.5 text-xs">
                  {([["skeleton", "公司骨架（财报口径）"], ["cat", "按品类"]] as const).map(([k, t]) => (
                    <button key={k} onClick={() => setSubDim(k)} className={`rounded-full px-3 py-1 ${subDim === k ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>{t}</button>
                  ))}
                </div>
              </div>
              {subDim === "cat" && <Chips items={["HNB低温", "雾化", "口含"] as D.Cat[]} value={subCat} onChange={setSubCat} />}
            </div>
            {subDim === "skeleton" ? (
              <div className="mt-4">
                <div className="mx-auto w-fit rounded-lg border border-primary bg-primary px-4 py-2 text-sm text-primary-foreground">Philip Morris International Inc.（母公司）</div>
                <div className="mt-4 grid gap-4 lg:grid-cols-4">
                  {D.GROUPS.map((g) => (
                    <div key={g} className="space-y-3 border-t-2 border-primary pt-3">
                      <p className="text-sm font-medium">{g}</p>
                      {D.subsidiaries.filter((s) => s.group === g).map((s) => (
                        <div key={s.name} className={card}>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-medium">{s.name}</h4>
                          <span className="shrink-0 rounded bg-accent/15 px-2 py-0.5 text-xs text-accent">{s.cat}</span>
                        </div>
                        <ul className="mt-3 space-y-1.5 text-sm">
                          <li><b className="font-medium text-muted-foreground">负责人 </b>{s.head}</li>
                          <li><b className="font-medium text-muted-foreground">研发 </b>{s.rd}</li>
                          <li><b className="font-medium text-muted-foreground">制造 </b>{s.factory}</li>
                          <li><b className="font-medium text-muted-foreground">销售 </b>{s.sales}</li>
                        </ul>
                        {s.note && <p className="mt-3 text-xs text-accent">侧重：{s.note}</p>}
                      </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {D.subsidiaries.filter((s) => s.cat !== "传统卷烟" && (subCat === "全部" || s.cat === subCat)).map((s) => (
                <div key={s.name} className={card}>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium">{s.name}</h4>
                    <span className="shrink-0 rounded bg-accent/15 px-2 py-0.5 text-xs text-accent">{s.cat}</span>
                  </div>
                  <ul className="mt-3 space-y-1.5 text-sm">
                    <li><b className="font-medium text-muted-foreground">负责人 </b>{s.head}</li>
                    <li><b className="font-medium text-muted-foreground">研发 </b>{s.rd}</li>
                    <li><b className="font-medium text-muted-foreground">制造 </b>{s.factory}</li>
                    <li><b className="font-medium text-muted-foreground">销售 </b>{s.sales}</li>
                  </ul>
                  {s.note && <p className="mt-3 text-xs text-accent">侧重：{s.note}</p>}
                </div>
              ))}
            </div>
            )}
          </Section>

          <Section id="commercial" title="2、商业表现" sub="商业大事记 · 核心指标 · 基本数据 sheet">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {D.kpis.map((k) => (
                <div key={k.label} className={card}>
                  <p className="text-xs text-muted-foreground">{k.label}</p>
                  <p className="mt-1 font-serif text-3xl">{k.value}</p>
                  <p className="text-xs text-accent">{k.delta}</p>
                </div>
              ))}
            </div>
            <ol className="mt-6 grid gap-3 md:grid-cols-4">
              {D.milestones.map((m) => (
                <li key={m.year} className="border-l-2 border-accent pl-3">
                  <p className="font-serif text-xl">{m.year}</p><p className="text-sm text-muted-foreground">{m.text}</p>
                </li>
              ))}
            </ol>
            <CommercialCharts />
            <details className="mt-8">
            <summary className="cursor-pointer text-sm font-medium">基本数据 sheet（图表数据依据）</summary>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <Chips items={D.REGIONS} value={region} onChange={setRegion} />
              <div className="flex gap-1 rounded-lg bg-secondary p-1">
                {D.METRICS.map((m) => (
                  <button key={m} onClick={() => setMetric(m)} className={`rounded-md px-3 py-1 text-xs ${metric === m ? "bg-card shadow-sm" : "text-muted-foreground"}`}>{m}</button>
                ))}
              </div>
            </div>
            <div className={`${card} mt-4 overflow-x-auto p-0`}>
              <table className="w-full min-w-[900px] text-xs">
                <thead className="bg-secondary"><tr>
                  <th className="p-2 text-left">地区</th><th className="p-2 text-left">品类</th>
                  {D.YEARS.map((y) => <th key={y} className="p-2 text-right">{y}</th>)}
                </tr></thead>
                <tbody>
                  {D.REGIONS.filter((r) => region === "全部" || r === region).flatMap((r) =>
                    D.CATS.map((c, i) => (
                      <tr key={r + c} className="border-t border-border">
                        <td className="p-2 font-medium">{i === 0 ? r : ""}</td><td className="p-2">{c}</td>
                        {D.YEARS.map((y) => <td key={y} className="p-2 text-right tabular-nums">{D.cell(r, c, y, metric)}</td>)}
                      </tr>
                    )),
                  )}
                </tbody>
              </table>
            </div>
          </details>
          </Section>

          <Section id="product" title="3、产品表现" sub="产品战略：各平台技术路线迭代">
            <div className="space-y-4">
              {D.productLines.map((p) => (
                <div key={p.name} className={card}>
                  <h4 className="font-medium">{p.name}</h4>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                    {p.steps.map((s, i) => (<span key={s} className="flex items-center gap-2">{i > 0 && <span className="text-accent">→</span>}<span className="rounded-md bg-secondary px-2 py-1">{s}</span></span>))}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section id="tech" title="4、技术表现" sub="技术现状与专利 / 法规冲突">
            <div className="grid gap-4 md:grid-cols-3">
              {D.tech.map((t) => (
                <div key={t.topic} className={card}>
                  <h4 className="font-medium">{t.topic}</h4>
                  <p className="mt-2 text-sm">{t.status}</p>
                  <p className="mt-2 text-sm text-destructive">⚠ {t.risk}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section id="compete" title="5、竞品表现" sub="按品类与区域的竞争格局与营销渠道">
            <div className={`${card} overflow-x-auto p-0`}>
              <table className="w-full text-sm">
                <thead className="bg-secondary"><tr>{["竞品", "品类", "区域", "事件", "渠道"].map((h) => <th key={h} className="p-3 text-left">{h}</th>)}</tr></thead>
                <tbody>{D.competitors.map((c) => (
                  <tr key={c.name} className="border-t border-border"><td className="p-3 font-medium">{c.name}</td><td className="p-3">{c.cat}</td><td className="p-3">{c.region}</td><td className="p-3">{c.event}</td><td className="p-3">{c.channel}</td></tr>
                ))}</tbody>
              </table>
            </div>
          </Section>

          <Section id="supply" title="6、供应链与制造约束" sub="品类 × 业务领域 4×3 维度筛选">
            <div className="flex flex-col gap-3">
              <Chips items={D.CATS} value={supCat} onChange={setSupCat} />
              <Chips items={D.SUPPLY} value={supType} onChange={setSupType} />
            </div>
            <div className={`${card} mt-4 overflow-x-auto p-0`}>
              <table className="w-full min-w-[600px] text-xs">
                <thead className="bg-secondary"><tr><th className="p-2" />{D.SUPPLY.map((s) => <th key={s} className="p-2">{s}</th>)}</tr></thead>
                <tbody>{D.CATS.map((c) => (
                  <tr key={c} className="border-t border-border"><td className="p-2 font-medium">{c}</td>
                    {D.SUPPLY.map((s) => {
                      const n = D.suppliers.filter((x) => x.cat === c && x.type === s).length;
                      const on = (supCat === "全部" || supCat === c) && (supType === "全部" || supType === s);
                      return <td key={s} className="p-1"><button onClick={() => { setSupCat(c); setSupType(s); }} className={`w-full rounded-md py-2 ${on ? "bg-accent/20" : "bg-muted"} ${n ? "" : "text-muted-foreground"}`}>{n} 家</button></td>;
                    })}
                  </tr>
                ))}</tbody>
              </table>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {D.suppliers.filter((s) => (supCat === "全部" || s.cat === supCat) && (supType === "全部" || s.type === supType)).map((s) => (
                <div key={s.name} className={card}>
                  <p className="text-xs text-muted-foreground">{s.cat} · {s.type}</p>
                  <h4 className="mt-1 font-medium">{s.name}</h4>
                  <p className="mt-2 text-sm">合作始于 {s.since} · 规模 {s.scale}</p>
                  <p className="mt-2 text-sm"><span className="text-accent">优势</span> {s.good}　<span className="text-destructive">缺陷</span> {s.bad}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section id="future" title="7、客户自身未来路线判断" sub="诉求总结 · 价值转移与成因">
            <div className="grid gap-4 md:grid-cols-2">
              {D.demands.map(([k, v]) => (<div key={k} className={card}><p className="text-xs text-muted-foreground">{k}</p><p className="mt-1 text-sm">{v}</p></div>))}
            </div>
            <div className={`${card} mt-4 border-accent`}>
              <p className="text-sm"><b>阶段判断：</b>发展中 —— 无烟业务高速增长，传统卷烟缓慢衰退。</p>
            </div>
            <div className="mt-6 space-y-3">
              {D.transfers.map((t) => (
                <div key={t.from + t.to} className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="w-12 text-muted-foreground">{t.kind}</span>
                  <span className="rounded-md bg-muted px-2 py-1">{t.from}</span><span className="text-accent">⟶</span>
                  <span className="rounded-md bg-accent px-2 py-1 text-accent-foreground">{t.to}</span>
                  <span className="text-muted-foreground">驱动力：{t.why}</span>
                </div>
              ))}
              <p className="pt-2 text-sm text-muted-foreground">抑制力：健康诉求推动 HNB 增长，但收入下滑使消费者对 HNB 价格敏感。</p>
            </div>
          </Section>
        </main>
      </div>
      )}
    </div>
  );
}
