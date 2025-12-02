"use client";

import { useState, useEffect } from "react";
import DashboardShell from "@/components/layout/DashobardShell";
import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Zap,
} from "lucide-react";

const stats = [
  {
    id: 1,
    title: "Active Students",
    value: "486",
    delta: "+12%",
    trend: "up",
    icon: Users,
    color: "from-blue-500 to-blue-600",
    lightColor: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    id: 2,
    title: "My Courses",
    value: "8",
    delta: "+1",
    trend: "up",
    icon: BookOpen,
    color: "from-emerald-500 to-emerald-600",
    lightColor: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  {
    id: 3,
    title: "Monthly Earnings",
    value: "$3,240",
    delta: "+18.5%",
    trend: "up",
    icon: DollarSign,
    color: "from-violet-500 to-violet-600",
    lightColor: "bg-violet-100 dark:bg-violet-900/30",
  },
  {
    id: 4,
    title: "Avg Rating",
    value: "4.8",
    delta: "+0.2",
    trend: "up",
    icon: TrendingUp,
    color: "from-amber-500 to-amber-600",
    lightColor: "bg-amber-100 dark:bg-amber-900/30",
  },
];

const sparklineData = [5, 7, 9, 8, 12, 11, 14, 13, 16, 18, 16, 20];

const upcomingClasses = [
  {
    id: 1,
    title: "Tajweed Basics - Session 3",
    students: 28,
    date: "Dec 5, 2025",
    time: "10:00 AM",
    status: "confirmed",
  },
  {
    id: 2,
    title: "Fiqh Essentials - Q&A",
    students: 35,
    date: "Dec 6, 2025",
    time: "3:00 PM",
    status: "confirmed",
  },
  {
    id: 3,
    title: "Arabic Grammar - Lesson 5",
    students: 22,
    date: "Dec 8, 2025",
    time: "2:00 PM",
    status: "pending",
  },
];

const myCourses = [
  {
    id: 1,
    title: "Tajweed Fundamentals",
    students: 156,
    revenue: "$2,340",
    rating: 4.9,
    progress: 85,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    title: "Intro to Islamic Fiqh",
    students: 98,
    revenue: "$1,470",
    rating: 4.7,
    progress: 62,
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: 3,
    title: "Advanced Arabic Grammar",
    students: 82,
    revenue: "$1,230",
    rating: 4.8,
    progress: 78,
    color: "from-violet-500 to-purple-500",
  },
];

const studentFeedback = [
  {
    id: 1,
    name: "Fatima Hassan",
    rating: 5,
    comment: "Excellent teaching methods, very clear explanations",
    date: "2 days ago",
  },
  {
    id: 2,
    name: "Mohammed Ali",
    rating: 4,
    comment: "Great course, wish there were more practice sessions",
    date: "5 days ago",
  },
  {
    id: 3,
    name: "Zainab Khan",
    rating: 5,
    comment: "This instructor is amazing! Learning so much.",
    date: "1 week ago",
  },
];

function StatCard({ stat, index }) {
  const Icon = stat.icon;

  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-border bg-card/50 p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:-translate-y-1 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative flex items-center justify-between">
        <div className="space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {stat.title}
          </p>
          <div>
            <h3 className="text-3xl font-bold text-foreground tracking-tight">
              {stat.value}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              {stat.trend === "up" ? (
                <ArrowUpRight className="w-4 h-4 text-emerald-500" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-500" />
              )}
              <span
                className={`text-sm font-medium ${
                  stat.trend === "up" ? "text-emerald-500" : "text-red-500"
                }`}
              >
                {stat.delta}
              </span>
            </div>
          </div>
        </div>

        <div
          className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300`}
        >
          <Icon className="w-7 h-7" />
        </div>
      </div>

      <div
        className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        style={{ width: "0%", animation: "expandWidth 0.3s ease-out forwards" }}
      />
    </div>
  );
}

function Sparkline({ data = [] }) {
  const w = 280;
  const h = 80;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((d - min) / (max - min || 1)) * h;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      className="block animate-in fade-in slide-in-from-bottom-2"
      style={{ animationDelay: "100ms" }}
    >
      <defs>
        <linearGradient id="sparkGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0" />
        </linearGradient>
      </defs>

      <polyline
        fill="url(#sparkGradient)"
        points={`0,${h} ${points} ${w},${h}`}
      />

      <polyline
        fill="none"
        stroke="rgb(59, 130, 246)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        className="opacity-100"
      />
    </svg>
  );
}

export default function InstructorOverviewPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <DashboardShell>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 p-8">
        {/* Header with animation */}
        <div className="mb-10 space-y-2 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground tracking-tight">
                  Dashboard
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Welcome back,{" "}
                  <span className="font-semibold text-foreground">
                    Instructor
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-lg font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Create Class
              </button>
              <button className="px-6 py-2.5 border border-border rounded-lg hover:bg-accent transition-all duration-200 font-medium">
                Reports
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <StatCard key={stat.id} stat={stat} index={idx} />
          ))}
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left section: Charts and courses */}
          <div className="lg:col-span-2 space-y-8">
            {/* Enrollment Trend */}
            <div
              className="group relative overflow-hidden rounded-2xl border border-border bg-card/50 p-8 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
              style={{ animationDelay: "200ms" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                      Student Enrollment Trend
                    </p>
                    <h2 className="text-2xl font-bold text-foreground mt-2">
                      +156 new students
                    </h2>
                  </div>
                  <div className="text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-lg font-medium">
                    Last 12 months
                  </div>
                </div>

                <div className="mt-6 transform group-hover:scale-105 transition-transform duration-300">
                  <Sparkline data={sparklineData} />
                </div>
              </div>
            </div>

            {/* My Courses */}
            <div
              className="rounded-2xl border border-border bg-card/50 p-8 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
              style={{ animationDelay: "250ms" }}
            >
              <h3 className="text-lg font-bold text-foreground mb-6">
                My Courses
              </h3>
              <div className="space-y-4">
                {myCourses.map((course, idx) => (
                  <div
                    key={course.id}
                    className="group/course p-5 border border-border rounded-xl hover:border-primary/50 hover:bg-muted/30 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground group-hover/course:text-primary transition-colors duration-200">
                          {course.title}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>{course.students} students</span>
                          <span className="text-yellow-500 font-medium">
                            ★ {course.rating}
                          </span>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-primary">
                        {course.revenue}
                      </div>
                    </div>
                    <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${course.color} transition-all duration-300 group-hover/course:shadow-lg`}
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Student Feedback */}
            <div
              className="rounded-2xl border border-border bg-card/50 p-8 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
              style={{ animationDelay: "300ms" }}
            >
              <h3 className="text-lg font-bold text-foreground mb-6">
                Recent Student Feedback
              </h3>
              <ul className="space-y-4">
                {studentFeedback.map((feedback, idx) => (
                  <li
                    key={feedback.id}
                    className="p-4 rounded-lg border border-transparent hover:border-border hover:bg-muted/30 transition-all duration-200 group/feedback cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {feedback.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {feedback.date}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${
                              i < feedback.rating
                                ? "text-yellow-500"
                                : "text-muted"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-foreground group-hover/feedback:text-primary transition-colors duration-200">
                      "{feedback.comment}"
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right section: Sidebar panels */}
          <div className="space-y-8">
            {/* Upcoming Classes */}
            <div
              className="rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-sm animate-in fade-in slide-in-from-right-4 transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
              style={{ animationDelay: "200ms" }}
            >
              <h3 className="text-lg font-bold text-foreground mb-5">
                Upcoming Classes
              </h3>
              <ul className="space-y-3">
                {upcomingClasses.map((cls) => (
                  <li
                    key={cls.id}
                    className="p-3 rounded-lg border border-transparent hover:border-border hover:bg-muted/30 transition-all duration-200 cursor-pointer group/class"
                  >
                    <p className="text-sm font-medium text-foreground group-hover/class:text-primary transition-colors duration-200">
                      {cls.title}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-xs text-muted-foreground">
                        <p>
                          {cls.date} • {cls.time}
                        </p>
                        <p className="mt-1">{cls.students} students</p>
                      </div>
                      <div
                        className={`text-xs font-semibold px-2 py-1 rounded ${
                          cls.status === "confirmed"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {cls.status}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Earnings Summary */}
            <div
              className="rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-sm animate-in fade-in slide-in-from-right-4 transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
              style={{ animationDelay: "250ms" }}
            >
              <h3 className="text-lg font-bold text-foreground mb-5">
                Earnings Summary
              </h3>
              <div className="space-y-3">
                {[
                  { label: "This Month", amount: "$3,240", icon: "📊" },
                  { label: "Last Month", amount: "$2,840", icon: "📈" },
                  { label: "Total YTD", amount: "$28,560", icon: "💰" },
                  { label: "Pending Payout", amount: "$1,240", icon: "⏳" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{item.icon}</span>
                      <p className="text-sm text-muted-foreground">
                        {item.label}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {item.amount}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div
              className="rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-sm animate-in fade-in slide-in-from-right-4 transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
              style={{ animationDelay: "300ms" }}
            >
              <h3 className="text-lg font-bold text-foreground mb-5">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Grade Work", icon: Users },
                  { label: "Message Students", icon: Users },
                  { label: "Upload Materials", icon: BookOpen },
                  { label: "View Payouts", icon: DollarSign },
                ].map((action, idx) => {
                  const ActionIcon = action.icon;
                  return (
                    <button
                      key={idx}
                      className="px-4 py-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 text-xs font-medium text-foreground hover:text-primary flex items-center justify-center gap-2 group/btn"
                    >
                      <ActionIcon className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform duration-200" />
                      <span className="hidden sm:inline">{action.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes expandWidth {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </DashboardShell>
  );
}
