"use client";

import Link from "next/link";
import React from "react";
import {
  BarChart3,
  Users,
  BookOpen,
  DollarSign,
  Mail,
  Bell,
  FileText,
  Megaphone,
} from "lucide-react";
import Logo from "../ui/Logo";

const AdminSidebar = () => {
  const [expandedSection, setExpandedSection] = React.useState(null);

  const menuItems = [
    { icon: BarChart3, label: "Overview", href: "/admin/overview" },
    { icon: Users, label: "Students", href: "/admin/students" },
    { icon: Users, label: "Instructors", href: "/admin/instructors" },
    { icon: BookOpen, label: "Courses", href: "/admin/courses" },
    { icon: DollarSign, label: "Salaries", href: "/admin/salaries" },
    { icon: Mail, label: "Email Send", href: "/admin/email" },
    { icon: Bell, label: "Notifications", href: "/admin/notifications" },
    { icon: FileText, label: "Reports", href: "/admin/reports" },
    { icon: Megaphone, label: "Announcements", href: "/admin/announcements" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-80 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col z-40 overflow-y-auto scrollbar-hide">
      <Logo />

      <nav className="flex-1 px-4 py-6">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors group"
              >
                <Icon className="w-5 h-5 group-hover:text-blue-500" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <div className="text-xs text-sidebar-foreground/60">
          <p className="font-semibold text-sidebar-foreground mb-1">
            Admin Panel
          </p>
          <p>© 2025 An-Nahdah Academy</p>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
