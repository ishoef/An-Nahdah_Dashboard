"use client";

import { useState, useMemo } from "react";
import DashboardShell from "@/components/layout/DashobardShell";
import {
  Search,
  Download,
  Calendar,
  Check,
  XCircle,
  AlertCircle,
  TrendingUp,
  Users,
  Clock,
  ChevronLeft,
  ChevronRight,
  Filter,
  MoreVertical,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isToday,
  addMonths,
  subMonths,
} from "date-fns";

const PRIMARY = "#206380";

const studentsList = [
  {
    id: 1,
    name: "Aisha Khan",
    avatar: "AK",
    batch: "2025-Quran",
    attendance: 94,
    streak: 18,
    status: "present",
  },
  {
    id: 2,
    name: "Muhammad Ali",
    avatar: "MA",
    batch: "2025-Quran",
    attendance: 72,
    streak: 3,
    status: "absent",
  },
  {
    id: 3,
    name: "Fatima Hassan",
    avatar: "FH",
    batch: "2024-Ramadan",
    attendance: 98,
    streak: 45,
    status: "present",
  },
  {
    id: 4,
    name: "Omar Farooq",
    avatar: "OF",
    batch: "2024-Ramadan",
    attendance: 89,
    streak: 12,
    status: "late",
  },
  {
    id: 5,
    name: "Zainab Al-Rashid",
    avatar: "ZA",
    batch: "2025-Quran",
    attendance: 61,
    streak: 1,
    status: "absent",
  },
  {
    id: 6,
    name: "Yusuf Ahmed",
    avatar: "YA",
    batch: "2025-Quran",
    attendance: 91,
    streak: 21,
    status: "present",
  },
];

export default function InstructorAttendancePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("all");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [bulkStatus, setBulkStatus] = useState("present");

  const filteredStudents = useMemo(() => {
    return studentsList.filter(
      (s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedBatch === "all" || s.batch === selectedBatch)
    );
  }, [searchTerm, selectedBatch]);

  const today = format(new Date(), "EEEE, MMMM d, yyyy");
  const attendanceStats = {
    present: filteredStudents.filter((s) => s.status === "present").length,
    absent: filteredStudents.filter((s) => s.status === "absent").length,
    late: filteredStudents.filter((s) => s.status === "late").length,
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const exportAttendance = () => {
    const csv = [
      ["Name", "Batch", "Attendance %", "Current Streak", "Today's Status"],
      ...filteredStudents.map((s) => [
        s.name,
        s.batch,
        `${s.attendance}%`,
        `${s.streak} days`,
        s.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance-report-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
  };

  return (
    <DashboardShell>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-teal-50 dark:from-gray-900 dark:via-slate-900 dark:to-slate-950">
        <div className="max-w-7xl mx-auto p-6 lg:p-10">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-4">
              <Calendar className="w-10 h-10 text-[#206380]" />
              Attendance Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-3 text-lg">
              Manage daily attendance and track student consistency
            </p>
          </div>

          {/* Today's Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-slate-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Today's Date
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {today}
                  </p>
                </div>
                <Calendar className="w-12 h-12 text-[#206380] opacity-80" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-6 shadow-lg border border-emerald-200 dark:border-emerald-800"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-emerald-700 dark:text-emerald-400">
                    Present
                  </p>
                  <p className="text-4xl font-bold text-emerald-700 dark:text-emerald-400 mt-2">
                    {attendanceStats.present}
                  </p>
                </div>
                <Check className="w-12 h-12 text-emerald-600" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-6 shadow-lg border border-red-200 dark:border-red-800"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-700 dark:text-red-400">
                    Absent
                  </p>
                  <p className="text-4xl font-bold text-red-700 dark:text-red-400 mt-2">
                    {attendanceStats.absent}
                  </p>
                </div>
                <XCircle className="w-12 h-12 text-red-600" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-6 shadow-lg border border-amber-200 dark:border-amber-800"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    Late
                  </p>
                  <p className="text-4xl font-bold text-amber-700 dark:text-amber-400 mt-2">
                    {attendanceStats.late}
                  </p>
                </div>
                <AlertCircle className="w-12 h-12 text-amber-600" />
              </div>
            </motion.div>
          </div>

          {/* Today's Live Attendance Sheet */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden mb-10">
            <div className="p-6 border-b border-gray-200 dark:border-slate-700">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Today's Attendance
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Mark students present, absent, or late
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={bulkStatus}
                    onChange={(e) => setBulkStatus(e.target.value)}
                    className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                  >
                    <option value="present">Mark All Present</option>
                    <option value="absent">Mark All Absent</option>
                    <option value="late">Mark All Late</option>
                  </select>
                  <button className="px-5 py-2.5 bg-[#206380] text-white rounded-lg hover:bg-[#1a5169] transition font-medium">
                    Apply to All
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-slate-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Batch
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Monthly %
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Streak
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Today
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                  {filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#206380] to-[#29a8d7] text-white font-bold flex items-center justify-center text-sm">
                            {student.avatar}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {student.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-600 dark:text-gray-400">
                        {student.batch}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-24 bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-gradient-to-r from-[#206380] to-[#29a8d7]"
                              style={{ width: `${student.attendance}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {student.attendance}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-sm font-medium">
                          <TrendingUp className="w-4 h-4" />
                          {student.streak} days
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            className={`p-3 rounded-lg transition ${
                              student.status === "present"
                                ? "bg-emerald-100 text-emerald-700 ring-2 ring-emerald-500"
                                : "bg-gray-100 dark:bg-slate-700"
                            }`}
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button
                            className={`p-3 rounded-lg transition ${
                              student.status === "absent"
                                ? "bg-red-100 text-red-700 ring-2 ring-red-500"
                                : "bg-gray-100 dark:bg-slate-700"
                            }`}
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                          <button
                            className={`p-3 rounded-lg transition ${
                              student.status === "late"
                                ? "bg-amber-100 text-amber-700 ring-2 ring-amber-500"
                                : "bg-gray-100 dark:bg-slate-700"
                            }`}
                          >
                            <AlertCircle className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Monthly Calendar View */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {format(currentMonth, "MMMM yyyy")} Calendar
              </h2>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-3 mb-6">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-semibold text-gray-600 dark:text-gray-400 py-3"
                >
                  {day}
                </div>
              ))}
              {monthDays.map((day) => {
                const isCurrentDay = isToday(day);
                return (
                  <div
                    key={day.toString()}
                    className={`aspect-square rounded-xl flex items-center justify-center text-sm font-medium transition-all
                      ${
                        isCurrentDay
                          ? "bg-[#206380] text-white ring-4 ring-[#206380]/30"
                          : "bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600"
                      }`}
                  >
                    {format(day, "d")}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded bg-emerald-500"></div>
                <span className="text-gray-600 dark:text-gray-400">
                  Present
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded bg-red-500"></div>
                <span className="text-gray-600 dark:text-gray-400">Absent</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded bg-amber-500"></div>
                <span className="text-gray-600 dark:text-gray-400">Late</span>
              </div>
            </div>
          </div>

          {/* Floating Action */}
          <button
            onClick={exportAttendance}
            className="fixed bottom-8 right-8 bg-[#206380] text-white p-5 rounded-full shadow-2xl hover:bg-[#1a5169] transition-all hover:scale-110 z-10"
          >
            <Download className="w-7 h-7" />
          </button>
        </div>
      </div>
    </DashboardShell>
  );
}
