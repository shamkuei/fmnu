import Link from "next/link";
import { notFound } from "next/navigation";
import { getMeAction } from "@/actions/auth";
import { listUsersAction } from "@/actions/users";
import { UsersManager } from "@/components/admin/users-manager";
import { isPlatformAdmin } from "@/modules/users/users.service";

export default async function AdminUsersPage() {
  const user = await getMeAction();
  if (!user || !isPlatformAdmin(user)) notFound();

  const users = await listUsersAction();

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <Link
          href="/admin"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          → بازگشت به داشبورد
        </Link>
      </div>
      <UsersManager users={users} currentUserId={user.id} />
    </main>
  );
}
