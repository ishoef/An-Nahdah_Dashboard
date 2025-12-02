"use client";

import { useState } from "react";
import DashboardShell from "@/components/layout/DashobardShell";
import {
  Plus,
  Trash2,
  Edit2,
  MoreVertical,
  Calendar,
  User,
} from "lucide-react";

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: "New Course Launch: Advanced Tajweed",
      content:
        "We're excited to announce the launch of our new Advanced Tajweed course starting next month.",
      author: "Admin",
      date: "Jan 5, 2025",
      status: "published",
    },
    {
      id: 2,
      title: "System Maintenance Scheduled",
      content:
        "The academy system will undergo maintenance on January 10, 2025 from 2 AM to 4 AM.",
      author: "System Admin",
      date: "Jan 3, 2025",
      status: "published",
    },
    {
      id: 3,
      title: "Congratulations to Our Top Students",
      content:
        "We celebrate the outstanding achievements of our top-performing students this semester.",
      author: "Admin",
      date: "Dec 28, 2024",
      status: "published",
    },
  ]);

  const handleDelete = (id) => {
    setAnnouncements(announcements.filter((a) => a.id !== id));
  };

  return (
    <DashboardShell>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 p-8">
        {/* Header */}
        <div className="mb-8 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground tracking-tight">
                Announcements
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                Create and manage academy announcements
              </p>
            </div>

            <button className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-lg font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Announcement
            </button>
          </div>
        </div>

        {/* Announcements List */}
        <div className="max-w-3xl space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {announcements.map((announcement, idx) => (
            <div
              key={announcement.id}
              className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300 group/announce"
              style={{ animationDelay: `${idx * 30}ms` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-foreground group-hover/announce:text-primary transition-colors duration-200">
                    {announcement.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {announcement.content}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="w-4 h-4" />
                      <span>{announcement.author}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{announcement.date}</span>
                    </div>
                    <span className="ml-auto inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      {announcement.status.charAt(0).toUpperCase() +
                        announcement.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-center gap-2 opacity-0 group-hover/announce:opacity-100 transition-opacity duration-200">
                  <button
                    className="p-2 rounded-lg hover:bg-muted transition-colors duration-200"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                  </button>
                  <button
                    onClick={() => handleDelete(announcement.id)}
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
      </div>
    </DashboardShell>
  );
}
