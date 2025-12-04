"use client";

import { useState, useMemo } from "react";
import DashboardShell from "@/components/layout/DashobardShell";
import {
  Download,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  MoreVertical,
  Grid3X3,
  List,
  CreditCard,
  Eye,
  Edit2,
  X,
  CheckCircle,
  AlertCircle,
  Plus,
  DollarSign,
  User,
  Clock, 
  XCircle, 
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

const PRIMARY = "#206380";

function formatCurrency(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

function downloadCSV(rows, filename = "transactions.csv") {
  if (!rows || rows.length === 0) return;
  const keys = Object.keys(rows[0]);
  const csv = [
    keys.join(","),
    ...rows.map((r) =>
      keys.map((k) => `"${String(r[k]).replace(/"/g, '""')}"`).join(",")
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

export default function RevenuePage() {
  const sampleData = useMemo(
    () => [
      { month: "Jan", value: 8200 },
      { month: "Feb", value: 9400 },
      { month: "Mar", value: 10200 },
      { month: "Apr", value: 9000 },
      { month: "May", value: 11600 },
      { month: "Jun", value: 12400 },
      { month: "Jul", value: 13800 },
      { month: "Aug", value: 12900 },
      { month: "Sep", value: 14200 },
      { month: "Oct", value: 15700 },
      { month: "Nov", value: 16400 },
      { month: "Dec", value: 17800 },
    ],
    []
  );

  const [transactions, setTransactions] = useState([
    {
      id: "TX-1001",
      instructor: "Umar Ali",
      amount: 1200,
      date: "2025-11-27",
      status: "Paid",
    },
    {
      id: "TX-1002",
      instructor: "Fatima Noor",
      amount: 450,
      date: "2025-11-26",
      status: "Pending",
    },
    {
      id: "TX-1003",
      instructor: "Khalid Hasan",
      amount: 980,
      date: "2025-11-25",
      status: "Paid",
    },
    {
      id: "TX-1004",
      instructor: "Aisha Rahman",
      amount: 650,
      date: "2025-11-23",
      status: "Paid",
    },
    {
      id: "TX-1005",
      instructor: "Ibrahim Khan",
      amount: 300,
      date: "2025-11-20",
      status: "Failed",
    },
  ]);

  const [range, setRange] = useState("6m");
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [selectedIds, setSelectedIds] = useState([]);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(null);
  const [showEditModal, setShowEditModal] = useState(null);
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);

  const visibleData = useMemo(() => {
    if (range === "1m") return sampleData.slice(-1);
    if (range === "3m") return sampleData.slice(-3);
    if (range === "6m") return sampleData.slice(-6);
    return sampleData;
  }, [sampleData, range]);

  const revenueTotal = useMemo(
    () => sampleData.reduce((s, d) => s + d.value, 0),
    [sampleData]
  );
  const recentPayouts = useMemo(
    () => transactions.filter((t) => t.status === "Paid").length,
    [transactions]
  );
  const avgPerInstructor = useMemo(
    () => Math.round((revenueTotal / 12 / 10) * 100) / 100 || 0,
    [revenueTotal]
  );
  const growth = useMemo(() => {
    const last = sampleData[sampleData.length - 1].value;
    const prev = sampleData[sampleData.length - 2].value;
    return Math.round(((last - prev) / prev) * 100);
  }, [sampleData]);

  const filteredTx = useMemo(
    () =>
      transactions.filter((t) => {
        if (!query) return true;
        const q = query.toLowerCase();
        return (
          t.id.toLowerCase().includes(q) ||
          t.instructor.toLowerCase().includes(q)
        );
      }),
    [transactions, query]
  );

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredTx.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTx.map((t) => t.id));
    }
  };

  const handleBulkPayout = () => {
    if (selectedIds.length === 0) return;
    setShowBulkConfirm(true);
  };

  const confirmBulkPayout = () => {
    const now = new Date().toISOString().split("T")[0];
    setTransactions((prev) =>
      prev.map((t) =>
        selectedIds.includes(t.id) && t.status === "Pending"
          ? { ...t, status: "Paid", date: now }
          : t
      )
    );
    setSelectedIds([]);
    setShowBulkConfirm(false);
  };

  const updateTransaction = (updatedTx) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === updatedTx.id ? updatedTx : t))
    );
    setShowEditModal(null);
  };

  const addNewPayout = (newTx) => {
    setTransactions((prev) => [{ ...newTx, status: "Pending" }, ...prev]);
    setShowPayoutModal(false);
  };

  function buildPath(data, w = 760, h = 240, pad = 24) {
    if (!data || data.length === 0) return { line: "", area: "" };
    const values = data.map((d) => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const rangeV = max - min || 1;
    const stepX = (w - pad * 2) / Math.max(1, data.length - 1);
    const points = data.map((d, i) => {
      const x = pad + i * stepX;
      const y = pad + (1 - (d.value - min) / rangeV) * (h - pad * 2);
      return [x, y];
    });
    const d = points
      .map(
        (p, i) => `${i === 0 ? "M" : "L"} ${p[0].toFixed(2)} ${p[1].toFixed(2)}`
      )
      .join(" ");
    const last = points[points.length - 1];
    const first = points[0];
    const area = `${d} L ${last[0].toFixed(2)} ${h - pad} L ${first[0].toFixed(
      2
    )} ${h - pad} Z`;
    return { line: d, area };
  }

  const chart = buildPath(visibleData, 760, 260, 28);

  return (
    <>
      <DashboardShell>
        <div className="min-h-screen p-6 md:p-10">
          {/* Header */}
          <div className="mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Revenue & Payouts
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Comprehensive overview of revenue streams, payouts, and
                  transactions.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-card border border-border rounded-md p-1.5">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <select
                    value={range}
                    onChange={(e) => setRange(e.target.value)}
                    className="bg-transparent text-sm outline-none focus:outline-none"
                  >
                    <option value="1m">1M</option>
                    <option value="3m">3M</option>
                    <option value="6m">6M</option>
                    <option value="12m">12M</option>
                  </select>
                </div>

                <button
                  onClick={() => setShowPayoutModal(true)}
                  className="px-4 py-2.5 bg-gradient-to-r from-[#206380] to-[#1b5666] text-white rounded-md font-medium shadow-md hover:shadow-lg hover:brightness-105 transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Payout
                </button>

                <button
                  onClick={() => downloadCSV(filteredTx)}
                  className="px-4 py-2.5 border border-border rounded-md hover:bg-muted transition font-medium flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
              <KPICard
                title="Total Revenue (YTD)"
                value={formatCurrency(revenueTotal)}
                hint="+12% vs last year"
                trend="up"
              />
              <KPICard
                title="Recent Payouts"
                value={formatCurrency(recentPayouts * 1000)}
                hint={`${recentPayouts} payouts`}
                trend="up"
              />
              <KPICard
                title="Avg / Instructor"
                value={formatCurrency(avgPerInstructor)}
                hint="per month"
                trend="down"
              />
              <KPICard
                title="MoM Growth"
                value={`${growth}%`}
                hint="vs prev month"
                trend={growth >= 0 ? "up" : "down"}
              />
            </div>

            {/* Chart + Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
              <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Monthly Revenue
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Last {range === "1m" ? "month" : range}
                    </p>
                  </div>
                  <div className="text-lg font-bold text-foreground">
                    {formatCurrency(
                      visibleData.reduce((s, d) => s + d.value, 0)
                    )}
                  </div>
                </div>

                <div className="w-full overflow-hidden">
                  <svg
                    viewBox="0 0 760 260"
                    width="100%"
                    height="260"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                        <stop
                          offset="0%"
                          stopColor={PRIMARY}
                          stopOpacity="0.18"
                        />
                        <stop
                          offset="100%"
                          stopColor={PRIMARY}
                          stopOpacity="0.04"
                        />
                      </linearGradient>
                    </defs>
                    <path d={chart.area} fill="url(#g1)" stroke="none" />
                    <path
                      d={chart.line}
                      fill="none"
                      stroke={PRIMARY}
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                    {visibleData.map((d, i) => {
                      const w = 760,
                        h = 260,
                        pad = 28;
                      const values = visibleData.map((x) => x.value);
                      const min = Math.min(...values);
                      const max = Math.max(...values);
                      const rangeV = max - min || 1;
                      const stepX =
                        (w - pad * 2) / Math.max(1, visibleData.length - 1);
                      const x = pad + i * stepX;
                      const y =
                        pad + (1 - (d.value - min) / rangeV) * (h - pad * 2);
                      return (
                        <circle
                          key={d.month}
                          cx={x}
                          cy={y}
                          r={3.5}
                          fill="#fff"
                          stroke={PRIMARY}
                          strokeWidth="1.6"
                        />
                      );
                    })}
                    {visibleData.map((d, i) => {
                      const w = 760,
                        pad = 28;
                      const stepX =
                        (w - pad * 2) / Math.max(1, visibleData.length - 1);
                      const x = pad + i * stepX;
                      return (
                        <text
                          key={d.month}
                          x={x}
                          y={250}
                          fontSize="10"
                          textAnchor="middle"
                          fill="#7A8B8F"
                        >
                          {d.month}
                        </text>
                      );
                    })}
                  </svg>
                </div>
              </div>

              <aside className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-5">
                <h4 className="text-lg font-semibold text-foreground">
                  Quick Actions
                </h4>
                <button
                  onClick={() => setShowPayoutModal(true)}
                  className="w-full px-4 py-3 rounded-md bg-gradient-to-r from-[#206380] to-[#1b5666] text-white font-medium hover:brightness-105 shadow-md transition-all flex items-center gap-3 justify-center"
                >
                  <Plus className="w-5 h-5" /> Create New Payout
                </button>
                <button
                  onClick={() =>
                    downloadCSV(filteredTx, "revenue_transactions.csv")
                  }
                  className="w-full px-4 py-3 rounded-md border border-border hover:bg-muted font-medium transition flex items-center gap-3 justify-center"
                >
                  <Download className="w-5 h-5" /> Export Report
                </button>
                <button className="w-full px-4 py-3 rounded-md border border-border hover:bg-muted font-medium transition flex items-center gap-3 justify-center">
                  <Search className="w-5 h-5" /> Advanced Search
                </button>
              </aside>
            </div>

            {/* Transactions */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Recent Transactions
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Latest payouts and revenue entries
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search by ID or instructor..."
                      className="pl-10 pr-4 py-2.5 rounded-md border border-border bg-background text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#206380]/50 transition"
                    />
                  </div>

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
              </div>

              {viewMode === "table" && (
                <TransactionTable
                  transactions={filteredTx}
                  selectedIds={selectedIds}
                  onToggleSelect={toggleSelect}
                  onToggleSelectAll={toggleSelectAll}
                  onViewDetails={setShowDetailsModal}
                  onEdit={setShowEditModal}
                  onBulkPayout={handleBulkPayout}
                />
              )}

              {viewMode === "grid" && (
                <TransactionGrid
                  transactions={filteredTx}
                  onViewDetails={setShowDetailsModal}
                  onEdit={setShowEditModal}
                />
              )}
            </div>
          </div>
        </div>
      </DashboardShell>

      {/* Render All Modals */}
      <PayoutModal
        open={showPayoutModal}
        onClose={() => setShowPayoutModal(false)}
        onSubmit={addNewPayout}
      />
      {showDetailsModal && (
        <TransactionDetailsModal
          transaction={showDetailsModal}
          onClose={() => setShowDetailsModal(null)}
        />
      )}
      {showEditModal && (
        <EditTransactionModal
          transaction={showEditModal}
          onClose={() => setShowEditModal(null)}
          onSave={updateTransaction}
        />
      )}
      <BulkPayoutConfirm
        open={showBulkConfirm}
        onClose={() => setShowBulkConfirm(false)}
        onConfirm={confirmBulkPayout}
        count={selectedIds.length}
      />
    </>
  );
}

/* === Subcomponents (unchanged except fixes) === */

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

function StatusBadge({ status }) {
  const map = {
    Paid: { text: "Paid", class: "bg-emerald-500/10 text-emerald-600" },
    Pending: { text: "Pending", class: "bg-amber-500/10 text-amber-600" },
    Failed: { text: "Failed", class: "bg-rose-500/10 text-rose-600" },
  };
  const s = map[status] || {
    text: status,
    class: "bg-gray-500/10 text-gray-600",
  };
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${s.class}`}
    >
      {s.text}
    </span>
  );
}

function TransactionTable({
  transactions,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onViewDetails,
  onEdit,
  onBulkPayout,
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
                  selectedIds.length === transactions.length &&
                  transactions.length > 0
                }
                onChange={onToggleSelectAll}
                className="rounded border-border accent-[#206380]"
              />
            </th>
            <th className="px-6 py-4">ID</th>
            <th className="px-6 py-4">Instructor</th>
            <th className="px-6 py-4">Amount</th>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr
              key={t.id}
              className="border-b border-border hover:bg-muted/20 transition-colors"
            >
              <td className="px-6 py-4">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(t.id)}
                  onChange={() => onToggleSelect(t.id)}
                  className="rounded border-border accent-[#206380]"
                />
              </td>
              <td className="px-6 py-4 font-medium">{t.id}</td>
              <td className="px-6 py-4">{t.instructor}</td>
              <td className="px-6 py-4">{formatCurrency(t.amount)}</td>
              <td className="px-6 py-4 text-muted-foreground">{t.date}</td>
              <td className="px-6 py-4">
                <StatusBadge status={t.status} />
              </td>
              <td className="px-6 py-4 text-right flex gap-2 justify-end">
                <button
                  onClick={() => onViewDetails(t)}
                  className="p-2 hover:bg-muted rounded-md transition"
                >
                  <Eye className="w-4 h-4 text-muted-foreground" />
                </button>
                <button
                  onClick={() => onEdit(t)}
                  className="p-2 hover:bg-muted rounded-md transition"
                >
                  <Edit2 className="w-4 h-4 text-muted-foreground" />
                </button>
                <button className="p-2 hover:bg-muted rounded-md transition">
                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedIds.length > 0 && (
        <div className="p-4 border-t border-border flex justify-end">
          <button
            onClick={onBulkPayout}
            className="px-6 py-2.5 bg-gradient-to-r from-[#206380] to-[#1b5666] text-white rounded-md font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <CreditCard className="w-4 h-4" />
            Process Selected Payouts ({selectedIds.length})
          </button>
        </div>
      )}
    </div>
  );
}

function TransactionGrid({ transactions, onViewDetails, onEdit }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <AnimatePresence>
        {transactions.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6 hover:border-[#206380]/50 hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                {t.instructor}
              </h3>
              <StatusBadge status={t.status} />
            </div>
            <p className="text-sm text-muted-foreground mb-4">ID: {t.id}</p>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium">{formatCurrency(t.amount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">{t.date}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => onViewDetails(t)}
                className="flex-1 px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-muted transition flex items-center gap-2 justify-center"
              >
                <Eye className="w-4 h-4" /> View
              </button>
              <button
                onClick={() => onEdit(t)}
                className="flex-1 px-4 py-2 text-sm font-medium bg-gradient-to-r from-[#206380] to-[#1b5666] text-white rounded-md hover:shadow-md transition flex items-center gap-2 justify-center"
              >
                <Edit2 className="w-4 h-4" /> Edit
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Fixed Payout Modal
function PayoutModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState({
    instructor: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = () => {
    if (!form.instructor || !form.amount) return;
    const newTx = {
      id: `TX-${Math.floor(Math.random() * 9000) + 1000}`,
      instructor: form.instructor,
      amount: parseFloat(form.amount),
      date: form.date,
    };
    onSubmit(newTx);
    setForm({
      instructor: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
    });
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
              <CreditCard className="w-6 h-6 text-[#206380]" /> Create Payout
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">
                Instructor Name
              </label>
              <input
                type="text"
                value={form.instructor}
                onChange={(e) =>
                  setForm({ ...form, instructor: e.target.value })
                }
                placeholder="e.g. Umar Ali"
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#206380]/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Amount</label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="e.g. 1200"
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#206380]/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#206380]/50"
              />
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
                disabled={!form.instructor || !form.amount}
                className="px-6 py-3 bg-gradient-to-r from-[#206380] to-[#1b5666] text-white rounded-lg font-medium hover:shadow-lg transition disabled:opacity-50 flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" /> Create Payout
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// New: Transaction Details Modal
function TransactionDetailsModal({ transaction, onClose }) {
  if (!transaction) return null;

  const statusConfig = {
    Paid: {
      label: "Paid",
      icon: CheckCircle,
      badgeClasses: "bg-emerald-500/20 text-emerald-300",
    },
    Pending: {
      label: "Pending",
      icon: Clock,
      badgeClasses: "bg-amber-500/20 text-amber-300",
    },
    Failed: {
      label: "Failed",
      icon: XCircle,
      badgeClasses: "bg-rose-500/20 text-rose-300",
    },
  };

  const {
    icon: StatusIcon,
    badgeClasses,
    label,
  } = statusConfig[transaction.status] || statusConfig.Pending;

  const formattedDate = new Date(transaction.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
          <div className="relative bg-gradient-to-br from-[#206380] via-[#1e5a72] to-[#1b4f63] px-8 py-10 text-white">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2.5 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur-sm transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <DollarSign className="w-9 h-9" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Transaction Details</h2>
                <p className="text-white/80 mt-1 text-sm">
                  Transaction ID: {transaction.id}
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="absolute top-6 left-8">
              <span
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm ${badgeClasses}`}
              >
                <StatusIcon className="w-4 h-4" />
                {label}
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="p-8 bg-card">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Instructor */}
                <div>
                  <p className="text-sm text-muted-foreground font-medium">
                    Instructor
                  </p>
                  <p className="text-xl font-semibold text-foreground mt-1">
                    {transaction.instructor}
                  </p>
                </div>

                {/* Transaction Date */}
                <div>
                  <p className="text-sm text-muted-foreground font-medium">
                    Transaction Date
                  </p>
                  <p className="text-lg font-medium text-foreground mt-1 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#206380]" />
                    {formattedDate}
                  </p>
                </div>

                {/* Status (text summary) */}
                <div>
                  <p className="text-sm text-muted-foreground font-medium">
                    Status
                  </p>
                  <p className="text-lg font-medium text-foreground mt-1 flex items-center gap-2">
                    <StatusIcon className="w-4 h-4" />
                    {transaction.status}
                  </p>
                </div>
              </div>

              {/* Right Column - Amount / Financial Box */}
              <div className="space-y-5">
                <div className="bg-muted/50 rounded-2xl p-6 border border-border/50">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Transaction Amount
                      </span>
                      <span className="text-2xl font-bold text-[#206380]">
                        {formatCurrency(transaction.amount)}
                      </span>
                    </div>

                    {/* Optional: Additional info slots */}
                    {transaction.fees != null && (
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">
                          Processing Fees
                        </span>
                        <span className="text-red-600 font-medium">
                          −{formatCurrency(transaction.fees)}
                        </span>
                      </div>
                    )}

                    {transaction.netAmount != null && (
                      <div className="pt-4 border-t border-border/70 mt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-foreground">
                            Net Amount
                          </span>
                          <span className="text-2xl font-bold text-[#206380]">
                            {formatCurrency(transaction.netAmount)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center mt-10 pt-6 border-t border-border/50">
              <div className="text-sm text-muted-foreground">
                Transaction record • {formattedDate}
              </div>
              <button
                onClick={onClose}
                className="px-8 py-3.5 bg-[#206380] text-white font-medium rounded-xl hover:bg-[#1b5666] hover:shadow-lg transition-all duration-200 flex items-center gap-2"
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

// Edit Modal (fixed)
function EditTransactionModal({ transaction, onClose, onSave }) {
  const [form, setForm] = useState({ ...transaction });

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
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Edit2 className="w-6 h-6 text-[#206380]" /> Edit Transaction
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">
                Instructor
              </label>
              <input
                type="text"
                value={form.instructor}
                onChange={(e) =>
                  setForm({ ...form, instructor: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#206380]/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Amount</label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) =>
                  setForm({ ...form, amount: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#206380]/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#206380]/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#206380]/50"
              >
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
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
                className="px-6 py-3 bg-gradient-to-r from-[#206380] to-[#1b5666] text-white rounded-lg font-medium hover:shadow-lg transition flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function BulkPayoutConfirm({ open, onClose, onConfirm, count }) {
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
            <h3 className="text-xl font-bold mb-3">Confirm Bulk Payout</h3>
            <p className="text-muted-foreground mb-6">
              Process payout for {count} selected transactions?
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
