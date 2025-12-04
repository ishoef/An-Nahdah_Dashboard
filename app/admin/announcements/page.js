"use client";

import { useState, useMemo } from "react";
import DashboardShell from "@/components/layout/DashobardShell";
import {
  Plus,
  Trash2,
  Edit2,
  Search,
  Calendar,
  User,
  Clock,
  Eye,
  EyeOff,
  Grid3X3,
  List,
  X,
  Send,
  Save,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Native date helpers (no external deps!)
const formatDate = (dateString) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const formatDateTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

const isFutureDate = (dateString) => {
  if (!dateString) return false;
  return new Date(dateString) > new Date();
};

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: "New Course Launch: Advanced Tajweed",
      content:
        "We're excited to announce the launch of our new Advanced Tajweed course starting next month.",
      author: "Admin",
      createdAt: "2025-01-05T10:00:00",
      publishAt: "2025-01-05T10:00:00",
      status: "published",
    },
    {
      id: 2,
      title: "System Maintenance Scheduled",
      content:
        "The academy system will undergo maintenance on January 10, 2025 from 2 AM to 4 AM.",
      author: "System Admin",
      createdAt: "2025-01-03T08:00:00",
      publishAt: "2025-01-10T02:00:00",
      status: "scheduled",
    },
    {
      id: 3,
      title: "Congratulations to Our Top Students",
      content:
        "We celebrate the outstanding achievements of our top-performing students this semester.",
      author: "Admin",
      createdAt: "2024-12-28T14:30:00",
      publishAt: "2024-12-28T14:30:00",
      status: "published",
    },
    {
      id: 4,
      title: "Ramadan Schedule Update (Draft)",
      content:
        "Special class timings and holiday schedule for Ramadan will be shared soon.",
      author: "Admin",
      createdAt: "2025-02-20T09:15:00",
      publishAt: null,
      status: "draft",
    },
  ]);

  const [viewMode, setViewMode] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedIds, setSelectedIds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    content: "",
    publishAt: "",
    status: "published",
  });

  // Filter & sort announcements
  const filteredAnnouncements = useMemo(() => {
    return announcements
      .filter((a) => {
        const matchesSearch =
          a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter =
          filterStatus === "all" || a.status === filterStatus;
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        const dateA = a.publishAt || a.createdAt;
        const dateB = b.publishAt || b.createdAt;
        return new Date(dateB) - new Date(dateA);
      });
  }, [announcements, searchTerm, filterStatus]);

  // Open modal (create or edit)
  const openModal = (announcement) => {
    if (announcement) {
      setEditingId(announcement.id);
      setForm({
        title: announcement.title,
        content: announcement.content,
        publishAt: announcement.publishAt
          ? announcement.publishAt.slice(0, 16)
          : "",
        status: announcement.status,
      });
    } else {
      setEditingId(null);
      setForm({ title: "", content: "", publishAt: "", status: "published" });
    }
    setIsModalOpen(true);
  };

  // Save announcement
  const saveAnnouncement = () => {
    if (!form.title.trim() || !form.content.trim()) return;

    const now = new Date().toISOString();
    const publishAt = form.status === "draft" ? null : form.publishAt || now;

    const newAnnouncement = {
      id: editingId || Date.now(),
      title: form.title.trim(),
      content: form.content.trim(),
      author: "Admin",
      createdAt: editingId
        ? announcements.find((a) => a.id === editingId)?.createdAt || now
        : now,
      publishAt,
      status: form.status,
    };

    if (editingId) {
      setAnnouncements((prev) =>
        prev.map((a) => (a.id === editingId ? { ...a, ...newAnnouncement } : a))
      );
    } else {
      setAnnouncements((prev) => [newAnnouncement, ...prev]);
    }
    setIsModalOpen(false);
  };

  // Delete single
  const deleteAnnouncement = (id) => {
    if (confirm("Delete this announcement permanently?")) {
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      setSelectedIds((prev) => prev.filter((sid) => sid !== id));
    }
  };

  // Bulk delete
  const bulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (confirm(`Delete ${selectedIds.length} announcement(s)?`)) {
      setAnnouncements((prev) =>
        prev.filter((a) => !selectedIds.includes(a.id))
      );
      setSelectedIds([]);
    }
  };

  // Toggle selection
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <DashboardShell>
      <div className="min-h-screen bg-linear-to-br from-background via-background to-background/80">
        <div className="p-6 mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold text-foreground tracking-tight">
                  Announcements
                </h1>
                <p className="text-muted-foreground mt-1">
                  Keep your academy community informed
                </p>
              </div>
              <button
                onClick={() => openModal()}
                className="px-6 py-3 bg-linear-to-r from-nhd-700 to-[#1b5666] text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                New Announcement
              </button>
            </div>
          </motion.div>

          {/* Toolbar */}
          <div className="mb-6 flex flex-col lg:flex-row lg:justify-between gap-4">
            {/* Search bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-border bg-card/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
              />
            </div>

            <div className="flex items-center gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3.5 rounded-xl border border-border bg-card/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
                <option value="draft">Draft</option>
              </select>

              <div className="flex rounded-xl border border-border bg-card/60 p-1">
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2.5 rounded-lg transition ${
                    viewMode === "list"
                      ? "bg-primary text-white"
                      : "hover:bg-muted"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 rounded-lg transition ${
                    viewMode === "grid"
                      ? "bg-primary text-white"
                      : "hover:bg-muted"
                  }`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
              </div>

              {selectedIds.length > 0 && (
                <button
                  onClick={bulkDelete}
                  className="px-5 py-3.5 bg-red-600 text-white rounded-xl flex items-center gap-2 hover:bg-red-700 transition font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete ({selectedIds.length})
                </button>
              )}
            </div>
          </div>

          {/* Empty State or List/Grid */}
          {filteredAnnouncements.length === 0 ? (
            <div className="text-center py-24">
              <div className="bg-muted/40 w-28 h-28 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Send className="w-14 h-14 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground">
                No announcements found
              </h3>
              <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                {searchTerm || filterStatus !== "all"
                  ? "Try adjusting your search or filters."
                  : "Create your first announcement to get started!"}
              </p>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  : "space-y-5"
              }
            >
              <AnimatePresence>
                {filteredAnnouncements.map((announcement) => (
                  <motion.div
                    key={announcement.id}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    className={`group relative rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-6 hover:border-primary/50 hover:shadow-xl transition-all duration-300 ${
                      selectedIds.includes(announcement.id)
                        ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                        : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(announcement.id)}
                      onChange={() => toggleSelect(announcement.id)}
                      className="absolute top-6 left-6 w-5 h-5 rounded border-border accent-primary"
                    />

                    <div className="pl-8">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition">
                          {announcement.title}
                        </h3>
                        <button
                          onClick={() => openModal(announcement)}
                          className="opacity-0 group-hover:opacity-100 p-2 hover:bg-muted rounded-lg transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-3 mb-5">
                        {announcement.content}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5" />
                          {announcement.author}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(announcement.createdAt)}
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-between">
                        <StatusBadge announcement={announcement} />
                        <button
                          onClick={() => deleteAnnouncement(announcement.id)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  {editingId ? "Edit" : "Create New"} Announcement
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-muted rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    placeholder="Enter a clear and engaging title"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/30 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Content
                  </label>
                  <textarea
                    rows={7}
                    value={form.content}
                    onChange={(e) =>
                      setForm({ ...form, content: e.target.value })
                    }
                    placeholder="Write your full announcement here..."
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/30 focus:outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Publish Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={form.publishAt}
                      onChange={(e) =>
                        setForm({ ...form, publishAt: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Status
                    </label>
                    <select
                      value={form.status}
                      onChange={(e) =>
                        setForm({ ...form, status: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="published">Publish Immediately</option>
                      <option value="scheduled">Schedule for Later</option>
                      <option value="draft">Save as Draft</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 border border-border rounded-xl hover:bg-muted transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveAnnouncement}
                    className="px-6 py-3 bg-linear-to-r from-nhd-700 to-[#1b5666] text-white rounded-xl font-medium hover:shadow-lg transition flex items-center gap-2"
                  >
                    {editingId ? (
                      <Save className="w-4 h-4" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    {editingId ? "Update" : "Publish"} Announcement
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardShell>
  );
}

// Status Badge Component
function StatusBadge({ announcement }) {
  const { status, publishAt } = announcement;

  if (status === "draft") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
        <EyeOff className="w-3.5 h-3.5" />
        Draft
      </span>
    );
  }

  if (status === "scheduled" && publishAt && isFutureDate(publishAt)) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
        <Clock className="w-3.5 h-3.5" />
        Scheduled • {formatDateTime(publishAt)}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
      <Eye className="w-3.5 h-3.5" />
      Published
    </span>
  );
}
