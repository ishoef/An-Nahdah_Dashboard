"use client";

import { useMemo, useState } from "react";
import DashboardShell from "@/components/layout/DashobardShell";
import {
  BarChart3,
  LineChart,
  PieChart,
  Download,
  Calendar,
  Filter,
  Eye,
  Settings,
  X,
} from "lucide-react";

/**
 * Modern ReportsPage (demo)
 * - Filter bar: date range, course, report scope
 * - Report cards with Generate / Preview / Download
 * - Report settings modal (build options)
 * - Preview modal with simple SVG chart placeholders
 *
 * Tailwind required. Demo-only client state.
 */

const PRIMARY = "#206380";

/* demo courses for filter */
const courses = [
  { id: "all", title: "All courses" },
  { id: 1, title: "Tajweed Fundamentals" },
  { id: 2, title: "Intro to Islamic Fiqh" },
  { id: 3, title: "Advanced Arabic Grammar" },
  { id: 4, title: "Quranic Arabic Intensive" },
];

const reportsMeta = [
  {
    id: "enrollment",
    title: "Student Enrollment",
    desc: "Monthly enrollments, growth and cohort overview",
    icon: LineChart,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "course_perf",
    title: "Course Performance",
    desc: "Completion, engagement and ratings per course",
    icon: BarChart3,
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "instructor",
    title: "Instructor Insights",
    desc: "Instructor ratings, activity and avg student success",
    icon: PieChart,
    color: "from-violet-500 to-purple-500",
  },
  {
    id: "revenue",
    title: "Revenue",
    desc: "Earnings, refunds and course-level revenue breakdown",
    icon: BarChart3,
    color: "from-orange-500 to-red-500",
  },
];

