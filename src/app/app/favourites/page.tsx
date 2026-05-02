import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { EmptyState, Panel, ScreenHeader } from "@/components/ui";
import { getFavouriteExercises } from "@/lib/queries";

export default async function FavouritesPage() {
  const favourites = await getFavouriteExercises();

  return (
    <>
      <ScreenHeader eyebrow="Saved" title="Favourites" />
      <div className="grid gap-3 px-5 pb-6">
        {favourites.length ? (
          favourites.map((exercise) => (
            <Panel key={exercise.id} className="p-4">
              <Link href={`/app/exercise/${exercise.id}`} className="grid grid-cols-[72px_1fr] gap-4">
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
                  <Image
                    src={exercise.thumbnail_url}
                    alt=""
                    fill
                    sizes="72px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <Heart className="h-5 w-5 fill-rose-300 text-rose-300" aria-hidden />
                  <h2 className="mt-2 truncate text-lg font-semibold text-white">{exercise.name}</h2>
                  <p className="mt-1 text-sm text-slate-400">{exercise.muscle_group}</p>
                </div>
              </Link>
            </Panel>
          ))
        ) : (
          <EmptyState title="No favourites yet" body="Save exercises from the exercise detail screen." />
        )}
      </div>
    </>
  );
}
