import Link from "next/link";
import { chooseDemoPersona, signIn, signUp } from "@/lib/actions";
import { ButtonLink, FormField, inputClass } from "@/components/ui";

export function AuthForm({
  mode,
  message,
}: {
  mode: "sign-in" | "sign-up";
  message?: string;
}) {
  const isSignUp = mode === "sign-up";

  return (
    <div className="grid gap-4">
      {!isSignUp ? (
        <div className="grid gap-3 rounded-lg border border-emerald-300/20 bg-emerald-300/10 p-3">
          <p className="text-sm font-semibold text-emerald-100">Fast demo login</p>
          <div className="grid grid-cols-3 gap-2">
            <form action={chooseDemoPersona}>
              <input type="hidden" name="persona" value="client-phil" />
              <button className="min-h-11 w-full rounded-lg bg-emerald-300 px-3 text-sm font-bold text-slate-950">
                Phil
              </button>
            </form>
            <form action={chooseDemoPersona}>
              <input type="hidden" name="persona" value="trainer-lisa" />
              <button className="min-h-11 w-full rounded-lg border border-white/10 bg-white/10 px-3 text-sm font-bold text-white">
                Lisa
              </button>
            </form>
            <form action={chooseDemoPersona}>
              <input type="hidden" name="persona" value="client-guest" />
              <button className="min-h-11 w-full rounded-lg border border-white/10 bg-white/10 px-3 text-sm font-bold text-white">
                Guest
              </button>
            </form>
          </div>
          <p className="text-xs leading-5 text-emerald-100/80">
            Demo passwords for real auth later: Phil `phil1234`, Lisa `lisa1234`, Guest `guest1234`.
          </p>
        </div>
      ) : null}
      <form action={isSignUp ? signUp : signIn} className="grid gap-4">
      {message ? (
        <div className="rounded-lg border border-amber-300/20 bg-amber-300/10 p-3 text-sm leading-6 text-amber-100">
          {message}
        </div>
      ) : null}
      {isSignUp ? (
        <FormField label="Full name">
          <input className={inputClass} name="full_name" minLength={2} required placeholder="Amelia Hart" />
        </FormField>
      ) : null}
      <FormField label="Email">
        <input className={inputClass} name="email" type="email" required placeholder="you@example.com" />
      </FormField>
      <FormField label="Password">
        <input className={inputClass} name="password" type="password" minLength={8} required placeholder="At least 8 characters" />
      </FormField>
      {isSignUp ? (
        <FormField label="Account type">
          <select className={inputClass} name="role" defaultValue="client">
            <option className="bg-slate-950" value="client">Client</option>
            <option className="bg-slate-950" value="trainer">Trainer</option>
          </select>
        </FormField>
      ) : null}
      <button className="min-h-12 rounded-lg bg-emerald-300 px-5 text-sm font-bold text-slate-950 transition hover:bg-emerald-200">
        {isSignUp ? "Create Account" : "Sign In"}
      </button>
      <div className="flex items-center justify-between gap-3 text-sm text-slate-400">
        <span>{isSignUp ? "Already registered?" : "New here?"}</span>
        {isSignUp ? (
          <Link className="font-semibold text-white" href="/auth/sign-in">Sign in</Link>
        ) : (
          <Link className="font-semibold text-white" href="/auth/sign-up">Create account</Link>
        )}
      </div>
      {!isSignUp ? <ButtonLink href="/app" variant="secondary">Continue Demo</ButtonLink> : null}
      </form>
    </div>
  );
}
