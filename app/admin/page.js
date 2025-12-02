// app/admin/page.jsx  (server component)

import DashboardShell from "@/components/layout/DashobardShell";

// import { getAdminDashboardStats } from "@/lib/data";
export default async function AdminHomePage() {
  // const stats = await getAdminDashboardStats(); 
  // server-side call to DB/API

  return (
    <DashboardShell>
      <div className="">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

        <section className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded shadow">
            <div className="text-sm">Total Users</div>
            <div className="text-3xl font-semibold">500</div>
          </div>
          <div className="p-4 bg-white rounded shadow">
            <div className="text-sm">Active Courses</div>
            <div className="text-3xl font-semibold">45+</div>
          </div>
          <div className="p-4 bg-white rounded shadow">
            <div className="text-sm">Revenue</div>
            <div className="text-3xl font-semibold">$6000</div>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
