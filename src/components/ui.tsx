import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function AppFrame({ children }: { children: ReactNode }) {
  return <main className="mx-auto min-h-screen w-full max-w-6xl">{children}</main>;
}

export function PhoneShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-md overflow-x-hidden border-x border-white/8 bg-[#0b0f14] shadow-2xl shadow-black/30">
      {children}
    </div>
  );
}

export function ScreenHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 px-5 pb-4 pt-6">
      <div>
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-1 text-3xl font-semibold tracking-normal text-white">
          {title}
        </h1>
      </div>
      {action}
    </div>
  );
}

export function Panel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-lg border border-white/10 bg-white/[0.06]", className)}>
      {children}
    </section>
  );
}

export function Badge({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "green" | "blue" }) {
  return (
    <span
      className={cn(
        "inline-flex min-h-8 items-center rounded-full px-3 text-xs font-semibold",
        tone === "green" && "bg-emerald-300/15 text-emerald-200",
        tone === "blue" && "bg-sky-300/15 text-sky-200",
        tone === "default" && "bg-white/10 text-slate-200",
      )}
    >
      {children}
    </span>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold transition",
        variant === "primary" && "bg-emerald-300 text-slate-950 hover:bg-emerald-200",
        variant === "secondary" && "border border-white/10 bg-white/8 text-white hover:bg-white/12",
        variant === "ghost" && "text-slate-300 hover:text-white",
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <Panel className="p-5 text-center">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </Panel>
  );
}

export function FormField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-200">
      {label}
      {children}
    </label>
  );
}

export const inputClass =
  "min-h-12 rounded-lg border border-white/10 bg-white/[0.06] px-4 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300/60 focus:bg-white/[0.09]";

export const textareaClass =
  "min-h-28 rounded-lg border border-white/10 bg-white/[0.06] px-4 py-3 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300/60 focus:bg-white/[0.09]";
