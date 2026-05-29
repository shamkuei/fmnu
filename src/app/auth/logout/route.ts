import { logoutAction } from "@/actions/auth";
import { redirect } from "next/navigation";

export async function POST() {
  await logoutAction();
  redirect("/");
}
