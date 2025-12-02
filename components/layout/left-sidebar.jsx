import Link from "next/link";
import React from "react";
import Logo from "../ui/Logo";
import { userRole } from "@/utility/userRole";
import AdminSidebar from "../admin/admin-sidebar";
import InstructorSidebar from "../instructor/instructor-sidebar";
const LeftSidebar = () => {
  const className =
    "fixed left-0 top-0 h-screen w-80 bg-white dark:bg-[#071a20] border-r border-gray-200 dark:border-[#10303a] flex flex-col z-40  overflow-y-auto scrollbar-hide";
  return <>{userRole === "admin" ? <InstructorSidebar /> : <AdminSidebar />}</>;
};

export default LeftSidebar;
