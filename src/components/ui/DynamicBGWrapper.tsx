"use client";

import dynamic from "next/dynamic";

const DynamicBackground = dynamic(
  () => import("@/components/ui/DynamicBackground"),
  { ssr: false }
);

export default function DynamicBGWrapper() {
  return <DynamicBackground />;
}
