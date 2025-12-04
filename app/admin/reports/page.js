"use client";

import { useState, useMemo } from "react";
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
  FileText,
  CreditCard,
  Users,
  Activity,
  Mail,
  Clock,
  Plus,
  Trash2,
  Edit2,
  Grid3X3,
  List,
  Sparkles,
  User,
  BookOpen,
  DollarSign,
  Star,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { saveAs } from "file-saver"; // npm i file-saver
import jsPDF from "jspdf"; // npm i jspdf
import * as XLSX from "xlsx"; // npm i xlsx
import Papa from "papaparse"; // npm i papaparse
import toast, { Toaster } from "react-hot-toast"; // npm i react-hot-toast

const PRIMARY = "#206380";

const courses = [
  { id: "all", title: "All courses" },
  { id: 1, title: "Tajweed Fundamentals" },
  { id: 2, title: "Intro to Islamic Fiqh" },
  { id: 3, title: "Advanced Arabic Grammar" },
  { id: 4, title: "Quranic Arabic Intensive" },
  { id: 5, title: "Islamic History Part 1" },
  { id: 6, title: "Arabic Literature Basics" },
];

const instructors = [
  { id: "all", name: "All instructors" },
  { id: 1, name: "Dr. Hassan Ahmed" },
  { id: 2, name: "Ms. Amina Khan" },
  { id: 3, name: "Prof. Mohammed Ali" },
  { id: 4, name: "Dr. Fatima Hassan" },
];

const reportsMeta = [
  {
    id: "enrollment",
    title: "Enrollment Analytics",
    desc: "Track student sign-ups, growth trends, and retention rates",
    icon: Users,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "course_perf",
    title: "Course Performance",
    desc: "Completion rates, engagement metrics, and student feedback",
    icon: BarChart3,
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "instructor",
    title: "Instructor Insights",
    desc: "Performance ratings, class sizes, and teaching efficiency",
    icon: User,
    color: "from-violet-500 to-purple-500",
  },
  {
    id: "revenue",
    title: "Revenue Reports",
    desc: "Income breakdown, payments, and financial projections",
    icon: CreditCard,
    color: "from-orange-500 to-red-500",
  },
  {
    id: "student_perf",
    title: "Student Performance",
    desc: "Grades, progress tracking, and achievement analytics",
    icon: Activity,
    color: "from-pink-500 to-rose-500",
  },
  {
    id: "engagement",
    title: "User Engagement",
    desc: "Login activity, session times, and platform usage patterns",
    icon: Sparkles,
    color: "from-indigo-500 to-blue-500",
  },
  {
    id: "custom",
    title: "Custom Report",
    desc: "Build tailored reports with selected metrics and filters",
    icon: Settings,
    color: "from-gray-500 to-slate-500",
  },
];

