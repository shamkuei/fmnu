import parsePhoneNumber from "libphonenumber-js";
import { z } from "zod";

export const zPhoneNumber = z.string().transform((value, ctx) => {
	const phoneNumber = parsePhoneNumber(value, {
		defaultCountry: "IR",
	});

	if (!phoneNumber?.isValid()) {
		ctx.addIssue({
			code: "custom",
			message: "Invalid phone number",
		});
		return z.NEVER;
	}

	return phoneNumber.formatInternational().replace(/\s/g, "");
});
