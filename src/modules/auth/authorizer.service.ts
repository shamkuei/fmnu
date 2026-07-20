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
      effectiveUser: {
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

  // If this session is impersonating, the effective user is the impersonated
  // user (so the admin sees exactly that user's access); userId/realUserId still
  // identifies the real (superadmin) session owner for gating + switch-back.
  const impersonatingUser = session.impersonatedUserId
    ? session.effectiveUser
    : null;

  if (impersonatingUser) {
    return {
      ...session,
      user: impersonatingUser,
      isImpersonating: true,
      realUserId: session.userId,
    };
  }

  return {
    ...session,
    isImpersonating: false,
    realUserId: session.userId,
  };
}
