import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import * as D from "@/lib/report-data";

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];
const DIMS = ["营收", "占比", "用户数量", "市场份额", "主要市场销售", "增长区域"] as const;
type Dim = (typeof DIMS)[number];

const num = (r: string, c: D.Cat, y: number, m: string) => {
  const v = parseFloat(D.cell(r, c, y, m));
  return Number.isFinite(v) ? v : 0;
};

function Chip({ on, children, onClick }: { on: boolean; children: string | number; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`rounded-full border px-3 py-1 text-xs transition ${on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-secondary"}`}>
      {children}
    </button>
  );
}

export function CommercialCharts() {
  const [year, setYear] = useState(2025);
  const [region, setRegion] = useState<string>("全部");
  const [cat, setCat] = useState<string>("全部");
  const [dim, setDim] = useState<Dim | "全部">("全部");

  const regions = D.REGIONS.filter((r) => region === "全部" || r === region);
  const cats = D.CATS.filter((c) => cat === "全部" || c === cat);
  const sum = (rs: readonly string[], cs: readonly D.Cat[], y: number, m: string) =>
    rs.reduce((a, r) => a + cs.reduce((b, c) => b + num(r, c, y, m), 0), 0);

  const share = (() => {
    const own = cats.length ? regions.reduce((a, r) => a + cats.reduce((b, c) => b + num(r, c, year, "市占率"), 0), 0) / (regions.length * cats.length) : 0;
    return [{ name: "PMI", value: +own.toFixed(1) }, { name: "其他厂商", value: +(100 - own).toFixed(1) }];
  })();

  const data: Record<Dim, { name: string; value: number }[]> = {
    营收: cats.map((c) => ({ name: c, value: +sum(regions, [c], year, "销售额").toFixed(1) })),
    占比: regions.map((r) => ({ name: r, value: +sum([r], cats, year, "销售额").toFixed(1) })),
    用户数量: cats.map((c) => ({ name: c, value: +sum(regions, [c], year, "量").toFixed(1) })),
    市场份额: share,
    主要市场销售: regions.map((r) => ({ name: r, value: +sum([r], cats, year, "量").toFixed(1) })),
    增长区域: regions.map((r) => ({ name: r, value: +Math.max(0, sum([r], cats, year, "销售额") - sum([r], cats, year - 1, "销售额")).toFixed(1) })),
  };
  const desc: Record<Dim, string> = {
    营收: "按品类的销售额构成", 占比: "各地区营收占比", 用户数量: "按品类的用户 / 销量规模",
    市场份额: "平均市占率", 主要市场销售: "各地区销量", 增长区域: `较 ${year - 1} 年的营收增量`,
  };
  const shown = dim === "全部" ? DIMS : [dim];

  return (
    <div className="mt-8">
      <div className="space-y-2 rounded-xl border border-border bg-card p-4">
        <Row label="维度"><Chip on={dim === "全部"} onClick={() => setDim("全部")}>全部</Chip>{DIMS.map((d) => <Chip key={d} on={dim === d} onClick={() => setDim(d)}>{d}</Chip>)}</Row>
        <Row label="年份">{D.YEARS.filter((y) => y > 2014).map((y) => <Chip key={y} on={year === y} onClick={() => setYear(y)}>{y}</Chip>)}</Row>
        <Row label="地区">{["全部", ...D.REGIONS].map((r) => <Chip key={r} on={region === r} onClick={() => setRegion(r)}>{r}</Chip>)}</Row>
        <Row label="品类">{["全部", ...D.CATS].map((c) => <Chip key={c} on={cat === c} onClick={() => setCat(c)}>{c}</Chip>)}</Row>
      </div>
      <div className={`mt-4 grid gap-4 ${shown.length > 1 ? "md:grid-cols-2 xl:grid-cols-3" : ""}`}>
        {shown.map((d) => {
          const rows = data[d].filter((x) => x.value > 0);
          const total = rows.reduce((a, x) => a + x.value, 0);
          return (
            <div key={d} className="rounded-xl border border-border bg-card p-5">
              <h4 className="font-medium">{d}</h4>
              <p className="text-xs text-muted-foreground">{desc[d]} · {year}</p>
              {rows.length ? (
                <>
                  <div className={shown.length > 1 ? "h-48" : "h-80"}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie data={rows} dataKey="value" nameKey="name" innerRadius="50%" outerRadius="85%" paddingAngle={2} stroke="var(--card)">
                          {rows.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                        <Tooltip formatter={(v: number) => [`${v}（${((v / total) * 100).toFixed(1)}%）`, ""]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <ul className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
                    {rows.map((x, i) => (
                      <li key={x.name} className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                        {x.name} {((x.value / total) * 100).toFixed(0)}%
                      </li>
                    ))}
                  </ul>
                </>
              ) : <p className="py-16 text-center text-sm text-muted-foreground">该条件下暂无数据</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="flex flex-wrap items-center gap-2"><span className="w-10 text-xs text-muted-foreground">{label}</span>{children}</div>;
}
