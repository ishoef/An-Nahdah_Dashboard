"use client";

import { useState, useMemo } from "react";
import DashboardShell from "@/components/layout/DashobardShell";
import {
  Search,
  Plus,
  MoreVertical,
  Users,
  BarChart3,
  Eye,
  Upload,
  Settings,
  Grid3X3,
  List,
  Filter,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const myCourses = [
  {
    id: 1,
    title: "Tajweed Fundamentals",
    batch: "2025-Quran",
    students: 156,
    revenue: "$2,340",
    rating: 4.9,
    progress: 85,
    status: "active",
    lessons: 24,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    title: "Intro to Islamic Fiqh",
    batch: "2024-Ramadan",
    students: 98,
    revenue: "$1,470",
    rating: 4.7,
    progress: 62,
    status: "active",
    lessons: 18,
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: 3,
    title: "Advanced Arabic Grammar",
    batch: "2025-Quran",
    students: 82,
    revenue: "$1,230",
    rating: 4.8,
    progress: 78,
    status: "active",
    lessons: 20,
    color: "from-violet-500 to-purple-500",
  },
  {
    id: 4,
    title: "Seerah of the Prophet (PBUH)",
    batch: "2024-Ramadan",
    students: 134,
    revenue: "$2,010",
    rating: 5.0,
    progress: 92,
    status: "active",
    lessons: 30,
    color: "from-amber-500 to-orange-500",
  },
];

export default function InstructorCoursesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid or table
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedBatch, setSelectedBatch] = useState("all");

  // Extract unique courses & batches
  const courses = ["all", ...new Set(myCourses.map(c => c.title))];
  const batches = ["all", ...new Set(myCourses.map(c => c.batch))];

  // Filter logic
  const filteredCourses = useMemo(() => {
    return myCourses.filter((course) => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCourse = selectedCourse === "all" || course.title === selectedCourse;
      const matchesBatch = selectedBatch === "all" || course.batch === selectedBatch;
      return matchesSearch && matchesCourse && matchesBatch;
    });
  }, [searchTerm, selectedCourse, selectedBatch]);

  // Summary stats
  const totalStudents = filteredCourses.reduce((sum, c) => sum + c.students, 0);
  const totalRevenue = filteredCourses.reduce((sum, c) => sum + parseFloat(c.revenue.replace(/[$,]/g, "")), 0);
  const avgRating = filteredCourses.length > 0
    ? (filteredCourses.reduce((sum, c) => sum + c.rating, 0) / filteredCourses.length).toFixed(1)
    : 0;

  return (
    <DashboardShell>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80">
        <div className="p-6 lg:p-8 mx-auto">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold text-foreground tracking-tight">
                  My Courses
                </h1>
                <p className="text-muted-foreground mt-1">
                  Manage and track performance of your courses
                </p>
              </div>
              <button className="px-6 py-3 bg-gradient-to-r from-[#206380] to-[#1b5666] text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Create Course
              </button>
            </div>
          </motion.div>

          {/* Summary Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-card/70 backdrop-blur-sm border border-border rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{totalStudents}</p>
                </div>
                <Users className="w-10 h-10 text-[#206380]/70" />
              </div>
            </div>
            <div className="bg-card/70 backdrop-blur-sm border border-border rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                    ${totalRevenue.toLocaleString()}
                  </p>
                </div>
                <BarChart3 className="w-10 h-10 text-emerald-500/70" />
              </div>
            </div>
            <div className="bg-card/70 backdrop-blur-sm border border-border rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Rating</p>
                  <p className="text-2xl font-bold text-yellow-500 mt-1">★ {avgRating}</p>
                </div>
                <div className="text-4xl">★</div>
              </div>
            </div>
            <div className="bg-card/70 backdrop-blur-sm border border-border rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Courses</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{filteredCourses.length}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#206380] to-[#1b5666] flex items-center justify-center text-white font-bold">
                  {filteredCourses.length}
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
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-border bg-card/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
              />
            </div>

            <div className="flex items-center gap-3">
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="px-4 py-3.5 rounded-xl border border-border bg-card/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {courses.map(c => (
                  <option key={c} value={c}>{c === "all" ? "All Courses" : c}</option>
                ))}
              </select>

              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="px-4 py-3.5 rounded-xl border border-border bg-card/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {batches.map(b => (
                  <option key={b} value={b}>{b === "all" ? "All Batches" : b}</option>
                ))}
              </select>

              <div className="flex rounded-xl border border-border bg-card/60 p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 rounded-lg transition ${viewMode === "grid" ? "bg-primary text-white" : "hover:bg-muted"}`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-2.5 rounded-lg transition ${viewMode === "table" ? "bg-primary text-white" : "hover:bg-muted"}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Grid View (Your Original Beautiful Cards - Unchanged!) */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 gap-6">
              <AnimatePresence>
                {filteredCourses.map((course, idx) => (
                  <motion.div
                    key={course.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="group/course rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-4">
                          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${course.color} flex-shrink-0 flex items-center justify-center text-white shadow-lg`}>
                            <BarChart3 className="w-6 h-6" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-foreground group-hover/course:text-primary transition-colors duration-200">
                              {course.title}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-1">
                              Batch: <span className="font-medium">{course.batch}</span>
                            </p>

                            <div className="flex flex-wrap items-center gap-3 mt-3">
                              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-muted/50 text-xs text-muted-foreground">
                                <Users className="w-3.5 h-3.5" />
                                <span>{course.students} students</span>
                              </div>
                              <span className="text-xs font-semibold text-yellow-500">
                                ★ {course.rating}
                              </span>
                              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                                {course.lessons} lessons
                              </span>
                              <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
                                {course.revenue}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-border">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Completion</p>
                            <p className="text-sm font-bold text-foreground">{course.progress}%</p>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-1">
                              <div className={`h-full bg-gradient-to-r ${course.color}`} style={{ width: `${course.progress}%` }} />
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Students</p>
                            <p className="text-sm font-bold text-foreground">{course.students}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Rating</p>
                            <p className="text-sm font-bold text-yellow-500">{course.rating}★</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Revenue</p>
                            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{course.revenue}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 opacity-0 group-hover/course:opacity-100 transition-opacity duration-200">
                        <button className="p-2 rounded-lg hover:bg-muted transition" title="View"><Eye className="w-4 h-4 text-muted-foreground hover:text-foreground" /></button>
                        <button className="p-2 rounded-lg hover:bg-muted transition" title="Upload"><Upload className="w-4 h-4 text-muted-foreground hover:text-foreground" /></button>
                        <button className="p-2 rounded-lg hover:bg-muted transition" title="Settings"><Settings className="w-4 h-4 text-muted-foreground hover:text-foreground" /></button>
                        <button className="p-2 rounded-lg hover:bg-muted transition" title="More"><MoreVertical className="w-4 h-4 text-muted-foreground hover:text-foreground" /></button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Table View */}
          {viewMode === "table" && (
            <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-medium text-foreground">Course</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-foreground">Batch</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-foreground">Students</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-foreground">Rating</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-foreground">Revenue</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-foreground">Completion</th>
                      <th className="text-right px-6 py-4 text-sm font-medium text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCourses.map((course) => (
                      <tr key={course.id} className="border-b border-border/50 hover:bg-muted/30 transition">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${course.color} flex items-center justify-center text-white`}>
                              <BarChart3 className="w-5 h-5" />
                            </div>
                            <span className="font-medium">{course.title}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-sm text-muted-foreground">{course.batch}</td>
                        <td className="px-6 py-5 font-semibold">{course.students}</td>
                        <td className="px-6 py-5"><span className="text-yellow-500 font-medium">★ {course.rating}</span></td>
                        <td className="px-6 py-5 font-semibold text-emerald-600 dark:text-emerald-400">{course.revenue}</td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{course.progress}%</span>
                            <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                              <div className={`h-full bg-gradient-to-r ${course.color}`} style={{ width: `${course.progress}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button className="p-2 hover:bg-muted rounded-lg"><Eye className="w-4 h-4" /></button>
                            <button className="p-2 hover:bg-muted rounded-lg"><Upload className="w-4 h-4" /></button>
                            <button className="p-2 hover:bg-muted rounded-lg"><Settings className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {filteredCourses.length === 0 && (
            <div className="text-center py-20">
              <div className="bg-muted/40 w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center">
                <BarChart3 className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium text-foreground">No courses found</h3>
              <p className="text-muted-foreground mt-2">Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}