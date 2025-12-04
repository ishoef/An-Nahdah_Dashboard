"use client";

import { useState, useMemo } from "react";
import DashboardShell from "@/components/layout/DashobardShell";
import {
  Search,
  Plus,
  MoreVertical,
  Download,
  Grid3X3,
  List,
  Edit2,
  Eye,
  CheckCircle,
  X,
  AlertCircle,
  CreditCard,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const salariesData = [
  {
    id: 1,
    instructorName: "Dr. Hassan Ahmed",
    baseSalary: 3500,
    bonus: 500,
    deductions: 200,
    netSalary: 3800,
    status: "paid",
    paymentDate: "Jan 5, 2025",
    month: "January 2025",
  },
  {
    id: 2,
    instructorName: "Ms. Amina Khan",
    baseSalary: 2800,
    bonus: 300,
    deductions: 150,
    netSalary: 2950,
    status: "pending",
    paymentDate: "Pending",
    month: "January 2025",
  },
  {
    id: 3,
    instructorName: "Prof. Mohammed Ali",
    baseSalary: 4200,
    bonus: 700,
    deductions: 300,
    netSalary: 4600,
    status: "paid",
    paymentDate: "Dec 31, 2024",
    month: "December 2024",
  },
  {
    id: 4,
    instructorName: "Dr. Fatima Hassan",
    baseSalary: 2500,
    bonus: 200,
    deductions: 100,
    netSalary: 2600,
    status: "pending",
    paymentDate: "Pending",
    month: "January 2025",
  },
  {
    id: 5,
    instructorName: "Sheikh Yusuf Rahman",
    baseSalary: 3000,
    bonus: 400,
    deductions: 150,
    netSalary: 3250,
    status: "paid",
    paymentDate: "Nov 30, 2024",
    month: "November 2024",
  },
];

export default function SalariesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("all");
  const [viewMode, setViewMode] = useState("table"); // table or grid
  const [selectedIds, setSelectedIds] = useState([]);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(null); // salary object
  const [showDetailsModal, setShowDetailsModal] = useState(null); // salary object
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);

  // Extract unique months
  const allMonths = [...new Set(salariesData.map((s) => s.month))];

  const filteredSalaries = useMemo(() => {
    return salariesData.filter((salary) => {
      const matchesSearch = salary.instructorName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || salary.status === statusFilter;
      const matchesMonth =
        monthFilter === "all" || salary.month === monthFilter;
      return matchesSearch && matchesStatus && matchesMonth;
    });
  }, [searchTerm, statusFilter, monthFilter]);

  const totalNetSalary = filteredSalaries.reduce(
    (sum, s) => sum + s.netSalary,
    0
  );
  const pendingCount = filteredSalaries.filter(
    (s) => s.status === "pending"
  ).length;

  const exportToCSV = () => {
    const headers = [
      "Instructor",
      "Month",
      "Base Salary",
      "Bonus",
      "Deductions",
      "Net Salary",
      "Status",
      "Payment Date",
    ];
    const rows = filteredSalaries.map((s) => [
      s.instructorName,
      s.month,
      `$${s.baseSalary}`,
      `+$${s.bonus}`,
      `-$${s.deductions}`,
      `$${s.netSalary}`,
      s.status,
      s.paymentDate,
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `salaries_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredSalaries.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredSalaries.map((s) => s.id));
    }
  };

  const handleBulkPay = () => {
    if (selectedIds.length === 0) return;
    setShowBulkConfirm(true);
  };

  const confirmBulkPay = () => {
    const now = new Date().toLocaleDateString();
    setSalariesData((prev) =>
      prev.map((s) =>
        selectedIds.includes(s.id) && s.status === "pending"
          ? { ...s, status: "paid", paymentDate: now }
          : s
      )
    );
    setSelectedIds([]);
    setShowBulkConfirm(false);
  };

  const updateSalary = (updatedSalary) => {
    setSalariesData((prev) =>
      prev.map((s) => (s.id === updatedSalary.id ? updatedSalary : s))
    );
    setShowEditModal(null);
  };

  return (
    <DashboardShell>
      <div className="min-h-screen bg-linear-to-br from-background via-background to-background/80 p-8">
        {/* Header */}
        <div className="mb-8 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground tracking-tight">
                Salaries Management
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                Track, manage, and process instructor salaries efficiently
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowProcessModal(true)}
                className="px-6 py-2.5 bg-linear-to-r from-nhd-700 to-[#1b5666] text-white rounded-lg font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Process Payroll
              </button>
              <button
                onClick={exportToCSV}
                className="px-6 py-2.5 border border-border rounded-lg hover:bg-accent transition-all duration-200 font-medium flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4">
              <p className="text-sm text-muted-foreground mb-1">
                Total Net Salary
              </p>
              <p className="text-2xl font-bold text-foreground">
                ${totalNetSalary.toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4">
              <p className="text-sm text-muted-foreground mb-1">
                Pending Payments
              </p>
              <p className="text-2xl font-bold text-amber-600">
                {pendingCount}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4">
              <p className="text-sm text-muted-foreground mb-1">
                Paid This Month
              </p>
              <p className="text-2xl font-bold text-emerald-600">
                {filteredSalaries.filter((s) => s.status === "paid").length}
              </p>
            </div>
          </div>

          {/* Filters & View Toggle */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by instructor name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-nhd-700/50 transition-all duration-200"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-nhd-700/50 transition-all duration-200"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
            </select>

            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-nhd-700/50 transition-all duration-200"
            >
              <option value="all">All Months</option>
              {allMonths.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <div className="flex rounded-lg border border-border bg-background p-1">
              <button
                onClick={() => setViewMode("table")}
                className={`p-2.5 rounded-md transition ${
                  viewMode === "table"
                    ? "bg-nhd-700 text-white"
                    : "hover:bg-muted"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2.5 rounded-md transition ${
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

        {/* Salaries Display */}
        {viewMode === "table" && (
          <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === filteredSalaries.length}
                        onChange={toggleSelectAll}
                        className="rounded border-border accent-nhd-700"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                      Instructor
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                      Month
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                      Base Salary
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                      Bonus
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                      Deductions
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                      Net Salary
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSalaries.map((salary) => (
                    <tr
                      key={salary.id}
                      className="border-b border-border hover:bg-muted/20 transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(salary.id)}
                          onChange={() => toggleSelect(salary.id)}
                          className="rounded border-border accent-nhd-700"
                        />
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-foreground">
                        {salary.instructorName}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {salary.month}
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground font-medium">
                        ${salary.baseSalary}
                      </td>
                      <td className="px-6 py-4 text-sm text-emerald-600 font-medium">
                        +${salary.bonus}
                      </td>
                      <td className="px-6 py-4 text-sm text-red-600 font-medium">
                        -${salary.deductions}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-foreground">
                        ${salary.netSalary}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            salary.status === "paid"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          }`}
                        >
                          {salary.status.charAt(0).toUpperCase() +
                            salary.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm flex gap-2">
                        <button
                          onClick={() => setShowDetailsModal(salary)}
                          className="p-2 hover:bg-muted rounded-lg transition-colors duration-200"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => setShowEditModal(salary)}
                          className="p-2 hover:bg-muted rounded-lg transition-colors duration-200"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors duration-200">
                          <MoreVertical className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {selectedIds.length > 0 && (
              <div className="p-4 border-t border-border flex justify-end">
                <button
                  onClick={handleBulkPay}
                  className="px-6 py-2.5 bg-linear-to-r from-nhd-700 to-[#1b5666] text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  Pay Selected ({selectedIds.length})
                </button>
              </div>
            )}
          </div>
        )}

        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AnimatePresence>
              {filteredSalaries.map((salary) => (
                <motion.div
                  key={salary.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6 hover:border-nhd-700/50 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">
                      {salary.instructorName}
                    </h3>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        salary.status === "paid"
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "bg-amber-500/10 text-amber-600"
                      }`}
                    >
                      {salary.status.charAt(0).toUpperCase() +
                        salary.status.slice(1)}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    {salary.month}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Base Salary</span>
                      <span className="font-medium">${salary.baseSalary}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Bonus</span>
                      <span className="font-medium text-emerald-600">
                        +${salary.bonus}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Deductions</span>
                      <span className="font-medium text-red-600">
                        -${salary.deductions}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-bold pt-2 border-t border-border">
                      <span>Net Salary</span>
                      <span>${salary.netSalary}</span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mb-4">
                    Payment Date: {salary.paymentDate}
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowDetailsModal(salary)}
                      className="flex-1 px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted transition flex items-center gap-2 justify-center"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => setShowEditModal(salary)}
                      className="flex-1 px-4 py-2 text-sm font-medium bg-linear-to-r from-nhd-700 to-[#1b5666] text-white rounded-lg hover:shadow-md transition flex items-center gap-2 justify-center"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {filteredSalaries.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-muted/50 w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center">
              <CreditCard className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium text-foreground">
              No salaries found
            </h3>
            <p className="text-muted-foreground mt-2">
              Try adjusting your filters or process new payroll.
            </p>
          </div>
        )}

        {/* Modals as Subcomponents */}
        <ProcessPayrollModal
          open={showProcessModal}
          onClose={() => setShowProcessModal(false)}
        />
        {showEditModal && (
          <EditSalaryModal
            salary={showEditModal}
            onClose={() => setShowEditModal(null)}
            onSave={updateSalary}
          />
        )}
        {showDetailsModal && (
          <SalaryDetailsModal
            salary={showDetailsModal}
            onClose={() => setShowDetailsModal(null)}
          />
        )}
        {showBulkConfirm && (
          <BulkPayConfirmModal
            open={showBulkConfirm}
            onClose={() => setShowBulkConfirm(false)}
            onConfirm={confirmBulkPay}
            count={selectedIds.length}
          />
        )}
      </div>
    </DashboardShell>
  );
}

// Process Payroll Modal
function ProcessPayrollModal({ open, onClose }) {
  const [payrollMonth, setPayrollMonth] = useState("");
  const [loading, setLoading] = useState(false);

  const handleProcess = () => {
    setLoading(true);
    setTimeout(() => {
      // Simulate processing
      alert("Payroll processed for " + payrollMonth);
      setLoading(false);
      onClose();
    }, 1500);
  };

  if (!open) return null;

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
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-nhd-700" />
              Process Payroll
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                Select Month
              </label>
              <input
                type="month"
                value={payrollMonth}
                onChange={(e) => setPayrollMonth(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-nhd-700/50 transition"
              />
            </div>

            <p className="text-sm text-muted-foreground">
              This will generate salaries for all instructors for the selected
              month.
            </p>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <button
                onClick={onClose}
                className="px-6 py-3 border border-border rounded-lg hover:bg-muted transition"
              >
                Cancel
              </button>
              <button
                onClick={handleProcess}
                disabled={!payrollMonth || loading}
                className="px-6 py-3 bg-linear-to-r from-nhd-700 to-[#1b5666] text-white rounded-lg font-medium hover:shadow-lg transition disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? "Processing..." : "Process Now"}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Edit Salary Modal
function EditSalaryModal({ salary, onClose, onSave }) {
  const [form, setForm] = useState({
    baseSalary: salary.baseSalary,
    bonus: salary.bonus,
    deductions: salary.deductions,
    netSalary: salary.netSalary,
    status: salary.status,
  });

  const handleChange = (e, field) => {
    const value = parseFloat(e.target.value) || 0;
    setForm((prev) => {
      const newForm = { ...prev, [field]: value };
      newForm.netSalary =
        newForm.baseSalary + newForm.bonus - newForm.deductions;
      return newForm;
    });
  };

  const handleSubmit = () => {
    onSave({ ...salary, ...form });
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
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Edit2 className="w-6 h-6 text-nhd-700" />
              Edit Salary
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                Instructor
              </label>
              <p className="px-4 py-3 rounded-lg bg-muted/50">
                {salary.instructorName}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                Base Salary
              </label>
              <input
                type="number"
                value={form.baseSalary}
                onChange={(e) => handleChange(e, "baseSalary")}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-nhd-700/50 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                Bonus
              </label>
              <input
                type="number"
                value={form.bonus}
                onChange={(e) => handleChange(e, "bonus")}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-nhd-700/50 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                Deductions
              </label>
              <input
                type="number"
                value={form.deductions}
                onChange={(e) => handleChange(e, "deductions")}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-nhd-700/50 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                Net Salary
              </label>
              <p className="px-4 py-3 rounded-lg bg-muted/50 font-bold">
                ${form.netSalary}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-nhd-700/50 transition"
              >
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <button
                onClick={onClose}
                className="px-6 py-3 border border-border rounded-lg hover:bg-muted transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-linear-to-r from-nhd-700 to-[#1b5666] text-white rounded-lg font-medium hover:shadow-lg transition flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Salary Details Modal
function SalaryDetailsModal({ salary, onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.93, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.93, y: 30, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl bg-card rounded-3xl shadow-2xl border border-border overflow-hidden"
        >
          {/* Gradient Header */}
          <div className="relative bg-linear-to-br from-nhd-700 via-[#1e5a72] to-[#1b4f63] px-8 py-10 text-white">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2.5 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur-sm transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <CreditCard className="w-9 h-9" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Salary Details</h2>
                <p className="text-white/80 mt-1 text-sm">
                  {salary.instructorName}
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="absolute top-6 left-8">
              <span
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                  salary.status === "paid"
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "bg-amber-500/20 text-amber-300"
                } backdrop-blur-sm`}
              >
                {salary.status === "paid" ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Paid
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4" />
                    Pending
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="p-8 bg-card">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">
                    Instructor
                  </p>
                  <p className="text-xl font-semibold text-foreground mt-1">
                    {salary.instructorName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground font-medium">
                    Payment Month
                  </p>
                  <p className="text-lg font-medium text-foreground mt-1">
                    {salary.month}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground font-medium">
                    Payment Date
                  </p>
                  <p className="text-lg font-medium text-foreground mt-1">
                    {salary.paymentDate === "Pending" ? (
                      <span className="text-amber-600 font-medium">
                        Awaiting Payment
                      </span>
                    ) : (
                      salary.paymentDate
                    )}
                  </p>
                </div>
              </div>

              {/* Right Column - Financial Breakdown */}
              <div className="space-y-5">
                <div className="bg-muted/50 rounded-2xl p-6 border border-border/50">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Base Salary</span>
                      <span className="text-lg font-medium">
                        ${salary.baseSalary.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Bonus</span>
                      <span className="text-emerald-600 font-medium">
                        +${salary.bonus.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Deductions</span>
                      <span className="text-red-600 font-medium">
                        −${salary.deductions.toLocaleString()}
                      </span>
                    </div>

                    <div className="pt-4 border-t border-border/70 mt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-foreground">
                          Net Salary
                        </span>
                        <span className="text-2xl font-bold text-nhd-700">
                          ${salary.netSalary.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center mt-10 pt-6 border-t border-border/50">
              <div className="text-sm text-muted-foreground">
                Salary record • {salary.month}
              </div>
              <button
                onClick={onClose}
                className="px-8 py-3.5 bg-nhd-700 text-white font-medium rounded-xl hover:bg-[#1b5666] hover:shadow-lg transition-all duration-200 flex items-center gap-2"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Bulk Pay Confirm Modal
function BulkPayConfirmModal({ open, onClose, onConfirm, count }) {
  if (!open) return null;

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
          className="bg-background rounded-2xl shadow-2xl max-w-sm w-full p-8 border border-border"
        >
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <CreditCard className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">Process Bulk Payment?</h3>
            <p className="text-muted-foreground mb-6">
              Pay {count} selected pending salaries now?
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
                className="px-6 py-3 bg-linear-to-r from-nhd-700 to-[#1b5666] text-white rounded-lg font-medium hover:shadow-lg transition"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
