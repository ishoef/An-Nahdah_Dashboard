"use client";

import { useState, useMemo } from "react";
import DashboardShell from "@/components/layout/DashobardShell";
import {
  Search,
  Download,
  TrendingUp,
  TrendingDown,
  Award,
  BookOpen,
  Brain,
  Target,
  Calendar,
  Star,
  CheckCircle,
  Clock,
  Filter,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const PRIMARY = "#206380";

const studentsProgress = [
  {
    id: 1,
    name: "Aisha Khan",
    avatar: "AK",
    batch: "2025-Quran",
    overall: 82,
    tajweed: 88,
    memorization: 76,
    understanding: 90,
    attendance: 94,
    surahsCompleted: 18,
    surahsRevising: 12,
    lastTestScore: 94,
    trend: "up",
    tajweedSkills: [
      { skill: "Makharij", level: 92 },
      { skill: "Sifaat", level: 85 },
      { skill: "Tajweed Rules", level: 88 },
      { skill: "Fluency", level: 90 },
      { skill: "Melody", level: 78 },
    ],
    scoreHistory: [
      { month: "Aug", score: 68 },
      { month: "Sep", score: 74 },
      { month: "Oct", score: 79 },
      { month: "Nov", score: 86 },
      { month: "Dec", score: 94 },
    ],
  },
  {
    id: 2,
    name: "Muhammad Ali",
    avatar: "MA",
    batch: "2025-Quran",
    overall: 58,
    tajweed: 62,
    memorization: 70,
    understanding: 45,
    attendance: 72,
    surahsCompleted: 8,
    surahsRevising: 15,
    lastTestScore: 61,
    trend: "down",
    tajweedSkills: [
      { skill: "Makharij", level: 68 },
      { skill: "Sifaat", level: 55 },
      { skill: "Tajweed Rules", level: 60 },
      { skill: "Fluency", level: 70 },
      { skill: "Melody", level: 48 },
    ],
    scoreHistory: [
      { month: "Aug", score: 72 },
      { month: "Sep", score: 69 },
      { month: "Oct", score: 65 },
      { month: "Nov", score: 63 },
      { month: "Dec", score: 61 },
    ],
  },
  {
    id: 3,
    name: "Fatima Hassan",
    avatar: "FH",
    batch: "2024-Ramadan",
    overall: 96,
    tajweed: 98,
    memorization: 94,
    understanding: 97,
    attendance: 98,
    surahsCompleted: 30,
    surahsRevising: 8,
    lastTestScore: 99,
    trend: "up",
    tajweedSkills: [
      { skill: "Makharij", level: 99 },
      { skill: "Sifaat", level: 97 },
      { skill: "Tajweed Rules", level: 98 },
      { skill: "Fluency", level: 99 },
      { skill: "Melody", level: 95 },
    ],
    scoreHistory: [
      { month: "Aug", score: 88 },
      { month: "Sep", score: 91 },
      { month: "Oct", score: 94 },
      { month: "Nov", score: 97 },
      { month: "Dec", score: 99 },
    ],
  },
];

export default function StudentProgressPage() {
  const [selectedStudent, setSelectedStudent] = useState(studentsProgress[0]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = useMemo(() => {
    return studentsProgress.filter((s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const getGradeColor = (score) => {
    if (score >= 90) return "text-emerald-600";
    if (score >= 75) return "text-[#206380]";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const getProgressRingColor = (score) => {
    if (score >= 90) return "#10b981";
    if (score >= 75) return "#206380";
    if (score >= 60) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <DashboardShell>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className=" mx-auto p-6 lg:p-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white flex items-center gap-4 mb-3">
              <Award className="w-12 h-12 text-[#206380]" />
              Student Progress Tracking
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Monitor Tajweed mastery, memorization, and academic growth
            </p>
          </motion.div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Student Selector Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 sticky top-6">
                <div className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-[#206380] focus:outline-none"
                  />
                </div>

                <div className="space-y-3">
                  {filteredStudents.map((student) => (
                    <motion.div
                      key={student.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedStudent(student)}
                      className={`p-4 rounded-xl cursor-pointer transition-all ${
                        selectedStudent.id === student.id
                          ? "bg-gradient-to-r from-[#206380] to-[#1e5a75] text-white shadow-lg"
                          : "bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                            selectedStudent.id === student.id
                              ? "bg-white/20"
                              : "bg-gradient-to-br from-[#206380] to-[#29a8d7] text-white"
                          }`}
                        >
                          {student.avatar}
                        </div>
                        <div>
                          <p
                            className={`font-semibold ${
                              selectedStudent.id === student.id
                                ? "text-white"
                                : "text-slate-900 dark:text-white"
                            }`}
                          >
                            {student.name}
                          </p>
                          <p
                            className={`text-sm ${
                              selectedStudent.id === student.id
                                ? "text-white/80"
                                : "text-slate-500"
                            }`}
                          >
                            {student.batch}
                          </p>
                        </div>
                        <div className="ml-auto">
                          <span
                            className={`text-2xl font-bold ${getGradeColor(
                              student.overall
                            )}`}
                          >
                            {student.overall}%
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Progress Dashboard */}
            <div className="lg:col-span-3 space-y-8">
              {selectedStudent && (
                <>
                  {/* Student Header */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#206380] to-[#29a8d7] text-white text-3xl font-bold flex items-center justify-center shadow-2xl">
                          {selectedStudent.avatar}
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                            {selectedStudent.name}
                          </h2>
                          <p className="text-lg text-slate-600 dark:text-slate-400 mt-1">
                            {selectedStudent.batch}
                          </p>
                          <div className="flex items-center gap-4 mt-3">
                            <span
                              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                                selectedStudent.trend === "up"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {selectedStudent.trend === "up" ? (
                                <TrendingUp className="w-4 h-4" />
                              ) : (
                                <TrendingDown className="w-4 h-4" />
                              )}
                              {selectedStudent.trend === "up"
                                ? "Improving"
                                : "Needs Attention"}
                            </span>
                            <span className="text-3xl font-bold text-[#206380]">
                              {selectedStudent.overall}% Overall
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Core Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                      {
                        label: "Tajweed Mastery",
                        value: selectedStudent.tajweed,
                        icon: Brain,
                      },
                      {
                        label: "Hifz Progress",
                        value: selectedStudent.memorization,
                        icon: BookOpen,
                      },
                      {
                        label: "Understanding",
                        value: selectedStudent.understanding,
                        icon: Target,
                      },
                      {
                        label: "Attendance",
                        value: selectedStudent.attendance,
                        icon: CheckCircle,
                      },
                    ].map((metric, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <metric.icon className="w-10 h-10 text-[#206380]" />
                          <span
                            className={`text-3xl font-bold ${getGradeColor(
                              metric.value
                            )}`}
                          >
                            {metric.value}%
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                          {metric.label}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Tajweed Skills Heatmap */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                      Tajweed Skills Breakdown
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                      {selectedStudent.tajweedSkills.map((skill, i) => (
                        <div key={i} className="text-center">
                          <div className="relative w-32 h-32 mx-auto">
                            <svg className="w-32 h-32 transform -rotate-90">
                              <circle
                                cx="64"
                                cy="64"
                                r="56"
                                stroke="#e5e7eb"
                                strokeWidth="12"
                                fill="none"
                              />
                              <circle
                                cx="64"
                                cy="64"
                                r="56"
                                stroke={getProgressRingColor(skill.level)}
                                strokeWidth="12"
                                fill="none"
                                strokeDasharray={`${
                                  (skill.level / 100) * 351
                                } 351`}
                                className="transition-all duration-1000"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                                {skill.level}%
                              </span>
                            </div>
                          </div>
                          <p className="mt-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                            {skill.skill}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Score Trend Chart */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                      Test Score Trend
                    </h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={selectedStudent.scoreHistory}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e5e7eb"
                          />
                          <XAxis dataKey="month" stroke="#94a3b8" />
                          <YAxis domain={[0, 100]} stroke="#94a3b8" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1e293b",
                              border: "none",
                              borderRadius: "12px",
                            }}
                            labelStyle={{ color: "#e2e8f0" }}
                          />
                          <Line
                            type="monotone"
                            dataKey="score"
                            stroke="#206380"
                            strokeWidth={4}
                            dot={{ fill: "#206380", r: 8 }}
                            activeDot={{ r: 10 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Memorization Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-8 text-white shadow-xl">
                      <BookOpen className="w-12 h-12 mb-4" />
                      <p className="text-emerald-100 text-lg">
                        Surahs Memorized
                      </p>
                      <p className="text-5xl font-bold mt-2">
                        {selectedStudent.surahsCompleted}
                      </p>
                      <p className="text-emerald-200 mt-2">Out of 114</p>
                    </div>
                    <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-8 text-white shadow-xl">
                      <Clock className="w-12 h-12 mb-4" />
                      <p className="text-amber-100 text-lg">Under Revision</p>
                      <p className="text-5xl font-bold mt-2">
                        {selectedStudent.surahsRevising}
                      </p>
                      <p className="text-amber-200 mt-2">Needs daily review</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Export Button */}
          <button className="fixed bottom-8 right-8 bg-[#206380] text-white p-6 rounded-full shadow-2xl hover:bg-[#1a5169] hover:scale-110 transition-all z-10 flex items-center gap-3">
            <Download className="w-7 h-7" />
            <span className="font-medium">Export Report</span>
          </button>
        </div>
      </div>
    </DashboardShell>
  );
}
