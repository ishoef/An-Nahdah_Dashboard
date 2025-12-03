"use client";

import React, { useEffect, useState } from "react";
import { Search, Bell, Settings, ChevronDown } from "lucide-react";

import { Input } from "@/components/ui/input";
import ThemeToggle from "../ui/Theme-Toggle";
import ProfileDrawer from "./ProfileDrawer";

// NOTE: using explicit classes (both states are present in code) so Tailwind won't purge them.
// Also we conditionally render the drawer container (render only when open) to avoid any invisible overlay blocking clicks.

export default function TopBar({
  user = {
    name: "Dr. Hassan Al-Rashid",
    role: "Administrator",
    email: "hassan@example.com",
    phone: "+20 100 000 0000",
    avatarUrl: null,
    bio: "Profile bio or short description goes here.",
    stats: {
      students: 1280,
      courses: 24,
      messages: 14,
    },
  },
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // small debug so you can see in console whether click toggles state
  useEffect(() => {
    console.debug("Profile drawer open:", isDrawerOpen);
  }, [isDrawerOpen]);

  return (
    <>
      <header className="fixed right-0 top-0 left-80 h-16 bg-card border-b border-border flex items-center justify-between px-6 z-30">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search students, courses, instructors..."
              className="pl-10 bg-muted border-transparent text-sm"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4 ml-6">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-muted transition-colors duration-200">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
          </button>

          {/* Settings */}
          <button className="p-2 rounded-lg hover:bg-muted transition-colors duration-200">
            <Settings className="w-5 h-5 text-muted-foreground" />
          </button>

          {/* User Profile */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            aria-expanded={isDrawerOpen}
            aria-controls="profile-drawer"
            className="flex items-center gap-3 pl-4 border-l border-border hover:bg-muted rounded-lg p-2 transition-colors duration-200"
          >
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.role}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold overflow-hidden">
              {user.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatarUrl}
                  alt={`${user.name} avatar`}
                  className="w-full h-full object-cover"
                />
              ) : (
                user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
              )}
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </header>

      {/* Profile Drawer (left slide-in) */}
      <ProfileDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        user={user}
      />
    </>
  );
}


