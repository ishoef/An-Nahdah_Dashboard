"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  Search,
  Plus,
  Download,
  Mail,
  MessageCircle,
  Trash2,
  Eye,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Settings,
  X,
  Check,
  AlertCircle,
  Clock,
  DollarSign,
  UserCheck,
  UserX,
  Calendar,
  Tag,
  MoreVertical,
  Phone,
  Edit3,
  Archive,
  Users,
} from "lucide-react";
import { format } from "date-fns";
import DashboardShell from "@/components/layout/DashobardShell";

// Primary color
const PRIMARY = "#206380";

const coursesData = [
  {
    id: 1,
    title: "Complete Arabic Grammar Mastery",
    batches: ["Batch 1", "Batch 2", "Batch 3"],
  },
  {
    id: 2,
    title: "Quranic Arabic – Beginner to Advanced",
    batches: ["Batch 1", "Batch 4"],
  },
  {
    id: 3,
    title: "Tajweed Intensive Course",
    batches: ["Batch 2", "Batch 3"],
  },
  {
    id: 4,
    title: "Islamic Studies Diploma",
    batches: ["Batch 1"],
  },
  {
    id: 5,
    title: "Fiqh Essentials Program",
    batches: ["Batch 1", "Batch 2"],
  },
];

const initialStudents = [
  {
    id: 101,
    name: "Abdullah Rahman",
    email: "abdullah@example.com",
    phone: "+8801711001100",
    courseId: 1,
    batch: "Batch 1",
    progress: 75,
    paid: true,
    status: "active",
    joinDate: "2024-10-12",
  },
  {
    id: 102,
    name: "Hasan Ahmed",
    email: "hasan@example.com",
    phone: "+8801711223344",
    courseId: 2,
    batch: "Batch 4",
    progress: 20,
    paid: false,
    status: "pending",
    joinDate: "2024-10-05",
  },
  {
    id: 103,
    name: "Mahmudul Hasan",
    email: "mahmud@example.com",
    phone: "+8801700556622",
    courseId: 3,
    batch: "Batch 3",
    progress: 40,
    paid: true,
    status: "active",
    joinDate: "2024-09-22",
  },
  {
    id: 104,
    name: "Yusuf Karim",
    email: "yusuf@example.com",
    phone: "+8801811998877",
    courseId: 4,
    batch: "Batch 1",
    progress: 10,
    paid: false,
    status: "inactive",
    joinDate: "2024-08-10",
  },
  {
    id: 105,
    name: "Sakib Chowdhury",
    email: "sakib@example.com",
    phone: "+8801911334455",
    courseId: 5,
    batch: "Batch 2",
    progress: 95,
    paid: true,
    status: "active",
    joinDate: "2024-10-15",
  },
  {
    id: 106,
    name: "Farhan Siddique",
    email: "farhan@example.com",
    phone: "+8801999887766",
    courseId: 1,
    batch: "Batch 3",
    progress: 60,
    paid: false,
    status: "pending",
    joinDate: "2024-10-01",
  },
];

function fmtDate(d) {
  return d ? format(new Date(d), "dd MMM yyyy") : "—";
}

