import z from "zod";
import { UnauthorizedException } from "@/lib/errors";
import { publicFlow } from "@/lib/flow/base";
import { validator } from "@/lib/flow/layers";
import { zPhoneNumber } from "@/lib/phone-zod";
import { loginUser } from "@/modules/auth/auth.service";
import { verifyPassword } from "@/modules/auth/password.service";
import { getFullUserByPhone } from "@/modules/users/users.service";

const PasswordLoginInput = z.object({
  phone: zPhoneNumber,
  password: z.string().min(1),
});

export const passwordLogin = publicFlow()
  .layer(validator(PasswordLoginInput))
  .build(async ({ input }) => {
    // Same generic error for "no such user", "OTP-only user (no password)", and
    // "wrong password" — no user enumeration.
    const user = await getFullUserByPhone(input.phone);
    if (!user) throw new UnauthorizedException("INVALID_CREDENTIALS");
    if (
      !user.passwordHash ||
      !(await verifyPassword(input.password, user.passwordHash))
    ) {
      throw new UnauthorizedException("INVALID_CREDENTIALS");
    }

    return loginUser(user);
  });
