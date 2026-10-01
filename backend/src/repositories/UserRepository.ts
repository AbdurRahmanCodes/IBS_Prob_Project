import { AppDataSource } from "../config/DataSource";
import { User } from "../entities/User";
import type { FindOptionsSelect } from "typeorm";

export const publicUserSelect: FindOptionsSelect<User> = {
  id: true,
  name: true,
  createdAt: true,
};

export class UserRepository {
  private repository = AppDataSource.getRepository(User);

  async findAll(): Promise<User[]> {
    return this.repository.find({
      select: publicUserSelect,
      take: 100,
      order: { createdAt: "ASC" },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.repository.findOne({
      select: publicUserSelect,
      where: { id },
    });
  }

  async create(email: string, name: string, passwordHash: string): Promise<User> {
    const user = this.repository.create({ email, name, passwordHash });
    return this.repository.save(user);
  }
}
