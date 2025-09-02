// src/pages/Dashboard.tsx
import { useEffect, useMemo, useState } from "react";
import { api } from "../api";
import type { Expense, Category } from "../api";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RTooltip,
  Legend as RLegend,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
} from "recharts";

const CAT_COLORS: Record<Category, string> = {
  Food: "#FEC84B",
  Transport: "#7EA6FF",
  Shopping: "#9DB2FF",
  Education: "#7BDFF2",
  Health: "#FF7E7E",
  Other: "#B8B8B8",
};

const money = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

function isSameMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function lastNMonthKeys(n: number, base = new Date()) {
  const keys: string[] = [];
  const d = new Date(base);
  d.setDate(1);
  for (let i = n - 1; i >= 0; i--) {
    const t = new Date(d);
    t.setMonth(d.getMonth() - i);
    keys.push(monthKey(t));
  }
  return keys;
}

export default function Dashboard() {
  const [rows, setRows] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setRows(await api.list());
      } catch (e: any) {
        setErr(String(e?.message ?? e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const now = new Date();

  // Data for current month only
  const thisMonthExpenses = useMemo(() => {
    return rows.filter((r) => isSameMonth(new Date(r.date), now));
  }, [rows]);

  const totalThisMonth = useMemo(
    () => thisMonthExpenses.reduce((sum, r) => sum + (Number(r.amount) || 0), 0),
    [thisMonthExpenses]
  );

  const byCategory = useMemo(() => {
    const acc = new Map<Category, number>();
    for (const r of thisMonthExpenses) {
      const v = Number(r.amount) || 0;
      acc.set(r.category, (acc.get(r.category) || 0) + v);
    }
    return acc;
  }, [thisMonthExpenses]);

  const topCategory = useMemo(() => {
    let best: { cat: Category; value: number } | null = null;
    byCategory.forEach((value, cat) => {
      if (!best || value > best.value) best = { cat, value };
    });
    return best;
  }, [byCategory]);

  // Pie data (current month)
  const pieData = useMemo(
    () =>
      Array.from(byCategory.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value),
    [byCategory]
  );

  // Line data (last 6 months, total per month)
  const lineData = useMemo(() => {
    const keys = lastNMonthKeys(6, now);
    const sums = new Map<string, number>(keys.map((k) => [k, 0]));
    for (const r of rows) {
      const k = monthKey(new Date(r.date));
      if (sums.has(k)) sums.set(k, (sums.get(k) || 0) + (Number(r.amount) || 0));
    }
    return keys.map((k) => ({ month: k, expense: sums.get(k) || 0 }));
  }, [rows]);

  if (loading) return <p>Loading…</p>;
  if (err) return <p className="error">{err}</p>;

  return (
    <>
      <h2>Dashboard</h2>

      {/* KPI cards */}
      <div className="grid-2">
        <div className="card">
          <h3>Total spend (month)</h3>
          <div style={{ fontSize: 36, fontWeight: 800, marginTop: 8 }}>
            {money.format(totalThisMonth)}
          </div>
          <div style={{ color: "var(--muted)", marginTop: 4 }}>{monthKey(now)}</div>
        </div>

        <div className="card">
          <h3>Top category</h3>
          {topCategory ? (
            <>
              <div style={{ fontSize: 28, fontWeight: 800, marginTop: 8 }}>
                {topCategory.cat}
              </div>
              <div style={{ color: "var(--muted)", marginTop: 4 }}>
                {money.format(topCategory.value)}
              </div>
            </>
          ) : (
            <div style={{ color: "var(--muted)" }}>No data</div>
          )}
        </div>
      </div>

      {/* Charts */}
      <div className="grid-2">
        {/* Expense ratio (donut) */}
        <div className="card">
          <h3>Expense ratio</h3>
          {pieData.length === 0 ? (
            <div style={{ color: "var(--muted)" }}>No data</div>
          ) : (
            <div style={{ width: "100%", height: 320 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={3}
                  >
                    {pieData.map((item, i) => (
                      <Cell key={i} fill={CAT_COLORS[item.name as Category] || "#ccc"} />
                    ))}
                  </Pie>
                  <RTooltip
                    formatter={(v: number) => money.format(v || 0)}
                    labelFormatter={(l) => String(l)}
                  />
                  <RLegend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Spending trends (last 6 months) */}
        <div className="card">
          <h3>Spending trends</h3>
          <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <RTooltip formatter={(v: number) => money.format(v || 0)} />
                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="#5C8DF6"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}
