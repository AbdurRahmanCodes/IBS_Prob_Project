import { signAccessToken } from "../auth/jwt";
import { hashPassword, verifyPassword } from "../auth/password";
import { badInput, unauthenticated } from "../auth/errors";
import { User } from "../entities/User";
import { UserRepository } from "../repositories/UserRepository";
import { QueryFailedError } from "typeorm";

const dummyPasswordHash = "$2b$12$I8uZdzOd8gXhXBDiXzwqr.LPaalfXx8uEYSyTARWywcNI.7zbTuDu";

export type AuthResult = {
  token: string;
  user: User;
};

export class AuthService {
  constructor(private readonly users = new UserRepository()) {}

  async register(email: string, name: string, password: string): Promise<AuthResult> {
    const normalizedEmail = this.normalizeEmail(email);
    const normalizedName = name.trim();

    this.validateCredentials(normalizedEmail, normalizedName, password);

    if (await this.users.findByEmail(normalizedEmail)) {
      throw badInput("Email already registered");
    }

    let user: User;

    try {
      user = await this.users.create(normalizedEmail, normalizedName, await hashPassword(password));
    } catch (error) {
      if (error instanceof QueryFailedError && error.driverError?.code === "23505") {
        throw badInput("Email already registered");
      }

      throw error;
    }

    return { token: signAccessToken(user.id), user };
  }

  async login(email: string, password: string): Promise<AuthResult> {
    const user = await this.users.findByEmail(this.normalizeEmail(email));
    const passwordHash = user?.passwordHash ?? dummyPasswordHash;
    const passwordMatches = await verifyPassword(password, passwordHash);

    if (!user || !passwordMatches) {
      throw unauthenticated("Invalid email or password");
    }

    return { token: signAccessToken(user.id), user };
  }

  findCurrentUser(userId: string): Promise<User | null> {
    return this.users.findById(userId);
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private validateCredentials(email: string, name: string, password: string): void {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordByteLength = Buffer.byteLength(password, "utf8");

    if (
      !email ||
      email.length > 254 ||
      !emailPattern.test(email) ||
      !name ||
      name.length > 100 ||
      password.length < 8 ||
      passwordByteLength > 72
    ) {
      throw badInput(
        "Use a valid email, a name up to 100 characters, and a password between 8 and 72 bytes",
      );
    }
  }
}
