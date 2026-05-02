import Link from "next/link";
import { AuthForm } from "@/components/forms/auth-form";
import { Panel } from "@/components/ui";

export default async function SignUpPage({
  searchParams,
}: {
  searchParams?: Promise<{ message?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="grid min-h-screen place-items-center px-5 py-10">
      <div className="w-full max-w-md">
        <Link href="/" className="text-sm font-semibold text-emerald-200">
          Body Blueprint
        </Link>
        <h1 className="mt-4 text-4xl font-semibold text-white">Create account</h1>
        <Panel className="mt-6 p-5">
          <AuthForm mode="sign-up" message={params?.message} />
        </Panel>
      </div>
    </main>
  );
}
