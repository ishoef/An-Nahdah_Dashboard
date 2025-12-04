"use client";

import { useState, useEffect } from "react";
import DashboardShell from "@/components/layout/DashobardShell";
import {
  Users,
  BookOpen,
  DollarSign,
  BarChart3,
  ArrowUpRight,
  Activity,
  Zap,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  Calendar,
  Clock,
  Gift,
  Heart,
  MessageCircle,
  HelpCircle,
  ChevronRight,
  Globe,
  MapPin,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const PRIMARY = "#206380";

export default function UltimateOverview() {
  const [isDark, setIsDark] = useState(false);
  const [time, setTime] = useState(new Date());
  const [hijriDate, setHijriDate] = useState("12 Jumada al-Thani 1447 AH");

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock prayer times (Cairo)
  const prayerTimes = {
    Fajr: "05:12 AM",
    Sunrise: "06:41 AM",
    Dhuhr: "11:52 AM",
    Asr: "02:58 PM",
    Maghrib: "05:03 PM",
    Isha: "06:25 PM",
  };

  const quranVerse = {
    arabic: "إِنَّ اللَّهَ يُحِبُّ الْمُتَّقِينَ",
    translation: "Indeed, Allah loves the righteous (Al-Muttaqeen).",
    reference: "Surah At-Tawbah • 9:4",
  };

  const birthdaysToday = [
    { name: "Fatima Ahmed", age: 19 },
    { name: "Yusuf Khan", age: 22 },
  ];

  const revenueBreakdown = [
    { name: "Course Fees", value: 68, color: "from-blue-500 to-cyan-500" },
    { name: "Donations", value: 22, color: "from-emerald-500 to-teal-500" },
    { name: "Zakat", value: 10, color: "from-amber-500 to-orange-500" },
  ];

  const stats = [
    {
      title: "Total Students",
      value: "1,243",
      change: "+4.2%",
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Active Courses",
      value: "86",
      change: "+3",
      icon: BookOpen,
      color: "from-emerald-500 to-emerald-600",
    },
    {
      title: "Monthly Revenue",
      value: "$18,420",
      change: "+8.6%",
      icon: DollarSign,
      color: "from-violet-500 to-violet-600",
    },
    {
      title: "Donations This Month",
      value: "$4,200",
      change: "+12%",
      icon: Heart,
      color: "from-rose-500 to-pink-600",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: "enrollment",
      message: "Ahmed joined Tajweed Fundamentals",
      time: "5 min ago",
      icon: Users,
    },
    {
      id: 2,
      type: "payment",
      message: "Instructor payout processed",
      time: "1 hour ago",
      icon: DollarSign,
    },
    {
      id: 3,
      type: "course",
      message: "New lesson published in Fiqh",
      time: "2 hours ago",
      icon: BookOpen,
    },
    {
      id: 4,
      type: "review",
      message: "5-star review on Arabic Grammar",
      time: "3 hours ago",
      icon: CheckCircle,
    },
  ];

  return (
    <DashboardShell>
      <div
        className={`min-h-screen transition-all duration-500 ${
          isDark
            ? "bg-slate-950"
            : "bg-gradient-to-br from-slate-50 via-white to-slate-100"
        }`}
      >
        {/* Floating Dark Mode Toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsDark(!isDark)}
          className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl shadow-2xl border border-white/20"
        >
          {isDark ? (
            <Sun className="w-6 h-6 text-yellow-500" />
          ) : (
            <Moon className="w-6 h-6 text-slate-700" />
          )}
        </motion.button>

        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
          {/* Hero Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-[#206380] via-[#1e5a72] to-[#206380] bg-clip-text text-transparent">
              Assalamu Alaikum wa Rahmatullah
            </h1>
            <p className="text-xl mt-4 text-gray-600 dark:text-gray-400">
              Welcome back, Administrator •{" "}
              {time.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="text-lg font-medium text-[#206380] mt-2">
              {hijriDate}
            </p>
          </motion.div>

          {/* Live Clock + Prayer Times */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold flex items-center gap-3">
                  <Clock className="w-8 h-8 text-[#206380]" /> Live Time
                </h3>
                <MapPin className="w-5 h-5 text-gray-500" />
              </div>
              <p className="text-5xl font-bold text-[#206380]">
                {time.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </p>
              <p className="text-sm text-gray-500 mt-2">Cairo, Egypt</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20"
            >
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Globe className="w-8 h-8 text-emerald-600" /> Prayer Times
                Today
              </h3>
              <div className="grid grid-cols-3 gap-3 text-sm">
                {Object.entries(prayerTimes).map(([name, t]) => (
                  <div
                    key={name}
                    className="text-center p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/50"
                  >
                    <p className="font-semibold text-emerald-700 dark:text-emerald-400">
                      {name}
                    </p>
                    <p className="text-xs">{t}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-8 text-white shadow-2xl"
            >
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <Sparkles className="w-8 h-8" /> Daily Quran Verse
              </h3>
              <p
                className="text-3xl font-bold leading-relaxed text-right mb-4"
                dir="rtl"
                lang="ar"
              >
                {quranVerse.arabic}
              </p>
              <p className="text-lg opacity-90">"{quranVerse.translation}"</p>
              <p className="text-sm mt-3 opacity-80">{quranVerse.reference}</p>
            </motion.div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/20 hover:shadow-2xl transition-all duration-500 overflow-hidden"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-20 transition-opacity`}
                  />
                  <div className="relative z-10">
                    <div
                      className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-lg inline-block mb-4`}
                    >
                      <Icon className="w-8 h-8" />
                    </div>
                    <p className="text-4xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {stat.title}
                    </p>
                    <p className="text-emerald-600 font-bold text-sm mt-3 flex items-center gap-1">
                      <ArrowUpRight className="w-4 h-4" /> {stat.change}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Revenue Breakdown + Birthdays */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20"
            >
              <h3 className="text-2xl font-bold mb-6">Revenue Sources</h3>
              <div className="relative w-64 h-64 mx-auto">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* build segments safely */}
                  {(() => {
                    const segments = [];
                    let cum = 0;
                    for (let i = 0; i < revenueBreakdown.length; i++) {
                      const item = revenueBreakdown[i];
                      const start = cum;
                      const end = cum + item.value;
                      segments.push({ ...item, start, end });
                      cum = end;
                    }
                    const colors = ["#60A5FA", "#34D399", "#F59E0B"]; // blue, emerald, amber
                    return segments.map((segment, i) => {
                      const path = describeArc(
                        50,
                        50,
                        40,
                        segment.start * 3.6,
                        segment.end * 3.6
                      );
                      return (
                        <path
                          key={i}
                          d={path}
                          fill="none"
                          stroke={colors[i % colors.length]}
                          strokeWidth="18"
                          strokeLinecap="round"
                        />
                      );
                    });
                  })()}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-[#206380]">$18,420</p>
                    <p className="text-sm text-gray-500">Total This Month</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                {revenueBreakdown.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full bg-gradient-to-br ${item.color}`}
                      />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <span className="font-bold">{item.value}%</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-pink-500 via-rose-500 to-red-500 rounded-3xl p-8 text-white shadow-2xl"
            >
              <h3 className="text-3xl font-bold mb-6 flex items-center gap-4">
                <Gift className="w-10 h-10" /> Student Birthdays Today
              </h3>
              {birthdaysToday.length > 0 ? (
                <div className="space-y-4">
                  {birthdaysToday.map((student, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center"
                    >
                      <p className="text-2xl font-bold">{student.name}</p>
                      <p className="text-lg opacity-90">
                        Turns {student.age} today!
                      </p>
                      <button className="mt-3 px-6 py-2 bg-white text-rose-600 rounded-xl font-semibold hover:bg-rose-50 transition">
                        Send Greeting
                      </button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-xl opacity-90">No birthdays today</p>
              )}
            </motion.div>
          </div>

          {/* Zakat Calculator Widget */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-8 text-white shadow-2xl"
          >
            <h3 className="text-3xl font-bold mb-6">Zakat Calculator</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <input
                type="number"
                placeholder="Gold (grams)"
                className="px-6 py-4 rounded-2xl bg-white/20 backdrop-blur placeholder-white/70 text-white text-xl"
              />
              <input
                type="number"
                placeholder="Cash & Savings"
                className="px-6 py-4 rounded-2xl bg-white/20 backdrop-blur placeholder-white/70 text-white text-xl"
              />
              <button className="bg-white text-emerald-600 font-bold text-xl rounded-2xl hover:bg-emerald-50 transition">
                Calculate Zakat
              </button>
            </div>
          </motion.div>

          {/* Floating Help Button */}
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1 }}
            className="fixed bottom-8 right-8 p-6 bg-gradient-to-br from-[#206380] to-[#1e5a72] text-white rounded-full shadow-2xl hover:shadow-3xl transition-all z-50 flex items-center gap-3"
            onClick={() =>
              toast.success("As-salamu alaikum! How can we assist you today?")
            }
          >
            <HelpCircle className="w-8 h-8" />
            <span className="font-bold text-lg pr-4">Need Help?</span>
          </motion.button>
        </div>
      </div>
    </DashboardShell>
  );
}

// Helper function for donut chart arcs
function describeArc(x, y, radius, startAngle, endAngle) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ].join(" ");
}

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}
