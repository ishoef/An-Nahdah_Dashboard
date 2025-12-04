"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Grid3X3,
  List,
  Eye,
  Edit2,
  X,
  CheckCircle,
  Plus,
  Gift,
  Repeat,
  DollarSign,
  Clock,
  XCircle,
  User,
  Tag,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardShell from "@/components/layout/DashobardShell";

const PRIMARY = "#206380";

function formatCurrency(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

function downloadCSV(rows, filename = "donations.csv") {
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

export default function DonationMaintainPage() {
  const [donations, setDonations] = useState([
    {
      id: "DN-1001",
      donor: "John Doe",
      amount: 100,
      date: "2025-11-27",
      type: "One-time",
      campaign: "Education Fund",
      status: "Completed",
    },
    {
      id: "DN-1002",
      donor: "Jane Smith",
      amount: 50,
      date: "2025-11-26",
      type: "Monthly",
      campaign: "Health Initiative",
      status: "Pending",
    },
    {
      id: "DN-1003",
      donor: "Alice Johnson",
      amount: 200,
      date: "2025-11-25",
      type: "One-time",
      campaign: "Education Fund",
      status: "Completed",
    },
    {
      id: "DN-1004",
      donor: "Bob Brown",
      amount: 75,
      date: "2025-11-23",
      type: "Monthly",
      campaign: "Environment Project",
      status: "Completed",
    },
    {
      id: "DN-1005",
      donor: "Charlie Davis",
      amount: 150,
      date: "2025-11-20",
      type: "One-time",
      campaign: "Health Initiative",
      status: "Failed",
    },
    {
      id: "DN-1006",
      donor: "Dana Evans",
      amount: 30,
      date: "2025-11-18",
      type: "Monthly",
      campaign: "Education Fund",
      status: "Completed",
    },
    {
      id: "DN-1007",
      donor: "Eve Foster",
      amount: 500,
      date: "2025-11-15",
      type: "One-time",
      campaign: "Environment Project",
      status: "Pending",
    },
    {
      id: "DN-1008",
      donor: "Frank Green",
      amount: 100,
      date: "2025-11-12",
      type: "Monthly",
      campaign: "Health Initiative",
      status: "Failed",
    },
    {
      id: "DN-1009",
      donor: "Grace Harris",
      amount: 250,
      date: "2025-11-10",
      type: "One-time",
      campaign: "Education Fund",
      status: "Completed",
    },
    {
      id: "DN-1010",
      donor: "Henry Irving",
      amount: 40,
      date: "2025-11-08",
      type: "Monthly",
      campaign: "Environment Project",
      status: "Pending",
    },
    {
      id: "DN-1011",
      donor: "Ivy Jackson",
      amount: 300,
      date: "2025-11-05",
      type: "One-time",
      campaign: "Health Initiative",
      status: "Completed",
    },
    {
      id: "DN-1012",
      donor: "Jack King",
      amount: 60,
      date: "2025-11-02",
      type: "Monthly",
      campaign: "Education Fund",
      status: "Failed",
    },
  ]);

  // UI state
  const [range, setRange] = useState("all"); // "all" | "last30" | "last7"
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState("table"); // "table" | "grid"
  const [selectedIds, setSelectedIds] = useState([]);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(null);
  const [showEditModal, setShowEditModal] = useState(null);
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);
  const [sortBy, setSortBy] = useState({ field: "date", order: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Derived data
  const filteredDonations = useMemo(() => {
    // clone before sorting to avoid mutating state
    let dons = [...donations];

    if (range !== "all") {
      const now = new Date("2025-12-04");
      const cutoff = new Date(now);
      cutoff.setDate(now.getDate() - (range === "last30" ? 30 : 7));
      dons = dons.filter((d) => new Date(d.date) >= cutoff);
    }

    if (query) {
      const q = query.toLowerCase();
      dons = dons.filter(
        (d) =>
          d.id.toLowerCase().includes(q) ||
          d.donor.toLowerCase().includes(q) ||
          d.campaign.toLowerCase().includes(q) ||
          d.type.toLowerCase().includes(q) ||
          d.status.toLowerCase().includes(q)
      );
    }

    dons.sort((a, b) => {
      if (sortBy.field === "amount")
        return sortBy.order === "asc"
          ? a.amount - b.amount
          : b.amount - a.amount;
      if (sortBy.field === "date")
        return sortBy.order === "asc"
          ? +new Date(a.date) - +new Date(b.date)
          : +new Date(b.date) - +new Date(a.date);
      return 0;
    });

    return dons;
  }, [donations, range, query, sortBy]);

  // Reset pagination if filter/search changes so we don't end up on an empty page
  useEffect(() => {
    setCurrentPage(1);
  }, [range, query, sortBy, donations.length]);

  const paginatedDonations = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredDonations.slice(start, start + itemsPerPage);
  }, [filteredDonations, currentPage]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredDonations.length / itemsPerPage)
  );

  const totalDonations = filteredDonations.reduce(
    (sum, d) => sum + d.amount,
    0
  );
  const monthlyDonations = filteredDonations
    .filter((d) => d.type === "Monthly")
    .reduce((sum, d) => sum + d.amount, 0);
  const oneTimeDonations = filteredDonations
    .filter((d) => d.type === "One-time")
    .reduce((sum, d) => sum + d.amount, 0);

  const campaignTotals = useMemo(() => {
    return filteredDonations.reduce((acc, d) => {
      acc[d.campaign] = (acc[d.campaign] || 0) + d.amount;
      return acc;
    }, {});
  }, [filteredDonations]);

  const statusCounts = useMemo(() => {
    return filteredDonations.reduce((acc, d) => {
      acc[d.status] = (acc[d.status] || 0) + 1;
      return acc;
    }, {});
  }, [filteredDonations]);

  const dailyData = useMemo(() => {
    const data = {};
    filteredDonations.forEach((d) => {
      data[d.date] = (data[d.date] || 0) + d.amount;
    });
    return Object.entries(data)
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => +new Date(a.date) - +new Date(b.date));
  }, [filteredDonations]);

  const campaignData = useMemo(
    () =>
      Object.entries(campaignTotals).map(([campaign, value]) => ({
        campaign,
        value,
      })),
    [campaignTotals]
  );

  // Chart builders
  function buildLinePath(data, w = 760, h = 260, pad = 28) {
    if (!data.length) return { line: "", area: "" };
    const values = data.map((d) => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const rangeV = max - min || 1;
    const stepX = (w - pad * 2) / Math.max(1, data.length - 1);
    const points = data.map((d, i) => [
      pad + i * stepX,
      pad + (1 - (d.value - min) / rangeV) * (h - pad * 2),
    ]);
    const line = points
      .map(
        (p, i) => `${i === 0 ? "M" : "L"} ${p[0].toFixed(2)} ${p[1].toFixed(2)}`
      )
      .join(" ");
    const last = points[points.length - 1];
    const first = points[0];
    const area = `${line} L ${last[0]} ${h - pad} L ${first[0]} ${h - pad} Z`;
    return { line, area };
  }

  function buildPiePath(data, w = 380, h = 260, pad = 28) {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    if (!data.length || total === 0) return []; // guard against empty / zero
    let startAngle = 0;
    const radius = Math.min(w, h) / 2 - pad;
    const cx = w / 2;
    const cy = h / 2;
    const paths = [];
    const colors = ["#10B981", "#F59E0B", "#EF4444", "#3B82F6", "#A855F7"];

    data.forEach((d, i) => {
      const angle = (d.value / total) * 360;
      const endAngle = startAngle + angle;
      const largeArc = angle > 180 ? 1 : 0;
      const x1 = cx + radius * Math.cos((startAngle * Math.PI) / 180);
      const y1 = cy + radius * Math.sin((startAngle * Math.PI) / 180);
      const x2 = cx + radius * Math.cos((endAngle * Math.PI) / 180);
      const y2 = cy + radius * Math.sin((endAngle * Math.PI) / 180);

      paths.push({
        path: `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`,
        color: colors[i % colors.length],
        label: d.campaign,
        value: d.value,
      });
      startAngle = endAngle;
    });

    return paths;
  }

  const lineChart = buildLinePath(dailyData);
  const pieChart = buildPiePath(campaignData);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedIds(
      selectedIds.length === paginatedDonations.length
        ? []
        : paginatedDonations.map((d) => d.id)
    );
  };

  const handleBulkProcess = () => {
    if (selectedIds.length) setShowBulkConfirm(true);
  };

  const confirmBulkProcess = () => {
    const now = new Date().toISOString().split("T")[0];
    setDonations((prev) =>
      prev.map((d) =>
        selectedIds.includes(d.id) && d.status === "Pending"
          ? { ...d, status: "Completed", date: now }
          : d
      )
    );
    setSelectedIds([]);
    setShowBulkConfirm(false);
  };

  const updateDonation = (updatedDon) => {
    setDonations((prev) =>
      prev.map((d) => (d.id === updatedDon.id ? updatedDon : d))
    );
    setShowEditModal(null);
  };

  const addNewDonation = (newDon) => {
    setDonations((prev) => [
      {
        ...newDon,
        id: `DN-${Math.floor(Math.random() * 9000 + 1000)}`,
        status: "Pending",
      },
      ...prev,
    ]);
    setShowDonationModal(false);
  };

  const handleSort = (field) => {
    setSortBy((prev) => ({
      field,
      order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <DashboardShell>
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/40 p-4">
        <div className="mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Donation Management
              </h1>
              <p className="mt-2 text-muted-foreground max-w-xl">
                Track, analyze, and manage all donations, campaigns, and
                recurring contributions in one place.
              </p>
              <div className="mt-3 flex gap-2 text-xs text-muted-foreground flex-wrap">
                {["Completed", "Pending", "Failed"].map((st) => (
                  <span
                    key={st}
                    className="inline-flex items-center gap-1 rounded-full bg-card border border-border px-3 py-1"
                  >
                    <span className="font-semibold">{st}</span>
                    <span className="text-[11px] opacity-70">
                      {statusCounts[st] || 0} donations
                    </span>
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-card border border-border rounded-md p-1.5">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <select
                  value={range}
                  onChange={(e) => setRange(e.target.value)}
                  className="bg-transparent text-sm outline-none"
                >
                  <option value="all">All Time</option>
                  <option value="last30">Last 30 Days</option>
                  <option value="last7">Last 7 Days</option>
                </select>
              </div>
              <button
                onClick={() => setShowDonationModal(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-[#206380] to-[#1b5666] text-white rounded-md font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> New Donation
              </button>
              <button
                onClick={() => downloadCSV(filteredDonations)}
                className="px-4 py-2.5 border border-border rounded-md hover:bg-muted transition font-medium flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Export
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <KPICard
              title="Total Donations"
              value={formatCurrency(totalDonations)}
              hint={`In ${range === "all" ? "selected range" : range}`}
              trend="up"
            />
            <KPICard
              title="Monthly Recurring"
              value={formatCurrency(monthlyDonations)}
              hint="Active subscriptions"
              trend="up"
            />
            <KPICard
              title="One-time Gifts"
              value={formatCurrency(oneTimeDonations)}
              hint="Non-recurring"
              trend="down"
            />
            <KPICard
              title="Campaigns Active"
              value={Object.keys(campaignTotals).length}
              hint="Unique campaigns"
              trend="up"
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Line Chart: Donations Over Time */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Donations Over Time
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {dailyData.length} data points
                  </p>
                </div>
                <div className="text-lg font-bold text-foreground">
                  {formatCurrency(totalDonations)}
                </div>
              </div>
              <svg
                viewBox="0 0 760 260"
                width="100%"
                height="260"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="donLineG" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={PRIMARY} stopOpacity="0.18" />
                    <stop
                      offset="100%"
                      stopColor={PRIMARY}
                      stopOpacity="0.04"
                    />
                  </linearGradient>
                </defs>
                <path d={lineChart.area} fill="url(#donLineG)" stroke="none" />
                <path
                  d={lineChart.line}
                  fill="none"
                  stroke={PRIMARY}
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                {dailyData.map((d, i) => {
                  const w = 760;
                  const h = 260;
                  const pad = 28;
                  const values = dailyData.map((x) => x.value);
                  const min = Math.min(...values);
                  const max = Math.max(...values);
                  const rangeV = max - min || 1;
                  const stepX =
                    (w - pad * 2) / Math.max(1, dailyData.length - 1);
                  const x = pad + i * stepX;
                  const y =
                    pad + (1 - (d.value - min) / rangeV) * (h - pad * 2);
                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r={3.5}
                      fill="#fff"
                      stroke={PRIMARY}
                      strokeWidth="1.6"
                    />
                  );
                })}
                {dailyData.map((d, i) => {
                  const w = 760;
                  const pad = 28;
                  const stepX =
                    (w - pad * 2) / Math.max(1, dailyData.length - 1);
                  const x = pad + i * stepX;
                  return (
                    <text
                      key={i}
                      x={x}
                      y={250}
                      fontSize="10"
                      textAnchor="middle"
                      fill="#7A8B8F"
                    >
                      {d.date.slice(-5)}
                    </text>
                  );
                })}
              </svg>
            </div>

            {/* Pie Chart: Donations by Campaign */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Donations by Campaign
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Distribution overview
                  </p>
                </div>
                <div className="text-lg font-bold text-foreground">
                  {formatCurrency(totalDonations)}
                </div>
              </div>
              <svg
                viewBox="0 0 380 260"
                width="100%"
                height="260"
                preserveAspectRatio="none"
              >
                {pieChart.map((slice, i) => (
                  <path key={i} d={slice.path} fill={slice.color} />
                ))}
              </svg>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {pieChart.map((slice, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: slice.color }}
                    />
                    <span className="truncate">
                      {slice.label}: {formatCurrency(slice.value)}
                    </span>
                  </div>
                ))}
                {pieChart.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No campaign data available for this range.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Donations Table / Grid */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  All Donations
                </h3>
                <p className="text-sm text-muted-foreground">
                  Manage one-time and monthly contributions
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by ID, donor, campaign..."
                    className="pl-10 pr-4 py-2.5 rounded-md border border-border bg-background text-sm w-72 focus:outline-none focus:ring-2 focus:ring-[#206380]/50 transition"
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
              <DonationTable
                donations={paginatedDonations}
                selectedIds={selectedIds}
                onToggleSelect={toggleSelect}
                onToggleSelectAll={toggleSelectAll}
                onViewDetails={setShowDetailsModal}
                onEdit={setShowEditModal}
                onBulkProcess={handleBulkProcess}
                onSort={handleSort}
                sortBy={sortBy}
              />
            )}

            {viewMode === "grid" && (
              <DonationGrid
                donations={paginatedDonations}
                onViewDetails={setShowDetailsModal}
                onEdit={setShowEditModal}
              />
            )}

            {/* Pagination */}
            <div className="mt-6 flex justify-between items-center">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className="px-4 py-2 border border-border rounded-md disabled:opacity-50 hover:bg-muted transition"
              >
                Previous
              </button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                className="px-4 py-2 border border-border rounded-md disabled:opacity-50 hover:bg-muted transition"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Modals */}
        <DonationModal
          open={showDonationModal}
          onClose={() => setShowDonationModal(false)}
          onSubmit={addNewDonation}
        />
        {showDetailsModal && (
          <DonationDetailsModal
            donation={showDetailsModal}
            onClose={() => setShowDetailsModal(null)}
          />
        )}
        {showEditModal && (
          <EditDonationModal
            donation={showEditModal}
            onClose={() => setShowEditModal(null)}
            onSave={updateDonation}
          />
        )}
        <BulkProcessConfirm
          open={showBulkConfirm}
          onClose={() => setShowBulkConfirm(false)}
          onConfirm={confirmBulkProcess}
          count={selectedIds.length}
        />
      </div>
    </DashboardShell>
  );
}

/* === Subcomponents === */

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
    Completed: {
      text: "Completed",
      className: "bg-emerald-500/10 text-emerald-600",
    },
    Pending: { text: "Pending", className: "bg-amber-500/10 text-amber-600" },
    Failed: { text: "Failed", className: "bg-rose-500/10 text-rose-600" },
  };
  const s = map[status] || {
    text: status,
    className: "bg-gray-500/10 text-gray-600",
  };
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${s.className}`}
    >
      {s.text}
    </span>
  );
}

function TypeBadge({ type }) {
  const map = {
    "One-time": { icon: Gift, color: "text-blue-600" },
    Monthly: { icon: Repeat, color: "text-purple-600" },
  };
  const { icon: Icon, color } = map[type] || {
    icon: DollarSign,
    color: "text-gray-600",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-muted/50 ${color}`}
    >
      <Icon className="w-3 h-3" /> {type}
    </span>
  );
}

