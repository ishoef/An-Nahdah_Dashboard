"use client";

import { useState } from "react";
import DashboardShell from "@/components/layout/DashobardShell";
import {
  Bell,
  Trash2,
  Archive,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
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
  ]);

  const handleDelete = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const handleArchive = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

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

  return (
    <DashboardShell>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 p-8">
        {/* Header */}
        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <h1 className="text-4xl font-bold text-foreground tracking-tight">
            Notifications
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            System and activity notifications
          </p>
        </div>

        {/* Notifications List */}
        <div className="max-w-3xl space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {notifications.map((notif, idx) => (
            <div
              key={notif.id}
              className={`rounded-xl border transition-all duration-300 p-4 group/notif ${
                notif.read
                  ? "border-border bg-card/30 hover:bg-card/50"
                  : "border-primary/20 bg-primary/5 hover:bg-primary/10"
              }`}
              style={{ animationDelay: `${idx * 30}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 mt-1">{getIcon(notif.type)}</div>

                <div className="flex-1 min-w-0">
                  <h3
                    className={`font-semibold ${
                      notif.read ? "text-muted-foreground" : "text-foreground"
                    }`}
                  >
                    {notif.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {notif.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {notif.timestamp}
                  </p>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover/notif:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => handleArchive(notif.id)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors duration-200"
                    title="Mark as read"
                  >
                    <Archive className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => handleDelete(notif.id)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors duration-200"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-muted-foreground hover:text-red-500" />
                  </button>
                  <button
                    className="p-2 hover:bg-muted rounded-lg transition-colors duration-200"
                    title="More"
                  >
                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
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
