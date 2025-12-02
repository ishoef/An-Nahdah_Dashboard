"use client";

import { useState } from "react";
import DashboardShell from "@/components/layout/DashobardShell";
import { Search, Download, MessageSquare, Award } from "lucide-react";

const studentsList = [
  {
    id: 1,
    name: "Aisha Khan",
    email: "aisha.khan@email.com",
    courses: ["Tajweed Basics", "Quran 101"],
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
    completionRate: 28,
    joinDate: "Jan 1, 2025",
    lastActive: "5 days ago",
    status: "inactive",
  },
];

export default function InstructorStudentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredStudents = studentsList.filter(
    (student) =>
      (student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "all" || student.status === statusFilter)
  );

  return (
    <DashboardShell>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 p-8">
        {/* Header */}
        <div className="mb-8 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground tracking-tight">
                My Students
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                Track student progress and engagement
              </p>
            </div>

            <button className="px-6 py-2.5 border border-border rounded-lg hover:bg-accent transition-all duration-200 font-medium flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search students..."
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
              <option value="all">All Students</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Students Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {filteredStudents.map((student, idx) => (
            <div
              key={student.id}
              className="group/student rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300"
              style={{ animationDelay: `${idx * 30}ms` }}
            >
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

              {/* Courses */}
              <div className="mb-4 pb-4 border-b border-border">
                <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                  Enrolled Courses
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

              {/* Completion Rate */}
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

              {/* Metadata */}
              <div className="flex items-center justify-between mb-4 text-xs text-muted-foreground">
                <span>Joined {student.joinDate}</span>
                <span>Active {student.lastActive}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button className="flex-1 px-4 py-2.5 rounded-lg border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2 group/btn">
                  <MessageSquare className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" />
                  Message
                </button>
                <button className="flex-1 px-4 py-2.5 rounded-lg border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2 group/btn">
                  <Award className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" />
                  Grade
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