function DonationTable({
  donations,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onViewDetails,
  onEdit,
  onBulkProcess,
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
                  selectedIds.length === donations.length &&
                  donations.length > 0
                }
                onChange={onToggleSelectAll}
                className="rounded border-border accent-[#206380]"
              />
            </th>
            <th className="px-6 py-4">ID</th>
            <th className="px-6 py-4">Donor</th>
            <th
              className="px-6 py-4 cursor-pointer"
              onClick={() => onSort("amount")}
            >
              Amount{" "}
              {sortBy.field === "amount"
                ? sortBy.order === "asc"
                  ? "↑"
                  : "↓"
                : ""}
            </th>
            <th
              className="px-6 py-4 cursor-pointer"
              onClick={() => onSort("date")}
            >
              Date{" "}
              {sortBy.field === "date"
                ? sortBy.order === "asc"
                  ? "↑"
                  : "↓"
                : ""}
            </th>
            <th className="px-6 py-4">Type</th>
            <th className="px-6 py-4">Campaign</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {donations.map((d) => (
            <tr
              key={d.id}
              className="border-b border-border hover:bg-muted/20 transition-colors"
            >
              <td className="px-6 py-4">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(d.id)}
                  onChange={() => onToggleSelect(d.id)}
                  className="rounded border-border accent-[#206380]"
                />
              </td>
              <td className="px-6 py-4 font-medium">{d.id}</td>
              <td className="px-6 py-4">{d.donor}</td>
              <td className="px-6 py-4">{formatCurrency(d.amount)}</td>
              <td className="px-6 py-4 text-muted-foreground">{d.date}</td>
              <td className="px-6 py-4">
                <TypeBadge type={d.type} />
              </td>
              <td className="px-6 py-4">{d.campaign}</td>
              <td className="px-6 py-4">
                <StatusBadge status={d.status} />
              </td>
              <td className="px-6 py-4 text-right flex gap-2 justify-end">
                <button
                  onClick={() => onViewDetails(d)}
                  className="p-2 hover:bg-muted rounded-md transition"
                >
                  <Eye className="w-4 h-4 text-muted-foreground" />
                </button>
                <button
                  onClick={() => onEdit(d)}
                  className="p-2 hover:bg-muted rounded-md transition"
                >
                  <Edit2 className="w-4 h-4 text-muted-foreground" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedIds.length > 0 && (
        <div className="p-4 border-t border-border flex justify-end">
          <button
            onClick={onBulkProcess}
            className="px-6 py-2.5 bg-gradient-to-r from-[#206380] to-[#1b5666] text-white rounded-md font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Gift className="w-4 h-4" /> Process Selected ({selectedIds.length})
          </button>
        </div>
      )}
    </div>
  );
}

