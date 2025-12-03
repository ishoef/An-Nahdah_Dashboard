export function EmployeeStats({ employees }) {
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => e.status === "Active").length;
  const onLeaveEmployees = employees.filter(
    (e) => e.status === "On Leave"
  ).length;

  const departmentStats = employees.reduce((acc, emp) => {
    acc[emp.department] = (acc[emp.department] || 0) + 1;
    return acc;
  }, {});

  const roleStats = employees.reduce((acc, emp) => {
    acc[emp.role] = (acc[emp.role] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Employees Card */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
        <div className="text-sm font-medium text-slate-600">
          Total Employees
        </div>
        <div className="mt-2 flex items-end justify-between">
          <div className="text-3xl font-bold text-slate-900">
            {totalEmployees}
          </div>
          <div className="text-xs text-slate-500">100%</div>
        </div>
      </div>

      {/* Active Employees Card */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
        <div className="text-sm font-medium text-emerald-600">Active Staff</div>
        <div className="mt-2 flex items-end justify-between">
          <div className="text-3xl font-bold text-emerald-700">
            {activeEmployees}
          </div>
          <div className="text-xs text-emerald-600">
            {totalEmployees > 0
              ? Math.round((activeEmployees / totalEmployees) * 100)
              : 0}
            %
          </div>
        </div>
      </div>

      {/* On Leave Card */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
        <div className="text-sm font-medium text-amber-600">On Leave</div>
        <div className="mt-2 flex items-end justify-between">
          <div className="text-3xl font-bold text-amber-700">
            {onLeaveEmployees}
          </div>
          <div className="text-xs text-amber-600">
            {totalEmployees > 0
              ? Math.round((onLeaveEmployees / totalEmployees) * 100)
              : 0}
            %
          </div>
        </div>
      </div>

      {/* Departments Card */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
        <div className="text-sm font-medium text-blue-600">Departments</div>
        <div className="mt-2">
          <div className="text-3xl font-bold text-blue-700">
            {Object.keys(departmentStats).length}
          </div>
          <div className="text-xs text-slate-500 mt-2">
            {Object.entries(departmentStats)
              .map(([dept, count]) => `${dept}: ${count}`)
              .join(" • ")}
          </div>
        </div>
      </div>
    </div>
  );
}
