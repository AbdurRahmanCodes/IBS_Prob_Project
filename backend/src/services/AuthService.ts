import { signAccessToken } from "../auth/jwt";
import { hashPassword, verifyPassword } from "../auth/password";
import { badInput, unauthenticated } from "../auth/errors";
import { User } from "../entities/User";
import { UserRepository } from "../repositories/UserRepository";

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

    const user = await this.users.create(
      normalizedEmail,
      normalizedName,
      await hashPassword(password),
    );

    return { token: signAccessToken(user.id), user };
  }

  async login(email: string, password: string): Promise<AuthResult> {
    const user = await this.users.findByEmail(this.normalizeEmail(email));

    if (!user || !(await verifyPassword(password, user.passwordHash))) {
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
    if (!email || !name || password.length < 8) {
      throw badInput("Email, name, and a password of at least 8 characters are required");
    }
  }
}
