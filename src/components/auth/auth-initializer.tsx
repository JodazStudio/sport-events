"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store";

/**
 * Initializes the auth state and sets up listeners for session changes.
 * This component should be rendered at the root of the application.
 */
export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return <>{children}</>;
}
