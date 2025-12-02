"use client";

import { useState } from "react";
import DashboardShell from "@/components/layout/DashobardShell";
import {
  Search,
  Plus,
  MoreVertical,
  Users,
  Trash2,
  Eye,
  Download,
  Mail,
} from "lucide-react";

const instructorsData = [
  {
    id: 1,
    name: "Dr. Hassan Ahmed",
    email: "hassan.ahmed@academy.com",
    courses: 3,
    students: 368,
    rating: 4.9,
    status: "active",
    joinDate: "Sep 10, 2023",
    salary: "$3,500/month",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    name: "Ms. Amina Khan",
    email: "amina.khan@academy.com",
    courses: 2,
    students: 156,
    rating: 4.7,
    status: "active",
    joinDate: "Oct 15, 2023",
    salary: "$2,800/month",
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: 3,
    name: "Prof. Mohammed Ali",
    email: "m.ali@academy.com",
    courses: 4,
    students: 312,
    rating: 4.8,
    status: "active",
    joinDate: "Aug 5, 2023",
    salary: "$4,200/month",
    color: "from-violet-500 to-purple-500",
  },
  {
    id: 4,
    name: "Dr. Fatima Hassan",
    email: "fatima.hassan@academy.com",
    courses: 2,
    students: 124,
    rating: 4.6,
    status: "inactive",
    joinDate: "Nov 20, 2023",
    salary: "$2,500/month",
    color: "from-orange-500 to-red-500",
  },
];

export default function InstructorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredInstructors = instructorsData.filter(
    (instructor) =>
      (instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instructor.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "all" || instructor.status === statusFilter)
  );

  return (
    <DashboardShell>
      <div className="min-h-screen bg-linear-to-br from-background via-background to-background/80 p-8">
        {/* Header */}
        <div className="mb-8 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground tracking-tight">
                Instructors
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                Manage instructors and monitor their performance
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button className="px-6 py-2.5 bg-linear-to-r from-primary to-primary/90 text-primary-foreground rounded-lg font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Instructor
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
                placeholder="Search by name or email..."
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
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Instructors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {filteredInstructors.map((instructor, idx) => (
            <div
              key={instructor.id}
              className="group/instructor rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300 cursor-pointer"
              style={{ animationDelay: `${idx * 30}ms` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-linear-to-br ${instructor.color} shrink-0 flex items-center justify-center text-white shadow-lg`}
                    >
                      <Users className="w-6 h-6" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-foreground group-hover/instructor:text-primary transition-colors duration-200 truncate">
                        {instructor.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 truncate">
                        {instructor.email}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 mt-3">
                        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-muted/50 text-xs text-muted-foreground">
                          <Users className="w-3.5 h-3.5" />
                          <span>{instructor.students} students</span>
                        </div>
                        <span className="text-xs font-semibold text-yellow-500">
                          ★ {instructor.rating}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                          {instructor.courses} courses
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Salary and Status */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">Salary</p>
                      <p className="text-sm font-semibold text-foreground">
                        {instructor.salary}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        instructor.status === "active"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-slate-500/10 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {instructor.status.charAt(0).toUpperCase() +
                        instructor.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex flex-col items-center gap-2 opacity-0 group-hover/instructor:opacity-100 transition-opacity duration-200">
                  <button
                    className="p-2 rounded-lg hover:bg-muted transition-colors duration-200"
                    title="View"
                  >
                    <Eye className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                  </button>
                  <button
                    className="p-2 rounded-lg hover:bg-muted transition-colors duration-200"
                    title="Email"
                  >
                    <Mail className="w-4 h-4 text-muted-foreground hover:text-foreground" />
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
              {filteredInstructors.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-foreground">
              {instructorsData.length}
            </span>{" "}
            instructors
          </p>
        </div>
      </div>
    </DashboardShell>
  );
}
