"use client";

import { useState } from "react";
import DashboardShell from "@/components/layout/DashobardShell";
import { Search, Plus, MoreVertical, Download } from "lucide-react";

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
];

export default function SalariesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredSalaries = salariesData.filter(
    (salary) =>
      salary.instructorName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === "all" || salary.status === statusFilter)
  );

  const totalNetSalary = filteredSalaries.reduce(
    (sum, s) => sum + s.netSalary,
    0
  );

  return (
    <DashboardShell>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 p-8">
        {/* Header */}
        <div className="mb-8 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground tracking-tight">
                Salaries Management
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                Track and manage instructor salaries and payments
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-lg font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Process Payroll
              </button>
              <button className="px-6 py-2.5 border border-border rounded-lg hover:bg-accent transition-all duration-200 font-medium flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4">
              <p className="text-sm text-muted-foreground mb-2">
                Total Net Salary
              </p>
              <p className="text-2xl font-bold text-foreground">
                ${totalNetSalary.toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4">
              <p className="text-sm text-muted-foreground mb-2">
                Pending Payments
              </p>
              <p className="text-2xl font-bold text-amber-600">
                {salariesData.filter((s) => s.status === "pending").length}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4">
              <p className="text-sm text-muted-foreground mb-2">
                Paid This Month
              </p>
              <p className="text-2xl font-bold text-emerald-600">
                {salariesData.filter((s) => s.status === "paid").length}
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by instructor name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Salary Table */}
        <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
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
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredSalaries.map((salary) => (
                  <tr
                    key={salary.id}
                    className="border-b border-border hover:bg-muted/20 transition-colors duration-200"
                  >
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
                    <td className="px-6 py-4 text-sm">
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors duration-200">
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
