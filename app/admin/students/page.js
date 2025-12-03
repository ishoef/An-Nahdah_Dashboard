"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import DashboardShell from "@/components/layout/DashobardShell";
import {
  Search,
  Plus,
  MoreVertical,
  Mail,
  Trash2,
  Eye,
  Download,
  Users,
  Filter,
} from "lucide-react";

/* ---------------- demo courses (used for course/batch filters) ---------------- */
const coursesData = [
  {
    id: 1,
    title: "Tajweed Fundamentals",
    type: "paid",
    batches: ["2024-Nov-A", "2024-Dec-B", "2025-Jan-A"],
  },
  {
    id: 2,
    title: "Intro to Islamic Fiqh",
    type: "paid",
    batches: ["2024-Dec-A", "2025-Jan-B"],
  },
  {
    id: 3,
    title: "Advanced Arabic Grammar",
    type: "free",
    batches: ["2024-Nov-B", "2025-Feb-A"],
  },
  {
    id: 4,
    title: "Quranic Arabic Intensive",
    type: "paid",
    batches: ["2024-Dec-C", "2025-Jan-A"],
  },
  {
    id: 5,
    title: "Islamic History Part 1",
    type: "free",
    batches: ["2025-Feb-B"],
  },
  {
    id: 6,
    title: "Arabic Literature Basics",
    type: "paid",
    batches: ["2025-Jan-C"],
  },
];

/* ---------------- your students data ---------------- */
const initialStudents = [
  {
    id: 1,
    name: "Aisha Khan",
    email: "aisha.khan@email.com",
    phone: "+966 50 123 4567",
    enrolledCourses: 3,
    joinDate: "2025-01-15",
    status: "active",
    progress: 65,
    courseId: 1,
    batch: "2024-Nov-A",
    paid: true,
  },
  {
    id: 2,
    name: "Muhammad Ali",
    email: "m.ali@email.com",
    phone: "+966 50 234 5678",
    enrolledCourses: 2,
    joinDate: "2025-01-10",
    status: "active",
    progress: 48,
    courseId: 1,
    batch: "2024-Dec-B",
    paid: true,
  },
  {
    id: 3,
    name: "Fatima Hassan",
    email: "fatima.h@email.com",
    phone: "+966 50 345 6789",
    enrolledCourses: 4,
    joinDate: "2024-12-28",
    status: "active",
    progress: 82,
    courseId: 3,
    batch: "2024-Nov-B",
    paid: false,
  },
  {
    id: 4,
    name: "Zainab Al-Rashid",
    email: "zainab.r@email.com",
    phone: "+966 50 456 7890",
    enrolledCourses: 1,
    joinDate: "2025-01-05",
    status: "inactive",
    progress: 15,
    courseId: 5,
    batch: "2025-Feb-B",
    paid: false,
  },
  {
    id: 5,
    name: "Ahmed Mohammed",
    email: "ahmed.m@email.com",
    phone: "+966 50 567 8901",
    enrolledCourses: 3,
    joinDate: "2025-01-20",
    status: "active",
    progress: 72,
    courseId: 4,
    batch: "2024-Dec-C",
    paid: true,
  },
  {
    id: 6,
    name: "Layla Al-Harbi",
    email: "layla.ah@email.com",
    phone: "+966 50 678 9012",
    enrolledCourses: 2,
    joinDate: "2025-01-08",
    status: "pending",
    progress: 0,
    courseId: 6,
    batch: "2025-Jan-C",
    paid: true,
  },
];

/* ---------------- utility helpers ---------------- */
function fmtDate(d) {
  if (!d) return "";
  const dt = new Date(d);
  return dt.toLocaleDateString();
}

