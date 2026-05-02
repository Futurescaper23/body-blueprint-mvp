import { ClipboardList, Dumbbell, UsersRound, Video } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ButtonLink, Panel, ScreenHeader } from "@/components/ui";
import { getTrainerDashboard } from "@/lib/queries";

export default async function TrainerDashboardPage() {
  const { trainer, clients, exercises, plans } = await getTrainerDashboard();
  const stats: Array<[string, number, LucideIcon]> = [
    ["Exercises", exercises.length, Dumbbell],
    ["Plans", plans.length, ClipboardList],
    ["Clients", clients.length, UsersRound],
    ["Videos", exercises.filter((exercise) => exercise.video_url).length, Video],
  ];

  return (
    <div className="pb-10">
      <ScreenHeader eyebrow={`Welcome ${trainer.full_name.split(" ")[0]}`} title="Dashboard" />
      <div className="grid gap-4 px-5">
        <div className="grid gap-3 sm:grid-cols-4">
          {stats.map(([label, value, Icon]) => (
            <Panel key={String(label)} className="p-5">
              <Icon className="h-6 w-6 text-emerald-300" aria-hidden />
              <p className="mt-4 text-3xl font-semibold text-white">{String(value)}</p>
              <p className="text-sm text-slate-400">{String(label)}</p>
            </Panel>
          ))}
        </div>
        <Panel className="p-5">
          <h2 className="text-xl font-semibold text-white">Quick actions</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <ButtonLink href="/trainer/exercises/new">New Exercise</ButtonLink>
            <ButtonLink href="/trainer/plans/new" variant="secondary">New Plan</ButtonLink>
            <ButtonLink href="/trainer/assignments" variant="secondary">Assign Plan</ButtonLink>
          </div>
        </Panel>
      </div>
    </div>
  );
}
