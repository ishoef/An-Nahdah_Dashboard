"use client";

import { useState, useMemo } from "react";
import DashboardShell from "@/components/layout/DashobardShell";
import {
  Search,
  Download,
  MessageSquare,
  Award,
  Grid3X3,
  List,
  Users,
  X,
  Send,
  CheckCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const studentsList = [
  {
    id: 1,
    name: "Aisha Khan",
    email: "aisha.khan@email.com",
    courses: ["Tajweed Basics"],
    batch: "2025-Quran",
    completionRate: 78,
    joinDate: "Nov 20, 2024",
    lastActive: "Today",
    status: "active",
  },
  {
    id: 2,
    name: "Muhammad Ali",
    email: "m.ali@email.com",
    courses: ["Tajweed Basics"],
    batch: "2025-Quran",
    completionRate: 45,
    joinDate: "Dec 5, 2024",
    lastActive: "2 days ago",
    status: "active",
  },
  {
    id: 3,
    name: "Fatima Hassan",
    email: "fatima.h@email.com",
    courses: ["Tajweed Basics", "Advanced Quran"],
    batch: "2024-Ramadan",
    completionRate: 92,
    joinDate: "Oct 10, 2024",
    lastActive: "Yesterday",
    status: "active",
  },
  {
    id: 4,
    name: "Zainab Al-Rashid",
    email: "zainab.r@email.com",
    courses: ["Quran 101"],
    batch: "2025-Quran",
    completionRate: 28,
    joinDate: "Jan 1, 2025",
    lastActive: "5 days ago",
    status: "inactive",
  },
  {
    id: 5,
    name: "Omar Farooq",
    email: "omar.f@email.com",
    courses: ["Advanced Quran"],
    batch: "2024-Ramadan",
    completionRate: 88,
    joinDate: "Sep 15, 2024",
    lastActive: "Today",
    status: "active",
  },
];

export default function InstructorStudentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedBatch, setSelectedBatch] = useState("all");
  const [viewMode, setViewMode] = useState("grid");

  // Modal states
  const [gradeModal, setGradeModal] = useState(null); // { student, course }
  const [messageModal, setMessageModal] = useState(null); // student
  const [showSuccess, setShowSuccess] = useState("");

  // Form states
  const [gradeForm, setGradeForm] = useState({
    course: "",
    score: "",
    feedback: "",
  });
  const [messageForm, setMessageForm] = useState({ subject: "", body: "" });

  const allCourses = [...new Set(studentsList.flatMap((s) => s.courses))];
  const allBatches = [...new Set(studentsList.map((s) => s.batch))];

  const filteredStudents = useMemo(() => {
    return studentsList.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || student.status === statusFilter;
      const matchesCourse =
        selectedCourse === "all" || student.courses.includes(selectedCourse);
      const matchesBatch =
        selectedBatch === "all" || student.batch === selectedBatch;
      return matchesSearch && matchesStatus && matchesCourse && matchesBatch;
    });
  }, [searchTerm, statusFilter, selectedCourse, selectedBatch]);

  const avgCompletion =
    filteredStudents.length > 0
      ? Math.round(
          filteredStudents.reduce((sum, s) => sum + s.completionRate, 0) /
            filteredStudents.length
        )
      : 0;

  const exportToCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Courses",
      "Batch",
      "Completion %",
      "Status",
      "Joined",
      "Last Active",
    ];
    const rows = filteredStudents.map((s) => [
      s.name,
      s.email,
      s.courses.join(" | "),
      s.batch,
      s.completionRate + "%",
      s.status,
      s.joinDate,
      s.lastActive,
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `students-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const openGradeModal = (student) => {
    setGradeModal(student);
    setGradeForm({ course: student.courses[0] || "", score: "", feedback: "" });
  };

  const openMessageModal = (student) => {
    setMessageModal(student);
    setMessageForm({ subject: "", body: "" });
  };

  const submitGrade = () => {
    if (!gradeForm.score || !gradeForm.course) return;
    setShowSuccess("Grade submitted successfully!");
    setTimeout(() => setShowSuccess(""), 3000);
    setGradeModal(null);
  };

  const sendMessage = () => {
    if (!messageForm.subject.trim() || !messageForm.body.trim()) return;
    setShowSuccess("Message sent successfully!");
    setTimeout(() => setShowSuccess(""), 3000);
    setMessageModal(null);
  };

  return (
    <DashboardShell>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80">
        <div className="p-6 lg:p-8 mx-auto relative">
          {/* Success Toast */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3"
              >
                <CheckCircle className="w-6 h-6" />
                {showSuccess}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold text-foreground tracking-tight">
                  My Students
                </h1>
                <p className="text-muted-foreground mt-1">
                  Track progress and stay connected with your learners
                </p>
              </div>
              <button
                onClick={exportToCSV}
                className="px-6 py-3 bg-gradient-to-r from-[#206380] to-[#1b5666] text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Export CSV
              </button>
            </div>
          </motion.div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            <div className="bg-card/70 backdrop-blur-sm border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Students
                  </p>
                  <p className="text-3xl font-bold text-foreground mt-1">
                    {filteredStudents.length}
                  </p>
                </div>
                <Users className="w-12 h-12 text-[#206380]/70" />
              </div>
            </div>
            <div className="bg-card/70 backdrop-blur-sm border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Avg Completion
                  </p>
                  <p className="text-3xl font-bold text-foreground mt-1">
                    {avgCompletion}%
                  </p>
                </div>
                <div className="text-5xl">Progress</div>
              </div>
            </div>
            <div className="bg-card/70 backdrop-blur-sm border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Today</p>
                  <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                    {
                      filteredStudents.filter((s) => s.lastActive === "Today")
                        .length
                    }
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="mb-6 flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-border bg-card/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
              />
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3.5 rounded-xl border border-border bg-card/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="px-4 py-3.5 rounded-xl border border-border bg-card/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="all">All Courses</option>
                {allCourses.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="px-4 py-3.5 rounded-xl border border-border bg-card/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="all">All Batches</option>
                {allBatches.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>

              <div className="flex rounded-xl border border-border bg-card/60 p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 rounded-lg transition ${
                    viewMode === "grid"
                      ? "bg-primary text-white"
                      : "hover:bg-muted"
                  }`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-2.5 rounded-lg transition ${
                    viewMode === "table"
                      ? "bg-primary text-white"
                      : "hover:bg-muted"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Grid View - Your Original Design Preserved */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence>
                {filteredStudents.map((student) => (
                  <motion.div
                    key={student.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group/student rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300"
                  >
                    {/* Your original card content - 100% unchanged */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-primary">
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {student.name}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {student.email}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          student.status === "active"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-red-500/10 text-red-600 dark:text-red-400"
                        }`}
                      >
                        {student.status.charAt(0).toUpperCase() +
                          student.status.slice(1)}
                      </span>
                    </div>

                    <div className="mb-4 pb-4 border-b border-border">
                      <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                        Enrolled Courses • {student.batch}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {student.courses.map((course, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
                          >
                            {course}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4 pb-4 border-b border-border">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Completion Rate
                        </p>
                        <span className="text-sm font-bold text-foreground">
                          {student.completionRate}%
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-300 group-hover/student:shadow-lg"
                          style={{ width: `${student.completionRate}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4 text-xs text-muted-foreground">
                      <span>Joined {student.joinDate}</span>
                      <span>Active {student.lastActive}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openMessageModal(student)}
                        className="flex-1 px-4 py-2.5 rounded-lg border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2 group/btn"
                      >
                        <MessageSquare className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                        Message
                      </button>
                      <button
                        onClick={() => openGradeModal(student)}
                        className="flex-1 px-4 py-2.5 rounded-lg border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2 group/btn"
                      >
                        <Award className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                        Grade
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Table View - unchanged */}
          {viewMode === "table" && (
            <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-medium text-foreground">
                        Student
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-foreground">
                        Batch
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-foreground">
                        Courses
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-foreground">
                        Completion
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-foreground">
                        Status
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-foreground">
                        Last Active
                      </th>
                      <th className="text-right px-6 py-4 text-sm font-medium text-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr
                        key={student.id}
                        className="border-b border-border/50 hover:bg-muted/30 transition"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                              {student.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <div>
                              <p className="font-medium">{student.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {student.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-sm">{student.batch}</td>
                        <td className="px-6 py-5">
                          <div className="flex flex-wrap gap-1">
                            {student.courses.map((c, i) => (
                              <span
                                key={i}
                                className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <span className="font-medium">
                              {student.completionRate}%
                            </span>
                            <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-primary to-primary/80"
                                style={{ width: `${student.completionRate}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              student.status === "active"
                                ? "bg-emerald-500/10 text-emerald-600"
                                : "bg-red-500/10 text-red-600"
                            }`}
                          >
                            {student.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-sm text-muted-foreground">
                          {student.lastActive}
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openMessageModal(student)}
                              className="p-2 hover:bg-muted rounded-lg"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openGradeModal(student)}
                              className="p-2 hover:bg-muted rounded-lg"
                            >
                              <Award className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {filteredStudents.length === 0 && (
            <div className="text-center py-20">
              <div className="bg-muted/40 w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Users className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium text-foreground">
                No students found
              </h3>
              <p className="text-muted-foreground mt-2">
                Try adjusting your filters.
              </p>
            </div>
          )}

          {/* Grade Modal */}
          <AnimatePresence>
            {gradeModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                onClick={() => setGradeModal(null)}
              >
                <motion.div
                  initial={{ scale: 0.95, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.95, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-card rounded-2xl shadow-2xl max-w-lg w-full p-8"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                      <Award className="w-7 h-7 text-[#206380]" />
                      Grade Student
                    </h2>
                    <button
                      onClick={() => setGradeModal(null)}
                      className="p-2 hover:bg-muted rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-5">
                    <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#206380] to-[#1b5666] flex items-center justify-center text-white font-bold">
                        {gradeModal.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="font-semibold">{gradeModal.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {gradeModal.email}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Select Course
                      </label>
                      <select
                        value={gradeForm.course}
                        onChange={(e) =>
                          setGradeForm({ ...gradeForm, course: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-[#206380]/30 focus:outline-none"
                      >
                        <option value="">Choose course...</option>
                        {gradeModal.courses.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Score (0–100)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={gradeForm.score}
                        onChange={(e) =>
                          setGradeForm({ ...gradeForm, score: e.target.value })
                        }
                        placeholder="e.g. 95"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-[#206380]/30 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Feedback (Optional)
                      </label>
                      <textarea
                        rows={4}
                        value={gradeForm.feedback}
                        onChange={(e) =>
                          setGradeForm({
                            ...gradeForm,
                            feedback: e.target.value,
                          })
                        }
                        placeholder="Great effort! Keep practicing your makharij..."
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-[#206380]/30 focus:outline-none resize-none"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-border">
                      <button
                        onClick={() => setGradeModal(null)}
                        className="px-6 py-3 border border-border rounded-xl hover:bg-muted transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={submitGrade}
                        disabled={!gradeForm.score || !gradeForm.course}
                        className="px-6 py-3 bg-gradient-to-r from-[#206380] to-[#1b5666] text-white rounded-xl font-medium hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        Submit Grade
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Message Modal */}
          <AnimatePresence>
            {messageModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                onClick={() => setMessageModal(null)}
              >
                <motion.div
                  initial={{ scale: 0.95, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.95, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-card rounded-2xl shadow-2xl max-w-lg w-full p-8"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                      <MessageSquare className="w-7 h-7 text-[#206380]" />
                      Send Message
                    </h2>
                    <button
                      onClick={() => setMessageModal(null)}
                      className="p-2 hover:bg-muted rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-5">
                    <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#206380] to-[#1b5666] flex items-center justify-center text-white font-bold">
                        {messageModal.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="font-semibold">To: {messageModal.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {messageModal.email}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={messageForm.subject}
                        onChange={(e) =>
                          setMessageForm({
                            ...messageForm,
                            subject: e.target.value,
                          })
                        }
                        placeholder="e.g. Great progress in Tajweed!"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-[#206380]/30 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Message
                      </label>
                      <textarea
                        rows={6}
                        value={messageForm.body}
                        onChange={(e) =>
                          setMessageForm({
                            ...messageForm,
                            body: e.target.value,
                          })
                        }
                        placeholder="Assalamu Alaikum dear student..."
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-[#206380]/30 focus:outline-none resize-none"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-border">
                      <button
                        onClick={() => setMessageModal(null)}
                        className="px-6 py-3 border border-border rounded-xl hover:bg-muted transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={sendMessage}
                        disabled={
                          !messageForm.subject.trim() ||
                          !messageForm.body.trim()
                        }
                        className="px-6 py-3 bg-gradient-to-r from-[#206380] to-[#1b5666] text-white rounded-xl font-medium hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        Send Message
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardShell>
  );
}
