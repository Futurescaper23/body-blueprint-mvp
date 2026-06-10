import { signOut } from "@/lib/actions";
import { getClientDashboard } from "@/lib/queries";
import { Badge, ButtonLink, Panel, ScreenHeader } from "@/components/ui";
import { initials } from "@/lib/utils";

export default async function ProfilePage() {
  const { viewer, activePlan } = await getClientDashboard();

  return (
    <>
      <ScreenHeader eyebrow="Account" title="Profile" />
      <div className="grid gap-4 px-5 pb-6">
        <Panel className="p-5">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-emerald-300 text-xl font-bold text-slate-950">
              {initials(viewer.full_name)}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">{viewer.full_name}</h2>
              <p className="text-sm text-slate-400">{viewer.email}</p>
            </div>
          </div>
          <div className="mt-5 flex gap-2">
            <Badge tone="green">{viewer.role}</Badge>
            {activePlan ? <Badge>{activePlan.title}</Badge> : null}
          </div>
        </Panel>
        <Panel className="p-5">
          <h2 className="text-lg font-semibold text-white">Preferences</h2>
          <div className="mt-4 grid gap-3 text-sm text-slate-300">
            <div className="flex min-h-12 items-center justify-between rounded-lg bg-white/[0.05] px-3">
              <span>Portrait video</span>
              <span className="font-semibold text-emerald-200">Default</span>
            </div>
            <div className="flex min-h-12 items-center justify-between rounded-lg bg-white/[0.05] px-3">
              <span>Theme</span>
              <span className="font-semibold text-emerald-200">Dark</span>
            </div>
          </div>
        </Panel>
        <Panel className="p-5">
          <h2 className="text-lg font-semibold text-white">Quick links</h2>
          <div className="mt-4 grid gap-3">
            <ButtonLink href="/app/nutrition" variant="secondary">Nutrition</ButtonLink>
            <ButtonLink href="/app/library" variant="secondary">Exercise Library</ButtonLink>
            <ButtonLink href="/app/plan" variant="secondary">My Plans</ButtonLink>
            <ButtonLink href="/app/routines" variant="secondary">My Sessions</ButtonLink>
            <ButtonLink href="/app/favourites" variant="secondary">Favourites</ButtonLink>
          </div>
        </Panel>
        <form action={signOut}>
          <button className="min-h-12 w-full rounded-lg border border-white/10 bg-white/[0.06] px-5 text-sm font-bold text-white transition hover:bg-white/10">
            Sign Out
          </button>
        </form>
      </div>
    </>
  );
}
