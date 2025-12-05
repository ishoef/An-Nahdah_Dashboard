"use client";

import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  Search,
  Download,
  Edit2,
  Trash2,
  Moon,
  Sun,
  Plus,
  X,
  Upload,
  FileDown,
  Grid3x3,
  List,
  Filter,
} from "lucide-react";
import DashboardShell from "@/components/layout/DashobardShell";

const PRIMARY_COLOR = "#206380";

// ---------- Shared helpers (JS, no TS) ----------

const calculateGrade = (total) => {
  const p = (total / 500) * 100;
  if (p >= 90) return { grade: "A+", color: "text-green-600" };
  if (p >= 80) return { grade: "A", color: "text-blue-600" };
  if (p >= 70) return { grade: "B+", color: "text-yellow-600" };
  if (p >= 60) return { grade: "B", color: "text-orange-600" };
  if (p >= 50) return { grade: "C", color: "text-red-500" };
  return { grade: "F", color: "text-red-700" };
};

// Demo students so UI looks populated on first load
const DEMO_STUDENTS = [
  (() => {
    const marks = {
      math: 92,
      science: 88,
      english: 95,
      history: 90,
      computer: 94,
    };
    const total = Object.values(marks).reduce((a, b) => a + b, 0);
    const { grade } = calculateGrade(total);
    return {
      id: 1,
      name: "Aisha Khan",
      rollNo: "CS2023-001",
      course: "Computer Science",
      batch: "2023-2027",
      marks,
      totalMarks: total,
      percentage: Number((total / 500) * 100).toFixed(1),
      grade,
      date: "December 01, 2025",
    };
  })(),
  (() => {
    const marks = {
      math: 78,
      science: 82,
      english: 80,
      history: 75,
      computer: 85,
    };
    const total = Object.values(marks).reduce((a, b) => a + b, 0);
    const { grade } = calculateGrade(total);
    return {
      id: 2,
      name: "Muhammad Ali",
      rollNo: "CS2023-002",
      course: "Computer Science",
      batch: "2023-2027",
      marks,
      totalMarks: total,
      percentage: Number((total / 500) * 100).toFixed(1),
      grade,
      date: "December 02, 2025",
    };
  })(),
  (() => {
    const marks = {
      math: 60,
      science: 65,
      english: 70,
      history: 58,
      computer: 62,
    };
    const total = Object.values(marks).reduce((a, b) => a + b, 0);
    const { grade } = calculateGrade(total);
    return {
      id: 3,
      name: "Fatima Hassan",
      rollNo: "IT2023-010",
      course: "Information Technology",
      batch: "2023-2027",
      marks,
      totalMarks: total,
      percentage: Number((total / 500) * 100).toFixed(1),
      grade,
      date: "November 28, 2025",
    };
  })(),
  (() => {
    const marks = {
      math: 45,
      science: 50,
      english: 55,
      history: 48,
      computer: 52,
    };
    const total = Object.values(marks).reduce((a, b) => a + b, 0);
    const { grade } = calculateGrade(total);
    return {
      id: 4,
      name: "Omar Farooq",
      rollNo: "EE2023-015",
      course: "Electrical Engineering",
      batch: "2023-2027",
      marks,
      totalMarks: total,
      percentage: Number((total / 500) * 100).toFixed(1),
      grade,
      date: "November 20, 2025",
    };
  })(),
];

// ---------- Main Component (design unchanged) ----------

