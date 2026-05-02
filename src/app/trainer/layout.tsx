import type { ReactNode } from "react";
import Link from "next/link";
import { TrainerNav } from "@/components/app-nav";
import { AppFrame } from "@/components/ui";

export default function TrainerLayout({ children }: { children: ReactNode }) {
  return (
    <AppFrame>
      <header className="flex items-center justify-between px-5 py-5">
        <Link href="/trainer" className="flex items-center gap-3 text-lg font-bold text-white">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-300 text-slate-950">
            BB
          </span>
          Trainer
        </Link>
        <Link href="/app" className="text-sm font-semibold text-slate-300">
          Client view
        </Link>
      </header>
      <TrainerNav />
      {children}
    </AppFrame>
  );
}
