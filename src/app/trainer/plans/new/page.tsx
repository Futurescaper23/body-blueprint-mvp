import { PlanForm } from "@/components/forms/plan-form";
import { Panel, ScreenHeader } from "@/components/ui";

export default function NewPlanPage() {
  return (
    <div className="pb-10">
      <ScreenHeader eyebrow="Builder" title="New Plan" />
      <div className="px-5">
        <Panel className="p-5">
          <PlanForm />
        </Panel>
      </div>
    </div>
  );
}
