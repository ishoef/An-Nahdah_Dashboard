"use client";

import { Moon, Sun } from "lucide-react";
import React, { useEffect, useState } from "react";

const ThemeToggle = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  });

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains("dark");

    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.thene = "light";
      setTheme("light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.thene = "dark";
      setTheme("dark");
    }
  };
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-muted transition-colors duration-200"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5 text-muted-foreground" />
      ) : (
        <Sun className="w-5 h-5 text-muted-foreground" />
      )}
    </button>
  );
};

export default ThemeToggle;
