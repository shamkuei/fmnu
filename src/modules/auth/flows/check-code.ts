import z from "zod";
import { zPhoneNumber } from "@/lib/phone-zod";
import { checkCode } from "@/modules/verification/verification.service";
import { publicFlow } from "@/lib/flow/base";
import { validator } from "@/lib/flow/layers";

const CheckCodeInput = z.object({
	phone: zPhoneNumber,
	code: z.string().length(6),
});

export const checkCodeFlow = publicFlow()
	.layer(validator(CheckCodeInput))
	.build(async ({ input }) => {
		return checkCode(input.phone, input.code, "login");
	});
