import z from "zod";
import { publicFlow } from "@/lib/flow/base";
import { validator } from "@/lib/flow/layers";
import { zPhoneNumber } from "@/lib/phone-zod";
import { checkCode } from "@/modules/verification/verification.service";

const CheckCodeInput = z.object({
  phone: zPhoneNumber,
  code: z.string().length(6),
});

export const checkCodeFlow = publicFlow()
  .layer(validator(CheckCodeInput))
  .build(async ({ input }) => {
    return checkCode(input.phone, input.code, "login");
  });
