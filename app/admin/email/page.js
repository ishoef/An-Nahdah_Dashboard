"use client";

import { useState } from "react";
import DashboardShell from "@/components/layout/DashobardShell";
import { Send, Mail, CheckCircle2 } from "lucide-react";

export default function EmailSendPage() {
  const [recipientType, setRecipientType] = useState("all");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const emailCampaigns = [
    {
      id: 1,
      subject: "Course Update: Tajweed Fundamentals",
      recipientType: "students",
      recipientCount: 156,
      status: "sent",
      sentDate: "Jan 2, 2025",
      openRate: 78,
    },
    {
      id: 2,
      subject: "Instructor Payroll Processed",
      recipientType: "instructors",
      recipientCount: 4,
      status: "sent",
      sentDate: "Dec 31, 2024",
      openRate: 100,
    },
    {
      id: 3,
      subject: "New Course Available: Islamic History",
      recipientType: "all",
      recipientCount: 412,
      status: "sent",
      sentDate: "Dec 28, 2024",
      openRate: 65,
    },
  ];

  const handleSend = () => {
    if (!subject || !message) {
      alert("Please fill in all fields");
      return;
    }
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSubject("");
      setMessage("");
      alert("Email sent successfully!");
    }, 2000);
  };

  return (
    <DashboardShell>
      <div className="min-h-screen bg-linear-to-br from-background via-background to-background/80 p-8">
        {/* Header */}
        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <h1 className="text-4xl font-bold text-foreground tracking-tight">
            Send Email
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Send communications to students, instructors, or all users
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Email Composer */}
          <div className="lg:col-span-2 space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Compose Email
              </h2>

              <div className="space-y-4">
                {/* Recipient Type */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Recipient Type
                  </label>
                  <select
                    value={recipientType}
                    onChange={(e) => setRecipientType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
                  >
                    <option value="all">All Users</option>
                    <option value="students">Students Only</option>
                    <option value="instructors">Instructors Only</option>
                  </select>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter email subject..."
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your message here..."
                    rows={6}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 resize-none"
                  />
                </div>

                {/* Send Button */}
                <button
                  onClick={handleSend}
                  disabled={isSending}
                  className="w-full px-6 py-3 bg-linear-to-r from-primary to-primary/90 text-primary-foreground rounded-lg font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {isSending ? "Sending..." : "Send Email"}
                </button>
              </div>
            </div>
          </div>

          {/* Recent Campaigns */}
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Recent Campaigns
              </h2>

              <div className="space-y-4">
                {emailCampaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="p-4 rounded-lg border border-border hover:bg-muted/20 transition-colors duration-200"
                  >
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-primary shrink-0 mt-1" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {campaign.subject}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {campaign.recipientCount} {campaign.recipientType}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-xs text-muted-foreground">
                            {campaign.sentDate}
                          </span>
                        </div>
                        <p className="text-xs text-primary mt-2">
                          {campaign.openRate}% opened
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
