"use client";

import { useState, useMemo } from "react";
import DashboardShell from "@/components/layout/DashobardShell";
import {
  Search,
  Plus,
  MoreVertical,
  Users,
  Trash2,
  Eye,
  Download,
  Upload,
  Mail,
  List,
  Grid3X3,
  Edit2,
  X,
  CheckCircle,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Papa from "papaparse"; // For CSV import/export

const PRIMARY = "#206380";

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function downloadCSV(data, filename = "instructors.csv") {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function InstructorsPage() {
  const [instructors, setInstructors] = useState([
    {
      id: 1,
      name: "Dr. Hassan Ahmed",
      email: "hassan.ahmed@academy.com",
      courses: 3,
      students: 368,
      rating: 4.9,
      status: "active",
      joinDate: "2023-09-10",
      salary: 3500,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: 2,
      name: "Ms. Amina Khan",
      email: "amina.khan@academy.com",
      courses: 2,
      students: 156,
      rating: 4.7,
      status: "active",
      joinDate: "2023-10-15",
      salary: 2800,
      color: "from-emerald-500 to-teal-500",
    },
    {
      id: 3,
      name: "Prof. Mohammed Ali",
      email: "m.ali@academy.com",
      courses: 4,
      students: 312,
      rating: 4.8,
      status: "active",
      joinDate: "2023-08-05",
      salary: 4200,
      color: "from-violet-500 to-purple-500",
    },
    {
      id: 4,
      name: "Dr. Fatima Hassan",
      email: "fatima.hassan@academy.com",
      courses: 2,
      students: 124,
      rating: 4.6,
      status: "inactive",
      joinDate: "2023-11-20",
      salary: 2500,
      color: "from-orange-500 to-red-500",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // grid | table
  const [selectedIds, setSelectedIds] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(null);
  const [showViewModal, setShowViewModal] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null); // single delete
  const [showBulkConfirm, setShowBulkConfirm] = useState(false); // bulk actions
  const [bulkAction, setBulkAction] = useState(""); // delete | activate | deactivate | email
  const [sortBy, setSortBy] = useState({ field: "name", order: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Derived
  const filteredInstructors = useMemo(() => {
    let ins = instructors.filter(
      (instructor) =>
        (instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          instructor.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter === "all" || instructor.status === statusFilter)
    );
    // Sorting
    ins.sort((a, b) => {
      let valA = a[sortBy.field];
      let valB = b[sortBy.field];
      if (sortBy.field === "joinDate") {
        valA = new Date(valA);
        valB = new Date(valB);
      }
      if (sortBy.order === "asc") return valA > valB ? 1 : -1;
      return valA < valB ? 1 : -1;
    });
    return ins;
  }, [instructors, searchTerm, statusFilter, sortBy]);

  const paginatedInstructors = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredInstructors.slice(start, start + itemsPerPage);
  }, [filteredInstructors, currentPage]);

  const totalPages = Math.ceil(filteredInstructors.length / itemsPerPage);

  const totalInstructors = instructors.length;
  const activeCount = instructors.filter((i) => i.status === "active").length;
  const inactiveCount = totalInstructors - activeCount;
  const avgRating = (
    instructors.reduce((sum, i) => sum + i.rating, 0) / totalInstructors || 0
  ).toFixed(1);
  const totalStudents = instructors.reduce((sum, i) => sum + i.students, 0);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedIds(
      selectedIds.length === paginatedInstructors.length
        ? []
        : paginatedInstructors.map((i) => i.id)
    );
  };

  const handleBulkAction = (action) => {
    if (selectedIds.length) {
      setBulkAction(action);
      setShowBulkConfirm(true);
    }
  };

  const confirmBulkAction = () => {
    let updated = [...instructors];
    if (bulkAction === "delete") {
      updated = updated.filter((i) => !selectedIds.includes(i.id));
    } else if (bulkAction === "activate" || bulkAction === "deactivate") {
      const newStatus = bulkAction === "activate" ? "active" : "inactive";
      updated = updated.map((i) =>
        selectedIds.includes(i.id) ? { ...i, status: newStatus } : i
      );
    } else if (bulkAction === "email") {
      // Simulate sending email
      const emails = selectedIds
        .map((id) => instructors.find((i) => i.id === id).email)
        .join(",");
      window.location.href = `mailto:${emails}?subject=Important Update&body=Hello,`;
    }
    setInstructors(updated);
    setSelectedIds([]);
    setShowBulkConfirm(false);
    setBulkAction("");
  };

  const addInstructor = (newIns) => {
    const id = Math.max(...instructors.map((i) => i.id)) + 1;
    setInstructors([
      ...instructors,
      { ...newIns, id, color: getRandomColor() },
    ]);
    setShowAddModal(false);
  };

  const updateInstructor = (updated) => {
    setInstructors(instructors.map((i) => (i.id === updated.id ? updated : i)));
    setShowEditModal(null);
  };

  const deleteInstructor = (id) => {
    setInstructors(instructors.filter((i) => i.id !== id));
    setShowDeleteConfirm(null);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const newIns = results.data.map((row, idx) => ({
          ...row,
          id: instructors.length + idx + 1,
          courses: parseInt(row.courses) || 0,
          students: parseInt(row.students) || 0,
          rating: parseFloat(row.rating) || 0,
          salary: parseInt(row.salary) || 0,
          color: getRandomColor(),
        }));
        setInstructors([...instructors, ...newIns]);
      },
    });
  };

  const getRandomColor = () => {
    const colors = [
      "from-blue-500 to-cyan-500",
      "from-emerald-500 to-teal-500",
      "from-violet-500 to-purple-500",
      "from-orange-500 to-red-500",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
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
              Instructors Management
            </h1>
            <p className="mt-2 text-muted-foreground">
              Comprehensive tools for instructor maintenance and analytics.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-[#206380] to-[#1b5666] text-white rounded-md font-medium shadow-md hover:shadow-lg hover:brightness-105 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Instructor
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
              onClick={() => downloadCSV(instructors)}
              className="px-4 py-2.5 border border-border rounded-md hover:bg-muted transition font-medium flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </div>

        {/* Analytics KPI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-10">
          <KPICard
            title="Total Instructors"
            value={totalInstructors}
            hint="All time"
            trend="up"
          />
          <KPICard
            title="Active"
            value={activeCount}
            hint="Currently active"
            trend="up"
          />
          <KPICard
            title="Inactive"
            value={inactiveCount}
            hint="On leave/suspended"
            trend="down"
          />
          <KPICard
            title="Avg Rating"
            value={avgRating}
            hint="Out of 5"
            trend="up"
          />
          <KPICard
            title="Total Students"
            value={totalStudents}
            hint="Across all"
            trend="up"
          />
        </div>

        {/* Search, Filters, View Toggle */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or email..."
              className="pl-10 pr-4 py-2.5 rounded-md border border-border bg-background text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#206380]/50 transition"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#206380]/50 transition"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <div className="flex rounded-md border border-border bg-background p-1">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-sm transition ${
                viewMode === "table"
                  ? "bg-[#206380] text-white"
                  : "hover:bg-muted"
              }`}
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-sm transition ${
                viewMode === "grid"
                  ? "bg-[#206380] text-white"
                  : "hover:bg-muted"
              }`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Instructors List */}
        {viewMode === "table" && (
          <InstructorTable
            instructors={paginatedInstructors}
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
          <InstructorGrid
            instructors={paginatedInstructors}
            onView={setShowViewModal}
            onEdit={setShowEditModal}
            onDelete={setShowDeleteConfirm}
          />
        )}

        {/* Pagination */}
        <div className="mt-6 flex justify-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(1)}
            className="px-3 py-1 border border-border rounded-md disabled:opacity-50 hover:bg-muted"
          >
            First
          </button>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-3 py-1 border border-border rounded-md disabled:opacity-50 hover:bg-muted"
          >
            Prev
          </button>
          <span className="px-3 py-1">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-3 py-1 border border-border rounded-md disabled:opacity-50 hover:bg-muted"
          >
            Next
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(totalPages)}
            className="px-3 py-1 border border-border rounded-md disabled:opacity-50 hover:bg-muted"
          >
            Last
          </button>
        </div>

        {selectedIds.length > 0 && (
          <div className="mt-6 p-4 bg-card border border-border rounded-md flex justify-between items-center">
            <span>{selectedIds.length} selected</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction("delete")}
                className="px-4 py-2 bg-rose-500 text-white rounded-md flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
              <button
                onClick={() => handleBulkAction("activate")}
                className="px-4 py-2 bg-emerald-500 text-white rounded-md flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" /> Activate
              </button>
              <button
                onClick={() => handleBulkAction("deactivate")}
                className="px-4 py-2 bg-amber-500 text-white rounded-md flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" /> Deactivate
              </button>
              <button
                onClick={() => handleBulkAction("email")}
                className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center gap-2"
              >
                <Mail className="w-4 h-4" /> Email
              </button>
            </div>
          </div>
        )}

        {/* Modals */}
        {showAddModal && (
          <AddEditModal
            onClose={() => setShowAddModal(false)}
            onSave={addInstructor}
          />
        )}
        {showEditModal && (
          <AddEditModal
            instructor={showEditModal}
            onClose={() => setShowEditModal(null)}
            onSave={updateInstructor}
          />
        )}
        {showViewModal && (
          <ViewModal
            instructor={showViewModal}
            onClose={() => setShowViewModal(null)}
          />
        )}
        {showDeleteConfirm && (
          <DeleteConfirm
            id={showDeleteConfirm}
            onClose={() => setShowDeleteConfirm(null)}
            onConfirm={deleteInstructor}
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
function KPICard({ title, value, hint, trend = "up" }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
        <div
          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm ${
            trend === "up"
              ? "bg-emerald-500/10 text-emerald-600"
              : "bg-rose-500/10 text-rose-600"
          }`}
        >
          {trend === "up" ? (
            <ArrowUpRight className="w-4 h-4" />
          ) : (
            <ArrowDownRight className="w-4 h-4" />
          )}
          <span className="text-xs">{hint}</span>
        </div>
      </div>
    </div>
  );
}

// Instructor Table
function InstructorTable({
  instructors,
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
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/30 text-left text-xs text-muted-foreground font-semibold">
            <th className="px-6 py-4">
              <input
                type="checkbox"
                checked={
                  selectedIds.length === instructors.length &&
                  instructors.length > 0
                }
                onChange={onToggleSelectAll}
                className="rounded border-border accent-[#206380]"
              />
            </th>
            <th
              className="px-6 py-4 cursor-pointer"
              onClick={() => onSort("name")}
            >
              Name{" "}
              {sortBy.field === "name" && (sortBy.order === "asc" ? "↑" : "↓")}
            </th>
            <th className="px-6 py-4">Email</th>
            <th
              className="px-6 py-4 cursor-pointer"
              onClick={() => onSort("courses")}
            >
              Courses{" "}
              {sortBy.field === "courses" &&
                (sortBy.order === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="px-6 py-4 cursor-pointer"
              onClick={() => onSort("students")}
            >
              Students{" "}
              {sortBy.field === "students" &&
                (sortBy.order === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="px-6 py-4 cursor-pointer"
              onClick={() => onSort("rating")}
            >
              Rating{" "}
              {sortBy.field === "rating" &&
                (sortBy.order === "asc" ? "↑" : "↓")}
            </th>
            <th className="px-6 py-4">Status</th>
            <th
              className="px-6 py-4 cursor-pointer"
              onClick={() => onSort("joinDate")}
            >
              Join Date{" "}
              {sortBy.field === "joinDate" &&
                (sortBy.order === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="px-6 py-4 cursor-pointer"
              onClick={() => onSort("salary")}
            >
              Salary{" "}
              {sortBy.field === "salary" &&
                (sortBy.order === "asc" ? "↑" : "↓")}
            </th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {instructors.map((i) => (
            <tr
              key={i.id}
              className="border-b border-border hover:bg-muted/20 transition-colors"
            >
              <td className="px-6 py-4">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(i.id)}
                  onChange={() => onToggleSelect(i.id)}
                  className="rounded border-border accent-[#206380]"
                />
              </td>
              <td className="px-6 py-4 font-medium">{i.name}</td>
              <td className="px-6 py-4 text-muted-foreground">{i.email}</td>
              <td className="px-6 py-4">{i.courses}</td>
              <td className="px-6 py-4">{i.students}</td>
              <td className="px-6 py-4">{i.rating}</td>
              <td className="px-6 py-4">
                <StatusBadge status={i.status} />
              </td>
              <td className="px-6 py-4 text-muted-foreground">
                {formatDate(i.joinDate)}
              </td>
              <td className="px-6 py-4">{`$${i.salary}/month`}</td>
              <td className="px-6 py-4 text-right flex gap-2 justify-end">
                <button
                  onClick={() => onView(i)}
                  className="p-2 hover:bg-muted rounded-md transition"
                >
                  <Eye className="w-4 h-4 text-muted-foreground" />
                </button>
                <button
                  onClick={() => onEdit(i)}
                  className="p-2 hover:bg-muted rounded-md transition"
                >
                  <Edit2 className="w-4 h-4 text-muted-foreground" />
                </button>
                <button
                  onClick={() => onDelete(i.id)}
                  className="p-2 hover:bg-muted rounded-md transition"
                >
                  <Trash2 className="w-4 h-4 text-muted-foreground" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Instructor Grid
function InstructorGrid({ instructors, onView, onEdit, onDelete }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {instructors.map((i) => (
          <motion.div
            key={i.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6 hover:border-[#206380]/50 hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                {i.name}
              </h3>
              <StatusBadge status={i.status} />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Email: {i.email}
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Courses</span>
                <span className="font-medium">{i.courses}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Students</span>
                <span className="font-medium">{i.students}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Rating</span>
                <span className="font-medium">{i.rating}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Join Date</span>
                <span className="font-medium">{formatDate(i.joinDate)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Salary</span>
                <span className="font-medium">{`$${i.salary}/month`}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => onView(i)}
                className="flex-1 px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-muted transition flex items-center gap-2 justify-center"
              >
                <Eye className="w-4 h-4" /> View
              </button>
              <button
                onClick={() => onEdit(i)}
                className="flex-1 px-4 py-2 text-sm font-medium bg-gradient-to-r from-[#206380] to-[#1b5666] text-white rounded-md hover:shadow-md transition flex items-center gap-2 justify-center"
              >
                <Edit2 className="w-4 h-4" /> Edit
              </button>
              <button
                onClick={() => onDelete(i.id)}
                className="px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-rose-500/10 hover:text-rose-600 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Status Badge
function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
        status === "active"
          ? "bg-emerald-500/10 text-emerald-600"
          : "bg-rose-500/10 text-rose-600"
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// Add/Edit Modal
function AddEditModal({ instructor, onClose, onSave }) {
  const [form, setForm] = useState(
    instructor || {
      name: "",
      email: "",
      courses: 0,
      students: 0,
      rating: 0,
      status: "active",
      joinDate: new Date().toISOString().split("T")[0],
      salary: 0,
    }
  );

  const handleSubmit = () => {
    onSave(form);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-background rounded-2xl shadow-2xl max-w-lg w-full p-8 border border-border"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {instructor ? "Edit Instructor" : "Add Instructor"}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Courses</label>
              <input
                type="number"
                value={form.courses}
                onChange={(e) =>
                  setForm({ ...form, courses: parseInt(e.target.value) || 0 })
                }
                className="w-full px-4 py-2 border border-border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Students</label>
              <input
                type="number"
                value={form.students}
                onChange={(e) =>
                  setForm({ ...form, students: parseInt(e.target.value) || 0 })
                }
                className="w-full px-4 py-2 border border-border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Rating</label>
              <input
                type="number"
                step="0.1"
                value={form.rating}
                onChange={(e) =>
                  setForm({ ...form, rating: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-4 py-2 border border-border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-md"
              >
                <option>active</option>
                <option>inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Join Date
              </label>
              <input
                type="date"
                value={form.joinDate}
                onChange={(e) => setForm({ ...form, joinDate: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Salary</label>
              <input
                type="number"
                value={form.salary}
                onChange={(e) =>
                  setForm({ ...form, salary: parseInt(e.target.value) || 0 })
                }
                className="w-full px-4 py-2 border border-border rounded-md"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-border rounded-md hover:bg-muted"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-gradient-to-r from-[#206380] to-[#1b5666] text-white rounded-md flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" /> Save
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// View Modal
function ViewModal({ instructor, onClose }) {
  if (!instructor) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-background rounded-2xl shadow-2xl max-w-md w-full p-8 border border-border"
        >
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold">Instructor Details</h2>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name</span>
              <span className="font-medium">{instructor.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium">{instructor.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Courses</span>
              <span className="font-medium">{instructor.courses}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Students</span>
              <span className="font-medium">{instructor.students}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rating</span>
              <span className="font-medium">{instructor.rating}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <StatusBadge status={instructor.status} />
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Join Date</span>
              <span className="font-medium">
                {formatDate(instructor.joinDate)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Salary</span>
              <span className="font-medium">{`$${instructor.salary}/month`}</span>
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-[#206380] to-[#1b5666] text-white rounded-lg font-medium"
            >
              Close
            </button>
          </div>
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
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-background rounded-2xl shadow-2xl max-w-sm w-full p-8 border border-border"
        >
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-rose-500/10 flex items-center justify-center">
              <Trash2 className="w-8 h-8 text-rose-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">Confirm Delete</h3>
            <p className="text-muted-foreground mb-6">
              Delete this instructor? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={onClose}
                className="px-6 py-3 border border-border rounded-lg hover:bg-muted transition"
              >
                Cancel
              </button>
              <button
                onClick={() => onConfirm(id)}
                className="px-6 py-3 bg-rose-600 text-white rounded-lg font-medium hover:shadow-lg transition"
              >
                Delete
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Bulk Confirm
function BulkConfirm({ action, count, onClose, onConfirm }) {
  const actionText =
    action === "delete"
      ? "Delete"
      : action === "activate"
      ? "Activate"
      : action === "deactivate"
      ? "Deactivate"
      : "Email";
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-background rounded-2xl shadow-2xl max-w-sm w-full p-8 border border-border"
        >
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <Users className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">
              Confirm Bulk {actionText}
            </h3>
            <p className="text-muted-foreground mb-6">
              {actionText} {count} selected instructors?
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={onClose}
                className="px-6 py-3 border border-border rounded-lg hover:bg-muted transition"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-6 py-3 bg-gradient-to-r from-[#206380] to-[#1b5666] text-white rounded-lg font-medium hover:shadow-lg transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
