import type { ReactNode } from "react";
import { ClientBottomNav } from "@/components/app-nav";
import { PhoneShell } from "@/components/ui";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <PhoneShell>
      <div className="min-h-screen pb-2">{children}</div>
      <ClientBottomNav />
    </PhoneShell>
  );
}
