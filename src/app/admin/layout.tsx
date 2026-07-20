import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getMeAction } from "@/actions/auth";
import { ImpersonationBanner } from "@/components/admin/impersonation-banner";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getMeAction();
  if (!user) redirect("/auth/login");

  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";

  // Only push the real (non-impersonating) user through profile completion.
  if (
    !user.currentSession?.isImpersonating &&
    !user.firstName &&
    !pathname.includes("/complete-profile")
  ) {
    redirect("/admin/complete-profile");
  }

  const impersonating = user.currentSession?.isImpersonating
    ? {
        name: `${user.firstName} ${user.lastName}`.trim(),
        phone: user.phone,
      }
    : null;

  return (
    <>
      {impersonating && (
        <ImpersonationBanner
          name={impersonating.name}
          phone={impersonating.phone}
        />
      )}
      {children}
    </>
  );
}
