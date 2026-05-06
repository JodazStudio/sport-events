"use client";

import { useEffect } from "react";

/**
 * Component that listens for ChunkLoadError (common in low connectivity or after new deployments)
 * and triggers a page reload to attempt to recover.
 */
export function ChunkErrorListener() {
  useEffect(() => {
    const handleError = (event: ErrorEvent | PromiseRejectionEvent) => {
      // Get the error object or message
      const error = "reason" in event ? event.reason : event.error;
      const message = "message" in event ? event.message : error?.message;

      // Check if it's a ChunkLoadError
      // Next.js/Webpack/Turbopack usually throws this when a dynamic import fails
      const isChunkError = 
        error?.name === "ChunkLoadError" || 
        (message && (
          message.includes("Loading chunk") || 
          message.includes("Failed to load chunk") ||
          message.includes("ChunkLoadError")
        ));

      if (isChunkError) {
        console.warn("ChunkLoadError detected. Situation: Low connectivity or stale build. Reloading page...", { error, message });
        
        // Avoid infinite reload loops if the error persists
        const lastReload = sessionStorage.getItem("last-chunk-error-reload");
        const now = Date.now();
        
        // Only reload if the last reload was more than 10 seconds ago
        if (!lastReload || now - parseInt(lastReload) > 10000) {
          sessionStorage.setItem("last-chunk-error-reload", now.toString());
          window.location.reload();
        } else {
          console.error("ChunkLoadError persisted after reload. Stopping reload loop.");
        }
      }
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleError);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleError);
    };
  }, []);

  return null;
}
