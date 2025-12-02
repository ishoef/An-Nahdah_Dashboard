"use client";

import { useState } from "react";
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
} from "lucide-react";

const myCourses = [
  {
    id: 1,
    title: "Tajweed Fundamentals",
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
    students: 82,
    revenue: "$1,230",
    rating: 4.8,
    progress: 78,
    status: "active",
    lessons: 20,
    color: "from-violet-500 to-purple-500",
  },
];

export default function InstructorCoursesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCourses = myCourses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardShell>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 p-8">
        {/* Header */}
        <div className="mb-8 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground tracking-tight">
                My Courses
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                Create and manage your courses
              </p>
            </div>

            <button className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-lg font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Course
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search your courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
            />
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {filteredCourses.map((course, idx) => (
            <div
              key={course.id}
              className="group/course rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300"
              style={{ animationDelay: `${idx * 30}ms` }}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Left Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${course.color} flex-shrink-0 flex items-center justify-center text-white shadow-lg`}
                    >
                      <BarChart3 className="w-6 h-6" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-foreground group-hover/course:text-primary transition-colors duration-200">
                        {course.title}
                      </h3>

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

                  {/* Stats Row */}
                  <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Completion
                      </p>
                      <p className="text-sm font-bold text-foreground">
                        {course.progress}%
                      </p>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-1">
                        <div
                          className={`h-full bg-gradient-to-r ${course.color}`}
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Students
                      </p>
                      <p className="text-sm font-bold text-foreground">
                        {course.students}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Rating
                      </p>
                      <p className="text-sm font-bold text-yellow-500">
                        {course.rating}★
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Revenue
                      </p>
                      <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        {course.revenue}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex flex-col gap-2 opacity-0 group-hover/course:opacity-100 transition-opacity duration-200">
                  <button
                    className="p-2 rounded-lg hover:bg-muted transition-colors duration-200"
                    title="View"
                  >
                    <Eye className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                  </button>
                  <button
                    className="p-2 rounded-lg hover:bg-muted transition-colors duration-200"
                    title="Upload Content"
                  >
                    <Upload className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                  </button>
                  <button
                    className="p-2 rounded-lg hover:bg-muted transition-colors duration-200"
                    title="Settings"
                  >
                    <Settings className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                  </button>
                  <button
                    className="p-2 rounded-lg hover:bg-muted transition-colors duration-200"
                    title="More"
                  >
                    <MoreVertical className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