/* export CSV helper (lightweight) */
function exportCSV(rows = [], filename = "report.csv") {
  if (!rows || rows.length === 0) {
    alert("No data to export (demo)");
    return;
  }
  const keys = Object.keys(rows[0]);
  const csv = [
    keys.join(","),
    ...rows.map((r) =>
      keys.map((k) => `"${String(r[k] ?? "").replace(/"/g, '""')}"`).join(",")
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

/* simple demo data generation for preview/export */
function demoReportRows(type, courseId, from, to) {
  // return small array depending on type
  const base = [
    { period: "2025-01", value: Math.round(Math.random() * 200 + 50) },
    { period: "2025-02", value: Math.round(Math.random() * 200 + 60) },
    { period: "2025-03", value: Math.round(Math.random() * 200 + 80) },
    { period: "2025-04", value: Math.round(Math.random() * 200 + 100) },
  ];
  return base.map((r, i) => ({
    ...r,
    metric: type,
    course: courseId || "all",
  }));
}

/* tiny svg chart placeholders */
function LinePlaceholder({ className }) {
  return (
    <svg viewBox="0 0 220 80" className={className} aria-hidden>
      <rect x="0" y="0" width="220" height="80" rx="8" fill="#f8fafc" />
      <polyline
        fill="none"
        stroke={PRIMARY}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        points="8,64 42,42 78,52 118,30 158,40 198,20"
      />
      <circle cx="8" cy="64" r="3" fill={PRIMARY} />
      <circle cx="42" cy="42" r="3" fill={PRIMARY} />
      <circle cx="118" cy="30" r="3" fill={PRIMARY} />
    </svg>
  );
}

function BarPlaceholder({ className }) {
  return (
    <svg viewBox="0 0 220 80" className={className} aria-hidden>
      <rect x="0" y="0" width="220" height="80" rx="8" fill="#f8fafc" />
      <rect
        x="20"
        y="28"
        width="24"
        height="44"
        rx="4"
        fill={PRIMARY}
        opacity="0.85"
      />
      <rect
        x="60"
        y="12"
        width="24"
        height="60"
        rx="4"
        fill={PRIMARY}
        opacity="0.65"
      />
      <rect
        x="100"
        y="40"
        width="24"
        height="32"
        rx="4"
        fill={PRIMARY}
        opacity="0.95"
      />
      <rect
        x="140"
        y="20"
        width="24"
        height="52"
        rx="4"
        fill={PRIMARY}
        opacity="0.75"
      />
    </svg>
  );
}

function PiePlaceholder({ className }) {
  return (
    <svg viewBox="0 0 220 80" className={className} aria-hidden>
      <rect x="0" y="0" width="220" height="80" rx="8" fill="#f8fafc" />
      <circle cx="110" cy="40" r="24" fill={PRIMARY} />
      <path d="M110 40 L134 24 A24 24 0 0 1 142 54 Z" fill="#60a5fa" />
      <path d="M110 40 L86 18 A24 24 0 0 1 86 62 Z" fill="#a78bfa" />
    </svg>
  );
}

export default function ReportsPage() {
  // filter state
  const [courseFilter, setCourseFilter] = useState("all");
  const [reportScope, setReportScope] = useState("overview"); // overview | per-course | per-batch
  const [fromDate, setFromDate] = useState("2025-01-01");
  const [toDate, setToDate] = useState("2025-04-30");

  // modals
  const [openSettingsFor, setOpenSettingsFor] = useState(null); // report id
  const [openPreviewFor, setOpenPreviewFor] = useState(null); // report id

  // quick stats (demo numbers)
  const stats = useMemo(
    () => ({
      totalStudents: 1234,
      activeCourses: 24,
      totalRevenue: 45230,
      avgRating: 4.7,
    }),
    []
  );

  function handleGenerate(reportId) {
    // demo: show settings modal
    setOpenSettingsFor(reportId);
  }

  function handleDownload(reportId) {
    const rows = demoReportRows(reportId, courseFilter, fromDate, toDate);
    exportCSV(
      rows,
      `${reportId}-${courseFilter}-${new Date().toISOString().slice(0, 10)}.csv`
    );
  }

  return (
    <DashboardShell>
      <div className="min-h-screen p-8 bg-gradient-to-br from-background via-background to-background/80">
        {/* Header */}
        <div className="mb-6 mx-auto">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-[rgba(32,99,128,1)]" />{" "}
                Reports
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Generate academy reports — enrollment, course performance,
                revenue, and instructor insights.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  // export summary (demo)
                  exportCSV(
                    [{ stat: "totalStudents", value: stats.totalStudents }],
                    `academy-summary-${new Date()
                      .toISOString()
                      .slice(0, 10)}.csv`
                  );
                }}
                className="px-4 py-2 rounded-lg border border-border bg-white flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Export Summary
              </button>
            </div>
          </div>
        </div>

        <div className="mx-auto space-y-6">
          {/* Filter bar */}
          <div className="bg-white/50 backdrop-blur rounded-2xl p-4 border border-border flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
            <div className="flex items-center gap-3 w-full lg:w-auto flex-1">
              <div className="inline-flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <input
                  className="bg-transparent outline-none text-sm w-36"
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
                <span className="text-muted-foreground mx-1">—</span>
                <input
                  className="bg-transparent outline-none text-sm w-36"
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>

              <div className="inline-flex items-center border border-border rounded-lg bg-card p-1">
                <Filter className="w-4 h-4 text-muted-foreground ml-1" />
                <select
                  className="bg-transparent px-2 text-sm outline-none"
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="inline-flex items-center border border-border rounded-lg bg-card p-1">
                <select
                  className="bg-transparent px-2 text-sm outline-none"
                  value={reportScope}
                  onChange={(e) => setReportScope(e.target.value)}
                >
                  <option value="overview">Overview</option>
                  <option value="per-course">Per course</option>
                  <option value="per-batch">Per batch</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full lg:w-auto">
              <button
                onClick={() => {
                  /* demo: open a create report panel */ alert(
                    "Use Generate on a report card to build a report"
                  );
                }}
                className="px-3 py-2 rounded-md bg-[rgba(32,99,128,1)] text-white flex items-center gap-2"
              >
                <Settings className="w-4 h-4" /> Build Report
              </button>

              <button
                onClick={() =>
                  exportCSV(
                    [{ from: fromDate, to: toDate, scope: reportScope }],
                    `reports-filter-${new Date()
                      .toISOString()
                      .slice(0, 10)}.csv`
                  )
                }
                className=" flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-white"
              >
                <Download className="w-4 h-4" /> Export Filters
              </button>
            </div>
          </div>

          {/* Reports grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reportsMeta.map((r, idx) => {
              const Icon = r.icon;
              return (
                <div
                  key={r.id}
                  className="group/report rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-5 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex gap-4">
                    <div
                      className={`w-14 h-14 rounded-lg bg-gradient-to-br ${r.color} flex items-center justify-center text-white shadow-md flex-shrink-0`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">
                            {r.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {r.desc}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <button
                            onClick={() => handleDownload(r.id)}
                            title="Download CSV"
                            className="px-2 py-1 rounded-md border border-border bg-white text-sm"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 border-t pt-5 flex items-center gap-2">
                        <button
                          onClick={() => handleGenerate(r.id)}
                          className="px-3 py-2 rounded-md bg-[rgba(32,99,128,1)] text-white text-sm flex items-center gap-2"
                        >
                          Generate
                        </button>
                        <button
                          onClick={() => setOpenPreviewFor(r.id)}
                          className="px-3 py-2 rounded-md border border-border bg-white text-sm flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" /> Preview
                        </button>
                        <button
                          onClick={() => setOpenSettingsFor(r.id)}
                          className="px-3 py-2 rounded-md border border-border bg-white text-sm flex items-center gap-2"
                        >
                          <Settings className="w-4 h-4" /> Settings
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4">
              <p className="text-xs text-muted-foreground mb-2">
                Total Students
              </p>
              <p className="text-2xl font-bold text-foreground">1,234</p>
              <p className="text-xs text-emerald-600 mt-2">
                ↑ 12% from last month
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4">
              <p className="text-xs text-muted-foreground mb-2">
                Active Courses
              </p>
              <p className="text-2xl font-bold text-foreground">24</p>
              <p className="text-xs text-primary mt-2">6 new this month</p>
            </div>
            <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4">
              <p className="text-xs text-muted-foreground mb-2">
                Total Revenue
              </p>
              <p className="text-2xl font-bold text-foreground">$45,230</p>
              <p className="text-xs text-emerald-600 mt-2">
                ↑ 8% from last month
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4">
              <p className="text-xs text-muted-foreground mb-2">Avg Rating</p>
              <p className="text-2xl font-bold text-foreground">4.7</p>
              <p className="text-xs text-yellow-500 mt-2">Based on reviews</p>
            </div>
          </div>
        </div>

        {/* Settings modal */}
        {openSettingsFor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setOpenSettingsFor(null)}
            />
            <div className="relative bg-white rounded-2xl w-full max-w-2xl p-6 z-10 shadow-xl">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">
                    Report settings —{" "}
                    {reportsMeta.find((r) => r.id === openSettingsFor)?.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Configure filters, grouping and export options for this
                    report.
                  </p>
                </div>
                <button
                  onClick={() => setOpenSettingsFor(null)}
                  className="p-2 rounded-md"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Report generated (demo)");
                  setOpenSettingsFor(null);
                }}
              >
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Group by
                    </label>
                    <select className="w-full mt-1 px-3 py-2 border border-border rounded-md">
                      <option value="month">Month</option>
                      <option value="course">Course</option>
                      <option value="instructor">Instructor</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Include
                    </label>
                    <select className="w-full mt-1 px-3 py-2 border border-border rounded-md">
                      <option>All</option>
                      <option>Paid only</option>
                      <option>Free only</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Export format
                    </label>
                    <select className="w-full mt-1 px-3 py-2 border border-border rounded-md">
                      <option>CSV</option>
                      <option>Excel</option>
                      <option>PDF</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Schedule
                    </label>
                    <input
                      type="datetime-local"
                      className="w-full mt-1 px-3 py-2 border border-border rounded-md"
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setOpenSettingsFor(null)}
                    className="px-4 py-2 rounded-md border border-border"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-md bg-[rgba(32,99,128,1)] text-white"
                  >
                    Save & Generate
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Preview modal */}
        {openPreviewFor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setOpenPreviewFor(null)}
            />
            <div className="relative bg-white rounded-2xl w-full max-w-3xl p-6 z-10 shadow-xl">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">
                    Preview —{" "}
                    {reportsMeta.find((r) => r.id === openPreviewFor)?.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Demo preview — charts are placeholders.
                  </p>
                </div>
                <button
                  onClick={() => setOpenPreviewFor(null)}
                  className="p-2 rounded-md"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg border border-border p-4">
                  <div className="text-xs text-muted-foreground">Trend</div>
                  <div className="mt-3">
                    {/* placeholder depending on type */}
                    {openPreviewFor === "enrollment" ? (
                      <LinePlaceholder className="w-full" />
                    ) : openPreviewFor === "course_perf" ? (
                      <BarPlaceholder className="w-full" />
                    ) : (
                      <PiePlaceholder className="w-full" />
                    )}
                  </div>
                </div>

                <div className="rounded-lg border border-border p-4">
                  <div className="text-xs text-muted-foreground">Summary</div>
                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <div>Total</div>
                      <div className="font-semibold">234</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>Active</div>
                      <div className="font-semibold">198</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>New (period)</div>
                      <div className="font-semibold">42</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>Export</div>
                      <button
                        onClick={() => handleDownload(openPreviewFor)}
                        className="px-2 py-1 rounded-md border border-border bg-white text-sm inline-flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" /> CSV
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-sm text-muted-foreground">
                Note: charts here are illustrative. Connect to your analytics
                backend for real data and time-series.
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
