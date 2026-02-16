import bcrypt from "bcryptjs";

const HASH_ROUNDS = 12;

export async function hashPassword(plainText: string) {
  return bcrypt.hash(plainText, HASH_ROUNDS);
}

export async function verifyPassword(plainText: string, hash: string) {
  return bcrypt.compare(plainText, hash);
}
