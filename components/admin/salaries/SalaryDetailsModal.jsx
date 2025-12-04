const { AnimatePresence } = require("framer-motion");
const { CheckCircle, AlertCircle, CreditCard } = require("lucide-react");

export default function SalaryDetailsModal({ salary, onClose }) {
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
