import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  LogOut,
  Settings,
  Edit3,
  Eye,
  Shield,
  UserCheck2,
  Mail,
  Phone,
  Calendar,
  Award,
  Users,
  BookOpen,
  MessageCircle,
} from "lucide-react";

export default function ProfileDrawer({ open, onClose, user = {} }) {
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => closeBtnRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => (document.body.style.overflow = "unset");
  }, [open]);

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const drawerVariants = {
    hidden: { x: "100%" },
    visible: {
      x: 0,
      transition: { type: "spring", damping: 32, stiffness: 300 },
    },
    exit: { x: "100%", transition: { duration: 0.25 } },
  };

  const getRoleBadge = (role) => {
    const isAdmin = role?.toLowerCase().includes("admin");
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider ${
          isAdmin
            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
            : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
        }`}
      >
        {isAdmin ? (
          <Shield className="w-3.5 h-3.5" />
        ) : (
          <Award className="w-3.5 h-3.5" />
        )}
        {role || "Instructor"}
      </span>
    );
  };

  const initials = (name = "") =>
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex justify-end"
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <motion.aside
            variants={drawerVariants}
            className="relative w-full max-w-lg bg-white dark:bg-slate-900 shadow-2xl flex flex-col h-full overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-drawer-title"
          >
            {/* Gradient Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#206380] via-[#1e5a7a] to-[#1b5666] text-white">
              <div className="absolute inset-0 bg-black/10" />
              <div className="relative px-8 pt-10 pb-20">
                <button
                  ref={closeBtnRef}
                  onClick={onClose}
                  className="absolute top-6 right-6 p-2 rounded-lg bg-white/20 backdrop-blur hover:bg-white/30 transition focus:outline-none focus:ring-2 focus:ring-white/50"
                  aria-label="Close profile drawer"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Avatar + Info */}
                <div className="flex items-end gap-5">
                  <div className="relative">
                    <div className="w-28 h-28 rounded-2xl overflow-hidden ring-4 ring-white/30 shadow-2xl">
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-4xl font-bold">
                          {initials(user.name)}
                        </div>
                      )}
                    </div>
                    {user.status === "online" && (
                      <span className="absolute bottom-2 right-2 w-6 h-6 bg-emerald-400 rounded-full ring-4 ring-white shadow-lg" />
                    )}
                  </div>

                  <div className="pb-2">
                    <h2
                      id="profile-drawer-title"
                      className="text-2xl font-bold"
                    >
                      {user.name || "Instructor Name"}
                    </h2>
                    <div className="mt-2 flex items-center gap-3">
                      {getRoleBadge(user.role)}
                      {user.verified && (
                        <UserCheck2 className="w-5 h-5 text-white/80" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Wave bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-10">
                <svg
                  viewBox="0 0 1440 320"
                  className="w-full h-full fill-white dark:fill-slate-900"
                  preserveAspectRatio="none"
                >
                  <path d="M0,192L48,197.3C96,203,192,213,288,213.3C384,213,480,203,576,181.3C672,160,768,128,864,133.3C960,139,1056,181,1152,197.3C1248,213,1344,203,1392,197.3L1440,192L1440,320L0,320Z" />
                </svg>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8">
              {/* Bio */}
              {user.bio && (
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 border border-blue-100 dark:border-slate-700">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {user.bio}
                  </p>
                </div>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-5">
                <StatCard
                  icon={Users}
                  label="Students"
                  value={user.stats?.students || 0}
                  color="from-emerald-500 to-teal-600"
                />
                <StatCard
                  icon={BookOpen}
                  label="Courses"
                  value={user.stats?.courses || 0}
                  color="from-blue-500 to-cyan-600"
                />
                <StatCard
                  icon={MessageCircle}
                  label="Messages"
                  value={user.stats?.messages || 0}
                  color="from-purple-500 to-indigo-600"
                />
              </div>

              {/* Contact Info */}
              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[#206380]" />
                  Contact Information
                </h3>
                <div className="bg-slate-50 dark:bg-slate-800/70 rounded-2xl p-6 space-y-5 border border-slate-200 dark:border-slate-700">
                  <InfoRow icon={Mail} label="Email" value={user.email} />
                  <InfoRow
                    icon={Phone}
                    label="Phone"
                    value={user.phone || "Not provided"}
                  />
                  <InfoRow
                    icon={Calendar}
                    label="Member Since"
                    value={user.joined || "January 2024"}
                  />
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {[
                    "Published new course: Advanced Cardiac Life Support",
                    "Responded to 12 student questions",
                    "Updated profile information",
                    "Achieved 98% course completion rate",
                  ].map((activity, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400"
                    >
                      <div className="w-2 h-2 rounded-full bg-[#206380] mt-2 flex-shrink-0" />
                      <span>{activity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons Footer */}
            <div className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-8 py-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => console.log("Edit Profile")}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-[#206380] to-[#1b5666] text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                >
                  <Edit3 className="w-4.5 h-4.5" />
                  Edit Profile
                </button>

                <button
                  onClick={() => console.log("View Full Profile")}
                  className="flex items-center justify-center gap-2 px-5 py-3.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  <Eye className="w-4.5 h-4.5" />
                  View Full Profile
                </button>

                <button
                  onClick={() => console.log("Settings")}
                  className="p-3.5 border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                  title="Settings"
                >
                  <Settings className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>

                <button
                  onClick={() =>
                    window.confirm("Sign out?") && console.log("Signed out")
                  }
                  className="p-3.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition shadow-md"
                  title="Sign out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* Reusable Components */

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="group text-center">
      <div
        className={`w-full aspect-square rounded-2xl bg-gradient-to-br ${color} p-5 shadow-lg group-hover:shadow-xl transition-shadow`}
      >
        <div className="w-full h-full rounded-xl bg-white/20 backdrop-blur-sm flex flex-col items-center justify-center text-white">
          <Icon className="w-8 h-8 mb-2" />
          <div className="text-3xl font-bold">{value}</div>
        </div>
      </div>
      <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-400">
        {label}
      </p>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4">
      <div className="p-3 bg-[#206380]/10 dark:bg-[#206380]/20 rounded-xl">
        <Icon className="w-5 h-5 text-[#206380]" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
        <p className="font-medium text-slate-800 dark:text-slate-200">
          {value}
        </p>
      </div>
    </div>
  );
}
