import type { Identity } from "hkt-toolbelt/function.js";
import type { UserWithRoles } from "@/modules/auth/complete-user.type";
import { Flow } from "./core";
import { authorize } from "./layers";

export function publicFlow<T extends Record<string, any> = {}>(): Flow<
	T,
	T,
	Identity
> {
	return new Flow([]);
}

export function defaultFlow<U extends UserWithRoles>(
	check?: (u: UserWithRoles, ctx: any) => u is U,
) {
	return publicFlow().layer(authorize(check));
}
