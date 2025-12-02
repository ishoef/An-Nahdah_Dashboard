import DashboardShell from "@/components/layout/DashobardShell";
import AdminSidebar from "@/components/sidebar/SidebarAdmin";
import React from "react";

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen">
      <AdminSidebar />
      <DashboardShell>{children}</DashboardShell>
    </div>
  );
};

export default AdminLayout;
