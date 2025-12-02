"use client";

import { Search, Bell, Settings, ChevronDown, Moon, Sun } from "lucide-react";

import { Input } from "@/components/ui/input";
import ThemeToggle from "../ui/Theme-Toggle";

export function TopBar({
  userName = "Dr. Hassan Al-Rashid",
  userRole = "Administrator",
}) {
  return (
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
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">{userName}</p>
            <p className="text-xs text-muted-foreground">{userRole}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-linear-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold">
            {userName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    </header>
  );
}
