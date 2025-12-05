"use client";

import { useState, useMemo } from "react";
import DashboardShell from "@/components/layout/DashobardShell";
import {
  Search,
  Plus,
  Download,
  Upload,
  Trash2,
  Eye,
  Edit2,
  X,
  CheckCircle,
  BarChart3,
  Users,
  DollarSign,
  TrendingUp,
  List,
  Grid3X3,
  MoreVertical,
  AlertTriangle,
  Copy,
  Archive,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Papa from "papaparse";

const PRIMARY = "#206380";

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function downloadCSV(data, filename = "courses.csv") {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function CoursesPage() {
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "Tajweed Fundamentals",
      instructor: "Dr. Hassan Ahmed",
      students: 156,
      revenue: 2340,
      rating: 4.9,
      progress: 85,
      status: "active",
      createdDate: "2024-11-15",
      category: "Quran Studies",
      price: 49,
    },
    {
      id: 2,
      title: "Intro to Islamic Fiqh",
      instructor: "Ms. Amina Khan",
      students: 98,
      revenue: 1470,
      rating: 4.7,
      progress: 62,
      status: "active",
      createdDate: "2024-12-01",
      category: "Fiqh",
      price: 59,
    },
    {
      id: 3,
      title: "Advanced Arabic Grammar",
      instructor: "Prof. Mohammed Ali",
      students: 82,
      revenue: 1230,
      rating: 4.8,
      progress: 78,
      status: "active",
      createdDate: "2024-12-10",
      category: "Arabic Language",
      price: 79,
    },
    {
      id: 4,
      title: "Quranic Arabic Intensive",
      instructor: "Dr. Fatima Hassan",
      students: 124,
      revenue: 1860,
      rating: 4.6,
      progress: 45,
      status: "active",
      createdDate: "2024-12-15",
      category: "Arabic Language",
      price: 99,
    },
    {
      id: 5,
      title: "Islamic History Part 1",
      instructor: "Dr. Hassan Ahmed",
      students: 67,
      revenue: 0,
      rating: 4.5,
      progress: 0,
      status: "draft",
      createdDate: "2025-01-02",
      category: "Islamic History",
      price: 69,
    },
    {
      id: 6,
      title: "Arabic Literature Basics",
      instructor: "Ms. Layla Al-Rashid",
      students: 45,
      revenue: 675,
      rating: 4.4,
      progress: 30,
      status: "active",
      createdDate: "2025-01-05",
      category: "Arabic Language",
      price: 55,
    },
  ]);

  // UI State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedIds, setSelectedIds] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(null);
  const [showViewModal, setShowViewModal] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);
  const [bulkAction, setBulkAction] = useState("");
  const [sortBy, setSortBy] = useState({ field: "createdDate", order: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Derived Data
  const filteredCourses = useMemo(() => {
    let filtered = courses.filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.instructor.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      const matchesCategory =
        categoryFilter === "all" || c.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });

    filtered.sort((a, b) => {
      let valA = a[sortBy.field];
      let valB = b[sortBy.field];
      if (sortBy.field === "createdDate") {
        valA = new Date(valA);
        valB = new Date(valB);
      }
      if (sortBy.order === "asc") return valA > valB ? 1 : -1;
      return valA < valB ? 1 : -1;
    });

    return filtered;
  }, [courses, searchTerm, statusFilter, categoryFilter, sortBy]);

  const paginatedCourses = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCourses.slice(start, start + itemsPerPage);
  }, [filteredCourses, currentPage]);

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

  const totalRevenue = courses.reduce((sum, c) => sum + c.revenue, 0);
  const totalStudents = courses.reduce((sum, c) => sum + c.students, 0);
  const avgRating = (
    courses.reduce((sum, c) => sum + c.rating, 0) / courses.length || 0
  ).toFixed(1);
  const activeCourses = courses.filter((c) => c.status === "active").length;
  const draftCourses = courses.filter((c) => c.status === "draft").length;

  const categories = [...new Set(courses.map((c) => c.category))];

  // Selection Handlers
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedIds(
      selectedIds.length === paginatedCourses.length
        ? []
        : paginatedCourses.map((c) => c.id)
    );
  };

  const handleBulkAction = (action) => {
    if (selectedIds.length === 0) return;
    setBulkAction(action);
    setShowBulkConfirm(true);
  };

  const confirmBulkAction = () => {
    let updated = [...courses];
    if (bulkAction === "delete") {
      updated = updated.filter((c) => !selectedIds.includes(c.id));
    } else if (bulkAction === "publish") {
      updated = updated.map((c) =>
        selectedIds.includes(c.id)
          ? { ...c, status: "active", progress: Math.max(c.progress, 10) }
          : c
      );
    } else if (bulkAction === "unpublish") {
      updated = updated.map((c) =>
        selectedIds.includes(c.id) ? { ...c, status: "draft" } : c
      );
    } else if (bulkAction === "archive") {
      updated = updated.map((c) =>
        selectedIds.includes(c.id) ? { ...c, status: "archived" } : c
      );
    }
    setCourses(updated);
    setSelectedIds([]);
    setShowBulkConfirm(false);
    setBulkAction("");
  };

  const addCourse = (newCourse) => {
    const id =
      courses.length > 0 ? Math.max(...courses.map((c) => c.id)) + 1 : 1;

    setCourses([
      ...courses,
      {
        ...newCourse,
        id,
        revenue: 0,
        students: 0,
        rating: 0,
        progress: 0,
        createdDate: new Date().toISOString().split("T")[0],
        status: newCourse.status || "draft",
      },
    ]);
    setShowAddModal(false);
  };

  const updateCourse = (updated) => {
    setCourses(courses.map((c) => (c.id === updated.id ? updated : c)));
    setShowEditModal(null);
  };

  const deleteCourse = (id) => {
    setCourses(courses.filter((c) => c.id !== id));
    setShowDeleteConfirm(null);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const newCourses = results.data.map((row, i) => ({
          id: courses.length + i + 1,
          title: row.title || "Untitled Course",
          instructor: row.instructor || "Unknown",
          students: parseInt(row.students) || 0,
          revenue: parseFloat(row.revenue) || 0,
          rating: parseFloat(row.rating) || 0,
          progress: parseInt(row.progress) || 0,
          status: row.status || "draft",
          createdDate:
            row.createdDate || new Date().toISOString().split("T")[0],
          category: row.category || "General",
          price: parseFloat(row.price) || 0,
        }));
        setCourses([...courses, ...newCourses]);
      },
    });
  };

  const handleSort = (field) => {
    setSortBy((prev) => ({
      field,
      order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <DashboardShell>
      <div className="min-h-screen p-6 md:p-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Course Management
            </h1>
            <p className="mt-2 text-muted-foreground">
              Create, publish, and analyze all courses in one place.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-nhd-700 to-[#1b5666] text-white rounded-md font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Create Course
            </button>
            <label className="px-4 py-2.5 border border-border rounded-md hover:bg-muted transition font-medium flex items-center gap-2 cursor-pointer">
              <Upload className="w-4 h-4" /> Import
              <input
                type="file"
                accept=".csv"
                onChange={handleImport}
                className="hidden"
              />
            </label>
            <button
              onClick={() => downloadCSV(courses)}
              className="px-4 py-2.5 border border-border rounded-md hover:bg-muted transition font-medium flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-10">
          <KPICard
            title="Total Courses"
            value={courses.length}
            hint="All time"
            icon={BarChart3}
          />
          <KPICard
            title="Active"
            value={activeCourses}
            hint="Published"
            icon={CheckCircle}
            color="emerald"
          />
          <KPICard
            title="Draft"
            value={draftCourses}
            hint="In progress"
            icon={Edit2}
            color="amber"
          />
          <KPICard
            title="Total Revenue"
            value={formatCurrency(totalRevenue)}
            hint="All courses"
            icon={DollarSign}
          />
          <KPICard
            title="Total Students"
            value={totalStudents.toLocaleString()}
            hint="Enrolled"
            icon={Users}
          />
        </div>

        {/* Filters & Controls */}
        <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search courses or instructors..."
              className="pl-10 pr-4 py-2.5 rounded-md border border-border bg-background text-sm w-full focus:outline-none focus:ring-2 focus:ring-nhd-700/50 transition"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-nhd-700/50"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2.5 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-nhd-700/50"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="flex rounded-md border border-border bg-background p-1">
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 rounded-sm transition ${
                  viewMode === "table"
                    ? "bg-nhd-700 text-white"
                    : "hover:bg-muted"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-sm transition ${
                  viewMode === "grid"
                    ? "bg-nhd-700 text-white"
                    : "hover:bg-muted"
                }`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Courses List */}
        {viewMode === "table" && (
          <CourseTable
            courses={paginatedCourses}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            onToggleSelectAll={toggleSelectAll}
            onView={setShowViewModal}
            onEdit={setShowEditModal}
            onDelete={setShowDeleteConfirm}
            onSort={handleSort}
            sortBy={sortBy}
          />
        )}

        {viewMode === "grid" && (
          <CourseGrid
            courses={paginatedCourses}
            onView={setShowViewModal}
            onEdit={setShowEditModal}
            onDelete={setShowDeleteConfirm}
          />
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              className="px-4 py-2 border border-border rounded-md disabled:opacity-50 hover:bg-muted"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              className="px-4 py-2 border border-border rounded-md disabled:opacity-50 hover:bg-muted"
            >
              Next
            </button>
          </div>
        )}

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <div className="mt-6 p-4 bg-card border border-border rounded-xl flex justify-between items-center shadow-sm">
            <span className="font-medium">{selectedIds.length} selected</span>
            <div className="flex gap-3">
              <button
                onClick={() => handleBulkAction("publish")}
                className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" /> Publish
              </button>
              <button
                onClick={() => handleBulkAction("unpublish")}
                className="px-4 py-2 bg-amber-600 text-white rounded-md text-sm flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" /> Unpublish
              </button>
              <button
                onClick={() => handleBulkAction("archive")}
                className="px-4 py-2 bg-gray-600 text-white rounded-md text-sm flex items-center gap-2"
              >
                <Archive className="w-4 h-4" /> Archive
              </button>
              <button
                onClick={() => handleBulkAction("delete")}
                className="px-4 py-2 bg-rose-600 text-white rounded-md text-sm flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        )}

        {/* Modals */}
        {showAddModal && (
          <AddEditCourseModal
            onClose={() => setShowAddModal(false)}
            onSave={addCourse}
          />
        )}
        {showEditModal && (
          <AddEditCourseModal
            course={showEditModal}
            onClose={() => setShowEditModal(null)}
            onSave={updateCourse}
          />
        )}
        {showViewModal && (
          <ViewCourseModal
            course={showViewModal}
            onClose={() => setShowViewModal(null)}
          />
        )}
        {showDeleteConfirm && (
          <DeleteConfirm
            id={showDeleteConfirm}
            onClose={() => setShowDeleteConfirm(null)}
            onConfirm={deleteCourse}
          />
        )}
        {showBulkConfirm && (
          <BulkConfirm
            action={bulkAction}
            count={selectedIds.length}
            onClose={() => setShowBulkConfirm(false)}
            onConfirm={confirmBulkAction}
          />
        )}
      </div>
    </DashboardShell>
  );
}

// KPI Card
function KPICard({ title, value, hint, icon: Icon, color = "blue" }) {
  const colorMap = {
    blue: "from-[#206380] to-[#1b5666]",
    emerald: "from-emerald-500 to-teal-500",
    amber: "from-amber-500 to-orange-500",
  };
  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-3">
        <div
          className={`p-3 rounded-xl bg-gradient-to-br ${colorMap[color]} text-white`}
        >
          <Icon className="w-6 h-6" />
        </div>
        <TrendingUp className="w-5 h-5 text-emerald-500" />
      </div>
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
      <p className="text-xs text-muted-foreground mt-2">{hint}</p>
    </div>
  );
}

// Course Table
function CourseTable({
  courses,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onView,
  onEdit,
  onDelete,
  onSort,
  sortBy,
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted/30">
          <tr>
            <th className="px-6 py-4 text-left">
              <input
                type="checkbox"
                checked={
                  selectedIds.length === courses.length && courses.length > 0
                }
                onChange={onToggleSelectAll}
                className="rounded border-border accent-[#206380]"
              />
            </th>
            <th
              className="px-6 py-4 text-left cursor-pointer"
              onClick={() => onSort("title")}
            >
              Title{" "}
              {sortBy.field === "title" && (sortBy.order === "asc" ? "↑" : "↓")}
            </th>
            <th className="px-6 py-4 text-left">Instructor</th>
            <th
              className="px-6 py-4 text-left cursor-pointer"
              onClick={() => onSort("students")}
            >
              Students{" "}
              {sortBy.field === "students" &&
                (sortBy.order === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="px-6 py-4 text-left cursor-pointer"
              onClick={() => onSort("revenue")}
            >
              Revenue{" "}
              {sortBy.field === "revenue" &&
                (sortBy.order === "asc" ? "↑" : "↓")}
            </th>
            <th className="px-6 py-4 text-left">Rating</th>
            <th className="px-6 py-4 text-left">Status</th>
            <th
              className="px-6 py-4 text-left cursor-pointer"
              onClick={() => onSort("createdDate")}
            >
              Created{" "}
              {sortBy.field === "createdDate" &&
                (sortBy.order === "asc" ? "↑" : "↓")}
            </th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c) => (
            <tr
              key={c.id}
              className="border-t border-border hover:bg-muted/20 transition-colors"
            >
              <td className="px-6 py-4">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(c.id)}
                  onChange={() => onToggleSelect(c.id)}
                  className="rounded border-border accent-[#206380]"
                />
              </td>
              <td className="px-6 py-4 font-medium">{c.title}</td>
              <td className="px-6 py-4 text-muted-foreground">
                {c.instructor}
              </td>
              <td className="px-6 py-4">{c.students}</td>
              <td className="px-6 py-4">{formatCurrency(c.revenue)}</td>
              <td className="px-6 py-4">★ {c.rating}</td>
              <td className="px-6 py-4">
                <StatusBadge status={c.status} />
              </td>
              <td className="px-6 py-4 text-muted-foreground">
                {new Date(c.createdDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-right flex gap-2 justify-end">
                <button
                  onClick={() => onView(c)}
                  className="p-2 hover:bg-muted rounded-md"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onEdit(c)}
                  className="p-2 hover:bg-muted rounded-md"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(c.id)}
                  className="p-2 hover:bg-rose-500/10 rounded-md"
                >
                  <Trash2 className="w-4 h-4 text-rose-600" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Course Grid
function CourseGrid({ courses, onView, onEdit, onDelete }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {courses.map((c) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="group rounded-2xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden hover:border-[#206380]/50 hover:shadow-xl transition-all duration-300"
          >
            <div className="h-32 bg-gradient-to-br from-[#206380] to-[#1b5666] relative">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold">{c.title}</h3>
                <p className="text-sm opacity-90">{c.instructor}</p>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <StatusBadge status={c.status} />
                <span className="text-xs text-muted-foreground">
                  {c.category}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold">{c.students}</p>
                  <p className="text-xs text-muted-foreground">Students</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {formatCurrency(c.revenue)}
                  </p>
                  <p className="text-xs text-muted-foreground">Revenue</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">★ {c.rating}</p>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Progress</span>
                  <span>{c.progress}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#206380] to-[#1b5666] rounded-full transition-all"
                    style={{ width: `${c.progress}%` }}
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-4 border-t border-border">
                <button
                  onClick={() => onView(c)}
                  className="flex-1 py-2 border border-border rounded-md hover:bg-muted transition text-sm flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" /> View
                </button>
                <button
                  onClick={() => onEdit(c)}
                  className="flex-1 py-2 bg-gradient-to-r from-[#206380] to-[#1b5666] text-white rounded-md text-sm flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={() => onDelete(c.id)}
                  className="p-2 border border-border rounded-md hover:bg-rose-500/10 hover:text-rose-600 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Status Badge
function StatusBadge({ status }) {
  const styles = {
    active: "bg-emerald-500/10 text-emerald-600",
    draft: "bg-amber-500/10 text-amber-600",
    archived: "bg-gray-500/10 text-gray-600",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        styles[status] || styles.draft
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// Add/Edit Modal
function AddEditCourseModal({ course, onClose, onSave }) {
  const [form, setForm] = useState(
    course || {
      title: "",
      instructor: "",
      category: "Quran Studies",
      price: 0,
      status: "draft",
    }
  );

  const handleSave = () => {
    onSave(form);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-background rounded-2xl shadow-2xl max-w-2xl w-full p-8 border border-border"
        >
          <h2 className="text-2xl font-bold mb-6">
            {course ? "Edit Course" : "Create New Course"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Instructor
              </label>
              <input
                value={form.instructor}
                onChange={(e) =>
                  setForm({ ...form, instructor: e.target.value })
                }
                className="w-full px-4 py-3 border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-lg"
              >
                <option>Quran Studies</option>
                <option>Fiqh</option>
                <option>Arabic Language</option>
                <option>Islamic History</option>
                <option>General</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Price ($)
              </label>
              <input
                type="number"
                value={form.price}
                onChange={(e) =>
                  setForm({
                    ...form,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full px-4 py-3 border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-lg"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-8">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-border rounded-lg hover:bg-muted"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-gradient-to-r from-[#206380] to-[#1b5666] text-white rounded-lg flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5" /> {course ? "Update" : "Create"}{" "}
              Course
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// View Modal
function ViewCourseModal({ course, onClose }) {
  if (!course) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-card rounded-3xl shadow-2xl max-w-2xl w-full p-10 border border-border"
        >
          <h2 className="text-3xl font-bold mb-8">{course.title}</h2>
          <div className="grid grid-cols-2 gap-8 text-lg">
            <div>
              <strong>Instructor:</strong> {course.instructor}
            </div>
            <div>
              <strong>Category:</strong> {course.category}
            </div>
            <div>
              <strong>Price:</strong> {formatCurrency(course.price)}
            </div>
            <div>
              <strong>Status:</strong> <StatusBadge status={course.status} />
            </div>
            <div>
              <strong>Students:</strong> {course.students}
            </div>
            <div>
              <strong>Revenue:</strong> {formatCurrency(course.revenue)}
            </div>
            <div>
              <strong>Rating:</strong> ★ {course.rating}
            </div>
            <div>
              <strong>Progress:</strong> {course.progress}%
            </div>
          </div>
          <button
            onClick={onClose}
            className="mt-10 w-full py-4 bg-gradient-to-r from-[#206380] to-[#1b5666] text-white rounded-xl font-semibold"
          >
            Close
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Delete Confirm
function DeleteConfirm({ id, onClose, onConfirm }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-background rounded-2xl shadow-2xl max-w-sm w-full p-8 border border-border text-center"
        >
          <Trash2 className="w-16 h-16 text-rose-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-3">Delete Course?</h3>
          <p className="text-muted-foreground mb-6">
            This action cannot be undone.
          </p>
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 border border-border rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(id)}
              className="flex-1 py-3 bg-rose-600 text-white rounded-lg"
            >
              Delete
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Bulk Confirm
function BulkConfirm({ action, count, onClose, onConfirm }) {
  const title =
    action === "delete"
      ? "Delete"
      : action === "publish"
      ? "Publish"
      : action === "unpublish"
      ? "Unpublish"
      : "Archive";
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-background rounded-2xl shadow-2xl max-w-sm w-full p-8 border border-border text-center"
        >
          <h3 className="text-xl font-bold mb-3">
            {title} {count} Courses?
          </h3>
          <p className="text-muted-foreground mb-6">
            This will affect selected courses.
          </p>
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 border border-border rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3 bg-gradient-to-r from-[#206380] to-[#1b5666] text-white rounded-lg"
            >
              Confirm
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
