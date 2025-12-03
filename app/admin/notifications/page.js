"use client";

import { useState, useEffect, useRef } from "react";
import DashboardShell from "@/components/layout/DashobardShell";
import {
  AlertCircle,
  Archive,
  ArrowBigDown,
  Bell,
  CheckCircle2,
  EyeOff,
  MoreVertical,
  SearchIcon,
  Trash2,
  
} from "lucide-react";

/**
 * NotificationsPage (enhanced)
 *
 * Added: search, tabs, bulk actions, mark all read, clear read, undo delete,
 * pagination (load more), unread counter, empty state.
 *
 * Keep styles and animations aligned with your original design.
 */

export default function NotificationsPage() {
  // initial data (same as before)
  const initial = [
    {
      id: 1,
      type: "system",
      title: "System Update Completed",
      message: "The academy system has been updated successfully.",
      timestamp: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      type: "course",
      title: "New Student Enrollment",
      message: "Ahmed has enrolled in Tajweed Fundamentals course.",
      timestamp: "4 hours ago",
      read: false,
    },
    {
      id: 3,
      type: "payment",
      title: "Payment Processed",
      message: "Monthly salaries have been processed successfully.",
      timestamp: "1 day ago",
      read: true,
    },
    {
      id: 4,
      type: "warning",
      title: "Low Course Enrollment",
      message: "Islamic History Part 1 has low enrollment rates.",
      timestamp: "2 days ago",
      read: true,
    },
    // add more sample items to better demo pagination
    {
      id: 5,
      type: "course",
      title: "New Lesson Published",
      message: "Lesson 6 for Tajweed has been published.",
      timestamp: "3 days ago",
      read: false,
    },
    {
      id: 6,
      type: "system",
      title: "Backup Completed",
      message: "Daily backup finished without errors.",
      timestamp: "4 days ago",
      read: true,
    },
    {
      id: 7,
      type: "warning",
      title: "Server CPU High",
      message: "CPU utilization spiked above threshold.",
      timestamp: "5 days ago",
      read: false,
    },
  ];

  const [notifications, setNotifications] = useState(initial);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("all"); // all, unread, read
  const [selected, setSelected] = useState([]); // ids
  const [pageSize, setPageSize] = useState(5);
  const [undoStack, setUndoStack] = useState(null); // { action, data, timeoutId }
  const undoTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // filters
  const filtered = notifications
    .filter((n) => {
      if (tab === "unread") return !n.read;
      if (tab === "read") return n.read;
      return true;
    })
    .filter((n) => {
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q)
      );
    });

  const page = filtered.slice(0, pageSize);

  // icons
  const getIcon = (type) => {
    switch (type) {
      case "system":
        return <CheckCircle2 className="w-5 h-5 text-blue-600" />;
      case "course":
        return <AlertCircle className="w-5 h-5 text-purple-600" />;
      case "payment":
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      default:
        return <Bell className="w-5 h-5 text-primary" />;
    }
  };

  // basic actions
  const handleDelete = (id) => {
    const removed = notifications.find((n) => n.id === id);
    const remaining = notifications.filter((n) => n.id !== id);
    setNotifications(remaining);

    pushUndo({
      action: "delete",
      data: removed,
    });
  };

  const handleArchive = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // bulk actions
  const toggleSelect = (id) =>
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
    );

  const selectAllOnPage = () => setSelected(page.map((p) => p.id));

  const clearSelection = () => setSelected([]);

  const bulkDelete = () => {
    if (selected.length === 0) return;
    const removed = notifications.filter((n) => selected.includes(n.id));
    const remaining = notifications.filter((n) => !selected.includes(n.id));
    setNotifications(remaining);
    setSelected([]);
    pushUndo({ action: "bulkDelete", data: removed });
  };

  const bulkMarkRead = () => {
    if (selected.length === 0) return;
    setNotifications(
      notifications.map((n) =>
        selected.includes(n.id) ? { ...n, read: true } : n
      )
    );
    setSelected([]);
  };

  // helper: mark all read
  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const clearAllRead = () =>
    setNotifications((prev) => prev.filter((n) => !n.read));

  // pagination
  const loadMore = () => setPageSize((s) => s + 5);

  // undo mechanism
  const pushUndo = (payload) => {
    // clear previous timer
    if (undoTimerRef.current) {
      clearTimeout(undoTimerRef.current);
      setUndoStack(null);
    }

    // show undo for 6s
    const timeoutId = setTimeout(() => {
      setUndoStack(null);
      undoTimerRef.current = null;
    }, 6000);

    undoTimerRef.current = timeoutId;
    setUndoStack({ ...payload, timeoutId });
  };

  const handleUndo = () => {
    if (!undoStack) return;
    if (undoTimerRef.current) {
      clearTimeout(undoTimerRef.current);
      undoTimerRef.current = null;
    }

    if (undoStack.action === "delete") {
      setNotifications((prev) => [undoStack.data, ...prev]);
    } else if (undoStack.action === "bulkDelete") {
      setNotifications((prev) => [...undoStack.data, ...prev]);
    }

    setUndoStack(null);
  };

  // small helpers for UI
  const isSelected = (id) => selected.includes(id);

  return (
    <DashboardShell>
      <div className="min-h-screen p-6 md:p-8">
        <div className=" mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* ========== LEFT (Main) - spans 3 cols on lg ========== */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="flex items-center gap-3 text-2xl md:text-3xl font-semibold text-foreground">
                  <Bell className="w-6 h-6 text-primary" />
                  Notifications
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {unreadCount} unread
                  </span>
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  System and activity alerts — quick actions available on hover.
                </p>
              </div>

              {/* compact toolbar */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search notifications..."
                    className="pl-10 pr-3 py-2 rounded-lg border border-border bg-card text-sm w-56 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    aria-label="Search notifications"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <SearchIcon className="w-4 h-4" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={markAllRead}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-primary text-white text-sm shadow-sm hover:brightness-95"
                    title="Mark all as read"
                  >
                    <ArrowBigDown className="w-4 h-4" />
                    Mark all
                  </button>

                  <button
                    onClick={clearAllRead}
                    className="px-3 py-2 rounded-md border border-border text-sm hover:bg-muted"
                    title="Clear read"
                  >
                    Clear read
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs (segmented control) */}
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="inline-flex bg-card rounded-md p-1 border border-border">
                {["all", "unread", "read"].map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setTab(t);
                      setSelected([]);
                    }}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                      tab === t
                        ? "bg-primary text-white shadow-sm"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                    aria-pressed={tab === t}
                  >
                    {t === "all" ? "All" : t === "unread" ? "Unread" : "Read"}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-muted-foreground select-none">
                  <input
                    type="checkbox"
                    checked={
                      page.length > 0 &&
                      page.every((p) => selected.includes(p.id))
                    }
                    onChange={(e) => {
                      if (e.target.checked) selectAllOnPage();
                      else clearSelection();
                    }}
                    className="w-4 h-4"
                    title="Select all on page"
                  />
                  Select
                </label>

                <div className="flex items-center gap-2">
                  <button
                    onClick={bulkMarkRead}
                    className="px-3 py-1 rounded-md border border-border text-sm hover:bg-muted"
                    title="Mark selected as read"
                  >
                    Mark
                  </button>

                  <button
                    onClick={bulkDelete}
                    className="px-3 py-1 rounded-md border border-border text-sm text-red-600 hover:bg-red-50"
                    title="Delete selected"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>

            {/* List */}
            <div className="space-y-3">
              {page.length === 0 ? (
                <div className="rounded-xl border border-border p-8 text-center bg-card">
                  <p className="text-lg font-semibold text-muted-foreground">
                    No notifications
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Try removing filters or check a different tab.
                  </p>
                </div>
              ) : (
                page.map((notif, idx) => (
                  <article
                    key={notif.id}
                    className={`group flex items-start gap-4 rounded-lg p-4 transition-shadow border ${
                      notif.read
                        ? "bg-card/50 border-border hover:shadow-sm"
                        : "bg-card/50 border-primary/20 hover:bg-primary/10"
                    }`}
                    style={{ animationDelay: `${idx * 30}ms` }}
                    aria-labelledby={`notif-${notif.id}`}
                  >
                    {/* checkbox + icon */}
                    <div className="flex flex-col items-start gap-2 mt-1">
                      <input
                        checked={isSelected(notif.id)}
                        onChange={() => toggleSelect(notif.id)}
                        type="checkbox"
                        className="w-4 h-4"
                        aria-label={`Select notification ${notif.title}`}
                      />
                      <div className="mt-2">{getIcon(notif.type)}</div>
                    </div>

                    {/* main content */}
                    <div className="flex-1 min-w-0">
                      <h3
                        id={`notif-${notif.id}`}
                        className={`truncate font-medium ${
                          notif.read
                            ? "text-muted-foreground"
                            : "text-foreground"
                        }`}
                      >
                        {notif.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground truncate">
                        {notif.message}
                      </p>

                      <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                        <time>{notif.timestamp}</time>
                        {!notif.read && (
                          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
                            unread
                          </span>
                        )}
                      </div>
                    </div>

                    {/* actions (hidden until hover) */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleMarkRead(notif.id)}
                          className="p-2 rounded-md hover:bg-muted"
                          title="Mark as read"
                        >
                          <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => handleArchive(notif.id)}
                          className="p-2 rounded-md hover:bg-muted"
                          title="Archive"
                        >
                          <Archive className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => handleDelete(notif.id)}
                          className="p-2 rounded-md hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-muted-foreground hover:text-red-500" />
                        </button>
                      </div>

                      <button
                        className="text-xs text-muted-foreground"
                        title="More"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>

            {/* Load more */}
            {filtered.length > page.length && (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={loadMore}
                  className="px-4 py-2 rounded-md border border-border hover:bg-muted"
                >
                  Load more
                </button>
              </div>
            )}

            {/* Undo toast */}
            {undoStack && (
              <div className="fixed bottom-6 right-6 bg-card border border-border rounded-lg p-3 flex items-center gap-4 shadow-lg">
                <div>
                  <p className="text-sm font-medium">Action performed</p>
                  <p className="text-xs text-muted-foreground">
                    You can undo this action for a few seconds.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleUndo}
                    className="px-3 py-1 bg-primary text-white rounded-md text-sm"
                  >
                    Undo
                  </button>
                  <button
                    onClick={() => {
                      if (undoTimerRef.current) {
                        clearTimeout(undoTimerRef.current);
                        undoTimerRef.current = null;
                      }
                      setUndoStack(null);
                    }}
                    className="p-2 rounded-md hover:bg-muted"
                    title="Dismiss"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ========== RIGHT (Sidebar) - sticky and compact ========== */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 space-y-4">
              {/* Filters card */}
              <div className="bg-card border border-border rounded-lg p-4">
                <h4 className="text-sm font-medium mb-3">Filters</h4>

                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 text-sm text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={tab === "unread"}
                      onChange={() => {
                        setTab(tab === "unread" ? "all" : "unread");
                        setSelected([]);
                      }}
                      className="w-4 h-4"
                    />
                    Unread only
                  </label>

                  <select
                    value={"" /* wire to state if needed */}
                    onChange={() => {}}
                    className="text-sm rounded-md border border-border py-1 px-2 bg-transparent"
                  >
                    <option value="">All types</option>
                    <option value="system">System</option>
                    <option value="course">Course</option>
                    <option value="payment">Payment</option>
                  </select>

                  <input
                    type="date"
                    onChange={() => {}}
                    className="text-sm rounded-md border border-border py-1 px-2 bg-transparent"
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="bg-card border border-border rounded-lg p-4">
                <h4 className="text-sm font-medium mb-3">Summary</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-white/5 rounded-md">
                    <div className="text-xs text-muted-foreground">On page</div>
                    <div className="text-lg font-semibold">{page.length}</div>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded-md">
                    <div className="text-xs text-muted-foreground">Unread</div>
                    <div className="text-lg font-semibold">{unreadCount}</div>
                  </div>
                </div>
                <div className="mt-3 text-xs text-muted-foreground">
                  Updated: Just now
                </div>
              </div>

              {/* Quick actions */}
              <div className="bg-card border border-border rounded-lg p-4">
                <h4 className="text-sm font-medium mb-3">Quick actions</h4>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setSelected(page.map((p) => p.id))}
                    className="w-full px-3 py-2 rounded-md border border-border text-sm hover:bg-muted"
                  >
                    Select page
                  </button>
                  <button
                    onClick={markAllRead}
                    className="w-full px-3 py-2 rounded-md bg-primary text-white text-sm"
                  >
                    Mark all read
                  </button>
                  <button
                    onClick={() => {}}
                    className="w-full px-3 py-2 rounded-md border border-border text-sm hover:bg-muted"
                  >
                    Settings
                  </button>
                </div>
              </div>

              {/* Recent activity */}
              <div className="bg-card border border-border rounded-lg p-4">
                <h4 className="text-sm font-medium mb-3">Recent</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-primary mt-1" />
                    New course published — 2h
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-amber-400 mt-1" />
                    Payout processed — 1d
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1" />
                    14 students enrolled — 3d
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </DashboardShell>
  );
}
