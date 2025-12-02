import React from "react";

const RightSidebar = () => {
  const className =
    "fixed right-0 top-0 h-screen w-80 bg-white dark:bg-[rgb(7,26,32)] border-r border-gray-200 dark:border-[#10303a] flex flex-col z-40";
  return <aside className={className}>this is the right sidebar</aside>;
};

export default RightSidebar;
