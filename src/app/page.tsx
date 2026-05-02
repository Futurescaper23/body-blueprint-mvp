import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, PlayCircle, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ButtonLink } from "@/components/ui";

export default function Home() {
  const features: Array<[string, string, LucideIcon]> = [
    ["Consistent demos", "Every movement uses the same trainer voice and format.", PlayCircle],
    ["Clear guidance", "Sets, reps, rest, cues, and mistakes stay in one place.", CheckCircle2],
    ["Role-based", "Client, trainer, and admin flows are separated from day one.", ShieldCheck],
  ];

  return (
    <main className="min-h-screen bg-[#0b0f14]">
      <section className="relative min-h-[92vh] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1800&q=80"
          alt=""
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover opacity-42"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f14]/60 via-[#0b0f14]/72 to-[#0b0f14]" />
        <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <Link href="/" className="flex items-center gap-3 text-lg font-bold text-white">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-300 text-slate-950">
              BB
            </span>
            Body Blueprint
          </Link>
          <Link className="text-sm font-semibold text-slate-200" href="/auth/sign-in">
            Sign in
          </Link>
        </nav>
        <div className="relative z-10 mx-auto grid max-w-6xl gap-10 px-5 pb-14 pt-12 md:grid-cols-[1fr_390px] md:items-center md:pt-20">
          <div className="max-w-2xl">
            <div className="inline-flex min-h-9 items-center rounded-full border border-white/10 bg-white/10 px-3 text-sm font-semibold text-emerald-100">
              Trainer-led workout plans
            </div>
            <h1 className="mt-6 text-5xl font-semibold tracking-normal text-white sm:text-6xl">
              Body Blueprint
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-200">
              Short portrait demos, clear cues, and assigned sessions that feel simple to follow on the gym floor.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/auth/sign-up">
                Start MVP <ArrowRight className="h-4 w-4" aria-hidden />
              </ButtonLink>
              <ButtonLink href="/app" variant="secondary">
                View Demo
              </ButtonLink>
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-[#111821]/90 p-3 shadow-2xl shadow-black/40">
            <div className="overflow-hidden rounded-[1.5rem] bg-[#0b0f14]">
              <div className="aspect-[9/16] bg-[url('https://images.unsplash.com/photo-1534258936925-c58bed479fcb?auto=format&fit=crop&w=900&q=80')] bg-cover bg-center">
                <div className="flex h-full flex-col justify-end bg-gradient-to-t from-black via-black/20 to-transparent p-5">
                  <PlayCircle className="mb-4 h-12 w-12 text-white" aria-hidden />
                  <p className="text-sm font-semibold text-emerald-200">Today</p>
                  <h2 className="mt-1 text-2xl font-semibold text-white">Beginner Full Body</h2>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                    <span className="rounded-lg bg-white/12 p-3 text-slate-100">5 exercises</span>
                    <span className="rounded-lg bg-white/12 p-3 text-slate-100">35 minutes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-4 px-5 pb-16 sm:grid-cols-3">
        {features.map(([title, body, Icon]) => (
          <div key={String(title)} className="rounded-lg border border-white/10 bg-white/[0.06] p-5">
            <Icon className="h-6 w-6 text-emerald-300" aria-hidden />
            <h2 className="mt-4 text-lg font-semibold text-white">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
