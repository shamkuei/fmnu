export const VerificationReasonsList = ["phoneVerification", "login"] as const;

export type VerificationReason = (typeof VerificationReasonsList)[number];
