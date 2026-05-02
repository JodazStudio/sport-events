"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export function Logo({ width = 200, height = 45, className = "", priority = false }: LogoProps) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder or the light logo as default during SSR
    return (
      <Image
        src="/zonacrono_light.png"
        alt="Zonacrono Logo"
        width={width}
        height={height}
        className={`${className} opacity-0`}
        priority={priority}
      />
    );
  }

  const isDark = resolvedTheme === "dark";
  const logoSrc = isDark ? "/zonacrono_dark.png" : "/zonacrono_light.png";

  return (
    <Image
      src={logoSrc}
      alt="Zonacrono Logo"
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  );
}