function DonationGrid({ donations, onViewDetails, onEdit }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <AnimatePresence>
        {donations.map((d) => (
          <motion.div
            key={d.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6 hover:border-[#206380]/50 hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                {d.donor}
              </h3>
              <StatusBadge status={d.status} />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              ID: {d.id} • Campaign: {d.campaign}
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium">{formatCurrency(d.amount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">{d.date}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Type</span>
                <TypeBadge type={d.type} />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => onViewDetails(d)}
                className="flex-1 px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-muted transition flex items-center gap-2 justify-center"
              >
                <Eye className="w-4 h-4" /> View
              </button>
              <button
                onClick={() => onEdit(d)}
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

function DonationModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState({
    donor: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    type: "One-time",
    campaign: "Education Fund",
  });

  const handleSubmit = () => {
    if (!form.donor || !form.amount) return;
    onSubmit({
      ...form,
      amount: parseFloat(form.amount),
    });
    setForm({
      donor: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      type: "One-time",
      campaign: "Education Fund",
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
              <Gift className="w-6 h-6 text-[#206380]" /> New Donation
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">
                Donor Name
              </label>
              <input
                type="text"
                value={form.donor}
                onChange={(e) => setForm({ ...form, donor: e.target.value })}
                placeholder="e.g. John Doe"
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#206380]/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Amount</label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="e.g. 100"
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
              <label className="block text-sm font-medium mb-2">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#206380]/50"
              >
                <option>One-time</option>
                <option>Monthly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Campaign</label>
              <select
                value={form.campaign}
                onChange={(e) => setForm({ ...form, campaign: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#206380]/50"
              >
                <option>Education Fund</option>
                <option>Health Initiative</option>
                <option>Environment Project</option>
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
                disabled={!form.donor || !form.amount}
                className="px-6 py-3 bg-gradient-to-r from-[#206380] to-[#1b5666] text-white rounded-lg font-medium hover:shadow-lg transition disabled:opacity-50 flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" /> Create
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function DonationDetailsModal({ donation, onClose }) {
  if (!donation) return null;

  const statusConfig = {
    Completed: {
      icon: CheckCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-500/10",
      label: "Completed",
    },
    Pending: {
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-500/10",
      label: "Pending",
    },
    Failed: {
      icon: XCircle,
      color: "text-rose-600",
      bg: "bg-rose-500/10",
      label: "Failed",
    },
  };

  const {
    icon: StatusIcon,
    color,
    bg,
    label,
  } = statusConfig[donation.status] || statusConfig.Pending;

  const formattedDate = new Date(donation.date).toLocaleDateString("en-US", {
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
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg rounded-3xl bg-card shadow-2xl border border-border/50 overflow-hidden"
        >
          {/* Gradient Header */}
          <div className="relative bg-gradient-to-br from-[#206380] via-[#1e5a72] to-[#1b4f63] px-8 py-10 text-white">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2.5 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur-sm transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Gift className="w-9 h-9" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Donation Details</h2>
                <p className="text-white/80 mt-1 text-sm">ID: {donation.id}</p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="absolute top-6 left-8">
              <span
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm ${bg} ${color.replace(
                  "text-",
                  "border-"
                )}`}
              >
                <StatusIcon className={`w-4 h-4 ${color}`} />
                {label}
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="p-8 bg-card">
            <div className="grid grid-cols-1 gap-5 border-b border-border/50 pb-6 mb-6">
              {/* Donor */}
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-muted/50 group-hover:bg-muted transition-colors">
                    <User className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Donor</p>
                    <p className="text-lg font-semibold text-foreground">
                      {donation.donor}
                    </p>
                  </div>
                </div>
              </div>

              {/* Amount */}
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="text-2xl font-bold text-foreground">
                      {formatCurrency(donation.amount)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="text-lg font-medium text-foreground">
                      {formattedDate}
                    </p>
                  </div>
                </div>
              </div>

              {/* Type */}
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                    <Repeat className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="text-lg font-medium text-foreground">
                      {donation.type}
                    </p>
                  </div>
                </div>
              </div>

              {/* Campaign */}
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors">
                    <Tag className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Campaign</p>
                    <p className="text-lg font-medium text-foreground">
                      {donation.campaign}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-5 py-3 text-sm font-medium text-foreground hover:bg-muted/70 rounded-xl transition-all"
              >
                Close
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#206380] to-[#1b5666] rounded-xl shadow-lg hover:shadow-xl hover:brightness-110 transition-all flex items-center gap-2"
              >
                Done
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function EditDonationModal({ donation, onClose, onSave }) {
  const [form, setForm] = useState({ ...donation });

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
              <Edit2 className="w-6 h-6 text-[#206380]" /> Edit Donation
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">
                Donor Name
              </label>
              <input
                type="text"
                value={form.donor}
                onChange={(e) => setForm({ ...form, donor: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#206380]/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Amount</label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) =>
                  setForm({
                    ...form,
                    amount: parseFloat(e.target.value) || 0,
                  })
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
              <label className="block text-sm font-medium mb-2">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#206380]/50"
              >
                <option>One-time</option>
                <option>Monthly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Campaign</label>
              <select
                value={form.campaign}
                onChange={(e) => setForm({ ...form, campaign: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#206380]/50"
              >
                <option>Education Fund</option>
                <option>Health Initiative</option>
                <option>Environment Project</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#206380]/50"
              >
                <option>Completed</option>
                <option>Pending</option>
                <option>Failed</option>
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

function BulkProcessConfirm({ open, onClose, onConfirm, count }) {
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
              <Gift className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">Confirm Bulk Process</h3>
            <p className="text-muted-foreground mb-6">
              Process {count} selected donations?
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
