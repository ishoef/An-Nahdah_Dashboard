"use client";

import React, { useMemo, useState } from "react";
import {
  Download,
  ChevronDown,
  ChevronUp,
  BarChart2,
  Calculator,
  DollarSign,
  TrendingUp,
  Edit3,
  X,
} from "lucide-react";
import DashboardShell from "@/components/layout/DashobardShell";

/** helpers moved to module scope so all components can use them **/

const PRIMARY = "#206380";

function formatMoney(n = 0) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

function formatSum(rows, key) {
  return rows.reduce((s, r) => s + (r[key] || 0), 0);
}

function avgMargin(rows) {
  if (!rows || rows.length === 0) return 0;
  const avg = rows.reduce((s, r) => s + (r.margin || 0), 0) / rows.length;
  return Math.round(avg * 100) / 100;
}

/**
 * CourseProfitabilityDemo (improved expanded details)
 * - same demo data & behavior as before
 * - improved expanded detail UI for each course row
 */
export default function CourseProfitabilityDemo() {
  // --- demo data -----------------------------------------------------------
  const demo = useMemo(
    () => [
      {
        courseId: 101,
        title: "Tajweed Fundamentals",
        revenue: 12450,
        costs: {
          INSTRUCTOR: 4200,
          MARKETING: 1500,
          GRAPHICS: 300,
          DESIGN: 450,
          ETD: 120,
          OTHER: 80,
        },
      },
      {
        courseId: 102,
        title: "Islamic History: Part I",
        revenue: 5400,
        costs: {
          INSTRUCTOR: 1800,
          MARKETING: 900,
          GRAPHICS: 200,
          DESIGN: 250,
          ETD: 50,
          OTHER: 20,
        },
      },
      {
        courseId: 103,
        title: "Quran Recitation Advanced",
        revenue: 8200,
        costs: {
          INSTRUCTOR: 3300,
          MARKETING: 700,
          GRAPHICS: 220,
          DESIGN: 300,
          ETD: 100,
          OTHER: 50,
        },
      },
      {
        courseId: 104,
        title: "Arabic Grammar (Beginner)",
        revenue: 3000,
        costs: {
          INSTRUCTOR: 1200,
          MARKETING: 350,
          GRAPHICS: 120,
          DESIGN: 90,
          ETD: 30,
          OTHER: 10,
        },
      },
      {
        courseId: 105,
        title: "Hadith Studies — Practical",
        revenue: 9600,
        costs: {
          INSTRUCTOR: 4200,
          MARKETING: 1200,
          GRAPHICS: 400,
          DESIGN: 500,
          ETD: 200,
          OTHER: 100,
        },
      },
    ],
    []
  );

  // compute totals & profit per course
  const rows = useMemo(
    () =>
      demo.map((c) => {
        const costTotal = Object.values(c.costs).reduce(
          (s, x) => s + (x || 0),
          0
        );
        const profit = c.revenue - costTotal;
        const margin = c.revenue
          ? Math.round((profit / c.revenue) * 10000) / 100
          : 0;
        return { ...c, costTotal, profit, margin };
      }),
    [demo]
  );

  // --- ui state -------------------------------------------------------------
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("profit"); // revenue | profit | margin
  const [desc, setDesc] = useState(true);
  const [expanded, setExpanded] = useState({}); // map courseId -> bool

  // --- derived list ---------------------------------------------------------
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = rows.filter(
      (r) =>
        !q ||
        r.title.toLowerCase().includes(q) ||
        String(r.courseId).includes(q)
    );
    return list.sort((a, b) => {
      const av = a[sortKey] ?? 0;
      const bv = b[sortKey] ?? 0;
      return desc ? bv - av : av - bv;
    });
  }, [rows, query, sortKey, desc]);

  // --- helpers inside component ---------------------------------------------------------------
  function exportCSV(list = filtered) {
    if (!list || list.length === 0) return;
    const keys = [
      "courseId",
      "title",
      "revenue",
      "costTotal",
      "cost_instructor",
      "cost_marketing",
      "cost_graphics",
      "cost_design",
      "cost_etd",
      "cost_other",
      "profit",
      "margin",
    ];
    const rowsCSV = [
      keys.join(","),
      ...list.map((r) =>
        [
          r.courseId,
          `"${r.title.replace(/"/g, '""')}"`,
          r.revenue,
          r.costTotal,
          r.costs.INSTRUCTOR ?? 0,
          r.costs.MARKETING ?? 0,
          r.costs.GRAPHICS ?? 0,
          r.costs.DESIGN ?? 0,
          r.costs.ETD ?? 0,
          r.costs.OTHER ?? 0,
          r.profit,
          r.margin + "%",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([rowsCSV], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `course-profitability-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // tiny demo transactions (per-course) — purely UI demo
  const demoTx = (courseId) => [
    {
      id: `TX-${courseId}-1`,
      date: "2025-11-27",
      amount: Math.round(
        rows.find((r) => r.courseId === courseId)?.revenue * 0.12 || 120
      ),
      note: "Enrollment",
    },
    {
      id: `TX-${courseId}-2`,
      date: "2025-11-20",
      amount: Math.round(
        rows.find((r) => r.courseId === courseId)?.revenue * 0.05 || 50
      ),
      note: "Refund",
    },
    {
      id: `TX-${courseId}-3`,
      date: "2025-11-05",
      amount: Math.round(
        rows.find((r) => r.courseId === courseId)?.revenue * 0.08 || 80
      ),
      note: "Affiliate",
    },
  ];

  // --- render ---------------------------------------------------------------
  return (
    <DashboardShell>
      <div className="min-h-screen p-6">
        <div className="mx-auto space-y-6">
          {/* header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold flex items-center gap-3">
                <BarChart2 className="w-6 h-6 text-primary" />
                Course Profitability
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                See revenue, detailed cost-breakdown and profit margin per
                course.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-md px-2 py-1">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="outline-none text-sm px-2 py-1 w-52"
                  placeholder="Search course or ID..."
                  aria-label="Search courses"
                />
              </div>

              <div className="inline-flex items-center gap-2">
                <select
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value)}
                  className="text-sm rounded-md border border-slate-200 px-2 py-1 bg-white"
                  aria-label="Sort by"
                >
                  <option value="profit">Sort: Profit</option>
                  <option value="revenue">Sort: Revenue</option>
                  <option value="margin">Sort: Margin</option>
                </select>

                <button
                  onClick={() => setDesc((s) => !s)}
                  className="px-2 py-1 rounded-md border border-slate-200 bg-white text-sm"
                  aria-label="Toggle sort direction"
                  title="Toggle sort direction"
                >
                  {desc ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronUp className="w-4 h-4" />
                  )}
                </button>

                <button
                  onClick={() => exportCSV()}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-[rgba(32,99,128,1)] text-white text-sm shadow-sm hover:brightness-95"
                  title="Export CSV"
                >
                  <Download className="w-4 h-4" /> Export
                </button>
              </div>
            </div>
          </div>

          {/* summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MiniCard
              title="Total Revenue"
              value={formatSum(rows, "revenue")}
              hint="Year-to-date"
            />
            <MiniCard
              title="Total Costs"
              value={formatSum(rows, "costTotal")}
              hint="All courses"
            />
            <MiniCard
              title="Total Profit"
              value={formatSum(rows, "profit")}
              hint="Revenue minus costs"
            />
            <MiniCard
              title="Avg Margin"
              value={`${avgMargin(rows)}%`}
              hint="Average across courses"
              icon={<Calculator className="w-5 h-5" />}
            />
          </div>

          {/* table */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-600 text-xs">
                  <tr>
                    <th className="px-4 py-3 text-left">Course</th>
                    <th className="px-4 py-3 text-right">Revenue</th>
                    <th className="px-4 py-3 text-right">Costs</th>
                    <th className="px-4 py-3 text-right">Profit</th>
                    <th className="px-4 py-3 text-right">Margin</th>
                    <th className="px-4 py-3 text-center">Trend</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((r) => (
                    <React.Fragment key={r.courseId}>
                      <tr className="border-t hover:bg-slate-50">
                        <td className="px-4 py-3 align-top">
                          <div className="font-medium">{r.title}</div>
                          <div className="text-xs text-slate-500 mt-1">
                            ID: {r.courseId}
                          </div>
                        </td>

                        <td className="px-4 py-3 text-right align-top font-semibold">
                          {formatMoney(r.revenue)}
                        </td>

                        <td className="px-4 py-3 text-right align-top">
                          <div className="font-medium">
                            {formatMoney(r.costTotal)}
                          </div>
                          <div className="text-xs text-slate-500 mt-1">
                            instr: {formatMoney(r.costs.INSTRUCTOR || 0)}
                          </div>
                        </td>

                        <td
                          className={`px-4 py-3 text-right align-top font-semibold ${
                            r.profit < 0 ? "text-rose-600" : "text-emerald-600"
                          }`}
                        >
                          {formatMoney(r.profit)}
                        </td>

                        <td className="px-4 py-3 text-right align-top">
                          {r.margin}%
                        </td>

                        <td className="px-4 py-3 text-center align-top">
                          <Sparkline value={r.revenue} />
                        </td>

                        <td className="px-4 py-3 text-center align-top">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() =>
                                setExpanded((s) => ({
                                  ...s,
                                  [r.courseId]: !s[r.courseId],
                                }))
                              }
                              className="px-2 py-1 rounded-md border border-slate-200 text-xs bg-white"
                              aria-expanded={!!expanded[r.courseId]}
                            >
                              {expanded[r.courseId] ? "Hide" : "Details"}
                            </button>
                            <button
                              onClick={() =>
                                alert(`Open finance drill for ${r.title}`)
                              }
                              className="px-2 py-1 rounded-md border border-slate-200 text-xs bg-white"
                            >
                              <DollarSign className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* ---------- improved expanded cost breakdown UI ---------- */}
                      {expanded[r.courseId] && (
                        <tr className="bg-slate-50">
                          <td colSpan={7} className="px-4 py-4">
                            <div className="space-y-4">
                              {/* header w/ actions */}
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <div className="text-sm font-semibold">
                                    {r.title} — Details
                                  </div>
                                  <div className="text-xs text-slate-500 mt-1">
                                    Revenue: {formatMoney(r.revenue)} • Costs:{" "}
                                    {formatMoney(r.costTotal)} • Profit:{" "}
                                    <span
                                      className={
                                        r.profit < 0
                                          ? "text-rose-600"
                                          : "text-emerald-600"
                                      }
                                    >
                                      {formatMoney(r.profit)}
                                    </span>{" "}
                                    • Margin: {r.margin}%
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => exportCSV([r])}
                                    className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[rgba(32,99,128,1)] text-white text-sm"
                                  >
                                    <Download className="w-4 h-4" /> Export
                                  </button>
                                  <button
                                    onClick={() =>
                                      alert("Open edit cost modal")
                                    }
                                    className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-slate-200 text-sm bg-white"
                                  >
                                    <Edit3 className="w-4 h-4" /> Edit
                                  </button>
                                  <button
                                    onClick={() =>
                                      setExpanded((s) => ({
                                        ...s,
                                        [r.courseId]: false,
                                      }))
                                    }
                                    title="Close details"
                                    className="p-2 rounded-md border border-slate-200 bg-white"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>

                              {/* layout columns */}
                              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* LEFT: cost breakdown list + bars */}
                                <div className="space-y-3">
                                  <div className="text-xs font-medium text-slate-500">
                                    Cost breakdown
                                  </div>

                                  <div className="space-y-3">
                                    {Object.entries(r.costs).map(([k, v]) => {
                                      const pct = r.costTotal
                                        ? Math.round((v / r.costTotal) * 100)
                                        : 0;
                                      return (
                                        <div
                                          key={k}
                                          className="flex flex-col gap-1"
                                        >
                                          <div className="flex items-center justify-between">
                                            <div className="text-sm capitalize">
                                              {k
                                                .toLowerCase()
                                                .replace("_", " ")}
                                            </div>
                                            <div className="text-sm font-medium">
                                              {formatMoney(v)}{" "}
                                              <span className="text-xs text-slate-400 ml-2">
                                                ({pct}%)
                                              </span>
                                            </div>
                                          </div>

                                          <div className="w-full bg-white border border-slate-100 rounded-full h-2 overflow-hidden">
                                            <div
                                              style={{
                                                width: `${pct}%`,
                                                background: PRIMARY,
                                              }}
                                              className="h-2 rounded-full"
                                            />
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>

                                  <div className="mt-3 border-t pt-3 flex items-center justify-between text-sm text-slate-600">
                                    <div>Total cost</div>
                                    <div className="font-semibold">
                                      {formatMoney(r.costTotal)}
                                    </div>
                                  </div>
                                </div>

                                {/* CENTER: KPI cards */}
                                <div className="space-y-3">
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white border border-slate-200 rounded-md p-3">
                                      <div className="text-xs text-slate-500">
                                        Revenue
                                      </div>
                                      <div className="mt-2 text-lg font-semibold">
                                        {formatMoney(r.revenue)}
                                      </div>
                                    </div>
                                    <div className="bg-white border border-slate-200 rounded-md p-3">
                                      <div className="text-xs text-slate-500">
                                        Profit
                                      </div>
                                      <div
                                        className={`mt-2 text-lg font-semibold ${
                                          r.profit < 0
                                            ? "text-rose-600"
                                            : "text-emerald-600"
                                        }`}
                                      >
                                        {formatMoney(r.profit)}
                                      </div>
                                    </div>

                                    <div className="bg-white border border-slate-200 rounded-md p-3">
                                      <div className="text-xs text-slate-500">
                                        Margin
                                      </div>
                                      <div className="mt-2 text-lg font-semibold">
                                        {r.margin}%
                                      </div>
                                    </div>
                                    <div className="bg-white border border-slate-200 rounded-md p-3">
                                      <div className="text-xs text-slate-500">
                                        Instructor cost
                                      </div>
                                      <div className="mt-2 text-lg font-semibold">
                                        {formatMoney(r.costs.INSTRUCTOR || 0)}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="mt-2">
                                    <div className="text-xs text-slate-500 mb-2">
                                      Revenue trend
                                    </div>
                                    <div className="w-full h-24 bg-white border border-slate-100 rounded-md flex items-center justify-center">
                                      {/* decorative sparkline placeholder */}
                                      <svg
                                        width="100%"
                                        height="60"
                                        viewBox="0 0 200 60"
                                        aria-hidden
                                      >
                                        <polyline
                                          fill="none"
                                          stroke={PRIMARY}
                                          strokeWidth="3"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          points="0,40 30,35 60,25 90,20 120,22 150,18 180,12 200,10"
                                          opacity="0.95"
                                        />
                                      </svg>
                                    </div>
                                  </div>
                                </div>

                                {/* RIGHT: recent transactions + suggestions */}
                                <div className="space-y-3">
                                  <div className="text-xs font-medium text-slate-500">
                                    Recent transactions
                                  </div>
                                  <div className="bg-white border border-slate-100 rounded-md p-3 space-y-2 max-h-44 overflow-auto">
                                    {demoTx(r.courseId).map((t) => (
                                      <div
                                        key={t.id}
                                        className="flex items-center justify-between"
                                      >
                                        <div>
                                          <div className="text-sm font-medium">
                                            {t.note}
                                          </div>
                                          <div className="text-xs text-slate-400">
                                            {t.date} • {t.id}
                                          </div>
                                        </div>
                                        <div className="text-sm font-semibold">
                                          {formatMoney(t.amount)}
                                        </div>
                                      </div>
                                    ))}
                                  </div>

                                  <div className="bg-white border border-slate-100 rounded-md p-3 text-sm">
                                    <div className="text-xs text-slate-500 mb-2">
                                      Suggestions
                                    </div>
                                    <ul className="list-disc ml-4 space-y-1 text-slate-600">
                                      <li>
                                        Reduce marketing by 10% and monitor
                                        conversion.
                                      </li>
                                      <li>
                                        Negotiate instructor fee for lower
                                        enrollment courses.
                                      </li>
                                      <li>
                                        Bundle small courses to improve margin.
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="h-12" />
        </div>
      </div>
    </DashboardShell>
  );
}

/* ---------------- helper components & fns -------------------- */

function MiniCard({ title, value, hint, icon }) {
  return (
    <div className="bg-white border border-slate-200 rounded-md p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-slate-500">{title}</div>
          <div className="mt-2 text-lg font-semibold">
            {typeof value === "number" ? formatMoney(value) : value}
          </div>
        </div>
        <div className="text-slate-400">
          {icon || <BarChart2 className="w-6 h-6" />}
        </div>
      </div>
      {hint && <div className="text-xs text-slate-500 mt-2">{hint}</div>}
    </div>
  );
}

function Sparkline({ value }) {
  // tiny wrapper to match usage above
  return (
    <div className="flex items-center justify-center">
      <svg width="64" height="28" viewBox="0 0 64 28" aria-hidden>
        <rect x="0" y="0" width="64" height="28" rx="6" fill="transparent" />
        <rect
          x="56"
          y={28 - Math.min(24, Math.round((value / 20000) * 24))}
          width="6"
          height={Math.min(24, Math.round((value / 20000) * 24))}
          rx="2"
          fill={PRIMARY}
          opacity="0.12"
        />
        <rect
          x="56"
          y={28 - Math.min(24, Math.round((value / 20000) * 24))}
          width="4"
          height={Math.min(24, Math.round((value / 20000) * 24))}
          rx="2"
          fill={PRIMARY}
        />
      </svg>
    </div>
  );
}