function exportCSV(rows = [], filename = "students.csv") {
  if (!rows.length) return;
  const keys = Object.keys(rows[0]);
  const csv = [
    keys.join(","),
    ...rows.map((r) =>
      keys.map((k) => `"${String(r[k] ?? "").replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function StudentsPage() {
  const [students, setStudents] = useState(initialStudents);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [batchFilter, setBatchFilter] = useState("all");
  const [paidFilter, setPaidFilter] = useState("all");
  const [sortBy, setSortBy] = useState({ key: "joinDate", dir: "desc" });
  const [pageSize, setPageSize] = useState(15);
  const [page, setPage] = useState(1);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showEnroll, setShowEnroll] = useState(false);
  const [showColumnMenu, setShowColumnMenu] = useState(false);

  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    contact: true,
    courseBatch: true,
    progress: true,
    joined: true,
    lastActive: true,
    payment: true,
    status: true,
    actions: true,
  });

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const batchesForCourse = useMemo(() => {
    if (courseFilter === "all") {
      return Array.from(new Set(students.map((s) => s.batch))).sort();
    }
    const course = coursesData.find((c) => String(c.id) === courseFilter);
    return course?.batches || [];
  }, [courseFilter, students]);

  const filteredAndSorted = useMemo(() => {
    let filtered = students.filter((s) => {
      if (statusFilter !== "all" && s.status !== statusFilter) return false;
      if (courseFilter !== "all" && String(s.courseId) !== courseFilter)
        return false;
      if (batchFilter !== "all" && s.batch !== batchFilter) return false;
      if (paidFilter === "paid" && !s.paid) return false;
      if (paidFilter === "free" && s.paid) return false;

      const q = debouncedSearch.toLowerCase();
      if (!q) return true;
      return (
        (s.name || "").toLowerCase().includes(q) ||
        (s.email || "").toLowerCase().includes(q) ||
        (s.phone || "").includes(q)
      );
    });

    // Sorting
    filtered.sort((a, b) => {
      let av = a[sortBy.key];
      let bv = b[sortBy.key];
      if (sortBy.key === "joinDate") {
        av = new Date(av).getTime();
        bv = new Date(bv).getTime();
      }
      if (av === bv) return 0;
      if (sortBy.dir === "asc") return av > bv ? 1 : -1;
      return av < bv ? 1 : -1;
    });

    return filtered;
  }, [
    students,
    debouncedSearch,
    statusFilter,
    courseFilter,
    batchFilter,
    paidFilter,
    sortBy,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAndSorted.length / pageSize)
  );
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  const pageItems = filteredAndSorted.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const stats = {
    total: students.length,
    active: students.filter((s) => s.status === "active").length,
    pending: students.filter((s) => s.status === "pending").length,
    inactive: students.filter((s) => s.status === "inactive").length,
    paid: students.filter((s) => s.paid).length,
    free: students.filter((s) => !s.paid).length,
  };

  const toggleSelect = (id) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAllVisible = () => {
    const visibleIds = pageItems.map((s) => s.id);
    const allVisibleSelected = visibleIds.every((id) =>
      selectedStudents.includes(id)
    );
    if (allVisibleSelected) {
      // remove them
      setSelectedStudents((prev) =>
        prev.filter((id) => !visibleIds.includes(id))
      );
    } else {
      setSelectedStudents((prev) => {
        const set = new Set(prev);
        visibleIds.forEach((id) => set.add(id));
        return Array.from(set);
      });
    }
  };

  const bulkAction = useCallback(
    (action) => {
      if (selectedStudents.length === 0) return alert("No students selected");

      if (action === "delete") {
        if (!confirm(`Delete ${selectedStudents.length} students?`)) return;
        setStudents((s) => s.filter((x) => !selectedStudents.includes(x.id)));
      } else if (action === "paid") {
        setStudents((s) =>
          s.map((x) =>
            selectedStudents.includes(x.id) ? { ...x, paid: true } : x
          )
        );
      } else if (action === "free") {
        setStudents((s) =>
          s.map((x) =>
            selectedStudents.includes(x.id) ? { ...x, paid: false } : x
          )
        );
      } else if (action === "active") {
        setStudents((s) =>
          s.map((x) =>
            selectedStudents.includes(x.id) ? { ...x, status: "active" } : x
          )
        );
      }
      setSelectedStudents([]);
    },
    [selectedStudents]
  );

  const exportData = (type) => {
    let data = [];
    if (type === "selected" && selectedStudents.length > 0) {
      data = students.filter((s) => selectedStudents.includes(s.id));
    } else if (type === "filtered") {
      data = filteredAndSorted;
    } else {
      data = students;
    }

    const rows = data.map((s) => {
      const course = coursesData.find((c) => c.id === s.courseId);
      return {
        Name: s.name,
        Email: s.email,
        Phone: s.phone,
        Course: course?.title || "",
        Batch: s.batch,
        "Payment Status": s.paid ? "Paid" : "Free",
        Status: s.status
          ? s.status.charAt(0).toUpperCase() + s.status.slice(1)
          : "",
        Progress: `${s.progress}%`,
        Joined: fmtDate(s.joinDate),
      };
    });

    exportCSV(
      rows,
      `students-${type}-${new Date().toISOString().slice(0, 10)}.csv`
    );
  };

  const SortHeader = ({ field, children }) => (
    <button
      onClick={() =>
        setSortBy((s) => ({
          key: field,
          dir: s.key === field ? (s.dir === "asc" ? "desc" : "asc") : "desc",
        }))
      }
      className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider hover:text-foreground transition"
    >
      {children}
      {sortBy.key === field && <span>{sortBy.dir === "asc" ? "↑" : "↓"}</span>}
    </button>
  );

  const startIndex = filteredAndSorted.length ? (page - 1) * pageSize + 1 : 0;

  return (
    <DashboardShell>
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="max-w-screen-2xl mx-auto p-4 space-y-4">
          {/* Header Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              {
                label: "Total",
                value: stats.total,
                icon: Users,
                color: "bg-blue-500",
              },
              {
                label: "Active",
                value: stats.active,
                icon: UserCheck,
                color: "bg-emerald-500",
              },
              {
                label: "Pending",
                value: stats.pending,
                icon: Clock,
                color: "bg-amber-500",
              },
              {
                label: "Inactive",
                value: stats.inactive,
                icon: UserX,
                color: "bg-red-500",
              },
              {
                label: "Paid",
                value: stats.paid,
                icon: DollarSign,
                color: "bg-teal-600",
              },
              {
                label: "Free",
                value: stats.free,
                icon: Tag,
                color: "bg-purple-500",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {item.label}
                    </p>
                    <p className="text-3xl font-bold mt-1">{item.value}</p>
                  </div>
                  <div className={`${item.color} p-3 rounded-xl`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Toolbar */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
            <div className="flex flex-col lg:flex-row gap-4 items-start justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search name, email, phone..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setPage(1);
                    }}
                    className="pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-nhd-700  w-80"
                  />
                </div>

                <select
                  value={courseFilter}
                  onChange={(e) => {
                    setCourseFilter(e.target.value);
                    setBatchFilter("all");
                    setPage(1);
                  }}
                  className="px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700"
                >
                  <option value="all">All Courses</option>
                  {coursesData.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>

                <select
                  value={batchFilter}
                  onChange={(e) => {
                    setBatchFilter(e.target.value);
                    setPage(1);
                  }}
                  className="px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700"
                >
                  <option value="all">All Batches</option>
                  {batchesForCourse.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                  className="px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                </select>

                <select
                  value={paidFilter}
                  onChange={(e) => {
                    setPaidFilter(e.target.value);
                    setPage(1);
                  }}
                  className="px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700"
                >
                  <option value="all">All Payment</option>
                  <option value="paid">Paid Only</option>
                  <option value="free">Free Only</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowEnroll(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-nhd-700  text-white rounded-xl font-medium hover:bg-[#1a5169] transition"
                >
                  <Plus className="w-5 h-5" /> Enroll Student
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowColumnMenu(!showColumnMenu)}
                    className="p-2.5 border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                  {showColumnMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-4 z-10">
                      <p className="text-sm font-medium mb-3">
                        Visible Columns
                      </p>
                      {Object.entries(visibleColumns).map(([key, val]) => (
                        <label
                          key={key}
                          className="flex items-center gap-3 py-2"
                        >
                          <input
                            type="checkbox"
                            checked={val}
                            onChange={() =>
                              setVisibleColumns((p) => ({
                                ...p,
                                [key]: !p[key],
                              }))
                            }
                            className="w-4 h-4 text-nhd-700  rounded"
                          />
                          <span className="capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bulk Actions Bar */}
          {selectedStudents.length > 0 && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-center justify-between">
              <span className="font-medium">
                {selectedStudents.length} selected
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => exportData("selected")}
                  className="px-4 py-2 bg-white dark:bg-slate-700 rounded-lg border"
                >
                  Export Selected
                </button>
                <button
                  onClick={() => bulkAction("paid")}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg"
                >
                  Mark Paid
                </button>
                <button
                  onClick={() => bulkAction("free")}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg"
                >
                  Mark Free
                </button>
                <button
                  onClick={() => bulkAction("active")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Set Active
                </button>
                <button
                  onClick={() => bulkAction("delete")}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg"
                >
                  Delete
                </button>
                <button
                  onClick={() => setSelectedStudents([])}
                  className="px-4 py-2 border rounded-lg"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={
                          pageItems.length > 0 &&
                          pageItems.every((s) =>
                            selectedStudents.includes(s.id)
                          )
                        }
                        onChange={selectAllVisible}
                        className="w-4 h-4 rounded border-slate-300 text-nhd-700 "
                      />
                    </th>
                    {visibleColumns.name && (
                      <th className="px-6 py-4">
                        <SortHeader field="name">Student</SortHeader>
                      </th>
                    )}
                    {visibleColumns.contact && (
                      <th className="px-6 py-4">Contact</th>
                    )}
                    {visibleColumns.courseBatch && (
                      <th className="px-6 py-4">
                        <SortHeader field="courseId">Course / Batch</SortHeader>
                      </th>
                    )}
                    {visibleColumns.progress && (
                      <th className="px-6 py-4">
                        <SortHeader field="progress">Progress</SortHeader>
                      </th>
                    )}
                    {visibleColumns.joined && (
                      <th className="px-6 py-4">
                        <SortHeader field="joinDate">Joined</SortHeader>
                      </th>
                    )}
                    {visibleColumns.lastActive && (
                      <th className="px-6 py-4">Last Active</th>
                    )}
                    {visibleColumns.payment && (
                      <th className="px-6 py-4">Payment</th>
                    )}
                    {visibleColumns.status && (
                      <th className="px-6 py-4">
                        <SortHeader field="status">Status</SortHeader>
                      </th>
                    )}
                    {visibleColumns.actions && (
                      <th className="px-6 py-4 text-center">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {pageItems.map((student) => {
                    const course = coursesData.find(
                      (c) => c.id === student.courseId
                    );
                    const isSelected = selectedStudents.includes(student.id);
                    return (
                      <tr
                        key={student.id}
                        className={`hover:bg-slate-50 dark:hover:bg-slate-700/50 transition ${
                          isSelected ? "bg-nhd-700 /5" : ""
                        }`}
                      >
                        <td className="px-6 py-5">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(student.id)}
                            className="w-4 h-4 rounded border-slate-300 text-nhd-700 "
                          />
                        </td>

                        {visibleColumns.name && (
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                              {/* <div className="w-12 h-12 rounded-full bg-linear-to-br from-nhd-700  to-[#1a5169] text-white flex items-center justify-center font-bold text-lg">
                                {student.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div> */}
                              <div>
                                <div className="font-semibold">
                                  {student.name}
                                </div>
                                <div className="text-sm text-slate-500">
                                  ID: {student.id}
                                </div>
                              </div>
                            </div>
                          </td>
                        )}

                        {visibleColumns.contact && (
                          <td className="px-6 py-5">
                            <div className="space-y-1">
                              <div className="text-sm font-medium">
                                {student.email}
                              </div>
                              <div className="text-sm text-slate-500 flex items-center gap-2">
                                <Phone className="w-4 h-4" /> {student.phone}
                              </div>
                            </div>
                          </td>
                        )}

                        {visibleColumns.courseBatch && (
                          <td className="px-6 py-5">
                            <div>
                              <div className="font-medium text-nhd-700 ">
                                {course?.title || "—"}
                              </div>
                              <div className="text-sm text-slate-500">
                                Batch: {student.batch}
                              </div>
                            </div>
                          </td>
                        )}

                        {visibleColumns.progress && (
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-32 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                <div
                                  className="h-2 rounded-full bg-linear-to-r from-nhd-700  to-[#29a8d7]"
                                  style={{ width: `${student.progress}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium w-12 text-right">
                                {student.progress}%
                              </span>
                            </div>
                          </td>
                        )}

                        {visibleColumns.joined && (
                          <td className="px-6 py-5 text-sm">
                            {fmtDate(student.joinDate)}
                          </td>
                        )}

                        {visibleColumns.lastActive && (
                          <td className="px-6 py-5 text-sm text-slate-500">
                            2 days ago
                          </td>
                        )}

                        {visibleColumns.payment && (
                          <td className="px-6 py-5">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                student.paid
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-purple-100 text-purple-800"
                              }`}
                            >
                              {student.paid ? "Paid" : "Free"}
                            </span>
                          </td>
                        )}

                        {visibleColumns.status && (
                          <td className="px-6 py-5">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                student.status === "active"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : student.status === "pending"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {student.status
                                ? student.status.charAt(0).toUpperCase() +
                                  student.status.slice(1)
                                : ""}
                            </span>
                          </td>
                        )}

                        {visibleColumns.actions && (
                          <td className="px-6 py-5">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => setSelectedStudent(student)}
                                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <a
                                href={`mailto:${student.email}`}
                                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                              >
                                <Mail className="w-4 h-4" />
                              </a>
                              <a
                                href={`https://wa.me/${student.phone.replace(
                                  /[^0-9]/g,
                                  ""
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                              >
                                <MessageCircle className="w-4 h-4 text-green-600" />
                              </a>
                              <button
                                onClick={() => {
                                  if (!confirm("Delete this student?")) return;
                                  setStudents((s) =>
                                    s.filter((x) => x.id !== student.id)
                                  );
                                  setSelectedStudents((prev) =>
                                    prev.filter((id) => id !== student.id)
                                  );
                                }}
                                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
              <div className="flex items-center gap-4">
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  className="px-3 py-1.5 border rounded-lg text-sm"
                >
                  {[10, 15, 25, 50, 100].map((n) => (
                    <option key={n} value={n}>
                      {n} per page
                    </option>
                  ))}
                </select>
                <span className="text-sm text-slate-600">
                  Showing {startIndex}–
                  {Math.min(page * pageSize, filteredAndSorted.length)} of{" "}
                  {filteredAndSorted.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                  className="p-2 rounded-lg hover:bg-slate-200 disabled:opacity-50"
                >
                  <ChevronsLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg hover:bg-slate-200"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="px-4 py-2 bg-nhd-700  text-white rounded-lg text-sm font-medium">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg hover:bg-slate-200"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setPage(totalPages)}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg hover:bg-slate-200"
                >
                  <ChevronsRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Student Drawer */}
        {selectedStudent && (
          <div className="fixed inset-y-0 right-0 w-96 bg-white dark:bg-slate-800 shadow-2xl z-50 overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">{selectedStudent.name}</h2>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              {/* Detailed student view here */}
              <button className="mt-8 w-full py-3 bg-nhd-700  text-white rounded-xl font-medium">
                Send Message
              </button>
            </div>
          </div>
        )}

        {/* Enroll Modal */}
        {showEnroll && (
          <EnrollModal
            courses={coursesData}
            onClose={() => setShowEnroll(false)}
            onSubmit={(data) => {
              const maxId = students.length
                ? Math.max(...students.map((s) => s.id))
                : 0;
              const newId = maxId + 1;
              setStudents((s) => [
                { ...data, id: newId, progress: 0, status: "active" },
                ...s,
              ]);
              setShowEnroll(false);
            }}
          />
        )}
      </div>
    </DashboardShell>
  );
}

