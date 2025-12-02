import DashboardShell from "@/components/layout/DashobardShell";
import InstructorSidebar from "@/components/sidebar/SidebarInstructor";
import React from "react";

const Layout = ({ children }) => {
  return (
    <div>
      <InstructorSidebar />
      <DashboardShell>{children}</DashboardShell>
    </div>
  );
};

export default Layout;
