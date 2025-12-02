"use client";
import AdminDashboard from "@/components/dashboards/admin-dashboard";
import InstructorDashboard from "@/components/dashboards/instructor-dashboard";
import DashboardLayout from "@/components/layout/dashboard-layout";
import Image from "next/image";
import { useState } from "react";
import { userRole } from "@/utility/userRole";
export default function Home() {
  

  return (
    // <DashboardLayout>
    //   {userRole === "admin" ? <AdminDashboard /> : <InstructorDashboard />}
    // </DashboardLayout>

    <>{userRole === "admin" ? <AdminDashboard /> : <InstructorDashboard />}</>
  );
}
