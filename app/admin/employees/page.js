"use client";

import { DeleteConfirmationModal } from "@/components/admin/employees/delete-confirmation-modal";
import { EmployeeDetailModal } from "@/components/admin/employees/employee-detail-modal";
import { EmployeeFormModal } from "@/components/admin/employees/employee-form-modal";
import { EmployeeStats } from "@/components/admin/employees/employee-stats";
import DashboardShell from "@/components/layout/DashobardShell";
import { useMemo, useState } from "react";

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
    status: "Active",
    hireDate: "2018-06-12",
    avatarColor: "#FDE68A",
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
    status: "Active",
    hireDate: "2020-03-01",
    avatarColor: "#BFDBFE",
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
    status: "On Leave",
    hireDate: "2019-09-23",
    avatarColor: "#C7F9CC",
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
    status: "Active",
    hireDate: "2021-11-05",
    avatarColor: "#FBCFE8",
    bio: "Manages infra, CI/CD and platform reliability.",
  },
];

const IconSearch = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
    />
  </svg>
);

const IconDownload = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
    />
  </svg>
);

const IconPlus = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 4v16m8-8H4"
    />
  </svg>
);

const IconGrid = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
    />
  </svg>
);

const IconList = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

export default function EmployeesPage() {
  const [employees, setEmployees] = useState(SAMPLE_EMPLOYEES);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [view, setView] = useState("table");
  const [sortBy, setSortBy] = useState("name");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    employeeId: "",
    employeeName: "",
  });

  const roles = useMemo(
    () => ["All", ...Array.from(new Set(employees.map((e) => e.role)))],
    [employees]
  );

  const departments = useMemo(
    () => ["All", ...Array.from(new Set(employees.map((e) => e.department)))],
    [employees]
  );

  const statuses = useMemo(
    () => ["All", ...Array.from(new Set(employees.map((e) => e.status)))],
    [employees]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    const result = employees.filter((e) => {
      if (roleFilter !== "All" && e.role !== roleFilter) return false;
      if (departmentFilter !== "All" && e.department !== departmentFilter)
        return false;
      if (statusFilter !== "All" && e.status !== statusFilter) return false;

      if (!q) return true;

      return (
        e.name.toLowerCase().includes(q) ||
        e.position.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q)
      );
    });

    result.sort((a, b) => {
      switch (sortBy) {
        case "department":
          return a.department.localeCompare(b.department);
        case "hireDate":
          return new Date(b.hireDate) - new Date(a.hireDate);
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return result;
  }, [employees, query, roleFilter, departmentFilter, statusFilter, sortBy]);

  function exportCSV(list) {
    const header = [
      "ID",
      "Name",
      "Position",
      "Department",
      "Email",
      "Phone",
      "Location",
      "Role",
      "Status",
      "Hire Date",
    ];

    const rows = list.map((e) => [
      e.id,
      e.name,
      e.position,
      e.department,
      e.email,
      e.phone,
      e.location,
      e.role,
      e.status,
      e.hireDate,
    ]);

    const csv = [header, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "employees_export.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  const handleSaveEmployee = (employee) => {
    if (editingEmployee) {
      setEmployees((prev) =>
        prev.map((e) => (e.id === employee.id ? employee : e))
      );
    } else {
      setEmployees((prev) => [...prev, employee]);
    }

    setIsFormOpen(false);
    setEditingEmployee(null);
  };

  const handleDeleteEmployee = (employeeId) => {
    setEmployees((prev) => prev.filter((e) => e.id !== employeeId));
    setDeleteConfirmation({ isOpen: false, employeeId: "", employeeName: "" });
    setSelectedEmployee(null);
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("");
  };

  return (
    <DashboardShell>
      <div className="p-6 bg-slate-50 min-h-screen">
        {/* HEADER */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Employee Management
          </h1>
          <p className="text-slate-600">
            Islamic Online Academy • Manage and organize your staff
          </p>
        </header>

        {/* STATS */}
        <EmployeeStats employees={employees} />

        {/* CONTROLS BAR */}
        <div className="mb-6 bg-white rounded-lg p-4 shadow-sm border border-slate-200">
          <div className="flex flex-col gap-4">
            {/* SEARCH + ROLE */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex items-center bg-white border border-slate-300 rounded-lg px-3 py-2">
                <IconSearch />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="ml-2 outline-none text-sm flex-1"
                  placeholder="Search by name, position, or email..."
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
              >
                {roles.map((r) => (
                  <option key={r} value={r}>
                    Role: {r}
                  </option>
                ))}
              </select>
            </div>

            {/* SECOND LINE FILTERS */}
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white flex-1"
              >
                {departments.map((d) => (
                  <option key={d} value={d}>
                    Department: {d}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white flex-1"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    Status: {s}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white flex-1"
              >
                <option value="name">Sort: Name</option>
                <option value="department">Sort: Department</option>
                <option value="hireDate">Sort: Hire Date</option>
              </select>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1 bg-slate-100 border border-slate-300 rounded-lg p-1">
                <button
                  onClick={() => setView("grid")}
                  className={`px-3 py-1 rounded text-sm flex items-center gap-1 ${
                    view === "grid"
                      ? "bg-white shadow-sm text-slate-900"
                      : "text-slate-600"
                  }`}
                >
                  <IconGrid />
                  Grid
                </button>

                <button
                  onClick={() => setView("table")}
                  className={`px-3 py-1 rounded text-sm flex items-center gap-1 ${
                    view === "table"
                      ? "bg-white shadow-sm text-slate-900"
                      : "text-slate-600"
                  }`}
                >
                  <IconList />
                  Table
                </button>
              </div>

              <button
                onClick={() => exportCSV(filtered)}
                className="flex items-center gap-2 px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <IconDownload />
                Export CSV
              </button>

              <button
                onClick={() => {
                  setEditingEmployee(null);
                  setIsFormOpen(true);
                }}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 ml-auto"
              >
                <IconPlus />
                Add Employee
              </button>
            </div>
          </div>
        </div>

        {/* RESULTS HEADER */}
        <div className="mb-4 text-sm text-slate-600">
          Showing {filtered.length} of {employees.length} employees
        </div>

        {/* GRID OR TABLE */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-slate-200">
            <svg
              className="w-12 h-12 mx-auto mb-4 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4.354a4 4 0 110 7.292M15 21H3a6 6 0 016-6h6a6 6 0 016 6h-12z"
              />
            </svg>
            <p className="text-slate-600 font-medium mb-1">
              No employees found
            </p>
            <p className="text-slate-500 text-sm">
              Try changing your filters or add a new employee
            </p>
          </div>
        ) : view === "grid" ? (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((emp) => (
              <article
                key={emp.id}
                className="bg-white rounded-lg p-4 shadow-sm border border-slate-200 hover:shadow-md transition cursor-pointer"
                onClick={() => setSelectedEmployee(emp)}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-sm font-semibold text-white"
                    style={{ background: emp.avatarColor }}
                  >
                    {getInitials(emp.name)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 truncate">
                      {emp.name}
                    </h3>
                    <p className="text-xs text-slate-500 truncate">
                      {emp.position}
                    </p>
                    <p className="text-xs text-slate-400">{emp.department}</p>
                  </div>
                </div>

                <div className="mb-3 pb-3 border-b border-slate-200">
                  <div
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      emp.status === "Active"
                        ? "bg-emerald-100 text-emerald-700"
                        : emp.status === "On Leave"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current"></span>
                    {emp.status}
                  </div>
                </div>

                <p className="text-xs text-slate-600 mb-3 line-clamp-2">
                  {emp.bio}
                </p>

                <div className="text-xs text-slate-500 mb-4 space-y-1">
                  <div className="truncate">
                    <span className="font-medium">Email:</span>{" "}
                    <a
                      href={`mailto:${emp.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {emp.email}
                    </a>
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span> {emp.phone}
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t border-slate-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEmployee(emp);
                    }}
                    className="flex-1 px-2 py-1.5 border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    View Details
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingEmployee(emp);
                      setIsFormOpen(true);
                    }}
                    className="flex-1 px-2 py-1.5 bg-blue-50 border border-blue-300 rounded text-xs font-medium text-blue-700 hover:bg-blue-100"
                  >
                    Edit
                  </button>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <section className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700">
                      Name
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700">
                      Position
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700">
                      Department
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700">
                      Email
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700">
                      Role
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((emp) => (
                    <tr
                      key={emp.id}
                      className="border-b border-slate-200 hover:bg-slate-50 cursor-pointer"
                      onClick={() => setSelectedEmployee(emp)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold text-white"
                            style={{ background: emp.avatarColor }}
                          >
                            {getInitials(emp.name)}
                          </div>
                          <div className="font-medium text-slate-900">
                            {emp.name}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-slate-700">
                        {emp.position}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {emp.department}
                      </td>

                      <td className="px-4 py-3">
                        <a
                          href={`mailto:${emp.email}`}
                          className="text-blue-600 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {emp.email}
                        </a>
                      </td>

                      <td className="px-4 py-3 text-slate-700">{emp.role}</td>

                      <td className="px-4 py-3">
                        <div
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            emp.status === "Active"
                              ? "bg-emerald-100 text-emerald-700"
                              : emp.status === "On Leave"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current"></span>
                          {emp.status}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingEmployee(emp);
                              setIsFormOpen(true);
                            }}
                            className="text-xs px-2 py-1 border border-slate-300 rounded hover:bg-slate-50 text-slate-700"
                          >
                            Edit
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirmation({
                                isOpen: true,
                                employeeId: emp.id,
                                employeeName: emp.name,
                              });
                            }}
                            className="text-xs px-2 py-1 border border-red-300 rounded hover:bg-red-50 text-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* FOOTER */}
        <footer className="mt-8 text-xs text-slate-500">
          Tip: Click any employee to view full details. Use the filters to
          narrow down your search.
        </footer>
      </div>

      {/* MODALS */}
      <EmployeeDetailModal
        employee={selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
        onEdit={(emp) => {
          setEditingEmployee(emp);
          setIsFormOpen(true);
          setSelectedEmployee(null);
        }}
        onDelete={(empId) => {
          const empName =
            employees.find((e) => e.id === empId)?.name || "Employee";
          setDeleteConfirmation({
            isOpen: true,
            employeeId: empId,
            employeeName: empName,
          });
        }}
      />

      <EmployeeFormModal
        isOpen={isFormOpen}
        employee={editingEmployee || undefined}
        onClose={() => {
          setIsFormOpen(false);
          setEditingEmployee(null);
        }}
        onSave={handleSaveEmployee}
      />

      <DeleteConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        employeeName={deleteConfirmation.employeeName}
        onConfirm={() => handleDeleteEmployee(deleteConfirmation.employeeId)}
        onCancel={() =>
          setDeleteConfirmation({
            isOpen: false,
            employeeId: "",
            employeeName: "",
          })
        }
      />
    </DashboardShell>
  );
}
