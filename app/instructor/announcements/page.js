"use client";

import { useState } from "react";
import DashboardShell from "@/components/layout/DashobardShell";
import { Calendar, User } from "lucide-react";

export default function InstructorAnnouncementsPage() {
  const [announcements] = useState([
    {
      id: 1,
      title: "New Course Launch: Advanced Tajweed",
      content:
        "We're excited to announce the launch of our new Advanced Tajweed course starting next month. Early registrations are now open for all instructors.",
      author: "Admin",
      date: "Jan 5, 2025",
    },
    {
      id: 2,
      title: "System Maintenance Scheduled",
      content:
        "The academy system will undergo maintenance on January 10, 2025 from 2 AM to 4 AM UTC. Please plan accordingly.",
      author: "System Admin",
      date: "Jan 3, 2025",
    },
    {
      id: 3,
      title: "Congratulations to Our Top Students",
      content:
        "We celebrate the outstanding achievements of our top-performing students this semester. Special recognition to all dedicated instructors!",
      author: "Admin",
      date: "Dec 28, 2024",
    },
  ]);

  return (
    <DashboardShell>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 p-8">
        {/* Header */}
        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <h1 className="text-4xl font-bold text-foreground tracking-tight">
            Announcements
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Academy announcements and important updates
          </p>
        </div>

        {/* Announcements List */}
        <div className="max-w-3xl space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {announcements.map((announcement, idx) => (
            <div
              key={announcement.id}
              className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300"
              style={{ animationDelay: `${idx * 30}ms` }}
            >
              <h3 className="text-lg font-semibold text-foreground">
                {announcement.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
