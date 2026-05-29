import { redirect } from "next/navigation";
import { getMeAction } from "@/actions/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getMeAction();
  if (!user) redirect("/auth/login");

  return children;
}
