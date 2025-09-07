import React from "react";
import { useTheme } from "../context/ThemeContext.jsx";

export default function DarkModeToggle() {
  // Get the current theme and toggle function from our theme context
  const { theme, toggle } = useTheme();

  return (
    <button className="btn outline" onClick={toggle}>
      {/* Show moon icon and "Dark Mode" text when in light mode,
          and sun icon with "Light Mode" when in dark mode */}
      {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
    </button>
  );
}