function exportCSV(rows = [], filename = "export.csv") {
  if (!rows || rows.length === 0) return;
  const keys = Object.keys(rows[0]);
  const csv = [
    keys.join(","),
    ...rows.map((r) =>
      keys.map((k) => `"${String(r[k] ?? "").replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/* ---------------- Main Component ---------------- */
export default function StudentsPage() {
  const [students, setStudents] = useState(initialStudents);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [batchFilter, setBatchFilter] = useState("all");
  const [paidFilter, setPaidFilter] = useState("all"); // all | paid | free

  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showEnroll, setShowEnroll] = useState(false);

  const PAGE_SIZE = 8;
  const [page, setPage] = useState(1);

  // batches depending on selected course
  const batchesForCourse = useMemo(() => {
    if (courseFilter === "all") {
      const setB = new Set(students.map((s) => s.batch));
      return Array.from(setB).sort();
    } else {
      const co = coursesData.find((c) => String(c.id) === String(courseFilter));
      return co ? co.batches : [];
    }
  }, [courseFilter, students]);

  // filtered students
  const filteredStudents = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return students.filter((s) => {
      if (statusFilter !== "all" && s.status !== statusFilter) return false;
      if (courseFilter !== "all" && String(s.courseId) !== String(courseFilter))
        return false;
      if (batchFilter !== "all" && s.batch !== batchFilter) return false;
      if (paidFilter === "paid" && !s.paid) return false;
      if (paidFilter === "free" && s.paid) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.phone.toLowerCase().includes(q)
      );
    });
  }, [
    students,
    searchTerm,
    statusFilter,
    courseFilter,
    batchFilter,
    paidFilter,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredStudents.length / PAGE_SIZE)
  );
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages]);
  const pageItems = filteredStudents.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  /* ------ actions ------ */
  function toggleSelectStudent(id) {
    setSelectedStudents((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
    );
  }
  function selectAllOnPage() {
    const ids = pageItems.map((p) => p.id);
    setSelectedStudents((s) => Array.from(new Set([...s, ...ids])));
  }
  function clearSelection() {
    setSelectedStudents([]);
  }

  function removeStudent(id) {
    if (!confirm("Remove student?")) return;
    setStudents((s) => s.filter((x) => x.id !== id));
    setSelectedStudents((sel) => sel.filter((x) => x !== id));
    if (selectedStudent?.id === id) setSelectedStudent(null);
  }

  function bulkExportSelected() {
    const rows = students.filter((s) => selectedStudents.includes(s.id));
    if (rows.length === 0) return alert("No students selected");
    const out = rows.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      phone: r.phone,
      course: coursesData.find((c) => c.id === r.courseId)?.title ?? "",
      batch: r.batch,
      paid: r.paid ? "paid" : "free",
      enrolled: r.joinDate,
      status: r.status,
    }));
    exportCSV(
      out,
      `students-selected-${new Date().toISOString().slice(0, 10)}.csv`
    );
  }

  function bulkRemoveSelected() {
    if (selectedStudents.length === 0) return alert("No students selected");
    if (!confirm(`Remove ${selectedStudents.length} selected students?`))
      return;
    setStudents((s) => s.filter((x) => !selectedStudents.includes(x.id)));
    setSelectedStudents([]);
  }

  function bulkMarkPaid(flag) {
    if (selectedStudents.length === 0) return alert("No students selected");
    setStudents((s) =>
      s.map((x) => (selectedStudents.includes(x.id) ? { ...x, paid: flag } : x))
    );
    setSelectedStudents([]);
  }

  /* Enroll student (simple demo) */
  function enrollStudent(form) {
    const newId = Math.max(0, ...students.map((s) => s.id)) + 1;
    const s = { id: newId, ...form };
    setStudents((arr) => [s, ...arr]);
    setShowEnroll(false);
    alert(`Enrolled ${s.name} in batch ${s.batch}`);
  }

  /* ---------------- UI pieces ---------------- */
  const totalStudents = students.length;
  const totalPaid = students.filter((s) => s.paid).length;
  const totalFree = students.filter((s) => !s.paid).length;
  const inSelectedCourse =
    courseFilter === "all"
      ? totalStudents
      : students.filter((s) => String(s.courseId) === String(courseFilter))
          .length;

  /* ---------------- render ---------------- */
  return (
    <DashboardShell>
      <div className="min-h-screen p-8 bg-linear-to-br from-background via-background to-background/80">
        {/* Top summary */}
        <div className=" mx-auto mb-6 grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="col-span-1 lg:col-span-2 flex items-center gap-4">
            <div className="rounded-2xl bg-card/50 backdrop-blur p-5 shadow-sm flex-1 border border-border flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg bg-[rgba(32,99,128,0.12)] flex items-center justify-center">
                <Users className="w-6 h-6 text-[rgba(32,99,128,1)]" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">
                  Total students
                </div>
                <div className="text-2xl font-semibold text-foreground">
                  {totalStudents}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Across all courses
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-card/50 backdrop-blur p-5 shadow-sm border border-border w-64">
              <div className="text-xs text-muted-foreground">
                Selected course
              </div>
              <div className="mt-1 font-semibold">
                {courseFilter === "all"
                  ? "All courses"
                  : coursesData.find(
                      (c) => String(c.id) === String(courseFilter)
                    )?.title}
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                {inSelectedCourse} students
              </div>
            </div>
          </div>

          <div className="col-span-1 lg:col-span-2 grid grid-cols-3 gap-4">
            <div className="rounded-2xl bg-card/50 backdrop-blur p-4 shadow-sm border border-border text-center">
              <div className="text-xs text-muted-foreground">Paid</div>
              <div className="text-xl font-semibold text-foreground mt-1">
                {totalPaid}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Paying enrollments
              </div>
            </div>
            <div className="rounded-2xl bg-card/50 backdrop-blur p-4 shadow-sm border border-border text-center">
              <div className="text-xs text-muted-foreground">Free</div>
              <div className="text-xl font-semibold text-foreground mt-1">
                {totalFree}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Free enrollments
              </div>
            </div>
            <div className="rounded-2xl bg-card/50 backdrop-blur p-4 shadow-sm border border-border text-center">
              <div className="text-xs text-muted-foreground">Filtered</div>
              <div className="text-xl font-semibold text-foreground mt-1">
                {filteredStudents.length}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Results</div>
            </div>
          </div>
        </div>

        <div className=" mx-auto">
          {/* Filter bar */}
          <div className="bg-card/50 rounded-2xl p-4 mb-4 flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between border border-border">
            <div className="flex items-center gap-3 w-full lg:w-auto flex-1">
              <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2 w-full lg:w-96">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                  aria-label="Search students"
                  placeholder="Search name, email or phone..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                  className="bg-transparent outline-none w-full text-sm"
                />
              </div>

              <div className="inline-flex items-center gap-2">
                <div className="inline-flex items-center border border-border rounded-lg bg-card p-1">
                  <Filter className="w-4 h-4 text-muted-foreground ml-1" />
                  <select
                    value={courseFilter}
                    onChange={(e) => {
                      setCourseFilter(e.target.value);
                      setBatchFilter("all");
                      setPage(1);
                    }}
                    className="bg-transparent text-sm outline-none px-2"
                    aria-label="Filter by course"
                  >
                    <option value="all">All courses</option>
                    {coursesData.map((c) => (
                      <option key={c.id} value={String(c.id)}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="inline-flex items-center border border-border rounded-lg bg-card p-1">
                  <select
                    value={batchFilter}
                    onChange={(e) => {
                      setBatchFilter(e.target.value);
                      setPage(1);
                    }}
                    className="bg-transparent text-sm outline-none px-2"
                    aria-label="Filter by batch"
                  >
                    <option value="all">All batches</option>
                    {batchesForCourse.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="inline-flex items-center border border-border rounded-lg bg-card p-1">
                  <select
                    value={paidFilter}
                    onChange={(e) => {
                      setPaidFilter(e.target.value);
                      setPage(1);
                    }}
                    className="bg-transparent text-sm outline-none px-2"
                  >
                    <option value="all">All (paid/free)</option>
                    <option value="paid">Paid</option>
                    <option value="free">Free</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full lg:w-auto">
              <button
                onClick={() => setShowEnroll(true)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[rgba(32,99,128,1)] text-white shadow-sm"
              >
                <Plus className="w-4 h-4" /> Enroll student
              </button>

              <button
                onClick={() =>
                  exportCSV(
                    filteredStudents.map((s) => ({
                      id: s.id,
                      name: s.name,
                      email: s.email,
                      phone: s.phone,
                      course: coursesData.find((c) => c.id === s.courseId)
                        ?.title,
                      batch: s.batch,
                      paid: s.paid ? "paid" : "free",
                      enrolled: s.joinDate,
                    })),
                    `students-filtered-${new Date()
                      .toISOString()
                      .slice(0, 10)}.csv`
                  )
                }
                className="px-3 py-2 rounded-lg border border-border bg-white text-sm"
              >
                <Download className="w-4 h-4 inline mr-1" /> Export
              </button>
            </div>
          </div>

          {/* Bulk bar */}
          {selectedStudents.length > 0 && (
            <div className="mb-4 rounded-lg bg-card/50 p-3 border border-border flex items-center gap-3">
              <div className="text-sm">{selectedStudents.length} selected</div>
              <button
                onClick={bulkExportSelected}
                className="px-2 py-1 rounded-md border border-border text-sm"
              >
                Export
              </button>
              <button
                onClick={() => bulkMarkPaid(true)}
                className="px-2 py-1 rounded-md bg-emerald-600 text-white text-sm"
              >
                Mark Paid
              </button>
              <button
                onClick={() => bulkMarkPaid(false)}
                className="px-2 py-1 rounded-md bg-amber-500 text-white text-sm"
              >
                Mark Free
              </button>
              <button
                onClick={bulkRemoveSelected}
                className="px-2 py-1 rounded-md border border-red-200 text-red-600 text-sm"
              >
                Remove
              </button>
              <div className="ml-auto">
                <button
                  onClick={clearSelection}
                  className="px-2 py-1 rounded-md border border-border text-sm"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="rounded-2xl overflow-hidden border border-border bg-card/50 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-card/50 border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left w-12">
                      <input
                        type="checkbox"
                        checked={
                          pageItems.length > 0 &&
                          pageItems.every((p) =>
                            selectedStudents.includes(p.id)
                          )
                        }
                        onChange={(e) =>
                          e.target.checked
                            ? selectAllOnPage()
                            : setSelectedStudents((s) =>
                                s.filter(
                                  (id) => !pageItems.some((p) => p.id === id)
                                )
                              )
                        }
                        aria-label="Select all on page"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
                      Course / Batch
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
                      Progress
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-muted-foreground uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border bg-card/30">
                  {pageItems.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="p-8 text-center text-muted-foreground"
                      >
                        No students found.
                      </td>
                    </tr>
                  )}

                  {pageItems.map((student) => {
                    const course = coursesData.find(
                      (c) => c.id === student.courseId
                    );
                    const selected = selectedStudents.includes(student.id);
                    return (
                      <tr
                        key={student.id}
                        className={`group hover:shadow-sm transition-shadow`}
                      >
                        <td className="px-4 py-4 align-top">
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => toggleSelectStudent(student.id)}
                          />
                        </td>

                        <td className="px-6 py-4 align-top">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary font-semibold">
                              {student.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <div>
                              <div className="font-medium text-foreground">
                                {student.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Enrolled in {student.enrolledCourses} course(s)
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 align-top">
                          <div className="text-sm text-foreground">
                            {student.email}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {student.phone}
                          </div>
                        </td>

                        <td className="px-6 py-4 align-top">
                          <div className="font-medium">
                            {course?.title ?? "—"}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {student.batch}
                          </div>
                        </td>

                        <td className="px-6 py-4 align-top">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden max-w-40">
                              <div
                                className="h-full bg-linear-to-r from-primary to-primary/80"
                                style={{ width: `${student.progress}%` }}
                              />
                            </div>
                            <div className="text-xs text-muted-foreground w-10 text-right">
                              {student.progress}%
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 align-top ">
                          <div className="text-sm text-muted-foreground ">
                            {fmtDate(student.joinDate)}
                          </div>
                        </td>

                        <td className="px-6 py-4 align-top">
                          <div className="flex flex-col items-center gap-4">
                            <div
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                student.status === "active"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : student.status === "inactive"
                                  ? "bg-red-50 text-red-700"
                                  : "bg-amber-50 text-amber-700"
                              }`}
                            >
                              {student.status.charAt(0).toUpperCase() +
                                student.status.slice(1)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {student.paid ? "Paid" : "Free"}
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-center align-top">
                          <div className="flex items-center justify-center gap-1 opacity-100 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => setSelectedStudent(student)}
                              title="View"
                              className="p-2 rounded-md hover:bg-slate-50"
                            >
                              <Eye className="w-4 h-4 text-muted-foreground" />
                            </button>
                            <button
                              onClick={() =>
                                alert(`Email (demo) sent to ${student.email}`)
                              }
                              title="Email"
                              className="p-2 rounded-md hover:bg-slate-50"
                            >
                              <Mail className="w-4 h-4 text-muted-foreground" />
                            </button>
                            <button
                              onClick={() =>
                                exportCSV(
                                  [
                                    {
                                      id: student.id,
                                      name: student.name,
                                      email: student.email,
                                      phone: student.phone,
                                      course: course?.title ?? "",
                                      batch: student.batch,
                                      paid: student.paid ? "paid" : "free",
                                      enrolled: student.joinDate,
                                      status: student.status,
                                    },
                                  ],
                                  `student-${student.id}.csv`
                                )
                              }
                              title="Export"
                              className="p-2 rounded-md hover:bg-slate-50"
                            >
                              <Download className="w-4 h-4 text-muted-foreground" />
                            </button>
                            <button
                              onClick={() => removeStudent(student.id)}
                              title="Delete"
                              className="p-2 rounded-md hover:bg-slate-50"
                            >
                              <Trash2 className="w-4 h-4 text-muted-foreground hover:text-red-500" />
                            </button>
                            <button
                              title="More"
                              className="p-2 rounded-md hover:bg-slate-50"
                            >
                              <MoreVertical className="w-4 h-4 text-muted-foreground" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination + summary */}
            <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-card/60">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {filteredStudents.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-foreground">
                  {students.length}
                </span>{" "}
                students
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(1)}
                  className="px-3 py-1 rounded-md border border-border text-sm"
                >
                  First
                </button>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1 rounded-md border border-border text-sm"
                >
                  Prev
                </button>
                <span className="px-3 py-1 rounded-md bg-slate-50 border border-border text-sm">
                  Page {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1 rounded-md border border-border text-sm"
                >
                  Next
                </button>
                <button
                  onClick={() => setPage(totalPages)}
                  className="px-3 py-1 rounded-md border border-border text-sm"
                >
                  Last
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Student detail modal */}
        {selectedStudent && (
          <StudentModal
            student={selectedStudent}
            onClose={() => setSelectedStudent(null)}
            onRemove={removeStudent}
          />
        )}

        {/* Enroll modal */}
        {showEnroll && (
          <EnrollModal
            courses={coursesData}
            onClose={() => setShowEnroll(false)}
            onSubmit={(form) => enrollStudent(form)}
          />
        )}
      </div>
    </DashboardShell>
  );
}

