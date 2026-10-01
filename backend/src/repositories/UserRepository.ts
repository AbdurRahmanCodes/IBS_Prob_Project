import { AppDataSource } from "../config/DataSource";
import { User } from "../entities/User";
import type { FindOptionsSelect } from "typeorm";

export const publicUserSelect: FindOptionsSelect<User> = {
  id: true,
  name: true,
  createdAt: true,
};

export class UserRepository {
  async findAll(): Promise<User[]> {
    return AppDataSource.getRepository(User).find({
      select: publicUserSelect,
      take: 100,
      order: { createdAt: "ASC" },
    });
  }
}
