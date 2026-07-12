"use client";

import React from "react";
import { ThemeProvider, useTheme } from "@/components/layout/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";

function InnerShell({ children }: { children: React.ReactNode }) {
  const { theme, toggle } = useTheme();
  return (
    <>
      <Navbar theme={theme} onThemeToggle={toggle} />
      <main className="pt-16 min-h-screen">{children}</main>
    </>
  );
}

export function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <InnerShell>{children}</InnerShell>
    </ThemeProvider>
  );
}
