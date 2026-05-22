import { db } from "@/db/index";
import { UnauthorizedException } from "@/lib/errors";
import { userRolesWith } from "@/modules/users/users.service";

export async function getSessionFromSessionId(sessionId?: string) {
	if (!sessionId) {
		return null;
	}

	const session = await db.query.sessions.findFirst({
		where: { id: sessionId },
		with: {
			user: {
				with: userRolesWith,
			},
		},
	});

	if (
		!session ||
		session.revokedAt ||
		(session.expireAt && session.expireAt <= new Date())
	) {
		throw new UnauthorizedException("INVALID_SESSION");
	}

	return session;
}
