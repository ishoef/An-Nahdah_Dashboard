"use client";

import React, { useMemo, useState } from "react";
import {
  Download,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  MoreVertical,
} from "lucide-react";
import DashboardShell from "@/components/layout/DashobardShell";

const PRIMARY = "#206380";

function formatCurrency(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

// small helper: create CSV and download
function downloadCSV(rows, filename = "transactions.csv") {
  if (!rows || rows.length === 0) return;
  const keys = Object.keys(rows[0]);
  const csv = [
    keys.join(","),
    ...rows.map((r) =>
      keys.map((k) => `"${String(r[k]).replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function RevenuePage() {
  // sample monthly revenue dataset (use real fetch in production)
  const sampleData = useMemo(
    () => [
      { month: "Jan", value: 8200 },
      { month: "Feb", value: 9400 },
      { month: "Mar", value: 10200 },
      { month: "Apr", value: 9000 },
      { month: "May", value: 11600 },
      { month: "Jun", value: 12400 },
      { month: "Jul", value: 13800 },
      { month: "Aug", value: 12900 },
      { month: "Sep", value: 14200 },
      { month: "Oct", value: 15700 },
      { month: "Nov", value: 16400 },
      { month: "Dec", value: 17800 },
    ],
    []
  );

  const transactions = useMemo(
    () => [
      {
        id: "TX-1001",
        instructor: "Umar Ali",
        amount: 1200,
        date: "2025-11-27",
        status: "Paid",
      },
      {
        id: "TX-1002",
        instructor: "Fatima Noor",
        amount: 450,
        date: "2025-11-26",
        status: "Pending",
      },
      {
        id: "TX-1003",
        instructor: "Khalid Hasan",
        amount: 980,
        date: "2025-11-25",
        status: "Paid",
      },
      {
        id: "TX-1004",
        instructor: "Aisha Rahman",
        amount: 650,
        date: "2025-11-23",
        status: "Paid",
      },
      {
        id: "TX-1005",
        instructor: "Ibrahim Khan",
        amount: 300,
        date: "2025-11-20",
        status: "Failed",
      },
    ],
    []
  );

  // UI state
  const [range, setRange] = useState("6m"); // 1m | 3m | 6m | 12m
  const [query, setQuery] = useState("");

  // derived
  const visibleData = useMemo(() => {
    if (range === "1m") return sampleData.slice(-1);
    if (range === "3m") return sampleData.slice(-3);
    if (range === "6m") return sampleData.slice(-6);
    return sampleData;
  }, [sampleData, range]);

  const revenueTotal = useMemo(
    () => sampleData.reduce((s, d) => s + d.value, 0),
    [sampleData]
  );
  const recentPayouts = useMemo(
    () => transactions.filter((t) => t.status === "Paid").length,
    [transactions]
  );
  const avgPerInstructor = useMemo(
    () => Math.round((revenueTotal / 12 / 10) * 100) / 100 || 0,
    [revenueTotal]
  ); // demo
  const growth = useMemo(() => {
    const last = sampleData[sampleData.length - 1].value;
    const prev = sampleData[sampleData.length - 2].value;
    return Math.round(((last - prev) / prev) * 100);
  }, [sampleData]);

  const filteredTx = transactions.filter((t) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      t.id.toLowerCase().includes(q) || t.instructor.toLowerCase().includes(q)
    );
  });

  // SVG area chart path builder
  function buildPath(data, w = 760, h = 240, pad = 24) {
    if (!data || data.length === 0) return "";
    const values = data.map((d) => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const rangeV = max - min || 1;
    const stepX = (w - pad * 2) / Math.max(1, data.length - 1);
    const points = data.map((d, i) => {
      const x = pad + i * stepX;
      const y = pad + (1 - (d.value - min) / rangeV) * (h - pad * 2);
      return [x, y];
    });
    const d = points
      .map(
        (p, i) => `${i === 0 ? "M" : "L"} ${p[0].toFixed(2)} ${p[1].toFixed(2)}`
      )
      .join(" ");
    const last = points[points.length - 1];
    const first = points[0];
    const area = `${d} L ${last[0].toFixed(2)} ${h - pad} L ${first[0].toFixed(
      2
    )} ${h - pad} Z`;
    return { line: d, area };
  }

  const chart = buildPath(visibleData, 760, 260, 28);

  return (
    <DashboardShell>
      <div className="min-h-screen p-6 md:p-10">
        {/* Header */}
        <div className=" mx-auto">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-1">
                <button className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-muted/30">
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
                <span className="text-xs text-muted-foreground">
                  / Admin / Revenue
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
                Revenue & Payouts
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Overview of monthly revenue, payouts and salary-related
                transactions.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-card border border-border rounded-md px-2 py-1">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <select
                  value={range}
                  onChange={(e) => setRange(e.target.value)}
                  className="bg-transparent text-sm outline-none"
                  aria-label="Select date range"
                >
                  <option value="1m">1M</option>
                  <option value="3m">3M</option>
                  <option value="6m">6M</option>
                  <option value="12m">12M</option>
                </select>
              </div>

              <button
                onClick={() => downloadCSV(filteredTx)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-primary text-white hover:brightness-95 shadow-sm"
                title="Export transactions"
                aria-label="Export transactions CSV"
                style={{ backgroundColor: PRIMARY }}
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <KPI
              title="Total Revenue (year)"
              value={formatCurrency(revenueTotal)}
              hint="+12% vs last year"
              trend="up"
            />
            <KPI
              title="Payouts"
              value={formatCurrency(recentPayouts * 1000)}
              hint={`${recentPayouts} payouts`}
              trend="up"
            />
            <KPI
              title="Avg / Instructor"
              value={formatCurrency(avgPerInstructor)}
              hint="per month"
              trend="down"
            />
            <KPI
              title="Growth"
              value={`${growth}%`}
              hint="vs prev month"
              trend={growth >= 0 ? "up" : "down"}
            />
          </div>

          {/* Chart + Right summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-medium">Monthly revenue</h3>
                  <p className="text-xs text-muted-foreground">
                    Last {range === "1m" ? "month" : range}
                  </p>
                </div>
                <div className="text-sm font-semibold text-foreground">
                  {formatCurrency(visibleData.reduce((s, d) => s + d.value, 0))}
                </div>
              </div>

              {/* Chart area – responsive container */}
              <div className="w-full overflow-hidden">
                <svg
                  viewBox="0 0 760 260"
                  width="100%"
                  height="260"
                  preserveAspectRatio="none"
                  role="img"
                  aria-label="Monthly revenue chart"
                >
                  {/* area */}
                  <defs>
                    <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor={PRIMARY}
                        stopOpacity="0.18"
                      />
                      <stop
                        offset="100%"
                        stopColor={PRIMARY}
                        stopOpacity="0.04"
                      />
                    </linearGradient>
                  </defs>

                  <path d={chart.area} fill="url(#g1)" stroke="none" />

                  {/* line */}
                  <path
                    d={chart.line}
                    fill="none"
                    stroke={PRIMARY}
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />

                  {/* dots */}
                  {visibleData.map((d, i) => {
                    // compute points same as buildPath step (approx)
                    const w = 760,
                      h = 260,
                      pad = 28;
                    const values = visibleData.map((x) => x.value);
                    const min = Math.min(...values);
                    const max = Math.max(...values);
                    const rangeV = max - min || 1;
                    const stepX =
                      (w - pad * 2) / Math.max(1, visibleData.length - 1);
                    const x = pad + i * stepX;
                    const y =
                      pad + (1 - (d.value - min) / rangeV) * (h - pad * 2);
                    return (
                      <circle
                        key={d.month}
                        cx={x}
                        cy={y}
                        r={3.5}
                        fill="#fff"
                        stroke={PRIMARY}
                        strokeWidth="1.6"
                      />
                    );
                  })}

                  {/* month labels */}
                  {visibleData.map((d, i) => {
                    const w = 760,
                      pad = 28;
                    const stepX =
                      (w - pad * 2) / Math.max(1, visibleData.length - 1);
                    const x = pad + i * stepX;
                    return (
                      <text
                        key={d.month}
                        x={x}
                        y={250}
                        fontSize="10"
                        textAnchor="middle"
                        fill="#7A8B8F"
                      >
                        {d.month}
                      </text>
                    );
                  })}
                </svg>
              </div>
            </div>

            <aside className="bg-card border border-border rounded-lg p-4 flex flex-col gap-3">
              <h4 className="text-sm font-medium">Snapshot</h4>
              <div className="text-sm text-muted-foreground">This month</div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">Revenue</div>
                  <div className="text-lg font-semibold">
                    {formatCurrency(visibleData[visibleData.length - 1].value)}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm" aria-hidden>
                  {growth >= 0 ? (
                    <ArrowUpRight className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <ArrowDownRight className="w-5 h-5 text-rose-500" />
                  )}
                  <div
                    className={`text-sm font-medium ${
                      growth >= 0 ? "text-emerald-500" : "text-rose-500"
                    }`}
                  >
                    {growth}%
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-3">
                <div className="text-xs text-muted-foreground mb-2">
                  Quick actions
                </div>
                <div className="flex flex-col gap-2">
                  <button className="w-full px-3 py-2 rounded-md border border-border text-sm hover:bg-muted">
                    Create payout
                  </button>
                  <button
                    onClick={() => downloadCSV(transactions)}
                    className="w-full px-3 py-2 rounded-md bg-primary text-white text-sm"
                  >
                    Export transactions
                  </button>
                </div>
              </div>
            </aside>
          </div>

          {/* Transactions */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h3 className="text-sm font-medium">Recent transactions</h3>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search tx or instructor"
                    className="pl-9 pr-3 py-2 rounded-md border border-border bg-transparent text-sm w-64 focus:outline-none"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Search className="w-4 h-4" />
                  </div>
                </div>
                <button
                  onClick={() => downloadCSV(filteredTx)}
                  className="px-3 py-2 rounded-md border border-border text-sm hover:bg-muted inline-flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-muted-foreground">
                    <th className="px-3 py-2">ID</th>
                    <th className="px-3 py-2">Instructor</th>
                    <th className="px-3 py-2">Amount</th>
                    <th className="px-3 py-2">Date</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTx.map((t) => (
                    <tr
                      key={t.id}
                      className="border-t border-border hover:bg-muted"
                    >
                      <td className="px-3 py-3 font-medium">{t.id}</td>
                      <td className="px-3 py-3">{t.instructor}</td>
                      <td className="px-3 py-3">{formatCurrency(t.amount)}</td>
                      <td className="px-3 py-3 text-muted-foreground">
                        {t.date}
                      </td>
                      <td className="px-3 py-3">
                        <StatusBadge status={t.status} />
                      </td>
                      <td className="px-3 py-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button className="px-2 py-1 rounded-md text-xs border border-border hover:bg-muted">
                            View
                          </button>
                          <button className="px-2 py-1 rounded-md text-xs border border-border hover:bg-muted">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="h-20" />
        </div>
      </div>
    </DashboardShell>
  );
}

/* small subcomponents */

function KPI({ title, value, hint, trend = "up" }) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-muted-foreground">{title}</div>
          <div className="mt-2 text-lg font-semibold">{value}</div>
        </div>
        <div className="text-right">
          <div
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm ${
              trend === "up"
                ? "bg-emerald-50 text-emerald-600"
                : "bg-rose-50 text-rose-600"
            }`}
          >
            {trend === "up" ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownRight className="w-4 h-4" />
            )}
            <span className="text-xs">{hint}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    Paid: { text: "Paid", className: "bg-emerald-100 text-emerald-700" },
    Pending: { text: "Pending", className: "bg-amber-100 text-amber-700" },
    Failed: { text: "Failed", className: "bg-rose-100 text-rose-700" },
  };
  const s = map[status] || {
    text: status,
    className: "bg-gray-100 text-gray-700",
  };
  return (
    <span
      className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${s.className}`}
    >
      {s.text}
    </span>
  );
}
