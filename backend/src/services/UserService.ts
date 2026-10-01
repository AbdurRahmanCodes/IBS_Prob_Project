import { User } from "../entities/User";
import { UserRepository } from "../repositories/UserRepository";

export class UserService {
  constructor(private readonly repository = new UserRepository()) {}

  async listUsers(): Promise<User[]> {
    return this.repository.findAll();
  }
}