export default function ReportsPage() {
  const [courseFilter, setCourseFilter] = useState("all");
  const [instructorFilter, setInstructorFilter] = useState("all");
  const [fromDate, setFromDate] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 3))
      .toISOString()
      .slice(0, 10)
  );
  const [toDate, setToDate] = useState(new Date().toISOString().slice(0, 10));
  const [reportHistory, setReportHistory] = useState([]);
  const [openSettings, setOpenSettings] = useState(null);
  const [openPreview, setOpenPreview] = useState(null);
  const [openCustomBuilder, setOpenCustomBuilder] = useState(false);
  const [customMetrics, setCustomMetrics] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [selectedReports, setSelectedReports] = useState([]);

  const customOptions = [
    { id: "enrollment", label: "Enrollment Trends" },
    { id: "completion", label: "Course Completion Rates" },
    { id: "revenue", label: "Revenue Breakdown" },
    { id: "ratings", label: "Feedback & Ratings" },
    { id: "engagement", label: "User Engagement" },
    { id: "demographics", label: "Student Demographics" },
    { id: "performance", label: "Academic Performance" },
  ];

  const stats = useMemo(
    () => ({
      totalStudents: 1234,
      activeCourses: 24,
      totalRevenue: 45230,
      avgRating: 4.7,
      completionRate: 82,
      activeUsers: 890,
    }),
    []
  );

  const handleGenerate = (reportId, options = {}) => {
    const data = generateDemoData(reportId);
    const newReport = {
      id: Date.now(),
      type: reportId,
      generatedAt: new Date().toISOString(),
      data,
      options,
    };
    setReportHistory((prev) => [newReport, ...prev]);
    toast.success("Report generated!");
    setOpenSettings(null);
  };

  const handleDownload = (format, report) => {
    const data = report.data;
    if (format === "csv") {
      const csv = Papa.unparse(data);
      const blob = new Blob([csv], { type: "text/csv" });
      saveAs(blob, `${report.type}-report.csv`);
    } else if (format === "pdf") {
      const doc = new jsPDF();
      doc.text(report.type, 10, 10);
      data.forEach((row, i) =>
        doc.text(`${row.period}: ${row.value}`, 10, 20 + i * 10)
      );
      doc.save(`${report.type}-report.pdf`);
    } else if (format === "excel") {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, report.type);
      XLSX.writeFile(wb, `${report.type}-report.xlsx`);
    }
    toast.success("Report downloaded");
  };

  const handleCustomGenerate = () => {
    if (customMetrics.length === 0) {
      toast.error("Select at least one metric");
      return;
    }
    handleGenerate("custom", { metrics: customMetrics });
    setOpenCustomBuilder(false);
    setCustomMetrics([]);
  };

  const toggleSelectReport = (id) => {
    setSelectedReports((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const deleteReport = (id) => {
    setReportHistory((prev) => prev.filter((r) => r.id !== id));
    toast.success("Report deleted");
  };

  const bulkDeleteReports = () => {
    setReportHistory((prev) =>
      prev.filter((r) => !selectedReports.includes(r.id))
    );
    setSelectedReports([]);
    toast.success("Selected reports deleted");
  };

  return (
    <DashboardShell>
      <Toaster position="bottom-right" />

      <div className="min-h-screen p-6 md:p-10 bg-background">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground flex items-center gap-4">
                <BarChart3 className="w-12 h-12 text-[#206380]" />
                Reports & Analytics
              </h1>
              <p className="text-lg text-muted-foreground mt-3">
                Generate insights, track performance, and make data-driven
                decisions
              </p>
            </div>
            <button
              onClick={() => setOpenCustomBuilder(true)}
              className="px-7 py-4 bg-gradient-to-r from-[#206380] to-[#1b5666] text-white rounded-xl font-bold text-lg flex items-center gap-3 hover:shadow-2xl transition-all hover:scale-105"
            >
              <Plus className="w-6 h-6" />
              Custom Report
            </button>
          </div>
        </motion.div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-10">
          {[
            {
              label: "Total Students",
              value: stats.totalStudents,
              icon: Users,
              color: "from-blue-500 to-cyan-500",
            },
            {
              label: "Active Courses",
              value: stats.activeCourses,
              icon: BookOpen,
              color: "from-emerald-500 to-teal-500",
            },
            {
              label: "Revenue",
              value: `$${stats.totalRevenue.toLocaleString()}`,
              icon: DollarSign,
              color: "from-green-500 to-emerald-500",
            },
            {
              label: "Avg Rating",
              value: stats.avgRating,
              icon: Star,
              color: "from-yellow-500 to-amber-500",
            },
            {
              label: "Completion Rate",
              value: `${stats.completionRate}%`,
              icon: CheckCircle2,
              color: "from-purple-500 to-indigo-500",
            },
            {
              label: "Active Users",
              value: stats.activeUsers,
              icon: Activity,
              color: "from-pink-500 to-rose-500",
            },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card border rounded-2xl p-5 shadow-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <Icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-3xl font-bold">{stat.value}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="bg-card border rounded-2xl p-6 mb-10 shadow-lg">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
            <Filter className="w-6 h-6 text-[#206380]" />
            Report Filters
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                From Date
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">To Date</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Course</label>
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border bg-background"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Instructor
              </label>
              <select
                value={instructorFilter}
                onChange={(e) => setInstructorFilter(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border bg-background"
              >
                {instructors.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {reportsMeta.map((report, i) => {
            const Icon = report.icon;
            return (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card border rounded-2xl p-6 shadow-lg hover:shadow-xl transition"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">{report.title}</h3>
                  <Icon className="w-8 h-8 text-[#206380]" />
                </div>
                <p className="text-muted-foreground mb-6">{report.desc}</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setOpenSettings(report.id)}
                    className="flex-1 py-3 bg-[#206380] text-white rounded-xl font-medium"
                  >
                    Generate
                  </button>
                  <button
                    onClick={() => setOpenPreview(report.id)}
                    className="px-4 py-3 border rounded-xl"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Report History */}
        {reportHistory.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <FileText className="w-7 h-7 text-[#206380]" />
              Report History
            </h3>
            <div className="space-y-4">
              {reportHistory.map((report) => (
                <div
                  key={report.id}
                  className="bg-card border rounded-2xl p-6 flex justify-between items-center"
                >
                  <div>
                    <h4 className="font-bold text-lg">
                      {reportsMeta.find((r) => r.id === report.type)?.title ||
                        report.type}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Generated on{" "}
                      {new Date(report.generatedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleDownload("csv", report)}
                      className="px-4 py-2 border rounded-xl"
                    >
                      CSV
                    </button>
                    <button
                      onClick={() => handleDownload("pdf", report)}
                      className="px-4 py-2 border rounded-xl"
                    >
                      PDF
                    </button>
                    <button
                      onClick={() => handleDownload("excel", report)}
                      className="px-4 py-2 border rounded-xl"
                    >
                      Excel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Modal */}
        <AnimatePresence>
          {openSettings && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              onClick={() => setOpenSettings(null)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-card rounded-3xl shadow-2xl max-w-lg w-full p-10 border"
              >
                <h2 className="text-2xl font-bold mb-6">
                  Generate{" "}
                  {reportsMeta.find((r) => r.id === openSettings)?.title}
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Build Options
                    </label>
                    <select className="w-full px-4 py-3 rounded-xl border bg-background">
                      <option>Standard</option>
                      <option>Detailed</option>
                      <option>Summary</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => setOpenSettings(null)}
                      className="px-6 py-3 border rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleGenerate(openSettings)}
                      className="px-6 py-3 bg-[#206380] text-white rounded-xl"
                    >
                      Generate
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Preview Modal */}
        <AnimatePresence>
          {openPreview && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              onClick={() => setOpenPreview(null)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-card rounded-3xl shadow-2xl max-w-4xl w-full p-10 border"
              >
                <h2 className="text-2xl font-bold mb-6">
                  Preview -{" "}
                  {reportsMeta.find((r) => r.id === openPreview)?.title}
                </h2>
                <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-2xl text-muted-foreground">
                  <BarChart3 className="w-16 h-16" />
                  <p className="ml-4 text-lg">Chart Preview (Demo)</p>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    onClick={() => setOpenPreview(null)}
                    className="px-6 py-3 border rounded-xl"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Custom Builder Modal */}
        <AnimatePresence>
          {openCustomBuilder && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              onClick={() => setOpenCustomBuilder(false)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-card rounded-3xl shadow-2xl max-w-xl w-full p-10 border"
              >
                <h2 className="text-2xl font-bold mb-6">
                  Custom Report Builder
                </h2>
                <div className="space-y-4">
                  {customOptions.map((option) => (
                    <label
                      key={option.id}
                      className="flex items-center gap-3 p-4 border rounded-xl hover:bg-muted transition cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={customMetrics.includes(option.id)}
                        onChange={() =>
                          setCustomMetrics((prev) =>
                            prev.includes(option.id)
                              ? prev.filter((x) => x !== option.id)
                              : [...prev, option.id]
                          )
                        }
                        className="w-5 h-5 rounded accent-[#206380]"
                      />
                      <span className="font-medium">{option.label}</span>
                    </label>
                  ))}
                </div>
                <div className="flex justify-end gap-4 mt-8">
                  <button
                    onClick={() => setOpenCustomBuilder(false)}
                    className="px-6 py-3 border rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCustomGenerate}
                    className="px-6 py-3 bg-[#206380] text-white rounded-xl"
                  >
                    Generate Custom Report
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardShell>
  );
}

// Helper Functions
function generateDemoData(type) {
  return Array.from({ length: 6 }, (_, i) => ({
    period: `Month ${i + 1}`,
    value: Math.round(Math.random() * 1000 + 200),
  }));
}

function LineChartSVG() {
  return (
    <svg viewBox="0 0 300 150" className="w-full h-32">
      <path
        d="M0 140 L50 100 L100 120 L150 80 L200 110 L250 70 L300 90"
        fill="none"
        stroke={PRIMARY}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BarChartSVG() {
  return (
    <svg viewBox="0 0 300 150" className="w-full h-32">
      {[40, 80, 60, 100, 70, 90].map((h, i) => (
        <rect
          key={i}
          x={i * 50 + 10}
          y={150 - h}
          width="30"
          height={h}
          fill={PRIMARY}
          rx="4"
        />
      ))}
    </svg>
  );
}

function PieChartSVG() {
  return (
    <svg viewBox="0 0 150 150" className="w-32 h-32 mx-auto">
      <circle cx="75" cy="75" r="60" fill={PRIMARY} />
      <path d="M75 75 L135 75 A60 60 0 0 1 75 135 Z" fill="#60a5fa" />
      <path d="M75 75 L75 15 A60 60 0 0 1 135 75 Z" fill="#a78bfa" />
    </svg>
  );
}