/* ---------------- Student Modal ---------------- */
function StudentModal({ student, onClose, onRemove }) {
  const course = coursesData.find((c) => c.id === student.courseId);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-xl p-6 z-10 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-semibold">{student.name}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {student.email} • {student.phone}
            </p>
          </div>
          <div>
            <button
              onClick={onClose}
              className="px-3 py-1 rounded-md border border-border"
            >
              Close
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-muted-foreground">
              Courses enrolled
            </div>
            <div className="font-medium">{student.enrolledCourses}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Course / Batch</div>
            <div className="font-medium">
              {course?.title ?? "-"} • {student.batch}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Payment</div>
            <div className="font-medium">{student.paid ? "Paid" : "Free"}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Joined</div>
            <div className="font-medium">{fmtDate(student.joinDate)}</div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={() => exportCSV([student], `student-${student.id}.csv`)}
            className="px-4 py-2 rounded-md border border-border bg-white"
          >
            <Download className="w-4 h-4 inline mr-2" /> Export
          </button>
          <button
            onClick={() => {
              onRemove(student.id);
              onClose();
            }}
            className="px-4 py-2 rounded-md border border-red-300 text-red-600"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Enroll Modal Component ---------------- */
function EnrollModal({ courses, onClose, onSubmit }) {
  const nameRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();
  const courseRef = useRef();
  const batchRef = useRef();
  const paidRef = useRef();
  const dateRef = useRef();

  useEffect(() => {
    dateRef.current.value = new Date().toISOString().slice(0, 10);
  }, []);

  function handleSubmit(e) {
    e?.preventDefault();
    const name = nameRef.current.value.trim();
    const email = emailRef.current.value.trim();
    const phone = phoneRef.current.value.trim();
    const courseId = Number(courseRef.current.value);
    const batch =
      batchRef.current.value ||
      courses.find((c) => c.id === courseId)?.batches?.[0] ||
      "general";
    const paid = !!paidRef.current.checked;
    const joinDate =
      dateRef.current.value || new Date().toISOString().slice(0, 10);
    if (!name || !email || !courseId)
      return alert("Name, email and course are required.");
    onSubmit({
      name,
      email,
      phone,
      enrolledCourses: 1,
      joinDate,
      status: "active",
      progress: 0,
      courseId,
      batch,
      paid,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <form
        onSubmit={handleSubmit}
        className="relative bg-white rounded-2xl w-full max-w-lg p-6 z-10 shadow-xl"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Enroll Student</h3>
          <button
            type="button"
            onClick={onClose}
            className="px-2 py-1 rounded-md border border-border"
          >
            Cancel
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <input
            ref={nameRef}
            placeholder="Full name"
            className="px-3 py-2 border border-border rounded-md"
          />
          <input
            ref={emailRef}
            placeholder="Email"
            className="px-3 py-2 border border-border rounded-md"
          />
          <input
            ref={phoneRef}
            placeholder="Phone"
            className="px-3 py-2 border border-border rounded-md"
          />
          <div className="grid grid-cols-2 gap-3">
            <select
              ref={courseRef}
              className="px-3 py-2 border border-border rounded-md"
              defaultValue=""
            >
              <option value="">Select course</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
            <input
              ref={batchRef}
              placeholder="Batch (optional)"
              className="px-3 py-2 border border-border rounded-md"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-2">
              <input ref={paidRef} type="checkbox" className="w-4 h-4" /> Paid
            </label>
            <input
              ref={dateRef}
              type="date"
              className="px-3 py-2 border border-border rounded-md"
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-border"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-[rgba(32,99,128,1)] text-white"
          >
            Enroll
          </button>
        </div>
      </form>
    </div>
  );
}
