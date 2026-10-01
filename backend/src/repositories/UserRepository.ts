import { User } from "../entities/User";
import { AppDataSource } from "../config/DataSource";

export class UserRepository {
  async findAll(): Promise<User[]> {
    return AppDataSource.getRepository(User).find({
      select: { id: true, email: true, name: true, createdAt: true },
      order: { createdAt: "ASC" },
    });
  }
}
