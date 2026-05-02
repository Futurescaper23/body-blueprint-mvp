import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { RequestExercise } from "@/components/client/request-exercise";
import { Badge, EmptyState, ScreenHeader } from "@/components/ui";
import { getExerciseLibrary } from "@/lib/queries";

const groups = ["All", "Quads", "Chest", "Back", "Hamstrings", "Core", "Calves"];

export default async function ExerciseLibraryPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; group?: string }>;
}) {
  const params = await searchParams;
  const query = params?.q?.toLowerCase().trim() ?? "";
  const group = params?.group ?? "All";
  const exercises = await getExerciseLibrary();
  const filtered = exercises.filter((exercise) => {
    const matchesQuery =
      !query ||
      exercise.name.toLowerCase().includes(query) ||
      exercise.muscle_group.toLowerCase().includes(query) ||
      exercise.equipment.toLowerCase().includes(query);
    const matchesGroup = group === "All" || exercise.muscle_group.toLowerCase().includes(group.toLowerCase());
    return matchesQuery && matchesGroup;
  });

  return (
    <>
      <ScreenHeader eyebrow="Browse" title="Exercise Library" />
      <div className="grid gap-4 px-5 pb-6">
        <form className="grid gap-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" aria-hidden />
            <input
              className="min-h-12 w-full rounded-lg border border-white/10 bg-white/[0.06] pl-12 pr-4 text-base text-white outline-none placeholder:text-slate-500 focus:border-emerald-300/60"
              name="q"
              defaultValue={params?.q}
              placeholder="Search movement, muscle, kit"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {groups.map((item) => (
              <Link
                key={item}
                href={`/app/library?group=${encodeURIComponent(item)}${query ? `&q=${encodeURIComponent(query)}` : ""}`}
                className={`inline-flex min-h-10 shrink-0 items-center rounded-full px-4 text-sm font-semibold ${
                  item === group ? "bg-emerald-300 text-slate-950" : "bg-white/10 text-slate-200"
                }`}
              >
                {item}
              </Link>
            ))}
          </div>
        </form>
        <RequestExercise />
        <div className="grid gap-3">
          {filtered.length ? (
            filtered.map((exercise) => (
              <Link key={exercise.id} href={`/app/exercise/${exercise.id}`} className="grid grid-cols-[88px_1fr] gap-4 rounded-lg border border-white/10 bg-white/[0.06] p-3">
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-slate-900">
                  <Image src={exercise.thumbnail_url} alt="" fill sizes="88px" className="object-cover" />
                </div>
                <div className="min-w-0 py-1">
                  <div className="flex flex-wrap gap-2">
                    <Badge tone="green">{exercise.difficulty}</Badge>
                    <Badge>{exercise.equipment}</Badge>
                  </div>
                  <h2 className="mt-3 truncate text-lg font-semibold text-white">{exercise.name}</h2>
                  <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-400">{exercise.muscle_group}</p>
                </div>
              </Link>
            ))
          ) : (
            <EmptyState title="No match yet" body="Try another search, or request the movement and add the real video later." />
          )}
        </div>
      </div>
    </>
  );
}
