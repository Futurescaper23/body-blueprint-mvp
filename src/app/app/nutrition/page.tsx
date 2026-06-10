import { NutritionTracker } from "@/components/client/nutrition-tracker";
import { ScreenHeader } from "@/components/ui";

export default function NutritionPage() {
  return (
    <>
      <ScreenHeader eyebrow="Fuel" title="Nutrition" />
      <div className="px-5 pb-6">
        <NutritionTracker />
      </div>
    </>
  );
}
