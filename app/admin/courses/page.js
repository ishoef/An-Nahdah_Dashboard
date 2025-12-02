"use client";

import { useState } from "react";
import DashboardShell from "@/components/layout/DashobardShell";
import {
  Search,
  Plus,
  MoreVertical,
  Users,
  BarChart3,
  Trash2,
  Eye,
  Download,
} from "lucide-react";

const coursesData = [
  {
    id: 1,
    title: "Tajweed Fundamentals",
    instructor: "Dr. Hassan Ahmed",
    students: 156,
    revenue: "$2,340",
    rating: 4.9,
    progress: 85,
    status: "active",
    createdDate: "Nov 15, 2024",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    title: "Intro to Islamic Fiqh",
    instructor: "Ms. Amina Khan",
    students: 98,
    revenue: "$1,470",
    rating: 4.7,
    progress: 62,
    status: "active",
    createdDate: "Dec 1, 2024",
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: 3,
    title: "Advanced Arabic Grammar",
    instructor: "Prof. Mohammed Ali",
    students: 82,
    revenue: "$1,230",
    rating: 4.8,
    progress: 78,
    status: "active",
    createdDate: "Dec 10, 2024",
    color: "from-violet-500 to-purple-500",
  },
  {
    id: 4,
    title: "Quranic Arabic Intensive",
    instructor: "Dr. Fatima Hassan",
    students: 124,
    revenue: "$1,860",
    rating: 4.6,
    progress: 45,
    status: "active",
    createdDate: "Dec 15, 2024",
    color: "from-orange-500 to-red-500",
  },
  {
    id: 5,
    title: "Islamic History Part 1",
    instructor: "Dr. Hassan Ahmed",
    students: 67,
    revenue: "$1,005",
    rating: 4.5,
    progress: 0,
    status: "draft",
    createdDate: "Jan 2, 2025",
    color: "from-pink-500 to-rose-500",
  },
  {
    id: 6,
    title: "Arabic Literature Basics",
    instructor: "Ms. Layla Al-Rashid",
    students: 45,
    revenue: "$675",
    rating: 4.4,
    progress: 30,
    status: "active",
    createdDate: "Jan 5, 2025",
    color: "from-indigo-500 to-blue-500",
  },
];

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredCourses = coursesData.filter(
    (course) =>
      (course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "all" || course.status === statusFilter)
  );

  return (
    <DashboardShell>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 p-8">
        {/* Header */}
        <div className="mb-8 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground tracking-tight">
                Courses
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                Manage all courses and track performance
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-lg font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create Course
              </button>
              <button className="px-6 py-2.5 border border-border rounded-lg hover:bg-accent transition-all duration-200 font-medium flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by course name or instructor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {filteredCourses.map((course, idx) => (
            <div
              key={course.id}
              className="group/course rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300 cursor-pointer"
              style={{ animationDelay: `${idx * 30}ms` }}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Left Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${course.color} flex-shrink-0 flex items-center justify-center text-white shadow-lg`}
                    >
                      <BarChart3 className="w-6 h-6" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-foreground group-hover/course:text-primary transition-colors duration-200 truncate">
                        {course.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {course.instructor}
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
                          {course.revenue}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">
                        Course Progress
                      </span>
                      <span className="text-xs font-semibold text-foreground">
                        {course.progress}%
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${course.color} transition-all duration-300 group-hover/course:shadow-lg`}
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                    <span className="text-xs text-muted-foreground">
                      Created {course.createdDate}
                    </span>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        course.status === "active"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {course.status.charAt(0).toUpperCase() +
                        course.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex flex-col items-center gap-2 opacity-0 group-hover/course:opacity-100 transition-opacity duration-200">
                  <button
                    className="p-2 rounded-lg hover:bg-muted transition-colors duration-200"
                    title="View"
                  >
                    <Eye className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                  </button>
                  <button
                    className="p-2 rounded-lg hover:bg-muted transition-colors duration-200"
                    title="Edit"
                  >
                    <BarChart3 className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                  </button>
                  <button
                    className="p-2 rounded-lg hover:bg-muted transition-colors duration-200"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-muted-foreground hover:text-red-500" />
                  </button>
                  <button
                    className="p-2 rounded-lg hover:bg-muted transition-colors duration-200"
                    title="More"
                  >
                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-foreground">
              {filteredCourses.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-foreground">
              {coursesData.length}
            </span>{" "}
            courses
          </p>
        </div>
      </div>
    </DashboardShell>
  );
}
