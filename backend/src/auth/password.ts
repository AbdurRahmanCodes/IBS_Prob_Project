import { compare, hash } from "bcryptjs";

const passwordRounds = 12;

export function hashPassword(password: string): Promise<string> {
  return hash(password, passwordRounds);
}

export function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  return compare(password, passwordHash);
}
