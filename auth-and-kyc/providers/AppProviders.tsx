"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import ReduxProvider from "@/providers/ReduxProvider";
import { SocketProvider } from "@/providers/SocketProvider";
import AuthSync from "@/components/auth/AuthSync";
import { ToastProvider } from "@/contexts/ToastContext";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem={false}
        disableTransitionOnChange
      >
        <ReduxProvider>
          <AuthSync />
          <ToastProvider>
            <SocketProvider>
              {children}
            </SocketProvider>
          </ToastProvider>
        </ReduxProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}

