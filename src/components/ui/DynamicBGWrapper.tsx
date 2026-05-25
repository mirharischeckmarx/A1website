"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const DynamicBackground = dynamic(
  () => import("@/components/ui/DynamicBackground"),
  { ssr: false }
);

export default function DynamicBGWrapper() {
  const pathname = usePathname();
  if (pathname?.startsWith("/preview")) return null;
  return <DynamicBackground />;
}
