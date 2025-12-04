"use client";

import { useState, useMemo } from "react";
import DashboardShell from "@/components/layout/DashobardShell";
import {
  Plus,
  Search,
  Calendar,
  Clock,
  Send,
  Save,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  Grid3X3,
  List,
  X,
  Megaphone,
  User,
  CheckCircle2,
  CheckSquare,
  Square,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

const PRIMARY = "#206380";

const formatDate = (dateString) => {
  if (!dateString) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(dateString));
};

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: "New Course Launch: Advanced Tajweed Mastery",
      content:
        "We're thrilled to announce our flagship Advanced Tajweed course starting February 2025. Limited seats!",
      author: "Aisha Khalid",
      createdAt: "2025-01-05T10:00:00",
      publishAt: "2025-01-05T10:00:00",
      status: "published",
    },
    {
      id: 2,
      title: "System Maintenance Scheduled",
      content:
        "Planned downtime on January 10 from 2:00 AM to 4:00 AM (UTC+2). All services will be unavailable.",
      author: "System Admin",
      createdAt: "2025-01-03T08:00:00",
      publishAt: "2025-01-10T02:00:00",
      status: "scheduled",
    },
    {
      id: 3,
      title: "Congratulations to December's Top Performers!",
      content:
        "Join us in celebrating our outstanding students who achieved 95%+ in final assessments.",
      author: "Fatimah Noor",
      createdAt: "2024-12-28T14:30:00",
      publishAt: "2024-12-28T14:30:00",
      status: "published",
    },
    {
      id: 4,
      title: "Ramadan 2025 Schedule (Draft)",
      content:
        "Special class timings, holiday breaks, and intensive revision sessions during the blessed month.",
      author: "Admin",
      createdAt: "2025-02-20T09:15:00",
      publishAt: null,
      status: "draft",
    },
  ]);

  const [viewMode, setViewMode] = useState("grid");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: "",
    content: "",
    publishAt: "",
    status: "published",
  });

  const filtered = useMemo(() => {
    return announcements
      .filter((a) => {
        const matchesSearch =
          a.title.toLowerCase().includes(search.toLowerCase()) ||
          a.content.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === "all" || a.status === filter;
        return matchesSearch && matchesFilter;
      })
      .sort(
        (a, b) =>
          new Date(b.publishAt || b.createdAt) -
          new Date(a.publishAt || a.createdAt)
      );
  }, [announcements, search, filter]);

  const stats = {
    total: announcements.length,
    published: announcements.filter((a) => a.status === "published").length,
    scheduled: announcements.filter((a) => a.status === "scheduled").length,
    drafts: announcements.filter((a) => a.status === "draft").length,
  };

  const isAllSelected =
    selected.length === filtered.length && filtered.length > 0;
  const isIndeterminate =
    selected.length > 0 && selected.length < filtered.length;

  const openModal = (ann = null) => {
    if (ann) {
      setEditing(ann);
      setForm({
        title: ann.title,
        content: ann.content,
        publishAt: ann.publishAt ? ann.publishAt.slice(0, 16) : "",
        status: ann.status,
      });
    } else {
      setEditing(null);
      setForm({ title: "", content: "", publishAt: "", status: "published" });
    }
    setIsModalOpen(true);
  };

  const saveAnnouncement = () => {
    if (!form.title.trim() || !form.content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    const now = new Date().toISOString();
    const payload = {
      id: editing?.id || Date.now(),
      title: form.title.trim(),
      content: form.content.trim(),
      author: "Admin",
      createdAt: editing?.createdAt || now,
      publishAt: form.status === "draft" ? null : form.publishAt || now,
      status: form.status,
    };

    if (editing) {
      setAnnouncements((prev) =>
        prev.map((a) => (a.id === editing.id ? { ...a, ...payload } : a))
      );
      toast.success("Announcement updated successfully");
    } else {
      setAnnouncements((prev) => [payload, ...prev]);
      toast.success("Announcement created!");
    }
    setIsModalOpen(false);
  };

  const deleteAnnouncement = (id) => {
    const item = announcements.find((a) => a.id === id);
    if (!item) return;
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    setSelected((prev) => prev.filter((s) => s !== id));
    toast.success(`"${item.title}" deleted`, {
      duration: 5000,
      action: {
        label: "Undo",
        onClick: () => setAnnouncements((prev) => [item, ...prev]),
      },
    });
  };

  const bulkDelete = () => {
    if (selected.length === 0) return;
    const removed = announcements.filter((a) => selected.includes(a.id));
    setAnnouncements((prev) => prev.filter((a) => !selected.includes(a.id)));
    setSelected([]);
    toast.success(`${removed.length} announcement(s) deleted`, {
      duration: 5000,
      action: {
        label: "Undo",
        onClick: () => setAnnouncements((prev) => [...removed, ...prev]),
      },
    });
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelected(isAllSelected ? [] : filtered.map((a) => a.id));
  };

  return (
    <DashboardShell>
      <Toaster position="bottom-right" />

      <div className="min-h-screen p-6 md:p-10 bg-background">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground flex items-center gap-4">
                <Megaphone className="w-12 h-12 text-[#206380]" />
                Announcements
              </h1>
              <p className="text-lg text-muted-foreground mt-3">
                Keep students, instructors, and parents informed
              </p>
            </div>
            <button
              onClick={() => openModal()}
              className="px-7 py-4 bg-gradient-to-r from-[#206380] to-[#1b5666] text-white rounded-xl font-bold text-lg flex items-center gap-3 hover:shadow-2xl transition-all hover:scale-105"
            >
              <Plus className="w-6 h-6" />
              New Announcement
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {[
            {
              label: "Total",
              value: stats.total,
              icon: Megaphone,
              color: "from-blue-500 to-cyan-500",
            },
            {
              label: "Published",
              value: stats.published,
              icon: Eye,
              color: "from-emerald-500 to-teal-500",
            },
            {
              label: "Scheduled",
              value: stats.scheduled,
              icon: Clock,
              color: "from-amber-500 to-orange-500",
            },
            {
              label: "Drafts",
              value: stats.drafts,
              icon: EyeOff,
              color: "from-gray-500 to-slate-500",
            },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-4xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div
                    className={`p-4 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}
                  >
                    <Icon className="w-8 h-8" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8 items-start lg:items-center">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search announcements..."
              className="pl-14 pr-6 py-5 w-full rounded-2xl border bg-card focus:ring-4 focus:ring-[#206380]/20 transition"
            />
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-6 py-5 rounded-2xl border bg-card font-medium"
            >
              <option value="all">All Announcements</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
              <option value="draft">Drafts</option>
            </select>

            <div className="flex rounded-2xl border bg-card p-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-4 rounded-xl ${
                  viewMode === "grid" ? "bg-[#206380] text-white" : ""
                }`}
              >
                <Grid3X3 className="w-6 h-6" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-4 rounded-xl ${
                  viewMode === "list" ? "bg-[#206380] text-white" : ""
                }`}
              >
                <List className="w-6 h-6" />
              </button>
            </div>

            {filtered.length > 0 && (
              <button
                onClick={selectAll}
                className="flex items-center gap-2 px-5 py-5 border rounded-2xl hover:bg-muted transition"
              >
                {isAllSelected ? (
                  <CheckSquare className="w-6 h-6 text-[#206380]" />
                ) : isIndeterminate ? (
                  <Square className="w-6 h-6 text-[#206380]/60" />
                ) : (
                  <Square className="w-6 h-6" />
                )}
                Select All
              </button>
            )}

            {selected.length > 0 && (
              <button
                onClick={bulkDelete}
                className="px-6 py-5 bg-rose-600 text-white rounded-2xl font-medium flex items-center gap-3 hover:bg-rose-700 transition"
              >
                <Trash2 className="w-5 h-5" />
                Delete ({selected.length})
              </button>
            )}
          </div>
        </div>

        {/* Grid View - Smaller, Cleaner Text */}
        {viewMode === "grid" && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <AnimatePresence>
              {filtered.map((ann) => (
                <motion.article
                  key={ann.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, y: -50 }}
                  className={`relative group bg-card border-2 border-border rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ${
                    selected.includes(ann.id) ? "ring-4 ring-[#206380]/30" : ""
                  }`}
                >
                  {/* Checkbox */}
                  <div className="absolute top-5 left-5 z-20">
                    <input
                      type="checkbox"
                      checked={selected.includes(ann.id)}
                      onChange={() => toggleSelect(ann.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-6 h-6 rounded border-2 accent-[#206380] cursor-pointer"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-5 right-5 z-20 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(ann);
                      }}
                      className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition"
                    >
                      <Edit2 className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteAnnouncement(ann.id);
                      }}
                      className="p-3 bg-rose-500/10 rounded-xl shadow-md hover:bg-rose-500/20 transition"
                    >
                      <Trash2 className="w-5 h-5 text-rose-600" />
                    </button>
                  </div>

                  {/* Content */}
                  <div
                    className="p-8 pt-16 cursor-pointer"
                    onClick={() => openModal(ann)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      {/* Reduced title size */}
                      <h3 className="text-xl font-bold text-foreground leading-tight pr-6">
                        {ann.title}
                      </h3>
                      <StatusBadge status={ann.status} />
                    </div>

                    {/* Smaller, cleaner content */}
                    <p className="text-base text-muted-foreground leading-relaxed mb-7 line-clamp-3">
                      {ann.content}
                    </p>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-5">
                        <span className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {ann.author}
                        </span>
                        <span className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {formatDate(ann.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* List View - Also refined */}
        {viewMode === "list" && filtered.length > 0 && (
          <div className="space-y-6">
            {filtered.map((ann) => (
              <motion.div
                key={ann.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`bg-card border-2 rounded-3xl p-8 flex gap-6 hover:shadow-xl transition-all ${
                  selected.includes(ann.id) ? "ring-4 ring-[#206380]/30" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={selected.includes(ann.id)}
                  onChange={() => toggleSelect(ann.id)}
                  className="mt-2 w-6 h-6 rounded accent-[#206380]"
                />
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => openModal(ann)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold">{ann.title}</h3>
                    <StatusBadge status={ann.status} />
                  </div>
                  <p className="text-base text-muted-foreground mb-5">
                    {ann.content}
                  </p>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4" /> {ann.author}
                    </span>
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />{" "}
                      {formatDate(ann.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => openModal(ann)}
                    className="p-3 hover:bg-muted rounded-xl"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deleteAnnouncement(ann.id)}
                    className="p-3 hover:bg-rose-100 rounded-xl"
                  >
                    <Trash2 className="w-5 h-5 text-rose-600" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="text-center py-24">
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-[#206380]/20 to-[#1b5666]/20 rounded-full flex items-center justify-center">
              <Megaphone className="w-16 h-16 text-[#206380]" />
            </div>
            <h3 className="text-3xl font-bold text-foreground mb-4">
              No announcements found
            </h3>
            <p className="text-xl text-muted-foreground">
              {search || filter !== "all"
                ? "Try adjusting your search or filters"
                : "Create your first announcement!"}
            </p>
          </div>
        )}

        {/* Modal - Slightly smaller text */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50"
              onClick={() => setIsModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-card rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-10 border"
              >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold">
                    {editing ? "Edit" : "Create New"} Announcement
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-3 hover:bg-muted rounded-xl"
                  >
                    <X className="w-7 h-7" />
                  </button>
                </div>
                <div className="space-y-8">
                  <div>
                    <label className="text-base font-semibold mb-3 block">
                      Title
                    </label>
                    <input
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                      placeholder="Enter a compelling title..."
                      className="w-full px-6 py-5 rounded-2xl border-2 bg-background text-lg font-medium focus:border-[#206380] transition"
                    />
                  </div>
                  <div>
                    <label className="text-base font-semibold mb-3 block">
                      Content
                    </label>
                    <textarea
                      rows={9}
                      value={form.content}
                      onChange={(e) =>
                        setForm({ ...form, content: e.target.value })
                      }
                      placeholder="Write your full announcement..."
                      className="w-full px-6 py-5 rounded-2xl border-2 bg-background text-base leading-relaxed resize-none focus:border-[#206380] transition"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="text-base font-semibold mb-3 block">
                        Publish Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        value={form.publishAt}
                        onChange={(e) =>
                          setForm({ ...form, publishAt: e.target.value })
                        }
                        className="w-full px-6 py-5 rounded-2xl border-2 bg-background focus:border-[#206380]"
                      />
                    </div>
                    <div>
                      <label className="text-base font-semibold mb-3 block">
                        Status
                      </label>
                      <select
                        value={form.status}
                        onChange={(e) =>
                          setForm({ ...form, status: e.target.value })
                        }
                        className="w-full px-6 py-5 rounded-2xl border-2 bg-background font-medium text-base"
                      >
                        <option value="published">Publish Now</option>
                        <option value="scheduled">Schedule</option>
                        <option value="draft">Save as Draft</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-6 pt-8 border-t">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="px-8 py-5 border-2 border-border rounded-2xl font-bold text-base hover:bg-muted transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveAnnouncement}
                      className="px-10 py-5 bg-gradient-to-r from-[#206380] to-[#1b5666] text-white rounded-2xl font-bold text-base flex items-center gap-4 hover:shadow-2xl transition"
                    >
                      {editing ? (
                        <Save className="w-6 h-6" />
                      ) : (
                        <Send className="w-6 h-6" />
                      )}
                      {editing ? "Update" : "Publish"} Announcement
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardShell>
  );
}

function StatusBadge({ status }) {
  if (status === "draft") {
    return (
      <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-bold text-xs flex items-center gap-1.5">
        <EyeOff className="w-3.5 h-3.5" /> Draft
      </span>
    );
  }
  if (status === "scheduled") {
    return (
      <span className="px-4 py-2 bg-amber-100 text-amber-700 rounded-full font-bold text-xs flex items-center gap-1.5">
        <Clock className="w-3.5 h-3.5" /> Scheduled
      </span>
    );
  }
  return (
    <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full font-bold text-xs flex items-center gap-1.5">
      <CheckCircle2 className="w-3.5 h-3.5" /> Published
    </span>
  );
}
