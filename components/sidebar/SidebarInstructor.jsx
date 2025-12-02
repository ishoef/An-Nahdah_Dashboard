"use client";

import Link from "next/link";
import React from "react";
import {
  LayoutDashboard,
  BookOpen,
  CreditCard,
  Bell,
  Megaphone,
  ChevronRight,
} from "lucide-react";
import Logo from "../ui/Logo";

const InstructorSidebar = () => {
  const [activeRoute, setActiveRoute] = React.useState("");

  const menuSections = [
    {
      label: "Overview",
      items: [
        {
          icon: LayoutDashboard,
          label: "Dashboard",
          href: "/instructor/dashboard",
          description: "Your teaching dashboard",
        },
      ],
    },
    {
      label: "Content",
      items: [
        {
          icon: BookOpen,
          label: "Courses",
          href: "/instructor/courses",
          description: "Manage your courses",
        },
      ],
    },
    {
      label: "Finance",
      items: [
        {
          icon: CreditCard,
          label: "Payouts",
          href: "/instructor/payouts",
          description: "Payment history & earnings",
        },
      ],
    },
    {
      label: "Notifications",
      items: [
        {
          icon: Bell,
          label: "Notifications",
          href: "/instructor/notifications",
          description: "Check your notifications",
        },
        {
          icon: Megaphone,
          label: "Announcements",
          href: "/instructor/announcements",
          description: "View announcements",
        },
      ],
    },
  ];

  const isActive = (href) => activeRoute === href;

  return (
    <aside className="fixed left-0 top-0 h-screen w-80 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col z-40 overflow-y-auto scrollbar-hide">
      {/* Logo Section */}
      <div className="sticky top-0 bg-sidebar border-b border-sidebar-border">
        <Logo />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-6 overflow-y-auto">
        {menuSections.map((section) => (
          <div key={section.label}>
            <h3 className="px-4 py-2 text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wide">
              {section.label}
            </h3>

            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setActiveRoute(item.href)}
                    className={`
                      flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group
                      ${
                        active
                          ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div
                        className={`p-2 rounded-md transition-colors ${
                          active
                            ? "bg-sidebar-primary-foreground/20"
                            : "group-hover:bg-sidebar-primary/10"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {item.label}
                        </p>
                        <p
                          className={`text-xs truncate ${
                            active
                              ? "text-sidebar-primary-foreground/70"
                              : "text-sidebar-foreground/50"
                          }`}
                        >
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {active && (
                      <ChevronRight className="w-4 h-4 ml-2 shrink-0" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border bg-sidebar/50 p-4">
        <div className="text-xs">
          <p className="font-semibold text-sidebar-foreground mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Instructor Panel
          </p>
          <p className="text-sidebar-foreground/60">© 2025 An-Nahdah Academy</p>
          <p className="text-sidebar-foreground/50 mt-2 text-xs">v1.0.0</p>
        </div>
      </div>
    </aside>
  );
};

export default InstructorSidebar;
