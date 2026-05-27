import z from "zod";
import { publicFlow } from "@/lib/flow/base";
import { validator } from "@/lib/flow/layers";
import { zPhoneNumber } from "@/lib/phone-zod";
import {
  createVerificationRecord,
  sendVerificationSMS,
} from "@/modules/verification/verification.service";

const RequestOTPInput = z.object({
  phone: zPhoneNumber,
});

export const requestOtp = publicFlow()
  .layer(validator(RequestOTPInput))
  .build(async ({ input }) => {
    const { verification, isNew } = await createVerificationRecord(
      input.phone,
      "login",
    );

    if (isNew) {
      await sendVerificationSMS(input.phone, verification.code);
    }

    return {
      verificationId: verification.id,
      nextResend: verification.nextResend,
    };
  });
