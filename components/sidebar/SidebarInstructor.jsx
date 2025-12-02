"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  BookOpen,
  CreditCard,
  Bell,
  Megaphone,
} from "lucide-react";
import Logo from "../ui/Logo";

const InstructorSidebar = () => {
  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      href: "/instructor/dashboard",
    },
    {
      icon: BookOpen,
      label: "Courses",
      href: "/instructor/courses",
    },
    {
      icon: CreditCard,
      label: "Payouts",
      href: "/instructor/payouts",
    },
    {
      icon: Bell,
      label: "Notifications",
      href: "/instructor/notifications",
    },
    {
      icon: Megaphone,
      label: "Announcements",
      href: "/instructor/announcements",
    },
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

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4">
        <div className="text-xs text-sidebar-foreground/60">
          <p className="font-semibold text-sidebar-foreground mb-1">
            Instructor
          </p>
          <p>© 2025 An-Nahdah Academy</p>
        </div>
      </div>
    </aside>
  );
};

export default InstructorSidebar;
