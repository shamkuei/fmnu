import type { $, Kind } from "hkt-toolbelt";
import type { Identity } from "hkt-toolbelt/function.js";
import z from "zod";
import { BadRequestException, ForbiddenException, UnauthorizedException } from "@/lib/errors";
import type { UserWithRoles, UserWithRolesOptional } from "@/modules/auth/complete-user.type";
import type { Layer } from "./core";

export function validator<T extends z.ZodType>(
	schema: T,
): Layer<{ rawInput: z.input<T> }, { input: z.output<T> }, Identity> {
	return async (ctx, next) => {
		const { success, data, error } = await schema.safeParseAsync(ctx.rawInput);
		if (!success) {
			throw new BadRequestException(error.issues[0].message).addMeta(
				z.treeifyError(error),
			);
		}
		return await next({ input: data });
	};
}

export function authorize<U extends UserWithRoles>(
	check?: (currentUser: UserWithRoles, ctx: any) => currentUser is U,
): Layer<
	{ currentUser: UserWithRolesOptional },
	{ authorizedUser: U },
	Identity
> {
	return (ctx, next) => {
		if (!ctx.currentUser) {
			throw new UnauthorizedException("UNAUTHORIZED");
		}
		if (check) {
			const checkResult = check(ctx.currentUser, ctx);
			if (!checkResult) {
				throw new ForbiddenException("ACCESS_DENIED");
			}
		}
		return next({ authorizedUser: ctx.currentUser as U });
	};
}

export type HigherKindedError<E> = { readonly __error: E };
type Assert<T, E> = [T] extends [never] ? HigherKindedError<E> : T;
export type AssertCast<T, U, E> = [T] extends [U] ? T : Assert<never, E>;

export type Paginated<T> = {
	pageInfo: { hasNextPage: boolean; hasPreviousPage: boolean; startCursor: string | null; endCursor: string | null };
	edges: readonly {
		cursor: string;
		node: T;
	}[];
};

export interface CursorBasedPaginationHKT extends Kind.Kind {
	f(
		x: this[Kind._],
	): typeof x extends unknown[]
		? Paginated<(typeof x)[number]>
		: HigherKindedError<"Pagination should respond with arrays">;
}

export function cursorPaginate<T>(
	toCursor: (data: T, ctx: any) => string,
): Layer<
	{ rawPaginationInput: { first?: number | null; after?: string | null; last?: number | null; before?: string | null } },
	{ paginationInput: { first?: number; after?: string; last?: number; before?: string; isForward: boolean; isBackward: boolean } },
	CursorBasedPaginationHKT
> {
	return async (ctx, next) => {
		const { first, after, last, before } = ctx.rawPaginationInput;
		const isForward = first != null || after != null;
		const isBackward = last != null || before != null;
		const paginationInput = { first: first ?? undefined, after: after ?? undefined, last: last ?? undefined, before: before ?? undefined, isForward, isBackward };

		const items = await next({ paginationInput }) as unknown as T[];
		const edges = items.map(item => ({ cursor: toCursor(item, ctx), node: item }));
		const hasNextPage = isForward ? edges.length === (first ?? 0) : false;
		const hasPreviousPage = isBackward ? edges.length === (last ?? 0) : false;

		return {
			pageInfo: {
				hasNextPage,
				hasPreviousPage,
				startCursor: edges[0]?.cursor ?? null,
				endCursor: edges[edges.length - 1]?.cursor ?? null,
			},
			edges,
		} as any;
	};
}
