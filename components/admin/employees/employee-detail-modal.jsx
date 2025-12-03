"use client";

export function EmployeeDetailModal({ employee, onClose, onEdit, onDelete }) {
  if (!employee) return null;

  const initials = employee.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString();
    } catch (e) {
      return dateStr;
    }
  };

  const calculateTenure = (hireDate) => {
    try {
      const hire = new Date(hireDate);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - hire.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const years = Math.floor(diffDays / 365);
      const months = Math.floor((diffDays % 365) / 30);
      if (years > 0) return `${years}y ${months}m`;
      return `${months}m`;
    } catch (e) {
      return "N/A";
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-end sm:items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-2xl w-full p-6 shadow-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-semibold text-white"
              style={{ background: employee.avatarColor }}
            >
              {initials}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {employee.name}
              </h2>
              <p className="text-sm text-slate-500">
                {employee.position} • {employee.department}
              </p>
              <p className="text-xs text-slate-400 mt-1">ID: {employee.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 text-2xl font-light"
          >
            ×
          </button>
        </div>

        {/* Status Badge */}
        <div className="mb-6">
          <div
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              employee.status === "Active"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            <span className="w-2 h-2 rounded-full mr-2 bg-current"></span>
            {employee.status}
          </div>
        </div>

        {/* Main Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-700">
              Contact Information
            </h3>

            <div>
              <label className="text-xs text-slate-500 block mb-1">
                Email Address
              </label>
              <div className="flex items-center justify-between">
                <a
                  href={`mailto:${employee.email}`}
                  className="text-sm text-blue-600 hover:underline break-all"
                >
                  {employee.email}
                </a>
                <button
                  onClick={() => navigator.clipboard?.writeText(employee.email)}
                  className="text-xs px-2 py-1 hover:bg-slate-100 rounded"
                  title="Copy email"
                >
                  Copy
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-500 block mb-1">
                Phone Number
              </label>
              <a
                href={`tel:${employee.phone}`}
                className="text-sm font-medium text-slate-900 hover:text-blue-600"
              >
                {employee.phone}
              </a>
            </div>

            <div>
              <label className="text-xs text-slate-500 block mb-1">
                Location
              </label>
              <p className="text-sm font-medium text-slate-900">
                {employee.location}
              </p>
            </div>
          </div>

          {/* Employment Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-700">
              Employment Information
            </h3>

            <div>
              <label className="text-xs text-slate-500 block mb-1">Role</label>
              <p className="text-sm font-medium text-slate-900">
                {employee.role}
              </p>
            </div>

            <div>
              <label className="text-xs text-slate-500 block mb-1">
                Hire Date
              </label>
              <p className="text-sm font-medium text-slate-900">
                {formatDate(employee.hireDate)}
              </p>
            </div>

            <div>
              <label className="text-xs text-slate-500 block mb-1">
                Tenure
              </label>
              <p className="text-sm font-medium text-slate-900">
                {calculateTenure(employee.hireDate)}
              </p>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mb-6 p-4 bg-slate-50 rounded-lg">
          <h3 className="text-sm font-semibold text-slate-700 mb-2">
            Biography
          </h3>
          <p className="text-sm text-slate-600">{employee.bio}</p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>
          {onEdit && (
            <button
              onClick={() => onEdit(employee)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              Edit Employee
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(employee.id)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
            >
              Delete Employee
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
