"use client";

import { useState } from "react";
import DashboardShell from "@/components/layout/DashobardShell";
import { BarChart3, LineChart, PieChart, Download } from "lucide-react";

export default function ReportsPage() {
  const [reportType, setReportType] = useState("overview");

  const reports = [
    {
      id: 1,
      title: "Student Enrollment Report",
      description: "Monthly student enrollment trends and statistics",
      icon: LineChart,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: 2,
      title: "Course Performance Report",
      description: "Analytics on course performance, ratings, and engagement",
      icon: BarChart3,
      color: "from-emerald-500 to-teal-500",
    },
    {
      id: 3,
      title: "Instructor Performance",
      description:
        "Detailed metrics on instructor ratings and student feedback",
      icon: PieChart,
      color: "from-violet-500 to-purple-500",
    },
    {
      id: 4,
      title: "Revenue Report",
      description: "Monthly revenue, course earnings, and financial metrics",
      icon: BarChart3,
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <DashboardShell>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 p-8">
        {/* Header */}
        <div className="mb-8 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground tracking-tight">
                Reports
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                Generate and download academy reports
              </p>
            </div>

            <button className="px-6 py-2.5 border border-border rounded-lg hover:bg-accent transition-all duration-200 font-medium flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export All
            </button>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {reports.map((report, idx) => {
            const IconComponent = report.icon;
            return (
              <div
                key={report.id}
                className="group/report rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300 cursor-pointer"
                style={{ animationDelay: `${idx * 30}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${report.color} flex-shrink-0 flex items-center justify-center text-white shadow-lg`}
                  >
                    <IconComponent className="w-7 h-7" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-foreground group-hover/report:text-primary transition-colors duration-200">
                      {report.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      {report.description}
                    </p>

                    <button className="mt-4 px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium text-sm hover:bg-primary/20 transition-colors duration-200 flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Generate Report
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4">
            <p className="text-sm text-muted-foreground mb-2">Total Students</p>
            <p className="text-2xl font-bold text-foreground">1,234</p>
            <p className="text-xs text-emerald-600 mt-2">
              ↑ 12% from last month
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4">
            <p className="text-sm text-muted-foreground mb-2">Active Courses</p>
            <p className="text-2xl font-bold text-foreground">24</p>
            <p className="text-xs text-primary mt-2">6 new this month</p>
          </div>
          <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4">
            <p className="text-sm text-muted-foreground mb-2">Total Revenue</p>
            <p className="text-2xl font-bold text-foreground">$45,230</p>
            <p className="text-xs text-emerald-600 mt-2">
              ↑ 8% from last month
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4">
            <p className="text-sm text-muted-foreground mb-2">Avg Rating</p>
            <p className="text-2xl font-bold text-foreground">4.7</p>
            <p className="text-xs text-yellow-500 mt-2">Based on reviews</p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