export default function StudentGradingSystem() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [filters, setFilters] = useState({
    grade: "all",
    course: "all",
    batch: "all",
  });

  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    course: "",
    batch: "",
    marks: { math: "", science: "", english: "", history: "", computer: "" },
  });

  const certificateRef = useRef(null);
  const fileInputRef = useRef(null);

  // Load data
  useEffect(() => {
    try {
      const saved = localStorage.getItem("students");
      const savedDark = localStorage.getItem("darkMode");

      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setStudents(parsed);
        } else {
          setStudents(DEMO_STUDENTS);
        }
      } else {
        setStudents(DEMO_STUDENTS);
      }

      if (savedDark === "true") setDarkMode(true);
    } catch (err) {
      console.error(err);
      setStudents(DEMO_STUDENTS);
    }
  }, []);

  // Save data
  useEffect(() => {
    try {
      localStorage.setItem("students", JSON.stringify(students));
    } catch (err) {
      console.error(err);
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem("darkMode", darkMode ? "true" : "false");
    } catch (err) {
      console.error(err);
    }
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const totalMarks = Object.values(formData.marks).reduce(
      (a, b) => a + (Number(b) || 0),
      0
    );
    const { grade } = calculateGrade(totalMarks);

    const studentData = {
      id: editingId || Date.now(),
      ...formData,
      totalMarks,
      percentage: Number((totalMarks / 500) * 100).toFixed(1),
      grade,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };

    if (editingId) {
      setStudents((prev) =>
        prev.map((s) => (s.id === editingId ? studentData : s))
      );
    } else {
      setStudents((prev) => [...prev, studentData]);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      rollNo: "",
      course: "",
      batch: "",
      marks: { math: "", science: "", english: "", history: "", computer: "" },
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (student) => {
    setFormData({
      name: student.name,
      rollNo: student.rollNo,
      course: student.course,
      batch: student.batch || "",
      marks: student.marks || {
        math: "",
        science: "",
        english: "",
        history: "",
        computer: "",
      },
    });
    setEditingId(student.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm("Delete this student?")) {
      setStudents((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const downloadCertificate = async (student) => {
    const el = certificateRef.current;
    if (!el) return;

    const nameEl = document.getElementById("cert-name");
    const rollEl = document.getElementById("cert-roll");
    const courseEl = document.getElementById("cert-course");
    const gradeEl = document.getElementById("cert-grade");
    const dateEl = document.getElementById("cert-date");

    if (!nameEl || !rollEl || !courseEl || !gradeEl || !dateEl) return;

    nameEl.textContent = student.name;
    rollEl.textContent = student.rollNo;
    courseEl.textContent = student.course;
    gradeEl.textContent = student.grade;
    dateEl.textContent = student.date;

    const canvas = await html2canvas(el, { scale: 3, logging: false });
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF("l", "mm", "a4");
    const w = pdf.internal.pageSize.getWidth();
    const h = pdf.internal.pageSize.getHeight();
    pdf.addImage(img, "PNG", 0, 0, w, h);
    pdf.save(`${student.name.replace(/\s+/g, "_")}_Certificate.pdf`);
  };

  // Export to JSON
  const exportJSON = () => {
    const data = JSON.stringify(students, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `students_backup_${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    a.click();
  };

  // Export to CSV
  const exportCSV = () => {
    const headers = [
      "Name",
      "Roll No",
      "Course",
      "Batch",
      "Math",
      "Science",
      "English",
      "History",
      "Computer",
      "Total",
      "Percentage",
      "Grade",
      "Date",
    ];
    const rows = students.map((s) => [
      s.name,
      s.rollNo,
      s.course,
      s.batch || "-",
      s.marks?.math,
      s.marks?.science,
      s.marks?.english,
      s.marks?.history,
      s.marks?.computer,
      s.totalMarks,
      s.percentage + "%",
      s.grade,
      s.date,
    ]);

    let csv = headers.join(",") + "\n";
    rows.forEach((row) => {
      csv += row.join(",") + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `students_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  // Import JSON
  const importJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target.result;
        const data = JSON.parse(text);
        if (Array.isArray(data)) {
          setStudents(data);
          alert("Data imported successfully!");
        } else {
          alert("Invalid JSON structure!");
        }
      } catch (err) {
        alert("Invalid JSON file!");
      } finally {
        // allow re-selecting same file later
        e.target.value = "";
      }
    };
    reader.readAsText(file);
  };

  // Get unique values for filters
  const uniqueCourses = [...new Set(students.map((s) => s.course))].filter(
    Boolean
  );
  const uniqueBatches = [...new Set(students.map((s) => s.batch))].filter(
    Boolean
  );
  const grades = ["A+", "A", "B+", "B", "C", "F"];

  // Filtered students
  const filteredStudents = students.filter((s) => {
    if (
      searchTerm &&
      !s.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !s.rollNo.includes(searchTerm)
    )
      return false;
    if (filters.grade !== "all" && s.grade !== filters.grade) return false;
    if (filters.course !== "all" && s.course !== filters.course) return false;
    if (filters.batch !== "all" && s.batch !== filters.batch) return false;
    return true;
  });

  return (
    <DashboardShell>
      {/* Hidden Certificate Template */}
      <div className="fixed -top-[9999px] left-0">
        <div
          ref={certificateRef}
          className="w-[1100px] h-[800px] bg-white relative overflow-hidden"
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{
              background: `linear-gradient(45deg, ${PRIMARY_COLOR} 25%, transparent 25%)`,
              backgroundSize: "60px 60px",
            }}
          ></div>
          <div
            className="absolute inset-8 border-8 rounded-xl"
            style={{ borderColor: PRIMARY_COLOR }}
          ></div>
          <div
            className="absolute inset-12 border-4 rounded-xl"
            style={{ borderColor: PRIMARY_COLOR + "40" }}
          ></div>

          <div className="text-center pt-16">
            <div
              className="w-32 h-32 mx-auto bg-gray-200 border-4 rounded-full mb-6 flex items-center justify-center text-5xl font-bold"
              style={{ borderColor: PRIMARY_COLOR, color: PRIMARY_COLOR }}
            >
              LOGO
            </div>
            <h1
              className="text-5xl font-bold mb-2"
              style={{ color: PRIMARY_COLOR }}
            >
              ACADEMIC EXCELLENCE AWARD
            </h1>
            <p className="text-2xl text-gray-700">Certificate of Completion</p>
          </div>

          <div className="text-center mt-20 px-20">
            <p className="text-xl text-gray-600 mb-10">
              This is to certify that
            </p>
            <h2
              id="cert-name"
              className="text-5xl font-bold mb-8"
              style={{ color: PRIMARY_COLOR }}
            >
              Student Name
            </h2>
            <p className="text-xl text-gray-700 mb-6">
              Roll No:{" "}
              <span id="cert-roll" className="font-semibold">
                12345
              </span>{" "}
              | Course:{" "}
              <span id="cert-course" className="font-semibold">
                B.Tech
              </span>
            </p>
            <p className="text-xl text-gray-700 mb-12">
              Has secured{" "}
              <span
                id="cert-grade"
                className="font-bold text-3xl"
                style={{ color: PRIMARY_COLOR }}
              >
                A+
              </span>{" "}
              Grade
            </p>
            <p className="text-lg text-gray-600">
              Awarded on <span id="cert-date">December 04, 2025</span>
            </p>
          </div>

          <div className="absolute bottom-20 left-20 right-20 flex justify-between">
            <div className="text-center">
              <div className="border-t-2 border-gray-600 w-48 mt-20"></div>
              <p className="mt-2 text-gray-700">Principal</p>
            </div>
            <div className="text-center">
              <div className="border-t-2 border-gray-600 w-48 mt-20"></div>
              <p className="mt-2 text-gray-700">Director</p>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`min-h-screen ${
          darkMode ? "bg-gray-900 text-white" : "bg-gray-50"
        } py-8`}
      >
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 gap-4">
            <h1 className="text-4xl font-bold" style={{ color: PRIMARY_COLOR }}>
              Student Grading System
            </h1>

            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-gray-800 shadow"
                      : ""
                  }`}
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${
                    viewMode === "list"
                      ? "bg-white dark:bg-gray-800 shadow"
                      : ""
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {darkMode ? (
                  <Sun className="w-6 h-6" />
                ) : (
                  <Moon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold shadow-lg transition"
              style={{ backgroundColor: PRIMARY_COLOR }}
            >
              <Plus className="w-5 h-5" /> Add Student
            </button>

            <button
              onClick={exportJSON}
              className="flex items-center gap-2 px-5 py-3 border-2 rounded-lg font-medium transition"
              style={{ borderColor: PRIMARY_COLOR, color: PRIMARY_COLOR }}
            >
              <FileDown className="w-5 h-5" /> Export JSON
            </button>

            <button
              onClick={exportCSV}
              className="flex items-center gap-2 px-5 py-3 border-2 rounded-lg font-medium transition"
              style={{ borderColor: PRIMARY_COLOR, color: PRIMARY_COLOR }}
            >
              <FileDown className="w-5 h-5" /> Export CSV
            </button>

            <label
              className="flex items-center gap-2 px-5 py-3 border-2 rounded-lg font-medium cursor-pointer transition"
              style={{ borderColor: PRIMARY_COLOR, color: PRIMARY_COLOR }}
            >
              <Upload className="w-5 h-5" /> Import JSON
              <input
                type="file"
                accept=".json"
                ref={fileInputRef}
                onChange={importJSON}
                className="hidden"
              />
            </label>
          </div>

          {/* Filters & Search */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search name or roll..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border dark:bg-gray-800"
              />
            </div>

            <select
              value={filters.grade}
              onChange={(e) =>
                setFilters({ ...filters, grade: e.target.value })
              }
              className="px-4 py-3 rounded-lg border dark:bg-gray-800"
            >
              <option value="all">All Grades</option>
              {grades.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>

            <select
              value={filters.course}
              onChange={(e) =>
                setFilters({ ...filters, course: e.target.value })
              }
              className="px-4 py-3 rounded-lg border dark:bg-gray-800"
            >
              <option value="all">All Courses</option>
              {uniqueCourses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={filters.batch}
              onChange={(e) =>
                setFilters({ ...filters, batch: e.target.value })
              }
              className="px-4 py-3 rounded-lg border dark:bg-gray-800"
            >
              <option value="all">All Batches</option>
              {uniqueBatches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Student List / Grid */}
          {viewMode === "grid" ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredStudents.map((student) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onDownload={downloadCertificate}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-4 text-left">Name</th>
                    <th className="px-6 py-4 text-left">Roll No</th>
                    <th className="px-6 py-4 text-left">Course</th>
                    <th className="px-6 py-4 text-left">Batch</th>
                    <th className="px-6 py-4 text-center">Grade</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="border-t dark:border-gray-700"
                    >
                      <td className="px-6 py-4 font-medium">{student.name}</td>
                      <td className="px-6 py-4">{student.rollNo}</td>
                      <td className="px-6 py-4">{student.course}</td>
                      <td className="px-6 py-4">{student.batch || "-"}</td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-white text-sm font-bold ${calculateGrade(
                            student.totalMarks || 0
                          )
                            .color.replace("text-", "bg-")
                            .replace("600", "500")}`}
                        >
                          {student.grade}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(student)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => downloadCertificate(student)}
                            className="p-2 hover:bg-blue-100 rounded"
                            style={{ color: PRIMARY_COLOR }}
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(student.id)}
                            className="p-2 hover:bg-red-100 rounded text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Add/Edit Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-3xl w-full max-h-screen overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2
                    className="text-3xl font-bold"
                    style={{ color: PRIMARY_COLOR }}
                  >
                    {editingId ? "Edit Student" : "Add New Student"}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                      type="text"
                      placeholder="Full Name"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="px-5 py-3 rounded-lg border dark:bg-gray-700"
                    />
                    <input
                      type="text"
                      placeholder="Roll Number"
                      required
                      value={formData.rollNo}
                      onChange={(e) =>
                        setFormData({ ...formData, rollNo: e.target.value })
                      }
                      className="px-5 py-3 rounded-lg border dark:bg-gray-700"
                    />
                    <input
                      type="text"
                      placeholder="Course"
                      required
                      value={formData.course}
                      onChange={(e) =>
                        setFormData({ ...formData, course: e.target.value })
                      }
                      className="px-5 py-3 rounded-lg border dark:bg-gray-700"
                    />
                    <input
                      type="text"
                      placeholder="Batch (e.g. 2023-2027)"
                      value={formData.batch}
                      onChange={(e) =>
                        setFormData({ ...formData, batch: e.target.value })
                      }
                      className="px-5 py-3 rounded-lg border dark:bg-gray-700"
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {Object.keys(formData.marks).map((sub) => (
                      <div key={sub}>
                        <label className="block text-sm font-medium capitalize mb-1">
                          {sub} (100)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          required
                          value={formData.marks[sub]}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              marks: {
                                ...formData.marks,
                                [sub]: e.target.value,
                              },
                            })
                          }
                          className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button
                      type="submit"
                      className="flex-1 py-4 rounded-lg text-white font-bold text-lg transition transform hover:scale-105"
                      style={{ backgroundColor: PRIMARY_COLOR }}
                    >
                      {editingId ? "Update" : "Save"} Student
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-8 py-4 rounded-lg border-2 font-semibold"
                      style={{
                        borderColor: PRIMARY_COLOR,
                        color: PRIMARY_COLOR,
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}

// Reusable Card Component (design untouched)
function StudentCard({ student, onEdit, onDelete, onDownload }) {
  const { color } = calculateGrade(student.totalMarks || 0);

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-8 transition hover:shadow-xl"
      style={{ borderLeftColor: PRIMARY_COLOR }}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold">{student.name}</h3>
          <p className="text-sm text-gray-500">Roll: {student.rollNo}</p>
          {student.batch && (
            <p className="text-sm text-gray-500">Batch: {student.batch}</p>
          )}
        </div>
        <span className={`text-3xl font-bold ${color}`}>{student.grade}</span>
      </div>

      <div className="text-sm space-y-1">
        <p>
          <strong>Course:</strong> {student.course}
        </p>
        <p>
          <strong>Total:</strong> {student.totalMarks}/500 ({student.percentage}
          %)
        </p>
      </div>

      <div className="flex gap-2 mt-6">
        <button
          onClick={() => onEdit(student)}
          className="flex-1 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
        >
          Edit
        </button>
        <button
          onClick={() => onDownload(student)}
          className="flex-1 py-2 text-white rounded-lg"
          style={{ backgroundColor: PRIMARY_COLOR }}
        >
          Certificate
        </button>
        <button
          onClick={() => onDelete(student.id)}
          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
