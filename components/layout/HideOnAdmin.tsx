"use client";

import { usePathname } from "next/navigation";

interface HideOnAdminProps {
  children: React.ReactNode;
}

export function HideOnAdmin({ children }: HideOnAdminProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return null;
  }

  return <>{children}</>;
}
