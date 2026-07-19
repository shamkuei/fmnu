import { redirect } from "next/navigation";
import { logoutAction } from "@/actions/auth";

export async function POST() {
  await logoutAction();
  redirect("/");
}
