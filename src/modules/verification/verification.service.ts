import { randomInt } from "node:crypto";
import { and, count, eq, gt, isNull } from "drizzle-orm";
import { db } from "@/db/index";
import { verifications } from "@/db/schema";
import { TooManyRequestsException } from "@/lib/errors";
import { sendSMS } from "@/modules/phone/sender.service";
import type { VerificationReason } from "./reasons";

const MAX_RESEND_COUNT = 5;
const MAX_DAILY_VERIFICATIONS = 10;

export function generateCode() {
  return randomInt(100000, 1000000).toString();
}

function activeVerificationWhere(
  phone: string,
  reason: VerificationReason,
  code?: string,
) {
  const conditions = [
    eq(verifications.phone, phone),
    eq(verifications.reason, reason),
    isNull(verifications.usedAt),
    gt(verifications.expireAt, new Date()),
  ];
  if (code) conditions.push(eq(verifications.code, code));
  return and(...conditions);
}

export async function createVerificationRecord(
  phone: string,
  reason: VerificationReason,
) {
  const rows = await db
    .select()
    .from(verifications)
    .where(activeVerificationWhere(phone, reason))
    .limit(1);

  const existingVerificationRecord = rows[0];

  if (existingVerificationRecord) {
    if (existingVerificationRecord.resendCount >= MAX_RESEND_COUNT) {
      throw new TooManyRequestsException(
        "تعداد درخواست‌های مجاز به پایان رسیده است",
      );
    }
    return { verification: existingVerificationRecord, isNew: false };
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const [dailyRow] = await db
    .select({ count: count() })
    .from(verifications)
    .where(
      and(
        eq(verifications.phone, phone),
        eq(verifications.reason, reason),
        gt(verifications.createdAt, todayStart),
      ),
    );
  if (dailyRow.count >= MAX_DAILY_VERIFICATIONS) {
    throw new TooManyRequestsException(
      "تعداد درخواست‌های روزانه به پایان رسیده است",
    );
  }

  const code = generateCode();
  const [verification] = await db
    .insert(verifications)
    .values({
      code,
      reason,
      phone,
      expireAt: getExpirationTime(reason),
      nextResend: getNextResendTime(0),
    })
    .returning();

  return { verification, isNew: true };
}

export async function sendVerificationSMS(phone: string, code: string) {
  await sendSMS({ to: phone, text: code });
}

export async function checkCode(
  phone: string,
  code: string,
  reason: VerificationReason,
) {
  const rows = await db
    .select()
    .from(verifications)
    .where(activeVerificationWhere(phone, reason, code))
    .limit(1);

  const record = rows[0];
  if (!record) {
    return { valid: false as const };
  }

  return { valid: true as const, verificationId: record.id };
}

export async function consumeCode(
  phone: string,
  code: string,
  reason: VerificationReason,
) {
  const rows = await db
    .select()
    .from(verifications)
    .where(activeVerificationWhere(phone, reason, code))
    .limit(1);

  const record = rows[0];
  if (!record) {
    return null;
  }

  await db
    .update(verifications)
    .set({ usedAt: new Date() })
    .where(eq(verifications.id, record.id));

  return record;
}

export async function resendCode(verificationId: string) {
  const rows = await db
    .select()
    .from(verifications)
    .where(eq(verifications.id, verificationId))
    .limit(1);

  const record = rows[0];
  if (!record) return null;
  if (!record.phone) return null;
  if (record.usedAt) return null;
  if (record.nextResend > new Date()) return null;
  if (record.resendCount >= MAX_RESEND_COUNT) {
    throw new TooManyRequestsException(
      "تعداد درخواست‌های مجاز به پایان رسیده است",
    );
  }

  const newCode = generateCode();
  await db
    .update(verifications)
    .set({
      code: newCode,
      resendCount: record.resendCount + 1,
      nextResend: getNextResendTime(record.resendCount + 1),
    })
    .where(eq(verifications.id, verificationId));

  await sendVerificationSMS(record.phone, newCode);

  return { nextResend: getNextResendTime(record.resendCount + 1) };
}

export function getNextResendTime(resends: number) {
  return new Date(Date.now() + (resends + 1) * 120 * 1000);
}

export function getExpirationTime(reason: VerificationReason) {
  const expirationDelays: Record<VerificationReason, number> = {
    login: 3 * 60 * 1000,
    phoneVerification: 24 * 60 * 60 * 1000,
  };
  return new Date(Date.now() + expirationDelays[reason]);
}
