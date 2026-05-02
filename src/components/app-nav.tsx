import Link from "next/link";
import { Dumbbell, House, Library, ListChecks, UserRound } from "lucide-react";

const items = [
  { href: "/app", label: "Home", icon: House },
  { href: "/app/library", label: "Library", icon: Library },
  { href: "/app/plan", label: "Plan", icon: Dumbbell },
  { href: "/app/routines", label: "Routines", icon: ListChecks },
  { href: "/app/profile", label: "Profile", icon: UserRound },
];

export function ClientBottomNav() {
  return (
    <nav className="sticky bottom-0 z-20 grid grid-cols-5 border-t border-white/10 bg-[#0b0f14]/95 px-2 pb-4 pt-2 backdrop-blur">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg text-xs font-medium text-slate-400 transition hover:bg-white/8 hover:text-white"
          >
            <Icon className="h-5 w-5" aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

const trainerItems = [
  { href: "/trainer", label: "Dashboard" },
  { href: "/trainer/exercises", label: "Exercises" },
  { href: "/trainer/plans", label: "Plans" },
  { href: "/trainer/clients", label: "Clients" },
  { href: "/trainer/assignments", label: "Assign" },
];

export function TrainerNav() {
  return (
    <nav className="flex gap-2 overflow-x-auto px-5 pb-4">
      {trainerItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="inline-flex min-h-11 shrink-0 items-center rounded-lg border border-white/10 bg-white/[0.06] px-4 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
