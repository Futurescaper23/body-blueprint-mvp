import Link from "next/link";
import { Badge, Panel, ScreenHeader } from "@/components/ui";
import { getAdminDashboard } from "@/lib/queries";

export default async function AdminPage() {
  const { profiles, plans, exercises, workoutLogs } = await getAdminDashboard();

  return (
    <main className="mx-auto min-h-screen max-w-6xl pb-10">
      <header className="flex items-center justify-between px-5 py-5">
        <Link href="/" className="text-lg font-bold text-white">Body Blueprint</Link>
        <Link href="/trainer" className="text-sm font-semibold text-slate-300">Trainer</Link>
      </header>
      <ScreenHeader eyebrow="Admin" title="Users & Roles" />
      <div className="grid gap-4 px-5">
        <div className="grid gap-3 sm:grid-cols-3">
          <Panel className="p-5"><p className="text-3xl font-semibold">{profiles.length}</p><p className="text-sm text-slate-400">Users</p></Panel>
          <Panel className="p-5"><p className="text-3xl font-semibold">{plans.length}</p><p className="text-sm text-slate-400">Plans</p></Panel>
          <Panel className="p-5"><p className="text-3xl font-semibold">{workoutLogs.length}</p><p className="text-sm text-slate-400">Logs</p></Panel>
        </div>
        <Panel className="overflow-hidden">
          <div className="grid gap-px bg-white/10">
            {profiles.map((profile) => (
              <div key={profile.id} className="grid gap-2 bg-[#0f151d] p-4 sm:grid-cols-[1fr_160px_180px] sm:items-center">
                <div>
                  <p className="font-semibold text-white">{profile.full_name}</p>
                  <p className="text-sm text-slate-400">{profile.email}</p>
                </div>
                <Badge tone={profile.role === "trainer" ? "green" : profile.role === "admin" ? "blue" : "default"}>
                  {profile.role}
                </Badge>
                <p className="text-sm text-slate-400">{new Date(profile.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </Panel>
        <Panel className="p-5">
          <h2 className="text-xl font-semibold text-white">Records</h2>
          <p className="mt-2 text-sm text-slate-400">{exercises.length} exercises are available in the library.</p>
        </Panel>
      </div>
    </main>
  );
}
