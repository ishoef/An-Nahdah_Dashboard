"use client";

import { useState } from "react";
import DashboardShell from "@/components/layout/DashobardShell";
import {
  Send,
  Mail,
  Users,
  UserCheck,
  User,
  Clock,
  CheckCircle,
  BarChart3,
  Sparkles,
  Copy,
  Eye,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast"; // Optional: npm install react-hot-toast

const PRIMARY = "#206380";

export default function EmailSendPage() {
  const [recipientType, setRecipientType] = useState("all");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const recipientCounts = {
    all: 412,
    students: 398,
    instructors: 14,
  };

  const recentCampaigns = [
    {
      id: 1,
      subject: "Course Update: Tajweed Fundamentals",
      type: "students",
      count: 156,
      sentAt: "Jan 2, 2025 • 3:45 PM",
      openRate: 78,
      clickRate: 42,
    },
    {
      id: 2,
      subject: "Instructor Payroll Processed – December",
      type: "instructors",
      count: 14,
      sentAt: "Dec 31, 2024 • 9:00 AM",
      openRate: 100,
      clickRate: 93,
    },
    {
      id: 3,
      subject: "New Course Launch: Islamic History Part 1",
      type: "all",
      count: 412,
      sentAt: "Dec 28, 2024 • 11:20 AM",
      openRate: 65,
      clickRate: 38,
    },
  ];

  const handleSend = () => {
    if (!subject.trim() || !message.trim()) {
      toast.error("Please fill in subject and message");
      return;
    }

    setIsSending(true);

    // Simulate sending
    setTimeout(() => {
      setIsSending(false);
      setSubject("");
      setMessage("");
      toast.success(
        `Email sent to ${recipientCounts[recipientType]} recipients!`
      );
    }, 2200);
  };

  const getRecipientLabel = () => {
    switch (recipientType) {
      case "all":
        return "All Users";
      case "students":
        return "Students Only";
      case "instructors":
        return "Instructors Only";
      default:
        return "Select Audience";
    }
  };

  const getRecipientIcon = () => {
    switch (recipientType) {
      case "all":
        return <Users className="w-5 h-5" />;
      case "students":
        return <UserCheck className="w-5 h-5" />;
      case "instructors":
        return <User className="w-5 h-5" />;
      default:
        return <Users className="w-5 h-5" />;
    }
  };

  return (
    <DashboardShell>
      <div className="min-h-screen p-6 md:p-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-bold text-foreground">Send Email</h1>
          <p className="text-muted-foreground mt-3 text-lg">
            Communicate with your community — students, instructors, or everyone
          </p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Email Composer - Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="xl:col-span-2 space-y-6"
          >
            <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-[#206380] to-[#1b5666] px-8 py-6 text-white">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <Mail className="w-7 h-7" />
                  Compose New Message
                </h2>
                <p className="mt-2 opacity-90">
                  Send targeted or broadcast emails instantly
                </p>
              </div>

              <div className="p-8 space-y-7">
                {/* Recipient Selector */}
                <div>
                  <label className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    {getRecipientIcon()}
                    Send To
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      {
                        value: "all",
                        label: "All Users",
                        count: 412,
                        icon: Users,
                      },
                      {
                        value: "students",
                        label: "Students",
                        count: 398,
                        icon: UserCheck,
                      },
                      {
                        value: "instructors",
                        label: "Instructors",
                        count: 14,
                        icon: User,
                      },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setRecipientType(option.value)}
                        className={`p-5 rounded-xl border-2 transition-all duration-300 text-center ${
                          recipientType === option.value
                            ? "border-[#206380] bg-[#206380]/5 shadow-md"
                            : "border-border bg-muted/30 hover:border-[#206380]/30"
                        }`}
                      >
                        <option.icon className="w-8 h-8 mx-auto mb-2 text-[#206380]" />
                        <p className="font-medium">{option.label}</p>
                        <p className="text-xs text-muted-foreground/70 mt-1">
                          {option.count} recipients
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium mb-3">
                    Subject Line
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g., Welcome to the New Semester!"
                    className="w-full px-5 py-4 rounded-xl border border-border bg-background text-foreground text-lg font-medium placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-[#206380]/50 transition"
                  />
                </div>

                {/* Message Body */}
                <div>
                  <label className="block text-sm font-medium mb-3">
                    Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your message here... You can use @name, @course, etc. for personalization."
                    rows={10}
                    className="w-full px-5 py-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-[#206380]/50 transition resize-none font-medium leading-relaxed"
                  />
                  <p className="text-xs text-muted-foreground mt-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Tip: Use @name to personalize with recipient’s name
                  </p>
                </div>

                {/* Send Button */}
                <button
                  onClick={handleSend}
                  disabled={isSending || !subject || !message}
                  className="w-full py-5 bg-gradient-to-r from-[#206380] to-[#1b5666] text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-3"
                >
                  {isSending ? (
                    <>
                      <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending to {recipientCounts[recipientType]} people...
                    </>
                  ) : (
                    <>
                      <Send className="w-6 h-6" />
                      Send Email Now • {recipientCounts[recipientType]}{" "}
                      recipients
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Recent Campaigns Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Stats */}
            <div className="bg-gradient-to-br from-[#206380] to-[#1b5666] rounded-2xl p-6 text-white shadow-xl">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <BarChart3 className="w-7 h-7" />
                Email Performance
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="opacity-90">Total Sent (30d)</span>
                  <span className="text-2xl font-bold">1,284</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-90">Avg. Open Rate</span>
                  <span className="text-2xl font-bold">81%</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-90">Best Performing</span>
                  <span className="text-lg font-medium">Payroll Update</span>
                </div>
              </div>
            </div>

            {/* Recent Campaigns */}
            <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-border">
                <h3 className="text-xl font-bold flex items-center gap-3">
                  <Clock className="w-6 h-6 text-[#206380]" />
                  Recent Campaigns
                </h3>
              </div>
              <div className="p-6 space-y-4">
                {recentCampaigns.map((campaign, idx) => (
                  <motion.div
                    key={campaign.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="mb-5 last:mb-0 p-5 bg-muted/40 rounded-xl hover:bg-muted/70 transition cursor-pointer group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="flex items-center gap-2 mb-2">
                          {campaign.type === "all" && (
                            <Users className="w-4 h-4 text-[#206380]" />
                          )}
                          {campaign.type === "students" && (
                            <UserCheck className="w-4 h-4 text-emerald-600" />
                          )}
                          {campaign.type === "instructors" && (
                            <User className="w-4 h-4 text-purple-600" />
                          )}
                          <span className="text-xs font-medium text-muted-foreground">
                            {campaign.count} recipients
                          </span>
                        </p>
                        <p className="font-medium text-foreground truncate pr-8">
                          {campaign.subject}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {campaign.sentAt}
                        </p>
                        <div className="flex items-center gap-4 mt-3 text-xs">
                          <span className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                            {campaign.openRate}% opened
                          </span>
                          <span className="text-muted-foreground">
                            {campaign.clickRate}% clicked
                          </span>
                        </div>
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 transition p-2 hover:bg-background rounded-lg">
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardShell>
  );
}
