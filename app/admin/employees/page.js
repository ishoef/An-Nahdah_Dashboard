"use client";

import { useState, useMemo } from "react";
import DashboardShell from "@/components/layout/DashobardShell";
import {
  Search,
  Plus,
  Download,
  Upload,
  Grid3X3,
  List,
  Edit2,
  Trash2,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  Building2,
  CheckCircle,
  XCircle,
  Clock,
  MoreVertical,
  Filter,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Papa from "papaparse";

const SAMPLE_EMPLOYEES = [
  {
    id: "e001",
    name: "Aisha Khalid",
    position: "Head of Curriculum",
    department: "Academics",
    email: "aisha.khalid@islamicacademy.edu",
    phone: "+20 100 123 4567",
    location: "Cairo, Egypt",
    role: "Admin",
    status: "active",
    hireDate: "2018-06-12",
    avatarColor: "from-amber-400 to-yellow-500",
    bio: "Oversees curriculum development for Qur'anic and Arabic streams.",
  },
  {
    id: "e002",
    name: "Dr. Omar Farouk",
    position: "Senior Arabic Instructor",
    department: "Teaching",
    email: "omar.farouk@islamicacademy.edu",
    phone: "+20 122 234 5678",
    location: "Alexandria, Egypt",
    role: "Teacher",
    status: "active",
    hireDate: "2020-03-01",
    avatarColor: "from-blue-400 to-cyan-500",
    bio: "Specialist in Classical Arabic and Tajweed instruction.",
  },
  {
    id: "e003",
    name: "Fatimah Noor",
    position: "Student Support Lead",
    department: "Support",
    email: "fatimah.noor@islamicacademy.edu",
    phone: "+20 115 345 6789",
    location: "Riyadh, KSA",
    role: "Support",
    status: "on-leave",
    hireDate: "2019-09-23",
    avatarColor: "from-emerald-400 to-teal-500",
    bio: "Coordinates student onboarding, queries and wellbeing services.",
  },
  {
    id: "e004",
    name: "Ibrahim Aziz",
    position: "DevOps Engineer",
    department: "Engineering",
    email: "ibrahim.aziz@islamicacademy.edu",
    phone: "+20 166 456 7890",
    location: "Istanbul, TR",
    role: "Engineering",
    status: "active",
    hireDate: "2021-11-05",
    avatarColor: "from-pink-400 to-rose-500",
    bio: "Manages infra, CI/CD and platform reliability.",
  },
];

const PRIMARY = "#206380";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState(SAMPLE_EMPLOYEES);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [selected, setSelected] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showDetail, setShowDetail] = useState(null);
  const [bulkAction, setBulkAction] = useState("");
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);

  const roles = ["all", ...new Set(employees.map((e) => e.role.toLowerCase()))];
  const departments = ["all", ...new Set(employees.map((e) => e.department))];
  const statuses = ["all", "active", "on-leave"];

  const filtered = useMemo(() => {
    return employees.filter((e) => {
      const matchesSearch =
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.email.toLowerCase().includes(search.toLowerCase()) ||
        e.position.toLowerCase().includes(search.toLowerCase());
      const matchesRole =
        roleFilter === "all" || e.role.toLowerCase() === roleFilter;
      const matchesDept = deptFilter === "all" || e.department === deptFilter;
      const matchesStatus = statusFilter === "all" || e.status === statusFilter;
      return matchesSearch && matchesRole && matchesDept && matchesStatus;
    });
  }, [employees, search, roleFilter, deptFilter, statusFilter]);

  const stats = {
    total: employees.length,
    active: employees.filter((e) => e.status === "active").length,
    onLeave: employees.filter((e) => e.status === "on-leave").length,
    departments: new Set(employees.map((e) => e.department)).size,
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelected(
      selected.length === filtered.length ? [] : filtered.map((e) => e.id)
    );
  };

  const handleBulk = (action) => {
    if (selected.length === 0) return;
    setBulkAction(action);
    setShowBulkConfirm(true);
  };

  const confirmBulk = () => {
    if (bulkAction === "delete") {
      setEmployees((prev) => prev.filter((e) => !selected.includes(e.id)));
    } else if (bulkAction === "activate") {
      setEmployees((prev) =>
        prev.map((e) =>
          selected.includes(e.id) ? { ...e, status: "active" } : e
        )
      );
    } else if (bulkAction === "leave") {
      setEmployees((prev) =>
        prev.map((e) =>
          selected.includes(e.id) ? { ...e, status: "on-leave" } : e
        )
      );
    }
    setSelected([]);
    setShowBulkConfirm(false);
    setBulkAction("");
  };

  const exportCSV = () => {
    const data = filtered.map((e) => ({
      ID: e.id,
      Name: e.name,
      Position: e.position,
      Department: e.department,
      Email: e.email,
      Phone: e.phone,
      Location: e.location,
      Role: e.role,
      Status: e.status === "active" ? "Active" : "On Leave",
      "Hire Date": e.hireDate,
    }));
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "employees.csv";
    a.click();
  };

  const importCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      complete: (res) => {
        const newEmps = res.data.map((row) => ({
          id: "e" + Date.now() + Math.random(),
          name: row.Name || "Unknown",
          position: row.Position || "Staff",
          department: row.Department || "General",
          email: row.Email || "",
          phone: row.Phone || "",
          location: row.Location || "",
          role: row.Role || "Staff",
          status: row.Status?.toLowerCase().includes("active")
            ? "active"
            : "on-leave",
          hireDate: row["Hire Date"] || new Date().toISOString().split("T")[0],
          avatarColor: "from-purple-400 to-indigo-500",
          bio: row.Bio || "No bio provided.",
        }));
        setEmployees((prev) => [...prev, ...newEmps]);
      },
    });
  };

  const getInitials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2);

  return (
    <DashboardShell>
      <div className="min-h-screen p-6 md:p-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Employee Management
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage team members, roles, and access across the academy
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowForm(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-[#206380] to-[#1b5666] text-white rounded-lg font-medium flex items-center gap-2 hover:shadow-lg transition"
            >
              <Plus className="w-4 h-4" /> Add Employee
            </button>
            <label className="px-5 py-2.5 border border-border rounded-lg hover:bg-muted cursor-pointer flex items-center gap-2">
              <Upload className="w-4 h-4" /> Import
              <input
                type="file"
                accept=".csv"
                onChange={importCSV}
                className="hidden"
              />
            </label>
            <button
              onClick={exportCSV}
              className="px-5 py-2.5 border border-border rounded-lg hover:bg-muted flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
          <div className="bg-card border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Employees</p>
                <p className="text-3xl font-bold mt-2">{stats.total}</p>
              </div>
              <Users className="w-10 h-10 text-[#206380]/70" />
            </div>
          </div>
          <div className="bg-card border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-3xl font-bold mt-2 text-emerald-600">
                  {stats.active}
                </p>
              </div>
              <CheckCircle className="w-10 h-10 text-emerald-500" />
            </div>
          </div>
          <div className="bg-card border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">On Leave</p>
                <p className="text-3xl font-bold mt-2 text-amber-600">
                  {stats.onLeave}
                </p>
              </div>
              <Clock className="w-10 h-10 text-amber-500" />
            </div>
          </div>
          <div className="bg-card border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Departments</p>
                <p className="text-3xl font-bold mt-2">{stats.departments}</p>
              </div>
              <Building2 className="w-10 h-10 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employees..."
              className="pl-10 pr-4 py-3 w-full rounded-lg border bg-background focus:ring-2 focus:ring-[#206380]/50 transition"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-3 rounded-lg border bg-background"
            >
              <option value="all">All Roles</option>
              {roles
                .filter((r) => r !== "all")
                .map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
            </select>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="px-4 py-3 rounded-lg border bg-background"
            >
              <option value="all">All Departments</option>
              {departments
                .filter((d) => d !== "all")
                .map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 rounded-lg border bg-background"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="on-leave">On Leave</option>
            </select>
            <div className="flex rounded-lg border bg-background p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${
                  viewMode === "grid" ? "bg-[#206380] text-white" : ""
                }`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 rounded ${
                  viewMode === "table" ? "bg-[#206380] text-white" : ""
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selected.length > 0 && (
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-6 p-4 bg-card border rounded-xl flex items-center justify-between"
          >
            <span className="font-medium">{selected.length} selected</span>
            <div className="flex gap-3">
              <button
                onClick={() => handleBulk("activate")}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm"
              >
                Activate
              </button>
              <button
                onClick={() => handleBulk("leave")}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm"
              >
                Set On Leave
              </button>
              <button
                onClick={() => handleBulk("delete")}
                className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm"
              >
                Delete
              </button>
            </div>
          </motion.div>
        )}

        {/* Grid View */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filtered.map((emp) => (
                <motion.div
                  key={emp.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group bg-card border rounded-2xl p-6 hover:shadow-xl transition-all cursor-pointer"
                  onClick={() => setShowDetail(emp)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-14 h-14 rounded-full bg-gradient-to-br ${emp.avatarColor} flex items-center justify-center text-white font-bold text-lg shadow-lg`}
                    >
                      {getInitials(emp.name)}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelect(emp.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition"
                    >
                      <div
                        className={`w-5 h-5 rounded border-2 ${
                          selected.includes(emp.id)
                            ? "bg-[#206380] border-[#206380]"
                            : "border-gray-400"
                        }`}
                      >
                        {selected.includes(emp.id) && (
                          <CheckCircle className="w-4 h-4 text-white -m-1" />
                        )}
                      </div>
                    </button>
                  </div>
                  <h3 className="font-bold text-lg">{emp.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {emp.position}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {emp.department}
                  </p>

                  <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        emp.status === "active"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {emp.status === "active" ? "Active" : "On Leave"}
                    </span>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditing(emp);
                          setShowForm(true);
                        }}
                        className="p-2 hover:bg-muted rounded-lg"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEmployees((prev) =>
                            prev.filter((x) => x.id !== emp.id)
                          );
                        }}
                        className="p-2 hover:bg-rose-100 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4 text-rose-600" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Table View */}
        {viewMode === "table" && (
          <div className="bg-card border rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={
                        selected.length === filtered.length &&
                        filtered.length > 0
                      }
                      onChange={toggleAll}
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium">
                    Employee
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium">
                    Position
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium">
                    Department
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((emp) => (
                  <tr
                    key={emp.id}
                    className="border-t hover:bg-muted/20 transition"
                    onClick={() => setShowDetail(emp)}
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selected.includes(emp.id)}
                        onChange={() => toggleSelect(emp.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full bg-gradient-to-br ${emp.avatarColor} flex items-center justify-center text-white font-bold`}
                        >
                          {getInitials(emp.name)}
                        </div>
                        <div>
                          <p className="font-medium">{emp.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {emp.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{emp.position}</td>
                    <td className="px-6 py-4">{emp.department}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-4 text-muted-foreground">
                        <Mail className="w-4 h-4" />{" "}
                        {emp.phone.split(" ").pop()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          emp.status === "active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {emp.status === "active" ? "Active" : "On Leave"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDetail(emp);
                          }}
                          className="p-2 hover:bg-muted rounded-lg"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditing(emp);
                            setShowForm(true);
                          }}
                          className="p-2 hover:bg-muted rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEmployees((prev) =>
                              prev.filter((x) => x.id !== emp.id)
                            );
                          }}
                          className="p-2 hover:bg-rose-100 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4 text-rose-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modals */}
        <EmployeeFormModal
          isOpen={showForm}
          employee={editing}
          onClose={() => {
            setShowForm(false);
            setEditing(null);
          }}
          onSave={(data) => {
            if (editing) {
              setEmployees((prev) =>
                prev.map((e) => (e.id === editing.id ? { ...e, ...data } : e))
              );
            } else {
              setEmployees((prev) => [
                ...prev,
                {
                  ...data,
                  id: "e" + Date.now(),
                  avatarColor: "from-indigo-400 to-purple-500",
                  status: "active",
                },
              ]);
            }
            setShowForm(false);
            setEditing(null);
          }}
        />

        <EmployeeDetailModal
          employee={showDetail}
          onClose={() => setShowDetail(null)}
        />

        {showBulkConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-card p-8 rounded-2xl shadow-2xl max-w-md w-full border"
            >
              <h3 className="text-xl font-bold mb-4">Confirm Bulk Action</h3>
              <p className="text-muted-foreground mb-6">
                Apply "{bulkAction}" to {selected.length} employees?
              </p>
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => setShowBulkConfirm(false)}
                  className="px-6 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmBulk}
                  className="px-6 py-2 bg-[#206380] text-white rounded-lg"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

// Reusable Modal Components (simplified)
function EmployeeFormModal({ isOpen, employee, onClose, onSave }) {
  if (!isOpen) return null;
  const [form, setForm] = useState(
    employee || {
      name: "",
      position: "",
      department: "",
      email: "",
      phone: "",
      location: "",
      role: "",
    }
  );

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full p-8 border"
      >
        <h2 className="text-2xl font-bold mb-6">
          {employee ? "Edit" : "Add"} Employee
        </h2>
        <div className="grid grid-cols-2 gap-6">
          {[
            "name",
            "position",
            "department",
            "email",
            "phone",
            "location",
            "role",
          ].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium mb-2 capitalize">
                {field}
              </label>
              <input
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-4 mt-8">
          <button onClick={onClose} className="px-6 py-3 border rounded-lg">
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="px-6 py-3 bg-[#206380] text-white rounded-lg"
          >
            Save
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function EmployeeDetailModal({ employee, onClose }) {
  if (!employee) return null;
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-card rounded-3xl shadow-2xl max-w-3xl w-full p-10 border"
      >
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-6">
            <div
              className={`w-24 h-24 rounded-full bg-gradient-to-br ${employee.avatarColor} flex items-center justify-center text-white text-3xl font-bold shadow-xl`}
            >
              {employee.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <h2 className="text-3xl font-bold">{employee.name}</h2>
              <p className="text-xl text-muted-foreground">
                {employee.position} • {employee.department}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-muted rounded-full">
            <XCircle className="w-6 h-6" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-8 text-lg">
          <div>
            <strong>Email:</strong>{" "}
            <a href={`mailto:${employee.email}`} className="text-[#206380]">
              {employee.email}
            </a>
          </div>
          <div>
            <strong>Phone:</strong> {employee.phone}
          </div>
          <div>
            <strong>Location:</strong> <MapPin className="inline w-4 h-4" />{" "}
            {employee.location}
          </div>
          <div>
            <strong>Hire Date:</strong> <Calendar className="inline w-4 h-4" />{" "}
            {new Date(employee.hireDate).toLocaleDateString()}
          </div>
        </div>
        <div className="mt-8 p-6 bg-muted/30 rounded-2xl">
          <p className="text-lg leading-relaxed">{employee.bio}</p>
        </div>
      </motion.div>
    </div>
  );
}
