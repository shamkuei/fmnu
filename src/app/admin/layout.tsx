import { redirect } from "next/navigation";
import { getMeAction } from "@/actions/auth";
import { headers } from "next/headers";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getMeAction();
  if (!user) redirect("/auth/login");

  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";

  if (!user.firstName && !pathname.includes("/complete-profile")) {
    redirect("/admin/complete-profile");
  }

  return children;
}