// Minimal EnrollModal (keeps design, self-contained)
function EnrollModal({ courses = [], onClose, onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    courseId: courses[0]?.id || null,
    batch: "",
    paid: false,
  });

  useEffect(() => {
    if (courses[0]) setForm((f) => ({ ...f, courseId: courses[0].id }));
  }, [courses]);

  const handleChange = (k) => (e) => {
    const val =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: val }));
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return alert("Name and email are required");
    onSubmit({ ...form, courseId: form.courseId });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <form
        onSubmit={submit}
        className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-96 shadow-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Enroll Student</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <input
            value={form.name}
            onChange={handleChange("name")}
            placeholder="Full name"
            className="w-full px-3 py-2 border rounded-lg"
          />
          <input
            value={form.email}
            onChange={handleChange("email")}
            placeholder="Email"
            className="w-full px-3 py-2 border rounded-lg"
          />
          <input
            value={form.phone}
            onChange={handleChange("phone")}
            placeholder="Phone"
            className="w-full px-3 py-2 border rounded-lg"
          />

          <select
            value={form.courseId}
            onChange={handleChange("courseId")}
            className="w-full px-3 py-2 border rounded-lg"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>

          <input
            value={form.batch}
            onChange={handleChange("batch")}
            placeholder="Batch"
            className="w-full px-3 py-2 border rounded-lg"
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.paid}
              onChange={handleChange("paid")}
            />{" "}
            Paid
          </label>

          <div className="flex gap-2 mt-3">
            <button
              type="submit"
              className="flex-1 py-2 bg-nhd-700  text-white rounded-xl"
            >
              Enroll
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border rounded-xl"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
