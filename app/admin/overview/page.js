"use client";

import { useState, useEffect } from "react";
import DashboardShell from "@/components/layout/DashobardShell";
import {
  BarChart3,
  Users,
  BookOpen,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Zap,
} from "lucide-react";

const stats = [
  {
    id: 1,
    title: "Students",
    value: "1,243",
    delta: "+4.2%",
    trend: "up",
    icon: Users,
    color: "from-blue-500 to-blue-600",
    lightColor: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    id: 2,
    title: "Courses",
    value: "86",
    delta: "+1",
    trend: "up",
    icon: BookOpen,
    color: "from-emerald-500 to-emerald-600",
    lightColor: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  {
    id: 3,
    title: "Revenue",
    value: "$18,420",
    delta: "+8.6%",
    trend: "up",
    icon: DollarSign,
    color: "from-violet-500 to-violet-600",
    lightColor: "bg-violet-100 dark:bg-violet-900/30",
  },
  {
    id: 4,
    title: "Instructors",
    value: "12",
    delta: "+2",
    trend: "up",
    icon: BarChart3,
    color: "from-amber-500 to-amber-600",
    lightColor: "bg-amber-100 dark:bg-amber-900/30",
  },
];

const sparklineData = [3, 5, 8, 6, 10, 9, 12, 9, 13, 15, 12, 14];

const recentActivity = [
  {
    id: 1,
    text: "New student registered: Ahmed Ali",
    time: "2h ago",
    icon: Users,
    type: "student",
  },
  {
    id: 2,
    text: "Course 'Tajweed Basics' published",
    time: "yesterday",
    icon: BookOpen,
    type: "course",
  },
  {
    id: 3,
    text: "Payment received — $49 (Zain)",
    time: "2 days ago",
    icon: DollarSign,
    type: "payment",
  },
  {
    id: 4,
    text: "Instructor: Dr. Hassan added a class",
    time: "3 days ago",
    icon: Users,
    type: "instructor",
  },
];

const topCourses = [
  {
    id: 1,
    title: "Tajweed Essentials",
    students: 420,
    progress: 72,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    title: "Intro to Fiqh",
    students: 280,
    progress: 46,
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: 3,
    title: "Arabic Grammar (Nahw)",
    students: 360,
    progress: 59,
    color: "from-violet-500 to-purple-500",
  },
];

const users = [
  {
    id: 1,
    name: "Aisha Khan",
    email: "aisha@example.com",
    role: "Student",
    avatar: "AK",
  },
  {
    id: 2,
    name: "Zain Malik",
    email: "zain@example.com",
    role: "Student",
    avatar: "ZM",
  },
  {
    id: 3,
    name: "Dr. Hassan",
    email: "hassan@example.com",
    role: "Instructor",
    avatar: "DH",
  },
];

function StatCard({ stat, index }) {
  const Icon = stat.icon;

  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-border bg-card/50 p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:-translate-y-1 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

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
          className={`w-14 h-14 rounded-xl bg-linear-to-br ${stat.color} flex items-center justify-center text-white shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300`}
        >
          <Icon className="w-7 h-7" />
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        className={`absolute bottom-0 left-0 h-1 bg-linear-to-r ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
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
      {/* Gradient fill */}
      <defs>
        <linearGradient id="sparkGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Filled area */}
      <polyline
        fill="url(#sparkGradient)"
        points={`0,${h} ${points} ${w},${h}`}
      />

      {/* Line stroke */}
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

export default function OverviewPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <DashboardShell>
      <div className="min-h-screen bg-linear-to-br from-background via-background to-background/80 p-8">
        {/* Header with animation */}
        <div className="mb-10 space-y-2 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-linear-to-br from-primary/20 to-primary/10">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground tracking-tight">
                  Overview
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Welcome back,{" "}
                  <span className="font-semibold text-foreground">
                    Administrator
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="px-6 py-2.5 bg-linear-to-r from-primary to-primary/90 text-primary-foreground rounded-lg font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2">
                <Zap className="w-4 h-4" />+ New Course
              </button>
              <button className="px-6 py-2.5 border border-border rounded-lg hover:bg-accent transition-all duration-200 font-medium">
                Export
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
          {/* Left section: Charts and activities */}
          <div className="lg:col-span-2 space-y-8">
            {/* Enrollments Chart */}
            <div
              className="group relative overflow-hidden rounded-2xl border border-border bg-card/50 p-8 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
              style={{ animationDelay: "200ms" }}
            >
              <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                      Enrollments (30 days)
                    </p>
                    <h2 className="text-2xl font-bold text-foreground mt-2">
                      +1,120
                    </h2>
                  </div>
                  <div className="text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-lg font-medium">
                    This month
                  </div>
                </div>

                <div className="mt-6 transform group-hover:scale-105 transition-transform duration-300">
                  <Sparkline data={sparklineData} />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div
              className="rounded-2xl border border-border bg-card/50 p-8 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
              style={{ animationDelay: "250ms" }}
            >
              <h3 className="text-lg font-bold text-foreground mb-6">
                Recent Activity
              </h3>
              <ul className="space-y-4">
                {recentActivity.map((activity, idx) => {
                  const ActivityIcon = activity.icon;
                  return (
                    <li
                      key={activity.id}
                      className="flex items-start justify-between p-4 rounded-lg border border-transparent hover:border-border hover:bg-muted/30 transition-all duration-200 group/item cursor-pointer"
                      style={{ animationDelay: `${300 + idx * 50}ms` }}
                    >
                      <div className="flex items-start gap-4 flex-1">
                        <div className="p-2 rounded-lg bg-muted/50 group-hover/item:bg-primary/10 transition-colors duration-200">
                          <ActivityIcon className="w-4 h-4 text-muted-foreground group-hover/item:text-primary transition-colors duration-200" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">
                            {activity.text}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                      <button className="text-xs px-3 py-1.5 rounded-md border border-border hover:bg-primary hover:text-primary-foreground transition-all duration-200 whitespace-nowrap">
                        View
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Top Courses */}
            <div
              className="rounded-2xl border border-border bg-card/50 p-8 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
              style={{ animationDelay: "300ms" }}
            >
              <h3 className="text-lg font-bold text-foreground mb-6">
                Top Courses
              </h3>
              <div className="space-y-4">
                {topCourses.map((course, idx) => (
                  <div
                    key={course.id}
                    className="group/course p-5 border border-border rounded-xl hover:border-primary/50 hover:bg-muted/30 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground group-hover/course:text-primary transition-colors duration-200">
                          {course.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {course.students} students
                        </p>
                      </div>
                      <div className="text-lg font-bold text-primary">
                        {course.progress}%
                      </div>
                    </div>
                    <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-linear-to-r ${course.color} transition-all duration-300 group-hover/course:shadow-lg`}
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
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
              <ul className="space-y-4">
                {[
                  {
                    title: "Tajweed: Lesson 5",
                    instructor: "Dr. Hassan",
                    date: "Dec 5, 2025 • 10:00 AM",
                    type: "Online",
                  },
                  {
                    title: "Arabic Grammar Q&A",
                    instructor: "Ms. Amina",
                    date: "Dec 7, 2025 • 3:00 PM",
                    type: "In-person",
                  },
                ].map((item, idx) => (
                  <li
                    key={idx}
                    className="p-3 rounded-lg border border-transparent hover:border-border hover:bg-muted/30 transition-all duration-200 cursor-pointer group/class"
                  >
                    <p className="text-sm font-medium text-foreground group-hover/class:text-primary transition-colors duration-200">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.instructor} — {item.date}
                    </p>
                    <p className="text-xs text-primary mt-2 font-medium">
                      {item.type}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Active Users */}
            <div
              className="rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-sm animate-in fade-in slide-in-from-right-4 transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
              style={{ animationDelay: "250ms" }}
            >
              <h3 className="text-lg font-bold text-foreground mb-5">
                Active Users
              </h3>
              <div className="space-y-4">
                {users.map((user, idx) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-all duration-200 cursor-pointer group/user"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-primary">
                          {user.avatar}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded whitespace-nowrap ml-2 group-hover/user:bg-primary/10 group-hover/user:text-primary transition-all duration-200">
                      {user.role}
                    </div>
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
                  { label: "Add Student", icon: Users },
                  { label: "Add Instructor", icon: Users },
                  { label: "Create Course", icon: BookOpen },
                  { label: "Manage Payments", icon: DollarSign },
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
