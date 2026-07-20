import { argon2id, hash, type Options, verify } from "argon2";

// argon2id with sane defaults (≈64 MiB memory, time cost 3, parallelism 1).
// The cost also acts as a mild per-request brake against online brute force.
const HASH_OPTIONS: Options = { type: argon2id };

export function hashPassword(plain: string): Promise<string> {
  return hash(plain, HASH_OPTIONS);
}

export function verifyPassword(
  plain: string,
  digest: string,
): Promise<boolean> {
  return verify(digest, plain);
}
