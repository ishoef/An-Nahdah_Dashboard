"use client";

import { useState, useEffect, useRef } from "react";
import DashboardShell from "@/components/layout/DashobardShell";
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Archive,
  Trash2,
  Search,
  Filter,
  MoreVertical,
  X,
  Inbox,
  Clock,
  AlertTriangle,
  Package,
  Users,
  DollarSign,
  Settings,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

const PRIMARY = "#206380";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "system",
      title: "System Update Completed",
      message: "Platform upgraded to v3.2.1 with performance improvements.",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      type: "enrollment",
      title: "New Student Enrolled",
      message: "Ahmed Khalid joined Tajweed Fundamentals",
      time: "4 hours ago",
      read: false,
    },
    {
      id: 3,
      type: "payment",
      title: "Instructor Payroll Processed",
      message: "December salaries sent to all instructors",
      time: "1 day ago",
      read: true,
    },
    {
      id: 4,
      type: "warning",
      title: "Low Enrollment Alert",
      message: "Islamic History Part 1 has only 12 students",
      time: "2 days ago",
      read: false,
    },
    {
      id: 5,
      type: "course",
      title: "New Lesson Published",
      message: "Lesson 8: Advanced Tajweed Rules is now live",
      time: "3 days ago",
      read: true,
    },
    {
      id: 6,
      type: "backup",
      title: "Daily Backup Complete",
      message: "All data successfully backed up at 02:00 AM",
      time: "4 days ago",
      read: true,
    },
    {
      id: 7,
      type: "warning",
      title: "High Server Load",
      message: "CPU usage exceeded 90% for 10 minutes",
      time: "5 days ago",
      read: false,
    },
  ]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all, unread, system, enrollment, payment, warning
  const [selected, setSelected] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const undoRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = notifications
    .filter((n) => {
      if (filter === "unread") return !n.read;
      if (filter !== "all" && filter !== "unread") return n.type === filter;
      return true;
    })
    .filter(
      (n) =>
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.message.toLowerCase().includes(search.toLowerCase())
    );

  const visibleNotifications = filtered.slice(0, visibleCount);

  const getIcon = (type) => {
    const map = {
      system: <RefreshCw className="w-5 h-5" />,
      enrollment: <Users className="w-5 h-5" />,
      payment: <DollarSign className="w-5 h-5" />,
      warning: <AlertTriangle className="w-5 h-5" />,
      course: <Package className="w-5 h-5" />,
      backup: <Archive className="w-5 h-5" />,
    };
    return map[type] || <Bell className="w-5 h-5" />;
  };

  const getColor = (type) => {
    const colors = {
      system: "from-blue-500 to-cyan-500",
      enrollment: "from-emerald-500 to-teal-500",
      payment: "from-green-500 to-emerald-500",
      warning: "from-orange-500 to-red-500",
      course: "from-purple-500 to-indigo-500",
      backup: "from-gray-500 to-slate-500",
    };
    return colors[type] || "from-blue-500 to-indigo-500";
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = (id) => {
    const notif = notifications.find((n) => n.id === id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    showUndo("Notification deleted", () => {
      setNotifications((prev) => [...prev, notif]);
    });
  };

  const bulkDelete = () => {
    const removed = notifications.filter((n) => selected.includes(n.id));
    setNotifications((prev) => prev.filter((n) => !selected.includes(n.id)));
    setSelected([]);
    showUndo(`${removed.length} notifications deleted`, () => {
      setNotifications((prev) => [...removed, ...prev]);
    });
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const showUndo = (message, action) => {
    if (undoRef.current) toast.dismiss(undoRef.current);
    undoRef.current = toast(
      <div className="flex items-center gap-4">
        <span>{message}</span>
        <button
          onClick={() => {
            action();
            toast.dismiss(undoRef.current);
          }}
          className="px-3 py-1 bg-white text-black rounded text-sm font-medium"
        >
          Undo
        </button>
      </div>,
      { duration: 5000, position: "bottom-right" }
    );
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAllVisible = () => {
    const visibleIds = visibleNotifications.map((n) => n.id);
    setSelected((prev) =>
      prev.length === visibleIds.length ? [] : visibleIds
    );
  };

  return (
    <DashboardShell>
      <Toaster position="bottom-right" />
      <div className="min-h-screen p-6 md:p-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground flex items-center gap-4">
                <Bell className="w-10 h-10 text-[#206380]" />
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-3 px-3 py-1 bg-gradient-to-r from-[#206380] to-[#1b5666] text-white text-sm font-bold rounded-full">
                    {unreadCount} Unread
                  </span>
                )}
              </h1>
              <p className="text-muted-foreground mt-3 text-lg">
                Stay updated with system alerts, enrollments, payments, and more
              </p>
            </div>
            <button
              onClick={markAllRead}
              className="px-6 py-3 bg-gradient-to-r from-[#206380] to-[#1b5666] text-white rounded-xl font-medium flex items-center gap-3 hover:shadow-lg transition"
            >
              <CheckCircle2 className="w-5 h-5" />
              Mark All Read
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main List */}
          <div className="xl:col-span-3 space-y-6">
            {/* Search & Filters */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col md:flex-row gap-4"
            >
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search notifications..."
                  className="pl-12 pr-5 py-4 w-full rounded-xl border bg-card focus:ring-2 focus:ring-[#206380]/50 transition"
                />
              </div>
              <div className="flex gap-3">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-5 py-4 rounded-xl border bg-card"
                >
                  <option value="all">All Notifications</option>
                  <option value="unread">Unread Only</option>
                  <option value="system">System</option>
                  <option value="enrollment">Enrollments</option>
                  <option value="payment">Payments</option>
                  <option value="warning">Warnings</option>
                </select>
              </div>
            </motion.div>

            {/* Selection Toolbar */}
            {selected.length > 0 && (
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="p-5 bg-card border rounded-xl flex items-center justify-between shadow-sm"
              >
                <span className="font-medium">{selected.length} selected</span>
                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      setNotifications((prev) =>
                        prev.map((n) =>
                          selected.includes(n.id) ? { ...n, read: true } : n
                        )
                      )
                    }
                    className="px-5 py-2 bg-emerald-600 text-white rounded-lg text-sm"
                  >
                    Mark Read
                  </button>
                  <button
                    onClick={bulkDelete}
                    className="px-5 py-2 bg-rose-600 text-white rounded-lg text-sm"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            )}

            {/* Notifications List */}
            <div className="space-y-5">
              <AnimatePresence>
                {visibleNotifications.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20 bg-card border-2 border-dashed border-border rounded-2xl"
                  >
                    <Inbox className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-xl font-medium text-muted-foreground">
                      No notifications
                    </p>
                    <p className="text-muted-foreground mt-2">
                      You're all caught up!
                    </p>
                  </motion.div>
                ) : (
                  visibleNotifications.map((notif, i) => (
                    <motion.article
                      key={notif.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: i * 0.05 }}
                      className={`group relative bg-card border rounded-2xl p-6 hover:shadow-xl transition-all ${
                        !notif.read ? "ring-2 ring-[#206380]/20" : ""
                      }`}
                    >
                      <div className="flex gap-5">
                        {/* Checkbox + Icon */}
                        <div className="flex flex-col items-center gap-4">
                          <input
                            type="checkbox"
                            checked={selected.includes(notif.id)}
                            onChange={() => toggleSelect(notif.id)}
                            className="w-5 h-5 rounded border-2 accent-[#206380]"
                          />
                          <div
                            className={`p-3 rounded-xl bg-gradient-to-br ${getColor(
                              notif.type
                            )} text-white shadow-lg`}
                          >
                            {getIcon(notif.type)}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3
                                className={`font-bold text-lg ${
                                  !notif.read
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {notif.title}
                                {!notif.read && (
                                  <span className="ml-3 inline-block w-2 h-2 bg-[#206380] rounded-full"></span>
                                )}
                              </h3>
                              <p className="text-muted-foreground mt-2 leading-relaxed">
                                {notif.message}
                              </p>
                              <p className="text-sm text-muted-foreground/70 mt-3 flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {notif.time}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                          {!notif.read && (
                            <button
                              onClick={() => markAsRead(notif.id)}
                              className="p-3 hover:bg-muted rounded-xl"
                            >
                              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notif.id)}
                            className="p-3 hover:bg-rose-100 rounded-xl"
                          >
                            <Trash2 className="w-5 h-5 text-rose-600" />
                          </button>
                        </div>
                      </div>
                    </motion.article>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Load More */}
            {visibleCount < filtered.length && (
              <div className="text-center mt-10">
                <button
                  onClick={() =>
                    setVisibleCount((prev) =>
                      Math.min(prev + 6, filtered.length)
                    )
                  }
                  className="px-8 py-4 bg-gradient-to-r from-[#206380] to-[#1b5666] text-white rounded-xl font-medium hover:shadow-lg transition"
                >
                  Load More Notifications
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-gradient-to-br from-[#206380] to-[#1b5666] rounded-2xl p-8 text-white shadow-xl">
              <h3 className="text-2xl font-bold mb-6">Notification Summary</h3>
              <div className="space-y-5">
                <div className="flex justify-between text-lg">
                  <span>Total</span>
                  <span className="font-bold text-3xl">
                    {notifications.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Unread</span>
                  <span className="font-bold text-3xl">{unreadCount}</span>
                </div>
                <div className="pt-5 border-t border-white/20">
                  <p className="text-sm opacity-90">Last activity: Just now</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card border rounded-2xl p-6 shadow-lg">
              <h3 className="font-bold text-lg mb-5">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={markAllRead}
                  className="w-full py-4 bg-gradient-to-r from-[#206380] to-[#1b5666] text-white rounded-xl font-medium"
                >
                  Mark All as Read
                </button>
                <button className="w-full py-4 border border-border rounded-xl hover:bg-muted transition">
                  Notification Settings
                </button>
              </div>
            </div>

            {/* Filter by Type */}
            <div className="bg-card border rounded-2xl p-6 shadow-lg">
              <h3 className="font-bold text-lg mb-5">Filter by Type</h3>
              <div className="space-y-3">
                {[
                  "all",
                  "unread",
                  "system",
                  "enrollment",
                  "payment",
                  "warning",
                ].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`w-full text-left px-5 py-3 rounded-xl transition ${
                      filter === f
                        ? "bg-[#206380]/10 border border-[#206380]"
                        : "hover:bg-muted"
                    }`}
                  >
                    <span className="capitalize">
                      {f === "all"
                        ? "All Notifications"
                        : f === "unread"
                        ? "Unread Only"
                        : f}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
