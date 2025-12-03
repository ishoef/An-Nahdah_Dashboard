import React from "react";
import TopBar from "./top-bar";

const DashboardShell = ({ children }) => {
  return (
    <>
      <TopBar />
      <div className="ml-40 mt-15">{children}</div>
    </>
  );
};

export default DashboardShell;
