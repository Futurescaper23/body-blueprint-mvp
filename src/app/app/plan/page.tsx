import { redirect } from "next/navigation";
import { getClientPlan } from "@/lib/queries";

export default async function MyPlanIndexPage() {
  const plan = await getClientPlan();
  if (plan) redirect(`/app/plan/${plan.id}`);
  redirect("/app");
}
