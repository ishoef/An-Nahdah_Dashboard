"use client";

import { useState } from "react";
import DashboardShell from "@/components/layout/DashobardShell";
import {
  Search,
  Plus,
  MoreVertical,
  Mail,
  Trash2,
  Eye,
  Download,
} from "lucide-react";

const studentsData = [
  {
    id: 1,
    name: "Aisha Khan",
    email: "aisha.khan@email.com",
    phone: "+966 50 123 4567",
    enrolledCourses: 3,
    joinDate: "Jan 15, 2025",
    status: "active",
    progress: 65,
  },
  {
    id: 2,
    name: "Muhammad Ali",
    email: "m.ali@email.com",
    phone: "+966 50 234 5678",
    enrolledCourses: 2,
    joinDate: "Jan 10, 2025",
    status: "active",
    progress: 48,
  },
  {
    id: 3,
    name: "Fatima Hassan",
    email: "fatima.h@email.com",
    phone: "+966 50 345 6789",
    enrolledCourses: 4,
    joinDate: "Dec 28, 2024",
    status: "active",
    progress: 82,
  },
  {
    id: 4,
    name: "Zainab Al-Rashid",
    email: "zainab.r@email.com",
    phone: "+966 50 456 7890",
    enrolledCourses: 1,
    joinDate: "Jan 5, 2025",
    status: "inactive",
    progress: 15,
  },
  {
    id: 5,
    name: "Ahmed Mohammed",
    email: "ahmed.m@email.com",
    phone: "+966 50 567 8901",
    enrolledCourses: 3,
    joinDate: "Jan 20, 2025",
    status: "active",
    progress: 72,
  },
  {
    id: 6,
    name: "Layla Al-Harbi",
    email: "layla.ah@email.com",
    phone: "+966 50 678 9012",
    enrolledCourses: 2,
    joinDate: "Jan 8, 2025",
    status: "pending",
    progress: 0,
  },
];

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredStudents = studentsData.filter(
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
                Students
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                Manage and monitor all enrolled students
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-lg font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Student
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
              className="px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 flex items-center gap-2"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Table Header */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Courses
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Join Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {filteredStudents.map((student, idx) => (
                  <tr
                    key={student.id}
                    className="hover:bg-muted/30 transition-colors duration-200 group/row animate-in fade-in"
                    style={{ animationDelay: `${idx * 20}ms` }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-primary">
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {student.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {student.phone}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm text-foreground">{student.email}</p>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        {student.enrolledCourses}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden max-w-[100px]">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-300 group-hover/row:shadow-lg"
                            style={{ width: `${student.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground w-8 text-right">
                          {student.progress}%
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm text-muted-foreground">
                        {student.joinDate}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          student.status === "active"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : student.status === "inactive"
                            ? "bg-red-500/10 text-red-600 dark:text-red-400"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {student.status.charAt(0).toUpperCase() +
                          student.status.slice(1)}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1 opacity-0 group-hover/row:opacity-100 transition-opacity duration-200">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-muted/30">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-semibold text-foreground">
                {filteredStudents.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-foreground">
                {studentsData.length}
              </span>{" "}
              students
            </p>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors duration-200 text-sm font-medium disabled:opacity-50">
                Previous
              </button>
              <button className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors duration-200 text-sm font-medium">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
