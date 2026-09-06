"use client";

import { useMemo, type ReactElement } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fmtNum, type PlanRow } from "@/lib/plan";

const COLORS = [
  "#1c37a8", // lapis
  "#16706b", // faience
  "#8a6a16", // gold
  "#0e1f63", // lapis-deep
  "#e4e8f8", // lapis-soft
  "#e0efee", // faience-soft
  "#f7f0da", // gold-soft
  "#454a63", // ink-2
];

const TICK = { fontSize: 12, fill: "#454a63" };

interface DataChartsProps {
  data: PlanRow[];
}

type NamedValue = { name: string; value: number };

function ChartPlot({
  children,
  height,
}: {
  children: ReactElement;
  height: number;
}) {
  // Recharts measures in LTR. Under dir=rtl, ticks flip inside the plot and
  // horizontal bars collapse to zero width.
  return (
    <div className="chart-plot" dir="ltr">
      <ResponsiveContainer width="100%" height={height}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}

function VBars({
  data,
  fill,
  format,
}: {
  data: NamedValue[];
  fill: string;
  format: (n: number) => string;
}) {
  return (
    <ChartPlot height={380}>
      <BarChart
        data={data}
        margin={{ top: 12, right: 12, left: 8, bottom: 12 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="name"
          type="category"
          interval={0}
          angle={-40}
          textAnchor="end"
          height="auto"
          tick={TICK}
          tickMargin={10}
          mirror={false}
        />
        <YAxis type="number" tick={TICK} width="auto" />
        <Tooltip
          formatter={(value: unknown) => format(value as number)}
          labelStyle={{ direction: "rtl" }}
        />
        <Bar
          dataKey="value"
          fill={fill}
          maxBarSize={48}
          isAnimationActive={false}
        />
      </BarChart>
    </ChartPlot>
  );
}

export default function DataCharts({ data }: DataChartsProps) {
  // Group by governorate and sum money
  const byGov = useMemo(() => {
    const map = new Map<string, number>();
    data.forEach((r) => {
      if (r.egpM !== null) {
        const current = map.get(r.gov) || 0;
        map.set(r.gov, current + r.egpM);
      }
    });
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [data]);

  // Group by sector and count items
  const bySector = useMemo(() => {
    const map = new Map<string, number>();
    data.forEach((r) => {
      const current = map.get(r.sector) || 0;
      map.set(r.sector, current + 1);
    });
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [data]);

  // Group by program and count items
  const byProgram = useMemo(() => {
    const map = new Map<string, number>();
    data.forEach((r) => {
      const current = map.get(r.program) || 0;
      map.set(r.program, current + 1);
    });
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [data]);

  // Money by sector
  const moneyBySector = useMemo(() => {
    const map = new Map<string, number>();
    data.forEach((r) => {
      if (r.egpM !== null) {
        const current = map.get(r.sector) || 0;
        map.set(r.sector, current + r.egpM);
      }
    });
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [data]);

  if (data.length === 0) {
    return (
      <div className="empty">
        <p>لا بيانات لعرضها.</p>
      </div>
    );
  }

  return (
    <div className="charts-grid">
      <div className="chart-card">
        <h3>الاستثمارات حسب المحافظة (مليار جنيه)</h3>
        <VBars
          data={byGov}
          fill={COLORS[0]}
          format={(n) => `${fmtNum(n)} مليار جنيه`}
        />
      </div>

      <div className="chart-card">
        <h3>عدد البنود حسب القطاع</h3>
        <ChartPlot height={280}>
          <PieChart>
            <Pie
              data={bySector}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={110}
            >
              {bySector.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value: unknown) => fmtNum(value as number)} />
          </PieChart>
        </ChartPlot>
        <ul className="chart-legend">
          {bySector.map((s, i) => (
            <li key={s.name}>
              <span
                className="chart-legend-swatch"
                style={{ background: COLORS[i % COLORS.length] }}
              />
              <span>{s.name}</span>
              <span className="num">{fmtNum(s.value)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="chart-card">
        <h3>عدد البنود حسب البرنامج</h3>
        <VBars
          data={byProgram}
          fill={COLORS[1]}
          format={(n) => `${fmtNum(n)} بند`}
        />
      </div>

      <div className="chart-card">
        <h3>الاستثمارات حسب القطاع (مليار جنيه)</h3>
        <VBars
          data={moneyBySector}
          fill={COLORS[3]}
          format={(n) => `${fmtNum(n)} مليار جنيه`}
        />
      </div>
    </div>
  );
}
