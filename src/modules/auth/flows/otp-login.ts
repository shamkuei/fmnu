import z from "zod";
import { zPhoneNumber } from "@/lib/phone-zod";
import { UnauthorizedException } from "@/lib/errors";
import { consumeCode } from "@/modules/verification/verification.service";
import { findOrCreateByPhone } from "@/modules/users/users.service";
import { loginUser } from "@/modules/auth/auth.service";
import { publicFlow } from "@/lib/flow/base";
import { validator } from "@/lib/flow/layers";

const OTPLoginInput = z.object({
	phone: zPhoneNumber,
	code: z.string().length(6),
});

export const otpLogin = publicFlow()
	.layer(validator(OTPLoginInput))
	.build(async ({ input }) => {
		const record = await consumeCode(input.phone, input.code, "login");

		if (!record) {
			throw new UnauthorizedException("INVALID_CODE");
		}

		const user = await findOrCreateByPhone(input.phone);
		return loginUser(user);
	});
