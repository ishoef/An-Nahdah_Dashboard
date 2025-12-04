"use client";

import { useState } from "react";
import DashboardShell from "@/components/layout/DashobardShell";
import { DollarSign } from "lucide-react";

export default function PayoutsPage() {
  const [payouts] = useState([
    {
      id: 1,
      month: "December 2024",
      amount: 3800,
      earnings: 3500,
      bonus: 500,
      deductions: 200,
      status: "paid",
      date: "Dec 31, 2024",
      bankDetails: "****1234",
    },
    {
      id: 2,
      month: "November 2024",
      amount: 3200,
      earnings: 2800,
      bonus: 400,
      deductions: 0,
      status: "paid",
      date: "Nov 30, 2024",
      bankDetails: "****1234",
    },
    {
      id: 3,
      month: "October 2024",
      amount: 3500,
      earnings: 3000,
      bonus: 600,
      deductions: 100,
      status: "paid",
      date: "Oct 31, 2024",
      bankDetails: "****1234",
    },
  ]);

  const pendingPayout = {
    month: "January 2025",
    estimatedAmount: 3950,
    earnings: 3500,
    bonus: 600,
    deductions: 150,
    status: "pending",
  };

  const totalEarnings = payouts.reduce((sum, p) => sum + p.earnings, 0);

  return (
    <DashboardShell>
      <div className="min-h-screen bg-linear-to-br from-background via-background to-background/80 p-8">
        {/* Header */}
        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <h1 className="text-4xl font-bold text-foreground tracking-tight">
            Payouts
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Track your earnings and payout history
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4">
            <p className="text-sm text-muted-foreground mb-2">Total Earnings</p>
            <p className="text-2xl font-bold text-foreground">
              ${totalEarnings.toLocaleString()}
            </p>
            <p className="text-xs text-emerald-600 mt-2">
              ↑ 12% from last quarter
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4">
            <p className="text-sm text-muted-foreground mb-2">Pending Payout</p>
            <p className="text-2xl font-bold text-amber-600">
              ${pendingPayout.estimatedAmount}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Expected by Jan 15
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4">
            <p className="text-sm text-muted-foreground mb-2">Total Bonuses</p>
            <p className="text-2xl font-bold text-emerald-600">$1,500</p>
            <p className="text-xs text-muted-foreground mt-2">
              Performance bonuses
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4">
            <p className="text-sm text-muted-foreground mb-2">
              Payouts This Year
            </p>
            <p className="text-2xl font-bold text-foreground">12</p>
            <p className="text-xs text-muted-foreground mt-2">
              Monthly transfers
            </p>
          </div>
        </div>

        {/* Pending Payout */}
        <div className="mb-8 rounded-2xl border border-primary/20 bg-primary/5 p-6 animate-in fade-in slide-in-from-left-4 duration-500">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                {pendingPayout.month}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Earnings</p>
                  <p className="text-lg font-bold text-foreground">
                    ${pendingPayout.earnings}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Bonus</p>
                  <p className="text-lg font-bold text-emerald-600">
                    +${pendingPayout.bonus}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Deductions
                  </p>
                  <p className="text-lg font-bold text-red-600">
                    -${pendingPayout.deductions}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total</p>
                  <p className="text-lg font-bold text-primary">
                    ${pendingPayout.estimatedAmount}
                  </p>
                </div>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400">
              Pending
            </span>
          </div>
        </div>

        {/* Payout History */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Payout History
          </h2>

          <div className="space-y-3">
            {payouts.map((payout, idx) => (
              <div
                key={payout.id}
                className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4 hover:border-primary/50 hover:shadow-lg transition-all duration-300 group/payout"
                style={{ animationDelay: `${idx * 30}ms` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-5 h-5 text-primary" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground">
                        {payout.month}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Paid to {payout.bankDetails}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          ${payout.earnings} earnings
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                          +${payout.bonus} bonus
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400">
                          -${payout.deductions} deductions
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">
                      ${payout.amount}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {payout.date}
                    </p>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mt-2">
                      Paid
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
