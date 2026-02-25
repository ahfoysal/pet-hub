"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Button from "./Button";


export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const themeIcon =
    theme === "dark" ? (
      <Sun className="h-5 w-5" />
    ) : (
      <Moon className="h-5 w-5" />
    );

  return (
    <Button
      text=""
      variant="ghost"
      size="icon"
      icon={themeIcon}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    />
  );
}
