import { createFileRoute } from "@tanstack/react-router";
import { Fragment, useEffect, useState, type ReactNode } from "react";
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

function KV({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <div>
      <p className="text-xs font-medium tracking-widest text-muted-foreground">{title}</p>
      <dl className="mt-2 grid grid-cols-[7.5rem_1fr] gap-x-3 gap-y-2 text-sm">
        {rows.map(([k, v]) => (
          <Fragment key={k}><dt className="text-muted-foreground">{k}</dt><dd>{v}</dd></Fragment>
        ))}
      </dl>
    </div>
  );
}

const TYPE_STYLE: Record<D.CoEventType, string> = {
  发展历史: "bg-primary text-primary-foreground",
  产品历史: "bg-accent text-accent-foreground",
  品牌投资: "border border-accent text-accent",
  并购: "border border-primary text-foreground",
};

function CompanyEvents() {
  const [type, setType] = useState<D.CoEventType | "全部">("全部");
  const [brand, setBrand] = useState<string>("全部");
  const [majorOnly, setMajorOnly] = useState(false);
  const brands = Array.from(new Set(D.coEvents.filter((e) => e.type === "产品历史" && e.brand).map((e) => e.brand as string)));
  const list = D.coEvents.filter(
    (e) => (type === "全部" || e.type === type) && (!majorOnly || e.major) && (brand === "全部" || e.brand === brand),
  );
  return (
    <div id="events" className="mt-8 scroll-mt-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="font-medium">公司大事件</h3>
          <p className="text-xs text-muted-foreground">发展历史 · 产品历史（仅总公司自有品牌）· 品牌投资 · 并购时间线</p>
        </div>
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <input type="checkbox" checked={majorOnly} onChange={(e) => setMajorOnly(e.target.checked)} /> 只看重大事件
        </label>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-4">
        {D.CO_EVENT_TYPES.map((t) => {
          const n = D.coEvents.filter((e) => e.type === t.key).length;
          const on = type === t.key;
          return (
            <button key={t.key} onClick={() => setType(on ? "全部" : t.key)}
              className={`rounded-lg border p-3 text-left transition ${on ? "border-primary bg-secondary" : "border-border bg-card hover:bg-secondary"}`}>
              <p className="flex items-center justify-between text-sm font-medium">{t.key}<span className="font-serif text-lg">{n}</span></p>
              <p className="text-xs text-muted-foreground">{t.desc}</p>
            </button>
          );
        })}
      </div>
      {(type === "全部" || type === "产品历史") && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">总公司品牌</span>
          <Chips items={brands} value={brand} onChange={setBrand} />
        </div>
      )}
      <ol className={`${card} mt-4 space-y-0`}>
        {list.length === 0 && <li className="text-sm text-muted-foreground">没有符合条件的事件</li>}
        {list.map((e, i) => (
          <li key={e.date + e.title} className="grid grid-cols-[5.5rem_1.25rem_1fr] gap-x-3">
            <span className="pt-0.5 text-right font-serif text-sm tabular-nums">{e.date}</span>
            <span className="relative flex justify-center">
              {i < list.length - 1 && <span className="absolute top-3 bottom-0 w-px bg-border" />}
              <span className={`relative mt-1.5 rounded-full ${e.major ? "h-3 w-3 bg-accent ring-4 ring-accent/20" : "h-2 w-2 bg-muted-foreground/50"}`} />
            </span>
            <div className="pb-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded px-1.5 py-0.5 text-[11px] ${TYPE_STYLE[e.type]}`}>{e.type}</span>
                {e.brand && <span className="rounded bg-secondary px-1.5 py-0.5 text-[11px]">{e.brand}</span>}
                <p className={`text-sm ${e.major ? "font-medium" : ""}`}>{e.title}</p>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{e.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Tags({ label, items }: { label: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div>
      <p className="text-xs font-medium tracking-widest text-muted-foreground">{label}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {items.map((t) => <span key={t} className="rounded-md bg-secondary px-2 py-1 text-xs">{t}</span>)}
      </div>
    </div>
  );
}

function NodePanel({ info, onClose, onOpen }: { info: D.NodeInfo; onClose: () => void; onOpen: (id: string) => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const kids = D.childNodes(info.id);

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={`${info.title} 节点详情`}>
      <button aria-label="关闭节点详情" onClick={onClose} className="absolute inset-0 h-full w-full cursor-default bg-foreground/25 animate-in fade-in duration-200" />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-md animate-in slide-in-from-right duration-200 flex-col border-l border-border bg-card shadow-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-border p-5">
          <div className="min-w-0">
            <p className="text-xs tracking-widest text-muted-foreground">{info.kind}{info.cat ? ` · ${info.cat}` : ""}</p>
            <h3 className="mt-1 font-serif text-xl leading-snug">{info.title}</h3>
            {info.enName && <p className="mt-0.5 text-xs text-muted-foreground">{info.enName}</p>}
          </div>
          <button onClick={onClose} className="shrink-0 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:bg-secondary">关闭</button>
        </div>
        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          <p className="text-sm leading-relaxed">{info.summary}</p>
          <KV title="基本信息" rows={info.basic} />
          <KV title="业务详情" rows={info.business} />
          <Tags label="产品 / 品牌" items={info.products} />
          <Tags label="主要市场" items={info.markets} />
          {info.events.length > 0 && (
            <div>
              <p className="text-xs font-medium tracking-widest text-muted-foreground">关键事件</p>
              <ul className="mt-2 space-y-2 border-l border-accent/40 pl-3 text-sm">
                {info.events.map((e) => <li key={e.year + e.text}><span className="font-serif">{e.year}</span>　{e.text}</li>)}
              </ul>
            </div>
          )}
          {info.risks.length > 0 && (
            <div>
              <p className="text-xs font-medium tracking-widest text-muted-foreground">风险与依赖</p>
              <ul className="mt-2 space-y-1.5 text-sm">
                {info.risks.map((r) => <li key={r} className="text-destructive">⚠ {r}</li>)}
              </ul>
            </div>
          )}
          {kids.length > 0 && (
            <div>
              <p className="text-xs font-medium tracking-widest text-muted-foreground">下属节点（点击查看）</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {kids.map((k) => (
                  <button key={k.id} onClick={() => onOpen(k.id)} className="rounded-full border border-border px-3 py-1 text-xs hover:bg-secondary">{k.title}</button>
                ))}
              </div>
            </div>
          )}
          <p className="pt-1 text-xs text-muted-foreground">示例数据，需以财报核实。</p>
        </div>
      </aside>
    </div>
  );
}

function Report() {
  const [tab, setTab] = useState<"analysis" | "timeline">("analysis");
  const [subCat, setSubCat] = useState<D.Cat | "全部">("全部");
  const [subDim, setSubDim] = useState<"skeleton" | "cat">("skeleton");
  const [majorOnly, setMajorOnly] = useState(false);
  const [metric, setMetric] = useState<(typeof D.METRICS)[number]>("销售额");
  const [region, setRegion] = useState<(typeof D.REGIONS)[number] | "全部">("全部");
  const [supCat, setSupCat] = useState<D.Cat | "全部">("全部");
  const [supType, setSupType] = useState<(typeof D.SUPPLY)[number] | "全部">("全部");
  const [nodeId, setNodeId] = useState<string | null>(null);
  const nodeInfo = nodeId ? D.findNode(nodeId) : undefined;

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
          <Section id="info" title="1、公司基本信息" sub="法人主体 · 公司大事件 · 关键子公司骨架（点击任意节点查看基本信息与业务详情）">
            <div className="grid gap-4 md:grid-cols-2">
              {[D.legal, D.profile].map((rows, i) => (
                <div key={i} className={card}>
                  <dl className="grid grid-cols-[7rem_1fr] gap-y-2 text-sm">
                    {rows.map(([k, v]) => (<Fragment key={k}><dt className="text-muted-foreground">{k}</dt><dd>{v}</dd></Fragment>))}
                  </dl>
                </div>
              ))}
            </div>
            <CompanyEvents />
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
              <div className="mt-6 overflow-x-auto pb-2" role="tree" aria-label="PMI 母公司与关键子公司骨架">
                <div className="min-w-[960px]">
                  <div className="flex justify-center">
                    <button onClick={() => setNodeId("parent")} title="查看母公司详情" className="rounded-xl border border-primary bg-primary px-6 py-3 text-center text-primary-foreground shadow-sm transition hover:bg-primary/90">
                      <p className="text-xs text-primary-foreground/70">母公司 · 点击查看详情</p>
                      <p className="mt-0.5 font-medium">Philip Morris International Inc.</p>
                    </button>
                  </div>
                  <div className="mx-auto h-7 w-px bg-primary/40" />
                  <div className="relative pt-7" role="group">
                    <div className="absolute inset-x-[12.5%] top-0 h-px bg-primary/40" />
                    <div className="grid grid-cols-4 gap-4">
                      {D.GROUPS.map((g) => {
                        const children = D.subsidiaries.filter((s) => s.group === g);
                        return (
                          <div key={g} className="relative" role="treeitem" aria-expanded="true">
                            <div className="absolute -top-7 left-1/2 h-7 w-px bg-primary/40" />
                            <button onClick={() => setNodeId(`group:${g}`)} title={`查看${g}详情`} className="relative z-10 mx-auto block w-fit min-w-32 rounded-lg border border-primary/40 bg-secondary px-4 py-2 text-center transition hover:border-primary hover:bg-primary/10">
                              <p className="text-sm font-medium">{g}</p>
                              <p className="mt-0.5 text-xs text-muted-foreground">{children.length} 家子公司</p>
                            </button>
                            <div className="relative ml-4 mt-4 space-y-3 border-l border-primary/30 pl-4" role="group">
                              {children.map((s) => (
                                <button key={s.name} onClick={() => setNodeId(s.name)} title="查看子公司详情" className={`${card} relative block w-full text-left transition hover:border-primary/60 hover:bg-secondary/40`}>
                                  <span className="absolute -left-4 top-7 h-px w-4 bg-primary/30" />
                                  <span className="absolute -left-[5px] top-[26px] size-2 rounded-full border border-primary/40 bg-background" />
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
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {D.subsidiaries.filter((s) => s.cat !== "传统卷烟" && (subCat === "全部" || s.cat === subCat)).map((s) => (
                <button key={s.name} onClick={() => setNodeId(s.name)} title="查看子公司详情" className={`${card} text-left transition hover:border-primary/60 hover:bg-secondary/40`}>
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
                </button>
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
      {nodeInfo && <NodePanel info={nodeInfo} onClose={() => setNodeId(null)} onOpen={(id) => setNodeId(id)} />}
    </div>
  );
}
