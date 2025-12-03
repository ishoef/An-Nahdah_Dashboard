"use client";

import { useState, useMemo } from "react";
import DashboardShell from "@/components/layout/DashobardShell";
import {
  Bell,
  Trash2,
  Check,
  X,
  Search,
  Users,
  DollarSign,
  Star,
  Settings,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Clean time-ago without any library
const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export default function InstructorNotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "student",
      title: "New Enrollment",
      message: "Aisha Khan joined Tajweed Fundamentals",
      time: new Date(Date.now() - 1000 * 60 * 12),
      read: false,
    },
    {
      id: 2,
      type: "payment",
      title: "Salary Credited",
      message: "$4,200 has been transferred to your account",
      time: new Date(Date.now() - 1000 * 60 * 50),
      read: false,
    },
    {
      id: 3,
      type: "feedback",
      title: "5-Star Review",
      message: "Fatima: 'Best teacher I've ever had!'",
      time: new Date(Date.now() - 1000 * 60 * 60 * 6),
      read: false,
    },
    {
      id: 4,
      type: "system",
      title: "Course Published",
      message: "Advanced Arabic Grammar is now live",
      time: new Date(Date.now() - 1000 * 60 * 60 * 24),
      read: true,
    },
    {
      id: 5,
      type: "student",
      title: "Assignment Submitted",
      message: "Omar submitted his final recitation",
      time: new Date(Date.now() - 1000 * 60 * 20),
      read: false,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      const matchesSearch =
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.message.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === "all" || n.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [notifications, searchTerm, filterType]);

  const markAsRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const deleteNotif = (id) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  const clearAll = () => {
    setNotifications([]);
    setShowClearConfirm(false);
  };

  const getIcon = (type) => {
    switch (type) {
      case "student":
        return <Users className="w-5 h-5" />;
      case "payment":
        return <DollarSign className="w-5 h-5" />;
      case "feedback":
        return <Star className="w-5 h-5" />;
      case "system":
        return <Settings className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  return (
    <DashboardShell>
      <div className="min-h-screen bg-gray-50/50 dark:bg-background">
        <div className=" mx-auto p-6 lg:p-10">
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-nhd-700 flex items-center justify-center shadow-lg">
                    <Bell className="w-7 h-7 text-white" />
                  </div>
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-foreground">
                    Notifications
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    {unreadCount > 0
                      ? `${unreadCount} unread`
                      : "All caught up"}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="px-5 py-2.5 text-nhd-700 hover:bg-nhd-700/10 rounded-xl font-medium transition flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Mark all read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="px-5 py-2.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-xl font-medium transition flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear all
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="mb-8 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-5 py-3.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-nhd-700/20 transition"
              />
            </div>

            <div className="flex gap-2">
              {["all", "student", "payment", "feedback", "system"].map(
                (type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium capitalize transition ${
                      filterType === type
                        ? "bg-nhd-700 text-white"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    {type === "all" ? "All" : type}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Notifications List - Clean Cards with Soft Shadow */}
          <div className="space-y-4">
            <AnimatePresence>
              {filtered.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20"
                >
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
                    <Bell className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-medium text-foreground">
                    No notifications
                  </h3>
                  <p className="text-muted-foreground mt-2">
                    You're all caught up!
                  </p>
                </motion.div>
              ) : (
                filtered.map((notif) => (
                  <motion.div
                    key={notif.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className={`group relative bg-card border ${
                      notif.read ? "border-border" : "border-nhd-700/30 border-l-5 border-l-nhd-700"
                    } rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300`}
                  >

                    <div className="flex items-start gap-5">
                      <div
                        className={`p-3 rounded-xl ${
                          notif.read ? "bg-muted" : "bg-nhd-700/10"
                        }`}
                      >
                        <div
                          className={
                            notif.read
                              ? "text-muted-foreground"
                              : "text-nhd-700"
                          }
                        >
                          {getIcon(notif.type)}
                        </div>
                      </div>

                      <div className="flex-1">
                        <h3
                          className={`font-semibold text-lg ${
                            notif.read
                              ? "text-muted-foreground"
                              : "text-foreground"
                          }`}
                        >
                          {notif.title}
                          {!notif.read && (
                            <span className="ml-3 inline-block px-2.5 py-0.5 bg-[#206380] text-white text-xs rounded-full font-medium">
                              New
                            </span>
                          )}
                        </h3>
                        <p className="mt-1.5 text-foreground/80">
                          {notif.message}
                        </p>
                        <p className="mt-3 text-sm text-muted-foreground">
                          {timeAgo(notif.time)}
                        </p>
                      </div>

                      {/* Hover Actions */}
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notif.read && (
                          <button
                            onClick={() => markAsRead(notif.id)}
                            className="p-2.5 hover:bg-[#206380]/10 rounded-lg transition"
                          >
                            <Check className="w-4.5 h-4.5 text-[#206380]" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotif(notif.id)}
                          className="p-2.5 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition"
                        >
                          <Trash2 className="w-4.5 h-4.5 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Clear All Modal */}
          <AnimatePresence>
            {showClearConfirm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
                onClick={() => setShowClearConfirm(false)}
              >
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.95 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-card rounded-2xl shadow-xl p-8 max-w-sm w-full border border-border"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center">
                      <Trash2 className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">
                      Clear all notifications?
                    </h3>
                    <p className="text-muted-foreground mb-8">
                      This action cannot be undone.
                    </p>
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => setShowClearConfirm(false)}
                        className="px-6 py-3 border border-border rounded-xl hover:bg-muted transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={clearAll}
                        className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardShell>
  );
}
